package fr.lsi.reign.domain.character;

import fr.lsi.reign.domain.character.model.GameCharacter;
import java.util.List;
import java.util.Optional;

/**
 * Port du domaine : lecture des personnages. Implémentation dans
 * reign-infrastructure.
 */
public interface CharacterRepository {

    List<GameCharacter> findActiveByAccountId(Long accountId);

    Optional<GameCharacter> findActiveByIdAndAccountId(Long charId, Long accountId);

    /**
     * Supprime immédiatement et définitivement le personnage et toutes ses données associées
     * (inventaire, chariot, sorts, amis, mails, quêtes, familier/homoncule/mercenaire/élémentaire,
     * appartenance de guilde, ...), à la manière de la suppression effective du char-server, mais
     * sans délai de grâce ni confirmation depuis le client de jeu.
     *
     * @return false si aucun personnage actif portant cet id n'appartient à ce compte
     */
    boolean deleteCompletely(Long charId, Long accountId);

    /**
     * Déplace le personnage à la capitale (position à la prochaine connexion).
     *
     * @return false si aucun personnage actif portant cet id n'appartient à ce compte
     */
    boolean repatriateToCapital(Long charId, Long accountId);

    /**
     * Déplace le point de sauvegarde du personnage à la capitale.
     *
     * @return false si aucun personnage actif portant cet id n'appartient à ce compte
     */
    boolean repatriateSavePointToCapital(Long charId, Long accountId);
}
