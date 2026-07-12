package fr.lsi.reign.application.account;

import fr.lsi.reign.domain.account.AccountRepository;
import fr.lsi.reign.domain.account.exception.DuplicateUserIdException;
import fr.lsi.reign.domain.account.model.Account;
import org.springframework.stereotype.Service;

@Service
public class RegisterAccountService {

    private final AccountRepository accountRepository;

    public RegisterAccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account register(RegisterAccountCommand command) {
        if (accountRepository.existsByUserId(command.userId())) {
            throw new DuplicateUserIdException(command.userId());
        }
        final Account account = Account.register(command.userId(), command.password(), command.email(), command.sex());
        return accountRepository.save(account);
    }
}
