"use strict";

class Mokepon {
  constructor(name) {
    this.name = name;
    this.image = `./assets/mokepons/${name}.png`;
    this.profileImage = new Image();
    this.profileImage.src = `./assets/mokepons/${name}_profile.png`;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
  }
}

// Mokepones to be created
const mokeponesToBeCreated = [
  "capipepo",
  "hipodoge",
  "ratigueya",
  "capipepo",
  "hipodoge",
  "ratigueya",
];

// DOM components
const selectContainer = document.querySelector("#selection-container");
const charContainer = document.querySelector("#character-container");
const selectButton = document.querySelector("#select-character");
const mapContainer = document.querySelector("#map-container");
const mapButtons = document.querySelectorAll(".arrow-button");
const canvas = document.querySelector("#map");
const mapImage = new Image();

// Components properties
const canvasMap = canvas.getContext("2d");
mapImage.src = "./assets/mokemap.png";

// Mokepon selected
let imageSelected;
let nameSelected;

// Mokempons DOM elements and objects
const mokeponElements = [];
const enemyMokepons = [new Mokepon("capipepo")];
let myMokepon;

// Mokepon velocity
let velocity = 0.01;
let interval;

// Game functions
function start() {
  //  Create mokeponElements
  mokeponesToBeCreated.forEach((mokepon) => {
    mokeponElements.push(createChar(mokepon));
  });

  //  Add mokeponElements to character-container
  mokeponElements.forEach((moke) => {
    charContainer.appendChild(moke);
  });

  // Add event listeners to mokeponElements
  mokeponElements.forEach((moke) => {
    moke.firstChild.addEventListener("mouseover", overChar);
    moke.firstChild.addEventListener("mouseout", outChar);
    moke.firstChild.addEventListener("click", focusChar);
    moke.lastChild.addEventListener("mouseover", overChar);
    moke.lastChild.addEventListener("mouseout", outChar);
    moke.lastChild.addEventListener("click", focusChar);
  });

  charContainer.addEventListener("wheel", horScroll);
  selectButton.addEventListener("click", startGame);
}

function createChar(mokeponName) {
  const character = document.createElement("div");
  character.setAttribute("class", "character-button");
  character.setAttribute("id", mokeponName);

  const charImage = document.createElement("img");
  charImage.setAttribute("src", `./assets/mokepons/${mokeponName}.png`);
  charImage.setAttribute("alt", mokeponName);

  const charName = document.createElement("span");
  charName.textContent = mokeponName;

  character.appendChild(charImage);
  character.appendChild(charName);

  return character;
}

function overChar(event) {
  event.target.closest(".character-button").lastChild.style.textShadow = "0 0 1rem #ffea00";
  event.target.closest(".character-button").firstChild.style.webkitFilter =
  "drop-shadow(0 0 1rem #ffea00)";
}

function outChar(event) {
  event.target.closest(".character-button").lastChild.style.textShadow = "";
  event.target.closest(".character-button").firstChild.style.webkitFilter ="";
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

  event.target.closest(".character-button").firstChild.removeEventListener("mouseout", outChar);
  event.target.closest(".character-button").lastChild.removeEventListener("mouseout", outChar);
  imageSelected = event.target.closest(".character-button").firstChild
  nameSelected = event.target.closest(".character-button").lastChild
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

  myMokepon = new Mokepon(nameSelected.innerText);

  myMokepon.profileImage.addEventListener("load", startMapEvents);
}

function startMapEvents() {
  responsiveMap();
  window.addEventListener("resize", responsiveMap);
  window.addEventListener("keydown", moveByKeyboard);

  mapButtons.forEach((button) => {
    button.addEventListener("mousedown", moveByClick);
  });

  mapButtons.forEach((button) => {
    button.addEventListener("mouseout", stopMoviment);
  });

  mapButtons.forEach((button) => {
    button.addEventListener("mouseup", stopMoviment);
  });
}

