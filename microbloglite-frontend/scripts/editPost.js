"use strict";

const editPostForm = document.getElementById("edit-post-form");
const postContentTextarea = document.getElementById("edit-post-content");
const postId = new URLSearchParams(window.location.search).get("_id");

if (!postId) {
    alert("Invalid post ID. Redirecting to posts page.");
    window.location.replace("posts.html");
}

function loadPostContent() {
    const loginData = getLoginData();

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(`${apiBaseURL}/api/posts/${postId}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch post content.");
            }
            return response.json();
        })
        .then(post => {
            postContentTextarea.value = post.text;
        })
        .catch(error => {
            console.error("Error loading post content:", error);
            alert("Unable to load post content. Redirecting to posts page.");
            window.location.replace("posts.html");
        });
}

loadPostContent();
