package fr.lsi.reign.domain.server.model;

/** Disponibilité (simple test de connexion TCP) des trois serveurs rAthena. */
public class ServerStatus {

    private final boolean loginUp;

    private final boolean charUp;

    private final boolean mapUp;

    public ServerStatus(boolean loginUp, boolean charUp, boolean mapUp) {
        this.loginUp = loginUp;
        this.charUp = charUp;
        this.mapUp = mapUp;
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
}
