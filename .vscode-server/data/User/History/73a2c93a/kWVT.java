package com.example.weather.controller;

import com.example.weather.service.GeoDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class GeoDbController {

    @Autowired
    private GeoDbService geoDbService;

    @GetMapping("/api/cities")
    public String getCities(@RequestParam String query) {
        return geoDbService.searchCities(query);
    }
}
