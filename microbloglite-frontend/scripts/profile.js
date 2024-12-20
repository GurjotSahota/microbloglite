"use strict";

const fullNameDisplay = document.getElementById("full-name-display");
const usernameDisplay = document.getElementById("username-display");

const editInfoForm = document.getElementById("edit-info-form");

// Fetch and display user information
function loadUserInfo() {
    const loginData = getLoginData();

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(`${apiBaseURL}/api/users/${loginData.username}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch user information.");
            }
            return response.json();
        })
        .then(user => {
            fullNameDisplay.textContent = user.fullName || "N/A";
            usernameDisplay.textContent = user.username;
        })
        .catch(error => {
            console.error("Error fetching user info:", error);
            alert("Failed to load user information. Please try again.");
        });
}

// Update user information
editInfoForm.onsubmit = function (event) {
    event.preventDefault();

    const newFullName = document.getElementById("new-full-name").value;
    const newPassword = document.getElementById("new-password").value;

    const loginData = getLoginData();
    const updatedData = {};

    if (newFullName) updatedData.fullName = newFullName;
    if (newPassword) updatedData.password = newPassword;

    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify(updatedData),
    };

    fetch(`${apiBaseURL}/api/users/${loginData.username}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update user information.");
            }
            return response.json();
        })
        .then(data => {
            alert("Your information has been updated!");
            loadUserInfo(); // Refresh user information
        })
        .catch(error => {
            console.error("Error updating user info:", error);
            alert("An error occurred while updating your information. Please try again.");
        });
};

// Load user information on page load
loadUserInfo();

// Logout button
document.getElementById("logout-button").addEventListener("click", function () {
    logout();
});
