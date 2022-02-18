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

    //
    //clearScreen();

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

    // Updates the Questions and Answers
    //updateSessionUI();
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

    /* Attempt 1 */
    /*// Create Request
    let httpRequest = new XMLHttpRequest();

    // Whilst loading
    httpRequest.onload = function()
    {
        // Reply of Request in plain Text
        //console.log(this.responseText);

        // Convert response from API to JSON object
        sessions = JSON.parse(this.responseText);
        console.log("Attempt 1: " +  sessions);
    }

    // Result of request
    httpRequest.onreadystatechange = function ()
    {
        // Log status of request at each stage
        //console.log(this.response + " -> " + this.readyState);
    }


    // Set the link to the specified URL
    httpRequest.open("GET", "https://codecyprus.org/th/api/list", true);

    // Send request
    httpRequest.send();

    return JSON.parse(this.responseText);*/

    /* Attempt 2 */
    /*fetch("https://codecyprus.org/th/api/list").
    then(response => response.json()).
    then(jsonObject =>
    {
      let treasureHuntsArray = jsonObject.treasureHunts;

      console.log(treasureHuntsArray);

      //return treasureHuntsArray;
        updateSessionUI(treasureHuntsArray);
    } );*/

    /* Attempt 3 */
    /*const response = await fetch('https://codecyprus.org/th/api/list');
    const reply = await response.text();
    // process the reply
     sessions = JSON.parse(reply);
     console.log("fetch: " + sessions)*/

    /* Attempt 4 */
    /*const response = await fetch('https://codecyprus.org/th/api/list').
    then(response => response.text()).
    then(text => document.getElementById('myDiv').innerText = json.treasureHunts[0].name);

    console.log("Testing Fetch: " + response);*/

    /* Attempt 5 */
    /*const response = await fetch("https://codecyprus.org/th/api/list")
        .then((result) => {return result.json();} )
        .then((data) => {console.log(data);} );
    const reply = await response.text();
    console.log("Reply: " + reply);*/

    /* Attempt 6 - Lecture */

    /*   Fetch   */
    const response = await fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json() /* Convert it from JSON */)
            .then(json => {sessions = json.treasureHunts /* Save in Variable Array */});

    //const reply = await response.text();
    //document.getElementById("myDiv").innerText = reply;
    //sessions = reply;
    //document.getElementById("myDiv").innerText = sessions[0].name;

    console.log("JSON Response: ", sessions[0].name);




    /*   ------------------------------------------------------------------   */




    /*
        Update Title
    */
    let title = document.getElementById('ContentTitle');
    title.innerHTML = "<h1>Available Sessions </h1>";

    /*
        Update Loading Indicator
    */
    document.getElementById('LoadingIndicator').innerText = "";

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

        //Value of Button
        let noSpaces = "\"" + sessions[s].name.split(" ").join("") + "\"";

        // Session Element
        sessionListElements +=
            "<li>" +
                "<div class =" + sessionID + ">" +
                    "<p>" +  "<b>" + sessions[s].name + "</b>" + "</p>" +
                    "<p>" + "<i>" +sessions[s].description + "</i>" + "</p>" +
                    "<button onclick=" + "'switchToQuiz(" + noSpaces + ");'" + ">" + "Join Game" + "</button>" +
                "</div>" +
            "</li>";

        // This method doesn't work
        /*
        // Create element to store inside of
        const div = document.createElement("div");
        // Assign Class to element
        div.id = sessionID + s;

        // Create Name of Session to be displayed
        const name = document.createElement("p");
        name.textContent = sessions[s].name;

        // Create Description of Session to be displayed
        const description = document.createElement("p");
        description.textContent = sessions[s].description;

        // Create Button leading to Session
        const button = document.createElement("button");
        button.id = sessions[s].uuid;
        button.textContent = "Join Game";


        /!* Populate List with Items within Page to be displayed *!/

        // Place Div
        document.querySelector("main").
        querySelector(document.getElementById("QuizContent")).
        querySelector(document.getElementById("ListOfQuizzes")).
        append(div);

        // Place Session name into Div
        document.querySelector("main").
        querySelector(document.getElementById("QuizContent")).
        querySelector(document.getElementById("ListOfQuizzes")).
        querySelector(document.getElementById("availableSession" + s)).
        append(name);

        // Place Session Description into Div
        document.querySelector("main").
        querySelector(document.getElementById("QuizContent")).
        querySelector(document.getElementById("ListOfQuizzes")).
        querySelector(document.getElementById("availableSession" + s)).
        append(description);

        // Place Session Start Button into Div
        document.querySelector("main").
        querySelector(document.getElementById("QuizContent")).
        querySelector(document.getElementById("ListOfQuizzes")).
        querySelector(document.getElementById("availableSession" + s)).
        append(button);*/


        // This method doesn't work
        /*document.getElementById("ListOfQuizzes").innerHTML =
            <div class="availableSession">
                <p> <b>session.name</b> </p>
                <p> session.description </p>
                <button value = session.uuid> Join Game </button>
            </div>;*/
    }

    // Close off List
    sessionListElements += "</ul>";

    // Add list into HTML element
    document.getElementById("ListOfQuizzes").innerHTML = sessionListElements;
    document.getElementById("ListOfQuizzes").innerHTML += "<div class='Divider'></div>";

}

