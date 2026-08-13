import {

    submitFeedback,

    likeFeedback,

    loadFirstPage

}
    from "./feedback-firestore.js";

import {

    showStatus,

    hideStatus,

    setSubmitLoading,

    clearForm,

    fillGames,

    setPlayerName,

    lockPlayerInfo,

    getFormData,

    renderFeedbackList,

}

    from "./feedback-ui.js";

/* ==========================================
   DOM
========================================== */

const form =

    document.getElementById(

        "feedback-form"

    );

/* ==========================================
   Games
========================================== */

const games = [

    "Rock Paper Scissor",

    "5 in A Row",

    "Connect 4",

    "Sudoku",

    "Sudoku Solver",

    "4 in A Row",

    "Connect 3",

    "Tic Tac Toe",

    "3 in Row",

    "Mastermind",

    "Slither Link",

    "Jigsaw",

    "Reversi",

    "Water Sort",

    "Block Sort",

    "Memory"

];

/* ==========================================
   Init
========================================== */

window.initFeedback =

    async function () {

        console.log(

            "Feedback Initialized"

        );

        fillGames(games);

        hideStatus();

        setSubmitLoading(false);

        const player =

            localStorage.getItem(

                "player_name"

            );

        if (player) {

            setPlayerName(player);

            lockPlayerInfo(true);

        }

        else {

            lockPlayerInfo(false);

        }

        form.addEventListener(

            "submit",

            onSubmitFeedback

        );

        document.addEventListener(

            "click",

            async event => {

                const btn =

                    event.target.closest(

                        "[data-action]"

                    );

                if (!btn)

                    return;

                if (

                    btn.dataset.action

                    !== "like"

                )

                    return;

                await likeFeedback(

                    btn.dataset.id

                );

            }

        );

        /* ==========================================
        Load First Feedback Page
        ========================================== */

        try {

            const feedbackData =
                await loadFirstPage();

            renderFeedbackList(
                feedbackData
            );

        } catch (error) {

            console.error(
                "Load Feedback Error",
                error
            );

        }

    };

/* ==========================================
   Submit Feedback
========================================== */

async function onSubmitFeedback(event) {

    event.preventDefault();

    hideStatus();

    const feedback =
        getFormData();

    setSubmitLoading(true);

    const result =
        await submitFeedback(
            feedback
        );

    setSubmitLoading(false);

    // if (result.success) {

    //     showStatus(

    //         "Thank you for your feedback.",

    //         "success"

    //     );

    //     clearForm();

    //     return;

    // }

    if (result.success) {

        showStatus(
            "Thank you for your feedback.",
            "success"
        );
    
        clearForm();
    
    
        /* ==========================================
           Reload Feedback List
        ========================================== */
    
        try {
    
            const feedbackData =
                await loadFirstPage();
    
            renderFeedbackList(
                feedbackData
            );
    
        }
        catch (error) {
    
            console.error(
                "Feedback List Refresh Error",
                error
            );
    
        }
    
        return;
    }
    
    showStatus(

        result.message,

        "error"

    );

}

/* ==========================================
   Current Game
========================================== */

let currentGame = "";

/* ==========================================
   Set Current Game
========================================== */

export function setCurrentGame(gameName) {

    currentGame = gameName || "";

}

/* ==========================================
   Auto Select Game
========================================== */

function selectCurrentGame() {

    if (
        currentGame === ""
    )
        return;

    const select =
        document.getElementById(
            "feedbackGame"
        );

    if (!select)
        return;

    select.value =
        currentGame;

}

/* ==========================================
   Open Feedback
========================================== */

window.openFBFeedback = function (game = "") {

    currentGame = game || "";

    requestAnimationFrame(() => {

        selectCurrentGame();

    });

    hideStatus();

};

/* ==========================================
   Close Feedback
========================================== */

window.stopFeedback = function () {

    hideStatus();

};

/* ==========================================
   Reset Feedback Form
========================================== */

export function resetFeedback() {

    clearForm();

    hideStatus();

    setSubmitLoading(false);

    selectCurrentGame();

}

/* ==========================================
   Public Helpers
========================================== */

window.resetFeedback =
    resetFeedback;

/* ==========================================
   Auto Init
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        if (
            document.getElementById(
                "feedback-form"
            )
        ) {

            window.initFeedback();

        }

    }

);

/* ==========================================
   Debug
========================================== */

console.log(

    "feedback-controller.js Loaded"

);


