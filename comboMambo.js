var WALL = 1;
var BLOCK = 2;

var MOBILE = 0;
var DESKTOP = 1;

var theme;
var TROPICAL = 0;
var PASTEL = 1;

// --------------------------------------------------


document.getElementById('practice-btn').addEventListener('click', function() {
  hideMainMenuButtons();
  showComboAndBest();
  prepareToPlay();
  playMode(3);
});
document.getElementById('missions-btn').addEventListener('click', function() {
  hideMainMenuButtons();
  //showCanvas();
  showMissionsList();
  showBottomMainMenuBtn();
});
document.getElementById('challenge-btn').addEventListener('click', function() {
  hideMainMenuButtons();
  prepareToPlay();
  showComboAndBest();
  playMode(1);
});
document.getElementById('controls-btn').addEventListener('click', function() {
  hideMainMenuButtons();
  showBottomMainMenuBtn();
  showControlsPanel();
  // logic based on platform?
  hideAllControls();
  if (document.documentElement.clientWidth < 600) {
    showMobileControls();
  } else {
    showComputerControls();
  }
  //showCanvas();
});
document.getElementById('mobi-controls-btn').addEventListener('click', function() {
  hideAllControls();
  showMobileControls();
});
document.getElementById('comp-controls-btn').addEventListener('click', function() {
  hideAllControls();
  showComputerControls();
});
document.getElementById('settings-btn').addEventListener('click', function() {
  hideMainMenuButtons();
  showBottomMainMenuBtn();
  showSettingsScreen();
  //drawSettings();
});
document.getElementById('continue-btn').addEventListener('click', function(e) {
  removeResultsPageStuff();
  continuePlaying();
});
document.getElementById('cb-replay').addEventListener('click', function(e) {
  removeResultsPageStuff(); 
  replayMission();
});

function removeResultsPageStuff() {
  hideBottomMainMenuBtn();
  hideAndClearResultsCard();
  hideContinueBtns();
  hideCanvasOverlay();
};
document.getElementById('main-menu-btn').addEventListener('click', function() {
  goToMainMenu();
});

let missionBtns = document.getElementById('missions').children;
[...missionBtns].forEach(function(child) {
  child.addEventListener('click', missionBtnClickHandler);
});

function missionBtnClickHandler() {
  let number = this.value;
  showComboAndMission();
  hideMissionsList();
  prepareToPlay();
  playMode(MS, number-1);
}
function prepareToPlay() {
  showCanvas();
  showScoreBar();
  hideBottomMainMenuBtn();
}


function bagSettingListener() {
  bagSize = this.value;
  initRandomizer();
}
var rad = document.forms.settings.elements.bag;
for(var i = 0; i < rad.length; i++) {
  rad[i].addEventListener('click', bagSettingListener);
}


function hideAllControls() {
  document.getElementById("mobile-controls").hidden = true;
  document.getElementById("computer-controls").hidden = true;
  let className = 'selected';
  Array.from(document.querySelectorAll('.' + className)).forEach(function(el) {
    el.classList.remove(className);
  });
}
function showComputerControls() {
  document.getElementById("computer-controls").hidden = false;
  document.getElementById("comp-controls-btn").classList.add("selected");
}
function showMobileControls() {
  document.getElementById("mobile-controls").hidden = false;
  document.getElementById("mobi-controls-btn").classList.add("selected");
}


function hideCanvas() {
  document.getElementById('board').classList.add('dontShow');
}
function showCanvas() {
  document.getElementById('board').classList.remove('dontShow');
}
function hideCanvasOverlay() {
  document.getElementById('canvas-overlay').hidden = true;
}
function showCanvasOverlay() {
  document.getElementById('canvas-overlay').hidden = false;
}

