// JavaScript for Vector Solver Helpful
console.log("script.js imported")
/******************** Canvas Setup ********************/
const canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.scale(1, 1);
var w = ctx.canvas.width;
var h = ctx.canvas.height;

/******************** Canvas Draw Functions ********************/
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
        if (!(xy[0] == w/2 && xy[1] == h/2)) {
            let degree = 210 - (deg * -1)
            draw.line(xy, [toPolarX(radius, degree) + xy[0], toPolarY(radius, degree) + xy[1]], color)
            degree = 150 - (deg * -1)
            draw.line(xy, [toPolarX(radius, degree) + xy[0], toPolarY(radius, degree) + xy[1]], color)
        }
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