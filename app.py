from flask import Flask
from flask import Flask, render_template, flash, request, url_for,jsonify,json
from werkzeug.utils import redirect
from loaddata import loadTrainData ,loadDataset,encodeData,clearData
from predict import prepareML,calcPredict
from dataanalyze import meanOfDataWith2Groupping,frequenceData,scatterData
# App config.
DEBUG = True
app = Flask(__name__)
app.config.from_object(__name__)

CLASSIFIEDFIELD='grade'

dataset=loadDataset('data')
#getting data to numeric
encodendDataset=dataset.copy()
encodendDataset=clearData(encodendDataset,"Zeitstempel,country,studyprogram,langLevel(Eng),langLevel(Ger),difficulty,learningmethodLectures,learningmethodExercises,learningmethodSelfstudy,learningmethodGroupStudy,participate,langLevelenough,comments,x")
encodedDataList=[]
for item in encodendDataset:
    if(item!=CLASSIFIEDFIELD):
        encodedDataList.append((item,encodeData(encodendDataset,item)))

# #note from Dr.Arham: we need to change it, too complicated
# def handle_non_numerical_data(df):
#     columns = df.columns.values
#     for column in columns:
#         text_digit_vals = {}
#         def convert_to_int(val):
#             return text_digit_vals[val]

#         if df[column].dtype != np.int64 and df[column].dtype != np.float64:
#             column_contents = df[column].values.tolist()
#             unique_elements = set(column_contents)
#             x = 0
#             for unique in unique_elements:
#                 if unique not in text_digit_vals:
#                     text_digit_vals[unique] = x
#                     x+=1

#             df[column] = list(map(convert_to_int, df[column]))

#     return df


def converGrade20toGrade4(grade):
    return str(grade)


x_train,y_train,classifiedlabels=loadTrainData(encodendDataset,CLASSIFIEDFIELD,converGrade20toGrade4)

lr=prepareML('lr',x_train,y_train)

knn=prepareML('knn',x_train,y_train)

def parseResult(result):
    for clabel in classifiedlabels:
        if(clabel[1]==result):
            return clabel[0]
    return "Unknown"

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/analytics')
def analytics():
    return render_template('analytics.html')

@app.route('/analytics_pie_freq')
def analytics_pie_freq():
    return render_template('analytics-pie-freq.html')

@app.route('/analytics_scatter')
def analytics_scatter():
    return render_template('analyz-scatterplot.html')

@app.route('/analyze_participate_and_hours')
def studyTravelTimeCompare():
    chart1=meanOfDataWith2Groupping(dataset,'grade','gender','participate')
    chart2=meanOfDataWith2Groupping(dataset,'grade','gender','hours')
    dataCharts={'chart1':chart1,'chart2':chart2}
    return jsonify(dataCharts)

@app.route('/analyze_freq')
def frequence():
    fieldName=request.args.get('fieldName')
    chart=frequenceData(dataset,fieldName)
    dataCharts={'chart':chart}
    return jsonify(dataCharts)

@app.route('/analyze_scatter_x')
def scatter():
    searchValue=request.args.get('searchValue')
    chart=scatterData(dataset,'age','grade','studyprogram',searchValue)
    return jsonify(chart)

@app.route('/survey')
def survey():
    ages=[]
    genders=[]
    coursenames=[]
    for item in encodedDataList:
        if(item[0]=='gender'):
            genders=item[1]
        if(item[0]=='age'):
            ages=item[1]
        if(item[0]=='coursename'):
            coursenames=item[1]
        if(item[0]=='mainlanguages'):
            mainlanguagess=item[1]
        #if(item[0]=='langLevel(Eng)'):
            #langLevel(Eng)s=item[1]
        if(item[0]=='priviousknowledge'):
            priviousknowledges=item[1]
        if(item[0]=='hours'):
            hourss=item[1]
    return render_template('survey.html',genders=genders,ages=ages,coursenames=coursenames,
        mainlanguagess=mainlanguagess,priviousknowledges=priviousknowledges,hourss=hourss)

@app.route('/predict', methods=['POST'])
def predict():
    req_data = request.get_json()
    question =[0 for i in range(6)]
    question[0] =  int(req_data['gender'])
    question[1] =  int(req_data['age'])
    question[2] =  int(req_data['coursename'])
    #question[2] =  int(req_data['langLevel(Eng)'])
    question[3] =  int(req_data['mainlanguages'])
    question[4] =  int(req_data['priviousknowledge'])
    question[5] =  int(req_data['hours'])
    
    resultlr = calcPredict(lr,question)
    
    resultknn =calcPredict(knn,question)
    
    data = {'resultlr':parseResult(resultlr),'resultknn':parseResult(resultknn)}
    print(jsonify(data))
    return jsonify(data)
     

if __name__ == "__main__":
    app.run()
