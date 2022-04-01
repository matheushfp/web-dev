// Random numbers 1 - 6
var randomNumber1 = Math.floor((Math.random() * 6)) + 1;
var randomNumber2 = Math.floor((Math.random() * 6)) + 1;

// Changing dices images
var dices = document.querySelectorAll("div img");

var img1 = "images/dice" + randomNumber1 + ".png";
var img2 = "images/dice" + randomNumber2 + ".png";

dices[0].setAttribute("src", img1);
dices[1].setAttribute("src", img2);

// Check winner
var title = document.querySelector("h1");

if (randomNumber1 > randomNumber2){
    title.textContent = "🚩 Player 1 Wins!";
}else if (randomNumber2 > randomNumber1){
    title.textContent = "Player 2 Wins! 🚩";
}else{
    title.textContent = "Draw!";
}