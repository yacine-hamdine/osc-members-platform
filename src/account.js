import { getAuth, EmailAuthProvider, sendEmailVerification, updateEmail, updatePassword, sendPasswordResetEmail, reauthenticateWithCredential, validatePassword } from "firebase/auth";


function verifyEmail(user){
    sendEmailVerification(user)
    .then(() => {
        _alert("", "Check Your Email", `Email Verification Link Sent To ${user.email} !`)
    });
}

function putEmail(user){
    if(user){
        let newEmail = prompt("Enter Your New Email : ");
        if(newEmail && newEmail !== user.email){
            updateEmail(user, newEmail)
            .then(() => {
                   // Email updated successfully
                alert("Email updated successfully!");
            })
            .catch((error) => {
                // An error occurred
                alert("Error updating email: " + error.message);
            });
        }else{
            alert("Please enter a valid new email address.");
        }
    }
}

function validPass(pass){
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);
}

function putPass(user){
    if(user){
        let newPass = prompt("Enter Your New Password : ");
        if(newPass && validPass(newPass)){
            updatePassword(user, newPass).then(() => {
                alert("Email updated successfully!");
            }).catch((error) => {
                alert("Error updating password: " + error.message);
            });
        }else{
            alert("Please enter a valid new password, it must be at leaast 8 characters long and contains a number and a capital letter.");
        }
    }
}

function resetPass(auth){
    if(auth){
        sendPasswordResetEmail(auth, auth.currentUser.email)
        .then(() => {
            alert(`Password reset link sent to ${auth.currentUser.email}.`)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error reseting password : 
                Error code : ${errorCode}
                Error message : ${errorMessage}`);
        });
    }
}

async function reAuth(user){

    let promptForCredentials = new Promise((resolve, reject) => {
        try{
            let email = prompt("Please enter your email :");
            let pass = prompt("Please enter your password :");
            resolve(EmailAuthProvider.credential(email, pass));
        }
        catch(err){
            reject(err);
        }
    });

    const credential = await promptForCredentials;

    if(credential){
        reauthenticateWithCredential(user, credential)
        .then(() => {
            // User re-authenticated.
            alert("Re-Authenticated Successfully !");
            document.querySelectorAll(".reAuthReq").forEach((btn) => {
                btn.style.display = "inline-block";
            });
            document.querySelector(".account #note").innerText = "Re-Authenticated Successfully !";
            document.querySelector(".account #note").classList.toggle("note");
            document.querySelector(".account #note").classList.toggle("success");
        })
        .catch((error) => {
            // An error ocurred
            console.log(`An Error Occured, Please Try Again later.
            Error Details: ${error}`);
            alert(`Error Re-Authenticating : ${error.message.replace("Firebase:", "").trim()}`)
        });
    }
}

function accountPage(){

    // Getting User Infos

    const auth = getAuth();
    const user = auth.currentUser;


    // Email Settings

    document.querySelector(".account #email b").innerHTML = user.email;

    if(user.emailVerified){
        document.querySelector(".account").removeChild(document.querySelector(".account #checkEmail"));
        document.querySelector(".account #email").innerHTML += '<svg class="success" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"/></svg>'; //"<span>&#9989;</span>";
    }
    else{
        document.querySelector(".account #verifyEmailBtn").addEventListener("click", () => {
            verifyEmail(user)
        });
    }

    document.querySelector(".account #putEmailBtn").addEventListener("click", () => {
        putEmail(user)
    });


    // Password Settings

    document.querySelector(".account #putPwdlBtn").addEventListener("click", () => {
        putPass(user)
    });

    document.querySelector(".account #resetPwdBtn").addEventListener("click", () => {
        resetPass(auth)
    });


    // ReAuth Settings

    document.querySelector(".account #reAuthBtn").addEventListener("click", () => {
        reAuth(user)
    });
}

window.accountPage = accountPage;