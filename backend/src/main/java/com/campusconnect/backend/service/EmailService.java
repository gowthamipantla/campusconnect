package com.campusconnect.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegistrationConfirmation(String toEmail, String studentName, String eventTitle, String eventDate, String venue) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Registration Confirmed: " + eventTitle);

            String body = String.format(
                    "Dear %s,\n\n" +
                    "Your registration for the following event has been successfully confirmed!\n\n" +
                    "Event Details:\n" +
                    "------------------------------------\n" +
                    "Event: %s\n" +
                    "Date:  %s\n" +
                    "Venue: %s\n" +
                    "------------------------------------\n\n" +
                    "We look forward to seeing you there.\n\n" +
                    "Best regards,\n" +
                    "CampusConnect Team",
                    (studentName != null && !studentName.isBlank()) ? studentName : "Student",
                    (eventTitle != null) ? eventTitle : "N/A",
                    (eventDate != null) ? eventDate : "N/A",
                    (venue != null && !venue.isBlank()) ? venue : "TBA"
            );

            message.setText(body);

            mailSender.send(message);
            logger.info("Registration confirmation email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send registration confirmation email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}
