window.onload = function() {
  
// control and global game variables
var bgColor = new Color(36, 36, 36);
var speed = 0;
var numLevel = 1;
var clickBox = new Rectangle(400, 480);
var multiplier = 1;
var counter = 0;
var proceed;

// text variables
var titleText = new Text ("GALAXY INVADERS", "32pt Trebuchet MS");
var bodyText = new Text ("Avoid the enemy ships!", "16pt Trebuchet MS");
var levelTxt1 = new Text("Level " + numLevel + " Complete", "32pt Trebuchet MS");
var levelTxt2 = new Text("Click Anywhere to Proceed", "16pt Trebuchet MS");
var winTxt1 = new Text ("You escaped the enemy!", "24pt Trebuchet MS");
var restartTxt1 = new Text ("You were captured!", "24pt Trebuchet MS");
var restartTxt2 = new Text ("Click Anywhere to Restart", "16pt Trebuchet MS");

// star variables
var numStars = 900;
var starRadius;
var starX;
var starY;
var star;
var starArray = [];
var starYMax = -2000;

// player variables
var player = new WebImage ("https://codehs.com/uploads/05a4ed5b608651926cdc505331750ae8");
var PLAYER_W = 43.11;
var PLAYER_H = 46.44;
var staticPlayer = new WebImage ("https://codehs.com/uploads/05a4ed5b608651926cdc505331750ae8");

// tie fighter variables
var tieFighter;
var TIE_W = 49.14;
var TIE_H = 64.86;
var tieArray = [];
var NUM_TIES = 39;
var lastTie;
var lastTieDx;
var tieX;
var tieY;
var dx;
var dxArray = [];
var TIE_YMAX = -5000;

/*  This game is inspired by Space Invaders, but with a Star Wars theme.
    The point is to avoid all the tie fighters flying towards the player sprite 
    (x-wing) at the bottom of the screen. The user moves the player sprite with 
    the mouse. If the player hits a tie fighter, you restart the level. If you 
    get past all tie fighters, you proceed to the next level and the speed of 
    the tie fighters increases. If you pass all 4 levels, you win the game!
*/
function start(){
    setUp();
    playerControls();
    
    setTimer(mainTimer, 1000);
}

//// SET UP FUNCTIONS //////////////////////////////////////////////////////////////////////////

// This draws the background, stars, and title text.
function setUp(){
    setBackgroundColor(bgColor);
    drawStars();
    
    drawShape(titleText, getWidth()/2-titleText.getWidth()/2, 200, Color.white, false);
    add(titleText);
    drawShape(bodyText, getWidth()/2-bodyText.getWidth()/2, 260, Color.white, false);
    add(bodyText);
}

// This draws the stars at random positions and at random radiuses
function drawStars(){
    for (var i=(multiplier-1)*numStars; i<numStars*multiplier; i++){
        starRadius = Randomizer.nextInt(1,1.5);
        starX = Randomizer.nextInt(starRadius, getWidth() - starRadius);
        starY = Randomizer.nextInt(starYMax, getHeight() - starRadius);
        
        star = new Circle(starRadius);
        drawShape(star, starX, starY, Color.white, false);
        starArray.push(star);
        add(star);
    }
    setTimer(moveStars, 20);
}

// draws any shape with customizable color, position, and border
function drawShape(variable, x, y, color, border, width, bColor){
    variable.setPosition(x,y);
    variable.setColor(color);
    if (border == true){
        variable.setBorder(border);
        variable.setBorderWidth(width);
        variable.setBorderColor(bColor);
    }
}

// draws the last tie fighter on the screen in order to keep track if the level is passed
function drawLastTie(){
    tieX = Randomizer.nextInt(0, getWidth()-TIE_W);
    
    lastTie = new WebImage ("https://codehs.com/uploads/18849c0d01d9f27f7c791539a19e3dc6");
    lastTie.setSize(TIE_W, TIE_H);
    lastTie.setPosition(tieX, -4000);
        
    add(lastTie);
        
    lastTieDx = Randomizer.nextInt(-2, 2);
}

// draws tie fighters at random x and y positions moving towards random directions
function drawTies(){
    for (var i=(multiplier-1)*NUM_TIES; i< NUM_TIES*multiplier; i++){
        tieX = Randomizer.nextInt(0, getWidth()-TIE_W);
        tieY = Randomizer.nextInt(-4000, -TIE_W)
        
        tieFighter = new WebImage ("https://codehs.com/uploads/18849c0d01d9f27f7c791539a19e3dc6");
        tieFighter.setSize(TIE_W, TIE_H);
        tieFighter.setPosition(tieX, tieY);
        tieArray.push(tieFighter);
        
        add(tieArray[i]);
        
        dx = Randomizer.nextInt(-2, 2);
        dxArray.push(dx);
    }
}

//// CONTROL FUNCTIONS /////////////////////////////////////////////////////////////////////////////

// stops timers and draws the restart or proceed screens, depending if the player 
// completed the level or not.
function nextLevel(){
    if (numLevel == 3){
        win();
    } else {
    
        clickBox.setColor(bgColor);
        add(clickBox);
        
        if (proceed == true){
            levelTxt1.setLabel("Level " + numLevel + " Complete")
        
            levelTxt1.setPosition(getWidth()/2-levelTxt1.getWidth()/2, 200);
            levelTxt1.setColor(Color.white);
            add(levelTxt1);
            
            levelTxt2.setPosition(getWidth()/2-levelTxt2.getWidth()/2, 260);
            levelTxt2.setColor(Color.white);
            add(levelTxt2);
        } 
        
        if (proceed == false){
            restartTxt1.setPosition(getWidth()/2-restartTxt1.getWidth()/2, 200);
            restartTxt1.setColor(Color.white);
            add(restartTxt1);
            
            restartTxt2.setPosition(getWidth()/2-restartTxt2.getWidth()/2, 260)
            restartTxt2.setColor(Color.white);
            add(restartTxt2);
        }
        
        mouseClickMethod(click);
    }
}

// if the player passes all 4 levels, all timers stop and the player sprite
// moves forward on its own. you win!
function win(){
    stopAllTimers();
    
    staticPlayer.setPosition(player.getX(), player.getY());
    staticPlayer.setSize(PLAYER_W, PLAYER_H);
    add(staticPlayer);
    remove(player);
    
    setTimer(moveStaticPlayer, 40);
    
    winTxt1.setPosition(getWidth()/2-winTxt1.getWidth()/2, getHeight()/2+winTxt1.getHeight()/2);
    winTxt1.setColor(Color.white);
    winTxt1.setBorderColor(Color.white);
    winTxt1.setBorderWidth(2);
    add(winTxt1);
    
    setTimer(changeColors, 100);
    
}

// function for setting the player sprite's y position and x position based on
// the location of the mouse
function playerControls(){
    player.setPosition(175.75, 410);
    player.setSize(PLAYER_W, PLAYER_H);
    add(player);
    
    mouseMoveMethod(movePlayer);
}

// checks if the player was hit by a tie fighter
function checkPlayer(){
    // checks right of player
    var elem = getElementAt(player.getX()+PLAYER_W, player.getY()+PLAYER_H/2);
    if (elem != null && elem !=player && elem != star){
        stopTimer(moveTie);
        stopTimer(moveStars);
        proceed = false;
        nextLevel();
    }
    // checks left side of player
    var elem = getElementAt(player.getX(), player.getY()+PLAYER_H/2);
    if (elem != null && elem !=player && elem != star){
        stopTimer(moveTie);
        stopTimer(moveStars);
        proceed = false;
        nextLevel();
    }
    // checks top of player
    var elem = getElementAt(player.getX()+PLAYER_W/2, player.getY());
    if (elem != null && elem !=player && elem != star){
        stopTimer(moveTie);
        stopTimer(moveStars);
        proceed = false;
        nextLevel();
    }
    // checks bottom of player
    var elem = getElementAt(player.getX()+PLAYER_W/2, player.getY()+PLAYER_H);
    if (elem != null && elem !=player && elem != star){
        stopTimer(moveTie);
        stopTimer(moveStars);
        proceed = false;
        nextLevel();
    }
}

// if the tie fighters move out of the canvas, they show up on the other side
// ex. a tie moves right out of the canvas, they appear on the left side
function checkWalls(i){
    // checks left wall
    if (tieArray[i].getX() < -TIE_W){
        tieArray[i].setPosition(400, tieArray[i].getY());
    }
    // checks right wall
    if (tieArray[i].getX() > 400){
        tieArray[i].setPosition(-TIE_W, tieArray[i].getY());
    }
}

// when the player clicks the screen at the restart or proceed screens, 
// either the level and speed increase or the level restarts
function click(e){
    var elem = getElementAt(e.getX(), e.getY())
    if (elem == clickBox){
        multiplier++;
        if (proceed == true){
            numLevel++;
            speed+= 1;
        }
        proceed = false;
        
        removeAll();
        for (var i=0; i<NUM_TIES*multiplier; i++){
            tieArray.remove[i];
        }
        for (var i=0; i<numStars*multiplier; i++){
            starArray.remove[i];
        }
        
        drawStars();
        add(player);
        
        drawTies();
        drawLastTie();
        
        setTimer(moveTie, 40);
        setTimer(moveStars, 20);
    }
}

//// TIMER FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////

// function for the title screen delay of 3 seconds
function mainTimer(){
    counter++;
    if (counter == 3){
        remove(titleText);
        remove(bodyText);
    
        drawTies();
        drawLastTie();
        setTimer(moveTie, 40);
        
        counter = 0;
        stopTimer(mainTimer);
    }
}

// when the player wins the game, this moves the static player sprite
function moveStaticPlayer(){
    staticPlayer.move(0, -8);
}

// moves the stars down by .5 a pixel
function moveStars(){
    for (var i=(multiplier-1)*numStars; i<(numStars*multiplier); i++){
        var tempStar = starArray[i];
        tempStar.move(0,.5);
    }
}

// moves the ties down by 10 pixels and when the last tie leaves the bottom of 
// the screen, proceeds to the next level
function moveTie(){
    checkPlayer();
    for (var i=(multiplier-1)*NUM_TIES; i<(NUM_TIES*multiplier); i++){
        var tempTie = tieArray[i];
        checkWalls(i);
        tempTie.move(dxArray[i],10+speed);
    }
    
    
    lastTie.move(lastTieDx, 10+speed);
    
    if (lastTie.getY() > 480){
        stopTimer(moveStars);
        stopTimer(moveTie);
        
        proceed = true;
        nextLevel();
    }
}

// moves player object to mouse location, centered on mouse location
function movePlayer(e){
    if (e.getX() < getWidth()-PLAYER_W/2 && e.getX() > PLAYER_W/2){
        player.setPosition(e.getX()-PLAYER_W/2, 405);
    }
}

// randomizes the color of the win text
function changeColors(){
    winTxt1.setColor(Randomizer.nextColor());
}

// DRAFT FUNCTIONS :'(
/*
var laserHColor = new Color(23, 69, 255);
var laserColor = new Color(96, 124, 240);
var laserStack = new Stack();

function fireLaser(e){
    var laser = new Oval(5, 10);
    drawShape(laser, e.getX()+player.getWidth()/2, 400, laserColor, true, 2, laserHColor);
    add(laser);
    laserStack.push(laser);
    println(laserStack.size());

    setTimer(moveLaser, 20);
}
function moveLaser(){
    var currentLaser = laserStack.peek();
    currentLaser.move(0,-5);
    
    mouseClickMethod(fireLaser);
}
*/

if (typeof start === 'function') {
    start();
}

}; // end

