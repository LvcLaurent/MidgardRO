package fr.lsi.reign.application.account;

import fr.lsi.reign.domain.account.model.Sex;

public record RegisterAccountCommand(String userId, String password, String email, Sex sex) {
}
