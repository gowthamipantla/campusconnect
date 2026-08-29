package com.campusconnect.backend.service;

import com.campusconnect.backend.model.Event;
import com.campusconnect.backend.model.Registration;
import com.campusconnect.backend.model.User;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class CertificateServiceTest {

    @Test
    void testGenerateCertificateCreatesPdf() {
        CertificateService certificateService = new CertificateService();

        User user = new User();
        user.setId(1L);
        user.setName("John Doe");

        Event event = new Event();
        event.setId(10L);
        event.setTitle("Spring Boot Hackathon");
        event.setClubName("Coding Club");
        event.setEventDate(LocalDateTime.of(2026, 9, 15, 10, 0));

        Registration registration = new Registration();
        registration.setId(999L);
        registration.setUser(user);
        registration.setEvent(event);

        String path = certificateService.generateCertificate(registration);
        assertEquals("/certificates/certificate_999.pdf", path);

        Path pdfPath = Paths.get("certificates", "certificate_999.pdf");
        assertTrue(Files.exists(pdfPath), "PDF file should exist on disk");
        assertTrue(pdfPath.toFile().length() > 0, "PDF file should not be empty");

        // Clean up test file
        try {
            Files.deleteIfExists(pdfPath);
        } catch (Exception ignored) {
        }
    }
}
