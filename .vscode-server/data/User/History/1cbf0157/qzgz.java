package com.example.weather.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WeatherService {

    private final WebClient webClient;

    @Value("${openweather.api.key}")
    private String apiKey;

    @Value("${openweather.api.url}")
    private String apiUrl;

    public WeatherService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Object getWeatherByCoordinates(double lat, double lon) {
        String url = String.format("%s?lat=%s&lon=%s&units=metric&exclude=minutely,hourly&appid=%s",
                apiUrl, lat, lon, apiKey);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class) // Cambia a un modelo más específico si prefieres
                .block();
    }
}
