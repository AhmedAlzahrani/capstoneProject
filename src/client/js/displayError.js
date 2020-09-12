
export function displayError(){
    const form = document.getElementById("search-form");
    const ErrorMsg = "No such City Found!";
    const msg = document.createElement("p");
    msg.textContent = ErrorMsg;
    msg.setAttribute("id" , "errorMsg");
    msg.style = "color: red";
    form.appendChild(msg);
}