function responsiveMap() {
  if (window.innerWidth <= 500) {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = canvas.width * 0.75;
  } else if (window.innerWidth <= 700) {
    canvas.width = window.innerWidth * 0.5;
    canvas.height = canvas.width * 0.75;
  } else {
    canvas.width = window.innerWidth * 0.4;
    canvas.height = canvas.width * 0.75;
  }

  if (!myMokepon.x && !myMokepon.y) {
    myMokepon.x = Math.random();
    myMokepon.y = Math.random();

    enemyMokepons[0].x = 0.5;
    enemyMokepons[0].y = 0.5;
  }
  renderImages();
}

function renderImages() {
  canvasMap.clearRect(0, 0, canvas.width, canvas.height);

  canvasMap.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

  myMokepon.width = canvas.width * 0.12;
  myMokepon.height = canvas.width * 0.12;

  canvasMap.drawImage(
    myMokepon.profileImage,
    myMokepon.x * (canvas.width - myMokepon.width),
    myMokepon.y * (canvas.height - myMokepon.height),
    myMokepon.width,
    myMokepon.height
  );

  if (enemyMokepons.length) {
    enemyMokepons.forEach((enemy) => {
      canvasMap.drawImage(
        enemy.profileImage,
        enemy.x * (canvas.width - myMokepon.width),
        enemy.y * (canvas.height - myMokepon.height),
        myMokepon.width,
        myMokepon.height
      );
      checkCollisions(enemy);
    });
  }
}

function checkCollisions(enemy) {
  if (
    myMokepon.x * (canvas.width - myMokepon.width) >
      enemy.x * (canvas.width - myMokepon.width) + myMokepon.width ||
    myMokepon.x * (canvas.width - myMokepon.width) + myMokepon.width <
      enemy.x * (canvas.width - myMokepon.width) ||
    myMokepon.y * (canvas.height - myMokepon.height) >
      enemy.y * (canvas.height - myMokepon.height) + myMokepon.height ||
    myMokepon.y * (canvas.height - myMokepon.height) + myMokepon.height <
      enemy.y * (canvas.height - myMokepon.height)
  ) {
    return;
  }
  startBattle();
}

function startBattle() {
  mapContainer.style.display = "none";
  window.removeEventListener("resize", responsiveMap);
  window.removeEventListener("keydown", moveByKeyboard);
}

function moveByKeyboard(event) {
  switch (event.key) {
    case "ArrowUp":
      stopMoviment();
      if (myMokepon.y >= 0) {
        myMokepon.y -= velocity * 1.25;
        renderImages();
      }
      break;
    case "ArrowDown":
      stopMoviment();
      if (myMokepon.y <= 1) {
        myMokepon.y += velocity * 1.25;
        renderImages();
      }
      break;
    case "ArrowLeft":
      stopMoviment();
      if (myMokepon.x >= 0) {
        myMokepon.x -= velocity;
        renderImages();
      }
      break;
    case "ArrowRight":
      stopMoviment();
      if (myMokepon.x <= 1) {
        myMokepon.x += velocity;
        renderImages();
      }
      break;
  }
}

function moveByClick(event) {
  switch (event.target.id) {
    case "arrow-up":
      stopMoviment();
      interval = setInterval(() => {
        if (myMokepon.y >= 0) {
          myMokepon.y -= velocity * 1.25;
          renderImages();
        }
      }, 40);
      break;
    case "arrow-down":
      stopMoviment();
      interval = setInterval(() => {
        if (myMokepon.y <= 1) {
          myMokepon.y += velocity * 1.25;
          renderImages();
        }
      }, 40);
      break;
    case "arrow-left":
      stopMoviment();
      interval = setInterval(() => {
        if (myMokepon.x >= 0) {
          myMokepon.x -= velocity;
          renderImages();
        }
      }, 40);
      break;
    case "arrow-right":
      stopMoviment();
      interval = setInterval(() => {
        if (myMokepon.x <= 1) {
          myMokepon.x += velocity;
          renderImages();
        }
      }, 40);
      break;
  }
}

function stopMoviment() {
  clearInterval(interval);
}

window.addEventListener("load", start);
