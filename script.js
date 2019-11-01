// JavaScript for Vector Solver

/******************** Canvas ********************/
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
    text: function(xy, fontsize, text) {
        ctx.font = fontsize + "px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = textColor;
        ctx.fillText(text, xy[0], xy[1]);
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
