const registerPage = document.querySelector("#registerPage");
const blogPage = document.querySelector("#blogsPage");

const blogTab = document.querySelector(".blogTab");
const registerTab = document.querySelector(".register");

blogTab.addEventListener( "click", () => {
    blogPage.style.display = "flex";
    registerPage.style.display = "none";
    blogTab.style.color = "rgb(0,0,0)";
    registerTab.style.color = "rgb(159, 159, 159)";
    blogTab.style.fontWeight = "bolder";
});


registerTab.addEventListener( "click", () => {
    registerPage.style.display = "flex";
    blogPage.style.display = "none";
    registerTab.style.color = "rgb(0,0,0)";
    blogTab.style.color = "rgb(159, 159, 159)";
    registerTab.style.fontWeight = "bolder";
});



//when windows loads up ------>
(() => {
    blogPage.style.display = "flex";
    registerPage.style.display = "none";
    blogTab.style.color = "rgb(0,0,0)";
    registerTab.style.color = "rgb(159, 159, 159)";
    blogTab.style.fontWeight = "bolder";
})();