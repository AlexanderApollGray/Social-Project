// Social Studies Game by Oli and Xander

// SETUP CANVAS AND GRAPHICS CONTEXT
let cnv = document.getElementById('my_canvas');
let ctx = cnv.getContext('2d');
cnv.width = 1000;
cnv.height = 600;

// GLOBAL VARIABLES
let screen = 'title0';
let frameCount = 0;
let background = document.getElementById('title');;
let openHole;
let rightIsPressed = false;
let leftIsPressed = false;
let eIsPressed = false;
let upIsPressed = false;
let distance;
let opacity = 0;
let checkMirrors = 'ready';
let char = {
  imgX: 0,
  imgY: 0,
  x: 850,
  y: 474 - 54,
  w: 24,
  h: 69,
  facing: 'right',
  gravity: 0,
  standing: true,
};
let laser = {
  origin: 0,
  xMove: 0,
  xLine: 0,
  y: 0,
  shoot: 'ready',
  timer: 0,
  collide: false,
  width: 0,
};

// EVENT LISTENERS
document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);

// FUNCTIONS
cnv.addEventListener('click', function (evt) {
  var mousePos = getMousePos(cnv, evt);
  console.log(mousePos.x + ',' + mousePos.y);
}, false);

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function keydownHandler(event) {
  if (event.code === 'KeyE') {
    eIsPressed = true;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    rightIsPressed = true;
  }
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    leftIsPressed = true;
  }
  if (
    event.code === 'KeyW' ||
    event.code === 'ArrowUp' ||
    event.code === 'Space'
  ) {
    upIsPressed = true;
  }
}

function keyupHandler(event) {
  if (event.code === 'KeyE') {
    eIsPressed = false;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    rightIsPressed = false;
  }
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    leftIsPressed = false;
  }
  if (
    event.code === 'KeyW' ||
    event.code === 'ArrowUp' ||
    event.code === 'Space'
  ) {
    upIsPressed = false;
  }
}

// CREATE LEVEL OBJECTS

// Block function
function newBlock(x, y, w, h, a, col) {
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    a: a,
    col: col,
  }
}

// Create blocks
let platform1 = newBlock(-100, 0, 50, 10);
let platform2 = newBlock(-100, 0, 50, 10);
let wallL1 = newBlock(-100, 0, 10, 50);
let wallL2 = newBlock(-100, 0, 10, 50);
let wallC1 = newBlock(-100, 0, 0.01, 0);
let wallC2 = newBlock(-100, 0, 0.01, 0);
let entrance = newBlock(-100, 0, 45, 35, 'hole');
let hole = newBlock(-100, 474, 100, 0);
let portal = newBlock(900, 380, 69, 90, 'portal');
let dialogueBox = newBlock(0, 0, 0, 0, 'dialogue');

// Mirror function
function newMirror(x1, y1, a, r, coords, x2, y2, cor1x, cor1y, cor2x, cor2y, ) {
  return {
    x1: x1,
    y1: y1,
    a: a,
    r: r,
    coords: coords,
    x2: x2,
    y2: y2,
    cor1x: cor1x,
    cor1y: cor1y,
    cor2x: cor2x,
    cor2y: cor2y,
  }
}

// Create mirror
let mirror1 = newMirror(700, 400, 'mirror', 135, '', '');
let mirror2 = newMirror(600, 400, 'mirror', 45, '', '');

// MAIN PROGRAM LOOP
requestAnimationFrame(loop);

