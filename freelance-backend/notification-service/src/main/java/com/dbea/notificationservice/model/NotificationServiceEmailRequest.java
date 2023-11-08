package com.dbea.notificationservice.model;

import lombok.*; 
import jakarta.annotation.Nonnull;

@Getter
@Setter
@ToString
@AllArgsConstructor
@EqualsAndHashCode
public class NotificationServiceEmailRequest {
    
    @Nonnull
    public String userID;
    @Nonnull
    public int pin;
    @Nonnull
    public int otp;
    @Nonnull 
    public String emailAddress;
    @Nonnull
    public String emailSubject;
    @Nonnull
    public String emailBody;


}
