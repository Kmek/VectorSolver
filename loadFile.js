/******************** Load Files Using JQuery ********************/
console.log("loadFile.js imported")
let lastFile = "sum.html";
function loadFile(filename) {
    console.log("trying to navigate to " + filename)

    if (filename != lastFile)
        $('#page').load(filename+"#");
    
    lastFile = filename
}