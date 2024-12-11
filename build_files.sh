pip3 install -r requirements.txt


echo "collecting static"

python manage.py collectstatic --noinput

echo "collected static"

echo "Setup completed successfully!"