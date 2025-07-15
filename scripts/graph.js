// generate input graph
let graphHTML = "";
for(let i = 0; i < 10; i++){
    graphHTML += "<div class='row'>";
    for(let j = 0; j < 10; j++){
        
        
        if(Math.random() > .4){
            graphHTML += `<div onmouseover='hoverOverBlock("${j}-${i}",false)' onmousedown='hoverOverBlock("${j}-${i}",true)' id='in-block${j}-${i}' class='in-block'></div>`;
            continue;
        }

        if(Math.pow(i,2) + Math.pow(j,2) < 49) graphHTML += `<div onmouseover='hoverOverBlock("${j}-${i}",false)' onmousedown='hoverOverBlock("${j}-${i}",true)' id='in-block${j}-${i}' class='in-block selected-1'></div>`;
        else graphHTML += `<div onmouseover='hoverOverBlock("${j}-${i}",false)' onmousedown='hoverOverBlock("${j}-${i}",true)' id='in-block${j}-${i}' class='in-block selected-0'></div>`;
         
    }
    graphHTML += "</div>";
}

document.getElementById("input-graph").innerHTML = graphHTML;


// generate output graph
graphHTML = "";

for(let i = 0; i < 10; i++){
    graphHTML += "<div class='row'>";
    for(let j = 0; j < 10; j++){
        graphHTML += `<div id='out-block${j}-${i}' class='out-block'></div>`;
    }
    graphHTML += "</div>";
}

document.getElementById("output-graph").innerHTML = graphHTML;



// clicking on inputs
let mouseDown = false;
document.body.onmousedown = function() { 
    mouseDown = true;
}
document.body.onmouseup = function() {
    mouseDown = false;
}

document.querySelectorAll('.in-block').forEach(pixel => {
  pixel.addEventListener('dragstart', e => e.preventDefault());
});

let mode = 0;

function setDrawMode(n){
    mode = n;
    document.getElementById("draw-mode0").style["transform"] = "";
    document.getElementById("draw-mode1").style["transform"] = "";
    document.getElementById("draw-mode2").style["transform"] = "";

    document.getElementById("draw-mode0").style["box-shadow"] = "";
    document.getElementById("draw-mode1").style["box-shadow"] = "";
    document.getElementById("draw-mode2").style["box-shadow"] = "";


    document.getElementById("draw-mode" + n).style["transform"] = "translate(0,-2px)";
}

setDrawMode(0);

function hoverOverBlock(id, clicked){

    if(!mouseDown && !clicked) return;
    const block = document.getElementById("in-block" + id);
    if(mode == 0) block.setAttribute("class", "in-block selected-0");
    else if (mode == 1) block.setAttribute("class", "in-block selected-1");
    else block.setAttribute("class", "in-block");
    
}

function fillAll(){
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            hoverOverBlock(`${i}-${j}`,true);
        }
    }
}