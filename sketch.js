var planets, running, chooseXY, selected, chooseV, chooseR, chooseM, chooseFixed, chooseX, chooseY;

function setup() {
    var holder = select("#holder");
    createCanvas(holder.width, holder.height).parent('holder');
    planets = [];
    running = false;
    chooseXY = false;
    noStroke();
    selected = null;
}

function draw() {
    background(50);
    if (running)
        update();
    planets.forEach(function (p) {
        paint(p);
    });

    if (frameCount % 30 == 0)
        updateSelected();

    if (chooseXY) {
        fill(255);
        ellipse(mouseX, mouseY, chooseR*2, chooseR*2);
    } else if (chooseV) {
        fill(255);
        ellipse(chooseX, chooseY, chooseR*2, chooseR*2);
        stroke(150);
        line(chooseX, chooseY, mouseX, mouseY);
        noStroke();
    }
}

function update() {
    for (var i = planets.length - 1; i >=0; i--) {
        planets[i].ax = 0;
        planets[i].ay = 0;
        for (var j = planets.length - 1; j >=0; j--) {
            if (i != j && !planets[i].fixed) {
                if (gravitate(planets[i], planets[j])) {
                    console.log('rip planet')
                    console.log(planets[i])
                    if (planets[i] == selected)
                        selected = null;
                    planets.splice(i, 1);
                    break;
                }
            }
        }
    }

    planets.forEach(function(p) {
        if (!p.fixed)
            p.move();
    });
}

function updateSelected() {
    var m, vx, vy, ax, ay, extra;
    if (selected == null) {
        m = "",
            vx = "",
            vy = "",
            ax = "",
            ay = "",
            extra = "<b>Select a planet</b>";
    } else {
        m = "" + selected.mass,
            vx = "" + selected.vx,
            vy = "" + selected.vy,
            ax = "" + selected.ax,
            ay = "" + selected.ay,
            extra = "";
    }

    select("#mass").html(m);
    select("#velocityx").html(vx);
    select("#velocityy").html(vy);
    select("#accelerationx").html(ax);
    select("#accelerationy").html(ay);
    select("#selected").html(extra);
}

function deleteSelected() {
    planets.splice(planets.indexOf(selected), 1);
    selected = null;
}

function mouseClicked() {
    if (chooseXY && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        chooseX = mouseX,
            chooseY = mouseY;

        chooseXY = false;
        chooseV = true;
        select("#createStatus").html("<b>Choose the initial velocity</b>");

        if (chooseFixed)
            mouseClicked();
    } else if (chooseV && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        var vx = (mouseX - chooseX)/60,
            vy = (mouseY - chooseY)/60;

        planets.push(createPlanet(chooseX, chooseY, vx, vy, chooseM, chooseR, chooseFixed));
        select("#massInput").value(0);
        select("#radiusInput").value(0);
        select("#fixedInput").checked(false);
        chooseV = false;
        select("#createStatus").html("<button onclick='readyPlanet()'>Create Planet</button>");
    } else {
        planets.forEach(function(p) {
            if (dist(mouseX, mouseY, p.x, p.y) < p.radius)
                selected = p;
        });
    }
}

function paint(p) {
    fill(p.r, p.g, p.b);
    if (p == selected)
        stroke(255);
    else
        noStroke();
    ellipse(p.x, p.y, p.radius*2, p.radius*2);
    if (p == selected) {
        stroke(0, 0, 255);
        line(p.x, p.y, p.x + 60*p.ax, p.y + 60*p.ay);
        stroke(255, 0, 0);
        line(p.x, p.y, p.x + 60*p.vx, p.y + 60*p.vy);
    }
}

function reset() {
    selected = null;
    planets = [];
    pause();
}

function createPlanet(nx, ny, nvx, nvy, nmass, nradius, nfixed) {
    return {
        x : nx,
        y : ny,
        vx : nvx,
        vy : nvy,
        ax : 0,
        ay : 0,
        mass : nmass,
        radius : nradius,
        fixed : nfixed,
        r : (Math.random()*150+50),
        g : (Math.random()*150+50),
        b : (Math.random()*150+50),
        move : function () {
            this.vx += this.ax;
            this.vy += this.ay;
            this.x += this.vx;
            this.y += this.vy;
        }
    };
}

function gravitate(p1, p2) {
    var m = p1.mass*p2.mass,
        d = dist(p1.x, p1.y, p2.x, p2.y),
        g = m/(d*d),
        deltax = p1.x - p2.x,
        deltay = p1.y - p2.y;
    p1.ax += g*deltax/d/p1.mass*-1;
    p1.ay += g*deltay/d/p1.mass*-1;

    return (dist(p1.x, p1.y, p2.x, p2.y) <= p1.radius + p2.radius) && (p1.mass <= p2.mass);
}

function readyPlanet() {
    chooseM = int(select("#massInput").value()),
        chooseR = int(select("#radiusInput").value()),
        chooseFixed = select("#fixedInput").checked();

    if (chooseM > 0 && chooseR > 0) {
        chooseXY = true;
        select("#createStatus").html("<b>Choose a position</b>");
    }
}

function setPbutton() {
    var button = select("#pbutton");
    if (running) {
        button.html("Pause");
        button.attribute("onclick", "pause()");
    } else {
        button.html("Play");
        button.attribute("onclick", "play()");
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
