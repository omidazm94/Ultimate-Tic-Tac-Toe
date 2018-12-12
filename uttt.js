let winLvl = [[0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]];
let winGame = [[0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]];
let color;
let turn=0;
let player;
let bigBoard =[];       //which player played in each cell
let tablePlayed = [];   //tables that are complete and no player can click on them
let finalBoard= [];     //who is winner in each table
let winner=false;
let player1Time;
let player2Time;
let deadLine;
let bar ;
let totalBar;
let barWidth;
let totalBarWidth;
let i;
let id;
let nextTable;
let pause=false;
let start=false;
let save=false;
let load=false;
for(let i=0;i<81;i++)
    bigBoard[i]=0;
for(let i=0;i<9;i++){
    finalBoard[i]=0;
    tablePlayed[i]="";
}
 // defining variables

window.onload=initial;

function initial(){
    document.getElementById("enteredTime").addEventListener("keyup" , enteredTime,false ); //getting time
    checkPlayerTurn();
    let cells=getCells();
    document.getElementById("restartBtn").addEventListener("click",resetGame,false);
    document.getElementById("pauseBtn").addEventListener("click",pauseFun,false);
    document.getElementById("startBtn").addEventListener("click",startFun,false);
    document.getElementById("saveBtn").addEventListener("click",saveFun,false);
    document.getElementById("loadBtn").addEventListener("click",loadData,false);
    for(let i=0;i<81;i++)
        cells[i].parentNode.addEventListener("click",cellClicked,false);
    player=turn%2+1;
} // adding eventListeners & initializing variables

function enteredTime(e) {
    document.getElementById("remainingTime1").innerHTML=Math.ceil(gTime()*60) +"";
    document.getElementById("remainingTime2").innerHTML=Math.ceil(gTime()*60) +"";
    player1Time=Math.ceil(gTime()*60)*1000;
    player2Time=Math.ceil(gTime()*60)*1000;
    // deadLine=new Date((new Date().getTime()) + gTime()*60*1000);
    if(e.which===13 || e.keyCode===13){
        document.getElementById("enteredTime").removeEventListener("keyup" , enteredTime,false );
    }
}

function getCells() { return document.getElementsByClassName("aEL");}

function checkPlayerTurn() {
    if (turn%2 ===0) {
        document.getElementById("player1").style.color="red";
        document.getElementById("player2").style.color=null;
    }
    else if(turn%2===1) {
        document.getElementById("player2").style.color="blue";
        document.getElementById("player1").style.color=null;
    }
    for(let i =1; i<=9;i++)
        document.getElementById("table"+i).style.border= "3px whitesmoke solid";

    if(player ===1 && tablePlayed[nextTable-1]!=="played")
        document.getElementById("table"+nextTable).style.border= "4px blue solid";
    else if(player ===2 && tablePlayed[nextTable-1]!=="played" )
        document.getElementById("table"+nextTable).style.border= "4px red solid";

} // shows which player must play on screen

function cellClicked() {
    winner=false;
    start=true;
    let tblNum=parseInt(this.id[1]);
    let pos=this.firstElementChild.id.substr(1,2);
    player=turn%2+1;
    {if(posPlayed(pos))
        bigBoard[pos]=player;
    else
        return;}  // checks if position have been played or not
    if(tablePlayed[nextTable-1]!=="played"){
            if(turn>0 && tblNum!=nextTable){
                // alert("hy");
                return;}
            else if(turn ===0){
                nextTable=parseInt(this.id.substr(2,1));
            }}
    else if(tablePlayed[nextTable-1]==="played") {
        // alert("hey");
        if (tablePlayed[tblNum - 1] === "played")
            return;
    }
    pauseFun();
    {
        let arr=[];
        arr = document.getElementsByClassName("t" + tblNum);
        let x = parseInt(arr[0].firstElementChild.id.substr(1, 2)); // for example table1 starts with 0
        let z = parseInt(arr[8].firstElementChild.id.substr(1, 2)); // and it ends with 8
        for(let i=x;i<=z;i++){
            if(bigBoard[i]===0)
                break;
            if(i===z)
                tablePlayed[tblNum-1]="played";
        }
    } // checks that in little tables draw happened or not. and if draw happened on them add them to played tables
    if (player===1) color = "red";
    else if(player===2) color="blue";
    this.style.backgroundColor=color;
    checkWin2(player,tblNum);
    turn++;
    startFun();
    nextTable=parseInt(this.id.substr(2,1));
    checkPlayerTurn();
    checkDraw();

} // a cell have been clicked on

