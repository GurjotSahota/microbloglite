"use strict";

const postHistoryList = document.getElementById("post-history-list");
const logoutButton = document.getElementById("logout-button");

function loadUserPosts() {
    const loginData = getLoginData();

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(`${apiBaseURL}/api/posts`, options)
        .then((response) => response.json())
        .then((posts) => {
            const userPosts = posts.filter((post) => post.username === loginData.username);
            renderUserPosts(userPosts);
        })
        .catch((error) => {
            console.error("Error fetching user posts:", error);
            alert("Unable to load your posts. Please try again later.");
        });
}


function renderUserPosts(posts) {
    postHistoryList.innerHTML = ""; 

    posts.forEach((post) => {
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

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("btn-group");

        
        const editPost = document.createElement("button");
        editPost.innerText = "Edit";
        editPost.className = "btn btn-primary text-white";
        editPost.addEventListener("click", () => {
            location.href = `editPost.html?_id=${post._id}`;
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.className = "btn btn-danger text-white";
        deleteButton.addEventListener("click", async () => {
            if (post._id) {
                try {
                    const options = {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${getLoginData().token}`,
                        },
                    };

                    const response = await fetch(`${apiBaseURL}/api/posts/${post._id}`, options);
                    if (response.ok) {
                        alert("Post deleted successfully!");
                        loadUserPosts(); 
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

        buttonGroup.appendChild(editPost);
        buttonGroup.appendChild(deleteButton);

        cardBody.appendChild(postTitle);
        cardBody.appendChild(postText);
        cardBody.appendChild(postTime);
        cardBody.appendChild(buttonGroup);

        postElement.appendChild(cardBody);
        postHistoryList.appendChild(postElement);
    });
}


loadUserPosts();
