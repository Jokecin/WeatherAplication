import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeoDbService {

    @Value("${GEO_DB_API_KEY}")
    private String geoDbApiKey;

    private final WebClient webClient;

    // Constructor que inicializa WebClient con la URL base
    public GeoDbService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://wft-geo-db.p.rapidapi.com/v1/geo")
                .defaultHeader("X-RapidAPI-Key", geoDbApiKey) // Asigna la API Key
                .defaultHeader("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com")
                .build();
    }

    public String searchCities(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/cities")
                        .queryParam("namePrefix", query)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
