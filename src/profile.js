// Import necessary Firebase modules
import { app } from './firebase.js';
import { getAuth, updateProfile } from 'firebase/auth'; 
import { getFirestore, doc, getDoc, writeBatch } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// Function to retrieve and display user profile data with caching
window.getProfile = async function(user) {
    const db = getFirestore(app);
    const docRef = doc(db, "users", user.uid);
    
    // Try fetching from Local Storage first to reduce Firestore reads
    const cachedProfile = localStorage.getItem('userData');
    
    if (cachedProfile &&  user.displayName == JSON.parse(cachedProfile).displayName) {
        console.log('Using cached profile data');
        const profileData = JSON.parse(cachedProfile);
        showProfile(user, profileData);
        return profileData;
    }

    // If not found in cache, fetch from Firestore
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const profileData = docSnap.data();
            showProfile(user, profileData);

            // Save user data to Local Storage for future use
            localStorage.setItem('userData', JSON.stringify(profileData));
            return profileData;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
};

// Function to display user profile in the UI
function showProfile(user, profile) {
    document.querySelector("#displayName").textContent = user.displayName;
    document.querySelector("#department").textContent = profile.department;
    document.querySelector("#position").textContent = profile.position;
    document.querySelector("#points").textContent = `${profile.points} OPs`;

    // Set the profile photo
    document.querySelectorAll('#pfp img').forEach(img => {
        img.src = user.photoURL;
    });
}

let blobPhoto = null;

// Function to update the profile photo
async function updatePhoto(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 1024;

                // Set canvas size and crop image to square
                canvas.width = maxSize;
                canvas.height = maxSize;

                const cropSize = Math.min(img.width, img.height);
                const cropX = (img.width - cropSize) / 2;
                const cropY = (img.height - cropSize) / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    img, cropX, cropY, cropSize, cropSize,
                    0, 0, maxSize, maxSize
                );

                // Convert canvas to Blob
                canvas.toBlob(function(blob) {
                    if (blob) {
                        if (blob.size <= 10 * 1024 * 1024) {
                            const imgPreview = document.querySelector(".content-1 > div#pfp img");
                            imgPreview.src = URL.createObjectURL(blob);
                            blobPhoto = blob;
                        } else {
                            _alert("error", "Error Uploading Photo", "The resized image exceeds 10MB.");
                        }
                    } else {
                        console.error('Failed to create blob from canvas.');
                    }
                }, 'image/jpeg');
            };

            img.onerror = function() {
                console.error('Failed to load the image.');
            };
        };

        reader.readAsDataURL(file);
        document.querySelector("#updatePfBtn").style.visibility = "visible";
    } else {
        _alert("error", "Incorrect image format", 'Please select an image file.');
    }
}

function validDisplayName(displayName) {
    // Basic XSS Sanitization
    return /^[^<>"='`]{3,25}$/gm.test(displayName);
}

// Optimized function to update user profile
async function putProfile(user) {
    const displayName = document.querySelector(".content .profile #displayName b").innerText;
    const storage = getStorage(app);
    const file = blobPhoto;

    if (!user) {
        _alert("error", "Error", "User not authenticated.");
        return;
    }

    if (file || displayName !== user.displayName) {
        const batch = writeBatch(getFirestore(app)); // Use Firestore batch for better write performance

        try {
            if (file) {
                const storageRef = ref(storage, `usersProfilePictures/${user.uid}.jpg`);
                await uploadBytes(storageRef, file);
                const photoURL = await getDownloadURL(storageRef);
                await updateProfile(user, { photoURL });

                // Batch update to Firestore (profile picture update)
                const userDocRef = doc(getFirestore(app), 'users', user.uid);
                batch.update(userDocRef, { photoURL });
            }

            if (displayName !== user.displayName) {

                if (!validDisplayName(displayName)) {
                    throw new Error("Invalid Name Provided");
                    return;
                }

                await updateProfile(user, { displayName });

                // Batch update to Firestore (display name update)
                const userDocRef = doc(getFirestore(app), 'users', user.uid);
                batch.update(userDocRef, { displayName });
            }

            // Commit Firestore batch
            await batch.commit();

            document.querySelector("#displayName").textContent = user.displayName;
            document.querySelectorAll('#pfp img').forEach(img => {
                img.src = user.photoURL;
            });

            // Update Local Storage
            let lc = JSON.parse(localStorage.getItem('userData')) || {};
            lc.displayName = displayName;
            localStorage.setItem('userData', JSON.stringify(lc));

            _alert("success", "Success", 'Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            _alert("error", "Error Updating Profile", 'Failed to update profile.');
        }
    } else {
        _alert("warn", "No New Data Detected", "Please provide new data to update your profile.");
    }

    // Edit-UI Inactive
    document.querySelector("#updatePfBtn").style.visibility = "hidden";
    document.querySelector(".content #displayName b").setAttribute("contenteditable", "false");
    document.querySelector(".content #displayName b").style.border = "none";
    document.querySelector(".content-1 > div#pfp img").style.border = "none"
    document.querySelector(".content-1 > div#pfp input").setAttribute("disabled", "true");
    document.querySelector("#editPfBtn").style.display = "inline-block";
}

// Function to display the profile page with cached data
function displayProfile(user, profile) {
    try {
        let pf = JSON.parse(localStorage.getItem("userData"));
        document.querySelectorAll(".content-1 > div:not(:first-of-type) > b").forEach(el => {
            el.textContent = pf[el.parentElement.id];
        });
    } catch {
        profile.then(result => {
            document.querySelectorAll(".content-1 > div:not(:first-of-type) > b").forEach(el => {
                el.textContent = result[el.parentElement.id];
            });
        });
    }

    // Handle profile picture changes
    document.querySelector(".content-1 > div#pfp input").addEventListener('change', (event) => {
        updatePhoto(event);
    });

    // Enable update button when display name is edited
    document.querySelector(".content #displayName b").addEventListener('input', () => {
        document.querySelector("#updatePfBtn").style.visibility = "visible";
    });

    // Update profile when the button is clicked
    document.querySelector("#updatePfBtn").addEventListener("click", () => {
        putProfile(user);
    });

    // Enable edit mode for the profile
    document.querySelector("#editPfBtn").addEventListener("click", () => {
        // Edit-UI Active
        document.querySelector(".content #displayName b").setAttribute("contenteditable", "true");
        document.querySelector(".content-1 > div#pfp input").removeAttribute("disabled");
        document.querySelector(".content #displayName b").style.border = "3px solid var(--main-btn-bg)";
        document.querySelector(".content #displayName b").style.borderRadius = "50px";
        document.querySelector(".content #displayName b").style.padding = "2px 3px";
        document.querySelector(".content-1 > div#pfp img").style.border = "3px solid var(--main-btn-bg)";
        document.querySelector("#editPfBtn").style.display = "none";
    });
}

window.profilePage = function() {
    const auth = getAuth();
    const user = auth.currentUser;
    const profile = getProfile(user);

    if (user && profile) {
        displayProfile(user, profile);
    }
};