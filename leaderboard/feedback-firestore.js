import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    getCountFromServer,
    query,
    orderBy,
    limit,
    startAfter,
    endBefore,
    limitToLast,
    onSnapshot,
    updateDoc,
    doc,
    increment,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================================
   Collection
========================================== */

const COLLECTION = "feedback";
const REPLY_COLLECTION = "feedbackReplies";
/* ==========================================
   Limits
========================================== */

const LIMITS = {

    name: 60,

    title: 80,

    message: 1000

};

export const PAGE_SIZE = 10;

/* =========================================================
   Pagination State
========================================================= */

let feedbackCache = [];

let firstVisible = null;

let lastVisible = null;

let currentPage = 1;

let totalRecords = 0;

let hasNextPage = false;

let hasPreviousPage = false;

/* =========================================================
   Firestore Listener
========================================================= */

let feedbackListener = null;

/* ==========================================
   Reply Listener
========================================== */

let replyListener = null;

/* ==========================================
   Reply Cache
========================================== */

let currentReplies = [];

/* ==========================================
   Cache
========================================== */

let cacheValid = false;

/* ==========================================
   Query Builder
========================================== */

function baseQuery() {

    return query(

        collection(
            db,
            COLLECTION
        ),

        orderBy(
            "createdAt",
            "desc"
        )

    );

}

/* ==========================================
   Total Records
========================================== */

export async function loadTotalRecordCount() {

    const snapshot =

        await getCountFromServer(

            collection(
                db,
                COLLECTION
            )

        );

    totalRecords =

        snapshot.data().count;

    return totalRecords;

}

/* ==========================================
   Invalidate Cache
========================================== */

export function invalidateCache() {

    cacheValid = false;

}

/* ==========================================
   Load First Page
========================================== */

export async function loadFirstPage() {

    const q = query(

        baseQuery(),

        limit(PAGE_SIZE)

    );

    const snapshot =
        await getDocs(q);

    feedbackCache = [];

    snapshot.forEach(doc => {

        feedbackCache.push({

            id: doc.id,

            ...doc.data()

        });

    });

    firstVisible =
        snapshot.docs[0] || null;

    lastVisible =
        snapshot.docs[
            snapshot.docs.length - 1
        ] || null;

    currentPage = 1;

    hasPreviousPage = false;

    hasNextPage =
        snapshot.size === PAGE_SIZE;

    cacheValid = true;

    return feedbackCache;

}

/* ==========================================
   Load Next Page
========================================== */

export async function loadNextPage() {

    if (!lastVisible)
        return feedbackCache;

    const q = query(

        baseQuery(),

        startAfter(lastVisible),

        limit(PAGE_SIZE)

    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty)
        return feedbackCache;

    feedbackCache = [];

    snapshot.forEach(doc => {

        feedbackCache.push({

            id: doc.id,

            ...doc.data()

        });

    });

    firstVisible =
        snapshot.docs[0] || null;

    lastVisible =
        snapshot.docs[
            snapshot.docs.length - 1
        ] || null;

    currentPage++;

    hasPreviousPage = true;

    hasNextPage =
        snapshot.size === PAGE_SIZE;

    return feedbackCache;

}

/* ==========================================
   Load Previous Page
========================================== */

export async function loadPreviousPage() {

    if (!firstVisible)
        return feedbackCache;

    const q = query(

        baseQuery(),

        endBefore(firstVisible),

        limitToLast(PAGE_SIZE)

    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty)
        return feedbackCache;

    feedbackCache = [];

    snapshot.forEach(doc => {

        feedbackCache.push({

            id: doc.id,

            ...doc.data()

        });

    });

    firstVisible =
        snapshot.docs[0] || null;

    lastVisible =
        snapshot.docs[
            snapshot.docs.length - 1
        ] || null;

    if (currentPage > 1)
        currentPage--;

    hasPreviousPage =
        currentPage > 1;

    hasNextPage = true;

    return feedbackCache;

}

/* ==========================================
   Start Live Listener
========================================== */

