import { Component } from '@angular/core';

interface StorySection {
    title: string;
    paragraphs: string[];
}

@Component({
    selector: 'app-story',
    standalone: true,
    template: `
        <div class="flex flex-col items-center">
            <div class="w-full max-w-4xl flex flex-col gap-6">
                <div class="card">
                    <div class="text-surface-900 dark:text-surface-0 text-2xl font-medium mb-3">Reign of Midgard</div>
                    <p class="text-surface-700 dark:text-surface-300 leading-relaxed">
                        Reign of Midgard est un serveur Ragnarok Online privé, pensé pour évoluer en continu plutôt que de proposer un contenu figé. De nouvelles quêtes, de nouveaux personnages et de nouveaux lieux
                        apparaissent régulièrement - avec l'aide de l'IA pour accélérer l'écriture, sans jamais sacrifier la cohérence de l'univers. L'objectif : un monde vivant, où chaque PNJ a une vraie raison
                        d'être là, et où l'histoire continue de s'écrire au fil des mises à jour.
                    </p>
                </div>

                @for (section of sections; track section.title) {
                    <div class="card">
                        <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-3">{{ section.title }}</div>
                        @for (paragraph of section.paragraphs; track paragraph) {
                            <p class="text-surface-700 dark:text-surface-300 leading-relaxed mb-3 last:mb-0">{{ paragraph }}</p>
                        }
                    </div>
                }
            </div>
        </div>
    `
})
export class Story {
    sections: StorySection[] = [
        {
            title: 'Avant la Rupture',
            paragraphs: [
                "Midgard n'a jamais été un monde purement nordique. Depuis toujours, ses terres se trouvent à un carrefour - les racines d'Yggdrasil touchent, dit-on, bien plus de mondes que les Neuf Royaumes enseignés par l'ancienne Foi. Momies, sphinx, méduses, gobelins, dragons d'Orient : autant de créatures qui ont, au fil des siècles, dérivé jusqu'à Midgard par ces racines-frontières.",
                "Pendant des siècles, un seul ordre a structuré le monde : la Foi, le culte du Panthéon nordique, gardienne des textes, des rites, et de l'équilibre entre Midgard et les mondes qui y affleurent."
            ]
        },
        {
            title: 'La Rupture',
            paragraphs: [
                "Il y a une génération, les racines d'Yggdrasil se sont fissurées quelque part sous Midgard - un événement que les survivants ont fini par appeler simplement la Rupture. Deux choses en ont jailli au même moment, en deux endroits distincts du monde : une énergie arcanique brute que certains ont appris à canaliser sans passer par les rites du Panthéon, et les vestiges d'une civilisation antérieure enfouie, ses machines encore actives après des siècles de sommeil.",
                "Deux écoles de pensée sont nées de ces découvertes, toutes deux en rupture avec la Foi : pourquoi continuer à prier quand on peut apprendre à puiser la force soi-même, ou la construire de ses mains ? La Foi y a vu une hérésie. La guerre qui a suivi n'a jamais été un simple conflit de territoire - c'est un conflit sur la nature même du pouvoir.",
                "La Rupture n'a pas seulement libéré magie et technologie : elle a aussi réveillé ce que la Foi maintenait endormi depuis des siècles. Des créatures anciennes, jusque-là confinées aux marges du monde, ont commencé à ressurgir un peu partout."
            ]
        },
        {
            title: "L'Ordre de la Faille et les Forgenoires",
            paragraphs: [
                "L'Ordre de la Faille, héritier direct de la Rupture arcanique, a fait de Geffen sa capitale naturelle. Les Forgenoires, héritiers des vestiges retrouvés, se sont installés à Lighthalzen, où machines et ateliers tournent encore, des générations après leur redécouverte. Aucune des deux factions n'est fermée aux autres métiers - mais chacune a sa branche symbole, et chacune y voit un peu plus qu'un simple choix de carrière.",
                "La Foi, elle, n'est plus une faction jouable. Elle reste la toile de fond, l'ordre d'avant, en perte de vitesse face aux deux nouvelles voies. Prontera, capitale politique historique de Midgard, en est le dernier grand bastion - une ville qui essaie de rester au-dessus de la mêlée, mais dont l'influence décline."
            ]
        },
        {
            title: 'Izlude, le port franc',
            paragraphs: [
                "Izlude est restée neutre - et c'est une nécessité, pas un hasard. C'est le dernier grand port en eau profonde reliant les deux littoraux du monde : aucune des deux factions ne peut se permettre de le fermer sans s'étrangler elle-même. Marchands, déserteurs, réfugiés et agents des deux camps s'y croisent sans s'affronter ouvertement.",
                "C'est là que votre histoire commence : un navire, pris dans une tempête, fait naufrage près d'Izlude - la seule côte où l'on est certain d'être secouru plutôt que recruté de force ou attaqué. Sans camp, sans attache, c'est à vous d'écrire la suite."
            ]
        },
        {
            title: 'Prontera, la capitale assiégée',
            paragraphs: [
                "Malgré son déclin, Prontera reste un enjeu que personne ne peut ignorer. L'Ordre de la Faille et les Forgenoires s'y affrontent ouvertement pour le contrôle de la ville, qui peut changer de main au fil des combats. Une réputation locale, distincte de celle des deux factions, récompense aussi ceux qui rendent service aux habitants ordinaires, pris entre deux feux."
            ]
        },
        {
            title: 'Payon, la ville-forêt',
            paragraphs: [
                "Loin des remous d'Izlude et de Prontera, Payon a bâti sa réputation sur la chasse et l'artisanat forestier plutôt que sur les grands discours. La ville n'a jamais formellement choisi de camp - mais depuis quelque temps, des éclaireurs de l'Ordre de la Faille et des Forgenoires rôdent à ses abords, comme si la guerre cherchait déjà où planter sa prochaine bannière.",
                "Depuis la Rupture, la forêt elle-même semble avoir changé : les créatures qui y vivaient sans déranger personne sont devenues plus nombreuses, plus grosses, plus agressives. Payon reste, pour l'instant, un endroit où l'on peut encore respirer un peu - mais rien ne dit que ça durera."
            ]
        }
    ];
}
