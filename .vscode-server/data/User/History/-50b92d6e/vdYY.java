import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeoDbService {

    @Value("${geodb.api.key}")
    private String geoDbApiKey;

    private final String geoDbApiUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";

    public String searchCities(String query) {
        WebClient webClient = WebClient.create();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(geoDbApiUrl)
                        .queryParam("namePrefix", query)
                        .build())
                .header("X-RapidAPI-Key", geoDbApiKey)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
