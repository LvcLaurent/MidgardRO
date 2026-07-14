package fr.lsi.reign.exposition.server;

import fr.lsi.reign.application.server.GetGameServerStatusService;
import fr.lsi.reign.exposition.server.dto.ServerStatusResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public : affiché dans le bandeau du site même hors connexion. */
@RestController
@RequestMapping("/server")
public class ServerStatusController {

    private final GetGameServerStatusService getGameServerStatusService;

    public ServerStatusController(GetGameServerStatusService getGameServerStatusService) {
        this.getGameServerStatusService = getGameServerStatusService;
    }

    @GetMapping("/status")
    public ServerStatusResponse status() {
        return ServerStatusResponse.from(getGameServerStatusService.get());
    }
}
