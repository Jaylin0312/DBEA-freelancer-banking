import requests, json;
from fastapi.exceptions import RequestValidationError

def externalServiceSender(headerObj: dict, requestType: str):
    finalUrl = "{0}?Header={1}".format(url(), json.dumps(headerObj))
    
    if requestType == "GET":
        response = requests.get(finalUrl)

    if requestType == "POST":
        response = requests.post(finalUrl)

    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        return response.json()['Content']['ServiceResponse'];

    else: 
        # Raise RequestValidationError
        raise RequestValidationError(errors=[{"message": serviceRespHeader["ErrorDetails"]}])

def externalServiceSenderWithContent(headerObj: dict, contentObj: dict, requestType: str):
    finalUrl = "{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    if requestType == "GET":
        response = requests.get(finalUrl)

    if requestType == "POST":
        response = requests.post(finalUrl)

    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']
    if errorCode == '010000':
        return response.json()['Content']['ServiceResponse'];
    else: 
        # Raise RequestValidationError
        print("Error in externalServiceSenderWithContent: ", serviceRespHeader["ErrorDetails"])
        raise RequestValidationError(errors=[{"message": serviceRespHeader["ErrorDetails"]}])


def url():
    return "http://tbankonline.com/SMUtBank_API/Gateway"

if __name__ == "__main__":
    print(externalServiceSender({"test": "test"}, "GET"))