function hideMainMenuButtons() {
  document.getElementById('homescreen-buttons').classList.add('dontShow');
}
function showMainMenuButtons() {
  document.getElementById('homescreen-buttons').classList.remove('dontShow');
}
function hideMissionsList() {
  document.getElementById('missions-list').hidden = true;
}
function showMissionsList() {
  document.getElementById('missions-list').hidden = false;
}
function hideContinueBtns() {
  document.getElementById('continue-buttons').classList.add('dontShow');
  document.getElementById('cb-replay').hidden = true;
}
function showContinueBtns() {
  document.getElementById('continue-buttons').classList.remove('dontShow');
}
function showReplayBtn() {
  document.getElementById('cb-replay').hidden = false;
}
function hideBottomMainMenuBtn() {
  document.getElementById('main-menu-bottom').classList.add('dontShow');
}
function showBottomMainMenuBtn() {
  document.getElementById('main-menu-bottom').classList.remove('dontShow');
}
function hideResultsCard() {
  document.getElementById('results-card').classList.add('dontShow');
}
function hideAndClearResultsCard() {
  document.getElementById('results-card').classList.add('dontShow');
  [...document.getElementById('results-card').children].forEach(function(child) {
    child.innerHTML = '';
  });
}
function showResultsCard() {
  document.getElementById('results-card').classList.remove('dontShow');
}
function hideControlsPanel() {
  document.getElementById('controls-panel').hidden = true;
}
function showControlsPanel() {
  document.getElementById('controls-panel').hidden = false;
}
function hideSettingsScreen() {
  document.getElementById('settings-screen').hidden = true;
}
function showSettingsScreen() {
  document.getElementById('settings-screen').hidden = false;
}
function hideScoreBar() {
  document.getElementById('score-bar-wrapper').classList.add('dontShow');
}
function showScoreBar() {
  document.getElementById('score-bar-wrapper').classList.remove('dontShow');
}
/*
function showTitle() {
  hideScoreBarElements();
  hideScoreBar();
  document.getElementById('sb-title').hidden = false;
}
*/
function showComboAndBest() {
  hideScoreBarElements();
  document.getElementById('sb-combo-count').hidden = false;
  document.getElementById('sb-best-combo').hidden = false;
}
function showComboAndMission() {
  hideScoreBarElements();
  document.getElementById('sb-combo-count').hidden = false;
  document.getElementById('sb-mission-number').hidden = false;
}
function hideScoreBarElements() {
  let scoreBar = document.getElementById('score-bar');
  [...scoreBar.children].forEach(function(child) {
    child.hidden = true;
  });
}
    


// --------------------------------------------------
/* old colors
var pieces = [
  [I, sky],
  [J, blueb],
  [L, peach],
  [O, cloud],
  [S, kiwi],
  [T, banana],
  [Z, dragon]
];
*/

/*
var pieces = [
  [I, cyan],
  [J, blue],
  [L, deor],
  [O, lime],
  [S, gree],
  [T, ambe],
  [Z, pink]
];
var pieces = [
  [I, '#2C9C80'],//teal
  [J, '#F3DE2C'],//bann
  [L, '#5C8001'],//cado
  [O, '#7CB518'],//granny
  [S, '#FB6107'],//oran
  [T, '#AA5090'],//lot
  [Z, '#FBB02D']
];
*/
var pieces = [
  [I, '#059BB2'],//teal
  [J, '#F75C18'],//bann
  [L, '#FEFFB3'],//cado
  [O, '#C9D31A'],//granny
  [S, '#669900'],//oran
  [T, '#F4D048'],//lot
  [Z, '#E70157']
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
var CBOARDWIDTH = 7;
var CBOARDHEIGHT = 5;
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

var missionWidth;
var missionFirstColX;



var fontSize;
var fontSizeSmall;

var SHORTBUTTON = 2
var TALLBUTTON   = 3;

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
  //document.getElementById('game-bg').style.width = parseInt(wHeight *.55) + 'px';
  console.log(wHeight);
  wWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  tilesz = parseInt(wHeight * BOARDPERCENT / BOARDHEIGHT);
  fontSize      = '' + tilesz + 'px Arial';
  fontSizeSmall = '' + tilesz * .6 + 'px Arial';
  thinLine = 0.0125;
  thickLine = 0.25;
  boardX = LEFTSPACE + 1 * thickLine;
  sideBarX = LEFTSPACE + BOARDWIDTH + 2 * thickLine;
  let cWidth = (sideBarX + RIGHTSPACE) * tilesz;
  let cHeight = (TOPSPACE + BOARDHEIGHT + BOTTOMSPACE) * tilesz;
  //canvas.width = (sideBarX + RIGHTSPACE) * tilesz;
  //canvas.height = (TOPSPACE + BOARDHEIGHT + BOTTOMSPACE) * tilesz;
  canvas.width = cWidth;
  canvas.height = cHeight;
  document.getElementById("canvas-overlay").style.width = cWidth;
  document.getElementById("canvas-overlay").style.height = cHeight;

  missionWidth = (canvas.width - 2*tilesz) / 3;
  missionFirstColX = .5 * tilesz;
}

