import requests, json;
from fastapi.exceptions import RequestValidationError

def notificationServiceEmailSender(data: dict, requestType: str):
    if requestType == "POST":
        response = requests.post(url() + "sendEmail", json=data)
    else:
        raise ValueError("Invalid requestType. Use 'POST'.")

def url():
    return "http://notification-service:8080/notification/"

if __name__ == "__main__":
    print(notificationServiceEmailSender({"test": "test"}, "POST"))