from dotenv import load_dotenv
import os
import base64
import requests
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_http_methods
from django.views.decorators.csrf import csrf_exempt


load_dotenv()
TOKEN, OWNER, REPO, BRANCH = map(os.getenv, ["GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO", "GITHUB_BRANCH"])

@csrf_exempt
@require_GET
def fetch_files(request):
    folder_path = request.GET.get("folder_path")
    if not folder_path:
        return JsonResponse({"error": "folder_path is required"}, status=400)

    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/BLUE_WHALE_OCEAN/DATABASE/{folder_path}"
    response = requests.get(url, headers={"Authorization": f"Bearer {TOKEN}"})
    if response.status_code != 200:
        return JsonResponse({"error": "Failed to fetch folder contents", "details": response.text}, status=response.status_code)

    contents = response.json()
    if not isinstance(contents, list):
        return JsonResponse({"error": "Invalid folder structure"}, status=500)

    files = [os.path.splitext(item["name"])[0] for item in contents if item["type"] == "file" and item["name"].endswith(".db")]
    return JsonResponse({"files": files})


@csrf_exempt
@require_http_methods(["POST"])
def upload_to_github(request):
    user, file_name = request.POST.get("user"), request.POST.get("file_name")
    if not user or not file_name:
        return JsonResponse({"error": "Missing 'user' or 'file_name'"}, status=400)

    if not os.path.exists("OCEAN_COPEY.db"):
        return JsonResponse({"error": "'OCEAN_COPEY.db' does not exist"}, status=400)

    with open("OCEAN_COPEY.db", "rb") as file:
        content = base64.b64encode(file.read()).decode()

    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/BLUE_WHALE_OCEAN/DATABASE/{user}/{file_name}"
    payload = {"message": f"Add {file_name} for user {user}", "content": content, "branch": BRANCH}
    response = requests.put(url, json=payload, headers={"Authorization": f"Bearer {TOKEN}"})

    if response.status_code == 201:
        return JsonResponse({"message": "File uploaded successfully!"})
    return JsonResponse({"error": "Upload failed", "details": response.json()}, status=response.status_code)


@csrf_exempt
@require_GET
def delect_file_by_user(request):
    file_path = request.GET.get("file_path")
    if not file_path:
        return JsonResponse({"error": "file_path is required"}, status=400)

    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/BLUE_WHALE_OCEAN/DATABASE/{file_path}"
    response = requests.get(url, headers={"Authorization": f"Bearer {TOKEN}"})
    if response.status_code != 200:
        return JsonResponse({"error": "File not found", "details": response.json()}, status=response.status_code)

    sha = response.json().get("sha")
    if not sha:
        return JsonResponse({"error": "SHA not found"}, status=400)

    delete_response = requests.delete(url, headers={"Authorization": f"Bearer {TOKEN}"}, json={"message": f"Delete {file_path}", "sha": sha})
    if delete_response.status_code == 200:
        return JsonResponse({"message": "File deleted successfully!"})
    return JsonResponse({"error": "Delete failed", "details": delete_response.json()}, status=delete_response.status_code)


from django.http import JsonResponse
import base64
import sqlite3
import tempfile
import os
import requests

@csrf_exempt
@require_GET
def fetch_and_update_db(request):
    try:
        if request.method != "GET":
            return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)

        db_query = request.GET.get("db_query")
        file_path = request.GET.get("file_path")
        if not db_query or not file_path:
            return JsonResponse({"error": "Missing 'db_query' or 'file_path' parameter"}, status=400)

        url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/BLUE_WHALE_OCEAN/DATABASE/{file_path}"
        headers = {"Authorization": f"Bearer {TOKEN}"}
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            return JsonResponse({"error": "Failed to fetch database"}, status=500)

        content = response.json().get("content", "")
        sha = response.json().get("sha", "")
        if not content or not sha:
            return JsonResponse({"error": "Invalid response from GitHub"}, status=500)

        db_data = base64.b64decode(content)

        temp_file_path = None
        connection = None
        try:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(db_data)
                temp_file_path = temp_file.name

            connection = sqlite3.connect(temp_file_path)
            cursor = connection.cursor()
            cursor.execute(db_query)

            connection.commit()

            if db_query.strip().lower().startswith("select"):
                results = cursor.fetchall()
                columns = [description[0] for description in cursor.description] if cursor.description else []
                return JsonResponse({"columns": columns, "results": results}, safe=False)

            with open(temp_file_path, "rb") as modified_file:
                updated_db_content = modified_file.read()

        finally:
            if connection:
                connection.close()
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)

        encoded_content = base64.b64encode(updated_db_content).decode()
        update_data = {
            "message": "Update database",
            "content": encoded_content,
            "sha": sha,
        }
        update_response = requests.put(url, headers=headers, json=update_data)

        if update_response.status_code not in [200, 201]:
            return JsonResponse(
                {"error": f"Failed to update database: {update_response.status_code}", "details": update_response.text},
                status=update_response.status_code,
            )

        return JsonResponse({"message": "Database updated successfully!"})

    except sqlite3.DatabaseError as db_err:
        return JsonResponse({"error": f"{str(db_err)}"}, status=400)
