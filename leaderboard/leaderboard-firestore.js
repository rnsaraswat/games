import { db } from "./firebase-config.js";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    startAt,
    getDocs,
    onSnapshot,
    getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// console.log("leaderboard-firestore.js loaded");

// Firestore Listener
let leaderboardListener = null;

// Current Query Data
let firstDoc = null;
let lastDoc = null;

// Pagination
let currentPage = 1;
let pageSize = 20;

// Page History
let pageStack = [];

// Current Loaded Data
let leaderboardData = [];

let currentSearch = "";

let currentSortField = "createdAt";
let currentSortDirection = "desc";
let currentGame = "All";
let currentDifficulty = "All";
let currentMode = "All";

let cacheData = [];
let totalRecords = 0;

let cacheValid = false;
let cacheTime = 0;
const CACHE_DURATION = 60000; // 60 Seconds





export function getCurrentData() {
    return leaderboardData;
}





export function setPageSize(size) {
    pageSize = Number(size) || 20;
}

export function setSorting(field, direction) {

    currentSortField = field;
    currentSortDirection = direction;
    cacheValid = false;

    resetPagination();
}

export function setFilters(game, difficulty, mode) {

    currentGame = game || "All";
    currentDifficulty = difficulty || "All";
    currentMode = mode || "All";
    cacheValid = false;

    resetPagination();

}

export function getTotalRecords() {
    return totalRecords;
}

export async function loadFirstPage() {

    if (
        cacheValid &&
        (Date.now() - cacheTime) < CACHE_DURATION
    ) {
    
        console.log("Leaderboard Loaded From Cache");
    
        return leaderboardData;
    
    }

    resetPagination();

    // पुराने Listener को बंद करो
    stopListener();

    // नया Query
    const q = buildLeaderboardQuery();

    // Firestore से Data लाओ
    const snapshot = await safeGetDocs(q);

    // Data Reset
    leaderboardData = [];

    // अगर Data नहीं मिला
    if (snapshot.empty) {

        firstDoc = null;
        lastDoc = null;

        return leaderboardData;
    }

    // Pagination Docs Save
    firstDoc = snapshot.docs[0];
    lastDoc = snapshot.docs[snapshot.docs.length - 1];

    // Array में Save
    snapshot.forEach(doc => {

        leaderboardData.push({

            id: doc.id,

            ...doc.data()

        });

    });

    cacheValid = true;
    cacheTime = Date.now();

    return leaderboardData;

}

export async function loadNextPage() {

    if (!lastDoc) {
        return leaderboardData;
    }

    let q;

        q = buildLeaderboardQuery({
            startAfter: lastDoc
        });
    

        const snapshot = await safeGetDocs(q);

    if (snapshot.empty) {
        return leaderboardData;
    }

    // वर्तमान page को history में रखो
    pageStack.push(firstDoc);

    leaderboardData = [];

    firstDoc = snapshot.docs[0];
    lastDoc = snapshot.docs[snapshot.docs.length - 1];

    snapshot.forEach(doc => {

        leaderboardData.push({
            id: doc.id,
            ...doc.data()
        });

    });

    currentPage++;

    return leaderboardData;

}

export async function loadPreviousPage() {

    if (pageStack.length === 0) {
        return leaderboardData;
    }

    let q;

    const previousFirst = pageStack.pop();
    
        q = buildLeaderboardQuery({
            startAt: previousFirst
        });

        const snapshot = await safeGetDocs(q);

    leaderboardData = [];

    firstDoc = snapshot.docs[0];
    lastDoc = snapshot.docs[snapshot.docs.length - 1];

    snapshot.forEach(doc => {

        leaderboardData.push({
            id: doc.id,
            ...doc.data()
        });

    });

    currentPage--;

    return leaderboardData;

}

export async function searchLeaderboard(text){

    currentSearch = text.trim();

    cacheValid = false;

    return await loadFirstPage();

}

export function startListener() {

    stopListener();

    const q = buildLeaderboardQuery();

    leaderboardListener = onSnapshot(

        q,
    
        (snapshot) => {
    
            leaderboardData = [];
            cacheData = [];
    
            snapshot.forEach(doc => {
    
                leaderboardData.push({
                    id: doc.id,
                    ...doc.data()
                });
    
            });
    
            if (window.renderLeaderboard) {
                window.renderLeaderboard(leaderboardData);
            }
    
        },
    
        (error) => {
    
            console.error("Listener Error", error);
    
        }
    
    );

}

export function stopListener() {

    if (leaderboardListener) {
        leaderboardListener();
        leaderboardListener = null;
        console.log("Leaderboard Listener Stopped");
    }

}

export async function loadTotalRecordCount() {

    let q;

    if (currentSearch === "") {

        q = query(
            collection(db, "leaderboard")
        );

    } else {

        q = query(
            collection(db, "leaderboard"),
            where("name", ">=", currentSearch),
            where("name", "<=", currentSearch + "\uf8ff")
        );

    }

    const snapshot = await getCountFromServer(q);

    totalRecords = snapshot.data().count;

    return totalRecords;

}

export function resetPagination() {

    pageStack = [];

    currentPage = 1;

    firstDoc = null;

    lastDoc = null;

}


export function getCurrentPage() {
    return currentPage;
}

function buildLeaderboardQuery(options = {}) {

    const constraints = [
        collection(db, "leaderboard")
    ];

    // Search
    if (currentSearch !== "") {

        constraints.push(
            where("name", ">=", currentSearch),
            where("name", "<=", currentSearch + "\uf8ff")
        );

    }

    // Filters
    if (currentGame && currentGame !== "All") {
        constraints.push(where("game", "==", currentGame));
    }

    if (currentDifficulty && currentDifficulty !== "All") {
        constraints.push(where("difficulty", "==", currentDifficulty));
    }

    if (currentMode && currentMode !== "All") {
        constraints.push(where("mode", "==", currentMode));
    }

    // Sorting
    constraints.push(
        orderBy(currentSortField, currentSortDirection)
    );

    // Pagination
    if (options.startAfter) {
        constraints.push(startAfter(options.startAfter));
    }

    if (options.startAt) {
        constraints.push(startAt(options.startAt));
    }

    constraints.push(limit(pageSize));

    return query(...constraints);

}





async function safeGetDocs(q) {

    try {

        return await getDocs(q);

    } catch (err) {

        console.error("Firestore Query Error", err);

        if (
            err.code === "failed-precondition" ||
            err.message.includes("index")
        ) {

            alert(
                "This search requires a Firestore index.\nCheck Console for the index link."
            );

        }

        throw err;

    }

}

export function invalidateCache() {

    cacheValid = false;
    cacheTime = 0;

}

export function getCurrentSortField() {
    return currentSortField;
}

export function getCurrentSortDirection() {
    return currentSortDirection;
}