package fr.lsi.reign.infrastructure.account;

import fr.lsi.reign.domain.account.AccountRepository;
import fr.lsi.reign.domain.account.model.Account;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
class AccountRepositoryAdapter implements AccountRepository {

    private final AccountJpaRepository jpaRepository;

    AccountRepositoryAdapter(AccountJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Account> findByUserId(String userId) {
        return jpaRepository.findByUserId(userId);
    }

    @Override
    public boolean existsByUserId(String userId) {
        return jpaRepository.existsByUserId(userId);
    }

    @Override
    public Account save(Account account) {
        return jpaRepository.save(account);
    }
}
