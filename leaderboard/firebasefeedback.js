import { db } from "./firebase-config.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
    getDocs,
    getDoc,
    startAfter,
    startAt,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("firebasefeedback.js loaded");
console.log(window.initFeedback);
//User
let user = localStorage.getItem("username") || "Guest";

let last = "";
let perPage = 10;
let currentPage = 1;

let firstDoc = null;
let lastDoc = null;

let pageStack = [];

const hasFeedbackPage =
    document.getElementById("feedback-form") &&
    document.getElementById("fb-message") &&
    document.getElementById("list");

// const form = document.getElementById("feedback-form");

// form.addEventListener("submit", async function (e) {
//     e.preventDefault();
//     await submitFeedback();
// });

//Submit feedback
window.submitFeedback = async function () {

    console.log("submitFeedback called");

    const msg = document.getElementById("fb-message");

    if (!msg) {
        // console.error("Textarea #message not found");
        return;
    }

    let text = msg.value.trim();

    // let text = input.value;
    const rating = parseInt(document.getElementById("rating").value);
    if (!text) return;

    last = text;

    console.log({
        user,
        text,
        rating
    });

    await addDoc(collection(db, "feedbacks"), {
        name: user,
        text,
        rating,
        time: new Date(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: []
    });

    console.log("Saved Successfully");
    console.log("Reloading...");
    loadFeedbacks("first");
    document.getElementById("fb-message").value = "";
}

//Undo
window.undo = () => {
    const msg = document.getElementById("fb-message");
    if (msg) msg.value = last;
};

//Clear
window.clearBox = () => {
    const msg = document.getElementById("fb-message");
    if (msg) msg.value = "";
};

//Load Feedbacks
const q = query(
    collection(db, "feedbacks"),
    orderBy("time", "desc")
);

//load feedback
async function loadFeedbacks(direction = "first") {

    let q;

    if (direction === "next" && lastDoc) {
        q = query(
            collection(db, "feedbacks"),
            orderBy("time", "desc"),
            startAfter(lastDoc),
            limit(perPage)
        );
    }
    else if (direction === "prev" && pageStack.length) {
        let prev = pageStack.pop();
        q = query(
            collection(db, "feedbacks"),
            orderBy("time", "desc"),
            startAt(prev),
            limit(perPage)
        );
    }
    else {
        q = query(
            collection(db, "feedbacks"),
            orderBy("time", "desc"),
            limit(perPage)
        );
        pageStack = [];
    }

    const snap = await getDocs(q);

    if (snap.empty) return;

    firstDoc = snap.docs[0];
    lastDoc = snap.docs[snap.docs.length - 1];

    let html = "";

    snap.forEach(d => {
        let data = d.data();
        let id = d.id;
        let liked = data.likedBy?.includes(user);
        let disliked = data.dislikedBy?.includes(user);

        console.log(d.id, d.data(), liked, disliked);

        html += `
<div class="feedback">

<b>${data.name}</b>
<small>${new Date(data.time.seconds * 1000).toLocaleString()}</small>
<div>⭐ ${"⭐".repeat(data.rating || 0)}</div>
<p>${data.text}</p>

<button type="button"
        onclick="like('${id}', this)"
        ${liked ? "class='liked'" : ""}>
    👍 ${data.likes}
</button>

<button type="button"
        onclick="dislike('${id}', this)"
        ${disliked ? "class='disliked'" : ""}>
    👎 ${data.dislikes}
</button>

<button onclick="showReply('${id}')">Reply</button>

<div id="replyBox-${id}"></div>
<div id="replyList-${id}"></div>

</div>
`;

        loadReplies(id);
    });

    // document.getElementById("list").innerHTML = html;

    const list = document.getElementById("list");

    if (!list) return;

    list.innerHTML = html;

    if (direction === "next") {
        pageStack.push(firstDoc);
        currentPage++;
    }

    if (direction === "prev") {
        currentPage--;
    }

    pageNo.value = currentPage;
}


//Like upadte 
window.like = async (id) => {

    const ref = doc(db, "feedbacks", id);
    const snap = await getDoc(ref);
    const data = snap.data();

    //Already liked
    if (data.likedBy?.includes(user)) {
        alert("You already liked this!");
        return;
    }

    //If previously disliked then remove dislike first
    if (data.dislikedBy?.includes(user)) {
        await updateDoc(ref, {
            dislikes: increment(-1),
            dislikedBy: arrayRemove(user)
        });
    }

    //Add like
    await updateDoc(ref, {
        likes: increment(1),
        likedBy: arrayUnion(user)
    });

};

//dislike
window.dislike = async (id) => {

    const ref = doc(db, "feedbacks", id);
    const snap = await getDoc(ref);
    const data = snap.data();

    //Already disliked
    if (data.dislikedBy?.includes(user)) {
        alert("You already disliked this!");
        return;
    }

    //If previously liked then remove like first
    if (data.likedBy?.includes(user)) {
        await updateDoc(ref, {
            likes: increment(-1),
            likedBy: arrayRemove(user)
        });
    }

    //Add dislike
    await updateDoc(ref, {
        dislikes: increment(1),
        dislikedBy: arrayUnion(user)
    });

};

//Show Reply box
window.showReply = function (id) {
    document.getElementById("replyBox-" + id).innerHTML = `
<input id="r-${id}">
<button onclick="sendReply('${id}')">Send</button>
`;
}

//Send reply
window.sendReply = async function (id) {
    let val = document.getElementById("r-" + id).value;

    await addDoc(collection(db, "feedbacks", id, "replies"), {
        name: user,
        text: val,
        time: new Date()
    });
}

//display reply of reply
window.showReplyToReply = function (fid, rid) {
    document.getElementById("replyBox-" + rid).innerHTML = `
<input id="rr-${rid}">
<button onclick="sendReplyToReply('${fid}','${rid}')">Send</button>
`;
};

// Nested Reply Send Function
window.sendReplyToReply = async function (fid, rid) {

    let val = document.getElementById("rr-" + rid).value;

    await addDoc(
        collection(db, "feedbacks", fid, "replies", rid, "replies"),
        {
            name: user,
            text: val,
            time: new Date()
        }
    );
};

// Nested Replies Load
function loadNestedReplies(fid, rid) {

    const q = query(
        collection(db, "feedbacks", fid, "replies", rid, "replies"),
        orderBy("time")
    );

    onSnapshot(q, snap => {

        let html = "";

        snap.forEach(doc => {
            let d = doc.data();

            html += `
<div class="reply" style="margin-left:40px;">
  <b>${d.name}</b>
  <small>${new Date(d.time.seconds * 1000).toLocaleString()}</small>
  <p>${d.text}</p>
</div>
`;
        });

        document.getElementById("nested-" + rid).innerHTML = html;
    });
}

//load reply
function loadReplies(fid) {

    const q = query(
        collection(db, "feedbacks", fid, "replies"),
        orderBy("time")
    );

    onSnapshot(q, snap => {

        let html = "";

        snap.forEach(docSnap => {
            let d = docSnap.data();
            let rid = docSnap.id;  // reply id

            html += `
<div class="reply">

  <b>${d.name}</b>
  <small>${new Date(d.time.seconds * 1000).toLocaleString()}</small>

  <p>${d.text}</p>

  <button onclick="showReplyToReply('${fid}','${rid}')">Reply</button>

  <div id="replyBox-${rid}"></div>
  <div id="nested-${rid}"></div>

</div>
`;

            // load nested reply
            loadNestedReplies(fid, rid);

        });

        document.getElementById("replyList-" + fid).innerHTML = html;
    });
}

// Buttons Functions
// First
window.firstPage = () => {
    currentPage = 1;
    loadFeedbacks("first");
};

// Next
window.nextPage = () => {
    loadFeedbacks("next");
};

// Prev
window.prevPage = () => {
    loadFeedbacks("prev");
};

// Go Page (basic simulation)
window.goPage = () => {
    currentPage = parseInt(pageNo.value);
    loadFeedbacks("first"); // reset
};

// Last (approx)
window.lastPage = () => {
    alert("Firestore में direct last page मुश्किल है 😅");
};

// Per Page Change
window.changeLimit = () => {
    perPage = parseInt(document.getElementById("perPage").value);
    currentPage = 1;
    loadFeedbacks("first");
};

window.initFeedback = function () {

    console.log("initFeedback called");
    console.log("initFeedback =", window.initFeedback);
    const form = document.getElementById("feedback-form");

    if (!form) {
        console.log("Feedback form not found.");
        return;
    }

    if (!form.dataset.initialized) {

        form.dataset.initialized = "true";

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await submitFeedback();
        });

    }

    loadFeedbacks("first");

    console.log("Feedback Initialized");
};

document.addEventListener("feedbackLoaded", () => {

    const form = document.getElementById("feedback-form");

    if (!form) return;

    if (!form.dataset.initialized) {

        form.dataset.initialized = "true";

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await submitFeedback();
        });

    }

    loadFeedbacks("first");

    console.log("Feedback Initialized");
});

console.log("initFeedback registered:", window.initFeedback);