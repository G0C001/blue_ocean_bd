pip3 install -r requirements.txt


echo "collecting static"

python3.12 manage.py collectstatic

echo "collected static"

echo "Setup completed successfully!"