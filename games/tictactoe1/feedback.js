// 🔐 Fake login object (replace with real login)
let loggedInUser = null;
// Example:
// loggedInUser = { name: "Ravi", email: "ravi@gmail.com" };

function getUser() {
  if (loggedInUser) return loggedInUser;

  return {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim()
  };
}

function getFeedbacks() {
  return JSON.parse(localStorage.getItem("feedbacks") || "[]");
}

function saveFeedbacks(data) {
  localStorage.setItem("feedbacks", JSON.stringify(data));
}

function submitFeedback() {
  const user = getUser();
  const text = document.getElementById("text").value.trim();
  const rating = parseInt(document.getElementById("rating").value);

  if (!user.name || !text) {
    alert("Name & feedback required");
    return;
  }

  const feedbacks = getFeedbacks();

  feedbacks.unshift({
    id: Date.now(),
    name: user.name,
    email: user.email || "",
    text,
    rating,
    likes: [],
    dislikes: [],
    createdAt: new Date().toLocaleString()
  });

  saveFeedbacks(feedbacks);
  renderFeedbacks();
}

function likeDislike(id, type) {
  const user = getUser();
  if (!user.name) return alert("Name required");

  const feedbacks = getFeedbacks();
  const fb = feedbacks.find(f => f.id === id);

  if (fb.likes.includes(user.name) || fb.dislikes.includes(user.name)) {
    return alert("Already voted");
  }

  fb[type].push(user.name);
  saveFeedbacks(feedbacks);
  renderFeedbacks();
}

function updateRating(id, newRating) {
  const user = getUser();
  const feedbacks = getFeedbacks();
  const fb = feedbacks.find(f => f.id === id);

  if (fb.name !== user.name) {
    return alert("You can change only your rating");
  }

  fb.rating = newRating;
  saveFeedbacks(feedbacks);
  renderFeedbacks();
}

function renderFeedbacks() {
  const list = document.getElementById("feedbackList");
  const feedbacks = getFeedbacks();

  list.innerHTML = "";

  feedbacks.forEach(fb => {
    list.innerHTML += `
      <div class="feedback-box">
        <b>${fb.name}</b> ⭐ ${fb.rating}<br>
        <small>${fb.createdAt}</small>
        <p>${fb.text}</p>

        <div class="actions">
          👍 ${fb.likes.length}
          <button onclick="likeDislike(${fb.id}, 'likes')">Like</button>

          👎 ${fb.dislikes.length}
          <button onclick="likeDislike(${fb.id}, 'dislikes')">Dislike</button>
        </div>

        <div>
          Change Rating:
          <select onchange="updateRating(${fb.id}, this.value)">
            ${[0,1,2,3,4].map(r =>
              `<option ${r==fb.rating?'selected':''}>${r}</option>`
            ).join("")}
          </select>
        </div>
      </div>
    `;
  });
}

renderFeedbacks();
