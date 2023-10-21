//https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer = " ", correctScore =  askedCount = 0, totalQuestion = 10;

// event listener
function eventListener()
{
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListener();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});


async function loadQuestion()
{
    const APIUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    // console.log(data.results[0]);
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

function showQuestion(data)
{
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionList = incorrectAnswer;
    optionList.splice(Math.floor(Math.random() * (incorrectAnswer.length * 1)), 0, correctAnswer);
    
    _question.innerHTML = `${data.question} <br> <br><span class = "category">${data.category}</span> <br><br>`;
    _options.innerHTML = `${optionList.map((option, index) => `
        <li> ${index + 1}. <span>${option}</span></li>`).join('')}`;

    selectOption();
}   

//options selection

function selectOption()
{
    _options.querySelectorAll('li').forEach((option) => 
    {
        option.addEventListener('click', () => 
        {
            if(_options.querySelector('.selected'))
            {
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });

    console.log(correctAnswer);
}

// answer checking
function checkAnswer()
{
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected'))
    {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() == HTMLDecode(correctAnswer))
        {
            correctScore++;
            _result.innerHTML = `<p>Correct Answer! </p>`;
        } else{
            _result.innerHTML = `<p>Incorrect Answer! </p> <p><small><b>Correct Answer: </b>${correctAnswer}</small></p>`;
        }
        
        checkCount();
    } else {
        _result.innerHTML = `<p> Please select an option </p>`;
        _checkBtn.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString)
{
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount()
{
    askedCount++;
    setCount();
    if(askedCount == totalQuestion)
    {
        _result.innerHTML += `<p> Your score is ${correctScore}. </p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else{
        setTimeout(() => 
        {
            loadQuestion();
        }, 3000);
    }
}

function setCount()
{
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz()
{
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}