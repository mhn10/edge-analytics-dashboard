#python code to classify an image


from imageai.Prediction.Custom import CustomImagePrediction




import os









execution_path = os.getcwd()







prediction = CustomImagePrediction()


prediction.setModelTypeAsResNet()


prediction.setModelPath("pavan.h5")


prediction.setJsonPath("pavan.json")


prediction.loadModel(num_objects=10)







predictions, probabilities = prediction.predictImage("pavan.jpg", result_count=3)


f=open("Results/pavan.txt", "a+")

for eachPrediction, eachProbability in zip(predictions, probabilities):
#    f.write(eachPrediction , " : " , eachProbability)


   print(eachPrediction , " : " , eachProbability)
   f.write(eachPrediction)
   f.write(eachProbability)

f.close()

