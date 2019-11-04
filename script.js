// JavaScript for Vector Solver

/******************** Canvas Setup ********************/
const canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.scale(1, 1);
var w = ctx.canvas.width;
var h = ctx.canvas.height;

const draw = {
    line: function(xy1, xy2, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(xy1[0], xy1[1]);
        ctx.lineTo(xy2[0], xy2[1]);
        ctx.stroke();
    },
    dashedLine: function(xy1, xy2, color) {
        // draw.line(xy1, xy2, color)
        for (let i = 0; i < 10; i += 2) {
            let x1 = ((xy2[0] - xy1[0]) * ((i + 1) / 10)) + xy1[0]
            let y1 = ((xy2[1] - xy1[1]) * ((i + 1) / 10)) + xy1[1]
            let x2 = ((xy2[0] - xy1[0]) * ((i + 2) / 10)) + xy1[0]
            let y2 = ((xy2[1] - xy1[1]) * ((i + 2) / 10)) + xy1[1]
            draw.line([x1, y1], [x2, y2], "black")
        }
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
    arrow: function(deg, xy, radius, color) {
        let degree = 210 - (deg * -1)
        draw.line(xy, [toPolarX(radius, degree) + xy[0], toPolarY(radius, degree) + xy[1]], color)
        degree = 150 - (deg * -1)
        draw.line(xy, [toPolarX(radius, degree) + xy[0], toPolarY(radius, degree) + xy[1]], color)
    }
}

/******************** Rounding Function ********************/
const decBtn = document.getElementById("decBtn")
var decimals = 2;

function round(num) {
    if (num[num.length - 1] == ".")
        return num

    let zeroes = Math.pow(10, decimals)
    let result = Math.round(num * zeroes) / zeroes
    return result
}

function incDecimal() {
    switch(decimals) {
        case 0:
            decBtn.innerHTML += "."
        case 1:
        case 2:
        case 3: 
            decimals++
            decBtn.innerHTML += "0"
            break;
        default:
            decimals = 0
            decBtn.innerHTML = "0"
            break;
    }
}

/******************** Polar Conversions ********************/
// For converting between radians and degrees
function toRadians(degrees) {
    return (degrees * (Math.PI / 180));
}
function toDegrees(radians) {
    return (radians * (180 / Math.PI)); 
}

// For converting from polar to rectangular coordinates
function toPolarX(radius, degrees) {
    var temp = radius * Math.cos(toRadians(degrees));
    return (temp);
}
function toPolarY(radius, degrees) {
    let temp = radius * Math.sin(toRadians(degrees) * -1);
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
        this.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
        this.active = true
        document.getElementById(this.id).children[0].value = this.color
    }

    changeColor() {
        this.color = document.getElementById(this.id).children[0].value
        redraw()
    }

    draw(scale) {
        let endXY = [(this.x * scale) + (w/2), (this.y * scale) + (h/2)]
        draw.line([w/2, h/2], endXY, this.color)
        draw.dot(endXY, 1, this.color)
        draw.arrow(this.degree, endXY, 20, this.color)
    }

    toggleActive() {
        if (this.active) 
            this.active = false
        else
            this.active = true
        redraw()
    }

    calcXY() {
        let vector = document.getElementById(this.id)

        // Round
        vector.children[1].value = round(vector.children[1].value)
        vector.children[3].value = round(vector.children[3].value)
        
        this.magnitude = vector.children[1].value
        this.degree = vector.children[3].value
        if (this.degree > 360) 
            this.degree = this.degree % 360

        this.x = round(toPolarX(this.magnitude, this.degree))
        this.y = round(toPolarY(this.magnitude, this.degree))

        vector.children[5].value = this.x * 1
        vector.children[7].value = this.y * -1

        redraw()
    }

    calcMagDeg() {
        let vector = document.getElementById(this.id)

        // Round
        vector.children[5].value = round(vector.children[5].value)
        vector.children[7].value = round(vector.children[7].value)
        
        this.x = vector.children[5].value * 1
        this.y = vector.children[7].value * -1

        this.magnitude = round(toPolarR([this.x, this.y]))
        this.degree = round(toPolarDeg([this.x, this.y]))

        vector.children[1].value = this.magnitude
        vector.children[3].value = this.degree

        redraw()
    }
}

// Array of vectors
var vectors = []

