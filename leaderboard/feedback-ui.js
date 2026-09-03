// import {
//     openReplyPopup
// } from "./reply-popup.js";

/* =========================================================
   feedback-ui.js
   UI Layer
   ========================================================= */

const form =
    document.getElementById(
        "feedback-form"
    );

const submitButton =
    document.getElementById(
        "feedbackSubmitBtn"
    );

const statusLabel =
    document.getElementById(
        "feedbackStatus"
    );

const gameSelect =
    document.getElementById(
        "feedbackGame"
    );

const nameInput =
    document.getElementById(
        "feedbackName"
    );

const categorySelect =
    document.getElementById(
        "feedbackCategory"
    );

const ratingSelect =
    document.getElementById(
        "feedbackRating"
    );

const titleInput =
    document.getElementById(
        "feedbackTitle"
    );

const messageInput =
    document.getElementById(
        "feedbackMessage"
    );

/* =========================================================
   Show Status
   ========================================================= */

export function showStatus(
    message,
    type = "info"
) {

    if (!statusLabel)
        return;

    statusLabel.textContent =
        message;

    statusLabel.style.display =
        "block";

    switch (type) {

        case "success":

            statusLabel.style.color =
                "#1fa21f";

            break;

        case "error":

            statusLabel.style.color =
                "#d93025";

            break;

        case "warning":

            statusLabel.style.color =
                "#ff9800";

            break;

        default:

            statusLabel.style.color =
                "#555";

    }

}

/* =========================================================
Hide Status
========================================================= */

export function hideStatus() {

    if (!statusLabel)
        return;

    statusLabel.textContent = "";

    statusLabel.style.display = "none";

}

/* =========================================================
   Submit Loading
========================================================= */

export function setSubmitLoading(isLoading) {

    if (!submitButton)
        return;

    if (isLoading) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Submitting...";

        submitButton.style.opacity =
            "0.7";

        submitButton.style.cursor =
            "wait";

    }

    else {

        submitButton.disabled = false;

        submitButton.textContent =
            "Submit Feedback";

        submitButton.style.opacity =
            "1";

        submitButton.style.cursor =
            "pointer";

    }

}

/* =========================================================
   Clear Form
========================================================= */

export function clearForm() {

    titleInput.value = "";

    messageInput.value = "";

    categorySelect.value = "Bug Report";

    ratingSelect.value = "5";

}

/* =========================================================
   Reset Form
========================================================= */

export function resetForm() {

    clearForm();

    hideStatus();

}

/* =========================================================
   Fill Games
========================================================= */

export function fillGames(gameList) {

    if (!gameSelect)
        return;

    gameSelect.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Select Game";

    gameSelect.appendChild(
        defaultOption
    );

    gameList.forEach(game => {

        const option =
            document.createElement("option");

        option.value = game;

        option.textContent = game;

        gameSelect.appendChild(option);

    });

}

/* =========================================================
   Set Player Name
========================================================= */

export function setPlayerName(playerName) {

    if (!nameInput)
        return;

    nameInput.value =
        playerName || "";

}

/* =========================================================
   Set Player Email
========================================================= */

export function setPlayerEmail(email) {


    // Reserved for future Login System

    return;

}

/* =========================================================
   Lock Player Info
========================================================= */

export function lockPlayerInfo(lock = true) {

    if (!nameInput)
        return;

    nameInput.readOnly = lock;

}

/* =========================================================
   Enable / Disable Form
========================================================= */

export function enableForm(enable = true) {

    const controls = form.querySelectorAll(

        "input, textarea, select, button"

    );

    controls.forEach(control => {

        control.disabled = !enable;

    });

}

/* =========================================================
   Get Form Data
========================================================= */

export function getFormData() {

    return {

        game:
            gameSelect.value,

        name:
            nameInput.value.trim(),

        email:
            "",

        category:
            categorySelect.value,

        rating:
            Number(
                ratingSelect.value
            ),

        title:
            titleInput.value.trim(),

        message:
            messageInput.value.trim()

    };

}

/* =========================================================
   Set Form Data
========================================================= */

export function setFormData(data = {}) {

    gameSelect.value =
        data.game || "";

    nameInput.value =
        data.name || "";

    categorySelect.value =
        data.category ||
        "Bug Report";

    ratingSelect.value =
        String(
            data.rating || 5
        );

    titleInput.value =
        data.title || "";

    messageInput.value =
        data.message || "";

}

function formatDate(timestamp) {

    if (!timestamp)

        return "";

    const d =

        timestamp.toDate

            ? timestamp.toDate()

            : new Date(timestamp);

    return d.toLocaleString();

}

/* ==========================================
   Feedback List
========================================== */

const feedbackList =

    document.getElementById(

        "feedbackList"

    );

/* ==========================================
Render One Feedback
========================================== */

