package com.iiituna.feed.controller;

import com.iiituna.feed.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AiController {
    
    @Autowired
    private AiService aiService;
    
    @PostMapping("/classify")
    public ResponseEntity<AiService.PostClassificationResult> classifyPost(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        AiService.PostClassificationResult result = aiService.classifyPost(prompt);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/check-toxicity")
    public ResponseEntity<AiService.ToxicityResult> checkToxicity(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        AiService.ToxicityResult result = aiService.checkToxicity(content);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/generate-meme")
    public ResponseEntity<Map<String, String>> generateMeme(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Mock meme generation for now - in real implementation, this would call an image generation API
        String memeUrl = "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=" + 
                        prompt.replace(" ", "+").substring(0, Math.min(20, prompt.length()));
        
        return ResponseEntity.ok(Map.of(
            "imageUrl", memeUrl,
            "prompt", prompt,
            "success", "true"
        ));
    }
}
