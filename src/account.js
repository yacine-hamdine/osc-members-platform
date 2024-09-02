import { getAuth, EmailAuthProvider, sendEmailVerification, updateEmail, reauthenticateWithCredential } from "firebase/auth";


function verifyEmail(user){
    sendEmailVerification(user)
    .then(() => {
        alert(`Email Verification Link Sent To ${user.email} !`)
    });
}

function putEmail(user){

    

    if (user) {

        let newEmail = prompt("Enter Your New Email : ");

        if (newEmail && newEmail !== user.email) {
          // Check if the current email is verified
          if (user.isEmailVerified) {
            updateEmail(user, newEmail)
              .then(() => {
                // Email updated successfully
                alert("Email updated successfully!");
              })
              .catch((error) => {
                // An error occurred
                alert("Error updating email: " + error.message);
              });
          } else {
            // Send verification email
            sendEmailVerification(user)
              .then(() => {
                alert("Verification email sent. Please check your inbox.");
              })
              .catch((error) => {
                // An error occurred
                alert("Error sending verification email: " + error.message);
              });
          }
        } else {
          alert("Please enter a valid new email address.");
        }
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
        document.querySelector(".account #email").innerHTML += "<span>&#9989;</span>";
    }
    else{
        document.querySelector(".account #verifyEmailBtn").addEventListener("click", () => {
            verifyEmail(user);
        })
    }
    document.querySelector(".account #putEmailBtn").addEventListener("click", () => {
        putEmail(user);
    });


    // ReAuth Settings

    document.querySelector(".account #reAuthBtn").addEventListener("click", async () => {

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

        // TODO(you): prompt the user to re-provide their sign-in credentials
        const credential = await promptForCredentials;

        if(credential){
            reauthenticateWithCredential(user, credential).then(() => {
                // User re-authenticated.
                    alert("Re-Authenticated Successfully !");
                    document.querySelectorAll(".reAuthReq").forEach((btn) => {
                        btn.style.display = "inline-block";
                    });
                    document.querySelector(".account #note").innerText = "Re-Authenticated Successfully !";
                    document.querySelector(".account #note").classList.toggle("note");
                    document.querySelector(".account #note").classList.toggle("success");
                }).catch((error) => {
                // An error ocurred
                    console.log(`An Error Occured, Please Try Again later.
                    Error Details: ${error}`);
                    alert(`Error Re-Authenticating : ${error.message.replace("Firebase:", "").trim()}`)
                });
        }
    })
}

window.accountPage = accountPage;