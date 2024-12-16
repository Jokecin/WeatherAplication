package com.example.weather.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

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

    public List<Map<String, Object>> searchCities(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/cities")
                        .queryParam("namePrefix", query)
                        .queryParam("limit", 5) // Limita a 5 resultados
                        .build())
                .header("X-RapidAPI-Key", geoDbApiKey)
                .retrieve()
                .bodyToMono(Map.class) // Convierte la respuesta a un Map
                .block()
                .get("data"); // Devuelve solo la lista de ciudades
    }
}
