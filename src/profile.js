// Import necessary Firebase modules
import { app } from './firebase.js';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

// Function to display user profile in the UI
function showProfile(user, profile) {
    document.querySelector("#displayName").innerHTML = user.displayName;
    document.querySelector("#department").innerHTML = profile.department;
    document.querySelector("#position").innerHTML = profile.position;
    document.querySelector("#points").innerHTML = `${profile.points} OPs`;

    const storage = getStorage(app);
    const storageRef = ref(storage, user.photoURL);

    // Get and display the profile picture
    getDownloadURL(storageRef)
        .then((url) => {
            document.querySelectorAll('#pfp img').forEach(img => {
                img.src = url;
            });
        })
        .catch((error) => {
            console.error('Error getting profile picture URL:', error);
        });

    // Save updated profile data to Local Storage
    localStorage.setItem('profile', JSON.stringify(profile));
}

// Function to initialize the profile page
function profilePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const profile = JSON.parse(localStorage.getItem("profile"));

    if (user && profile) {
        document.querySelector(".content-1 > div#pfp img").setAttribute("src", user.photoURL);

        document.querySelectorAll(".content-1 > div:not(:first-of-type) > b").forEach(el => {
            el.innerHTML = profile[el.parentElement.id];
        });

        // Handle profile picture change
        document.querySelector(".content-1 > div#pfp input").addEventListener('change', (event) => {
            const input = event.target;
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = new Image();
                    img.src = e.target.result;

                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const maxSize = 1024; // Set the desired canvas size for the square
                        const ctx = canvas.getContext('2d');
                        
                        const size = Math.min(img.width, img.height);
                        canvas.width = maxSize;
                        canvas.height = maxSize;

                        // Draw the image onto the canvas with resizing
                        ctx.drawImage(img, 
                            (img.width - size) / 2, (img.height - size) / 2, // Source x, y
                            size, size, // Source width, height
                            0, 0, // Destination x, y
                            maxSize, maxSize // Destination width, height
                        );

                        // Convert canvas to a Blob and check the size
                        canvas.toBlob(function(blob) {
                            if (blob.size <= 10 * 1024 * 1024) { // 10MB limit
                                const imgPreview = document.querySelector(".content-1 > div#pfp img");
                                imgPreview.src = URL.createObjectURL(blob);
                                imgPreview.style.display = 'block';
                                document.getElementById('fileSize').textContent = `File size: ${(blob.size / (1024 * 1024)).toFixed(2)} MB`;
                                return blob;
                            } else {
                                alert('The resized image exceeds 10MB.');
                            }
                        }, 'image/jpeg');
                    };
                };
                
                reader.readAsDataURL(file);

                // Enable update button when data is edited by user
                document.querySelector("#updatePfBtn").disabled = false;
                
            } else {
                alert('Please select an image file.');
            }


            /*const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgElement = document.querySelector(".content-1 > div#pfp img");
                    imgElement.src = e.target.result;
                    imgElement.style.display = 'block';
                };
                reader.readAsDataURL(file);

                // Enable update button when data is edited by user
                document.querySelector("#updatePfBtn").disabled = false;
            }*/
        });

        // Enable update button when data is edited by user
        document.querySelector(".content #displayName b").addEventListener('keypress', () => {
            document.querySelector("#updatePfBtn").disabled = false;
        })

        // Add event listener to update profile button
        document.querySelector("#updatePfBtn").addEventListener("click", updatePf);
    }
}

// Export the getProfile function
export { getProfile };

// Expose profilePage function globally
window.profilePage = profilePage;