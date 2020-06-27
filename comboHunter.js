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


// 400 pink = '#EC407A';
pink = '#F06292';
blue = '#42A5F5';
cyan = '#26C6DA';
gree = '#66BB6A';
lime = '#D4E157';
ambe = '#FFCA28';
deor = '#FF7043';

teal = '#E0F2F1';

topBarColor = teal;
resultsColor = teal;
continueColor = cyan;
replayColor = lime;
returnColor = blue;

endlessColor = cyan;
missionsColor = ambe;
digColor = deor;
settingsColor = pink;




var theme;
var TROPICAL = 0;
var TRANS = 1;


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


var pieces = [
  [I, cyan],
  [J, blue],
  [L, deor],
  [O, lime],
  [S, gree],
  [T, ambe],
  [Z, pink]
];
var done;
var gdone;

var piece = null;

var keydownIntervals = {};
var dropStart;

var board = [];
var bag = [];

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
var BOARDPERCENT = 0.8;
var PREVIEW = 4;
var BOTTOMSPACE = 1;
var sideBarX;
var boardX;
var tilesz;
var wHeight;
var wWidth;
var thinLine;
var thickLine;

var SMALLBUTTON = 2.5;
var BIGBUTTON   = 4;

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



/**
 * From stackoverflow:
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}





// --------------------------------------------------
// For Piece Hold
var heldPiece;
var heldPieceNumber = -1; // is initialized as -1 to mean nothing held, MIGHT NOT BE USING
var currentPieceNumber;
var isPieceHeld;

// --------------------------------------------------
// For Starting and Ending of Games
var WIN       = 1;
var LOSE      = 0;
var BADWIN    = -1
var recentWin = false;

var gameScreen;
var INPLAY    = 0;
var GAMEOVER  = 1;
var MAINMENU  = 2;
var SETTINGS  = 3;

function reset() {
  initGame();
  drawBoard();
  main();
}

function gameOver(result) {
  var message = '';
  var rank = '';
  var replayOffset = 2;
  gameScreen = GAMEOVER;

  if (result === WIN) {
    message = 'YOU WON'
  } else if (result === LOSE) {
    message = 'GAME OVER';
  } else if (result === BADWIN) {
    message = 'TRY AGAIN';
  }
  context.globalAlpha = 0.6;
  setColor('black');
  context.fRect(0,
        TOPSPACE * tilesz,
        canvas.width,
        canvas.height-TOPSPACE * tilesz);
  
  setColor(resultsColor);
  context.globalAlpha = 1;

  context.fRect(0.5 * tilesz,
        (TOPSPACE + 0.5) * tilesz,
        canvas.width - (tilesz),
        7 * tilesz);

  context.font = '' + tilesz + 'px Arial';
  setColor('black');
  context.textAlign = 'center';
  context.fillText(message,
        canvas.width / 2,
        (TOPSPACE + 2) * tilesz);
  context.textAlign = 'left';
  if (gameMode === EL) {
    context.fillText('Combo: ' + combo,
        1 * tilesz,
        (TOPSPACE + 3.5) * tilesz);
    context.fillText('Pieces: '+ numpieces,
        1 * tilesz,
        (TOPSPACE + 5) * tilesz);
    context.fillText('Score: '+ Math.floor(((combo / numpieces) * 1000.)),
        1 * tilesz,
        (TOPSPACE + 6.5) * tilesz);
  } else if (gameMode === MS) {
    context.fillText('Combo: ' + combo,
        1 * tilesz,
        (TOPSPACE + 4) * tilesz);
    rank = calculateRank(result);
    context.fillText('Rank: '+ rank,
        1 * tilesz,
        (TOPSPACE + 6) * tilesz);
  }

  if(result === WIN && gameMode === MS) { 
      // moving this functionality to happen when user initiates it
      //currentMission += 1;
      //currentMission %= missions.length;
    }

  drawContinueOptions(result);
}

// On the game over summary screen there are buttons
// to play again or go to main menu
// Mission mode should also have a play next mission option
//
// My knowledge of making 'buttons' is poor
// I think I'm going to need to hardcode button positions
// into where button presses get recorded
function drawContinueOptions(result) {
  var buttonSpacing = (SMALLBUTTON + 0.5) * tilesz;

  var continueStart = (TOPSPACE + 8) * tilesz;
  var replayStart   = continueStart + buttonSpacing;
  var returnStart   = replayStart + buttonSpacing;
;

  var continueText = "Play Again";
  var replayText = "Replay Mission";
  var returnText = "Main Menu";
  if (gameMode === MS) {
    continueText = "Play Next Mission";
  }

  //continue button
  drawButton(continueStart, 
             SMALLBUTTON,
             continueColor, 
             continueText);

  //return button
  drawOutlinedButton(returnStart, 
             SMALLBUTTON,
             returnColor, 
             returnText);

  if (gameMode === MS) {
  //replay button
  drawButton(replayStart, 
             SMALLBUTTON, 
             replayColor,
             replayText);

    if (result !== WIN) {
      //shade out continue button  
      context.globalAlpha = 0.4;
      setColor('black');
      context.fRect(0.5 * tilesz,
        continueStart,
        canvas.width - (tilesz),
        SMALLBUTTON * tilesz);
      context.globalAlpha = 1;
    }
  }
}

// this draws a rectangle with text
function drawButton(  x,
                      size,
                      color,
                      text) {

  setColor(color);
  context.globalAlpha = 1;
  //context.fRect(0.5 * tilesz,
  //    x,
  //    canvas.width - (tilesz),
  //    size * tilesz);
  roundRect(context,
            0.5 * tilesz,
            x,
            canvas.width - tilesz,
            size * tilesz,
            tilesz / 3,
            true);

  context.font = '' + tilesz + 'px Arial';
  setColor('black');
  context.textAlign = 'center';
  if (size === BIGBUTTON) {
    context.fillText(text,
      canvas.width / 2,
      x + 2.25*tilesz);
  }
  else {
    context.fillText(text,
      canvas.width / 2,
      x + 1.5*tilesz);
  }
}

// this draws a rectangle with text
function drawOutlinedButton(  x,
                      size,
                      color,
                      text) {
  context.globalAlpha = .5;
  setColor('black');
  roundRect(context,
            0.5 * tilesz,
            x,
            canvas.width - tilesz,
            size * tilesz,
            tilesz / 3,
            true);

  setColor(color);
  context.globalAlpha = 1;
  context.strokeStyle = color;
  context.lineWidth = tilesz / 10;
  roundRect(context,
            0.5 * tilesz,
            x,
            canvas.width - tilesz,
            size * tilesz,
            tilesz / 3,
            false,
            true);

  context.font = '' + tilesz + 'px Arial';
  context.textAlign = 'center';
  if (size === BIGBUTTON) {
    context.fillText(text,
      canvas.width / 2,
      x + 2.25*tilesz);
  }
  else {
    context.fillText(text,
      canvas.width / 2,
      x + 1.5*tilesz);
  }
  setColor('black');
  context.strokeStyle = 'black';
  context.lineWidth = "2";
}





// In missions mode, every attempt gets a grade
function calculateRank(result) {
  var rank;
  var gotMaxCombo = false;
  var gotAllClear = false;

  if (result === LOSE) {
    rank = ' ';
  } else if (result === BADWIN) {
    rank = 'D';
  } else if (result === WIN) {
    rank = 'C';
    if (combo === missions[currentMission][1][0]) {
      gotMaxCombo = true;
    }
    if (!missions[currentMission][1][1]) {
      if (gotMaxCombo) {
        rank = 'A';
      } else {
        rank = 'B';
      }
    } else {
      gotAllClear = isAllClear();
      if (gotAllClear && gotMaxCombo) {
        rank = 'A';
      } else if (gotAllClear || gotMaxCombo) {
        rank = 'B';
      }
    }
  }
  
  return rank;
}

//check if the current board is empty
//due to game rules, if bottom row empty, the whole thing is empty
function isAllClear() {
  var cleared = true;
  for (let c = 0; c < BOARDWIDTH; c++) {
      if (board[BOARDHEIGHT-1][c][1] != -1) {
        cleared = false;
      }
  }
  return cleared;
}


function drawSettings() {

  var textHeight = 1.5 * tilesz;
  var textOffset = 0;
  var startY = (TOPSPACE + 0.5) * tilesz;
  var randomizerText = ['Randomizer:',
                        '1 Bag',
                        '2 Bag',
                        '7 Bag',
                        'Random'];

  var themeText = [ 'Theme:',
                    'Tropical'];
                   // 'Trans Flag'];

  setColor('black');
  context.fRect(0,
          TOPSPACE * tilesz,
          canvas.width,
          canvas.height-TOPSPACE * tilesz);

  setColor(teal);
  context.fRect(0.5 * tilesz,
        startY,
        canvas.width - (tilesz),
        (randomizerText.length + themeText.length) * textHeight + tilesz);
  context.font = '' + tilesz + 'px Arial';
  setColor('black');

  startY += textHeight;
  context.textAlign = 'left';
  for (let i = 0; i < randomizerText.length; i++) {
    if (i === 0) {
      textOffset = 1 * tilesz;
    } else {
      textOffset = 2.5 * tilesz;
    }
    context.fillText(randomizerText[i],
        textOffset,
        startY + textHeight * (i));
  }
  startY += textHeight * (randomizerText.length);
  for (let i = 0; i < themeText.length; i++) {
    if (i === 0) {
      textOffset = 1 * tilesz;
    } else {
      textOffset = 2.5 * tilesz;
    }
    context.fillText(themeText[i],
        textOffset,
        startY + textHeight * (i));
  }

  startY += textHeight * themeText.length;
  drawButton(startY, SMALLBUTTON, returnColor, "Return");

  // highlight current settings
  // hardcoding in 1 bag and tropical
  startY = (TOPSPACE + 0.5) * tilesz;
  //very hacky
  var bagSizeMap = [4,1,2,0,0,0,0,3];
  drawRectangle(startY + bagSizeMap[bagSize]*textHeight + 0.4 *textHeight );
  var themeMap = [6,7];
  drawRectangle(startY + themeMap[theme]*textHeight + 0.4*textHeight );



}



function drawMainMenu() {
  var pad = tilesz *.5;
  setColor('black');
  context.fRect(0,
          TOPSPACE * tilesz,
          canvas.width,
          canvas.height-TOPSPACE * tilesz);

  var buttonSpacing = (BIGBUTTON + 0.5) * tilesz;
  var ELButtonY     = TOPSPACE * tilesz + pad;
  var MSButtonY     = ELButtonY + buttonSpacing;
  var DGButtonY     = MSButtonY + buttonSpacing; 
  var SettButtonY   = DGButtonY + buttonSpacing;

  context.globalAlpha = 1.0;
  drawButton(ELButtonY,BIGBUTTON, endlessColor, 'Play Endless');
  drawButton(MSButtonY,BIGBUTTON, missionsColor, 'Play Missions');
  drawButton(DGButtonY,BIGBUTTON, digColor, 'Play Dig');
  drawOutlinedButton(SettButtonY,SMALLBUTTON, settingsColor, 'Settings');

  //shade out things that haven't been developed yet  
  //shade out dig
  context.globalAlpha = 0.4;
  setColor('black');
  context.fRect(0.5 * tilesz,
      DGButtonY,
      canvas.width - (tilesz),
      BIGBUTTON * tilesz);
  //shade out settings
  //context.fRect(0.5 * tilesz,
   //   SettButtonY,
    //  canvas.width - (tilesz),
     // SMALLBUTTON * tilesz);
  context.globalAlpha = 1.0;
}

// --------------------------------------------------
// For Game Modes
var EL = 1 // play endless 
var MS = 2 // play missions

var gameMode = EL;

// --------------------------------------------------
// For Mission Mode

var currentMission = 0;

function toggleMissionMode() {
  if (gameMode !== MS) {
    gameMode = MS;
  } else {
    gameMode = EL;
  }
}

// --------------------------------------------------
// For Scoring
var combo = 0;
var bcombo = 0;

var numpieces = 0;

function initScores() {
  combo = 0;
  numpieces = 0;
}

function drawScoreBar() {
  setColor(topBarColor);
  context.fRect(0, 0,
    canvas.width,
    TOPSPACE*tilesz-1);
  //ctx.font = '' + tilesz + 'px Arial';
  setColor('black');
  context.textAlign = 'center';
  context.font = '' + tilesz + 'px Arial';
  if (gameMode === EL) {
    context.fillText('Combo: ' + combo + ' Best: ' + bcombo,
            canvas.width/2,
            TOPSPACE * tilesz / 1.5);
  } else if (gameMode === MS) {
    var readableMission = currentMission + 1;
    context.fillText('Combo: ' + combo + ' Mission: ' + readableMission,
            canvas.width/2,
            TOPSPACE * tilesz / 1.5);
  }
}

// --------------------------------------------------
// For Piece Preview
function updatePreview() {
  if (gameMode === EL) {
    if (bag.length < PREVIEW) {
      makeAndShuffleBag();
    }
  }

  drawPreview();
}

function drawPreview() {
  setColor('Black');
  context.fRect((sideBarX) * tilesz + 1,
    TOPSPACE * tilesz,
    RIGHTSPACE * tilesz,
    (BOARDHEIGHT - 4.1) * tilesz);
  for (let previewX = 0; previewX < Math.min(PREVIEW,bag.length); previewX++) {
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
  topBarColor = p[1];
  
  //Drawing these things here so that they have the color of the current piece
  drawBorders();
  drawScoreBar();
  return new Piece(p[0], p[1], blockNumber);
}

function nextPiece() {
  //numpieces++;//might be wrong here, testing
  if (bag.length > 0) {
    numpieces++;//might be wrong here, testing
    return newPieceDet(bag.pop());
  } else if (isPieceHeld) {
    isPieceHeld = 0;
    drawHold();
    return newPieceDet(heldPieceNumber);
  } else {
    if (gameMode === MS) {
      drawScoreBar();
      if (combo > 0) {
        recentWin = true;
        gameOver(WIN);
      } else {
        recentWin = false;
        gameOver(BADWIN);
      }
    }
  }

}
bagSize = 1;
function initRandomizer() {
  bag = [];

  makeAndShuffleBag();
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
    //if(!gdone) {
    if(gameScreen == INPLAY) {
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
        recentWin = false;
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
      recentWin = false;
      gameOver(LOSE);
    }
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
  if (gameScreen != INPLAY) {
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
  var y = evt.clientY;

  //if (gdone) {
  if (gameScreen === GAMEOVER) {
    interpretGameOverTap(y);
  }
  else if (gameScreen == MAINMENU) {
    interpretMainMenuTap(y);
  } 
  else if (gameScreen == SETTINGS) {
    interpretSettingsTap(y);
  } 
  else if (gameScreen == INPLAY) {
    if (x < wWidth / 2) {
      piece.rotate(3);
    } else {
      piece.rotate(1);
    }
  }
};


// the logic of taps / clicks performed on Settings screen
function interpretSettingsTap(y) {
  // this is going to be tough
  // layout of settings page is going to essentially be 
  // rewritten here.
  // Changing layout of settings page will require redoing
  // this whole function
  var textHeight = 1.5 * tilesz;
  // textOffset is 1*tilesz on header, 2.5*tilesz on item
  var textOffset = 0;
  var startY = (TOPSPACE + 0.5) * tilesz;
  var randomizerText = ['Randomizer:',
                        '1 Bag',
                        '2 Bag',
                        '7 Bag',
                        'Random'];
  var themeText = [ 'Theme:',
                    'Tropical'];
                   // 'Trans Flag'];

  var randomizerTextY = startY + textHeight;
  // each subsequent line is another textHeight away
  var themeTextY = randomizerTextY + randomizerText.length * textHeight;
  // each subsequent line is another textHeight away

  // I don't know where that extra .25 comes from?
  var MMButtonY = themeTextY + themeText.length * textHeight + .25 * textHeight;

  var bagSizeMap = [1,2,7,0];


  // need a draw selected settings function
  // need to interpret when a click is clicking a setting option
  //  and redraw settings to reflect selection
  //  also change the settings themselves
  // Start with bag size: will change bagSize and call initRandomizer()
  // initRandomizer() will need to be updated
  var tempY;

  if (y > MMButtonY && y < MMButtonY + SMALLBUTTON*tilesz) {
        drawMainMenu();
        gameScreen = MAINMENU;
  } else if ( y > randomizerTextY + .5*textHeight && y < randomizerTextY + 4.5*textHeight) {

    tempY = Math.floor((y - (randomizerTextY + .5*textHeight)) / (textHeight));

    //drawRectangle(randomizerTextY + (tempY * textHeight)  + (0.6 * tilesz));

    bagSize = bagSizeMap[tempY];
    initRandomizer();
    drawSettings();
  } else {
   // drawSettings();
   // drawRectangle(y);
    pass;
  } 
}

function drawRectangle(y) {

    context.globalAlpha = 1.0;
    context.beginPath();
    context.lineWidth = "2";
    context.strokeStyle = 'black';
    context.rect(tilesz, y, 
      canvas.width - 2*tilesz, 1.25* tilesz);
    context.stroke();
}



// the logic of taps / clicks performed on Main Menu screen
function interpretMainMenuTap(y) {
  var buttonSpacing = (BIGBUTTON + 0.5) * tilesz;
  var ELButtonY     = (TOPSPACE + 0.5) * tilesz ;
  var MSButtonY     = ELButtonY + buttonSpacing;
  var DGButtonY     = MSButtonY + buttonSpacing; 
  var SettButtonY   = DGButtonY + buttonSpacing;

  if ( y > ELButtonY && y < ELButtonY + BIGBUTTON*tilesz) {
    gameMode = EL; 
    reset();
  } else if (y > MSButtonY && y < MSButtonY + BIGBUTTON*tilesz) {
    gameMode = MS; 
    reset();
  } else if (y > DGButtonY && y < DGButtonY + BIGBUTTON*tilesz) {
    pass;
  } else if (y > SettButtonY && y < SettButtonY + SMALLBUTTON*tilesz) {
    gameScreen = SETTINGS;
    drawSettings();
  }
}

// the logic of taps / clicks performed on Game Over screen
function interpretGameOverTap(y) {
    //need to check which game mode it is in, as that determines
    //button layout on the game over screen
    // I should not be defining these twice and in this fashion
    // I need to better figure out how to share this information
    var buttonSpacing = (SMALLBUTTON + 0.5) * tilesz;

    // button layout is continue / replay / main menu
    // in the endless mode there is no replay button but the space is still there
    var continueY  = (TOPSPACE + 8) * tilesz;
    var replayY  = continueY + buttonSpacing;
    var returnY  = replayY + buttonSpacing;
  
    if (gameMode === EL) {
      if ( y > continueY && y < continueY + SMALLBUTTON*tilesz) {
        reset();
      } else if (y > returnY && y < returnY + SMALLBUTTON*tilesz) {
        drawMainMenu();
        gameScreen = MAINMENU;
      }

    } else if (gameMode === MS) {
      if (y > continueY && y < continueY + SMALLBUTTON*tilesz) {
        if (recentWin) {
          currentMission += 1;
          currentMission %= missions.length;
          reset();
        }
      } else if ( y > replayY && y < replayY + SMALLBUTTON*tilesz) {
        reset();
      }  else if (y > returnY && y < returnY + SMALLBUTTON*tilesz) {
        drawMainMenu();
        gameScreen = MAINMENU;
      }
    }
}


// --------------------------------------------------
function key(k) {
  if (k === 82) { // Player pressed r
    reset();
  }
  //mission navigation is prettty buggy right now
  if (k === 69) { // Player pressed e
    if (gameMode = MS) {
      //if (currentMission !== 0) {
        currentMission += missions.length - 1;
        currentMission %= missions.length;
     // } else {
     //   currentMission = missions.length;
     // }
      reset();
    }
  }
  if (k === 84) { // Player pressed t
    if (gameMode = MS) {
      currentMission += 1;
      currentMission %= missions.length;
      reset();
    }
  }
  if (k === 77) { // Player pressed m
    // toggle if missions are being played or not
    toggleMissionMode();
    reset();
  }

  
  //if (gdone) {
  if (gameScreen != INPLAY) {
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
  context.fillStyle = topBarColor;
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
  //if (!gdone) {
  if (gameScreen == INPLAY) {
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
  piece = null;
  initCanvas();
  initScores();
  initBoard();
  initSideBoard();
  if (gameMode === EL) {
    initRandomizer();
  } else {
    bag = missions[currentMission][0].slice().reverse();
    //bag = missions[1].reverse();
  }
  isPieceHeld = 0;
  done = false;
  gdone = false;
  recentWin = false;
  gameScreen = INPLAY;
  //drawMainMenu();
  //gameScreen = MAINMENU;
  dropStart = Date.now();
  piece = null;
  theme = TROPICAL;
}

function play() {
  initGame();
  drawBoard();
  main();
  drawMainMenu();
  gameScreen = MAINMENU;
}