/* Update List of all available Sessions */
function updateSessionUI()
{

    console.log("Update UI: ");

    console.log("DEBUG: " + sessions[0].name);


    /*
        Update Title
    */
    let title = document.getElementById('ContentTitle');
    title.innerHTML = "Available Sessions";

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

        sessionListElements +=
        "<li>" +
            "<div class =" + sessionID + ">" +
                "<p>" +  "<b>" + sessions[s].name + "</b>" + "</p>" +
                "<p>" + sessions[s].description + "</p>" +
                "<button value =" + sessions[s].uuid + ">" + "Join Game" + "</button>" +
            "</div>" +
        "</li>";




        // This method doesn't work
        /*
        // Create element to store inside of
        const div = document.createElement("div");
        // Assign Class to element
        div.id = sessionID + s;

        // Create Name of Session to be displayed
        const name = document.createElement("p");
        name.textContent = sessions[s].name;

        // Create Description of Session to be displayed
        const description = document.createElement("p");
        description.textContent = sessions[s].description;

        // Create Button leading to Session
        const button = document.createElement("button");
        button.id = sessions[s].uuid;
        button.textContent = "Join Game";


        /!* Populate List with Items within Page to be displayed *!/

        // Place Div
        document.querySelector("main").
        querySelector(document.getElementById("QuizContent")).
        querySelector(document.getElementById("ListOfQuizzes")).
        append(div);

        // Place Session name into Div
        document.querySelector("main").
        querySelector(document.getElementById("QuizContent")).
        querySelector(document.getElementById("ListOfQuizzes")).
        querySelector(document.getElementById("availableSession" + s)).
        append(name);

        // Place Session Description into Div
        document.querySelector("main").
        querySelector(document.getElementById("QuizContent")).
        querySelector(document.getElementById("ListOfQuizzes")).
        querySelector(document.getElementById("availableSession" + s)).
        append(description);

        // Place Session Start Button into Div
        document.querySelector("main").
        querySelector(document.getElementById("QuizContent")).
        querySelector(document.getElementById("ListOfQuizzes")).
        querySelector(document.getElementById("availableSession" + s)).
        append(button);*/


        // This method doesn't work
        /*document.getElementById("ListOfQuizzes").innerHTML =
            <div class="availableSession">
                <p> <b>session.name</b> </p>
                <p> session.description </p>
                <button value = session.uuid> Join Game </button>
            </div>;*/
    }

    // Close off List
    sessionListElements += "</ul>";

    // Add list into HTML element
    document.getElementById("ListOfQuizzes").innerHTML = sessionListElements;
}

/* Switch from list of Sessions to Quiz */
function switchToQuiz(selectedQuiz)
{
    for(let q = 0; q < sessions.length; q++)
    {
        // Check if Name provieded is the same as current Quiz
        if (sessions[q].name.split(" ").join("") === selectedQuiz )
        {
            // Print name for debugging
            console.log("You selected this Session: " + sessions[q].name);

            /*
                Switch to appropriate quiz
            */

            // Delete Everything on Screen
            //clearScreen();

            // Load / Create Quiz
            //fetchQuiz(sessions[q].uuid);


            // Create Placeholder Quiz
            /* document.getElementById("").innerHTML =  "<> sessions[q]. </>"*/

            // Title
            document.getElementById("ContentTitle").innerHTML =  "<h1>" + sessions[q].name + "</h1>"
            // List of Quizzes
            document.getElementById("ListOfQuizzes").innerHTML =  "";
            // Question
            document.getElementById("Question").innerHTML +=  "<p> Sample Question for: " + sessions[q].name +  "</p>";
            document.getElementById("Question").innerHTML +=  "<div class='Divider'></div>";
            // Answers
            let answerElements = "<ul>";
            for(let a = 0; a < 4 /*NumOfQuestions.length*/; a++)
            {
                answerElements += "<li><button> <p id=" + answerIDs[a] + "> Possible Answer" + " " + answerLetters[a]  + "</p> </button></li>";
            }
            answerElements += "</ul>";
            document.getElementById("Answers").innerHTML +=  answerElements;
            // Divider
            document.getElementById("Answers").innerHTML += "<div class='Divider'></div>";
            // Leader Board Button
            document.getElementById("Buttons").innerHTML +=  "<button type=\"button\" id=\"LeaderBoard\"> <a href=\"../Leaderboard/leaderboard.html\">LeaderBoard</a> </button>";
            // Skip Button
            document.getElementById("Buttons").innerHTML +=  "<button type=\"button\" id=\"QuestionSkip\" onclick=\"SkipQuestion()\">Skip Question</button>";

        }
        else
        {
            console.log("Provided Name: " + sessions[q].name + ". Does not match any available Session");
        }
    }

}

/*  */
function fetchQuiz(QuizID){}




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
function getQuestions(i)
{
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
function getAnswers(i, letters)
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

/*  */
function getCorrectAnswer()
{
    //TODO - do stuff
}