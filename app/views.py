from django.shortcuts import render, redirect
import sqlite3
import requests
from datetime import datetime
current_datetime = datetime.now()
formatted_datetime = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
GLOBAL_USERNAME = None
from dotenv import load_dotenv
import os
load_dotenv(dotenv_path="B:/excel/.env")
load_dotenv()
TOKEN, OWNER, REPO, BRANCH = map(os.getenv, ["GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO", "GITHUB_BRANCH"])
print(TOKEN)
def db(query, type):
    # url = "http://127.0.0.1:8000/API/database"  # for local server
    url = "https://bwo-eosin.vercel.app/API/database" #for productions       
    params = {
        "token": "QldPL0JXT19NQUlOX1VTRVJTLmRi",
        "query": query
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return []
    else:
       if type == 'login':
            return response.json()['results']


def register(request):
    global GLOBAL_USERNAME
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'login':
            username = request.POST.get('username')
            password = request.POST.get('password')

            query = f"SELECT * FROM BWO_WEBSITE_USERS WHERE username = '{username}' AND password = '{password}'"
            result = db(query, "login")

            if result != []:
                GLOBAL_USERNAME = result[0][1]
                print(GLOBAL_USERNAME)
                return redirect('home')

        elif action == 'signup':
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')

            query = f"""INSERT INTO BWO_WEBSITE_USERS (username, password, email, created_at) 
                        VALUES ('{username}', '{password}', '{email}', '{formatted_datetime}')"""
            db(query, "signup")

    return render(request, 'register.html')


def home(request):
    user = GLOBAL_USERNAME
    return render(request, 'home.html', {'user': user})

def sql_editor(request):
    user = GLOBAL_USERNAME
    return render(request, 'sql_editor.html',  {'user': user})