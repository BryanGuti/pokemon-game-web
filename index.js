"use strict";

const charImages = document.querySelectorAll(".character-button img");
const charNames = document.querySelectorAll(".character-button span");
const charContainer = document.querySelector("#character-container");
const selectButton = document.querySelector("#select-character");
const selectContainer = document.querySelector("#selection-container");

let imageSelected;
let nameSelected;

function start() {
  //  Event listeners

  charImages.forEach((charImage) => {
    charImage.addEventListener("mouseover", overChar);
    charImage.addEventListener("mouseout", outChar);
    charImage.addEventListener("click", focusChar);
  });

  charNames.forEach((charName) => {
    charName.addEventListener("mouseover", overChar);
    charName.addEventListener("mouseout", outChar);
    charName.addEventListener("click", focusChar);
  });

  charContainer.addEventListener("wheel", horScroll);
  selectButton.addEventListener("click", startGame);
}

function startGame() {
  if (!imageSelected || !nameSelected) {
    return;
  }
  selectContainer.style.display = "none";
}

function overChar(event) {
  event.path[1].children[1].style.textShadow = "0 0 1rem #ffea00";
  event.path[1].children[0].style.webkitFilter =
    "drop-shadow(0 0 1rem #ffea00)";
}

function outChar(event) {
  event.path[1].children[1].style.textShadow = "";
  event.path[1].children[0].style.webkitFilter = "";
}

function horScroll(event) {
  event.preventDefault();
  charContainer.scrollLeft += event.deltaY;
}

function focusChar(event) {
  if (event.target === nameSelected || event.target === imageSelected) {
    return;
  }

  if (nameSelected && imageSelected) {
    imageSelected.style.webkitFilter = "";
    nameSelected.style.textShadow = "";
    imageSelected.addEventListener("mouseout", outChar);
    nameSelected.addEventListener("mouseout", outChar);
  }

  event.path[1].children[0].removeEventListener("mouseout", outChar);
  event.path[1].children[1].removeEventListener("mouseout", outChar);
  imageSelected = event.path[1].children[0];
  nameSelected = event.path[1].children[1];
}

window.addEventListener("load", start);
