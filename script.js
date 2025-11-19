const pondCells = document.querySelectorAll(".pond__cell");
const statusText = document.querySelector(".status-text");
const restartBtn = document.querySelector(".restartBtn");

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "Green";
let running = false;

const template = document.querySelector("template");
const modalElement = template.content.cloneNode(true);
document.body.appendChild(modalElement);

const modalOverlay = document.querySelector(".modal-overlay");

function showWinModal(winner) {
  const modalContent = modalOverlay.querySelector(".modal-content");
  modalContent.querySelector("h2").textContent = `🎉 ${winner} Frog Wins! 🎉`;
  modalContent.querySelector("p").textContent =
    "Congratulations on your victory!";
  modalOverlay.classList.add("active");
}

function hideModal() {
  modalOverlay.classList.remove("active");
}

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    hideModal();
  }
});

initializeGame();

function initializeGame() {
  pondCells.forEach((cell, index) => {
    cell.dataset.cellIndex = index;
    cell.addEventListener("click", cellClicked);
  });

  statusText.textContent = `${currentPlayer}'s turn`;
  restartBtn.addEventListener("click", restartGame);
  running = true;
}

function cellClicked() {
  const cellIndex = this.dataset.cellIndex;

  if (options[cellIndex] !== "" || !running) {
    return;
  }

  updateCell(this, cellIndex);
  checkWinner();
}

function updateCell(cell, index) {
  options[index] = currentPlayer;

  const frogImg = document.createElement("img");
  frogImg.classList.add("pond__frog");

  if (currentPlayer === "Green") {
    frogImg.src = "./images/GreenFrogPlayer.png";
    frogImg.alt = "Green frog";
  } else {
    frogImg.src = "./images/PinkFrogComp.png";
    frogImg.alt = "Pink frog";
  }

  cell.appendChild(frogImg);
}

function changePlayer() {
  currentPlayer = currentPlayer === "Green" ? "Pink" : "Green";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA === "" || cellB === "" || cellC === "") {
      continue;
    }

    if (cellA === cellB && cellB === cellC) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
    showWinModal(currentPlayer);
  } else if (!options.includes("")) {
    statusText.textContent = `It's a draw!`;
    running = false;
  } else {
    changePlayer();
  }
}

function restartGame() {
  currentPlayer = "Green";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;

  hideModal();

  pondCells.forEach((cell) => {
    const frogs = cell.querySelectorAll(".pond__frog");
    frogs.forEach((frog) => frog.remove());
  });
}
