package fr.lsi.reign.infrastructure.server;

import fr.lsi.reign.domain.character.model.GameCharacter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface OnlineCharacterJpaRepository extends JpaRepository<GameCharacter, Long> {

    @Query(value = "SELECT COUNT(*) FROM `char` WHERE online = 1", nativeQuery = true)
    long countOnline();
}
