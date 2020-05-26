//Canvas
let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

//Draws grid lines across the screen
function drawLines(){
    for(let x = 0; x < canvas.width; x+=25){
        context.beginPath();
        context.moveTo(0,x);
        context.lineTo(canvas.width,x);
        context.stroke();
        context.strokeStyle = '#80ff80';
        context.closePath();
    }
    for(let x = 0; x < canvas.height; x+=25){
        context.beginPath();
        context.moveTo(x,0);
        context.lineTo(x,canvas.height);
        context.stroke();
        context.strokeStyle = '#80ff80';
        context.closePath();
    }
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(0,canvas.height);
    context.stroke();
    context.moveTo(0,canvas.height);
    context.lineTo(canvas.width,canvas.height);
    context.stroke();
    context.moveTo(canvas.width,canvas.height);
    context.lineTo(canvas.width,0);
    context.stroke();
    context.moveTo(canvas.width,0);
    context.lineTo(0,0);
    context.stroke();
        
    context.closePath();
}

//Player variables
class segment{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    drawSegment(){
        context.beginPath();
        context.rect(this.x,this.y,25,25);
        context.fillStyle = '#00e600';
        context.fill();
        context.closePath();
    }
}
let makeNewSegment = false;
let snake = [];
snake.push(new segment(50,50));

//Movement Controls
document.addEventListener('keydown',changeDirection);
function changeDirection(k){
    if(k.key === 'w'){
        dy = -25;
        dx = 0;
    }if(k.key === 'a'){
        dy = 0;
        dx = -25;
    }if(k.key === 's'){
        dy = 25;
        dx = 0;
    }if(k.key === 'd'){
        dy = 0;
        dx = 25;        
    }
}
let dx = 0;
let dy = 0;

//Variable to manage movement delay
let frameToMoveOn = 10;
let frame = 0;

//Colision checking functions
function OOBCheck(x,y){
    if(x+25 > canvas.width || x < 0 || y+25 > canvas.height || y < 0){
        return true;
    }else{
        return false;
    }
}

function insideCheck(x,y,x2,y2){
    if(x === x2 && y == y2){   
        return true;
    }
}

//Apple variables
class apple{
    constructor(x,y,status){
        this.x = x;
        this.y = y;
        this.status = status;
    }
    drawApple(){
        context.beginPath();
        context.rect(this.x,this.y,25,25);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
    }
}
let a = new apple(Math.floor(Math.random()*20)*25,Math.floor(Math.random()*20)*25,true);

//Score drawing/handling
function drawScore(){
    context.font = "16px Arial";
    context.fillStyle = "#FFFFFF";
    context.fillText('Score:'+score,8,20);
}
let score = 0;

//Main Draw Function
function draw(){
    //Clear canvas
    context.fillStyle = '#000000';
    context.fillRect(0,0,canvas.width,canvas.height);
    
    //Drawing functions here
    drawLines();
    for(let n=0;n<snake.length;n++){
        snake[n].drawSegment();
    }
    for(let n=0;n<snake.length;n++){
        if(!insideCheck(snake[n].x,snake[n].y,a.x,a.y)){
            a.drawApple();
        }else{
            break;
        }
    }
    drawScore();

    //Check for loss
    if(OOBCheck(snake[0].x,snake[0].y)){
        alert('Game Over!');
        window.location.reload();
        return;
    }
    for(let n = 1; n < snake.length;n++){
        if(insideCheck(snake[0].x,snake[0].y,snake[n].x,snake[n].y)){
            alert('Game Over!');
            window.location.reload();
            return;
        }
    }   

    //Check if the head is eating the apple
    if(insideCheck(snake[0].x,snake[0].y,a.x,a.y)){
        let goodPos = false;
        //Checks to make sure that the newly created apple was made in an area not occupied by the snake. ***(Try to simplify this)***
        while(!goodPos){
            goodPos = true;
            a = new apple(Math.floor(Math.random()*20)*25,Math.floor(Math.random()*20)*25,true);
            for(let n=0;n<snake.length;n++){
                if(insideCheck(snake[n].x,snake[n].y,a.x,a.y)){
                   goodPos = false; 
                }
            }
        }
        //Add new segment and increment score
        score++;
        makeNewSegment = true;
    }

    //Move snake
    if(frame % frameToMoveOn === 0 && (dx!=0||dy!=0)){
        if(makeNewSegment){
            snake.push(new segment(snake[snake.length-1].x,snake[snake.length-1].y));
            makeNewSegment = false;
        }      
        for(let n=snake.length-1;n>0;n--){
            snake[n].x = snake[n-1].x;
            snake[n].y = snake[n-1].y;
        }
        snake[0].x += dx;
        snake[0].y += dy;  
    }

    //Animation loop
    frame++;
    requestAnimationFrame(draw);
}
//Invoke draw function
draw();