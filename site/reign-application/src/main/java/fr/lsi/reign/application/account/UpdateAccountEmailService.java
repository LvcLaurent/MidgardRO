package fr.lsi.reign.application.account;

import fr.lsi.reign.domain.account.AccountRepository;
import fr.lsi.reign.domain.account.exception.DuplicateEmailException;
import fr.lsi.reign.domain.account.model.Account;
import org.springframework.stereotype.Service;

@Service
public class UpdateAccountEmailService {

    private final AccountRepository accountRepository;

    public UpdateAccountEmailService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account updateEmail(Account account, String newEmail) {
        if (!newEmail.equals(account.getEmail()) && accountRepository.existsByEmail(newEmail)) {
            throw new DuplicateEmailException(newEmail);
        }
        account.changeEmail(newEmail);
        return accountRepository.save(account);
    }
}
