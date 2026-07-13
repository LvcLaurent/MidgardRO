package fr.lsi.reign.application.character;

import fr.lsi.reign.domain.character.CharacterRepository;
import fr.lsi.reign.domain.character.CharacterSpriteRenderer;
import fr.lsi.reign.domain.character.exception.CharacterNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class RenderMyCharacterSpriteService {

    private final CharacterRepository characterRepository;

    private final CharacterSpriteRenderer characterSpriteRenderer;

    public RenderMyCharacterSpriteService(CharacterRepository characterRepository, CharacterSpriteRenderer characterSpriteRenderer) {
        this.characterRepository = characterRepository;
        this.characterSpriteRenderer = characterSpriteRenderer;
    }

    public byte[] render(Long charId, Long accountId) {
        final var character = characterRepository.findActiveByIdAndAccountId(charId, accountId).orElseThrow(() -> new CharacterNotFoundException(charId));
        return characterSpriteRenderer.render(character);
    }
}
