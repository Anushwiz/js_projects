const boxes = document.querySelectorAll(".box");
const resetbtn = document.querySelector("#btn-reset");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector(".msg");
const btnNewGame = document.querySelector("#btn-newGame");

let turnX = true; //player X's turn

const winPattern = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
const reset = () => {
  turnX = true;
  enableButtons();
  msgContainer.classList.add("hide");
};
const disableButtons = () => {
  boxes.forEach((box) => (box.disabled = true));
};
const enableButtons = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.textContent = "";
  });
};

const showWinner = (winner) => {
  msg.innerHTML = `Congrajulations! Winner is ${winner}`;
  msgContainer.classList.remove("hide");
};
const checkWinner = () => {
  for (let pattern of winPattern) {
    let pos1Val = boxes[pattern[0]].innerHTML;
    let pos2Val = boxes[pattern[1]].innerHTML;
    let pos3Val = boxes[pattern[2]].innerHTML;

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val == pos2Val && pos2Val == pos3Val) {
        showWinner(pos1Val);
        disableButtons();
      }
    }
  }
};
boxes.forEach((box) =>
  box.addEventListener("click", () => {
    if (turnX) {
      box.textContent = "X";

      turnX = false;
    } else {
      box.textContent = "O";
      turnX = true;
    }
    box.disabled = true;
    checkWinner();
  })
);

resetbtn.addEventListener("click", reset);
btnNewGame.addEventListener("click", reset);
