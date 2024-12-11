from django.shortcuts import render, redirect
import sqlite3
from datetime import datetime
current_datetime = datetime.now()
formatted_datetime = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
GLOBAL_USERNAME = None
def register(request):
    global GLOBAL_USERNAME
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'login':
            username = request.POST.get('username')
            password = request.POST.get('password')
            connection = sqlite3.connect('BLUEWHALE_USER_REPORT.db')
            cursor = connection.cursor()
            query = "SELECT * FROM user_data WHERE username = ? AND password = ?"
            cursor.execute(query, (username, password))
            result = cursor.fetchall()

            if result != []:
                GLOBAL_USERNAME = result[0][1]
                print(GLOBAL_USERNAME)
                return redirect('home')

        elif action == 'signup':
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')
            print(username, password, email)
            connection = sqlite3.connect('BLUEWHALE_USER_REPORT.db')
            cursor = connection.cursor()
            query = """INSERT INTO user_data (username, password, email, created_at) VALUES (?, ?, ?, ?)"""
            cursor.execute(query, (username, password, email, formatted_datetime))
            connection.commit()


    return render(request, 'register.html')



def home(request):
    user = GLOBAL_USERNAME
    return render(request, 'home.html', {'user': user})

def sql_editor(request):
    user = GLOBAL_USERNAME
    return render(request, 'sql_editor.html',  {'user': user})