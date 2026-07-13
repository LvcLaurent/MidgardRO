package fr.lsi.reign.infrastructure;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Active les repositories Spring Data JPA de ce module. Vit ici plutôt que dans
 * ReignApplication (reign-exposition) : c'est reign-infrastructure qui connaît la
 * technologie de persistance, exposition n'a pas à en dépendre à la compilation
 * (elle ne la voit qu'au runtime, voir le scope de sa dépendance vers ce module).
 */
@Configuration
@EnableJpaRepositories(basePackages = "fr.lsi.reign.infrastructure")
class JpaConfig {
}
