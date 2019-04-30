import csv

def getConfig():
    config = {}
    with open('config.csv') as csvfile:
        readcsv = csv.reader(csvfile, delimiter=',')
        for row in readcsv:
            config[row[0]] = row[1]
    
    return config