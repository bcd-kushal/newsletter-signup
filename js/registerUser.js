import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, set, get, child } from "firebase/database";

const submittedButton = document.getElementsByClassName("submitBtn")[0];
const responseField = document.getElementsByClassName("responseBox")[0];
const inputs = document.querySelectorAll(".inputs");

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






function tweakEmailDots( mailString, x ){

    mailString = mailString || "";
    if( x==1 ){  //change dots to percent
        return mailString.replace(/\./g, '%');
    }

    if( x==2 ){  //change percent to dots
        return mailString.replace(/%/g, '.');
    }
    
}


                

function checkAllFormFields(){
    if( document.getElementById("fname").value == "" || document.getElementById("mailID").value == "" )
        return false;
    return true;
}




submittedButton.addEventListener( "click", ( event ) => {
    event.preventDefault();
    


    //------- first check for all fields are filled or not ----------->
    const x =  checkAllFormFields();

    if(!x){
        responseField.innerHTML = "First name and Email are required"
        responseField.style.color = "blue";
        return;
    }

    //------- get users and check if user email already exists or not ----->
    get( child( ref( dataBase ), "registeredUsers/"))
        .then(( data ) => {
            if( data.exists() ){

                const registeredUsers = data.val();
                

                const form_data = {
                    firstName: document.getElementById("fname").value,
                    lastName: document.getElementById("lname").value,
                    emailID: document.getElementById("mailID").value
                }
    
                let res = true;

                

                Object.entries(registeredUsers).forEach(([key, value]) => {
                    
                    if( tweakEmailDots(key, 2) == form_data.emailID ){
                        responseField.innerHTML = "User already registered"
                        responseField.style.color = "orange";
                        res = false;
                    }
                    
                });


                if( !res )
                    return;

                const secureVerificationCode = generateSecureRandomCode(6);
    
                const templateParams = {
                    to_name: form_data.firstName,
                    verification_code: String(secureVerificationCode),
                    receiver_mail: form_data.emailID
                };

                var formData = new FormData(this);
                formData.append('service_id', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_SERVICE_ID) );
                formData.append('template_id', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_TEMPLATE_ID_VERIFICATION) );
                formData.append('user_id', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_PUBLIC_KEY) );
                formData.append('verification_code', templateParams.verification_code );
                formData.append('from_name', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_MY_NAME) );
                formData.append('to_name', templateParams.to_name );
                formData.append('company_name', String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_COMPANY_NAME) );
                formData.append('receiver_email', templateParams.receiver_mail );
                formData.append('email_concern', "newsletter registration" );


                const sendTypes = {
                    type: "POST",
                    data: formData,
                    contentType: false,
                    //templateParams: templateParams
                    processData: false
                }


                $.ajax( String(import.meta.env.SNOWPACK_PUBLIC_EMAILJS_API), sendTypes ).done(() => {

                    const VERIFICATION_TOTAL_TIME_ALLOWED = 5*60*1000;
                    const timer = setTimeout(() => { 
                        alert("Verification code expired");
                    }, VERIFICATION_TOTAL_TIME_ALLOWED );

                    const responseCode = prompt("Enter code here...");
                    if( responseCode ){
                        clearTimeout( timer ); //dont fire this event
                        if( String(responseCode) == String(templateParams.verification_code) ){


                            //add user into json field
                            let users = registeredUsers;
                
                            users[form_data.emailID] = {
                                "fname": form_data.firstName,
                                "lname": form_data.lastName || ""
                            }
                
                            users = JSON.stringify( users, null, 4 );
                            console.log(users);

                
                            set( ref( dataBase, "registeredUsers/" + tweakEmailDots( form_data.emailID, 1 ) ), {
                                "first_name": form_data.firstName,
                                "last_name": form_data.lastName
                            } ).then(() => {
                    
                    
                                responseField.innerHTML = "Registration Successful!"
                                responseField.style.color = "green";
                                //res = true; //user verified
                    
                    
                            }).catch((err) => {
                                console.error("ERROR: ", err);
                            })



                        }
                        else{ 
                
                            responseField.innerHTML = "Unauthentic Verification Code"
                            responseField.style.color = "red";
                            //res = false; //user not authentic
                        }
                    }


                }).fail(( err ) => { 
                    alert( JSON.stringify(err) ); 
                });





            } else {
                console.error( "couldnt get blog data from firebase ");
            }

        })
        .catch((err) => {
            console.error("ERROR 204: ", err);
        });
    

    //===== CREATE SECURE KEY =======================================

    function generateSecureRandomCode(length) {
        const chars = '0123456789';
        const charLength = chars.length;
        let code = '';

        if (window.crypto && window.crypto.getRandomValues) {
            const values = new Uint32Array(length);
            window.crypto.getRandomValues(values);
            for (let i = 0; i < length; i++) {
                code += chars[values[i] % charLength];
            }
        } else {
            // Fallback to Math.random (less secure)
            for (let i = 0; i < length; i++) {
                code += chars[Math.floor(Math.random() * charLength)];
            }
        }

        return code;
    }



})



inputs.forEach(( el ) => {
    el.addEventListener( "keydown", () => {
        responseField.innerHTML = "";
    })
})


