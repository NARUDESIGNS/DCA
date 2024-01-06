function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");

    snackbar.innerText = message;

    snackbar.className = "show";

    setTimeout(function () {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}