pip3 install -r requirements.txt


echo "collecting static"

python3 manage.py collectstatic --noinput

echo "collected static"

echo "Setup completed successfully!"