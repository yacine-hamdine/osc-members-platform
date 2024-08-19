import { app } from './firebase.js';
import { getFirestore, doc, getDoc} from "firebase/firestore";

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
    document.querySelector("#pfp img").setAttribute('src', user.photoURL);
    document.querySelector("#displayName").innerHTML = user.displayName;

    document.querySelector("#department").innerHTML = profile.department;
    document.querySelector("#position").innerHTML = profile.position;
    document.querySelector("#points").innerHTML = `${profile.points} OPs`;
}