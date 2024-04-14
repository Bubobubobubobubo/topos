import { type Editor } from "../../main";
import { makeExampleFactory } from "../Documentation";

export const atelier = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Atelier (06 mars 2024)

Bonjour tout le monde ! Nous sommes :

- [Rémi Georges](https://remigeorges.fr) : musicien, réalisateur en informatique musicale.
- [Agathe Herrou](https://www.youtube.com/@th4music) : musicienne, chercheuse.
- [Raphaël Forment](https://raphaelforment.fr) : musicien, doctorant.

Nous pratiquons le [live coding](https://livecoding.fr). Nous utilisons notre ordinateur comme un instrument de musique, nous programmons de la musique devant notre public. Nous pouvons faire plein de choses comme :

- créer des instruments de musique, des synthétiseurs, des boîtes à rythme.
- jouer des échantillons, charger des images, des vidéos, créer des animations.
- contrôler d'autres instruments, jouer avec d'autres musiciens.

Topos est un instrument de musique. On peut l'utiliser depuis n'importe quel ordinateur, sans avoir à installer quoi que ce soit. Nous l'avons fabriqué pour que tout le monde puisse jouer facilement de la musique.


## Découverte

<br>

${makeExample(
    "Percussions", `
tempo(120) // Changer le tempo
beat(1)::sound('kick').out()
beat(2)::sound('snare').out()
beat(.5)::sound('hh').out()
`, true,)}

<br>

- Qu'est-ce qu'il se passe si je change un nombre ?
- Qu'est-ce qu'il se passe si je change un nom ? 
  - Essayez par exemple <ic>"sid"</ic> ou <ic>"trump"</ic>.
- Qu'est-ce qu'il se passe si j'enlève <ic>.out()</ic> ?
- Est-il possible de jouer un rythme très rapide ou très lent ?


### Ajout d'une basse

<br>

${makeExample(
      "Une basse", `
// Aucun changement dans le code
beat(1)::sound('kick').out()
beat(2)::sound('snare').out()
beat(.5)::sound('hh').out()

// Une nouvelle partie
beat([0.25,0.5].beat(1))::sound("pluck")
  .note([40,45].beat(2)).out()
`, true,)}

<br>

- Qu'est-ce que le son <ic>"pluck"</ic> ?

- Que signifie <ic>.note([40,45].beat(2))</ic> ?

- Que se passe-t-il si je change la valeur dans <ic>.beat(2)</ic> ?

- Que se passe-t-il lorsque j'ajoute de nouveaux nombres dans <ic>[40, 45]</ic> ?

### Ajout d'une mélodie

<br>

${makeExample(
        "Le morceau complet", `
// Aucun changement dans le code
beat(1)::sound('kick').out()
beat(2)::sound('snare').out()
beat(.5)::sound('hh').out()
beat([0.25,0.5].beat(1))::sound("pluck")
  .note([40,45].beat(2)).out()

// Nouvelle partie mélodique
beat([0.25,0.5].beat())::sound("pluck")
  .note([0,7,5,8,2,9,0].scale("Major",60).beat(1))
  .vib(8).vibmod(1/4)
  .delay(0.5).room(1.5).size(0.5)
  .out()
`, true,)}

<br>

Ici, on ajoute une nouvelle mélodie mais il s'agit aussi d'un nouvel instrument. C'est pour cela que le code est plus long. Quand on fait du <em>live coding</em>, on code tout en même temps : notes, rythmes, mélodies, sons. C'est beaucoup de choses ! C'est pour cela que le code est court, on essaie de tout taper très vite en jouant !

- Que signifie selon vous <ic>vib</ic>, <ic>delay</ic>, <ic>room</ic> ou <ic>size</ic> ?

- Que se passe-t-il si je change les valeurs dans <ic>vib</ic>, <ic>delay</ic>, <ic>room</ic> ou <ic>size</ic> ?

<br>

**Exercices :**

- Transformer <ic>vib(8)</ic> en <ic>vib([2,4,8].beat(1))</ic>.
- Transformer <ic>"pluck"</ic> en <ic>["pluck", "clap"].beat(1)</ic>.

Vous pouvez aussi utiliser la fonction <ic>rhythm</ic> pour jouer rapidement des rythmes.

${makeExample(
          "Rythmes rythmes rythmes", `
rhythm(0.5, 3, 8)::sound('bd').out()
rhythm(0.5, 3, 8)::sound('clap').out()
rhythm(0.5, 6, 8)::sound('hat').out()
rhythm(0.25, 6, 8)::sound('hat')
  .vel(0.3).speed(2).out()
rhythm(0.5, 2, 8)::sound('sd').out()
`, true)};

## Créer un instrument

<br>

Nous allons créer un nouvel instrument à partir d'un son de base. Voici un premier son :

${makeExample("Notre son de base", `beat(2)::sound('sine').note(50).ad(0, .5).out()`, true)}

<br>

Ce son est assez ennuyeux. Nous allons ajouter quelques paramètres :

${makeExample("Beaucoup mieux !", `beat(2)::sound('sine').note(50).fmi(2).fmh(2).ad(0, .5).out()`, true)}

<br>

Nous allons aussi ajouter quelques effets intéressants :

${makeExample("Ajout d'un écho", `beat(2)::sound('sine').note(50)
  .fmi(2).fmh(2).ad(1/16, 1.5)
  .delay(0.5).delayt(0.75).out()`,
            true)}

<br>

Nous pouvons utiliser plusieurs techniques pour rendre le son plus dynamique :
- générer des valeurs aléatoires pour les paramètres
- utiliser des générateurs de valeurs (comme <ic>usine</ic>)
- utiliser la souris ou un autre contrôleur pour changer les valeurs en temps réel

${makeExample("Plus dynamique encore", `
beat(2)::sound('sine').note([50,55,57,62,66, 69, 74].mouseX())
  .fmi(usine(1/4)).fmh([1,2,0.5].beat())
  .ad(1/16, 1.5).delay(0.5).delayt(0.75)
  .out()`, true)}

<br>

Un exemple final, le plus complexe jusqu'à présent :

${makeExample("Un instrument de musique complet", `
beat(2)::sound('triangle')
  .note([50,55,57,62,66, 69, 74].mouseX())
  .fmi(usine(1/4)).fmh([1,2,0.5].beat())
  .ad(1/16, 1.5).delay(0.5).delayt(0.75)
  .room(0.5).size(8).lpf(usine(1/3)*4000).out()`, true)}

## Compléments

${makeExample("Quelques échantillons", `
ab ade ades2 ades3 ades4 alex alphabet amencutup armora arp arpy auto
baa baa2 bass bass0 bass1 bass2 bass3 bassdm bassfoo battles bd bend
bev bin birds birds3 bleep blip blue bottle breaks125 breaks152
breaks157 breaks165 breath bubble can casio cb cc chin circus clak
click clubkick co coins control cosmicg cp cr crow d db diphone
diphone2 dist dork2 dorkbot dr dr2 dr55 dr_few drum drumtraks e east
electro1 em2 erk f feel feelfx fest fire flick fm foo future gab
gabba gabbaloud gabbalouder glasstap glitch glitch2 gretsch gtr h
hand hardcore hardkick haw hc hh hh27 hit hmm ho hoover house ht if
ifdrums incoming industrial insect invaders jazz jungbass jungle juno
jvbass kicklinn koy kurt latibro led less lighter linnhats lt made
made2 mash mash2 metal miniyeah monsterb moog mouth mp3 msg mt mute
newnotes noise noise2 notes numbers oc off outdoor pad padlong pebbles
perc peri pluck popkick print proc procshort psr rave rave2 ravemono
realclaps reverbkick rm rs sax sd seawolf sequential sf sheffield
short sid sine sitar sn space speakspell speech speechless speedupdown
stab stomp subroc3d sugar sundance tabla tabla2 tablex tacscan tech
techno tink tok toys trump ul ulgab uxay v voodoo wind wobble world
xmas yeah`, true)}


`
};