function setColor(color) {
  context.fillStyle = color;
  /* not sure what this was for?
  if (color !== clear) {
    context.strokeStyle = 'black';
  } else {
    context.strokeStyle = 'dimGray';
  } 
  */
}
clear = '#111';


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
var BADWIN    = 2
var FINISHED  = 3
var recentWin = false;

var gameScreen;
var INPLAY    = 0;
var GAMEOVER  = 1;
var MAINMENU  = 2;
var MISSIONS  = 3;
var CONTROLS  = 4;
var SETTINGS  = 5;

function reset() {
  initGame();
  drawBoard();
  main();
  console.log('game reset');
}

function clearScreen() {
  setColor('#111');
  context.fRect(0,
          TOPSPACE * tilesz,
          canvas.width,
          canvas.height-TOPSPACE * tilesz);
}

function addToResultsCard(message) {
  let div = document.createElement('div');
  div.innerHTML = message;
  document.getElementById('results-card').appendChild(div);
}
function setResultsTitle(title) {
  document.getElementById('rs-title').innerHTML = title;
}
function setResultsCombo(val) {
  let inner = 'Combo: <span>' + val + '</span>';
  document.getElementById('rs-combo').hidden = false;
  document.getElementById('rs-combo').innerHTML = inner;
}
function setResultsBestCombo(val) {
  let inner = 'Best Combo: <span>' + val + '</span>';
  document.getElementById('rs-best-combo').hidden = false;
  document.getElementById('rs-best-combo').innerHTML = inner;
}
function setResultsPieces(val) {
  let inner = 'Pieces: <span>' + val + '</span>';
  document.getElementById('rs-pieces').hidden = false;
  document.getElementById('rs-pieces').innerHTML = inner;
}
function setResultsScore(val) {
  let inner = 'Score: <span>' + val + '</span>';
  document.getElementById('rs-score').hidden = false;
  document.getElementById('rs-score').innerHTML = inner;
}
function setResultsRank(val) {
  let inner = 'Rank: <span>' + val + '</span>';
  document.getElementById('rs-rank').hidden = false;
  document.getElementById('rs-rank').innerHTML = inner;
}

function gameOver(result) {
  document.activeElement.blur();
  showCanvasOverlay();
  showResultsCard();
  gameScreen = GAMEOVER;
  let resCard = document.getElementById('results-card');
  switch (result) {
    case WIN:
      setResultsTitle('You Won');
      break;
    case LOSE:
      setResultsTitle('Game Over');
      break;
    case BADWIN:
      setResultsTitle('Try Again');
      break;
    case FINISHED:
      setResultsTitle('Finished');
      break;
  }
  
  switch (gameMode) {
    case CH:
      let score = Math.floor(((combo / numpieces) * 1000.));
      setResultsCombo(combo);
      setResultsPieces(numpieces);
      setResultsScore(score);
      break;
    case MS:
      let rank = calculateRank(result);
      setResultsCombo(combo);
      setResultsRank(rank);
      updateMissionRank(currentMission, rank);
      if(result === WIN) { 
        missionsRecord[currentMission] = rank;
      }
      break;
    case PP:
      setResultsBestCombo(allTimeBestCombo);
      setResultsPieces(numpieces);
      break;
  }

  drawContinueOptions(result);
}

