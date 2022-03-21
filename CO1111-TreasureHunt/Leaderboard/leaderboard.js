/* Global Variables */
let leaderboardResponse;
let leaderboardList;
let availableTH;

/* HTML Global Variables */
const htmlContentTitle = document.getElementById("ContentTitle");
const htmlListOfQuizzes = document.getElementById("ListOfQuizzes");
const htmlLeaderboardContainer = document.getElementById("leaderboardContainer");


/*
    Call "initialize" function upon loading page
*/
initialize();

function initialize()
{
    // Log for Debug
    console.log("Initializing Page")

    // Get SessionID from Quiz page, passed along in URL
    let parameters = new URLSearchParams( window.location.search );
    let sessionID = parameters.get( "sessionID" );

    fetchLeaderboard(sessionID);
}

/* Request All Player Scores of Provided Treasure Hunt */
/* TODO - Doenst get Name of Quiz Selected, doesnt load fetched list into page */
async function fetchLeaderboard(sessionID)
{


    /*   Fetch Player Scores    */
    if(sessionID !== null)
    {
        clearScreen();

        htmlContentTitle.innerHTML = "<h1> Loading... </h1>";

        console.log("Fetching Leaderboard");

        const response = await fetch("https://codecyprus.org/th/api/leaderboard?treasure-hunt-id=" + sessionID + "&sorted=true&limit=25")
            .then(response => response.json() /* Convert it from JSON */)
            .then(json => {leaderboardResponse = json /* Save in Variable Array */});

        if(leaderboardResponse.status === "OK")
        {
            console.log("Creating Leaderboard");

            // Save list of Players
            leaderboardList = leaderboardResponse.leaderboard;

            // Debug
            console.log(leaderboardList);
            console.log(htmlLeaderboardContainer);

            // Update Title
            // TODO: TH.uuid is undefined
            for(let s = 0; s < availableTH.length; s++)
            {
                if(availableTH.uuid === sessionID)
                {
                    htmlContentTitle.innerHTML = "<h1> Leaderboard for: " + availableTH[s].name + "</h1>";
                }
                else
                {
                    htmlContentTitle.innerHTML = "<h1> Leaderboard for name unavailable</h1>";
                }
            }


            // Create Column Titles
            // TODO: Doesnt work, for some reason doesnt populate <table> in page
            htmlLeaderboardContainer.innerHTMl +=
                "<tr>" +
                "<th>Player</th>" + "<th>Score</th>" + "<th>Completion Time</th>" +
                "</tr>";

            // Create Leaderboard Entries
            for(let s = 0; s < leaderboardList.length; s++)
            {
                htmlLeaderboardContainer.innerHTMl +=
                    "<tr>" +
                    "<td>" + leaderboardList[s].player + "</td>" +
                    "<td>" + leaderboardList[s].score + "</td>" +
                    "<td>" + leaderboardList[s].completionTime + "</td>" +
                    "</tr>";
            }
        }
        else
        {
            alert("Requested leaderboard of Unknown Session!");
        }
        console.log(htmlLeaderboardContainer);
    }

    //Assume no reference to any Treasure Hunts exits
    else
    {
        // Show player all available THs to select one of which they would like to see the scoreboard
        fetchSessions();
    }

}

/* Requests a list of available sessions from the API */
async function fetchSessions()
{
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
    htmlContentTitle.innerHTML = "<h1> Select An Available Sessions </h1>";

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

        // Session Element
        sessionListElements +=
            "<li>" +
            "<div class =" + sessionID + ">" +
            "<p>" +  "<b>" + availableTH[s].name + "</b>" + "</p>" +
            "<p>" + "<i>" +availableTH[s].description + "</i>" + "</p>" +
            //Move on to begin playing
            "<button onclick=" + "fetchLeaderboard(\"" + availableTH[s].uuid + "\");" + ">" + "See Leaderboard" + "</button>" +
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

/* Empties template HTML elements */
function clearScreen()
{
    htmlContentTitle.innerHTML = "";
    htmlListOfQuizzes.innerHTML = "";
    htmlLeaderboardContainer.innerHTML = "";
}