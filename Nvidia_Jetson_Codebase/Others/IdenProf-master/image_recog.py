#python code to classify an image


from imageai.Prediction.Custom import CustomImagePrediction




import os







execution_path = os.getcwd()







prediction = CustomImagePrediction()


prediction.setModelTypeAsResNet()


prediction.setModelPath("pavan.h5")


prediction.setJsonPath("idenprof_model_class.json")


prediction.loadModel(num_objects=10)







predictions, probabilities = prediction.predictImage("1.jpg", result_count=3)


f=open("guru99.txt", "a+")

for eachPrediction, eachProbability in zip(predictions, probabilities):
#    f.write(eachPrediction , " : " , eachProbability)


   print(eachPrediction , " : " , eachProbability)
   f.write(eachPrediction)
   f.write(eachProbability)

f.close()