function updateMissionRank(mission, rank) {
  let msn = document.getElementById('missions').children[mission];
  if (isBetterRank(rank, msn.getAttribute('data-rank'))) {
    msn.setAttribute('data-rank', rank);
    msn.innerHTML = msn.value + ':  ' + rank;
    if (rank !== 'D') {
      enableNextMission(mission);
    }
  }
}
function enableNextMission(mission) {
  let msns = document.getElementById('missions').children;
  if (mission < msns.length) {
    msns[mission + 1].disabled = false;
  }
}

function isBetterRank(r1, r2) {
  let ranks = ['D', 'C', 'B', 'A'];
  if (ranks.indexOf(r1) > ranks.indexOf(r2)) {
    return true;
  } else {
    return false;
  }
}

// On the game over summary screen there are buttons
// to play again or go to main menu
// Mission mode should also have a play next mission option
function drawContinueOptions(result) {
  showContinueBtns();
  showBottomMainMenuBtn();

  document.getElementById('continue-btn').disabled = false;
  var continueText = "Play Again";
  var replayText = "Replay Mission";
  var mainmenuText = "Main Menu";
  if (gameMode === MS) {
    continueText = "Next Mission";
    showReplayBtn();
    if ( result !== WIN ) {
      // maybe do logic check to see if it the next msn is disabled
      document.getElementById('continue-btn').disabled = true;
    }
  }

  document.getElementById('continue-btn').innerHTML = continueText;
}

