package fr.lsi.reign.domain.server.model;

/** Disponibilité (simple test de connexion TCP) des trois serveurs rAthena, plus le nombre de joueurs connectés. */
public class ServerStatus {

    private final boolean loginUp;

    private final boolean charUp;

    private final boolean mapUp;

    private final long onlineCount;

    public ServerStatus(boolean loginUp, boolean charUp, boolean mapUp, long onlineCount) {
        this.loginUp = loginUp;
        this.charUp = charUp;
        this.mapUp = mapUp;
        this.onlineCount = onlineCount;
    }

    public boolean isLoginUp() {
        return loginUp;
    }

    public boolean isCharUp() {
        return charUp;
    }

    public boolean isMapUp() {
        return mapUp;
    }

    public long getOnlineCount() {
        return onlineCount;
    }
}
