package fr.lsi.reign.domain.character.exception;

public class CharacterNotFoundException extends RuntimeException {

    public CharacterNotFoundException(Long charId) {
        super("Aucun personnage '" + charId + "' pour ce compte");
    }
}