// In missions mode, every attempt gets a grade
function calculateRank(result) {
  let rank = '';
  let gotMaxCombo = false;
  let gotAllClear = false;
  let msn = currentMission;

  switch (result) {
    case LOSE:
      rank = ' ';
      break;
    case BADWIN:
      rank = 'D';
      break;
    case WIN:
      rank = 'C';
      let maxCombo = missions[msn][1][0];
      gotMaxCombo = combo === maxCombo ? true : false;
      let allClearPossible = missions[msn][1][1];
      if (!allClearPossible) {
        rank = gotMaxCombo ? 'A' : 'B';
      } else {
        gotAllClear = isAllClear();
        if (gotAllClear && gotMaxCombo) {
          rank = 'A';
        } else if (gotAllClear || gotMaxCombo) {
          rank = 'B';
        }
      }
      break;
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

function replayMission() {
  reset();
}

function playMode(mode, mission) {
  currentMission = mission;
  gameMode = mode;
  reset();
}

function continuePlaying() {
  if ( gameMode === CH || gameMode === PP ) {
    reset();
  } else if ( gameMode === MS ) {
    currentMission += 1;
    currentMission %= missions.length;
    reset();
  }
}

function hideNonMainMenuThings() {
  hideBottomMainMenuBtn();
  hideSettingsScreen();
  hideAndClearResultsCard();
  hideContinueBtns();
  hideMissionsList();
  hideControlsPanel();
  hideScoreBar();
  hideCanvas();
  hideCanvasOverlay();
}
function goToMainMenu() {
  gameScreen = MAINMENU;
  hideNonMainMenuThings();
  showMainMenuButtons();

  //old, with different handling of canvases, this might not be needed
  clearScreen();
  context.globalAlpha = 1.0;
}

// --------------------------------------------------
// For Game Modes
const CH = 1 // play endless 
const MS = 2 // play missions
const PP = 3 // play practice

let gameMode = CH;

// --------------------------------------------------
// For Mission Mode

let currentMission = 0;

// --------------------------------------------------
// For Scoring
let combo = 0;
let allTimeBestCombo = 0;
let localBestCombo = 0;

let numpieces = 0;

function initScores() {
  combo = 0;
  localBestCombo = 0;
  numpieces = 0;
}

function updateComboCount(combo) {
  document.getElementById('sb-combo-count').innerHTML = 'Combo: ' + combo;
}
function updateBestCombo(combo) {
  document.getElementById('sb-best-combo').innerHTML = 'Best: ' + combo;
}
function updateMissionNumber(mission) {
  document.getElementById('sb-mission-number').innerHTML = 'Mission: ' + mission;
}

function drawStatusBar() {
  updateComboCount(combo);
  updateBestCombo(allTimeBestCombo);
  updateMissionNumber(currentMission + 1);
}

// --------------------------------------------------
// For Piece Preview
function updatePreview() {
  if (gameMode === CH) {
    if (bag.length < PREVIEW) {
      makeAndShuffleBag();
    }
  } else if (gameMode === PP) {
    if (bag.length < PREVIEW && numpieces < 42) {
      makeAndShuffleBag();
    }
  }

  drawPreview();
}

function drawPreview() {
  setColor('#111');
  context.fRect((sideBarX) * tilesz + 1,
    TOPSPACE * tilesz,
    RIGHTSPACE * tilesz,
    (BOARDHEIGHT - 4.1) * tilesz);
  for (let previewX = 0; previewX < Math.min(PREVIEW,bag.length); previewX++) {
    let nextToComeNumber = bag[bag.length - (1 + previewX)];
    drawPiecePreview(nextToComeNumber, previewX);
  }
}

function drawPiecePreview(pn, startX) {
  let piece = pieces[pn];
  setColor(piece[1]);
  var size = piece[0][0].length;
  let adjustments = getPreviewAdjustments(pn);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (piece[0][0][y][x] !== 0) {
        // draw preview to the right
        drawSquare(sideBarX + x + adjustments[0],
          TOPSPACE + y + adjustments[1] + 3 * startX);
      }
    }
  }
}

function getPreviewAdjustments(pn) {
  let wAdj = 1;
  let hAdj = 0.5;
  switch (pn) {
    case 0:
      wAdj = 0.5;
      hAdj = -1;
      break;
    case 3:
      wAdj = 0.5;
      hAdj = -0.5;
      break;
    case 4:
      hAdj = -0.5;
      break;
    case 6:
      hAdj = -0.5;
      break;
  }
  return [wAdj, hAdj];
}

// --------------------------------------------------
// For Randomizer
let bagSize = 1; // this should change based on what randomizer is chosen
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
  
  //Drawing these things here so that they have the color of the current piece
  drawBorders(p[1]);
  drawStatusBar();
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
    ranOutOfPieces();
    /*
    if (gameMode === MS) {
      drawStatusBar();
      if (combo > 0) {
        recentWin = true;
        gameOver(WIN);
      } else {
        recentWin = false;
        gameOver(BADWIN);
      }
    } else if (gameMode === PP) {
      drawStatusBar();
      gameOver(FINISHED);
    }
    */
  }
}
function ranOutOfPieces() {
  switch (gameMode) {
    case MS:
      drawStatusBar();
      if (combo > 0) {
        recentWin = true;
        gameOver(WIN);
      } else {
        recentWin = false;
        gameOver(BADWIN);
      }
      break;
    case PP:
      drawStatusBar();
      gameOver(FINISHED);
      break;
  }
}

function initRandomizer() {
  bag = [];
  makeAndShuffleBag();
}

function initBoard(rows,cols) {
  var board = [];
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = ['', -1];
    }
  }
  return board;
}

