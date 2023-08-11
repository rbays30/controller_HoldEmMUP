// -------- GameNite Controller App --------

// ---- Globals ----

//Standard
var messages = [];
var text_drawables = [];
var image_drawables = [];
var needs_draw = false;
var logo_image = new Image();

//For Player Info
var playerColor = "";
var playerName = "";
var gameStarted = 0;



//Canvas
let canvas= document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth-1;
canvas.height = window.innerHeight-1;
let offset_x;
let offset_y;
var widthCard = 200;
var heightCard = 200;
var canvasCenterX = canvas.width/2 - widthCard/2;
var canvasCenterY = canvas.height/2 -heightCard/2;
var incrementOffset = 75;

var playerMoney = 100;
var playerNumberHeight = 100;
var playerNumberWidth = 100;
var playerNumberOffset = 350;
var playerNumberX = canvasCenterX + playerNumberWidth/2;
var playerNumberY = canvasCenterY + playerNumberOffset;
var theBobHopeFactor = playerNumberHeight/2;
var rightCircleX = playerNumberX + playerNumberWidth + incrementOffset;
var leftCircleX = playerNumberX - incrementOffset;
var circleY = playerNumberY + playerNumberHeight/2;



//Card Moving Variables
let cards=[];
let current_card_index = null;
let is_dragging = false;
let startX;
let startY;
let cardMoved = 0;
let cardSubmitOffset = 300;

// ---- Modal ----
var modal = document.getElementById("loginModal");
var loginButton = document.getElementById("loginButton");



// ---- onFlip ----

function onFlip(width, height) {
    SCREEN_WIDTH = width;
    SCREEN_HEIGHT = height;
    needs_draw = true;
    draw_cards();
}

// ---- Messages ----

// handle a single message from the console
function handleMessage(message) {
    console.log('got ' + message);
    text_drawables = [];
    const drbl = {
        type: 'text',
        text: message,
        font: '48px serif',
        x: 30,
        y: 100,
    };
    text_drawables.push(drbl);
    needs_draw = true;
}

// Specify the list of messages to be sent to the console
function outgoingMessages() {
    temp = messages;
    messages = [];
    return temp;
}

function getDrawables() {
    if (needs_draw) {
        needs_draw = false;
        return image_drawables.concat(text_drawables);
    }
    return [];
}

// ---- Touch Handlers ----


// Handle a single touch as it starts
function handleTouchStart(id, x, y) {
    // let msg = "TouchStart(" + x.toString() + "," + y.toString() + ")";
    // messages.push(msg);
    if(gameStarted)
    {
        if(Math.sqrt((x - leftCircleX ) ** 2 + (y - circleY ) ** 2) < theBobHopeFactor)
        {
            playerMoney -= 1;
            let msg = "UpdateNumber(" + playerMoney + ")";
            messages.push(msg);
            draw_cards()
        }
        if(Math.sqrt((x - rightCircleX ) ** 2 + (y - circleY ) ** 2) < theBobHopeFactor)
        {
            playerMoney += 1;
            let msg = "UpdateNumber(" + playerMoney + ")";
            messages.push(msg);
            draw_cards()
            
        }
        startX = x;
        startY = y;

        let is_mouse_in_card = function(x,y,card) {
        let card_left = card.x;
        let card_right = card.x + card.width;
        let card_top = card.y;
        let card_bottom = card.y + card.height;

        if (x > card_left && x < card_right && y > card_top && y < card_bottom ) {
            return true;
        }

        return false;

    }

    let index = 0;
    for (let card of cards) {
        if (is_mouse_in_card(x, y, card)) {
            current_card_index = index;
            is_dragging = true;
            return;

        }
        index++;

    }

    needs_draw = true;

    }
    
}


// Handle a single touch that has moved
function handleTouchMove(id, x, y) {
    
    if(!is_dragging) {
        return;
    }
    else {

        let dy = y - startY;
        cardMoved = cardMoved - dy;
        if ((cardMoved) > cardSubmitOffset)
        {
            is_dragging=false;
            let msg = "CardSent("+ cards[current_card_index].number +")";
            messages.push(msg);
            resetCard();
            cards[0].number = randomCard();

        }

        let current_card = cards[current_card_index];
        current_card.y += dy;

        draw_cards();

        startX = x;
        startY = y;

    }
}

