function sigmoid(x){
//return x;
    return 1 / (1 + Math.exp(-x));
}

function sigmoidp(x){
    //return 1;
    const sig = sigmoid(x); // Calculate the sigmoid output first
    return sig * (1 - sig);
}


class InputNeuron{
    constructor(){
        this.connections = [];
        this.value = 0;
    }



    feedForward(){
        for(let i of this.connections){
            i.value += this.value;
        }
    }

    backProp(){
        for(let i of this.connections) i.backProp();
    }
}

class MultiplyNeuron{
    constructor(){
        this.w = 0;
        this.value = 0;
        this.d = 0;
        this.step = .1;
        this.connections = [];
    }


    feedForward(){
        for(let i of this.connections){
            i.value += this.w * this.value;
        }
    }

    backProp(){
        if(this.d != 0) return this.w * this.d;

        for(let i of this.connections){
            this.d += i.backProp();
        }
        const ret = this.w * this.d;
        this.w -= this.step * this.d * this.value;

        return ret;
        
    }
}

class AddNeuron{
    constructor(){
        this.bias = 0;
        this.value = 0;
        this.d = 0;
        this.step = .1;
        this.connections = [];
    }


    feedForward(){
        for(let i of this.connections){
            i.value += this.bias + this.value;
        }
    }

    backProp(){
        if(this.d != 0) return this.d;

        for(let i of this.connections){
            this.d += i.backProp();
        }
        this.bias -= this.step * this.d;

        return this.d;
        
    }
}

class SigmoidNeuron{
    constructor(){
        this.value = 0;
        this.d = 0;
        this.connections = [];
    }


    feedForward(){
        for(let i of this.connections){
            i.value +=  sigmoid(this.value);
        }
    }

    backProp(){
        if(this.d != 0) return sigmoidp(this.value) * this.d;

        for(let i of this.connections){
            this.d += i.backProp();
        }


        return sigmoidp(this.value) * this.d;
        
    }
}

class MSENeuron{
    constructor(){
        this.value = 0;
        this.expected = 0;
    }

    calcError(){
        return Math.pow(this.value-this.expected,2);
    }

    backProp(){
        return 2 * (this.value - this.expected);
    }
}



class FeedForwardNetwork{
    constructor(layerSizes){
        this.layers = [];
        for(let i = 0; i < layerSizes.length; i++){

            // input layer
            if(i == 0){
                let layer = [];
                for(let j = 0; j < layerSizes[i]; j++){
                    layer.push(new InputNeuron());
                }
                this.layers.push(layer);
                continue;
            }

            

            // HIDDEN LAYERS

            // multiplication neurons
            const xavierLimit = Math.sqrt(6) / Math.sqrt(4);
            let layer = [];
            for(let j = 0; j < layerSizes[i]; j++){
                for(let k = 0; k < layerSizes[i-1]; k++){

                    const mult = new MultiplyNeuron();
                    mult.w = Math.random() * 2 * xavierLimit - xavierLimit;
                    this.layers[this.layers.length-1][k].connections.push(mult);
                    layer.push(mult);
                }
            }
            this.layers.push(layer);

            // addition neurons
            layer = [];
            for(let j = 0; j < layerSizes[i]; j++){
                const add = new AddNeuron();
                for(let k = 0; k < layerSizes[i-1]; k++){
                    this.layers[this.layers.length-1][k + j * layerSizes[i-1]].connections.push(add);
                }
                layer.push(add);
            }

            this.layers.push(layer);

            // squash neurons

            layer = [];
            for(let j = 0; j < layerSizes[i]; j++){
                const squash = new SigmoidNeuron();
                this.layers[this.layers.length-1][j].connections.push(squash);
                layer.push(squash);
            }

            this.layers.push(layer);

            

            // cost neurons
            
            if(i == layerSizes.length-1){
                layer = [];
                for(let j = 0; j < layerSizes[i]; j++){
                    const cost = new MSENeuron();
                    this.layers[this.layers.length-1][j].connections.push(cost);
                    layer.push(cost);
                }
                this.layers.push(layer);
            }
            
        }
    }

    reset(){
        for(let i of this.layers){
            for(let j of i){
                j.value = 0;
                j.d = 0;
            }
        }
    }

    feedForward(inputs){
        
        // reset values
        for(let i of this.layers){
            for(let j of i){
                j.value = 0;
            }
        }

        for(let i = 0; i < inputs.length; i++){
            this.layers[0][i].value = inputs[i];
        }
        for(let i = 0; i < this.layers.length-1; i++){
            for(let j of this.layers[i]){
                j.feedForward();
            }
        }
        let result = [];
        for(let i of this.layers[this.layers.length-1]) result.push(i.value);
        return result;
    }

    backProp(expectedOutputs){
        // reset derivatives
        for(let i of this.layers){
            for(let j of i){
                j.d = 0;
            }
        }

        for(let i = 0; i < expectedOutputs.length; i++){
            this.layers[this.layers.length-1][i].expected = expectedOutputs[i];
        }

        for(let i of this.layers[0]) i.backProp();
        let error = 0;
        for(let i of this.layers[this.layers.length-1]) error += i.calcError();

        return error/this.layers[this.layers.length-1].length;
 
    }
}
