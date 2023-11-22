import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, child, get } from "firebase/database";

const firebaseConfig = {
    apiKey:                 String(import.meta.env.SNOWPACK_PUBLIC_FIREBASE_API_KEY),
    authDomain:             String(import.meta.env.SNOWPACK_PUBLIC_FIREBASE_AUTH_DOMAIN),
    databaseURL:            String(import.meta.env.SNOWPACK_PUBLIC_FIREBASE_DATABASE_URL),
    projectId:              String(import.meta.env.SNOWPACK_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket:          String(import.meta.env.SNOWPACK_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId:      String(import.meta.env.SNOWPACK_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId:                  String(import.meta.env.SNOWPACK_PUBLIC_FIREBASE_APP_ID)
};


const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);

//=============================================================================================



// ==== check user cookie is there or not -----------------------------|
// ==== if cookie not there then simply exit --------------------------|

const COOKIE_USERNAME = "my_blogs_username";
    
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


function checkUsernameAuthenticity(){

    setTimeout
    const savedUsername = getCookie( COOKIE_USERNAME );
    
    if (savedUsername) {
        if( document.querySelector(".userName").textContent == savedUsername ){

            const addButton = document.querySelector(".addBtn");

            if( addButton ){
                addButton.parentNode.removeChild( addButton );
            } 

        } 
    }
}


window.onload = () => { checkUsernameAuthenticity(); };

