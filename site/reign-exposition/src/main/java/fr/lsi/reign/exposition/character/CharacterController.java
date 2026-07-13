package fr.lsi.reign.exposition.character;

import fr.lsi.reign.application.character.DeleteMyCharacterService;
import fr.lsi.reign.application.character.ListMyCharactersService;
import fr.lsi.reign.domain.account.model.Account;
import fr.lsi.reign.exposition.character.dto.CharacterResponse;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts/me/characters")
public class CharacterController {

    private final ListMyCharactersService listMyCharactersService;

    private final DeleteMyCharacterService deleteMyCharacterService;

    public CharacterController(ListMyCharactersService listMyCharactersService, DeleteMyCharacterService deleteMyCharacterService) {
        this.listMyCharactersService = listMyCharactersService;
        this.deleteMyCharacterService = deleteMyCharacterService;
    }

    @GetMapping
    public List<CharacterResponse> list(Authentication authentication) {
        final Account account = (Account) authentication.getPrincipal();
        return listMyCharactersService.list(account.getAccountId()).stream().map(CharacterResponse::from).toList();
    }

    @DeleteMapping("/{charId}")
    public ResponseEntity<Void> delete(@PathVariable Long charId, Authentication authentication) {
        final Account account = (Account) authentication.getPrincipal();
        deleteMyCharacterService.delete(charId, account.getAccountId());
        return ResponseEntity.noContent().build();
    }
}
