
const signInButton = document.querySelector(".userName");
const popUpScreen = document.querySelector(".frontPopScreen");

(() => {
    popUpScreen.style.display = "none";
})();

signInButton.addEventListener( "click", () => {
    popUpScreen.style.display = "flex";
});

