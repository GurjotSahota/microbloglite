"use strict";

const registerForm = document.querySelector("#register-form");

registerForm.onsubmit = function (event) {
    event.preventDefault(); 

    const fullName = document.getElementById("full-name").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate the passowrd
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const userData = {
        fullName: fullName,
        username: username,
        password: password,
    };

    // Send registration request to the API
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    };

    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", options)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to register. Please check the details and try again.");
            }
            return response.json();
        })
        .then(data => {
            alert("Registration successful! You can now log in.");
            window.location.assign("index.html"); 
        })
        .catch(error => {
            console.error("Error during registration:", error);
            alert("An error occurred. Please try again later.");
        });
};
