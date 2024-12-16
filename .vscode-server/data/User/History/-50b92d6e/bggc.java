import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeoDbService {

    @Value("${geodb.api.key}")
    private String geoDbApiKey;

    private final WebClient webClient;

    // Constructor que inicializa WebClient con la URL base
    public GeoDbService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://wft-geo-db.p.rapidapi.com/v1/geo") // URL base correcta
                .defaultHeader("X-RapidAPI-Key", geoDbApiKey)
                .defaultHeader("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com")
                .build();
    }

    public String searchCities(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/cities")
                        .queryParam("namePrefix", query)
                        .queryParam("countryIds", "US,CA") // Ejemplo adicional (opcional)
                        .queryParam("minPopulation", "100000") // Ejemplo adicional
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
