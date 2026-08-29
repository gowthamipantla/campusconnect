package com.campusconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String category;

    private String clubName;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotNull(message = "Capacity is required")
    private Integer capacity;
}
