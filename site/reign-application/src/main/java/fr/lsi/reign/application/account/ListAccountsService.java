package fr.lsi.reign.application.account;

import fr.lsi.reign.domain.account.AccountRepository;
import fr.lsi.reign.domain.account.model.Account;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ListAccountsService {

    private final AccountRepository accountRepository;

    public ListAccountsService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<Account> listAll() {
        return accountRepository.findAll();
    }
}
