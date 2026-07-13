package fr.lsi.reign.domain.character;

import fr.lsi.reign.domain.character.model.GameCharacter;

/**
 * Port du domaine : rendu visuel d'un personnage (sprite tel qu'il apparaît en jeu :
 * job, sexe, coiffure/couleurs, équipement). Implémentation dans reign-infrastructure,
 * qui délègue à un service de rendu externe (zrenderer).
 */
public interface CharacterSpriteRenderer {

    byte[] render(GameCharacter character);
}
