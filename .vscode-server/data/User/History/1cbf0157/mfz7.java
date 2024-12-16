package com.example.weather.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WeatherService {

    private final WebClient webClient;

    @Value("${openweather.api.key}")
    private String apiKey;

    private final String openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";

    // public WeatherService(WebClient.Builder webClientBuilder) {
    //     this.webClient = webClientBuilder.build();
    // }

    // public String getApiKey() {
    // return apiKey;
    // }

    public String getWeatherByCity(String city) {
        WebClient webClient = WebClient.create();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(openWeatherApiUrl)
                        .queryParam("q", city)
                        .queryParam("appid", openWeatherApiKey)
                        .queryParam("units", "metric")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
