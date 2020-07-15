

var scores, roundScore, activePlayer, isPlaying, prev;


init();

function init(){
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    isPlaying = 1;
    document.querySelector(".dice").style.display = "none";
    document.getElementById("score-0").textContent = "0";
    document.getElementById("current-0").textContent = "0";
    document.getElementById("score-1").textContent = "0";
    document.getElementById("current-1").textContent = "0";
    document.getElementById("name-0").textContent = "Player 1";
    document.getElementById("name-1").textContent = "Player 2";
    document.querySelector(".player-0-panel").classList.remove("winner");
    document.querySelector(".player-0-panel").classList.add("active");
    document.querySelector(".player-1-panel").classList.remove("winner");

}

// Array with both players scores amount
// scores = [0,0];

// //
// roundScore = 0;

// // 0~represents player 1 and 1~represents player 2
// activePlayer = 0;

// A SETTER
//document.querySelector("#current-"+activePlayer).textContent = dice;

//Able to use document querySelector with innerHTML to manipulate the html. Only works with innerHtml 
//document.querySelector("#current-"+activePlayer).innerHTML = '<strong>' + dice + '</strong>';

//A GETTER
// var x = document.querySelector("").textContent;
// console.log(x);


//ADD event listener takes two arguments
document.querySelector(".btn-roll").addEventListener("click",function(){
    if(isPlaying)
    {
        // 1. Roll the dice
        const  dice = Math.floor(Math.random()*6) +1;
        
        
        // 2. Display the dice

        const diceDOM = document.querySelector(".dice");
        diceDOM.style.display = "block";
        //change the image 
        diceDOM.src = "dice-" + dice +".png";
        
        // 3. Update the round score if the rolled number is was NOT a 1
        if(dice === 6 && prev === 6){
            scores[activePlayer] = 0;
            document.querySelector("#score-"+activePlayer).textContent = "0";
            nextPlayer();

        }
        else if(dice !== 1){
            roundScore += dice;
            document.querySelector("#current-"+ activePlayer).textContent = roundScore;
            
        }
        else{
            nextPlayer();
        }

        prev = dice;
        
    }


});

document.querySelector(".btn-hold").addEventListener("click",function(){
    // ADD current score to global score
    if(isPlaying){
        scores[activePlayer] += roundScore;

        //Update UI
        document.querySelector("#score-"+ activePlayer).textContent = scores[activePlayer];
        //Checking if player won the game
        if(scores[activePlayer] >= 21){
            document.querySelector("#name-"+activePlayer).textContent = "Winner!";
            document.querySelector(".player-"+activePlayer+"-panel").classList.add("winner");
            document.querySelector(".player-"+activePlayer+"-panel").classList.remove("active");
            document.querySelector(".dice").style.display = "none";
            isPlaying = 0;
        }
        else{
            nextPlayer();
        }
    }
});


function nextPlayer(){

    roundScore = 0;
    activePlayer === 0 ? activePlayer = 1: activePlayer = 0;
    document.getElementById("current-0").textContent = "0";
    document.getElementById("current-1").textContent = "0";

    document.querySelector(".player-0-panel").classList.toggle("active");
    document.querySelector(".player-1-panel").classList.toggle("active");

    document.querySelector(".dice").style.display = "none";

}

//Initialise when clicking on new game button
document.querySelector(".btn-new").addEventListener("click",init);



