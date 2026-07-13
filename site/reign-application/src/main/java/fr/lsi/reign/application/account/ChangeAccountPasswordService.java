package fr.lsi.reign.application.account;

import fr.lsi.reign.domain.account.AccountRepository;
import fr.lsi.reign.domain.account.exception.InvalidCredentialsException;
import fr.lsi.reign.domain.account.model.Account;
import org.springframework.stereotype.Service;

@Service
public class ChangeAccountPasswordService {

    private final AccountRepository accountRepository;

    public ChangeAccountPasswordService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public void changePassword(Account account, String currentPassword, String newPassword) {
        if (!account.matchesPassword(currentPassword)) {
            throw new InvalidCredentialsException();
        }
        account.changePassword(newPassword);
        accountRepository.save(account);
    }
}
