package fr.lsi.reign.exposition.server.dto;

import fr.lsi.reign.domain.server.model.ServerStatus;

public record ServerStatusResponse(boolean login, boolean character, boolean map, long onlineCount) {

    public static ServerStatusResponse from(ServerStatus status) {
        return new ServerStatusResponse(status.isLoginUp(), status.isCharUp(), status.isMapUp(), status.getOnlineCount());
    }
}
