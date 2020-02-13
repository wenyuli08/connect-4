var player1;
var player2;
var player1bd;
var player2bd;
var map = new Array(7);
var canvas = document.getElementById("gameField");
var mousex;
var mousey;
var mouseClick1x = new Array(21);
var mouseClick2x = new Array(21);
var mouseClicked = 0;
var clicked1 = 0;
var clicked2 = 0;
var white_circle = new Image();
white_circle.src = "images/white-circle.png";
var red_circle = new Image();
red_circle.src = "images/red-circle.png";
var black_circle = new Image();
black_circle.src = "images/black-circle.png";
var result = new Boolean(0);
var begin = new Boolean(0);
var beginTime;
var winners = new Array();
var finalhours;
var finalmins;
var finalsecs;

newGame();

document.getElementById("play").addEventListener("click", clearPage);
document.getElementById("p1").addEventListener("mouseover", bigInfo);
document.getElementById("p1").addEventListener("mouseout", normalInfo);
document.getElementById("p2").addEventListener("mouseover", bigInfo2);
document.getElementById("p2").addEventListener("mouseout", normalInfo2);
document.getElementById("p3").addEventListener("mouseover", bigInfo3);
document.getElementById("p3").addEventListener("mouseout", normalInfo3);

function newGame() {
    // clear page
    document.getElementById("playerMessage").style.display = "none";
    document.getElementById("gameField").style.display = "none";
    document.getElementById("token1").style.display = "none";
    document.getElementById("token2").style.display = "none";
    document.getElementById("timer").style.display = "none";
}

function drawMap() {
    // create map to the board
    for (var i = 0; i < 7; i++) {
        map[i] = new Array(7);
        for (var j = 0; j < 7; j++) {
            map[i][j] = "white";
        }
    }
}

function draw() {
    // Main entry point got the HTML5 chess board example
    // Canvas supported?
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        var token1 = document.getElementById("token1");
        token1.innerHTML = player1 + "'s tokens left: " + (21 - clicked1);
        var token2 = document.getElementById("token2");
        token2.innerHTML = player2 + "'s tokens left: " + (21 - clicked2);
        BLOCK_SIZE = 100;
        // Draw the circles
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                if (map[i][j] === "white") {
                    ctx.drawImage(white_circle, (5 + j * BLOCK_SIZE), (5 + (i + 1) * BLOCK_SIZE), 90, 90);
                }
            }
        }
    }
}

function checkForToken() {
    if (clicked1 == 21 || clicked2 == 21) {
        window.alert("You are out of tokens!")
    } else if (clicked1 == 21 && clicked2 == 21 && !result) {
        window.alert("It's a tie!")
    }
}

function checkColumnFull(col) {
    var isFull = true;
    for (var i = 0; i < 6; i++) {
        if (map[i][col] === "white") {
            isFull = false;
        }
    }
    if (isFull) {
        window.alert("Current column is full!");
    }
}

window.addEventListener('finishDrop', function (e) {
    var player = checkPlayer();
    if (player == 1) {
        alert("Congratulations! " + player1 + " won in " + finalhours + " hours " + finalmins + " minites and " + finalsecs + " seconds!");
    } else {
        alert("Congratulations! " + player2 + " won in " + finalhours + " hours " + finalmins + " minites and " + finalsecs + " seconds!");
    }
    ;
}, false);

