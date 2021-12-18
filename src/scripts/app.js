import { handlePOIClick } from "./modules/poi.js";
import { handleFormSubmit } from "./modules/formSubmit.js";


document.forms[0].addEventListener("submit", handleFormSubmit);
document.forms[1].addEventListener("submit", handleFormSubmit);

document.querySelector(".origins").addEventListener("click", (e) => {


  let originList = document.querySelector(".origins").children;
  for (let children of originList) {
    children.classList.remove("selected");
  }
  handlePOIClick(e);
});
document.querySelector(".destinations").addEventListener("click", (e) => {

  let destList = document.querySelector(".destinations").children;
  for (let children of destList) {
    children.classList.remove("selected");
  }
  handlePOIClick(e);
});

document.querySelector(".plan-trip").addEventListener("click", () => {
  if (
    !Boolean(document.getElementById("origin").value) &&
    !Boolean(document.getElementById("dest").value)
  )
    alert("Please submit locations to plan");
});
