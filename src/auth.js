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

        // Detect New Device login
        newSessionDetector(user);
    }catch(error){
        console.error("Error setting session: ", error);
    }
}

function newSessionDetector(user){
    const db = getFirestore(app);
    const userDocRef = doc(db, "users", user.uid);

    // Set up a listener for changes to the user's document
    onSnapshot(userDocRef, (docSnapshot) => {
        if(docSnapshot.exists()){
            const data = docSnapshot.data();

            // Check if 'session' and 'session.id' exist
            if(data.session && data.session.id){
                if(data.session.id != user.stsTokenManager.refreshToken){
                    logout(`You've just logged in on another device: ${data.session.device}. You can login to one device at a time only.`);
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