canvas.addEventListener("click", function (evt) {
    if (mousey < 100) {
        checkForToken();
        mouseClicked++;
        upadateClick();
        var player = checkPlayer();
        if (player === 1) {
            mouseClick1x[clicked1 - 1] = mousex;
            dropIt(mouseClick1x[clicked1 - 1]);
            var cur_min = +Infinity;
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 7; j++) {
                    var minimum = checkTokens1(i, j);
                    if (minimum < cur_min) {
                        cur_min = minimum;
                    }
                    if (map[i][j] == "red") {
                        result = checkForVictory(i, j);
                    }
                }
            }
            alert(player1 + " still needs " + cur_min + " tokens to win!");
            if (result) {
                var totalTime = Date.now() - beginTime;
                calculateEndTime(totalTime);
                setTimeout(function(){
                    window.dispatchEvent(new Event('finishDrop'));
                    showLocal(player1, totalTime);
                }, 500);
            }
            if (!result) {
                window.alert("Click OK to begin " + player2 + "'s turn!");
            }
        } else {
            mouseClick2x[clicked2 - 1] = mousex;
            dropIt(mouseClick2x[clicked2 - 1]);
            var cur_min2 = +Infinity;
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 7; j++) {
                    var minimum2 = checkTokens2(i, j);
                    if (minimum2 < cur_min2) {
                        cur_min2 = minimum2;
                    }
                    if (map[i][j] == "black") {
                        result = checkForVictory(i, j);
                    }
                }
            }
            alert(player2 + " still needs " + cur_min2 + " tokens to win!");
            if (result) {
                var totalTime = Date.now() - beginTime;
                calculateEndTime(totalTime);
                setTimeout(function(){
                    window.dispatchEvent(new Event('finishDrop'));
                    showLocal(player2, totalTime);
                }, 500);
            }
            if (!result) {
                window.alert("Click OK to begin " + player1 + "'s turn!");
            }
        }
    }
}, false);

function calculateEndTime(totalTime) {
    finalhours = Math.round(totalTime / (1000 * 60 * 60));
    finalmins = Math.round(totalTime / (1000 * 60) % 60);
    finalsecs = Math.round(totalTime / 1000 % 60);
}

function firstFreeRow(n) {
    for (var i = 0; i < mouseClick1x.length; i++) {
        if (map[i][n] == "white") {
            return i;
        }
    }
}
function firstFreeRow2(n) {
    for (var j = 0; j < mouseClick2x.length; j++) {
        if (map[j][n] == "white") {
            return j;
        }
    }
}

function checkPlayer() {
    if (mouseClicked % 2 != 0) {
        return 1;
    } else {
        return 2;
    }
}

function dropIt(coorx) {
    var ctx = canvas.getContext("2d");
    var player = checkPlayer();
    if (player == 1) {
        var c = Math.floor(coorx / 100);
        var r = firstFreeRow(c);
        checkColumnFull(c);
        ctx.drawImage(red_circle, (10 + c * 100), 10 + (700 - (r + 1) * 100), 80, 80);
        map[r][c] = "red";
    } else {
        var c2 = Math.floor(coorx / 100);
        var r2 = firstFreeRow2(c2);
        checkColumnFull(c2);
        ctx.drawImage(black_circle, (10 + c2 * 100), 10 + (700 - (r2 + 1) * 100), 80, 80);
        map[r2][c2] = "black";
    }
}

function showLocal(player, time) {
    // clear & show everything
    document.getElementById("playerMessage").style.display = "block";
    document.getElementById("button").style.display = "block";
    document.getElementById("gameField").style.display = "none";
    document.getElementById("token1").style.display = "none";
    document.getElementById("token2").style.display = "none";
    document.getElementById("timer").style.display = "none";
    var winner = { name: player, score: time };
    var ol = document.getElementById("localResult");
    // check if localStorage exists
    if (localStorage) {
        winners = localStorage.getItem("wel_104_connect_4_scores");
        if (winners) {
            winners = JSON.parse(winners);
        }
        else {
            // if localStorage empty, create an empty array
            winners = [];
        }
        // push the new record and sort it
        winners.push(winner);
        winners.sort(function (a, b) { return a.score - b.score });
        check();
        for (var j = 0; j < winners.length; j++) {
            var li = document.createElement("li");
            // get the time record
            var time = winners[j].score;
            var hour = Math.round(time / (1000 * 60 * 60));
            var min = Math.round(time / (1000 * 60) % 60);
            var sec = Math.round(time / 1000 % 60);
            var name = JSON.stringify(winners[j].name);
            var score = JSON.stringify(hour) + " hours " + JSON.stringify(min) + " minutes " + JSON.stringify(sec) + " seconds";
            var record = name + " with time " + score;
            li.innerHTML = record;
            // show it
            ol.appendChild(li)
        }
        var final = JSON.stringify(winners);
        localStorage.setItem("wel_104_connect_4_scores", final);
    }
}

