
import json
import os
from flask import Flask, jsonify
import pandas as pd
from neuralforecast import NeuralForecast
from neuralforecast.models import NHITS
from neuralforecast.losses.pytorch import DistributionLoss
from datetime import date, timedelta,datetime
import requests
import pickle
from sklearn.metrics import classification_report,confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import accuracy_score
from imblearn.over_sampling import RandomOverSampler
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier
import joblib
import os
import requests

DATA_FOLDER = "./DATASETS/"
OUTFOLDER = "./OUT/"
MODELFOLDER = "./MODELS/"
LATESTMODEL = None
DF = None
STARTTTT = None
TODAY = date(2017,7,1)
ONE_YEAR_BEFORE = TODAY - timedelta(days=365)

TODAY = TODAY.strftime("%Y_%m_%d")
ONEYEARBEFORE = ONE_YEAR_BEFORE.strftime("%Y-%m-%d")

def landslidedate(latitude,longitude,st,et):
  data = pd.read_csv('data.csv')
  filtered_data = data[
      (data['latitude'] >= latitude - 0.1) & (data['latitude'] <= latitude + 0.1) &
      (data['longitude'] >= longitude - 0.1) & (data['longitude'] <= longitude + 0.1) &
      (data['date_'] >= st) & (data['date_'] <= et)
  ]
  print(filtered_data['date_'].tolist())

  return filtered_data['date_'].tolist()

def smooth(date,dl):
    date1 = datetime.strptime(date, "%Y%m%d")
    for i in dl:
        date2 = datetime.strptime(i, "%Y-%m-%d")
        if(abs(date1 - date2) <= timedelta(days=5)):
            print(abs(date1 - date2))
            return abs(date1 - date2).days / 5
    return 0

if not os.path.exists(DATA_FOLDER):
    os.mkdir(DATA_FOLDER)
if not os.path.exists(OUTFOLDER):
    os.mkdir(OUTFOLDER)
if not os.path.exists(MODELFOLDER):
    os.mkdir(MODELFOLDER)

app = Flask(__name__)

