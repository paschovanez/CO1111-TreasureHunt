/*
    * Implementation of:
    * - List of Games Available
    * - Selected Quiz with relevant Questions/Answers
     (Anything else that will be necessary)
*/

/* Global Variables for Quiz */
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
    Answers.innerHTML = "<form onsubmit='return false'>" + "<input id='username' type='text'>" + "<button onclick='startQuiz(\"" + QuizID + "\" , " + 'document.getElementById("username").value' + ") '> Submit </button>" + "</form>";
}

/* Request Quiz from API and store it, then Initialize the Quiz onto the page */
async function startQuiz(QuizID, playerName) //name, id
{
    console.log("PlayerName: " + playerName);
    console.log("---> Fetching Quiz");


    /*   Fetch Quiz   */
    // Returns the status of the quiz, the players session ID, and the amount of questions in that quiz.
    const response = await fetch("https://codecyprus.org/th/api/start?player=" + playerName + "&app=" + appName + "-app&treasure-hunt-id=" + QuizID)
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {currentSession = json /* Save in Variable */});

        console.log("Current Session Does not match any available Session: ");
        console.log(currentSession);


        //Check if any Error Messages exist
        if(currentSession.status === "OK")
        {
            getQuestions(currentSession.session);
        }
        else
        {
            //Check if Name is available
            if(currentSession.errorMessages === "The specified playerName: " + playerName + ", is already in use (try a different one).")
            {
                alert("Name is already in use, please try another name.")
            }
            //Check if Missing param
            else if(currentSession.errorMessages === "Missing or empty parameter: app"){}
            //Check if  unknown treasure id
            else if(currentSession.errorMessages === "Could not find a treasure hunt for the specified id:" + QuizID){}
            //Uncaught exception
            else
            {
                alert("Unknown error occurred!")
            }
        }
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

/* Retrieves Current Question from API */
async function getQuestions(SessionID)
{
    console.log("---> Fetching Question");



    /* Fetch Current Question */
    const response = await fetch("https://codecyprus.org/th/api/question?session=" + SessionID)
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {currentQuestion = json /* Save in Variable */});

    console.log(currentQuestion);


    // Create Question Text
    Question.innerHTML = currentQuestion.questionText;

    // Check whether question can be skipped or not
    if(currentQuestion.canBeSkipped === true)
    {
        MiscButtons.innerHTML = "<button id='LeaderBoard'>Leaderboard</button> <button id='QuestionSkip' onclick='SkipQuestion(\"" + SessionID + "\")'>Skip Question</button>";
    }
    else
    {
        MiscButtons.innerHTML = "<button id='LeaderBoard'>Leaderboard</button>";
    }

    // Create Answer HTML according to Question Type
    if (currentQuestion.questionType === "INTEGER" || currentQuestion.questionType === "NUMERIC" )
    {
        console.log("---> Player Needs to Input a Number");
        Answers.innerHTML = "<input id='numAnswer' type='number'>" + "<button onclick='sendAnswers(\"" + SessionID + "\" , " + 'document.getElementById("numAnswer").value' + ") '> Submit </button>";
    }
    else if (currentQuestion.questionType === "BOOLEAN")
    {
        console.log("---> Player Needs to Select true/false");
        Answers.innerHTML = "<button id='trueButton' value='true' onclick='sendAnswers(\"" + SessionID + "\", \"true\")'>True</button>" +
                            "<button id='falseButton' value='false' onclick='sendAnswers(\"" + SessionID + "\", \"false\")'>False</button>";
    }
    else if (currentQuestion.questionType === "MCQ")
    {
        console.log("---> Player Needs to select an option");

        //Create Start of List
        Answers.innerHTML = "<ul>";

        //Create list elements
        Answers.innerHTML += "<li> <button id='mcqA' onclick='sendAnswers(\"" + SessionID + "\", \"A\")'> A </button> </li>";
        Answers.innerHTML += "<li> <button id='mcqB' onclick='sendAnswers(\"" + SessionID + "\", \"B\")'> B </button> </li>";
        Answers.innerHTML += "<li> <button id='mcqC' onclick='sendAnswers(\"" + SessionID + "\", \"C\")'> C </button> </li>";
        Answers.innerHTML += "<li> <button id='mcqD' onclick='sendAnswers(\"" + SessionID + "\", \"D\")'> D </button> </li>";

        //List ending
        Answers.innerHTML += "</ul>";
    }
    else if (currentQuestion.questionType === "TEXT")
    {
        console.log("---> Player Needs to Input Text");
        Answers.innerHTML = "<input id='textAnswer' type='text'>" + "<button onclick='sendAnswers(\"" + SessionID + "\" , " + 'document.getElementById("textAnswer").value' + ") '> Submit </button>";
    }
}

