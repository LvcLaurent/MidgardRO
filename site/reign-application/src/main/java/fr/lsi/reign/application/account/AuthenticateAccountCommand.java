package fr.lsi.reign.application.account;

public record AuthenticateAccountCommand(String userId, String password, String ip) {
}
