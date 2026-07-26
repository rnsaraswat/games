import { db } from "./firebase-config.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyCEEOj5ZaEs8LZ9HCEVPhapDFy0bw-N3D4",
//   authDomain: "ravindra-games-hub-68e5f.firebaseapp.com",
//   projectId: "ravindra-games-hub-68e5f",
//   storageBucket: "ravindra-games-hub-68e5f.firebasestorage.app",
//   messagingSenderId: "233066688435",
//   appId: "1:233066688435:web:307f0bc7508df35579e5c6",
//   measurementId: "G-B24P20E3K8"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

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

// const firebaseConfig = {
//   apiKey: "AIzaSyCEEOj5ZaEs8LZ9HCEVPhapDFy0bw-N3D4",
//   authDomain: "ravindra-games-hub-68e5f.firebaseapp.com",
//   projectId: "ravindra-games-hub-68e5f",
//   storageBucket: "ravindra-games-hub-68e5f.firebasestorage.app",
//   messagingSenderId: "233066688435",
//   appId: "1:233066688435:web:307f0bc7508df35579e5c6",
//   measurementId: "G-B24P20E3K8"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// 👤 User
let user = localStorage.getItem("username") || "Guest";

// Undo
let last = "";
let perPage = 10;
let currentPage = 1;

let firstDoc = null;
let lastDoc = null;

let pageStack = [];

// 📤 Submit
window.submitFeedback = async function () {
    let text = input.value;
    const rating = parseInt(document.getElementById("rating").value);
    if (!text) return;

    last = text;

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

    input.value = "";
}

// 🔙 Undo
window.undo = () => input.value = last;

// ❌ Clear
window.clearBox = () => input.value = "";

// 📥 Load Feedbacks
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

    console.log("firebasefeeback.html loadFeedbacks snap", snap);
    if (snap.empty) return;

    firstDoc = snap.docs[0];
    lastDoc = snap.docs[snap.docs.length - 1];

    let html = "";

    snap.forEach(d => {
        let data = d.data();
        let id = d.id;
        let liked = data.likedBy?.includes(user);
        let disliked = data.dislikedBy?.includes(user);
        //                 html += `
        //   <div class="feedback">
        //     <b>${data.name}</b>
        //     <small>${new Date(data.time.seconds * 1000).toLocaleString()}</small>

        //     <div style="color:gold;">
        //       ${"⭐".repeat(data.rating || 0)}
        //     </div>

        //     <p>${data.text}</p>
        //   </div>
        //   `;

        html += `
<div class="feedback">

<b>${data.name}</b>
<small>${new Date(data.time.seconds * 1000).toLocaleString()}</small>
<div>⭐ ${"⭐".repeat(data.rating || 0)}</div>
<p>${data.text}</p>

<button onclick="like('${id}')" ${liked ? "disabled" : ""}>👍 ${data.likes}</button>
<button onclick="dislike('${id}')" ${disliked ? "disabled" : ""}>👎 ${data.dislikes}</button>

<button onclick="showReply('${id}')">Reply</button>

<div id="replyBox-${id}"></div>
<div id="replyList-${id}"></div>

</div>
`;

        loadReplies(id);
    });

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

//     onSnapshot(q, snap => {
//         let html = "";

//         snap.forEach(d => {
//             let data = d.data();
//             let id = d.id;

//             let liked = data.likedBy?.includes(user);
//             let disliked = data.dislikedBy?.includes(user);

//             html += `
// <div class="feedback">

//   <b>${data.name}</b>
//   <small>${new Date(data.time.seconds * 1000).toLocaleString()}</small>
//   <div>⭐ ${"⭐".repeat(data.rating || 0)}</div>
//   <p>${data.text}</p>

//   <button onclick="like('${id}')" ${liked ? "disabled" : ""}>👍 ${data.likes}</button>
//   <button onclick="dislike('${id}')" ${disliked ? "disabled" : ""}>👎 ${data.dislikes}</button>

//   <button onclick="showReply('${id}')">Reply</button>

//   <div id="replyBox-${id}"></div>
//   <div id="replyList-${id}"></div>

// </div>
// `;