function renderFeedbackCard(

    feedback

) {

    const stars = "⭐".repeat(

        feedback.rating || 5

    );

    return `

<div class="fb-item">

<div class="fb-top">

<div class="fb-left">

<div class="fb-name">

${feedback.name || "Guest"}

</div>

<div class="fb-game">

🎮 ${feedback.game}

</div>

</div>

<div class="fb-right">

<div>${stars}</div>

<div class="fb-category">

${feedback.category}

</div>

</div>

</div>

<div class="fb-title">

${feedback.title}

</div>

<div class="fb-message">

${feedback.message}

</div>

<div class="fb-footer">

<div class="fb-actions">

<button
class="fb-action fb-like"

data-id="${feedback.id}"

data-action="like">

👍 ${feedback.likes || 0}

</button>

<button type="button"
class="fb-action fb-reply"

data-id="${feedback.id}"

data-action="reply">

💬 Reply (${feedback.replyCount || 0})

</button>

</div>

<div class="fb-time">

${formatDate(

        feedback.createdAt

    )}

</div>

</div>

</div>

`;

}

/* ==========================================
   Render Feedback List
========================================== */

export function

    renderFeedbackList(

        feedbackArray

    ) {

    if (

        !feedbackList

    )

        return;

    if (

        feedbackArray.length === 0

    ) {

        feedbackList.innerHTML =

            `

<div class="fb-empty">

No Feedback Found

</div>

`;

        return;

    }

    feedbackList.innerHTML =

        feedbackArray

            .map(

                renderFeedbackCard

            )

            .join("");

    /* ==========================================
    Reply Button Events
    ========================================== */
    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".fb-reply"
                );

            if (!button)
                return;


            event.preventDefault();

            event.stopPropagation();


            const feedbackId =
                button.dataset.id;


            if (!feedbackId) {

                console.error(
                    "Reply button: feedbackId missing"
                );

                return;

            }


            console.log(
                "Reply clicked:",
                feedbackId
            );


            if (
                typeof window.openReplyPopup ===
                "function"
            ) {

                window.openReplyPopup(
                    feedbackId
                );

            }
            else {

                console.error(
                    "openReplyPopup() not available"
                );

            }

        }
    );
}

/* ==========================================
   Render Reply List
========================================== */

export function renderReplyList(replies) {

    const container =
        document.getElementById("replyList");

    if (!container) {

        console.error(
            "Reply List container #replyList not found"
        );

        return;

    }


    if (!Array.isArray(replies)) {

        console.error(
            "Invalid replies data:",
            replies
        );

        container.innerHTML = "";

        return;

    }


    let html = "";


    replies.forEach(reply => {

        const name =
            typeof escapeHtml === "function"
                ? escapeHtml(reply.name || "Guest")
                : (reply.name || "Guest");


        const message =
            typeof escapeHtml === "function"
                ? escapeHtml(reply.message || "")
                : (reply.message || "");


        const adminBadge =
            reply.isAdmin === true
                ? `
                    <span class="developer-badge">
                        👑 Official Developer
                    </span>
                  `
                : "";


        let dateText = "";

        if (
            reply.createdAt &&
            typeof reply.createdAt.toDate === "function"
        ) {

            dateText =
                reply.createdAt
                    .toDate()
                    .toLocaleString();

        }


        html += `

            <div class="reply-card">
                <div class="reply-top">
                <div class="reply-author-left">

                    ${name}

                    ${adminBadge}

                </div>


                <div class="reply-date-right">

                    ${dateText}

                </div>

                </div>
                <div class="reply-message">

                    ${message}

                </div>

            </div>

        `;

    });


    if (html === "") {

        html = `
            <div class="no-replies">
                No replies yet.
            </div>
        `;

    }


    container.innerHTML = html;

}





/* ==========================================
   Reply Button Click
========================================== */

// document.addEventListener(
//     "click",
//     function (event) {

//         const button =
//             event.target.closest(
//                 ".fb-reply"
//             );

//         if (!button)
//             return;

//         event.preventDefault();

//         event.stopPropagation();

//         const feedbackId =
//             button.dataset.id;

//         if (!feedbackId) {

//             console.error(
//                 "Reply button: feedbackId missing"
//             );

//             return;
//         }

//         console.log(
//             "Reply clicked:",
//             feedbackId
//         );

//         if (
//             typeof window.openReplyPopup ===
//             "function"
//         ) {

//             window.openReplyPopup(
//                 feedbackId
//             );

//         } else {

//             console.error(
//                 "openReplyPopup() not available"
//             );

//         }

//     }
// );


function escapeHtml(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}

/* ==========================================
   Update Reply Count
========================================== */

export function updateFeedbackReplyCount(

    feedbackId,
    count

) {

    const button =

        document.querySelector(

            `.fb-reply[data-id="${feedbackId}"]`

        );

    if (!button)
        return;

    button.textContent =
        `💬 Reply (${count})`;

}

