package fr.lsi.reign.infrastructure.character;

import fr.lsi.reign.domain.account.model.Sex;
import fr.lsi.reign.domain.character.CharacterSpriteRenderer;
import fr.lsi.reign.domain.character.model.GameCharacter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Appelle zrenderer (https://github.com/zhad3/zrenderer) pour obtenir le sprite tel qu'il
 * apparaît en jeu (job, sexe, coiffure/couleurs, équipement). zrenderer gère lui-même la
 * composition des calques et la résolution des fichiers via ses propres fichiers Lua - on
 * n'a pas à connaître la convention de nommage des sprites du client.
 */
@Component
class ZrendererSpriteRenderer implements CharacterSpriteRenderer {

    private final RestClient restClient;

    private final String accessToken;

    ZrendererSpriteRenderer(@Value("${reign.zrenderer.base-url}") String baseUrl, @Value("${reign.zrenderer.access-token}") String accessToken) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.accessToken = accessToken;
    }

    @Override
    public byte[] render(GameCharacter character) {
        final Map<String, Object> body = new LinkedHashMap<>();
        body.put("job", List.of(String.valueOf(character.getJobId())));
        body.put("gender", character.getSex() == Sex.M ? 1 : 0);
        body.put("head", character.getHair());
        body.put("headPalette", character.getHairColor());
        body.put("bodyPalette", character.getClothesColor());
        body.put("weapon", character.getWeapon());
        body.put("shield", character.getShield());
        body.put("garment", character.getRobe());
        body.put("headgear", headgear(character));
        body.put("action", 0);
        body.put("frame", 0);

        return restClient.post()
                .uri("/render?downloadimage=true")
                .header("x-accesstoken", accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(byte[].class);
    }

    private List<Integer> headgear(GameCharacter character) {
        return Stream.of(character.getHeadTop(), character.getHeadMid(), character.getHeadBottom()).filter(id -> id > 0).toList();
    }
}
