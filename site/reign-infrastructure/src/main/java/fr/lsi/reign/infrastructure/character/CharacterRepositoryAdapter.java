package fr.lsi.reign.infrastructure.character;

import fr.lsi.reign.domain.character.CharacterRepository;
import fr.lsi.reign.domain.character.model.GameCharacter;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
class CharacterRepositoryAdapter implements CharacterRepository {

    private final CharacterJpaRepository jpaRepository;

    CharacterRepositoryAdapter(CharacterJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<GameCharacter> findActiveByAccountId(Long accountId) {
        return jpaRepository.findActiveByAccountId(accountId);
    }

    @Override
    public boolean requestDeletion(Long charId, Long accountId) {
        return jpaRepository.requestDeletion(charId, accountId, Instant.now().getEpochSecond()) > 0;
    }
}
