var WALL = 1;
var BLOCK = 2;
// --------------------------------------------------
// colors 
banana  = '#FFFF33';
dragon  = '#FF3399';
sky     = '#33FFFF';
kiwi    = '#33FF33';
blueb   = '#6633FF';
peach   = '#FF9933';
cloud   = '#CCCCFF';

menuColor = '#CCCCFF';

// --------------------------------------------------
var pieces = [
  [I, sky],
  [J, blueb],
  [L, peach],
  [O, cloud],
  [S, kiwi],
  [T, banana],
  [Z, dragon]
];

var done;
var gdone;

var piece = null;

var keydownIntervals = {};
var dropStart;

var board = [];
var bag = [];
var lastReset;
var bagText = document.getElementById('bagsize');

// --------------------------------------------------
// For sizing and graphics
var canvas = document.getElementById('board');
var context = canvas.getContext('2d');
var clear = window.getComputedStyle(canvas).getPropertyValue('background-color');

var BOARDWIDTH = 4;
var BOARDHEIGHT = 16;
var LEFTSPACE = 1;
var RIGHTSPACE = 5;
var TOPSPACE = 2;
var BOARDPERCENT = 0.75;
var PREVIEW = 4;
var BOTTOMSPACE = 1;
var sideBarX;
var boardX;
var tilesz;
var wHeight;
var wWidth;
var thinLine;
var thickLine;

context.lineWidth = 1;
context.sRect = function (x, y, w, h, l) {
  l = parseInt(l);
  x = parseInt(x + l / 2);
  y = parseInt(y + l / 2);
  context.strokeRect(x, y, w - l, h - l);
};

context.fRect = function (x, y, w, h) {
  x = parseInt(x);
  y = parseInt(y);
  context.fillRect(x, y, w, h);
};

function initCanvas() {
  // wHeight       = window.innerHeight;
  // wWidth        = window.innerWidth;
  wHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  wWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  tilesz = parseInt(wHeight * BOARDPERCENT / BOARDHEIGHT);
  thinLine = 0.0125;
  thickLine = 0.25;
  boardX = LEFTSPACE + 1 * thickLine;
  sideBarX = LEFTSPACE + BOARDWIDTH + 2 * thickLine;
  canvas.width = (sideBarX + RIGHTSPACE) * tilesz;
  canvas.height = (TOPSPACE + BOARDHEIGHT + BOTTOMSPACE) * tilesz;
}

function setColor(color) {
  context.fillStyle = color;
  if (color !== clear) {
    context.strokeStyle = 'black';
  } else {
    context.strokeStyle = 'dimGray';
  }
}
clear = 'black';

// --------------------------------------------------
// For Piece Hold
var heldPiece;
var heldPieceNumber = -1; // is initialized as -1 to mean nothing held, MIGHT NOT BE USING
var currentPieceNumber;
var isPieceHeld;

// --------------------------------------------------
// For Starting and Ending of Games
document.getElementById('newGame').onclick = reset;
var WIN   = 1;
var LOSE  = 0;

function reset() {
  var now = Date.now();
  var delta = now - lastReset;
  if (delta > 100) {
    lastReset = Date.now();
    initGame();
    drawBoard();
    main();
  }
}

function gameOver(result) {
  var message;
  if (result === WIN) {
    message = 'YOU WON'
  } else {
    message = 'GAME OVER'
  }
  context.globalAlpha = 0.4;
  setColor('black');
  context.fRect(0,
          TOPSPACE * tilesz,
          canvas.width,
          canvas.height-TOPSPACE * tilesz);
  setColor(menuColor);
  context.globalAlpha = 1;
  context.fRect(0.5 * tilesz,
          canvas.height / 2.5 - 1.5*tilesz,
          canvas.width - (tilesz),
          5.5 * tilesz);
  context.font = '' + tilesz + 'px Arial';
  setColor('black');
  context.textAlign = 'center';
  context.fillText(message,
            canvas.width / 2,
            canvas.height / 2.5);
  context.fillText('(click anywhere',
            canvas.width/2,
            canvas.height / 2.5 + 2 * tilesz);
  context.fillText('to play again)',
            canvas.width/2,
            canvas.height / 2.5 + 3 * tilesz );

  gdone = true;
}

// --------------------------------------------------
// For Scoring
var combo = 0;
var bcombo = 0;

