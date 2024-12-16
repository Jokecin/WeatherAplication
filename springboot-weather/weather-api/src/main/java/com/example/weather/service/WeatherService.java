package com.example.weather.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String openWeatherApiKey;

    private final WebClient webClient; // Define el WebClient a nivel de clase

    // Constructor para inicializar WebClient con la URL base
    public WeatherService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openweathermap.org/data/2.5") // URL base
                .build();
    }

    public String getWeatherByCity(String city) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/weather") // Ahora usamos solo la ruta relativa
                        .queryParam("q", city) // Ciudad
                        .queryParam("appid", openWeatherApiKey) // API Key
                        .queryParam("units", "metric") // Métricas en Celsius
                        .build())
                .retrieve()
                .bodyToMono(String.class) // Respuesta convertida a String
                .block();
    }

    @PostConstruct
    public void init() {
        System.out.println("OpenWeather API Key: " + openWeatherApiKey);
    }
}
