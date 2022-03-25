


async function testLeaderboard()
{
    let leaderboardResponse;
    const htmlLeaderboardContainer = document.getElementById("leaderboardContainer");
    const htmlLeaderboardUnitTest = document.getElementById("leaderboardUnitTest");

    let API_Request, sorted, prize;

    //Get Required Parameters from page
    let amount = parseInt(document.getElementById("PlayerScope").value);
    console.log(amount);

    let sortedTrue = document.getElementById("ListSorted").checked;
    console.log(sortedTrue);
    let sortedFalse = document.getElementById("ListUnsorted").checked;
    console.log(sortedFalse);

    let prizeTrue = document.getElementById("HasPrize").checked;
    console.log(prizeTrue);
    let prizeFalse = document.getElementById("NoPrize").checked;
    console.log(prizeFalse);



    if(amount !== "")
    {
        if(sortedTrue !== false || sortedFalse !== false)
        {
            if(prizeTrue !== false || prizeFalse !== false)
            {
                //Check if the leaderboard should be sorted or not
                if(sortedTrue)
                {
                    //Check if the leaderboard should contain a prize or not
                    if(prizeTrue)
                    {
                        API_Request = "https://codecyprus.org/th/test-api/leaderboard?sorted&hasPrize&size=";
                    }
                    else
                    {
                        API_Request = "https://codecyprus.org/th/test-api/leaderboard?sorted&size="
                    }
                }
                else
                {
                    //Check if the leaderboard should contain a prize or not
                    if(prizeTrue)
                    {
                        API_Request = "https://codecyprus.org/th/test-api/leaderboard?hasPrize&size=";
                    }
                    else
                    {
                        API_Request = "https://codecyprus.org/th/test-api/leaderboard?size="
                    }
                }

                console.log("---> Fetching Leaderboard");

                const response = await fetch( API_Request + amount)
                    .then(response => response.json() /* Convert it from JSON */)
                    .then(json => {leaderboardResponse = json /* Save in Variable Array */});

                console.log(leaderboardResponse);


                if(leaderboardResponse.status === "OK")
                {
                    // "<td>" +  + "</td>" +

                    console.log("Creating Unit Test");

                    // Leaderboard Size
                    unitTestInner =
                        "<tr>" +
                        "<th>Input Type</th>" + "<th>Recieved</th>" + "<th>Expected</th>" + "<th>Passed</th>" +
                        "</tr>";
                    unitTestInner +=
                        "<tr>" +
                        "<td> Size: </td>" + "<td>" + leaderboardResponse.numOfPlayers + "</td>" + "<td>" + amount + "</td>";
                    if(leaderboardResponse.numOfPlayers === amount)
                    {
                        unitTestInner += "<td> True </td>" + "</tr>";
                    }
                    else
                    {
                        unitTestInner += "<td> False </td>" + "</tr>";
                    }

                    // Sorted
                    if(sortedTrue === true)
                    {
                        unitTestInner +=
                            "<tr>" +
                            "<td> Sorted: </td>" + "<td>" + leaderboardResponse.sorted + "</td>" + "<td>" + sortedTrue + "</td>";
                        if(leaderboardResponse.sorted === sortedTrue)
                        {
                            unitTestInner += "<td> True </td>"+ "</tr>";
                        }
                        else
                        {
                            nitTestInner += "<td> False </td>"+ "</tr>";
                        }
                    }
                    else
                    {
                        unitTestInner +=
                            "<tr>" +
                            "<td> Sorted: </td>" + "<td>" + leaderboardResponse.sorted + "</td>" + "<td>" + !sortedFalse + "</td>";
                        if(leaderboardResponse.sorted === !sortedFalse)
                        {
                            unitTestInner += "<td> True </td>"+ "</tr>";
                        }
                        else
                        {
                            nitTestInner += "<td> False </td>"+ "</tr>";
                        }
                    }

                    // Prize
                    if(prizeTrue === true)
                    {
                        unitTestInner +=
                            "<tr>" +
                            "<td> Prize: </td>" + "<td>" + leaderboardResponse.hasPrize + "</td>" + "<td>" + prizeTrue + "</td>";
                        if(leaderboardResponse.hasPrize === prizeTrue)
                        {
                            unitTestInner += "<td> True </td>"+ "</tr>";
                        }
                        else
                        {
                            nitTestInner += "<td> False </td>"+ "</tr>";
                        }
                    }
                    else
                    {
                        unitTestInner +=
                            "<tr>" +
                            "<td> Prize: </td>" + "<td>" + leaderboardResponse.hasPrize + "</td>" + "<td>" + !prizeFalse + "</td>";
                        if(leaderboardResponse.hasPrize === !prizeFalse)
                        {
                            unitTestInner += "<td> True </td>"+ "</tr>";
                        }
                        else
                        {
                            nitTestInner += "<td> False </td>"+ "</tr>";
                        }
                    }

                    // Add end of row
                    //unitTestInner += "</tr>";

                    //Insert Rows into Table
                    htmlLeaderboardUnitTest.innerHTML = unitTestInner;

                    // -----------------------------------------

                    console.log("Creating Leaderboard");

                    // Save list of Players
                    leaderboardList = leaderboardResponse.leaderboard;

                    // Debug
                    console.log(leaderboardList);

                    // Create Column Titles
                    tableInner =
                        "<tr>" +
                        "<th>Player</th>" + "<th>Score</th>" + "<th>Completion Time (h:m:s)</th>" +
                        "</tr>";

                    // Create Leaderboard Entries
                    for(let s = 0; s < leaderboardList.length; s++)
                    {
                        tableInner +=
                            "<tr>" +
                            "<td>" + leaderboardList[s].player + "</td>" +
                            "<td>" + leaderboardList[s].score + "</td>" +
                            "<td>" + MiltoTime(leaderboardList[s].completionTime) + "</td>" +
                            "</tr>";
                    }

                    // Insert Rows into Table
                    htmlLeaderboardContainer.innerHTML = tableInner;
                }
                else
                {
                    alert("Leaderboard Retrieval Not Successful");
                }
            }
        }
    }




    // -----------------------------------------------------------------------------------------------------------

    /* ....... */

}


/* Converts Milliseconds to Time of day */
function MiltoTime(milliseconds)
{
    let time = milliseconds;

    // --- Convert Time ---
    // Milliseconds
    var mil = time % 1000;
    time = (time - mil) / 1000;
    // Seconds
    var secs = time % 60;
    time = (time - secs) / 60;
    // Minutes
    var mins = time % 60;
    // Hours
    var hrs = (time - mins) / 60;

    // --- Save ---
    // Final Time returned as single object for printing
    time = hrs + ':' + mins + ':' + secs;

    return time;
}