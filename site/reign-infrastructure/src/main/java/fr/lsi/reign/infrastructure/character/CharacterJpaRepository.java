package fr.lsi.reign.infrastructure.character;

import fr.lsi.reign.domain.character.model.GameCharacter;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

interface CharacterJpaRepository extends JpaRepository<GameCharacter, Long> {

    /**
     * delete_date != 0 signifie que le personnage est en attente de suppression côté
     * char-server (période de grâce) : on ne le remonte pas comme personnage actif.
     */
    @Query(value = "SELECT * FROM `char` WHERE account_id = :accountId AND delete_date = 0 ORDER BY char_num ASC", nativeQuery = true)
    List<GameCharacter> findActiveByAccountId(@Param("accountId") Long accountId);

    @Query(value = "SELECT * FROM `char` WHERE char_id = :charId AND account_id = :accountId AND delete_date = 0", nativeQuery = true)
    Optional<GameCharacter> findActiveByIdAndAccountId(@Param("charId") Long charId, @Param("accountId") Long accountId);

    /**
     * Même effet que la demande de suppression du client de jeu : ne fait qu'horodater
     * delete_date, ne touche à aucune autre table.
     *
     * @Transactional est nécessaire ici : sans lui, ce repository hérite du
     * @Transactional(readOnly = true) par défaut de SimpleJpaRepository pour les méthodes
     * @Query personnalisées, ce qui fait échouer toute requête de modification.
     */
    @Transactional
    @Modifying
    @Query(value = "UPDATE `char` SET delete_date = :deleteDate WHERE char_id = :charId AND account_id = :accountId", nativeQuery = true)
    int requestDeletion(@Param("charId") Long charId, @Param("accountId") Long accountId, @Param("deleteDate") long deleteDate);

    @Transactional
    @Modifying
    @Query(
            value = "UPDATE `char` SET last_map = :map, last_x = :x, last_y = :y WHERE char_id = :charId AND account_id = :accountId",
            nativeQuery = true)
    int repatriateToCapital(
            @Param("charId") Long charId, @Param("accountId") Long accountId, @Param("map") String map, @Param("x") int x, @Param("y") int y);

    @Transactional
    @Modifying
    @Query(
            value = "UPDATE `char` SET save_map = :map, save_x = :x, save_y = :y WHERE char_id = :charId AND account_id = :accountId",
            nativeQuery = true)
    int repatriateSavePointToCapital(
            @Param("charId") Long charId, @Param("accountId") Long accountId, @Param("map") String map, @Param("x") int x, @Param("y") int y);
}
