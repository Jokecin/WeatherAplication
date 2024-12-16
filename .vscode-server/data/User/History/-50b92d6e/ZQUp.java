import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.PostConstruct;

@Service
public class GeoDbService {

    @Value("${geodb.api.key}")
    private String geoDbApiKey;

    private final WebClient webClient;

    // Constructor que inicializa WebClient
    public GeoDbService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://wft-geo-db.p.rapidapi.com/v1/geo")
                .build();
    }

    @PostConstruct
    public void printApiKey() {
        System.out.println("GeoDB API Key: " + geoDbApiKey); // Verifica la API Key en la consola
    }

    public String searchCities(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/cities")
                        .queryParam("namePrefix", query)
                        .build())
                .header("X-RapidAPI-Key", geoDbApiKey)
                .header("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
