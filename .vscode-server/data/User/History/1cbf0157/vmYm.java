import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String openWeatherApiKey; // Asegúrate de que el nombre coincida EXACTAMENTE con el campo

    private final String openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";

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