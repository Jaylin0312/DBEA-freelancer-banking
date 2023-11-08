package com.dbea.notificationservice.controller;

import org.springframework.web.bind.annotation.*;
// import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.dbea.notificationservice.model.NotificationServiceSMSRequest;
import com.dbea.notificationservice.model.NotificationServiceEmailRequest;
import com.dbea.notificationservice.service.ExternalService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/notification")
public class NotificationController {

    @Autowired
    private ExternalService externalService;

    @PostMapping("/health")
    public ResponseEntity<?> sendOTP(){
            return ResponseEntity.ok("notification success"); 
    }

    @PostMapping("/sendSMS")
    public ResponseEntity<?> sendSMS(@RequestBody NotificationServiceSMSRequest request){
        
        int response = externalService.sendSMS(request); 
        if(response == 10041){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("OTP expired, new OTP will be sent");
        }else if(response == 10000 ){
            return ResponseEntity.status(HttpStatus.OK).body("SMS sent");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        
        
    }

    @PostMapping("/sendEmail")
    public ResponseEntity<?> sendSMS(@RequestBody NotificationServiceEmailRequest request){
        
        int response = externalService.sendEmail(request); 
        if(response == 10041){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("OTP expired, new OTP will be sent");
        }else if(response == 10000 ){
            return ResponseEntity.status(HttpStatus.OK).body("Email sent");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        
        
    }



    
}