//             loadReplies(id);
//         });

//         list.innerHTML = html;
//     });

// Like
window.like = async (id) => {

    const ref = doc(db, "feedbacks", id);
    const snap = await getDoc(ref);
    const data = snap.data();

    // ❌ Already liked
    if (data.likedBy?.includes(user)) {
        alert("You already liked this!");
        return;
    }

    // 🔄 If previously disliked → remove dislike first
    if (data.dislikedBy?.includes(user)) {
        await updateDoc(ref, {
            dislikes: increment(-1),
            dislikedBy: arrayRemove(user)
        });
    }

    // ✅ Add like
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

    // ❌ Already disliked
    if (data.dislikedBy?.includes(user)) {
        alert("You already disliked this!");
        return;
    }

    // 🔄 If previously liked → remove like first
    if (data.likedBy?.includes(user)) {
        await updateDoc(ref, {
            likes: increment(-1),
            likedBy: arrayRemove(user)
        });
    }

    // ✅ Add dislike
    await updateDoc(ref, {
        dislikes: increment(1),
        dislikedBy: arrayUnion(user)
    });

};

// 💬 Reply box
window.showReply = function (id) {
    document.getElementById("replyBox-" + id).innerHTML = `
<input id="r-${id}">
<button onclick="sendReply('${id}')">Send</button>
`;
}

// window.replyLike = async (fid, rid) => {
//     let ref = doc(db, "feedbacks", fid, "replies", rid);

//     await updateDoc(ref, {
//         likes: increment(1),
//         likedBy: arrayUnion(user)
//     });
// };

// 📤 Send reply
window.sendReply = async function (id) {
    let val = document.getElementById("r-" + id).value;

    await addDoc(collection(db, "feedbacks", id, "replies"), {
        name: user,
        text: val,
        time: new Date()
    });
}

// NESTED REPLY (Reply to Reply)
// await addDoc(
//     collection(db, "feedbacks", fid, "replies", rid, "replies"),
//     {
//         name: user,
//         text: val,
//         time: new Date()
//     }
// );

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


// 📥 Load replies
// function loadReplies(id) {

//     const q = query(
//         collection(db, "feedbacks", id, "replies"),
//         orderBy("time")
//     );

//     onSnapshot(q, snap => {
//         let html = "";

//         snap.forEach(doc => {
//             let d = doc.data();

//             //                 html += `
//             //   <div class="reply">
//             //     <b>${d.name}</b>
//             //     <small>${new Date(d.time.seconds * 1000).toLocaleString()}</small>
//             //     <p>${d.text}</p>
//             //   </div>
//             //   `;

//             html += `
//         <div class="reply">

//         <b>${d.name}</b>
//         <small>${new Date(d.time.seconds * 1000).toLocaleString()}</small>

//         <p>${d.text}</p>

//         <button onclick="showReplyToReply('${fid}','${doc.id}')">Reply</button>

//         <div id="replyBox-${doc.id}"></div>
//         <div id="nested-${doc.id}"></div>

//         </div>
//         `;

//         });


//         document.getElementById("replyList-" + id).innerHTML = html;
//         loadNestedReplies(fid, doc.id);
//     });
// }

function loadReplies(fid) {   // 🔥 यहाँ नाम change

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

            // ✅ सही call
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

loadFeedbacks("first");

    // const rating = parseInt(document.getElementById("rating").value);

    // await addDoc(collection(db, "feedbacks"), {
    //     name: user,
    //     text,
    //     rating,
    //     time: new Date(),
    //     likes: 0,
    //     dislikes: 0,
    //     likedBy: [],
    //     dislikedBy: []
    // });

    // "⭐".repeat(data.rating)

    // ADMIN PANEL
    // Admin Check
    // let isAdmin = (user === "admin");

    // Edit Feedback
    // window.editFeedback = async (id, oldText) => {
    //     let newText = prompt("Edit:", oldText);

    //     if (!newText) return;

    //     await updateDoc(doc(db, "feedbacks", id), {
    //         text: newText
    //     });
    // };

    // Disable button if already liked
    // let liked = data.likedBy?.includes(user);