package com.campusconnect.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(mailSender);
    }

    @Test
    void testSendRegistrationConfirmationSuccess() {
        String toEmail = "student@example.com";
        String studentName = "Alice Smith";
        String eventTitle = "AI Workshop";
        String eventDate = "October 10, 2026 2:00 PM";
        String venue = "Room 301";

        emailService.sendRegistrationConfirmation(toEmail, studentName, eventTitle, eventDate, venue);

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();
        assertNotNull(sentMessage);
        assertArrayEquals(new String[]{toEmail}, sentMessage.getTo());
        assertEquals("Registration Confirmed: AI Workshop", sentMessage.getSubject());
        assertNotNull(sentMessage.getText());
        assertTrue(sentMessage.getText().contains("Alice Smith"));
        assertTrue(sentMessage.getText().contains("AI Workshop"));
        assertTrue(sentMessage.getText().contains("October 10, 2026 2:00 PM"));
        assertTrue(sentMessage.getText().contains("Room 301"));
    }

    @Test
    void testSendRegistrationConfirmationHandlesExceptionWithoutThrowing() {
        doThrow(new MailSendException("SMTP server connection failed"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        assertDoesNotThrow(() ->
                emailService.sendRegistrationConfirmation(
                        "student@example.com",
                        "Alice Smith",
                        "AI Workshop",
                        "October 10, 2026 2:00 PM",
                        "Room 301"
                )
        );

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
