
import os
from flask import Flask, jsonify
from matplotlib.font_manager import json_load
from sklearn.metrics import mean_squared_error, mean_absolute_error
import pandas as pd
import matplotlib.pyplot as plt
from neuralforecast import NeuralForecast
from neuralforecast.models import NHITS
from neuralforecast.losses.pytorch import DistributionLoss
from neuralforecast.utils import AirPassengersPanel, AirPassengersStatic
from datetime import date, timedelta,datetime
import json
import requests

DATA_FOLDER = "./DATASETS/"
OUTFOLDER = "./OUT/"
DF = None
TODAY = date.today()
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
        if(abs(date1 - date2) <= timedelta(days=4)):
            return 1
    return 0

if not os.path.exists(DATA_FOLDER):
    os.mkdir(DATA_FOLDER)
if not os.path.exists(OUTFOLDER):
    os.mkdir(OUTFOLDER)

app = Flask(__name__)

@app.route('/getFullData/<sdate>/<date>/<longitude>/<latitude>')
def GetFullData(sdate,date,longitude,latitude):
    START_DATE = sdate
    response = requests.get(f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=GWETTOP,PRECTOT,WS10M,T2M,TS&community=AG&longitude={longitude}&latitude={latitude}&start={START_DATE}&end={date}&format=JSON")
    if response.status_code == 200:
        json_data = response.json()
        parameters = json_data['properties']['parameter']
        dates = list(parameters['GWETTOP'].keys())
        csv_data = []
        dl = landslidedate(float(latitude),float(longitude),START_DATE,date)
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
        json_data = eval(DF.to_json(orient='table',index=False))
        return jsonify(json_data["data"])
    else:
        print('Error:', response.status_code)
        return jsonify({'status' : "An error occured"})

@app.route('/lo/<longitude>/la/<latitude>')
def GetData(longitude, latitude):
    global DF
    START_DATE = "20000101"
    
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

    print(newDF)
    newDF.to_csv(f'{OUTFOLDER}Forecast_{TODAY}_LONG_{longitude}_LATI_{latitude}', index=False)
    return str(newDF)


@app.route('/update/<lo>/<la>/<st>/<et>')
def GetLatest(lo,la,st,et):
    global DF
    response = requests.get(f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=GWETTOP,PRECTOT,WS10M,T2M,TS&community=AG&longitude={lo}&latitude={la}&start={st}&end={et}&format=JSON")
    if response.status_code == 200:
        json_data = response.text()
    else:
        return ('Error:'+ str(response.status_code))
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
    DF = pd.DataFrame(csv_data)
    output_path = f'{DATA_FOLDER}LandslideData_{TODAY}_{la}_{lo}.csv'
    DF.to_csv(output_path, index=False)
    DF['date'] = pd.to_datetime(DF['date'])
    DF.replace(-999, pd.NA, inplace=True)

    DF.fillna(DF.mean(), inplace=True)
    COLUMNS = DF.columns[1:]
    print("Columns : " ,COLUMNS)
    print(DF.tail(50))
    return("GOT DATA")


if __name__ == '__main__':
    app.run(port=5555,debug=True)