function check() {
    // splice everything beyond index 10
    if (winners.length > 10) {
        for (var i = winners.length; i > 9; i--) {
            winners.pop();
        }
    }
    // set null to record not set
    for (var i = 0; i < 10; i++) {
        if (winners[i] == undefined) {
            winners[i] = { name: "Record not set", score: "Record not set" };
        }
    }
}

// bad coding
function checkTokens1(row, col) {
    var dir1 = getAdjRed(row, col, 0, -1, 4);
    var dir2 = getAdjRed(row, col, 0, 1, 4);
    var dir3 = getAdjRed(row, col, -1, 0, 4);
    var dir4 = getAdjRed(row, col, 1, 0, 4);
    var dir5 = getAdjRed(row, col, -1, -1, 4);
    var dir6 = getAdjRed(row, col, 1, 1, 4);
    var dir7 = getAdjRed(row, col, -1, 1, 4);
    var dir8 = getAdjRed(row, col, 1, -1, 4);
    var tokens = Math.max(dir1, dir2, dir3, dir4, dir5, dir6, dir7, dir8);
    if (map[row][col] == "red") {
        return 3 - tokens;
    }
    return 4 - tokens;
}

// bad coding
function checkTokens2(row, col) {
    var dir1 = getAdjBlack(row, col, 0, -1, 4);
    var dir2 = getAdjBlack(row, col, 0, 1, 4);
    var dir3 = getAdjBlack(row, col, -1, 0, 4);
    var dir4 = getAdjBlack(row, col, 1, 0, 4);
    var dir5 = getAdjBlack(row, col, -1, -1, 4);
    var dir6 = getAdjBlack(row, col, 1, 1, 4);
    var dir7 = getAdjBlack(row, col, -1, 1, 4);
    var dir8 = getAdjBlack(row, col, 1, -1, 4);
    var tokens = Math.max(dir1, dir2, dir3, dir4, dir5, dir6, dir7, dir8);
    if (map[row][col] == "black") {
        return 3 - tokens;
    }
    return 4 - tokens;
}

// bad coding
function checkForVictory(row, col) {
    var player = checkPlayer();
    if (player == 1) {
        if (getAdjRed(row, col, 0, -1, 4) > 2) {
            return true;
        } else if (getAdjRed(row, col, 0, 1, 4) > 2) {
            return true;
        } else if (getAdjRed(row, col, -1, 0, 4) > 2) {
            return true;
        } else if (getAdjRed(row, col, 1, 0, 4) > 2) {
            return true;
        } else if (getAdjRed(row, col, -1, -1, 4) > 2) {
            return true;
        } else if (getAdjRed(row, col, 1, 1, 4) > 2) {
            return true;
        } else if (getAdjRed(row, col, 1, -1, 4) > 2) {
            return true;
        } else if (getAdjRed(row, col, -1, 1, 4) > 2) {
            return true;
        } else {
            return false;
        }
    } else {
        if (getAdjBlack(row, col, 0, -1, 4) > 2) {
            return true;
        } else if (getAdjBlack(row, col, 0, 1, 4) > 2) {
            return true;
        } else if (getAdjBlack(row, col, -1, 0, 4) > 2) {
            return true;
        } else if (getAdjBlack(row, col, 1, 0, 4) > 2) {
            return true;
        } else if (getAdjBlack(row, col, 1, 1, 4) > 2) {
            return true;
        } else if (getAdjBlack(row, col, -1, -1, 4) > 2) {
            return true;
        } else if (getAdjBlack(row, col, -1, 1, 4) > 2) {
            return true;
        } else if (getAdjBlack(row, col, 1, -1, 4) > 2) {
            return true;
        } else {
            return false;
        }
    }
}

