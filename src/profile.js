// Import necessary Firebase modules
import { app } from './firebase.js';
import { getAuth, updateProfile } from 'firebase/auth'; 
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// Function to retrieve and display user profile data
async function getProfile(user) {
    const db = getFirestore(app);
    const docRef = doc(db, "users", user.uid);
    
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const profileData = docSnap.data();
            showProfile(user, profileData);

            // Save profile data to Local Storage
            localStorage.setItem('profile', JSON.stringify(profileData));
            return profileData;

        } else {
            console.log("No such document!");
        }
    }catch(error) {
        console.error("Error getting document:", error);
    }
}

// Expose getProfile function globally
window.getProfile = getProfile;


// Function to display user profile in the UI
function showProfile(user, profile) {
    document.querySelector("#displayName").innerHTML = user.displayName;
    document.querySelector("#department").innerHTML = profile.department;
    document.querySelector("#position").innerHTML = profile.position;
    document.querySelector("#points").innerHTML = `${profile.points} OPs`;
    document.querySelectorAll('#pfp img').forEach(img => {
        img.src = user.photoURL;
    });
}

let blobPhoto = null;

function updatePhoto(event) {
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

                // Set canvas dimensions to desired square size
                const maxSize = 1024;
                canvas.width = maxSize;
                canvas.height = maxSize;

                // Determine the cropping area to maintain the aspect ratio and center the crop
                const cropSize = Math.min(img.width, img.height);
                const cropX = (img.width - cropSize) / 2;
                const cropY = (img.height - cropSize) / 2;

                // Clear the canvas to avoid any artifacts
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the cropped and resized image on the canvas
                ctx.drawImage(
                    img,
                    cropX, cropY, // Source x, y (where to start cropping from)
                    cropSize, cropSize, // Source width, height (size of the crop)
                    0, 0, // Destination x, y (where to start drawing on the canvas)
                    maxSize, maxSize // Destination width, height (resize to fit the square)
                );

                // Convert the canvas content to a Blob
                canvas.toBlob(function(blob) {
                    if (blob) {
                        if (blob.size <= 10 * 1024 * 1024) { // 10MB limit
                            const imgPreview = document.querySelector(".content-1 > div#pfp img");
                            imgPreview.src = URL.createObjectURL(blob);
                            imgPreview.style.display = 'block';
                            //document.getElementById('fileSize').textContent = `File size: ${(blob.size / (1024 * 1024)).toFixed(2)} MB`;

                            // Store the blob for later use in the upload function
                            blobPhoto = blob;
                        } else {
                            alert('The resized image exceeds 10MB.');
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

        // Enable the update button when the image is processed
        document.querySelector("#updatePfBtn").style.visibility = "visible";

    } else {
        alert('Please select an image file.');
    }
}

async function putProfile(user) {

    const displayName = document.querySelector(".content .profile #displayName b").innerText;
    const storage = getStorage(app);
    const file = blobPhoto;

    if(user && (file !== null || displayName != user.displayName)){
        try{
            const storageRef = ref(storage, `usersProfilePictures/${user.uid}.jpg`);
            await uploadBytes(storageRef, file);

            const photoURL = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL });

            alert('Profile updated successfully!');

        }catch(error){
            console.error('Error uploading photo:', error);
            alert('Failed to upload update photo.');
            return;
        }

        // Update display name in Firebase Authentication
        try {
            await updateProfile(user, { displayName });
            console.log("Profile updated successfully");
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert('Failed to update display name.');
            return;
        }

        // Update user document in Firestore
        try {
            const db = getFirestore(app);
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { displayName });
            console.log('User doc updated successfully');
        } catch (error) {
            console.error('Error updating Firestore document:', error);
            alert('Failed to update display name.');
            return;
        }

    }else{
        alert('No new data provided or user not authenticated.');
        return;
    }

    // Update Local Storage
    let lc = JSON.parse(localStorage.getItem('profile')) || {};
    lc.displayName = displayName;
    localStorage.setItem('profile', JSON.stringify(lc));
}

function displayProfile(user, profile){
    // Display infos
    document.querySelector(".content-1 > div#pfp img").setAttribute("src", user.photoURL);
    profile.then(result => {
        document.querySelectorAll(".content-1 > div:not(:first-of-type) > b").forEach(el => {
            el.innerHTML = result[el.parentElement.id];
        });
    });

    // Update Pfp
    document.querySelector(".content-1 > div#pfp input").addEventListener('change', (event) => {
        updatePhoto(event)
    })

    // Enable update button when data is edited by user
    document.querySelector(".content #displayName b").addEventListener('keypress', () => {
        document.querySelector("#updatePfBtn").style.visibility = "visible";
    })

    // Add event listener to update profile button
    document.querySelector("#updatePfBtn").addEventListener("click", () => {
        putProfile(user)
    });
}

function profilePage(){
    const auth = getAuth();
    const user = auth.currentUser;
    const profile = getProfile(user);

    if (user && profile) {
        displayProfile(user, profile);
    }
}

// Expose profilePage function globally
window.profilePage = profilePage;