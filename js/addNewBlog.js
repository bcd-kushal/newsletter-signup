import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, child, get, set } from "firebase/database";

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




let totalNewBlogFieldsAdded = 0;


function tweakEmailDots( mailString, x ){

    mailString = mailString || "";
    if( x==1 ){  //change dots to percent
        return mailString.replace(/\./g, '%');
    }

    if( x==2 ){  //change percent to dots
        return mailString.replace(/%/g, '.');
    }
    
}


function showError( blogParam, description, highlightColor ){

    const errorTitle = document.querySelector(".lastUpdate");
    const errorDesc = document.querySelector(".lastUpdated");
    errorTitle.style.color = highlightColor;
    errorTitle.textContent = blogParam;
    errorDesc.style.color = highlightColor;
    errorDesc.textContent = description;

    setTimeout(() => {
        errorTitle.style.color = "rgb(0,0,0)";
        errorTitle.textContent = "Last updated:";
        errorDesc.style.color = "rgb(0,0,0)";
        errorDesc.textContent = "16 Nov 2023";
    }, 3300 );

    return;

}



function getInstantaneousTime(){

    const now = new Date();

    // Get individual date and time components
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  
    // Format the date and time
    const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}`;
  
    return formattedDateTime;

}


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



//=======[ add field ]==============================================================

const addBtn = document.querySelector(".addBtn");
const miniAddBtn = document.querySelector(".miniAddBtn");

addBtn.addEventListener( "click", () => {
    //check if total new blog fields is already 2 or not 
    if( totalNewBlogFieldsAdded >= 2 ){
        showError( "Max of 2 Blog Drafts", "allowed at a time", "orange" );
        return;
    }
    const blogContainerBox = document.getElementById("blogContainer");
    blogContainerBox.appendChild(createHeaderDescPair());
});

miniAddBtn.addEventListener( "click", () => {
    //check if total new blog fields is already 2 or not 
    if( totalNewBlogFieldsAdded >= 2 ){
        showError( "Max of 2 Blog Drafts", "allowed at a time", "orange" );
        return;
    }
    const blogContainerBox = document.getElementById("blogContainer");
    blogContainerBox.appendChild(createHeaderDescPair());
});




function createHeaderDescPair() {

    const element = document.querySelector('[data-blog-template]').content.cloneNode(true);


    //----- delete button ---------------->
    element.querySelector('[data-delete-btn]').addEventListener('click', e => {
        e.target.closest('[data-header-desc-pair]').remove();
        totalNewBlogFieldsAdded = Math.max( totalNewBlogFieldsAdded-1, 0 );
    });

    //----- ok button -------------------->
    element.querySelector('[data-ok-btn]').addEventListener('click', e => {
        
        const len = document.querySelectorAll("[data-title-box]").length;
        
        const blogTitle = document.querySelectorAll("[data-title-box]")[len-1];
        const blogDesc = document.querySelectorAll("[data-desc-box]")[len-1];


        
        //------- check if blog has everything or not --------------------->
        
        if(blogTitle.value == ""){
            return showError( "Blog Title", "cannot be empty", "red" );
        }

        if(blogDesc.value == ""){
            return showError( "Blog Description", "cannot be empty", "red" );
        }


        
        document.querySelectorAll("[data-title-box]")[len-1].readOnly = true;
        blogDesc.readOnly = true;
        blogDesc.style.resize = "none";
        blogDesc.style.cursor = "pointer";
        blogTitle.style.cursor = "pointer";
        
        document.querySelectorAll("[data-header-desc-pair]")[len-1].style.cursor = "pointer";

        const dateRN = getInstantaneousTime();
        const properDate = convertToProperDate( dateRN );
        document.querySelectorAll("[data-time-box]")[len-1].innerHTML = properDate;

        e.target.closest('[data-buttons-field]').remove();


        document.querySelectorAll("[data-time-box]")[len-1].value = dateRN;


        //------- save blog data to database ------------------->
        
                
        set( ref( dataBase, "myBlogs/" + dateRN ), {
            "title": blogTitle.value || "",
            "desc": blogDesc.value || ""
        } ).then(() => {
            
            
            alert( "This blog is saved" );
            
            
        }).catch((err) => {
            console.error("ERROR: ", err);
        });



        //------- get users and share email to them all --------->
        

        // get all users registeredvfrom firebase ----------------->
        get( child( ref( dataBase ), "registeredUsers/"))
        .then(( data ) => {
            if( data.exists() ){

                const allUsers = data.val();
                const templateParams = {
                    blog_title: blogTitle.value || "",
                    blog_brief: blogDesc.value || "brief desc placeholder" + "...",
                    site_link: String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_SITE_LINK)
                };
                
                /* 
                Object.entries(allUsers).forEach(([key, value]) => {
                    console.log(`Key: ${key}, Value: ${value.first_name} ${value.last_name}`);
                });                     email           fname               lname
                */




                // UPDATING DATE LAST PUBLISHED
                document.querySelector(".lastUpdated").textContent = properDate;
                set( ref( dataBase, "lastBlogUpdated/" + "lastBlogUpdateDate" ), {
                    "date": properDate || ""
                } ).then(() => {
                    console.log("updated date saved to firebase: ",properDate);
                }).catch((err) => {
                    console.error("ERROR: ", err);
                });





                // EMAILING: send email to eavh of them using EMAILJS ---------------------------->>
                Object.entries(allUsers).forEach(([key, value]) => {

                    //console.log(`Key: ${key}, Value: ${value.first_name} ${value.last_name}`);
                    

                    const receiver_mail = tweakEmailDots( key, 2 );
                    //console.table(templateParams);

                    var formData = new FormData(this);
                    formData.append('service_id', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_SERVICE_ID) );
                    formData.append('template_id', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_TEMPLATE_ID_SEND_MAIL) );
                    formData.append('user_id', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_PUBLIC_KEY) );
                    formData.append('my_name', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_MY_NAME) );
                    formData.append('first_name', value.first_name );
                    formData.append('last_name', value.last_name );
                    formData.append('receiver_email', receiver_mail );
                    formData.append('blog_title', templateParams.blog_title );
                    formData.append('blog_brief_desc', templateParams.blog_brief );
                    formData.append('site_link', templateParams.site_link );

                    /* 
                    const x = {
                        'service_id': creds.EMAILJS_SERVICE_ID ,
                        'template_id': creds.EMAILJS_TEMPLATE_ID_SENDEMAIL ,
                        'user_id': creds.EMAILJS_PUBLIC_KEY ,
                        'my_name': creds.MY_NAME ,
                        'first_name': templateParams.first_name ,
                        'last_name': templateParams.last_name ,
                        'receiver_email': templateParams.receiver_mail ,
                        'blog_title': templateParams.blog_title ,
                        'blog_brief_desc': templateParams.blog_brief ,
                        'site_link': templateParams.site_link 
                    };
                    console.table(x); */

                    const sendTypes = {
                        type: "POST",
                        data: formData,
                        contentType: false,
                        //templateParams: templateParams
                        processData: false
                    }

                    
                    $.ajax( String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_API), sendTypes ).done(() => {

                        console.log("sent mail to: ", key);

                    }).fail(( err ) => { 
                        alert( JSON.stringify(err) ); 
                    });


                });


                totalNewBlogFieldsAdded = Math.max( totalNewBlogFieldsAdded-1, 0 );


            } else {
                console.error( "couldnt get user data from firebase ");
            }

        }).catch((err) => {
            console.error("ERROR 234: ", err);
        });


    });



    totalNewBlogFieldsAdded = Math.min( totalNewBlogFieldsAdded+1, 2 );
                                
    return element;
}




//========[ on ok submit remove buttons and get all inputs as non selectable ]=========