function posPlayed(position) {

    return bigBoard[position] === 0;

} // if no player chose this cell before returns true

function checkWin2(player, tblNum){
    if(tablePlayed[tblNum-1]!=="played")
    for(let i=0;i<winLvl.length;i++)
        if( bigBoard[winLvl[i][0]+(9*(tblNum-1))]===player &&
            bigBoard[winLvl[i][1]+(9*(tblNum-1))]===player &&
            bigBoard[winLvl[i][2]+(9*(tblNum-1))]===player) {
            finalBoard[tblNum-1]=player;
            document.getElementById("t"+tblNum).firstElementChild.style.borderColor="dark"+color;
            document.getElementById("t"+tblNum).firstElementChild.style.backgroundColor="dark"+color;
            let k=document.getElementsByClassName("t"+tblNum);
            for(let j=0;j<=8;j++){
                k[j].style.backgroundColor="dark"+color;
                k[j].style.border=".1em transparent solid";
            }
            tablePlayed[tblNum-1]="played";
            checkGameWinner(player);
        }

} // who is the winner in every little table

function checkGameWinner(player) {
    for(let j=0;j<winGame.length;j++)
        if( finalBoard[winGame[j][0]]===player &&
            finalBoard[winGame[j][1]]===player &&
            finalBoard[winGame[j][2]]===player && winner===false) { // barande???
            alert("PLAYER " + player +" WON");
            winner=true;

        }
} // who won the game

function gTime() {return document.getElementById("enteredTime").value;}

function pauseFun() {
    pause=true;
    clearInterval(id);
    clearInterval(i);
}

function startFun() {
    if(pause===true || start===true){
        pause=false;
        start=false;
        setTimeout(countDown(turn%2), 0);
    }
}

function countDown (pl){
    pl++;
    bar = document.getElementById("myBar"+pl);
    totalBar = document.getElementById("myProgress"+pl+"");
    barWidth=parseInt(getComputedStyle(bar).width);
    totalBarWidth =parseInt(getComputedStyle(totalBar).width);
    let remainingTime;
    if(turn%2===0)
        remainingTime=player1Time;
    else
        remainingTime=player2Time;
    deadLine=new Date((Date.now()) + remainingTime);
    let time=Math.ceil(gTime()*60);
    id = setInterval(frame, 0);
    function frame() {
        if(winner===true)
        {
            clearInterval(id);
        }
        if(turn%2===0)
            remainingTime=player1Time;
        else
            remainingTime=player2Time;
        remainingTime = Date.parse(deadLine+"") - Date.now();
        if(turn%2===0)
            player1Time=remainingTime;
        else
            player2Time=remainingTime;
        document.getElementById("remainingTime"+pl+"").innerHTML=Math.ceil(remainingTime/1000) +"";
        barWidth =(time-Math.ceil(remainingTime/1000))/time;
        bar.style.width = barWidth*100 + '%';
        checkTimeout();


    }
}

function checkTimeout() {
    if (player1Time<=0){
        pauseFun();
        alert("player 1 lost");

    }
    else if(player2Time<=0){
        pauseFun();
        alert("player 2 lost");
    }

}

function checkDraw() {
    for(let i=0;i<9;i++){
        if(tablePlayed[i]==="played" ){
            if(i===8 && winner===false){
                alert("draw");
                pauseFun();
            }
            // else
            //     continue;
        }
        else
            break;
    }
} // check if draw happens or not

// *********************** work on tblNUm on resetGame
function resetGame(){
    pauseFun();
    save=false;
    pause=false;
    start=false;
    let cells=getCells();
    turn=0;
    for(let i=0;i<=80;i++)
        bigBoard[i]=0;
    finalBoard= [];
    // positionPlayed=[];
    tablePlayed = [];
    for(let i=0;i<81;i++) {
        cells[i].parentNode.style.backgroundColor = null;
    }
    for(let j=1;j<=9;j++){
        document.getElementById("t"+j).firstElementChild.style.backgroundColor=null;
        document.getElementById("t"+j).firstElementChild.style.borderColor=null;
    }
    document.getElementById("player2").style.color=null;
    document.getElementById("player1").style.color=null;
    winner=false;
    player1Time=Math.ceil(gTime()*60);
    player2Time=Math.ceil(gTime()*60);
    document.getElementById("remainingTime1").innerHTML="";
    document.getElementById("myBar1").style.width=0;
    document.getElementById("remainingTime2").innerHTML="";
    document.getElementById("myBar2").style.width=0;
    document.getElementById("enteredTime").addEventListener("keyup" , enteredTime,false );
    for(let i =1; i<=9;i++)
        document.getElementById("table"+i).style.border= "3px whitesmoke solid";
    for(let i=1;i<=9;i++){
        let k=document.getElementsByClassName("t"+i);
        for(let j=0;j<=8;j++)
            k[j].style.border=".1em whitesmoke solid";}
    nextTable=0;
    alert("lets play again !");
    checkPlayerTurn();


} // reset the game so you can play again

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

