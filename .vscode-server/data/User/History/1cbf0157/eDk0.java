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

    public String getApiKey() {
    return apiKey;
    }

    public Object getWeatherByCity(String city) {
        // Construye la URL completa
        String url = String.format("%s?q=%s&units=metric&appid=%s", apiUrl, city, apiKey);

        // Realiza la consulta y devuelve el resultado
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class) // Cambia `Object` a un modelo específico si prefieres
                .block();
    }
}
