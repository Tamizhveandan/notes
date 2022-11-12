
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import { getDatabase , ref,set, child, get,remove} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

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
  databaseURL: "https://bangtan-notes-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// const db = getFirestore();
const database = getDatabase(app);
const dbRef = ref(getDatabase());

//selectors
const todoInput = document.querySelector("#todo-input");
const todoButton = document.querySelector("#todo-button");
const todoList = document.querySelector(".todo-list");
const doneList = document.querySelector(".done-list");
const userid  = localStorage.getItem("userid")
const todoid = localStorage.getItem("todoid");
const todoHeading = document.querySelector("#todoHeading")
const doneHeading = document.querySelector("#doneHeading")
const signout = document.querySelector("#signout");

//event listerner

todoButton.addEventListener("click",addTodo);
todoList.addEventListener("click",deleteCheck);
doneList.addEventListener("click",doneDeleteCheck);

if(!userid){
  window.location.href = "../index.html"
}


//function
function addTodo(event){
    event.preventDefault();
    if(todoInput.value.trim() === ""){
        window.alert("enter the task")
        return
    }
    todoHeading.style.display = "block"
    // creating unique string
    const n = Date.now().toString()
    //create div element

    const todoDiv = document.createElement("div");
    todoDiv.classList.add(n)
    todoDiv.classList.add("todo");

    // create tick button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fa-solid fa-check"></i>'; 
    completedButton.classList.add("completed-btn");
    todoDiv.appendChild(completedButton);
    
    //create li element for input text
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    

    // create delete button 

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todoDiv.appendChild(deleteButton);

    
    // adding todo to realtime database
    
    function writeUserData() {
        const db = getDatabase();
        set(ref(db, userid +"/" + "todo"+todoid +"/"+n ), {
          todo: todoInput.value,
          id:n
        });
        console.log("added")
      }

    writeUserData()
    

    //append div
    todoList.appendChild(todoDiv);
    todoInput.value = ""
    

}

function todoDelete(num){
  const db = getDatabase()
  remove(ref(db,`${userid}/todo${todoid}/${num}`))
  .then(()=>{

    console.log("deleted")
  })
  .catch(()=>{
    console.log(error.message)
  })
}

function doneDelete(num){
  const db = getDatabase()
  remove(ref(db,`${userid}/done${todoid}/${num}`))
  .then(()=>{

    console.log("deleted")
  })
  .catch(()=>{
    console.log(error.message)
  })
}

// event for todo list


function deleteCheck(event){
    const item = event.target;
    if(item.classList[0] === "delete-btn"){
        const todo = item.parentElement;
        const parent = todo.parentElement;
        console.log(todo)
        todo.classList.add("fall")
        todo.addEventListener("transitionend",() =>{
            todo.remove();
            todoDelete(todo.classList[0])
            checkThetodo()
        });
        
        
    }
    if(item.classList[0] === "completed-btn"){
        doneHeading.style.display = "block"
        const todo = item.parentElement;
        const parent = todo.classList[0]
        get(child(dbRef, `${userid}/todo${todoid}/${parent}`))
        .then((snapshot) => {
        if (snapshot.exists()) {
          const add_id = snapshot.val().todo
          Done(add_id,parent)
          todoDelete(parent)
          checkThetodo()
        } else {
            console.log("No data available");
        }
        })
        .catch((error) => {
        console.error(error.message);
        });
        todo.remove(); 
        // todo.classList.toggle("completed");
        // todo.classList.toggle("down");
        // todo.addEventListener("transitionend",() =>{
            

        // });
       
        
        // todo.remove()

        


    }
}

