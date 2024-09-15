import { app } from './firebase.js';
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

self.addEventListener('sync', event => {
    if (event.tag === 'sync-new-session-detector') {
        event.waitUntil(checkSessionInBackground());
    }
});

async function checkSessionInBackground() {
    // Get Firestore instance and user's document reference
    const user = await getUserFromLocalStorage();
    const db = getFirestore(app);
    const userDocRef = doc(db, "users", user.uid);
    debugger
    // Set up the onSnapshot listener to detect session changes
    return new Promise((resolve, reject) => {
        onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                if (data.session && data.session.id !== user.stsTokenManager.refreshToken) {
                    self.clients.matchAll().then(clients => {
                        clients.forEach(client => {
                            client.postMessage({
                                type: 'LOGOUT',
                                message: `You've logged in on another device: ${data.session.device}. You will be logged out.`
                            });
                        });
                    });
                }
            } else {
                console.log("User document doesn't exist.");
            }
            resolve("Listening for session changes in the background");
        }, error => {
            console.error("Error listening for session changes in background:", error);
            reject(error);
        });
    });
}

function readFirebaseUserFromIndexedDB() {
    return new Promise((resolve, reject) => {
        // Open the IndexedDB where Firebase stores the user data
        const request = indexedDB.open('firebaseLocalStorageDb', 1);

        request.onerror = function(event) {
            reject('Error opening IndexedDB');
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['firebaseLocalStorage'], 'readonly');
            const objectStore = transaction.objectStore('firebaseLocalStorage');

            // Open a cursor to iterate over entries in the 'firebaseLocalStorage' object store
            const getRequest = objectStore.getAll();

            getRequest.onsuccess = function(event) {
                const result = event.target.result;
                
                // Search for the entry that stores the Firebase Auth user information
                const userEntry = result.find(entry => entry.fbase_key.startsWith('firebase:authUser'));

                if (userEntry) {
                    // Parse the Firebase user object stored as a JSON string
                    const user = userEntry.value;
                    resolve(user);  // Resolve with the user object
                } else {
                    resolve(null); // No user found
                }
            };

            getRequest.onerror = function(event) {
                reject('Error reading from IndexedDB');
            };
        };
    });
}


async function getUserFromLocalStorage() {
    // Retrieve the user data from IndexedDB or localStorage (or any persistence method you're using)
    return new Promise((resolve, reject) => {
        readFirebaseUserFromIndexedDB().then(user => {
            resolve(user);
        }).catch(error => {
            console.error(error);
            reject(error)
        });
    });
}
