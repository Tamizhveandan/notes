
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import { getAuth, signInWithPopup,createUserWithEmailAndPassword, GoogleAuthProvider , signInWithEmailAndPassword,updatePassword,sendPasswordResetEmail } 
from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCjpgXbZDa0AQqrYsgdyPK3i1kho-i6Ow",
  authDomain: "bangtan-notes.firebaseapp.com",
  projectId: "bangtan-notes",
  storageBucket: "bangtan-notes.appspot.com",
  messagingSenderId: "474807166442",
  appId: "1:474807166442:web:5e64d5dfc7e8e046f3be93",
  measurementId: "G-CL9N50J93Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider;


// index page
const email = document.getElementById("floatingInput");
const password = document.getElementById("floatingPassword");
const login = document.querySelector(".login");
const signup = document.querySelector(".signUp");
const forgotpassword = document.querySelector("#forgotpassword");
const google = document.querySelector(".google")
const button = document.querySelector("#button")
const forgotInput = document.querySelector("#forgotInput")
const Password = document.querySelector("#changePassword")


// signup page
const userEmail = document.getElementById("useremail");
const confirmEmail = document.getElementById("confirmemail");
const newPassword = document.getElementById("password");
const confirmPassword = document.getElementById("confirmpassword");
const createAccount = document.getElementById("button")
const errorMessage = document.querySelector(".errorMessage");


var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
function ValidateMail(mail){
  if(mail.match(mailformat)){
    console.log("hi")
    return true;
  }
}


if(createAccount){
  createAccount.addEventListener("click",(event)=>{
    event.preventDefault();
     
    if(userEmail.value === confirmEmail.value && userEmail.value != ""){
      
      if(newPassword.value === confirmPassword.value && newPassword.value != "" ){
        
        if(newPassword.value.length >= 8){
          if(ValidateMail(userEmail.value)){
            authenticatesignup();
          }
        }
        else{
          errorMessage.innerHTML = "password length should be atleast 8"
        }
      }
      else{
        errorMessage.innerHTML = "enter the password"
      }
      
    }
    else{
      errorMessage.innerHTML = "enter a valid email"
    }



  })
}

if(google){
  google.addEventListener("click",(e)=>{
    authorizeGoogleAuth();
});
}

if(button){
  button.addEventListener("click",(e)=>{

    authenticatesignup();
  })
}

if(login){
  login.addEventListener("click",(e)=>{
    authenticatelogin();
  })
}


if(forgotpassword){
  
  forgotpassword.addEventListener("click",(e)=>{
    const mail = forgotInput.value
    const pass = Password.value
     changePassword(mail,pass);
  })
}




async function authorizeGoogleAuth(){
  await signInWithPopup(auth,provider)
  .then((result)=>{
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    
    setTimeout(()=>{
      localStorage.setItem("userid",user.uid)
      window.location.href = 'html/homepage.html'
    })
  })
  .catch((error)=>{
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode);
    const email = error.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  })

}

function authenticatesignup(){

  createUserWithEmailAndPassword(auth, userEmail.value, newPassword.value)
  .then((userCredential)=>{
    const user = userCredential.user;
    console.log("account created successfully");
    window.location.href = "../index.html";
  })
  .catch((error)=>{
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    window.alert(errorCode)
  })
}


function authenticatelogin(){
  const auth = getAuth();
signInWithEmailAndPassword(auth, email.value, password.value)
  console.log(email.value,password.value)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("account logined in successfully");
    localStorage.setItem("userid",user.uid)
    window.location.href = 'html/homepage.html';
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert(errorCode)
    console.log(email.value,password.value)
    //location.reload()
  });
}


function changePassword(id,pass){
  // password reseting 
  const user = auth.currentUser;
  const newPassword = pass

  updatePassword(user, newPassword).then(() => {
    // Update successful.
    
    window.alert("password changed")
    location.reload()
  }).catch((error) => {
    // An error ocurred
    console.log("password unchanged")
    window.alert(error.message)
  });
}







