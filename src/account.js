import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

function accountPage(){
    const auth = getAuth();
    const user = auth.currentUser;

    document.querySelector(".account #email b").innerHTML = user.email;

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
            alert(`Error Re-Authenticating : ${error.message}`)
        });
    })
}

window.accountPage = accountPage;