@app.route('/getFullData/<sdate>/<date>/<longitude>/<latitude>')
def GetFullData(sdate,date,longitude,latitude,a=0):
    START_DATE = sdate
    response = requests.get(f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=GWETTOP,PRECTOT,WS10M,T2M,TS&community=AG&longitude={longitude}&latitude={latitude}&start={START_DATE}&end={date}&format=JSON")
    if response.status_code == 200:
        json_data = response.json()
        parameters = json_data['properties']['parameter']
        dates = list(parameters['GWETTOP'].keys())
        csv_data = []
        dl = landslidedate(float(latitude),float(longitude),START_DATE,TODAY)
        for date in dates:
            csv_data.append({
                "date": datetime.strptime(date, '%Y%m%d').strftime('%Y-%m-%d'),
                "WS10M": parameters["WS10M"].get(date),
                "GWETTOP": parameters["GWETTOP"].get(date),
                "TS": parameters["TS"].get(date),
                "T2M": parameters["T2M"].get(date),
                "PRECTOTCORR": parameters["PRECTOTCORR"].get(date),
                "OUTPUT" : smooth(date,dl)
            })
        DF = pd.DataFrame(csv_data)
        
        DF['date'] = pd.to_datetime(DF['date'])
        DF.replace(-999, pd.NA, inplace=True)
        DF.fillna(DF.mean(), inplace=True)
        if(a!=0):
            return DF
        json_data = eval(DF.to_json(orient='table',index=False))
        return jsonify(json_data["data"])
    else:
        print('Error:', response.status_code)
        return jsonify({'status' : "An error occured"})
    
@app.route('/getPredictionData/<lat>/<lon>')
def getPrediction(lat,lon):
    # file_name = f"model_{lat}_{lon}.pkl"
    # file_name = f"random_forest_model.pkl"
    # file_path = os.path.join(MODELFOLDER, file_name)
    # try:
    #     print("Checking Forecast : " + f'{OUTFOLDER}Forecast_{TODAY}_LONG_{lon}_LATI_{lat}.csv')
    #     open(file=f'{OUTFOLDER}Forecast_{TODAY}_LONG_{lon}_LATI_{lat}.csv')
    # except:
    #     return("NOT FORECASTED")
    # if os.path.exists("./MODELS/random_forest_model.pkl"):
    #     print("Checking Model : " + file_path)
    # else:
    #     return("NOT TRAINED" )
    global LATESTMODEL
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    res = requests.get(f'http://landslide.lalithadithyan.online/forecast/lo/{lon}/la/{lat}',verify=False)
    
    if(res.status_code == 200):
        print(res.text)
        data = eval(res.text)
        # return str(data)
        df = pd.DataFrame(data)
        # print(df)
        # return jsonify({"sd":X})
        print("model Loafing")
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        res = requests.get(f'http://landslide.lalithadithyan.online/getFullData/{STARTTTT}/{TODAY}/{lon}/{lat}',verify=False)
        if(res.status_code == 200):
            data = eval(res.text)
            X = pd.DataFrame(data).drop(['OUTPUT','date'],axis=1)
            # print(df)
        else:
            print("Error")
        # model = joblib.load(file_path)
        # print("model Loaded")
        l = LATESTMODEL.predict(df).tolist()
        l.append(99)
        l.extend(LATESTMODEL.predict(X).tolist())
        return str(l)
    else:
        return("Error")
 
import urllib3

@app.route('/modeltrain/<Lat>/<Lon>/<StartDate>/<EndDate>')
def model_training(Lat,Lon,StartDate,EndDate):
    global LATESTMODEL
    global STARTTTT
    STARTTTT = StartDate
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    res = requests.get(f'http://landslide.lalithadithyan.online/getFullData/{StartDate}/{EndDate}/{Lon}/{Lat}',verify=False)
    if(res.status_code == 200):
        data = eval(res.text)
        df = pd.DataFrame(data)
        # print(df)
    else:
        print("Error")
    file_name = f"model_{Lat}_{Lon}.pkl"
    file_path = os.path.join(MODELFOLDER, file_name)

    # try:
    #     pickle.load(file_path)
    #     return "Model already trained"
    # except:
    
    # df = GetFullData(StartDate,EndDate,Lon,Lat,1)
    X = df.drop(columns=['OUTPUT','date'])
    y = df['OUTPUT']
    # print(X.head())
    print(y.value_counts())
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # Initialize the Random Forest Classifier
    rf_classifier = RandomForestRegressor(n_estimators=100, max_depth=10,random_state=42)

    # Train the model
    rf_classifier.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = rf_classifier.predict(X_test)
    LATESTMODEL = rf_classifier
    # Evaluate the model
    # print("Accuracy:", accuracy_score(y_test, y_pred))
    return "Model Trained"
    os.makedirs(MODELFOLDER, exist_ok=True)
    joblib.dump(rf_classifier, file_path)
    print(f"Model weights saved to '{file_path}'")
    return "DONE | Accuracy = " + str(accuracy_score(y_test, y_pred)) + "\n\n" + str(confusion_matrix(y_test,y_pred)) 


@app.route('/forecast/lo/<longitude>/la/<latitude>')
def GetData(longitude, latitude):
    global DF
    START_DATE = "20000101"
    try:
        newDF = pd.read_csv(f'{OUTFOLDER}Forecast_{TODAY}_LONG_{longitude}_LATI_{latitude}.csv')
    except:

        response = requests.get(f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=GWETTOP,PRECTOT,WS10M,T2M,TS&community=AG&longitude={longitude}&latitude={latitude}&start={START_DATE}&end={TODAY}&format=JSON")
        if response.status_code == 200:
            json_data = response.json()
        else:
            print('Error:', response.status_code)
            exit()
        parameters = json_data['properties']['parameter']
        dates = list(parameters['GWETTOP'].keys())
        csv_data = []
        for date in dates:
            csv_data.append({
                "date": datetime.strptime(date, '%Y%m%d').strftime('%Y-%m-%d'),
                "WS10M": parameters["WS10M"].get(date),
                "GWETTOP": parameters["GWETTOP"].get(date),
                "TS": parameters["TS"].get(date),
                "T2M": parameters["T2M"].get(date),
                "PRECTOTCORR": parameters["PRECTOTCORR"].get(date)
            })
        df_csv = pd.DataFrame(csv_data)
        output_path = f'{DATA_FOLDER}LandslideData_{TODAY}.csv'
        df_csv.to_csv(output_path, index=False)
        print("Got the Data")
        DF = pd.read_csv(f'{DATA_FOLDER}LandslideData_{TODAY}.csv')
        print("End Date : " ,DF.tail(1)['date'])
        DF['date'] = pd.to_datetime(DF['date'])
        DF.replace(-999, pd.NA, inplace=True)

        DF.fillna(DF.mean(), inplace=True)
        COLUMNS = DF.columns[1:]
        print("Columns : " ,COLUMNS)
        print(DF.tail(50))
        newDF = pd.DataFrame()

        for i in COLUMNS:
            data = DF.rename(columns={'date': 'ds', i: 'y'})
            data['unique_id'] = i
            data = data[['unique_id', 'ds', 'y']] 
            train_cutoff = ONEYEARBEFORE  
            Y_train_df = data[data['ds'] <= train_cutoff].reset_index(drop=True)
            Y_test_df = data[data['ds'] > train_cutoff].reset_index(drop=True)  
            model = NHITS(
                h=30,
                input_size=24,
                loss=DistributionLoss(distribution='StudentT', level=[80, 90], return_params=True),
                n_freq_downsample=[2, 1, 1],
                scaler_type='robust',
                max_steps=200,
                early_stop_patience_steps=2,
                inference_windows_batch_size=1,
                val_check_steps=10,
                learning_rate=1e-3
            )
            fcst = NeuralForecast(models=[model], freq='D')
            fcst.fit(df=Y_train_df, val_size=30)
            forecasts = fcst.predict(futr_df=Y_test_df)
            y_pred = forecasts['NHITS-median'].values 
            newDF[i] = y_pred
            if(i != "TS"):
                newDF[i] = newDF[i].apply(lambda x: max(x, 0))

        # print(newDF)
        newDF.to_csv(f'{OUTFOLDER}Forecast_{TODAY}_LONG_{longitude}_LATI_{latitude}.csv', index=False)
    json_data = eval(newDF.to_json(orient='table',index=False))
    return jsonify(json_data["data"])




if __name__ == '__main__':
    app.run(port=5555,debug=True)
