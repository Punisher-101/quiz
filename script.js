// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countDown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations

let equationsArray = [];
let playerGuessArray = [];
let questionAmount = 0;
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

// Scroll
let valueY = 0;

// Refresh Splash Page for Best Scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, i) => {
    bestScore.textContent = `${bestScoreArray[i].bestScore}s`;
  });
}

// Check Local Storage gor best scores and set bestscorearray values
function getSavedBestScores() {
  if (localStorage.getItem("bestScores")) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Update best Score array
function updateBestScore() {
  bestScoreArray.forEach((score, i) => {
    // Select Correct best score to update
    if (questionAmount === score.questions) {
      //  Return Best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[i].bestScore);
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[i].bestScore = finalTimeDisplay;
      }
    }
  });
  // Updating DOM to display the new best scores on the webpoge
  bestScoresToDOM();
  // save to local storage
  localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
}

// PlayAgain Function
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Show Score Page
function showScorePage() {
  // Show play again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Score to DOM - Format and Display time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTime.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to the top of the item container
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

// Stop the timer and process the results, Go to scorepage
function checkTime() {
  if (playerGuessArray.length === Number(questionAmount)) {
    clearInterval(timer);

    // Check for Wrong Guesses and Penalty Time
    equationsArray.forEach((equation, i) => {
      if (equation.evaluated === playerGuessArray[i]) {
        // Correct Guess, No Penalty
      } else {
        // Incorrect Guess, Add penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDOM();
  }
}
// Tenth of a second to timeplayer
function addTime() {
  timePlayed += 0.1;
  checkTime();
}
// Start timer when game page is clicked
function startTimer() {
  // reset the times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// Scroll, Store user selection in playerguessarray
function select(guessedTrue) {
  // Scroll 80px at a time
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// Display GAme Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random Number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Function - Equations To DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equations Text
    const equationText = document.createElement("hi");
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}
// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// Display 3 2 1 Go!
function countDownStart() {
  let timeOuts = ["3", "2", "1", "Go!"];
  let steps = 1;
  countDown.textContent = timeOuts[0];
  let intervalId = setInterval(() => {
    if (steps < timeOuts.length) {
      countDown.textContent = timeOuts[steps];
      steps++;
    } else {
      clearInterval(intervalId);
    }
  }, 1000);
}

// Navigate from Splash to Countdown page
function showCountDown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countDownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Function - FOrm that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  if (questionAmount !== undefined) {
    showCountDown();
  }
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selection Label Styling
    radioEl.classList.remove("selected-label");
    // Add it back if the radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// Event Listeners
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

// On Load
getSavedBestScores();
