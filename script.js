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
    erase: function() {
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        ctx.fillStyle = "white";
        ctx.fill();
    },
}

function getMaxMag() {
    let maxMag = 0;
    for (let i = 0; i < vectors.length; i++) {
        if (vectors[i].active && vectors[i].magnitude > maxMag)
            maxMag = vectors[i].magnitude
    }

    if (maxMag != 0) 
        return maxMag

    return (w/2)
}

/******************** Polar Conversions ********************/
// For converting between radians and degrees
function toRadians(degrees) {
    return (degrees * (Math.PI / 180));
}
function toDegrees(radians) {
    return (radians * (180 / Math.PI)); //* 100) / 100 );
}

// For converting from polar to rectangular coordinates
function toPolarX(radius, degrees) {
    var temp = radius * Math.cos(toRadians(degrees));
    //temp = Math.round(temp * 100) / 100; 
    return (temp);
}
function toPolarY(radius, degrees) {
    let temp = radius * Math.sin(toRadians(degrees) * -1);
    //temp = Math.round(temp * 100) / 100; 
    return (temp);
}
function toPolar(radius, degrees) {
    let temp = [toPolarX(radius, degrees), toPolarY(radius, degrees)];
    return temp;
}

// For getting the distance between two points
function toPolarR(xy) {
    let x = xy[0];
    let y = xy[1];
    let r = Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);
    return (r);
}
// For getting the current degree of a rect coord relative to a center coord
function toPolarDeg(xy) {
    console.log(xy)
    let x = xy[0];
    let y = xy[1] * -1;
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
    constructor (x, y, id) {
        this.x = x
        this.y = y
        this.id = id
        this.magnitude = 0 
        this.degree = 0 
        this.color = "black"
        this.active = true
    }

    colorChange() {
        // TODO
    }

    draw(scale) {
        draw.line([w/2, h/2], [(this.x * scale) + (w/2), (this.y * scale) + (h/2)], this.color)
        draw.dot([(this.x * scale) + (w/2), (this.y * scale) + (h/2)], 3, this.color)
    }

    toggleActive() {
        if (this.active) 
            this.active = false
        else
            this.active = true
        
        // TODO add toggle to checkbox check
    }

    calcXY() {
        let vector = document.getElementById(this.id)
        
        this.magnitude = vector.children[1].value
        this.degree = vector.children[3].value
        if (this.degree > 360) 
            this.degree = this.degree % 360

        this.x = toPolarX(this.magnitude, this.degree)
        this.y = toPolarY(this.magnitude, this.degree)

        vector.children[5].value = this.x * 1
        vector.children[7].value = this.y * -1

        redraw()
    }

    calcMagDeg() {
        let vector = document.getElementById(this.id)
        
        this.x = vector.children[5].value * 1
        this.y = vector.children[7].value * -1

        this.magnitude = toPolarR([this.x, this.y])
        this.degree = toPolarDeg([this.x, this.y])

        vector.children[1].value = this.magnitude
        vector.children[3].value = this.degree

        redraw()
    }
}

// Array of vectors
var vectors = []

// Redraw all vectors
function redraw() {
    // Clear canvas
    draw.erase()
    // Scale canvas for new vector values
    let scale = ((w/2) / (getMaxMag() * 1.2))

    // Draw x and y axis
    ctx.lineWidth = 4;
    draw.line([w/2, 0], [w/2, h], "black")
    draw.line([0, h/2], [w, h/2], "black")
    ctx.lineWidth = 2;

    let totalX = 0
    let totalY = 0
    for (i = 0; i < vectors.length; i++) {
        if (vectors[i].active) {
            vectors[i].draw(scale)
            totalX += vectors[i].x
            totalY += vectors[i].y
        }
    }
}
// Initial canvas lines
redraw()

/******************** Adding A Vector ********************/
// Parent div for all vectors
const vectorDiv = document.getElementById("vectors");

function idIndex(string) {
    return string.substring(6, string.length)
}

// Add a vector function 
function addVector() {
    let id = ("vector" + vectors.length)

    let newVector = document.createElement("div");
    newVector.id = id
    newVector.setAttribute("class", "vector center lilShadow")

    let colorpicker = document.createElement("button")
    colorpicker.setAttribute("class", "colorpicker lilShadow")
    newVector.appendChild(colorpicker)

    let magnitudeInput = document.createElement("input")
    magnitudeInput.setAttribute("type", "text")
    magnitudeInput.value = 0
    // magnitudeInput.setAttribute("OnInput", ("calcVectorXY(" + id + ")"))
    magnitudeInput.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].calcXY()"))
    newVector.appendChild(magnitudeInput)

    let magnitudeText = document.createElement("p")
    magnitudeText.innerHTML = "at"
    newVector.appendChild(magnitudeText)

    let degreeInput = document.createElement("input")
    degreeInput.setAttribute("type", "text")
    degreeInput.value = 0
    degreeInput.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].calcXY()"))
    newVector.appendChild(degreeInput)

    let orText = document.createElement("p")
    orText.innerHTML = "or ("
    newVector.appendChild(orText)

    let xInput = document.createElement("input")
    xInput.setAttribute("type", "text")
    xInput.value = 0
    xInput.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].calcMagDeg()"))
    newVector.appendChild(xInput)

    let commaText = document.createElement("p")
    commaText.innerHTML = ","
    newVector.appendChild(commaText)

    let yInput = document.createElement("input")
    yInput.setAttribute("type", "text")
    yInput.value = 0
    yInput.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].calcMagDeg()"))
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

    vectors.push(new Vector(0, 0, id))
}
