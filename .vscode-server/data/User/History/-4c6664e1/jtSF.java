package com.example.weather.model;

import lombok.Data;

@Data
public class WeatherResponse {
    private String name; // Nombre de la ciudad
    private Main main;   // Información principal

    @Data
    public static class Main {
        private Double temp;       // Temperatura actual
        private Double feels_like; // Sensación térmica
        private Double temp_min;   // Temperatura mínima
        private Double temp_max;   // Temperatura máxima
    }
}
