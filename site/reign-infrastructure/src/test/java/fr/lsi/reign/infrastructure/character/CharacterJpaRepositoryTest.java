package fr.lsi.reign.infrastructure.character;

import static org.assertj.core.api.Assertions.assertThat;

import fr.lsi.reign.domain.character.model.GameCharacter;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;

/**
 * Vérifie que character.orm.xml mappe correctement {@link GameCharacter} sur la table
 * `char` (nom réservé, quoté) et que le filtre "personnages actifs" (delete_date = 0)
 * exclut bien les personnages en attente de suppression et ceux d'un autre compte.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class CharacterJpaRepositoryTest {

    @Autowired
    private CharacterJpaRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findsOnlyActiveCharactersOfTheGivenAccountOrderedBySlot() {
        insertCharacter(1L, 42L, 1, "Second", 0);
        insertCharacter(2L, 42L, 0, "First", 0);
        insertCharacter(3L, 42L, 2, "PendingDeletion", 1700000000);
        insertCharacter(4L, 99L, 0, "OtherAccount", 0);

        final List<GameCharacter> characters = repository.findActiveByAccountId(42L);

        assertThat(characters).extracting(GameCharacter::getCharId).containsExactly(2L, 1L);
        assertThat(characters).extracting(GameCharacter::getName).containsExactly("First", "Second");
    }

    @Test
    void deleteCharRemovesTheCharacterRow() {
        insertCharacter(5L, 42L, 0, "ToDelete", 0);

        final int deleted = repository.deleteChar(5L, 42L);

        assertThat(deleted).isEqualTo(1);
        assertThat(repository.findActiveByAccountId(42L)).isEmpty();
    }

    @Test
    void deleteCharDoesNothingWhenTheCharacterBelongsToAnotherAccount() {
        insertCharacter(6L, 42L, 0, "NotYours", 0);

        final int updated = repository.deleteChar(6L, 99L);

        assertThat(updated).isZero();
        assertThat(repository.findActiveByAccountId(42L)).extracting(GameCharacter::getCharId).containsExactly(6L);
    }

    private void insertCharacter(long charId, long accountId, int charNum, String name, int deleteDate) {
        entityManager.createNativeQuery(
                "INSERT INTO `char` (char_id, account_id, char_num, name, sex, delete_date) "
                        + "VALUES (:charId, :accountId, :charNum, :name, 'M', :deleteDate)")
                .setParameter("charId", charId)
                .setParameter("accountId", accountId)
                .setParameter("charNum", charNum)
                .setParameter("name", name)
                .setParameter("deleteDate", deleteDate)
                .executeUpdate();
    }
}
