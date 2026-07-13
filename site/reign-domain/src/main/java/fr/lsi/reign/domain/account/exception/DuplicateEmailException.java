package fr.lsi.reign.domain.account.exception;

public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super("L'email '" + email + "' est déjà utilisé par un autre compte");
    }
}
