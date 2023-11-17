function adjustDivWidth() {
    
    const windowWidth = window.innerWidth;
    const myDiv = document.getElementById('blogContainer');
    myDiv.style.width = windowWidth <= 700 ? '100%' : '75%';
    
}


function showHideBlogAddButtons() {

    const bigAddBtn = document.querySelector(".addBtn");
    const smallAddBtn = document.querySelector(".miniAddBtn");

    const windowWidth = window.innerWidth;

    bigAddBtn.style.display = windowWidth <= 1200 ? 'none' : 'block';
    smallAddBtn.style.display = windowWidth <= 1200 ? 'block' : 'none';

}

function doIT(){

    adjustDivWidth();
    showHideBlogAddButtons();

}

// Call the function on page load
adjustDivWidth();
showHideBlogAddButtons();

// Add a resize event listener to adjust the width when the window is resized
window.addEventListener('resize', adjustDivWidth);
window.addEventListener('resize', showHideBlogAddButtons);