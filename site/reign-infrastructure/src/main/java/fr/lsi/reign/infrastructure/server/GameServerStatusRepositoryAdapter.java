package fr.lsi.reign.infrastructure.server;

import fr.lsi.reign.domain.server.GameServerStatusRepository;
import fr.lsi.reign.domain.server.model.ServerStatus;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

@Repository
class GameServerStatusRepositoryAdapter implements GameServerStatusRepository {

    private static final int TIMEOUT_MS = 1500;

    private final String loginHost;

    private final int loginPort;

    private final String charHost;

    private final int charPort;

    private final String mapHost;

    private final int mapPort;

    GameServerStatusRepositoryAdapter(
            @Value("${reign.gameserver.login-host}") String loginHost,
            @Value("${reign.gameserver.login-port}") int loginPort,
            @Value("${reign.gameserver.char-host}") String charHost,
            @Value("${reign.gameserver.char-port}") int charPort,
            @Value("${reign.gameserver.map-host}") String mapHost,
            @Value("${reign.gameserver.map-port}") int mapPort) {
        this.loginHost = loginHost;
        this.loginPort = loginPort;
        this.charHost = charHost;
        this.charPort = charPort;
        this.mapHost = mapHost;
        this.mapPort = mapPort;
    }

    @Override
    public ServerStatus check() {
        return new ServerStatus(isReachable(loginHost, loginPort), isReachable(charHost, charPort), isReachable(mapHost, mapPort));
    }

    private boolean isReachable(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), TIMEOUT_MS);
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
