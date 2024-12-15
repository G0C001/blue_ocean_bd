from django.urls import path
from app.views import *
from BlueWale import DB_creation

urlpatterns = [
    path('sql_editor', sql_editor),
    path('', register, name='register'),
    path('home/', home, name='home'),
    path('API/fetching_files', DB_creation.fetch_files),
    path('API/upload_to_github', DB_creation.upload_to_github),
    path('API/delect_file_by_user', DB_creation.delect_file_by_user),
    path('API/fetch_and_update_db', DB_creation.fetch_and_update_db),
    path('API/database', DB_creation.database),
]