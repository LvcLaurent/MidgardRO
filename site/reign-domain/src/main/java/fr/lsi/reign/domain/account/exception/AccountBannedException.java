package fr.lsi.reign.domain.account.exception;

public class AccountBannedException extends RuntimeException {

    public AccountBannedException() {
        super("Ce compte est banni ou bloqué");
    }
}
