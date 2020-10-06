var WALL = 1;
var BLOCK = 2;

var MOBILE = 0;
var DESKTOP = 1;

// global button list 
var buttons = [];
var radioLists = [];

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

darkAmbe = '#997300';

topBarColor = teal;
resultsColor = teal;
cardColor = teal;
continueColor = cyan;
replayColor = lime;
returnColor = blue;
mainmenuColor = blue;

endlessColor = cyan;
missionsColor = ambe;
missionsUnavailableColor = darkAmbe;
practiceColor = deor;
settingsColor = pink;
controlsColor = gree;




var theme;
var TROPICAL = 0;
var TRANS = 1;


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
var wideButton;
var wideButtonX;
var halfButton;
var halfButtonFarX;

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
  wWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  tilesz = parseInt(wHeight * BOARDPERCENT / BOARDHEIGHT);
  fontSize      = '' + tilesz + 'px Arial';
  fontSizeSmall = '' + tilesz * .6 + 'px Arial';
  thinLine = 0.0125;
  thickLine = 0.25;
  boardX = LEFTSPACE + 1 * thickLine;
  sideBarX = LEFTSPACE + BOARDWIDTH + 2 * thickLine;
  canvas.width = (sideBarX + RIGHTSPACE) * tilesz;
  canvas.height = (TOPSPACE + BOARDHEIGHT + BOTTOMSPACE) * tilesz;
  wideButton = canvas.width - tilesz;
  wideButtonX = .5 * tilesz;
  halfButton = (canvas.width - tilesz) / 2;
  halfButtonFarX = canvas.width/2;

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
  buttons = [];
  initGame();
  drawBoard();
  main();
}

function clearScreen() {
  setColor('black');
  context.fRect(0,
          TOPSPACE * tilesz,
          canvas.width,
          canvas.height-TOPSPACE * tilesz);
}

function gameOver(result) {
  var message = '';
  var rank = '';
  var replayOffset = 2;
  gameScreen = GAMEOVER;

  if (result === WIN) {
    message = 'You Won'
  } else if (result === LOSE) {
    message = 'Game Over';
  } else if (result === BADWIN) {
    message = 'Try Again';
  } else if (result === FINISHED) {
    message = 'Finished'
  }
  context.globalAlpha = 0.6;
  clearScreen();

  setColor(resultsColor);
  context.globalAlpha = 1;

  // draw results card background
  context.fRect(0.5 * tilesz,
        (TOPSPACE + 0.5) * tilesz,
        canvas.width - (tilesz),
        7 * tilesz);

  // write results
  context.font = fontSize;
  setColor('black');
  context.textAlign = 'center';
  context.fillText(message,
        canvas.width / 2,
        (TOPSPACE + 2) * tilesz);
  context.textAlign = 'left';
  if (gameMode === CH) {
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
  } else if (gameMode === PP) {
    context.fillText('Best Combo: ' + allTimeBestCombo,
        1 * tilesz,
        (TOPSPACE + 4) * tilesz);
    rank = calculateRank(result);
    context.fillText('Pieces: '+ numpieces,
        1 * tilesz,
        (TOPSPACE + 6) * tilesz);
  }

  if(result === WIN && gameMode === MS) { 
    missionsRecord[currentMission] = rank;
  }

  drawContinueOptions(result);
}

// On the game over summary screen there are buttons
// to play again or go to main menu
// Mission mode should also have a play next mission option

