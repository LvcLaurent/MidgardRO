package fr.lsi.reign.exposition.account.dto;

import fr.lsi.reign.domain.account.model.Account;

public record AccountResponse(Long accountId, String userId, String email, int characterSlots) {

    public static AccountResponse from(Account account) {
        return new AccountResponse(account.getAccountId(), account.getUserId(), account.getEmail(), account.getCharacterSlots());
    }
}
