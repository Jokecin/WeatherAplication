package com.example.weather;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class WeatherApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeatherApiApplication.class, args);
         // Cargar variables desde el archivo .env
        Dotenv dotenv = Dotenv.configure()
                .directory("../") // Apunta a la raíz del proyecto
                .ignoreIfMissing()
                .load();
        
        // Configurar propiedades del sistema con las variables cargadas
        System.setProperty("SERVER_PORT", dotenv.get("SERVER_PORT"));
        System.setProperty("OPENWEATHER_API_KEY", dotenv.get("OPENWEATHER_API_KEY"));
        System.setProperty("geo.db.api.key", dotenv.get("GEO_DB_API_KEY"));
        System.setProperty("geo.db.api.host", dotenv.get("GEO_DB_API_HOST"));

        SpringApplication.run(WeatherApiApplication.class, args);
    }

     @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Permitir todas las rutas
                        .allowedOrigins("http://localhost:3000") // Permitir solicitudes desde el frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
                        .allowedHeaders("*"); // Permitir todos los encabezados
            }
        };
    }
}