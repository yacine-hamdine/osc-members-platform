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


class Session{
    constructor(user){
        this.id = user.stsTokenManager.refreshToken;
        this.ip;
        this.date;
        this.device;
        this.address;
    }
    open(){
        return new Promise(async (resolve, reject) => {
            try{
                this.date = new Date();
                this.device = platform.description;

                // Get IP Address
                this.ip = await getIpAddress();

                // Get IP Data (Geo-location, etc.)
                const ipData = await getIpData();
                this.address = `${ipData.city}, ${ipData.region}, ${ipData.country_name}, ${ipData.continent_name}.`;

                resolve(this); // Resolve the session once everything is set
            }catch(error){
                reject(error);
            }
        });
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


async function setSession(user){
    try{
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", user.uid);

        let userSession = new Session(user);

        // Initialize the session and get session data
        const {...sessionData} = await userSession.open();  // Directly using the returned session data

        // Update the session in Firestore
        await updateDoc(userDocRef, { session: sessionData });

    }catch(error){
        console.error("Error setting session: ", error);
    }
}

function newSessionDetector(user){
    const db = getFirestore(app);
    const userDocRef = doc(db, "users", user.uid);
    let initialLoad = true; // Flag to track initial load

    // Set up a listener for changes to the user's document
    onSnapshot(userDocRef, (docSnapshot) => {
        if(docSnapshot.exists()){
            const data = docSnapshot.data();
            if(initialLoad){
                initialLoad = false; // Set flag to false after initial snapshot
            }else{
                if(data.session && data.session.id !== user.stsTokenManager.refreshToken){
                    logout(`You've just logged in on another device: ${data.session.device}. You can log in to one device at a time only.`);
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



// maybe inshallah I'll be trying to use the version of below 

/*
// Import necessary Firebase modules
import { app } from './firebase.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, updateDoc, onSnapshot } from "firebase/firestore";

// Handle connection status
function handleConnectionStatus() {
    if (!navigator.onLine) {
        _alert("error", "Connection Status", "You are offline.");
    }

    window.addEventListener('online', () => {
        _alert("success", "Connection Restored", "You are back online.");
    });

    window.addEventListener('offline', () => {
        _alert("error", "Connection Lost", "You are currently offline.");
    });
}

// Call it once on page load
handleConnectionStatus();

// Get IP address (cache result to avoid frequent API calls)
let cachedIpAddress = null;
async function getIpAddress() {
    if (cachedIpAddress) return cachedIpAddress;

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        cachedIpAddress = data.ip;
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
}

// Fetch geolocation data using IP
async function getIpData() {
    try {
        const response = await fetch('https://api.ipdata.co/?api-key=c1affb4928aa553832ae905c189157c94cc0074aa0e38054c375a570');
        const data = await response.json();
        return {
            city: data.city,
            region: data.region,
            country_name: data.country_name,
            continent_name: data.continent_name
        };
    } catch (error) {
        console.error('Error fetching IP data:', error);
        return null;
    }
}

function generateSessionID() {
    // Generate a random UUID
    const uuid = crypto.randomUUID();
  
    // Get the current timestamp in milliseconds
    const timestamp = Date.now();
  
    // Generate a random number between 0 and 1000
    const randomNum = Math.floor(Math.random() * 1000);
  
    // Combine the UUID, timestamp, and random number into a unique string
    const sessionId = `${uuid}-${timestamp}-${randomNum}`;
  
    return sessionId;
}

// Session class handles user session info securely
class Session {
    constructor() {
        this.id = null; 
        this.ip = null;
        this.date = new Date();
        this.device = platform.description || navigator.userAgent;
        this.address = null;
    }

    // Open session by fetching required data
    async open() {
        try {
            this.id = await generateSessionID();
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

// Check user authentication state
(async function checkAuth() {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            await launch(user, false); // Existing session, no new session
            unsubscribe(); 
        } else {
            removeLoadingScreen();
            showAuthPanel();
        }
    });
})();



// Remove loading screen and show authentication panel
function removeLoadingScreen() {
    document.querySelector("#loading").style.display = "none";
}
function showAuthPanel() {
    authPanel.style.display = "flex";
}
function hideAuthPanel() {
    authPanel.style.display = "none";
}

// Launch the app with authenticated user
async function launch(user, newSession = false) {
    try {
        if (newSession) {
            await setSession(user);
        }

        // Detect new device login
        newSessionDetector(user);

        // Remove Load Screen and Auth Panel
        removeLoadingScreen();
        hideAuthPanel();

        // Launch the application with the user data
        let mode = user.isAdmin ? admin : user;
        let page = localStorage.getItem("page") || "home";
        main({
            user: user,
            mode: mode,
            page: page
        });
    } catch (error) {
        console.error("Error launching application:", error);
    }
}

// Set session data in Firestore
async function setSession(user) {
    try {
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", user.uid);

        const userSession = new Session(user);
        const {...sessionData} = await userSession.open();

        // Save session data in Firestore
        await updateDoc(userDocRef, { session: sessionData });

        // Cache session ID to localStorage
        localStorage.setItem("fbase_user_sessionID", sessionData.id);
    } catch (error) {
        console.error("Error setting session: ", error);
    }
}

// Detect new session login

function newSessionDetector(user) {
    const db = getFirestore(app);
    const userDocRef = doc(db, "users", user.uid);
    let initialLoad = true;
    onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (!initialLoad) {
                if (data.session && data.session.id != localStorage.getItem("fbase_user_sessionID")) {
                    //logout(`You've logged in on another device: ${data.session.device}. You can log in on one device only.`);
                    _alert("warn", "New device connected", data.session.device);
                }
            }
            initialLoad = false; // Set flag after initial load
        } else {
            console.log("User document does not exist.");
        }
    }, (error) => {
        console.error("Error listening for session changes: ", error);
    });
}

// Handle user login
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await launch(user, true); // New session
        message.classList.remove('error');
        message.classList.add('success');
        message.innerHTML = "Login successful!";
    } catch (error) {
        console.error("Login error:", error);
        message.classList.remove('success');
        message.classList.add('error');
        message.innerHTML = error.message.replace("Firebase:", "").trim();
    }
}

// Handle user logout
async function logout(message = "") {
    try {
        await signOut(auth);
        const loginMessage = document.getElementById("loginMessage");
        loginMessage.classList.remove('success');
        loginMessage.classList.add('error');
        loginMessage.innerHTML = message || "You have logged out.";
        showAuthPanel();
    } catch (error) {
        console.error("Error logging out:", error);
        _alert("error", "Error Logging Out", `An error occurred: ${error}`);
        hideAuthPanel();
    }
}

// Event listeners for login/logout
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('logoutBtn').addEventListener('click', () => logout(""));
*/