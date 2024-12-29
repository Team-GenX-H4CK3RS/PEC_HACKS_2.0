
import requests
import os


def get_nearby_places(location, place):
    params = {
        'location': location,
        'radius': 500,
        'keyword': place,
        'fields': 'formatted_phone_number,name,vicinity,opening_hours,rating,reviews,url,website',
        'key': os.getenv('GOOGLE_MAPS_TOKEN')
    }

    response = requests.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json", params=params)
    return response.json()


def get_nearby_place_details(place_id):
    params = {
        'place_id': place_id,
        'fields': 'formatted_phone_number,name,vicinity,opening_hours,rating,reviews,url,website',
        'key': os.getenv('GOOGLE_MAPS_TOKEN')
    }

    response = requests.get(
        "https://maps.googleapis.com/maps/api/place/details/json", params=params)
    return response.json()


def get_distance_matrix(origin, destination):
    params = {
        'origins': origin,
        'destinations': destination,
        'key': os.getenv('GOOGLE_MAPS_TOKEN')
    }

    response = requests.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json", params=params)
    return response.json()
