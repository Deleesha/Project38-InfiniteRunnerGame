//created the gameState
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//declared the background's image
var backgroundImage ; 

//declared monkey and it's animation
var monkey , monkey_running , monkeyCollided;

//declared images of banana and obstacle
var bananaImage ,obstacleImage;

//declared groups of banana and obstacle
var foodsGroup, obstaclesGroup;

//declared score
var score , score2;

//declared ground & it's image
var ground , groundImage , invisibleGround;

//declared the sounds
var jumpSound , dieSound ;

//declared gameover and restart
var gameOver , restart , gameOverImage , restartImage;



function preload(){
  
  //loaded the monkey annimations
  monkey_running =loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  
  monkeyCollided = loadAnimation("sprite_0.png");
  
  //loaded Images of obstacle and banana
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  
  //loaded images of ground
  groundImage = loadImage("ground.png");
 
  //loaded the image of background
  backgroundImage = loadImage("back.......jpg");
  
  //loaded the sounds
  jumpSound = loadSound("jump.mp3");   
  dieSound = loadSound("die.mp3");
  
  gameOverImage =loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
}



function setup() {
  
  createCanvas(600,400);

  //created monkey and gave animation
  monkey = createSprite(50,360,20,50);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkeyCollided);
  monkey.scale = 0.1;
  
  //created ground and gave animation
  ground = createSprite(300,390,600,20);
  ground.addImage("ground",groundImage);
  //made the ground scroll
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(300,395,600,30);
  invisibleGround.visible = false;
  //made the ground scroll
  invisibleGround.x = invisibleGround.width/2;
  
  //created gameOver , made it invisible and added image
  gameOver = createSprite(260,100,10,10);  
  gameOver.addImage(gameOverImage);    
  gameOver.scale = 1.5;
  gameOver.visible = false;

  //created restart, made it invisible and added image
  restart = createSprite(250,145,10,10);  
  restart.addImage(restartImage); 
  restart.scale = 0.5;
  restart.visible = false;
  
  //create Obstacle and Food Groups
  obstaclesGroup = new Group();
  foodsGroup = new Group();

  //set the collider of trex
  monkey.setCollider("rectangle",0,0,monkey.width,10);
 // monkey.debug = true;
  
  //scores' intial value
  score = 0;
  score2 = 0;

}

function draw() {
  
  //clears the background
  background(backgroundImage);
  //background("white");

  //displaying score
  textSize(25);
  fill("blue");
  textFont("Arial Black");
  text("⏰Survival Time:" +  score, 300,50);
  
  textSize(27);
  fill("purple");
  textFont("Cooper Black");
  text(" 🍌Bananas Eaten :" + score2, 5,50);
  
  //collided monkey with the ground
  monkey.collide(invisibleGround);
  
  

  if(gameState === PLAY){
    
    //scoring
    score = score + Math.round(getFrameRate()/60);

    //move the ground and adapt to the score
    ground.velocityX = -(4 +   score/100);
    invisibleGround.velocityX = -(4 + score/100);

    console.log(monkey.y);
   // camera.position.x = monkey.x;
    camera.position.y = monkey.y;

    if(monkey.isTouching(foodsGroup)){
      score2 = score2 +  1 
      foodsGroup.destroyEach();
      
       }
    
        
    //reset the ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //reset the ground
    if (invisibleGround.x < 0){
      invisibleGround.x = invisibleGround.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && monkey.y > 300) {
        monkey.velocityY = -10;
      //added the sound when it jumps
        jumpSound.play();
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.5
  
    //spawn the obstacles
    spawnObstacles();
                                 
    //spawn foods
    spawnFoods();
    
    //check for collision
    if(monkey.isTouching(obstaclesGroup)){
       dieSound.play();
       gameState = END;
            
    }
  }
   else if (gameState === END) {
          
     textFont("Elephant");
     textSize(30);
     fill("black");
       text("Press '🔄' to Restart",100,200);
     //stops the ground & monkey
      invisibleGround.velocityX = 0;
      ground.velocityX = 0;
      monkey.velocityY = 0
           
      //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     foodsGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);
     foodsGroup.setVelocityXEach(0);    
     
     //changed the animation
     monkey.changeAnimation("collided", monkeyCollided);     

     gameOver.visible = true;
     restart.visible = true;
     
     
   }
  
  if(mousePressedOver(restart)){
    
    gameState = PLAY;
    score = 0 ;
    score2 = 0;
    monkey.changeAnimation("running" ,monkey_running);
    obstaclesGroup.destroyEach();
    foodsGroup.destroyEach();
    gameOver.visible = false;
    restart.visible= false
  
  }
  
   drawSprites();
  
}

function reset(){
  gameState = PLAY;
  score = 0;
  obstaclesGroup.destroyEach();
  foodsGroup.destroyEach();
  
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   //created obstacles,added image,added velocity and adapted          scoring also
   var obstacle = createSprite(600,375,10,40);
   obstacle.velocityX = -(4 + score/100);
   obstacle.x = Math.round(random(100,550));
  obstacle.addImage(obstacleImage);
   
    
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
    obstacle.scale = 0.075;
   
   //adjusted the depth
   obstacle.depth = monkey.depth;
   monkey.depth = monkey.depth + 1;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnFoods() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    //created banana,added image,added velocity and adapted              scoring also
    var banana = createSprite(600,120,40,10);
    banana.x = Math.round(random(10,550));
    banana.y = 260;
    banana.addImage(bananaImage);
    banana.velocityX = -3;
     //assign lifetime to the variable
    banana.lifetime = 200;
    banana.scale = 0.15;
    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    //add each banana to the group
    foodsGroup.add(banana);
  }
  
}





