import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getProfile } from "./profile.js";

const auth = getAuth();

let authPanel = document.getElementById("auth");

(
    async function checkAuth(){
        let promise = new Promise(resolve => {
            onAuthStateChanged(auth, (user) => {
                if(user){
                    authPanel.style.display = "none";
                    getProfile(user);
                    resolve("none");
                    //updatePf();
                }
                else{
                    authPanel.style.display = "flex";
                    resolve("none");
                }
            });
        });
        // Remove Load Screen
        document.querySelector("#loading").style.display = await promise;
    }
)();


function login(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let message = document.getElementById("loginMessage");

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        //const user = userCredential.user;
        //console.log(user);
        //console.log(`Login Successful!`);
        message.classList.add('success');
        message.classList.remove('error');
        message.innerHTML = "Login successful!";
    })
    .catch((error) => {
        console.log(error);
        message.innerHTML = error.message.toString().replace("Firebase:", "");
        message.classList.add('error');
        message.classList.remove('success');
    });
}

document.getElementById('loginBtn').addEventListener('click', login);

function logout(){
    signOut(auth).then(() => {
        authPanel.style.display = "flex";
    }).catch((error) => {
        alert(`An error occurred: ${error}`);
        authPanel.style.display = "none";
    });
}

document.getElementById('logoutBtn').addEventListener('click', logout);

function updatePf(){
    updateProfile(auth.currentUser, {
        displayName: "Yacine Mee", photoURL: "https://firebasestorage.googleapis.com/v0/b/osc-members-platform.appspot.com/o/mee.jpg?alt=media&token=773c8056-59b1-48d1-86a1-b2c431318bb5"
      }).then(() => {
        // Profile updated!
        //console.log("profile updated");
      }).catch((error) => {
        // An error occurred
        console.log("an error occured, profile not updated !");
      });
}