/******************** Redraw Main Function ********************/
// Resulting vector spans
const rMag = document.getElementById("rMag")
const rDeg = document.getElementById("rDeg")
const rX = document.getElementById("rX")
const rY = document.getElementById("rY")
// Equilibrium vector spans
const eMag = document.getElementById("eMag")
const eDeg = document.getElementById("eDeg")
const eX = document.getElementById("eX")
const eY = document.getElementById("eY")

// Find the largest magnitude from all active vectors
function getMaxMag(start) {
    let maxMag = Math.abs(start)
    for (let i = 0; i < vectors.length; i++)
        if (vectors[i].active && Math.abs(vectors[i].magnitude) >= maxMag)
            maxMag = Math.abs(vectors[i].magnitude)

    if (maxMag != 0) 
        return maxMag

    return (w/2)
}

// Redraw all vectors
function redraw() {
    // Clear canvas
    draw.erase()

    // Draw x and y axis
    ctx.lineWidth = 4;
    draw.line([w/2, 0], [w/2, h], "black")
    draw.line([0, h/2], [w, h/2], "black")
    ctx.lineWidth = 3;

    // Calc resulting vector
    let totalX = 0
    let totalY = 0
    for (i = 0; i < vectors.length; i++) {
        if (vectors[i].active) {
            totalX += vectors[i].x
            totalY += vectors[i].y
        }
    }
    rX.innerHTML = round(totalX)
    rY.innerHTML = round(totalY * -1)
    rMag.innerHTML = round(toPolarR([totalX, totalY * -1]))
    if (totalX == 0 && totalY == 0)
        rDeg.innerHTML = 0
    else 
        rDeg.innerHTML = round(toPolarDeg([totalX, totalY]))

    // Calc equilibrium vector
    eX.innerHTML = rX.innerHTML * -1
    eY.innerHTML = rY.innerHTML
    eMag.innerHTML = rMag.innerHTML 
    if (rMag.innerHTML == 0)
        eDeg.innerHTML = 0
    else 
        eDeg.innerHTML = round(toPolarDeg([eX.innerHTML, eY.innerHTML]))
    

    // Scale canvas for new vector values
    let scale = ((w/2) / (getMaxMag(rMag.innerHTML) * 1.1))

    // Draw other vectors
    for (i = 0; i < vectors.length; i++)
        if (vectors[i].active) 
            vectors[i].draw(scale)

    // Draw dashed resulting vector
    let endXY = [(totalX * scale) + (w/2), (totalY * 1 * scale) + (h/2)]
    draw.dashedLine([w/2, h/2], endXY, "black");
    draw.dot(endXY, 1, "black")
    if (rMag.innerHTML != 0) 
        draw.arrow(rDeg.innerHTML, endXY, 15, "black")
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

    let colorpicker = document.createElement("input")
    colorpicker.setAttribute("type", "color")
    colorpicker.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].changeColor()"))
    newVector.appendChild(colorpicker)

    let magnitudeInput = document.createElement("input")
    magnitudeInput.setAttribute("type", "number")
    magnitudeInput.value = 0
    magnitudeInput.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].calcXY()"))
    newVector.appendChild(magnitudeInput)

    let magnitudeText = document.createElement("p")
    magnitudeText.innerHTML = "at"
    newVector.appendChild(magnitudeText)

    let degreeInput = document.createElement("input")
    degreeInput.setAttribute("type", "number")
    degreeInput.value = 0
    degreeInput.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].calcXY()"))
    newVector.appendChild(degreeInput)

    let orText = document.createElement("p")
    orText.innerHTML = "&deg or ("
    newVector.appendChild(orText)

    let xInput = document.createElement("input")
    xInput.setAttribute("type", "number")
    xInput.value = 0
    xInput.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].calcMagDeg()"))
    newVector.appendChild(xInput)

    let commaText = document.createElement("p")
    commaText.innerHTML = ","
    newVector.appendChild(commaText)

    let yInput = document.createElement("input")
    yInput.setAttribute("type", "number")
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
    checkbox.setAttribute("OnInput", ("vectors[idIndex(" + id + ".id)].toggleActive()"))
    newVector.appendChild(checkbox)

    // Add new vector div to vectors div
    vectorDiv.appendChild(newVector)
    vectors.push(new Vector(0, 0, id))
}
