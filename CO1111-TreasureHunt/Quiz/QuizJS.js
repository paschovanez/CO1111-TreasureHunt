/*
    * Implementation of:
    * - List of Games Available
    * - Selected Quiz with relevant Questions/Answers
     (Anything else that will be necessary)
*/

/* Global Variables for Quiz */
let lines = []; //Array of text lines in response from API
let sessions = []; //Array of available sessions
let currentQuiz;
let numOfQuestions;
let currentQuestion;
let answerLetters = ['A', 'B', 'C', 'D'];
let answerIDs = ['answerA', 'answerB' , 'answerC' , 'answerD'];
let playerName;
const appName = "Team1";

/* Global HTML variables */
const ContentTitle = document.getElementById("ContentTitle");
const QuizContent = document.getElementById("QuizContent");
const LoadingIndicator = document.getElementById("LoadingIndicator");
const ListOfQuizzes = document.getElementById("ListOfQuizzes");
const Question = document.getElementById("Question");
const Answers = document.getElementById("Answers");
const MiscButtons = document.getElementById("Buttons");


/*
    *
    *
    *
    * Initialize Page Elements
    *
    *
    *
*/

/*
    Call "initialize" function upon loading page
*/
initialize();

/* Removes all non-necessary content from Page */
function clearScreen()
{
    /* .remove() / .removeChild() */

    // Empties Title
    //document.getElementById('ContentTitle').removeChild();
}

/* Sets the Amount of Questions and Default Start Question, then calls an update of the UI */
function initialize()
{
    // Log for Debug
    console.log("Initializing Page")

    /*let initCase = 0;
    switch(initCase)
    {
        case 0:
            fetchSessions();

            initCase = 1;
            break;

        case 1:
            updateSessionUI();

            initCase = 2;
            break;

        default:
            console.log("switch didnt work");
    }*/


    // Request currently available sessions
    fetchSessions();
}



/*
    *
    *
    *
    * List of all available Games
    *
    *
    *
*/

/* Requests a list of available sessions from the API */
async function fetchSessions()
{
    console.log("Fetch Sessions: ");

    /*   Fetch   */
    const response = await fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json() /* Convert it from JSON */)
            .then(json => {sessions = json.treasureHunts /* Save in Variable Array */});

    //Print Sessions available for debug
    if(sessions !== 0)
    {
        console.log("JSON Responded with available sessions: ");
        for(let l = 0; l < sessions.length; l++)
        {
            console.log(sessions[l].name);
        }
    }
    else
    {
        console.log("Sessions array is empty");
    }



    /*   ------------------------------------------------------------------   */



    /*
        Update Title
    */
    ContentTitle.innerHTML = "<h1>Available Sessions </h1>";

    /*
        Update Loading Indicator
    */
    LoadingIndicator.innerText = "";

    /*
        Update List
    */
    // Class assigned to div
    let sessionID = "availableSession";

    // Start List to store each Session Element
    let sessionListElements = "<ul>";

    // Update List of Available Quiz Sessions
    for(let s = 0; s < sessions.length; s++)
    {
        /* Create Items to populate list of Sessions with */

        //Function Value of Button
        let noSpaces = "\"" + sessions[s].name.split(" ").join("") + "\"";

        // Session Element
        sessionListElements +=
            "<li>" +
                "<div class =" + sessionID + ">" +
                    "<p>" +  "<b>" + sessions[s].name + "</b>" + "</p>" +
                    "<p>" + "<i>" +sessions[s].description + "</i>" + "</p>" +
                    //Move on to begin playing
                    "<button onclick=" + "'getPlayerDetails(" + noSpaces + ");'" + ">" + "Join Game" + "</button>" +
                "</div>" +
            "</li>";
    }

    // Close off List
    sessionListElements += "</ul>";

    // Add list into HTML element
    ListOfQuizzes.innerHTML = sessionListElements;
    ListOfQuizzes.innerHTML += "<div class='Divider'></div>";
}



/*
    *
    *
    *
    * Load Quiz
    *
    *
    *
*/

