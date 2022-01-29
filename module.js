import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import {
    getFirestore, collection,
    getDocs, addDoc, deleteDoc, doc,
    onSnapshot, query, where, orderBy,
    serverTimestamp, updateDoc
        } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyAYqBibS4fBesZySCU9bJcjM4svg3q9KyM",
authDomain: "image-resize-5d865.firebaseapp.com",
projectId: "image-resize-5d865",
storageBucket: "image-resize-5d865.appspot.com",
messagingSenderId: "274583591647",
appId: "1:274583591647:web:7bf74d1eb5d1137ea8a76a",
measurementId: "G-21JXMLFBHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// ---------------------------------------- Get
const db = getFirestore()
const collect =  collection(db, 'images')
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-= add
const add = document.querySelector('.form-send')
add.addEventListener('submit',(e) => {
    e.preventDefault()
    let input = document.querySelector("input").files[0];

    const metaData = {
        contentType: input.type
    }
    const storage = getStorage()

    const stroageRef = ref(storage, "Images/" + input.name);
    const UploadTask = uploadBytesResumable(stroageRef, input, metaData);

    var containProcess =  document.getElementById("process");
    UploadTask.on('state-changed', (snapshot)=>{
    const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        containProcess.innerHTML = process + "%"
    },                                                 
    (error) =>{
        alert("error: image not uploaded!");
    }, 
    () => {
        getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
            addDoc(collect, {
            name: input.name,
            link: downloadURL,
            }).then(() => {
            add.reset()
            containProcess.innerHTML = "";
            })
        })
    }
)
})
const root = document.getElementById("root")
onSnapshot(collect,(snapshot) => {
    snapshot.docs.forEach((doc) => {
    root.insertAdjacentHTML("afterbegin",
    `
    <div class="wrap-img">
        <img class="images" src="${doc.data().link}" alt="${doc.id}">
        <strong>${doc.data().name}</strong>
    </div>
    `)
    })
})
