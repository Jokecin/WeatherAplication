package com.example.weather.controller;

import com.example.weather.service.GeoDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/geo")
public class GeoDbController {

    private final GeoDbService geoDbService;

    @Autowired
    public GeoDbController(GeoDbService geoDbService) {
        this.geoDbService = geoDbService;
    }

    @GetMapping("/cities")
    public ResponseEntity<List<Map<String, Object>>> searchCities(@RequestParam String query) {
        List<Map<String, Object>> cities = geoDbService.searchCities(query);
        return ResponseEntity.ok(cities);
    }
}