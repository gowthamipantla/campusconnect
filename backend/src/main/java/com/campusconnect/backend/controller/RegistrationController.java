package com.campusconnect.backend.controller;

import com.campusconnect.backend.model.Registration;
import com.campusconnect.backend.model.User;
import com.campusconnect.backend.repository.UserRepository;
import com.campusconnect.backend.service.RegistrationService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserRepository userRepository;

    public RegistrationController(RegistrationService registrationService, UserRepository userRepository) {
        this.registrationService = registrationService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<Registration> registerForEvent(@PathVariable Long eventId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Registration registration = registrationService.registerForEvent(eventId, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(registration);
    }

    @GetMapping("/me")
    public ResponseEntity<List<Registration>> getMyRegistrations(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(registrationService.getMyRegistrations(user.getId()));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN','CLUB_COORDINATOR')")
    public ResponseEntity<List<Registration>> getEventRegistrants(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getEventRegistrants(eventId));
    }

    @PutMapping("/{id}/attendance")
    @PreAuthorize("hasAnyRole('ADMIN','CLUB_COORDINATOR')")
    public ResponseEntity<Registration> markAttendance(
            @PathVariable Long id,
            @RequestParam(name = "attended", required = false) Boolean attendedParam,
            @RequestBody(required = false) Map<String, Object> body) {
        boolean attended = true;
        if (attendedParam != null) {
            attended = attendedParam;
        } else if (body != null && body.containsKey("attended")) {
            attended = Boolean.parseBoolean(String.valueOf(body.get("attended")));
        }
        return ResponseEntity.ok(registrationService.markAttendance(id, attended));
    }

    @GetMapping("/{id}/certificate")
    public ResponseEntity<Resource> downloadCertificate(@PathVariable Long id) {
        Registration registration = registrationService.getRegistrationById(id);
        if (registration.getCertificateUrl() == null || registration.getCertificateUrl().isBlank()) {
            throw new RuntimeException("Certificate not yet generated — attendance must be marked first");
        }

        String certificateUrl = registration.getCertificateUrl();
        String relativePath = certificateUrl.startsWith("/") ? certificateUrl.substring(1) : certificateUrl;
        Path path = Paths.get(relativePath);

        if (!Files.exists(path)) {
            path = Paths.get(System.getProperty("user.dir")).resolve(relativePath);
        }

        if (!Files.exists(path)) {
            throw new RuntimeException("Certificate file not found on server");
        }

        Resource resource = new FileSystemResource(path.toFile());
        String filename = path.getFileName().toString();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
