package fr.lsi.reign.domain.account.exception;

public class DuplicateUserIdException extends RuntimeException {

    public DuplicateUserIdException(String userId) {
        super("Le compte '" + userId + "' existe déjà");
    }
}