function initScores() {
  combo = 0;
}

function drawScoreBar() {
  setColor(menuColor);
  context.fRect(0, 0,
    canvas.width,
    TOPSPACE*tilesz-1);
  //ctx.font = '' + tilesz + 'px Arial';
  setColor('black');
  context.textAlign = 'center';
  context.font = '' + tilesz + 'px Arial';
  context.fillText('Combo: ' + combo + ' Best: ' + bcombo,
            canvas.width/2,
            TOPSPACE * tilesz / 1.5);
}

// --------------------------------------------------
// For Piece Preview
function updatePreview() {
  if (bag.length < PREVIEW) {
    makeAndShuffleBag();
  }

  drawPreview();
}

function drawPreview() {
  setColor('Black');
  context.fRect((sideBarX) * tilesz + 1,
    TOPSPACE * tilesz,
    RIGHTSPACE * tilesz,
    (BOARDHEIGHT - 4.1) * tilesz);
  for (let previewX = 0; previewX < PREVIEW; previewX++) {
    var nextToComeNumber = bag[bag.length - (1 + previewX)];
    var nextToComePiece = pieces[nextToComeNumber];
    setColor(nextToComePiece[1]);
    var size = nextToComePiece[0][0].length;

    var wAdjustment = 1;
    var hAdjustment = 0.5;
    if (nextToComeNumber === 0) {
      wAdjustment = 0.5;
      hAdjustment = -1;
    } else if (nextToComeNumber === 3) {
      wAdjustment = 0.5;
      hAdjustment = -0.5;
    } else if (nextToComeNumber === 4 || nextToComeNumber === 6) {
      hAdjustment = -0.5;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (nextToComePiece[0][0][y][x] !== 0) {
          // draw preview to the right
          drawSquare(sideBarX + x + wAdjustment,
            TOPSPACE + y + hAdjustment + 3 * previewX);
        }
      }
    }
  }
}

// --------------------------------------------------
// For Randomizer
var bagSize; // this should change based on what randomizer is chosen
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function makeAndShuffleBag() {
  var tempBag = [];
  if (bagSize > 0) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < bagSize; j++) {
        tempBag.push(i);
      }
    }

    tempBag = shuffle(tempBag);
  } else {
    for (let i = 0; i < 7; i++) {
      tempBag.push(getRandomInt(pieces.length));
    }
  }

  // next piece is bag.pop(), meaning order of pieces is read from end of bag
  // to start. This means we need to add future pieces to the beginning of the bag
  // rather than end.
  bag = tempBag.concat(bag);
}

function newPieceDet(blockNumber) {
  var p = pieces[blockNumber];
  currentPieceNumber = blockNumber;
  updatePreview();
  menuColor = p[1];
  
  //Drawing these things here so that they have the color of the current piece
  drawBorders();
  drawScoreBar();
  return new Piece(p[0], p[1], blockNumber);
}

function nextPiece() {

  if (bag.length === 0) {
    makeAndShuffleBag();
    return newPieceDet(bag.pop());
  } else {
    return newPieceDet(bag.pop());
  }
}
var possibleRandomizer = document.getElementsByName('randomizer');
bagSize = 0;
function initRandomizer() {
  bag = [];
  for (let i = 0; i < possibleRandomizer.length; i++) {
    if (possibleRandomizer[i].checked) {
      bagSize = possibleRandomizer[i].value;
    }
  }

  makeAndShuffleBag();
  bagText.textContent = 'Current Bag Size: ' + bagSize;
}

function initBoard() {
  for (let r = 0; r < BOARDHEIGHT; r++) {
    board[r] = [];
    for (let c = 0; c < BOARDWIDTH; c++) {
      board[r][c] = ['', -1];
    }
  }
}

function holdPiece() {
  if (!piece.recentlyHeld) {
    if (isPieceHeld === 0) { // ie no piece held
      isPieceHeld = 1;
      heldPieceNumber = currentPieceNumber;
      heldPiece = pieces[heldPieceNumber];
      piece.undraw();
      piece.undrawGhost();
      piece = nextPiece();
      piece.heldRecently();
    } else { // assuming hold isnt locked
      var oldHeldPieceNumber = heldPieceNumber;
      heldPieceNumber = currentPieceNumber;
      heldPiece = pieces[heldPieceNumber];
      currentPieceNumber = oldHeldPieceNumber;
      piece.undraw();
      piece.undrawGhost();
      piece = newPieceDet(currentPieceNumber);
      piece.heldRecently();
    }

    drawHold();
  }
}

