const placeholders = document.getElementsByClassName("placeholders");

function shiftPlaceHoldersUp(x){
        x = x || 0;

        const el = placeholders[x];
        el.animate({
            top: "-20%",
            fontSize: "15px",
            letterSpacing: "1px",
            color: "var(--prim-color)",
            paddingLeft: "3.8px"
        }, { duration: 200, fill: "forwards" });

    
}


function goBackPlaceHoldersDown(x){
    x = x || 0;

    const el = placeholders[x];
    el.animate({
        top: "20%",
        fontSize: "calc(var(--screen-width) / 58)",
        letterSpacing: "0",
        color: "var(--unfocused)",
        paddingLeft: "0px"
    }, { duration: 200, fill: "forwards" });


}



const inputs = document.querySelectorAll(".inputs");

inputs.forEach((input, index) => {

    input.addEventListener("focus", () => {

        if( input.id == "popPassword" || input.id == "popUserName" || input.id == "popCheck" )
            return;

        shiftPlaceHoldersUp(index);
    });

    input.addEventListener("blur", () => {
        
        if( input.id == "popPassword" || input.id == "popUserName" || input.id == "popCheck" )
            return;

        if(input.value!="" && input.value!=undefined)
            return;
        
        goBackPlaceHoldersDown(index);
    });

});




 