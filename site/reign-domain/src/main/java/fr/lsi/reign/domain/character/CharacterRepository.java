package fr.lsi.reign.domain.character;

import fr.lsi.reign.domain.character.model.GameCharacter;
import java.util.List;

/**
 * Port du domaine : lecture des personnages. Implémentation dans
 * reign-infrastructure.
 */
public interface CharacterRepository {

    List<GameCharacter> findActiveByAccountId(Long accountId);

    /**
     * Marque le personnage comme en attente de suppression (delete_date), à la manière du client
     * de jeu (bouton "supprimer" à la sélection de personnage) : la suppression effective et le
     * nettoyage des données associées (inventaire, guilde, amis, ...) restent gérés par le
     * char-server, jamais directement par le site.
     *
     * @return false si aucun personnage actif portant cet id n'appartient à ce compte
     */
    boolean requestDeletion(Long charId, Long accountId);
}