export function startListener(onChange = null) {

    stopListener();

    feedbackListener = onSnapshot(

        query(

            collection(db, COLLECTION),

            orderBy(
                "createdAt",
                "desc"
            ),

            limit(PAGE_SIZE)

        ),

        snapshot => {

            cacheValid = false;

            if (typeof onChange === "function") {

                onChange(snapshot);

            }

        },

        error => {

            console.error(

                "Feedback Listener Error",

                error

            );

        }

    );

}

/* ==========================================
   Stop Live Listener
========================================== */

export function stopListener() {

    if (feedbackListener) {

        feedbackListener();

        feedbackListener = null;

    }

}

/* ==========================================
   Refresh Current Page
========================================== */

export async function refreshPage() {

    cacheValid = false;

    return await loadFirstPage();

}

/* ==========================================
   Clear Cache
========================================== */

export function clearCache() {

    feedbackCache = [];

    firstVisible = null;

    lastVisible = null;

    currentPage = 1;

    hasNextPage = false;

    hasPreviousPage = false;

    totalRecords = 0;

    cacheValid = false;

}

/* ==========================================
   Cleanup
========================================== */

export function destroyFeedbackFirestore() {

    stopListener();

    clearCache();

}

/* ==========================================
   Version
========================================== */

console.log(

    "Feedback Firestore Ready"

);

/* =========================================================
   Public Getters
========================================================= */

export function getCurrentData() {

    return feedbackCache;

}

export function getCurrentPage() {

    return currentPage;

}

export function getTotalRecords() {

    return totalRecords;

}

export function hasNext() {

    return hasNextPage;

}

export function hasPrevious() {

    return hasPreviousPage;

}

/* ==========================================
   Helpers
========================================== */

function cleanString(value) {

    if (value === undefined || value === null)
        return "";

    return String(value).trim();

}

function cleanNumber(value, defaultValue = 0) {

    const number = Number(value);

    if (Number.isNaN(number))
        return defaultValue;

    return number;

}

function validateFeedback(feedback) {

    const errors = [];

    if (cleanString(feedback.game) === "") {

        errors.push("Please select a game.");

    }

    if (cleanString(feedback.category) === "") {

        errors.push("Please select a category.");

    }

    if (cleanString(feedback.message) === "") {

        errors.push("Please enter your feedback.");

    }

    if (
        cleanString(feedback.name).length >
        LIMITS.name
    ) {

        errors.push(
            "Name is too long."
        );

    }

    if (
        cleanString(feedback.title).length >
        LIMITS.title
    ) {

        errors.push(
            "Title is too long."
        );

    }

    if (
        cleanString(feedback.message).length >
        LIMITS.message
    ) {

        errors.push(
            "Message is too long."
        );

    }

    return {

        valid: errors.length === 0,

        errors

    };

}

/* ==========================================
   Build Document
========================================== */

function buildDocument(feedback) {

    return {

        name:
            cleanString(feedback.name),

        email:
            cleanString(feedback.email),

        game:
            cleanString(feedback.game),

        category:
            cleanString(feedback.category),

        rating:
            cleanNumber(feedback.rating, 5),

        title:
            cleanString(feedback.title),

        message:
            cleanString(feedback.message),

        status:
            "New",

        appVersion:
            "1.0.0",

        browser:
            navigator.userAgent,

        language:
            navigator.language,

        platform:
            navigator.platform,

        likes: 0,

        replyCount: 0,

        pinned: false,

        reported: false,

        helpful: 0,

        likedBy: {},

        adminReplyCount: 0,

        lastUpdated: serverTimestamp(),

        createdAt:
            serverTimestamp()

    };

}

/* ==========================================
   Save Feedback
========================================== */

export async function submitFeedback(feedback) {

    const validation =
        validateFeedback(feedback);

    if (!validation.valid) {

        return {

            success: false,

            message:
                validation.errors.join("\n")

        };

    }

    const documentData =
        buildDocument(feedback);

    try {

        const documentRef =
            await addDoc(

                collection(
                    db,
                    COLLECTION
                ),

                documentData

            );

        return {

            success: true,

            id: documentRef.id,

            message:
                "Feedback submitted successfully."

        };

    }

    catch (error) {

        console.error(
            "Feedback Save Error",
            error
        );

        return {

            success: false,

            message:
                error.message ||

                "Unable to submit feedback."

        };

    }

}

