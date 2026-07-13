package fr.lsi.reign.application.character;

import fr.lsi.reign.domain.character.CharacterRepository;
import fr.lsi.reign.domain.character.exception.CharacterNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class RepatriateMyCharacterService {

    private final CharacterRepository characterRepository;

    public RepatriateMyCharacterService(CharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    public void repatriate(Long charId, Long accountId) {
        if (!characterRepository.repatriateToCapital(charId, accountId)) {
            throw new CharacterNotFoundException(charId);
        }
    }
}
