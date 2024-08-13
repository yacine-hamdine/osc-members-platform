import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

const auth = getAuth();

(
    async function checkAuth(){
        let promise = new Promise(resolve => {
            onAuthStateChanged(auth, (user) => {
                if(user){
                    document.getElementById("auth").style.display = "none";
                    const uid = user.uid;
                    resolve("none");
                }
                else{
                    document.getElementById("auth").style.display = "flex";
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
        console.log(user);
        message.innerHTML = "Login successful!";
        message.classList.replace('error', 'success');
    })
    .catch((error) => {
        console.log(error);
        message.innerHTML = "Login Failed!";
        message.classList.replace('success', 'error');
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