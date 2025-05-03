const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

let shuffledQuestions, currentQuestionIndex;
let score = 0;

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple');
    const data = await response.json();
    return data.results.map(question => {
        const formattedQuestion = {
            question: question.question,
            answers: []
        };
        const incorrectAnswers = question.incorrect_answers.map(answer => ({
            text: answer,
            correct: false
        }));
        const correctAnswer = {
            text: question.correct_answer,
            correct: true
        };
        formattedQuestion.answers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);
        return formattedQuestion;
    });
}

async function startQuiz() {
    startButton.classList.add('hide');
    questions = await fetchQuestions(); // Fetch questions from API
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    score = 0; // Reset score
    document.getElementById('right-answers').innerText = `Score: ${score}`; // Reset score display
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStateClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    setStateClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStateClass(button, button.dataset.correct);
    });
    if (correct) {
        score++; // Increment score for correct answers
    }
    document.getElementById('right-answers').innerText = `Score: ${score}`; // Update score display
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'Restart';
        startButton.classList.remove('hide');
        questionContainerElement.classList.add('hide'); // Hide question container at the end
        alert(`Quiz finished! Your final score is: ${score}`); // Display final score
    }
}

function setStateClass(element, correct) {
    clearStateClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStateClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

let questions = [
    {
        question: 'What is the capital of France?',
        answers: [
            { text: 'Berlin', correct: false },
            { text: 'Madrid', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Rome', correct: false }
        ]
    },
    {
        question: 'What is 2 + 2?',
        answers: [
            { text: '3', correct: false },
            { text: '4', correct: true },
            { text: '5', correct: false },
            { text: '6', correct: false }
        ]
    }
];