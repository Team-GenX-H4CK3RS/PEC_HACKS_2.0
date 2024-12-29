import csv
import json

STATES_FILE_PATH = "ngo_data/states.csv"
SECTORS_FILE_PATH = "ngo_data/sectors.csv"
DISTRICTS_FILE_PATH = "ngo_data/districts.csv"
NGOS_FILE_PATH = "ngo_data/ngos.csv"


def load_plain_csv(path, filter=None):
    with open(path, newline='') as dt_file:
        if not filter:
            return [i for i in csv.reader(dt_file)]
        return [i for i in csv.reader(dt_file) if filter(i)]


def get_states():
    return load_plain_csv(STATES_FILE_PATH)


def get_sectors():
    return load_plain_csv(SECTORS_FILE_PATH)


def get_districts(state_id):
    return load_plain_csv(DISTRICTS_FILE_PATH, lambda r: r[2] == state_id)


def get_ngos(state_id, district_id, sectors=None):
    with open(NGOS_FILE_PATH, newline='') as dt_file:
        data = []
        for i in csv.reader(dt_file, delimiter='<'):
            curr_data = json.loads(i[0])
            if state_id == i[2] and district_id == i[1] and (not sectors or False not in [curr_data['key_issues'].find(sector) != -1 for sector in sectors]):
                print(curr_data['ngo_name_title'], curr_data['key_issues'])
                data.append(curr_data)
        return data
