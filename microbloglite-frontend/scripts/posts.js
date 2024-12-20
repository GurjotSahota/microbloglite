"use strict";

const postList = document.getElementById("post-list");
const newPostForm = document.getElementById("new-post-form");
const logoutButton = document.getElementById("logout-button");
const filterToggle = document.getElementById("filter-toggle");

let allPosts = []; // Store all posts globally

// Fetch and display posts
function loadPosts() {
    const loginData = getLoginData();

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(`${apiBaseURL}/api/posts`, options)
        .then(response => response.json())
        .then(posts => {
            allPosts = posts; 
            renderPosts();
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
            alert("Unable to load posts. Please try again later.");
        });
}

// shows posts based on the toggle filter
function renderPosts() {
    const loginData = getLoginData();
    const showOwnPosts = filterToggle.checked;

    postList.innerHTML = ""; // Clear existing posts

    allPosts
        .filter(post => !showOwnPosts || post.username === loginData.username)
        .forEach(post => {
            
            const postElement = document.createElement("div");
            postElement.classList.add("card", "mb-3");

            
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            
            const postTitle = document.createElement("h5");
            postTitle.classList.add("card-title");
            postTitle.textContent = post.username;

           
            const postText = document.createElement("p");
            postText.classList.add("card-text");
            postText.textContent = post.text;

            
            const postTime = document.createElement("p");
            postTime.classList.add("card-text");
            const timestamp = document.createElement("small");
            timestamp.classList.add("text-muted");
            timestamp.textContent = new Date(post.createdAt).toLocaleString();
            postTime.appendChild(timestamp);
// Add Edit and Delete Buttons
if (post.username === loginData.username) {
    const editPost = document.createElement("button");
    editPost.innerText = "Edit";
    editPost.className = "btn btn-dark me-2 rounded-5";
    editPost.addEventListener("click", () => {
        location.href = `editPost.html?_id=${post._id}`;
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "btn btn-dark rounded-5";
    deleteButton.addEventListener("click", async () => {
        if (post._id) {
            try {
                const options = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${loginData.token}`,
                    },
                };

                const response = await fetch(`${apiBaseURL}/api/posts/${post._id}`, options);
                if (response.ok) {
                    alert("Post deleted successfully!");
                    loadPosts(); // Reload posts after deletion
                } else {
                    const errorData = await response.json();
                    console.error("Error deleting post:", errorData);
                    alert("Unable to delete post. Please try again later.");
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("An error occurred. Please try again later.");
            }
        }
    });

    cardBody.appendChild(editPost);
    cardBody.appendChild(deleteButton);
}

cardBody.appendChild(postTitle);
cardBody.appendChild(postText);
cardBody.appendChild(postTime);

postElement.appendChild(cardBody);
postList.appendChild(postElement);
});
}

// New submission
newPostForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const loginData = getLoginData();
    const postContent = document.getElementById("post-content").value;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({ text: postContent }),
    };

    fetch(`${apiBaseURL}/api/posts`, options)
        .then(response => response.json())
        .then(post => {
            alert("Post created successfully!");
            newPostForm.reset();
            loadPosts(); // Reloading posts after submission
        })
        .catch(error => {
            console.error("Error creating post:", error);
            alert("Unable to create post. Please try again later.");
        });
});

// filter toggle change
filterToggle.addEventListener("change", renderPosts);


logoutButton.addEventListener("click", function () {
    logout();
});

loadPosts();