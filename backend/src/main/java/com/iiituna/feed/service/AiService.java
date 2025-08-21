package com.iiituna.feed.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    @Value("${openai.api.key:your-api-key-here}")
    private String openaiApiKey;
    
    public AiService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = objectMapper;
    }
    
    public PostClassificationResult classifyPost(String prompt) {
        try {
            String systemPrompt = """
                You are an AI assistant that classifies campus feed posts into these categories:
                - EVENT: workshops, seminars, fests, meetings, conferences, competitions
                - LOST: missing items, lost belongings
                - FOUND: discovered items, found belongings  
                - ANNOUNCEMENT: notices, timetables, campus updates, academic announcements
                
                Extract relevant information and return JSON with:
                {
                  "type": "EVENT|LOST|FOUND|ANNOUNCEMENT",
                  "confidence": 0.0-1.0,
                  "extractedData": {
                    "title": "extracted title",
                    "description": "full description", 
                    "location": "extracted location",
                    "eventDate": "extracted date for events",
                    "itemName": "item name for lost/found",
                    "department": "department for announcements"
                  }
                }
                """;
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("max_tokens", 500);
            requestBody.put("temperature", 0.3);
            
            String response = webClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            return parseClassificationResponse(response);
            
        } catch (Exception e) {
            // Fallback to rule-based classification
            return fallbackClassification(prompt);
        }
    }
    
    public ToxicityResult checkToxicity(String content) {
        try {
            String systemPrompt = """
                Analyze the following text for toxicity, harassment, hate speech, or inappropriate content.
                Return JSON with:
                {
                  "isToxic": true/false,
                  "toxicityScore": 0.0-1.0,
                  "suggestion": "alternative phrasing if toxic"
                }
                """;
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", content)
            ));
            requestBody.put("max_tokens", 200);
            requestBody.put("temperature", 0.1);
            
            String response = webClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            return parseToxicityResponse(response);
            
        } catch (Exception e) {
            // Fallback: assume non-toxic
            return new ToxicityResult(false, 0.0, null);
        }
    }
    
    private PostClassificationResult parseClassificationResponse(String response) {
        try {
            JsonNode jsonResponse = objectMapper.readTree(response);
            String content = jsonResponse.path("choices").get(0).path("message").path("content").asText();
            JsonNode classificationJson = objectMapper.readTree(content);
            
            PostClassificationResult result = new PostClassificationResult();
            result.setType(classificationJson.path("type").asText().toLowerCase());
            result.setConfidence(classificationJson.path("confidence").asDouble(0.8));
            
            JsonNode extractedData = classificationJson.path("extractedData");
            result.setTitle(extractedData.path("title").asText(""));
            result.setDescription(extractedData.path("description").asText(""));
            result.setLocation(extractedData.path("location").asText(""));
            result.setEventDate(extractedData.path("eventDate").asText(""));
            result.setItemName(extractedData.path("itemName").asText(""));
            result.setDepartment(extractedData.path("department").asText(""));
            
            return result;
        } catch (Exception e) {
            return fallbackClassification(response);
        }
    }
    
    private ToxicityResult parseToxicityResponse(String response) {
        try {
            JsonNode jsonResponse = objectMapper.readTree(response);
            String content = jsonResponse.path("choices").get(0).path("message").path("content").asText();
            JsonNode toxicityJson = objectMapper.readTree(content);
            
            boolean isToxic = toxicityJson.path("isToxic").asBoolean(false);
            double score = toxicityJson.path("toxicityScore").asDouble(0.0);
            String suggestion = toxicityJson.path("suggestion").asText(null);
            
            return new ToxicityResult(isToxic, score, suggestion);
        } catch (Exception e) {
            return new ToxicityResult(false, 0.0, null);
        }
    }
    
    private PostClassificationResult fallbackClassification(String prompt) {
        PostClassificationResult result = new PostClassificationResult();
        String lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.contains("lost") || lowerPrompt.contains("missing")) {
            result.setType("lost");
        } else if (lowerPrompt.contains("found") || lowerPrompt.contains("discovered")) {
            result.setType("found");
        } else if (lowerPrompt.contains("event") || lowerPrompt.contains("workshop") || 
                   lowerPrompt.contains("seminar") || lowerPrompt.contains("meeting")) {
            result.setType("event");
        } else {
            result.setType("announcement");
        }
        
        result.setConfidence(0.7);
        result.setTitle(prompt.substring(0, Math.min(50, prompt.length())));
        result.setDescription(prompt);
        
        return result;
    }
    
    // Inner classes for response objects
    public static class PostClassificationResult {
        private String type;
        private double confidence;
        private String title;
        private String description;
        private String location;
        private String eventDate;
        private String itemName;
        private String department;
        
        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        
        public String getEventDate() { return eventDate; }
        public void setEventDate(String eventDate) { this.eventDate = eventDate; }
        
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }
    
    public static class ToxicityResult {
        private boolean isToxic;
        private double toxicityScore;
        private String suggestion;
        
        public ToxicityResult(boolean isToxic, double toxicityScore, String suggestion) {
            this.isToxic = isToxic;
            this.toxicityScore = toxicityScore;
            this.suggestion = suggestion;
        }
        
        public boolean isToxic() { return isToxic; }
        public double getToxicityScore() { return toxicityScore; }
        public String getSuggestion() { return suggestion; }
    }
}
