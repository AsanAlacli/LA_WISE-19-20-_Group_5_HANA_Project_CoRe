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
    return mchnlrn.predict([data_predicate])
    
    