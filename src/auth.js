// Import necessary Firebase modules
import { app } from './firebase.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { getProfile } from "./profile.js";

// Initialize Firebase Authentication
const auth = getAuth();
const authPanel = document.getElementById("auth");

// Check user authentication state and display the appropriate UI
(async function checkAuth() {
    const promise = new Promise(resolve => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                authPanel.style.display = "none";
                getProfile(user);

                // Save user data to Local Storage
                localStorage.setItem('user', JSON.stringify(user));
            } else {
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

            // Save user data to Local Storage
            localStorage.setItem('user', JSON.stringify(userCredential.user));
        })
        .catch((error) => {
            console.log(error);
            message.innerHTML = error.message.replace("Firebase:", "").trim();
            message.classList.remove('success');
            message.classList.add('error');
        });
}

document.getElementById('loginBtn').addEventListener('click', login);

// Handle user logout
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

// Update user profile and upload profile picture
async function updatePf() {
    const storage = getStorage(app);
    const file = document.querySelector(".content-1 > div#pfp input").files[0];

    if (file && auth.currentUser) {
        try {
            const storageRef = ref(storage, `usersProfilPictures/${auth.currentUser.uid}.jpg`);
            await uploadBytes(storageRef, file);

            const photoURL = await getDownloadURL(storageRef);
            await updateProfile(auth.currentUser, { photoURL });

            alert('Photo uploaded and profile updated successfully!');
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo and update profile.');
            return;
        }
    } else {
        alert('No file selected or user not authenticated.');
        return;
    }

    // Update display name in Firebase Authentication
    const displayName = document.querySelector(".content .profile #displayName b").innerText;
    try {
        await updateProfile(auth.currentUser, { displayName });
        console.log("Profile updated successfully");
    } catch (error) {
        console.error("Failed to update profile:", error);
        return;
    }

    // Update user document in Firestore
    try {
        const db = getFirestore(app);
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { displayName });
        console.log('Firestore document updated successfully');
    } catch (error) {
        console.error('Error updating Firestore document:', error);
    }

    // Update Local Storage
    let lc = JSON.parse(localStorage.getItem('profile')) || {};
    lc.displayName = displayName;
    localStorage.setItem('profile', JSON.stringify(lc));
}

window.updatePf = updatePf;