package fr.lsi.reign.exposition.account;

import fr.lsi.reign.application.account.AuthenticateAccountCommand;
import fr.lsi.reign.application.account.AuthenticateAccountService;
import fr.lsi.reign.application.account.RegisterAccountCommand;
import fr.lsi.reign.application.account.RegisterAccountService;
import fr.lsi.reign.domain.account.model.Account;
import fr.lsi.reign.exposition.account.dto.AccountResponse;
import fr.lsi.reign.exposition.account.dto.LoginRequest;
import fr.lsi.reign.exposition.account.dto.RegisterAccountRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final RegisterAccountService registerAccountService;

    private final AuthenticateAccountService authenticateAccountService;

    private final SecurityContextRepository securityContextRepository;

    public AccountController(RegisterAccountService registerAccountService, AuthenticateAccountService authenticateAccountService,
            SecurityContextRepository securityContextRepository) {
        this.registerAccountService = registerAccountService;
        this.authenticateAccountService = authenticateAccountService;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AccountResponse> register(@Valid @RequestBody RegisterAccountRequest request) {
        final var account = registerAccountService.register(
                new RegisterAccountCommand(request.userId(), request.password(), request.email(), request.sex()));
        return ResponseEntity.status(HttpStatus.CREATED).body(AccountResponse.from(account));
    }

    @PostMapping("/login")
    public ResponseEntity<AccountResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        final Account account = authenticateAccountService.authenticate(
                new AuthenticateAccountCommand(request.userId(), request.password(), httpRequest.getRemoteAddr()));

        openSession(account, httpRequest, httpResponse);

        return ResponseEntity.ok(AccountResponse.from(account));
    }

    @GetMapping("/me")
    public ResponseEntity<AccountResponse> me(Authentication authentication) {
        return ResponseEntity.ok(AccountResponse.from((Account) authentication.getPrincipal()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        securityContextRepository.saveContext(SecurityContextHolder.createEmptyContext(), request, response);
        final var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Authentification "manuelle" (le mot de passe est vérifié côté domaine, pas via un
     * UserDetailsService) : il faut donc peupler et sauvegarder le SecurityContext nous-mêmes
     * pour que la session soit reconnue sur les requêtes suivantes.
     */
    private void openSession(Account account, HttpServletRequest request, HttpServletResponse response) {
        final Authentication authentication = new UsernamePasswordAuthenticationToken(
                account, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
        final SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }
}