function drawHold() {
  setColor('black');
  context.fRect(sideBarX * tilesz + 1,
    (TOPSPACE + BOARDHEIGHT - 3) * tilesz,
    RIGHTSPACE * tilesz,
    4.5 * tilesz);
  
  if (isPieceHeld) {
    setColor(heldPiece[1]);
    var size = heldPiece[0][0].length;
    var hAdjustment = 1 - 3;
    var wAdjustment = 1;
    if (heldPieceNumber === 0) {
      hAdjustment = -0.5 - 3.5;
      wAdjustment = 0.5;
    } else if (heldPieceNumber === 3) {
      hAdjustment -= 1;
      wAdjustment = 0.5;
    } else if (heldPieceNumber === 4 || heldPieceNumber === 6) {
      hAdjustment -= 1;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (heldPiece[0][0][y][x] !== 0) {
          drawSquare(sideBarX + x + wAdjustment,
            TOPSPACE + y + BOARDHEIGHT + hAdjustment);
        }
      }
    }
  }
}

function drawSquare(x, y) {
  context.fRect(x * tilesz, y * tilesz, tilesz, tilesz);
}

// --------------------------------------------------
// Defining the Piece object
function Piece(patterns, color, shapeNumber) {
  this.pattern = patterns[0];
  this.patterns = patterns;
  this.patterni = 0;
  this.recentlyHeld = 0;
  this.number = shapeNumber;

  this.color = color;

  this.x = BOARDWIDTH / 2 - parseInt(Math.ceil(this.pattern.length / 2), 10);
  this.y = -4;
  this.ghosty;
}

Piece.prototype.heldRecently = function () {
  this.recentlyHeld = 1;
};

Piece.prototype.notHeldRecently = function () { // might not need this
  this.recentlyHeld = 0;
};

Piece.prototype.wasHeldRecenty = function () { // this does not seem to work properly
  return this.recentlyHeld;
};

Piece.prototype.rotate = function (amount) {
  var nextpat = this.patterns[(this.patterni + amount) % this.patterns.length];
  var kicks = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]];
  var wk = [0, 0];
  if (this.number === 0) {
    kicks = [[0, 0], [1, 0], [2, 0], [0, 1], [-1, 0], [-2, 0], [0, -1]];
  }

  if (amount === 1) { // clockwise
    for (let i = 0; i < kicks.length; i++) {
      if (!this._collides(kicks[i][0], kicks[i][1], nextpat)) {
        wk = kicks[i];
        break;
      }
    }
  } else if (amount === 3) { // counter clockwise
    for (let i = 0; i < kicks.length; i++) {
      if (!this._collides(-kicks[i][0], kicks[i][1], nextpat)) {
        wk = kicks[i];
        wk[0] = -kicks[i][0];
        break;
      }
    };
  }

  if (!this._collides(wk[0], wk[1], nextpat)) {
    this.undraw();
    this.undrawGhost();
    this.x += wk[0];
    this.y += wk[1];
    this.patterni = (this.patterni + amount) % this.patterns.length;
    this.pattern = this.patterns[this.patterni];
    this.updateGhost();
    this.draw();
  }
};

Piece.prototype._collides = function (dx, dy, pat) {
  for (let ix = 0; ix < this.pattern.length; ix++) {
    for (let iy = 0; iy < this.pattern.length; iy++) {
      if (!pat[iy][ix]) {
        continue;
      }

      var x = this.x + ix + dx;
      var y = this.y + iy + dy;
      if (y >= BOARDHEIGHT || x < 0 || x >= BOARDWIDTH) {
        return WALL;
      }

      if (y < 0) {
        // Ignore negative space rows
        continue;
      }

      if (board[y][x][0] !== '') {
        return BLOCK;
      }
    }
  }

  return 0;
};

Piece.prototype.down = function () {
  if (this.y === -4) {
    // this should be the first call to updateGhost
    // ie no ghost to undraw
    this.updateGhost();
  }

  if (this._collides(0, 1, this.pattern)) {
    this.lock();
    if(!gdone) {
      piece = nextPiece();
    }
    return 1;
  } else {
    this.undraw();
    this.y++;
    this.draw();
    return 0;
  }
};

