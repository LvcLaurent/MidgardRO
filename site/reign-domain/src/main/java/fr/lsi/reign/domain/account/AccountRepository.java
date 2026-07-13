package fr.lsi.reign.domain.account;

import fr.lsi.reign.domain.account.model.Account;
import java.util.List;
import java.util.Optional;

/**
 * Port du domaine : persistance des comptes. Implémentation dans
 * reign-infrastructure.
 */
public interface AccountRepository {

    Optional<Account> findByUserId(String userId);

    boolean existsByUserId(String userId);

    Account save(Account account);

    List<Account> findAll();
}
