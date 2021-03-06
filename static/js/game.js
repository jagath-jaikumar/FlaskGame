var socket = io();
var my_id = -1;


var all_players  = {};

var all_bullets = [];

socket = io.connect('http://' + document.domain + ':' + location.port + '/');
socket.on('connect', function() {
    socket.emit('connect_request', {data: 'I\'m connected!'});
});

socket.on('id', function(data) {
    my_id=data.id;
  //  console.log(data);
});

socket.on('check_heartbeat', function(data) {
    socket.emit('check_heartbeat',{data:my_id})
});

socket.on('redraw', function(data) {
  all_players = data;
    //console.log(data)
});

var canvas = document.getElementById('myCanvas');

var PositionY = canvas.height/2;
var PositionX = canvas.width/2;
var playerSpeedY = 0;
var playerSpeedX = 0;

var heading = 'north';
var moving = false;


var directionalSpeed = 5;

var boostMultiplier = 2;

document.onkeydown = keyDown;
document.onkeyup = keyUp;


var bullet_speed = 10;

function new_bullet(){
  bullet_data = {
    'x':PositionX,
    'y':PositionY,
    'speedX':playerSpeedX,
    'speedY':playerSpeedY,
    'heading':heading,
    'active':true,
  }
  all_bullets.push(bullet_data);
}

function keyDown(e) {
    switch(e.keyCode) {
        case 38: // UP
            playerSpeedY = -1; // moving!
            break;

        case 40: // DOWN
            playerSpeedY = 1; // moving!
            break;

        case 37: // LEFT
            playerSpeedX = -1; // moving!
            break;

        case 39: // RIGHT
            playerSpeedX = 1; // moving!
            break;

        case 16: // shift
            directionalSpeed *= boostMultiplier; // boost!
            break;

        case 32: // space
            new_bullet(); // bullet!
            break;
        // other cases...
    }
}

function keyUp(e) {
    switch(e.keyCode) {
        case 38: // UP
            playerSpeedY = 0; // NOT moving!
            break;

        case 40: // DOWN
            playerSpeedY = 0; // NOT moving!
            break;

        case 37: // UP
            playerSpeedX = 0; // NOT moving!
            break;

        case 39: // DOWN
            playerSpeedX = 0; // NOT moving!
            break;

        case 16: // shift
            directionalSpeed /= boostMultiplier; // NO boost!
            break;


        // other cases...
    }
}



function update_bullets(){
  for (bullet of all_bullets) {
    if (bullet.speedX === 0 && bullet.speedY === 0){
      if (bullet.heading === "north"){
        bullet.speedY = -1;
      }
      else if (bullet.heading === "north-east"){
        bullet.speedX = 1;
        bullet.speedY = -1;
      }
      else if (bullet.heading === "east"){
        bullet.speedX = 1;
      }
      else if (bullet.heading === "south-east"){
        bullet.speedX = 1;
        bullet.speedY = 1;
      }
      else if (bullet.heading === "south"){
        bullet.speedY = 1;
      }
      else if (bullet.heading === "south-west"){
        bullet.speedX = -1;
        bullet.speedY = 1;
      }
      else if (bullet.heading === "west"){
        bullet.speedX = -1;
      }
      else {
        bullet.speedX = -1;
        bullet.speedY = -1;
      }
    }

    bullet.x = bullet.x + (bullet.speedX * bullet_speed);
    bullet.y = bullet.y + (bullet.speedY * bullet_speed);


    if (bullet.x > canvas.width || bullet.y < 0){
      bullet.active = false;
    }

    if (bullet.y > canvas.height || bullet.y < 0){
      bullet.active = false;
    }
  }
}


