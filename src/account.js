import { getAuth, EmailAuthProvider, sendEmailVerification, updateEmail, updatePassword, sendPasswordResetEmail, reauthenticateWithCredential } from "firebase/auth";

// Function to verify email
function verifyEmail(user) {
    sendEmailVerification(user)
        .then(() => {
            _alert("info", "Check Your Email", `Email verification link sent to ${user.email}!`);
        })
        .catch((error) => {
            console.error("Error sending email verification:", error);
            _alert("error", "Error", "Failed to send verification email.");
        });
}

// Function to update email
async function putEmail(user) {
    if (user) {
        const fields = [
            { type: "password", name: "currentPwd", label: "Enter Your Password", placeholder: "Password" },
            { type: "email", name: "email", label: "Enter a New Email", placeholder: "Email" }
        ];
        
        try {
            const newEmailData = await _prompt("Change Email Address", fields);
            const allowed = await reAuth(user, newEmailData.currentPwd);
            
            if (allowed) {
                if (newEmailData.email && newEmailData.email !== user.email) {
                    await updateEmail(user, newEmailData.email);
                    document.querySelector(".account #email b").innerHTML = newEmailData.email;
                    _alert("success", "Success", "Email updated successfully!");
                } else {
                    _alert("warn", "Invalid Email", "Please enter a valid new email address.");
                }
            } else {
                _alert("error", "Incorrect Password", "Please try again.");
            }
        } catch (error) {
            console.error("Error updating email:", error);
            _alert("error", "Error", "Failed to update email.");
        }
    }
}

// Function to validate password strength
function validPass(password) {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// Function to update password
async function putPass(user) {
    if (user) {
        const fields = [
            { type: "password", name: "currentPwd", label: "Enter Your Password", placeholder: "Password" },
            { type: "password", name: "pwd", label: "Enter a New Password", placeholder: "Password" },
            { type: "password", name: "confirmPwd", label: "Confirm New Password", placeholder: "Confirm Password" }
        ];
        
        try {
            const newPassData = await _prompt("Change Your Password", fields);
            const allowed = await reAuth(user, newPassData.currentPwd);
            
            if (allowed) {
                if (newPassData.pwd === newPassData.confirmPwd && validPass(newPassData.pwd)) {
                    await updatePassword(user, newPassData.pwd);
                    _alert("success", "Success", "Password updated successfully!");
                } else if (!validPass(newPassData.pwd)) {
                    _alert("warn", "Weak Password", "Password must be at least 8 characters long, and contain a number and a capital letter.");
                } else {
                    _alert("error", "Passwords Don't Match", "Please ensure both passwords match.");
                }
            } else {
                _alert("error", "Incorrect Password", "Please try again.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            _alert("error", "Error", "Failed to update password.");
        }
    }
}

// Function to reset password
function resetPass(auth) {
    if (auth && auth.currentUser) {
        sendPasswordResetEmail(auth, auth.currentUser.email)
            .then(() => {
                _alert("info", "Check Your Email", `Password reset link sent to ${auth.currentUser.email}.`);
            })
            .catch((error) => {
                console.error("Error sending password reset email:", error);
                _alert("error", "Error", "Failed to send password reset email.");
            });
    }
}

// Function to re-authenticate user
async function reAuth(user, password) {
    try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        return true;
    } catch (error) {
        console.error("Error during re-authentication:", error);
        _alert("error", "Authentication Failed", "Please check your password and try again.");
        return false;
    }
}

// Account settings page handler
window.accountPage = function() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        _alert("error", "Error", "No authenticated user found.");
        return;
    }

    // Email Settings
    document.querySelector(".account #email b").innerHTML = user.email;
    if (user.emailVerified) {
        document.querySelector(".account #emailActions").removeChild(document.querySelector(".account #checkEmail"));
        document.querySelector(".account #email").innerHTML += '<svg class="success" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"/></svg>';
    } else {
        document.querySelector(".account #verifyEmailBtn").addEventListener("click", () => verifyEmail(user));
    }

    document.querySelector(".account #putEmailBtn").addEventListener("click", () => putEmail(user));

    // Password Settings
    document.querySelector(".account #putPwdBtn").addEventListener("click", () => putPass(user));
    document.querySelector(".account #resetPwdBtn").addEventListener("click", () => resetPass(auth));
};
