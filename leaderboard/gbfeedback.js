import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../leaderboard/config.js';
import { supabase } from '../supabaseClient.js';

const { data } = await supabase.from('feedback').select('*');

// <!-- Feedback Modal javascript-->
const modal = document.getElementById('gb-feedbackModal');
const openBtn = document.getElementById('openFeedback');
const closeBtn = document.getElementById('feedbackCloseBtn');
const submitBtn = document.getElementById('submitFeedback');
const list = document.getElementById('feedbackList');
const userName = document.getElementById('userName')

window.name = localStorage.getItem('player_name') || 'Human1';
window.email = localStorage.getItem('email') || '-';
userName.textContent = window.name;
let liked = 0;
let disliked = 0;
let userRating = 5;

// modal.style.display = 'none';
// openBtn.onclick = () => modal.classList.add('show');
// closeBtn.onclick = () => modal.classList.remove('show');

function formatIST(dateStr) {
    const date = new Date(dateStr);

    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }) + " IST";
}

async function loadFeedback() {
    const { data: feedbacks, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const list = document.getElementById("feedbackList");
    list.innerHTML = "";

    for (const f of feedbacks) {

        const { data: replies } = await supabase
            .from("replies")
            .select("*")
            .eq("feedback_id", f.id)
            .order("created_at", { ascending: true });

        const div = document.createElement("div");
        div.className = "feedback";

        div.innerHTML = `
<div style="display:flex; justify-content:space-between;margin-left:1vw;">
<strong>${f.name}</strong>
<small claas="gf-small">${formatIST(f.created_at)}</small>
</div>

<div style="text-align:left";>${f.message}</div>

<div style="margin-top:0.6vw;">
<button onclick="like(${f.id})" class="gb-feedback-btn">👍 ${f.likes}</button>
<button onclick="dislike(${f.id})" class="gb-feedback-btn">👎 ${f.dislikes}</button>
<button onclick="addReply(${f.id})" class="gb-feedback-btn">💬 Reply</button>
</div>

<div style="margin-top:1vw;">
${renderReplies(replies)}
</div>
`;

        if (isAdmin((await supabase.auth.getUser()).data.user)) {
            div.innerHTML += `<button onclick="remove(${f.id})">❌ Delete</button>`;
        }

        list.appendChild(div);
    }
}


submitBtn.onclick = async () => {
    console.log("Feedback button clicked");
    const text = userFeedback.value.trim();
    if (!text) return alert('Please Fill feedback');
    console.log("Feedback button clicked", window.name, text, userRating, liked, disliked);

    await supabase.from('feedback').insert([
        { name: window.name, message: text, rating: userRating, likes: liked, dislikes: disliked }
    ]);

    userFeedback.value = '';
    loadFeedback();
};

loadFeedback();

const ADMIN_EMAIL = "rnsaraswat32@gmail.com";


function isAdmin(user) {
    return user?.email === ADMIN_EMAIL;
}

async function remove(id) {
    if (!confirm('Delete feedback?')) return;
    await supabase.from('feedback').delete().eq('id', id);
    loadFeedback();
}

supabase.channel('feedback-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, loadFeedback)
    .subscribe();

async function report(id) {
    console.log("Feedback report", id);
    await supabase.from('reports').insert([{ feedback_id: id }]);
    alert('Reported');
}

async function rating(id) {
    console.log("Feedback rating", id);
    userRating = document.getElementById("ratingSelect").value;
    const { data, error } = await supabase
        .from('feedback')
        .update({ rating: newRating })
        .eq('id', userId)
        .select();
    await supabase.from('feedback').insert([{ feedback_id: id }]);
    alert('Rating updateed');
}

async function like(id) {
    const user = (await supabase.auth.getUser()).data.user;
    if (window.email) {
        const { data, error } = await supabase.from('likes').select('*').eq('feedback_id', id).eq('user_email', window.email).maybeSingle();
        if (error && error.code !== 'PGRST116') { console.error(error); return; }

        if (!data) {
            await supabase.from('likes').insert([{ feedback_id: id, name: window.name, user_email: email }]);
            await supabase.rpc('update_like_count', { fid: id, diff: 1 }); loadFeedback(); alert(`if Record not found added ${window.name} ${window.email}`); return;
        }

        const newLike = data.liked === 1 ? 0 : 1;
        const diff = newLike === 1 ? 1 : -1;

        await supabase.from('likes').update({ liked: newLike }).eq('id', data.id);

        await supabase.rpc('update_like_count', { fid: id, diff });
        loadFeedback();
        alert(`if Record found / Updated ${window.name} ${window.email}`);
    } else {
        const { data } = await supabase.from('likes').select('*').eq('feedback_id', id).eq('name', window.name).maybeSingle();
        if (error && error.code !== 'PGRST116') { console.error(error); return; }

        if (!data) {
            await supabase.from('likes').insert([{ feedback_id: id, name: window.name, user_email: email }]);
            await supabase.rpc('update_like_count', { fid: id, diff: 1 }); loadFeedback(); return;
        }

        const newLike = data.liked === 1 ? 0 : 1;
        const diff = newLike === 1 ? 1 : -1;

        await supabase.from('likes').update({ liked: newLike }).eq('id', data.id);

        await supabase.rpc('update_like_count', { fid: id, diff });
        loadFeedback();
    }
}

async function dislike(id) {

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Login required");

    const email = user.email;

    const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('feedback_id', id)
        .eq('user_email', email)
        .single();

    if (!data) {

        await supabase.from('likes').insert([{
            feedback_id: id,
            user_email: email,
            liked: 0,
            disliked: 1
        }]);

        await supabase.rpc('update_dislike_count', { fid: id });
        loadFeedback();
        return;
    }

    const newDislike = data.disliked === 1 ? 0 : 1;
    const diff = newDislike === 1 ? 1 : -1;

    await supabase
        .from('likes')
        .update({ disliked: newDislike })
        .eq('id', data.id);

    await supabase.rpc('update_dislike_count', {
        fid: id,
        diff: diff
    });

    const { data: replies } = await supabase
        .from("replies")
        .select("*")
        .eq("feedback_id", f.id)
        .order("created_at");

    loadFeedback();
}

document.getElementById("likeBtn").addEventListener("click", () => {
    document.getElementById("likeBtn").classList.toggle("gf-active-like");
    if (document.getElementById("likeBtn").classList.contains("gf-active-like")) {
        liked = 1;
    } else {
        liked = 0;
    }
});

document.getElementById("dislikeBtn").addEventListener("click", () => {
    document.getElementById("dislikeBtn").classList.toggle("gf-active-dislike");
    if (document.getElementById("dislikeBtn").classList.contains("gf-active-dislike")) {
        disliked = 1;
    } else {
        disliked = 0;
    }
});

document.getElementById("ratingSelect").addEventListener("change", function () {
    userRating = document.getElementById("ratingSelect").value;
});

document.getElementById("ratingSelect").addEventListener("change", function () {
    console.log("New Rating " + this.value);
    userRating = document.getElementById("ratingSelect").value;
});

async function addReply(feedbackId, parentReplyId = null) {
    const name = prompt("Reply name:");
    const message = prompt("Reply message:");

    if (!name || !message) return;

    const isAdmin = name.toLowerCase() === "admin";
    // const isAdmin = true;

    await supabase.from("replies").insert([{
        feedback_id: feedbackId,
        parent_reply_id: parentReplyId,
        name,
        message,
        is_admin: isAdmin
    }]);

    loadFeedback();
}

async function loadReplies(feedbackId) {
    const { data, error } = await supabase
        .from("replies")
        .select("*")
        .eq("feedback_id", feedbackId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

async function replyLike(id) {
    const { data, error } = await supabase.from('likes').select('*').eq('feedback_id', id).eq('name', window.name).maybeSingle();
        if (error && error.code !== 'PGRST116') { console.error(error); return; }

        if (!data) {
            await supabase.from('likes').insert([{ feedback_id: id, name: window.name, user_email: email }]);
            await supabase.rpc('update_reply_like', { fid: id, diff: 1 }); loadFeedback(); return;
        }

        const newLike = data.liked === 1 ? 0 : 1;
        const diff = newLike === 1 ? 1 : -1;

        await supabase.from('likes').update({ liked: newLike }).eq('id', data.id);

        await supabase.rpc('update_reply_like', { fid: id, diff });
        loadFeedback();
}

async function replyDislike(id) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Login required");
    const email = user.email;
    const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('feedback_id', id)
        .eq('user_email', email)
        .single();
    if (!data) {
        await supabase.from('likes').insert([{
            feedback_id: id,
            user_email: email,
            liked: 0,
            disliked: 1
        }]);
        await supabase.rpc('update_reply_dislike', { fid: id });
        loadFeedback();
        return;
    }

    const newDislike = data.disliked === 1 ? 0 : 1;
    const diff = newDislike === 1 ? 1 : -1;
    await supabase
        .from('likes')
        .update({ disliked: newDislike })
        .eq('id', data.id);
    await supabase.rpc('update_reply_dislike', {
        fid: id,
        diff: diff
    });
    const { data: replies } = await supabase
        .from("replies")
        .select("*")
        .eq("feedback_id", f.id)
        .order("created_at");

    loadFeedback();
}

async function deleteReply(id) {
    if (!confirm("Delete reply?")) return;

    await supabase.from("replies").delete().eq("id", id);
    loadFeedback();
}

function renderReplies(replies, parentId = null, level = 0) {
    if (!replies) return "";

    return replies
        .filter(r => r.parent_reply_id === parentId)
        .map(r => `
<div style="
margin-left:${level * 2}vw;
border-left:0.2vw solid #ccc;
padding-left:1vw;
margin-top:0.6vw;
">
<div style="display:flex; justify-content:space-between;margin-left:3vw;">
  <strong>${r.name}</strong>
  ${r.is_admin ? '<span style="color:red;">[ADMIN]</span>' : ''}
  <small claas="gf-small">${formatIST(r.created_at)}</small>
</div>

<div style="text-align:left";>${r.message}</div>

<div>
  <button onclick="replyLike(${r.id})" class="feedback-btn">👍 ${r.likes}</button>
  <button onclick="replyDislike(${r.id})" class="feedback-btn">👎 ${r.dislikes}</button>
  <button onclick="addReply(${r.feedback_id}, ${r.id})" class="feedback-btn">💬 Reply</button>
  ${r.is_admin ? `<button onclick="deleteReply(${r.id})" class="feedback-btn">❌</button>` : ""}
</div>

${renderReplies(replies, r.id, level + 1)}
</div>
`)
        .join("");
}

function formatCustomDateIntl(date) {
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        hour12: false
    };

    const formatted = new Intl.DateTimeFormat('en-GB', options).format(date);
    const parts = formatted.split(', ');
    const [dayMonthYear, time] = parts;

    const [day, monthNum, year] = dayMonthYear.split('/');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(monthNum, 10) - 1];

    return `${day} ${monthName} ${year} ${time} ${parts[2]}`;
}

function formatCustomDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const timeZoneString = date.toString().match(/\(([A-Z]+)\)/)?.[1] || date.toString().split(' ').slice(-1)[0];

    const offset = date.getTimezoneOffset();
    const offsetAbs = Math.abs(offset);
    const offsetSign = offset > 0 ? '-' : '+';
    const offsetHours = Math.floor(offsetAbs / 60).toString().padStart(2, '0');
    const offsetMinutes = (offsetAbs % 60).toString().padStart(2, '0');
    const numericTimeZone = `GMT${offsetSign}${offsetHours}${offsetMinutes}`;

    const finalTimeZone = timeZoneString && timeZoneString.length <= 4 ? timeZoneString : numericTimeZone;

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${finalTimeZone}`;
}

window.like = like;
window.dislike = dislike;
window.report = report;
window.addReply = addReply;
window.remove = remove;
window.replyLike = replyLike;
window.replyDislike = replyDislike;