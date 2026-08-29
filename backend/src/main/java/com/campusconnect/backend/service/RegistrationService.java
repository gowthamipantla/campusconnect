package com.campusconnect.backend.service;

import com.campusconnect.backend.model.Event;
import com.campusconnect.backend.model.Registration;
import com.campusconnect.backend.model.User;
import com.campusconnect.backend.repository.EventRepository;
import com.campusconnect.backend.repository.RegistrationRepository;
import com.campusconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RegistrationService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final CertificateService certificateService;
    private final EmailService emailService;

    public RegistrationService(EventRepository eventRepository,
                               RegistrationRepository registrationRepository,
                               UserRepository userRepository,
                               CertificateService certificateService,
                               EmailService emailService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.certificateService = certificateService;
        this.emailService = emailService;
    }

    @Transactional
    public Registration registerForEvent(Long eventId, Long userId) {
        if (registrationRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new RuntimeException("Already registered for this event");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        int currentCount = event.getRegisteredCount() == null ? 0 : event.getRegisteredCount();
        if (currentCount >= event.getCapacity()) {
            throw new RuntimeException("Event is full");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        event.setRegisteredCount(currentCount + 1);
        eventRepository.save(event);

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setRegisteredAt(LocalDateTime.now());
        registration.setAttended(false);

        Registration savedRegistration = registrationRepository.save(registration);

        String eventDateFormatted = "N/A";
        if (event.getEventDate() != null) {
            eventDateFormatted = event.getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy h:mm a"));
        }

        emailService.sendRegistrationConfirmation(
                user.getEmail(),
                user.getName(),
                event.getTitle(),
                eventDateFormatted,
                event.getVenue()
        );

        return savedRegistration;
    }

    public List<Registration> getMyRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    public List<Registration> getEventRegistrants(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    public Registration getRegistrationById(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }

    @Transactional
    public Registration markAttendance(Long registrationId, boolean attended) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registration.setAttended(attended);
        registration = registrationRepository.save(registration);

        if (attended) {
            String certificatePath = certificateService.generateCertificate(registration);
            registration.setCertificateUrl(certificatePath);
            registration = registrationRepository.save(registration);
        }

        return registration;
    }
}
