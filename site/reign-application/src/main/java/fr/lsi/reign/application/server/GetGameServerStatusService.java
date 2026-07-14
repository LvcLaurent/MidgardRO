package fr.lsi.reign.application.server;

import fr.lsi.reign.domain.server.GameServerStatusRepository;
import fr.lsi.reign.domain.server.model.ServerStatus;
import org.springframework.stereotype.Service;

@Service
public class GetGameServerStatusService {

    private final GameServerStatusRepository repository;

    public GetGameServerStatusService(GameServerStatusRepository repository) {
        this.repository = repository;
    }

    public ServerStatus get() {
        return repository.check();
    }
}
