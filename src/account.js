import { getAuth, EmailAuthProvider, sendEmailVerification, updateEmail, updatePassword, sendPasswordResetEmail, reauthenticateWithCredential } from "firebase/auth";


function verifyEmail(user){
    sendEmailVerification(user)
    .then(() => {
        _alert("", "Check Your Email", `Email Verification Link Sent To ${user.email} !`)
    });
}

async function putEmail(user){
    if(user){
        const fields = [{type: "password", name: "currentPwd", label: "Enter Your Password", placeholder: "Password"}, {type: "email", name: "email", label: "Enter a new email", placeholder: "Email"}];
        try{
            const newEmail = await _prompt("Change Email Address", fields);
            const allowed = await reAuth(user, newEmail.currentPwd);
            if(allowed){
                if(newEmail.email != "" && newEmail.email !== user.email){
                    updateEmail(user, newEmail.email)
                    .then(() => {
                        // Email updated successfully
                        document.querySelector(".account #email b").innerHTML = newEmail.email;
                        _alert("success", "Success", "Email updated successfully!");
                    })
                    .catch((error) => {
                        // An error occurred
                        console.error(error.message)
                        _alert("error", "Error", "Error updating email, try again.");
                    });
                }else{
                    _alert("warn", "Invalid Email", "Please enter a valid new email address.");
                }
            }else{
                _alert("error", "Incorrect Password", "Try again !")
            }
        }catch(error){
            _alert("error", "Error", error);
        }
    }
}


function validPass(pass){
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);
}

async function putPass(user){
    if(user){
        const fields = [{type: "password", name: "currentPwd", label: "Enter Your Password", placeholder: "Password"}, {type: "password", name: "pwd", label: "Enter a new password", placeholder: "Password"}, {type: "password", name: "confirmPwd", label: "Confirm new password", placeholder: "Confirm Password"}]
        const newPass = await _prompt("Change Your Password", fields);
        const allowed = await reAuth(user, newPass.currentPwd);
        if(allowed){
            if(newPass.confirmPwd == newPass.pwd){
                if(newPass.pwd && validPass(newPass.pwd)){
                    updatePassword(user, newPass.pwd).then(() => {
                        _alert("success", "Success", "Password updated successfully!");
                    }).catch((error) => {
                        console.error(error.message);
                        _alert("error", "Error", "Error updating password.");
                    });
                }else{
                    _alert("warn", "Weak Password", "Your password must be at leaast 8 characters long and contains a number and a capital letter.");
                }
            }else{
                _alert("error", "Passwords Doesn't Match", "Make sure that your confirmation password matches.");
            }
        }else{
            _alert("error", "Incorrect Password", "Try again !")
        }
    }
}

function resetPass(auth){
    if(auth){
        sendPasswordResetEmail(auth, auth.currentUser.email)
        .then(() => {
            _alert("", "Check You Email", `Password reset link sent to ${auth.currentUser.email}.`)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Error reseting password : 
                Error code : ${errorCode}
                Error message : ${errorMessage}`);
            _alert("error", "Error Updting Password", errorMessage.replace("Firebase;", "").trim());
        });
    }
}


async function reAuth(user, pwd){
    try{

        // Create the credential object using Firebase EmailAuthProvider
        const credential = EmailAuthProvider.credential(user.email, pwd);

        // Now reauthenticate the user using the credential
        await reauthenticateWithCredential(user, credential);

        return true;

    }catch(error){

        // Handle errors
        console.error(`Error occurred during re-authentication: ${error.message}`);
        return false;
    }
}

window.accountPage = function(){

    // Getting User Infos

    const auth = getAuth();
    const user = auth.currentUser;


    // Email Settings

    document.querySelector(".account #email b").innerHTML = user.email;

    if(user.emailVerified){
        document.querySelector(".account #emailActions").removeChild(document.querySelector(".account #checkEmail"));
        document.querySelector(".account #email").innerHTML += '<svg class="success" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"/></svg>'; //"<span>&#9989;</span>";
    }
    else{
        document.querySelector(".account #verifyEmailBtn").addEventListener("click", () => verifyEmail(user));
    }

    document.querySelector(".account #putEmailBtn").addEventListener("click", () => putEmail(user));


    // Password Settings

    document.querySelector(".account #putPwdlBtn").addEventListener("click", () => putPass(user));

    document.querySelector(".account #resetPwdBtn").addEventListener("click", () => resetPass(auth));

}