// bad coding, good algorithm
function getAdjRed(row, col, row_inc, col_inc, step) {
    step--;
    if (step == 0) {
        return 0;
    }
    var check = cellVal(row, col);
    var check2 = cellVal(row + row_inc, col + col_inc);
    if (!(check && check2)) {
        return 0;
    }
    if (map[row + row_inc][col + col_inc] == "red") {
        var res = getAdjRed(row + row_inc, col + col_inc, row_inc, col_inc, step);
        return 1 + res;
    }
    if (map[row + row_inc][col + col_inc] == "white") {
        var res = getAdjRed(row + row_inc, col + col_inc, row_inc, col_inc, step);
        return 0 + res;
    }
    if (map[row + row_inc][col + col_inc] == "black") {
        return -1;
    }
}

// bad coding
function getAdjBlack(row, col, row_inc, col_inc, step) {
    step--;
    if (step == 0) {
        return 0;
    }
    var check = cellVal(row, col);
    var check2 = cellVal(row + row_inc, col + col_inc);
    if (!(check && check2)) {
        return 0;
    }
    if (map[row + row_inc][col + col_inc] == "black") {
        var res = getAdjBlack(row + row_inc, col + col_inc, row_inc, col_inc, step);
        return 1 + res;
    }
    if (map[row + row_inc][col + col_inc] == "white") {
        var res = getAdjBlack(row + row_inc, col + col_inc, row_inc, col_inc, step);
        return 0 + res;
    }
    if (map[row + row_inc][col + col_inc] == "red") {
        return -1;
    }
    step--;
}

function cellVal(row, col) {
    if (map[row] == undefined || map[row][col] == undefined) {
        return false;
    } else {
        return true;
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function upadateClick() {
    var player = checkPlayer();
    if (player == 1) {
        clicked1++;
    } else {
        clicked2++;
    }
    var token1 = document.getElementById("token1");
    token1.innerHTML = player1 + "'s tokens left: " + (21 - clicked1);
    var token2 = document.getElementById("token2");
    token2.innerHTML = player2 + "'s tokens left: " + (21 - clicked2);
}

canvas.addEventListener("mousemove", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    mousex = mousePos.x;
    mousey = mousePos.y;
    var message = "Mouse position: " + mousePos.x + ", " + mousePos.y;
    clearBackground(canvas, message);
    moveCircle();
}, false);

function clearBackground(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, 700, 100);
    // context.font = '18pt Calibri';
    // context.fillText(message, 10, 25);
    // context.fillText("Total clicks: " + mouseClicked, 10, 50);
    // context.fillText("player1: " + clicked1, 10, 75);
    // context.fillText("player2: " + clicked2, 10, 100);
    // context.fillText(result, 600, 25);
}

function moveCircle() {
    var ctx = canvas.getContext("2d");
    var player = checkPlayer();
    if (player == 2) {
        canvas.onmousemove = function (e) {
            ctx.drawImage(red_circle, mousex - 50, 5, 80, 80);
        }
    } else {
        canvas.onmousemove = function (e) {
            ctx.drawImage(black_circle, mousex - 50, 5, 80, 80);
        }
    }
}

function clearPage() {
    drawMap();
    draw();
    document.getElementById("infobox").style.display = "none";
    document.getElementById("button").style.display = "none";
    document.getElementById("playerMessage").style.display = "none";
    document.getElementById("gameField").style.display = "block";
    document.getElementById("token1").style.display = "block";
    document.getElementById("token2").style.display = "block";
    document.getElementById("timer").style.display = "block";
    window.onload = startGame();
}

