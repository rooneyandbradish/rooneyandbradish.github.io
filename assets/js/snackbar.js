function showSnackBar(message) {
    var x = document.getElementById("snackbar")
    x.innerHTML = message;
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function createSnackBar(){
    if(document.getElementById("snackbar") === null){
        var div = document.createElement('div');
        div.id = "snackbar"
        document.body.appendChild(div);
    }
}
