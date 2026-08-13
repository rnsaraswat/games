import {
    formatDateTime,
    formatElapsed,
    formatScore,
    escapeHtml
} from "./leaderboard-utils.js";

export function renderTable(data) {

    if (!data || data.length === 0) {

        showEmpty();

        return;

    }

    hideLoading();

    const tbody = document.getElementById("tableBody");

    if (!tbody) {
        console.error("tableBody not found");
        return;
    }

    tbody.innerHTML = "";

    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="14" style="text-align:center">
                    No Records Found
                </td>
            </tr>
        `;

        return;
    }

    let rank = 1;

    data.forEach(d => {

        tbody.innerHTML += `
            <tr>

                <td>${rank++}</td>

                <td>${d.game || "-"}</td>

                <td>${d.game_id || "-"}</td>

                <td>${escapeHtml(d.name) || "-"}</td>

                <td>${d.opponent || "-"}</td>

                <td>${d.size || "-"}</td>

                <td>${d.difficulty || "-"}</td>

                <td>${formatScore(d.score) || 0}</td>

                <td>${d.moves || 0}</td>

                <td>${d.level || "-"}</td>

                <td>${d.mode || "-"}</td>

                <td>${d.text || "-"}</td>

                <td>${formatElapsed(d.elapsed) || 0}</td>

                <td>${formatDateTime(d.createdAt) || "-"}</td>

            </tr>
        `;

    });

}

export function showLoading() {

    document.getElementById("leaderboardLoading").style.display = "none";

    document.getElementById("leaderboardEmpty").style.display = "none";

    document.getElementById("leaderboardError").style.display = "none";

    document.getElementById("leaderboardTable").style.display = "table";

}

export function hideLoading() {

    document.getElementById("leaderboardLoading").style.display = "none";

    document.getElementById("leaderboardTable").style.display = "table";

}


export function showEmpty() {

    document.getElementById("leaderboardLoading").style.display = "none";

    document.getElementById("leaderboardError").style.display = "none";

    document.getElementById("leaderboardEmpty").style.display = "flex";

    document.getElementById("leaderboardTable").style.display = "none";

}

export function showError() {

    document.getElementById("leaderboardLoading").style.display = "none";

    document.getElementById("leaderboardEmpty").style.display = "none";

    document.getElementById("leaderboardError").style.display = "flex";

    document.getElementById("leaderboardTable").style.display = "none";

}

/* ==========================================
   Render Reply List
========================================== */

export function renderReplyList(replies) {

    const list =

        document.getElementById(

            "replyList"

        );

    if (!list)

        return;

    if (replies.length === 0) {

        list.innerHTML =

            `

            <div class="fb-empty">

            No Replies Yet

            </div>

            `;

                    return;

                }

                list.innerHTML =

                    replies.map(

                        reply =>

                            `

            <div class="reply-item">

            <div class="reply-name">

            ${reply.isAdmin

                                ? "👑 Developer"

                                : (reply.name || "Guest")}

            </div>

            <div class="reply-time">

            ${reply.createdAt?.toDate

                                ? reply.createdAt.toDate().toLocaleString()

                                : ""}

            </div>

            <div class="reply-message">

            ${reply.message}

            </div>

            </div>

            `

                    ).join("");

            }

window.renderLeaderboard = function (data) {
    renderTable(data);
};


