# A small neural network demo🤖
An online demo of a neural network built from scratch in JavaScript.

This project mostly serves to wet my toes with machine learning. Specifically, the ***very, very scary*** concept of gradient descent. After many YouTube videos and my high school multivariable calculus class, I've learned enough to scrap together this fun little demo. 

Users can draw on a 10x10 canvas with 2 colors. Then, the model uses that canvas to train, taking in x and y coordinates and predicting what color the pixel at that location should be based on the user's example.

## Model Specfics
The core is a basic feed-forward neural network with 2 inputs (the coordinates) and 2 outputs (the 2 possible colors), and the user can adjust the size and number of hidden layers. There are only 100 possible training examples, so the model trains on the entire batch each epoch. I used the sigmoid function for all the activations and used Xavier initialization for randomizing weights. 
