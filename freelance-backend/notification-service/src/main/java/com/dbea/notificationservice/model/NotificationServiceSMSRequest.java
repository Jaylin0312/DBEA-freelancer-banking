package com.dbea.notificationservice.model;

import jakarta.annotation.Nonnull;

import jakarta.validation.constraints.NotNull;
import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationServiceSMSRequest {
    @NotNull
    private String userID;
    @NotNull
    public int pin; 
    @NotNull
    public int otp;
    @NotNull
    public String mobileNumber;
    @NotNull
    public String message;
    
}