Piece.prototype.moveRight = function () {
  if (!this._collides(1, 0, this.pattern)) {
    this.undraw();
    this.undrawGhost();
    this.x++;
    this.updateGhost();
    this.draw();
  }
};

Piece.prototype.moveLeft = function () {
  if (!this._collides(-1, 0, this.pattern)) {
    this.undraw();
    this.undrawGhost();
    this.x--;
    this.updateGhost();
    this.draw();
  }
};

Piece.prototype.lock = function () {
  for (let ix = 0; ix < this.pattern.length; ix++) {
    for (let iy = 0; iy < this.pattern.length; iy++) {
      if (!this.pattern[iy][ix]) {
        continue;
      }

      if (this.y + iy < 0) {
        // Game ends!
        gameOver(LOSE);
        return;
      }

      board[this.y + iy][this.x + ix] = [this.color, this.id];
    }
  }

  var nlines = 0;
  for (let y = 0; y < BOARDHEIGHT; y++) {
    var line = true;
    for (let x = 0; x < BOARDWIDTH; x++) {
      line = line && board[y][x][0] !== '';
    }

    if (line) {
      for (let y2 = y; y2 > 0; y2--) {
        for (let x = 0; x < BOARDWIDTH; x++) {
          board[y2][x] = board[y2 - 1][x];
        }
      }

      for (let x = 0; x < BOARDWIDTH; x++) {
        board[0][x] = ['', -1];
      }

      nlines++;
    }
  }

  if (nlines > 0) {
    combo += 1;
    if (combo > bcombo) {
      bcombo = combo;
    }

    //drawScoreBar();
    drawBoard();
  } else { // no lines were cleared
    if (combo > 0) { // but we were in the middle of combo
      gameOver(LOSE);
    }
    // If this isn't commented, then after gameover,
    // you can't see how you just did
    //
    // If you display what there combo was in some
    // other way, resetting combo to zero should be
    // fine
    //
    // combo = 0;
  }
};

Piece.prototype.updateGhost = function () {
  var oldy = this.y;
  for (let i = 1; i < BOARDHEIGHT + 3; i++) {
    if (this._collides(0, 1, this.pattern)) {
      break;
    }

    this.y++;
  }

  this.ghosty = this.y;
  this.y = oldy;
  this.drawGhost();
};

Piece.prototype._fill = function (color) {
  setColor(color);
  var x = this.x;
  var y = this.y;
  var patlength = this.pattern.length;
  for (let ix = 0; ix < patlength; ix++) {
    for (let iy = 0; iy < patlength; iy++) {
      if (this.pattern[iy][ix] && y + iy >= 0) {
        drawSquare(boardX + x + ix, TOPSPACE + y + iy);
      }
    }
  }
};

Piece.prototype._fillGhost = function (color) {
  setColor(color);
  var x = this.x;
  var y = this.ghosty;
  var patlength = this.pattern.length;
  for (let ix = 0; ix < patlength; ix++) {
    for (let iy = 0; iy < patlength; iy++) {
      if (this.pattern[iy][ix] && y + iy >= 0) {
        drawSquare(boardX + x + ix, TOPSPACE + y + iy);
      }
    }
  }
};

Piece.prototype.undraw = function (context) {
  this._fill(clear);
};

Piece.prototype.draw = function (context) {
  this._fill(this.color);
};

Piece.prototype.drawGhost = function () {
  context.globalAlpha = 0.5;
  this._fillGhost(this.color);
  context.globalAlpha = 1.0;
};

Piece.prototype.undrawGhost = function () {
  this._fillGhost(clear);
};

// --------------------------------------------------
var repeatableKeys = [37, 39, 40];
document.body.addEventListener('keydown', function (e) {
  if (repeatableKeys.includes(e.keyCode)) {
    if (keydownIntervals[e.keyCode] !== null) {
      clearInterval(keydownIntervals[e.keyCode]);
    }
    keydownIntervals[e.keyCode] = setInterval(key.bind(this, e.keyCode), 150);
  }

  key(e.keyCode);
}, false);

document.body.addEventListener('keyup', function (e) {
  if (repeatableKeys.includes(e.keyCode)) {
    if (keydownIntervals[e.keyCode] !== null) {
      clearInterval(keydownIntervals[e.keyCode]);
    }
    keydownIntervals[e.keyCode] = null;
  }
}, false);