function getPlayerDetails(selectedQuiz)
{
    //Input name

    //  &app= ???

    switchToQuiz(selectedQuiz, playerName);
}

/* Switch from list of Sessions to Quiz */
function switchToQuiz(selectedQuiz, playerName)
{
    for(let q = 0; q < sessions.length; q++)
    {
        // Check if Name provieded is the same as current Quiz
        if (sessions[q].name.split(" ").join("") === selectedQuiz )
        {
            // Print name for debugging
            console.log("You selected this Session: " + sessions[q].name);
            currentQuiz = sessions[q].uuid;

            /*
                Switch to appropriate quiz
            */

            // Load / Create Quiz
            //fetchQuiz(currentQuiz);
            updateQuizUI();


            // Create Placeholder Quiz
            /* document.getElementById("").innerHTML =  "<> sessions[q]. </>"*/

            // Title
            ContentTitle.innerHTML =  "<h1>" + sessions[q].name + "</h1>"
            // List of Quizzes
            ListOfQuizzes.innerHTML =  "";
            // Question
            Question.innerHTML +=  "<p> Sample Question for: " + sessions[q].name +  "</p>";
            Question.innerHTML +=  "<div class='Divider'></div>";

            // Answers
            let answerElements = "<ul>";
            for(let a = 0; a < 4 /*NumOfQuestions.length*/; a++)
            {
                answerElements += "<li><button> <p id=" + answerIDs[a] + "> Possible Answer" + " " + answerLetters[a]  + "</p> </button></li>";
            }
            answerElements += "</ul>";
            Answers.innerHTML +=  answerElements;
            // Divider
            Answers.innerHTML += "<div class='Divider'></div>";
            // Leader Board Button
            MiscButtons.innerHTML +=  "<button type=\"button\" id=\"LeaderBoard\"> <a href=\"../Leaderboard/leaderboard.html\">LeaderBoard</a> </button>";
            // Skip Button
            MiscButtons.innerHTML +=  "<button type=\"button\" id=\"QuestionSkip\" onclick=\"SkipQuestion()\">Skip Question</button>";

        }
        else
        {
            console.log("Provided Name: " + sessions[q].name + ". Does not match any available Session");
        }
    }
}

/*  */
function fetchQuiz(QuizID)
{

}



/*
    *
    *
    *
    * Play Quiz
    *
    *
    *
*/

/* Retrieves Current Question Based on CurrentQuestion index */
function getQuestions()
{
    // /question

    //Check for invalid index
    if(i < 0 || i > numOfQuestions-1)
    {
        console.log("GetQuestion Function: ");
        alert("Index out of bounds: " + i + " (it must be 0.." + numOfQuestions + ")");
    }
    else
    {
        let index = 1 + i * 6;
        console.log(lines[index]); //Print lines(index) content for debugging

        return lines[index];
    }
}

/* Skips the question the player is currently on if possible */
function SkipQuestion()
{

}

/* Updates Content of Question and Answers in Quiz */
function updateQuizUI()
{
    //Update Current Question
    document.getElementById("Question").innerText = getQuestions(currentQuestion);

    //Update Answers of Current Question
    for(let a = 0; a < answerLetters.length; a++)
    {
        document.getElementById(answerIDs[a]).innerText = getAnswers(currentQuestion, answerLetters[a]);
    }
}

/* Retrieves all Answers of Current Questions based on Current Index and Provided Letter */
function sendAnswers()
{
    //Check for invalid index
    if(i < 0 || i > numOfQuestions-1)
    {
        console.log("GetAnswers Function: ");
        alert("Index out of bounds: " + i + " (it must be 0.." + numOfQuestions + ")");
    }
    else
    {
        //Return Answer of Question based on given index and corresponding letter
        switch(letters.toUpperCase())
        {
            case 'A': return lines[2 + i * 6];
            case 'B': return lines[3 + i * 6];
            case 'C': return lines[4 + i * 6];
            case 'D': return lines[5 + i * 6];

            default: alert("Invalid letter option: " + letters + " (it must be one of 'A', 'B', 'C' and 'D')");
        }
    }
}