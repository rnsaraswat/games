import {
    loadFirstPage,
    loadNextPage,
    loadPreviousPage,
    loadTotalRecordCount,
    getCurrentData,
    startListener,
    stopListener,
    getTotalRecords,
    getCurrentPage,
    invalidateCache,
    setSorting,
    setFilters,
    getCurrentSortField,
    getCurrentSortDirection
} from "./leaderboard-firestore.js";
import {
    renderTable,
    showLoading,
    hideLoading,
    showError,
    showEmpty
} from "./leaderboard-ui.js";


window.initLeaderboard = async function () {

    console.log("Leaderboard Initialized");

    const table = document.getElementById("tableBody");

    if (!table) {

        console.error("tableBody not found");

        return;

    }

    // Firestore से पहला Page
    await loadFirstPage();

    await loadTotalRecordCount();

    startListener();

    const nextBtn = document.getElementById("nextBtn");

    if (nextBtn) {

        nextBtn.onclick = async () => {

            const data = await loadNextPage();

            renderTable(data);
            updateRecordInfo(data.length);
        };

    }

    const prevBtn = document.getElementById("prevBtn");

    if (prevBtn) {

        prevBtn.onclick = async () => {

            const data = await loadPreviousPage();

            renderTable(data);
            updateRecordInfo(data.length);
        };

    }

    const retryBtn =
        document.getElementById("retryLeaderboardBtn");

    if (retryBtn) {

        retryBtn.onclick = async () => {

            showLoading();

            try {

                invalidateCache();

                const data =
                    await loadFirstPage();

                renderTable(data);

                startListener();

            }
            catch (e) {

                showError();

            }

        };

    }

    const gameFilter = document.getElementById("filterGame");
    const difficultyFilter = document.getElementById("filterDifficulty");
    const modeFilter = document.getElementById("filterMode");

    async function applyFilters() {

        setFilters(
            gameFilter.value,
            difficultyFilter.value,
            modeFilter.value
        );

        showLoading();
        try {

            const data = await loadFirstPage();

            renderTable(data);
            updateRecordInfo(data.length);

        } catch (err) {

            console.error(err);
            showError();

        } finally {

            hideLoading();

        }

        startListener();

    }

    
    gameFilter.addEventListener("change", applyFilters);

    difficultyFilter.addEventListener("change", applyFilters);

    modeFilter.addEventListener("change", applyFilters);

    const headers =
        document.querySelectorAll(
            "#leaderboardTable th[data-field]"
        );

    headers.forEach(th => {

        th.onclick = async () => {

            const field = th.dataset.field;
            let direction = "asc";

            const sortField = getCurrentSortField();
            const sortDirection = getCurrentSortDirection();

            if (field === sortField) {

                direction =
                sortDirection === "asc"
                        ? "desc" : "asc";

            }

            setSorting(field, direction);

            showLoading();

            const data =
                await loadFirstPage();

            renderTable(data);
            
            updateSortHeader();

            startListener();

        };

    });

    function updateSortIcons() {

        document
            .querySelectorAll(
                "#leaderboardTable th[data-field]"
            )
            .forEach(th => {

                const field =
                    th.dataset.field;

                const title =
                    th.innerText
                        .replace(" ▲", "")
                        .replace(" ▼", "");

                const sortField = getCurrentSortField();
                const sortDirection = getCurrentSortDirection();
                if (field === sortField) {

                    th.innerText =
                        title +
                        (
                            sortDirection === "asc"
                                ? " ▲" : " ▼"
                        );

                } else {

                    th.innerText =
                        title;

                }

            });

    }

    renderTable(getCurrentData());

    const refreshBtn = document.getElementById("refreshBtn");

    if (refreshBtn) {

        refreshBtn.addEventListener("click", async () => {

            refreshBtn.disabled = true;
            refreshBtn.innerText = "Refreshing...";

            // Cache Clear
            invalidateCache();

            stopListener();

            const data = await loadFirstPage();

            renderTable(data);

            startListener();

            refreshBtn.innerText = "🔄 Refresh";
            refreshBtn.disabled = false;

        });

    }
    updateSortIcons();
    updateSortHeader();
};

document.querySelectorAll("th[data-field]")
    .forEach(th => {

        th.addEventListener("click", async () => {

            const field = th.dataset.field;

            let direction = "asc";

            if (window.lastSortField === field) {

                direction =
                    window.lastSortDirection === "asc"
                        ? "desc"
                        : "asc";
            }

            window.lastSortField = field;
            window.lastSortDirection = direction;

            setSorting(field, direction);

            showLoading();
            try {

                const data = await loadFirstPage();

                renderTable(data);

            } catch (err) {

                console.error(err);
                showError();

            } finally {

                hideLoading();

            }

        });

    });

function updateRecordInfo(currentCount) {

    const info =
        document.getElementById("recordInfo");

    if (!info)
        return;

    const start =
        ((getCurrentPage() - 1) * 20) + 1;

    const end =
        start + currentCount - 1;

    info.innerHTML =
        `Showing ${start} - ${end}
             of ${getTotalRecords()} Records`;

}

function updateSortHeader() {

    document
        .querySelectorAll(
            "#leaderboardTable th[data-field]"
        )
        .forEach(th => {

            const title =
                th.dataset.field
                    .replaceAll("_", " ");

            const sortField = getCurrentSortField();
            const sortDirection = getCurrentSortDirection();
            if (th.dataset.field === sortField) {

                th.innerHTML =
                    title +
                    (
                        sortDirection === "asc"
                            ? " ▲"
                            : " ▼"
                    );

            } else {

                th.innerHTML = title;

            }

        });

}

window.stopLeaderboard = function () {
    stopListener();
};

