package fr.lsi.reign.infrastructure.character;

import fr.lsi.reign.domain.character.CharacterRepository;
import fr.lsi.reign.domain.character.model.GameCharacter;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
class CharacterRepositoryAdapter implements CharacterRepository {

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
    @Transactional
    public boolean deleteCompletely(Long charId, Long accountId) {
        final Optional<GameCharacter> character = jpaRepository.findActiveByIdAndAccountId(charId, accountId);
        if (character.isEmpty()) {
            return false;
        }

        jpaRepository.deletePet(charId);
        jpaRepository.deleteFriends(charId);
        jpaRepository.deleteHotkeys(charId);
        jpaRepository.deleteInventory(charId);
        jpaRepository.deleteCartInventory(charId);
        jpaRepository.deleteMemos(charId);
        jpaRepository.deleteCharRegNum(charId);
        jpaRepository.deleteCharRegStr(charId);
        jpaRepository.deleteSkills(charId);
        jpaRepository.deleteReceivedMails(charId);
        jpaRepository.detachSentMails(charId);
        jpaRepository.deleteBonusScripts(charId);
        jpaRepository.deleteQuests(charId);
        jpaRepository.deleteAchievements(charId);
        jpaRepository.leaveGuild(charId);
        jpaRepository.deleteHomunculus(charId);
        jpaRepository.deleteMercenaryOwner(charId);
        jpaRepository.deleteMercenary(charId);
        jpaRepository.deleteElemental(charId);
        jpaRepository.logDeletion(accountId, "Deleted via site (CID " + charId + ")", character.get().getName());

        return jpaRepository.deleteChar(charId, accountId) > 0;
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
