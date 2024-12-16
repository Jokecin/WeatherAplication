package com.example.weather.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import jakarta.annotation.PostConstruct;

@Service
public class GeoDbService {

    @Value("${geodb.api.key}")
    private String geoDbApiKey;

    private final WebClient webClient;

    // ANSI escape codes para el texto rojo
    private static final String RED_TEXT = "\u001B[31m";
    private static final String RESET_TEXT = "\u001B[0m";

    public GeoDbService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://wft-geo-db.p.rapidapi.com/v1/geo")
                .defaultHeader("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com")
                .build();
    }

    @PostConstruct
    public void init() {
        if (geoDbApiKey == null || geoDbApiKey.isEmpty()) {
            System.out.println(RED_TEXT + "[GeoDB] ⚠️ GeoDB API Key no configurada. Verifica el archivo application.properties." + RESET_TEXT);
        } else {
            System.out.println(RED_TEXT + "[GeoDB] ✅ GeoDB API Key cargada correctamente: " + geoDbApiKey + RESET_TEXT);
        }
    }

    public String searchCities(String query) {
        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/cities")
                            .queryParam("namePrefix", query)
                            .build())
                    .header("X-RapidAPI-Key", geoDbApiKey)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            System.err.println(RED_TEXT + "[GeoDB] ❌ Error en la consulta de ciudades: " + e.getMessage() + RESET_TEXT);
            return null;
        }
    }
}
