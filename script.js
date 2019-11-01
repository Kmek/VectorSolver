// JavaScript for Vector Solver

/******************** Canvas Setup ********************/
const canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// ctx.lineWidth = 2;
ctx.scale(1, 1);
var w = ctx.canvas.width;
var h = ctx.canvas.height;

const draw = {
    circle: function(xy, radius, color) {
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], radius, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.stroke();
    },
    line: function(xy1, xy2, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(xy1[0], xy1[1]);
        ctx.lineTo(xy2[0], xy2[1]);
        ctx.stroke();
    },
    dot: function(xy, radius, color) {
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    },
}

// Draw x and y axis
ctx.lineWidth = 4;
draw.line([w/2, 0], [w/2, h], "black")
draw.line([0, h/2], [w, h/2], "black")
ctx.lineWidth = 2;

/******************** Polar Conversions ********************/
// For converting between radians and degrees
function toRadians(degrees) {
    return (degrees * (Math.PI / 180));
}
function toDegrees(radians) {
    return (radians * (180 / Math.PI)); //* 100) / 100 );
}

// For converting from polar to rectangular coordinates
function toPolarX(radius, degrees, centerOn) {
    var temp = radius * Math.cos(toRadians(degrees));
    temp += centerOn;
    //temp = Math.round(temp * 100) / 100; 
    return (temp);
}
function toPolarY(radius, degrees, centerOn) {
    let temp = radius * Math.sin(toRadians(degrees) * -1);
    temp += centerOn;
    //temp = Math.round(temp * 100) / 100; 
    return (temp);
}
function toPolar(radius, degrees, centerOn) {
    let temp = [toPolarX(radius, degrees, centerOn[0]), toPolarY(radius, degrees, centerOn[1])];
    return temp;
}

// For getting the distance between two points
function toPolarR(xy) {
    let centerOn = [w/2, h/2]
    let x = xy[0] - centerOn[0];
    let y = xy[1] - centerOn[1];
    let r = Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);
    return (r);
}
// For getting the current degree of a rect coord relative to a center coord
function toPolarDeg(xy) {
    let centerOn = [w/2, h/2]
    let x = xy[0] - centerOn[0];
    let y = (xy[1] - centerOn[1]) * -1;
    let deg = toDegrees(Math.atan(y/x));
    
    if (x < 0) {
        deg += 180;
    }
    // Remove negative zero??
    if (deg === 0) {
        deg = 0;
    }
    if(deg < 0) {
        deg += 360;
    }
    
    return deg;
}

/******************** Vector Class ********************/
class Vector {
    constructor (x, y) {
        this.x = x
        this.y = y
        this.magnitude = toPolarR([this.x, this.y])
        this.degree = toPolarDeg([this.x, this.y])
        this.color = "#000000"
        this.active = true
    }

    colorChange() {
        // TODO
    }

    draw() {
        // TODO
    }

    toggleActive() {
        if (this.active) 
            this.active = false
        else
            this.active = true
        
        // TODO add toggle to checkbox check
    }
}

// Array of vectors
var vectors = []

// Redraw all vectors
function redraw() {
    for (i = 0; i < vectors.length; i++) {
        if (vectors[i].active)
            vectors[i].draw()
    }
}

/******************** Adding A Vector ********************/
// Parent div for all vectors
const vectorDiv = document.getElementById("vectors");

// Add a vector function 
function addVector() {
    let newVector = document.createElement("div");
    newVector.setAttribute("class", "vector center lilShadow")

    let colorpicker = document.createElement("button")
    colorpicker.setAttribute("class", "colorpicker lilShadow")
    newVector.appendChild(colorpicker)

    let magnitudeInput = document.createElement("input")
    magnitudeInput.setAttribute("type", "text")
    // magnitudeInput.setAttribute("class", "inputMagnitude")
    newVector.appendChild(magnitudeInput)

    let magnitudeText = document.createElement("p")
    magnitudeText.innerHTML = "magnitude at"
    newVector.appendChild(magnitudeText)

    let degreeInput = document.createElement("input")
    degreeInput.setAttribute("type", "text")
    newVector.appendChild(degreeInput)

    let orText = document.createElement("p")
    orText.innerHTML = "or ("
    newVector.appendChild(orText)

    let xInput = document.createElement("input")
    xInput.setAttribute("type", "text")
    newVector.appendChild(xInput)

    let commaText = document.createElement("p")
    commaText.innerHTML = ","
    newVector.appendChild(commaText)

    let yInput = document.createElement("input")
    yInput.setAttribute("type", "text")
    newVector.appendChild(yInput)

    let closingText = document.createElement("p")
    closingText.innerHTML = ")"
    newVector.appendChild(closingText)

    let checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.setAttribute("class", "activeCheck")
    checkbox.checked = true;
    // checkbox.setAttribute("onClick", toggleActive())
    newVector.appendChild(checkbox)

    // Add new vector div to vectors div
    vectorDiv.appendChild(newVector)
}
