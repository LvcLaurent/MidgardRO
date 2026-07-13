package fr.lsi.reign.exposition.account;

import fr.lsi.reign.domain.account.exception.AccountBannedException;
import fr.lsi.reign.domain.account.exception.DuplicateEmailException;
import fr.lsi.reign.domain.account.exception.DuplicateUserIdException;
import fr.lsi.reign.domain.account.exception.InvalidCredentialsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AccountExceptionHandler {

    @ExceptionHandler(DuplicateUserIdException.class)
    public ResponseEntity<String> handleDuplicateUserId(DuplicateUserIdException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<String> handleDuplicateEmail(DuplicateEmailException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(AccountBannedException.class)
    public ResponseEntity<String> handleAccountBanned(AccountBannedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }
}
