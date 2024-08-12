import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

const auth = getAuth();

(
    function checkAuth(){
        onAuthStateChanged(auth, (user) => {
            if (user) {
              document.getElementById("auth").style.display = "none";
              const uid = user.uid;
            }
            else{
                document.getElementById("auth").style.display = "flex";
            }
        });
    }
)();

function login(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let message = document.getElementById("loginMessage");

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        message.innerHTML = "Login successful!";
    })
    .catch((error) => {
        console.log(error);
        message.innerHTML = "Login Failed!";
    });
}

document.getElementById('loginBtn').addEventListener('click', login);

function logout(){
    signOut(auth).then(() => {
        document.getElementById("auth").style.display = "flex";
    }).catch((error) => {
        alert(`An error occurred: ${error}`);
        document.getElementById("auth").style.display = "none";
    });
}

document.getElementById('logoutBtn').addEventListener('click', logout);