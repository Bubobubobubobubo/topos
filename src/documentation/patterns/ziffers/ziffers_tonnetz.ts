import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const ziffers_tonnetz = (application: Editor): string => {
    const makeExample = makeExampleFactory(application);
    return `
# Tonnetz

The Riemannian Tonnetz is a geometric representation of pitches where we apply mathematical operations to analyze harmonic and melodic relationships in tonal music. Ziffers includes an implementation of live coding Tonnetz developed together with <a href="https://github.com/edelveart/TypeScriptTonnetz" target="_blank">Edgar Delgado Vega</a>. Nevertheless, our implementation allows you to play in different chord complexes and **combine 67 transformations** with **new exploratory notation**. You have at your disposal the sets: traditional PLR, film music, extended PLR* and functions for seventh chords PLRQ, PLRQ*, ST.

Tonnetz can be visualized as an <a href="https://numeric-tonnetz-ziffers-6f7c9299bb4e1292f6891b9aceba16d81409236.gitlab.io/" target="_blank">numeric lattice</a> that represents the twelve pitch classes of the chromatic scale. The numeric visualization is a fork of <a href="https://hal.science/hal-03250334/" target="_blank">Web tonnetz</a> by Corentin Guichaou et al. (2021). The lattice can be arranged into multiple pitch spaces which are all supported in Ziffers implementation.

In addition, we have included common graphs and cycles in Neo-Riemmanian theory: HexaCycles, OctaCycles, Enneacycles, Weitzmann Regions, Boretz Regions, OctaTowers, Cube Dance and Power Towers. You can explore each of these graphs in great generality over different Tonnetz.

## Explorative notation

Ziffers implements explorative live coding notation that indexes all of the transformations for triad and seventh chords. For more detailed transformations see Triad and Tetra chapters. Explorative transformations also include cardinal direction transformations (North, South, East, West) as visualized by the <a href="https://numeric-tonnetz-ziffers-6f7c9299bb4e1292f6891b9aceba16d81409236.gitlab.io/" target="_blank">numerical Tonnetz</a> and correspond to different Neo-Riemannian operations depending on the chord type (Major or Minor).

Transformations are applied by grouping operations into a **parameter string** which applies the **transformations** to the chord. The parameter string is a **sequence** of transformations **separated by whitespace**, for example <ic>plr rl2 p3lr</ic>. The numbers after the characters defines the **index for the operation**, as there can be multiple operations of the same type.

Indexed transformations <ic>[plrfsntqNSEW][1-9]*</ic>:

* p: Parallel
* l: Leading-tone exchange
* r: Relative
* f: Film transformation - Far-fifth
* n: Film transformation - Near-fifth (Nebenverdwandt) or PLRQ* transformation
* s: Film transformation - Slide
* h: Film transformation - Hexatonic Pole
* t: Film transformation - Tritone transposition
* q: PLR* transformation or PLRQ* transformation
* N: North transformation
* S: South transformation
* E: East transformation
* W: West transformation

### Examples:

${makeExample(
        "Explorative transformations with roman chords",
        `
z1('i i7').tonnetz("p1 p2 plr2")
  .sound('wt_stereo')
  .adsr(0, .1, 0, 0)
  .out()`,
        true,
    )}

${makeExample(
        "Arpeggiated explorative transformations",
        `
z1("i7")
  .tonnetz("p l2 r3 rp4l")
  .arpeggio("e _ 0 1 s ^ 0 2 1 3 h _ 012 s ^ 2 1")
  .sound("sine")
  .out()`,
        true,
    )}

${makeExample(
        "Arpeggios and note lengths with parameters",
        `
z1("024")
  .tonnetz("p lr rp lrp")
  .arpeggio(0,2,1,2)
  .noteLength(1/16,1/8)
  .sound("sine")
  .out()`,
        true,
    )}

${makeExample(
        "Explorative transformations with cardinal directions",
        `
        z1("1/4 i")
        .tonnetz("p Np N2p N3p plr N3plr E EE EEE E6 NSE3W2")
        .sound("sine")
        .out()
        `
    )}

## Triad transformations

Triad transformations can be defined explicitly using the <ic>triadTonnetz(transformation: string, tonnetz: number[])</ic> method. This method will only apply specific transformations to triad chords.

In the table below, we write the transformations types available for triads followed by the **transposition in semitones (+/-)** that we must perform to the **root of the chord**: <ic>0,4,3,7,5,1,8,6</ic>.

Second, you should know that the numbers next to the names of the transformations represent the **chord types to be exchanged**: <ic>1 = major, 2 = minor, 3 = diminished, 4 = augmented</ic>.

In fact, the functions <ic>p,l,r</ic> and the so-called [**film music transformations**](https://alpof.wordpress.com/2021/10/09/neo-riemannian-examples-in-music/), could have the numbers <ic>p12, l12, r12, f12 </ic> and so on, since they transform major and minor chords with their respective root transpositions. It must be clarified that the <ic>t6</ic> function is the only one among all that maintains the same type of chord.

Therefore, you will see that paying attention to the examples will allow you to infer whether you should **raise or lower the root** depending on the **type of chord**.

| Function |           Function type           | Root transposition |    Example    |
| :------: | :-------------------------------: | :----------------: | :-----------: |
|    p     |             Parallel              |         0          |   C <-> Cm    |
|    l     |           Leading-tone            |         4          |   C <-> Em    |
|    r     |             Relative              |         3          |   C <-> Am    |
|    f     |        Film music: Far-fifth      |         7          |   C <-> Gm    |
|    n     |    Film music: Near-fifth         |         5          |   C <-> Fm    |
|    s     |         Film music: Slide         |         1          |   C <-> C#m   |
|    h     |    Film music: Hexatonic pole     |         8          |   C <-> G#m   |
|    t6    | Film music: Tritone Transposition |         6          |   C <-> F#    |
|   p32    |             Parallel              |         0          |  Cdim <-> Cm  |
|   p41    |             Parallel              |         0          |  Caug <-> C   |
|   lt13   |           Leading-tone            |         4          |  C <-> Edim   |
|   l41    |           Leading-tone            |         4          | Caug <-> Edim |
|   l14    |           Leading-tone            |         4          |  C <-> Eaug   |
|   rt23   |             Relative              |         3          |  Cm <-> Adim  |
|   rt42   |             Relative              |         3          |  Caug <-> Am  |
|   q13    |               PLR*                |         1          |  C <-> C#dim  |
|   q42    |               PLR*                |         1          | Caug <-> C#m  |
|   n42    |               PLR*                |         5          |  Caug <-> Fm  |

* Remark A: We add <ic>t</ic> to <ic>l.13</ic>, <ic>r.23</ic>, <ic>r.42</ic> because we have similar syntax for sevenths transformations <ic>l13</ic>, <ic>r23</ic> and <ic>r42</ic>, although the meaning of the numbers (chord types) is different. See in the next section.
* Remark B: For those curious about mathematics, what we have implemented at Ziffers is the group called **PLR\*** [(Cannas, 2018, pp. 93-100)](https://publication-theses.unistra.fr/public/theses_doctorat/2018/CANNAS_Sonia_2018_ED269.pdf).

### Examples:
${makeExample(
        "Synthetic 'Morton'",
        `
z0('h. 0 q _6 h _4 _3 w _2 _0 h. ^0 q 6 h 4 3 3/4 2 5/4 0 w r')
  .scale("minor").sound('sawtooth').key("A")
  .room(0.9).size(9).phaser(0.25).phaserDepth(0.8)
  .vib(4).vibmod(0.15).out()

z1('w 904')
  .scale("chromatic")
  .tonnetz('o f l l o f l l o')
  .sound('sine').adsr(0.1, 1, 1, 1.9).out()

z2('904')
  .scale("chromatic")
  .tonnetz('o f l l o f l l o')
  .arpeggio('s 0 2 1 0 1 2 1 0 2 1 0 1 2 0 1 0')
  .sound('sine').pan(rand(1, 0)).adsr(0, 0.125, 0.15, 0.25).out()

z3('e __ 4 s 0 e 1 2 s')
  .sound('hat').delay(0.5).delayfb(0.35).out()`,
        true,
    )}

## Different Tonnetz, Chord Complexes

At Ziffers we have strived to have fun and inspire you by exploring new sounds that Neo-Riemannian functions can offer you by changing only one parameter: The Tonnetz in which your chords move. By default, the Tonnetz has this form: <ic>[3, 4, 5]</ic>. Let's try an example as it will clarify this idea for us.

The <ic>Cm</ic> chord has the tone classes: <ic>037</ic>. Notice that the distance between the third of the chord and the root of the chord is <ic>3</ic> <ic>(3-0)</ic>. In turn, the distance of the fifth from the third is <ic>4</ic> semitones <ic>(7-3)</ic>. Finally, the distance left to get from the fifth to the root is <ic>5</ic> <ic>(7+5=0)</ic>. These distances are known as **intervalic structure**. In this regard, the array <ic>[x = 3, y = 4, z = 5]</ic> of a Tonnetz tells us the intervallic structure of the chords to which we apply the Neo-Riemannian functions.

:warning: To have a geometric intuition of the chords that we are going to describe, we suggest you see the <a href="https://numeric-tonnetz-ziffers-6f7c9299bb4e1292f6891b9aceba16d81409236.gitlab.io/" target="_blank">numerical Tonnetz.</a>

In the next three Tonnetz we consider that we go from a minor chord to a major one by inversion (we change <ic>x</ic> and <ic>y</ic>).

* For the Tonnetz <ic>[3, 4, 5]</ic> we have minor chords <ic>037</ic> and major chords <ic>047</ic>
* For a Tonnetz <ic>[2, 3, 7]</ic> we have the "minor" chords <ic>025</ic> and the "major" chords <ic>035</ic>
* For a Tonnetz <ic>[1, 4, 7]</ic> we have the "minor" chords <ic>015</ic> and the "major" chords <ic>045</ic>

Are those all the Tonnetz? In fact, there are <ic>12</ic> spaces that comply with symmetries by **transposition and inversion**:

   <ic>[3, 4, 5], [1, 1, 10], [1, 2, 9], [1, 3, 8], [1, 4, 7], [1, 5, 6], [ 2, 3, 7], [ 2, 5, 5]</ic>

   <ic>[2, 4, 6], [2, 2, 8], [3, 3, 6], [4, 4, 4]</ic>

What do augmented chords or seventh chords sound like on a Tonnetz <ic>[1,5,6]</ic>? It is up to you to **explore all the transformations in different spaces**.

What if I want to place another type of Tonnetz that is not on the list? No problem, everyone is invited to the party.

* Remark C: If you want to know more about the topology and mathematics behind Tonnetz, you can refer to [Bigo (2013)](https://theses.hal.science/tel-01326827).

## Tetra transformations

Did you want to experiment with more functions? At Ziffers we have brought you Neo-Riemannian functions for seventh chords. The possibilities of sound exploration increase considerably, even more so if you **include different Tonnetz**.

Tetra transformations can be applied to seventh chords using the <ic>tetraTonnetz(transformation: string, tonnetz: number[])</ic> method. This method will apply specific transformations to certain type of chords. If the **chord is not the correct type**, the **transformation will not be applied**.

:warning: If you are here without having read the **triad chords transformations section**, we highly suggest you skip to it. The ideas and notation shown in this section are nothing more than an extension of what was developed above.

First, here we will deal with **9 interchangeable chord types** to which we will assign a number:

<ic>1 = 7, 2 = m7, 3 = hdim7, 4 = maj7, 5 = dim7, 6 = minMaj7, 7 = maj7#5, 8 = 7#5, 9 = 7b5</ic>.

Second, the **transpositions** that carry out the functions <ic>p = 0, l = 4, r = 3, q = 1, n = 5</ic>, raise or lower the **root of the chord** in semitones in equal measure. However, there are two new types of functions whose transpositions are the following: <ic>rr = 6</ic> and <ic>qq = 2</ic>.

You are ready, these have been all the requirements. Now a couple of examples will be enough for you to know how these functions operate.

* The <ic>p14</ic> function **does not move the root (0 semitones)** and changes a dominant 7th chord to a major 7th chord. For example: <ic>C7 <-> Cmaj7</ic>.
* The <ic>rr39</ic> function **moves the root 6 semitones** and swaps an hdim7 chord for a 7b5 chord. For example: <ic>Cm7b5 <-> F#7b5</ic>.

So that you can incorporate this new musical machinery into your game, all the possible transformations according to the type of seventh chord are listed below. You already know what each one will do.

* Remark D: For those curious about the mathematics behind it, we have implemented a group called **PLRQ** and another group called **PLRQ\*** extended [(Cannas, 2018, pp. 71-92)](https://publication-theses.unistra.fr/public/theses_doctorat/2018/CANNAS_Sonia_2018_ED269.pdf).

| Chord type |    P functions     |  L functions  |          R functions           | Q functions | N functions |
| :--------: | :----------------: | :-----------: | :----------------------------: | :---------: | :---------: |
|     7      | p12, p14, p18, p19 | l13, l15, l71 |           r12, rr19            |  q15, qq51  |     n51     |
|     m7     |   p12, p23, p26    |      l42      |         r12, r23, r42          |     q62     |             |
|   hdim7    |   p23, p35, p39    |      l13      | r23, r35, r53, r63, rr35, rr39 |  q43, qq38  |             |
|    maj7    |   p14, p47, p64    |      l42      |              r42               |     q43     |             |
|    dim7    |        p35         |      l15      |            r35, r53            |  q15, qq51  |     n51     |
|  minMaj7   |      p26, p64      |               |         r63, r76, r86          |  q62, q76   |             |
|   maj7#5   |      p47, p87      |      l71      |              r76               |     q76     |             |
|   dom7#5   |   p18, p87, p98    |      l89      |           r86, rr98            | qq38, qq98  |             |
|   dom7b5   |   p19, p39, p98    |      l89      |        rr19, rr39, rr98        |    qq98     |             |

### Examples

${makeExample(
        "Transform seventh chord from chromatic scale",
        `
z1("1.0 047{10}")
  .scale('chromatic')
  .tetraTonnetz("o p18 q15 l13 n51 p19 q15")
  .sound("sawtooth")
  .cutoff(500 + usine(1/8) * 2000)
  .adsr(.5,0.05,0.25,0.5)
  .dur(2.0)
  .out()`,
        true,
    )}

## Cyclic methods

In addition to the traditional tonnetz transformations, Ziffers implements cyclic methods that can be used to cycle through the tonnetz space. Cyclic methods turns individual pitch classes to chords using the tonnetz. The cyclic methods are:

* <ic>hexaCycle(tonnetz: number[], repeats: number = 3, components: number = 1)</ic>: Cycles through chords via hexatonic cycles
* <ic>octaCycle(tonnetz: number[], repeats: number = 4, components: number =  1)</ic>: Cycles through chords via octatonic cycles
* <ic>enneaCycle(tonnetz: number[], repeats: number = 3, components: number = 1)</ic>: Cycles through chords via enneatonic cycles

:warning: By default, the number of graph <ic>components</ic> is set to <ic>1</ic>. Therefore, these methods produce a single hexatonic, octatonic, and enneatonic cycle, respectively. OctaTowers were implemented in the same way, so it generates a single octatonic tower. Try increasing the number of components to obtain different graphs.

**HexaCycles** are sequences of major and minor triads generated by the <ic>p</ic> and <ic>l</ic> transformations. Let's take the following example starting with a <ic>C</ic> chord: <ic>C -> Cm -> Ab -> Abm -> E -> Em</ic>. You can start on the chord of your choice.

**OctaCycles** are sequences of major and minor triads generated using <ic>p</ic> and <ic>r</ic> transformations. Starting at <ic>C</ic>, we have the following sequence: <ic>C -> Cm -> Eb -> Ebm -> F# -> F#m -> A -> Am</ic>.

Unlike HexaCycles and OctaCycles, **EnneaCycles** are four-note chord sequences. Considering the functions implemented for tetrachords in Ziffers, we can interpret these sequences as generated by <ic>p12, p23, and l13</ic> transformations repeatedly: <ic>C7 -> Cm7 -> Cm7b5 -> Ab7 -> Abm7 -> Abm7b5 -> E7 -> Em7 -> Em7b5</ic>.

### Examples:

${makeExample(
        "Arpeggio with ennea cycle",
        `
z1("0 2 -1 3")
  .enneaCycle()
  .arpeggio(0,2,1)
  .scale("modimic")
  .noteLength(0.15,0.05,0.05,0.25)
  .sound("sine")
  .adsr(0.1,0.15,0.25,0.1)
  .out()`,
        true,
    )}

${makeExample(
        "Variating arpeggios",
        `
z1("s 0 3 2 1")
  .octaCycle()
  .arpeggio([0,[0,2],[1,0],[0,1,2]].beat(0.15))
  .sound("triangle")
  .adsr(0.1,0.1,0.13,0.15)
  .out()`,
        true,
    )}

## Cycles with vitamins and repetitions

Finally, cyclic methods in Ziffers can also be vitaminized with doses of different Tonnetz. However, this opens the way to different behavior with cycles.

We have the Tonnetz <ic>[2, 3, 7]</ic>, so <ic>hexaCycle([2, 3, 7])</ic>. The generated chords we hear are:

<ic>035 -> 025 -> 902 -> 9{11}2 -> 69{11} -> 68{11} </ic>

Apparently, everything operates as we expect: six chords and we return to the first. However, here comes the unexpected and perhaps somewhat obscure question:

* If we look at the graphs of the [numeric Tonnetz](https://numeric-tonnetz-ziffers-6f7c9299bb4e1292f6891b9aceba16d81409236.gitlab.io/), our hexaCycle over <ic>[2, 3, 7]</ic> which starts with the chord <ic>035</ic> goes through all the intermediate chords generated by <ic>p</ic> and <ic>l</ic> functions until reaching <ic>035</ic> again?

As you can verify it manually, you will see that this is not the case. Upon reaching the <ic>68{11} </ic> chord, the cycle makes a jump of two chords (<ic>368 358</ic>) towards the <ic>035</ic> chord. This does not happen with the cycles in the Tonnetz <ic>[3, 4, 5]</ic>, since all the intermediate chords are played there.

To play the chords without jumps in our hexaCycle (although the prefix "hexa" would no longer have a precise meaning), we add a number of repetitions.

${makeExample(
        "HexaCycles with vitamins",
        `
z1("0")
.scale("chromatic")
.hexaCycle([2,3,7],4)
.sound("sine").out()
`,
        true
    )}

By default hexaCycles and enneaCycles have <ic>3</ic> repetitions, while octaCycles has <ic>4</ic> repetitions. We have specified a **chromatic scale** although this is the **default scale**. Try changing the **repeats and scales** when playing with different Tonnetz.

* Remark E: These cycles in Tonnetz <ic>[3, 4, 5]</ic> are implemented based on the work of [Douthett & Steinbach (1998, pp. 245-247, 253-256)](https://www.jstor.org/stable/843877)

## More traversing methods

In addition to the cyclical traversing methods, Ziffers implements traversing methods that traverse the Tonnetz in different ways. These methods are:

* <ic>weitzmannRegions(tonnetz: number[])</ic>: Cycles through chords in a Weitzmann region
* <ic>boretzRegions(tonnetz: number[])</ic>: Cycles through chords in a Boretz region
* <ic>octaTowers(tonnetz: number[], repeats: number = 3, components: number = 1)</ic>: Cycles through chords using the octaTowers
* <ic>cubeDance(tonnetz: number[], repeats: number = 3)</ic>: Cycles through chords in a Cube Dance
* <ic>powerTowers(tonnetz: number[], repeats: number = 3)</ic>: Cycles through chords using the Power Towers

**Weitzmann Regions** is composed only of three-note chords. Following Richard Cohn's **Weitzmann water bug** graph, the region consists of an augmented chord (body), three major chords, and three minor chords (feet). The latter related to the central chord by a minimal parsimonious movement. A cyclic order of **Nebenverdwandt / R** transformations proposed by Carl Weitzmann himself has been chosen.

**Boretz Regions** is the four-note analogue of the Weitzmann regions. Richard Cohn draws them in **Boretz Spiders**, a graph consisting of 8 feet between 7th and half-diminished 7th chords. The body (prosoma-opisthosoma) is a <ic>dim7</ic> chord, related to the others by a semitonal movement.

**OctaTowers** generates a graph composed of **12** chords, whose types are <ic>halfdim7, m7 and 7</ic>. A reading from left to right in an ascending diagonal has been chosen. Note that changing the number of components to <ic>3</ic> will obtain the complete graph (**36** chords).

**Cube Dance** is another graph of **28** chords that is built primarily with HexaCycles (4 hexatonic cycles), except that it adds <ic>augmented</ic> triads as assemblers. As with Power Towers, one possible path has been selected.

**Power Towers** use **39** four-note chords (<ic>halfdim7, m7 and 7</ic>). As you can notice, it is composed of OctaTowers (3 octatonic towers) assembled by <ic>dim7</ic> type chords. One of the many paths for succession has been chosen.

As you have noticed, all these graphs usually have many chords, so sometimes it will be convenient to slice up fragments of the cycles. We encourage you to explore these methods and their different parameters. The tonnetz traversing methods can be used in combination with the Ziffers generative methods to sequence, arpeggiate and to randomize the chords in different ways.

${makeExample(
        "Cube Dance swing",
        `
z1("0").cubeDance([3,4,5])
  .sound("sine")
  .ad(r(0.1,0.5),0.1)
  .out()
  `,
        true,
    )}

${makeExample(
        "Selecting subset of chords from the cube dance",
        `
z1("1/2 0")
  .cubeDance([3,4,5],4)
  .at(0,8,2,rI(9,14))
  .sound("triangle")
  .ad(0.05,0.15)
  .delay(2)
  .out()
`,
        true
    )}

${makeExample(
        "Power Towers with pulse",
        `
z1("1/4 2").powerTowers([2,3,7])
  .between(5,11)
  .arpeggio("e 0 3 1 2")
  .sound("sine")
  .adsr(0.01,0.1,0.1,0.9)
  .out()
  `,
        true,
    )}

${makeExample(
        "Between an OctaTower",
        `
z1("s. 0")
    .octaTower()
    .between(2,8)
    .arpeggio(3,2,1,rI(1,5))
    .sound("sawtooth")
    .adsr(0.1,0.15,0,0.1)
    .out()
    `,
        true
    )}

${makeExample(
        "Selecting chords from the weitzmann region",
        `
z1("1/8 0")
  .weitzmannRegions()
  .at(1,rI(0,7),4,6)
  .arpeggio(0,2,1,rI(0,2))
  .sound("sine")
  .ad(0.15,0.15)
  .out()
`,
        true
    )}

${makeExample(
        "Boretz Spider",
        `
z1("1/16 0")
  .boretzRegions([1,4,7])
  .at(2,rI(3,7),4,6)
  .arpeggio(1,0,2,rI(1,4))
  .sound("square")
  .adsr(0.1,0.1,0.1,0.2)
  .out()
`,
        true
    )}

* Remark F: You can find more details about Weitzmann and Boretz regions in chapters 4 and 7 of Richard Cohn's book [Audacious Euphony: Chromatic Harmony and the Triad's Second Nature (2012)](https://books.google.com.pe/books?id=rZxZCMRiO9EC&pg=PA59&hl=es&source=gbs_toc_r&cad=2#v=onepage&q&f=false).

`;
};
