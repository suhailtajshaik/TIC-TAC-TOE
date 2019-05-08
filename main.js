
let orginalBoard;
let PLAYER_TOKEN = 'O';
let COMPUTER_TOKEN = 'X';
let CONSTANTS = {
    WIN : "Congratulations you won!",
    LOSE : "Better luck next time...",
    TIE : "We are equals! Let's play again..."
}

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]


const cells = document.querySelectorAll('.cell');
startGame();

function selectSym(sym) {
    PLAYER_TOKEN = sym;
    COMPUTER_TOKEN = sym === 'O' ? 'X' : 'O';
    orginalBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false);
    }
    if (COMPUTER_TOKEN === 'X') {
        turn(bestSpot(), COMPUTER_TOKEN);
    }
    document.querySelector('.selectSym').style.display = "none";
    document.getElementById('your-side').innerText = "Your are : " + PLAYER_TOKEN;
}

function startGame() {
    document.querySelector('.endgame').style.display = "none";
    document.querySelector('.endgame .text').innerText = "";
    document.querySelector('.selectSym').style.display = "block";
    document.getElementById('your-side').innerText = "";
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
    }
}

function turnClick(square) {
    if (typeof orginalBoard[square.target.id] === 'number') {
        turn(square.target.id, PLAYER_TOKEN);
        if (!checkWin(orginalBoard, PLAYER_TOKEN) && !checkTie())
            turn(bestSpot(), COMPUTER_TOKEN);
    }
}

function turn(squareId, player) {
    orginalBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(orginalBoard, player);
    if (gameWon) gameOver(gameWon);
    checkTie();
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winningCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winningCombinations[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player === PLAYER_TOKEN ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === PLAYER_TOKEN ? CONSTANTS.WIN : CONSTANTS.LOSE);
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}
function emptySquares() {
    return orginalBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
    return minimax(orginalBoard, COMPUTER_TOKEN).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        for (cell of cells) {
            cell.style.backgroundColor = "yellow";
            cell.removeEventListener('click', turnClick, false);
        }
        declareWinner(CONSTANTS.TIE);
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, PLAYER_TOKEN)) {
        return { score: -10 };
    } else if (checkWin(newBoard, COMPUTER_TOKEN)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === COMPUTER_TOKEN)
            move.score = minimax(newBoard, PLAYER_TOKEN).score;
        else
            move.score = minimax(newBoard, COMPUTER_TOKEN).score;
        newBoard[availSpots[i]] = move.index;
        if ((player === COMPUTER_TOKEN && move.score === 10) || (player === PLAYER_TOKEN && move.score === -10))
            return move;
        else
            moves.push(move);
    }

    let bestMove, bestScore;
    if (player === COMPUTER_TOKEN) {
        bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
