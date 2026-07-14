package fr.lsi.reign.domain.server;

import fr.lsi.reign.domain.server.model.ServerStatus;

/** Port du domaine : vérifie si login/char/map-server acceptent des connexions. */
public interface GameServerStatusRepository {

    ServerStatus check();
}
