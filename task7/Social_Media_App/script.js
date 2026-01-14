let currentUser = null;

window.onload = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        currentUser = user;
        showApp();
    }
};

function signup() {
    const name = getName();
    const email = getEmail();
    const password = getPassword();

    if (!name || !email || !password) return alert("Please fill all fields");

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) return alert("Email already exists");

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created! Please log in.");
}

function login() {
    const email = getEmail();
    const password = getPassword();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return alert("Invalid credentials");

    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    showApp();
}

function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

function showApp() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    document.getElementById("username").innerText = currentUser.name;
    renderPosts();
}

function createPost() {
    const text = document.getElementById("postText").value;
    if (!text) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift({
        user: currentUser.name,
        text,
        likes: 0,
        comments: []
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    document.getElementById("postText").value = "";
    renderPosts();
}

function renderPosts() {
    const feed = document.getElementById("feed");
    feed.innerHTML = "";

    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.forEach((p, i) => {
        const post = document.createElement("div");
        post.className = "post";
        post.innerHTML = `
            <strong>${p.user}</strong>
            <p>${p.text}</p>
            <div class="actions">
                <button onclick="likePost(${i})">❤️ ${p.likes}</button>
                <button onclick="commentPost(${i})">💬 Comment</button>
            </div>
            <div class="comments"></div>
        `;
        const commentsDiv = post.querySelector(".comments");
        p.comments.forEach(c => {
            const pEl = document.createElement("p");
            pEl.innerText = `${c.user}: ${c.text}`;
            commentsDiv.appendChild(pEl);
        });
        feed.appendChild(post);
    });
}

function likePost(i) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts[i].likes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function commentPost(i) {
    const text = prompt("Enter comment:");
    if (!text) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts[i].comments.push({ user: currentUser.name, text });
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function getName() { return document.getElementById("name").value; }
function getEmail() { return document.getElementById("email").value; }
function getPassword() { return document.getElementById("password").value; }
