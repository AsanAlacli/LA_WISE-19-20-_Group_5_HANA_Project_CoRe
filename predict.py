from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier


def prepareML(method, x_train, y_train):
    ml = None

    if method == 'lr':
        ml = LogisticRegression()
    elif method == 'knn':
        ml = KNeighborsClassifier()

    ml.fit(x_train, y_train)

    return ml

def calcPredict(mchnlrn, data_predicate):
    result =mchnlrn.predict([data_predicate])
    
    if result[0] == 0:
        return 'Average'
    if result[0] == 1:
        return 'Bad'
    if result[0] == 2:
        return 'Good'
    if result[0] == 3:
        return 'Very good'  
