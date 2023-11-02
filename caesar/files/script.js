const questionElement = document.getElementById('question');
const optionElements = document.getElementsByClassName('option');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;
let wrongAnswers = 0;
let questions = [];
let usedQuestions = [];

// Lataa kysymykset JSON-tiedostosta
function loadQuestions() {
  fetch('files/questions.json')
    .then(response => response.json())
    .then(data => {
      questions = data;
      shuffleQuestions();
      showNextQuestion();
    })
    .catch(error => {
      console.error('Virhe kysymysten lataamisessa:', error);
    });
}

// Elämät
let lives = 3;

function showLives() {
  const livesElement = document.getElementById('lives');
  livesElement.innerHTML = '';

  for (let i = 0; i < lives; i++) {
    const lifeIcon = document.createElement('img');
    lifeIcon.src = 'files/elämä_kuvake.png';
    lifeIcon.alt = 'Elämä';
    lifeIcon.classList.add('life-icon');
    livesElement.appendChild(lifeIcon);
  }
}

function decreaseLife() {
  lives--;

  if (lives === 0) {
    endGame();
  } else {
    nextButton.disabled = false;
  }

  showLives();
}

// Sekoita kysymykset Fisher-Yatesin algoritmilla
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

function showQuestion(question) {
  questionElement.textContent = question.question;

  for (let i = 0; i < optionElements.length; i++) {
    optionElements[i].textContent = question.options[i];
    optionElements[i].addEventListener('click', checkAnswer);
  }
}

// Tarkista vastaus
function checkAnswer(e) {
  const selectedOption = e.target;
  const selectedOptionIndex = Array.from(optionElements).indexOf(selectedOption);
  const currentQuestion = questions[currentQuestionIndex];

  if (selectedOptionIndex === currentQuestion.answerIndex) {
    selectedOption.classList.add('correct');
    score++;
  } else {
    selectedOption.classList.add('incorrect');
    wrongAnswers++;
    decreaseLife();
  }

  for (let i = 0; i < optionElements.length; i++) {
    optionElements[i].removeEventListener('click', checkAnswer);
  }

  scoreElement.textContent = `Pisteet: ${score}`;

  if (wrongAnswers >= 2) {
    endGame();
  } else {
    nextButton.disabled = false;
  }
}

// Peli päättyy
function endGame() {
  questionElement.textContent = 'Peli päättyi';
  nextButton.disabled = true;
  for (let i = 0; i < optionElements.length; i++) {
    optionElements[i].removeEventListener('click', checkAnswer);
  }
  // Reset life count
  //lives = 3;
  //showLives();
}

// Näytä seuraava kysymys
function showNextQuestion() {
  for (let i = 0; i < optionElements.length; i++) {
    optionElements[i].classList.remove('correct', 'incorrect');
  }

  nextButton.disabled = true;

  // Etsi seuraava käyttämätön kysymys
  let nextQuestionIndex = currentQuestionIndex + 1;
  while (nextQuestionIndex < questions.length && usedQuestions.includes(nextQuestionIndex)) {
    nextQuestionIndex++;
  }

  if (nextQuestionIndex < questions.length) {
    currentQuestionIndex = nextQuestionIndex;
    usedQuestions.push(currentQuestionIndex);
    showQuestion(questions[currentQuestionIndex]);
  } else {
    endGame();
  }
}

// Kuuntele seuraava-painiketta
nextButton.addEventListener('click', showNextQuestion);

// Käynnistä peli
loadQuestions();
