// Game Constants & Variables


function prepareToast (props) {
    let ativeTimeout, start, remaining;

    let toast = `<div class="toast ${props.position}" id="toast"></div>`
    let toastDiv = null;

    if (!document.getElementById("toast"))
        document.body.insertAdjacentHTML("afterbegin", toast);
    else {
        const toastDivs = document.querySelectorAll("#toast");

        for (let div of toastDivs) {
            if (div.classList.contains(props.position)) {
                toastDiv = div;
                break;
            }
        }

        if (!toastDiv) {
            document.body.insertAdjacentHTML("afterbegin", toast);
            const toastDivList = document.querySelectorAll("#toast")
            toastDiv = [...toastDivList][0];
        }
    }

    if (!toastDiv)
        toastDiv = document.getElementById("toast");

    let activeAnimationClass = null;
    let closeAnimationClass = null;

    if ((props.position === "topRight") || (props.position === "bottomRight")) {
        activeAnimationClass = "rightActiveAnimation";
        closeAnimationClass = "rightCloseAnimation";
    } else if ((props.position === "topLeft") || (props.position === "bottomLeft")) {
        activeAnimationClass = "leftActiveAnimation";
        closeAnimationClass = "leftCloseAnimation";
    } else {
        activeAnimationClass = `${props.position}ActiveAnimation`;
        closeAnimationClass = `${props.position}CloseAnimation`;
    }

    let toastContainer = `
        <div class="toastContainer ${activeAnimationClass}" id="toastContainer">
            <div class="toastContent">
                <div class="toastTitleContainer">
                    <span class="toastTypeIcon ${props.type}">${props.svg}</span>
                    <p class="toastTitle">${props.title}</p>
                </div>
                <p class="toastMsg">${props.msg}</p>
            </div>
            <span class="toastCloseBtn" id="toastCloseBtn" title="Close"><p></p></span>
        </div>
    `

    toastDiv.insertAdjacentHTML("beforeend", toastContainer);
    const toastContainerDivList = toastDiv.querySelectorAll("#toastContainer");
    const toastContainerDiv = [...toastContainerDivList].pop();

    function handleToast () {
        toastContainerDiv.classList.remove(activeAnimationClass);
        toastContainerDiv.classList.add(closeAnimationClass);

        setTimeout(function () {
            (toastContainerDiv.parentNode).removeChild(toastContainerDiv);
        }, 200);
    }

    const activateTimeout = (timer) => {
        ativeTimeout = setTimeout(handleToast, timer);
        start = Date.now();
    }

    const toastCloseBtnList = toastDiv.querySelectorAll("#toastCloseBtn");
    const toastCloseBtn = [...toastCloseBtnList].pop();
    toastCloseBtn.onclick = function () { handleToast(); }

    activateTimeout(2000);

    toastContainerDiv.onclick = function () { clearTimeout(ativeTimeout); }
    if (window.matchMedia("(any-hover: hover)").matches || window.matchMedia("(hover: hover)").matches) {
        toastContainerDiv.onmouseover = function () { clearTimeout(ativeTimeout); }
        toastContainerDiv.onmouseleave = function () { 
            remaining = (5000 - (Date.now() - start));
            if (!(remaining > 0))
                handleToast();
            else
                activateTimeout(remaining);
        }
    }
}

 const successToast = (toast) => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
        </svg>
    `

    const props = {
        position: toast.position,
        title: toast.title,
        msg: toast.message,
        svg: svg,
        type: "successToast"
    }

    prepareToast(props);
}

const errorToast = (toast) => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
        </svg>
    `

    const props = {
        position: toast.position,
        title: toast.title,
        msg: toast.message,
        svg: svg,
        type: "errorToast"
    }

    prepareToast(props);
}



let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 12;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];

food = { x: 6, y: 7 };

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}
let passedBestScore=false;
function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        const toastMsg = {
            position: "topLeft",
            title: "Game Over",
            message: "Press Any Key to Play Again!"
        }
        
        errorToast(toastMsg);

        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        passedBestScore=false;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > bestscoreval) {
            if(!passedBestScore){
                const toastMsg = {
                    position: "topLeft",
                    title: "New Best Score",
                    message: "Congratulations! You have created new Best Score."
                }
                
                successToast(toastMsg);
                passedBestScore=true;
            }
            bestscoreval = score;
            localStorage.setItem("bestscore", JSON.stringify(bestscoreval));
            bestBox.innerHTML = "Best: " + bestscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);
}

// Main logic starts here
musicSound.play();
let bestscore = localStorage.getItem("bestscore");
if (bestscore === null) {
    bestscoreval = 0;
    localStorage.setItem("bestscore", JSON.stringify(bestscoreval))
}
else {
    bestscoreval = JSON.parse(bestscore);
    bestBox.innerHTML = "Best: " + bestscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 }
    // Start the game
    if(musicSound.paused){
        musicSound.play();
    }
     
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});