// Whatever loop is called for each frame or game tick
function updateLoop() {
  // rendering, updating, whatever, per frame
  update_bullets();


  PositionY += (playerSpeedY * directionalSpeed);

  if (PositionY > canvas.height){
    PositionY = canvas.height;
  }

  if (PositionY < 0){
    PositionY = 0;
  }

  PositionX += (playerSpeedX * directionalSpeed);

  if (PositionX > canvas.width){
    PositionX = canvas.width;
  }

  if (PositionX < 0){
    PositionX = 0;
  }

  if (playerSpeedX === 0 && playerSpeedY === 0){
    moving = false;
  }
  else {
    moving = true;
    if (playerSpeedX === 1 && playerSpeedY === -1){
      heading = "north-east";
    }
    else if (playerSpeedX === 1 && playerSpeedY === 0){
      heading = "east";
    }
    else if (playerSpeedX === 1 && playerSpeedY === 1){
      heading = "south-east";
    }
    else if (playerSpeedX === 0 && playerSpeedY === 1){
      heading = "south";
    }
    else if (playerSpeedX === -1 && playerSpeedY === 1){
      heading = "south-west";
    }
    else if (playerSpeedX === -1 && playerSpeedY === 0){
      heading = "west";
    }
    else if (playerSpeedX === -1 && playerSpeedY === -1){
      heading = "north-west";
    }
    else { // if (playerSpeedX === 0 && playerSpeedY === -1){
      heading = "north";
    }
  }

  data = {
    'id':my_id,
    'playerX': PositionX,
    'playerY': PositionY,
    'moving':moving,
    'heading':heading,
  };
  socket.emit('update_position', data);
//    console.log(PositionY)
}


function getSprite(mov,dir){
  spriteDir = 'static/images/';

  if (mov === false){
    if (dir === 'north') {
      return spriteDir + 'rocket-north-no.png';
    } else if (dir === 'south'){
      return spriteDir + 'rocket-south-no.png';
    } else if (dir === 'east'){
      return spriteDir + 'rocket-east-no.png';
    } else if (dir === 'west'){
      return spriteDir + 'rocket-west-no.png';
    } else if (dir === 'north-west'){
      return spriteDir + 'rocket-nw-no.png';
    } else if (dir === 'north-east'){
      return spriteDir + 'rocket-ne-no.png';
    } else if (dir === 'south-west'){
      return spriteDir + 'rocket-sw-no.png';
    } else {//if (heading === 'west'){
      return spriteDir + 'rocket-se-no.png';
    }
  }
  else {
    if (dir === 'north') {
      return spriteDir + 'rocket-north-yes.png';
    } else if (dir === 'south'){
      return spriteDir + 'rocket-south-yes.png';
    } else if (dir === 'east'){
      return spriteDir + 'rocket-east-yes.png';
    } else if (dir === 'west'){
      return spriteDir + 'rocket-west-yes.png';
    } else if (dir === 'north-west'){
      return spriteDir + 'rocket-nw-yes.png';
    } else if (dir === 'north-east'){
      return spriteDir + 'rocket-ne-yes.png';
    } else if (dir === 'south-west'){
      return spriteDir + 'rocket-sw-yes.png';
    } else {//if (heading === 'west'){
      return spriteDir + 'rocket-se-yes.png';
    }
  }

}


function redraw() {
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (var key in all_players){
    if (parseInt(key) === my_id){
      drawing = new Image()
      drawing.src = getSprite(all_players[key].moving, all_players[key].heading);
      context.drawImage(drawing,all_players[key].playerX,all_players[key].playerY);
    }
    else {
      drawing = new Image()
      drawing.src = getSprite(all_players[key].moving, all_players[key].heading);
      context.drawImage(drawing,all_players[key].playerX,all_players[key].playerY);
    }
  }

  for (bullet of all_bullets){
    if (bullet.active === true){
      context.beginPath();
      context.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI, false);
      context.fillStyle = 'black';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();
    }
  }
}

function clean(){
  console.log("clean");
}


setInterval(onTimerTick, 17); // 33 milliseconds = ~ 30 frames per sec
var count = 0;
function onTimerTick() {
    updateLoop();
    redraw()
}
