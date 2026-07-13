package fr.lsi.reign.exposition.character.dto;

import fr.lsi.reign.domain.character.model.GameCharacter;

public record CharacterResponse(Long charId, int charNum, String name, int jobId, int baseLevel, int jobLevel, boolean online) {

    public static CharacterResponse from(GameCharacter character) {
        return new CharacterResponse(character.getCharId(), character.getCharNum(), character.getName(), character.getJobId(),
                character.getBaseLevel(), character.getJobLevel(), character.isOnline());
    }
}
