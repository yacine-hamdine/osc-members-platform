import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

const auth = getAuth();

let authPanel = document.getElementById("auth");

(
    async function checkAuth(){
        let promise = new Promise(resolve => {
            onAuthStateChanged(auth, (user) => {
                if(user){
                    authPanel.style.display = "none";
                    const uid = user.uid;
                    resolve("none");
                }
                else{
                    authPanel.style.display = "flex";
                    resolve("none");
                }
            });
        });

        // Remove Load Screen
        document.querySelector("#loading").style.display = await promise;
        
    }
)();

function login(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let message = document.getElementById("loginMessage");

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        //const user = userCredential.user;
        console.log(`Login Successful!`);
        message.classList.add('success');
        message.classList.remove('error');
        message.innerHTML = "Login successful!";
    })
    .catch((error) => {
        console.log(error);
        message.innerHTML = error.message.toString().replace("Firebase:", "");
        message.classList.add('error');
        message.classList.remove('success');
    });
}

document.getElementById('loginBtn').addEventListener('click', login);

function logout(){
    signOut(auth).then(() => {
        authPanel.style.display = "flex";
    }).catch((error) => {
        alert(`An error occurred: ${error}`);
        authPanel.style.display = "none";
    });
}

document.getElementById('logoutBtn').addEventListener('click', logout);