/* Skips the question the player is currently on if possible */
async function SkipQuestion(SessionID)
{
    console.log("---> Skipping Question")

    let SkipResult;

    //Ask for confirmation to skip current question
    //Yes
    if(confirm())
    {
        /* Fetch Current Question */
        const response = await fetch("https://codecyprus.org/th/api/skip?session=" + SessionID)
            .then(response => response.json() /* Convert it from JSON */)
            .then(json => {SkipResult = json /* Save in Variable */});

        // Check whether or not the quiz has been completed
        //Fetch Next Question
        if(SkipResult.completed === false)
        {
            getQuestions(SessionID)
        }
        //Finish Quiz - Redirect to Leaderboard
        else
        {
            alert("Congratulations You Finished The Quiz");
            window.location.href = "../Leaderboard/leaderboard.html";
        }
    }
    //No - Do nothing
    else
    {

    }
}

/* Retrieves all Answers of Current Questions based on Current Index and Provided Letter */
async function sendAnswers(SessionID, CurrentAnswer)
{
    getLocation(SessionID);



    console.log("---> Player Provided Answer:");
    console.log(CurrentAnswer);


    let AnswerResult;


    /* Send Answer */
    const response = await fetch("https://codecyprus.org/th/api/answer?session=" + SessionID + "&answer=" + CurrentAnswer)
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {AnswerResult = json /* Save in Variable */});

    if(AnswerResult.correct === true)
    {
        console.log("Question Answered Correctly!");

        // Check whether or not the quiz has been completed
        //Fetch Next Question
        if(AnswerResult.completed === false)
        {
            getQuestions(SessionID);
        }
        //Finish Quiz - Redirect to Leaderboard
        else
        {
            alert("Congratulations You Finished The Quiz");
            window.location.href = "../Leaderboard/leaderboard.html";
        }
    }
    else
    {
        alert("Question Not Answered Correctly!");
    }
}



/*
    *
    *
    *
    * Misc
    *
    *
    *
* */

async function getLocation(SessionID)
{
    console.log("---> Requesting Location");

    let playerLocation;

    //Check if getting location is supported or not ----> Code from W3Schools: https://www.w3schools.com/html/html5_geolocation.asp
    if (navigator.geolocation) {
        playerLocation = navigator.geolocation.getCurrentPosition(returnLocation);
    }
    else
    {
        alert("Geolocation is not supported by this browser.");
    }

    let locationUpdateResult;

    console.log("---> Submitting Location")

    /* Send Location */
    const response = await fetch("https://codecyprus.org/th/api/answer?session=" + SessionID + "&latitude==" + playerLocation.coords.latitude + "&longitude" + playerLocation.coords.longitude    )
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {locationUpdateResult = json /* Save in Variable */});

    if(locationUpdateResult.status === "OK")
    {
        alert("Location Updated!");
        console.log(playerLocation.coords.latitude + "\n" + playerLocation.coords.longitude);
    }
    else
    {
        alert("Location NOT Updated!");
    }
}

function returnLocation(position)
{
    return position;
}