let questions = [];
let selectedQuestions = [];
let currentQuestionIndex = 0;
let playerScore = 0;
let gameStarted = false;

const countdownElement = document.getElementById("countdown-timer");
const playerInput = document.getElementById("user-input");
const codeDisplay = document.getElementById("code-display");
const expectedOutput = document.getElementById("expected-output");
const scoreDisplay = document.getElementById("player-score");

const gameScreen = document.getElementById("game-screen");
const countdownScreen = document.getElementById("countdown-screen");

function fetchQuestions() {
    fetch("../json/questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
        });
}

function startCountdown() {
    let timeLeft = 3;
    countdownElement.textContent = timeLeft;
    countdownScreen.style.display = "block";

    const countdownTimer = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            countdownScreen.style.display = "none";
            startGame();
        }
    }, 1000);
}

function startGame() {
    gameStarted = true;
    playerScore = 0;
    currentQuestionIndex = 0;
    selectedQuestions = shuffleArray([...questions]).slice(0, 5);

    gameScreen.style.display = "block";
    showQuestion();
}

function showQuestion() {
    const question = selectedQuestions[currentQuestionIndex];
    codeDisplay.textContent = question.code.replace("___", "_____");
    expectedOutput.textContent = question.expectedOutput;
    playerInput.value = "";
    playerInput.disabled = false;
    playerInput.focus();
}

function submitAnswer() {
    const answer = playerInput.value.trim();
    const currentQuestion = selectedQuestions[currentQuestionIndex];

    if (answer === currentQuestion.solution) {
        playerScore++;
        scoreDisplay.textContent = playerScore;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < selectedQuestions.length) {
        showQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    playerInput.disabled = true;
    codeDisplay.innerHTML = `<strong>Game Over!</strong> You scored ${playerScore}/5`;
    expectedOutput.textContent = "";

    const rematchBtn = document.createElement("button");
    rematchBtn.textContent = "Rematch";
    rematchBtn.onclick = () => {
        gameScreen.style.display = "none";
        startCountdown();
    };

    const menuBtn = document.createElement("button");
    menuBtn.textContent = "Return to Menu";
    menuBtn.onclick = () => {
        window.location.href = "/";
    };

    codeDisplay.appendChild(document.createElement("br"));
    codeDisplay.appendChild(rematchBtn);
    codeDisplay.appendChild(menuBtn);
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

playerInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        submitAnswer();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetchQuestions();

    const gameStartBtn = document.createElement("button");
    gameStartBtn.textContent = "Start Game";
    gameStartBtn.id = "start-game";
    gameStartBtn.onclick = () => {
        if (!gameStarted) startCountdown();
    };
    countdownScreen.appendChild(gameStartBtn);
});
