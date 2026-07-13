package fr.lsi.reign.application.character;

import fr.lsi.reign.domain.character.CharacterRepository;
import fr.lsi.reign.domain.character.model.GameCharacter;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ListMyCharactersService {

    private final CharacterRepository characterRepository;

    public ListMyCharactersService(CharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    public List<GameCharacter> list(Long accountId) {
        return characterRepository.findActiveByAccountId(accountId);
    }
}
