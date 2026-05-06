let currentSnippet = null;
let playerScore = 0;
let aiScore = 0;
let difficulty = "";
let countdownTime = 3;
let answeredQuestions = [];

let countdownInterval;
let hasInputListener = false;

function selectDifficulty(level) {
    difficulty = level;
    document.getElementById("difficulty-screen").style.display = "none";
    document.getElementById("countdown-screen").style.display = "block";
    countdownTime = 3;
    startCountdown();
}

function startCountdown() {
    countdownInterval = setInterval(() => {
        document.getElementById("countdown-timer").textContent = countdownTime;
        countdownTime--;
        if (countdownTime < 0) {
            clearInterval(countdownInterval);
            startGame();
        }
    }, 1000);
}

function startGame() {
    document.getElementById("countdown-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    answeredQuestions = [];
    playerScore = 0;
    aiScore = 0;
    document.getElementById("player-score").textContent = "0";
    document.getElementById("ai-score").textContent = "0";
    loadSnippet();

    if (!hasInputListener) {
        document.getElementById("user-input").addEventListener("keypress", async event => {
            if (event.key === "Enter") {
                event.preventDefault();
                await checkAnswer();
            }
        });
        hasInputListener = true;
    }
}

function loadSnippet() {
    fetch("../json/questions.json")
        .then(response => response.json())
        .then(questions => {
            currentSnippet = questions[Math.floor(Math.random() * questions.length)];

            document.getElementById("code-display").textContent = currentSnippet.code;
            document.getElementById("expected-output").textContent = currentSnippet.expectedOutput;
            document.getElementById("hint").textContent = currentSnippet.hint;

            startAITyping();
        })
        .catch(error => console.error("Error loading questions:", error));
}

async function checkAnswer() {
    const userAnswer = document.getElementById("user-input").value.trim();
    const hashedUserAnswer = await hashString(userAnswer);

    if (
        hashedUserAnswer === currentSnippet.hashedSolution ||
        userAnswer === currentSnippet.solution
    ) {
        playerScore++;
        document.getElementById("player-score").textContent = playerScore;
        logAnswer("Player", userAnswer);
        document.getElementById("user-input").value = "";
        checkWinCondition();
        loadSnippet();
    } else {
        alert("Incorrect answer. Try again!");
    }
}

function startAITyping() {
    const aiInputField = document.getElementById("ai-input");
    aiInputField.value = "";
    const solution = currentSnippet.solution;
    let typedAnswer = "";
    let i = 0;

    const interval = setInterval(() => {
        if (i < solution.length) {
            typedAnswer += Math.random() < getErrorChance() ? getRandomChar() : solution[i];
            aiInputField.value += "*";
            i++;
        } else {
            clearInterval(interval);
            if (typedAnswer === solution) {
                aiScore++;
                document.getElementById("ai-score").textContent = aiScore;
                logAnswer("AI", solution);
                checkWinCondition();
                loadSnippet();
            } else {
                setTimeout(startAITyping, 1000);
            }
        }
    }, 500);
}

function logAnswer(who, answer) {
    answeredQuestions.push({
        question: currentSnippet.code,
        correctAnswer: currentSnippet.solution,
        expectedOutput: currentSnippet.expectedOutput,
        answeredBy: who === "Player" ? currentUser : who,
        givenAnswer: answer
    });

    if (who === "Player" && currentUser !== "Guest") {
        updatePlayerScore();
    }
}

function getErrorChance() {
    if (difficulty === "easy") return 0.8;
    if (difficulty === "medium") return 0.6;
    return 0.2;
}

function getRandomChar() {
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890+-*/";
    return chars[Math.floor(Math.random() * chars.length)];
}

function checkWinCondition() {
    if (playerScore >= 3) {
        showVictoryScreen("Jij wint!");
    } else if (aiScore >= 3) {
        showVictoryScreen("De AI wint!");
    }
}

function showVictoryScreen(message) {
    let html = `<h2>${message}</h2>
    <table>
        <thead>
            <tr>
                <th>Code Snippet</th>
                <th>Correct Answer</th>
                <th>Answered By</th>
            </tr>
        </thead>
        <tbody>`;

    for (const q of answeredQuestions) {
        html += `<tr>
                    <td><pre>${q.question}</pre></td>
                    <td>${q.correctAnswer}</td>
                    <td>${q.answeredBy}</td>
                </tr>`;
    }

    html += `</tbody></table>
             <button id="play-again-btn">Play Again</button>`;

    const container = document.createElement("div");
    container.id = "victory-screen";
    container.className = "victory-screen";
    container.innerHTML = html;

    document.querySelector("main").innerHTML = "";
    document.querySelector("main").appendChild(container);

    document.getElementById("play-again-btn").addEventListener("click", restartGame);
}

function restartGame() {
    location.reload();
}

async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
