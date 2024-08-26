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
                    
                    // Save to Local Storage
                    localStorage.setItem('user', JSON.stringify(user));
                    
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
        message.classList.toggle('error');
        message.classList.toggle('success');
        message.innerHTML = "Login successful!";
    })
    .catch((error) => {
        console.log(error);
        message.innerHTML = error.message.toString().replace("Firebase:", "");
        message.classList.toggle('error');
        message.classList.toggle('success');
    });
}

document.getElementById('loginBtn').addEventListener('click', login);

function logout(){
    signOut(auth).then(() => {
        document.getElementById("loginMessage").innerHTML = "";
        authPanel.style.display = "flex";
    }).catch((error) => {
        alert(`An error occurred: ${error}`);
        authPanel.style.display = "none";
    });
}

document.getElementById('logoutBtn').addEventListener('click', logout);

function updatePf(){
    updateProfile(auth.currentUser, {
        displayName: document.querySelector(".content .profile #displayName b").innerText
        //photoURL: "usersProfilPictures/vinos.jpg"
      }).then(() => {
        // Profile updated!
        console.log("profile updated");
      }).catch((error) => {
        // An error occurred
        console.log("an error occured, profile not updated !");
      });
}

