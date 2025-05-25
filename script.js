let correct = "";
let allAnswers = [];

const a1 = document.getElementById("answer-1");
const a2 = document.getElementById("answer-2");
const a3 = document.getElementById("answer-3");
const a4 = document.getElementById("answer-4");
const question = document.getElementById("question");
const feedback = document.getElementById("feedback");
const questionButton = document.getElementById("new-question");
const tempDiv = document.createElement("div");
const categorySelect = document.getElementById("category-select");
const buttons = [a1, a2, a3, a4];

window.onload = function() {
    getCategories();
}


questionButton.addEventListener("click", function(){
    getQuestion();
});

a1.addEventListener("click", function(){
    checkAnswer(a1.textContent);
});

a2.addEventListener("click", function(){
    checkAnswer(a2.textContent);
});

a3.addEventListener("click", function(){
    checkAnswer(a3.textContent);
});

a4.addEventListener("click", function(){
    checkAnswer(a4.textContent);
});

function getCategories()
{
    fetch("https://opentdb.com/api_category.php")
        .then (response => response.json())
        .then (data => {
            const categories = data.trivia_categories;
            const select = document.getElementById("category-select");
            categories.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.id;
                option.textContent = item.name;
                select.append(option);
            })
        })
}

function getQuestion()
{
    const selectedCategory = categorySelect.value;
    let url = "https://opentdb.com/api.php?amount=1&type=multiple"
    if (selectedCategory)
        url +=`&category=${selectedCategory}`;
    fetch(url)
        .then (response => response.json())
        .then (data => {
            buttons.forEach(button => {
                button.classList.remove("incorrect", "correct", "no-hover");
            });
            feedback.textContent = "";
            const questionData = data.results[0];
            const encodedQuestion = questionData.question;
            const encodedCorrect = questionData.correct_answer;
            const incorrectAnswers = questionData.incorrect_answers;
            allAnswers = [...incorrectAnswers, encodedCorrect];

            //decode question
            tempDiv.innerHTML = encodedQuestion;
            const decodedQuestion = tempDiv.textContent;
            question.textContent = decodedQuestion;

            //decode correct answer
            tempDiv.innerHTML = encodedCorrect;
            correct = tempDiv.textContent;
            allAnswers = shuffleAndDecode(allAnswers);
            placeInButtons(allAnswers);
        })
        .catch (error => {
            console.error("Error fetching trivia:", error);
        });

}

function shuffleAndDecode(answers)
{
    for (let i = 0; i < answers.length; i++)
    {
        tempDiv.innerHTML = answers[i];
        answers[i] = tempDiv.textContent;
    }
    for (let i = answers.length-1; i > 0; i--)
    {
        let random = Math.floor(Math.random() * (i+1));
        
        let temp = answers[i];
        answers[i] = answers[random];
        answers[random] = temp;
    }
    return answers;
}

function placeInButtons(answers)
{
    a1.textContent = answers[0];
    a2.textContent = answers[1];
    a3.textContent = answers[2];
    a4.textContent = answers[3];
}

function checkAnswer(answer)
{
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === correct) {
            buttons[i].classList.add("correct");
        } else {
            buttons[i].classList.add("incorrect");
        }
        buttons[i].classList.add("no-hover");
    }

}