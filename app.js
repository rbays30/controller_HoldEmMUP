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

//Card Moving Variables
let cards=[];
let current_card_index = null;
let is_dragging = false;
let startX;
let startY;
let cardMoved = 0;

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
        console.log(cardMoved);
        if ((cardMoved) > 300)
        {
            let msg = "CardSent("+ cards[current_card_index].number +")";
            console.log(msg);
            messages.push(msg);
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
    event.preventDefault();
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
    return Math.floor(Math.random()*10)
}




cards.push( {x:200,y:500, width:200,height:200,color:playerColor, number:randomCard()});


let mouse_down = function(event) {
    event.preventDefault();

    startX = parseInt(event.clientX - offset_x);
    startY = parseInt(event.clientY - offset_y);

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
        if (is_mouse_in_card(startX, startY, card)) {
            current_card_index = index;
            is_dragging = true;
            return;

        }
        index++;

    }

}


let draw_cards = function() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for (let card of cards) {
        ctx.fillStyle = playerColor;
        ctx.fillRect(card.x, card.y, card.width, card.height, card.number);
        ctx.font = "60px Georgia";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.fillText(card.number,card.x+(card.width/2),card.y+(card.height/2),100);
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
   


    modal.style.display = "none";
    gameStarted=1;
    draw_cards();
  }

