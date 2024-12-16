package com.example.weather.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String openWeatherApiKey;

    private final String openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";

    public String getWeatherByCity(String city) {
        WebClient webClient = WebClient.create();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(openWeatherApiUrl)
                        .queryParam("q", city)
                        .queryParam("appid", openWeatherApiKey) // Usa la clave correctamente inyectada
                        .queryParam("units", "metric")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
    @PostConstruct
    public void init() {
        System.out.println("OpenWeather API Key: " + openWeatherApiKey);
    }
}