function holdPiece() {
  if (!piece.recentlyHeld) {
    if (!isPieceHeld) { // ie no piece held
      isPieceHeld = true;
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
  setColor('#111');
  context.fRect(sideBarX * tilesz + 1,
    (TOPSPACE + BOARDHEIGHT - 3) * tilesz,
    RIGHTSPACE * tilesz,
    4.5 * tilesz);
  if (isPieceHeld) {
    setColor(heldPiece[1]);
    var size = heldPiece[0][0].length;
    let adjs = getHoldAdjustments(heldPieceNumber);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (heldPiece[0][0][y][x] !== 0) {
          drawSquare(sideBarX + x + adjs[0],
            TOPSPACE + y + BOARDHEIGHT + adjs[1]);
        }
      }
    }
  }
}

function getHoldAdjustments(pn) {
  let wAdj = 1;
  let hAdj = 1 - 3;
  switch (pn) {
    case 0:
      wAdj = 0.5;
      hAdj = -0.5 - 3.5;
      break;
    case 3:
      wAdj = 0.5;
      hAdj -= 1;
      break;
    case 4:
      hAdj -= 1;
      break;
    case 6:
      hAdj -= 1;
      break;
  }
  return [wAdj, hAdj];
}

function drawSquare(x, y) {
  context.fRect(x * tilesz, y * tilesz, tilesz, tilesz);
}


// --------------------------------------------------
// Defining the Piece object
function Piece(patterns, color, shapeNumber, startY) {

  if (typeof startY === 'undefined') {
    startY = -4;
  }

  this.pattern = patterns[0];
  this.patterns = patterns;
  this.patterni = 0;
  this.recentlyHeld = 0;
  this.number = shapeNumber;

  this.color = color;
  var centerX = (BOARDWIDTH % 2 === 0 ) ? 
    BOARDWIDTH / 2 :
    ( BOARDWIDTH + 1 ) / 2;
  this.x = centerX - parseInt(Math.ceil(this.pattern.length / 2), 10);
  this.y = startY;
  this.ghosty;
}

