from flask import Flask, render_template, flash, request, url_for,jsonify,json
from werkzeug.utils import redirect
from loaddata import loadTrainData ,loadDataset,encodeData
from predict import prepareML,calcPredict
from dataanalyze import meanOfDataWith2Groupping,frequenceData
# App config.
DEBUG = True
app = Flask(__name__)
app.config.from_object(__name__)

CLASSIFIEDFIELD='grade'

dataset=loadDataset('data','comments,x,Zeitstempel')

encodendDataset=dataset.copy()
encodedDataList=[]
for item in encodendDataset:
    if(item!=CLASSIFIEDFIELD):
        encodedDataList.append((item,encodeData(encodendDataset,item)))



def converGrade20toGrade4(grade):
    return str(grade)


x_train,y_train=loadTrainData(encodendDataset,CLASSIFIEDFIELD,converGrade20toGrade4)

lr=prepareML('lr',x_train,y_train)

knn=prepareML('knn',x_train,y_train)


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

@app.route('/survey')
def survey():
    ages=[]
    genders=[]
    coursenames=[]
    for item in encodedDataList:
        if(item[0]=='age'):
            ages=item[1]
        if(item[0]=='gender'):
            genders=item[1]
        if(item[0]=='coursename'):
            coursenames=item[1]
    return render_template('survey.html',ages=ages,genders=genders,coursenames=coursenames)

@app.route('/predict', methods=['POST'])
def predict():
    req_data = request.get_json()
    question =[0 for i in range(16)]
    question[0] =  int(req_data['sex'])
    question[1] =  int(req_data['age'])
    question[2] =  int(req_data['travelTime'])
    question[3] =  int(req_data['studyTime'])
    question[4] =  int(req_data['failures'])
    question[5] =  int(req_data['schoolsup'])
    question[6] =  int(req_data['famsup'])
    question[7] =  int(req_data['paid'])
    question[8] =  int(req_data['activities'])
    question[9] =  int(req_data['higher'])
    question[10] = int(req_data['internet'])
    question[11] = int(req_data['famrel'])
    question[12] = int(req_data['freetime'])
    question[13] = int(req_data['goout'])
    question[14] = int(req_data['health'])
    question[15] = int(req_data['absences'])

    data = {'resultlr':calcPredict(lr,question),'resultknn':calcPredict(knn,question)}
    print(jsonify(data))
    return jsonify(data)
     

if __name__ == "__main__":
    app.run()
