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
let maxRemainingTime;
let currentRemainingTime;
let numOfQuestions;
let currentQuestion;
let answerLetters = ['A', 'B', 'C', 'D'];
let answerIDs = ['answerA', 'answerB' , 'answerC' , 'answerD'];
let playerScore = 0;
let cSessionID;
let cPlayerName;
let timerID;
const appName = "2022Team1";

/* Global HTML variables */
const htmlPlayerName = document.getElementById("PlayerName");
const htmlPlayerScore = document.getElementById("PlayerScore");
const htmlRemainingTime = document.getElementById("RemainingTime");
const htmlContentTitle = document.getElementById("ContentTitle");
const htmlLoadingIndicator = document.getElementById("LoadingIndicator");
const htmlListOfQuizzes = document.getElementById("ListOfQuizzes");
const htmlQuestion = document.getElementById("Question");
const htmlAnswers = document.getElementById("Answers");
const htmlMiscButtons = document.getElementById("Buttons");


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

/* Sets the Amount of Questions and Default Start Question, then calls an update of the UI */
function initialize()
{
    // Log for Debug
    console.log("Initializing Page")

    // Update player location every 2min
    // (min interval allowed by API: 30sec)
    setInterval(getLocation, 120000);

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
    clearScreen();

    console.log("Fetch Sessions: ");

    /*   Fetch All Available Treasure Hunt Sessions   */
    const response = await fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json() /* Convert it from JSON */)
            .then(json => {availableTH = json.treasureHunts /* Save in Variable Array */});

    // Print Sessions available for debug
    if(availableTH !== 0)
    {
        console.log("JSON Responded with available sessions: ");
        for(let l = 0; l < availableTH.length; l++)
        {
            console.log(availableTH[l].name + " - ");
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
    htmlContentTitle.innerHTML = "<h1> Available Sessions </h1>";

    /*
        Update Loading Indicator
    */
    htmlLoadingIndicator.innerText = "";

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
    htmlListOfQuizzes.innerHTML = sessionListElements;
    htmlListOfQuizzes.innerHTML += "<div class='Divider'></div>";

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

    // Clear List of Sessions
    htmlListOfQuizzes.innerHTML = "";

    // Update Title
    htmlContentTitle.innerHTML = "<h1>Join Session</h1>";

    // Input name
    htmlQuestion.innerText = "Enter Your Name";

    console.log("---> Player needs to enter their name");
    htmlAnswers.innerHTML = "<form onsubmit='return false'>" + "<input id='username' type='text'>" + "<br/>" + "<br/>" + "<button onclick='startQuiz(\"" + QuizID + "\" , " + 'document.getElementById("username").value' + ") '> Submit </button>" + "</form>";

    // Back to available TreasureHunts
    htmlMiscButtons.innerHTML = "<button id='backToList' onclick='fetchSessions()'>Back</button>";
}

/* Request Quiz from API and store it, then Initialize the Quiz onto the page */
async function startQuiz(QuizID, playerName) //name, id
{
    console.log("PlayerName: " + playerName);
    console.log("---> Fetching Quiz");

    //Save Player Name as Cookie
    cPlayerName = document.cookie = playerName;

    /*   Fetch Quiz   */
    // Returns the status of the quiz, the players session ID, and the amount of questions in that quiz.
    const response = await fetch("https://codecyprus.org/th/api/start?player=" + cPlayerName + "&app=" + appName + "-app&treasure-hunt-id=" + QuizID)
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {currentSession = json /* Save in Variable */});

        console.log("Current Session: ");
        console.log(currentSession);


        // Check Status for whether Error Messages exist
        if(currentSession.status === "OK")
        {
            // Display Player Name & Initial Score
            htmlPlayerName.innerText = "Player: " + playerName;
            htmlPlayerScore.innerHTML = "<p id='pScore'> Score: " + playerScore + "</p>";
            // Create Countdown for quiz time remaining
            //TODO - add timer to scene

            // Update Content Title to display name of Quiz currently being played
            for(let n = 0; n < availableTH.length; n++)
            {
                if(availableTH[n].uuid === QuizID)
                {
                    htmlContentTitle.innerHTML = "<h1>" + availableTH[n].name + "</h1>";

                    if (availableTH[n].maxDuration)
                    {
                        //Convert Max-time to use for timer
                        toSeconds(availableTH[n].maxDuration);
                        // Update time remaining for player --- every 1sec
                        timerID = setInterval(timer, 1000);
                    }
                    else
                    {
                        alert("No Max Time for this Quiz");
                    }
                }
            }

            //Save Session ID as a Cookie
            cSessionID = document.cookie = currentSession.session;

            getQuestions(cSessionID);
        }
        else if(currentSession.status === "ERROR")
        {
            // Check if Name is available
            if(currentSession.errorMessages == "The specified playerName: " + playerName + ", is already in use (try a different one).")
            {
                alert("The Name: " + "'" + playerName + "'" + " is already in use, please try another name.")
            }
            // Check if Missing param
            else if(currentSession.errorMessages === "Missing or empty parameter: app"){}
            // Check if  unknown treasure id
            else if(currentSession.errorMessages === "Could not find a treasure hunt for the specified id:" + QuizID){}
            // Uncaught exception
            else
            {
                alert("Player Name Unknown error occurred!")
            }
        }
        else
        {
            alert("Player Name Unknown Status!")
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
    htmlQuestion.innerHTML = currentQuestion.questionText;

    // Check whether question can be skipped or not
    if(currentQuestion.canBeSkipped === true)
    {
        htmlMiscButtons.innerHTML = "<button id='LeaderBoard'>Leaderboard</button> <button id='QuestionSkip' onclick='SkipQuestion(\"" + SessionID + "\")'>Skip Question</button>";
    }
    else
    {
        htmlMiscButtons.innerHTML = "<button id='LeaderBoard'>Leaderboard</button> <button id='QuestionSkip-Disabled'>Skip Question</button>";
    }

    // Create Answer HTML according to Question Type
    if (currentQuestion.questionType === "INTEGER" || currentQuestion.questionType === "NUMERIC" )
    {
        console.log("---> Player Needs to Input a Number");
        htmlAnswers.innerHTML = "<form onsubmit='return false'>" + "<input id='numAnswer' type='number'>" + "<br/>" + "<br/>"  + "<button onclick='sendAnswers(\"" + SessionID + "\" , " + 'document.getElementById("numAnswer").value' + ") '> Submit </button>" + "</form>";
    }
    else if (currentQuestion.questionType === "BOOLEAN")
    {
        console.log("---> Player Needs to Select true/false");
        htmlAnswers.innerHTML = "<button id='trueButton' value='true' onclick='sendAnswers(\"" + SessionID + "\", \"true\")'>True</button>" +
                            "<button id='falseButton' value='false' onclick='sendAnswers(\"" + SessionID + "\", \"false\")'>False</button>";
    }
    else if (currentQuestion.questionType === "MCQ")
    {
        console.log("---> Player Needs to select an option");

        // Create Start of List
        htmlAnswers.innerHTML = "<ul>";

        // Create list elements
        htmlAnswers.innerHTML += "<li> <button id='mcqA' onclick='sendAnswers(\"" + SessionID + "\", \"A\")'> A </button> </li>";
        htmlAnswers.innerHTML += "<li> <button id='mcqB' onclick='sendAnswers(\"" + SessionID + "\", \"B\")'> B </button> </li>";
        htmlAnswers.innerHTML += "<li> <button id='mcqC' onclick='sendAnswers(\"" + SessionID + "\", \"C\")'> C </button> </li>";
        htmlAnswers.innerHTML += "<li> <button id='mcqD' onclick='sendAnswers(\"" + SessionID + "\", \"D\")'> D </button> </li>";

        // List ending
        htmlAnswers.innerHTML += "</ul>";
    }
    else if (currentQuestion.questionType === "TEXT")
    {
        console.log("---> Player Needs to Input Text");
        htmlAnswers.innerHTML = "<form onsubmit='return false'>" + "<input id='textAnswer' type='text'>" + "<br/>" + "<br/>"  + "<button onclick='sendAnswers(\"" + SessionID + "\" , " + 'document.getElementById("textAnswer").value' + ") '> Submit </button>" + "</form>";
    }
}

/* Skips the question the player is currently on if possible */
async function SkipQuestion(SessionID)
{
    console.log("---> Skipping Question")

    let SkipResult;

    // Ask for confirmation to skip current question
    // Yes - Proceed
    if(confirm("This action cannot be undone." + "\n" + "Are you sure you wish to skip this question?"))
    {
        /* Fetch Current Question */
        const response = await fetch("https://codecyprus.org/th/api/skip?session=" + SessionID)
            .then(response => response.json() /* Convert it from JSON */)
            .then(json => {SkipResult = json /* Save in Variable */});

        // Check whether or not the quiz has been completed
        // Fetch Next Question
        if(SkipResult.completed === false)
        {
            getScore(SessionID);

            getQuestions(SessionID);
        }
        // Finish Quiz - Redirect to Leaderboard
        else
        {
            alert("Congratulations You Finished The Quiz");
            window.location.href = "../Leaderboard/leaderboard.html";
        }
    }
    // No - Do nothing
    else{}
}

/* Retrieves all Answers of Current Questions based on Current Index and Provided Letter */
async function sendAnswers(SessionID, CurrentAnswer)
{
    // Request Location if Question Requires it
    if(currentQuestion.requiresLocation === true)
    {
        getLocation(SessionID);
    }


    console.log("---> Player Provided Answer:");
    console.log(CurrentAnswer);


    let AnswerResult;

    /* Send Answer */
    const response = await fetch("https://codecyprus.org/th/api/answer?session=" + SessionID + "&answer=" + CurrentAnswer)
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {AnswerResult = json /* Save in Variable */});

    // Question Answered Correctly
    if(AnswerResult.correct === true)
    {
        console.log("Question Answered Correctly!");

        // Check whether the quiz has been completed
        // Fetch Next Question
        if(AnswerResult.completed === false)
        {
            getScore(SessionID);

            getQuestions(SessionID);
        }
        // Finish Quiz - Redirect to Leaderboard
        else
        {
            alert("Congratulations You Finished The Quiz");
            window.location.href = "../Leaderboard/leaderboard.html";
        }
    }
    else
    {
        getScore(SessionID);
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

/* Resets all HTML elements within Quiz Layout */
function clearScreen()
{
    // Content Title
    htmlContentTitle.innerHTML = "";

    // Quiz Content - excluding player Info
    htmlLoadingIndicator.innerHTML = "";
    htmlListOfQuizzes.innerHTML = "";
    htmlQuestion.innerHTML = "";
    htmlAnswers.innerHTML = "";

    // Buttons
    htmlMiscButtons.innerHTML = "";
}

/* Get player score from API */
async function getScore(SessionID)
{
    let scoreResult;

    /* Request Score */
    const response = await fetch("https://codecyprus.org/th/api/score?session=" + SessionID)
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {scoreResult = json /* Save in Variable */});

    console.log("Player Score: " + scoreResult.score);

    // Update Score
    document.getElementById("PlayerScore").innerHTML = "<p>Score: " + "<i id='score'>" + scoreResult.score + "<i/>" + "</p>";

    // If Score is positive
    if(scoreResult.score > 0)
    {
        document.getElementById("score").style.color = "green";
    }
    // If Score is negative
    else if(scoreResult.score < 0)
    {
        document.getElementById("score").style.color = "red";
    }
    // Score is zero
    else
    {
        document.getElementById("score").style.color = "white";
    }
}

/* Requests Players Location */
function getLocation(SessionID)
{
    console.log("---> Requesting Location");

    // Geolocation Code from ----> W3Schools: https://www.w3schools.com/html/html5_geolocation.asp
    // Check if getting location is supported or not
    if (navigator.geolocation)
    {
        //Get Location
        navigator.geolocation.getCurrentPosition(sendLocation);
    }
    else
    {
        console.log("Geolocation is not supported by this browser.");
    }
}

/* Saves Player Location */
async function sendLocation(position)
{
    /*console.log("Players Position: ", position);
    console.log(position.coords.latitude + "\n" + position.coords.longitude);*/

    let locationUpdateResult;

    console.log("---> Submitting Location");

    /* Send Location */
    const response = await fetch("https://codecyprus.org/th/api/location?session=" + cSessionID + "&latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude    )
        .then(response => response.json() /* Convert it from JSON */)
        .then(json => {locationUpdateResult = json /* Save in Variable */});


    /* Check Response from API */
    if(locationUpdateResult.status === "OK")
    {
        console.log(position.coords.latitude + "\n" + position.coords.longitude);
    }
    else
    {
        console.log("Location NOT Updated!");
    }
}

/* Converts Milliseconds to Seconds*/
function toSeconds(milliseconds)
{
    maxRemainingTime = currentRemainingTime = milliseconds / 1000;
}

/* Counts Down how long the player has to complete the quiz */
function timer()
{
    // Decrement
    currentRemainingTime -= 1;

    // Update Time in HTML - Time shown in minutes rounded down to avoid fractions
    if(currentRemainingTime / 60 > 1)
    {
        htmlRemainingTime.innerHTML = "<p>Remaining Time: " + "<i id='time'>"  + Math.floor(currentRemainingTime/ 60) + "</i>" + "/min" + "<p/>";
    }
    // Time shown in seconds
    else if(currentRemainingTime / 60 <= 1 && currentRemainingTime > 0)
    {
        htmlRemainingTime.innerHTML = "<p>Remaining Time: " + "<i id='time'>"  + currentRemainingTime + "</i>" + "/sec" + "<p/>";
    }
    // Out Of Time - Redirect to Leaderboard
    else if(currentRemainingTime <= 0)
    {
        clearInterval(timerID);

        alert("Out Of Time!");
        window.location.href = "../Leaderboard/leaderboard.html";
    }


    // Half Time Remaining
    if(currentRemainingTime < maxRemainingTime / 2)
    {
        document.getElementById("time").style.color = "orange";
    }
    // One Tenth of Time Remaining
    else if(currentRemainingTime < maxRemainingTime / 10)
    {
        htmlRemainingTime.style.color = "red";
    }
    // More than Half Remaining
    else
    {
        document.getElementById("time").style.color = "darkgreen";
    }
}

/* TODO - Allow player to use a QR Scanner for questions/text/etc. */
function QRScanner(){}

/* TODO - Check cookies to continue the session if available */
function continueGame(){}