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

    // Suppression en cascade des données associées, reprise de char_delete() dans
    // server/src/char/char.cpp - ne couvre volontairement pas les cas guilde-maître (rupture de
    // guilde complète) ni le décalage des emplacements de groupe, trop rares/complexes pour un
    // petit serveur perso ; le personnage quitte simplement sa guilde le cas échéant.
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `pet` WHERE char_id = :charId", nativeQuery = true)
    void deletePet(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `friends` WHERE char_id = :charId OR friend_id = :charId", nativeQuery = true)
    void deleteFriends(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `hotkey` WHERE char_id = :charId", nativeQuery = true)
    void deleteHotkeys(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `inventory` WHERE char_id = :charId", nativeQuery = true)
    void deleteInventory(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `cart_inventory` WHERE char_id = :charId", nativeQuery = true)
    void deleteCartInventory(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `memo` WHERE char_id = :charId", nativeQuery = true)
    void deleteMemos(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `char_reg_num` WHERE char_id = :charId", nativeQuery = true)
    void deleteCharRegNum(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `char_reg_str` WHERE char_id = :charId", nativeQuery = true)
    void deleteCharRegStr(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `skill` WHERE char_id = :charId", nativeQuery = true)
    void deleteSkills(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `mail` WHERE dest_id = :charId", nativeQuery = true)
    void deleteReceivedMails(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE `mail` SET send_id = 0 WHERE send_id = :charId", nativeQuery = true)
    void detachSentMails(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `bonus_script` WHERE char_id = :charId", nativeQuery = true)
    void deleteBonusScripts(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `quest` WHERE char_id = :charId", nativeQuery = true)
    void deleteQuests(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `achievement` WHERE char_id = :charId", nativeQuery = true)
    void deleteAchievements(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `guild_member` WHERE char_id = :charId", nativeQuery = true)
    void leaveGuild(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `homunculus` WHERE char_id = :charId", nativeQuery = true)
    void deleteHomunculus(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `mercenary_owner` WHERE char_id = :charId", nativeQuery = true)
    void deleteMercenaryOwner(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `mercenary` WHERE char_id = :charId", nativeQuery = true)
    void deleteMercenary(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `elemental` WHERE char_id = :charId", nativeQuery = true)
    void deleteElemental(@Param("charId") Long charId);

    @Transactional
    @Modifying
    @Query(
            value = "INSERT INTO `charlog`(`time`, `account_id`, `char_num`, `char_msg`, `name`) VALUES (NOW(), :accountId, 0, :message, :name)",
            nativeQuery = true)
    void logDeletion(@Param("accountId") Long accountId, @Param("message") String message, @Param("name") String name);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM `char` WHERE char_id = :charId AND account_id = :accountId", nativeQuery = true)
    int deleteChar(@Param("charId") Long charId, @Param("accountId") Long accountId);

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
