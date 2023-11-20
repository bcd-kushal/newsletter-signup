import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, child, get } from "firebase/database";
import { bcrypt } from "bcryptjs";

const firebaseConfig = {
    apiKey: "AIzaSyBO2LjF2Vau4wAhjiSB6i-xpUfIrWMv67w",
    authDomain: "newsletter-5be1e.firebaseapp.com",
    databaseURL: "https://newsletter-5be1e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "newsletter-5be1e",
    storageBucket: "newsletter-5be1e.appspot.com",
    messagingSenderId: "422358715800",
    appId: "1:422358715800:web:58f50be1736602d1be6fed"
};

const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);





const COOKIE_USERNAME = "my_blogs_username";
const COOKIE_EXPIRY_DATE = 7;    // 7 days

function setCookie(name, value, days) {
    const expireTime = new Date( Date.now() + (days*24*60*60)*1000 );
    document.cookie = `${name}=${value};expires=${expireTime.toUTCString()};path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}



window.onload = () => {
    const savedUsername = getCookie( COOKIE_USERNAME );
    if (savedUsername) {
      // Automatically populate the username field
      document.querySelector(".userName").textContent = savedUsername;
    }
};


//====== take care of sign in page open and close ================

const signInPageLoader = document.querySelector(".userName");
const popUpScreen = document.querySelector(".frontPopScreen");
const closeButton = document.querySelector(".popClose");


(() => {
    popUpScreen.style.display = "none";
})();

signInPageLoader.addEventListener( "click", () => {

    if( document.querySelector(".userName").textContent == "Sign In" ){     // user not signed in
 
       popUpScreen.style.display = "flex";

    } else {  //user is signed in

        alert("HELLO");

    }


});

popUpScreen.addEventListener( "keydown", ( e ) => {

    if( popUpScreen.style.display == "none" )
        return;

    if( e.key == "Escape" || e.keyCode == 27 )
        popUpScreen.style.display = "none";

});

closeButton.addEventListener( "click", () => {

    if( popUpScreen.style.display == "none" )
        return;

    popUpScreen.style.display = "none";

});

//============ take care of sign in data =============================


const signInButton = document.querySelector(".popSubmit .submitBtn");
const popResponseBox = document.querySelector(".popResponseBox");

signInButton.addEventListener( "click", () => {

    const signInUserName = document.querySelector("#popUserName").value;
    const signInPassword = document.querySelector("#popPassword").value;
    
    //---------- check for empty fields ----------------->
    if(signInUserName == ""){
        
        popResponseBox.style.color = "orange";
        popResponseBox.textContent = "Empty Username";

        setTimeout(() => {
            popResponseBox.textContent = "";
        }, 3.5*1000 );

        return; 

    }

    if(signInPassword == ""){
        
        popResponseBox.style.color = "orange";
        popResponseBox.textContent = "Empty Password";
        
        setTimeout(() => {
            popResponseBox.textContent = "";
        }, 3.5*1000 );

        return; 

    }

    //------------- check whether username abides rules -------------->
    function isValidUsernamePassword( str ){
        var RE_rule = /^[^ .()\[\]{}\\]+$/;
        if( RE_rule.test( str ) )
            return true;
        return false;
    }

    if( !isValidUsernamePassword( signInUserName ) || !isValidUsernamePassword( signInPassword ) ){

        popResponseBox.style.color = "red";
        popResponseBox.textContent = "Cant use spaces, brackets, dots";
        
        setTimeout(() => {
            popResponseBox.textContent = "";
        }, 3.5*1000 );

        return; 

    }




    //check if signing as admin or not
    //const signInType = ( document.querySelector("#popCheck").checked )? "admins/" : "registeredUsers/";

    //fetch firebase admins and check if firstname + " " + lastname == full name
    
    get( child( ref( dataBase ), "admins/" ))
        .then(( data ) => {
            if( data.exists() ){

                const admins = data.val();
                let isValidAdmin = false;
                
                /* 
                Object.entries(admins).forEach(([key, value]) => {
                    console.log(`Key: ${key}, Value: ${value.title} ${value.desc}`);
                });                  
                */


                const adminList = Object.entries(admins);
                //console.log(adminList, "...", adminList.length);

                for( let i = 0; i<adminList.length; i++ ){
                    const admin = adminList[i];
                    const adminUsername = admin[0];
                    const adminPassword = admin[1].password;

                    if( adminUsername === signInUserName && adminPassword === signInPassword ){
                        popResponseBox.style.color = "green";
                        popResponseBox.textContent = `Valid Admin, Welcome ${signInUserName}`;
                        isValidAdmin = true;

                        //set cookie________________
                        setCookie( COOKIE_USERNAME, signInUserName, COOKIE_EXPIRY_DATE );


                        setTimeout(() => {
                            popResponseBox.textContent = "";
                        }, 3.5*1000 );

                        break;
                    }

                }

                if( !isValidAdmin ){
                    popResponseBox.style.color = "red";
                    popResponseBox.textContent = "Invalid Admin";

                    setTimeout(() => {
                        popResponseBox.textContent = "";
                    }, 3.5*1000 );

                    return;
                }

                //--------- valid username checked, do next stuffs here ---------------->

                        //change username on screen
                const usernameTitle = document.querySelector(".userName");
                usernameTitle.textContent = signInUserName;

                        //hide signin page
                document.querySelector("#popUserName").value = "";
                document.querySelector("#popPassword").value = "";
                popUpScreen.style.display = "none";

            } else {
                console.error( "couldnt get admin data from firebase ");
            }

        })
        .catch((err) => {
            console.error("ERROR 204: ", err);
        });


});











//======= crypto hashing to generate password hash for cookie storage ==================
// Function to hash a password with a unique salt using scrypt
async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const key = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
    return `${salt}:${key}`;
}

// Function to verify a password against its hash
async function verifyPassword(password, hashedPassword) {
    const [salt, key] = hashedPassword.split(':');
    const keyToCompare = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
    return key === keyToCompare;
}
  
// Example usage
(async () => {
    const plainTextPassword = 'user123password';
    
    // Hash the password before storing it
    const hashedPassword = await hashPassword(plainTextPassword);
    console.log('Hashed Password:', hashedPassword);
  
    // Verify the password during login
    const isPasswordMatch = await verifyPassword(plainTextPassword, hashedPassword);
    console.log('Password Match:', isPasswordMatch);
})();
