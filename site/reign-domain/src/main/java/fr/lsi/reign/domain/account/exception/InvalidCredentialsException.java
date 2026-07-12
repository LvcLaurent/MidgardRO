package fr.lsi.reign.domain.account.exception;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Identifiant ou mot de passe invalide");
    }
}
