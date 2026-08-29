package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.EventRequest;
import com.campusconnect.backend.model.Event;
import com.campusconnect.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(EventRequest request, Long createdByUserId) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setClubName(request.getClubName());
        event.setEventDate(request.getEventDate());
        event.setVenue(request.getVenue());
        event.setCapacity(request.getCapacity());
        event.setRegisteredCount(0);
        event.setCreatedBy(createdByUserId);

        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event updateEvent(Long id, EventRequest request) {
        Event event = getEventById(id);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setClubName(request.getClubName());
        event.setEventDate(request.getEventDate());
        event.setVenue(request.getVenue());
        event.setCapacity(request.getCapacity());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}
