import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

enc = LabelEncoder()

def loadDataset(datasetName,uselessFields):
    dataFrame= pd.read_csv("./static/data/"+datasetName +".csv", engine='python',sep=',')
    for t in uselessFields.split(','):
        dataFrame = dataFrame.drop(t, 1)
    return dataFrame
    
def encodeData(dataset,fieldName):
    data_raw = dataset[fieldName].values
    encodedData=enc.fit_transform(data_raw)
    arrLen=len(data_raw)
    keyValueData=[]
    i = 0
    while i < arrLen:
        keyValueData.append((data_raw[i],encodedData[i]))
        i=i+1
        
    dataset[fieldName] = encodedData
    keyValueData=set(keyValueData)
    return keyValueData
    


def loadTrainData(dataset,classifiedField,checkClassifiedData):
#read data



    # add new feature to use it for classification
    vals = dataset[classifiedField].values
    labels = []

    for val in vals:
        labels.append(checkClassifiedData(val))
        

    #encoding the data
    dataset = dataset.drop(classifiedField, 1)

    enc_labels = enc.fit_transform(labels)

    arrLen=len(labels)
    keyValueData=[]
    i = 0
    while i < arrLen:
        keyValueData.append((labels[i],enc_labels[i]))
        i=i+1
        

    keyValueLabel=set(keyValueData)

    dataset = dataset.values
    #print(df['item'].head())
    #preparing test data
    X_train, X_test, y_train, y_test = train_test_split(dataset,enc_labels,random_state=0,test_size=0.2)
    return (X_train,y_train,keyValueLabel)
#