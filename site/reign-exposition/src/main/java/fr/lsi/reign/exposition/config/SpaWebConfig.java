package fr.lsi.reign.exposition.config;

import java.io.IOException;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Rafraîchir la page sur une route Angular profonde (ex: /characters) envoie GET /characters au
 * serveur, qui n'a ni endpoint API ni fichier statique de ce nom : sans ce fallback, ça finit en
 * erreur au lieu de laisser Angular reprendre la main sur sa propre route côté client.
 */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        final Resource requested = location.createRelative(resourcePath);
                        return requested.exists() && requested.isReadable() ? requested : new ClassPathResource("/static/index.html");
                    }
                });
    }
}
