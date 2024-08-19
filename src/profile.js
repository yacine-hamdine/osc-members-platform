import { app } from './firebase.js';
import { getFirestore, doc, getDoc} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

async function getProfile(user){
    const db = getFirestore(app);

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
        //console.log("Document data:", docSnap.data());
        showProfile(user, docSnap.data());
    }else{
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

export { getProfile };

function showProfile(user, profile){
    document.querySelector("#displayName").innerHTML = user.displayName;

    document.querySelector("#department").innerHTML = profile.department;
    document.querySelector("#position").innerHTML = profile.position;
    document.querySelector("#points").innerHTML = `${profile.points} OPs`;

    const storage = getStorage(app);

    // Reference to the file location in Firebase Storage
    const storageRef = ref(storage, user.photoURL);

    // Get the download URL
    getDownloadURL(storageRef)
    .then((url) => {
        // Insert url into an <img> tag to display the profile picture
        const img = document.querySelector('#pfp img');
        img.src = url;
    })
    .catch((error) => {
        // Handle any errors
        console.error('Error getting profile picture URL:', error);
    });
}