Piece.prototype.heldRecently = function () {
  this.recentlyHeld = 1;
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
    //  if (gameScreen === INPLAY) {
      if (y >= BOARDHEIGHT || x < 0 || x >= BOARDWIDTH) {
        return WALL;
      }
      // following else if's were just if's before

      else if (y < 0) {
        // Ignore negative space rows
        continue;
      }

      else if (board[y][x][0] !== '') {
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

      // piece over the top of the screen
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
    if (combo > localBestCombo) {
      localBestCombo = combo;
    }
    if (localBestCombo > allTimeBestCombo) {
      allTimeBestCombo = localBestCombo;
    }
    

    //drawStatusBar();
    drawBoard();
  } else { // no lines were cleared
    if (combo > 0 && gameMode !== PP) { // but we were in the middle of combo
      recentWin = false;
      gameOver(LOSE);
    }
    combo = 0;
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
  if (gameScreen === CONTROLS) {
    return;
  }
  context.globalAlpha = 0.5;
  this._fillGhost(this.color);
  context.globalAlpha = 1.0;
};

Piece.prototype.undrawGhost = function () {
  if (gameScreen === CONTROLS) {
    return;
  }
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
  if (gameScreen != INPLAY && gameScreen != CONTROLS) {
    return;
  }
  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) { //checks if horizontal swipe
    if (xDiff > 0) { // left swipe
      piece.moveLeft(); 
    } else { // right swipe
      piece.moveRight();
    }
  } else {
    if (yDiff > 0) { // up swipe
      holdPiece();
    } else { // down swipe
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
  let x = evt.offsetX;
  let cx = evt.clientX;
  let y = evt.offsetY; 
  if (evt.target.nodeName === 'BUTTON' ) {
    console.log('aborting');
    return; // button press clicks handled independently, abort
  }

  if (gameScreen === INPLAY || gameScreen === CONTROLS) {
    console.log('offsetX: '+x+ ' offsetY: '+y);
    console.log('clientX: ' + cx);
    console.log(wWidth);
    if (cx < wWidth / 2) {
      piece.rotate(3);
      console.log('rotated, tap 3, cx: ' + cx);
    } else {
      piece.rotate(1);
      console.log('rotated, tap 1, cx: ' + cx);
    }
  }
};


// --------------------------------------------------
function key(k) {
  if (k === 32) {
    console.log('space is pressed');
  }
  //if (gdone) {
  if (gameScreen == CONTROLS) {
    switch (k) {
      case 38: // Player pressed up
        piece.rotate(3);
        dropStart = Date.now();
        break;
      case 37: // Player holding left
        piece.moveLeft();
        break;
      case 39: // Player holding right
        piece.moveRight();
        break;
      case 83: // Player pressed s
        piece.rotate(3);
        dropStart = Date.now();
        break;
      case 68: // Player pressed d
        piece.rotate(1);
        dropStart = Date.now();
        break;
    }
  } else if (gameScreen == INPLAY) {
    switch (k) {
      case 38: // Player pressed up
        piece.rotate(3);
        dropStart = Date.now();
        break;
      case 37: // Player holding left
        piece.moveLeft();
        break;
      case 39: // Player holding right
        piece.moveRight();
        break;
      case 83: // Player pressed s
        piece.rotate(3);
        dropStart = Date.now();
        break;
      case 68: // Player pressed d
        piece.rotate(1);
        dropStart = Date.now();
        break;
      case 40: // Player holding down
        piece.rotate(1);
        dropStart = Date.now();
        break;
      case 65: // Player pressed a
        holdPiece();
        break;
      case 70: // Player pressed f
        piece.rotate(2);
        dropStart = Date.now();
        break;
      case 32: // Player pressed space
        while (piece.down() === 0) {
          continue;
        }
        break;
      case 82: // Player pressed r
        hideBottomMainMenuBtn();
        hideAndClearResultsCard();
        hideContinueBtns();
        reset();
        break;
      case 81: // Player pressed q
        goToMainMenu();
        break;
    }
  } else if (gameScreen == GAMEOVER) {
    switch (k) {
      case 82: // Player pressed r
        hideBottomMainMenuBtn();
        hideAndClearResultsCard();
        hideContinueBtns();
        reset();
        break;
    }
  } else {
    return;
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

function drawBorders(color) {
  context.fillStyle = color;

  // draw divider between previews and hold
  context.fRect((sideBarX + 0.5) * tilesz,
    (TOPSPACE + BOARDHEIGHT - 3.5) * tilesz,
    (RIGHTSPACE - 1) * tilesz,
    thickLine * tilesz);

  // make boundry around game board
  context.fRect(LEFTSPACE * tilesz -1,
    TOPSPACE * tilesz,
    (sideBarX - LEFTSPACE) * tilesz,
    (BOARDHEIGHT + thickLine) * tilesz - 1);

  drawBoard();

};

function initSideBoard() {
  // draw all canvas black
  setColor('#111');
  context.fRect(0, 0,
    canvas.width,
    canvas.height);
  
  drawBorders( '#059BB2' );
  //drawStatusBar();
  // line seperating preview from hold
  //context.fillStyle = '#99D3DF';
}

function main() {
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
  BOARDWIDTH = 4;// get's changed in initControls, don't like it
  boardX = LEFTSPACE + 1 * thickLine; // get's changed in initControls
  //initCanvas();
  initScores();

  board = initBoard(BOARDHEIGHT, BOARDWIDTH);
  initSideBoard();
  if (gameMode !== MS) {
    initRandomizer();
  } else {
    bag = missions[currentMission][0].slice().reverse();
    //bag = missions[1].reverse();
  }
  isPieceHeld = false;
  done = false;
  gdone = false;
  recentWin = false;
  gameScreen = INPLAY;
  dropStart = Date.now();
  piece = null;
  theme = TROPICAL;
}

function play() {
  initCanvas();
  initGame();
  drawBoard();
  main();
  gameScreen = MAINMENU;
}

