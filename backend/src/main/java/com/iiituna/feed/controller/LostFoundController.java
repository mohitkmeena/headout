package com.iiituna.feed.controller;

import com.iiituna.feed.dto.LostFoundDto;
import com.iiituna.feed.entity.LostFound;
import com.iiituna.feed.entity.LostFound.LostFoundType;
import com.iiituna.feed.repository.LostFoundRepository;
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
@RequestMapping("/api/lost-found")
@CrossOrigin(origins = "*")
public class LostFoundController {
    
    @Autowired
    private LostFoundRepository lostFoundRepository;
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("LostFound API is working!");
    }
    // Get all lost & found items
    @GetMapping
    public ResponseEntity<List<LostFoundDto>> getAllItems() {
        try {
            List<LostFound> items = lostFoundRepository.findAllByOrderByCreatedAtDesc();
            List<LostFoundDto> itemDtos = items.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(itemDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get item by ID
    @GetMapping("/{id}")
    public ResponseEntity<LostFoundDto> getItemById(@PathVariable Long id) {
        Optional<LostFound> item = lostFoundRepository.findById(id);
        if (item.isPresent()) {
            return ResponseEntity.ok(convertToDto(item.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Create new lost/found item
    @PostMapping
    public ResponseEntity<LostFoundDto> createItem(@Valid @RequestBody LostFoundDto lostFoundDto, @RequestParam String userId) {
        LostFound item = convertToEntity(lostFoundDto);
        item.setCreatedBy(userId);
        item.setCreatedAt(LocalDateTime.now());
        item.setIncidentDate(LocalDateTime.now());
        
        LostFound savedItem = lostFoundRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedItem));
    }
    
    // Update item
    @PutMapping("/{id}")
    public ResponseEntity<LostFoundDto> updateItem(@PathVariable Long id, @Valid @RequestBody LostFoundDto lostFoundDto, @RequestParam String userId) {
        Optional<LostFound> existingItem = lostFoundRepository.findById(id);
        if (existingItem.isPresent()) {
            LostFound item = existingItem.get();
            
            // Check if user is the creator
            if (!item.getCreatedBy().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Update fields
            item.setItemName(lostFoundDto.getItemName());
            item.setDescription(lostFoundDto.getDescription());
            item.setLocation(lostFoundDto.getLocation());
            item.setImageUrl(lostFoundDto.getImageUrl());
            item.setContactInfo(lostFoundDto.getContactInfo());
            
            LostFound savedItem = lostFoundRepository.save(item);
            return ResponseEntity.ok(convertToDto(savedItem));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Delete item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id, @RequestParam String userId) {
        Optional<LostFound> item = lostFoundRepository.findById(id);
        if (item.isPresent()) {
            // Check if user is the creator
            if (!item.get().getCreatedBy().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            lostFoundRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Mark item as resolved
    @PostMapping("/{id}/resolve")
    public ResponseEntity<LostFoundDto> resolveItem(@PathVariable Long id, @RequestParam String userId) {
        Optional<LostFound> itemOpt = lostFoundRepository.findById(id);
        if (itemOpt.isPresent()) {
            LostFound item = itemOpt.get();
            item.markAsResolved(userId);
            LostFound savedItem = lostFoundRepository.save(item);
            return ResponseEntity.ok(convertToDto(savedItem));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Get items by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<LostFoundDto>> getItemsByType(@PathVariable String type) {
        try {
            LostFoundType lostFoundType = LostFoundType.valueOf(type.toUpperCase());
            List<LostFound> items = lostFoundRepository.findByTypeOrderByCreatedAtDesc(lostFoundType);
            List<LostFoundDto> itemDtos = items.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(itemDtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get unresolved items
    @GetMapping("/unresolved")
    public ResponseEntity<List<LostFoundDto>> getUnresolvedItems() {
        List<LostFound> items = lostFoundRepository.findByIsResolvedOrderByCreatedAtDesc(false);
        List<LostFoundDto> itemDtos = items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(itemDtos);
    }
    
    // Search items
    @GetMapping("/search")
    public ResponseEntity<List<LostFoundDto>> searchItems(@RequestParam String keyword) {
        List<LostFound> items = lostFoundRepository.findByItemNameOrDescriptionContainingIgnoreCase(keyword);
        List<LostFoundDto> itemDtos = items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(itemDtos);
    }
    
    // Get statistics
    @GetMapping("/stats")
    public ResponseEntity<Object> getStatistics() {
        long totalItems = lostFoundRepository.count();
        long lostItems = lostFoundRepository.countByType(LostFoundType.LOST);
        long foundItems = lostFoundRepository.countByType(LostFoundType.FOUND);
        long resolvedItems = lostFoundRepository.countByIsResolved(true);
        
        return ResponseEntity.ok(new Object() {
            public final long total = totalItems;
            public final long lost = lostItems;
            public final long found = foundItems;
            public final long resolved = resolvedItems;
            public final long unresolved = totalItems - resolvedItems;
        });
    }
    
    // Get user's items
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LostFoundDto>> getUserItems(@PathVariable String userId) {
        List<LostFound> items = lostFoundRepository.findByCreatedByOrderByCreatedAtDesc(userId);
        List<LostFoundDto> itemDtos = items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(itemDtos);
    }
    
    // Get recent items (last 7 days)
    @GetMapping("/recent")
    public ResponseEntity<List<LostFoundDto>> getRecentItems() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<LostFound> items = lostFoundRepository.findByCreatedAtAfterOrderByCreatedAtDesc(sevenDaysAgo);
        List<LostFoundDto> itemDtos = items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(itemDtos);
    }
    
    // Helper methods
    private LostFoundDto convertToDto(LostFound item) {
        LostFoundDto dto = new LostFoundDto();
        dto.setId(item.getId());
        dto.setItemName(item.getItemName());
        dto.setDescription(item.getDescription());
        dto.setType(item.getType().toString());
        dto.setLocation(item.getLocation());
        dto.setIncidentDate(item.getIncidentDate());
        dto.setImageUrl(item.getImageUrl());
        dto.setContactInfo(item.getContactInfo());
        dto.setCreatedBy(item.getCreatedBy());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setIsResolved(item.getIsResolved());
        dto.setResolvedAt(item.getResolvedAt());
        dto.setResolvedBy(item.getResolvedBy());
        return dto;
    }
    
    private LostFound convertToEntity(LostFoundDto dto) {
        LostFound item = new LostFound();
        item.setItemName(dto.getItemName());
        item.setDescription(dto.getDescription());
        item.setType(LostFoundType.valueOf(dto.getType().toUpperCase()));
        item.setLocation(dto.getLocation());
        item.setImageUrl(dto.getImageUrl());
        item.setContactInfo(dto.getContactInfo());
        return item;
    }
}
