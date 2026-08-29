package com.campusconnect.backend.service;

import com.campusconnect.backend.model.Event;
import com.campusconnect.backend.model.Registration;
import com.campusconnect.backend.model.User;
import com.campusconnect.backend.repository.EventRepository;
import com.campusconnect.backend.repository.RegistrationRepository;
import com.campusconnect.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CertificateService certificateService;

    @Mock
    private EmailService emailService;

    private RegistrationService registrationService;

    @BeforeEach
    void setUp() {
        registrationService = new RegistrationService(
                eventRepository,
                registrationRepository,
                userRepository,
                certificateService,
                emailService
        );
    }

    @Test
    void testMarkAttendanceTrueGeneratesCertificate() {
        Registration registration = new Registration();
        registration.setId(5L);
        registration.setAttended(false);

        when(registrationRepository.findById(5L)).thenReturn(Optional.of(registration));
        when(registrationRepository.save(any(Registration.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(certificateService.generateCertificate(registration)).thenReturn("/certificates/certificate_5.pdf");

        Registration result = registrationService.markAttendance(5L, true);

        assertTrue(result.getAttended());
        assertEquals("/certificates/certificate_5.pdf", result.getCertificateUrl());
        verify(certificateService, times(1)).generateCertificate(registration);
        verify(registrationRepository, times(2)).save(registration);
    }

    @Test
    void testMarkAttendanceFalseDoesNotGenerateCertificate() {
        Registration registration = new Registration();
        registration.setId(5L);
        registration.setAttended(false);

        when(registrationRepository.findById(5L)).thenReturn(Optional.of(registration));
        when(registrationRepository.save(any(Registration.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Registration result = registrationService.markAttendance(5L, false);

        assertFalse(result.getAttended());
        assertNull(result.getCertificateUrl());
        verify(certificateService, never()).generateCertificate(any());
        verify(registrationRepository, times(1)).save(registration);
    }

    @Test
    void testRegisterForEventSendsConfirmationEmail() {
        Long eventId = 1L;
        Long userId = 2L;

        Event event = new Event();
        event.setId(eventId);
        event.setTitle("Hackathon 2026");
        event.setCapacity(50);
        event.setRegisteredCount(10);
        event.setVenue("Auditorium A");
        event.setEventDate(java.time.LocalDateTime.of(2026, 9, 15, 10, 0));

        User user = new User();
        user.setId(userId);
        user.setName("John Doe");
        user.setEmail("john.doe@university.edu");

        when(registrationRepository.existsByEventIdAndUserId(eventId, userId)).thenReturn(false);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(registrationRepository.save(any(Registration.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Registration registration = registrationService.registerForEvent(eventId, userId);

        assertNotNull(registration);
        assertEquals(event, registration.getEvent());
        assertEquals(user, registration.getUser());
        assertEquals(11, event.getRegisteredCount());

        verify(emailService, times(1)).sendRegistrationConfirmation(
                eq("john.doe@university.edu"),
                eq("John Doe"),
                eq("Hackathon 2026"),
                contains("September 15, 2026"),
                eq("Auditorium A")
        );
    }
}
