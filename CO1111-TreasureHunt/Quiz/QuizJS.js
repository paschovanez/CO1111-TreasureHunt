/*
    * Implementation of:
    * - List of Games Available
    * - Selected Quiz with relevant Questions/Answers
     (Anything else that will be necessary)
*/

/* Global Variables for Quiz */
let lines = []; //Array of text lines in response from API
let availableTH = []; //Array of available sessions
let currentQuizName;
let currentSession;
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

    /*   Fetch All Available Treasure Hunt Sessions   */
    const response = await fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json() /* Convert it from JSON */)
            .then(json => {availableTH = json.treasureHunts /* Save in Variable Array */});

    //Print Sessions available for debug
    if(availableTH !== 0)
    {
        console.log("JSON Responded with available sessions: ");
        for(let l = 0; l < availableTH.length; l++)
        {
            console.log(availableTH[l].name);
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
    ContentTitle.innerHTML = "<h1> Available Sessions </h1>";

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
    for(let s = 0; s < availableTH.length; s++)
    {
        /* Create Items to populate list of Sessions with */

        //Function Value of Button
        currentQuizName = "\"" + availableTH[s].name.split(" ").join("") + "\"";

        // Session Element
        sessionListElements +=
            "<li>" +
                "<div class =" + sessionID + ">" +
                    "<p>" +  "<b>" + availableTH[s].name + "</b>" + "</p>" +
                    "<p>" + "<i>" +availableTH[s].description + "</i>" + "</p>" +
                    //Move on to begin playing
                    "<button onclick=" + "getPlayerDetails(\"" + availableTH[s].uuid + "\");" + ">" + "Join Game" + "</button>" +
                "</div>" +
            "</li>";
    }

    // Close off List
    sessionListElements += "</ul>";

    // Add list into HTML element
    ListOfQuizzes.innerHTML = sessionListElements;
    ListOfQuizzes.innerHTML += "<div class='Divider'></div>";

    console.log("---> Player needs to choose a Quiz from the list");
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

function getPlayerDetails(QuizID)
{
    console.log("ID of currently selected Quiz: " + QuizID);

    //Clear List of Sessions
    ListOfQuizzes.innerHTML = "";

    //Update Title
    ContentTitle.innerHTML = "<h1>Join Session</h1>";

    //Input name
    Question.innerText = "Enter Your Name";

    console.log("---> Player needs to enter their name");
    Answers.innerHTML = "<form>" + "<input id='username' type='text'>" + "<button onclick='fetchQuiz(" + QuizID + " , " + 'document.getElementById("username").value' + ")'> Submit </button>" + "</form>";
}

/* Request Quiz from API and store it, then Initialize the Quiz onto the page */
async function fetchQuiz(QuizID, playerName) //name, id
{
    /*playerName = document.getElementById("username").value;*/
    console.log("PlayerName: " + playerName);




    /*   Fetch Quiz   */
    // Returns the status of the quiz, the players session ID, and the amount of questions in that quiz.
    const response = await fetch("https://codecyprus.org/th/api/start?player=" + playerName + "&app=" + appName + "-app&treasure-hunt-id=" + QuizID)
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {currentSession = json /* Save in Variable */});

        console.log("Current Session: " + currentSession + ". Does not match any available Session");

        //getQuestions(currentSession.session);
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
async function getQuestions(SessionID)
{
    const response = await fetch("https://codecyprus.org/th/api/question?session=" + SessionID)
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {currentQuestion = json /* Save in Variable */});


    // Create Question Text
    Question.innerText = currentQuestion.questionText;

    // Create Answer HTML according to Question Type
    if (currentQuestion.questionType === "INTEGER" || currentQuestion.questionType === "NUMERIC" )
    {
        //Answers.innerHTML = ;
    }
    else if (currentQuestion.questionType === "BOOLEAN")
    {
        //Answers.innerHTML = ;
    }
    else if (currentQuestion.questionType === "MCQ")
    {
        //Answers.innerHTML = ;
    }
    else if (currentQuestion.questionType === "TEXT")
    {
        //Answers.innerHTML = ;
    }
}

/* Skips the question the player is currently on if possible */
function SkipQuestion()
{

}

/* Updates Content of Question and Answers in Quiz */
function updateQuizUI()
{

}

/* Retrieves all Answers of Current Questions based on Current Index and Provided Letter */
function sendAnswers()
{

}