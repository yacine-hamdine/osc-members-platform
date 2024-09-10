// Import necessary Firebase modules
import { app } from './firebase.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, updateDoc, onSnapshot } from "firebase/firestore";

function checkConnectionStatus(){
    if(!navigator.onLine){
        _alert("error", "Connection Status", "You are offline.");
    }
}

// Check the connection status on page load
checkConnectionStatus();

// Listen for connection status changes
window.addEventListener('online', () => {
    _alert("success", "Connection Restored", "You are back online.");
});

window.addEventListener('offline', () => {
    _alert("error", "Connection Lost", "You are currently offline.");
});

function getIpAddress() {
    return fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip)
        .catch(error => {
            console.error('Error:', error);
            return null; // Return null if there's an error
        });
}

async function getIpData(){
    try{
        const response = await fetch('https://api.ipdata.co/?api-key=c1affb4928aa553832ae905c189157c94cc0074aa0e38054c375a570');
        const data = await response.json();
        // Only extract required fields
        return {
            city: data.city,
            region: data.region,
            country_name: data.country_name,
        };
    }catch(error){
        console.error('Error fetching IP data:', error);
        return null;
    }
}

class Session {
    constructor(user) {
        this.id = user.stsTokenManager.refreshToken; 
        this.ip = null;
        this.date = new Date();
        this.device = platform.description || navigator.userAgent;
        this.address = null;
    }

    // Open session by fetching required data
    async open() {
        try {
            this.ip = await getIpAddress();
            const ipData = await getIpData();
            if (ipData) {
                this.address = `${ipData.city}, ${ipData.region}, ${ipData.country_name}, ${ipData.continent_name}`;
            }
            return this; // Return session data
        } catch (error) {
            console.error('Error opening session:', error);
            throw error;
        }
    }
}

// Initialize Firebase Authentication
const auth = getAuth();
const authPanel = document.getElementById("auth");

// Check user authentication state and display the appropriate UI
(async function checkAuth(){
    onAuthStateChanged(auth, async (user) => {
        if(user){
            launch(user, false);
        }else{
            // Remove Load Screen
            document.querySelector("#loading").style.display = "none";
            authPanel.style.display = "flex";
        }
    });
})();

// TO DO : read session.sticky param and set the appropriate checkbox state in account.html

async function launch(user, newSession){
    try{
        if(newSession == true){
            // Connect Session
            await setSession(user);
        }
        
        // Detect New Device login
        newSessionDetector(user);
        
        // Register background sync for session detection
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('sync-new-session-detector');
            }).then(() => {
                console.log('Background sync registered');
            }).catch(error => {
                console.error('Background sync registration failed:', error);
            });
        }

        // Remove Load Screen
        document.querySelector("#loading").style.display = "none";
        
        // Remove Auth Panel
        authPanel.style.display = "none";
    
        // Launch App
        let mode = user.isAdmin ? admin : user;
        let page = localStorage.getItem("page") || "home";
        let args = {
                user: user,
                mode: mode,
                page: page
        };
        main(args);
    }catch(error){
        console.error("Error launching application:", error);
    }
}

// Receive messages from the service worker
navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'LOGOUT') {
        logout(event.data.message); // Logs out if a new session is detected in the background
    }
});

window.disconnect = function(userData){
    logout(`You've just logged in on another device: ${userData.session.device}. You can log in to one device at a time only.`);
}


async function setSession(user){
    try{
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", user.uid);

        let userSession = new Session(user);

        // Initialize the session and get session data
        const {...sessionData} = await userSession.open();  // Directly using the returned session data

        // Update the session in Firestore
        await updateDoc(userDocRef, { session: sessionData });

        // Update Cache 
        let lc = JSON.parse(localStorage.getItem("userData"));
        lc.session = sessionData;
        localStorage.setItem("userData", JSON.stringify(lc));

    }catch(error){
        console.error("Error setting session: ", error);
    }
}
let activeInstance = true;
function newSessionDetector(user){
    const db = getFirestore(app);
    const userDocRef = doc(db, "users", user.uid);
    let initialLoad = true; // Flag to track initial load

    // Set up a listener for changes to the user's document
    onSnapshot(userDocRef, (docSnapshot) => {
        if(!activeInstance) return;
        if(docSnapshot.exists()){
            const data = docSnapshot.data();
            if(initialLoad){
                initialLoad = false; // Set flag to false after initial snapshot
            }else{
                if(data.session && data.session.id != user.stsTokenManager.refreshToken){
                    disconnect(data);
                }
            }
        }else{
            console.log("User Document does not exist.");
        }
    }, (error) => {
        console.error("Error listening for session changes: ", error);
    });
}


function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");
    signInWithEmailAndPassword(auth, email, password)
        .then( async (userCredential) => {
            let user = userCredential.user;
            launch(user, true);
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

async function logout(msg = ""){
    signOut(auth)
        .then(() => {
            document.getElementById("loginMessage").innerHTML = msg;
            document.getElementById("loginMessage").classList.remove('success');
            document.getElementById("loginMessage").classList.add('error');
            authPanel.style.display = "flex";
        })
        .catch((error) => {
            _alert("error", "Error Loginning Out", `An error occurred: ${error}`);
            authPanel.style.display = "none";
        });
}

document.getElementById('logoutBtn').addEventListener('click', () => {logout("")});