// event for done list
function doneDeleteCheck(event){
    const items = event.target;
    if(items.classList[0] === "delete-btn"){
        const todo = items.parentElement;
        todo.classList.add("fall")
        todo.addEventListener("transitionend",() =>{
            todo.remove();
            doneDelete(todo.classList[0])
            checkTheDone()

        });
        
    }
    if(items.classList[0] === "completed-btn"){
        todoHeading.style.display = "block"
        console.log(items.classList)
        const todo = items.parentElement;
        const parent = todo.classList[0];
        todo.remove();
        get(child(dbRef, `${userid}/done${todoid}/${parent}`))
        .then((snapshot) => {
        if (snapshot.exists()) {
          const add_id = snapshot.val().todo
          Todo(add_id,parent)
          doneDelete(todo.classList[0]);
          checkTheDone()
        } else {
            console.log("No data available");
        }
        })
        .catch((error) => {
        console.error(error.message);
        });
        
        // todo.classList.toggle("incompleted");
        // todo.classList.toggle("up");
        // todo.addEventListener("transitionend",() =>{
            

        // });
        // todoList.appendChild(todo);
        
       
        // todo.remove()

    }
}



// getting existing data from todo list 
get(child(dbRef, `${userid}/todo${todoid}`))
.then((snapshot) => {
  if (snapshot.exists()) {
    todoHeading.style.display = "block"
    var todos = []
    snapshot.forEach(childSnapshot => {
        todos.push(childSnapshot.val())
    });
    console.log(todos)
    for (var i= 0; i< todos.length ;i++){
        var todo = todos[i].todo
        var id = todos[i].id
        Todo(todo,id)
    }

  } else {
    console.log("No data available");
  }
})
.catch((error) => {
  console.error(error.message);
});

// getting data from done list

get(child(dbRef, `${userid}/done${todoid}`))
.then((snapshot) => {
  if (snapshot.exists()) {
    doneHeading.style.display = "block"
    var dones = []
    snapshot.forEach(childSnapshot => {
        dones.push(childSnapshot.val())
    });
    for (var i= 0; i< dones.length ;i++){
        var todo = dones[i].todo
        var id = dones[i].id
        Done(todo,id)
    }

  } else {
    
    console.log("No data available");
  }
})
.catch((error) => {
  console.error(error.message);
});

function Todo(todo,id){
  //create div element

  const todoDiv = document.createElement("div");
  todoDiv.classList.add(id)
  todoDiv.classList.add("todo");

  // create tick button
  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<i class="fa-solid fa-check"></i>'; 
  completedButton.classList.add("completed-btn");
  todoDiv.appendChild(completedButton);
  
  //create li element for input text
  const newTodo = document.createElement("li");
  newTodo.innerText = todo
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  

  // create delete button 

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  todoDiv.appendChild(deleteButton);

    // fuction
    function writeUserData() {
      const db = getDatabase();
      set(ref(db, userid +"/" + "todo"+todoid +"/"+id ), {
        todo: todo,
        id:id
      });
      console.log("added")
    }

  writeUserData()

  //append div
  todoList.appendChild(todoDiv);
  
  

}


function Done(todo,id){
  console.log("Done")
    if(todo.trim() === ""){
        console.log("return")
        return
    }
    //create div element

    const todoDiv = document.createElement("div");
    todoDiv.classList.add(id)
    todoDiv.classList.add("todo");

    // create tick button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fa-solid fa-check"></i>'; 
    completedButton.classList.add("completed-btn");
    todoDiv.appendChild(completedButton);
    
    //create li element for input text
    const newTodo = document.createElement("li");
    newTodo.innerText = todo
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    

    // create delete button 

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todoDiv.appendChild(deleteButton);

    // fuction
    function writeUserData() {
        const db = getDatabase();
        set(ref(db, userid +"/" + "done"+todoid +"/"+id ), {
          todo: todo,
          id:id
        });
        console.log("added")
      }

    writeUserData()

    

    //append div
    doneList.appendChild(todoDiv);
    
}

function checkTheDone(){
  get(child(dbRef, `${userid}/done${todoid}`))
.then((snapshot) => {
  if (!snapshot.exists()) {
    doneHeading.style.display = "none"
  }
}
  )}

function checkThetodo(){
  get(child(dbRef, `${userid}/todo${todoid}`))
.then((snapshot) => {
  if (!snapshot.exists()) {
    todoHeading.style.display = "none"
  }
}
  )} 

  //sign out

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
