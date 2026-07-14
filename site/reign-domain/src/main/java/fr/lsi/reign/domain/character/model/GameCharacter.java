package fr.lsi.reign.domain.character.model;

import fr.lsi.reign.domain.account.model.Sex;
import java.time.LocalDateTime;

/**
 * Personnage joueur, mappé en lecture seule sur la table `char` du serveur
 * rAthena (le site ne crée/modifie jamais de personnage, seul le
 * char-server le fait - à l'exception de la suppression complète, voir
 * CharacterRepository.deleteCompletely).
 *
 * Reprend (quasi) toutes les colonnes de la table : c'est volontairement une
 * vue brute et exhaustive pour l'instant (panneau de focus "tout afficher"),
 * pas encore un modèle métier réduit à ce qui est réellement utile.
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

    private long baseExp;

    private long jobExp;

    private long zeny;

    private int str;

    private int agi;

    private int vit;

    private int intelligence;

    private int dex;

    private int luk;

    private int pow;

    private int sta;

    private int wis;

    private int spl;

    private int con;

    private int crt;

    private int maxHp;

    private int hp;

    private int maxSp;

    private int sp;

    private int maxAp;

    private int ap;

    private int statusPoint;

    private int skillPoint;

    private int traitPoint;

    private int option;

    private int faction;

    private int karma;

    private int manner;

    private int partyId;

    private int guildId;

    private int petId;

    private int homunId;

    private int elementalId;

    private int hair;

    private int hairColor;

    private int clothesColor;

    private int body;

    private int weapon;

    private int shield;

    private int headTop;

    private int headMid;

    private int headBottom;

    private int robe;

    private String lastMap;

    private int lastX;

    private int lastY;

    private int lastInstanceId;

    private String saveMap;

    private int saveX;

    private int saveY;

    private int partnerId;

    private boolean online;

    private int father;

    private int mother;

    private int child;

    private int fame;

    private int rename;

    private long deleteDate;

    private int moves;

    private int unbanTime;

    private int font;

    private int uniqueItemCounter;

    private Sex sex;

    private int hotkeyRowshift;

    private int hotkeyRowshift2;

    private int clanId;

    private LocalDateTime lastLogin;

    private int titleId;

    private int showEquip;

    private int inventorySlots;

    private int bodyDirection;

    private int disableCall;

    private int disablePartyInvite;

    private int disableShowCostumes;

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

    public long getBaseExp() {
        return baseExp;
    }

    public long getJobExp() {
        return jobExp;
    }

    public long getZeny() {
        return zeny;
    }

    public int getStr() {
        return str;
    }

    public int getAgi() {
        return agi;
    }

    public int getVit() {
        return vit;
    }

    public int getIntelligence() {
        return intelligence;
    }

    public int getDex() {
        return dex;
    }

    public int getLuk() {
        return luk;
    }

    public int getPow() {
        return pow;
    }

    public int getSta() {
        return sta;
    }

    public int getWis() {
        return wis;
    }

    public int getSpl() {
        return spl;
    }

    public int getCon() {
        return con;
    }

    public int getCrt() {
        return crt;
    }

    public int getMaxHp() {
        return maxHp;
    }

    public int getHp() {
        return hp;
    }

    public int getMaxSp() {
        return maxSp;
    }

    public int getSp() {
        return sp;
    }

    public int getMaxAp() {
        return maxAp;
    }

    public int getAp() {
        return ap;
    }

    public int getStatusPoint() {
        return statusPoint;
    }

    public int getSkillPoint() {
        return skillPoint;
    }

    public int getTraitPoint() {
        return traitPoint;
    }

    public int getOption() {
        return option;
    }

    public int getFaction() {
        return faction;
    }

    public int getKarma() {
        return karma;
    }

    public int getManner() {
        return manner;
    }

    public int getPartyId() {
        return partyId;
    }

    public int getGuildId() {
        return guildId;
    }

    public int getPetId() {
        return petId;
    }

    public int getHomunId() {
        return homunId;
    }

    public int getElementalId() {
        return elementalId;
    }

    public int getHair() {
        return hair;
    }

    public int getHairColor() {
        return hairColor;
    }

    public int getClothesColor() {
        return clothesColor;
    }

    public int getBody() {
        return body;
    }

    public int getWeapon() {
        return weapon;
    }

    public int getShield() {
        return shield;
    }

    public int getHeadTop() {
        return headTop;
    }

    public int getHeadMid() {
        return headMid;
    }

    public int getHeadBottom() {
        return headBottom;
    }

    public int getRobe() {
        return robe;
    }

    public String getLastMap() {
        return lastMap;
    }

    public int getLastX() {
        return lastX;
    }

    public int getLastY() {
        return lastY;
    }

    public int getLastInstanceId() {
        return lastInstanceId;
    }

    public String getSaveMap() {
        return saveMap;
    }

    public int getSaveX() {
        return saveX;
    }

    public int getSaveY() {
        return saveY;
    }

    public int getPartnerId() {
        return partnerId;
    }

    public boolean isOnline() {
        return online;
    }

    public int getFather() {
        return father;
    }

    public int getMother() {
        return mother;
    }

    public int getChild() {
        return child;
    }

    public int getFame() {
        return fame;
    }

    public int getRename() {
        return rename;
    }

    public long getDeleteDate() {
        return deleteDate;
    }

    public int getMoves() {
        return moves;
    }

    public int getUnbanTime() {
        return unbanTime;
    }

    public int getFont() {
        return font;
    }

    public int getUniqueItemCounter() {
        return uniqueItemCounter;
    }

    public Sex getSex() {
        return sex;
    }

    public int getHotkeyRowshift() {
        return hotkeyRowshift;
    }

    public int getHotkeyRowshift2() {
        return hotkeyRowshift2;
    }

    public int getClanId() {
        return clanId;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public int getTitleId() {
        return titleId;
    }

    public int getShowEquip() {
        return showEquip;
    }

    public int getInventorySlots() {
        return inventorySlots;
    }

    public int getBodyDirection() {
        return bodyDirection;
    }

    public int getDisableCall() {
        return disableCall;
    }

    public int getDisablePartyInvite() {
        return disablePartyInvite;
    }

    public int getDisableShowCostumes() {
        return disableShowCostumes;
    }
}
