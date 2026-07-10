import requests
import os
from dotenv import load_dotenv

# This tells the system exactly where to find your .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

backend_url = os.getenv('backend_url')
# Add this print so you can see if it's working in your terminal
print(f"DEBUG: Loaded backend_url as: {backend_url}")

sentiment_analyzer_url = os.getenv('sentiment_analyzer_url', default="http://localhost:5000/")
sentiment_analyzer_url = os.getenv('sentiment_analyzer_url', default="http://localhost:5000/")

def get_request(endpoint, **kwargs):
    params = ""
    if(kwargs):
        for key,value in kwargs.items():
            params=params+key+"="+value+"&"
    request_url = backend_url+endpoint+"?"+params
    print("GET from {} ".format(request_url))
    try:
        response = requests.get(request_url)
        return response.json()
    except:
        print("Network exception occurred")

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")

def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        print(response.json())
        return response.json()
    except:
        print("Network exception occurred")
        