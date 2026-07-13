package fr.lsi.reign.infrastructure;

import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Point d'entrée minimal permettant à {@code @DataJpaTest} de retrouver une
 * {@code @SpringBootConfiguration} pour ce module (reign-infrastructure n'a pas
 * de classe applicative propre, celle-ci vit dans reign-exposition).
 */
@SpringBootApplication
class InfrastructureTestApplication {
}
