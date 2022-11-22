"use strict";

class Mokepon {
  constructor(name) {
    (this.name = name), (this.image = `./assets/${name}.png`);
  }

  mokepon;

  createChar() {
    const character = document.createElement("div");
    character.setAttribute("class", "character-button");
    character.setAttribute("id", this.name);

    const charImage = document.createElement("img");
    charImage.setAttribute("src", this.image);
    charImage.setAttribute("alt", this.name);

    const charName = document.createElement("span");
    charName.textContent = this.name;

    character.appendChild(charImage);
    character.appendChild(charName);

    this.mokepon = character;
  }
}

const mokeponesToBeCreated = ["capipepo", "hipodoge", "ratigueya"];

let imageSelected;
let nameSelected;

const selectContainer = document.querySelector("#selection-container");
const charContainer = document.querySelector("#character-container");
const selectButton = document.querySelector("#select-character");
const mapContainer = document.querySelector("#map-container");
const canvas = document.querySelector("#map");
const canvasMap = canvas.getContext("2d");

function createMokepones(mokeponesList) {
  return mokeponesList.map((mokepon) => {
    const moke = new Mokepon(mokepon);
    moke.createChar();
    return moke;
  });
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

function horScroll(event) {
  event.preventDefault();
  charContainer.scrollLeft += event.deltaY;
}

function startGame() {
  if (!imageSelected || !nameSelected) {
    return;
  }
  selectContainer.style.display = "none";
  mapContainer.style.display = "grid";
  responsiveMap();
}

function responsiveMap() {
  canvas.style.backgroundColor = "black";

  if (window.innerWidth <= 700 && window.innerWidth > 500) {
    canvas.width = window.innerWidth * 0.5;
    canvas.height = canvas.width * 0.75;
  } else if (window.innerWidth <= 500) {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = canvas.width * 0.75;
  } else {
    canvas.width = window.innerWidth * 0.4;
    canvas.height = canvas.width * 0.75;
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 700 && window.innerWidth > 500) {
      canvas.width = window.innerWidth * 0.5;
      canvas.height = canvas.width * 0.75;
      return;
    }
    if (window.innerWidth <= 500) {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = canvas.width * 0.75;
      return;
    }
    canvas.width = window.innerWidth * 0.4;
    canvas.height = canvas.width * 0.75;
  });
}

function start() {
  //  Create mokepons
  const mokepons = createMokepones(mokeponesToBeCreated);

  //  Add mokepons to character-container
  mokepons.forEach((moke) => {
    charContainer.appendChild(moke.mokepon);
  });

  // Add event listeners to mokepons
  mokepons.forEach((moke) => {
    moke.mokepon.firstChild.addEventListener("mouseover", overChar);
    moke.mokepon.firstChild.addEventListener("mouseout", outChar);
    moke.mokepon.firstChild.addEventListener("click", focusChar);
    moke.mokepon.lastChild.addEventListener("mouseover", overChar);
    moke.mokepon.lastChild.addEventListener("mouseout", outChar);
    moke.mokepon.lastChild.addEventListener("click", focusChar);
  });

  charContainer.addEventListener("wheel", horScroll);
  selectButton.addEventListener("click", startGame);
}

window.addEventListener("load", start);
