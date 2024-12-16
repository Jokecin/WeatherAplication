package com.example.weather.controller;

import com.example.weather.service.GeoDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/geo")
public class GeoDbController {

    private final GeoDbService geoDbService;

    @Autowired
    public GeoDbController(GeoDbService geoDbService) {
        this.geoDbService = geoDbService;
    }

    @GetMapping("/cities")
    public ResponseEntity<String> searchCities(@RequestParam String query) {
        String response = geoDbService.searchCities(query);
        return ResponseEntity.ok(response);
    }
}