import pandas as pd
import math
def meanOfDataWith2Groupping(dataset,targetField,grouppingField1,grouppingField2):
    # data split based on gender
    valuesOfField1= dataset[grouppingField1].unique()
    valuesOfField2= dataset[grouppingField2].unique()
    group1=[]
    for vf1 in valuesOfField1:
        group2=[]
        listOfG1=dataset.loc[dataset[grouppingField1]==vf1]
        for vf2 in valuesOfField2:
            listOfG2=listOfG1.loc[listOfG1[grouppingField2]==vf2]
            avg=listOfG2[targetField].mean()
            if(math.isnan(avg)):
                avg=0
            group2.append({'key':str(vf2),'val':avg})
        group1.append({'key':str(vf1),'val':group2})
    return group1

def scatterData(dataset,xField,yField,searchField,searchValue):
    if not not searchValue:
        dataset=dataset.loc[dataset[searchField]==searchValue]
    data = dataset[xField].values.tolist() 
    data.insert(0,xField)
    data_x = dataset[yField].values.tolist() 
    data_x.insert(0,yField)

    return {'data':data,'data_x':data_x}



def frequenceData(dataset,targetField):
    freq=dataset.groupby(targetField).size()
    sums=[]
    for v in freq.index:
        sums.append({'key':str(v),'val':int(freq[v])})
    return sums
