package com.iiituna.feed.controller;

import com.iiituna.feed.dto.EventDto;
import com.iiituna.feed.entity.Event;
import com.iiituna.feed.entity.Event.EventResponse;
import com.iiituna.feed.repository.EventRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventRepository eventRepository;
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Events API is working!");
    }
    
    // Get all events
    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents(@RequestParam(required = false) String userId) {
        List<Event> events = eventRepository.findAllByOrderByCreatedAtDesc();
        List<EventDto> eventDtos = events.stream()
                .map(event -> convertToDto(event, userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDtos);
    }
    
    // Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id, @RequestParam(required = false) String userId) {
        Optional<Event> event = eventRepository.findById(id);
        if (event.isPresent()) {
            return ResponseEntity.ok(convertToDto(event.get(), userId));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Create new event
    @PostMapping
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody EventDto eventDto, @RequestParam String userId) {
        Event event = convertToEntity(eventDto);
        event.setCreatedBy(userId);
        event.setCreatedAt(LocalDateTime.now());
        
        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedEvent, userId));
    }
    
    // Update event
    @PutMapping("/{id}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id, @Valid @RequestBody EventDto eventDto, @RequestParam String userId) {
        Optional<Event> existingEvent = eventRepository.findById(id);
        if (existingEvent.isPresent()) {
            Event event = existingEvent.get();
            
            // Check if user is the creator
            if (!event.getCreatedBy().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Update fields
            event.setTitle(eventDto.getTitle());
            event.setDescription(eventDto.getDescription());
            event.setLocation(eventDto.getLocation());
            event.setEventDate(eventDto.getEventDate());
            event.setImageUrl(eventDto.getImageUrl());
            
            Event savedEvent = eventRepository.save(event);
            return ResponseEntity.ok(convertToDto(savedEvent, userId));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, @RequestParam String userId) {
        Optional<Event> event = eventRepository.findById(id);
        if (event.isPresent()) {
            // Check if user is the creator
            if (!event.get().getCreatedBy().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            eventRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Add/Update event response
    @PostMapping("/{id}/response")
    public ResponseEntity<EventDto> addEventResponse(@PathVariable Long id, @RequestParam String userId, @RequestParam String response) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            
            try {
                EventResponse eventResponse = EventResponse.valueOf(response.toUpperCase());
                event.addUserResponse(userId, eventResponse);
                Event savedEvent = eventRepository.save(event);
                return ResponseEntity.ok(convertToDto(savedEvent, userId));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    // Get upcoming events
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDto>> getUpcomingEvents(@RequestParam(required = false) String userId) {
        List<Event> events = eventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDateTime.now());
        List<EventDto> eventDtos = events.stream()
                .map(event -> convertToDto(event, userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDtos);
    }
    
    // Search events
    @GetMapping("/search")
    public ResponseEntity<List<EventDto>> searchEvents(@RequestParam String keyword, @RequestParam(required = false) String userId) {
        List<Event> events = eventRepository.findByTitleOrDescriptionContainingIgnoreCase(keyword);
        List<EventDto> eventDtos = events.stream()
                .map(event -> convertToDto(event, userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDtos);
    }
    
    // Get events by location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<EventDto>> getEventsByLocation(@PathVariable String location, @RequestParam(required = false) String userId) {
        List<Event> events = eventRepository.findByLocationContainingIgnoreCase(location);
        List<EventDto> eventDtos = events.stream()
                .map(event -> convertToDto(event, userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDtos);
    }
    
    // Get user's events
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventDto>> getUserEvents(@PathVariable String userId, @RequestParam(required = false) String currentUserId) {
        List<Event> events = eventRepository.findByCreatedByOrderByCreatedAtDesc(userId);
        List<EventDto> eventDtos = events.stream()
                .map(event -> convertToDto(event, currentUserId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDtos);
    }
    
    // Get events for today
    @GetMapping("/today")
    public ResponseEntity<List<EventDto>> getTodayEvents(@RequestParam(required = false) String userId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        List<Event> events = eventRepository.findByEventDateBetweenOrderByEventDateAsc(startOfDay, endOfDay);
        List<EventDto> eventDtos = events.stream()
                .map(event -> convertToDto(event, userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDtos);
    }
    
    // Get event statistics
    @GetMapping("/stats")
    public ResponseEntity<Object> getEventStatistics() {
        long totalEvents = eventRepository.count();
        long upcomingEvents = eventRepository.countByEventDateAfter(LocalDateTime.now());
        long pastEvents = totalEvents - upcomingEvents;
        
        return ResponseEntity.ok(new Object() {
            public final long total = totalEvents;
            public final long upcoming = upcomingEvents;
            public final long past = pastEvents;
        });
    }
    
    // Helper methods
    private EventDto convertToDto(Event event, String userId) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setEventDate(event.getEventDate());
        dto.setImageUrl(event.getImageUrl());
        dto.setCreatedBy(event.getCreatedBy());
        dto.setCreatedAt(event.getCreatedAt());
        
        // Set response counts
        dto.setGoingCount(event.getGoingCount());
        dto.setInterestedCount(event.getInterestedCount());
        dto.setNotGoingCount(event.getNotGoingCount());
        
        // Set user's response if userId is provided
        if (userId != null) {
            EventResponse userResponse = event.getUserResponse(userId);
            dto.setUserResponse(userResponse != null ? userResponse.toString() : null);
        }
        
        return dto;
    }
    
    private Event convertToEntity(EventDto dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());
        event.setEventDate(dto.getEventDate());
        event.setImageUrl(dto.getImageUrl());
        return event;
    }
}
