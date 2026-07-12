package fr.lsi.reign.domain.account.model;

/**
 * Sexe du compte, tel qu'attendu par la table `login` de rAthena
 * (colonne enum('M','F','S'), 'S' étant réservé aux comptes serveur).
 */
public enum Sex {
    M,
    F,
    S
}
