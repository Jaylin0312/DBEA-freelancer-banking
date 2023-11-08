import requests, json;
import os

notification_url = os.environ.get('notification_service') or "http://notification-service:8080"
payment_url = os.environ.get('payment_service') or "http://payment-service:80"

def notificationServiceEmailSender(data: dict, requestType: str):
    if requestType == "POST":
        response = requests.post(notificationUrl() + "/notification/sendEmail", json=data)
    else:
        raise ValueError("Invalid requestType. Use 'POST'.")

def notificationServiceSMSSender(data: dict, requestType: str):
    if requestType == "POST":
        response = requests.post(notificationUrl() + "/notification/sendSMS", json=data)
    else:
        raise ValueError("Invalid requestType. Use 'POST'.")

def paymentServiceDirectDebitPayment(data: dict, requestType: str):
    if requestType == "POST":
        response = requests.post(paymentUrl() + "/payment/authorize", json=data)
    else:
        raise ValueError("Invalid requestType. Use 'POST'.")

def notificationUrl():
    # return notification_url
    return notification_url

def paymentUrl():
    return payment_url