// --------------------------------------------------
// Recognizing swipes
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches || // browser API
         evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }
  if (gdone) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) { /* most significant */
    if (xDiff > 0) {
      /* left swipe */
      piece.moveLeft();
    } else {
      /* right swipe */
      piece.moveRight();
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
      holdPiece();
    } else {
      /* down swipe */
      while (piece.down() == 0) {}
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
};
// --------------------------------------------------
// Recognizing taps/touches/clicks
document.addEventListener('click', handleClick, false);

function handleClick(evt) {
  var x = evt.clientX;

  if (gdone) {
    reset();
  }
  if (x < wWidth / 2) {
    piece.rotate(3);
  } else {
    piece.rotate(1);
  }
};

// --------------------------------------------------
function key(k) {
  if (k === 82) { // Player pressed r
    reset();
  }
  if (gdone) {
    return;
  }

  if (k === 38) { // Player pressed up
    piece.rotate(3);
    dropStart = Date.now();
  } else if (k === 40) { // Player holding down
    piece.down();
  } else if (k === 37) { // Player holding left
    piece.moveLeft();
  } else if (k === 39) { // Player holding right
    piece.moveRight();
  } else if (k === 83) { // Player pressed s
    piece.rotate(3);
    dropStart = Date.now();
  } else if (k === 68) { // Player pressed d
    piece.rotate(1);
    dropStart = Date.now();
  } else if (k === 70) { // Player pressed f
    piece.rotate(2);
    dropStart = Date.now();
  } else if (k === 65) { // Player pressed a
    holdPiece();
  } else if (k === 32) { // Player pressed space
    while (piece.down() === 0) {
      continue;
    }
  }
}

function drawBoard() {
  for (let y = 0; y < BOARDHEIGHT; y++) {
    for (let x = 0; x < BOARDWIDTH; x++) {
      if (!board[y][x][0]) {
        setColor(clear);
        drawSquare(boardX + x, TOPSPACE + y);
      }
    }
  }

  for (let y = 0; y < BOARDHEIGHT; y++) {
    for (let x = 0; x < BOARDWIDTH; x++) {
      if (board[y][x][0]) {
        setColor(board[y][x][0]);
        drawSquare(boardX + x, TOPSPACE + y);
      }
    }
  }
}

function drawBorders() {
  context.fillStyle = menuColor;
  context.fRect((sideBarX + 0.5) * tilesz,
    (TOPSPACE + BOARDHEIGHT - 3.5) * tilesz,
    (RIGHTSPACE - 1) * tilesz,
    thickLine * tilesz);

  // make boundry around game board
  context.fRect(LEFTSPACE * tilesz - 1,
    TOPSPACE * tilesz,
    thickLine * tilesz,
    (BOARDHEIGHT + thickLine) * tilesz - 1);
  context.fRect((sideBarX - thickLine) * tilesz + 1,
    TOPSPACE * tilesz,
    thickLine * tilesz,
    (BOARDHEIGHT + thickLine) * tilesz - 1);
  context.fRect(LEFTSPACE * tilesz,
    (TOPSPACE + BOARDHEIGHT) * tilesz,
    (sideBarX - LEFTSPACE) * tilesz,
    (thickLine) * tilesz);
};

function initSideBoard() {
  // draw all canvas black
  setColor('black');
  context.fRect(0, 0,
    canvas.width,
    canvas.height);
  
  drawBorders( '#99D3DF' );
  drawScoreBar();
  // line seperating preview from hold
  //context.fillStyle = '#99D3DF';
}

function main() {
  if (!gdone) {
    var now = Date.now();
    var delta = now - dropStart;
    if (piece === null) {
      piece = nextPiece();
    }

    if (delta > 400) {
      piece.down();
      dropStart = now;
    }
  }

  if (!done) {
    requestAnimationFrame(main);
  }
}

function initGame() {
  initCanvas();
  initScores();
  initBoard();
  initSideBoard();
  initRandomizer();
  isPieceHeld = 0;
  done = false;
  gdone = false;
  dropStart = Date.now();
  piece = null;
}

window.onload = function () {
  lastReset = Date.now();
  initGame();
  drawBoard();
  main();
}