import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GeoDbController {

    @Autowired
    private GeoDbService geoDbService;

    @GetMapping("/api/cities")
    public String getCities(@RequestParam String query) {
        return geoDbService.searchCities(query);
    }
}
