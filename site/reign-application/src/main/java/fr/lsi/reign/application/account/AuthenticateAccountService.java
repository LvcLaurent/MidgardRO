package fr.lsi.reign.application.account;

import fr.lsi.reign.domain.account.AccountRepository;
import fr.lsi.reign.domain.account.exception.AccountBannedException;
import fr.lsi.reign.domain.account.exception.InvalidCredentialsException;
import fr.lsi.reign.domain.account.model.Account;
import org.springframework.stereotype.Service;

@Service
public class AuthenticateAccountService {

    private final AccountRepository accountRepository;

    public AuthenticateAccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account authenticate(AuthenticateAccountCommand command) {
        final Account account = accountRepository.findByUserId(command.userId())
                .filter(candidate -> candidate.matchesPassword(command.password()))
                .orElseThrow(InvalidCredentialsException::new);

        if (account.isBanned()) {
            throw new AccountBannedException();
        }

        account.recordSuccessfulLogin(command.ip());
        return accountRepository.save(account);
    }
}