function startGame() {
    player1 = prompt("Please enter your name:", "player 1");
    if (player1 == null || player1 == "") {
        window.alert("User cancelled the prompt.");
        startTimer(Date.now());
    } else {
        player1bd = prompt("Welcome " + player1 + "! Please enter your birthday:");
        if (player1bd == null || player1bd == "") {
            window.alert("User cancelled the prompt.");
            startTimer(Date.now());
        } else {
            player1bd = validate(player1bd);
            player2 = prompt("Please enter your name:", "player 2");
            if (player2 == null || player2 == "") {
                window.alert("User cancelled the prompt.");
                startTimer(Date.now());
            } else {
                player2bd = prompt("Welcome " + player2 + "! Please enter your birthday:");
                if (player2bd == null || player2bd == "") {
                    window.alert("User cancelled the prompt.");
                    startTimer(Date.now());
                } else {
                    player2bd = validate(player2bd);
                    if (player1bd <= player2bd) {
                        //nothing to change
                    } else if (player1bd > player2bd) {
                        player2 = [player1, player1 = player2][0];
                    } else {
                        alert("Date format not supported!");
                    }
                    alert("Click OK to start " + player1 + "'s turn!");
                    startTimer(Date.now());
                }
            }
        }
    }
}

function validate(birthday) {
    var arr = birthday.match(/(\w+)[\.\/-]?\s?(\w+)[\,\/-]?\s?(\w+)/);
    var birthday2 = new Date(arr[0]);
    if (arr[0] === "January" || arr[0] === "Jan") {
        arr[0] = 2;
    } else if (arr[0] === "February" || arr[0] === "Feb") {
        arr[0] = 3;
    } else if (arr[0] === "March" || arr[0] === "Mar") {
        arr[0] = 4;
    } else if (arr[0] === "April" || arr[0] === "Apr") {
        arr[0] = 5;
    } else if (arr[0] === "May") {
        arr[0] = 6;
    } else if (arr[0] === "June" || arr[0] === "Jun") {
        arr[0] = 7;
    } else if (arr[0] === "July" || arr[0] === "Jul") {
        arr[0] = 8;
    } else if (arr[0] === "August" || arr[0] === "Aug") {
        arr[0] = 9;
    } else if (arr[0] === "September" || arr[0] === "Sep") {
        arr[0] = 10;
    } else if (arr[0] === "October" || arr[0] === "Oct") {
        arr[0] = 11;
    } else if (arr[0] === "November" || arr[0] === "Nov") {
        arr[0] = 12;
    } else if (arr[0] === "December" || arr[0] === "Dec") {
        arr[0] = 13;
    }
    return birthday2;
}

function startTimer(origin) {
    beginTime = origin;
    var clock = document.getElementById("timer");
    setInterval(function () {
        var interval = Date.now() - origin;
        var secs = Math.round(interval / 1000) % 60;
        var mins = Math.floor(interval / (1000 * 60) % 60);
        var hours = Math.floor(interval / (1000 * 60 * 60));
        clock.innerHTML = hours + ":" + mins + ":" + secs;
    }, 500);
}

//fractals

function bigInfo() {
    document.getElementById("p1").style.fontSize = "36px";
    document.getElementById("p1").style.fontStyle = "normal";
}

function normalInfo() {
    document.getElementById("p1").style.fontSize = "18px";
    document.getElementById("p1").style.fontStyle = "italic";
}
function bigInfo2() {
    document.getElementById("p2").style.fontSize = "36px";
    document.getElementById("p2").style.fontStyle = "normal";
}

function normalInfo2() {
    document.getElementById("p2").style.fontSize = "18px";
    document.getElementById("p2").style.fontStyle = "italic";
}
function bigInfo3() {
    document.getElementById("p3").style.fontSize = "36px";
    document.getElementById("p3").style.fontStyle = "normal";
}

function normalInfo3() {
    document.getElementById("p3").style.fontSize = "18px";
    document.getElementById("p3").style.fontStyle = "italic";
}