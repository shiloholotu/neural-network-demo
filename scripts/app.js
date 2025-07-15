
let costs = [];

let nn = new FeedForwardNetwork([2,3,3,2]);


function train(){ // does a single epoch and returns the loss
    let totalLoss = 0;
    let cnt = 0;
    for(let x = 0; x < 10; x++){
        for(let y = 0; y < 10; y++){
            const block = document.getElementById(`in-block${x}-${y}`);
            if(block.classList.length != 1) nn.feedForward([x/10,y/10]);
            else continue;

            cnt++;
            
            let loss = 0;
            if(block.classList.contains("selected-0")) loss = nn.backProp([1,0]);
            else loss = nn.backProp([0,1]);

            totalLoss += loss;
        }
    }

    return totalLoss/cnt;
}

// update the output grid
function displayOutput(){
    for(let x = 0; x < 10; x++){
        for(let y = 0; y < 10; y++){
            const outs = nn.feedForward([x/10,y/10]);


            let blackPercent = outs[0]/(outs[0] + outs[1]);
            //if(blackPercent > .5) blackPercent = 1;
            //else blackPercent = 0;
            const bluePercent = 1 - blackPercent;


            const black = [50 * blackPercent, 50 * blackPercent ,50 * blackPercent];
            const blue = [98 * bluePercent, 168 * bluePercent, 239 * bluePercent];



            const color = [blue[0] + black[0], blue[1] + black[1], blue[2] + black[2]];

            document.getElementById(`out-block${x}-${y}`).style["background"] = `rgb(${color[0]} ${color[1]} ${color[2]})`;
        }
    }
}



let play = false;

let epoch = 0;
let loss = [];

function loop(itr){
    for(let i = 0; i < itr-1; i++) train();
    loss.push(train());
    displayOutput();
}


let lossChart = null; 

function resetChart(){
    if(lossChart != null) lossChart.destroy();
    lossChart = new Chart(document.getElementById('myChart'), {

        type: 'line',
        data: {
            labels: [],
            datasets: [{
            data: [],
            borderWidth: 1,
            borderColor: 'rgb(0,0,0)',
            fill:true
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            },
            plugins: {
                legend: {
                display: false
                }
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            animation:false
        }
    });
}
resetChart();



// updating output grid and graph
let epochPerFrame = 10;
function updateEpochPerFrame(){
    epochPerFrame = parseInt(document.getElementById("epf").value);
}

function togglePlay(){
    play = !play;
    const playButton = document.getElementById("play-button");
    playButton.innerHTML = "Play";
    if(play) playButton.innerHTML = "Pause";
}


function resetModel(keepProgress=false){
    
    play = true;
    togglePlay();
    if(!keepProgress){
        epoch = 0;
        resetChart();
    }

    // re initialize model
    const layerSizes = [2];
    for(let i = 0; i < parseInt(document.getElementById("hl-count").value); i++){
        layerSizes.push(parseInt(document.getElementById("hl-size").value));
    }
    layerSizes.push(2);
    nn = new FeedForwardNetwork(layerSizes);

    for(let i of nn.layers){
        for(let j of i) j.step = parseFloat(document.getElementById("learning-rate").value);
    }

    // reset output graph
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            document.getElementById(`out-block${i}-${j}`).style["background"] = "";
        }
    }

    togglePlay();

    
}

setInterval(function(){
    if(!play) return;
    loop(epochPerFrame);
    epoch+=epochPerFrame;

    const curLoss = parseInt(loss[loss.length-1] * 100)/100;

    if(curLoss == 0){
        play = true;
        togglePlay();
    }

    lossChart.data.labels.push(epoch);
    lossChart.data.datasets.forEach((dataset) => {
        dataset.data.push(curLoss);
    });
    lossChart.update();
},100);