// Handle a single touch that has ended
function handleTouchEnd(id, x, y) {
    // let msg = "TouchEnd(" + x.toString() + "," + y.toString() + ")";
    // messages.push(msg);
    if (!is_dragging) {
  
        return;
    }
    resetCard();    
    draw_cards();
    is_dragging = false;
}

// Handle a single touch that has ended in an unexpected way
function handleTouchCancel(id, x, y) {
    // let msg = "TouchCancel(" + x.toString() + "," + y.toString() + ")";
    // messages.push(msg);
}

// ---- Start and Update ----

// Called once upon page load (load your resources here)
function controlpadStart(width, height) {
    SCREEN_WIDTH = width;
    SCREEN_HEIGHT = height;
    logo_image.src = "resources/logo.png";

    
    logo_image.onload = function () {
        console.log('loaded ' + this.width + ', ' + this.height);
        console.log('natural: ' + this.naturalWidth + ', ' + this.naturalHeight);

    };
    
}



let get_offset = function() {
    let canvas_offsets = canvas.getBoundingClientRect();
    offset_x = canvas_offsets.left;
    offset_y = canvas_offsets.top;

}

get_offset();
window.onresize = function() {get_offset();}
canvas.onresize = function() {get_offset();}

let randomCard = function() {
    return Math.floor(Math.random()*10);
}

let draw_cards = function() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for (let card of cards) {

        //Draw Submit
        ctx.fillStyle = "black";
        ctx.fillRect(card.x, canvasCenterY - cardSubmitOffset, card.width, card.height);
        ctx.font = "50px Georgia";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.fillText("Submit",card.x + (card.width/2), canvasCenterY - cardSubmitOffset +(card.height/2) ,100);

        //Draw Player Number
        ctx.fillStyle = "black";
        ctx.fillRect(playerNumberX , playerNumberY, playerNumberWidth, playerNumberHeight);
        ctx.font = "50px Georgia";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.fillText(playerMoney, card.x + (playerNumberWidth), canvasCenterY + playerNumberOffset +(playerNumberHeight/2) ,100);

        //Draw Circles

        // Right Circle
        ctx.beginPath();
        ctx.arc(rightCircleX, circleY, theBobHopeFactor, 0, 2*Math.PI);
        
        // the outline
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // the fill color
        ctx.fillStyle = playerColor;
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText("+", rightCircleX, circleY)
        
        // Left Circle
        ctx.beginPath();
        ctx.arc(leftCircleX, circleY, theBobHopeFactor, 0, 2*Math.PI);
        
        // the outline
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // the fill color
        ctx.fillStyle = playerColor;
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText("-", playerNumberX - incrementOffset, playerNumberY + playerNumberWidth/2)

        

//Draw Card
        ctx.fillStyle = playerColor;
        ctx.fillRect(card.x, card.y, card.width, card.height);
        ctx.font = "60px Georgia";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.fillText(card.number, card.x+(card.width/2),card.y+(card.height/2),100);

        
        

    }

}

// Called 30 times per second
function controlpadUpdate() {
    if (image_drawables.length > 0) {
        image_drawables[image_drawables.length-1].rotation += 2 * Math.PI / 60;
        needs_draw = true;
    }
}

// When the user clicks on loginButton, close the modal
function UserValidate() {
    event.preventDefault();
    playerName = document.getElementById("playerName").value;
    playerColor = document.querySelector('input[name="playerColor"]:checked').value;
    
    {
        let msg = "NewPlayer(" + playerName + ")";
        messages.push(msg);

        msg = "PlayerColor(" + playerColor + ")";
        messages.push(msg);
    }
   


    startGame();
  }

  function resetCard() {
    cards[0].y = canvasCenterY;
    cardMoved = 0;
  }

  function startGame() {
    modal.style.display = "none";
    gameStarted = 1;
    cards.push( {x:canvasCenterX,y:canvasCenterY, width:widthCard,height:heightCard,color:playerColor, number:randomCard()});
    
    draw_cards();


  }