function loop() {
  frameCount++;
  // Play button
  ctx.fillStyle = 'black';
  ctx.arc(500, 300, 30, 0, 2 * Math.PI);
  ctx.fill();
  // SET UP LEVEL

  // Draw background
  ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

  // factory interior
  if (background === document.getElementById('level4')) {
    if (char.x < 200 && opacity < 10) {
      opacity += 1;
    } else if (char.x > 200 && opacity > 0) {
      opacity -= 1;
    }
    ctx.globalAlpha = opacity / 10
    ctx.drawImage(document.getElementById('factory-interior'), 0, 271, 200, 207);
    ctx.globalAlpha = 1
  }

  ctx.strokeStyle = 'black';
  ctx.strokeRect(dialogueBox.x, dialogueBox.y, dialogueBox.w, dialogueBox.h);

  // Platforms
  ctx.fillStyle = 'blue';
  ctx.fillRect(platform1.x, platform1.y, platform1.w, platform1.h);
  ctx.fillRect(platform2.x, platform2.y, platform2.w, platform2.h);

  // Walls
  ctx.fillRect(wallL1.x, wallL1.y, wallL1.w, wallL1.h);
  ctx.fillRect(wallL2.x, wallL2.y, wallL2.w, wallL2.h);
  ctx.fillRect(entrance.x, entrance.y, entrance.w, entrance.h);
  ctx.fillStyle = hole.c;
  ctx.fillRect(wallC1.x, wallC1.y, wallC1.w, wallC1.h);
  ctx.fillRect(wallC2.x, wallC2.y, wallC2.w, wallC2.h);

  // Hole
  ctx.fillRect(hole.x, hole.y, hole.w, hole.h);

  // Portal
  ctx.drawImage(document.getElementById('portal'), portal.x, portal.y, portal.w, portal.h);

  // LASER

  // Shoot laser
  if (laser.shoot === 'animate') {
    laser.shoot = true;
    laser.width = 4;
    if (rightIsPressed || leftIsPressed) {
      laser.y = char.y + 37;
    } else {
      laser.y = char.y + 34; // 
    } // 
    if (char.imgY === 0) {
      laser.origin = char.x + char.w + 13;
    } else if (char.imgY === 112) {
      laser.origin = char.x + char.w + 23;
    } else if (char.imgY === 56) {
      laser.origin = char.x - 13;
    } else if (char.imgY === 168) {
      laser.origin = char.x - 23;
    }
  }

  if (eIsPressed && laser.shoot === 'ready') {
    laser.shoot = 'animate';
    char.gravity = 0;
  }

  if (laser.shoot === true) {
    laser.xMove = laser.origin;
    laser.xLine = laser.origin;
    while (!laser.collide) {
      if (checkMirrors === 'ready') {
        getCoordinates(mirror1);
        getCoordinates(mirror2);
      }

      // Laser moves left or right
      if (char.facing === 'right') {
        laser.xMove = laser.xLine;
        laser.xLine++;
      }
      if (char.facing === 'left') {
        laser.xMove = laser.xLine;
        laser.xLine--;
      }

      // Check collision
      mirrorCollision(mirror1);
      mirrorCollision(mirror2);

      wallCollide(wallL1);
      wallCollide(wallL2);
      wallCollide(entrance);

      if (laser.xLine < -1 || laser.xLine > cnv.width + 1) {
        laser.collide = true;
      }

      // Draw laser
      ctx.lineWidth = laser.width;
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(laser.xMove, laser.y);
      ctx.lineTo(laser.xLine, laser.y);
      ctx.stroke();
    }
  }

  function getCoordinates(aMirror) {
    checkMirrors = true;
    aMirror.coords += '///coords1///'
    if (aMirror.r === 135) {
      for (let checkY = aMirror.y1, checkX = aMirror.x1; checkY < aMirror.cor1y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords2///'
      for (let checkY = aMirror.y2, checkX = aMirror.x2; checkY < aMirror.cor2y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
    } else if (aMirror.r === 45) {
      for (let checkY = aMirror.y1, checkX = aMirror.x1; checkY < aMirror.cor1y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
      aMirror.coords += '///coords2///'
      for (let checkY = aMirror.y2, checkX = aMirror.x2; checkY < aMirror.cor2y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
    }
  }

  function mirrorCollision(aMirror) {
    let searchFor = '|' + parseInt(laser.xLine) + ',' + parseInt(laser.y) + '|';
    aMirror.coords = aMirror.coords.replace(searchFor, '|match|');
    if (aMirror.coords.includes('match')) {
      laser.collide = true;
      laser.xMove = laser.origin;
      laser.xLine = laser.origin;
    }
  }

  function wallCollide(aWall) {
    if (laser.xLine > aWall.x && laser.xLine < aWall.x + aWall.w && laser.y > aWall.y && laser.y < aWall.y + aWall.h) {
      laser.collide = true;
      if (aWall.a === 'hole') {
        openHole = true;
      }
      laser.xMove = laser.origin;
      laser.xLine = laser.origin;
    }
  }

  // Laser timer
  if (laser.shoot != 'ready') {
    laser.timer++;
  }
  if (laser.timer >= 25) {
    laser.width -= 1;
  }
  if (laser.timer >= 30) {
    laser.shoot = 'cooldown';
    laser.collide = false;
  }
  if (laser.timer >= 60) {
    laser.shoot = 'ready';
    laser.timer = 0;
  }

  // Draw mirrors
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';

  mirror1.x2 = mirror1.x1 + 6.5;
  mirror1.y2 = mirror1.y1 + 6.5;
  mirror1.cor1x = mirror1.x1 - 35;
  mirror1.cor1y = mirror1.y1 + 35;
  mirror1.cor2x = mirror1.cor1x + 6.5;
  mirror1.cor2y = mirror1.cor1y + 6.5;
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(mirror1.x1, mirror1.y1);
  ctx.lineTo(mirror1.cor1x, mirror1.cor1y);
  ctx.lineTo(mirror1.cor2x, mirror1.cor2y);
  ctx.lineTo(mirror1.x2, mirror1.y2);
  ctx.closePath();
  ctx.stroke();

  mirror2.x2 = mirror2.x1 - 6.5;
  mirror2.y2 = mirror2.y1 + 6.5;
  mirror2.cor1x = mirror2.x1 + 35;
  mirror2.cor1y = mirror2.y1 + 35;
  mirror2.cor2x = mirror2.cor1x - 6.5;
  mirror2.cor2y = mirror2.cor1y + 6.5;
  ctx.beginPath();
  ctx.moveTo(mirror2.x1, mirror2.y1);
  ctx.lineTo(mirror2.cor1x, mirror2.cor1y);
  ctx.lineTo(mirror2.cor2x, mirror2.cor2y);
  ctx.lineTo(mirror2.x2, mirror2.y2);
  ctx.closePath();
  ctx.stroke();

  // CHARACTER
  ctx.drawImage(document.getElementById('spritesheet'), char.imgX, char.imgY, 54, 56, char.x - 23, char.y - 2, 70, 72);

  if (laser.shoot != true) {
    // Reset checkMirrors
    checkMirrors = 'ready'
    mirror1.coords = '';
    mirror2.coords = '';

    // Animations
    if (rightIsPressed) {
      char.imgY = 0;
      if (laser.shoot === 'animate') {
        char.imgX = 108;
      } else {
        if (frameCount % 10 === 0) {
          if (char.imgX === 54) {
            char.imgX = 0;
          } else {
            char.imgX = 54;
          }
        }
      }
    } else if (leftIsPressed) {
      char.imgY = 56;
      if (laser.shoot === 'animate') {
        char.imgX = 108;
      } else {
        if (frameCount % 10 === 0) {
          if (char.imgX === 54) {
            char.imgX = 0;
          } else {
            char.imgX = 54;
          }
        }
      }
    } else if (char.facing === 'right') {
      char.imgY = 112;
      if (laser.shoot === 'animate') {
        char.imgX = 54;
      } else {
        char.imgX = 0;
      }
    } else if (char.facing === 'left') {
      char.imgY = 168;
      if (laser.shoot === 'animate') {
        char.imgX = 54;
      } else {
        char.imgX = 0;
      }
    }

    // Move x
    if (rightIsPressed && !leftIsPressed) {
      char.x += 5;
      char.facing = 'right';
    }
    if (leftIsPressed && !rightIsPressed) {
      char.x -= 5;
      char.facing = 'left';
    }


    // Collision

    // wall
    function wallCollide(aWall) {
      if (char.x + char.w > aWall.x && char.x < aWall.x + aWall.w && char.y + char.h > aWall.y && char.y < aWall.y + aWall.h) {
        if (aWall.a === 'portal') {
          screen = screen.replace(/puzzle|title/, '');
          let levelNum = +screen;
          levelNum++;
          screen = 'level' + levelNum;
          level1Setup();
          level2Setup();
          level3Setup();
          level4Setup();
          level5Setup();
        } else if (aWall.a === 'dialogue') {
          console.log('grog');
        } else if (char.facing === 'right') {
          char.x = aWall.x - char.w - 1;
        } else if (char.facing === 'left') {
          char.x = aWall.x + aWall.w
        }
      }
    }
    wallCollide(wallC1);
    wallCollide(wallC2);
    wallCollide(portal);
    wallCollide(dialogueBox);

    // platform
    function platformCollide(aPlatform) {
      if (char.x + char.w > aPlatform.x && char.x < aPlatform.x + aPlatform.w && char.y + char.h > aPlatform.y - 7 && char.y + char.h < aPlatform.y + aPlatform.h && char.y != aPlatform.y - char.h) {
        char.y = aPlatform.y - char.h;
        char.gravity = 0;
        char.standing = true;
      }
    }
    if (char.x > hole.x && char.x + char.w < hole.x + hole.w && openHole) {
      char.standing = false;
      if (char.y >= hole.y + hole.h - char.h - 2) {
        char.y = hole.y + hole.h - char.h;
      }
    } else if (char.y > 396 && char.y != 404) {
      char.y = 404;
      char.gravity = 0;
      char.standing = true;
    } else if (char.gravity >= 0) {
      char.standing = false;
      platformCollide(platform1);
      platformCollide(platform2);
    }

    // Gravity
    char.y += char.gravity;
    if (char.gravity < 8.5) {
      char.gravity += 0.45;
    }
    if (upIsPressed && char.standing) {
      char.standing = false;
      char.y -= 8.5;
      char.gravity = -8.5;
    }

    // Puzzle room
    if (char.y > cnv.height) {
      screen = screen.replace('level', 'puzzle');
      puzzle1Setup();
      puzzle2Setup();
      puzzle3Setup();
      puzzle4Setup();
      puzzle5Setup();
      openHole = false;
    }
  }

  // prevent character from going off screen
  if (char.x < 0) {
    char.x = 0;
  }
  if (char.x > cnv.width - char.w) {
    char.x = cnv.width - char.w;
  }

  // Hole
  if (openHole) {
    if (hole.h < cnv.height) {
      hole.h += 4;
    }
    wallC1.x = hole.x;
    wallC1.y = hole.y;
    wallC1.h = hole.h;
    wallC2.x = hole.x + 100;
    wallC2.y = hole.y;
    wallC2.h = hole.h;
  }

  requestAnimationFrame(loop);
}

function level1Setup() {
  if (screen === 'level1') {
    background = document.getElementById('level1');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 920;
    hole.col = '#ffeb3b';
    dialogueBox.x = 430;
    dialogueBox.y = 400;
    dialogueBox.w = 75;
    dialogueBox.h = 50;
  }
}

function level2Setup() {
  if (screen === 'level2') {
    background = document.getElementById('level2');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 615;
    hole.col = '#8d6e63';
    dialogueBox.x = 350;
    dialogueBox.y = 400;
    dialogueBox.w = 75;
    dialogueBox.h = 50;
  }
}

function level3Setup() {
  if (screen === 'level3') {
    background = document.getElementById('level3');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 615;
    hole.col = '#685a55';
    dialogueBox.x = 550;
    dialogueBox.y = 400;
    dialogueBox.w = 75;
    dialogueBox.h = 50;
  }
}

function level4Setup() {
  if (screen === 'level4') {
    background = document.getElementById('level4');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 850;
    hole.col = '#9e939e';
    dialogueBox.x = 1200;
    dialogueBox.y = 400;
    dialogueBox.w = 75;
    dialogueBox.h = 50;
  }
}

function level5Setup() {
  if (screen === 'level5') {
    background = document.getElementById('level5');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 200;
    hole.col = '#5c5353';
    dialogueBox.x = 100;
    dialogueBox.y = 400;
    dialogueBox.w = 75;
    dialogueBox.h = 50;
  }
}

function puzzle1Setup() {
  if (screen === 'puzzle1') {
    puzzleSetup();
    hole.x = -100;
    mirror1.x1 = 400;
    mirror1.y1 = 444;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle2Setup() {
  if (screen === 'puzzle2') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle3Setup() {
  if (screen === 'puzzle3') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle4Setup() {
  if (screen === 'puzzle4') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle5Setup() {
  if (screen === 'puzzle5') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzleSetup() {
  background = document.getElementById('puzzle');
  char.y = 0 - char.h;
  hole.h = 0;
  entrance.x = -100;
}

function hideAll() {
  wallL1.x = -100;
  wallL2.x = -100;
  wallC1.x = -100;
  wallC2.x = -100;
  mirror1.x1 = -100;
  platform1.x = -100;
  platform2.x = -100;
  portal.x = -100;
}

// LEVEL 1: Route de la Soie
// LEVEL 2: First Nations
// LEVEL 3: Europeans
// LEVEL 4: Industrialisation in UK
// LEVEL 5: Child Labour