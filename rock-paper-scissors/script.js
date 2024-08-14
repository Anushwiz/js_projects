const choices = document.querySelectorAll(".choice");
console.log(choices);
const msg = document.querySelector(".message");

const userScoreUI = document.querySelector("#user-score");
const compScoreUI = document.querySelector("#comp-score");

let userScore = 0;
let compScore = 0;

function generateCompChoice() {
  const choices = ["rock", "paper", "scissor"];
  const compChoice = choices[Math.floor(Math.random() * 3)];
  return compChoice;
}

function displayWinner(result) {
  const { userChoice, compChoice, winner } = result;
  if (winner === "user") {
    userScore++;
    userScoreUI.innerHTML = userScore;
    msg.innerHTML = `You Won, your ${userChoice} beats ${compChoice}`;
    msg.style.backgroundColor = "#06D001";
    msg.style.color = "#4C4B16";
  } else if (winner === "comp") {
    compScore++;
    compScoreUI.innerHTML = compScore;
    msg.innerHTML = `You lost, ${compChoice} beats your ${userChoice}`;
    msg.style.backgroundColor = "#FF0000";
    msg.style.color = "#4C4B16";
  } else {
    msg.innerHTML = `Game was Draw both Selected ${compChoice}`;
    msg.style.backgroundColor = "#5DEBD7";
    msg.style.color = "#4C4B16";
  }
}

function playGame(userChoice) {
  let winner = null;
  const compChoice = generateCompChoice();
  console.log("user choice is: " + userChoice);
  console.log("computer choice is: " + compChoice);
  if (userChoice === compChoice) {
    console.log("Game Draw");
    winner = "draw";
  } else {
    if (userChoice === "rock") {
      winner = compChoice === "paper" ? "comp" : "user";
      console.log("winner is: " + winner);
    } else if (userChoice === "paper") {
      winner = compChoice === "scissor" ? "comp" : "user";
      console.log("winner is: " + winner);
    } else if (userChoice === "scissor") {
      winner = compChoice === "rock" ? "comp" : "user";
      console.log("winner is: " + winner);
    }
  }
  const result = {
    userChoice,
    compChoice,
    winner,
  };
  displayWinner(result);
}
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userChoice = choice.getAttribute("id");
    const result = playGame(userChoice);
  });
});
