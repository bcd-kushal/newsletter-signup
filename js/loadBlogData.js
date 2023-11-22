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



function convertToProperDate(inputString) {
    // Parse the input string into a Date object
    const dateObj = inputString.substring(0,10);
    const dateObject = new Date(dateObj);
  
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const year = dateObject.getFullYear().toString().slice(-2);

    const formattedDate = `${day} ${month}, ${year}`;

    return formattedDate;
}



//=======[ add blogs from database on window load ]========================================

(() => {


    const blogContainerBox = document.getElementById("blogContainer");
    const lastBlogUpdatedContainerBox = document.querySelector(".lastUpdated");


    // set the blog last update date from firebbase ------------------->>>
    get( child( ref( dataBase ), "lastBlogUpdated/"))
    .then(( data ) => {
        if( data.exists() ){
            lastBlogUpdatedContainerBox.textContent = data.val().lastBlogUpdateDate.date;
        }
    })
    .catch((err) => {
        console.error("ERROR 204: ", err);
    });


    // fetch all the blogs data and show them ------------------->>>
    get( child( ref( dataBase ), "myBlogs/"))
        .then(( data ) => {
            if( data.exists() ){

                const allBlogs = data.val();
                
                
                /* 
                Object.entries(allBlogs).forEach(([key, value]) => {
                    console.log(`Key: ${key}, Value: ${value.title} ${value.desc}`);
                });                  
                */


                Object.entries(allBlogs).forEach(([key, value]) => {
                    
                    blogContainerBox.appendChild(createHeaderDescPair());

                    updateBlogDataFromDB({
                        title: value.title,
                        desc: value.desc,
                        date: key
                    });
                    
                });




            } else {
                console.error( "couldnt get blog data from firebase ");
            }

        })
        .catch((err) => {
            console.error("ERROR 204: ", err);
        });
    

})();

//================[ utility funcs ]========================================================

function createHeaderDescPair() {
    const element = document.querySelector('[data-firebase-blog-template]').content.cloneNode(true);
    return element;
}


function updateBlogDataFromDB( blogData ){

    const len = document.querySelectorAll("[data-title-box]").length || 0;


    //------- these blogs are already saved to database ------------------->
    
    document.querySelectorAll("[data-title-box]")[len-1].value = String( blogData.title ) || "undefined_title";
    document.querySelectorAll("[data-time-box]")[len-1].innerHTML = convertToProperDate( String( blogData.date ) ) || "undefined_date";

    const x = document.querySelectorAll("[data-desc-box]")[len-1];
    x.value = String( blogData.desc ) || "undefined_description_field";

    var lineHeight = parseFloat(getComputedStyle(x).lineHeight);
    var rows = x.value.split('\n').length;
    var remainingEmptyHeight = (rows - 1) * lineHeight;

    // Shrink the textarea
    x.style.height = `${remainingEmptyHeight}px`;
    console.log(remainingEmptyHeight);
    
    x.style.resize = "none";
    
    document.querySelectorAll("[data-title-box]")[len-1].style.cursor = "pointer";
    document.querySelectorAll("[data-desc-box]")[len-1].style.cursor = "pointer";
    document.querySelectorAll("[data-header-desc-pair]")[len-1].style.cursor = "pointer";




    document.querySelectorAll("[data-title-box]")[len-1].readOnly = true;
    document.querySelectorAll("[data-desc-box]")[len-1].readOnly = true;


}

