#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr 15 23:38:52 2019

@author: pavan
"""

def mae(predictions, targets):
    # Retrieving number of samples in dataset
    samples_num = len(predictions)
    
    # Summing absolute differences between predicted and expected values
    accumulated_error = 0.0
    for prediction, target in zip(predictions, targets):
        accumulated_error += np.abs(prediction - target)
        
    # Calculating mean
    mae_error = (1.0 / samples_num) * accumulated_error
    
    return mae_error

def mse(predictions, targets):
    # Retrieving number of samples in dataset
    samples_num = len(predictions)
    
    # Summing square differences between predicted and expected values
    accumulated_error = 0.0
    for prediction, target in zip(predictions, targets):
        accumulated_error += (prediction - target)**2
        
    # Calculating mean and dividing by 2
    mae_error = (1.0 / (2*samples_num)) * accumulated_error
    
    return mae_error

def init(n):
    return {"w": np.zeros(n), "b": 0.0}

def predict(x, parameters):
    # Prediction initial value
    prediction = 0
    
    # Adding multiplication of each feature with it's weight
    for weight, feature in zip(parameters["w"], x):
        prediction += weight * feature
        
    # Adding bias
    prediction += parameters["b"]
        
    return prediction


import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# Load data from .csv
df_data = pd.read_csv("cracow_apartments.csv", sep=",")

# Used features and target value
features = ["size"]
target = ["price"]

# Slice Dataframe to separade feature vectors and target value
X, y = df_data[features].as_matrix(), df_data[target].as_matrix()

# Parameter sets
orange_parameters = {'b': 200, 'w': np.array([3.0])}
lime_parameters = {'b': -160, 'w': np.array([12.0])}

# Make prediction for every data sample
orange_pred = [predict(x, orange_parameters) for x in X]
lime_pred = [predict(x, lime_parameters) for x in X]

# Model error
mse_orange_error = mse(orange_pred, y)
mse_lime_error = mse(lime_pred, y)


orange_pred = str(orange_pred)
lime_pred = str(lime_pred)
mse_orange_error = str(mse_orange_error)
mse_lime_error = str(mse_lime_error)

f = open('pavanoutput.txt', 'a')
f.write(" ***ORANGE PREDICTION*** " + "\n")
f.close()

f = open('pavanoutput.txt', 'a')
f.write(orange_pred + "\n")
f.close()
f = open('pavanoutput.txt', 'a')
f.write(" ***LIME PREDICTION*** " + "\n")
f.close()
f = open('pavanoutput.txt', 'a')
f.write(lime_pred + "\n")
f.close()