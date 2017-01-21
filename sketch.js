var planets, running;

function setup() {
    var holder = select("#holder");
    createCanvas(holder.width, holder.height).parent('holder');
    planets = [];
    running = false;
}

function draw() {
    background(50);
    ellipse(width/2, height/2, 50, 50);
}

function setPbutton() {
    var button = document.getElementById("pbutton");
    if (running) {
	button.innerHTML = "Pause";
	button.setAttribute("onclick", "pause()");
    } else {
	button.innerHTML = "Play";
	button.setAttribute("onclick", "play()");
    }
}

function play() {
    running = true;
    setPbutton();
}

function pause() {
    running = false;
    setPbutton();
}
