// Import necessary Firebase modules
import { app } from './firebase.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Initialize Firebase Authentication
const auth = getAuth();
const authPanel = document.getElementById("auth");

// Check user authentication state and display the appropriate UI
(async function checkAuth(){
    const promise = new Promise(resolve => {
        onAuthStateChanged(auth, (user) => {
            if(user){

                // Remove Auth Panel
                authPanel.style.display = "none";

                // Get photo url
                const storage = getStorage(app);
                const storageRef = ref(storage, user.photoURL);
                getDownloadURL(storageRef)
                    .then((url) => {
                        user.photoURL = url;
                    })
                    .catch((error) => {
                        console.error('Error getting profile picture URL:', error);
                    });

                
                // get Profile Doc
                getProfile(user);

            }else{
                authPanel.style.display = "flex";
            }
            resolve();
        });
    });

    // Remove Load Screen
    await promise;
    document.querySelector("#loading").style.display = "none";

})();

// Handle user login
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            message.classList.remove('error');
            message.classList.add('success');
            message.innerHTML = "Login successful!";
        })
        .catch((error) => {
            console.log(error);
            message.innerHTML = error.message.replace("Firebase:", "").trim();
            message.classList.remove('success');
            message.classList.add('error');
        });
}

document.getElementById('loginBtn').addEventListener('click', login);

function logout() {
    signOut(auth)
        .then(() => {
            document.getElementById("loginMessage").innerHTML = "";
            authPanel.style.display = "flex";
        })
        .catch((error) => {
            alert(`An error occurred: ${error}`);
            authPanel.style.display = "none";
        });
}

document.getElementById('logoutBtn').addEventListener('click', logout);
