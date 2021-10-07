const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
//const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
//const progressText = document.getElementById("progressText");
const loader = document.getElementById('loader');
const game = document.getElementById('game');


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

//fetch("question.json")
fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple")
.then( res => {
    return res.json();
})
 .then(loadedQuestions => {
     console.log(loadedQuestions.results);
     questions = loadedQuestions.results.map(loadedQuestion => {
         const formattedQuestion = {
            question: loadedQuestion.question
         };

         const anserChoices = [...loadedQuestion.incorrect_answers];
         formattedQuestion.answer = Math.floor(Math.random() * 3) +1;
         anserChoices.splice(formattedQuestion.answer -1, 0,
         loadedQuestion.correct_answer);

         anserChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
         });
         return formattedQuestion;
     });
     //console.log(loadedQuestions);
     //questions = loadedQuestions;
     
     startGame();
 })
 .catch(err => {
     console.log(err);
 });

//constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    //console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add("hidden");
};

getNewQuestion = () => {

    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
       localStorage.setItem("mostRecentScore", score);
       
        return window.location.assign("/end.html");
    }
     questionCounter++;
     //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // update the progress bar
    //console.log(questionCounter / MAX_QUESTIONS)*100;
     progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS)*100}%`;

     const questionIndex = Math.floor(Math.random() * availableQuestions.length);
     currentQuestion = availableQuestions[questionIndex];
     question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion["choice" + number];        
    });

    availableQuestions.splice(questionIndex, 1);
    
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers)return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct':'incorrect';
        
        if(classToApply ==='correct'){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            console.log(classToApply);
            getNewQuestion();
        }, 1000);
        

        
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

// startGame();
