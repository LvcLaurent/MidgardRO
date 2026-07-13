package fr.lsi.reign.infrastructure.account;

import static org.assertj.core.api.Assertions.assertThat;

import fr.lsi.reign.domain.account.model.Account;
import fr.lsi.reign.domain.account.model.Sex;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;

/**
 * Vérifie que account.orm.xml mappe correctement {@link Account} sur la vraie
 * structure de la table `login` de rAthena (schema.sql reproduit son DDL).
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class AccountJpaRepositoryTest {

    @Autowired
    private AccountJpaRepository repository;

    @Test
    void savesAndReloadsAnAccountMappedOnTheLoginTable() {
        final Account account = Account.register("testuser", "secret", "test@reign.fr", Sex.M);

        final Account saved = repository.saveAndFlush(account);

        assertThat(saved.getAccountId()).isNotNull();

        final Account reloaded = repository.findByUserId("testuser").orElseThrow();
        assertThat(reloaded.getUserId()).isEqualTo("testuser");
        assertThat(reloaded.matchesPassword("secret")).isTrue();
        assertThat(reloaded.getSex()).isEqualTo(Sex.M);
        assertThat(reloaded.getEmail()).isEqualTo("test@reign.fr");
        assertThat(reloaded.getGroupId()).isEqualTo(Account.PLAYER_GROUP_ID);
        assertThat(reloaded.getState()).isEqualTo(Account.NOT_BANNED_STATE);
        assertThat(reloaded.getCharacterSlots()).isEqualTo(Account.DEFAULT_CHARACTER_SLOTS);
        assertThat(reloaded.getLoginCount()).isZero();
    }

    @Test
    void existsByUserIdReflectsWhatWasPersisted() {
        assertThat(repository.existsByUserId("unknown")).isFalse();

        repository.saveAndFlush(Account.register("known", "secret", "known@reign.fr", Sex.F));

        assertThat(repository.existsByUserId("known")).isTrue();
    }

    @Test
    void findByUserIdIsEmptyWhenTheAccountDoesNotExist() {
        assertThat(repository.findByUserId("ghost")).isEmpty();
    }
}
