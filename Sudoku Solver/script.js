var root = document.getElementById('board');
var err = document.getElementById('err');
var btn = document.getElementById('solve');
var cnt = 0;
var undobtn = document.getElementById('undo');
for (var  i = 1; i < 10; i++) {
    var row = document.createElement('div');
    for (var j = 1; j < 10; j++) {
        var ele = document.createElement('input');
        ele.setAttribute('type', 'number');
        ele.setAttribute('min','1');
        ele.setAttribute('max','9');
        row.appendChild(ele);
    }
    root.appendChild(row)
}

function cellsValidity() {
    var cnt = 0;
    cells.forEach(cell => {
        if (cell.classList.contains('err')) {
            cnt++;
        }
    });
    if (cnt > 0) {
        btn.disabled = true;
    } else {
        btn.disabled = false;
    }
}

const cells = document.querySelectorAll('#board input');

cells.forEach(cell => {
    cell.addEventListener('input' ,() => {
        if (cell.value.length > 1) {
            cell.classList.add('err');
            btn.disabled = true;
            err.innerText = 'num should be between 1 and 9 with any leading zeroes.';
        } else if (cell.value == '0') {
            cell.classList.add('err');
            btn.disabled = true;
            err.innerText = 'num should be between 1 and 9 with any leading zeroes.';
        } else {
            cell.classList.remove('err');
            err.innerText = '';
        }
        cellsValidity();
    });
    cell.addEventListener('focusout', () => {
        if (cell.value.length == 1) {
            cell.classList.add('filled');
        } else {
            cell.classList.remove('filled');
        }
    });
});

var board = [];
function formBoard() {
    board = [];
    var k = 0;
    for (var i = 1; i < 10; i++) {
        var rowstr = [];
        for (var j = 1; j < 10; j++) {
            var data = cells[k].value;
            k++;
            if (data.length < 1) {
                rowstr.push('.');
            } else {
                rowstr.push(data);
            }
        }
        board.push(rowstr);
    }
}

function isValidBoard() {
    //each row
    var numbers = new Set();
    for (var i = 0; i < 9; i++) {
        numbers.clear();
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != '.') {
                if (numbers.has(board[i][j]))  {
                    return false;
                }
                else numbers.add(board[i][j]);
            }
        }
    }
    //each col
    for (var i = 0; i < 9; i++) {
        numbers.clear();
        for (var j = 0; j < 9; j++) {
            if (board[j][i] != '.') {
                if (numbers.has(board[j][i])) {
                    return false;
                }
                else numbers.add(board[j][i]);
            }
        }
    }
    //each box
    for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
            numbers.clear();
            for (var i = r*3; i < r*3 + 3; i++) {
                for (var j = c*3; j < c*3 + 3; j++) {
                    if (board[j][i] != '.') {
                        if (numbers.has(board[j][i])) {
                            return false;
                        }
                        else numbers.add(board[j][i]);
                    }
                }
            }
        }
    }
    return true;
}

const solve = function() {
    cnt++;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] === '.') {
                for (var c = 1; c < 10; c++) {
                    if (isValid(String(c), [i,j])) {
                        board[i][j] = String(c);
                        if (solve()) {
                            return true;
                        }
                        board[i][j] = '.';
                    }
                }
                return false;
            }
        }
    }
    return true;
};

const  isValid = function(num, pos) {
    for (var i = 0; i < 9; i++) {
        if (board[pos[0]][i] == num && pos[1] != i) return false;
    }
    for (var i = 0; i < 9; i++) {
        if (board[i][pos[1]] == num && pos[0] != i) return false;
    }
    var box_x = Math.floor(pos[0]/3)
    var box_y = Math.floor(pos[1]/3)
    for (var i = box_x*3; i < box_x*3 + 3; i++) {
        for (var j = box_y*3; j < box_y*3 + 3; j++) {
            if (board[i][j] == num && (i != pos[0] || j != pos[1])) return false;
        }
    }
    return true;
};

const updateBoard = function (solution = true) {
    var k = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (!cells[k].classList.contains('filled')) {
                if (board[i][j] !== '.') {
                    cells[k].value = board[i][j];
                    if (!solution) {
                        cells[k].classList.add('generated');
                    }
                } else {
                    cells[k].value = '';
                }
            }
            
            k++;
        }
    }
};

function validateSudoku() {
    cnt = 0;
    formBoard();
    if  (!isValidBoard()) {
        err.innerText = 'Invalid board, any column, row or box has repeated value';
        return false;
    }
    // console.log('solving...');
    solve();
    // console.log('Done.');
    console.log(cnt);
    updateBoard();
    undobtn.disabled = false;
}

function undo() {
    var k = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (!(cells[k].classList.contains('filled') || cells[k].classList.contains('generated'))) {
                board[i][j] = '.';
            }
            k++;
        }
    }
    updateBoard();
    undobtn.disabled = true;
}

function genBoard(params) {
    params = JSON.parse(params);
    if (params.response) {
        params = params.squares;
    }
    formBoard();
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('generated','filled');
    }
    for (let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            board[i][j] = '.';
        }
    }
    console.log(params);
    for (let i = 0; i < params.length; i++) {
        board[params[i].x][params[i].y] = String(params[i].value);
    }
    updateBoard(false);
}

function generatePuzzle() {
    var level = prompt("Select level: (1-Easy, 2-Medium, 3-Hard)", "1");
    if (isNaN(Number(level)) || Number(level) > 3 || Number(level) < 1) {
        alert("Invalid Level, Setting to Easy");
        level = 1;
    } else {
        level = Number(level);
    }
    try {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                genBoard(this.responseText);
            }
        }
        xhttp.open("GET", "https://cors-anywhere.herokuapp.com/http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9" + "&level=" + level.toString());
        xhttp.send();
    } catch {
        err.innerHTML = 'Access Required. head to <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">this Link</a> and click on <kbd>Request temporary access to the demo server<kbd>'
    }
}