package fr.lsi.reign.domain.character.model;

/**
 * Personnage joueur, mappé en lecture seule sur la table `char` du serveur
 * rAthena (le site ne crée/modifie jamais de personnage, seul le
 * char-server le fait).
 *
 * Entité de domaine pure : aucune annotation de persistance ici, le mapping
 * vers la table `char` est décrit en dehors (voir character.orm.xml dans
 * reign-infrastructure).
 */
public class GameCharacter {

    private Long charId;

    private Long accountId;

    private int charNum;

    private String name;

    private int jobId;

    private int baseLevel;

    private int jobLevel;

    private boolean online;

    protected GameCharacter() {
        // constructeur requis par Hibernate
    }

    public Long getCharId() {
        return charId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public int getCharNum() {
        return charNum;
    }

    public String getName() {
        return name;
    }

    public int getJobId() {
        return jobId;
    }

    public int getBaseLevel() {
        return baseLevel;
    }

    public int getJobLevel() {
        return jobLevel;
    }

    public boolean isOnline() {
        return online;
    }
}
