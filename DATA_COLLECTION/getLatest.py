import os
from urllib.request import urlretrieve
from urllib.error import URLError, HTTPError

def getLatest():
    DATA_FOLDER = "./tifs/"
    LATEST_FILE_URL = "https://maps.nccs.nasa.gov/download/landslides/latest/tomorrow.tif"
    LOCAL_FILE = os.path.join(DATA_FOLDER, 'tomorrow.tif')

    try:
        # Ensure the folder exists
        if not os.path.exists(DATA_FOLDER):
            os.mkdir(DATA_FOLDER)

        print("DOWNLOADING FILE...")
        
        # Download the file
        urlretrieve(LATEST_FILE_URL, LOCAL_FILE)
        print(f"File downloaded successfully: {LOCAL_FILE}")
        return True

    except HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
    except URLError as e:
        print(f"URL Error: {e.reason}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    return False
