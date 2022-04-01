var level = 0;
var started = false;
var buttons = $(".btn");
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];


function nextSequence(){
    // Change header
    level++;
    $("h1").text("Level " + level);
    userClickedPattern = [];

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];

    gamePattern.push(randomChosenColour);

    // Highlight button and play sound
    $("#" + randomChosenColour).fadeOut(75).fadeIn(75);
    playSound(randomChosenColour);
}

function playSound(name){
    var sound = new Audio("sounds/" + name + ".mp3");
    sound.volume = 0.4;
    sound.play();
}

function animatePress(currentColour){
    $("#" + currentColour).addClass("pressed");

    // remove pressed class after 100ms
    setTimeout(function (){
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

// Check if any button receive a click
buttons.on("click", function (event) {
    var userChosenColour = event.target.id;

    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    playSound(userChosenColour);
    checkAnswer(userClickedPattern.length - 1); // index of last answer

});

// Starting the game
$(document).on("keypress", function (){
    if(!started){
        started = true;
        nextSequence();
    }
});

function checkAnswer(currentLevel){
    if(userClickedPattern[currentLevel] === gamePattern[currentLevel]){
        // check if sequence is finished
        if(userClickedPattern.length === gamePattern.length){
            setTimeout(nextSequence, 1000);
        }
    }else{
        playSound("wrong");
        
        $("body").addClass("game-over");
        setTimeout(function (){
            $("body").removeClass("game-over");
        }, 200);

        $("h1").text("Game Over, Press Any Key to Restart");
        startOver();

    }
}

function startOver(){
    level = 0;
    gamePattern = [];
    started = false;
}