package fr.lsi.reign.application.character;

import fr.lsi.reign.domain.character.CharacterRepository;
import fr.lsi.reign.domain.character.exception.CharacterNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DeleteMyCharacterService {

    private final CharacterRepository characterRepository;

    public DeleteMyCharacterService(CharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    public void delete(Long charId, Long accountId) {
        if (!characterRepository.requestDeletion(charId, accountId)) {
            throw new CharacterNotFoundException(charId);
        }
    }
}
