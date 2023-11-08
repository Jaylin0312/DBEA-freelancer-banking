package com.dbea.notificationservice.service;

import java.io.*;
import java.util.*;
import java.net.*;
import org.json.*;

import org.springframework.stereotype.Service;
import com.dbea.notificationservice.model.NotificationServiceSMSRequest;
import com.dbea.notificationservice.model.NotificationServiceEmailRequest;

@Service
public class ExternalService {

    String apiServiceUrl = "http://tbankonline.com/SMUtBank_API/Gateway";
    boolean verbose ;
    // response parameters
    String globalErrorID = "";
    String errorText = "";
    String errorDetails = "";
    String serviceName; 
    String userID = "";
    String PIN = "";
    String OTP = "";
    String message = "";
    String mobileNumber = "";
    String emailAddress = ""; 
    String emailSubject = ""; 
    String emailBody = "";

    public int sendSMS(NotificationServiceSMSRequest request) {
        verbose = true;
        serviceName = "sendSMS";
        userID = request.getUserID();
        PIN = "" + request.getPin();
        OTP = "" + request.getOtp();
        message = request.getMessage();
        mobileNumber = "" + request.getMobileNumber();
        try {
            String header = createHeader();
            // build content
            String content = createSMSContent();
            // connect to API service
            // get response object
            JSONObject responseObj = getResponse(header, content);
            System.out.println(responseObj);

            if (verbose) {
                System.out.println(responseObj.toString(4)); // indent 4 spaces
                System.out.println();
            }
            JSONObject contentObj = new JSONObject();
            // parse {"Content"}
            contentObj = responseObj.getJSONObject("Content");
            // parse {"ServiceResponse"}
            JSONObject serviceRespObj = contentObj.getJSONObject("ServiceResponse");
            // parse {"ServiceRespHeader"}
            JSONObject serviceRespHeaderObj = serviceRespObj.getJSONObject("ServiceRespHeader");

            globalErrorID = serviceRespHeaderObj.getString("GlobalErrorID");
            errorText = serviceRespHeaderObj.getString("ErrorText");
            if (globalErrorID.equals("010041")) {
                System.out.println(errorText);
            }
            else if (!globalErrorID.equals("010000")) {
                System.out.println(errorText);
            } else {
                System.out.println(errorText);
            }
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
        return Integer.parseInt(globalErrorID);

    }

    public int sendEmail(NotificationServiceEmailRequest request){
        
        // request parameters
        serviceName = "sendEmail";
        userID = request.getUserID();
        PIN = "" + request.getPin();
        OTP = "" + request.getOtp();
        emailAddress = request.getEmailAddress();
        emailSubject = request.getEmailSubject();
        emailBody = request.getEmailBody();

        try{
             // build header
            String header = createHeader();
            // build content
            String content = createEmailContent();
            // send request
            JSONObject responseObj = getResponse(header, content);

            // parse response
            System.out.println(responseObj.toString(4)); 
            System.out.println();                    
            //parse {"Content"}
            JSONObject contentObj = responseObj.getJSONObject("Content");                       
            //parse {"ServiceResponse"}
            JSONObject serviceRespObj = contentObj.getJSONObject("ServiceResponse");
            //parse {"ServiceRespHeader"}

            JSONObject serviceRespHeaderObj = serviceRespObj.getJSONObject("ServiceRespHeader");
            globalErrorID = serviceRespHeaderObj.getString("GlobalErrorID");
            errorText = serviceRespHeaderObj.getString("ErrorText");
            errorDetails = serviceRespHeaderObj.getString("ErrorDetails");
            
            if(globalErrorID.equals("010041"))
            {
                System.out.println(errorText);
                System.out.println(errorDetails);      
            }else if(!globalErrorID.equals("010000"))
            {
                System.out.println(errorText);
                System.out.println(errorDetails);  
            }else{
                System.out.println("Email sent.");
            }
        }catch(Exception e){
            System.out.println(e.toString());
        }
        return Integer.parseInt(globalErrorID);
    }   


    public String createHeader(){
        JSONObject jo = new JSONObject();
        jo.put("serviceName", serviceName);
        jo.put("userID", userID);
        jo.put("PIN", PIN);
        jo.put("OTP", OTP);
        JSONObject headerObj = new JSONObject();
        headerObj.put("Header", jo);
        String header = headerObj.toString();
        return header;
    }

    public String createSMSContent(){
        JSONObject jo = new JSONObject();
        jo.put("mobileNumber", mobileNumber);
        jo.put("message", message);
        JSONObject contentObj = new JSONObject();
        contentObj.put("Content", jo);
        String content = contentObj.toString();
        return content;
    }

    public String createEmailContent(){
        JSONObject jo = new JSONObject();
        jo.put("emailAddress", emailAddress);
        jo.put("emailSubject", emailSubject);
        jo.put("emailBody", emailBody);
        JSONObject contentObj = new JSONObject();
        contentObj.put("Content", jo);
        String content = contentObj.toString();
        return content;
    }

    public JSONObject getResponse(String header, String content){
        HttpURLConnection urlConnection;
        JSONObject responseObj = null;
        try {
            urlConnection = (HttpURLConnection) new URL(apiServiceUrl).openConnection();
            urlConnection.setDoOutput(true);
            urlConnection.setRequestMethod("POST");
        
            // build request parameters
            String parameters
                    = "Header="+header+"&"
                    + "Content="+content;
            // send request
            BufferedWriter br = new BufferedWriter(new OutputStreamWriter(urlConnection.getOutputStream()));
            br.write(parameters);
            br.close();                       
            // get response
            String response = "";
            Scanner s = new Scanner(urlConnection.getInputStream());
            while (s.hasNextLine()){
                    response += s.nextLine();
            }
            s.close();                       
            // get response object
            responseObj = new JSONObject(response);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return responseObj;

        

    }

}

