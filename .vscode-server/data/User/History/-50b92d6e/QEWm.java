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

    public GeoDbService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://wft-geo-db.p.rapidapi.com/v1/geo")
                .defaultHeader("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com")
                .build();
    }

    @PostConstruct
    public void init() {
        if (geoDbApiKey == null || geoDbApiKey.isEmpty()) {
            System.out.println("\u001B[31m[GeoDB] ⚠️ GeoDB API Key no configurada. Verifica el archivo application.properties.\u001B[0m");
        } else {
            System.out.println("\u001B[32m[GeoDB] ✅ GeoDB API Key cargada correctamente.\u001B[0m");
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> searchCities(String query) {
        Map<String, Object> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/cities")
                        .queryParam("namePrefix", query)
                        .queryParam("limit", 10) // Máximo 10 resultados
                        .queryParam("sort", "-population") // Ordenar por población descendente
                        .queryParam("types", "CITY") // Solo ciudades
                        .build())
                .header("X-RapidAPI-Key", geoDbApiKey)
                .retrieve()
                .bodyToMono(Map.class) // Convertir respuesta a un Map
                .block();

        // Extrae y devuelve la lista de "data" como una lista de Map<String, Object>
        return (List<Map<String, Object>>) response.get("data");
    }
}
