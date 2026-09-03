/* =========================================================
   reply-popup.js
   Feedback V2 - Reply Popup
========================================================= */

import {
    loadReplies,
    submitReply,
    startReplyListener,
    stopReplyListener
} from "./feedback-firestore.js";

import {
    renderReplyList,
    updateFeedbackReplyCount
} from "./feedback-ui.js";


/* =========================================================
   Current Feedback
========================================================= */

let currentFeedbackId = null;


/* =========================================================
   Open Reply Popup
========================================================= */

export async function openReplyPopup(
    feedbackId
) {

    // console.log(
    //     "Opening Reply Popup:",
    //     feedbackId
    // );


    const popup =
        document.getElementById(
            "replyPopup"
        );


    if (!popup) {

        console.error(
            "❌ Reply Popup element not found"
        );

        return;

    }


    currentFeedbackId =
        feedbackId;


    /* -----------------------------------------
       Open Popup
    ----------------------------------------- */

    popup.classList.add(
        "active"
    );


    popup.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "reply-popup-open"
    );


    /* -----------------------------------------
       Load Existing Replies
    ----------------------------------------- */

    try {

        const replies =
            await loadReplies(
                feedbackId
            );


        renderReplyList(
            replies
        );


        updateFeedbackReplyCount(
            feedbackId,
            replies.length
        );


    }
    catch (error) {

        console.error(
            "Reply Load Error:",
            error
        );

    }


    /* -----------------------------------------
       Start Live Listener
    ----------------------------------------- */

    try {

        startReplyListener(
            feedbackId
        );

    }
    catch (error) {

        console.error(
            "Reply Listener Error:",
            error
        );

    }

}


/* =========================================================
   Close Reply Popup
========================================================= */

export function closeReplyPopup() {

    const popup =
        document.getElementById(
            "replyPopup"
        );


    if (!popup)
        return;


    popup.classList.remove(
        "active"
    );


    popup.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "reply-popup-open"
    );


    /* -----------------------------------------
       Stop Live Listener
    ----------------------------------------- */

    try {

        stopReplyListener();

    }
    catch (error) {

        console.error(
            "Stop Reply Listener Error:",
            error
        );

    }


    currentFeedbackId =
        null;

}


/* =========================================================
   Current Feedback ID
========================================================= */

export function getCurrentReplyFeedbackId() {

    return currentFeedbackId;

}


/* =========================================================
   Submit Reply
========================================================= */

async function handleReplySubmit() {

    // console.log(
    //     "Reply Submit Clicked"
    // );


    /* -----------------------------------------
       Check Feedback
    ----------------------------------------- */

    if (!currentFeedbackId) {

        alert(
            "Please select a feedback first."
        );

        return;

    }


    /* -----------------------------------------
       Get Input Elements
    ----------------------------------------- */

    const nameInput =
        document.getElementById(
            "replyName"
        );


    const messageInput =
        document.getElementById(
            "replyMessage"
        );


    if (!messageInput) {

        console.error(
            "❌ #replyMessage not found"
        );

        return;

    }


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    const message =
        messageInput.value.trim();


    /* -----------------------------------------
       Validate
    ----------------------------------------- */

    if (message === "") {

        alert(
            "Please write a reply."
        );

        messageInput.focus();

        return;

    }


    /* -----------------------------------------
       Disable Button
    ----------------------------------------- */

    const sendButton =
        document.getElementById(
            "replySendBtn"
        );


    if (sendButton) {

        sendButton.disabled =
            true;

        sendButton.textContent =
            "Sending...";

    }


    try {

        /* -----------------------------------------
           Submit to Firestore
        ----------------------------------------- */

        const result =
            await submitReply({

                feedbackId:
                    currentFeedbackId,

                name:
                    name,

                message:
                    message,

                isAdmin:
                    false

            });


        /* -----------------------------------------
           Success
        ----------------------------------------- */

        if (result.success) {

            messageInput.value =
                "";


            const replies =
                await loadReplies(
                    currentFeedbackId
                );


            renderReplyList(
                replies
            );


            updateFeedbackReplyCount(
                currentFeedbackId,
                replies.length
            );


            // console.log(
            //     "✅ Reply submitted successfully"
            // );

        }

        else {

            alert(
                result.message ||
                "Unable to submit reply."
            );

        }

    }
    catch (error) {

        console.error(
            "Reply Submit Error:",
            error
        );


        alert(
            error.message ||
            "Unable to submit reply."
        );

    }
    finally {

        /* -----------------------------------------
           Enable Button Again
        ----------------------------------------- */

        if (sendButton) {

            sendButton.disabled =
                false;

            sendButton.textContent =
                "Send Reply";

        }

    }

}


/* =========================================================
   Initialize Reply Popup
========================================================= */

export function initReplyPopup() {

    const popup = document.getElementById("replyPopup");
    const closeButton = document.getElementById("replyCloseBtn");
    const sendButton = document.getElementById("replySendBtn");

    if (!popup) {
        console.error("❌ Reply Popup: #replyPopup not found");
        return;
    }

    if (closeButton) {
        closeButton.onclick = closeReplyPopup;
    }
    else {
        console.warn("⚠️ #replyCloseBtn not found");
    }

    if (sendButton) {
        sendButton.onclick = handleReplySubmit;
    }
    else {
        console.warn("⚠️ #replySendBtn not found");
    }

    popup.addEventListener("click", function (event) {
            if (
                event.target === popup
            ) {
                closeReplyPopup();
            }
        }
    );
}


/* =========================================================
   DOM Ready
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initReplyPopup
    );

}
else {

    initReplyPopup();

}


/* =========================================================
   Global Functions
========================================================= */

window.openReplyPopup =
    openReplyPopup;


window.closeReplyPopup =
    closeReplyPopup;