function drawContinueOptions(result) {
  var buttonSpacing = (SHORTBUTTON + 0.5) * tilesz;

  var continueStart = (TOPSPACE + 8) * tilesz;
  var replayStart   = continueStart + buttonSpacing;
  var mainmenuStart   = replayStart + buttonSpacing;

  var continueText = "Play Again";
  var replayText = "Replay Mission";
  var mainmenuText = "Main Menu";
  if (gameMode === MS) {
    continueText = "Play Next Mission";
  }

  //continue button
  if ( gameMode !== MS || result === WIN ) {
  buttons.push(new Button(wideButtonX,
    continueStart,
    wideButton,
    SHORTBUTTON,
    continueText,
    continueColor,
    function() {
      continuePlaying();
    }));
  } else {
    // draw 'fake' button with no functionality
    drawButton(wideButtonX,continueStart,
      wideButton,
      SHORTBUTTON,
      continueColor, 
      continueText,
      true,
      true);
    //shade out continue button  
    context.globalAlpha = 0.4;
    setColor('black');
    context.fRect(0.5 * tilesz,
      continueStart,
      canvas.width - (tilesz),
      SHORTBUTTON * tilesz);
    context.globalAlpha = 1;
  }

  //replay button
  if (gameMode === MS) {
    buttons.push(new Button(wideButtonX,
      replayStart,
      wideButton,
      SHORTBUTTON,
      replayText,
      replayColor,
      function() {
        replayMission();
      }));
  }

  //main menu button
  drawMainMenuButton(mainmenuStart,false);
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

function scoreBarMessage( message ) {
  setColor(topBarColor);
  context.fRect(0, 0,
    canvas.width,
    TOPSPACE*tilesz-1);
  //ctx.font = fontSize;
  setColor('black');
  context.textAlign = 'center';
  context.font = fontSize;
  context.fillText(message,
    canvas.width/2,
    TOPSPACE * tilesz / 1.5);
}

function drawControls(platform) {

  var sButtonSpacing = (SHORTBUTTON + 0.5) * tilesz;

  var textHeight = 1 * tilesz;
  var textOffset = 0;
  var startY = (TOPSPACE + 0.5) * tilesz;
  var basAText = [['Swipe Left:',
                   'Swipe Right:',
                   'Tap Left of Center:',
                   'Tap Right of Center:'],
                  ['Left Arrow:',
                   'Right Arrow:',
                   '"S" or Up Arrow:',
                   '"D" Key:']];
  var basRText = ['slide left',
                  'slide right',
                  'rotate left',
                  'rotate right'];
  var advAText = [[ 'Swipe Up:',
                    'Swipe Down:'],
                  [ '"A" Key:',
                    'Space Button:']];
  var advRText = ['store piece',
                  'drop piece'];
  var platformsList = [ 'Mobile',
                        'Computer'];

  scoreBarMessage('Controls: ' + platformsList[platform]);



  // clear the board 
  clearScreen();

  // draw  controls card
  setColor(cardColor);
  roundRect(context,
    0.5 * tilesz,
    startY,
    canvas.width - (tilesz),
    (basAText[platform].length + 7) * textHeight + tilesz*.6,
    0,
    true,
    false);
  context.font = fontSizeSmall;

  setColor('black');
  
  // draw piece window
  roundRect(context,
    (.7) * tilesz,
    startY+ 5*textHeight,
    (9.1)*tilesz,
    4*tilesz,
    0,
    true,
    false);

  // write basic controls
  startY += textHeight;
  for (let i = 0; i < basAText[platform].length; i++) {
    textOffset = 1 * tilesz;
    context.textAlign = 'left';
    context.fillText(basAText[platform][i],
        textOffset,
        startY + textHeight * (i));
    context.textAlign = 'right';
    context.fillText(basRText[i],
        canvas.width - textOffset,
        startY + textHeight * (i));
  }

  startY += (basAText[platform].length ) * textHeight + tilesz*4,

  setColor('black');
  var platformToggleX = startY + (advAText[platform].length ) * textHeight + tilesz*.6;

  // write advanced controls
  startY += textHeight;
  for (let i = 0; i < advAText[platform].length; i++) {
    textOffset = 1 * tilesz;
    context.textAlign = 'left';
    context.fillText(advAText[platform][i],
        textOffset,
        startY + textHeight * (i));
    context.textAlign = 'right';
    context.fillText(advRText[i],
        canvas.width - textOffset,
        startY + textHeight * (i));
  }

  initControlsTest();

  var mobileActive = (platform === MOBILE) ? true : false;
  buttons.push(new Button(wideButtonX,
    platformToggleX,
    halfButton,
    SHORTBUTTON * .6,
    platformsList[0],
    cardColor,
    function() {
      gotoScreen(CONTROLS, MOBILE);
    },
    mobileActive,
    false));

  buttons.push(new Button(halfButtonFarX,
    platformToggleX,
    halfButton,
    SHORTBUTTON * .6,
    platformsList[1],
    cardColor,
    function() {
      gotoScreen(CONTROLS, DESKTOP);
    },
    !mobileActive,
    false));

  startY = canvas.height - sButtonSpacing;
  drawMainMenuButton(startY);

}

function drawSettings() {

  var sButtonSpacing = (SHORTBUTTON + 0.5) * tilesz;

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

  scoreBarMessage('Settings');
  clearScreen();

  setColor(cardColor);
  context.fRect(0.5 * tilesz,
        startY,
        canvas.width - (tilesz),
        (randomizerText.length + themeText.length) * textHeight + tilesz);
  context.font = fontSize;
  setColor('black');

  startY += textHeight;

  //very hacky
  var bagSizeToSelection = [4,1,2,0,0,0,0,3];
  radioLists.push(new RadioList(tilesz,
    startY,
    canvas.width - (2 * tilesz),
    textHeight,
    randomizerText,
    function() {
      var selectionToBagSize = [1,2,7,0];
      bagSize = selectionToBagSize[this.selection-1];
      initRandomizer();
      console.log('bag size: '+ bagSize);
    },
    true,
    bagSizeToSelection[bagSize]));
  
  startY += textHeight * (randomizerText.length);


  radioLists.push(new RadioList(tilesz,
    startY,
    canvas.width - (tilesz),
    textHeight,
    themeText,
    function() {
     // 
    },
    true,
    1));

  startY = canvas.height - sButtonSpacing;
  drawMainMenuButton(startY);

}

function clearButtons() {
  buttons = [];
  
}

function startEndless() {
  gameMode = CH; 
  reset();
}

function startMissions() {
  gameMode = MS; 
  reset();
}

function startPractice() {
  gameMode = PP; 
  reset();
}

function replayMission() {
  reset();
}

function playMode(mode, mission) {
  radioLists = [];
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

function nextMission() {
  if (recentWin) {
    currentMission += 1;
    currentMission %= missions.length;
    reset();
  }
}

function gotoScreen(screen, platform) {
  if (typeof platform === 'undefined') {
    platform = MOBILE;
  }
  radioLists = [];
  gameScreen = screen;
  if (screen === SETTINGS ) {
    drawSettings();
  } else if (screen === MAINMENU) {
    drawMainMenu();
  } else if (screen === MISSIONS) {
    drawMissionsMenu();
  } else if (screen === CONTROLS) {
    drawControls(platform);
  }
}


function drawMainMenu() {
  var pad = tilesz *.5;
  clearScreen();

  var bButtonSpacing = (TALLBUTTON + 0.5) * tilesz;
  var sButtonSpacing = (SHORTBUTTON + 0.5) * tilesz;

  var menuStart = TOPSPACE * tilesz + pad;
  var PPButtonY = menuStart;
  var MSButtonY = menuStart + bButtonSpacing;
  var CHButtonY = menuStart + bButtonSpacing * 2;  

  var menuBottom      = canvas.height - 0.5 * tilesz;
  var SettButtonY     = menuBottom - sButtonSpacing;
  var ControlButtonY  = menuBottom - sButtonSpacing * 2;

  context.globalAlpha = 1.0;


  // play practice button
  buttons.push(new Button(wideButtonX,
    PPButtonY, 
    wideButton,
    TALLBUTTON,
    '49 Piece Practice',
    practiceColor, 
    function() {
      playMode(PP);
    }));

  // missions mode button
  buttons.push(new Button(wideButtonX,
    MSButtonY, 
    wideButton,
    TALLBUTTON,
    'Missions Mode',
    missionsColor, 
    function() {
      gotoScreen(MISSIONS);
    }));

  // challenge mode button
  buttons.push(new Button(wideButtonX,
    CHButtonY,
    wideButton,
    TALLBUTTON,
    'Challenge Mode',
    endlessColor,
    function() {
      playMode(CH)
    }));

  //go to controls button
  buttons.push(new Button(wideButtonX,
    ControlButtonY, 
    wideButton,
    SHORTBUTTON,
    'Controls',
    controlsColor, 
    function() {
      gotoScreen(CONTROLS, MOBILE);
    },
    false));

  // go to settings button
  buttons.push(new Button(wideButtonX,
    SettButtonY, 
    wideButton,
    SHORTBUTTON,
    'Settings',
    settingsColor, 
    function() {
      gotoScreen(SETTINGS);
    },
    false));


}

function drawMissionsMenu() {
  clearScreen();

  var sButtonSpacing = (SHORTBUTTON + 0.5) * tilesz;
  var startY = (TOPSPACE + .5) * tilesz;

  for (let i = 0; i < missions.length; i++) {
    var missionX = missionFirstColX + (.5 * tilesz + missionWidth)*(i % 3);
    var missionY = startY + ( Math.floor(i/3) )*sButtonSpacing;
    var mNum = i+1;
    var mRec = missionsRecord[i];
    if (mRec === 'F') {
      mRec = ' ';
    }
    var mColor = missionsRecord[i-1] !== 'F' ? 
      missionsColor :
      missionsUnavailableColor;
    buttons.push(new Button(missionX,
      missionY, 
      missionWidth,
      SHORTBUTTON,
      mNum+": "+mRec,
      mColor, 
      function() {
        if (i === 0) {
          playMode(MS,i);
        } else if (missionsRecord[i-1] !== 'F') {
          playMode(MS,i);
        } else {
          gotoScreen(MISSIONS);
        }
      }));

  }


  startY = canvas.height - sButtonSpacing;
  drawMainMenuButton(startY);

}





// --------------------------------------------------
// For Game Modes
var CH = 1 // play endless 
var MS = 2 // play missions
var PP = 3 // play practice

var gameMode = CH;

// --------------------------------------------------
// For Mission Mode

var currentMission = 0;

// exists for testing
function toggleMissionMode() {
  if (gameMode !== MS) {
    gameMode = MS;
  } else {
    gameMode = CH;
  }
}

// --------------------------------------------------
// For Scoring
var combo = 0;
var allTimeBestCombo = 0;
var localBestCombo = 0;

var numpieces = 0;

function initScores() {
  combo = 0;
  localBestCombo = 0;
  numpieces = 0;
}

function drawStatusBar() {
  setColor(topBarColor);
  context.fRect(0, 0,
    canvas.width,
    TOPSPACE*tilesz-1);
  //ctx.font = fontSize;
  setColor('black');
  context.textAlign = 'center';
  context.font = fontSize;
  if (gameMode === CH ) {
    context.fillText(
      'Combo: ' + combo + ' Best: ' + allTimeBestCombo,
      canvas.width/2,
      TOPSPACE * tilesz / 1.5);
  } else if (gameMode === PP) {
    context.fillText(
      'Combo: ' + combo + ' Best: ' + localBestCombo,
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
  }
}

bagSize = 1;
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
// Defining the Button prototype

var Button = function(x, y, width, height, text, color, fn, filled, rounded) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = text;
  this.color = color;
  //this.img = new Image();
  //this.img.src = imgurl;
  this.fn = fn; //pass the button's click function

  drawButton(this.x, this.y, this.width, height, this.color, this.text, filled, rounded);
//  this.draw();
};

Button.prototype.mouse_down = function(mouseX, mouseY) {
//y > CHButtonY && y < CHButtonY + TALLBUTTON*tilesz
//  var hit = ( mouseX > canvas.width / 2 ) ? true : false;
  var hit = ( mouseY > this.y && 
    mouseY < this.y + this.height*tilesz &&
    mouseX > this.x &&
    mouseX < this.x + this.width
        ) ? true : false;
  if (hit == true) {
    console.log(this.text + ' button pressed');
    clearButtons();
    drawStatusBar();
    this.fn(); //run the button's function
  }
  return hit;
};

// this draws a rectangle with text
function drawButton(  x,y,
                      width,
                      height,
                      color,
                      text,
                      filled,
                      rounded) {

  if (typeof filled === 'undefined') {
    filled = true;
  }
  if (typeof rounded === 'undefined') {
    rounded = true;
  }
  
  var radius = rounded ? tilesz / 3 : 0;

  // make black rectangle (done to add opacity)
  // invisible for filled buttons 
  context.globalAlpha = .5;
  setColor('black');
  roundRect(context,
    x,
    y,
    width,
    height * tilesz,
    radius,
    true,
    true);

  //draw button's rectangle
  setColor(color);
  context.globalAlpha = 1;
  context.strokeStyle = color;
  context.lineWidth = 2;
  roundRect(context,
    x,
    y,
    width,
    height * tilesz,
    radius,
    filled,
    !filled);

  if (filled) {
    // text color
    setColor('black');

  } else {
    // text color
    setColor(color);
  }

  //write button text
  context.font = fontSize;
  context.textAlign = 'center';
  context.fillText(text,
    width / 2 + x,
    y + (height / 2 + .25)*tilesz);
  setColor('black');
  context.strokeStyle = 'black';
  context.lineWidth = "2";

}

function drawMainMenuButton(y, filled) {
  if (typeof filled === 'undefined') {
    rounded = false;
  }

  buttons.push(new Button(wideButtonX,
    y,
    wideButton,
    SHORTBUTTON,
    "Main Menu",
    mainmenuColor,
    function() {
      gotoScreen(MAINMENU);
    },
    filled));
}



// --------------------------------------------------
// Defining the Radio Button List prototype

var RadioList = function(x, y, width, lineHeight, options, fn, titled, selectedOption) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.lineHeight = lineHeight;
  this.options = options;
  this.fn = fn; //pass the button's click function
  this.titled = titled;
  this.selectedOption = selectedOption;

  this.height = options.length * lineHeight;

  this.draw();
  this.new_selection(selectedOption);

};

RadioList.prototype.mouse_down = function(mouseX, mouseY) {

  var verticalAdjustment = .75 * this.lineHeight;
  var y = this.y - verticalAdjustment;

  var relativeY = mouseY - y;
  var hit = ( relativeY > 0 && 
    relativeY < this.height &&
    mouseX > this.x &&
    mouseX < this.x + this.width
        ) ? true : false;

  var selected = -1;

  if (hit === true) {
    selected = Math.floor( relativeY / this.lineHeight);
    if (selected === 0 && this.titled) {
      return hit;
    }
    this.new_selection(selected);
    this.fn(); //run the button's function
  }
  return hit;
};

RadioList.prototype.draw = function() {

  var sButtonSpacing = (SHORTBUTTON + 0.5) * tilesz;
  var textOffset = 0;

  context.textAlign = 'left';
  for (let i = 0; i < this.options.length; i++) {
    if (i === 0 && this.titled) {
        textOffset = 0;
    } else {
      textOffset = 1.5 * tilesz;
    }
    setColor('black');
    context.fillText(this.options[i],
        this.x + textOffset,
        this.y + this.lineHeight * i );
  }
}

RadioList.prototype.new_selection = function(selected) {
  this.selection = selected;
  for (let i = 0; i < this.options.length; i++) {
    if (i === 0 && this.titled) {
        textOffset = 0;
    } else {
      textOffset = 1.5 * tilesz;
      drawCircle(context,
        this.x + 0.5 * tilesz, 
        this.y + this.lineHeight * (i-.2),
        tilesz/2,
        cardColor,
        true,
        true);
    }
    if (i === selected) {
      drawCircle(context,
        this.x + 0.5 * tilesz, 
        this.y + this.lineHeight * (i-.2),
        tilesz/3,
        mainmenuColor,
        true,
        false);
    }
  }
}


function drawCircle(ctx, x, y, radius, color, filled, outlined) {
  setColor(color);
  ctx.lineWidth = 2 ;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  if (filled) {
    ctx.fill();
  } 
  if (outlined) { 
    ctx.stroke(); 
  }
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
  var x = evt.offsetX;
  var cx = evt.clientX;
  var y = evt.offsetY; 

  console.log('offestX: '+x+ ' offestY: '+y);
  var button_was_clicked = buttons.some(function(b) {
    return b.mouse_down(x, y);
  });

  var radio_list_was_clicked = radioLists.some(function(b) {
    return b.mouse_down(x, y);
  });

  if (button_was_clicked) return; //return early because button was clicked

  if (gameScreen === INPLAY || gameScreen == CONTROLS) {
    if (cx < wWidth / 2) {
      piece.rotate(3);
    } else {
      piece.rotate(1);
    }
  }
};



function drawRectangle(x,y,width,height,color) {

  context.globalAlpha = 1.0;
  context.beginPath();
  context.lineWidth = "2";
  context.strokeStyle = color;
  context.rect(x, y, width, height); 
  context.stroke();

}


// --------------------------------------------------
function key(k) {
  if (k === 82) { // Player pressed r
    reset();
  }
  // mission navigation is prettty buggy right now
  // exists for testing
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
    // exists for testing purposes
    toggleMissionMode();
    reset();
  }

  
  //if (gdone) {
  if (gameScreen != INPLAY && gameScreen != CONTROLS) {
    return;
  }

  if (k === 38) { // Player pressed up
    piece.rotate(3);
    dropStart = Date.now();
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
  }

  if (gameScreen != INPLAY) {
    return;
  }

  if (k === 40) { // Player holding down
    piece.down();
  } else if (k === 65) { // Player pressed a
    holdPiece();
  } else if (k === 70) { // Player pressed f
    piece.rotate(2);
    dropStart = Date.now();
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
  drawStatusBar();
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

function initControlsTest() {
  piece = null;
  BOARDWIDTH = 9; // don't like that I'm changing something that was supposed to be constant
  board = initBoard(BOARDHEIGHT, BOARDWIDTH);
  boardX = .75;
  isPieceHeld = true;
  done = false;
  gdone = false;
  //recentWin = false;
  gameScreen = CONTROLS;
 // drawMainMenu();
 // gameScreen = MAINMENU;
  //dropStart = Date.now();
  var p = pieces[5];
  piece = new Piece(p[0], p[1],  5, 6);
  piece.draw(context);
  //boardX = ( canvas.width - BOARDWIDTH * tilesz ) / 2;

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
  drawMainMenu();
  gameScreen = MAINMENU;
}

