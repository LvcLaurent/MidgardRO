package fr.lsi.reign.infrastructure.character;

import fr.lsi.reign.domain.character.CharacterRepository;
import fr.lsi.reign.domain.character.model.GameCharacter;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
class CharacterRepositoryAdapter implements CharacterRepository {

    /**
     * Doit rester synchronisé avec char_del_delay dans server/conf/char_athena.conf : le
     * char-server ne considère le délai de grâce écoulé (et n'autorise la suppression
     * définitive) qu'une fois delete_date atteint, exactement comme le fait le client de jeu.
     */
    private static final Duration DELETION_GRACE_PERIOD = Duration.ofHours(72);

    private static final String CAPITAL_MAP = "prontera";

    private static final int CAPITAL_X = 156;

    private static final int CAPITAL_Y = 181;

    private final CharacterJpaRepository jpaRepository;

    CharacterRepositoryAdapter(CharacterJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<GameCharacter> findActiveByAccountId(Long accountId) {
        return jpaRepository.findActiveByAccountId(accountId);
    }

    @Override
    public Optional<GameCharacter> findActiveByIdAndAccountId(Long charId, Long accountId) {
        return jpaRepository.findActiveByIdAndAccountId(charId, accountId);
    }

    @Override
    public boolean requestDeletion(Long charId, Long accountId) {
        final long deleteDate = Instant.now().plus(DELETION_GRACE_PERIOD).getEpochSecond();
        return jpaRepository.requestDeletion(charId, accountId, deleteDate) > 0;
    }

    @Override
    public boolean repatriateToCapital(Long charId, Long accountId) {
        return jpaRepository.repatriateToCapital(charId, accountId, CAPITAL_MAP, CAPITAL_X, CAPITAL_Y) > 0;
    }

    @Override
    public boolean repatriateSavePointToCapital(Long charId, Long accountId) {
        return jpaRepository.repatriateSavePointToCapital(charId, accountId, CAPITAL_MAP, CAPITAL_X, CAPITAL_Y) > 0;
    }
}
