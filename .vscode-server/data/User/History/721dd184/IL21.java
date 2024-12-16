package com.example.weather;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.weather.service.GeoDbService;

@SpringBootApplication
public class WeatherApiApplication {

    private final GeoDbService geoDbService;

    // Constructor para inyectar GeoDbService
    @Autowired
    public WeatherApiApplication(GeoDbService geoDbService) {
        this.geoDbService = geoDbService;
    }

    public static void main(String[] args) {
        // Cargar variables desde el archivo .env
        Dotenv dotenv = Dotenv.configure()
                .filename(".env") // Nombre del archivo
                .directory("/home/joke") // Reemplaza con la ruta ABSOLUTA donde está tu archivo .env
                .ignoreIfMissing()
                .load();
                
        // Validar y configurar las variables de entorno
        setPropertyIfPresent("SERVER_PORT", dotenv.get("BACKEND_PORT"));
        setPropertyIfPresent("OPENWEATHER_API_KEY", dotenv.get("OPENWEATHER_API_KEY"));
        setPropertyIfPresent("GEO_DB_API_KEY", dotenv.get("GEO_DB_API_KEY"));

        // Iniciar la aplicación Spring Boot
        SpringApplication.run(WeatherApiApplication.class, args);
    }

    private static void setPropertyIfPresent(String key, String value) {
        if (value != null) {
            System.setProperty(key, value);
        } else {
            throw new IllegalStateException("Falta la variable de entorno: " + key);
        }
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
