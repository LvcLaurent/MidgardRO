package fr.lsi.reign.domain.character.model;

import java.util.Map;

/**
 * Traduit la colonne `faction` (0/1/2) en nom lisible. Reflète les valeurs posées côté
 * serveur (server/src/common/mmo.hpp, champ faction de mmo_charstatus).
 */
public final class FactionName {

    private static final Map<Integer, String> NAMES = Map.of(0, "Aucune", 1, "Magie", 2, "Technologie");

    private FactionName() {}

    public static String of(int faction) {
        return NAMES.getOrDefault(faction, "Inconnue");
    }
}