/* ==========================================
   Submit Reply
========================================== */

export async function submitReply(reply) {

    const feedbackId =
        cleanString(reply.feedbackId);

    const name =
        cleanString(reply.name);

    const message =
        cleanString(reply.message);

    if (!feedbackId) {

        return {
            success: false,
            message: "Feedback ID is missing."
        };

    }

    if (!message) {

        return {
            success: false,
            message: "Please write a reply."
        };

    }

    if (message.length > 1000) {

        return {
            success: false,
            message: "Reply is too long."
        };

    }

    try {

        const replyData = {

            feedbackId: feedbackId,

            name: name || "Guest",

            message: message,

            isAdmin:
                reply.isAdmin === true,

            createdAt:
                serverTimestamp()

        };

        const replyRef =
            await addDoc(

                collection(
                    db,
                    REPLY_COLLECTION
                ),

                replyData

            );

        await updateDoc(

            doc(
                db,
                COLLECTION,
                feedbackId
            ),

            {

                replyCount:
                    increment(1),

                lastUpdated:
                    serverTimestamp()

            }

        );

        return {

            success: true,

            id: replyRef.id,

            message:
                "Reply submitted successfully."

        };

    }

    catch (error) {

        console.error(
            "Reply Save Error:",
            error
        );

        return {

            success: false,

            message:
                error.message ||
                "Unable to submit reply."

        };

    }

}

/* ==========================================
   Load Replies
========================================== */

export async function loadReplies(feedbackId) {

    const q = query(

        collection(

            db,

            REPLY_COLLECTION

        ),

        where(

            "feedbackId",

            "==",

            feedbackId

        ),

        orderBy(

            "createdAt",

            "asc"

        )

    );

    const snapshot = await getDocs(q);

    currentReplies =

        snapshot.docs.map(

            doc => ({

                id: doc.id,

                ...doc.data()

            })

        );

    return currentReplies;

}

/* ==========================================
   Start Reply Listener
========================================== */

export function startReplyListener(

    feedbackId,

    callback

) {

    stopReplyListener();

    const q = query(

        collection(

            db,

            REPLY_COLLECTION

        ),

        where(

            "feedbackId",

            "==",

            feedbackId

        ),

        orderBy(

            "createdAt",

            "asc"

        )

    );

    replyListener = onSnapshot(

        q,

        snapshot => {

            currentReplies =

                snapshot.docs.map(

                    doc => ({

                        id: doc.id,

                        ...doc.data()

                    })

                );

            if (

                typeof callback === "function"

            ) {

                callback(

                    currentReplies

                );

            }

        }

    );

}

/* ==========================================
   Stop Reply Listener
========================================== */

export function stopReplyListener() {

    if (replyListener) {

        replyListener();

        replyListener = null;

    }

}


/* ==========================================
   Build Empty Feedback Object
========================================== */

export function createEmptyFeedback() {

    return {

        name: "",

        email: "",

        game: "",

        category: "",

        rating: 5,

        title: "",

        message: ""

    };

}

/* ==========================================
   Constants
========================================== */

export {

    COLLECTION,

    LIMITS

};

/* ==========================================
   Version
========================================== */

export const FEEDBACK_VERSION = "1.0.0";

/* ==========================================
   Default Rating
========================================== */

export const DEFAULT_RATING = 5;

/* ==========================================
   Status Values
========================================== */

export const FEEDBACK_STATUS = {

    NEW: "New",

    REVIEWED: "Reviewed",

    CLOSED: "Closed"

};

/* ==========================================
   Like Feedback
========================================== */

export async function likeFeedback(

    feedbackId

){

    try{

        await updateDoc(

            doc(

                db,

                COLLECTION,

                feedbackId

            ),

            {

                likes:

                increment(1),

                lastUpdated:

                serverTimestamp()

            }

        );

        return true;

    }

    catch(error){

        console.error(

            error

        );

        return false;

    }

}

