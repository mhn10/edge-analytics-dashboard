import sys
# scipy
import scipy
# numpy
import numpy
# matplotlib
import matplotlib
# pandas
import pandas
# scikit-learn
import sklearn
# Load libraries
import pandas
from pandas.plotting import scatter_matrix
import matplotlib.pyplot as plt
from sklearn import model_selection
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
import time
import datetime
# Load dataset
# url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/iris.csv"
# names = ['sepal-length', 'sepal-width', 'petal-length', 'petal-width', 'class']
# dataset = pandas.read_csv("/home/nvidia/Documents/IRIS.csv", names=names)

def runValidation(source_filepath,destination_filepath):
    names = ['sepal-length', 'sepal-width', 'petal-length', 'petal-width', 'class']
    dataset = pandas.read_csv(source_filepath, names=names)
    # Split-out validation dataset
    array = dataset.values
    X = array[:,0:4]
    Y = array[:,4]
    validation_size = 0.20
    seed = 7
    X_train, X_validation, Y_train, Y_validation = model_selection.train_test_split(X, Y, test_size=validation_size, random_state=seed)

    # Test options and evaluation metric
    seed = 7
    scoring = 'accuracy'

    # Spot Check Algorithms
    models = []
    models.append(('LR', LogisticRegression(solver='liblinear', multi_class='ovr')))
    models.append(('LDA', LinearDiscriminantAnalysis()))
    models.append(('KNN', KNeighborsClassifier()))
    models.append(('CART', DecisionTreeClassifier()))
    models.append(('NB', GaussianNB()))
    models.append(('SVM', SVC(gamma='auto')))
    # evaluate each model in turn
    results = []
    names = []
    for name, model in models:
        kfold = model_selection.KFold(n_splits=10, random_state=seed)
        cv_results = model_selection.cross_val_score(model, X_train, Y_train, cv=kfold, scoring=scoring)
        results.append(cv_results)
        names.append(name)
        msg = "%s: %f (%f)" % (name, cv_results.mean(), cv_results.std())
        #print(msg)

        # Make predictions on validation dataset
        knn = KNeighborsClassifier()
        knn.fit(X_train, Y_train)
        predictions = knn.predict(X_validation)

    file1 = open(destination_filepath,"w")
    a = str(accuracy_score(Y_validation, predictions))
    file1.write(a)
    file1.write("\n")
    b = str(confusion_matrix(Y_validation, predictions))
    file1.write(b)
    file1.write("\n")
    c = str(classification_report(Y_validation, predictions))
    file1.write(c)
    file1.close()
    #print(accuracy_score(Y_validation, predictions))
    #print(confusion_matrix(Y_validation, predictions))
    #print(classification_report(Y_validation, predictions))


def main():
    uid = sys.argv[1]
    source_filename = sys.argv[2]
    source_filepath = './AWS/Models/'+uid+'/'+source_filename
    ts = time.time()
    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y_%m_%d_%H_%M_%S')
    #print(timestamp)
    
    
    destination_filepath = './AWS/Results/'+uid+'/'+'results'+timestamp+'.txt'
    print (destination_filepath)
    #syncS3ToJetson(uid,model_filename)
    
    runValidation(source_filepath,destination_filepath)

    


if __name__ == "__main__":
    main()




