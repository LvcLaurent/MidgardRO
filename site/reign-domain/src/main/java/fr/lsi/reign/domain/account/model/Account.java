package fr.lsi.reign.domain.account.model;

import java.time.LocalDateTime;

/**
 * Compte joueur, mappé sur la table `login` du serveur rAthena (même compte
 * utilisé pour se connecter au jeu et au site).
 *
 * Entité de domaine pure : aucune annotation de persistance ici, le mapping
 * vers la table `login` est décrit en dehors (voir account.orm.xml dans
 * reign-infrastructure).
 */
public class Account {

    /** rAthena n'accorde aucun slot de personnage par défaut (colonne à 0) ; on force une valeur jouable. */
    public static final int DEFAULT_CHARACTER_SLOTS = 9;

    public static final int PLAYER_GROUP_ID = 0;

    public static final int ADMIN_GROUP_ID = 99;

    public static final int NOT_BANNED_STATE = 0;

    private Long accountId;

    private String userId;

    private String userPass;

    private Sex sex;

    private String email;

    private int groupId;

    private int state;

    private int characterSlots;

    private LocalDateTime lastLogin;

    private String lastIp;

    private int loginCount;

    protected Account() {
        // constructeur requis par Hibernate
    }

    private Account(String userId, String userPass, String email, Sex sex) {
        this.userId = userId;
        this.userPass = userPass;
        this.email = email;
        this.sex = sex;
        this.groupId = PLAYER_GROUP_ID;
        this.state = NOT_BANNED_STATE;
        this.characterSlots = DEFAULT_CHARACTER_SLOTS;
        this.loginCount = 0;
        this.lastIp = ""; // colonne NOT NULL côté rAthena
    }

    public static Account register(String userId, String userPass, String email, Sex sex) {
        return new Account(userId, userPass, email, sex);
    }

    /**
     * rAthena (use_MD5_passwords: no) stocke et compare le mot de passe en clair.
     * Le mot de passe n'est donc pas haché ici pour rester compatible avec le login-server.
     */
    public boolean matchesPassword(String rawPassword) {
        return this.userPass != null && this.userPass.equals(rawPassword);
    }

    public boolean isBanned() {
        return this.state != NOT_BANNED_STATE;
    }

    public boolean isAdmin() {
        return this.groupId == ADMIN_GROUP_ID;
    }

    public void recordSuccessfulLogin(String ip) {
        this.lastLogin = LocalDateTime.now();
        this.lastIp = ip;
        this.loginCount++;
    }

    public void changeEmail(String newEmail) {
        this.email = newEmail;
    }

    /**
     * Voir le commentaire de matchesPassword : stocké en clair, pas de hachage ici non plus.
     */
    public void changePassword(String newPassword) {
        this.userPass = newPassword;
    }

    public Long getAccountId() {
        return accountId;
    }

    public String getUserId() {
        return userId;
    }

    public Sex getSex() {
        return sex;
    }

    public String getEmail() {
        return email;
    }

    public int getGroupId() {
        return groupId;
    }

    public int getState() {
        return state;
    }

    public int getCharacterSlots() {
        return characterSlots;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public String getLastIp() {
        return lastIp;
    }

    public int getLoginCount() {
        return loginCount;
    }
}
