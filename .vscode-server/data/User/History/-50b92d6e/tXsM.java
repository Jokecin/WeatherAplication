import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.annotation.PostConstruct;

@Service
public class GeoDbService {

    @Value("${GEO_DB_API_KEY}")
    private String geoDbApiKey;

    private final WebClient webClient;

    private static final String RED_TEXT = "\u001B[31m"; // ANSI escape code for red
    private static final String RESET_TEXT = "\u001B[0m"; // Reset color to default

    public GeoDbService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://wft-geo-db.p.rapidapi.com/v1/geo")
                .defaultHeader("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com")
                .build();
    }

    @PostConstruct
    public void init() {
        System.out.println(RED_TEXT + "[GeoDB] GeoDB API Key: " + geoDbApiKey + RESET_TEXT);
    }

    public String searchCities(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/cities")
                        .queryParam("namePrefix", query)
                        .build())
                .header("X-RapidAPI-Key", geoDbApiKey)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
