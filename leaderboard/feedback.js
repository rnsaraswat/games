import { textToSpeechEng } from './speak.js';
        /* -----------------------------
           Configuration / globals
           ----------------------------- */
        // यहाँ serverEnabled = true रखते हैं पर यदि सर्वर respond न करे तो fallback होगा
        const SERVER_ENABLED = true; // change to false to force local-only mode
        const API_BASE = '/api/feedback'; // आपकी backend route

        // Undo stack (simple single-level undo) — stores last action object
        let undoStack = null;
        
        // Pagination state
        let currentPage = 1;
        let totalItems = 0;
        let pageSize = parseInt(document.getElementById('page-size').value, 10);
        let totalPages = 1;
        
        // DOM
        const form = document.getElementById('feedback-form');
        const nameInput = document.getElementById('name');
        const msgInput = document.getElementById('message');
        const listEl = document.getElementById('feedback-list');
        const serverStatusEl = document.getElementById('server-status');
        const listInfoEl = document.getElementById('list-info');
        
        // Pagination controls
        const firstBtn = document.getElementById('first-page');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const lastBtn = document.getElementById('last-page');
        const pageInput = document.getElementById('page-input');
        const goPageBtn = document.getElementById('go-page');
        const pageSizeSel = document.getElementById('page-size');
        
        // localStorage keys
        const STORAGE_KEY = 'page_feedback_v2';
        const VOTES_KEY = 'page_feedback_votes_v2';

        /* -----------------------------
           Auto-fill user name if available
           - Common patterns:
             1) window.currentUser = { name: "Ravi" }
             2) localStorage user_name
             3) cookie (not handled here)
           ----------------------------- */
        (function tryAutofillName() {
            // 1) window.currentUser pattern
            try {
                if (window.currentUser && window.currentUser.name) {
                    nameInput.value = window.currentUser.name;
                } else if (localStorage.getItem('user_name')) {
                    nameInput.value = localStorage.getItem('user_name');
                }
            } catch (e) { /* ignore */ }
        })();

        // save name when user types (so next time auto-fill)
        nameInput.addEventListener('change', () => {
            try { localStorage.setItem('user_name', nameInput.value.trim()); } catch (e) { }
        });

        /* -----------------------------
           Utility: escapeHtml to prevent XSS in client render
           (server must also sanitize)
           ----------------------------- */
        function escapeHtml(str) {
            return String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/\n/g, '<br>');
        }

        /* -----------------------------
           Storage helpers (server + local fallback)
           ----------------------------- */
        async function fetchPageFromServer(page, size) {
            const url = `${API_BASE}?page=${page}&size=${size}`;
            const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
            if (!res.ok) throw new Error('server error: ' + res.status);
            return await res.json(); // expect { items: [...], total: N }
        }

        function readLocal() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : { items: [], total: 0 };
            } catch (e) { return { items: [], total: 0 }; }
        }
        function saveLocal(obj) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) { }
        }

        /* -----------------------------
           Render list (uses server if available otherwise local)
           ----------------------------- */
        async function loadAndRender(page = 1, size = pageSize) {
            currentPage = Math.max(1, page);
            pageSize = size;
            serverStatusEl.textContent = 'Server: checking...';

            try {
                if (SERVER_ENABLED) {
                    // try server call
                    const data = await fetchPageFromServer(currentPage, pageSize);
                    // server should return { items: [...], total: N }
                    if (!Array.isArray(data.items)) throw new Error('invalid server response');
                    totalItems = data.total ?? data.items.length;
                    totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
                    renderItems(data.items);
                    serverStatusEl.textContent = 'Server: online';
                    updateListInfo();
                    return;
                }
            } catch (err) {
                console.warn('server fetch failed, falling back to local:', err);
                serverStatusEl.textContent = 'Server: offline — local mode';
            }

            // fallback: client-side pagination from localStorage
            const local = readLocal();
            totalItems = local.items.length;
            totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            // slice items for current page (show newest first)
            const start = (currentPage - 1) * pageSize;
            const items = local.items.slice(start, start + pageSize);
            renderItems(items);
            updateListInfo();
        }

        /* -----------------------------
           Render helper: create item DOM
           ----------------------------- */
        function renderItems(items) {
            listEl.innerHTML = '';
            if (!items || items.length === 0) {
                listEl.innerHTML = `<div class="small" style="padding:1vw;color:var(--muted)">कोई फ़ीडबैक नहीं</div>`;
                return;
            }

            const votes = readVotes();

            items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item enter';
                itemEl.dataset.id = item.id;
                itemEl.innerHTML = `
          <div class="meta">
            <div>
              <div class="who">${escapeHtml(item.name || 'Anonymous')}</div>
              </div>
              <div class="time small">${new Date(item.createdAt).toLocaleString()}</div>
            <div class="small">ID: ${item.id}</div>
          </div>
          <div class="text">${escapeHtml(item.text)}</div>

          <div class="actions" style="margin-top:0.8vw">
            <button class="pill" data-action="like">👍 <span class="small count">${item.likes || 0}</span></button>
            <button class="pill" data-action="dislike">👎 <span class="small count">${item.dislikes || 0}</span></button>
            <button class="pill" data-action="reply">💬 Reply</button>
            <button class="pill" data-action="report">🚩 Report</button>
            <div style="margin-left:auto;display:flex;gap:0.8vw;align-items:center">
              <button class="pill" data-action="view-replies">Replies <span class="small">${(item.replies || []).length}</span></button>
              <!-- delete shown only for admin -> client will show it if window.isAdmin true -->
              ${window.isAdmin ? `<button class="pill" data-action="delete" style="border-color:rgba(239,68,68,0.5)">Delete</button>` : ''}
            </div>
          </div>

          <div class="replies" style="display:none"></div>
        `;

                // attach click handler (delegation)
                itemEl.addEventListener('click', async (ev) => {
                    const btn = ev.target.closest('button');
                    if (!btn) return;
                    const action = btn.dataset.action;
                    if (!action) return;

                    if (action === 'like' || action === 'dislike') {
                        await voteItem(item.id, action);
                    } else if (action === 'reply') {
                        showReplyForm(itemEl, item);
                    } else if (action === 'view-replies') {
                        toggleReplies(itemEl, item);
                    } else if (action === 'delete') {
                        await deleteItem(item.id, item);
                    } else if (action === 'report') {
                        await reportItem(item.id);
                    }
                });

                listEl.appendChild(itemEl);
                // trigger enter animation
                requestAnimationFrame(() => { itemEl.classList.remove('enter'); itemEl.classList.add('show'); });
            });
        }

        function updateListInfo() {
            listInfoEl.textContent = `Page ${currentPage} / ${totalPages} — ${totalItems} items`;
            pageInput.value = currentPage;
        }

        /* -----------------------------
           Votes storage (client-side memory of user's vote)
           ----------------------------- */
        function readVotes() {
            try { return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}'); } catch (e) { return {}; }
        }
        function saveVotes(obj) { try { localStorage.setItem(VOTES_KEY, JSON.stringify(obj)); } catch (e) { } }

        /* -----------------------------
           voteItem: try server then fallback to local
           (toggle behavior: if already voted same -> remove)
           ----------------------------- */
        async function voteItem(itemId, action) {
            // optimistic UI: record previous for undo
            const prev = { type: 'vote', itemId, action };
            undoStack = prev;
            document.getElementById('btn-undo').disabled = false;

            try {
                if (SERVER_ENABLED) {
                    const res = await fetch(`${API_BASE}/${encodeURIComponent(itemId)}/vote`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action }) // server to handle toggle
                    });
                    if (!res.ok) throw new Error('server vote failed');
                    // server will return updated item or success; reload page
                    await loadAndRender(currentPage, pageSize);
                    return;
                }
            } catch (e) {
                console.warn('vote server failed, using local', e);
            }

            // local fallback: update localStorage item
            const state = readLocal();
            const items = state.items;
            const idx = items.findIndex(x => x.id === itemId);
            if (idx === -1) return;
            const votes = readVotes();
            const cur = votes[itemId] || null;
            if (cur === action) {
                // toggle off
                if (action === 'like') items[idx].likes = Math.max(0, (items[idx].likes || 0) - 1);
                else items[idx].dislikes = Math.max(0, (items[idx].dislikes || 0) - 1);
                delete votes[itemId];
            } else {
                if (action === 'like') {
                    items[idx].likes = (items[idx].likes || 0) + 1;
                    if (cur === 'dislike') items[idx].dislikes = Math.max(0, (items[idx].dislikes || 0) - 1);
                } else {
                    items[idx].dislikes = (items[idx].dislikes || 0) + 1;
                    if (cur === 'like') items[idx].likes = Math.max(0, (items[idx].likes || 0) - 1);
                }
                votes[itemId] = action;
            }
            saveLocal({ items: items, total: items.length });
            saveVotes(votes);
            await loadAndRender(currentPage, pageSize);
        }

        /* -----------------------------
           Reply: show inline reply form and submit
           ----------------------------- */
        function showReplyForm(itemEl, item) {
            const repliesEl = itemEl.querySelector('.replies');
            // show small inline form at top
            repliesEl.style.display = 'block';
            if (repliesEl.querySelector('.reply-input')) return; // already shown

            const input = document.createElement('div');
            input.innerHTML = `
        <div style="display:flex;gap:0.8vw;align-items:center;margin-bottom:0.8vw">
          <input class="reply-input" placeholder="Reply लिखें..." style="flex:1;padding:0.8vw;border-radius:0.8vw;border:0.1vw solid rgba(255,255,255,0.04);background:transparent;color:inherit" />
          <button class="pill send-reply">Send</button>
        </div>
      `;
            repliesEl.prepend(input);

            input.querySelector('.send-reply').addEventListener('click', async () => {
                const text = input.querySelector('.reply-input').value.trim();
                if (!text) return;
                const replyObj = { name: nameInput.value.trim() || 'Guest', text, createdAt: Date.now() };

                // save previous for undo
                undoStack = { type: 'reply', parentId: item.id, reply: replyObj };
                document.getElementById('btn-undo').disabled = false;

                try {
                    if (SERVER_ENABLED) {
                        const res = await fetch(`${API_BASE}/${encodeURIComponent(item.id)}/reply`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(replyObj)
                        });
                        if (!res.ok) throw new Error('server reply failed');
                        await loadAndRender(currentPage, pageSize);
                        return;
                    }
                } catch (e) {
                    console.warn('server reply failed, local fallback', e);
                }

                // local fallback: push to localStorage
                const st = readLocal();
                const idx = st.items.findIndex(x => x.id === item.id);
                if (idx === -1) return;
                st.items[idx].replies = st.items[idx].replies || [];
                st.items[idx].replies.push({ id: 'r_' + Date.now(), ...replyObj, likes: 0, dislikes: 0 });
                saveLocal({ items: st.items, total: st.items.length });
                await loadAndRender(currentPage, pageSize);
            });
        }

        /* -----------------------------
           toggleReplies: shows replies list (client-side)
           ----------------------------- */
        function toggleReplies(itemEl, item) {
            const repliesEl = itemEl.querySelector('.replies');
            if (!repliesEl) return;
            if (repliesEl.style.display === 'block') {
                repliesEl.style.display = 'none';
                return;
            }
            repliesEl.style.display = 'block';
            // render replies (client fallback only; server response already includes replies when loaded)
            const reps = item.replies || [];
            // clear except reply input (keep)
            const existingInput = repliesEl.querySelector('.reply-input');
            repliesEl.innerHTML = '';
            if (reps.length === 0) {
                repliesEl.innerHTML = `<div class="small" style="color:var(--muted)">कोई reply नहीं</div>`;
            } else {
                reps.forEach(r => {
                    const rEl = document.createElement('div');
                    rEl.className = 'reply';
                    rEl.innerHTML = `<div style="display:flex;justify-content:space-between"><div><strong>${escapeHtml(r.name)}</strong><div class="small">${new Date(r.createdAt).toLocaleString()}</div></div>
                           <div style="display:flex;gap:0.8vw"><button class="pill reply-like">👍 ${r.likes || 0}</button><button class="pill reply-dislike">👎 ${r.dislikes || 0}</button></div></div>
                           <div style="margin-top:0.8vw">${escapeHtml(r.text)}</div>`;
                    repliesEl.appendChild(rEl);
                });
            }
            // append reply input area
            const input = document.createElement('div');
            input.innerHTML = `<div style="display:flex;gap:0.8vw;align-items:center;margin-top:0.8vw">
        <input class="reply-input" placeholder="Write Reply..." style="flex:1;padding:0.8vw;border-radius:0.8vw;border:0.1vw solid rgba(255,255,255,0.04);background:transparent;color:inherit" />
        <button class="pill send-reply">Send</button>
      </div>`;
            repliesEl.appendChild(input);
            input.querySelector('.send-reply').addEventListener('click', async () => {
                const text = input.querySelector('.reply-input').value.trim();
                if (!text) return;
                // reuse showReplyForm behavior by creating replyObj and calling server/local push
                const replyObj = { name: nameInput.value.trim() || 'Guest', text, createdAt: Date.now() };
                undoStack = { type: 'reply', parentId: item.id, reply: replyObj };
                document.getElementById('btn-undo').disabled = false;
                try {
                    if (SERVER_ENABLED) {
                        const res = await fetch(`${API_BASE}/${encodeURIComponent(item.id)}/reply`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(replyObj)
                        });
                        if (!res.ok) throw new Error('server reply failed');
                        await loadAndRender(currentPage, pageSize); return;
                    }
                } catch (e) { console.warn('server reply failed, local fallback', e); }
                const st = readLocal();
                const idx = st.items.findIndex(x => x.id === item.id);
                if (idx === -1) return;
                st.items[idx].replies = st.items[idx].replies || [];
                st.items[idx].replies.push({ id: 'r_' + Date.now(), ...replyObj, likes: 0, dislikes: 0 });
                saveLocal({ items: st.items, total: st.items.length });
                await loadAndRender(currentPage, pageSize);
            });
        }

        /* -----------------------------
           deleteItem (moderation) — server preferred
           ----------------------------- */
        async function deleteItem(itemId, item) {
            if (!confirm('DO you Realy want to remove feedback?(it removed peremently)')) return;
            // save undo (store full item)
            undoStack = { type: 'delete', item };
            document.getElementById('btn-undo').disabled = false;

            try {
                if (SERVER_ENABLED) {
                    const res = await fetch(`${API_BASE}/${encodeURIComponent(itemId)}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('server delete failed');
                    await loadAndRender(currentPage, pageSize);
                    return;
                }
            } catch (e) { console.warn('server delete failed, local fallback', e); }

            // local fallback: remove from localStorage
            const st = readLocal();
            st.items = st.items.filter(x => x.id !== itemId);
            saveLocal({ items: st.items, total: st.items.length });
            await loadAndRender(currentPage, pageSize);
        }

        /* -----------------------------
           reportItem — user reports item to server (or local flag)
           ----------------------------- */
        async function reportItem(itemId) {
            if (!confirm('Do yu wnt to send report?')) return;
            try {
                if (SERVER_ENABLED) {
                    const res = await fetch(`${API_BASE}/${encodeURIComponent(itemId)}/report`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'user_report' })
                    });
                    if (!res.ok) throw new Error('report failed');
                    alert('Report send, Thanks।');
                    return;
                }
            } catch (e) { console.warn('report server failed, local fallback', e); alert('Server not found, report saved locally।'); }
            // local fallback: mark item.reported true
            const st = readLocal();
            const idx = st.items.findIndex(x => x.id === itemId);
            if (idx === -1) return;
            st.items[idx].reported = true;
            saveLocal({ items: st.items, total: st.items.length });
            await loadAndRender(currentPage, pageSize);
        }

        /* -----------------------------
           delete/undo behavior
           - Undo attempts server undo if available, else local reversal
           ----------------------------- */
        async function performUndo() {
            if (!undoStack) { alert('Undo stack empty'); return; }
            const u = undoStack; undoStack = null;
            document.getElementById('btn-undo').disabled = true;

            try {
                if (SERVER_ENABLED && u.type === 'delete') {
                    // optional server undo — POST /api/feedback/undo { actionId or item }
                    const res = await fetch(`${API_BASE}/undo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', item: u.item }) });
                    if (res.ok) { await loadAndRender(currentPage, pageSize); return; }
                }
            } catch (e) { console.warn('server undo failed', e); }

            // local undo implementations
            if (u.type === 'delete') {
                const st = readLocal();
                st.items.unshift(u.item); // put back at top
                saveLocal({ items: st.items, total: st.items.length });
                await loadAndRender(currentPage, pageSize);
                alert('Delete undone (local).');
            } else if (u.type === 'reply') {
                // remove the temporary reply we added (match by timestamp/text)
                const st = readLocal();
                const p = st.items.find(x => x.id === u.parentId);
                if (p && p.replies) {
                    p.replies = p.replies.filter(r => !(r.text === u.reply.text && r.createdAt === u.reply.createdAt));
                    saveLocal({ items: st.items, total: st.items.length });
                }
                await loadAndRender(currentPage, pageSize);
                alert('Reply undone (local).');
            } else if (u.type === 'vote') {
                // votes are toggles — we simply reload and clear saved vote so UI will reflect opposite
                const votes = readVotes();
                delete votes[u.itemId];
                saveVotes(votes);
                await loadAndRender(currentPage, pageSize);
                alert('Vote undone (local).');
            }
        }

        // wire undo button
        document.getElementById('btn-undo').addEventListener('click', performUndo);
        document.getElementById('btn-undo').disabled = true;

        /* -----------------------------
           create new feedback (submit)
           - try server POST then fallback to local
           ----------------------------- */
        form.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            const text = msgInput.value.trim();
            if (!text) return alert('Write feedback first');
            const name = nameInput.value.trim() || 'Guest';
            const obj = { id: 'f_' + Date.now(), name, text, createdAt: Date.now(), likes: 0, dislikes: 0, replies: [] };

            // save name preference
            try { localStorage.setItem('user_name', name); } catch (e) { }

            // set undo (allow undo of create by deleting recently created item)
            undoStack = { type: 'create', item: obj };
            document.getElementById('btn-undo').disabled = false;

            try {
                if (SERVER_ENABLED) {
                    const res = await fetch(API_BASE, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, text })
                    });
                    if (!res.ok) throw new Error('server create failed');
                    // server likely returns created item; reload
                    await loadAndRender(1, pageSize);
                    msgInput.value = ''; // clear
                    return;
                }
            } catch (e) { console.warn('server create failed, local fallback', e); }

            // local fallback: prepend to localStorage and show
            const st = readLocal();
            st.items = st.items || [];
            st.items.unshift(obj);
            st.total = st.items.length;
            saveLocal({ items: st.items, total: st.total });
            msgInput.value = '';
            await loadAndRender(1, pageSize);
        });

        /* -----------------------------
           clear local storage (dev helper)
           ----------------------------- */
        document.getElementById('btn-clear').addEventListener('click', () => {
            if (!confirm('Local data हटाना है?')) return;
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(VOTES_KEY);
            loadAndRender(1, pageSize);
        });

        /* -----------------------------
           Pagination controls wiring
           ----------------------------- */
        firstBtn.addEventListener('click', () => { if (currentPage > 1) loadAndRender(1, pageSize); });
        prevBtn.addEventListener('click', () => { if (currentPage > 1) loadAndRender(currentPage - 1, pageSize); });
        nextBtn.addEventListener('click', () => { if (currentPage < totalPages) loadAndRender(currentPage + 1, pageSize); });
        lastBtn.addEventListener('click', () => { if (currentPage < totalPages) loadAndRender(totalPages, pageSize); });
        goPageBtn.addEventListener('click', () => {
            const p = parseInt(pageInput.value, 10) || 1;
            const pg = Math.max(1, Math.min(totalPages, p));
            loadAndRender(pg, pageSize);
        });
        pageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') goPageBtn.click(); });
        pageSizeSel.addEventListener('change', () => {
            pageSize = parseInt(pageSizeSel.value, 10);
            loadAndRender(1, pageSize);
        });

        /* -----------------------------
           On initial load, seed local demo data if empty
           ----------------------------- */
        (function seedIfEmpty() {
            const st = readLocal();
            if (!st.items || st.items.length === 0) {
                const demo = [
                    { id: 'f_demo1', name: 'Ravi', text: 'बहुत अच्छा पेज!', createdAt: Date.now() - 3600000, likes: 2, dislikes: 0, replies: [{ id: 'r1', name: 'Owner', text: 'Thank you!', createdAt: Date.now() - 1800000, likes: 1, dislikes: 0 }] },
                    { id: 'f_demo2', name: 'Anita', text: 'मोबाइल लेआउट ठीक करें।', createdAt: Date.now() - 7200000, likes: 1, dislikes: 0, replies: [] }
                ];
                saveLocal({ items: demo, total: demo.length });
            }
        })();

        // initial load
        loadAndRender(currentPage, pageSize).catch(e => { console.error('initial load error', e); });

        /* -----------------------------
           Accessibility: allow Enter to send reply inside dynamic forms (delegated)
           ----------------------------- */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const active = document.activeElement;
                if (!active) return;
                if (active.classList.contains('reply-input')) {
                    // find sibling send button
                    const parent = active.closest('.replies') || active.parentElement;
                    const send = parent.querySelector('.send-reply');
                    if (send) send.click();
                }
            }
        });

        document.getElementById("hide-feedback").addEventListener("click", () => {
            // textToSpeechEng('Close feedback');
            document.getElementById("feedbackPopup").style.display = "none";
            // document.getElementById("hide-leaderboard").textContent = "Hide Leaderboard";
            // document.getElementById("toggle-leaderboard").textContent = "Global Leaderboard";
          });
          
        /* -----------------------------
           Final notes for server implementer (copy into your backend README):
           - Sanitize all incoming fields (name, text, replies) server-side.
           - Validate sizes/lengths and rate-limit posting/reporting APIs.
           - Provide server-side pagination: accept page & size, return total count.
           - Implement idempotency for vote toggles (store per-user votes).
           - Admin-only DELETE should verify admin auth.
           ----------------------------- */