import asyncio
import csv
import json
import time
from selenium import webdriver
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from tqdm import tqdm

CSRF_URL = 'https://ngodarpan.gov.in/index.php/ajaxcontroller/get_csrf'
STATES_URL = "https://ngodarpan.gov.in/index.php/home/statewise"
DETAIL_URL = 'https://ngodarpan.gov.in/index.php/ajaxcontroller/show_ngo_info'
SEARCH_URL = 'https://ngodarpan.gov.in/index.php/search/'
GOOGLE_MAPS_TOKEN = "AIzaSyBlJfGgpP2kN06cTUkpcY1VZLsflD2_ux0"


def get_selection_from_user(select_element, value):
    select_obj = Select(select_element)
    options = select_element.find_elements(By.TAG_NAME, "option")
    for i in options:
        print(i.get_attribute('value'), i.text)
    select_obj.select_by_value(value)


def get_selection_options(select_element):
    options = select_element.find_elements(By.TAG_NAME, "option")
    res = []
    for i in options:
        res.append([i.get_attribute('value'), i.text])
    return res if res[0][0] != '' else res[1:]


def _get_headless_chrome(url):
    chrome_options = Options()
    chrome_options.add_argument("--headless=old")
    browser = webdriver.Chrome(options=chrome_options)
    browser.get(url)
    return browser


def get_states():
    browser = _get_headless_chrome(SEARCH_URL)

    state_select_element = browser.find_element(
        By.ID, 'state_search_search')
    return get_selection_options(state_select_element)


def get_district_by_state(state_value):
    browser = _get_headless_chrome(SEARCH_URL)

    Select(browser.find_element(
        By.ID, 'state_search_search')).select_by_value(state_value)
    time.sleep(1)
    district_select_element = browser.find_element(
        By.ID, 'district_search')
    return get_selection_options(district_select_element)


def get_sectors():
    browser = _get_headless_chrome(SEARCH_URL)

    sector_select_element = browser.find_element(
        By.ID, 'sector_search')
    return get_selection_options(sector_select_element)


def search_ngos(state_value=None, district_value=None, sector_values=None):
    browser = _get_headless_chrome(SEARCH_URL)

    if state_value:
        Select(browser.find_element(
            By.ID, 'state_search_search')).select_by_value(state_value)
        time.sleep(1)
        if district_value:
            Select(browser.find_element(
                By.ID, 'district_search')).select_by_value(district_value)
    if sector_values:
        sectors_select_obj = Select(browser.find_element(
            By.ID, 'sector_search'))
        for val in sector_values:
            sectors_select_obj.select_by_value(val)
    button = browser.find_element(By.NAME, 'commit')
    button.click()
    time.sleep(3)
    rows = browser.find_element(
        By.ID, 'postList').find_element(By.TAG_NAME, 'tbody').find_elements(By.TAG_NAME, 'a')
    data = []
    for row in rows:
        try:
            target = row.get_attribute('target')
            if target == '_new':
                continue
            WebDriverWait(browser, 20).until(
                EC.element_to_be_clickable(row)).click()
            time.sleep(1)
            model_element = browser.find_element(By.ID, 'ngo_info_modal')
            props = {}
            props['ngo_name_title'] = model_element.find_element(
                By.ID, 'ngo_name_title').text
            # yield json.dumps({'data': props, 'type': 'name'})
            for td in model_element.find_elements(By.TAG_NAME, 'td'):
                iid = td.get_attribute('id')
                if not iid:
                    continue
                props[iid] = td.text

            model_element.send_keys(Keys.ESCAPE)
            time.sleep(1)
            yield json.dumps(props)
        except:
            continue


def load_from_web():
    with open("states.csv", newline="", mode="w") as states_file:
        writer = csv.writer(states_file)
        writer.writerows(get_states())

    with open("sectors.csv", newline="", mode="w") as sectors_file:
        writer = csv.writer(sectors_file)
        writer.writerows(get_sectors())


async def write_districts_csv():
    with open("districts.csv", newline="", mode="w") as districts_file:
        writer = csv.writer(districts_file)
        with open("states.csv", newline="", mode="r") as states_file:
            reader = csv.reader(states_file)

            async def write_rows(id):
                for i in get_district_by_state(id):
                    writer.writerow(i+[id])

            for id, name in reader:
                await asyncio.create_task(write_rows(id))


async def write_ngos_csv():
    with open("ngos.csv", newline="", mode="a") as ngos_csv:
        writer = csv.writer(ngos_csv, delimiter='<')
        with open("districts.csv", newline="", mode="r") as districts_file:
            reader = csv.reader(districts_file)

            async def write_rows(id, state_id):
                try:
                    for i in search_ngos(state_value=state_id, district_value=id):
                        writer.writerow([i, id, state_id])
                except:
                    return
            is_started = False
            for id, name, state_id in reader:
                if id == "472":
                    is_started = True
                    continue
                if not is_started:
                    continue
                print("Started:", name)
                await asyncio.create_task(write_rows(id, state_id))
                ngos_csv.flush()
                print("Finished:", name)
# print(get_district_by_state("tamil"))
asyncio.run(write_ngos_csv())