function saveFun(){
    save=true;
    pauseFun();
    let s = document.createElement("script");
    let saveTP=JSON.stringify(tablePlayed);
    let saveBB=JSON.stringify(bigBoard);
    let saveFB=JSON.stringify(finalBoard);
    let saveT=JSON.stringify(turn);
    let saveNT=JSON.stringify(nextTable);
    let saveP1T=JSON.stringify(player1Time);
    let saveP2T=JSON.stringify(player2Time);
    s.src = "db.php?tp="+saveTP
        +"&bb="+saveBB
        +"&fb="+saveFB
        +"&t="+saveT
        +"&nt="+saveNT
        +"&p1t="+saveP1T
        +"&p2t="+saveP2T
        +"&save="+save
        +"&date="+new Date();
    document.body.appendChild(s);
    //window.locsation.href = "db.php?w1=" + hello; $_GET
    setTimeout(function () {
        alert("Game Saved");
    },1000);
    save=false;
}

function loadData() {
    load=true;
    let s = document.createElement("script");
    s.src = "db.php?load="+load+"&date="+new Date();
    document.body.appendChild(s);
    var r = confirm("Are You Sure?");
    if (r === true) {
        let xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for older browsers
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let load=JSON.parse(this.responseText);
                let loadTP=JSON.parse(load[2]);
                let loadBB=JSON.parse(load[0]);
                let loadFB=JSON.parse(load[1]);
                let loadT=JSON.parse(load[3]);
                let loadNT=JSON.parse(load[4]);
                let loadP1T=JSON.parse(load[5]);
                let loadP2T=JSON.parse(load[6]);
                for(let i=0;i<=80;i++){
                    bigBoard[i]=loadBB[i];
                }
                for(let i=0;i<=8;i++){
                    tablePlayed[i]=loadTP[i];
                    finalBoard[i]=loadFB[i];

                }
                turn=loadT;
                nextTable=loadNT;
                player1Time=loadP1T;
                player2Time=loadP2T;
                setTimeout(function () {
                    loadGame();
                },2000);
                loadGame();
            }
        };
        xmlhttp.open("GET", "Helper/load.json", true);
        xmlhttp.send();
    }

}

function loadGame() {
    let cells=getCells();
    for(let i=0;i<81;i++) {
        cells[i].parentNode.style.backgroundColor = null;
        document.getElementById("d"+i).parentNode.style.border=".1em whitesmoke solid";
    }
    for(let j=1;j<=9;j++){
        document.getElementById("t"+j).firstElementChild.style.backgroundColor=null;
        document.getElementById("t"+j).firstElementChild.style.borderColor=null;
    }
    document.getElementById("player2").style.color=null;
    document.getElementById("player1").style.color=null;
    document.getElementById("remainingTime1").innerHTML="";
    document.getElementById("myBar1").style.width=0;
    document.getElementById("remainingTime2").innerHTML="";
    document.getElementById("myBar2").style.width=0;
    for(let i =1; i<=9;i++)
        document.getElementById("table"+i).style.border= "3px whitesmoke solid";
    pauseFun();
    for(let i=0;i<=80;i++){
        if(bigBoard[i]===1){
            document.getElementById("d"+i).parentNode.style.backgroundColor="red";}
        else if(bigBoard[i]===2)
            document.getElementById("d"+i).parentNode.style.backgroundColor="blue";
    }
    if((turn%2+1) ===1 && tablePlayed[nextTable-1]!=="played")
        document.getElementById("table"+nextTable).style.border= "4px blue solid";
    else if((turn%2+1) ===2 && tablePlayed[nextTable-1]!=="played" )
        document.getElementById("table"+nextTable).style.border= "4px red solid";
    document.getElementById("remainingTime"+1+"").innerHTML=Math.ceil(player1Time/1000) +"";
    document.getElementById("remainingTime"+2+"").innerHTML=Math.ceil(player2Time/1000) +"";
    load=false;
    initial();

}