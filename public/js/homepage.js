
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { doc, setDoc,collection, getDoc,updateDoc,deleteDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"; 
import { getAuth ,onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";




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
  measurementId: "G-CL9N50J93Y",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// getting data from firebase




// creating reference
const add = document.querySelector(".addBtn");
const container = document.querySelector(".notes-container");
const saveBtn = document.querySelector(".saveBtn");
const headingInput = document.querySelector("#heading-input");
const discription = document.querySelector("#discription");
const addnotes = document.querySelector(".add-notes");
const backBtn = document.querySelector(".back");
const signout = document.querySelector("#signout");
const userid = localStorage.getItem("userid");
const editButton = document.querySelector(".editBtn");
const editNotes = document.querySelector("#edit-notes");
const back2 = document.querySelector("#back2");
const headingInput2 = document.querySelector("#heading-input2");
const discription2 = document.querySelector("#discription2");


const d = new Date();

if(!userid){
    window.location.href = "../index.html"
}


//getting userid from firebase
const auth = getAuth();

signout.addEventListener("click",()=>{;
    
    const auth = getAuth();
    signOut(auth).then(() => {
        window.location.href = "../index.html"
        localStorage.clear();
        console.log("sign out completed")
    // Sign-out successful.
    }).catch((error) => {
        const errorMessage = error.message;
        window.alert(errorMessage)
    // An error happened.
    });

    
})


const docRef = doc(db, userid , "user_notes");
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  console.log("Document data:", docSnap.data().count);
  var num = docSnap.data().count;
  
} else {
   setDoc(doc(db, userid,"user_notes"), {
        count:0
    } );
      console.log("count is initialized")
}

// displaying the notes form firestore

for (var i = 0 ; i <= num;i++){
    var id = i.toString();

    adding_notes(id);

}

async  function adding_notes(id){

    // getting notes from firebase

    const docRef = doc(db, userid , id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
    
    var head = docSnap.data().heading;
    var para = docSnap.data().discription;
    var timing = docSnap.data().timing
    } else {
        return;
    }


    // creating a div for notes

    const notes = document.createElement("div");
    notes.classList.add(id);
    notes.classList.add("notes");
    // adding edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>'; 
    editButton.classList.add("editButton");
    notes.appendChild(editButton);
    

    // creating a h2 tag for heading
    const heading = document.createElement("h2");
    var val1 = head;
    heading.innerText = val1;
    notes.appendChild(heading);
    
    // creating a p tag for discription 

    const text = document.createElement("p");
    var val2 = para;
    text.innerText = val2;
    notes.appendChild(text);
    var breakpoint = document.createElement("br");
    notes.appendChild(breakpoint) ;
    // adding time in the end

    const time = document.createElement("p");
    time.innerText = timing;
    time.classList.add("time")
    notes.appendChild(time)

    //adding button to notes
   
    // create tick button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; 
    trashButton.classList.add("trashButton")
    notes.appendChild(trashButton);

    // finally adding to notes to container
    //add.remove();
    container.appendChild(notes);
    container.append(add);

}



add.addEventListener("click",()=>{;
    
    console.log("hi add");
    addnotes.style.display = "flex";
    container.style.display = "none";

    
})


function getTime(){
    const days = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];

    
    let day = days[d.getDay()];
    let date = d.getDate();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    let month = months[d.getMonth()];

    var time = d.getHours()+":"+d.getMinutes();
    var currentTime ="last edit: " + time+","+" "+day + " " + date + " " +month;
    return currentTime;
}

 saveBtn.addEventListener("click",async (event)=>{

    const docRef = doc(db, userid , "user_notes");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().count);
      var num = docSnap.data().count;
      
    }

    var num = docSnap.data().count;
    var newNum = num.toString()

    if(discription.value.trim() === "" || headingInput.value.trim() === ""){
        window.alert("enter the heading and discription");
        return;
    }
    
    // creating a div for notes
    addnotes.style.display = "none";
    container.style.display = "flex";

    const notes = document.createElement("div");
    notes.classList.add(newNum);
    notes.classList.add("notes");

    // adding edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>'; 
    editButton.classList.add("editButton");
    notes.appendChild(editButton);
    

    // creating a h2 tag for heading
    const heading = document.createElement("h2");
    var val1 = headingInput.value;
    heading.innerText = val1;
    notes.appendChild(heading);
    
    // creating a p tag for discription 

    const text = document.createElement("p");
    var val2 = discription.value;
    text.innerText = val2;
    notes.appendChild(text);
    var breakpoint = document.createElement("br");
    notes.appendChild(breakpoint) ;

    // adding time in the end

    const time = document.createElement("p");
    time.innerText = getTime();
    time.classList.add("time")
    notes.appendChild(time)

    //adding trash button to notes
   
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; 
    trashButton.classList.add("trashButton")
    notes.appendChild(trashButton)
    

    // finally adding to notes to container
    //add.remove();
    container.appendChild(notes);
    container.append(add);

    

    //adding newdocs to firestore
    
    setDoc(doc(db, userid,newNum), {
        heading:headingInput.value,
        discription:discription.value,
        timing: getTime()
      });
    num++;
    updateDoc(doc(db, userid,"user_notes"), {
        count:num
    });
      
    
    
    //clearing the existing words
    headingInput.value = ""
    discription.value = ""
   // location.reload();
})

// back button
backBtn.addEventListener("click",()=>{
    addnotes.style.display = "none";
    container.style.display = "flex";
})

// back2 button
back2.addEventListener("click",()=>{
    editNotes.style.display = "none";
    container.style.display = "flex";
    localStorage.removeItem("id")
})

container.addEventListener("click",clickedButton);

async  function clickedButton(event){
    
    const items = event.target;
    const parent = items.parentElement
    console.log(parent.classList[0])
    const newparent = parent.parentElement.classList[0]
    // console.log(items)
    // console.log(items.parentElement)
    if(parent.classList[0] === "editButton"){
        editNotes.style.display = "flex";
        container.style.display = "none";
        editing_notes(newparent)
    }
    if(parent.classList[0] === "trashButton"){
        console.log(userid,newparent)
        await  deleteDoc(doc(db,userid,newparent));
      
      location.reload();
    }
}

async  function editing_notes(id){
    localStorage.setItem("id",id)
    // getting notes from firebase

    const docRef = doc(db, userid , id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
    
    var head = docSnap.data().heading;
    var para = docSnap.data().discription;
    
    } else {
        return;
    }
    headingInput2.value = head;
    discription2.value = para;

}

editButton.addEventListener("click",updating)

async function updating(){
    var id = localStorage.getItem("id")
    console.log(discription2.value)
    
    await updateDoc(doc(db, userid,id), {
        heading:headingInput2.value,
        discription:discription2.value,
        timing: getTime()
    });
    localStorage.removeItem("id")
    editNotes.style.display = "flex";
    container.style.display = "none";
    location.reload();
      
}









