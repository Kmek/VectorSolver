// JavaScript Vector Solver Sum scripts
console.log("sum.js imported")
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
    eY.innerHTML = rY.innerHTML * -1
    eMag.innerHTML = rMag.innerHTML 
    if (rMag.innerHTML == 0)
        eDeg.innerHTML = 0
    else 
        eDeg.innerHTML = round((Number(rDeg.innerHTML) + 180) % 360)
    
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
