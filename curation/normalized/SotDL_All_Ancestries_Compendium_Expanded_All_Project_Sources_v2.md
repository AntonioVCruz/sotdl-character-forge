# Shadow of the Demon Lord — Ancestry Compendium

Este arquivo contém **59 entradas de publicação de ancestries**, correspondentes a **45 nomes distintos de ancestry**. Republicações, variantes e versões expandidas são mantidas como entradas separadas.

**Atualização desta versão:** foram auditados os 23 PDFs atualmente anexados ao projeto. *Faerie Friends* acrescenta uma nova ancestry jogável, **Lutin**. *Wild Beasts* já constava na auditoria acumulada e foi revalidado sem gerar nova entrada. Os outros 21 PDFs novos não apresentam uma nova ancestry formal segundo o protocolo deste arquivo. As duas erratas do projeto também não criam uma ancestry separada; ambas registram a mesma linha de imunidades omitida de **Undine** em *Freeport Companion*, preservada abaixo como nota de errata sem alterar silenciosamente o `Full Entry` original.

O texto das regras e descrições das ancestries permanece em **inglês**, sem tradução ou reconciliação silenciosa entre fontes. A organização principal é **Ancestry → Entry Type → Source**.

---

## Lógica de compilação e protocolo para adicionar novas fontes

Neste compêndio, **“raça” significa ancestry** no vocabulário de *Shadow of the Demon Lord*. A unidade básica de registro é uma opção publicada que fornece regras para criar ou converter um personagem jogador em uma ancestry jogável.

Para ampliar este arquivo com novas fontes, use as seguintes regras:

1. **Use somente o conteúdo da fonte fornecida.** Não complete texto ausente com memória, wiki, ou outra publicação. Divergências entre livros devem permanecer como versões distintas.
2. **Inclua uma entrada quando a fonte fornece regras formais de personagem para a ancestry.** Sinais fortes incluem blocos como `Creating a/an ...`, atributos iniciais, Characteristics, traits, `Level 4 ... Expert`, ou progressão própria de ancestry.
3. **Mantenha ancestry derivada ou template como entrada própria.** Se a regra manda criar primeiro uma ancestry-base e depois aplicar ajustes — como Revenant, Vampire ou Skinchanger — classifique-a como `Derived Ancestry` ou `Ancestry Template` e preserve a instrução integral.
4. **Mantenha variantes/regras expandidas separadas.** Uma versão alternativa de uma ancestry já existente — por exemplo, Clockwork em *Ghosts in Machines* ou Dwarf em *For Gold and Glory* — não substitui a versão do Core. Registre outra ocorrência com seu próprio `Source` e `Full Entry`.
5. **Powerful Ancestries continuam sendo ancestries.** Se a ancestry substitui a progressão normal de novice path em certos níveis, mantenha toda a progressão no `Full Entry`; não mova esses benefícios para o compêndio de Paths.
6. **Não inclua apenas menções de cenário.** Uma fonte dizer que humans, orcs, elves etc. vivem em uma região não cria uma nova entrada se ela apenas remete às regras de outro livro.
7. **Não converta criaturas em ancestries sem suporte textual.** Stat blocks de monstros, sistemas de criação de criaturas e criaturas geradas por spells não contam como ancestries jogáveis por si sós.
8. **Preserve o texto em inglês.** O `Full Entry` deve conservar o texto da fonte; remova somente artefatos inequívocos de extração, como watermark de comprador e duplicatas idênticas adjacentes.
9. **Paginação:** `Source Page` é a página impressa onde a apresentação da ancestry começa. `PDF Page` é a página física do arquivo PDF. Guarde ambas, porque podem diferir.
10. **Validação:** antes de adicionar uma entrada, confira começo e fim contra a próxima seção do livro e confirme que tabelas de background, age/build/appearance/personality, traits e benefícios de nível não foram truncados.

### Esquema recomendado para novas entradas

```text
Name: <canonical ancestry name>
Entry Type: <Standard Ancestry | Derived Ancestry | Ancestry Template | Ancestry Variant | Expanded Ancestry | Powerful Ancestry | ...>
Source: <book title>
Source Page: <printed page where the ancestry presentation begins>
PDF Page: <physical PDF page>
Full Entry:
<verbatim English source text for the playable ancestry entry>
```

### Casos limítrofes tratados neste arquivo

- **Half-Elves e Half-Orcs em Freeport Companion:** não entram como ancestries próprias. O texto afirma que nenhuma das duas ancestries existe em Urth a menos que o grupo queira e recomenda tratá-las, respectivamente, como humans com traços feéricos e orcs com aparência mais humana.
- **Minotaur e Void Bull em Hunger in the Void:** não entram. O capítulo contém stat blocks, mas não apresenta um bloco de criação de personagem equivalente aos de Fomor, Warg e Bugbear.
- **Promethean em False Lives:** não entra. É uma criatura criada por uma spell, não uma ancestry jogável apresentada como opção de personagem.
- **Constructs em Forgeborn & Magicmade:** não entram. A fonte fornece um sistema de construção de creatures/constructs, não uma nova ancestry de personagem.
- **Forbidden Rules:** contém regras opcionais que alteram como ancestries existentes funcionam, mas não apresenta uma nova ancestry completa; por isso não gera uma entrada principal.
- **Ghoul em Flesh of the Fallen:** entra como `Derived Ancestry` porque transforma uma ancestry-base existente; seu `Full Entry` preserva integralmente o trait `Powerful Ancestry` e a progressão de níveis 1/2/4/5/8.
- **Grave Thrall em Kingdom of Skulls:** entra como `Derived Ancestry`, pois o personagem é criado primeiro com outra ancestry elegível e depois recebe os traços de grave thrall.
- **Heir of Gog / Man of Gog em Men of Gog:** entra como `Ancestry Variant`. A fonte manda usar as regras de human, acrescenta Corruption e substitui o background pela tabela própria dos Men of Gog; o nome canônico usado neste compêndio é **Man of Gog**.
- **Arachne em Curse of the Spider Wood:** a ancestry principal é a versão high-caste apresentada em `Creating an Arachne`. A orientação para criar arachne de lower caste modificando a human ancestry permanece no `Full Entry`, mas não gera uma segunda entrada.
- **Between Two Worlds, Born to Kill, Snot and Stitches, Stolen Lives e Uncommon Courage:** suas regras de Faun, Orc, Goblin, Changeling e Halfling são mantidas como publicações separadas das versões anteriores, conforme o protocolo de variantes e expansões.
- **Ghost em Between Life and Death:** entra como `Derived Ancestry`. A fonte permite tanto criar um novo ghost a partir de uma ancestry mortal com alma quanto converter um personagem morto durante a campanha; o `Full Entry` preserva as regras próprias de ghost a partir de `Ghost Characters`.
- **Remade em Cult of the Cog God:** entra como `Derived Ancestry`. Para um personagem inicial a fonte manda usar as regras normais de clockwork; para uma transformação durante a campanha, ela fornece alterações próprias que substituem os traços da ancestry original pelos traços de clockwork.
- **Yerath em Children of the Hive:** entra como `Expanded Ancestry`, pois a fonte fornece uma criação alternativa completa para um yerath anômalo, incluindo atributos, traits, benefício de nível 4 e tabelas de desenvolvimento. As opções da seção `Yerath Paths` não são incorporadas ao `Full Entry` da ancestry, pois modificam novice paths.
- **Ogre, Lizardman e Troglodyte:** entram como `Standard Ancestry`. Embora suas fontes ressaltem que essas opções podem ser inadequadas para muitos grupos, *Ghastly Gourmands*, *Foulest Reptiles* e *Wretched and Unclean* apresentam regras explícitas para criar personagens dessas ancestries.
- **Only Human e os suplementos Victims of the Demon Lord deste projeto:** versões de Human, Hamadryad, Sylph, Ferren, Naga, Molekin e Yerath são mantidas como publicações separadas das versões anteriores. `Only Human` é tratado como `Ancestry Variant`; as demais reapresentações detalhadas entram como `Expanded Ancestry`.
- **Wild Beasts:** não gera uma ancestry. Seus benefícios de personagem pertencem à progressão do culto/novice path `Wild Beast Devotee`, não a uma regra de ancestry.
- **Faerie Friends:** gera uma nova entrada `Standard Ancestry` para **Lutin**. A seção `Lutin Paths` não entra no `Full Entry`, pois modifica novice paths; o material de ancestry termina em `Starting Equipment`.
- **Demon Lord Errata (10oct17) e Demon Lord Errata (19nov17):** não geram nova entrada de ancestry. Ambas corrigem *Freeport Companion*, informando que `Creating an Undine` omitiu a linha `Immune damage from disease and poison; diseased, poisoned`. A correção é registrada como nota junto à entrada de Undine, mantendo o texto-fonte de *Freeport Companion* intacto.
---

## Resumo

- **Entradas de publicação:** 59
- **Nomes distintos de ancestry:** 45
- **Ancestry Template:** 1
- **Ancestry Variant:** 4
- **Beastman Ancestry:** 3
- **Derived Ancestry:** 6
- **Expanded Ancestry:** 11
- **Powerful Ancestry:** 3
- **Standard Ancestry:** 31
- **Fontes com pelo menos uma entrada de ancestry:** 40
- **PDFs fornecidos verificados na compilação acumulada:** 94

### Fontes com entradas de ancestry

- **A Glorious Death** — 1 entrada(s)
- **Between Life and Death** — 1 entrada(s)
- **Between Two Worlds** — 1 entrada(s)
- **Blood Scions** — 1 entrada(s)
- **Born to Kill** — 1 entrada(s)
- **Brood of the Mother Spore** — 1 entrada(s)
- **Children of the Hive** — 1 entrada(s)
- **Children of the Restless Earth** — 1 entrada(s)
- **Cult of the Cog God** — 1 entrada(s)
- **Curse of the Spider Wood** — 1 entrada(s)
- **Demon Lord's Companion** — 2 entrada(s)
- **Demon Lord's Companion 2** — 6 entrada(s)
- **Exquisite Agony** — 1 entrada(s)
- **Faerie Friends** — 1 entrada(s)
- **Flesh of the Fallen** — 1 entrada(s)
- **For Gold and Glory** — 1 entrada(s)
- **Foulest Reptiles** — 1 entrada(s)
- **Freeport Companion** — 2 entrada(s)
- **Ghastly Gourmands** — 1 entrada(s)
- **Ghosts in Machines** — 1 entrada(s)
- **Guardians of the Cosmic Egg** — 1 entrada(s)
- **Heaven’s Sent** — 1 entrada(s)
- **Hunger in the Void** — 4 entrada(s)
- **In Plain Sight** — 1 entrada(s)
- **Kingdom of Skulls** — 1 entrada(s)
- **Men of Gog** — 1 entrada(s)
- **Only Human** — 1 entrada(s)
- **Riders of the Wind** — 1 entrada(s)
- **Scions of Nature** — 1 entrada(s)
- **Scions of the Betrayer** — 1 entrada(s)
- **Shadow of the Demon Lord Core** — 6 entrada(s)
- **Snot and Stitches** — 1 entrada(s)
- **Song of the Woad** — 1 entrada(s)
- **Stolen Lives** — 1 entrada(s)
- **Terrible Beauty** — 3 entrada(s)
- **The Great Mother’s Brood** — 1 entrada(s)
- **Tombs of the Desolation** — 3 entrada(s)
- **Tooth & Claw** — 1 entrada(s)
- **Uncommon Courage** — 1 entrada(s)
- **Wretched and Unclean** — 1 entrada(s)

### Fontes fornecidas sem nova entrada formal de ancestry

- An Accursed Trio.pdf
- Battle Scars.pdf
- Beloved of Euphobia.pdf
- Black Sun Dawn.pdf
- Bred for Battle.pdf
- Caecras.pdf
- Called to Serve.pdf
- City of Chains.pdf
- City of Decay.pdf
- Dark Passages.pdf
- Demon Lord Errata (10oct17).pdf
- Demon Lord Errata (19nov17).pdf
- Disciple of The Demon Lord.pdf
- Do We Not Die.pdf
- False Lives.pdf
- Fever Dreams.pdf
- Forbidden Rules.pdf
- Forgeborn & Magicmade.pdf
- Frayed Ends.pdf
- Heart of the Machine God.pdf
- Heirs of Eremea.pdf
- Hired Help.pdf
- In the Emperors Secret Service.pdf
- Insupposable Instruments.pdf
- Kingdom of God.pdf
- Murder by Numbers.pdf
- Natural Born Scoundrels.pdf
- Occult Philosophy.pdf
- Oddities Artifacts and Esoterica.pdf
- Of Fire and Venom.pdf
- Of Gears and Ghosts.pdf
- Paragons of Virtue.pdf
- Paths of Battle.pdf
- Paths of Conflict.pdf
- Paths of Darkness.pdf
- Paths of Horror.pdf
- Paths of Iron.pdf
- Paths of Power.pdf
- Paths of Purpose.pdf
- Paths of Science.pdf
- Power in a Name.pdf
- Pull of the Stars.pdf
- Seekers of the Sleeping God.pdf
- Slaves in Death.pdf
- Soldiers of Fortune.pdf
- The Devil's Due.pdf
- The Price of Evil.pdf
- The Scientific Method.pdf
- The Vault Opens.pdf
- Uncertain Faith.pdf
- Unhinge the Mind.pdf
- Unwelcome Guests.pdf
- Vine and Willow.pdf
- Wild Beasts.pdf
---

## Ancestries
### Arachne

- **Entry Type:** Standard Ancestry
- **Source:** Curse of the Spider Wood
- **Source Page:** 15
- **PDF Page:** 15

```text
Arachne Characters
The arachne infest the Spider Wood, living as thralls to
a powerful demon known as the Queen of Spiders. Once
human, long association with and service to this vile being
has infected these people with darkness, blackening their
souls in return for their patron’s gifts.
Arachne despise other peoples and brook no trespassers
into their lands, taking any interlopers they find as slaves,
or, depending on the whims of their Queen, hauling them
to the blood-stained altars where they are sacrificed. In a
very few cases, the hapless prisoners are brought before
the gate of the vault where the Demon Queen is bound for
direct interrogation in her continuing effort to find a way to
escape her prison.
Although this supplement provides many sample
characters, you can use the following rules in conjunction
with those found in Shadow of the Demon Lord to create
unique high-caste arachne secondary characters. If you
want to create an arachne of a lower caste, use the human
ancestry, but reduce the starting Will score to 8 and add the
shadowsight trait.
You can also use these rules to let players create arachne
characters, but as servants of a hideous demon, they do not
often leave the Spider Wood nor do they find themselves
in league with peoples who fight against the Demon Lord’s
dread influence. For this reason, the arachne ancestry
might not be suitable for all groups and their association
with more traditional character options should be an
extraordinary situation that requires some degree of
explanation to make sure they are an appropriate addition
to a new or existing group.
Fear and Loathing: Fear of the Demon Queen drives
arachne hatred for outsiders as they know that displeasing
their mistress means their doom. Along with that fear
is a subconscious shame for what they have become, an
understanding that they long ago forfeited their humanity
by willingly serving such a monstrous entity. This shame
fuels their anger and loathing of other peoples, which they
take out on trespassers and their own lower castes.
All Hail the Queen: The Demon Queen has near total
control of the arachne, making slaves of them all. From the
depths of her vault, she listens to their thoughts and sees
their dreams, guiding her priests to root out the skeptical
and disloyal. Although the priests offer no explanation for
choosing whom they choose for sacrifices, many suspect
their goddess listens to their innermost thoughts, which
leads most to bury deep their feelings until they have no
room in their hearts and minds for anything but service to
their dark mistress.
Gifts of Darkness: The first to come under the Queen
of Spiders’ sway underwent grotesque transformations as
their souls darkened from the wickedness they performed
in her name. After a couple of generations, the stain of
corruption manifested in a more uniform way. Those most
loyal to the Queen discovered they could transform into
man-size spiders.
Priests and warriors alike offered this gift as proof of
their superiority, and worthiness that explained their
higher station in arachne society. Most priests believe that
while in spider form, they stand closer to their goddess
and can better understand her desires. Warriors favor their
spider forms when hunting for the greater mobility and its
venomous fangs.
Vile Goddess: Monstrous, bloodthirsty, powerful, and
wicked beyond mortal imagining, the Queen of Spiders
does not belong to this world. She was summoned from the
Void by the trolls in their jungle realm during the Hateful
Wars with the faerie. Instead of serving the trolls, she
slaughtered untold numbers of them, all the while spilling
countless eggs of spiders of all shapes and sizes that now
infest the forest.
The few trolls remaining bound their magical powers
together and imprisoned the Demon Queen in a vault
buried beneath a colossal ziggurat of jet-black stone.
From there, she whispers into the minds of her servants,
commanding them to perform foul acts in her name that
include live sacrifices, cannibalism, and worse. Devotees
of the Queen of Spiders have access to the Death,
Demonology, and Primal traditions.
Breaking the Chains: Although the Demon Queen’s
grip on the arachne remains as tight as it has ever been,
the people utterly in her thrall, the further the arachne
travel from the Spider Wood, the weaker her hold becomes
on their hearts and minds. Those who are freed from
her poisonous influence find themselves questioning
everything they believe to the point that a few even
abandon their people altogether to find another place for
themselves in the world. They might be free from their
people, but their unusual appearance and odd manner
makes it difficult to fit into civilized lands.
Common Names: Aara, Azaz, Bilek, Daas, Dreef, Eza,
Gegren, Huis, Isthez, Nexen, Nuuzo, Seve, Suok, Titir,
Vorsh, Zeren, and Zylk.
Creating an Arachne
Starting Attribute Scores Strength 10, Agility 12, Intellect
10, Will 9
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 12, Power 0
0 Damage, 1d3 Insanity, 1d3 Corruption
Languages and Professions You speak Arachne.
Shadowsight You can see into areas obscured by shadows
as if those areas were lit.
Spider Form You can use an action, or a triggered action
on your turn, to assume the form of a large spider and
you can remain in that form until you use an action,
or a triggered action on your turn, to return to your
humanoid form. See the “Assuming Different Forms”
sidebar in Shadow, page 147.

Level 4 Arachne Expert
Characteristics Health +5
You learn one spell or gain the Spit Venom talent.
Spit Venom You can use an action to spit venom from your
mouth at a creature within short range. Make a Strength
or Agility attack roll against the target’s Agility. On a
success, the target takes 1d6 damage and becomes
poisoned for 1 minute. If the target is already poisoned, it
takes 1d6 extra damage. Once you use Spit Venom, you
must wait at least 1 minute before you can use it again.
Arachne Age
3d6 Starting Age
3 You are a child, aged 10 years or younger.
4–5 You are an adolescent, between the ages of 11 and 15.
6–8 You are a young adult, between the ages of 16 and 21.
9–12 You are an adult, between the ages of 22 and 35.
13–15 You are a middle-aged adult, between the ages of
36 and 55.
16–17 You are an older adult, aged between 56 and 75.
18 You are a venerable adult, aged 76 or older.
Arachne Build
3d6 Build
3 You are short and slight.
4–5 You are short and either slender or heavy.
6–8 You are short
9–12 You are of average height and weight.
13–15 You are tall
16–17 You are tall and either slender or heavy.
18 You are huge, tall and heavyset.
Arachne Appearance
3d6 Appearance
3 Your humanoid form shows signs of your spider
form, with you having extra eyes, sharp teeth, and
glossy skin. You appear to be a monster.
4–5 You are unpleasant to look upon.
6–8 You have strange features others find unsettling.
9–12 Neither appealing nor unattractive, you appear
perfectly ordinary.
13–15 You have a pleasing form.
16–17 You are quite attractive, appearing fully human.
18 You have an exotic beauty that makes you stand
apart from others. You turn heads wherever you go.
Arachne Personality
3d6 Personality
3 Vicious and murderous, you take great pleasure
from killing people.
4–5 You harbor dark and unspeakable thoughts. You
revel in causing misery.
6–8 You put yourself first in every situation.
9–12 You suspect the worst in everyone you meet. You
have few friends.

3d6 Personality
13–15 You have strange delusions about the world that
make you bizarre and unpredictable.
16–17 You live in fear, knowing the Queen of Spiders will
one day steal your soul.
18 You strive to be better than your people, to be a
force for good.
Arachne Beliefs
3d6 Beliefs
3 You are a mad, frothing devotee of the Queen of
Spiders and would gladly give your life for her.
4–5 You turned to the Devil to help you escape the
clutches of the Queen of Spiders.
6–8 You worship the Queen of Spiders, believing she
has your best interests in mind.
9–12 You fear the Queen of Spiders.
13–15 You believe the Queen of Spiders to be a monster.
16–17 You adopted the Old Faith.
18 You reject all gods.
Arachne Background
d20 Background
1 You were to be sacrificed to the Queen of Spiders,
but you escaped.
2 A traveler stole you from your homeland and raised
you as his or her own.
3 You were cut off from your tribe and stumbled out
of the Spider Wood.
4 You killed a lot of people. Gain 1 Corruption.
5 You went mad. Gain 1d3 Insanity.
6 You were badly injured in an attack against your folk.
7 You sacrificed a human child. Gain 1 Corruption.
8 The Queen of Spiders whispered to you. Gain 1d6
Insanity.
9 You fled your tribe in disgrace before they could
kill you.
10 You worked in your profession.
11 A sibling died trying to get you out of the
Spider Wood.
12 You befriended a human. Add the Common
Tongue to the list of languages you can speak.
13 You helped destroy a ferocious monster.
14 You raided human settlements for slaves.
15 You killed a large spider to save the life of a
loved one.
16 You performed a heroic deed.
17 You have nightmares about something you saw.
18 Your parents hid you from vengeful high priests
and then spirited you out of the land.
19 You left your people to see the world.
20 You came into some money. Start the game with
2d6 cp.
```

### Bugbear

- **Entry Type:** Beastman Ancestry
- **Source:** Hunger in the Void
- **Source Page:** 46
- **PDF Page:** 47

```text
Bugbear
Bugbears, sometimes called boogeymen, terrorize
people living on the frontiers. Like all beastmen,
bugbears feed on humans, but they especially prefer
the soft flesh of the young. They creep into towns and
villages under the cover of night to snatch children
from their beds, dragging them into the dark never to
be seen again.
Unlike most beastmen, bugbears tend to be loners.
If bugbears join others, they might team up with a
few other bugbears or serve as scouts for a larger
beastman army, but only for as long as the rampage
continues. Bugbears regard other beastmen in their
chosen territories as threats and drive them off, killing
them if necessary.
Bugbears combine the features of humans and
bears. They stand about 7 feet tall, and their muscled,
humanoid bodies weigh as much as 300 pounds.
Their bear-like heads boast pronounced snouts and
eerily human eyes. Thick fur of black, brown, or dun
covers their bestial heads and extends across their
shoulders and down their arms, backs and chests,
thickening at their groins. Most bugbears wear armor
usually scavenged from the dead.

47
What bugbears don’t eat, they either keep as
trophies or leave to rot. Most carry large sacks
containing bits and pieces of the children they’ve
eaten, and occasionally a couple of living, squirming,
and terrified victims too. Like fomors, bugbears
decorate their bodies with trophies harvested from
the bodies of their victims, such as fingers, toes, ears,
hands, and genitals.
Bugbears speak Dark Speech.
BUGBEAR DIFFICULTY 50
Size 1 beastman
Perception 12 (+2); shadowsight
Defense 15 (hard leather); Health 44
Strength 14 (+4), Agility 13 (+3), Intellect 10 (+0), Will 11 (+1)
Speed 10
Sneaky A bugbear makes Agility challenge rolls to hide or
sneak with 1 boon.
ATTACK OPTIONS
Sword (melee) +4 with 1 boon, or 2 boons against a
grabbed target (3d6 + 2 plus Grab on attack roll 20+)
Longbow (long range) +3 with 1 boon (2d6 + 1)
Grab The bugbear can attempt to grab the target without
using an action.
SPECIAL ACTIONS
Iron Grip A bugbear can use a triggered action on its turn
to grab a creature it can reach.
BUGBEAR HEADHUNTER DIFFICULTY 100
Size 1 beastman
Perception 12 (+2); shadowsight
Defense 15 (hard leather); Health 55
Strength 15 (+5), Agility 13 (+3), Intellect 10 (+0), Will 12 (+2)
Speed 10
Sneaky A bugbear makes Agility challenge rolls to hide or
sneak with 1 boon.
ATTACK OPTIONS
Battleaxe (melee) +5 with 2 boons, or 3 boons against a
grabbed target (4d6 + 2 plus Grab on attack roll 20+; a
grabbed target takes 2d6 extra damage)
Grab The bugbear can attempt to grab the target without
using an action.
SPECIAL ATTACKS
Behead The bugbear uses an action to make a melee
attack against a creature grabbed by it. On a success, the
attack deals 2d6 extra damage. If the creature becomes
incapacitated by the damage, the bugbear chops off its
head, killing it instantly.
SPECIAL ACTIONS
Iron Grip A bugbear can use a triggered action on its turn
to grab a creature it can reach.
The most dangerous bugbears are the headhunters,
warriors that lop off the heads of their victims, tying
them to their belts by their hair. Headhunters often
work with beastmen armies, offering their services in
exchange for the choicest slaves.
Creating a Bugbear
Unique bugbear characters have the
following statistics.
Starting Attribute Scores
Strength 1d3 + 12, Agility 1d3 + 11,
Intellect 1d3 + 8, Will 1d3 + 8
Perception equals its Intellect score + 2
Defense equals its Agility score
Health equals its Strength score + 10
Healing Rate equals one-quarter its Health
Size 1, Speed 10, Power 0
0 Damage, 1d3 Insanity, 1d3 Corruption
Languages and Professions Wargs speak
Dark Speech
Quick Grab When the total of the bugbear’s
attack roll for an attack with a melee
weapon is 20 or higher and beats the
target number by at least 5, the bugbear
can attempt to grab the target without
using an action if it has a hand free.
Sneaky The bugbear makes Agility
challenge rolls to hide or sneak with
1 boon.
Level 4 Bugbear Expert
Characteristics Health +7
Iron Grip The bugbear can use a triggered
action on its turn to grab a creature it
can reach.

48
```

### Cambion

- **Entry Type:** Standard Ancestry
- **Source:** Exquisite Agony
- **Source Page:** 41
- **PDF Page:** 42

```text
Cambion
Devils use any trick they can to tempt mortals and
lure them to their doom. Some offer wealth, others
power, and still others carnal pleasures. In this last
case, such revelations rarely result in issue, but when
they do—and only with humans—the offspring is
always a cambion, a dark creation of Hell loosed into
the mortal world to spread darkness wherever it goes.
Infernal Heritage: Most cambions look human,
almost identical to their mortal parent, but all bear
some sign that sets them apart from others. This
mark reveals that their souls belong to Hell. The sign
manifests at different times, with some cambions
carrying it from birth and others discovering it
in adulthood. It can be subtle, such as a string of
numbers on the scalp, or obvious, such as horns
breaking from the brow. Cambions have the same
range of height and weight that humans do.
Slave to Darkness: All cambions feel the stirrings
of evil in their hearts, impulses to commit vile acts for
no reason. Many find the urges too strong to refuse
and eventually become heartless monsters, reveling
in the horror they create. A few, however, hold their
impulses at bay and might channel the darkness to
fight against Hell and its interests.
Telltale Signs: A devil who births a cambion might
leave the child for human parents to raise and better
prepare them for the work ahead. It is obvious to
anyone tending to such a child that something is
wrong. The baby might not breathe when it sleeps,
weigh three or four times what it should, or cause
unusual phenomena, such as the manifestation of
cold spots, noisome odors, and weird knocking noises
in the walls. Few foster parents have the courage to
help the darkling child; many give them up, cast them
out, or worse.
Hellbound: The darkness into which all cambions
are born damns them to Hell, since methods of
cleansing souls outside of the infernal realm are
dangerous and unreliable. Cambions soon realize
that no matter what they do in the mortal world,
they will one day face the horrors of the afterlife,
so many give up any pretense of trying to do good
and instead embrace their evil natures in the hopes of
earning a place among the greater devils. Even though
they eventually realize what lies in store for them, a few
cambions also understand they might shorten their time
in Hell and perhaps one day find a better life.
Common Names: Cambions use human names.

42
Creating a Cambion
Attribute Scores Strength 10, Agility 10, Intellect 11, Will 9
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1/2 or 1, Speed 10, Power 0
0 Damage, 0 Insanity, 2 Corruption
Languages and Professions You speak the Common
Tongue.
Immune damage from disease and poison; diseased,
poisoned
Darksight You can see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Child of Hell You gain Fire Resistance.
Mark of Darkness You start with one mark of darkness.
Revel in Darkness For 1 minute after you gain Corruption,
you make attack rolls and challenge rolls with 1 boon.
Iron Vulnerability You are impaired while in contact
with iron.
Level 4 Expert Cambion
Characteristics Health +5
You learn one spell or gain Bestow Corruption.
Bestow Corruption When a target creature other than you
that you can see within short range would make an attack
roll or challenge roll, you can use a triggered action to
grant that target 1d3 boons on the triggering roll. If the
target accepts, it gains 1 Corruption.
Cambion Age
3d6 Age
3 You are a child, no more than 11 years old.
4–6 You are an adolescent, 12 to 17 years old.
7–12 You’re an adult, 18 to 35 years old.
13–15 You’re a middle-aged adult, 36 to 55 years old.
Gain 1 Corruption.
16–17 You’re an older adult, 56 to 75 years old. Gain
2 Corruption.
18 You’re pretty old, aged 76 or older. Gain
3 Corruption.
Cambion Build
3d6 Build
3 You are short and skinny.
4–5 You are shorter than average.
6–8 You are slender, skinny, or wiry.
9–12 Your height and weight fall in the middle of
the expected range for cambions.
13–15 Slabs of muscle or fat cover your body.
16–17 You stand a head taller than other cambions.
18 You are a hulking monster, thickly built and
incredibly tall.
Cambion Appearance
3d6 Appearance
3 You have coarse skin, large horns, fangs, and a
long tail emerging from the base of your spine.
4–5 You have bright, shining eyes and a mouth filled
with dagger-like teeth. Your skin tone is unusual.
6–8 An exaggerated facial or body feature makes
you ugly.
9–12 You appear human, though you have slightly
pointed ears.
13–15 You appear fully human, with striking features
and a dangerous air, but the shadow you cast
always appears monstrous.
16–17 You look like an attractive human.
18 You turn heads wherever you go, such is
your beauty.
Cambion Uprbringing
3d6 Sire
3 You were raised in Hell, brought up among the
devils, until you slipped free to make your way
in the world.
4–5 You were abandoned as a child and raised in a
temple or an orphanage. The experience was
likely scarring.
6–8 Your parents sensed or saw the evil in you and
tried to kill you. You survived and they didn’t.
9–12 You were raised by a human family. They
suspected something strange about you but
raised you, despite their reservations.
13–15 Your mother was seduced by a devil, and you are
the product of that union. She was driven from
your community and raised you in the wilderness.
16–17 Your father was seduced by a devil, who returned
you to him to raise as he saw fit.
18 You were raised in secret, hidden in a secret
room, lest the truth of your nature be revealed.
Cambion Personality
3d6 Personality
3 You are cold and dispassionate when dealing
with other people. Lacking empathy, you think
nothing of causing pain and misery.
4–5 You strive to live up to your infernal heritage,
working hard to lead others to corruption and
eventual destruction. No act goes too far for
you, and no evil is too great.
6–8 You look after yourself first. You rarely act
unless it benefits you.
9–12 You have a malicious streak and take pleasure
when others around you suffer.
13–15 You are guarded around others, reluctant to
form relationships.
16–17 You hate your nature and fight against your dark
impulses. You’re not sure if you will ever be free
from your heritage, but you aim to do so.
18 You despise devils and, possibly, faeries.
You swore to fight them and use their gifts
against them.

43
Cambion Background
d20 Background
1 You joined the cult of the New God, hoping to
purge your corruption or to destroy the cult
from within.
2 You discovered a foul incantation that required
a human sacrifice. You performed it. Start with
1 Corruption.
3 You murdered someone in cold blood. You
fled the scene, and ever since, you’ve been
looking over your shoulder for the retribution
you’re sure will come.
4 Bad things happen when you stay in one place
too long. You have trouble settling down.
5 You grew up in comfort and wealth, passing
your days in idle pursuits.
6 A witch hunter once captured you and tried
to burn you at the stake. You survived the
conflagration.
7 You spent years in a cell, living off the rats that
nibbled at your fingers and toes. You escaped
when someone left the door open.
8 Your infatuation with a mortal turned to hatred
after he or she spurned your advances.
9 You lived in a remote frontier community for
several years, keeping your nature a secret
from the locals.
10 You grew up believing yourself to be human
and only recently learned the truth.
11 During your travels, you befriended a hag and
helped her for a time.
12 For a few months, you enjoyed the company
of several cultists who believed you would
show them the way to salvation.
13 A perverse wizard stole you and kept you as
a prize.
14 A foolish child summoned you with an incantation.
The summoning ended poorly for the child.
15 You received a formal education. You can read
and write one language you know how to speak.
16 A lie you once told wound up getting someone
close to you killed.
17 You lost a few years to the bottle or a drug,
having only recently returned to sobriety.
18 You believe the Devil came to you in a dream,
and you have pledged your life to serving him.
19 You seduced a young elf and had a torrid
relationship that eventually ended when you
or your partner grew bored.
20 You stole a bag of coins. Start with an extra
2d6 cp.
```

### Centaur

- **Entry Type:** Powerful Ancestry
- **Source:** Riders of the Wind
- **Source Page:** 2
- **PDF Page:** 2

```text
Centaur
The nomadic centaurs have roamed the Endless
Steppe for over a thousand years, following the herds
of bison they raise for meat, clothing, and other goods.
They travel the Steppe extensively, moving as the
seasons change. Few centaurs leave their tribes; they
all feel an obligation to protect their kin and preserve
their way of life.
Hybrid Forms: Centaurs combine the forms of
humans and horses, such that a human upper body
replaces the neck and head of the horse. They tend
to be strongly built with prodigious body hair. They
have a wide range of coloration, both in skin and in
coats covering their lower bodies, though members of
the same tribes tend to fall within a particular range.
Centaurs feel no shame for nakedness and see little
point in garbing themselves in coverings. In times of
war, they protect themselves with hardened leather
armor and barding made from bison hides.
Wild and Free: Recognizing no borders, centaurs
go wherever they please and regard everyone in their
tribe as equals. They prize freedom as the highest
ideal, and outsiders tend to see their promises as
being worthless since centaurs cannot be bound by
oaths. Being free spirits does not absolve centaurs of
their obligations to their tribes, however. The health
and security of a tribe always take precedence over the
individual centaur’s desires, and thus centaurs curtail
their wildness whenever it would come into conflict
with their people’s needs.
Spirits Everywhere: In the clouds scudding across
the dome of the world, in the sighing wind that stirs
the grasses, in the rich earth underfoot, and in the
waves crashing against the western shores exist the
gods of the centaurs. The sense that the mortal world
is alive with the divine contributes to their belief
that the Endless Steppe is sacred ground and must
be protected from outsiders and nonbelievers. In
the minds of the centaurs, the world itself is divine
and the wind, rain, grass, earth, water, and more are
their gods. The few outsiders to explore the Steppe
report hearing odd voices and other unexplained
phenomena, leading many to believe that genies or
spirits of some kind haunt the lands.
Words of Wind: The centaurs speak Centauri,
a flowing, breezy language others find difficult to
master. Centauri has no written form. Linguistics
scholars note it has much in common with the
language of sylphs.
Common Names: Aezee, Epheral, Feela, Hithren,
Iyeotha, Leeth, Luua, Ossah, Saan, Seese, and Uruul.
Creating a Centaur
Attribute Scores Strength 12, Agility 11, Intellect 8, Will 11
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 2, Speed 12, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak Centauri and rather
than start with two professions, choose two of the
following options: speak the Common Tongue, Gatherer,
Guide, Hunter, Nomad, Rustler, or Tracker.
Equine Body Due to the nature of your form, you cannot
ride other creatures. As well, you cannot ascend or
descend sheer, vertical surfaces by climbing. For the
purposes of talents related to mounted combat, you
count as if you were mounted, and effects that apply to
the rider and the mount apply to you.
Natural Weapons You can attack with your hooves. They
count as basic weapons that deal 1d6 damage.
Gallop You can use an action to move up to three times
your Speed.
Powerful Ancestry When your group attains level 1, you
do not choose a novice path. Instead, whenever the
Advancement table in Shadow indicates you would gain
benefits from a novice path, you gain the benefits from
your ancestry for that level.
Starting Equipment You do not roll to determine your
wealth. Instead, you gain the items described in the
bulleted text below, making choices as directed.
• You have a spear or club
• You have a small shield or a bow with 12 arrows
• You have a backpack, tinderbox, 1d3 torches, a week
of rations, and a waterskin
Level 1 Centaur Novice
Attribute Scores Increase two by 1.
Characteristics Health +5, Perception +1, Speed +2
Nimble Recovery You can use an action on your turn to
heal damage equal to your healing rate and move up to
half your Speed without triggering free attacks. Once
you use this talent, you cannot use it again until after you
complete a rest.
Level 2 Centaur Novice
Characteristics Health +5, Perception +1
Trample You can use an action to move up to your Speed
in a straight line. If you enter the space of another
creature, that creature must get a success on an Agility
challenge or take 1d6 damage and fall prone.
Gain one of the following benefits:
Magic Increase your Power by 1, discover a tradition, and
learn a spell from that tradition.
Weapon Training When you attack with a weapon,
you make the attack roll with 1 boon.
Level 4 Centaur Expert
Characteristics Health +5, Speed +2
Gain one of the following benefits:
Magic Either discover a tradition or learn a spell from a
tradition you have already discovered.
Strike and Kick You can use an action to make an attack
with a weapon you are wielding and an attack with your
hooves. You make each attack roll with 1 bane.
Level 5 Centaur Expert
Characteristics Health +5
Critical Move When the total of your attack roll is 20 or
higher and exceeds the target number by at least 5, the
attack deals 1d3 extra damage, and you can move up to
half your Speed without triggering free attacks.
Gain one of the following benefits:
Magic Increase your Power by 1 and either discover a
tradition or learn a spell from a tradition you have
already discovered.
Combat Prowess Your attacks with weapons deal 1d6 extra
damage.

Level 8 Centaur Master
Characteristics Health +5
Powerful Hooves Attacks you make with your hooves deal
1d6 extra damage.
Gain one of the following benefits:
Magic Either discover a tradition or learn a spell from a
tradition you have already discovered.
Combat Expertise When you use an action to attack with
a weapon, you either deal 1d6 extra damage with that
weapon or make another attack against a different
target at any point before the end of your turn.
Age
3d6 Age
3 You are a child, no more than 11 years old. Reduce
your height and weight by 50%.
4–5 You are an adolescent, from 12 to 17 years old.
Reduce your height and weight by 25%.
6–8 You are a young adult, from 18 to 25 years old.
9–12 You are an adult, from 26 to 35 years old.
13–15 You are a middle-aged adult, from 36 to 55 years
old.
16–17 You are an older adult, from 56 to 75 years old.
18 You are a venerable adult, 76 years old or older.
Coat Color
3d6 Color
3 Brindle—You have any color skin and hair marked
with stripes.
4–5 Black—You have black skin with black hair.
6–7 Buckskin—You have tan skin with yellow, cream,
or gold hair and black mane, tail, and legs.
8–9 Bay—You have brown skin with brown, red, or
bright red hair with black or dark brown tail and
lower legs
10–12 Chestnut—You have tan or brown skin with brown
or red-brown hair
13–14 Gray—You have black skin with white or white and
black hairs.
16–17 Pinto—You are any color skin with multi-colored
hair with brown, white, or black patches.
18 White—You have pink skin with white hair.
Build
3d6 Build
3–4 You stand about 7 feet tall and weigh about 1,000
pounds.
5–7 You stand about 7-1/2 feet tall and weigh about
1,200 pounds.
8–13 You are about average for a centaur, standing
around 8 feet tall from hooves to head and weigh
about 1,300 pounds.
14–16 You stand about 9 feet tall and weigh as much as
1,400 pounds.
17–18 You stand about 10 feet tall and weigh 2,250
pounds.
Origins
d20 Origins
1 You were cast out of your tribe for a crime you
committed against your people.
2 A disease laid your people low. You set out to find
a cure, but you did not return in time. You are the
sole survivor of your tribe.
3 Your tribe’s shaman spoke of dark times ahead.
You and several others were sent into the Empire
to join the struggle against the shadow.
4 Your people betrayed you, so you left in anger,
vowing never to return.
5 You challenged your tribal leader and lost. You
left in disgrace.
6 Human raiders crossed the mountains and into
your lands, slaying many of your kind. You have
set out to bring them to justice.
7 You saw a dragon overhead and followed it to see
where it went. You became lost in the mountains.
8 After enemies slaughtered your spouse and
children, you set out to exact vengeance.
9 You witnessed great magic and set out to learn
more.
10 You led an uninteresting life and left to find your
purpose in the world beyond the Steppe.
11 The spirits spoke to you and sent you from the
Steppe to recover a relic of great power.
12 Horrible monsters annihilated your people and
you left to seek vengeance.
13 You stumbled into a faerie borderland and
emerged somewhere in the Empire.
14 You befriended a human and ventured across
the mountains to learn more of your people’s
ancestral enemies. Add the Common Tongue to
the list of languages you know.
15 An envoy from the salamander people came to
your tribe requesting aid. You volunteered to help
them.
16 Wanderlust drew you from the Steppe to see
what lies beyond the mountains.
17 You were part of a patrol sent to watch for human
invaders, but your unit was wiped out and you
were taken prisoner.
18 Monsters wiped out your people’s livestock. You
left your tribe before you starved.
19 You scout human lands to learn about the lands
beyond the mountains so your people can invade.
20 You set out to find your destiny in the wider
world.
Personality
3d6 Personality
3 You are nervous, preferring to flee adversity
rather than confront it.
4–5 You are erratic and changeable; your moods
swing from one extreme to another with almost
no warning.
6–8 Aggressiveness rules your personality, and you
never back down from a conflict.
9–12 You are wild and fierce, but you curb your
aggressive impulses when they would put your
friends and family in danger.
13–15 You are courageous, eager to take risks.
16–17 You are bold, charismatic, and others are drawn
to you.
18 You are calm, restrained, and patient.
```

### Changeling — Stolen Lives

- **Entry Type:** Ancestry Variant
- **Source:** Stolen Lives
- **Source Page:** 5
- **PDF Page:** 5

```text
Changeling
Characters
Everything you need to make a changeling character
can be found in Shadow of the Demon Lord. The rules
in that book help you create a character quickly,
along with enough information to help you visualize
and portray the character in the game. The variant
method presented here enables you to create a
character with even more detail and variation.
Creating a Changeling (Variant)
Choose an Attribute Scores option
Random Attribute Scores Strength 7 + 1d3, Agility 8 + 1d3,
Intellect 8 + 1d3, Will 8 + 1d3
Standard Attribute Scores Strength 9, Agility 10,
Intellect 10, Will 10.
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
Languages and Professions You speak the Common
Tongue. You might gain additional languages and
professions from the Changeling Development tables.
Immune damage from disease; charmed, diseased
Iron Vulnerability You are impaired while in contact
with iron.
Shadowsight You see into areas obscured by shadows
as if those areas were lit.
Steal Identity You can use an action to alter your
appearance to match that of a living creature you
can see within short range. The target must be Size
1/2 or 1 and have a humanoid shape of flesh and blood.
Your body transforms to look like the target, but nothing
you wear or carry changes. The effect lasts until you use
this talent again. If you become incapacitated or touch
an object made from iron, you immediately revert to
your natural form.
Level 4 Changeling Expert
Characteristics Health +4
You learn one spell from a tradition you have already
discovered or gain one of the following talents.
Doppelganger’s Advantage On your turn, you can use
a triggered action to use your Steal Identity talent.
Whenever you use the Steal Identity talent, you make
attack rolls against the target creature with 1 boon for
as long as you have the target’s appearance.
Impersonation Mastery You discover the Telepathy
tradition or learn one Telepathy spell (see Demon Lord’s
Companion). In addition, if you become incapacitated
while under the effects of the Steal Identity talent, you
do not return to your natural form unless you choose to.
You do, however, revert to your natural form if you die.
Changeling
Development Tables
You can use the tables presented here to create a
character with a detailed background. If you use these
tables, do not roll for random starting professions or
starting wealth as normal, as you will use the ones
here instead. You must roll dice for each table and
take the result from your rolls.
Reasons for Creation
The faeries create changelings to cover the
disappearance of a mortal child, most often when
blame for the disappearance would fall upon the
faeries.
Reason for Creation
d20 Reason
1–2 A faerie lord or lady desired an heir and sent
forth faeries to steal away the infant.
3–4 The faeries took the mortal child in response
to an offense, real or imagined.
5–6 A relative or member of the foster family made
a pact with the faeries and offered up the infant
as payment.
7–8 A band of faeries lured the mortal child into
the woods where they played with him or her
to death.
9–10 The faeries took the child to pay the Hell tithe.
11–12 The faeries rescued the child from a dangerous
situation.
13–14 The mortal child followed a faerie into a hidden
kingdom.
15–16 A hag stole the mortal child and sacrificed it to
dark powers.
17–18 The faeries stole a child from one family and
gave it to a barren couple the faeries had
befriended.
19–20 Faeries simply stole the child on a whim.
Foster Family
Children most at risk of being abducted by the faeries
are those living in or near the borderlands, places
where travelers can pass from the mortal world and
into a hidden kingdom and back again. Borderlands
exist far from civilization, where the stink of iron,
smoke, and too many people keep faeries away.
Thus it is from the lonely farms and the tiny villages
huddled in the shadows of sylvan woods, and the
hamlets of people struggling to scratch lives for
themselves on the rocky slopes of forlorn hills
where mortal children go missing.
Family Details
You can use the following tables to learn more about
the family that raised you.
Foster Parents Status
2d3 Parental Status
2 Both parents are dead.
3 One parent is dead, even chance for mother
or father.
4–5 Both parents are alive.
6 You do not know the fate of your foster parents.
*Use the Circumstances of Death table to determine the
cause of death.

Home Community
The following table tells you where your foster
family lived.
Home Community
d6 Community
1 Large town in the countryside or along a river. Add 3
to your roll on the Primary Occupation table.
2 Small town at the center of farmland. Add 1 to your
roll on the Primary Occupation table.
3 Small farm in the middle of nowhere. Subtract 3 from
your roll on the Primary Occupation table.
4 Tiny, remote farming community. Subtract 1 from your
roll on the Primary Occupation table.
5 A little house in the middle of a forest. Subtract 1 from
your roll on the Primary Occupation table.
6 A nomadic people moving through wild places.
Subtract 3 from your roll on the Primary Occupation
table.
Family Profession
This table tells you the main means of income for
your family. Results direct you to roll again on the
Profession tables, found below. Do not add the listed
extra equipment for professions from this roll.
Family Profession
d6 Profession Tables
1 or less Roll on the Wilderness Professions table and
subtract 3 from your roll on the Family Wealth
table.
2 Roll on the Criminal Professions table and
subtract 1 from your roll on the Family
Wealth table.
3 Roll on the Common Professions table.
4 Roll on the Military Professions table.
5 Roll on the Religious Professions table.
6 or more Roll on the Scholar Professions table.
Family Wealth
The Family Wealth table tells you the family’s
financial situation. The result of your roll might
modify your Childhood roll.
Family Wealth
3d6 Family Wealth
3 or less Destitute. Subtract 6 from your Childhood roll.
4–5 Poor. Subtract 3 from your Childhood roll.
6–8 Discovered. Your foster parents discovered
your true nature and cast you out from your
home. Subtract 6 from your Childhood roll.
9–12 Getting By.
13–15 Comfortable. Add 1 to your Childhood roll.
16–17 Wealthy. Add 3 to your Childhood roll.
18 Rich. Add 6 to your Childhood roll.
Foster Siblings*
3d6 Siblings
3 You have a twin.
4–5 You have 2 siblings
6–8 You have 1 sibling
9–12 You have 1d3 siblings
13–15 You have 1d3 + 1 siblings
16–17 You have 1d6 + 2 siblings
18 You have 2d6 + 2 siblings
*For each, roll on the Gender, Age, and Fate table.
Gender
d6 Gender
1–3 Female
4–6 Male
Age
d6 Age
1–3 Older
4–6 Younger
Fate
3d6 Fate
3 Insane
4–5 Unknown
6–8 Dead*
9–12 Alive**
13–15 Alive but disgraced**
16–17 Alive and well-regarded**
18 Alive and famous**
*Use the Circumstances of Death table to determine the
cause of death
**You can use some or all of the other tables to add detail to
your siblings.
Circumstances of Death
3d6 Circumstance
3 Murder
4–5 Accident unrelated to profession
6–8 Disease or famine
9–12 Natural causes
13–15 War
16–17 Accident related to profession
18 Suicide

Background Tables
The background tables determine what happened
in your past. The Childhood table tells you generally
about your upbringing. The Life Experience table
tells you, broadly, what happened to you so far.
Starting Age
3d6 Age
3 You start the game as a child, no more than
8 years old. You are Size 1/2 and halve your
height and weight. Roll on the Childhood table.
4–5 You start the game as an adolescent, from 9 to
14 years old. Reduce your height and weight by
25%. Roll once on the Childhood table and once
on the Life Experience table.
6–8 You start the game as a young adult, from 15 to
25 years old. Roll once on the Childhood table
and twice on the Life Experience table.
9–12 You start the game as an adult, from 26 to 40
years old. Roll once on the Childhood table and
three times on the Life Experience table.
13–15 You start the game as a middle-aged adult,
from 41 to 60 years old. Roll once on the
Childhood table and four times on the Life
Experience table.
16–17 You start the game as an older adult, from 60 to
80 years old. Roll once on the Childhood table
and five times on the Life Experience table.
18 You start the game as a venerable adult, 81
years old or older. Roll once on the Childhood
table and six times on the Life Experience table.
Childhood
3d6 Childhood
3 or less A disaster took everything from your
family. Add a random common, criminal,
or wilderness profession to your list
of professions. Subtract 3 from your
Starting Lifestyle roll.
4–5 You ran away from home and learned
to make your own way in the world.
Add a random common, criminal, or
wilderness profession to your list of
professions. Subtract 1 from your
Starting Lifestyle roll.
6–8 You worked in the family business.
Add your foster family’s profession
to your list of professions.
9–12 You discovered your true nature.
Roll on the Childhood Discovery and
Consequences tables to determine
what happened to you.
13–15 You were apprenticed to an artisan.
Add artisan (any one) to your list of
professions.
16–17 You received an education. You can
read and write the Common Tongue.
18 or more You received a good education.
You can read and write the Common
tongue and can speak, read, and write
High Archaic. Add Scholar (random area
of scholarship) to your list of professions.
Life Experience*
3d6 Experience
3 You Died! Roll on the Circumstances of
Death table to find out how. You can either
start over or be returned to life by some
stroke of luck. If you return to life, you start
the game with 1d6 Insanity.
4–5 Roll a d20 and find the result on the
Major Setback table.
6–8 Roll a d20 and find the result on the
Minor Setback table.
9–10 Discovered! Your true nature was revealed
after coming into contact with iron, being
incapacitated, or from something else. Roll on
the Apparent Ancestry to determine your new
appearance.
9–12 Mundane Experience. You survived, likely by
working in one of your professions. If you have
a profession, add 1 to your Starting Lifestyle
roll. If you don’t have a profession, add a
random profession.
13–15 Roll a d20 and find the result on the
Minor Windfall table.
16–17 Roll a d20 and find the result on the
Major Windfall table.
18 Roll a d20 and find the result on the
Strange Event table.
*Roll on this table only if directed by the Starting Age table.

Childhood Discovery*
d6 Event
1 You touched a piece of iron.
2 You learned the truth from a faerie.
3 You accidently assumed the form of
someone you loved or hated.
4 You were incapacitated by accident or
violence.
5 You grew suspicious about your keen
eyesight and your inability to grow sick,
so you consulted with a witch who revealed
to you the truth.
6 Your parents suspected the truth by your
unusual behavior, quirk, or appearance, and
they eventually revealed the truth to you.
*Only roll on this table if directed by your Childhood roll
and then roll on the Consequences of Discovery table.
Consequences of Discovery*
d6 Consequences
1 You were almost killed but escaped by
running away. Gain the Exile profession.
2 You were dragged into a borderland in a
failed attempt to trade you back for their
child. You were then raised in your home,
barely tolerated. Add Servant to your list
of professions.
3 You were driven from your home. Add Exile
to your list of professions.
4 You were locked in a room for many years
until you escaped. Add Slave to your list of
professions.
5 You were loved and cared for anyway. Add
your foster family’s profession to your list
of professions.
6 You ran away, knowing your old life was
over. Add a random criminal or wilderness
profession to your list of professions
*Roll on this table only if you rolled on the Childhood
Discovery table. After, you can roll on the Apparent
Ancestry table (see page 14) to determine your new
appearance from using your Stolen Identity talent.
Ignorance Is Bliss
The tables make it possible, albeit unlikely,
for you to have lived without ever learning
about your true nature. If this happens, start
the game with an extra random profession,
but you cannot use the Steal Identity talent
until you learn the truth about yourself, by
touching iron or becoming incapacitated.
Major Setback
d20 Major Setback
1 You murdered a person whose identity you stole so
you could become that person. Gain 1d3 Corruption.
2 A hag made of you a prisoner and forced you to
commit horrible acts on her behalf. Gain 1 Corruption.
3 Raiders, monsters, or a natural disaster destroyed
your adopted community, and you were the sole
survivor. You lived as a refugee for a time until you
finally settled elsewhere. Subtract 1 from your Starting
Lifestyle roll.
4 You were captured by faeries and dragged into a
hidden kingdom where you became a slave to a lord
or lady. You suffered terribly; add slave to your list
of professions. You managed to escape, wearing the
appearance of a faun.
5 You made poor business decisions. Subtract 3 from
your Starting Lifestyle roll.
6 You adopted a form specifically to destroy a rival. Roll
on the Apparent Ancestry table to determine your new
form. Gain 1 Corruption.
7 You spent 2d6 years in prison for a crime you
committed (gain 1 Corruption) or you didn’t commit
(gain 1d3 Insanity). Add the years spent to your
starting age.
8 You lost everything to a natural disaster or war.
Subtract 3 from your Starting Lifestyle roll.
9 The magic that made you has started to fail. Whenever
you come into contact with iron, you lose your Steal
Identity talent for 1 minute. The effect of this setback
is cumulative.
10 A foul creature laid a terrible curse on you making it
harder to live your life. Subtract 1 from your Starting
Lifestyle roll. If you have Demon Lord’s Companion,
you can add the Cursed story complication.
11 You were badly maimed. If you have Demon
Lord’s Companion, you can add the Maimed story
complication. If you’re using Battle Scars, you begin
the game with a scar.
12 You were press-ganged. You might have fought as
a peasant conscript, pulled an oar on a jotun longship,
or been forced to work as a sailor on a pirate ship.
Add soldier, sailor, or pirate to your list of professions.
13 Your community drove you out, and you lived as an
exile for 2d6 years. Add exile, hermit, or refugee to
your list of professions.
14 A devil found and used you terribly to corrupt a
mortal. Gain 1d3 Insanity or 1 Corruption.
15 You led monsters, beastmen, or something else to your
community to destroy the people who treated you so
poorly. Gain 1 Corruption.
16 The magic that gives you life is driving you insane.
Start the game with 1d6 + 1 Insanity and, if you have
the Demon Lord’s Companion, you can add the Mad
story complication. Alternatively, if you are using
Unhinge the Mind, you can begin with a long-term
madness.
17 A witch hunter or inquisitor exposed you for what you
are. You escaped capture, but you can never
go home. Subtract 1 from your Starting Lifestyle roll.
18 The spirit of someone you killed after adopting
their form haunts you, making strange noises and
whispering terrible things in your ear. If you have
the Demon Lord’s Companion, you can add the
Haunted story complication.
19 You desecrated a holy site by intent or accident.
Choose a religion to which the site was holy. You
always feel uncomfortable around places and symbols
associated with that faith.
20 You earned the enmity of a witch hunter. This
character hunts you and will kill you if he or she ever
finds you. The GM makes all decisions about this foe.

Minor Setback
d20 Minor Setback
1 You saw faeries whisk a child away from a family.
You stole the changeling in the hopes of raising it
as your own, but the magic failed, and the
changeling dissolved into rubbish.
2 You came to love the life afforded to you by your
present form, but a misstep stripped it from you,
thus ending that life. Gain 1 Insanity and roll on
the Apparent Ancestry table to determine your
new appearance.
3 Someone in your community suspects you are
a changeling, despite your efforts to keep the
truth secret.
4 You suffered financial trouble. Subtract 1 from your
Starting Lifestyle roll.
5 A romance ended badly after you revealed the truth
about yourself or had that truth revealed. You still
pine for the person.
6 Your true nature was revealed to the people in your
community. They exiled you, and you have grown
to hate them as a result. You might even plot to
destroy them.
7 You saw a changeling torn apart by an angry mob.
Gain 1 Insanity.
8 A friendship ended when he or she learned the truth
about you or had that truth revealed. This person
regards you as an enemy. Work with your GM to
determine the enemy’s identity.
9 Locals, after discovering the truth about you, beat
you into unconsciousness, dragged your body into
the wilderness, and left you there to die. Roll on
the Apparent Ancestry table to determine your
new form.
10 You lost something valuable. Subtract 1 from your
Starting Lifestyle roll.
11 You fell in with bad people, using your talents to
aid them in their criminal pursuits.
12 You used your magical talent to advance your
position in the community, harming someone in
the process. Gain 1 Corruption.
13 A friendship ended either because your friend
feared what you were or resented you for not
confiding your secret in him or her.
14 You learned a dangerous secret while wearing your
present form. The secret was dangerous enough
that you adopted a different form (roll on the
Apparent Ancestry table). The GM should tell you
what you learned.
15 You have no memory of what happened for 1d6
years of your life.
16 Your actions or inaction led to someone close to you
being harmed.
17 You found you could no longer hide the truth about
yourself in your community, so you left to seek your
fortune elsewhere.
18 A plague wiped out your community, leaving you
the sole survivor.
19 Beastmen raided your community, causing
extensive damage. Subtract 1 from your
Starting Lifestyle roll.
20 Your magical nature prevented you from ever fitting
in with other humans, and you have become bitter
and cynical as a result.
Minor Windfall
d20 Minor Windfall
1 You fell in love or got married! Your love interest is
not aware of your true nature. Work with your GM
to create this character.
2 You started a business related to your profession.
Add 1 to your Starting Lifestyle roll or add a random
profession to your list of professions if you do not
yet have a profession.
3 You stole someone’s identity and gained a few of
his or her memories. Roll on the Apparent Ancestry
table to determine your new appearance.
4 You traveled extensively. Add one language to the
list of languages you can speak.
5 You worked as an informant for the Inquisition.
Add Informant to your list of professions and gain
a connection to an inquisitor. The GM makes all
decisions about this character.
6 You received an education or furthered your
education. Choose one: Add a language to the list
of languages you can speak or gain a random area
of scholarship.
7 You inherited money from a relative or friend.
Add 1 to your Starting Lifestyle roll.
8 You stole the identity of someone famous, rich, or
otherwise important. Roll on the Apparent Ancestry
table to determine the new form.
9 You took up a new field of work. Add one random
Common Profession to your list of professions.
10 You gain an additional Interesting Thing.
11 Your unusual talents helped you infiltrate a
dangerous organization and expose its wicked plot.
You make attack rolls in social situations against
members of your community with 1 boon.
12 You performed a great service for your community,
and you are considered a hero. You never have to
pay for food or drink while you’re there.
13 You found a healing potion.
14 You managed to escape what should have been
certain death. Start the game with Fortune.
15 You have a weapon or an implement of the
GM’s choice.
16 You have a suit of soft leather armor.
17 You made a lifelong friend (as commoner) who will
accompany you on your adventures and help you.
18 A witch, druid, or hermit took you in for a time and
taught you the secrets of herbalism. Add one of
the following professions to your list of professions:
apothecary, healer, or scholar of natural science.
19 You helped broker peace between a rural
community and an angry faerie. Add Elvish
to the list of languages you can speak.
20 You saved someone’s life, and this person is
forever in your debt. This character is friendly to
you and will always help you. Work with your GM
to determine the identity of this character and the
circumstances of your help.

Major Windfall
d20 Major Windfall
1 The faerie who made you found and befriended
you. The faerie gave you a shell, telling you if you
were ever in need, to speak into the shell, and the
faerie would find you. The GM decides the nature
of the faerie and the kind of aid he or she provides.
You can use this benefit once, and then the shell is
destroyed.
2 You found within yourself the secrets of magical
power. Discover one tradition of the GM’s choice.
3 You made an important connection. Work with the
GM to determine the identity of the connection
and the kind of aid the character can give you—
influence, information, or security (see Connections
in Shadow, page 207)
4 You enjoyed great success in your business.
Add 3 to your Starting Lifestyle roll.
5 You uncovered an enchanted object of the
GM’s choice.
6 You have a small house in town or a farm in the
wilderness. Work with the GM to determine the
location of your property and assets that come
with it.
7 By some quirk, your present form has become
imprinted in your mind, and you can always use
your Steal Identity talent to assume this form.
8 You found a treasure map that shows the way to
an old faerie ruin. You have not yet sought it out,
fearing it might be dangerous.
9 You found a book of spells containing 1d3 + 1 rank
0 incantations.
10 You found a case containing 1d3 + 1 potions of
the GM’s choice.
11 You performed a service for a powerful faerie. If
you have Terrible Beauty, you begin the game with
a random Favor of the Great Fey (see page 36).
Otherwise, you begin the game with an enchanted
object of the GM’s choice.
12 A druid, witch, wizard, or someone else gave
you shelter when you were most desperate. You
became close friends, and you can always return
to this character when you need a place to stay.
The GM determines the identity of this character
and the benefits your friendship provides.
13 You found a chest filled with coin! Add 3 to your
Starting Lifestyle roll.
14 An assassin owes you his or her life. The
character (as hired killer) accompanies you on
your adventures and serves until death. Work
out the details of the relationship with the GM.
15 You found a small key that can fit into any lock
and open it. Each time you use the key, roll a d6.
On a 1, the key disappears forever. On a 6, the
opening the lock had secured leads to a hidden
kingdom of the GM’s choice for 1d6 hours or until
the door is closed, lid is lowered, or the object is
otherwise closed.
16 You gain a suit of armor or weapon of your choice.
17 You have a loyal goblin companion who
accompanies you and obeys your commands.
18 You found the mortal child you replaced and
returned him or her to the family. Reduce your
Corruption by 1 (minimum 0). If you have 0
Corruption, you start the game with Fortune.
19 You gained membership in an organization such
as a guild of thieves. While a member, you never
have to pay for food, drink, clothes, or lodgings
whenever you’re in the community where they
are based. You also have a 10 percent discount on
any items purchased in that community. However,
to maintain your membership, you must pay 1
gc each time you pay for your lifestyle, and the
organization might require you to undertake
missions on their behalf at the GM’s discretion.
20 You have a small cottage hidden deep in the
wilderness. This is a safe place for you and anyone
you choose to bring with you.
Strange Event
d20 Strange Event
1 You found a borderland and crossed it to enter
a hidden kingdom in the hopes of learning more
about your nature. You spent 1d20 years there,
but when you left, you found no time had passed
in the mortal world. Add the years spent to your
starting age. Note the changes to your Size,
height, and weight if you stop being a child or
adolescent as a result. Add Elvish to the list of
languages you can speak.
2 You stumbled across a Void stain, a place where
the Void intrudes on the mortal world, witnessing
terrifying things there. Begin the game with
1 Insanity.
3 You lost your Steal Identity talent for 1d6 years
and were forced to go about in your natural form.
Add hermit to your list of professions.
4 You impersonated a courtier and gained access
to a noble’s court. Start the game with a set of
fine clothing.
5 You pledged service to one of the great fey. While
you don’t see this being as a god, you behave as
though you do.
6 You gained the attention of a pixie (see Terrible
Beauty) who follows you wherever you go,
though it never interferes with what you’re doing
and keeps far enough away from you that you
cannot interact with it. You suspect this pixie was
once the mortal child you replaced.
7 You were kidnapped and forced to adopt the
form of a dying child. Then, when the child died,
your captor forced you to impersonate him or her
until you finally escaped.
8 A parent or relative resurfaced in your life
after tracking you down. The person holds you
responsible for the loss of the child you replaced
and seeks vengeance.
9 You were poisoned, and it ravaged your body.
While in your natural form, you have a –2 penalty
to Health.
10 You learned you were created by devils to
work evil in the world. If you have Exquisite
Agony, you can add the Damned story
complication. Otherwise, gain 1 Corruption
and the Darksight talent.
11 You were captured by beastmen, but you escaped
using your Steal Identity talent. You currently
appear to be a fomor.
12 Circumstances forced you to assume a different
appearance. Roll on the Apparent Ancestry table
to determine your new appearance. Weirdly,
when you adopted this form, you also gained
knowledge from the target, and you add a
random profession to your list of professions.
As well, whenever you revert to your normal form
from touching iron or becoming incapacitated,
you return to this form. You only return to your
natural form if you die.

13 A vile user of magic captured you and performed
horrific experiments on you to unravel the spell
that made you. You survived, but gain 1 Insanity
from the trauma.
14 You adopted the form of a human, not knowing
he or she was a member of a dark and sinister
cult. In this guise, you were swept up by the
cultists and forced to participate in an awful ritual
that culminated with the sacrifice of a baby and
the emergence of a small demon. Gain 1 Insanity
and 1 Corruption. You fled, but fear the demon
might still be at large.
15 A witch cursed you, turning you into a tree. You
remained in that form for 1d6 years. Add the years
to your starting age.
16 Dark magic warped your natural form. Gain
1 Corruption. Whenever you return to your natural
form, any creature within short range that can see
you must get a success on a Will challenge roll or
become frightened for 1 round.
17 Troglodyte raiders captured you and many
others from your community, dragging them into
the dark of the world below, where they were
tortured, molested, and eaten alive. You adopted
the form of one of the troglodyte captors. Roll
a d6. On a 1, you used your disguise to escape
and left your people to their horrid fates. Gain
1 Corruption. On a 2–5, you used your disguise
to help several people escape. On a 6, you used
your disguise to help several people escape and
kill the troglodyte chieftain. You also plunder
the chieftains’ riches and add 3 to your Starting
Wealth roll.
18 You encountered a psychic who used magic to
learn the truth about you. The spell unlocked
something in your mind, allowing you to discover
the Telepathy tradition (see Demon Lord’s
Companion).
19 You adopted the form of a cambion (see
Exquisite Agony) and remained in that form until
witch hunters discovered you and tried to kill you.
You escaped, but you have a low opinion of the
Cult of the New God.
20 You consulted a fortuneteller to learn what fate
has in store for you. Roll a d6. On a 1, you learned
you were doomed and if you have Demon Lord’s
Companion, you can add the Doomed story
complication. On a 2–5, the fortuneteller gave you
a hint at what is to come, granting you Fortune
for the next adventure. On a 6, the fortuneteller
reveals great secrets and grants you 1 boon on all
challenge rolls made during your next adventure.
Changeling Profession Tables
Use the following tables instead of those in Shadow
of the Demon Lord to randomly determine your
starting professions as directed by the previous
tables. Your profession also adds an item to your
list of starting equipment.
Random Professions
d6 Profession
1 Roll on the Scholar: Area of Scholarship table
2 Roll on the Common Profession table
3 Roll on the Criminal Profession table
4 Roll on the Military Profession table
5 Roll on the Religious Profession table
6 Roll on the Wilderness Profession table
Scholar: Area of Scholarship*
d20 Area of Scholarship
1–2 Architecture and engineering
3–4 Etiquette, heraldry, law, and politics
5–6 Astronomy and navigation
7–8 Imperial history and geography
9–10 Pre-imperial history and geography
11–12 Literature, philosophy, poetry, theology,
and the arts
13–14 Medicine and surgery
15–16 Natural sciences
17–18 Military sciences
19–20 Magical theory
*Add 1 book covering topics related to your area of
scholarship to your starting equipment
Common Professions
d20 Profession
1 Apothecary or healer. You start with a healer’s kit.
2 Artisan such as baker, bookbinder, brewer,
carpenter, chandler, cobbler, gemcutter, jeweler,
leatherworker, mason, potter, printer, scribe, or
tailor. You start with a tool kit.
3 Artist such as painter or sculptor. If you’re literate,
you can choose writer or poet. You start with a
tool kit or writing kit.
4 Bartender or shopkeeper. You start with 1d6 cp.
5 Beggar or urchin. You start with a begging
bowl or cap.
6 Boatman, ferryman. You start with a rowboat.
7 Conscript. You start with a uniform.
8 Cook, groom, scullion, or servant. You start
with an extra set of clothing.
9 Courtesan, prostitute, or camp follower.
You start with a cosmetics kit.
10 Drover or herder. You start with a staff.
11 Entertainer such as actor, athlete, comedian,
dancer, orator, puppeteer, singer, or storyteller.
You start with a costume, dress, or fine clothing
as appropriate for your profession.
12 Farmer. You start with a hoe, shovel, or rake.
13 Fisher or whaler. You start with a fishing pole
and tackle box, or a harpoon.
14 Gambler. You start with a pair of dice or deck
of cards.
15 Laborer such as porter, grave digger, or stevedore.
You start with a backpack, shovel, coil of rope,
or something else chosen by the GM that’s
appropriate to your profession.
16 Merchant. You start the game with raw goods such
as textiles, grains, or something else worth 1d6 ss.
17 Miner or prospector. You start with a pick.
18 Musician using percussion, stringed, or wind
instruments. You start with a musical instrument.
19 Pilot, sailor, or teamster. You start with 1d6 cp.
20 Trade such as dyer, tanner, or butcher. You start
with 2d6 bits.

Criminal Profession
d20 Profession
1–2 Agitator, rebel, saboteur, or terrorist.
You start with 1d6 pamphlets related
to the cause for which you fight.
3–4 Bandit, pirate, or raider. You start with
a bottle of rotgut and a wanted poster
showing your face.
5–6 Burglar or grave robber. You start with
a set of lock picks.
7–8 Charlatan, confidence artist, informant,
or spy. You start with a disguise kit.
9–10 Fence or smuggler. You start with 1d6 cp.
11–12 Forger. You start with a tool kit.
13–14 Mugger or thug. You start with 1d6 bits.
15–16 Murderer. You start with a garrote.
17–18 Pickpocket. You start with a stolen purse
containing 1d6 cp.
19–20 Poacher or rustler. You start with a coil
of rope.
Military Profession
d20 Profession
1–2 Constable or detective. You start with a
lantern and flask of oil.
3–4 Conscript or militiaman. You start with a
spear and uniform.
5–6 Guard or henchman. You start with a club
and uniform.
7–8 Jailer or torturer. You start with a pair of
manacles or torturer’s tools.
9–10 Marine. You start with a sword.
11–12 Mercenary. You start with a sword and a
contract for your last job.
13–14 Officer. You start with a fancy uniform
and sword.
15–16 Patroller. You start with a lantern and
flask of oil.
17–18 Soldier. You start with a uniform, small
shield, and sword.
19–20 Squire. You start with a short sword and
suit of soft leather armor.
Religious Profession*
d6 Profession
1 Anchorite, flagellant, fanatic
2 Evangelist or street preacher
3 Acolyte, devotee, or initiate
4 Militant, such as a crusader.
You start with a mace.
5 Minister of a small temple
6 Minister of a large temple
*Your profession is usually associated with your
religion. As well, you start with a symbol of your faith.
Wilderness Profession
d20 Profession
1–2 Animal trainer. You start with a small animal that’s
friendly to you.
3–4 Apothecary or healer. You start with a healer’s kit.
5–6 Drover or herder. You start with a staff.
7–8 Guide or pioneer. You start with a map of the
region.
9–10 Hermit. You start with a week of rations and a
waterskin.
11–12 Hunter or gatherer. You start with a bow and 12
arrows.
13–14 Nomad. You start with a horse.
15–16 Spelunker. You start with a lantern, pick, and 2
flasks of oil.
17–18 Tracker. You start with a spear.
19–20 Woodcutter. You start with an axe.

Starting Equipment
Your character starts the game with equipment
from your starting lifestyle and your professions. To
determine your starting lifestyle, roll 3d6, adding
or subtracting any numbers as directed by your
Life Experience rolls. Find the total on the Starting
Lifestyle table (Lifestyles are described in Shadow,
page 100), which then grants starting equipment as
shown on the tables that follow. In addition to the
equipment granted by your lifestyle, you also start the
game with one Interesting Thing (Shadow, page 26).
Starting Lifestyle
3d6 Lifestyle
3 or less Destitute
4–5 Poor
6–12 Getting By
13–15 Comfortable
16–17 Wealthy
18 or more Rich
Clothing
Lifestyle Clothing
Destitute Soiled rags and a blanket
Poor Patched, threadbare basic clothing and
a ratty cloak
Getting By Basic clothing and a cloak
Comfortable 1d3 sets of well-made basic clothing and
a fine cloak
Wealthy 1d3 sets of well-made basic clothing, a set
of noble’s clothing, and a fine cloak
Rich 1d3 sets of noble’s clothing and a fine cloak
Weapons
Lifestyle Weapons
Destitute You have a club or a sling with 20 stones.
Poor You have a staff, club, or a sling with
20 stones.
Getting By You have a bronze dagger. You also have
a staff, club, or sling with 20 stones.
Comfortable You have a bronze dagger. You also have
a staff, club, or sling with 20 stones.
Wealthy You have a bronze dagger.
Rich You have a bronze dagger.
Personal Gear
Lifestyle Personal Gear
Destitute —
Poor A sack, a loaf of bread, a waterskin filled with
water, a tinderbox, and a candle
Getting By A backpack, a week of rations, a waterskin
filled with water, coil of rope, a tinderbox,
and 2 torches
Comfortable A backpack, a week of rations, a waterskin
filled with water, coil of rope, a tinderbox,
and 2 torches
Wealthy A backpack, a week of rations, a waterskin
filled with water, coil of rope, a tinderbox,
lantern, and 2 flasks of oil
Rich —
Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting By —
Comfortable A healing potion plus one of the following: a
scroll containing an incantation of one rank
0 spell, a small shield, a healer’s kit, a tool
kit, or a writing kit
Wealthy A healing potion plus one of the following: a
scroll containing an incantation of one rank
0 spell, a small shield, a healer’s kit, a tool
kit, or a writing kit
Rich A healing potion, a personal servant (as
commoner), a guard (as mercenary), and
three horses with bits, bridles, and saddles.
Wealth
Lifestyle Wealth
Destitute 1d6 bits
Poor 2d6 bits
Getting By 1d6 cp
Comfortable 2d6 cp
Wealthy 1d6 ss
Rich 2d6 ss
Appearance Tables
The appearance tables help you define what you
look like in your natural form and the form you
currently wear having used your Steal Identity talent.
Your childhood and life experience results might
have indicated you have changed forms already or
several times. If so, you can flesh out the identities
you previously wore by rolling on the tables for the
respective ancestries, or you can just note previous
identities. Remember, changelings do not have a
natural gender. You can identify as male, female, or
neither.

Natural Build*
3d6 Build
3 Reduce your height by 3d6 inches and your weight
by 2 pounds per inch. Reduce your Size to 1/2.
4–5 Reduce your height by 2d6 inches and your weight
by 1 pound per inch.
6–8 Reduce your weight by 3d6 pounds.
9–12 You are of average height and weight.
13–15 Increase your weight by 3d6 pounds.
16–17 Increase your height by 2d6 inches and your
weight by 1 pound per inch.
18 Increase your height by 3d6 inches and your
weight by 2 pounds per inch.
*The Build table modifies your starting height and weight.
Your starting height is 60 inches and starting weight is
90 pounds.
Natural Appearance
3d6 Appearance
3 You are a mockery of a human form, as if
assembled by someone who has never before
seen a human. Your limbs are twisted, body bent
and warped, and face a horrifying mask.
4–5 You were made from soft clay and have a melted
appearance. You are quite ugly.
6–8 You were crudely made from mud, small stones,
and leaves. You have the barest suggestion of
facial features.
9–12 You are made from mud, sticks, and leaves. You
have eyes, a mouth, and holes for ears and nose.
13–15 You are formed from mud, sticks, and leaves, but
your facial features are better formed, resembling
the appearance of your first form.
16–17 You are made from living wood, and small, leaf-
bearing branches crown your head.
18 Your body is made from wood, vines, and flowers,
shaped expertly and with great care, giving you a
striking appearance.
Apparent Ancestry
3d6 Ancestry
3 Elf. You can determine your age, build, and
appearance using the elf tables in Terrible Beauty.
4–5 Faun. You can determine your age, build, and
appearance using the faun tables in the Demon
Lord’s Companion.
6–8 Halfling. You are Size 1/2. You can determine your
age, build, and appearance using the halfling tables
in the Demon Lord’s Companion.
9–12 Human. You can determine your age, build, and
appearance using the human tables in the main
rulebook or in Only Human.
13–15 Dwarf. You are Size 1/2. You can determine your
age, build, and appearance using the dwarf tables
in the main rulebook.
16–17 Orc. You can determine your age, build, and
appearance using the orc tables in the main
rulebook
18 Goblin. You are Size 1/2. You can determine your
age, build, and appearance using the goblin tables
in the main rulebook.

Quirk
The magic sustaining your life has an unusual side
effect, sometimes manifesting in your appearance or
affecting the kinds of forms you can assume.
Quirk
d20 Quirk
1 You always speak in the third person.
2 Your eyes glow green in the dark.
3 Animals become nervous around you.
4 You can only adopt male or female forms.
5 The scent of iron sickens you.
6 You sometimes hear voices, laughter, or weeping.
7 You have terrible nightmares.
8 You frequently lose small, inconsequential things.
9 One night each year, you lose your Steal Identity
talent.
10 You can only use Steal Identity to adopt the forms
of dead people.
11 You always whisper when you speak.
12 You give off an odd, earthy smell.
13 You can never keep your clothes clean, and after
an hour your clothes appear soiled.
14 You cannot get drunk.
15 You must always speak the truth as you know it.
16 You find meat repulsive and cannot bring yourself
to eat it.
17 You laugh at inappropriate times.
18 The forms you adopt with your Steal Identity talent
never have hair or fingernails.
19 You fidget constantly and can’t sit still.
20 Your laughter is loud and grating, and whenever
you laugh, crimson tears leak from your eyes.
Personality Tables
The personality tables provide you with roleplaying
cues to help realize your character in play and how
your character might behave in a variety of situations.
Personality
3d6 Personality
3 Others find you bland, boring, and lacking in much
personality. It is almost as if you were dead inside.
4–5 Wild and impulsive, your erratic behavior tends
to put people off.
6–8 You find social settings uncomfortable. You prefer
your own company and are happiest when alone.
9–12 You tend to take on the personality traits of
people around you, becoming outgoing when
with an outgoing person or withdrawn when
with an introvert.
13–15 People find you pleasant and friendly.
You get along well with other people.
16–17 You thrive in social situations, finding it easy to
make friends and earn people’s trust. You are
outgoing and enjoy being the center of attention.
18 You have a magnetic personality, and you make
friends wherever you go. You draw people to you
and captivate them with whatever you say.
Relationships
3d6 Relationships
3 You regard people as things and keep them
around only for as long as they have use.
4–5 You see the worst in everyone you meet and find
you question their motives, analyzing whatever
they say to find the insult.
6–8 Few people would call you a friend, and even
they wonder about you.
9–12 You are loyal and constant to the people you
call friends, but you don’t go out of your way
to make new friends.
13–15 You place a lot of importance on friendships
and connections. You’re willing to sacrifice to
help the people closest to you.
16–17 You believe everyone has value, and you try to
find the good in people you meet. Your ability
to overlook flaws makes it easy for you to build
strong friendships.
18 You value your connections to others above all
else. You would gladly sacrifice yourself for the
sake of another.
Morality
3d6 Morality
3 You have unspeakable desires and see nothing
wrong with feeding them. Grotesque and
reprehensible, you are the very definition of evil.
4–5 Selfish to a fault, you always put your interests
first and rarely consider the consequences of
your actions.
6–8 You do what needs doing, because the ends always
justify the means. If others can’t see that, then they
are fools.
9–12 You have both virtues and vices. You sometimes
do bad things, but you usually regret them, and
you might try to right the wrong.
13–15 You try to do good in the world. When you fail,
you feel guilty and usually try to make amends.
16–17 You act with compassion, humility, and charity.
You work hard to make the world a better place
and improve the lives of people around you.
18 You are the very definition of good. You have no
dark thoughts and never feel moved to do anything
that could be construed as evil.

Obligations
3d6 Obligations
3 You have never kept an oath or followed through
on a promise. You break the law and your word
whenever it suits you.
4–5 You resent the law and obligations placed on you.
You might follow through with what you say or
you might do something else if it would produce
a better outcome for you.
6–8 Although you find laws stifling, you realize if you
would belong to a community you must at least
attempt to adhere to them. You break laws and
your word when you can get away with it.
9–12 You try to keep your word and follow the laws of
the land you inhabit. If you break your word, you
try to make amends.
13–15 Your word is important, and you live up to your
obligations. You also consider the law a vital part
of any community and avoid breaking the rules.
If you break your word, you go to great lengths
to make amends.
16–17 Your oath is your bond. You follow through on your
promises whenever possible and make right any
failure to do so. You also obey the laws of the land
and would turn in people who break the rules.
18 Your oath is your life. You follow through on any
promise you make, even if doing so would cause
you great harm. You also uphold any law, even
ones you find despicable.
Desire
d6 Desire
1 Survival
2 Purpose
3 Anonymity
4 Authority
5 Mischief
6 Good
Fear
d6 Fear
1 Exposure
2 Death
3 Isolation
4 Scorn
5 Betrayal
6 Meaninglessness
Religious Beliefs
3d6 Religion
3 You follow the teachings of Witchcraft.
4–8 You serve one of the great fey.
9–15 You have no religious beliefs.
16–17 You follow the teachings of the Old Faith.
18 You belong to a heretical sect, a cult of the
Demon Lord, or you worship the Devil.
Piety
3d6 Piety
3 You only pretend to have your religious beliefs.
You instead believe in something else. Roll on the
Religious Beliefs table and then roll on this table
again. Each time you gain this result after the first,
gain 1 Insanity.
4–5 If you have religious beliefs, you sometimes consider
your religious beliefs when making decisions
6–8 If you have religious beliefs, you are a believer
in name only. You harbor strong doubts about
your faith.
9–12 If you have religious beliefs, you are extremely
skeptical about them.
13–15 If you have religious beliefs, they do not affect
much of what you do.
16–17 If you have religious beliefs, they always play a
part in your decisions.
18 If you have religious beliefs, you are a fanatic
about them to the point people with differing
religious views find you boorish. You might even
persecute people who do not believe as you do.
Gain 1 Insanity.
```

### Changeling — Shadow of the Demon Lord Core

- **Entry Type:** Standard Ancestry
- **Source:** Shadow of the Demon Lord Core
- **Source Page:** 13
- **PDF Page:** 14

```text
Changeling
Faeries create changelings to conceal the absence of
children they steal. They construct a changeling from
natural materials and use magic to give it the appearance of
the missing child. The magic often fades after a few weeks,
but sometimes it lingers and lets the changeling grow up to
become a real person.
Many Masks: Changelings can use their magical nature to
adopt the forms of anyone they see. They assume different
forms to conceal their true nature, forms that most deem
hideous and unsettling. When stripped of their disguises,
changelings look like humanoids formed from dirt, sticks,
and rocks, with glowing green eyes set in otherwise
featureless faces. Changelings in their natural form stand 5
feet tall and weigh 90 pounds.
Changeable Identities: Constantly changing identities
has a deleterious effect on changeling personalities. Most
mimic the attitudes and outlooks of the people around
them, having no particular views themselves or, if they
have them, burying them so deep they cannot
remember who they started out being or
what they hope to become.
Common Names: When not using the
names of the people they impersonate,
changelings use nicknames such as
Coy, Jester, Mirth, Rook, Shadow,
Slick, or Sly.
Creating A Changeling
Starting Attribute Scores Strength 9, Agility 10, Intellect
10, Will 10
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 1, Speed 10, Power 0
Damage 0, Insanity 0, Corruption 0
Languages and Professions You speak the Common Tongue.
Immune damage from disease; charmed, diseased
Iron Vulnerability You are impaired while in contact with iron.
Shadowsight You see into areas obscured by shadows as if
those areas were lit.
Steal Identity You can use an action to alter your
appearance to match that of a target living creature
you can see within short range. The target must be Size
1 or 1/2 and have a humanoid shape of flesh and blood.
Your body changes so you look like the target, though
your clothing and possessions remain unchanged. The
effect lasts until you use this talent again. If you become
incapacitated or touch an object made from iron, you
immediately revert to your normal appearance.
Level 4 Expert Changeling
Characteristics Health +4
You either learn one spell or gain Doppelganger’s Advantage.
Doppelganger’s Advantage You can use a triggered
action on your turn to use Steal Identity. As well, when
you steal a creature’s identity, your attack rolls against
that creature are made with 1 boon while you have that
creature’s appearance.
Changeling True Age
3d6 Age
3 You are a child, 8 years old or younger.
4–7 You are an adolescent, 9 to 14 years old.
8–12 You are a young adult, 15 to 25 years old.
13–15 You are a middle-aged adult, 26 to 40 years old.
16–17 You are an older adult, 41 to 60 years old.
18 You are a venerable adult, 61 years old or older.
Changeling Apparent Gender
d6 Starting Form
1–3 You appear to be male.
4–6 You appear to be female.
Changeling Apparent Ancestry
3d6 Starting Form
3–4
You appear to be a goblin. Go to the Goblin ancestry
entry to determine your age, build, and appearance.
5–7
You appear to be a dwarf. Go to the Dwarf ancestry
entry to determine your age, build, and appearance.
8–15
You appear to be a human. Go to the Human ancestry
entry to determine your age, build, and appearance.
16–17
You appear to be an orc. Go to the Orc ancestry entry
to determine your age, build, and appearance.
18
The GM determines your ancestry, age, build, and
appearance.
13

Character Creation
1
Changeling Background
d20 Background
1
You only recently discovered your true nature, and
you are having a difficult time adjusting to your new
reality. You start the game with 1 Insanity.
2
You have no idea that you’re a changeling. You think
you are a member of the ancestry whose form you
adopted. Add an extra random profession. Until you
become incapacitated or touch iron for the first time,
you cannot use Steal Identity.
3
You were enslaved by a hag and forced to perform
unspeakable acts as she commanded you. You start
the game with 1 Corruption.
4
You murdered the person whose identity you stole
so you could take over that person’s life. You start
the game with 1 Corruption.
5
When your “parents” learned what you were, they
cast you out from your home and you were forced
to make your own way in the world.
6 You ran away from home when you learned what you
were and lived among the faeries for many years.
7 You have earned the enmity of a witch hunter. This foe
hunts you and will try to kill you if your paths ever cross.
8 Fearful townsfolk drove you out of your hometown.
You have grown to hate them and plot revenge.
9 The first time you stole someone’s identity, you also
stole a few of that person’s memories.
10 You earned a living working in your profession.
11 You fell in love, and your lover is not aware of your
true identity.
12
After you were exiled from your hometown, a druid
or witch took you in and cared for you. You always
have a home with this character.
13 You worked as an informant for the Inquisition.
14 You received an education. You know how to read
and write the Common Tongue.
15
You learned a terrible secret while masquerading as
someone else. Work out the nature of that secret
with your Game Master.
16
Your parents raised you even though they knew
what you were. Their love and encouragement gave
you the stability you needed to grow into a mature
personality.
17
The elf who made you recently found you and
befriended you. You can call in one favor from that
elf by speaking into a shell he or she gave you. The
extent of the favor’s power is subject to the GM’s
discretion.
18 You adopted the form of someone famous, powerful,
and important.
19 You have ties to a criminal organization after being
recruited into it for your magical gifts.
20 You came into a quantity of money and start the
game with 2d6 cp.
Changeling Quirk
d20 Quirk
1 You always speak in the third person.
2 Your eyes glow green in the dark.
3 Animals become nervous around you.
4 You can adopt only male forms or only female forms.
5 You are wild and impulsive.
6 You always revert to the first form you adopted.
7 The scent of iron sickens you.
8 You have terrible nightmares.
14

Character Creation 1
d20 Quirk
9 You sometimes hear voices.
10 You tend to lose small, inconsequential things.
11 One night each year, you lose your Steal Identity talent.
12 You can only assume the appearance of dead people.
13 You speak in whispers.
14 You give off an odd, earthy smell.
15 You can never keep your clothes clean.
16 You cannot get drunk.
17 You must always speak the truth as you know it.
18 You find meat repulsive.
19 You laugh at inappropriate times.
20 Forms you adopt have no hair or fingernails.
Changeling Personality
3d6 Personality
3
You steal the forms of others so you can do what
you want without facing repercussions. You don’t
care about how this affects other people.
4–5 You enjoy taking on forms that let you work mischief.
6
You adopt forms that give you power over others.
Power ensures your safety.
7–10
You take on other forms for profit, usually to gain
access to places normally forbidden to you.
11–13
You are careful about the forms you take. You try to
stay out of trouble and keep your secrets safe.
14
You strive to do the right thing and use your
disguises to help other people, as well as to protect
yourself from your enemies.
15–16
Your nature is a gift, and you use it to do what you
think is right, even if it means upsetting others along
the way.
17
You tend to stick to one form as long as possible; you
crave stability and would do anything to be “normal.”
18
You use your talents to help others, to make the
world a better place, and to right wrongs.
```

### Clockwork — Ghosts in Machines

- **Entry Type:** Ancestry Variant
- **Source:** Ghosts in Machines
- **Source Page:** 7
- **PDF Page:** 7

```text
Clockwork
Development Tables
You can use the tables presented here to create a
character with a detailed background. If you use these
tables, do not roll for random starting professions
or starting wealth as normal; you will use the results
from the tables here instead. You must roll on each
table and take that result.
Origins
Your story begins here. The following tables describe
the circumstances of your creation.
Maker
Someone created you. The following table broadly
describes your maker’s nature.
Maker’s Nature
d6 Maker’s Nature
1 Cruel and diabolical
2 Inquisitive and scholarly
3 Kind, caring, and well-intentioned
4 Cold and apathetic
5 Crazed and erratic
6 Scheming and self-serving
Purpose
Your maker must have had some talent for
engineering and magic. The expense and the potent
magic required to bind a soul to your body suggest
you were created for a purpose. The following table
describes why you were created.
Purpose
d6 Purpose
1 You were made to fight as a soldier. Add soldier
to your list of professions.
2 You were made to house the spirit of a loved one
your maker lost. Add a random profession to your
list of professions.
3 You were made to conduct research and preserve
lore. Add a random area of scholarship to your list
of professions.
4 You were made to serve your maker. Add laborer
or servant to your list of professions.
5 You were made to kill your maker’s enemies. Add
murderer to your list of professions.
6 You were made for an unknown reason. Add a
random profession to your list. Also, you were
liberated immediately after your creation, so skip
rolling on the First Experiences table.
8

Soul
As part of your creation, your maker had to steal
a soul from the Underworld or somewhere else.
This table describes the state of the soul bound
to your body.
Soul
3d6 Soul
3 Your soul was ripped from Hell before it could
be cleansed. You have complete memory of your
previous life. Add one random profession to your
list and start the game with 1d6 + 1 Corruption.
Add 3 to your Maturity roll.
4–5 Your soul was partly cleansed, but you recall
committing terrible acts. Start the game with
1 Insanity and 1 Corruption. Add 1 to your
Maturity roll.
6–8 Your soul was mostly cleansed, but you have
clear memories of one or two people with no
idea how they relate to you.
9–12 Your soul was cleansed, and you have no
memories of your previous life. Subtract 3 from
your Maturity roll.
13–15 Your soul was mostly cleansed, but you sometimes
have fleeting memories of your previous life.
16–17 Your soul retained memories from your previous
life. Add one random profession to your list. Add
1 to your Maturity roll.
18 You have total memory of your previous life. Add
two random professions to your list, but the trauma
of your awakening means you start the game with
Insanity equal to half your Will. Add 3 to your
Maturity roll.
Maturity
Your maturity describes your mental age and how
you see the world. With youth comes innocence,
usually, while advanced age typically brings
experience and wisdom.
Maturity
3d6 Maturity
3 or less Child
4–5 Adolescent
6–8 Young adult
9–12 Adult
13–15 Middle-aged
16–17 Old
18 or more Ancient
Age
Age represents how long you have lived as a
clockwork. The result of this roll determines how
many important life experiences you have had, if
any, possibly affecting your rolls on the Life
Experience table later on.
Age
3d6 Age
3 You are very old and have lived for 5d20 + 50
years. Roll five times on the Life Experience table.
4–5 You show signs of wear and tear, having lived
4d6 + 20 years. Roll three times on the Life
Experience table.
6–8 You have lived 2d6 + 3 years. Roll once on the
Life Experience table.
9–12 You are relatively new, having lived 1d6 + 2 years.
Do not roll on the Life Experience table.
14–15 You have lived 3d6 + 6 years. Roll twice on the
Life Experience table.
16–17 You have lived 4d6 + 50 years. Roll four times
on the Life Experience table
18 You are ancient and have forgotten how long
you have been “alive.” Roll o six times on the
Life Experience table.
9

Maker Relationship
The relationship you had with your creator can help
you understand how your character sees the world
and the people in it. The following table describes
how you felt about your maker.
Maker Relationship
d6 Relationship
1 You despised your maker. Your animosity might
arise from being doomed to this cursed existence,
flaws you perceived in that person, or how you
were treated.
2 You disliked your maker, perhaps from poor
treatment or blame for what you became. Still,
you’re alive, and you owe your maker that much.
3 You neither liked nor disliked your maker.
You have no attachment to that person.
4 You had no relationship with your maker because
you have no idea who made you or for what
reason. It’s a mystery you might one day unravel.
5 You hold great affection for your maker, seeing
that person as a parent.
6 You saw your maker as a benevolent god and feel
gratitude for your new life.
Background Tables
The background tables help you construct a story of
what has happened to you since being created. Start
by rolling on the First Experiences table, which tells
you both what your early life was like and how you
gained your independence. Then roll on the Life
Experience table as directed by the result of your roll
on the Age table above. The Life Experience table
might in turn direct you to roll on another table to
discover what happened to you.
First Experiences
d20 First Experience
1–2 Your maker treated you so poorly that you ran
away to survive. You fear your maker will one
day find you.
3–4 You survived your maker’s death, whether at your
hands, or by plague, fire, monsters, or something
else. You were forced to make your own way in
the world.
5–6 You were stolen from your maker and forced to
live as a slave for some number of years. You
managed to escape, or someone rescued you, as
you decide. Add slave to your list of professions.
7–8 Goblins captured you and plundered your
body for scraps. You replaced your missing
components with bits of wood, old weapons,
and rubbish.
9–10 You served your maker until you were set free.
11–12 When your maker died suddenly, you fled in a
panic, believing you were somehow responsible.
13–14 One day your key stopped turning. Someone
eventually found you and twisted your key,
revealing that many, many years had passed,
and your maker was long dead.
15–16 You were one of six identical clockworks.
Each of your fellows earned their freedom by
accomplishing some great work. You were the last
to gain your independence, and you hope to find
your “siblings” one day.
17–18 After serving for a time, your maker set you free,
believing you had some greater destiny.
19–20 You have no recollection of your time with your
maker. You have recently discovered a cryptic
message somewhere in your body, though you
have yet to decipher its meaning.
Life Experience*
3d6 Experience
3 Trapped as an Object! Your key stopped turning.
If this was your last Life Experience roll, one of the
characters in your group found you and twisted
your key. Otherwise, roll a d6. On a 1, skip any
remaining Life Experience rolls (one of the other
characters in your group finds you and twists your
key). On a 2–5, you lose your next Life Experience
roll if any and, if this was your last, a character
finds and twists your key. On a 6, some good soul
turned your key, and you can roll for all remaining
life experiences.
4–5 Roll on the Major Setback table.
6–8 Roll on the Minor Setback table.
9–12 Toil! You found work related to your profession.
You gain nothing from this experience except for
the satisfaction of a job well done.
13–15 Roll on the Minor Windfall table.
16–17 Roll on the Major Windfall table.
18 Roll on the Strange Event table.
*Roll on this table only if directed by the Age table.
10

Major Setback
d20 Major Setback
1 You murdered someone because you could.
Gain 1d6 Corruption.
2 You were forced to do things for someone you
served that you now regret. Gain 1 Corruption.
3 You settled in a community only to lose it to war,
disease, or some natural disaster. You picked up
and moved on. Subtract 1 from your Starting
Lifestyle roll.
4 A demon possessed you! Gain 1 Corruption. If you
have Demon Lord’s Companion, you begin the
game with the Possessed story complication.
Otherwise, the demon left your body, whether
willingly or by force.
5 You have no head for money and lost all of
your earnings. Subtract 3 from your Starting
Lifestyle roll.
6 You suddenly recalled a painful memory from a
past life, giving you a hint of who you once were.
Gain 1d6 Insanity. If you go mad as a result, reduce
your Insanity total by an amount equal to 1d6 + your
Will modifier. If you have Demon Lord’s Companion,
you can begin the game with the Mad story
complication.
7 You were captured and held as a prisoner for
2d6 years. Add this time to your age. During your
captivity, your body suffered some significant
damage from neglect. If you have Demon Lord’s
Companion, you can begin the game with the
Maimed story complication.
8 You lost everything to a natural disaster or war.
Subtract 3 from your Starting Lifestyle roll.
9 The magic binding your soul to your body has
begun to fail. Whenever you assume your object
form from being incapacitated, you roll an additional
d6 at the end of each round to decide your fate.
You must use the lowest number. The effect of
this setback is cumulative.
10 You ran afoul of a powerful faerie who leveled a
curse at you. The curse has made life much harder.
Subtract 1 from your Starting Lifestyle roll. If you
have Demon Lord’s Companion, you can add the
Cursed story complication.
11 You were nearly destroyed, and much of your
mechanism was rendered useless. You cut away
the extra component, leaving your Size reduced
by one step (to a minimum of 1/2).
12 Villains captured you and attached you to a
standard or the prow of their ship, displayed to their
enemies. When the fiends were slaughtered, you
were freed but came away battered. Reduce your
Appearance result by one step (to a minimum of 3).
13 You settled in a community for a time, but the
fearful people eventually drove you out. Add exile,
hermit, or refugee to your list of professions.
14 You once encountered a horrifying creature.
Gain 1 Insanity.
15 You were captured by slavers and sold to a new
owner. Add slave to your list of professions. Roll
a d6. On an even number, your owner freed you.
On an odd number, you escaped.
16 Flashes of your old life as a mortal planted the
seeds of madness in your consciousness. Start
the game with 1d6 + 1 Insanity; if you have Demon
Lord’s Companion, you can add the Mad story
complication. Alternatively, if you are using Unhinge
the Mind, you can begin with a long-term madness.
17 You caused the death of someone close to you,
whether by accident or on purpose.
18 An overzealous devotee of the New God roused a
mob against you, calling you an abomination. You
fled from your home and can never return. Subtract
1 from your Starting Lifestyle roll.
19 You desecrated a holy site by intent or accident.
Choose a religion to which the site was holy. You
always feel uncomfortable around places and
symbols associated with that faith.
20 You made a dangerous enemy, one who actively
seeks your harm. Work with the GM to create a
suitable nemesis.
Minor Setback
d20 Minor Setback
1 A monster attacked you and your group. Since
you weren’t edible, the monster ignored you and
devoured everyone else while you watched.
2 You found refuge living in the sewers under a
large city, where you encountered many vile
substances. You find living creatures disgusting.
3 You suffered some minor damage to your body,
and you’re covered in scratches, dents, and dings.
4 You suffered financial trouble. Subtract 1 from
your Starting Lifestyle roll.
5 You watched a close friend die of old age.
6 People in your community dislike you for
your differences and are automatically unfriendly
to you.
7 You witnessed a murder and did nothing to
stop it.
8 You were traveling with companions when your
key wound down. They left you to fend for
yourself. Luckily, someone happened along to
wind you up.
9 Someone tried to kill you. Though you survived,
you fear that person will try again.
10 You lost something valuable. Subtract 1 from your
Starting Lifestyle roll.
11 You became addicted to dream grease, a strange
substance that, when applied to your inner
mechanisms, causes intense feelings of pleasure.
The grease costs 1 ss per dose. If you go more
than a week without applying the substance, you
become impaired until you do.
12 You stole something from those who needed it,
harmed an innocent, or did some other terrible
thing. Gain 1 Corruption.
13 You lost an old friend. Roll a d6. It was your fault
on an odd number and their fault on an even one.
14 You learned a dangerous secret. Work with the
GM to come up with what exactly that was.
15 You were stuck in your object form for 1d6 years.
Add this time to your age.
16 Your actions or inaction brought harm to
someone close to you.
17 You grew weary of all the stares and questions,
so you picked up and made your way elsewhere.
18 Birds nested inside your body. You tried to
care for them, but they all died and you mourn
their loss.
19 You were robbed! Subtract 1 from your Starting
Lifestyle roll.
20 Unable to find a place in the world, you became
bitter and cynical about your existence.
17
11

Major Windfall
d20 Major Windfall
1 You did a great service for the dwarfs and gain
the friendship of a dwarf who will help you and
accompany you on your adventures. You control
this character, though he or she does not count
as a member of your group.
2 You realize you worked magic in a previous life.
You discover one tradition of the GM’s choice.
3 You made an important connection. Work with
the GM to determine the identity of the person
and the kind of aid the connection can give
you: influence, information, or security (see
Connections in Shadow, page 207)
4 You enjoyed great success in your business.
Add 3 to your Starting Lifestyle roll.
5 You uncovered an enchanted object of the
GM’s choice.
6 You have a small house in town or a farm in the
wilderness. Work with the GM to determine the
location of your property and assets that come
with it.
7 Superior upgrade! You gain 2 gc, which you
must spend on component upgrades. Any
remainder is lost.
8 You gain a deed to lands in a place of the GM’s
choosing.
9 You found a book of spells containing 1d3 + 1
rank 0 incantations of the GM’s choice.
10 You found a case containing 1d3 + 1 potions of
the GM’s choice.
11 You remember more of your previous life.
Add one language to the list of languages you
can speak, or add a profession of your choice
to your list.
12 You make a friend of a powerful individual,
such as a noble, high priest, or wizard. The GM
determines the identity of this friend and the
benefits such a friendship entails.
13 You found a chest filled with coin! Add 3 to your
Starting Lifestyle roll.
14 An engineer you helped made a companion for
you (as a small construct). The creature obeys
your commands and accompanies you on your
adventures, serving you until death. Work out the
details of the construct’s appearance with the GM.
15 You became quite famous after creating a
piece of art or composing a song. Add the
artist profession (your choice of medium) to
your list. You might also be recognized in
places where your art would be appreciated,
at the GM’s discretion.
16 You gain a weapon of your choice.
17 You befriended an artificer in your community
who will repair your object form for free once
each month.
18 You saved the life of an innocent child. Reduce
your Corruption by 1 (minimum 0). If you have 0
Corruption, you start the game with Fortune.
19 An engineer friend made improvements to your
body. One time when you would roll to determine
your fate when in object form, you can treat the
result of the roll as a 6.
20 You received a warning about the future from
a spirit, god, or something else. You can escape
death once.
Minor Windfall
d20 Minor Windfall
1 You fell in love. You have hidden your feelings,
knowing it could never work, but your love
interest is friendly to you. Work with your GM to
create this character.
2 You started a business related to your profession.
Add 1 to your Starting Lifestyle roll or add a
random profession to your list if you do not yet
have one.
3 You studied under a learned individual. Either add
a language to the list of languages you can read
and write or gain a new area of scholarship of
your choice.
4 You traveled extensively. Add one language to
the list of languages you can speak.
5 You worked for and befriended an experienced
magician. Start the game with a rank 0 incantation
of the GM’s choice.
6 You received an education or furthered your
learning. Either add a language to the list of
languages you can read and write or gain a
random area of scholarship.
7 You came into some money. Add 1 to your
Starting Lifestyle roll.
8 Upgrade! You gain 1 gc, which you must spend on
component upgrades. Any remainder is lost.
9 You took up a new field of work. Add one random
common profession to your list.
10 You gain one additional interesting thing
(Shadow, page 26).
11 You made the acquaintance of someone
important. Choose influence, information, or
security. This character can provide the benefit to
you once (see Connections in Shadow, page 207).
Work with the GM to define this character.
12 You performed a great service for your
community and are considered a hero. You make
attack rolls with 1 boon in social situations against
members of your community.
13 You found a healing potion.
14 You managed to escape what should have been
certain death. Start the game with Fortune.
15 You have a weapon or an implement of the
GM’s choice.
16 You have a small shield.
17 You made a lifelong friend (as commoner) who
will accompany you on your adventures and help
you. You control this character, though he or she
does not count as a member of your group.
18 A memory from your previous life returns. Add a
random profession to your list.
19 You played an important part in the defense of
your community. You gain 1 ss as a reward, and
add one random martial profession to your list.
20 You saved someone’s life, and this person is
forever after in your debt. This character is
friendly to you and will always help you. Work
with your GM to determine the identity of this
character and the circumstances of your help.
12

Strange Event
d20 Strange Event
1 The soul was ripped from your clockwork body
and replaced with another. Remove all Corruption,
Insanity, and one profession from your list. Add
one random profession and roll a d6. You gain
an odd number rolled as Corruption and an even
number rolled as Insanity.
2 You spotted a tear form in reality, a breach to the
Void. The entire experience left you shaken and
with 1d3 Insanity.
3 Your inner mechanisms have started to break
down. Whenever the total of any roll made by a
member of your group is 0 or less, you assume
your object form at the end of the round.
4 You and another clockwork were picked up by
scavengers and then later sold to farmers. Add
farmer to your list of professions.
5 A priest told you that your soul was released from
the Underworld to serve the gods in the world.
You became a fanatical believer in a religion of
your choice. Add a random religious profession
to your list, and the first time you make a fate roll
you can roll twice and use the highest result.
6 Strange parasites infest your body and have
resisted every effort you have made to remove
them. They do not interfere with your capabilities,
but you drop tiny beetles, worms, maggots, or
spiders whenever you stay in one place for
too long.
7 While traveling at sea, the boat sank, and you
were the sole survivor. It took you two years to
walk across the bottom to reach shore.
8 Your soul attracted the attention of a spirit
trapped in the world. It sometimes troubles you.
If you have Demon Lord’s Companion, you can
add the Haunted story complication.
9 You were dismantled and put back together.
Somehow your soul lingered in the world, but
your body doesn’t work right anymore. Reduce
your Speed by 2.
10 You built a lasting monument in your community.
You make all decisions about the edifice.
11 A malfunction in your design means you cannot
rest unless you assume your object form. You can
use an action to assume this form, though you still
need someone to crank your key.
12 You assumed object form while attempting to
save someone’s life. When you returned to your
creature form, you had been moved and you
have no idea what happened to the person you
tried to help.
13 A deranged user of dark magic grafted a human
face onto your head. Roll a d6. On an odd number,
you have no control over its movements. On an
even number, you control it as if it were your
own face.
14 Your soul was stolen from one of the greater
devils of Hell, and this dreadful being wants its
property back. You have escaped a few devils
sent to destroy you but fear your time might
be running out. Gain 1d6 Corruption.
15 A mad engineer found and captured you. After
extensive work, the engineer completely rebuilt
your body. Reroll on the Appearance and Body
Shape tables.
16 A mad engineer got hold of you and installed an
apparatus that gave you the ability to smell.
17 An ancient dragon captured you and kept
you as treasure. After a few years, you managed
to escape.
18 The Cult of the New God recruited you into their
service and, believing you would be of great
benefit to their cause, covered you in silver
plating. Your body is worth 10 gc.
19 Your soul is poorly tethered to your body.
Whenever you assume your object form, your
soul returns to the Underworld. When you return
to creature form, roll a d6. On a 1, you lose a
profession of your choice. On a 2–5, there is no
effect. On a 6, you gain 1 Insanity.
20 You found work on the locomotive moving across
the Northern Reach or elsewhere in the Empire.
Engineers improved your body’s design with
steam technology. When a creature spends 1
minute to fill your reservoir with hot water and
burning coals, you gain a +2 bonus to Speed that
lasts for 1d3 hours.
Profession Tables
Use the following tables instead of those in Shadow of
the Demon Lord to randomly determine your starting
professions as directed by the previous tables. Each
profession also adds an item to your list of starting
equipment.
Random Professions
d6 Profession Table
1 Scholar: Areas of Scholarship
2 Common Professions
3 Criminal Professions
4 Martial Professions
5 Religious Professions
6 Wilderness Professions
Scholar: Areas of Scholarship*
d20 Area of Scholarship
1–2 Architecture and engineering
3–4 Etiquette, heraldry, law, and politics
5–6 Astronomy and navigation
7–8 Imperial history and geography
9–10 Pre-imperial history and geography
11–12 Literature, philosophy, poetry, theology,
and the arts
13–14 Medicine and surgery
15–16 Natural sciences
17–18 Military sciences
19–20 Magical theory
*Add 1 book covering topics related to your area of
scholarship to your starting equipment.
13

Common Professions
d20 Profession
1 Apothecary or healer. You start with a healer’s kit.
2 Artisan such as baker, bookbinder, brewer,
carpenter, chandler, cobbler, gemcutter, jeweler,
leatherworker, mason, potter, printer, scribe, or
tailor. You start with a tool kit.
3 Artist such as painter or sculptor. If you’re literate,
you can choose writer or poet. You start with a
tool kit or writing kit.
4 Bartender or shopkeeper. You start with 1d6 cp.
5 Beggar or urchin. You start with a begging bowl
or cap.
6 Boatman or ferryman. You start with a rowboat.
7 Conscript. You start with a uniform.
8 Cook, groom, scullion, or servant. You start with
an extra set of clothing.
9 Courtesan, prostitute, or camp follower. You start
with a cosmetics kit.
10 Drover or herder. You start with a staff.
11 Entertainer such as actor, athlete, comedian,
dancer, orator, puppeteer, singer, or storyteller.
You start with a costume, dress, or fine clothing
as appropriate for your profession.
12 Farmer. You start with a hoe, shovel, or rake.
13 Fisher or whaler. You start with a fishing pole
and tackle box, or a harpoon.
14 Gambler. You start with a pair of dice or deck
of cards.
15 Laborer such as porter, grave digger, or
stevedore. You start with a backpack, shovel,
coil of rope, or something else chosen by the
GM that’s appropriate to your profession.
16 Merchant. You start the game with raw goods
such as textiles, grains, or something else, worth
1d6 ss.
17 Miner or prospector. You start with a pick.
18 Musician using percussion, stringed, or wind
instruments. You start with a musical instrument.
19 Pilot, sailor, or teamster. You start with 1d6 cp.
20 Trade such as dyer, tanner, or butcher. You start
with 2d6 bits.
Criminal Professions
d20 Profession
1–2 Agitator, rebel, saboteur, or terrorist. You start
with 1d6 pamphlets related to the cause for which
you fight.
3–4 Bandit, pirate, or raider. You start with a bottle of
rotgut and a wanted poster showing your face.
5–6 Burglar or grave robber. You start with a set
of lock picks.
7–8 Charlatan, confidence artist, informant, or spy.
You start with a disguise kit.
9–10 Fence or smuggler. You start with 1d6 cp.
11–12 Forger. You start with a tool kit.
13–14 Mugger or thug. You start with 1d6 bits.
15–16 Murderer. You start with a garrote.
17–18 Pickpocket. You start with a stolen purse
containing 1d6 cp.
19–20 Poacher or rustler. You start with a coil of rope.
Martial Professions
d20 Profession
1–2 Constable or detective. You start with a lantern
and flask of oil.
3–4 Conscript or militia. You start with a spear and
uniform.
5–6 Guard or henchman. You start with a club and
uniform.
7–8 Jailer or torturer. You start with a pair of manacles
or torturer’s tools.
9–10 Marine. You start with a sword.
11–12 Mercenary. You start with a sword and a contract
for your last job.
13–14 Officer. You start with a fancy uniform and
a sword.
15–16 Patroller. You start with a lantern and flask of oil.
17–18 Soldier. You start with a uniform, small shield,
and sword.
19–20 Squire. You start with a short sword and suit
of soft leather armor.
Religious Professions*
d6 Profession
1 Anchorite, flagellant, or fanatic
2 Evangelist or street preacher
3 Acolyte, devotee, or initiate
4 Militant, such as a crusader. You start with a mace.
5 Minister of a small temple
6 Minister of a large temple
*Your profession is usually associated with your religion.
As well, you start with a symbol of your faith.
Wilderness Professions
d20 Profession
1–2 Animal trainer. You start with a small animal that’s
friendly to you.
3–4 Apothecary or healer. You start with a healer’s kit.
5–6 Drover or herder. You start with a staff.
7–8 Guide or pioneer. You start with a map of
the region.
9–10 Hermit. You start with a week of rations and
a waterskin.
11–12 Hunter or gatherer. You start with a bow and
12 arrows.
13–14 Nomad. You start with a horse.
15–16 Spelunker. You start with a lantern, pick, and
2 flasks of oil.
17–18 Tracker. You start with a spear.
19–20 Woodcutter. You start with an axe.
19–20
14

Starting Equipment
Your character starts the game with equipment
from your starting lifestyle and your professions. To
determine your starting lifestyle, roll 3d6, adding or
subtracting any numbers as directed by your Life
Experience rolls. Find the total on the Starting
Lifestyle table (Lifestyles are described in Shadow,
page 100), which then grants starting equipment as
shown on the tables that follow. In addition to the
equipment granted by your lifestyle, you start the
game with one interesting thing (Shadow, page 26).
Starting Lifestyle
3d6 Lifestyle
3 or less Destitute
4–5 Poor
6–12 Getting By
13–15 Comfortable
16–17 Wealthy
18 or more Rich
Clothing
Lifestyle Clothing
Destitute —
Poor A ratty, worn cloak
Getting By A cloak
Comfortable A fine cloak
Wealthy A set of fine clothing with cloak
Rich A set of noble’s clothing and cloak
Weapons
Lifestyle Weapons
Destitute A club or a sling with 20 stones
Poor A staff, club, or sling with 20 stones
Getting By A dagger and one of the following: a staff,
club, or sling with 20 stones
Comfortable A dagger and two of the following: a staff,
club, or sling with 20 stones
Wealthy A sword or similar weapon
Rich A sword or similar weapon, plus another
weapon of your choice
Personal Gear
Lifestyle Gear
Destitute —
Poor A sack, tinderbox, and candle
Getting By A backpack, coil of rope, tinderbox, and 2
torches
Comfortable A backpack, coil of rope, tinderbox, and 4
torches
Wealthy A backpack, coil of rope, tinderbox,
lantern, and 2 flasks of oil
Rich —
Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting By —
Comfortable A healing potion plus one of the following:
a scroll containing an incantation of one
rank 0 spell, a small shield, a healer’s kit, a
tool kit, or a writing kit
Wealthy A healing potion plus one of the following:
a scroll containing an incantation of one
rank 0 spell, a small shield, a healer’s kit,
a tool kit, or a writing kit. You also have a
retainer (as commoner).
Rich A healing potion, a personal servant (as
commoner), a guard (as mercenary), and
three horses with bits, bridles, and saddles.
Wealth
Lifestyle Wealth
Destitute —
Poor 1d6 bits
Getting By 2d6 bits
Comfortable 1d6 cp
Wealthy 1d6 ss
Rich 2d6 ss
Personality
The Personality table provides you with roleplaying
cues to help realize your character in play and judge
how your character might behave in a variety of
situations.
Personality
3d6 Personality
3 You are bland and humorless, as cold as
your body.
4–5 You have a hard time focusing on one task,
being easily distracted.
6–8 You prefer to be alone in your misery and
avoid the company of others.
9–12 The most interesting thing about you is your
unusual nature. You are inoffensive to others.
13–15 You work hard to overcome the limitations of
your body and tend to be friendly and outgoing.
16–17 You enjoy being at the center of attention
and thrive in the company of others.
18 You have a strong presence that attracts
others or repulses them. People either love
you or hate you.
Desire
d6 Desire
1 Service
2 Power
3 Meaning
4 Safety
5 Glory
6 Immortality
Fear
d6 Fear
1 Dormancy
2 Death
3 Isolation
4 Derision
5 Exploitation
6 Meaninglessness
Rich
15

Relationships
3d6 Relationships
3 You hate living things and take pleasure in pulling
them apart to see how they work.
4–5 You have a difficult time maintaining relationships
as you find others wanting.
6–8 People find it hard to know the real you, and thus
you have few friends.
9–12 You are slow to make friends, but you are loyal
to the ones you have.
13–15 Your friends and companions give you purpose
and meaning. You would sacrifice much on their
behalf.
16–17 You try to find the best in other people, and you
take others at their word. Some people regard
your optimism as gullibility.
18 You value your connections to others above all
else. You would gladly sacrifice yourself for the
sake of another.
Obligations
3d6 Obligations
3 You have never kept an oath or followed through
on a promise. You break the law and your word
whenever it suits you.
4–5 You resent the law and the obligations placed
on you. You might follow through with what you
say or you might do something else if it would
produce a better outcome for you.
6–8 You find laws stifling, but you also realize that
if you would belong to a community you must
at least attempt to adhere to them. Still, you
break laws and your word when you can get
away with it.
9–12 You try to keep your word and follow the laws of
the land you inhabit. If you break your word, you
try to make amends.
13–15 Your word is important, and you live up to your
obligations. You also consider the law a vital
part of any community and avoid breaking the
rules. If you break your word, you go to great
lengths to make amends.
16–17 Your oath is your bond. You follow through
on your promises whenever possible and make
right any failure to do so. You also obey the laws
of the land and would turn in people who break
the rules.
18 Your oath is your life. You follow through on any
promise you make, even if doing so would cause
you great harm. You also uphold every law, even
ones you find despicable.
Morality
3d6 Morality
3 Not really alive, you feel you are free to do what
you want and morality has nothing to do with you.
You are evil, through and through.
4–5 You look after your interests first and never spare
a thought for the consequences of your actions.
6–8 You believe the end always justifies the means.
You do what you must to attain your desires.
9–12 You are a person with virtues and flaws. You
try to do the right thing, but you’re not always
successful.
13–15 You see it as your obligation to do good in the
world and thus strive to be a better person.
16–17 You act with compassion, humility, and charity.
You work hard to make the world a better place
and improve the lives of people around you.
18 You have never had an evil thought. You are a
paragon of virtue.
Religious Beliefs
3d6 Religion
3 You belong to a heretical sect, worship the Devil,
or belong to a cult of the Demon Lord.
4–5 You belong to a minor religion dedicated to
a small god.
6–8 You have odd religious beliefs, worshiping
a being of your own invention.
9–12 You have no religious beliefs.
13–15 You belong to the cult of the New God.
16–17 You follow the teachings of the Old Faith.
18 You hold to the tenets of witchcraft.
Piety
3d6 Piety
3 Your stated religious beliefs are only a pretense.
You instead believe in something else. Roll on the
Religious Beliefs table to determine what you
really believe and then roll on this table again to
see how strongly you believe it. If you get this
result again, you gain 1 Insanity and have no real
religious beliefs.
4–5 If you have religious beliefs, you sometimes
consider them when making decisions.
6–8 If you have religious beliefs, you are a believer
in name only. You harbor strong doubts about
your faith.
9–12 If you have religious beliefs, you are extremely
skeptical about them.
13–15 If you have religious beliefs, they do not affect
much of what you do.
16–17 If you have religious beliefs, they always play a
part in your decisions.
18 If you have religious beliefs, you are a fanatic
about them, to the point people with differing
religious views find you boorish. You might even
persecute people who do not believe as you do.
Gain 1 Insanity.
16
```

### Clockwork — Shadow of the Demon Lord Core

- **Entry Type:** Standard Ancestry
- **Source:** Shadow of the Demon Lord Core
- **Source Page:** 15
- **PDF Page:** 16

```text
Clockwork
Clockworks are mechanical people made from metal
plating, gears, wires, bits of spring, and cogs to which are
bound souls plucked from the Underworld. The magic
binding the soul tethers it to the clockwork but allows it to
manipulate the body only while its internal mechanisms
are moving. All clockworks have keys somewhere on their
body, and while wound up, they move, think, and act
like creatures. Should the key wind down, a clockwork
becomes dormant—an insensate object.
Common Names: Typically, clockworks use names
given to them by their creators. These can be nicknames or
strings of letters and numbers. Clockworks might choose
names they find interesting or use names dredged up from
their souls’ memories.
Creating A Clockwork
Attribute Scores Strength 9, Agility 8, Intellect 9, Will 9
Perception equals your Intellect score
Defense 13
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 8, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common Tongue.
Immune damage from disease and poison; asleep,
diseased, fatigued, poisoned
Key You have a key somewhere on your body that you
cannot reach.The key determines whether you are a
creature or an object. If the key is turning, you count as
a creature and use your normal statistics. If the key isn’t
turning, you count as an object and use the statistics
in the following description in place of your normal
statistics (your Health becomes the object starting
number). Your key stops turning when you become
incapacitated or at the end of any round in which you
got a 0 or less on an attack roll or challenge roll. Any
damage taken in excess of your Health applies to your
Health in your object form; if you take damage equal to
the Health of your object form, you are destroyed.
Mechanical Body You do not eat, drink, or breathe.
You do not age and you cannot be transformed into
an undead creature. Your mechanical body makes it
impossible for you to swim, so you sink to the bottom
when you are submerged in liquid.
OBJECT FORM
Size as your creature form
Perception —
Defense 5; Health 15
Strength 0 (+0), Agility 0 (+0), Intellect —, Will —
Speed 0
Immune attack rolls against Intellect, Will, or Perception;
attacks that allow challenge rolls to resist using Intellect,
Will, or Perception
Suppressed Afflictions Any afflictions you had when you
become an object are suppressed and have no effect for
as long as you remain an object. However, rounds spent in
object form count toward the duration of those afflictions.
Object You cannot use actions or triggered actions, and
you cannot move. You are completely insensate.
Failing Magic If you became an object from becoming
incapacitated, the magic binding your soul to your body
begins to fail. At the end of each round, roll a d6.
6: You arrest the failing magic, and you are no longer
incapacitated, but you remain an object until another
creature uses an action to restore power to you.
2–5: Magical failure. If you get this result three times,
your soul escapes your body, and you remain an
object permanently.
1: Explosion! You explode in a 1d6-yard radius from a point
in your space. You are destroyed, and everything in the
area takes 2d6 damage. A creature that gets a success
on an Agility challenge roll takes half the damage.
Wind the Clock While you are an object, any creature that
can reach you can use an action to twist your key. If you
are not incapacitated, your mechanisms start working
again, and you become a creature at the end of the
round. If you are incapacitated, roll a d6. On a 3 or lower,
you remain incapacitated. On a 4 or higher, you heal
1 damage and become a creature at the end of the round.
Repair Damage A creature can use a tool kit and an action
to start repairing you. If the creature spends a total of
4 hours working on you, it can make an Intellect
challenge roll with 1 bane. On a success, your object
form heals 1d6 + 1 damage.
Level 4 Expert Clockwork
Characteristics Health +5
You learn one spell or gain Grind the Gears.
Grind the Gears You can increase the number of actions
you can use on your turn by one. When you finish your
turn, roll a d6. If you roll an odd number, you become
an object at the end of the round.
15

Character Creation
1
Clockwork Age
3d6 Age
3–8 You are new, 5 years old or younger.
9–12 You are experienced, 6 to 10 years old.
13–15 You are old, 11 to 50 years old.
16–17 You are very old, 51 to 150 years old.
18 You are ancient, more than 150 years old.
Clockwork Purpose
d20 Purpose
1–4
You were built for war. Increase your Strength or
Agility by 2.
5–8 You were built to work. Increase your Strength by 2.
9–12
You were built to use magic. Increase your Intellect
or Will by 2.
13–16
You were built to gather intelligence about or assassinate
targets. Increase your Agility or Intellect by 2.
17–20
You were built for an inexplicable purpose. Increase
one attribute of your choice by 2.
Clockwork Form
3d6 Form
3
You are a small winged clockwork. Reduce your
Health by 5 and your Size to 1/2. You can fly, but
you must land at the end of your movement or fall.
You are 3 feet tall and weigh 50 pounds.
4–5
You are a small spider-like clockwork with
functional hands. Reduce your Size to 1/2. You
ignore the effects of difficult terrain when you
climb. You are 3 feet tall and weigh 50 pounds.
6–9
You are a small humanoid clockwork. Reduce your
Size to 1/2. You are 4 feet tall and weigh
75 pounds.
10–15
You are a humanoid clockwork. You are 6 feet tall
and weigh 300 pounds.
16–17
You are a large humanoid clockwork. Increase your
Size to 2, but reduce your Speed and your Defense
by 2. You are 10 feet tall and weigh 750 pounds.
18
You are a large clockwork with the lower body
of a horse. Increase your Size to 2 and your Speed
by 2. Reduce your Defense by 3. You
are 6 feet long, 6 feet tall, and weigh 750 pounds.
Clockwork Appearance
3d6 Appearance
3 You have a strange and unsettling appearance.
4 You appear crude and ill-formed.
5–6 You appear battered, broken, and in poor repair.
7–8 You have no facial features or distinguishing markings.
9–12 You have a mere suggestion of facial features.
13–14 You appear well made and in good working condition.
15–16 You have a stylized and ornate body.
17
You have an ornate body festooned with etchings
and ornamental jewels.
18
You have an exquisite body festooned with
elaborate etchings and ornamental jewels, and
trimmed in precious metals. If you are dismantled,
your body parts are worth 1d6 gc.
16

Character Creation 1
Clockwork Background
d20 Background
1
Your soul came from Hell. Start the game with 1d3
Corruption.
2
Your soul was plucked from the Underworld before
it could forget its former life. Start the game with 1d6
Insanity and add an extra profession.
3 You spent 1d20 years in a dormant state.
4
Your maker treated you poorly. You escaped and
now fear your maker will find you.
5
Fire, plague, or monsters destroyed your home and
you are the sole survivor.
6
You were stolen from the workshop where you were
made and lived as a slave for 1d6 years.
7
Goblins captured you and almost took you apart
for scrap materials. You have replaced your missing
components with bits of wood, old weapons, and
other rubbish.
8
You were left to find your own way in the world
when your maker died.
9 You fell off a boat and spent 2 years walking to shore.
10 You worked to fulfill your purpose for 1d6 years.
11
Choose a member of the group. That character
found you and turned your key. You owe that
character a debt.
12
You were one of 1d6 other clockworks made at the
same time. You hope to find them one day.
13
You were made to be a translator. You can speak
one additional language.
14
You were made to be a scribe. You know how to
read and write the Common Tongue.
15 Your maker set you free to find your destiny.
16
You can’t remember your past. You don’t know
where you came from or how you came to be where
you are.
17 You built a lasting monument in your community.
18
You found a cryptic message inside your body. You
have not yet deciphered its meaning.
19 You have a sword grafted to one of your arms.
20 You came into money and start the game with 2d6 cp.
Clockwork Personality
3d6 Personality
3
You hate living things and take pleasure in pulling
them apart.
4 You are terrified of becoming dormant.
5–7
Your body gives you power and strength. You use it
to enforce your will on others.
8
You didn’t ask for this existence, but you make the
most of it while you have it.
9–13
You search for meaning in a world in which you have
no place.
14
You were made to serve. You commit your
existence to aiding others.
15
You don’t know how you fit into this world, but you
will spend your life trying to find out.
16–17
You obey the instructions of anyone you deem to be
an authority.
18
Your maker gave you three commandments and you
must obey them.
```

### Darkling

- **Entry Type:** Standard Ancestry
- **Source:** Scions of the Betrayer
- **Source Page:** 4
- **PDF Page:** 6

```text
Darkling
The faeries who chose to remain behind and follow the Betrayer in his war
against the Edene invaders paid a terrible price. Faced with an implacable foe
with superior numbers, the Betrayer made an unwise bargain with the Devil
to even the odds. But instead of a great triumph over the hated God-Queen,
the Betrayer met defeat and a humiliating death at her hands, and all those
sworn to his service who survived remained bound by the diabolical pact.
Scattered across Rûl, these beings are irrevocably sullied by corruption and
burdened with an undying hatred for humankind.

Now known as darklings, these corrupted fairies and all of their
descendants have been twisted by darkness into spiteful, malicious creatures.
The darklings are forever bound to Diabolus, driven by the ancient pact the
Betrayer made to harvest mortal souls and send them screaming to Hell. The
hate and corruption that fills their hearts eternally consumes them—they are
foul monsters who are cruel, wicked, and thoroughly evil.
Devils: The terrible oath the Betrayer swore to the Devil doomed
himself and all the faeries who served him to an eternity of service to
Hell, transforming them all into devils, twisted beings who feed on the
corruption staining mortal souls and revel in torturing and destroying these
mortals whenever they can. Although most devils live in Hell, darklings
remain in the mortal world, where they work as agents of the Lord of Lies,
charged with corrupting as many mortals as they can, and dispatching
their corrupted souls to Hell. While a very few darklings struggle to resist
the obligations imposed on them by the Betrayer’s oath, the overwhelming
majority embrace their evil nature, proudly counting themselves as one of
mankind’s greatest foes.
Exotic and Alien: As with all faeries, darklings possess a strange,
otherworldly beauty, one many mortals find captivating, if extremely
unsettling. Darklings show their immortal heritage in odd (by human
standards) physical characteristics, such as having pointed ears, scaly
skin, fangs, fur, elongated fingers and toes, or some combination of these
traits. Beyond these features, all darklings bear some mark or sign of their
corruption. These marks of darkness vary wildly, some obvious, others
subtle, but all reveal them as eternal slaves bound to the Betrayer’s pact
with the Devil.
Most darklings, regardless of gender, stand about 4-1/2 feet tall, and weigh
around 120 pounds.
Menacing Presence: A palpable feeling of menace radiates from all
darklings, a manifestation of the malice that burns in their hearts and
the obsessive hatred they bear for humans. Wickedness exudes from
them, causing others who are not devils or otherwise corrupted beings to
instinctively flinch away from them, as if they can feel the darkness oozing
from the darklings’ pores. Reactions to spending time around darklings vary:
some can feel the hairs on their necks stand up or a sudden cold chill, while
others get nauseous or gripped by an overwhelming sense of panic.
Eternal Evil: Like other faeries, short of violence or mishap, darklings live
forever. Upon reaching maturity, they stop aging and remain at that physical
state for as long as they manage to stay alive. Being trapped in the mortal
world means any mortal children they abduct are never at risk of becoming
faeries. For this reason, darklings have little interest in snatching babes
from their cribs; they’d much rather silence them with a sharp knife than
let humans continue to increase their numbers. The nature of the pact that
binds them to Diabolus, however, acts as some restraint in keeping them from
wildly murdering every innocent mortal they encounter; whenever possible,

they seek to inflict as much corruption
as possible upon the mortal’s soul before
sending them on their way to Hell. That
darklings themselves have few children
just means they are even more cautious
about taking risks, knowing that reckless
action could mean their extinction.
Forgotten Lives: Although darklings
are immortal, there are limits on what
memories they can retain over time;
their minds can only hold so much.
As the years pass, old memories fade
to make room for new ones, and all
but the most important experiences
disappear. This forgetting results
in darklings living many different
lives over time, with many different
interests and abilities. For example,
they might study magic for a century
only to lose interest and take up
swordplay. As their mastery at arms
increases, their command of magic
weakens until they forget they ever
knew spells in the first place. Once
they get bored with honing their
skills at arms, they might move on
to some new interest, and their older
abilities fade as new ones are learned.
Mad Obsession: As committed as they are
to exacting their vengeance upon humans, most
darklings also become preoccupied with certain
obsessions. Some darklings crave pain and pass
their days mutilating their bodies for the sick
pleasure it brings them, while others wallow in
sorrow, lamenting what has been done to them.
Their obsessions color everything they do, and
when not committed to performing particular
tasks or services, darklings spend as much
time as possible indulging their obsessions.
Common Names: Darklings
choose names for themselves
from things they find
particularly interesting, ugly,
or hurtful. Example names include Scream
of a Dying Child, Widow’s Tears, Foulest Semen, Morbid Feast,
Pangs of the Starving, Innocent Blood, and Father’s Ashes.

Creating a Darkling
Starting Attribute Scores
Strength 9, Agility 10, Intellect
10, Will 8; choose two different
attributes and increase each by 1
Perception equals your Intellect
score + 1.
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter
your Health, round down
Size 1, Speed 10, Power 0
0 Damage, 1d3 Insanity, 1d3 + 1
Corruption
Languages and Professions
You speak, read, and write
Elvish and High Archaic.
You might gain additional
professions based on your
starting age.
Immune damage from disease;
charmed, diseased
Shadowsight You see into areas
obscured by shadows as if those
areas were lit.
Devil You are a devil, and you take
half damage from fire.
Menacing Presence Your magical
nature manifests as a palpable
aura of menace. You make
attack rolls in social situations
to threaten or intimidate with
1 boon.
Spell Defense You take half damage from spells and you make challenge rolls to
resist spells with 1 boon. A creature attacking you with a spell makes the attack
roll with 1 bane.
Iron Vulnerability You are impaired while you are in contact with iron. In addition,
if you touch or are touched by an object made from iron, you lose Menacing
Presence and Spell Defense for as long as you remain in contact with the object
and for 1 minute afterward.
Marked by Darkness You begin the game with one mark of darkness. Roll on the
Darkling Marks of Darkness table to determine the form it takes.
Level 4 Darkling Expert
You gain one of the following options.
Characteristics Increase your Health by 4.
Magic You learn one spell.
Darkling Ages*
d20 Age in Years
1–6 1d20 + 30
7–20 1d20 × 50
*For every two centuries you have lived, add either one darkling profession to your list
of professions or one language to your list of known languages.

Darkling Builds*
3d6 Build
You’re short and slender. Reduce your Size to 1/2, your height by 5d6 inches
and your weight by 2d20 + 10 pounds.
4–5
You’re short and either heavy or slim. Reduce your height by 3d6 inches and
either increase or decrease your weight by 4d6 pounds.
6–8 You’re short. Reduce your height by 3d6 inches and your weight by 2d6 pounds.
9–12 You’re of average height and weight.
13–15 You’re tall. Increase your height by 3d6 inches and your weight by 2d6 pounds.
16–17
You’re tall and either heavy or slender. Increase your height by 3d6 inches
and you can increase your weight by 3d6 pounds.
You’re tall and muscled. Increase your height by 4d6 inches and your
weight by 2 pounds for each inch increased.
*Regardless of gender, your base height is 1d6 + 51 inches tall and your base weight is
1d20 + 110 pounds.
Darkling Faerie Marks*
d20 Faerie Mark
1 You appear two-dimensional from behind, nothing more than an image of a
person. Clothing that you wear conforms to your appearance and returns to
normal when it is removed.
2 Thorns grow out from the top of your head.
3 Your eyes are pools of darkness.
4 You have unusual skin color.
5 You have a tail of a cow, fox, cat, horse, or dog.
6 Your breath always mists.
7 Odd whorls and symbols appear to have been carved in your skin.
8 You appear to have been carved from stone.
9 You have unusually long fingers or toes.
10 You have pointed ears.
11 You have no body hair whatsoever.
12 Your hair is made of feathers.
13 You always appear cloaked in shadows, though they do not obscure you.
14 Fur covers your body.
15 You have the legs of a frog, fox, grasshopper, or of some other animal.
16 You have vestigial bat-like wings sprouting from your back.
17 You have a pair of sharp horns sprouting from your forehead.
18 Your skin moves as if there was something sliding around underneath it.
19 Your body appears to be made from wood.
20 You have a forked tongue.
*You can have up to three marks.

Darkling Quirks
d20 Quirk
1 You speak in a raspy, whispery voice.
2 Blood always leaks from one or both of your eyes.
3 You have a chilling laugh.
4 You always smell of the grave.
5 You are an albino.
6 Your hair writhes when you are in the presence of iron.
7 The name of every human you have killed appears somewhere on your body.
8 Cockroaches infest your person and sometimes fall from your body.
9 Your shadow never matches your movements.
10 If you touch a small animal for more than a minute, it sickens and dies.
11 You tremble.
12 You pepper your normal speech with foul curses.
13 You have long nails that always remain at the same length regardless of
how often you trim them.
14 You bear several awful scars from your encounters with your enemies.
15 Normal flames within short range of you flare and spark.
16 You always appear filthy, as if you have never washed.
17 In sunlight, you appear as a corpse.
18 Whenever you walk in nature, plants touched by your feet wither and die.
19 Ravens always seem to hang around you, squawking and making a mess.
20 Faint silvery lines track across your skin, as if slugs have been crawling all
over your body.
Darkling Obsession
d6 Obsession
1 Sorrow
2 Hatred
3 Pleasure
4 Pain, giving or receiving (your choice of either or both)
5 Vengeance
6 Lust

Darkling Personality
3d6 Personality
3 Darkness claimed you, transforming you into a monstrous thing, though it
might not be evident by merely looking at you. You actively work to make
the lives of people around you worse, spreading pain, terror, and despair
wherever you go. You revel in the chaos and the horror you create and no
act is so foul for you to consider it taboo.
4–5 You are a diabolical monster, an immoral force for evil in the world. Fully in
league with the Devil, you seek to corrupt as many mortals as you can, to
ensure they fall screaming into Hell.
6–8 Malicious and hateful, you direct your efforts toward destroying your
enemies. Destruction is not enough for you, however. You want to make
them suffer first. You kill pets, murder children, lead loved ones into such
horror they go mad. Only when you have thoroughly broken your enemies
do you relent by dragging the knife across their throats.
9–12 Your hatred bubbles just under your surface and you lash out with little
provocation and often for no reason at all.
13–15 You regret what you have become and see yourself as a monster. You
strive to shake off Hell’s chains, but you know you are damned no matter
what you do.
16–17 You fight against the darkness in your heart and work to be an agent of
good in the world. You suppress your impulses and try to make peace with
those around you.
18 Remorse fills your heart and drives you to make amends for the horrors you
have unleashed on the world. You strive for redemption, to earn back your
place among the faeries, and to rid yourself of your infernal burden.

Darkling Marks of Darkness
d20 Mark of Darkness
1 Six flies constantly buzz around you, periodically landing on your open eyes.
If you kill any, more come to take the place of the fallen moments later.
2 Your laughter sounds like crying children.
3 Your sexual organs carry a horrific disease. Any creature with whom you
have sexual congress must get a success on a Strength challenge roll with
1 bane or become diseased. Each time a creature diseased in this way
completes a rest, it must repeat the challenge roll, receiving no benefit from
completing the rest on a failure. After six successes, the creature removes
the diseased affliction.
4 Your flesh is cracked and riddled with fissures that exude foul-smelling pus.
5 Once a year, a pregnant woman within 1 mile of you gives birth to a small
monster that kills her and then goes on a rampage until it is put down.
6 A second mouth appears on your neck and whispers awful things to you
while you sleep.
7 Your eyes push themselves out of your head and orbit your skull. Their new
positions do not affect your vision.
8 Vomit-pink mites infest your body. When you sleep, they sometimes arrange
themselves to spell out the nature of your crimes.
9 You cannot hold down anything you eat. You do not need to consume food,
but you still hunger for it.
10 Other faeries are always hostile to you.
11 You spoil any food you touch, causing it to become poisonous to any
creature that consumes it. A creature that eats the food must get a success
on a Strength challenge roll or take 1d3 damage and become poisoned for
1d6 hours.
12 Whenever you kill a living creature with a soul, the body rots, forcing each
creature that can see it to make a Will challenge roll. A creature becomes
immune to this effect on a success, or gains 1 Insanity on a failure.
13 You vomit up maggots whenever you laugh.
14 Faces of people you have killed sometimes appear in fires that burn within
short range of you.
15 Whenever you urinate, a centipede scuttles out from your urethra.
16 All of your teeth are black and pointed.
17 Your body hurts all the time. When you take damage, you take 1 extra
damage.
18 Your bones shift and pop, rearranging themselves to make you appear
weird and monstrous.
19 The skin from your body pulls itself away leaving just muscle and bones
behind.
20 An extra arm grows out from the back of your body, over which you have
no control.

Darkling Backgrounds
d20 Background
1 You or your ancestors fought the trolls long ago.
2 You had many lovers among the First People and you took up with the
Betrayer after the Edene slew them all.
3 The Edene captured and tortured you for years. By the time you escaped,
you were horrifically scarred.
4 You stole a baby from a human family and drowned it in a pool of your
urine. Gain 1 Corruption.
5 You once saved the Betrayer’s life by shouting a warning. He rewarded you
with an enchanted object that you still carry with you.
6 You keep the bodies of several smaller faeries you killed preserved
in embalming fluid to prevent their souls from ever decaying. Gain
1 Corruption.
7 You frequently sought out mortal newlyweds and murdered the husband
or wife on their wedding night. Gain 1 Corruption.
8 You spent years inflicting torments on mortals to discover new ways of
making them suffer. You have left a trail of mutilated and maimed people
behind wherever you go.
9 You spent many years living in Hell, playing politics with the other devils to
advance your position and gain power. After a misstep, you fled the place
before your enemies could destroy you.
10 Against your better judgment, you fell in love with a mortal. When the
person spurned your attentions, you killed him or her, but not before you
killed everyone the mortal loved.
11 Fighting the ennui that comes from years spent in isolation, you committed
yourself to pleasure and have indulged in every vice you could find that
would stimulate your senses.
12 You traveled to Alfheim to beseech forgiveness from the Faerie Queen and
to claim your place among your people. You were humiliatingly refused and
cast out, and now hate other faeries as much as you hate humans.
13 You have the Devil’s favor and he sometimes watches your exploits shown
on the surface of the blood he sips from his Chalice of Hate.
14 You were a companion of the Betrayer or descended from one of his
companions. You vow to continue the struggle against the Edene.
15 A diabolist used dark magic to summon you and bind you to his or her
service. Little more than a plaything and a slave, you eventually won your
freedom when you led your summoner into danger.
16 You formed a cult devoted to the worship of the Devil and, through your
efforts, you condemned many humans to spend their afterlife in Hell. Gain
1d3 Corruption.
17 You delight in pain and have several wounds in your flesh you prevent from
healing to ensure you’re always stimulated.
18 You have been plotting against Alfheim for years and hope to tear open the
borders to the Void and allow the demons to invade and destroy that hated
place. Gain 1 Corruption.
19 You aided and abetted a mortal in summoning a demon that wound up
destroying him. Gain 1 Corruption.
20 You lived among the goblins and found them useful agents in your work to
spread chaos and destruction.

Darkling Motivations
d20 Motivation
1–2 You witnessed the destruction wrought by one or more demons at some
point in the past. As demonic incursions have been increasing thanks to the
shadow creeping across the land, you felt moved to set aside your grudges
and take up arms against darkness more evil and more ruinous than you.
3–4 After being robbed by cultists, adventurers, or someone else, you set out
to regain what is yours. You scour the lands for signs of your purloined
possessions and you won’t stop until you get them back.
5–6 You consulted a hag who told you that dark times were coming to the world
and that you would play some major part in the crisis.
7–8 A faerie lord or lady sought you out and recruited you to help them fight
against the horrors being loosed in the world. In return, they promise to
help cleanse you of your Corruption and welcome you to one of the hidden
kingdoms.
9–10 A mortal, by intent or accident, learned your true name and whisked you
away to serve as the mortal wishes. You are bound to that mortal for seven
years and seven days and must do as ordered. Luckily, your binder sets you
loose to be his or her agent.
11–12 A herald of Diabolus found you and pressed you into service with other
characters. You might be a spy, feeding the dark lord information about
these characters, or an integral part of the team, your talents necessary for
whatever great quest they undertake.
13–14 You spent centuries destroying lives and now, it seems, you have lost your
taste for all things related to your hatred. You set out to do something
different.
15–16 You and the other characters come together to confront a mutual threat,
something that poses great danger to all of you.
17–18 Another darkling betrayed you and now you seek revenge. You join up with
the other characters to get it.
19–20 You have so much blood on your hands, so many screams in your ears, you
feel as if you are sliding into madness. The only hope for you is to break
your ties to the Devil and somehow find redemption in this chaotic world.
Darkling Professions
Darklings live on the shadowed borders between the mortal world and the
hidden kingdoms, and thus their lives are such that some professions found
in Shadow have little appeal or meaning for them. When rolling to determine
your starting professions, use the Darkling Profession table instead of the
tables included in the main rulebook.
Darkling Professions
d20 Profession
1 Artist. Choose a medium from painter, poet, sculptor, or writer.
2 Burglar
3 Carouser or sot
4 Charlatan or confidence artist
5 Cultist
6 Dilettante

7 Entertainer. Choose a style from actor, dancer, fool, orator, singer, or storyteller.
8 Exile or hermit
9 Gambler
10 Hunter
11 Murderer
12 Musician. Choose an instrument style from percussion, string, or wind.
13 Nomad
14 Outlaw
15 Saboteur
16 Scholar. Choose one area of scholarship from architecture, astrology, folklore,
geography, history, magic, medicine, navigation, occult, philosophy, nature, or war.
17 Soldier
18 Spy
19 Torturer
20 Tracker
Character Interactions
Given their antithetical stance toward humanity, it’s a wonder darklings ever
become involved in human affairs beyond sowing discord and spreading
misery among them. While it’s true that many darklings exist as little more than
mankind’s enemy, some have realized, with the coming of the Shadow, that the
world’s needs dwarf their hatreds and the destruction of the world means their
extinction as well. As the enormity of the threat the Demon Lord poses begins
to dawn on them, some darklings can set aside their hate for a time to work
alongside their enemies in the hope of overcoming common threats.
But alliances darklings make with other peoples rarely last for long. Not
unlike cambions (see Exquisite Agony), darklings see it as their duty to lead
others into darkness by tempting them to perform evil acts, peer into forbidden
places, and do anything else that would sully their souls. After they have dealt
with their common threat, darklings are quick to turn against their one-time
allies, doing whatever they can to send their darkened souls screaming to Hell.
Darklings and Mortals
As much as darklings loathe humans, some can still recall a more peaceful
time when their two peoples lived in harmony. Darklings might show
restraint when interacting with a person who shows obvious signs of
descending from the First People or who keeps their erstwhile allies’ ancient
customs and beliefs. Such restraint, however, should never be taken as doubt,
hesitation, or weakness—darklings will still seek to corrupt and kill humans,
regardless of their origins.
The hatred that darklings have for humans does not fully extend to other
mortal peoples. Darklings, like other faeries, have little reason to interact
with dwarfs or jotun, since both of those peoples reek of the iron all faeries

despise. The avoidance darklings display toward such peoples does not
signal loathing, but rather a move toward self-preservation driven by their
unfamiliarity with their kind. As for halflings, darklings have no conflict with
them and tolerate their presence.
Darklings take a special interest in fauns, especially those they sire on
mortals. Usually society’s castoffs, fauns have no place to call their own, a
predicament darklings are only too happy to exploit. Darklings lure fauns
into their employ with promises of affection, shelter, and wants met, and
then, over time, twist them toward darkness.
Darklings and Faeries
Corruption might stain their souls, but faeries the darklings remain.
Darklings regard their estranged kin with a mixture of suspicion, fear, and
sometimes hate. Titania’s refusal to come to either their or the Betrayer’s aid,
and eternal consequences of their foul pact with Diabolus have left them
abandoned and shunned by most of their kind, the ancient bonds between
them severed. For this reason, many darklings vex the faeries of the hidden
kingdoms nearly as much as they do humans, which only widens the gulf
between them.
Darklings place great value in changelings and exploit them for their
magical natures. Changelings can help darklings infiltrate human
settlements, gather crucial information, or sometimes just embed themselves

in such societies until the darkling calls upon them. As noted above,
darklings rarely take mortal children and leave behind a changeling;
whenever they do, these creations rarely last and prove troublesome, foul,
and unsettling until the magic quickly fades from them.
Goblins flock to darklings and can reliably find service as their henchmen,
assistants, and agents. Darklings might recoil from certain goblin practices,
but they can overlook their cousins’ flaws to see the commonalities between
them. After all, both are denied their places in the hidden kingdoms and
must make do in a hostile world.
Darklings and Other Peoples
Darklings have little reason to interact with clockworks. In fact, the
darklings find the mechanical beings’ existence extremely disturbing
since the souls bound to their machine bodies are often summoned
forth from the Underworld or Hell without having fully forgotten their
old lives. This process of cleansing, darklings know, balances the scales
between mortals and immortals, ensuring that mortals can never attain
the same heights as immortals can. Fetching uncleansed souls and
embedding them in created bodies gives mortals a way to extend their
lifespans and preserve their identities indefinitely, even if most mortals
haven’t quite figured that out yet.
Orcs fascinate darklings, despite the fact that most orcs wear armor and
wield weapons forged from iron and steel. Darklings see orcs as the architects
of humanity’s demise, a people just as contaminated as the dark faeries, who
have also been driven to avenge centuries of abuse, exploitation, and horror
dealt to them by human hands. The darklings aid and abet orcs when they
can, delighting in the chaos created by orc warbands on the march. Darklings
are often found in the company of orc commanders, where they serve as
shadow advisors, informants, and assassins.
The undead pose a significant threat to the world’s natural order.
By circumventing the process of life-death-rebirth, these unnatural
abominations create fissures in reality’s bounds by their mere
existence alone. Darklings destroy any undead they encounter without
compunction, and might even be moved to help peoples they would
normally treat as enemies to destroy a horde of shuffling corpses or to
help put an end to a vampire’s vicious and bloody reign.
Finally, darklings tend to regard elemental peoples neutrally. The
elementals have been no threat to the faeries since the time when the
genies created the Urth, and their diminishing numbers suggest their
presence in the world is slowly fading. They might occasionally align
themselves with salamanders or gnomes for a common purpose, but have
few opportunities to mingle with sylphs or undines.

Darkling Weapons
Like all faeries, darklings recoil from objects made from iron or iron alloys
and cannot bear to handle such items, even when wearing gloves or using
some other kind of covering. Iron weapons played a considerable part in
the darklings’ defeat at the hands of the Edene: faerie weapons either broke
against the Edene’s iron shields or could not pierce their armor, while the
faeries themselves suffered great agony at the merest touch of this foul metal.
The darklings have had centuries to reflect on their defeat, particularly
upon the role iron weapons and armor played in it, and have since devised
new materials and methods to fashion arms and armor with which they can
effectively even the odds.
Boneweave
Faeries have always used bone in the creation of arms and armor, but
darklings have devised a way to make the material more resilient when used
against foes wearing and wielding iron. The ingenious use of magic from
the Necromancy tradition allows “self-healing” weapons, whose cracks and
chips fill themselves in as they occur, ensuring the weapon does not shatter
on impact with a harder material. A byproduct of this technique causes
eerie moaning sounds to emanate from the weapons when swung in battle,
an effect that works to demoralize and even terrify an opponent. Only basic
weapons, military melee weapons, and swift weapons can be made from
boneweave. They sell for the same price as ordinary weapons, but count as if
they were exotic.
Wyrdwood
More common among the elves of Alfheim and other hidden kingdoms, the
secrets of wyrdwood have found their way to darkling artisans who harvest
the material from the sacred wyrd trees found growing in old forests touched
by faerie magic. These enormous trees grow hundreds of feet tall, their bone-
white trunks up to 18 feet in diameter. So ancient and sacred are the trees
that not even the darklings dare harm them, lest they invite the wrath of the
leshys who protect them. Instead, petitioners come before the trees and lay
out the reasons for their need. If the tree accepts their arguments, the pale
bark separates and out comes the desired weapon, fully formed and ready to
serve. A tree can give such a gift only once every thirteen years, so wyrdwood
weapons are extremely rare and highly prized.
A weapon made from wyrdwood has the hardness of steel while weighing
almost nothing. They take the forms of basic weapons, military melee
weapons, or swift weapons. They are never sold, but are instead given as gifts
to worthy wielders or taken from the corpses of their former bearers. Most
wyrdwood weapons are enchanted objects.
```

### Dhampir

- **Entry Type:** Standard Ancestry
- **Source:** Blood Scions
- **Source Page:** 2
- **PDF Page:** 2

```text
Dhampir
Dead blood mingles with living in the dhampirs’ veins. A
people walking the thin line between life and death, their
unnatural heritage grants the benefits of both with few
of the drawbacks. Dhampirs arise from unlikely unions
between humans and vampires, an existence made possible
by dark magic unleashed upon the world in ancient times
by the Men of Gog.
Blighted Bloodlines: That dhampirs even exist baffles
occultists. The seed of vampires is as cold and as lifeless as
their blood, and no mortal seed should find purchase in
dead wombs. And yet exist dhampirs do.
Dhampirs arose among the Men of Gog not long after the
necromancers created the first vampires. Frustrated by the
flaws in their original design, those weaknesses revealed
when vampires stepped into the purifying rays of sunlight
or dared to cross running water, the necromancers worked
to restore some vitality to their undead creations. Much of
their experiments resulted in terrible failures; causing a
shriveled dead heart to beat or filling collapsed lungs with
air merely made the vampire’s existence more difficult
and painful. Mounting losses and the destruction of fine
specimens turned the necromancers from this course of
research, but not before a few vampires’ sexual organs
were reinvigorated by the same magic used to restore some
functionality to other organs.
Armed with the ability to sire offspring, the vampires
went about the business of doing so, making willing and
unwilling partners of slaves harvested from raids into the
south. Few vampire or human wombs delivered viable
offspring, though; most such spawn slithered forth already
dead or twisted beyond all recognition, yet some did survive
and grow to adulthood.
Dhampirs pass down their accursed blood to their
offspring, whether they carry the child or get one on
another. Children born of these unions do not often
survive, and even those who do bear some malady. But
enough have lived to create a small but stable population
that has survived in Rûl, albeit secretly, to the present day.
Blood and Flesh: Dhampirs have all the same appetites
that humans have and can sustain themselves on food and
water without harm or discomfort, but all must contend
with a relentless craving for blood. Like a drug, fresh blood
elevates them to an ecstatic state that leaves them pining
for more. Decadent dhampirs indulge themselves all the
time, but most strive for temperance, feeding only when the
thirst becomes too strong to ignore.
Twisted Beauty: There’s beauty to be found even in
the most malformed dhampirs. What parts escaped the
tortured corruption of their gestation are lovely, even if
only their eyes and hands. Dhampirs born without physical
infirmities are striking, handsome at the least, causing
hearts to flutter and snatching the eyes from even the most
smitten of lovers, attracting attention wherever they go.
Dhampirs appear human even under the closest scrutiny,
but their alluring façade falls away when the pangs of
hunger grow too great to be ignored. Their faces contort
into bestial masks, while their teeth lengthen and eyes
shine brightly, gleaming even in the deepest darkness.
Hidden Threats: One might think dhampirs, given their
unnatural heritage, would avoid human settlements and
lands. Some do withdraw from civilization, preferring
to pass their days in isolation, but most dhampirs crave
human companionship and seek out crowded places. Such
environments allow dhampirs to hunt prey, taking lives that
will never be missed or their disappearance questioned,
and then resume their daily routines.
Dhampirs do, however, avoid the company of others
of their kind, especially undead. Congregating with
other half-bloods introduces unwanted and unnecessary
competition into their lives. Dhampirs have little reason
to seek out true vampires for company. The undead make
little distinction between dhampirs and humans when it
comes to feeding, and some vampires prefer the flavor of
dhampir blood to other vintages.
Dhampirs must be vigilant about hiding their natures
from others lest they invite attention from those who would
destroy them. The Cult of the New God takes a dim view
toward undead of any kind and, though these half-bloods
are alive, inquisitors and witch hunters rarely make a
distinction. Furthermore, the fear most people rightly have
of undead makes any divulgence of the truth risky at best.
Such a revelation can shatter even the closest bonds.
Magnetic Personalities: Not only do many dhampirs
enjoy attractive features, they also benefit from strong
personalities that others find appealing. They make friends
easily, rarely want for romantic partners, and find enemies
only in those they have spurned. Dhampirs can rely on
their magnetic personalities to insulate themselves from
people who might harm them, as well as to advance their
ends in whatever communities they inhabit. On certain
companions they might feed, but only after they have so
thoroughly bound those souls that the revelation of their
nature cannot possibly put themselves at risk.
Creating a Dhampir
Starting Attribute Scores Strength 10, Agility 10, Intellect
10, Will 10
Perception equals your Intellect + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health score
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 1 Corruption
Languages and Professions You speak the Common
Tongue.
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Sunlight Weakness You are impaired while you are in areas
lit by sunlight.
Undead Heritage You count as undead for effects that
specifically affect undead. You take half damage from
disease and poison and you make rolls with 1 boon to
avoid or remove the diseased and poisoned afflictions.
Unnatural Allure In social situations, you make attack rolls
with 1 boon.
Frenzied Hunger When you would use an action to make
a melee attack of any kind, you can choose to surrender
to your hunger. Upon doing so, you become monstrous,
forcing each creature that can see you to make a
Will challenge roll. On a failure, the creature becomes
frightened for 1 round. You remain monstrous until you
consume any amount of blood from a creature other
than yourself.
Unholy Inheritance You gain a randomly determined
physical trait from your vampiric bloodline. Roll a d20
and find the result on the Unholy Inheritance table.
Level 4 Dhampir
Health +4
Replace your shadowsight trait with the darksight trait.
Darksight You see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Fury of the Vampire When you use your Frenzied Hunger
trait, you gain the following benefits:
Fangs Your teeth lengthen into fangs, becoming
natural weapons with the finesse property that deal 1d6
damage.
Horrid Aspect You impose 1 bane on rolls made to
attack you by creatures that can see you. Creatures
immune to the frightened affliction are unaffected.
Blood Drink When you deal damage with your fangs to
a living creature you have grabbed, you immediately heal
damage equal to your healing rate. You can use Blood
Drink a number of times equal to half your group level
and regain expended uses when you complete a rest.
Unholy Inheritance
d20 Inheritance
1 You cast no shadow.
2 You do not reflect in mirrors that have silver
backs.
3 One of your arms or legs is smaller than the other.
4 You have an odd odor.
5 You sweat when in the presence of religious icons.
6 You have golden eyes with cat-like pupils.
7 Fine hair grows on your palms.
8 You have an abnormally long tongue.
9 Your face lacks symmetry and one side droops.
10 You are double-jointed throughout your body.
11 Your teeth appear to have been filed to sharp
points.
12 You have pointed ears.
13 You have a deathly pallor.
14 Your hair cannot be cut.
15 Holy water and silver burn your skin.
16 In sunlit areas, your skin reveals a complex pattern
of markings that cover your entire body.
17 Your eyes glow in the dark.
18 You have extremely long nails that, when cut,
grow back after you complete a rest.
19 Animals within short range of you become
nervous and try to withdraw from your presence.
20 When you weep, blood drips from your eyes
instead of tears.
Dhampir Age
3d6 Age
3 You are a child, aged 11 years or younger.
4–5 You are an adolescent, from 12 to 17 years old.
6–8 You are a young adult, from 18 to 40 years old.
9–12 You are an adult, from 41 to 80 years old.
13–15 You are a middle-aged adult, from 81 to 120 years
old.
16–17 You are an older adult, from 121 to 160 years old.
18 You are a venerable adult, aged 161 years or older.
Dhampir Build
3d6 Build
3 You are short and either thin or heavy, as you
choose.
4–5 You are somewhat short, but of average weight
for your height.
6–8 You are slender, though of average height.
9–12 You have a typical build, both in height and
weight, for a human your age.
13–15 You are heavy for your height.
16–17 You are tall, but of average weight for your
height.
18 You are extremely tall and either thin or heavy,
as you choose.
Dhampir Appearance
3d6 Appearance
3 Your hideous appearance unsettles others.
4–5 A minor physical infirmity makes you look strange.
6–8 You lack the customary good looks of other
dhampir, but you pass for human.
9–12 You have many fine physical qualities, making you
better looking than most others.
13–15 Attractive, you turn heads wherever you go.
16–17 You are one of the true beauties in the world.
18 You possess an almost alien beauty, one that is
both alluring and unsettling.
Dhampir Personality
3d6 Personality
3 You embraced your dark heritage and have
become a monster. You feed your excesses
whenever you can and you take pleasure
in making others suffer. There is no act too
despicable for you to at least consider doing.
You are a true villain.
4–5 You are the only person who matters. Everyone
else exists to serve your needs. You take what
you want, do what you want, and damn the
consequences.
6–8 You have little concern for other people. You
might experience the occasional pang of
conscience, but you usually ignore it.
9–12 You see to your own wants and needs before you
concern yourself with others.
13–15 You are generous and friendly, and look after
others as much as you do yourself.
16–17 You have the very best intentions and see your
existence as a terrible curse. You try to fight
against the darkness in your heart by doing good
in the world.
18 A moral paragon, you have an unimpeachable
character. You always do the right thing when
possible, and you are willing to help others even if
it means harming yourself.
Dhampir Background
d20 Background
1 A witch hunter discovered the truth about you,
hunted you down, and captured you. Rather than
turn you over to the inquisitors or put you to the
torch, the man became enamored with you and
his amorous attentions made you suffer. You
eventually escaped after killing him and have been
on the run ever since.
2 You only recently discovered the truth of who you
really are. Now that you have a taste for blood,
the need for more occupies your every waking
thought.
3 You traveled into the Desolation to seek a way
to purge your body of its foul taint. You returned
shaken by what you experienced there.
4 You spent many years in a Confederacy city,
surrounding yourself with lovers and friends,
sampling the best that life offers. When your
nature was exposed, you lost everything and had
to flee for your life.
5 You spent many years learning all you could
about vampires so you could kill them and remove
their stain from the world.
6 In the heat of passion, you lost control and killed
your one true love. You carry the guilt and shame
of the act with you, cursing yourself for a monster.
7 Witch hunters found and killed everyone in your
family. You escaped the violence after your
mother hid you in a wall. You have vowed to kill
each hunter involved.
8 You traveled widely, moving from place to place,
to stay ahead of the people who hunt you. You
did something in your past that made you many
enemies, and now they scour the lands for you. If
they catch you they will kill you.
9 You joined bandits in raiding caravans and killed
many people.
d20 Background
10 You have done your very best to hide among
humans in a small village, keeping your nature a
secret. Someone found out about you, though,
and the local priest tried to stake your heart. You
fled, mourning the life you lost.
11 You were abandoned as a child and somehow
managed to survive until you reached your
present age. Perhaps faeries watched over you or
wolves raised you. The civilized world is strange
to you and makes you uncomfortable when in it.
12 Fearing your unnatural existence, you locked
yourself away, passing the years in study and
meditation.
13 You embraced your vampiric heritage. You lived
in a tomb, slept in a coffin, and fed on the living.
14 Pretending to be human, you joined the Cult of
the New God and became one of its most popular
acolytes.
15 You tried to bury your heritage and live a normal
life. You took a spouse and had children, but
your last child was born a monster. You fled the
community with your family, but your spouse
betrayed you and you lost them all.
16 To quell your cravings for blood, you indulged in
every vice you could find, wrecking your body
and your mind.
17 You spent time living among ghouls as their
regent.
18 You killed someone for money. You found you
were good at that work and have set out to
improve your skills.
19 You spent a few years as part of a vampire’s
entourage. You grew to hate your master and left.
20 You spent months in an asylum after you went to
seek help for your affliction.
```

### Dwarf — For Gold and Glory

- **Entry Type:** Expanded Ancestry
- **Source:** For Gold and Glory
- **Source Page:** 7
- **PDF Page:** 7

```text
Dwarf Characters
Shadow of the Demon Lord includes everything you
need to create a dwarf character. Using the rules in
that book, you can make a character rapidly with
just enough information to portray the character
in the game. Here, you will find advanced rules for
making dwarfs, with alternate features and a slew
of tables to develop your character’s background. If
you use the rules presented here, it’s important to
use the supporting tables as they help you flesh out
your character and determine your professions, the
languages you know, and your starting equipment.
Creating a Dwarf
Choose an Attribute Scores option
Random Attribute Scores Strength 8 + 1d3, Agility 7
+ 1d3, Intellect 8 + 1d3, Will 8 + 1d3
Standard Attribute Scores Strength 10, Agility 9,
Intellect 10, Will 10
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score + 4
Healing Rate equals one-quarter your Health
Size 1/2, Speed 8, Power 0
Languages and Professions You speak, read, and
write Dwarfish.
Darksight You can see in areas obscured by
shadows and darkness within medium range as
if those areas were lit. Beyond this distance, you
treat darkness as shadows and shadows as lit.
Hated Creature Choose a creature from the Hatred
table. Your hatred grants 1 boon on attack rolls
made against creatures you hate.
Robust Constitution You take half damage from
poison. You make challenge rolls with 1 boon to
avoid or remove the poisoned affliction.
Level 4 Dwarf Expert
Characteristics Health +6
You learn one spell from a tradition you have already
discovered or gain one of the following talents.
Shake it Off You can use an action to heal damage
equal to your healing rate and remove one of
the following affliction: fatigued, impaired, or
poisoned. Once you use this talent, you cannot use
it again until after you complete a rest.
Sturdy as the Mountain You ignore the Strength
requirements for wearing armor and using
weapons. In addition, whenever you would be
knocked prone, you can use a triggered action to
make a Strength challenge roll. On a success, you
do not fall prone.
Dwarf Development Tables
You can use the tables presented here to create a
dwarf character with a detailed background. If you
use these tables, do not roll for random starting
professions or starting wealth using Shadow—use the
tables included here instead. You must roll dice for
each table and take the results from each roll.

8
Family Tables
The family tables describe your immediate kin and
your upbringing.
Ancestors
3d6 Ancestors
3 Your ancestors were exiled after committing a
crime of theft, cowardice, or treason. Subtract 3
from your Starting Lifestyle roll.
4–5 Your ancestors were prospectors and explorers,
seeking new veins of gold and silver deep under
the mountains.
6–8 Your ancestors were ordinary and unexceptional
people and did little of note or consequence.
9–12 Your ancestors toiled in the mines, extracting
precious stones and metals from the depths.
13–15 Your ancestors were master artisans, famed for
their skill far and wide. Add 1 to your Starting
Lifestyle roll.
16–17 Your ancestors were great warriors and fought
in the wars against the faeries, goblins, trolls,
and other foul creatures. Add 1 to your Starting
Lifestyle roll.
18 Your ancestors were nobles and at least one of
your ancestors might have been a king or queen.
Add 3 to your Starting Lifestyle roll.
Family Circumstances
3d6 Family Circumstances
3 You were orphaned at a young age and have no
memory of your parents or siblings. Subtract 6
from your Childhood roll and skip the Familial
Relations roll.
4–5 You were born to a destitute family. Subtract 3
from your Childhood roll.
6–8 Your family was poor. Subtract 1 from your
Childhood roll.
9–12 Your family was just getting by.
13–15 Your family lived comfortably. Add 1 to your
Childhood roll.
16–17 Your family was wealthy. Add 3 to your
Childhood roll.
18 Your family was rich. Add 6 to your
Childhood roll.
Familial Relations
3d6 Relations
3 Your family disowned you.
4–5 You do not get along with your family.
6–8 You neither like nor dislike your family.
9–12 You get along with your family.
13–15 You have a close relationship your family.
16–17 You have a strong bond to your family and
everything you do is to honor them and to
improve their lots. You visit your family often.
18 You live for your family and everything you do
you do for them.
Siblings*
d6 Siblings
1 You have no siblings
2 You have one sibling
3 You have two siblings
4
You have three
siblings
5
You have four
siblings
6 You have five siblings
*For each sibling, roll a d6.
You have a brother on an odd
number and a sister on an
even number.
Sibling Age
4d6 Age
4 Identical or fraternal twin, triplet, or quadruplet
5–14 Older
15–24 Younger
Parent and Sibling Fate*
3d6 Fate
3 Insane
4–5 Unknown
6–8 Dead
9–12 Alive
13–15 Alive but disgraced
16–17 Alive and well-regarded
18 Alive and famous
*Roll once on this table for each
parent and sibling. If the character
is dead, roll on the Cause of Death
table to find out how. You can use
the other tables to add detail as you
like to your other siblings.
Cause of Death
3d6 Cause of Death
3 Murder
4–5 Accident unrelated to profession
6–8 Disease, famine, or exposure
9–12 Natural causes
13–15 War
16–17 Accident related to profession
18 Suicide

9
Appearance Tables
Use the following tables to determine your character’s
general appearance. Choose your gender, skin, hair,
and eye color, as none of those things matter.
Age
3d6 Age
3 You are a child, 20 years old or younger. You are
Size 1/4 and you halve your height and weight.
Roll on the Childhood table.
4–5 You are an adolescent, 21 to 30 years old. Reduce
your height and weight by 25%. Roll on the
Childhood table and once on the Life Experience
table.
6–8 You are a young adult, 31 to 50 years old. Roll
on the Childhood table and twice on the Life
Experience table.
9–12 You are an adult, 51 to 75 years old. Roll on
the Childhood table and four times on the Life
Experience table.
13–15 You are a middle-aged adult, 76 to 100 years old.
Roll on the Childhood table and five times on the
Life Experience table.
16–17 You are an older adult, 101 to 150 years old. Roll
on the Childhood table and six times on the Life
Experience table.
18 You are a venerable adult, 151 years old or older.
Roll on the Childhood table and eight times on the
Life Experience table.
Build*
3d6 Build
3 You are quite small. Reduce your height by 3d6
inches and your weight by 2 pounds per inch.
4–5 You are short. Reduce your height by 2d6 inches
and your weight by 2 pounds per inch.
6–8 You are thin. Reduce your weight by 3d6 pounds.
9–12 You are of average height and weight
13–15 You are heavy. Increase your weight by 5d6 pounds.
16–17 You are tall. Increase your height by 2d6 inches
and your weight by 2 pounds per inch.
18 You are enormous for a dwarf. Increase your height
by 3d6 inches and your weight by 3 pounds per inch.
*The Build table modifies your starting height and weight.
Regardless of gender, your starting height is 42 inches and
weight is 150 pounds.
Appearance
3d6 Appearance
3 You are hideous. You lack body hair, have a mass
of scars obscuring your facial features, and a
hobbling, lurching gait. Do not roll on the Facial
Hair table.
4–5 You are quite brutish, even by dwarfish standards.
You are probably filthy from all your grubbing and
have mites, scars, and a strong, unpleasant odor.
6–8 You have an unusual physical quality others find
off-putting. You might have overlarge ears, a big
nose, tiny eyes, or some other minor physical
abnormality.
9–12 You are a typical dwarf, being hairy, a bit grubby,
and probably portly.

10
13–15 You are an attractive dwarf specimen with one or
two fine qualities.
16–17 You are quite comely and you take care of your
beard and general appearance. You likely favor
finer clothes and keep your facial hair well oiled.
18 You have a regal appearance and presence,
enough so that heads turn in your direction
wherever you go. You favor fine clothing, jewelry,
and ensure your facial hair is always well groomed
and maintained.
Facial Hair
3d6 Facial Hair
3 You have a thin, patchy beard.
4–5 You have a fancy moustache.
6–8 You have thick muttonchops or a long goatee.
9–12 You have a beard of average length and appearance.
13–15 You have a well-groomed beard and thick,
menacing eyebrows.
16–17 You have a long beard that hangs down past
your knees.
18 You have a long beard that drags on the ground.
Background Tables
The background tables determine from where your
character came and what your character did before
the game begins. Start by rolling on the Childhood
table and then on the Life Experience table a
number of times as determined by your age. The
Life Experience table might direct you to roll on
another table to discover what happened during that
experience.
Childhood
3d6 Childhood
3 or
less
You were captured by your people’s enemies and
forced to live as a slave. You escaped not long
after, but you couldn’t find your way home. Gain
one random wilderness profession.
4–5 You ran away from home and made your own
way in the world. You know how to speak the
Common Tongue.
6–8 You worked in the family business. Gain a random
profession
9–12 You worked in the mines from a very young age.
Gain the miner profession.
13–15 You were apprenticed to an artisan. Gain an
artisan profession of your choice.
16–17 You were apprenticed to the priests of the
Honored Dead. Gain the acolyte profession.
18 or
more
You studied under a scholar. You can speak, read,
and write the Common Tongue and High Archaic,
and you add one random Area of Scholarship.
Life Experience*
3d6 Experience
3 You Died! Roll on the Cause of Death table to find
out how. You can either start over or be returned
to life by some stroke of luck. If you return to life,
you start the game with 1d6 Insanity. Or, if you’re
using Tombs of the Desolation, you can become a
revenant or vampire.
4–5 Roll on the Major Setback table.
6–8 Roll on the Minor Setback table.
9–12 Toil! You found work related to your profession.
You gain nothing from this experience except for
the satisfaction of a job well done and the pride
you take from pleasing your ancestors.
13–15 Roll on the Minor Windfall table.
16–17 Roll on the Major Windfall table.
18 Roll on the Strange Event table.
*Roll on this table only if directed by the Age table.
Major Setback
d20 Major Setback
1 You did something so profoundly wrong and
shameful you were exiled from your clan. You will
be executed if you ever return. You search for
redemption in death fighting against the creatures
you hate. Gain 1 Corruption.
2 A member of the creatures you hate captured you
and forced you to live as a slave for 2d6 years.
You recently escaped. Add slave to your list of
professions.
3 The creatures you hate overran your homeland
and slaughtered your clan. You are one of the few
survivors.
4 A demon possessed you. Gain 1 Corruption.
Either an exorcist cast it out or, if you have
Demon Lord’s Companion, you can start with the
Possessed story complication.
5 You did shoddy work and your reputation
suffered. Subtract 3 from your Starting Lifestyle
roll.
6 A vile disease swept through your community,
killing many and leaving others scarred. You either
bear the scars of your affliction or, if you have
Demon Lord’s Companion, you can start with the
Plagued story complication.
7 You spent 2d6 years in prison for a crime you
committed (gain 1 Corruption) or didn’t commit
(gain 1d3 Insanity). Add the years you spent in
prison to your starting age and gain the convict
profession.
8 A cave-in or some other natural disaster
destroyed your life. Subtract 3 from your Starting
Lifestyle roll.
9 You lost an eye, ear, or 1d3 fingers in a terrible
accident. If you have Demon Lord’s Companion,
you can add the Maimed story complication.
10 You displeased your ancestors and suffered as a
result. Subtract 1 from your Starting Lifestyle roll.
If you have Demon Lord’s Companion, you can
add the Cursed story complication.
11 Someone close to you died: a spouse, child,
parent, or sibling.

11
12 You became hopelessly lost underground. You
spent 1d6 weeks trying to find your way out. You
emerged somewhere far from home and you have
not yet returned.
13 Disaster wiped out your community. You were the
sole survivor and left your old life behind.
14 You saw a hideous monster or demon. Gain 1d3
Insanity.
15 Horrible monsters, demons, or some other vile
threat overran your community, killing everyone in
your family. Gain 1d6 Insanity. If you have Demon
Lord’s Companion, you can add the Mad story
complication.
16 You angered someone important and were
shamed as a result. Subtract 3 from your Starting
Lifestyle roll.
17 You set out to find your fortune only to return to
your homeland penniless and in disgrace. Subtract
1 from your Starting Lifestyle roll.
18 You cause the death of a loved one.
19 You did something that brought shame on
yourself and your family. You were branded for
the act and driven out from your homeland. In
social situations involving other dwarfs, you make
attack rolls with 1 bane.
20 You made a dangerous enemy, one who seeks to
harm you. Work with the GM to create a suitable
nemesis.
Minor Setback
d20 Minor Setback
1 You accidentally killed someone close to you and
the shame burns inside you.
2 You stole a few gold coins from a rival clan,
bringing shame to you and your family.
3 You went out to fight your hated creature and
returned in defeat.
4 A tunnel caved in killing several of your friends.
The experience planted a seed of fear in you and
you now feel uncomfortable in confined spaces.
Gain 1 Insanity.
5 An enormous monster swallowed you whole.
You survived in its gullet for several hours before
being released in a flood of its excrement. Gain
1 Insanity.
6 You suffered a nasty injury and bear the scars still.
7 You saw something horrible. Gain 1 Insanity.
8 An argument, complication, or bad situation drove
a wedge between you and your family. You do not
get along and you haven’t seen them since.
9 Someone tried to kill you. You survived, but fear
they will try again.
10 You lost something valuable. Subtract 1 from your
Starting Lifestyle roll.
11 You got lost in the bottom of a bottle. You drank
heavily. If you have Demon Lord’s Companion, you
can add the Addicted story complication.
12 You stole something from someone who needed
it, hurt an innocent, or did something else
shameful. Gain 1 Corruption.
13 You lost a life-long friend. Roll a d6. It was your
fault on an odd number or their fault on an even
number.
14 You learned a dangerous secret. Work with the
GM to determine the secret.
15 You suffered a nasty head wound, which caused
you to forget many things. Lose one profession or
the ability to speak one language.
16 Someone you loved became injured as a result of
your actions.
17 You left home to start over somewhere else.
18 A spouse, child, sibling, or parent vanished.
19 Your community came under attack by robbers,
monsters, or something else. Subtract 1 from your
Starting Lifestyle roll.
20 A strong of bitter disappointments and failures left
you cynical.
Minor Windfall
d20 Minor Windfall
1 An ancestor appeared before you and charged
you with recovering a fabled relic. You have set
your life’s work toward its recovery.
2 You swore an oath of service to the Dwarf King
and venture into the world to bring honor and
fortune to your patron.
3 You discovered a talent for artistry. Add an
Artisan profession of your choice.
4 You traveled extensively. Add one language to
the list of languages you can speak.
5 You received from your parents the battleaxe
from one of your more famous ancestors. It is
your most prized possession.
6 You helped hunt down and destroy a creature
vexing to your clan.
7 You performed a great service to your clan and
are now considered a hero to your people.
8 You discovered an ornate key that you believe
opens a door to a treasure vault lost to your
people long ago.
9 You fell in love and might have gotten married.
Work with your GM to determine your love interest.
Each time you get this result, you have a child!
10 You have a child. Your offspring can be legitimate
or illegitimate as you decide.
11 You made the acquaintance of someone important.
Choose Influence, Information, or Security. The
character can provide the benefit to you once (see
Connections in Shadow, page 207). Come up with
details about this character with the GM.
12 You got an education or furthered your education.
Choose one: Speak another language or gain a
random area of scholarship.
13 You changed careers! Gain a random profession.
14 You found something interesting. Gain one
Interesting Thing.
15 You saved your community from destruction or a
vile conspiracy. You are considered a hero to your
people and never have to pay for food or drink
while you are there.
16 You found a healing potion.
17 You escape certain death! Start the game with
Fortune.
18 You gain a suit of soft leather or hard leather armor.
19 You fought in the defense of your people.
For your efforts, you gained a medal. In social
situations involving dwarfs who see your metal,
you make attack rolls with 1 boon.
20 You found a small shield!

12
Major Windfall
d20 Major Windfall
1 You discovered a vein of gold deep in a mountain.
Add 6 to your Starting Lifestyle roll.
2 You did a great service for a Dwarf King or Queen.
You gain an enchanted object of the GM’s choice.
3 You made an important connection. Choose
Influence, Information, or Security (see
Connections in Shadow, page 207). Come up with
details about this character with the GM.
4 You enjoyed great success in your business. Add
3 to your Starting Lifestyle roll.
5 Your hatred grows. You gain a +1 bonus to
damage rolls against your hated creature.
6 You built a small house in the place where you
live.
7 You helped escort a caravan to a distant
destination. Add 1 to your Starting Lifestyle roll
and you can speak an additional language.
8 You acquired the deed to a mine at a place of the
GM’s choosing.
9 You found a sheet of rock on which is inscribed
1d3 + 1 rank 1 incantations.
10 An alchemist you help gifted you with 1d3 + 1
potions of the GM’s choice.
11 Your ancestors visited you and bestowed on you
their favor. You can invoke the favor when you
make an attack roll or challenge roll to make the
roll with 1 boon. When you invoke the favor, roll
a d6. You lose the favor forever if you roll an odd
number.
12 You made a friend of a powerful figure—an
archmage, high priest, general, or hero. The GM
determines the person’s identity and the benefits
your friendship provides.
13 You found a chest of coins! Add 3 to your Starting
Lifestyle roll.
14 You saved the life of another dwarf. The character
(as dwarf) accompanies you on your adventures
and serves until death. Work out the details with
your GM.
15 You gain an inheritance from a wealthy relative
or friend. This inheritance pays for you to have a
wealthy lifestyle or to purchase a rich lifestyle for
1 gc.
16 You gain a suit of armor or a weapon of your
choice.
17 You befriend a giant mole (as small animal with
the sightless trait) who accompanies you and
obeys your commands.
18 You are famous, known all across the lands in
which you live. Work out the details about how
you became famous with the GM.
20 Your ancestors revealed the moment of your
death. When you would die, you can choose not
to die and instead become unconscious for 1d3
hours. Once you make this choice, you cannot
make it again.
Strange Event
d20 Event
1 You sold your soul to a devil for riches only to be
betrayed by the devil and left penniless. Swap
out your hatred for devils if you hate a different
creature and start the game with 1 Corruption.
2 You and an elf fell in love. So profoundly wrong
was your romance, you gain 1d3 Insanity.
However, you make attack rolls in social situations
involving faeries with 1 boon.
3 You spent 1d20 years living among the gnomes.
From them, you discovered the Earth tradition.
4 You spent a few years in study. Add two areas of
scholarship of your choice.
5 You discovered a pool of foul ichor that spawned
hideous monsters. You touched the substance and
survived, but you gain 1 Corruption.
6 You became a fanatical follower of the Honored
Dead. The first time you ever make a fate roll, you
can roll twice and use either result.
7 A Dwarf King or Queen gave you a boon. For your
first adventure, you make attack rolls with 1 boon.
8 You are haunted by one of your ancestors. If you
have Demon Lord’s Companion, you can add the
Haunted story complication.
9 You did something shameful and cut all ties to
your homeland as a result. Now, you wander the
lands seeking a glorious end in the hopes that it
will redeem you in the eyes of your ancestors.
10 You took a nasty blow to the head. Reduce your
Intellect by 1, but you make challenge rolls to
resist gaining Insanity with 1 boon.
11 You know a secret way into one of the lost
dwarfen kingdoms. You intend to go there one
day and liberate it from the horrors that overran
it. Work out the details of this location with the
GM.
12 You fought troglodytes with your fellow dwarfs.
You destroyed a nest of them and their screaming
haunts you still. You treat troglodytes as having
the frightening trait, but you count them as a
hated creature.
13 You were slain in battle but later raised from the
dead. Gain 1d3 Insanity.
14 Choose a member of your group. Your ancestors
revealed this character will play an important part
in your life. When you or that character uses an
action to help the other, the result of the Intellect
is automatically a success and the action grants
an extra boon.
15 You were among those who fought the
salamanders and lived to tell the tale. Add
salamanders to your list of hated creatures.
16 You inherited a battleaxe or warhammer from a
relative. The weapon bears a mighty rune that
grants a +1 bonus to damage rolls on attacks
made using it.
17 You studied the ancient runes of your people and
discovered the Rune tradition as a result.
18 You were killed before you could finish a great
task. If you have Tombs of the Desolation, you
become a revenant.
19 You explored an area infested with strange mold.
The spores both weakened and enhanced you.
Reduce your Health by 1d3 but increase your
Perception by 1.
20 A priest of the Honored Dead revealed something
of your future. Roll a d6. On a 1, you learned you
were doomed and, if you have Demon Lord’s
Companion, you can add the Doomed story
complication. On a 2–5, the priest hints at what
is to come and granting you Fortune for the next
adventure. On a 6, you learn important secrets
and for your next adventure, you make attack rolls
and challenge rolls with 1 boon.

13
Dwarf Profession Tables
Use the following tables in place of those in Shadow of
the Demon Lord to randomly determine your starting
professions as directed by the previous tables. Your
profession also adds an item to your list of starting
equipment.
Random Profession
d6 Profession Table
1 Scholar: Areas of Scholarship
2 Common Professions
3 Criminal Professions
4 Martial Professions
5 Religious Professions
6 Wilderness Professions
Scholar: Area of Scholarship*
d20 Area of Scholarship
1–2 Architecture and engineering
3–4 Etiquette, heraldry, law, and politics
5–6 Astronomy and navigation
7–8 Dwarfen history and geography
9–10 Imperial history and geography
11–12 Literature, philosophy, poetry, theology, and the arts
13–14 Medicine and surgery
15–16 Natural sciences
17–18 Military sciences
19–20 Magical theory
*Add 1 book covering topics related to your area of
scholarship to your starting equipment
Common Professions
d20 Profession
1–2 Apothecary or healer. Start with a healer’s kit.
3–4 Artisan such as baker, bookbinder, brewer,
carpenter, chandler, cobbler, gemcutter, jeweler,
leatherworker, mason, potter, printer, scribe, or
tailor. You start with a tool kit.
5–6 Artist such as painter or sculptor. If you’re literate,
you can choose writer or poet. You start with a
tool kit or writing kit.
7–8 Conscript. You start with a uniform and spear.
9–10 Entertainer such as actor, athlete, comedian,
dancer, orator, puppeteer, singer, or storyteller.
You start with a costume, dress, or fine clothing as
appropriate for your profession.
11–12 Laborer such as porter, grave digger, or hauler.
You start with a backpack, shovel, coil of rope,
or something else chosen by the GM that’s
appropriate to your profession.
13–14 Merchant. You start the game with raw goods
such as textiles, grains, or something else worth
1d6 ss.
15–16 Miner or prospector. You start with a pick and a
map of the region.
17–18 Musician using percussion, stringed, or wind
instruments. You start with a musical instrument.
19–20 Trade such as dyer, tanner, or butcher. You start
with 2d6 bits.
Criminal Profession
d20 Profession
1–4 Burglar or forger. You start with a set of lock picks
or tool kit.
5–8 Charlatan, confidence artist, informant, or spy.
You start with a disguise kit.
9–12 Fence or smuggler. You start with 1d6 cp.
13–16 Mugger, pickpocket, or thug. You start with 1d6 bits.
17–20 Murderer. You start with a garrote.
Martial Profession
d20 Profession
1–4 Constable, detective, or patroller. You start with a
lantern and flask of oil.
5–8 Guard or henchman. You start with a club and
uniform.
9–12 Jailer or torturer. You start with a pair of manacles
or torturer’s tools.
13–16 Mercenary. You start with a sword and a contract
for your last job.
17–20 Soldier. You start with a uniform, small shield, and
sword.

14
Religious Profession*
d6 Profession
1 Anchorite, flagellant, fanatic
2 Evangelist or street preacher
3 Acolyte, devotee, or initiate
4 Militant, such as a crusader. You start with a mace.
5 Minister of a small temple
6 Minister of a large temple
*Your profession is usually associated with your religion.
You start with a symbol of your faith.
Wilderness Profession
d20 Profession
1–2 Animal trainer. You start with a small animal that’s
friendly to you.
3–4 Apothecary or healer. You start with a healer’s kit.
5–6 Drover or herder. You start with a staff.
7–8 Guide, pioneer, or prospector. You start with a
map of the region.
9–10 Hermit. You start with a week of rations and a
waterskin.
11–12 Hunter or gatherer. You start with a bow and
12 arrows.
13–14 Nomad. You start with a horse.
15–16 Spelunker. You start with a lantern, pick, and
2 flasks of oil.
17–18 Tracker. You start with a spear.
19–20 Woodcutter. You start with an axe.
Starting Equipment
All characters start the game with equipment based
on their starting lifestyle and their profession or
professions. To determine your starting lifestyle, roll
3d6 and add to the roll all the modifiers gained from
your Life Experience rolls. Then find the total on the
Starting Lifestyle table (Lifestyles are described in
Shadow, page 100). In addition to the equipment, your
character starts the game with one Interesting Thing
(Shadow, page 26).
Starting Lifestyle
3d6 Lifestyle
3 or less Destitute
4–5 Poor
6–12 Getting By
13–15 Comfortable
16–17 Wealthy
18 or more Rich
Clothing
Lifestyle Clothing
Destitute Foul rags and a blanket
Poor Patched, threadbare basic clothing with a
ratty cloak
Getting by Basic clothing with a cloak
Comfortable 1d3 sets of basic clothing with one fine cloak
Wealthy 1d3 sets of well-made basic clothing, a set
of noble’s clothing, and a fine cloak
Rich 1d3 sets of noble’s clothing and a fine cloak
Weapon
Lifestyle Weapons
Destitute Club or a sling with 20 stones
Poor Staff, club, or sling with 20 stones
Getting by Sling with 20 stones and either a hammer or
hatchet
Comfortable Sling with 20 stones and either a hammer or
hatchet
Wealthy Hammer or hatchet
Rich Hammer or hatchet
Personal Gear
Lifestyle Personal Gear
Destitute Sack
Poor Sack, loaf of bread, and canteen filled with ale
Getting by Backpack, week of rations, small keg filled
with beer, and coil of rope
Comfortable Backpack, week of rations, small keg filled
with beer, and coil of rope
Wealthy Backpack, week of rations, small keg filled
with beer, bottle of spirits, and coil of rope
Rich Backpack, week of rations, small keg filled
with beer, bottle of spirits, and coil of rope
Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting by —
Comfortable Healing potion plus one of the following: an
incantation of one rank 0 spell, small shield,
healer’s kit, tool kit, or writing kit
Wealthy Healing potion plus one of the following: an
incantation of one rank 0 spell, small shield,
healer’s kit, tool kit, or writing kit
Rich Healing potion plus one of the following: an
incantation of one rank 0 spell, small shield,
healer’s kit, tool kit, or writing kit
Wealth
Lifestyle Wealth
Destitute 1d6 bits
Poor 2d6 bits
Getting by 1d6 cp
Comfortable 2d6 cp
Wealthy 1d6 ss
Rich 2d6 ss

15
Personal Effects*
d20 Item
1 Pipe with pouch of tobacco
2 A pewter tankard
3 A small, prized stone
4 A small stone idol of an ancestor
5 A whittling knife
6 A sack of potatoes
7 A chip on your shoulder
8 1d3 bright rings for your beard
9 An earring
10 A colorful shirt
11 An iron key
12 An axe
13 A badge of honor gifted to you by a dwarfen
regent
14 A hooded cloak
15 A yearning for home
16 A dozen dwarfen songs
17 Pride in a job well done
18 A lantern with 3 flasks of oil
19 A canary in a small cage
20 Box of cigars
*Roll on this table regardless of your starting wealth.
Personality Tables
Use the following tables to help define your
character’s personality and the result should guide
you in portraying the character during play.
Personality
3d6 Personality
3 You criticize everyone you meet, judging them
and dismissing them as being beneath you. Your
arrogance is astonishing to witness.
4–5 You are a bully and braggart. Others find you
impossible to be around.
6–8 You are quiet and humorless. You have no
patience for fools.
9–12 Dour and gruff, you are unpleasant in social
situations.
13–15 You are serious and stern, but you do laugh from
time to time.
16–17 You are open and gregarious, unlike most other
dwarfs. You get along well with other people and
delight in being at the center of attention.
18 Such is your personality that you make friends
wherever you go and are an inspiration to others.
Relationships
3d6 Relationships
3 You hate everyone. You use people to get ahead.
4–5 You have a hard time trusting other people and
always expect them to double cross you.
6–8 You trust only other dwarfs. People of different
ancestries have proven repeatedly they lack honor.
9–12 You trust dwarfs and people who earn it.
13–15 You might be slow to build relationships but you
would do anything to protect those relationships,
even if it means your own life.
16–17 You find it easy to build relationships and can
overlook the flaws you find in others.
18 You see value in most living things and until they
give you reason to spurn them, you fight for their
rights to exist.
Desires and Fears*
1d6 Desire Fear
1 Gold and gems Poverty
2 Honor Shame
3 Glory Ignominy
4 Redemption Disgrace
5 Immortality Your ancestors
6 Power Defeat
*Roll once for Desire and once for Fear
Obligations
3d6 Obligations
3 You haven’t yet made a promise that you’ve kept.
To hell with your ancestors! What have they ever
done for you?
4–5 You try to keep your word, but you sometimes
break it.
6–8 You keep to the letter of any agreement and
exploit any gaps you find to your advantage.
9–12 You always do what you say you will do. After all,
your honor is everything to you.
13–15 You obey the laws and keep any contract you
sign, but you go no further.
16–17 You respect the letter and the intent of any
agreement you make. You are committed to
following through on any promise you make.
18 You never break your oath, but you only speak
your vows when you are certain that following
through with them will bring no shame to you,
your people, or your clan. Once sworn, you would
give your life to keep your promise.
Morality
3d6 Morality
3 You are a wretched, foul creature, an individual
ruled by your appetites and desires. You do what
you want and whenever you want.
4–5 You are the most important consideration, so you
put your needs first. To the victor goes the spoils.
6–8 You do what needs to be done, even if it hurts
a few innocents along the way. The ends always
justify the means.
9–12 You do good and you do what some might
consider bad. What you do, though, is what you
must in the name of preserving your honor and
that of your ancestors.
13–15 Although you try to do good, your greed
sometimes gets in the way.

16
16–17 You temper your lust for treasure with generosity.
You might gather wealth, but you always give some
of it away to those who need it more than you.
18 You do good in the world not just to honor your
ancestors, but because doing so makes the world a
better place. You fight to protect those weaker than
you and act as a paragon of virtue in all things.
Religious Belief
3d6 Religion
3 You believe the gods do not exist
4–5 You follow the Dark Gods
6–15 You worship the Honored Dead
16–17 You belong to the Cult of the New God
18 You belong to a heretical sect, worship the Devil,
or belong to a cult of the Demon Lord
Piety
3d6 Piety
3 Your beliefs are distorted and considered
heretical by other members of your faith.
4–5 Your beliefs do not affect your decisions.
6–8 Your beliefs sometimes weigh on decisions you make
9–12 You hold your beliefs strongly and they influence
the decisions you make.
13–15 You are a fanatic about your belief and you
condemn people who do not believe as you do.
Gain 1 Insanity.
16–17 You are skeptical about your beliefs.
18 You harbor strong doubts about your beliefs.
Hatred
d20 Hated Creature
1 Creatures with 1 or more Corruption
2 Clockworks and constructs
3 Salamanders
4 Humans
5 Spirits
6 Undead
7 Troglodytes
8 Ogres
9 Beastmen
10 Orcs
11 Goblins
12 Elves
13 Faeries other than elves and devils
14 Monsters and oozes
15 Devils
16 Trolls
17 Giants
18 Dragons
19 Demons
20 Followers of religions other than the Honored Dead
```

### Dwarf — Shadow of the Demon Lord Core

- **Entry Type:** Standard Ancestry
- **Source:** Shadow of the Demon Lord Core
- **Source Page:** 17
- **PDF Page:** 18

```text
Dwarf
Dwarfs live under the mountains in elaborate
subterranean cities. From them, they launch expeditions
deep into the earth to pry gold and silver from the
unyielding rock. They hoard their treasures in great vaults
and view other peoples with distrust, suspecting them all
of coveting their wealth. The dwarfs have few friends and
gain little aid when the forces of darkness overrun their
strongholds to lay claim to their vaults. Thus many dwarfs
wander the lands, homeless, friendless, searching for a
new place to call their own.
The Beard’s the Thing: Dwarfs have thick, stout bodies,
limbs corded with muscle, and bellies bulging from their
fondness for alcohol and food. All dwarfs, male and female,
wear elaborate facial hair, braiding it in their clan designs,
decorating it with silver or gold rings, or greasing it up into
unusual shapes. Other dwarfs have fanciful mustaches or
thick muttonchops that hang past their waists.
Short but Dense: Dwarfs stand between 3 and 4 feet
tall, and they can weigh up to 250 pounds. They have the
human range of coloration, though they tend to be grimy
and wrinkly from their work in the mines and forges.
Dour and Suspicious: Gruff, critical, and suspicious,
dwarfs make few friends outside their own kind. They
covet treasure but temper their greed with the certainty that
their ancestors are always watching. Thus, dwarfs conduct
themselves with honor to avoid bringing shame to their clans.
CommonNames:Anise,Brunhild,Doogan,Erika,Franz,
Grete,Guntur,Heida,Helmut,Ilse,Martok,Oda,and Ragnar.
Creating A Dwarf
Starting Attribute Scores Strength 10, Agility 9, Intellect 10,
Will 10
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score + 4
Healing Rate equals one-quarter your Health, round down
Size 1/2, Speed 8, Power 0
Damage 0, Insanity 0, Corruption 0
Languages and Professions You speak the Common
Tongue, and you speak, read, and write Dwarfish.
Darksight You can see in areas obscured by shadows or
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Hated Creature Choose a creature from the Hatred table.
Your hatred grants 1 boon on attack rolls made against
creatures you hate.
Robust Constitution You take half damage from poison.
You make challenge rolls with 1 boon to avoid or remove
the poisoned affliction.
Level 4 Expert Dwarf
Characteristics Health +6
You either learn one spell or gain Shake it Off.
Shake it Off You can use an action to heal damage equal
to your healing rate and remove one of the following
afflictions: fatigued, impaired, or poisoned. Once you
use this talent, you cannot use it again until after you
complete a rest.
17

Character Creation
1
Dwarf Age
3d6 Age
3 You are a child, 20 years old or younger.
4–7 You are an adolescent, 20 to 30 years old.
8–12 You are a young adult, 31 to 50 years old.
13–15 You are a middle-aged adult, 51 to 100 years old.
16–17 You are an older adult, 101 to 150 years old.
18 You are a venerable adult, 151 years old or older.
Dwarf Build
3d6 Build
3 You are short and scrawny.
4–6 You are short and fat.
7–8 You stand a bit shorter than other dwarfs.
9–12 You are average in height and build.
13–15 You have a magnificent belly.
16–17 You are tall.
18 You are tall and heavy.
Dwarf Appearance
3d6 Appearance
3–4
You have a monstrous appearance, likely due to
hard living and several near misses. Your face is
a mass of scar tissue, probably missing an ear, an
eye, or your nose. You also display some unusual
habit, such as pounding nails into your skull or
greasing your body with troll fat.
3d6 Appearance
5–6
You have several interesting features that work
together to make you one ugly brute. Filth from
digging in the dirt, mites infesting your hair, skin
lashed with healing scars, and a rich aroma of
vomit—all these contribute to your distinctive style.
7–8 You are hairy, portly, and grubby.
9–11
You are a typical dwarf, hairy and portly, but
well groomed.
12–15
You take pride in your appearance. You stay
clean, oil your facial hair, and perhaps braid it or
tie it with metal rings.
16–18
You are quite fetching for a dwarf. You have regal
features, good bearing, and a deep voice. You
take pride in your appearance.
Dwarf Hatred
d20 Hated Creature
1–2 Ogres
3–4 Troglodytes
5–6 Beastmen
7–8 Orcs
9–10 Goblins
11–12 Elves
13–14 Trolls
15–16 Giants
17–18 Dragons
19–20 Demons
18

Character Creation 1
Dwarf Background
d20 Background
1
You sold your soul to a devil to gain wealth. The
devil betrayed you and left you penniless. You start
the game with 1 Corruption.
2
Your ancestors appeared to you in a vision and sent
you to recover a fabled relic.
3 You accidentally killed someone close to you.
4
You stole gold from a rival clan and the theft
shames you.
5 You fought against the creatures you hate and lost.
6
You brought shame to yourself and your clan. You
live as an exile, searching for redemption, even if
that redemption comes with a glorious death.
7
You were taken prisoner by the creatures you hate.
You lived as a slave for 2d6 years.
8
The creatures you hate overran your home and
wiped out your clan.
9
You survived a cave-in and get a bit nervous when
underground.
10 You earned a living working in your profession.
11 You are a sworn servant of the Dwarf King.
12
You are a gifted artisan. Add artisan (any one) to
your list of professions.
13
You traveled extensively. You speak one additional
language.
14
You inherited a battleaxe or a warhammer from an
ancestor.
15
You discovered a vein of gold under your mountain
home.
16 You hunted down and helped kill a creature you hate.
17
You performed a great deed, and you are a hero to
your clan.
18
You have a key to an ancient treasure vault lost to
the dwarfs long ago.
19
You are the rightful heir to a stronghold overrun by
the enemies of your people.
20 You came into money and start the game with 2d6 cp.
Dwarf Personality
3d6 Personality
3
Your hatred is a living thing. It drives you, gives you
strength, and helps you triumph over your enemies.
4 You seek a glorious death killing your enemies.
5–6
You love gold more than anything. You love the way
it feels, the sound it makes, and the taste of it.
7–8
You believe other people covet your wealth. It is
your duty to protect what is yours—at any cost.
9–12
Your honor is your life. You would never do anything
to bring shame to your people.
13–14
You surrender to the will of your ancestors, the
customs of your people, and the good of all.
15–16
You believe your people must rise above their greed
and suspicion. In these dark times, you must band
together to overcome the doom that awaits you all.
17
You don’t trust or like non-dwarfs, but they have
their uses.
18
You have little use for the customs of your people.
It’s time to move past the dusty caves and seek out
fortunes elsewhere.
```

### Elf

- **Entry Type:** Standard Ancestry
- **Source:** Terrible Beauty
- **Source Page:** 7
- **PDF Page:** 8

```text
Elf
The lords and ladies of the faerie realms, the elves have
produced such beings as the Faerie Queen, the Prince
of Robins, Oberon, and even Diabolus, the Lord of
Hell. Most elves have few grand ambitions, content to
pass the centuries in pleasure, perhaps capturing the
breathtaking vistas of their homeland on canvas or in
verse, coupling with lovers under a sea of glittering stars,
or dancing, drinking, and feasting on the bounty stolen
from the mortal world.
Terrible Beauty: Elves appear human for the most
part, but all possess some sign of their otherworldly
origin. One might have pointed ears or a cow’s tail, or
might appear normal when viewed from the front, only
to be revealed as nothing more than a two-dimensional
image when seen from behind. Some have horns,
vestigial butterfly wings, or soft fur covering some or
all of their bodies. Many people find them appealing,
even infectious, no doubt due to their natural charisma.
Elves draw on their inner magic to become alluring or
fearsome, wondrous or monstrous. Most elves stand
4-1/2 to 5 feet tall and weigh 80 to 140 pounds.
Eternal Youth: Short of falling victim to violence
or disaster, elves live forever (though they have but
one life, because their bodies and souls
are inseparable). When elves reach
maturity, they stop aging and
remain fixed at that physical
state for as long as they remain alive. Elves produce
offspring only once or twice over the course of their
entire lives. For this reason, they often resort to stealing
mortal children, then raise them for a few years until
the children transform into faeries, or until the children
prove too boorish to bear, and the faeries abandon
them to whatever horrible fate awaits them in the
magical landscape.
Beyond Good and Evil: The length of their lives and
the finality of their deaths combine to make it difficult
for elves to care much about the consequences of their
actions. Pleasure drives them, and they do whatever
they need to obtain it, heedless of who or what they
hurt in the process. Others might interpret their actions
as selfish or evil, but elves don’t concern themselves
with such concepts, making no distinction between
plucking the pretty eye from a shepherd’s face and
composing a sonnet to a beautiful flower. Both acts give
them pleasure.
Common Names: Elves adopt names related to things
they find beautiful. Examples include Breath of Winter,
Dawn in a Dewdrop, Fury of the North Wind, Moon in
the Night Sky, Scattering of Leaves, Sorrow in Twilight,
Whisper of Night, and Widow’s Cry. Elves use these
common names in lieu of their true names, which they
keep secret lest some meddling mortal call them from
their hidden realms.
Creating an Elf
Starting Attribute Scores Strength 9, Agility 10, Intellect
10, Will 9. Choose two attributes and increase each by 1.
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 1, Speed 12, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common
Tongue and High Archaic. You also speak, read, and
write Elvish. You might gain additional professions or
languages based on your age.
Immune damage from disease; charmed, diseased
Shadowsight You see into areas obscured by shadows as if
those areas were lit.
Spell Defense You take half damage from spells and you
make any challenge roll to resist a spell with 1 boon. A
creature attacking you with a spell makes the attack roll
with 1 bane.
Bewitching Presence Your magical nature alters how
others see you and behave around you. You make attack
rolls in social situations with 1 boon. If you touch or are
touched by an object made from iron, you lose this trait
for as long you remain in contact with the object and for
1 minute afterward.
Iron Vulnerability You are impaired while you are in
contact with iron. In addition, if you touch or are touched
by an object made from iron, you lose Spell Defense for
as long you remain in contact with the object and for
1 minute afterward.
Level 4 Expert Elf
You either learn one spell or increase your Health by 4.
one life, because their bodies and souls
are inseparable). When elves reach
maturity, they stop aging and
remain fixed at that physical

Terrible Beauty
8
Elf Background
d20 Background
1 You fought the trolls thousands of years ago.
2 You were a child stolen from your parents by
the faerie and raised among them, losing your
humanity to become an elf.
3 You chose to live apart from your kind, finding
refuge in the unspoiled wilderness of the mortal
world.
4 You had a tryst with a human that resulted in the
birth of a faun. You abandoned both.
5 You stole a baby from a human family and raised
it as your own. Roll a d3: 1, you gave the baby to
Hell as part of your tithe; 2, you misplaced the
baby; 3, the baby grew up to become an elf or a
faun.
6 You maimed several dozen humans to harvest
their best features. You tried to fit the pieces
together but lost interest and discarded the mess.
Gain 1 Corruption.
7 You once drowned a person to take his or her
spouse. Gain 1 Corruption.
8 You have spent half your life composing the
perfect poem.
9 You lived among the dark faerie of Hell for
many years, before escaping that awful place
and cleansing yourself of the experience. Gain
1 Corruption.
10 You fancied a mortal and lured him or her
into your hidden kingdom. You lost the mortal
somewhere along the way, and that sometimes
makes you sad.
11 Pleasure has ruled your life, and you have few
memories of the times you have spent indulging
your every desire.
12 You have traveled among mortals, and you have
a better understanding of their nature than do the
rest of your people.
13 You have the Faerie Queen’s favor. She watches
what you do from time to time in a reflecting pool.
14 You are among the highborn, a member of the fey
aristocracy.
15 A mortal summoned and bound you to service for
seven years.
16 Choose one other character. You befriended that
character long ago, and you watch out for your
friend at all times.
17 You have confused pain for pleasure, spending
1d20 years mutilating your body.
18 You come from a people who refused to abandon
the mortal world. You are deemed primitive and
backward by other elves.
19 Demons spilled into your homeland, and you are
the sole survivor.
20 You fell in love with a mortal and murdered his or
her loved ones so that he or she would love only
you. Gain 1d3 Corruption.
Elf Age
d3 Age
1 You are young, less than fifty years old.
2–3 You are an adult, and you have stopped physically
aging. You are 1d20  50 years old. For each
century you have lived, add either one faerie
profession to your list of professions or one
language to your list of known languages.
Elf Faerie Mark*
3d6 Faerie Mark
3 You appear two-dimensional from behind, as if
nothing more than an image of a person. Any
clothing you wear conforms to your appearance
and returns to normal when it is removed.
4–5 Horns or antlers sprout from your forehead.
6–8 You have the tail of a cow, a fox, a cat, or some
other animal.
9–12 You have pointed ears, exotic skin color (blue,
green, gold, or something else), unusual hair color,
or no pupils or irises in your eyes.
13–15 Fine fur covers some or all of your body, or from
the knees down, you have the legs of a frog, a fox,
a grasshopper, or some other animal.
16–17 You have vestigial butterfly wings, hair made
of raven or swan feathers, or a speck of light
that shines like a candle from the center of your
forehead.
18 Your body appears to be made from wood, and
a forest of twigs crowns your head.
*You can have up to three marks.
Elf Quirk
d20 Quirk
1 Your laugh tends to make people smile.
2 You cannot cry.
3 You talk in a singsong voice.
4 Your laughter sounds like the chiming of silver
bells.
5 You always smell of fresh flowers.
6 Your hair or skin color changes with the seasons.
7 You speak in whispers.
8 The smell of iron sickens you.
9 You sometimes speak in rhymes, usually when you
are excited or upset.
10 Birds sometimes land on your shoulders and chirp
until they are shooed away.
11 You can’t sit still, and you fidget constantly.
12 Whenever you sleep on the ground outdoors,
flowers or mushrooms grow up around you.
13 To the touch, you are as cool as a corpse.
14 You sparkle in sunlight.
15 Your clothing always stays clean.
16 You have permanent grass stains on your hands
and feet.
17 You have butterfly wings. They don’t let you
fly, but you never take damage from landing after
a fall.
18 You bear a hideous scar from a battle with a troll.
19 Normal flames within short range of you turn blue.
20 When you become angry, your face twists into a
feral mask.

Terrible Beauty
Terrible Beauty 9
Elf Personality
3d6 Personality
3–4 Your hatred for mortals manifests as cruelty. You
never pass up the chance to make a mortal suffer.
5–6 You are fickle, changeable, and erratic. Ruled by
your whims, you can be wicked or kind, loving or
hateful, switching between extremes with little
warning.
7–8 You take pleasure in one thing of your choice.
You strive to feed your appetites and pursue that
pleasurable thing whenever you can.
9–12 You are curious about the world beyond your
home and seek new experiences among the
fascinating creatures there.
13–14 You resent authority and obligations. You are
loath to swear a vow and never willingly promise
to do anything.
15–16 To you, all living things deserve respect, and you
work to nurture and protect life in your world as
well as the world of mortals.
17–18 You dislike mortals and make your disdain for
them clear when you interact with them.
```

### Faun — Between Two Worlds

- **Entry Type:** Expanded Ancestry
- **Source:** Between Two Worlds
- **Source Page:** 4
- **PDF Page:** 4

```text
Faun Characters
Everything you need to create a faun character can
be found in the Demon Lord’s Companion. The rules
in that book let you make a character rapidly with
enough information to portray it in the game. This
section offers advanced rules for making a faun, with
alternative features and a slew of tables to develop the
character’s background, appearance, and personality.
If you use the rules presented here, you must use
these supporting tables to determine your character’s
professions, the languages you know, and your
starting equipment.
Creating a Faun
Choose whether to use random or fixed attribute scores.
Random Attribute Scores Strength 1d3 + 8, Agility 1d3 + 9,
Intellect 1d3 + 9, Will 1d3 + 7
Fixed Attribute Scores Strength 10, Agility 11, Intellect 11,
Will 9
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1/2 or 1, Speed 12, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages You speak the Common Tongue and Elvish.
Quick Step When you use an action, you can move 1 yard
before or after resolving the action, provided your Speed
is greater than 0.
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Skittish You make Will challenge rolls with 1 bane.

Level 4 Expert Faun
Characteristics Health +5
You learn one spell or gain one of the following talents.
Fight or Flight While you are frightened, you gain a +2
bonus to Speed and you make challenge rolls to resist
attacks with 2 boons. Also, creatures make attack rolls
against you with 1 bane.
Great Courage You lose the Skittish trait and make
challenge rolls to resist the frightening and horrifying
traits with 1 boon.
Nature Friend In social situations involving animals, you
make attack rolls with 1 boon. In addition, you befriend a
tiny animal such as a lizard, mouse, squirrel, or bird. You
can communicate with one another by speaking. The
animal accompanies you on your adventures and, though
under the GM’s control, usually does what you tell it to
do. If the animal dies, you can befriend another animal of
a kind appropriate to where you are when you complete
your next rest.
Servant of Darkness While your Corruption score is 3 or
higher, you assume a diabolical appearance. Your skin
darkens to gray, whorls and runes appear in your flesh,
your horns lengthen, and your eyes turn solid white,
though you can see normally. You gain the following
benefits:
• You have darksight instead of shadowsight.
• You are immune to damage from disease and to the
charmed and diseased afflictions.
• You make attack rolls with 1 boon in social situations
to deceive or intimidate.
Faun Development Tables
The following tables help you create a detailed faun
character by determining your origins, background,
appearance, personality, professions, and the like.
You must roll on each table and take the result of
each roll. If you use these tables, do not use any of the
background or starting wealth tables in the Demon
Lord’s Companion.
Origin Tables
The following tables tell you the circumstances of
your birth and, if you are a first-generation faun, how
you became one.
Birth Circumstances
d6 Circumstance
1–3 You were born to human parents. Roll on the
Origin and Escape tables, then proceed to the
Family tables.
4 One of your parents was human and the other a
faun. Decide which parent was which and proceed
to the Family tables. Subtract 4 from your roll on
the Siblings table.
5 Both of your parents were fauns. Proceed to the
Family tables and subtract 2 from your roll on the
Siblings table.
6 One of your parents was human and the other a
faerie such as a dryad, elf, or nymph. Decide which
parent was which and proceed to the Family
tables. Do not roll on the Siblings table.
Origin
d6 Origin
1 You were abducted by faeries who left a
changeling behind to cover the theft.
2 You entered a borderland by mistake and
stumbled into a hidden kingdom.
3 Your family offered you to angry faeries to
appease them.
4 You were kidnapped by a hag and sold to
the elves.
5 You became lost in the woods until faeries found
you and led you to their realm.
6 You ran away from home to be with your
sweetheart in a hidden kingdom.
Escape
d6 Escape
1 Your parents, siblings, relatives, friends, or
strangers rescued you and brought you home.
2 You become lost in a hidden kingdom and
stumbled back into the mortal world.
3 You planned your escape and slipped out of the
faeries’ clutches.
4 A faerie spirited you out of a hidden kingdom and
abandoned you in the world.
5 A spellcaster accidentally summoned you from a
hidden kingdom.
6 You left a hidden kingdom by mistake. You might
have passed through a magic mirror, opened a
forbidden door, or swum through the bottom of
an enchanted lake.
Family Tables
Use the following tables to detail your family
relationship, circumstances, siblings, and what
happened to them. Unless instructed otherwise, roll
on each of the following tables.
Family Circumstances
3d6 Circumstance
3 or less You were orphaned or have no memory of
your family. Subtract 6 from your Childhood
roll and skip the Familial Relationships roll.
4–5 Your family was destitute. Subtract 3 from
your Childhood roll.
6–8 Your family was poor. Subtract 1 from your
Childhood roll.
9–12 Your family was just getting by.
13–15 Your family lived comfortably. Add 1 to your
Childhood roll.
16–17 Your family was wealthy. Add 3 to your
Childhood roll.
18 Your family was rich. Add 6 to your
Childhood roll.

Siblings*
3d6 Number of Siblings
5 or less None
6–8 One
9–12 1d3
13–15 1d6
16–17 1d6 + 2
18 2d6 + 3
* For each sibling, roll a d6. The sibling is a brother on an odd
number, or a sister on an even one.
Sibling Ages*
d20 Sibling Age
1–3 The same age as you. The sibling is possibly a
twin, a bastard, or adopted.
4–12 Younger
13–20 Older
* Roll once for each sibling you have.
Familial Relationships*
3d6 Relationship
3 Hate
4 Animosity
5–6 Rivalry
7–8 Dislike
9–10 Neutral or no relationship
11–12 Tolerance
13–14 Goodwill
15–16 Friendship
17 Love
18 Intense love, possibly romantic
* Roll once on this table for each parent and sibling to
determine your relationship with the character.
Family Fates*
3d6 Fate
3 Went insane
4–5 Unknown
6–8 Dead
9–12 Alive
13–15 Alive, but disgraced
16–17 Alive and well-regarded
18 Alive and famous
* Roll once on this table for each parent and sibling. If the
family member is dead, roll on the Cause of Death table to
find out how.
Cause of Death
3d6 Cause of Death
3 Murder
4–5 Accident unrelated to profession
6–8 Hardship, hunger, or exposure
9–12 Natural causes or disease
13–15 War
16–17 Accident related to profession
18 Suicide
Appearance Tables
Use the following tables to determine your character’s
general age, height, weight, and distinguishing features.
Choose your own gender, skin, hair, and eye color.
After rolling on the Starting Age table, roll once on
the Childhood table and a number of times on the
Life Experiences table as directed by the Age result.
Starting Age
3d6 Age
3 You are a child, 11 years old or younger. Halve
your Size, height, and weight. Do not roll on
the Life Experiences tables.
4–5 You are an adolescent, 12 to 17 years old.
Reduce your height and weight by 25%. Roll
once on the Life Experiences table.
6–8 You are a young adult, 18 to 25 years old. Roll
twice on the Life Experiences table.
9–12 You are an adult, 26 to 35 years old. Roll three
times on the Life Experiences table.
13–15 You are a middle-aged adult, 36 to 55 years old.
Roll four times on the Life Experiences table.
16–17 You are an older adult, 56 to 75 years old. Roll
five times on the Life Experiences table.
18 You are a venerable adult, 76 years old or older.
Roll six times on the Life Experiences table.
Build
This table modifies your starting height and weight.
Regardless of gender, your starting height is 54 inches
and starting weight is 110 pounds.
3d6 Build
3 You are quite small and slight. Reduce your height
by 4d6 inches and your weight by 2 pounds per
inch reduced. Reduce your Size to 1/2 if you are
not Size 1/2 already.
4–5 You are short. Reduce your height by 3d6 inches
and your weight by 1 pound per inch reduced.
6–8 You are thin. Reduce your weight by 4d6 pounds.
9–12 You are of average height and weight.
13–15 You are heavy. Increase your weight by 4d6 pounds.
16–17 You are tall. Increase your height by 3d6 inches
and your weight by 1 pound per inch increased.
18 You are enormous. Increase your height by
4d6 inches and your weight by 2 pounds per
inch increased.

Appearance
3d6 Appearance
3 You are hideous, practically a monster. The mere
sight of you causes children to cry, the faint of
heart to collapse, and others to become sickened,
disgusted, or uncomfortable.
4–5 You are ugly, having some unusual physical
characteristic that works against you. Possibilities
include a wen, beetling brows, boils, extensive
scarring, wandering eye, rotten teeth, or profound
body stench.
6–8 You are plain, homely, or unattractive.
9–12 You are more or less average for a faun.
13–15 You have a physical quality that makes you
attractive.
16–17 You are comely, considered a great beauty.
18 You are striking to the point that your appearance
grabs attention from people around. You might
have several suitors or paramours, infatuated
stalkers, or people you have spurned who now
hate you.
Distinctive Features
d20 You have . . .
1 a musical laugh
2 a twinkle in your eye
3 unusual markings on your face and neck
4 soft, silky fur on your legs
5 a sweet odor reminiscent of honey
6 eyes that shine in the dark
7 a sultry, smoky voice
8 large ram horns
9 butterflies that follow you wherever you go
10 large, pointed ears
11 a sly grin
12 green or red skin
13 no body hair
14 fish or serpent scales on your hands and arms
15 prolific body hair
16 overlarge hooves
17 deer antlers
18 white spots on your back
19 an ugly brand somewhere on your body
20 a tendency to tremble

Background Tables
These tables tell you what your character did
before the game begins. Start by rolling once on the
Childhood table and then on the Life Experiences
table a number of times as determined by your roll
on the Starting Age table. You might in turn be
directed to roll on another table to discover what
happened during that experience.
Childhood
3d6 Childhood
3 or
less
You spent your childhood as a prisoner or slave,
having been captured by a person of dark intent.
Add slave to your list of professions.
4–5 You grew up alone in the wilderness. Add hermit
to your list of professions.
6–8 You lived in a small, remote community and
learned a trade. Gain a random profession.
9–12 You stayed with your family or adopted family,
but were hidden until you came of age. Gain a
random profession.
13–15 You found a place in a small community of fauns.
Gain a random wilderness profession.
16–17 A druid or some other priest of the Old Faith
took you in and indoctrinated you in that faith.
Add devotee of the Old Faith to your list of
professions.
18 or
more
You found a place with a learned man or woman.
You can speak, read, and write the Common
Tongue and High Archaic, and you add one
random area of scholarship.
Life Experiences*
3d6 Experience
3 You Died! Roll on the Cause of Death table to
find out how. You can either start over with a new
character or be returned to life by some stroke of
luck. If you return to life, you start the game with
1d6 Insanity.
4–5 Roll on the Major Setbacks table.
6–8 Roll on the Minor Setbacks table.
9–12 You Got a Job! If you don’t have a profession yet,
gain a random profession. You spent time working
in one of your professions. Add 1 to your roll on
the Starting Lifestyle table.
13–15 Roll on the Minor Windfalls table.
16–17 Roll on the Major Windfalls table.
18 Roll on the Strange Events table.
* Roll on this table only if directed by the Starting Age table.
Major Setbacks
d20 Major Setback
1 Your hatred and grief led you down a dark road.
You have sullied your soul with your foul deeds.
Gain 1d6 Corruption and roll once to determine if
you have a mark of darkness.
2 A vile wizard or some other user of magic
kidnapped and experimented on you until you
escaped, 1d6 months later. Add fugitive to your
list of professions.
3 You befriended someone in a nearby village, but
you couldn’t muster up the courage to help your
friend when monsters attacked.
4 A demon possessed you. Gain 1 Corruption. Either
an exorcist cast it out or, if you have Demon
Lord’s Companion, you can add the Possessed
story complication.
5 You failed to make much of yourself working in
your profession. Subtract 3 from your Starting
Lifestyle roll.
6 You caught a terrible disease that left you scarred.
You either bear the marks of your affliction or, if
you have Demon Lord’s Companion, you can add
the Plagued story complication.
7 Hunters captured you and subjected you to
horrific abuse. You escaped after murdering one
or more of your captors.
8 Zealots of the New God’s cult descended on
your community and killed everyone who looked
like a beastman. You managed to escape. Gain
1d6 Insanity.
9 You had a small family in a remote place, but
you lost them to disease or a monster attack.
10 You killed someone. Gain 1 Corruption and roll
a d6. On an even number, you got away with it.
On an odd number, you were imprisoned. Do not
make any more Life Experiences rolls and add
convict to your list of professions.
11 You lost everything to disaster or war.
Subtract 3 from your Starting Lifestyle roll.
12 You lost an eye, ear, or 1d3 fingers in a terrible
accident. If you have Demon Lord’s Companion,
you can add the Maimed story complication.
13 A faerie laid a curse on you for some wrong you
committed. The curse made your life very difficult.
Subtract 1 from your Starting Lifestyle roll. If you
have Demon Lord’s Companion, you can add the
Cursed story complication.
14 You saw a hideous monster or demon. Gain 1d3
Insanity. If you have Demon Lord’s Companion,
you can add the Mad story complication.
15 You were sorely persecuted by members of
the New God’s Cult and only just escaped with
your life. You were forced to move on, leaving
everything behind. Subtract 3 from your Starting
Lifestyle roll.
16 You angered someone important and suffered as a
result. Subtract 3 from your Starting Lifestyle roll.
17 You were summoned by a powerful spellcaster
and made to serve his or her every whim. Add
scholar of magic to your list of professions.
18 You killed someone you loved. Gain 1 Corruption.
19 You betrayed the faerie folk, leading monsters
to slaughter them. Gain 1d3 Corruption.
20 You made a dangerous enemy, one who seeks
to harm you. Work with the GM to create a
suitable nemesis.

Minor Setbacks
d20 Minor Setback
1 You were a fool in the court of an elf noble and
knew nothing but mockery and disdain during your
time there. Add jester to your list of professions.
2 You fell in love with a human and had an affair
that lasted a few months before the tryst was
exposed and you were chased off.
3 A nymph or a hag kept you as a plaything for
1d3 years. Gain 1 Insanity for each year.
4 You spent many years living alone in the
wilderness. Gain a random wilderness profession.
5 Poor treatment at faerie or human hands left
you scarred. Gain 1 Insanity.
6 You were brutally beaten and robbed. You have a
scar and subtract 1 from your Starting Lifestyle roll.
7 You developed a taste for alcohol. If you have
Demon Lord’s Companion, you can add the
Addicted story complication.
8 You killed a faerie, and you still see the creature’s
blood on your hands. Gain 1 Insanity.
9 You lived among other fauns, but you were
driven out after being accused of a crime you
don’t think you committed.
10 You befriended a wild animal, which remained
your companion until a human hunter killed it.
11 You lost something valuable. Subtract 1 from
your Starting Lifestyle roll.
12 You killed someone in self-defense, but you
believe their spirit haunts you. If you have
Demon Lord’s Companion, you can add the
Haunted story complication.
13 You took up with beastmen for a time.
The experience darkened your soul. Add Dark
Speech to the list of languages you can speak
and gain 1d3 Corruption.
14 You learned a dangerous secret. Work with the
GM to determine its nature.
15 Some children found and captured you. They
made you perform tricks and beat you when you
refused. You suffered a nasty head wound, which
caused you to lose one of your professions or the
ability to speak a language of your choice.
16 You had a human lover, but when it was
discovered, you were accused of forcing yourself
on him or her. The community chased you into
the wild and destroyed your home. Subtract
1 from your Starting Lifestyle roll.
17 You once spied the Faerie Queen bathing in a
pool. Gain 1d3 Insanity.
18 Someone close to you, who helped you make
your way in the world, has disappeared. You
search for this person still.
19 You joined a dark cult and became immersed
in their vile practices. Gain 1 Corruption and
1 Insanity.
20 A life of hardships and betrayals has left you
bitter and cynical about the future.
Minor Windfalls
d20 Minor Windfall
1 A troupe of performers took you in. You spent
time earning coin to let other people stare at you.
Add entertainer to your list of professions.
2 You studied under a druid or witch for a time.
Add scholar of magic or nature to your list
of professions.
3 You found work as a spy for an inquisitor.
Add spy to your list of professions.
4 You spotted beastmen or some monster on the
move and warned the people in a nearby village.
You are always welcome there.
5 You were captured by an evil magician, witch, or
someone of that sort, but you were rescued soon
after. You stayed with your rescuer, gaining a
random profession as a result.
6 You traveled extensively. Add one language to
the list of languages you can speak.
7 You relied on yourself and became quite adept at
surviving in the wilderness. Add hunter, forager,
or tracker to your list of professions.
8 You found a place for yourself in a human
community after you helped hunt down and
destroy a vicious monster. Add 1 to your Starting
Lifestyle roll.
9 You fell in love with a human or faun, and the
relationship is ongoing.
10 You have a pet dog (small animal).
11 You found a bag of coins. Add 1 to your
Starting Lifestyle roll.
12 You saved the life of someone important. Choose
influence, information, or security. The character
can provide the benefit to you once (see
“Connections” in Shadow, page 207). Come up
with details about this character with the GM.
13 You changed careers. Gain a random profession.
14 You found something interesting. Gain one extra
interesting thing.
15 You found a shield, small or large.
16 You found a healing potion.
17 You escaped certain death! Start your first
adventure with Fortune.
18 You start with a suit of soft or hard leather armor.
19 You helped a druid perform an incantation. Gain
an incantation of a rank 0 spell of the GM’s choice.
20 A young friend gave you a bow and quiver of
12 arrows.
Major Windfalls
d20 Major Windfall
1 You befriended a leshy years ago, but you haven’t
seen it in some time.
2 You stole a pot of gold from a leprechaun. Add 6
to your Starting Lifestyle roll.
3 You did a great service for a faerie lord or lady.
You gain an enchanted object of the GM’s choice.
4 You made an important connection. Choose
influence, information, or security (see
“Connections” in Shadow, page 207). Come up
with details about this character with the GM.
5 You enjoyed great success in your profession.
Add 3 to your Starting Lifestyle roll.

6 You built a small home in the wilderness at a
location of your choosing.
7 You helped guide travelers through a
dangerous stretch of the wilderness. Add 1 to
your Starting Lifestyle roll, and you can speak
an additional language.
8 You performed a service for a witch. He or she
gave you a healing potion and an incantation of a
rank 0 spell of the GM’s choice.
9 You found a book of magic. The book contains
incantations of 1d3 + 1 rank 0 spells.
10 You found an alchemist’s workshop and stole 1d3
+ 1 potions of the GM’s choice.
11 One of the faeries responsible for your
transformation into a faun, or a faerie you served,
bestowed on you a blessing. If you have Terrible
Beauty, you gain a random favor of the great fey
(see page 36). Otherwise, you gain a random
enchanted object.
12 You made friends with a powerful figure—an
archmage, high priest, general, or hero. The GM
determines the person’s identity and the benefits
your friendship provides.
13 You found a glittering jewel! Add 3 to your
Starting Lifestyle roll.
14 You made a blood pact with another faun to stay
together forever. Create another faun character.
You can control both characters or give the
second character to another player.
15 A wealthy merchant or noble sheltered
and pampered you. Add 6 to your Starting
Lifestyle roll.
16 You find a military or swift weapon of your choice.
17 You befriended a goblin who accompanies you on
your adventures and obeys your commands.
18 You spied your future in a pool you discovered
in a faerie wood. During your first adventure, you
make challenge rolls with 1 boon.
19 You studied under a druid or witch and
discovered one of the following traditions: Curse,
Enchantment, Life, Nature, or Primal.
20 Faerie blood runs strong in you. Creatures
attempting to bestow the charmed affliction
on you make their attack rolls with 1 bane, and
you make challenge rolls to resist or remove the
charmed affliction with 1 boon.
Strange Events
d20 Event
1 You entered one of the hidden kingdoms and
served as an advisor to one of the powerful
lords and ladies. Your time there continued your
transformation into a faerie. If you have Terrible
Beauty, replace your ancestry with elf. Otherwise,
you are now immune to damage from disease and
the diseased affliction.
2 During your time in a hidden kingdom, you met
several human children who had entered the
magical place through a wardrobe. You led them
to the elf lord you served and offered them as part
of the Hell Tithe. All the children were turned into
hogmen and suffer in Hell still. Gain 1d6 Corruption.
3 You were transformed into a tiny animal of the
GM’s choice. You can return to this form, as if you
had cast the animal shape spell, by gaining 1d3
Insanity. The effect lasts for a number of minutes
equal to the Insanity you gained.
4 You found a place as a magician’s apprentice. You
discover a tradition of your choice and begin the
game with an incantation of a rank 0 spell of the
GM’s choice.
5 A well-meaning faerie restored your humanity.
You replace your ancestry with human, but your
languages and professions do not change.
6 After a religious experience, you became a
fanatical follower of the Old Faith. The very first
time you make a fate roll, you can roll twice and
use either result.
7 After spending time with goblins, you became
sick from a vicious disease. If you have Demon
Lord’s Companion, you can add the Plagued story
complication.
8 You have led a life of depravity and debauchery.
You live only for pleasure. Gain 1 Corruption and
one random interesting thing.
9 An evil witch hunter captured you, filed down
your horns, and shaved your lower body. If you
have Demon Lord’s Companion, you can add the
Maimed story complication.
10 You found the cave in which sleeps the Great
Dragon. You looked upon the great beast and
knew true terror. You make challenge rolls with 1
bane to resist the frightening and horrifying traits
of creatures that resemble dragons.
11 You saved the life of a nisse. You can call on this
faerie for aid once to repay the debt.
12 You took up with a witch hunter and worked as his
or her scout. Gain a random religious profession.
13 You were killed. Somehow, you came back to life
with 1d6 Insanity.
14 Choose a character played by someone other
than you. You have a strong connection to that
character, and whenever you use an action to help
the character, you increase the number of boons
granted by 1.
15 You found Elysium, a secret hidden kingdom
where the lords and ladies of the faerie preserved
the souls of the most magnificent mortals. You
learned much from your time there. Add High
Archaic to the list of languages you can speak and
scholar of history to your list of professions.
16 A devil tried to corrupt you. Roll a d6. On a 1, the
devil succeeded and you gain 1 Corruption and a
random enchanted object. If you have Exquisite
Agony, use the Diabolic Objects table on page 19.
Otherwise, you resisted and add 1 to your Starting
Lifestyle roll.
17 You found and befriended a clockwork. Whenever
you start an adventure, roll a d6. On a 6, the
character is present for that adventure.
18 You have had a wild and interesting life. Gain two
random professions.
19 You became briefly possessed by an incarnation.
If you have The Hunger in the Void, you can
create the incarnation that possesses your form.
Otherwise, add 1d6 to your Starting Lifestyle roll.
20 You had a vision of a mighty relic and believe you
know where it can be found. Work out the details
of the relic with the GM.

Faun Profession Tables
Use the following tables in place of those in Shadow of
the Demon Lord to randomly determine your starting
professions as directed by your rolls on the previous
tables. Your profession also adds an item to your list of
starting equipment.
Random Profession
d6 Profession Table
1 Scholar: Areas of Scholarship
2 Common Professions
3 Criminal Professions
4 Martial Professions
5 Religious Professions
6 Wilderness Professions
Scholar: Area of Scholarship*
d20 Area of Scholarship
1–2 Architecture and engineering
3–4 Etiquette, heraldry, law, and politics
5–6 Astronomy and navigation
7–8 Imperial history and geography
9–10 Pre-Imperial history and geography
11–12 Literature, philosophy, poetry, theology, and the arts
13–14 Medicine and surgery
15–16 Natural sciences
17–18 Magical theory and the occult
19–20 Military sciences
*Add 1 book covering topics related to your area of
scholarship to your starting equipment.
Common Professions
d20 Profession
1 Apothecary or healer. You start with a healer’s kit.
2 Artisan such as baker, blacksmith, bookbinder,
brewer, carpenter, chandler, cobbler, gem cutter,
jeweler, leatherworker, mason, potter, printer,
scribe, or tailor. You start with a tool kit.
3 Artist such as painter or sculptor. If you’re literate,
you can choose writer or poet. You start with a
tool kit or writing kit.
4 Bartender or shopkeeper. You start with 1d6 cp.
5 Beggar. You start with a begging bowl or cap.
6 Boatman or ferryman. You start with a rowboat.
7–8 Cook, groom, scullion, or servant. You start with
an extra set of clothing.
9 Courtesan, prostitute, or camp follower. You start
with a selection of cosmetics.
10 Entertainer such as actor, athlete, comedian,
dancer, orator, puppeteer, singer, or storyteller.
You start with a costume, dress, or fine clothing as
appropriate for your profession.
11 Drover or herder. You start with a staff.
12 Farmer. You start with a hoe, shovel, or rake.
13 Fisher. You start with a fishing pole and tackle box.
14 Gambler. You start with a pair of dice or deck of cards.
15 Laborer such as porter, gravedigger, or stevedore.
You start with a backpack, shovel, coil of rope,
or something else chosen by the GM that’s
appropriate to your profession.
16 Merchant. You start the game with raw goods such
as textiles, grains, or something else worth 1d6 ss.
17–18 Musician using percussion, stringed, or wind
instruments. You start with a musical instrument.
19 Pilot, sailor, or teamster. You start with 1d6 cp.
20 Trade such as dyer, tanner, or butcher. You start
with 2d6 bits.
Criminal Professions
d20 Profession
1–2 Agitator, rebel, saboteur, or terrorist. You start
with 1d6 pamphlets related to the cause for which
you fight.
3–4 Bandit, pirate, or raider. You start with a bottle of
rotgut and a wanted poster showing your face.
5–6 Burglar or grave robber. You start with a set of
lock picks.
7–8 Charlatan, confidence artist, informant, or spy.
You start with a disguise kit.
9–10 Fence or smuggler. You start with 1d6 cp.
11–13 Mugger or thug. You start with 1d6 bits.

14–17 Murderer. You start with a garrote.
18 Pickpocket. You start with a stolen purse
containing 1d6 cp.
19–20 Poacher or rustler. You start with a coil of rope.
Military Professions
d20 Profession
1–2 Constable or detective. You start with a lantern
and flask of oil.
3–8 Conscript or militia. You start with a spear and
uniform.
9–10 Guard or henchman. You start with a club and
uniform.
11–12 Jailer or torturer. You start with a pair of manacles
or torturer’s tools.
13–16 Mercenary. You start with a sword and a contract
for your last job.
17–18 Patroller. You start with a lantern and flask of oil.
19–20 Marine or soldier. You start with a uniform, small
shield, and sword or cutlass.
Religious Professions*
d6 Profession
1 Anchorite, flagellant, or fanatic
2 Evangelist or street preacher
3 Acolyte, devotee, or initiate
4 Keeper of a shrine
5 Minister of a small temple
6 Minister of a large temple
* Your profession is usually associated with your particular
faith. You start with a symbol of your faith.
Wilderness Professions
d20 Profession
1–2 Animal trainer. You start with a small animal that’s
friendly to you.
3–4 Apothecary or healer. You start with a healer’s kit.
5–6 Drover or herder. You start with a staff.
7–8 Guide or pioneer. You start with a map of the
region.
9–10 Hermit. You start with a week of rations and
a waterskin.
11–12 Hunter or gatherer. You start with a bow and
12 arrows.
13–14 Nomad. You start with a horse.
15–16 Spelunker. You start with a lantern, pick, and
2 flasks of oil.
17–18 Tracker. You start with a spear.
19–20 Woodcutter. You start with an axe.
Starting Equipment
You begin the game with equipment based on your
starting lifestyle and professions. Roll on each of the
following tables.
To determine your starting lifestyle, roll 3d6 and
add to the roll all the modifiers gained from your
Life Experiences rolls. Then find the total on the
Starting Lifestyle table (Lifestyles are described in
Shadow, page 100). In addition to the equipment,
your character starts out with one interesting thing
(Shadow, page 26).
Starting Lifestyle
3d6 Lifestyle
3 or less Destitute
4–5 Poor
6–12 Getting by
13–15 Comfortable
16–17 Wealthy
18 or more Rich
Clothing
Lifestyle Clothing
Destitute Foul rags and a blanket
Poor Patched, threadbare basic clothing with
a ratty cloak
Getting by Basic clothing and a cloak
Comfortable 1d3 sets of basic clothing and a fine cloak
Wealthy 1d3 sets of well-made basic clothing, a
set of noble’s clothing, and a fine cloak
Rich 1d3 sets of noble’s clothing and a fine cloak
Weapons
Lifestyle Weapon
Destitute Club or sling with 20 stones
Poor Staff, club, or sling with 20 stones
Getting by Sling with 20 stones and a basic weapon
of your choice
Comfortable Dagger and one of a staff, club, or sling
with 20 stones
Wealthy Rapier or sword
Rich Dagger
Personal Gear
Lifestyle Personal Gear
Destitute —
Poor Sack, loaf of bread, handful of nuts, bottle
of water, flint and steel, candle
Getting by Backpack, a week of rations, waterskin
filled with water, coil of rope, tinderbox,
2 torches
Comfortable Backpack, a week of rations, waterskin
filled with water, coil of rope, tinderbox,
2 torches
Wealthy Backpack, a week of rations, waterskin
filled with water, coil of rope, tinderbox,
lantern, 2 flasks of oil
Rich Cosmetics, bottle of perfume, handkerchief

Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting by —
Comfortable Healing potion plus one of a scroll containing
an incantation of a rank 0 spell, small shield,
healer’s kit, tool kit, or writing kit
Wealthy Healing potion plus one of a scroll containing
an incantation of a rank 0 spell, small shield,
healer’s kit, tool kit, or writing kit
Rich Healing potion, a personal servant
(commoner), a guard (mercenary), and
three horses with bits, bridles, saddles,
and feed for each
Wealth
Lifestyle Wealth
Destitute —
Poor 1d6 bits
Getting by 1d6 cp
Comfortable 2d6 cp
Wealthy or Rich 1d6 ss
Personal Effects*
d20 Item
1 A songbird in a cage
2 A silk scarf
3 A parasol
4 A bronze key
5 A box of candy
6 A bag containing 3d6 acorns
7 A pet squirrel named Sugarfoot
8 A carved statuette of one of the Old Gods
9 A bit of ribbon
10 Musical laughter
11 1d6 skipping stones
12 An empty glass bottle
13 A bit of costume jewelry
14 A snazzy vest
15 A winning smile
16 A sweat-soaked rag
17 A pet frog named Phillip
18 A magnifying glass
19 A soapstone icosahedron
20 A bag of nightcrawlers
*Roll on this table regardless of your starting wealth.
Personality Tables
Use the following tables to help define your character’s
personality. The results from each table should guide
how you portray the character during play.
Personality
3d6 Personality
3 You have known nothing but sorrow your whole
life. It’s time to repay others for how they have
treated you.
4–5 The world is a cruel and unforgiving place. You do
whatever you must to survive, even if that means
stealing, cheating, or killing.
6–8 You do and say what you please. You try not to
hurt other people, but if it happens, there’s not
much you can do about it.
9–12 You survive by looking after yourself. You have
a hard time trusting others or taking them at
their word.
13–15 You trust yourself to do what is right, even if
others disagree with your tactics.
16–17 You put your best foot forward. If you can
prove your heart is good, maybe others will
give you a chance.
18 You were born for a reason: to accomplish some
great task, to fulfill a great purpose. You hope to
find your destiny and be equal to whatever you
were meant to do.
Relationships
3d6 Relationships
3 People are inherently evil. You trust no one.
4–5 People look after themselves first and foremost,
so you take everything that’s said to you with a
grain of salt.
6–8 Only those people closest to you can you trust.
You dislike others.
9–12 People close to you find you charming and
friendly. Others find you aloof and a little
suspicious.
13–15 You light up a room. People want to know you
and befriend you.
16–17 You try to see the best in others and take them
at their word. You have many friends.
18 All people have it within them to do good. You
try to appeal to their better natures and help
them be the best they can be. You have friends
wherever you go.
Desires and Fears*
1d6 Desire Fear
1 Acceptance Ostracism
2 Isolation Death
3 Friendship Pain
4 Wealth Need
5 Security Gods and priests
6 Love Faeries
*Roll once for Desire and once for Fear.

Obligations
3d6 Obligation
3 You never keep your word if you can help it. You
won’t let something like an oath or promise hold
you back.
4–5 You dislike authority figures and chafe under
obligations. You do as you say when it suits you
and flout the local laws.
6–8 You sometimes keep your word and sometimes
break faith with people who depend on you.
9–12 You usually keep your word and break promises
only when you have to.
13–15 You strive to keep your word and consider a
promise broken to be a failing.
16–17 You adhere to the laws of the lands you inhabit,
and always work to keep all of your promises and
live up to your obligations.
18 You never break the law, even if it offends you.
You always do what you say and refuse to be
around oath-breakers.
Morality
3d6 Morality
3 If there’s a limit to your depravity, you have not found
it yet. You are a thoroughly reprehensible being.
4–5 You sometimes act on dark impulses that lead you
to harm others.
6–8 A harsh pragmatist, you always believe the ends
justify the means.
9–12 You are capable of both good and evil. Usually,
you do whatever serves your interests.
13–15 You strive toward goodness. You’re no saint, but
you do the best you can.
16–17 You usually do the right thing, even if it means
depriving yourself in some way.
18 You always do the right thing. You are beyond
evil and cannot fathom the acts committed by
evil people.
Religions
3d6 Religion
3 You belong to a heretical sect, worship the
Devil, or belong to a cult of the Demon Lord.
Gain 1 Corruption.
4–5 You belong to a minor religion centered on
a small god.
6–8 You follow the tenets of Witchcraft.
9–12 You follow the teachings of the Old Faith.
13–15 You have no religious beliefs (do not roll on
the Piety table).
16–17 You belong to the cult of the New God.
18 You adhere to some other, strange religion
of your own making.
Piety
3d6 Piety
3 You only pretend to follow a religion. You
don’t actually believe in anything.
4–5 You are a believer in name only. Doubts about
your faith assail you.
6–8 You have many questions about your faith, but
feel it’s better to have some sort of religion
than not to have one at all.
9–12 The strength of your faith is neither too strong
nor too weak.
13–15 You have few doubts about your religious
beliefs and take great comfort from your faith.
16–17 You have strong religious convictions and
believe your god or gods watch over you.
18 You are a religious fanatic; you talk about
your god or gods all the time and use them
to justify your behavior. You sometimes
persecute people who do not believe as you
do. Gain 1 Insanity.
```

### Faun — Demon Lord's Companion

- **Entry Type:** Standard Ancestry
- **Source:** Demon Lord's Companion
- **Source Page:** 5
- **PDF Page:** 6

```text
Faun
Elves and the other fair folk withdrew from the mortal
world long ago, but in their wake they left behind
humans altered by contact with the immortal faerie.
Chance encounters with the capricious and mercurial fey
shattered lives with madness, broken hearts, and in some
cases, offspring. Centuries later, the influence of faerie can
still be felt in the deep wilderness, where doorways yet
stand to the Hidden Kingdoms of Alfheim, Niflheim, and
other magical realms populated by immortals. In such fey-
touched places dwell fey-touched creatures—some true
descendants, others warped by magic—known as fauns.
• Animal Features: People can mistake fauns for beastmen,
and for good reason, since fauns combine human physical
traits with those of goats. Unlike beastmen, which are
mortals corrupted and twisted by demonic influence,
fauns owe their distinctive appearance to traces of faerie
blood in their veins or, at the very least, the influence of
faerie magic on the body. The connection to the immortals
gives a faun shaggy legs with cloven hooves and small
horns sprouting from the forehead. Faun features combine
the traits of human and animal, reminiscent of both but
belonging, truly, to neither.
		 Most fauns stand 4-1/2 feet tall and weigh about
110 pounds. Although they have the same range of
5
1

Demon Lord’s Companion
Ancestries
coloration as humans do, fauns tend to be swarthy,
with brown or black fur from their navels down to their
hooves. Their horns usually grow up to a few inches
long, though a few fauns have horns that can spiral a
foot or more in length.
• Mixed Heritage: As offspring of faerie and human, fauns
are a people entirely separate from both. They have
traits from these peoples, yet fauns are neither faerie nor
human. An unusual appearance and otherworldly nature
make fauns unwelcome in most human settlements, and
the fey also spare fauns little kindness. In fact, fauns who
live in fey realms have low status as fools, messengers,
servants, and playthings for elf lords and ladies.
Fauns make their homes wherever they can. Many live
on the misty borders of the hidden kingdoms, while a
few venture off into the trackless wilds, joining remote
communities of other exiles. Few fauns find places
among humans.
• Guarded Curiosity: Fauns learn quickly to keep other
people at arm’s length. Fear and derision are the most
common reactions from humans, and scorn and mockery
are usual from faeries. Fauns are justifiably hesitant to
seek friendship with such folk.
		 Fauns can be timid, but they are curious too. They
might watch travelers and lend aid if the wayfarers seem
good of heart and mild of disposition. Ill-mannered or
destructive interlopers might be led astray or otherwise
tricked into harm. Curiosity can land fauns in trouble,
since many vile mages pay a high price for faun blood.
Rarely, a curious faun finds the courage to travel human
lands, wearing clothing designed to conceal inhuman
features.
• Common Names: Fauns use human names, but might
gain nicknames from the faeries they serve or the
humans who ridicule them.
Creating a Faun
Starting Attribute Scores Strength 10, Agility 11, Intellect 11,
Will 9
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round
down
Size ½ or 1, Speed 12, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the
Common Tongue and Elvish.
Quick Step When you use an action,
you can move 1 yard before or after
the action, provided your Speed is
greater than 0.
Shadowsight You see in areas
obscured by shadows as if those
areas were lit.
Skittish You make Will challenge rolls with 1 bane.
Level 4 Expert Faun
Characteristics Health +5
You either learn one spell or gain Fight or Flight.
Fight or Flight While you are frightened, you gain a +2
bonus to Speed and you make challenge rolls to resist
attacks with 2 boons. Also, creatures make attack rolls
against you with 1 bane.
Faun Age
3d6 Age
3 You are a child, 11 years old or younger
4–7 You are an adolescent, 12 to 17 years old
8–12 You are a young adult, 18 to 35 years old
13–15 You are a middle-aged adult, 36 to 55 years old
16–17 You are an older adult, 56 to 75 years old
18 You are a venerable adult, 76 years or older
Faun Build
3d6 Build
3
You are short and scrawny, likely due to the
harshness of your upbringing.
4 You are short and round, obviously well fed.
5–6 You are short for your kind, no taller than 3-1/2 feet.
7–8 You are slender and wiry.
9–12 You have a typical height and weight for a faun
13–14 You are heavy, unusually curvaceous or plump.
6
1

Demon Lord’s Companion
Ancestries
3d6 Build
15–16 You stand a full foot taller than other fauns.
17 You are tall and gaunt.
18
You tower over other fauns, have large curling ram
horns, and a muscled body. Increase your Strength
by 2 and reduce your Agility by 2.
Faun Appearance
3d6 Appearance
3
Little trace of your human heritage appears in your
features, and your face is strange and angular.
Unusual whorls mark your leathery hide. Others
might become uncomfortable when they see you.
4
You are brutish, more like a wild animal than a
person. Your eyes are those of a goat, and your
posture is hunched, your gait lurching.
5–6
Nothing about you is attractive. Human qualities
are evident here and there, but your abundant
animal traits overshadow them.
7–8
Your animal traits are subdued—your horns are
mere nubs, and the fur covering your legs is thin.
9–12
You look like most other fauns, with small horns on
your brow and legs covered in fur down to your
cloven feet.
13–14
You have an appealing appearance, such as a
well-formed body, bright eyes, or warm smile. Your
appearance can put others more at ease.
15–16 You are quite attractive.
17
You are so striking to behold that others often want
to be around you.
18
You inherited the very best qualities from your
mortal and immortal parents. You have a perfect
physique, exotic features, and an air about you that
captures the attention of everyone you meet.
Faun Background
d20 Background
1
Hunters captured you and subjected you to horrific
abuse. You escaped after murdering one or more of
your captors.
2
You were a fool in an elf noble’s court and have known
nothing but mockery and disdain your whole life.
3
You spent several years as the prisoner of a wizard
who believed your blood contained magical power.
4
You fell in love with a human and had an affair
that lasted for a few months before the tryst was
exposed and you were chased off.
5
Zealots of the New God descended on your village
and slew everyone but you. Your attackers thought
the village was full of beastmen.
6 You were the plaything of a nymph for many years.
7 You spent many years living alone in the wilderness.
8
You had a small family in a remote corner of the
Empire, but you lost them to disease or a monster
attack.
9
Poor treatment at faerie or human hands has left
you scarred, mentally or physically, or both.
10
You lived in a human settlement for many years
and there learned your profession.
11
A druid raised you from a baby, and you learned
much of the Old Faith.
12
You grew up in the house of your human parent,
where you were loved.
d20 Background
13
You are a second or third generation faun. You
were raised in a remote part of the world, such as a
deep forest or a high mountain vale.
14
A troupe of performers took you in as a small child
and raised you. You grew up facing the stares of
the people who paid a few bits to see you.
15
A wizard or witch found you and cared for you until
you came of age.
16
You worked as a spy for an inquisitor, who recently
died.
17
A wizard raised you and gave you a formal
education. You can read the Common Tongue.
18
You warned a human village of a monstrous threat.
You are always welcome there.
19
You befriended a leshy long ago, but you haven’t
seen it in years.
20
You found or stole a bag of coins. Add 2d6 copper
pennies to your starting equipment.
Faun Personality
3d6 Personality
3
You have known nothing but sorrow your whole
life. It’s time to repay others for how they have
treated you.
4–5
The world is a cruel and unforgiving place. You do
whatever you must to survive, even if that means
stealing, cheating, or killing.
6–8
You do and say what you please. You try not to
hurt other people, but if it happens, there’s not
much you can do about it.
9–12
You survive by looking after yourself. You have a
hard time trusting others or taking them at their
word.
13–15
You trust yourself to do what is right, even if
others disagree with your tactics.
16–17
You put your best foot forward. If you can prove
your heart is good, maybe others will give you a
chance.
18
You were born for a reason, to accomplish some
great task, to fulfill a great purpose. You hope to
find your destiny and do what you were meant to
do.
```

### Ferren — In Plain Sight

- **Entry Type:** Expanded Ancestry
- **Source:** In Plain Sight
- **Source Page:** 5
- **PDF Page:** 5

```text
Ferren
Characters
You can find the rules for creating ferren characters
in Demon Lord’s Companion 2, but for more detailed
characters and even more options for play, you can
use the following rules. If you avail yourself of the
following rules, be sure to use the supplementary
tables also presented here to determine your starting
profession, languages, and equipment.
Two Forms
You have two forms: a human form and a feline form.
You appear fully human while in human form and as
an ordinary cat when in your feline form.
You can use an action to switch from one to the
other. When you switch from human form to cat
form, you can drop anything you wear or carry, but
anything you still wear or carry becomes absorbed by
your feline form and cannot be used until you assume
your human form once more.
If you become incapacitated, you remain in
whatever you were last wearing.
Attribute Scores
Your attribute scores depend on your form as shown
below, but any increases to your attribute scores apply
to both forms. For example, if you increase your
Strength by 1 when you choose your novice path,
you would have a 10 Strength in human form and a 9
Strength in feline form.
Strength 9 (human) or 8 (feline)
Agility 11 (human) or 12 (feline)
Intellect 10 (human and feline)
Will 9 (human and feline)
Random Attribute Scores
You might prefer to randomize your attribute
scores. If so, roll four d3s, noting the number
rolled for each. You then add one number rolled
to the following attribute scores: Strength 7,
Agility 9, Intellect 8, Will 7. In your feline form, you
decrease your Strength by one and increase your
Agility by 1.
Characteristics
You determine the scores for your characteristics as
follows.
Perception equals your Intellect score + 1 (human)
or + 2 (feline)
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1 or 1/4 (feline)
Speed 10 (human) or 12 (feline)
Power 0
Damage, Insanity, and Corruption 0
Languages You speak the Common Tongue.
Professions You determine your starting profession using
tables presented below.
Ferren Traits
You gain the following traits.
Shadowsight You can see in areas obscured by shadows
as if those areas were lit.
Natural Weapons You have long, sharp nails in your
human form. Your unarmed strike deals 1d3 damage
instead of 1. In your cat form, you can use your claws and
teeth as natural weapons. They have the finesse property
and your attacks with them deal 1 damage.
Climber (feline form) You can move at full Speed while
climbing, ignoring the normal difficult terrain that results
from this movement.
Stealthy (feline form) You make the Agility challenge roll
to hide and sneak with 2 boons.
Level 4 Ferren Expert
When you reach level 4, you gain the following
benefits from your ancestry.
Health Increase your Health by 4.
Ferren Traits
Choose one of the following traits.
Spell You learn one spell from a tradition you have
discovered.
Fluid Transformation Rather than use an action to switch
between your forms, you can switch forms automatically
once while you move. When you assume a feline form
in this way, your movement does not trigger free attacks.
Hybrid Form You learn how to adopt a hybrid form in
addition to your human and feline forms. Your hybrid
form combines features from both forms, while retaining
the ability to speak. You have the increased Perception
and Speed of your feline form as well as the climber and
stealthy traits from that form. In addition, your unarmed
strikes now deal 1d6 damage and have the finesse
property.
Lynx Form When you adopt your feline form, you can
choose to resemble a larger cat, such as a lynx. When
you do so, you gain all the benefits from adopting your
feline form, plus all of the following additional benefits.
• Increase your Strength and Agility from your human
form by 1 each.
• Your natural weapons deal 1d6 damage instead and
retain the finesse property.
Ferren
Development
More than just the numbers recorded on a sheet,
a player character becomes the persona you adopt
while exploring and struggling to survive in an
imaginary world. The more detail you add to your
character, the more fulfilling the experience becomes.
Establishing personality traits, goals, and motivations
helps you define certain behavioral parameters
so you can portray your character in a consistent
and believable manner. The following tables offer
roleplaying elements. You can determine these
elements by rolling dice, choosing them, or making
up something else. You should use these tables in
place of those presented in Shadow of the Demon Lord
and Demon Lord’s Companion 2.
Upbringing
Your story begins with your upbringing, which
includes details about your parents and siblings, the
place where you lived, and your early education.
These early experiences lay the foundation for who
you will become.
Family
Your immediate family describes the people around
whom you spent your earliest years. These people
could be parents and siblings, blood relations,
or adoptive guardians. Or, you could have a
weirder family, one formed through hardship and
circumstance. The following family table offers some
possible scenarios.
Homeland
Ferren come to age in all kinds of places. They
might live in tightknit communities of ferren or
among humans unaware of their neighbors’ magical
natures. Some ferren grow up in the wild places,
ruins of forgotten cities, or in strange, almost
otherworldly places.
Education
The importance of a good education varies from
family to family. For many, learning enough
to provide for oneself by hunting and foraging
represents all the education one could ever possibly
need, but then there are those who see ignorance as
an invitation to bad beliefs, foolishness, and stupid
action, and thus ferren put their offspring through
the same rigorous systems of education that humans
and others do.
Regardless of your educational background, use
the tables in Shadow of the Demon Lord to determine
one profession, which you can choose or generate by
rolling dice.
Signature Background
Event
Everyone has at least one moment that defines
them. It could be a brush with death, an amazing
windfall, a romance that went sour or blossomed
into love, or a disruption caused by war, plague, or
worse. Use the following table to come up with your
background event.
Familial Circumstances
3d6 Family
3
Stolen from your crib, you never knew your blood
relations. Perhaps the faeries pilfered you or some
vile creature with ill intent made off with you
before you could shout or cry.
4–5
Disease, war, betrayal, or some other horrific act
wiped out your family, leaving you to fend for
yourself. The trauma of this event haunts you still
and you find it difficult to make connections.
6–8
One or both parents raised you and your siblings,
but hardships, internal or external, left you shaken
and uncertain about your future.
9–12
You grew up under the guidance and company of
your family. You likely had several siblings, each of
whom grew up in a similar way. You probably get
on well with most family members.
13–15
A warm and nurturing environment proved
everything you needed to be ready for
adolescence and beyond. Likely, you have close
ties to whatever family remains.
16–17
Tragedy took your parents from you, but a
blood relation or close family friend took you
in and raised you as their own. You had a good
upbringing, even if you wonder what your life
would have been like in other circumstances.
18
You took nothing good from your upbringing.
Maybe the problem was you. Maybe you were
damaged or broken and you could not accept
love and nurturing. Or, your family members might
have been wicked people, who tormented you
until you finally escaped.
Ferren Homelands
3d6 Homeland
3
Through curtains of falling cherry blossoms, you
could see the slender towers of the faerie city in
whose shadow you came of age. Yours was an
upbringing filled with wonder and magic, counting
the faeries as your friends, where you could pick
out meaning from the chattering of birds in the
trees, and where a friendly fox might offer kind
advice to mend your broken heart. You come from
a hidden kingdom and your time in faerie makes
the mortal world seem drab and dull.
4–5
You spent much of your life caged and studied,
made a prisoner by some cruel master who ripped
you from your childhood and forced you to fend for
yourself. You escaped, but have been on the run for
much of your life so far.
6–8
You grew up in the ruins of a town or village
abandoned by the humans who lived there. You
and your family made what repairs you needed to
make and got along in the wreckage of a departed
people.
9–12
You came to age in the company of humans.
Your family hid the truth of themselves from their
neighbors, perhaps confiding in a trusted few. Never
did you feel comfortable in this setting as you felt you
had to keep concealed who you were, truly.
13–15
Your family belonged to a larger ferren community
and so you had plenty of friends who enjoyed the
same gifts as you. You might have experienced
acceptance and friendship, or ostracism and
antagonism, just as a child of any community might.
16–17
Your family lived on the edges of the world
alongside a community of fauns. You felt like an
outsider despite the friendships you made and took
the first chance to find a place of your own.
18
You grew up in a big, cosmopolitan city, where
you mingled with other children from all kinds of
cultures and ancestries.
Ferren Education
3d6 Education
3
You learned how to hunt, how to determine if
water is safe to drink, how to sneak and skulk and
do all the other things you need to survive in the
world and that’s about it.
4–5
You received the most basic education. You can
do sums, perhaps read a bit, and have a sense
about the world, but you’re no scholar and the
gaps in your training show themselves in the way
you talk and in the wanting for substance in what
you say.
6–8
You had opportunities to learn, but you chose to
use your time for other purposes.
9–12
Your education was no better and no worse than
that had by most other people.
13–15
Good instructors and familial support saw you do
well in your education. You start the game with
one profession of your choice.
16–17
You excelled in your studies and have a bright
mind. You start the game with a profession of
your choice and you know how to speak, read,
and write in one additional language.
18
Your family spared no expense when it came
to your education; you had the best instructors,
access to vast libraries, and were disciplined if
you showed anything but enthusiasm. In addition
to gaining an extra profession, you know two
additional languages (in which you are literate),
you also have two areas of scholarship.
Signature Background Event
d20 Event
1
An evil child, a monster, or something else hurt you
in a bad way. Scars crisscross your body and you
might be missing the tip of an ear or walk with a
limp. Roll a d6. On a 4 or higher, you later found
your tormentor and gave back what you received
tenfold.
2
While exploring an urban environment, inhabited or
abandoned, you stepped onto a narrow path and
followed it into Hell. You became trapped there and
had to bargain with a devil for your freedom. Gain 1
Corruption and you start the game with one Mark of
Darkness.
3
You remained in the wilderness or you fled to it
to escape danger. If you missed other people, you
overcame your loneliness to learn how to make it
in the forests and the fields. Add one wilderness
profession of your choice to your list of professions.
4
Blood stains your hand. You have since explained
away the act of murder as a necessary thing, telling
yourself that it was kill or be killed, but deep down
you know the truth. You killed when you didn’t have
to and one day, you fear, you will have to face the
consequences. In the meantime, gain 1 Corruption.
5
You had a family for a time, but no more. Someone
or something took them from you. Spouse and
children, gone. You might search for them still
or they might have passed from this world into
whatever awaits beyond. Or, maybe you are
responsible for their disappearance and you cannot
bear to think about the part you played.
6
You found a place in service to the Maiden of the
Moon. A temple could have taken you in when you
were in need, offering you food and shelter, or you
could have sought out a place among the priests,
to learn the rites and rituals of the faith in order to
serve the goddess. Whether this was a long-term
arrangement or short, you have come away with the
acolyte of the Moon Maiden profession.
7
When you befriended the sprite, your life changed.
The faerie opened your eyes to a whole new world,
showing you sights you never imagined were
possible. You have since parted ways, but the faerie
sometimes lends aid when you least expect. When
you roll a 1 for a boon, you can roll the die again and
add it to the 1. Once you use this feature, you must
wait 4d20 hours before you can use it again.
8
You have become haunted. If you have Demon
Lord’s Companion, you begin the game with the
haunted complication. Otherwise, people experience
weirdness around you, such as knocking in the walls,
odd odors, and cold spots.
9
A brat decided to adopt you while you were in cat
form. The child dressed you in fancy clothes, made
you sit through tea parties, and put you in all sorts
of humiliating situations. You tried to turn into your
human form, but some queer magic prevented you.
That magic was your love. You slipped away, but
you still check in on this person from time to time.
10
You were pulled into a whirlwind adventure of
danger, excitement, and thrills beyond anything you
could have imagined. You made a lifelong friend
from the experience, a character who might play a
part in the campaign that you develop with the GM,
and you gained a taste for adventure that puts your
feet on your current path to fame and fortune.
11
You accompanied a merchant and visited many
lands, meeting people of all cultures, ethnicities,
and ancestries. From your extensive travels, add a
language to the list of languages you know.
d20 Event
12
Ignorance landed you in deep trouble. Some
fool discovered your true nature and then came
to the conclusion that you are, in fact, a wicked
skinchanger. After attacking you with a silver spoon,
you transformed into a cat and ran off. You haven’t
been back to that community since, as you believe
the people there might share in the same stupid
ideas as the one who discovered you.
13
Believing your education to be of the utmost
importance, your family sent you away to the Nine
Cities where you learned from the brightest minds
in Rûl. You completed your studies having been
exposed to new ideas, beliefs, and philosophy. Add
two areas of scholarship to your professions.
14
Hostile humanoids struck your settlement and you
counted yourself among the defenders, fighting to
protect your friends, loved ones, and home. You
emerged from this experience shaken, but resolved
to never fall victim to such an attack again. Increase
your Insanity by 1, but you begin the game with one
military or swift weapon of your choice.
15
You found magic during your explorations and your
mind opened to new possibilities. You discover
one tradition of your choice. As normal, from
discovering this tradition, you learn one rank 0 spell
from the tradition.
16
Thanks to your keen instincts, you unmasked a
villain in your community. Unfortunately, this person
was your lover or closest friend. You didn’t want to
believe. You tried to convince yourself that the clues
were nothing. But, in the end, you found this person
out and stopped them from completing the ritual
that would have sent your community spinning off
into the Void. Gain 1 Insanity, but you never have to
pay for food or drink in your community.
17
You have talent producing art: painting, sculpting,
writing, or something else. You produced a piece so
good that a noble purchased it, lifting you and your
family to a comfortable lifestyle. You start the game
with 2d20 ss.
18
You took up with a powerful witch, acting as her
companion and, to some extent, her familiar. You
helped with her magic and potions, while watching
over her when she slept. Your mistress was dragged
off by troglodytes and probably eaten. You survived
by hiding under a footstool. You escaped with a
potion of the GM’s choice while the fires, started by
the hideous people, consumed your house.
19
During one of your evening strolls across the
rooftops of a large city, you spied through a
window a well-known religious leader engaged
in lewd conduct with a lover a third his or her
age. You might have purged knowledge of this
experience from your head after a few nights of
hard drinking, but you hated this person, who once
kicked you while you were in cat form. You’ve been
blackmailing the figure for a while, but it really can’t
go on forever and someday you might push this
person too far.
20
You served as the ship’s cat on the infamous
pirate vessel, The Vengeance. You got along well
during this time and enjoyed a fair amount of
luxury for your position—turns out that the rats
really didn’t want to be on the ship in the first
place and so your days and nights were yours.
Well, everything went to the bottom of the sea
after your captain, whose name you can’t bother
to recall, angered the Kingdom of Sails and earned
swift and violent retribution after buggering the
prince or princess, who was a willing participant,
make no mistake. You made your way, but not
before you pocketed the captain’s map to buried
treasure. You just need a few confederates to help
you find the treasure and it should be all the milk,
cheese, and mackerel you could ever want for the
rest of your days.
Physical Features
In case your eye slid from the page due to some failure
of the text to grip your attention, ferren are people
who can turn into cats, cats who can turn into people,
or, maybe, both are true. From this, you should
deduce that you have two forms to define. What do
you look like as a human? How about as a cat? The
answer to these and other questions might rise to the
surface in the following tables.
Apparent Age
Maybe you look as old as you really are. It could
be that hard living has taken a toll on you, graying
you before your time. Or, you could be blessed with
youthful looks and yet be old enough to know what a
gift this can be. The seeming age holds true in either
of your forms.
Feline Form
No cat exists that doesn’t have a ferren counterpart.
You could be gray, white, a tuxedo, a tabby, or some
speckled combination created by generations of bad
decisions made in dark alleys under the light of the
full moon. Since someone is bound to ask, yes, you
might even be hairless.
Human Form Appearance
Ferren pass easily for humans. People can go their
whole lives without ever guessing their best friend
roams the streets in cat form at night or that their
prized show cat is in fact the snooty woman who they
keep seeing when out and about. You can choose any
form for your human appearance.
Distinctive Traits
Distinctive traits are the features that people
remember and identify as belonging to you. Such
traits can be inborn or gained over time. You can have
as many traits as you like or none. The table below
gives you some fun, ferren-themed traits.
Apparent Age
3d6 Apparent Age
3
You look like a child. You might be one too. At
your age, you have the rest of your life ahead of
you. Why would you mess it up fighting demons
and stuff?
4–5
People might tell you that you’re a bit young to be
doing a dangerous job like adventuring. You look
as if you have a few years to go before you reach
the adult neighborhood.
6–8
Young, vibrant, full of health and ready to do it all.
You have all the confidence of youth.
9–12
You look like an adult, full grown and ready for all
the responsibilities ages thrusts on your shoulders.
13–15
You found your first gray hairs and notice a bit of
weathering around the eyes. Nothing that a few
cosmetics can’t cover up.
16–17
In dim light, you look like your young self, but,
really, you’re not fooling anyone. You look like
you’re running low on middle age years and might
have to reach into the old barrel.
18
You look old and, probably, feel old. Wrinkles?
You have them. Gray hairs? You’d punch an orc
for gray hairs to cover the white on your head.
You’ve slowed down a bit and your joints pop and
creak. You probably groan when you bend over.
Feline Forms
d20 Coats
1
You have a mottled coat, striped or spotted, made
of browns, tans, and reds. You have a white chin
and underbelly.
2
You have an orange coat that runs a bit long. No
tail for you!
3
You look like a tabby with a distinctive “m”
pattern on your face. You can have any coloration
made up of white, black, brown, tan, and so on.
4
You have a black face, ears, and paws, but a long
white to tan coat. You have distinctive blue eyes.
5 You have stripes just like a tiger.
6
You have a long, shaggy white coat with black
tail, face, and ears.
d20 Coats
7 You have a solid black coat.
8 You have a solid gray coat and deep orange eyes.
9
You have a thin, slender body, tail, and overlarge
ears.
10
You have a long coat in any color or colors you
like.
11
You have short, plush fur, and a scrunched up
face.
12
You have incredibly long, thick fur that requires
constant grooming. Choose whatever color tickles
your fancy.
13
You are quite large, about twice the size of other
cats. You have short fur but a big expressive face
with a long nose.
14 You have a long body, fluffy tail, and wide face.
15 You have thick fur and a squashed face.
16
You were once pure white, but your fur developed
a pattern and color all your own.
17 You have spots all over your body.
18 You have soft, velvety fur with short, bent ears.
19
You have a tan coat with black or dark brown
markings.
20
Your coat is so thin, you look hairless. Other cats
might call you names.
Human Form Appearance
3d6 Appearance
3
Everything about your appearance puts
people off, maybe even upsetting them. Your
unattractiveness invites stares and inappropriate
commentary or sees people cross the street
to avoid you or make excuses to leave your
presence.
4–5
Utterly forgettable, that’s you. Nothing stands out.
It’s so bad, you have to remind people again and
again that they’ve met you.
6–8
There’s something off about you, some feature
that takes away from commendable physical
qualities and instead makes it difficult to form
romantic relationships. Others might see you
as charming, quirky, or fun, even, but feel little
attraction.
9–12
You look like most other people, average in most
respects. Some cosmetics and fine clothing can
bring you in the vicinity of attractive if not fully
there.
13–15
You have natural beauty that draws the eye and
suitor to follow. Your beauty stems from one or
two fine features.
16–17
For the average person, you might just be the
most striking ever encountered. People notice
you wherever you go and people’s affections,
especially when rebuffed, might lead to some
problems for you.
18
People count you among the greatest beauties
in the land. You have a form many deem perfect,
even considering the widespread opinions of
what is and what is not attractive. Is the perfect
symmetry of your face? The smoothness of your
skin? The flowing, ethereal movements of your
body? It’s all this and probably a whole lot more.
Ferren Distictive Traits
d20 Trait
1
You have a tattoo of a cat somewhere on your
body. First love? Hated enemy? Someone who
moved away, but you never liked much, but
thought it funny to tattoo their likeness on your
body? You decide.
2 Your eyes are different colors.
3
You have long moustaches, so long they seem to
have taken a life of their own. If you don’t want
moustaches, you could have fanciful eyebrows,
long lashes, or profuse body hair.
4 You keep the nails on your hands long and sharp.
5 Your eyes seem to glow in the dark.
6
You have a furry tail. You might tell folks it’s part
of a costume for some obscure stage show that
no one has ever heard about or just claim it as
your own.
7 You have pointed ears.
8
You make a deep rumbling noise in your chest
when you are content and happy.
9
Sudden movement snatches away your attention
from whatever it is that you’re doing. Once, you
spotted a dung beetle and left a conversation
to watch the little creature move its romantic
creation across the path in the hopes of
impressing the lady dung beetles who most
certainly were nearby. You have also taken apart
flies, crickets, and small birds without meaning to.
10
When you feel affection for someone, you gently,
slowly close your eyes.
11
You are given to sudden outbursts of frenzy that
burn themselves out after a few minutes.
12
You keep sprigs of cat mint on your person all the
time.
13
You have cat eyes, meaning your pupils contract
from side to side.
14 You have long eye teeth.
15
Your hands and feet sweat when you’re hot or
nervous.
16
When startled, you scream and hiss until you can
get yourself under control.
17
You groom yourself all the time. You’re not so
crass as to lick yourself, but you wash your hands,
and cover your hands with gloves so you don’t
have to touch anything icky.
18
You always look like you’re on the verge of falling
asleep, but when you sleep, you always have an
eye open. Others might find this spooky.
19
Frequently, you cough up disgusting wads so
foul-smelling that you can clear a room.
20
You pace all the time. Back and forth, always
moving, always twitching, you just can’t sit still.
Personality
Your character might have any personality you like,
though it’s always a good idea to develop a personality
compatible with other members of the group. When
constructing your character’s personality, be sure to
take into account past experiences, connections to
others, and to what extent your character would go to
satisfy needs.
Dependability
Dependability speaks to your overall reliability. Will
you do what you say you’ll do or not? How good is
your word?
Sociability
People could exhaust you or feed your soul. Your
sociability tells you how well you get along with
others and your ability to handle social situations.
Outlook
How you see the world describes your outlook. You
could see the silver lining in the darkest clouds or live
your life expecting the worst at every turn.
Receptiveness
Receptiveness describes your willingness to accept
change in your life, to take risks, and to consider new
ideas.
Affability
You could enjoy social gatherings, but be fairly quiet
or you could hate them and have a loud mouth and
seem gregarious. Affability describes how friendly you
can be.
Morality
Last comes morality, which describes your knowledge
of good and evil, and, when given a choice, what sorts
of activities you might perform.
Dependability
3d6 Dependability
3
I make all kinds of promises and then do whatever
I want. This might be irresponsible, but it’s my life
and I’ll live it in whatever way I choose.
4–5
Was I supposed to do something? Hmm. Hey, look
at that!
6–8 If I remember, I’ll do it.
9–12
For important stuff, I do what I said I would do.
Yeah, sometimes I let the small stuff slide, but I
never mean any harm. You have to have priorities.
13–15
I feel guilty when I don’t follow through and so I
try to do whatever I say I will, even if it makes my
life a bit more difficulty.
16–17
You can rely on me. I’m one of the most
dependable people you will ever meet.
18
If I say I will do something, I will do it. I won’t
allow distractions or obstacles to stop me. And
if somehow, circumstances beyond my control
prevent me from accomplishing my mission, I will
go to any length to make restitution.
Sociability
3d6 Sociability
3
Social interaction vexes me. I clam up, become
nervous, and then spend my time looking for a
way out.
4–5
I find people exhausting. I can handle a few at a
time and then I need to be alone.
6–8
I prefer the company of friends and I become a
little uncomfortable when around strangers.
9–12
I enjoy spending time with others, but I’m also fine
when I’m alone.
13–15
I seek out social gatherings and enjoy myself with
just about anyone.
16–17
I thrive in social situations. I can hang out all night
and be one of the last to head home.
18
If I go too long without other people, I become
nervous and upset.
Outlook
3d6 Outlook
3
I am always worried. If there’s nothing to be
worried about, I’ll make up something to worry
over. I cry all the time, have the shakes, and tend
to jump at the slightest sounds.
4–5
Life is misery. My lot is to suffer. In fact, it’s
everyone’s lot but people are too stupid to see it.
6–8
I expect the worst so that I’ll never be
disappointed when it happens.
9–12
Not much you can do about life. It happens.
Best to roll with the punches and join in on the
laughter.
13–15
I try to find the best in every person and situation. I
am willing to give others the benefit of the doubt.
16–17
Nothing gets to me. No matter how bad things
are, I remain upbeat and positive.
18
I am so positive in my dealings, others find me
upsetting. I refuse to accept negative situations
and reshape the narrative to make things seem
better than they are.
Receptiveness
3d6 Receptiveness
3
I am stubborn to the point of boorishness. I refuse
to listen to new ideas. I won’t do anything that I
don’t already know how to do. I am fine just the
way I am.
4–5
I need routine. I crave order. I don’t want to learn
new things, have new experiences, or do anything
that might upset the way I have organized my life.
6–8
For the most part, I’m satisfied with the way
things are. I have my beliefs, habits, and routines.
I have no interest in changing them, so you better
bring a good argument.
9–12
I’m open to new ideas and experiences, but I also
know what I like and what I prefer. You might
change my mind, though.
13–15
I’m always looking for ways to improve and
engage in self-improvement activities all the time.
If there’s a better way of doing things, I’m all ears.
16–17
I get bored a little too easily and so I’m constantly
looking for new experiences and opportunities. I
loathe routine and want each day to be fresh and new.
18
I am erratic, unpredictable, and bring chaos to
every situation. I have a hard time saying no and
that gets me in trouble all the time.
Affability
3d6 Affability
3
I have no interest in other people. They do
nothing for me.
4–5
I have everyone I need and am not looking to
meet anyone else. You have to be interesting or
useful for me to take notice of you.
6–8 I am quiet and reserved. I prefer to listen.
9–12
I am a good conversationalist. I know when to talk
and when to listen.
13–15
I will talk to just about anyone and warm up to
people with ease.
16–17
I talk all the time in social situations. I’m happy to
fill the quiet spaces with my chatter.
18
People are amazing! Every person I meet is a new
story to learn, new experiences to appreciate. I
want everyone to be my friend.
Morality
3d6 Morality
3
I am a monster. I do whatever I want, when I want,
and care nothing for the consequences. I have
left a trail of damaged people behind me and
remembering all the hurts I have caused makes
me laugh.
4–5
I will do the right thing if it serves my interests.
Otherwise, I will do what needs doing.
6–8
I will do the right thing sometimes, but, really, I’m
also likely to just do what I want to do.
9–12 I try to do the right thing when given the chance.
13–15
I try to be a good person. I help others when
asked and make good choices.
16–17
I live to help other people. I help others, even
when no one asks me to, and to do anything to
hurt someone knowingly is unthinkable.
18
I have committed myself to good actions, I
sacrifice to my own detriment. If someone needs a
shirt, I’ll take it off my back. If someone is hungry,
I will go without to feed them. A life of service and
selfless action explains why you are here.
Professions
Like all starting characters, you have at least two
professions. You might have a profession from your
character details that you have determined up to this
point or might lack any. The following table gives
you a way to determine one or more professions from
those commonly held by ferren in the world.
Each profession also includes a bonus or penalty
that applies to your starting lifestyle. If you generate
more than one profession from this table, add the
modifiers together.
Ferren Professions
d20 Profession and Bonus or Penalty
1
Scholar (roll on the Academic Professions table in
Shadow, page 24) (+1)
2 Burglar or pickpocket (–1)
3 Entertainer or musician (+0)
4 Rat catcher (–1)
d20 Profession and Bonus or Penalty
5 Courtesan (+1)
6 Dilettante (+2)
7 Merchant (+2)
8 Rabble-rouser (–1)
9 Drug dealer (+0)
10 Gourmand (+0)
11 Wanderer (–1)
12 Detective (+0)
13 Bodyguard (+0)
14 Outcast (–2)
15 Explorer, cartographer, archeologist (+0)
16 Devotee of the Maiden of the Moon (+1)
17 Adventurer (+1)
18 Fence (+1)
19 Forward observer or guide (–1)
20 Fisher, hunter, or trapper (–1)
Starting Equipment
The following tables help you generate a set of
starting equipment based on your starting lifestyle. To
determine your starting lifestyle, roll a d6 and add it
to the sum of the bonuses and penalties gained from
your professions. Find the total on the following table.
Starting Lifestyle
Total Lifestyle
–1 or less Destitute
0–1 Poor
2–3 Getting by
4–5 Comfortable
6–7 Wealthy
8 or more Rich
Clothing
Lifestyle Clothing
Destitute
A filthy shirt full of holes and darkened by
your perspiration.
Poor Threadbare basic clothing and a ratty cloak.
Getting by Basic clothing and a cloak.
Comfortable
A fine cloak and three sets of basic
clothing.
Wealthy
A fine cloak, six sets of quality basic
clothing, one set of noble’s clothing, and
jewelry worth 5 gc.
Rich
A fine cloak, ten sets of noble’s clothing,
and jewelry worth 10 gc.
Weapons
Lifestyle Weapons
Destitute A club or a sling with 10 stones
Poor A staff, club, or sling with 10 stones
Getting by A basic weapon of your choice and a knife
Comfortable
A military or swift melee weapon of your
choice and a knife
Wealthy Any two weapons of your choice plus a knife
Rich
Any three weapons of your choice plus a
knife
Personal Gear
Lifestyle Personal Gear
Destitute An unpleasant odor and plenty of dirt
Poor
Sack, loaf of bread, jug of water, flint and
steel, and a candle
Getting by
Backpack, rations, skin filled with water, coil
of rope, tinderbox, 2 torches
Comfortable
Backpack, rations, skin filled with water, coil
of rope, tinderbox, 2 torches
Wealthy
Backpack, rations, skin filled with water, coil
of rope, tinderbox, lantern, 2 flasks of oil
Rich
Backpack, rations, skin filled with water, coil
of rope, tinderbox, lantern, 2 flasks of oil
Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting by —
Comfortable
A healing potion plus one of the following:
scroll containing an incantation of a rank
0 spell, small shield, healer’s kit, tool kit, or
writing kit
Wealthy
A healing potion plus one of the following:
scroll containing an incantation of a rank
0 spell, small shield, healer’s kit, tool kit, or
writing kit
Rich
Three healing potions, a personal servant
(commoner), and a bodyguard (mercenary)
Starting Funds
Lifestyle Starting Funds
Destitute —
Poor 1d6 bits
Getting by 1d6 cp
Comfortable 3d6 cp
Wealthy 1d6 ss
Rich 1d6 gc
Ferren Interesting Things
d20 Interesting Thing
1
A ball of yarn, toy mouse, or some other similar
diverting bauble
2 A bundle of cat mint
3 A small box filled with sand
4
Something you threw up with which you couldn’t
part
5 A mysterious metal object of unknown purpose
6 A dead bird, mouse, frog, or similar small creature
7 A passel of fish
8
A stolen purse, monogrammed and made from
silk
9 A moustache brush, wax, and scissors
10 Waggling eyebrows
11 A shiny bit of sea glass
12 A bronze key with the lock it fits
13 The love of a devoted child
14 Fleas
15 A bag of purloined foods
16 A favored blanket
17 A bent and broken birdcage
18 A scratched up log
19
The shredded remains of documents important to
someone who is not you
20 A favorite bowl
```

### Ferren — Demon Lord's Companion 2

- **Entry Type:** Standard Ancestry
- **Source:** Demon Lord's Companion 2
- **Source Page:** 5
- **PDF Page:** 6

```text
Ferren
The ferren have lived among the humans for
generations, hiding in plain sight by keeping
their unusual shapeshifting abilities concealed.
By assuming the forms of ordinary cats, they can
move through their adopted communities without
arousing suspicion. Ferren understand the fear that
skinchangers elicit in other peoples, and many have
been killed after being mistaken for one of those
monstrous creatures, so they prefer to keep their true
nature secret.
Gleaming Eyes and Feline Grace: The appearance
of the ferren offers few clues to their unusual abilities.
They look like other humans, though their eyes might
reflect light like a cat’s in the dark, and they all move
with uncommon grace. Similarly, they can pass for
ordinary animals of that sort when they assume the
form of a feline. In human form, ferren stand between
5 feet and 5-1/2 feet tall and weigh between 100 and 150
pounds.
Children of the Moon: The Maiden of the Moon
bestowed the gift of shapechanging to a tribe of
humans who venerated her, and it’s from that tribe
that the ferren are descended. Most ferren worship
this moon goddess, though some practice witchcraft
or adhere to the tenets of the Old Faith.
Common Names: Ferren use human names,
though those who live as human “pets” might go by
other names.
Creating a Ferren
Starting Attribute Scores Strength 9, Agility 11, Intellect 10,
Will 9
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common Tongue.
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Clawed Hands In human form, your unarmed strikes deal 1d3
damage instead of 1 damage.
Cat Form You can use an action to assume the form of a cat
or return to your human form. You remain in the new form
until you use this talent again. If you become incapacitated
while in your cat form, you automatically revert to your
human form.
If you assume cat form, everything you wear and carry
transforms with you, absorbed into your new form. While
they are absorbed in this way, you cannot use these items.
When you return to your human form, objects reappear
wherever you wore or carried them.
While in cat form, you apply the following changes to your
statistics:
• Your Size becomes 1/4.
• Increase Perception by 2; your Defense becomes 12.
• Your Strength becomes 8 (–2), and your Agility
becomes 12 (+2).
• Your Speed becomes 12.
• You gain the climber trait.
• You gain natural weapons, which are claws and teeth.
These weapons have the finesse property and
deal 1 damage.
• You make rolls to hide or sneak with 2 boons.
• You are indistinguishable from an ordinary cat,
although you can still talk while in this form.
Level 4 Ferren Expert
Characteristics Health +4
You either learn one spell or gain Lynx Form.
Lynx Form When you would assume cat form, you can
choose to assume the form of a lynx instead. While in lynx
form, you apply the following changes to your statistics:
• Your Size becomes 1/2.
• Increase Perception by 2; your Defense becomes 13.
• Your Strength becomes 11 (+1), and your Agility
becomes 13 (+3).
• Your Speed becomes 12.
• You gain natural weapons, which are claws and teeth.
These weapons have the finesse property and deal 1d6
damage. When you attack with these weapons, you
make the attack roll with 1 boon.
• You make rolls to hide or sneak with 2 boons.
• You are indistinguishable from an ordinary lynx,
although you can still talk while in this form.

6
Ferren Age
3d6 Age
3
You are a child, 11 years or younger. You are Size
1/2. Halve your height and weight. After 1d6 + 2
years, your Size becomes 1 and you double your
height and weight.
4–5 You are an adolescent, from 12 to 17 years old.
6–8 You are a young adult, from 18 to 25 years old.
9–12 You are an adult, from 26 to 35 years old.
13–15 You are a middle-aged adult, from 36 to 55 years old.
16–17 You are an older adult, from 56 to 75 years old.
18 You are a venerable adult, 76 years old or older.
Ferren Build
3d6 Build
3 You are short and either thin or heavy.
4–5 You are heavy.
6–8 You are short.
9–12 You are of average height and weight.
13–15 You are tall.
16–17 You are thin.
18 You are tall and either thin or heavy.
Ferren Human Appearance
3d6 Appearance
3 You are hideous.
4–5 You are ugly.
6–8 You are plain and homely.
9–12 You are average-looking.
13–15 You are pretty or handsome.
16–17 You are striking.
18 You are beautiful.
Feline Appearance
3d6 Appearance*
3 Mitted, locket, or harlequin
4–5 Solid
6–8 Bicolor
9–12 Tabby
13–15 Tuxedo
16–17 Tortoiseshell
18 Hairless
*Choose your fur color
Ferren Mannerism
d20 Mannerism
1–2 You are fastidious about cleanliness.
3–4 You like to knock things over.
5–6 You sleep as often as you can.
7–8 You like to hide or climb.
9–10 You are attracted to small moving things.
11–12 You are given to sudden outbursts of manic energy.
13–14 You tend to shred things you handle.
15–16 You hiss when you get angry or frightened.
17–18 You always bury your excrement.
19–20 You are attracted to water, especially running water.
Ferren Personality
3d6 Personality
3 You are vicious and hateful. You lash out at everyone.
4–5
You are an asshole. You make a mess and you
don’t care who has to clean it up.
6–8
You are lazy. You find it hard to make yourself do
much of anything.
9–12
You are inquisitive. Your curiosity often lands you
in trouble.
13–15 You are warm and pleasant. You make friends easily.
16–17 You are aloof, disinterested in other people.
18
You are loyal to your friends, and you support
them in all they do.
Ferren Background
d20 Background
1 A nasty fight left you scarred.
2 You were seduced by a devil. Gain 1 Corruption.
3
You spent a few years in the wilderness. Gain a
random wilderness profession.
4
You killed someone in cold blood. Gain 1
Corruption.
5 You fell in love with a human and had a child.
6 You were raised by priestesses of the Moon Maiden.
7
You stumbled into a hidden kingdom and
remained there for 1d6 years.
8
Someone important to you died, and the loss
haunts you still.
9
Some rotten child mistook you for a cat and took
you home. You only just escaped with your life.
10
You earned a living working in one of your
professions.
11
You traveled extensively. You can speak one
additional language.
12
Someone discovered your true nature and
mistook you for a skinchanger. You left everything
behind to start over somewhere else.
13
You received an education. You know how to read
the Common Tongue.
14
You helped defend your community from a
beastmen attack.
15
You found a scroll containing an incantation of a
rank 0 spell (chosen by the GM).
16
You unmasked a killer or a cultist at large in your
community.
17
You created a lasting piece of art. Add artist to
your list of professions.
18 You found a potion (of the GM’s choice).
19 Someone important owes you a big favor.
20 You came into money. Start the game with 2d6 cp.

7
```

### Fomor

- **Entry Type:** Beastman Ancestry
- **Source:** Hunger in the Void
- **Source Page:** 43
- **PDF Page:** 44

```text
Fomors
Making up the majority of beastmen armies, fomors
are reviled and abused by their kin. Wargs whip these
cowardly, weak, and wretched, creatures forward to
lead the charge against enemies, expending their
lives cheaply. Fomors live short, terror-filled lives,
abbreviated either by their enemies or by their own

44
kind, who torment them, making sport of their pain
or just killing and eating them when there is nothing
else at hand.
Fomors are the most humanlike of the beastmen.
They stand about 5-1/2 feet tall and weigh a bit
more than 140 pounds. Fomors have all the physical
characteristics of humans except for their goatish
heads, complete with horns and bulging eyes. Some
have patchy fur across their chests and farther down,
covering their navel and genitals. Fomors make the
armor they wear by stripping skin from their victims.
Such armor tends to be poor and rots away quickly.
Fomors are just as vicious and nasty as other
beastmen, capable of acts of indescribable evil. They
vent all their hate on the doomed souls that fall into
their hands. Fomor rarely get much to eat, so when
they catch someone, they make the meal last, keeping
their victims alive as they cut off bits and pieces. They
mock their victims’ whimpers and screams, even as
they stuff the flesh into their mouths.
All fomors speak Dark Speech.
FOMOR MOB DIFFICULTY 10
Size 3 beastman
Perception 10 (+0); shadowsight
Defense 14 (soft leather, small shield); Health 40
Strength 10 (+0), Agility 12 (+2), Intellect 8 (–2), Will 7 (–3)
Speed 10
Mob A fomor mob takes half damage from attacks that
target individual creatures and double damage from
attacks that affect an area. The mob acts as a single
creature, but it counts as ten creatures for choosing
targets. The mob makes Strength, Intellect, and Will
challenge rolls with 1 boon.
Creatures can move through a mob’s space, but they
treat the area as difficult terrain. The mob can squeeze
through an opening large enough to accommodate a
Size 1 creature and can move through spaces occupied
by other creatures.
Spawn When the mob becomes incapacitated, it dissipates
and 1d6 fomors that made up the mob appear in open
spaces within the space it formerly occupied. The fomors
can act on the next available turn.
ATTACK OPTIONS
Spear (melee) +2 with 3 boons (3d6 or 1d6 if the fomor
mob is injured)
END OF THE ROUND
Overwhelm If the mob is not injured, each creature that
isn’t a swarm or a mob that is in the fomor mob’s space
or within 1 yard of it must get a success on an Agility
challenge roll or take 2d6 damage.
FOMOR WARRIOR DIFFICULTY 10
Size 1 beastman
Perception 10 (+0); shadowsight
Defense 16 (hard leather, small shield); Health 20;
Insanity 1d3 + 1; Corruption 1d3 Strength 11 (+1),
Agility 13 (+3), Intellect 8 (–2), Will 8 (–2)
Speed 10
Craven A fomor is frightened while within the reach of two
or more creatures that are hostile to it.
ATTACK OPTIONS
Spear (melee) +3 with 2 boons (1d6 + 2)
Pack Fighting When the fomor attacks a target within
the reach of another creature with Pack Fighting that
is friendly to the fomor, the attacking fomor makes the
attack roll with 1 boon. Otherwise, the fomor makes the
attack roll with 1 bane.
Only the toughest and nastiest of the fomors ever
achieve the status of warrior. They lead bands of
lesser fomors, inspiring their wretched followers
with their viciousness—even though they are among
the first to flee when the situation turns against
them. Most fomor warriors festoon their bodies with
trophies taken from their kills, particularly teeth,
fingers, and ears.

45
FOMOR VOID CALLER DIFFICULTY 25
Size 1 beastman
Perception 13 (+3); shadowsight
Defense 12; Health 21; Insanity 1d3; Corruption 1d3
Strength 9 (–1), Agility 12 (+2), Intellect 11 (+1), Will 13 (+3)
Speed 10
Immune frightened
Dread Authority The Void caller grants 1 boon on attack
rolls made by beastmen within medium range. Whenever
a beastman within this range gets a failure on an attack
roll, it takes 1d6 damage.
ATTACK OPTIONS
Skull Staff (melee) +2 with 1 boon (1d6 + 1 plus Agony)
Agony A living creature must get a success on a Strength
challenge roll or become impaired for 1 round.
SPECIAL ACTIONS
Shadow Reinforcements The Void caller causes 1d3 + 1
shadowy beastmen of Size 1 to appear in open spaces it
chooses within medium range. The shadowy beastmen
count as creatures and use the fomor statistics box,
but they cannot move or use actions and have Health 1.
They make their spaces totally obscured and remain for
1 minute or until destroyed. Once the Void caller uses
Shadow Reinforcements, it must wait 1 minute before it
can use it again.
MAGIC
Power 3
Curse hex (4), pain (2), weakness (1), fomor doom (1)
Fire flame missile (4), fire blast (2), fiery volley (1), fireball (1)
END OF THE ROUND
Voice of Authority The Void caller can use a triggered
action to make one creature it can see within short range
immune to the frightened affliction for 1 round.
Rarely, a fomor emerges that is possessed of qualities
unknown to other beastmen. The creatures known as
Void callers, which sport long horns on their heads
and black fur covering their bodies, appear to have
a direct line to the Void. They dress in heavy black
robes, stained with old blood or worse, and carry the
symbol of their office, a staff topped with a skull that
has living eyeballs in the sockets. Void callers take
charge of their fellows and direct the other beastmen
under their command through the fear their magic
inspires and the authority invested in them by
demonic entities.
Fomor Tactics
Fomors are unreliable troops. If they have numbers
on their side, they fight with all the ferocity of other
beastmen, but if the tide turns, they break and flee.
To maximize the utility of these lowly creatures, Void
callers and other beastmen leaders have trained the
fomors in a few special fighting techniques.
Take Down: Fomors using this tactic operate in
squads of three to five and try to eliminate enemies
one at a time. The fomors move in to surround their
target and then, in each round, one uses an action to
attempt to knock down the target (see Shadow, page
52). On a success, the other fomors use their weapons
to rip their prone target to pieces.
Break and Run: Fomors flee when a battle turns
against them. They don’t surrender, either because
the thought never occurs to them or they instinctively
know they’ll find no mercy at their enemies’ hands.
At the end of each round, if the number of remaining
enemies equals or exceeds the number of remaining
fomors, the beastmen drop their weapons and
use their actions to rush away from the enemies,
triggering free attacks if necessary.
Creating a Fomor
Unique fomor characters have the
following statistics.
Starting Attribute Scores
Strength 1d3 + 8, Agility 1d3 + 10,
Intellect 1d3 + 6, Will 1d3 + 5
Perception equals its Intellect score + 2
Defense equals its Agility score
Health equals its Strength score
Healing Rate equals one-quarter its Health
Size 1, Speed 10, Power 0
0 Damage, 1d3 Insanity, 1d3 Corruption
Languages and Professions Fomor speak
DarkSpeech.
Craven The fomor is frightened while within
the reach of two or more creatures that
are hostile to it.
Pack Fighting When the fomor attacks
a target within the reach of another
creature with Pack Fighting that is
friendly to the fomor, it makes the attack
roll with 1 boon. Otherwise, the fomor
makes the attack roll with 1 bane.
Level 4 Fomor Expert
Characteristics Health +5
Cornered Might While the fomor is frightened, its
attacks with weapons deal 1d6 extra damage.
```

### Ghost

- **Entry Type:** Derived Ancestry
- **Source:** Between Life and Death
- **Source Page:** 3
- **PDF Page:** 3

```text
Ghost Characters
You can choose ghost as an ancestry, or your character
can become a ghost after dying in the middle of an
adventure or at a crucial point in the campaign.
Base Ancestry
Only mortal characters with souls can become
ghosts, such as humans, clockworks, dwarfs, and orcs.
Elementals (such as gnomes), faeries, changelings,
and similar creatures cannot, either because they
don’t have souls or because the soul cannot be parted
from the flesh.
If you’re creating a new ghost character, first
start with a mortal character. Run through the
advancement process until your character has all
the benefits for your group level. Then, kill your
character. See Cause of Death for more details.
If you were playing a character of a suitable
ancestry who died during an adventure, the GM
might let you continue to play as a ghost, provided
doing so makes sense in terms of the story. This lets
you keep contributing to the story without having
to stop play while the group waits for you to create
a replacement character. Since death is a traumatic
experience, not everyone might be able to come back,
so the GM might call for a Will challenge roll with 1
bane. On a success, the character’s soul slips from the
corpse and becomes a ghost. Otherwise, the character
is irrevocably dead and the soul moves on.
Cause of Death
You have to die to become a ghost. Your death might
have been sudden and unexpected, from a shocking
act of brutality, or you might have bled out slowly after
being hacked, shot, or torn apart. You can use the Causes
of Death table to determine the circumstances of your
character’s death if you don’t already know them.
Causes of Death
d20 Cause of Death
1 A jilted lover stabbed you to death.
2 A rival had you poisoned.
3 A jealous suitor strangled you.
4 An assassin, hired by your enemies, took you out.
5 A stack of bricks fell and crushed you.
6
You accidently drank or ate something you
shouldn’t have.
7 You were run over by a runaway carriage.
8 You overdosed on a drug.
9 You starved to death.
10 You froze to death.
11 You drank yourself to death.
12 You succumbed to a terrible disease.
13 You just keeled over one day.
14
You hanged yourself, drank poison, opened your
wrists, or found some other way to end your life.
15
Someone’s errant spell sent pieces of you flying
everywhere.
16 A rampaging monster made a snack of you.
17
You were shot, stabbed, filled with arrows, trampled,
or killed in some other way on the battlefield.
18 You shat yourself to death for unknown reasons.
19 A demon tore you apart.
20 Undead feasted on your screaming body.
Haunting
Something has to keep your spirit in the mortal world.
Whether it’s a person for whom you are responsible,
a circumstance you simply cannot move past, or a
place to which you have strong ties, you haunt the
thing that anchors you. The nature of the thing you
choose to haunt restricts what you can do and where
you go. It’s not recommended for player characters
to be bound to a particular place, unless that place is
the setting for the entire adventure or encompasses
enough territory to allow the character to participate
in the story. Instead, it’s best to choose something
mobile such as a person—perhaps a loved one—or an
object, such as your remains, which can be dumped in
a bag and carried around. If you can’t decide, roll for a
random result from the Hauntings table.
Hauntings
d6 Haunting
1
One interesting thing you were carrying at the time
of your death.
2
A weapon, implement, or suit of armor that
belonged to you.
3 Your physical remains.
4 Someone in your group you liked.
5 Someone in your group who loved or respected you.
6 Someone in your group you hated.
Appearance
Your death has left a mark on your spirit, shaping your
soul’s appearance to those who can see you. At the very
least, you appear as you did at the time of your death,
but transparent. If you met a traumatic end, the ravages
to your body show in your spiritual form, making you
appear damaged and terrible to behold. Consider how
you died and alter your physical appearance so that the
circumstances of your death are immediately obvious
to any who can see you.
Psychology
You don’t experience dying and face an existence as
a disembodied spirit without suffering some trauma.
Your transition from life to death caused your sanity
to buckle to the point of breaking. As a result, you gain
a personality trait, a quality that reflects an unstable
mind. You can choose whatever quirk you like, but it
ought to reflect the experiences you had in life and
the manner in which you died.
Ghost Traits
Apply all of the following traits to your character.
Attributes You do not have a Strength score. You cannot
physically interact with objects, creatures, or your
environment. You are immune to any attack or effect
that would target your Strength score or that can be
resisted with a success on a Strength challenge roll.
Characteristics Increase your Perception score by 2.
Reduce your Health score by the Strength score you
had when you died. Recalculate your healing rate based
on this new score. Finally, discard your Insanity score.
You are no longer at risk of gaining Insanity as you are
already mad.
Frightening A creature that does not have the frightening
or horrifying trait must make a Will challenge roll when
it first sees you. The creature makes the roll with 1 bane
if it sees four or more frightening creatures at the same
time. On a failure, the creature becomes frightened for
a number or rounds equal to 1d3 + its Insanity total.
Once a creature makes this roll, it becomes immune to
your frightening trait until it completes a rest. Members
of your group that get a success on the challenge roll
become permanently immune to your frightening trait.
Darksight You can see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Immune damage from cold, disease, fire, and poison;
asleep, blinded, deafened, diseased, fatigued,
immobilized, poisoned, slowed
Insubstantial You take half damage from weapons. You
ignore the effects of moving across difficult terrain and
you can move through solid objects and other creatures.
Naturally Invisible You are invisible to all creatures other
than spirits, animals, and children. While invisible, you
lose the frightening trait and you cannot use actions or
triggered actions to attack.
Ghostly Equipment You have ghostly copies of everything
you wore and carried at the moment of your death. If
you drop an item, it vanishes from existence. Ghostly
armor protects you as it did when you were alive and
your weapons deal half the damage they did when you
were alive.
Manifestation You can use an action to remove your
Naturally Invisible trait, which causes you to become
visible. You can use an action to end this effect.
Bound by Remains You cannot move or be moved more
than 20 yards from your body’s remains. If your remains
are moved more than 20 yards from you, you take 1d6
damage at the end of each round until you are within 20
yards of your remains again. If this damage would cause
you to become incapacitated, your soul descends to
whatever fate it earned in life.
Reformation When you become incapacitated, you do not
make fate rolls. Instead, you disappear from existence.
If you are within 20 yards of your remains when you
disappear in this way, you return to existence in a space
of your choice within 1 yard of your remains 24 hours
later. Otherwise, you find your fate in the Underworld or
Hell, depending on your Corruption score.
Level 4 Expert Ghost
You learn one spell or gain Swift Manifestation.
Swift Manifestation On your turn, you can use a triggered
action to use your Manifestation trait or end its effect.
```

### Ghoul

- **Entry Type:** Derived Ancestry
- **Source:** Flesh of the Fallen
- **Source Page:** 2
- **PDF Page:** 2

```text
Ghoul
The gods despise mortals who feed on their own and
reward such despicable behavior with a terrible curse.
The curse transforms people into wretched monsters
debased by unholy hunger. Called ghouls, these vile
souls haunt graveyards for easy pickings, digging up
the dead to strip the rancid meat from the bones and
gobble down reeking viscera crawling with maggots.
Though their actions appall them, their hunger
impels them, driving them to stuff their mouths with
the most unthinkable fodder. Ghouls do take fresher
fare where they can find it. The most corrupted stalk
communities, snatching the old, young, and anyone
else not nimble enough to escape their clutches.
Despised and hunted, ghouls find enemies wherever
they go.
Wrath of the Ancients: The First People comprised
many tribes, some peaceful, others violent, and a few
debased, little better than wild, mad beasts. One tribe
took to eating the flesh of their enemies, believing
they would gain their strength and knowledge.
Although disgusted by the act, the faeries did not
interfere until they themselves became victims. After
tribal warriors descended on a peaceful village of fey
folk and feasted on the bodies of the dead, the Horned
King laid a terrible curse on mankind. If man would
act as scavengers then scavengers man would become.
Henceforth, whenever humans and others like them
ate their own kind, they would become ghouls, slaves
to their unspeakable appetites.
Divine Terror: Transforming into a ghoul wrecks
a person’s mind and imparts an abiding fear of the
gods whose wrath they have incurred. Ghouls become
nervous when around religious symbols and icons lest
their proximity to such signs bring even worse down
on their heads. Ghouls do not willingly enter areas of
holy ground.
Becoming a Ghoul
Only living creatures not immune to the diseased
affliction can become ghouls. Humans are the
most common, but it’s possible for fauns, halflings,
and dwarfs to suffer the curse. Characters with the
Powerful Ancestry trait cannot become ghouls.
If you belong to an ancestry capable of transforming
into a ghoul and you consume the flesh from a
creature, alive or dead, who shares your ancestry, you
must roll a d6.
On a 1, you become defenseless for 1d6 hours and
then transform into a ghoul.
On a 2–5, you suffer no ill effect.
On a 6, you suffer no ill effect and you are not at risk
of becoming a ghoul until after you complete a rest.
Upon becoming a ghoul, you apply all of the
following traits to your character.
Ghoul
Attribute Scores Agility +2, Intellect –2
Characteristics Perception +2, Speed –2
Immune damage from disease or poison; diseased,
poisoned
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Dreadful Appearance When you attack a living creature
that can see you, the target creature must make a Will
challenge roll. The creature becomes frightened for 1
minute on a failure or becomes immune to your Dreadful
Appearance until after it completes a rest on a success.
Unholy Feast You can use an action to eat one dead
creature you can reach, which requires concentrating for
1 minute. At the end of this time, you utterly consume the
target corpse, and you assume its living appearance until
you complete a rest. While you have this appearance,
you lose the Dreadful Appearance talent.
Accursed Compulsion At the end of each round that you
are within short range of a dead creature, you must
make a Will challenge roll. On a failure, you must move
toward the dead creature and use your Unholy Feast
talent when you are next able. Once you do so, you lose
Accursed Compulsion for 1 hour.
Fear of the Gods Against creatures wearing or wielding
religious symbols or icons you make attack rolls with
1 bane. In addition, you become frightened while on
areas of holy ground (see Uncertain Faith) and remain
frightened for as long as you remain there.
Powerful Ancestry When your group attains level 1, you
do not choose a novice path. Instead, whenever the
Advancement table indicates you would gain benefits
from a novice path, you gain the benefits from your
ancestry for that level.
If you already chose a novice path before you became
a ghoul, remove the path and any benefits you gained
from that path, starting with the benefits gained at the
highest level and then working backwards. For each set
of benefits lost in this way, you gain 1 Insanity.
Level 1 Ghoul
Characteristics Defense +1, Health +2, Perception +1
Natural Weapons You can attack with your claws and
teeth. Together, they count as a basic weapon with the
finesse property that deals 1d6 + 3 damage.
Unwholesome Recovery Once per day, when you use your
Unholy Feast talent, you heal damage equal to your
healing rate.
Level 2 Ghoul
Characteristics Defense +1, Health +2, Perception +1
Drink Blood When you attack with your natural weapons
and the total of your attack roll is 20 or higher and
exceeds the target number by at least 5, you can drink
the blood of a living target. The target takes 1d6 extra
damage and becomes fatigued for 1 minute. While
fatigued in this way, the target is also slowed. If already
fatigued, the target takes another 1d6 damage.
Gain one of the following benefits:
Magic Increase your Power by 1, discover a tradition, and
learn a spell from that tradition.
Weapon Training When you attack with a weapon, you
make the attack rolls with 1 boon.
Level 4 Ghoul Expert
Characteristics Health +2
Gain one of the following benefits:
Magic Either discover a tradition or learn a spell.
Sharpened Teeth and Claws Your attacks with your natural
weapons deal 1d6 extra damage.

Level 5 Ghoul Expert
Characteristics Health +2
Gain one of the following benefits:
Magic Increase your Power by 1 and either discover a
tradition or learn a spell.
Combat Prowess Your attacks with weapons deal 1d6 extra
damage.
Level 8 Ghoul Expert
Characteristics Health +2
Sense Flesh You make Perception rolls to find living or
dead creatures that have physical bodies with 1 boon. As
well, you reduce the number of banes to your attack rolls
against such creatures by 1.
Gain one of the following benefits:
Magic Either discover a tradition or learn a spell.
Combat Expertise When you use an action to attack with a
weapon, you can either deal 1d6 extra damage with that
attack or make another attack against a different target
at any point before the end of your turn.
```

### Gnome

- **Entry Type:** Standard Ancestry
- **Source:** Children of the Restless Earth
- **Source Page:** 2
- **PDF Page:** 2

```text
Gnome
From earth and stone, the genies fashioned the
gnomes, infusing them with life to serve as builders
and shapers, to become the makers of things. Gnomes
raised the mountains and carved the paths the rivers
would take. They planted the forests and pushed the
earth to form hills and valleys. They took the raw,
untamed world the genies spun out from chaos and
gave it shape, purpose, and beauty.
The gnomes were among the first to flee after
the genies’ dominion unraveled. A furtive people,
frightened of their makers, they dug into the earth,
opening spaces where they could survive the madness
of the genies and the rise of less worthy inheritors,
such as the intruding faeries who picked up the fallen
mantle and rule in genies’ stead.
Generations spent in the depths of the earth
instilled in the gnomes a deep and abiding fear of the
surface and the painful light of the hated sun. The
gnomes contented themselves with exploring their
subterranean world, unearthing glittering treasures
from the raw stone, following veins of gold and silver,
and discovering secrets and places buried since the
dawn of the world. Their isolation and refusal to
interact with the peoples in the world above made
them a mythical people, the subject of tales told by
miners who became lost in the dark or heard strange
sounds coming from beyond the light of
their lanterns.
If the gnomes had a choice, they would have
remained in the depths, but the Destroyer’s approach
has forced them out. Earthquakes have shaken the
mountains to their foundations, letting loose the
world’s blood as fiery lava to flood their homes.
Strange things have torn free from their subterranean
prisons and run through the tunnels, their screeches
as sharp as their claws. With nowhere to turn, the
gnomes have emerged from the depths once more,
finding the world they left much changed from how
they left it.
Children of Earth and Stone: Generations spent
underground have transformed gnomes into their
present state. No taller than 3 feet, they have short,
compact bodies. They have overlarge eyes that help
them see in the darkness of the deep places and large
noses to help them sniff out trouble.
Gnomes find the light of the sun painful, so they
wear thick goggles over their eyes. They cover their
chalky skin in heavy clothing that includes tall,
pointed caps, long coats that drag the ground, and
heavy boots to anchor them to the earth—many
gnomes believe that if they doff their clothing, they’ll
float away into the endless blue.
Dwellers in the Deep: Until recently, gnomes lived
in caves deep underground. Their homes feature
high, vaulted ceilings supported by carved columns,
walls studded with jewels of impossible size and
deposits of precious metals that would cause any
dwarf to break out in a sweat. Tunnels riddle their
communities, burrowing through the rock for miles.
A few underground communities remain, but the
devastation that ravaged their homes drove most to
the surface, and they have slowly spread across the
Northern Reach finding homes in Crossings, Sixton,
and elsewhere.
Brave New World: The gnomes were unprepared
for the disaster that erased their homeland. Normally
shy, reclusive, and private, the catastrophe thrust
them into a strange and alien landscape, one with
boundless emptiness stretching above. Uncertainty
about the future, combined with the strangeness of
their new homes, afflicts gnomes with great anxiety.
For all their fears, they remain a people curious,
eager to learn about the world and how things work.
Most gnomes have managed to overcome their fears
and misgivings and now see the possibilities in front
of them.
Strangers in a Strange Land: Gnomes have little
experience dealing with the people dwelling in the
world above. Refugees have spilled into the Northern
Reach where they encountered the humans who
have either welcomed them or at least tolerated their
arrival. Prior to their emergence, the gnomes came
into conflict with dwarfs at various times in the past,
usually as a result of prospectors drawing too close to
their enclaves. Other than these peoples, gnomes are
strangers to the surface world and have yet to form
opinions about the people who live here.
Tongue of Earth and Stone: Spoken almost
exclusively by gnomes, it is close enough to the
language spoken by sylphs, undines, and salamanders
that they can usually make themselves understood
to one another. The written form of gnomish uses
patterns of dots and lines in place of characters.
Common Names: Amber, Basalt, Beryl, Chert, Coal,
Flint, Lime, Onyx, Opal, Pog, Rose, Ruby, Shale,
and Wackes.
Dark Goggles
All gnome characters add a pair of heavy
goggles to their starting equipment. The
goggles feature thick black lenses to
protect their sensitive eyes from bright
light. However, while worn, the goggles
impose 1 bane on Perception rolls that
involve sight. If lost, a pair of goggles can
be replaced for 1 ss.

3
Creating a Gnome
Strength 10, Agility 8, Intellect 9, Will 11
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1/2, Speed 8, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak Gnomish.
Immune damage from disease or poison; diseased,
poisoned
Darksight You can see into areas obscured by shadows
and darkness within medium range as if those areas were
lit. Beyond this distance, you treat darkness as shadows
and shadows as lit.
Impaired by Light You are impaired while in areas of
sunlight and not wearing some kind of covering over
your eyes.
Deep Sense You cannot become lost while traveling
underground.
Harden You can use an action, or a triggered action
on your turn, to harden your skin for as long as you
concentrate, up to 1 minute. While your skin is hardened
this way, you take half damage. You can use this talent
a number of times equal to 1 + your Power score. You
replenish expended uses when you complete a rest.
Petrifying Death When you die, you turn into a stone
statue and explode. Rock flies out from a point in your
space out to a number of yards equal to your group
level. Everything in the area takes damage equal to
half your Health. A creature in the area can make an
Agility challenge roll and takes just half the damage
on a success.
Level 4 Expert Gnome
Characteristics Health +5
You learn one spell or gain Stone Walk
Stone Walk You ignore the effects of moving across
difficult terrain caused by materials made of earth,
sand, or stone. In addition, you can pass through solid
obstacles made from earth, sand, or stone that are no
thicker than 1 yard.
PERSONALITY
3d6 Personality
3 Something is broken inside you, and you find
yourself hating most people you meet. You might
hurt them for no other reason than you can.
4–5 Nervous and fearful, you tend to fawn around
people you consider more powerful than you.
6–8 You are uncomfortable around people who aren’t
gnomes and hold them to a higher standard.
9–12 You are quiet and reserved.
13–15 You are inquisitive, always interested in
learning new things.
16–17 You are witty, personable, and make friends
wherever you go.
18 Deadly serious, you never laugh, and you
approach every situation with icy calm.
Age
3d6 Starting Age
3 You are a child, no more than 9 years old.
Reduce your height and weight by 50% and
your Size by half.
4–5 You are an adolescent, from 10 to 15 years old.
Reduce your starting height and weight by 25%.
6–8 You are a young adult, from 16 to 20 years old.
9–12 You are an adult, from 21 to 50 years old.
13–15 You are a middle-aged adult, from 51 to 100
years old.
16–17 You are an older adult, from 101 to 200 years old.
18 You are a venerable adult, aged 201 years
or older.
Background
d20 Background
1 A run-in with a troll nearly killed you. Small flecks
of stone mar your flesh.
2 You once visited the Great Cleft and heard the
One Who Slumbers shift in his sleep.
3 A spell whisked you from your homeland, and
you were forced to serve a cruel master for
many years.
4 You were exiled from your homeland after
committing a terrible crime.
5 You had a spouse and children, but they all died
during the Great Collapse.
6 You fought the dwarfs who mined too close to
your community. You killed many and do not
trust them.
7 You made frequent trips to the surface. Your
knowledge of the World Above helped you escort
many of your kind to safety.
8 During the Great Collapse, you were buried
alive. It took several days, but you managed to
wriggle free.
9 Your family lived as slaves to the salamanders.
You were the first to have escaped.
10 You earned a living working in your profession.
11 You left home when you were young to seek your
fortune in the world above.
12 Your people shunned you for some reason, and
you knew only loneliness. The Great Collapse gave
you a new chance to find your place.
13 You lived among the priests of your people,
learning their ways and rites.
14 Troglodytes captured you and made you their
slave. You escaped after killing your owner.
15 You fought against troglodytes and other
dwellers of the deeps to protect your people.
16 You discovered an incantation and managed
to perform it. Unfortunately, someone close to
you died as a result. You’ve kept this secret your
whole life.
17 You were a leader in your community, and you
helped many escape the ruins of your homeland.
18 You once crept into a dragon’s lair and made off
with a single gold crown.
19 You ventured into the depths of the earth and
stumbled into the Underworld. You were so
appalled by what you saw, you fled for the
surface and never returned.
20 You came into money. Start the game with
2d6 cp.

4
Build
3d6 Build
3 You are quite small. You stand about 12 inches
tall and weigh about 10 pounds. Reduce your
Size to 1/4.
4–5 You are 18 inches tall. Reduce your Size to 1/4.
6–8 You are skinny for a gnome, weighing no more
than 25 pounds.
9–12 Your height and weight fall within the average
ranges. You are between 2 and 3 feet tall and
weigh from 20 to 40 pounds.
13–15 You are heavy, bulky, overweight, or muscled.
You weigh between 40 and 60 pounds.
16–17 You are tall for a gnome, standing between 3
and 4 feet in height.
18 You are enormous for a gnome. You stand over
4 feet tall and weigh 80 pounds or more.
Appearance
3d6 Appearance
3 Your features appear melted, runny, as if you
were made from mud. You are hideous.
4–5 You have thick, plain features, skin pebbled and
rife with fissures.
6–8 Your eyes are a bit too large, your features a
little too big, making you unappealing to other
gnomes.
9–12 You are typical for a gnome with the usual
exaggerated features and bulging eyes common
to people of your kind.
13–15 You have just one exaggerated facial feature—
eyes, nose, ears, or mouth.
16–17 You have fine features and a fit body. You stand
out from other gnomes.
18 You are a great beauty among gnomes and
attractive by other people’s standards. You have a
well-formed body and appealing features.
He Who Slumbers
Far below the surface of the earth in a
massive cavern is a chasm known as the
Great Cleft. The gnomes living nearby heard
strange sounds emanating from the depths,
eerie noises, mutterings, and shifting of
rock. Sensing a pattern in these noises, the
gnomes became certain that a powerful being
strove to communicate with them. A religion
formed around the being they named He
Who Slumbers, and the priests who served
him called themselves the Deep Speakers
since they translated the will of their god
and communicated the commandments to
their fellows. As the doom that wiped out the
gnome settlements originated from the Great
Cleft, the religion has all but died out. The few
who practice the religion have Destruction,
Divination, and Earth as their associated
traditions.

5
```

### Goblin — Snot and Stitches

- **Entry Type:** Expanded Ancestry
- **Source:** Snot and Stitches
- **Source Page:** 5
- **PDF Page:** 5

```text
Goblin Characters
Everything you need to create a goblin character
can be found in Shadow of the Demon Lord. The rules
in that book let you make a character rapidly with
enough information to portray it in the game. This
section offers advanced rules for making a goblin,
with alternative features and a slew of tables to
develop your character’s background, appearance,
and personality. If you use the rules presented here,
you must also use those supporting tables to flesh out
your character and determine your professions, the
languages you know, and your starting equipment.
Creating a Goblin
Choose whether to use random or fixed attribute scores.
Random Attribute Scores Strength 6 + 1d3, Agility 10 + 1d3,
Intellect 8 + 1d3, Will 7 + 1d3
Fixed Attribute Scores Strength 8, Agility 12, Intellect 10,
Will 9
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1/2, Speed 10, Power 0
Languages and Professions You speak the Common
Tongue and Elvish.
Immune damage from disease; charmed and diseased
afflictions
Iron Vulnerability You are impaired while you are in
contact with iron.
Shadowsight You can see in areas obscured by shadows as
if those areas were lit.
Sneaky You make Agility challenge rolls to hide and sneak
with 1 boon.
Level 4 Expert Goblin
Characteristics Health +4
You learn one spell or gain one of the following talents.
Spring Away When a creature you can see gets a failure
on an attack roll against your Defense or Agility, you can
use a triggered action to retreat.
Twist the Knife When you get a success on an attack roll
with an edged basic or swift weapon, you can use a
triggered action to deal 1 extra damage.
Robust Constitution You take half damage from poison
and you make challenge rolls to resist or stop being
poisoned with 1 boon.
Goblin Development Tables
You can use the tables presented here to create a
goblin character with a detailed background. If you
use these tables, do not roll for random starting
professions or starting wealth using the tables in
Shadow—use the tables here instead. You must roll
dice for each table and take the result of each roll.
Family Tables
Use the family tables to detail your character’s
upbringing.
Goblin Breeds
3d6 Breed
3 Mite. Decrease your Size to 1/4 and your
Strength by 2. Increase your Agility and
Perception both by 1.
4–5 Pesky
6–12 Goblin
13–15 Ouphe
16–17 Bogun
18 Hob. Increase your Size to 1 and your Strength
by 1. Decrease your Agility by 1.
Tribal Communities
3d6 Community
3 You were raised by humans. Skip the remaining
family tables.
4–5 You were raised by 2d6 goblins.
6–8 You grew up in a tribe of 5d6 goblins.
9–12 You grew up in a tribe of 5d20 goblins.
13–15 You grew up in a tribe of 5d20 + 50 goblins.
16–17 You grew up in a tribe of 5d20 + 100 goblins.
18 You were orphaned and forced to raise yourself
in a city. Skip the remaining family tables.

Homelands
d6 Homeland
1 Forest
2 Slum
3 Sewer
4 Rubbish heap
5 None; you moved around a lot
6 Maze of the Goblin King
Tribal Relationships
3d6 Relationship
3 Your tribe kicked you out after you betrayed
them, brought ruin to your people, or did
something else to deserve their ire.
4–5 Others in your tribe disliked you, and you grew
up alone and unwanted.
6–8 You were an outsider, never quite fitting into
your tribe.
9–12 You were one of the pack.
13–15 Members of your tribe liked you and were inspired
by you.
16–17 You occupied a place of importance within your
tribe, having either done something impressive
or displayed a unique gift or feature.
18 You were born to or sired by the leader of your
tribe. Although no better than anyone else, you
enjoyed a bit more respect than you might have
otherwise gotten.
Tribal Names
d20 Name
1 Yellow Teeth
2 Split Ears
3 Good Eats
4 Cold Hearts
5 Forked Tongues
6 Dark Hearts
7 Bloody Puddings
8 Dirty Hands
9 Stink Fists
10 Laughing Few
11 Hateful Hundred
12 The Worms
13 Lost Ones
14 Red Eyes
15 Weepers
16 The Blameless
17 Dead Sexies
18 King’s Chosen
19 Green Skins
20 The Restless Young
Appearance Tables
These tables determine your character’s general
appearance. You decide your gender and add any
cosmetic details beyond the results of your rolls.
Roll on the Age table, then once on the Childhood
table and a number of times on the Life Experience
table as directed by the Age result.
Age
3d6 Age
3 You are a child, 6 years old or younger.
Halve your Size, height, and weight.
4–5 You are an adolescent, 7 to 10 years old.
Reduce your height and weight by 25%.
Roll once on the Life Experience table.
6–8 You are a young adult, 11 to 25 years old.
Roll twice on the Life Experience table.
9–12 You are an adult, 26 to 40 years old.
Roll four times on the Life Experience table.
13–15 You are a middle-aged adult, 41 to 50 years old.
Roll five times on the Life Experience table.
16–17 You are an older adult, 51 to 75 years old.
Roll six times on the Life Experience table.
18 You are a venerable adult, 76 years old or older.
Roll seven times on the Life Experience table.
Build
This table modifies your starting height and weight.
All goblins except for hobs and mites have a starting
height of 36 inches and weight of 60 pounds. Mites
have a starting height of 18 inches and weight of 15
pounds, while hobs have a starting height of 48 inches
and weight of 100 pounds.
3d6 Build
3 You are quite small. Reduce your height by 3d6
inches and your weight by 2 pounds per inch.
4–5 You are short. Reduce your height by 2d6 inches
and your weight by 2 pounds per inch.
6–8 You are thin. Reduce your weight by 3d6 pounds.
9–12 You are of average height and weight.
13–15 You are heavy. Increase your weight by 5d6
pounds.
16–17 You are tall. Increase your height by 2d6 inches
and your weight by 2 pounds per inch.
18 You are quite large for a goblin. Increase your
height by 3d6 inches and your weight by 3
pounds per inch.

Distinctive Body Parts
Roll on this table to determine the body part or parts,
then on the appropriate table for details.
d20 Body Part Table
1 Nose
2 Eyes
3 Hands
4 Feet
5 Ears
6 Mouth
7 Legs
8 Arms
9 Head
10 Distinctive growths
11 Skin
12 Odor
13 Hair
14–18 Roll twice, rerolling results of 14 or higher.
19–20 Roll three times, rerolling results of 14 or higher.
Nose
d20 Your Nose . . .
1 is long and pointed.
2 is a pig’s snout.
3 is absent.
4 is on the back of your head.
5 has 1d3 nostrils.
6 has the company of 1d3 other noses.
7 is wide and flat.
8 twitches all the time.
9 has abnormally long hairs.
10 is a different color from your skin.
11 runs all the time.
12 has whiskers.
13 has wide, flaring nostrils.
14 moves around your face while you’re sleeping.
15 looks like a potato.
16 is enormous and cannot be contained.
17 has no nostrils.
18 is bent and twisted.
19 looks like a tree’s root.
20 is a beak.
Eyes
d20 Your Eyes . . .
1 glow in the dark.
2 are joined by 1d3 additional eyes in unusual
places on your body.
3 are one, positioned in the center of your face.
4 roll around in your head all the time.
5 fall out onto your cheeks when you sneeze.
6 are solid white, black, red, or some other color.
7 weep all the time.
8 are different sizes.
9 are way too large.
10 are way too small.
11 look like cabbages.
12 are too far apart.
13 are too close together.
14 are in weird places on your head.
15 have lashes that hang down to your chin.
16 look like pinwheels.
17 squint all the time.
18 never blink.
19 have worms inside them.
20 bulge.

Hands
d20 Your Hands . . .
1 are always moist.
2 are skeletal.
3 have 1d3 extra fingers each.
4 twitch all the time.
5 have fingers of wildly differing lengths.
6 are missing 1d3 fingers each.
7 are different colors from your body’s skin.
8 have thick, bulging veins.
9 are furry.
10 are upside down.
11 are switched, with your left hand on your right
arm and vice versa.
12 are always greasy.
13 are smooth, soft, and doughy.
14 are joined by a third somewhere on your body.
15 are covered in sharp bristles.
16 are webbed with big, blue veins.
17 are cracked, fissured, and bleeding.
18 have odd lumps and nodules.
19 leave no prints.
20 are twisted into claws.
Feet
d20 Your Feet . . .
1 are wide and spatulate.
2 have no toes.
3 are missing 1d3 toes each.
4 have 1d3 extra toes each.
5 have a horn growing from each heel.
6 are thickly calloused.
7 have big, bulging veins.
8 are covered with thick hair.
9 sprout so many warts.
10 stick out to the sides.
11 point inward.
12 are quite thick.
13 are webbed like a duck’s.
14 sprout growths that look like roots.
15 have no heels.
16 are hooves.
17 are a different color from the rest of your body.
18 ooze.
19 grip like hands.
20 smell real bad.
Ears
d20 Your Ears . . .
1 are enormous and hang down to your shoulders.
2 are in unusual places.
3 are absent.
4 have very long lobes.
5 are covered in long hairs.
6 ooze foul-smelling wax.
7 wiggle and twitch.
8 are long flaps.
9 have 1d3 extra ear holes each.
10 are small and knotty.
11 are tall and pointed.
12 swivel.
13 enjoy the company of 1d3 extra ears on your head.
14 are conical.
15 lay flat against your head.
16 are weird tails.
17 snuffle.
18 are always crusty.
19 are cracked and oozing.
20 look like hands.
Mouth
d20 Your Mouth . . .
1 is wide and leering.
2 is generous and sensual.
3 is filled with rotting teeth.
4 looks likes two wet worms.
5 is filled with sharp, pointed teeth.
6 is ragged.
7 is far too small.
8 is absent and you eat by forcing food into
your nose.
9 looks like a small O.
10 has 1d6 teeth.
11 has a long, black tongue.
12 smells real bad.
13 is wrinkled and puckered, like an anus.
14 has a forked tongue.
15 has an unusual position on your head.
16 enjoys the company of another mouth
somewhere on your head.
17 looks like a duck’s bill.
18 leaks slime.
19 has tiny hands instead of teeth.
20 has no teeth.

Legs
d20 Your Legs . . .
1 are short and stubby.
2 are long and thin.
3 are thick and long.
4 bend backwards.
5 are covered in fur.
6 are a different color from the rest of your body.
7 are covered in thick, bristling hairs.
8 have a web of veins.
9 are covered in open, weeping sores.
10 twitch all the time.
11 have small faces on your knees.
12 sprout lots of small horns.
13 are covered in scales.
14 bulge.
15 appear flabby and melted.
16 have no feet, ending in stumps.
17 have an extra pair of feet.
18 join above the knees.
19 have numerous growths and nodules.
20 look like a cricket’s.
Arms
d20 Your Arms . . .
1 are wide and flabby.
2 are thin and spindly.
3 bulge.
4 bear nasty scars.
5 are covered in thick fur.
6 sprout small horns.
7 have an extra pair of hands.
8 bend the wrong way.
9 are a different color from the rest of your body.
10 drip slime from the pits.
11 are covered in bark-like growths.
12 have unseemly bulges and knots.
13 tremble and shake.
14 are twice as long as normal.
15 have eyes in the palms of their hands.
16 have growths that look like fingers.
17 are short and stubby.
18 are smooth and hairless.
19 trail silky hair.
20 have incredibly thick forearms.
Distinctive Head
d20 Your Head . . .
1 looks like the head of a dog, cat, rat, bird,
or some other animal.
2 looks reptilian, with horns growing from
your scalp.
3 faces your left or right shoulder.
4 has 1d3 extra noses, mouths, or eyes.
5 has a beard made of fingers.
6 has a wandering wart.
7 appears wrinkled and ancient.
8 appears smooth and cherubic.
9 twitches.
10 has an abnormally long chin.
11 has facial features randomly arranged.
12 has a second face on the back.
13 appears upside down.
14 is shaped like a crescent moon.
15 has great big jowls.
16 has a sloping forehead.
17 has no chin at all.
18 is covered with thick fur.
19 is all bunched up and misshapen.
20 is flat on top.
Distinctive Growths
d20 You Have . . .
1 a tooth growing from your scalp.
2 a hairless tail about half as long as your body.
3 a horn growing from the side of your head.
4 an extra arm growing from your back.
5 a cyst that looks like a fetus clinging to the side
of your head.
6 a bulge that looks like a seed pod hanging from
your ear.
7 bark-like growths all over your body.
8 1d6 extra fingers or toes wherever you like on
your body.
9 useless insect wings on your back.
10 a short, stubby tail.
11 a bulging cyst on your back.
12 bits of chitin on your neck and chest.
13 a long, tapering fleshy appendage emerging from
the center of your head.
14 extra webbing between your arms and body.
15 a pronounced crest rising from the top of your head.
16 a scaly tail that ends in a knob.
17 big, shuddering glands that squirt foul-smelling
slime when you’re frightened.
18 a fleshy pouch.
19 a strange shell on your back.
20 a vestigial twin growing out of your abdomen.

Skin
d20 Your Skin . . .
1 is bright green.
2 is bright orange.
3 has all the warts.
4 is covered in strange writing.
5 looks like burned toast.
6 appears mottled and moist.
7 has zebra stripes.
8 is pink and glistening.
9 is thick and leathery.
10 is transparent.
11 has an unusual pattern.
12 ripples and flows.
13 is bloated and distended.
14 is hard and cracked.
15 appears stitched together.
16 has a pebbled texture.
17 is always cold to the touch.
18 is covered in scales.
19 changes color with your moods.
20 is covered in feathers.
Odor
d20 You Smell of . . .
1 dirty diapers.
2 burning trash.
3 a dead animal.
4 onions.
5 the sewer.
6 wet paper.
7 soup.
8 spoiled milk.
9 feet.
10 ham.
11 grease.
12 old cheese.
13 pickled beets.
14 sex.
15 vomit.
16 cheap perfume.
17 trees.
18 urine.
19 feces.
20 boiled cabbage.
Hair
d20 You Have . . .
1 thick fur growing all over your body.
2 no hair on your body whatsoever.
3 hair growing in patches.
4 no hair on your head.
5 profuse navel hair.
6 hair that looks like tree roots.
7 hair that looks like wet seaweed.
8 profuse nose hair.
9 fine fur all over your body.
10 hair of a strange color.
11 no hair on your body except for your head.
12 hair growing in the back of your throat.
13 hair instead of finger- and toenails.
14 profuse nipple hair.
15 hair that grows in strange patterns on your back.
16 hair that falls out when you sleep and grows
back during the day.
17 a few long hairs that sprout all over your body.
18 damp hair on your head.
19 thick, ropy hair all over your body.
20 strangely thick hairs that look like flesh.
Background Tables
These tables determine your character’s origin and
what your character did before the game begins.
Start by rolling on the Childhood table and then
on the Life Experience table a number of times as
determined by your starting age. That table might
in turn direct you to roll on another table to discover
what happened during that experience.
Childhood
3d6 Childhood
3 You spent your childhood as a slave. You escaped
or were released when you grew up. Add slave to
your list of professions.
4–5 You were orphaned and raised by rats.
You believe you can speak to rats (but you
really can’t).
6–8 You learned a trade. Gain a random profession.
9–12 You picked over rubbish and searched through
sewage for treasures. Add scavenger to your
list of professions.
13–15 You apprenticed to an artisan. Gain an artisan
profession of your choice.
16–17 You were raised by servants of the Goblin King.
Add devotee to your list of professions.
18 You studied under a scholar. You can speak, read,
and write the Common Tongue and High Archaic,
and you gain one random area of scholarship.

Life Experience*
3d6 Experience
3 You died! Roll a d6 to find out how. You can
either start over or be returned to life by some
stroke of luck. If you return to life, you start the
game with 1d6 Insanity.
1 You were murdered for your shoes.
2 You drowned in a sewer.
3 You somehow managed to eat a
bag of nails.
4 Human explorers killed you when they
invaded your home.
5 You were devoured by rats.
6 You were torn apart in a terrible accident.
4–5 Roll on the Major Setback table.
6–8 Roll on the Minor Setback table.
9–12 Goodies! You start the game with one
extra interesting thing.
13–15 Roll on the Minor Windfall table.
16–17 Roll on the Major Windfall table.
18 Roll on the Strange Event table.
*Roll on this table only if directed by the Age table.
Major Setback
d20 Major Setback
1 You embraced the darkness and went on a
wild killing spree. Gain 1d6 Corruption.
2 A devil tempted you toward darkness.
Gain 1 Corruption.
3 Cruel humans swept through your home,
slaughtering everyone they found there.
You are the sole survivor.
4 A demon possessed you. Gain 1 Corruption.
Either an exorcist cast it out or, if you have
Demon Lord’s Companion, you can add the
Possessed story complication.
5 You made a series of poor life choices.
Subtract 3 from your Starting Lifestyle roll.
6 By accident, you let loose a terrible disease in
a human community that wiped out half the
population. You left soon after.
7 You spent 2d6 years in prison for a crime you
committed (gain 1 Corruption) or didn’t commit
(gain 1d3 Insanity). Add the years you spent in
prison to your starting age and add convict to
your list of professions.
8 A natural disaster ruined your life. Subtract 3
from your Starting Lifestyle roll.
9 You lost an eye, ear, or 1d3 fingers in a terrible
accident. If you have Demon Lord’s Companion,
you can add the Maimed story complication.
10 A hag cursed you for stealing. Subtract 1 from
your Starting Lifestyle roll. If you have Demon
Lord’s Companion, you can add the Cursed story
complication.
11 Someone close to you died: a spouse, child,
parent, or sibling.
12 You became hopelessly lost and spent 1d6 weeks
wandering. You found other people, but you have
no idea how to get home.
13 You spent 1d6 years in a drunken stupor.
You’re not proud. Subtract 1 from your
Starting Lifestyle roll.
14 You accidentally released a demon into the
world. Gain 1d3 Insanity.
15 Dwarfs overran your community, killing
everyone. Gain 1d6 Insanity. If you have
Demon Lord’s Companion, you can add
the Mad story complication.
16 You angered an elf lord or lady who laid a curse
on you, causing gold you touch to turn to wood.
You escaped the curse but must subtract 3 from
your Starting Lifestyle roll.
17 You were captured by a witch hunter and
accused of consorting with devils. You were
beaten, tortured, and branded with hot iron.
Subtract 1 from your Starting Lifestyle roll.
18 You accidentally got your entire tribe killed. Oops.
19 You murdered a priest of the New God.
Add murderer to your list of professions
and gain 1 Corruption.
20 You made a dangerous enemy, one who
seeks to harm you. Work with the GM to
create a suitable nemesis.

Minor Setback
d20 Minor Setback
1 You swallowed something foul and gained a
tapeworm as a result. You named it Frank.
2 You were to be wed, but you ran away from
your commitment.
3 You nearly drowned.
4 You fell in love with a human. Your affections were
strongly refused.
5 An enormous monster swallowed you whole. You
survived in its gullet for several hours before being
released in a flood of its excrement. Gain 1 Insanity.
6 You suffered a nasty injury and bear the scars still.
7 You stumbled across a pack of ghouls eating goblin
corpses. Gain 1 Insanity.
8 You fell out of favor with your tribe and so left them
behind. You haven’t seen them since.
9 Someone tried to kill you. You survived, but fear
they will try again.
10 You lost something valuable. Subtract 1 from your
Starting Lifestyle roll.
11 You experimented with drugs and became addicted
for a time. If you have Demon Lord’s Companion,
you can add the Addicted story complication.
12 You stole something from someone who needed it,
hurt an innocent, or did something else shameful.
Gain 1 Corruption.
13 You lost a lifelong friend. Roll a d6. It was your fault
on an odd number or their fault on an even number.
14 You learned a dangerous secret. Work with
the GM to determine something suitable.
15 You found and read aloud an incantation that called
forth a terrible monster. The monster
killed someone you loved before disappearing into
the wilderness.
16 You found a valuable treasure in the muck, but you
were beaten and robbed of it by members
of a rival tribe.
17 You tried to live among humans, but you were soon
afterward driven out of town.
18 Your mentor vanished without a trace.
19 Your community came under attack by robbers,
monsters, or something else. Subtract 1 from
your Starting Lifestyle roll.
20 You spent two days believing you were a fearsome
dog. Gain 1 Insanity.
Minor Windfall
d20 Minor Windfall
1 A mighty wizard briefly took you on as a henchman.
You ran away after the wizard died.
2 You swore an oath of service to the Goblin King and
have since worked as his agent.
3 You are an unrepentant criminal. Gain a random
criminal profession.
4 You traveled extensively. You can speak one
additional language.
5 You killed and ate 100 diseased rats.
6 You stole a knife from a dashing knight.
7 You helped fight off beastmen who attacked your
tribe and are considered a hero to your people.
8 You spent 1d6 years as a hag’s love slave.
9 Choose a character to have saved your life.
You now owe that character a debt.
10 You found a signet ring (worth 1 gc) in the sewer.
11 You made the acquaintance of someone important.
Choose influence, information, or security. The
character can provide the benefit to you once
(see “Connections” in Shadow, page 207). Come
up with details about this character with the GM.
12 You got an education or furthered your learning.
Choose one: speak an additional language or gain
a random area of scholarship.
13 You changed careers! Gain a random profession.
14 You found something interesting. Gain one extra
interesting thing.
15 You found an old map you’re sure leads to
something or someplace interesting.
16 You found a healing potion.
17 You escaped certain death! Start the game
with Fortune.
18 You start with a suit of soft leather or a
small shield.
19 You stole an incantation of a rank 0 spell of
the GM’s choice from a traveling wizard.
20 You found some money. Gain 1d6 cp.
Major Windfall
d20 Major Windfall
1 You discovered a great treasure in the muck.
Add 6 to your Starting Lifestyle roll.
2 You broke into a tomb and there found an
enchanted object of the GM’s choice.
3 You made an important connection. Choose
influence, information, or security (see “Connections”
in Shadow, page 207). Come up with details about
this character with the GM.
4 You enjoyed great success scavenging for treasure.
Add 3 to your Starting Lifestyle roll.
5 Your body changes! Gain a new distinctive body part.
6 You have a small shack in the wilderness.
7 You stowed away on a boat and went on a fantastic
journey. Add 1 to your Starting Lifestyle roll and add
sailor to your list of professions.
8 You have a rowboat.
9 You found an old book of spells in which are 1d3 + 1
rank 1 incantations.
10 You stole 1d3 + 1 potions of the GM’s choice from an
alchemist, apothecary, or witch.
11 You performed a service for the Goblin King. If you
have Terrible Beauty, you start the game with a
random favor of the Great Fey. Otherwise, you start
the game with an enchanted object of the GM’s choice.
12 You made a friend of a powerful figure—an
archmage, high priest, general, or hero. The GM
determines the person’s identity and the benefits
your friendship provides.
13 You found a chest of coins! Add 3 to your Starting
Lifestyle roll.
14 You saved the life of another goblin. The character
(a goblin) accompanies you on your adventures and
serves until death. Work out the details with your GM.
15 You snuck into Alfheim and stole a lock of hair
from the Faerie Queen. You start every adventure
with Fortune.
16 You gain a suit of soft leather armor or a basic,
military, or swift weapon of your choice.
17 You befriended a small but vicious dog (a small
animal) that accompanies you and obeys your
commands.

18 You are renowned all across the lands. Work out the
details about how you became famous with the GM.
19 You wear a goblin crown (a beat-up cookpot gilded
with feces) that inspires awe in other goblins.
20 A fortuneteller revealed the moment of your death.
When you would die, you can choose not to die and
instead become unconscious for 1d3 hours. Once
you make this choice, you cannot make it again.
Strange Event
d20 Event
1 You lived among the salamanders for 1d6 years.
Add Firespeak to the list of languages you can speak.
2 You drank something that caused your body to
transform. Gain two random distinctive body parts.
3 A magician took you on as an apprentice for
1d3 years. From your master, you discovered
the Arcana tradition.
4 You spent a few years studying old texts.
Add two areas of scholarship of your choice.
5 You stumbled into the Void and remained there for a
few minutes before you found your way back. Gain 1
Corruption, 1d3 Insanity, and a distinctive body part.
6 You became a fanatical servant of the Goblin King.
The very first time you make a fate roll, you can roll
twice and use either result.
7 You drank a strange potion. For your first adventure,
you make challenge rolls with 1 boon.
8 You angered a spirit and it haunts you. If you
have Demon Lord’s Companion, you can add
the Haunted story complication.
9 You discovered you could eat almost anything
without fear of being poisoned. You make challenge
rolls to resist or stop being poisoned with 1 boon.
10 You are a little crazy. When you go mad and would
roll to stop being mad, you can roll twice and use
the higher result.
11 You went to Hell. You realized it was a poor decision
and left with 1d3 Insanity and 1 Corruption.
12 You have no memory of the last 1d3 years.
You woke up one day in an unfamiliar place.
13 You were killed by a monster or a traveling hero,
but somehow returned to life. Gain 1d3 Insanity.
14 You had your mind swapped with another goblin.
Discard your distinctive body parts and determine
them again.
15 You fought and killed many faeries. Your attacks
against faeries deal 1 extra damage.
16 You stole a bone sword from an elf lord or lady.
The sword bears a minor enchantment. When you
attack with the weapon, you can use a triggered
action to make the attack roll with 1 boon. Once
you use this property, you must wait at least 1
minute before you can use it again.
17 You developed a knack for faerie magic. If you
have Terrible Beauty, you discover the Fey
tradition. Otherwise, you can discover either
the Enchantment or Illusion tradition.
18 You lived among the dwarfs, who tolerated your
presence for some reason. Add Dwarfish to the list
of languages you can speak.
19 You did a service for the Faerie Queen. As your
reward, she restored your immortality. Short of
violence or accident, you will live forever.
20 The Goblin King turned you into a toad. You
escaped that fate after you convinced an elf
maiden to kiss you. She screamed when she saw
your true form, so you murdered her and hid the
body. Gain 1 Corruption.
Goblin Profession Tables
Use the following tables in place of those in Shadow of
the Demon Lord to randomly determine your starting
professions as directed by the previous tables. Your
profession also adds an item to your list of starting
equipment.
Random Profession
d6 Profession
1 Roll on the Scholar: Areas of Scholarship table.
2 Roll on the Common Professions table.
3–4 Roll on the Criminal Professions table.
5 Roll on the Martial Professions table.
6 Roll on the Wilderness Professions table.
Scholar: Areas of Scholarship*
d20 Area of Scholarship
1–2 Architecture and engineering
3–4 Etiquette, heraldry, law, and politics
5–6 Astronomy and navigation
7–8 Dwarfen history and geography
9–10 Imperial history and geography
11–12 Literature, philosophy, poetry, theology, and the arts
13–14 Medicine and surgery
15–16 Natural sciences
17–18 Military sciences
19–20 Magical theory
*Add 1 book covering topics related to your area of
scholarship to your starting equipment.
Common Professions
d20 Profession
1–2 Apothecary or healer. Start with a healer’s kit.
3–4 Artisan such as baker, bookbinder, brewer,
carpenter, chandler, cobbler, gem cutter, jeweler,
leatherworker, mason, potter, printer, scribe, or
tailor. You start with a tool kit.
5–6 Artist such as painter or sculptor. If you’re literate,
you can choose writer or poet. You start with a
tool kit or writing kit.
7–8 Conscript. You start with a uniform and spear.
9–10 Entertainer such as actor, athlete, comedian,
dancer, orator, puppeteer, singer, or storyteller.
You start with a costume, dress, or fine clothing
as appropriate for your profession.
11–12 Laborer such as porter, gravedigger, or hauler.
You start with a backpack, shovel, coil of rope,
or something else chosen by the GM that’s
appropriate to your profession.
13–14 Merchant. You start the game with raw goods
such as textiles, grains, or something else worth
1d6 ss.
15–16 Miner or prospector. You start with a pick and
a map of the region.
17–18 Musician using percussion, stringed, or wind
instruments. You start with a musical instrument.
19–20 Tradesman such as dyer, tanner, or butcher. You
start with 2d6 bits.

Criminal Professions
d20 Profession
1–4 Burglar or forger. You start with a set of lock
picks or a tool kit.
5–8 Charlatan, confidence artist, informant, or spy.
You start with a disguise kit.
9–12 Fence or smuggler. You start with 1d6 cp.
13–16 Mugger, pickpocket, or thug. You start with
1d6 bits.
17–20 Murderer. You start with a garrote.
Martial Professions
d20 Profession
1–4 Constable, detective, or patroller. You start with
a lantern and a flask of oil.
5–8 Guard or henchman. You start with a club and
a uniform.
9–12 Jailer or torturer. You start with a pair of manacles
or torturer’s tools.
13–16 Mercenary. You start with a bronze sword and
a contract for your last job.
17–20 Soldier. You start with a uniform, small shield,
and bronze sword.
Wilderness Professions
d20 Profession
1–2 Animal trainer. You start with a small animal that’s
friendly to you.
3–4 Apothecary or healer. You start with a healer’s kit.
5–6 Drover or herder. You start with a staff.
7–8 Guide, pioneer, or prospector. You start with
a map of the region.
9–10 Hermit. You start with a week of rations and
a waterskin.
11–12 Hunter or gatherer. You start with a bow and
12 arrows.
13–14 Nomad. You start with a horse.
15–16 Spelunker. You start with a lantern, pick, and
2 flasks of oil.
17–18 Tracker. You start with a spear.
19–20 Woodcutter. You start with an axe.
Starting Equipment
You start the game with equipment based on your
starting lifestyle and your profession or professions.
To determine your starting lifestyle, roll 3d6 and add
to the roll all the modifiers gained from your Life
Experience rolls. Then find the total on the Starting
Lifestyle table (lifestyles are described in Shadow,
page 100). In addition to the equipment granted by
your lifestyle, your character starts the game with
one interesting thing (Shadow, page 26).
Starting Lifestyle
3d6 Lifestyle
3 or less Destitute
4–5 Poor
6–12 Getting by
13–15 Comfortable
16–17 Wealthy
18 or more Rich
Clothing
Lifestyle Clothing
Destitute —
Poor A filthy blanket and diaper
Getting by Tattered, torn clothing
Comfortable Basic clothing and cloak
Wealthy 1d3 sets of basic clothing and a fine cloak
Rich Noble’s clothing and a fine cloak
Weapon
Lifestyle Weapons
Destitute Club or sling with 20 stones
Poor Staff, club, or sling with 20 stones
Getting by Sling with 20 stones and either a bronze
small sword or bone long knife
Comfortable Sling with 20 stones and either a bronze
small sword or bone long knife
Wealthy Bronze rapier or scimitar and 1d3 bone
daggers
Rich Bronze rapier or scimitar and 1d3 bone
daggers

Personal Gear
Lifestyle Personal Gear
Destitute —
Poor A stained sack, moldy loaf of bread,
and bottle of cheap wine
Getting by Backpack, loaf of bread, hunk of meat,
canteen filled with beer
Comfortable Adventurer’s pack
Wealthy Adventurer’s pack and one extra
interesting thing
Rich Adventurer’s pack and two extra
interesting things
Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting by —
Comfortable Healing potion
Wealthy Healing potion plus one of the following: an
incantation of one rank 0 spell, small shield,
healer’s kit, tool kit, or writing kit
Rich Healing potion plus one of the following: an
incantation of one rank 0 spell, small shield,
healer’s kit, tool kit, or writing kit
Wealth
Lifestyle Wealth
Destitute 1d6 bits
Poor 2d6 bits
Getting by 1d6 cp
Comfortable 2d6 cp
Wealthy 1d6 ss
Rich 2d6 ss
Personal Effects*
d20 Item
1 A bag of used cloth diapers
2 A mug made from a human skull
3 A bottle filled with your saliva
4 A small box filled with your nail clippings
and lost teeth
5 A box of scabs
6 A chamber pot stolen from someone special
7 A necklace of teeth
8 A mouse skeleton
9 A flesh ring
10 A pail full of slime
11 A statuette of the Goblin King carved from bone
12 A bow
13 A wanted poster with your face on it
14 A fancy cap
15 A tin of sardines
16 A defaced holy book
17 A child’s costume
18 A masquerade mask
19 Someone’s love letter
20 A bloodstained shirt
*Roll on this table regardless of your starting wealth.
Personality Tables
Use the following tables to help define your
personality. The result should guide how you
portray the character in the game.
Odd Habit Tables
d6 Odd Habit Table
1–2 Table 1
3–4 Table 2
5–6 Table 3
Odd Habits Table 1
d20 Odd Habit
1 You save all your secretions in small bottles and
give them as gifts to people you like.
2 You have tremendous flatulence, yet you seem
never to notice when you break wind.
3 You lick things to claim them as your own.
4 You keep cockroaches as pets.
5 You speak in a singsong voice.
6 You tell filthy jokes at inappropriate times.
7 You like to hide.
8 Whenever you take damage, roll 1d6. On a 1,
you vomit in a spectacular manner.
9 You have to touch the person to whom you talk,
believing they can’t understand you without your
physical contact.
10 You are unusually attracted to halflings.
11 You can have a bowel movement only if
someone’s watching.
12 You can’t abide the sun and always cover yourself
up when you have to go into the light.
13 You giggle whenever you feel pain.
14 You smear mud and filth all over your body to
keep the ants at bay.
15 You like to pierce different parts of your body
with bits of bone.
16 You practically inhale your food.
17 You prefer to go without pants.
18 You have an invisible friend.
19 You mutilate the corpses of creatures you kill to
see how they work inside.
20 You try to bed everyone you meet.
Odd Habits Table 2
d20 Odd Habit
1 You never bathe.
2 You eat only candy.
3 You dress in fancy clothes.

4 You always inspect your bowel movements,
spreading the mess around with your fingers
in the hopes of finding something interesting.
5 You eat a bit of flesh from every living thing you kill.
6 You wear a child’s costume and refuse to take it off.
7 You love the taste of flowers and eat them
whenever you can.
8 You giggle and snort while you sleep.
9 You only talk in a loud and annoying voice.
10 You end every sentence with “You know what
I mean?”
11 You give everyone a nickname.
12 You believe you are a walking, talking dog, and
bark when you become upset.
13 You are convinced you have a small turtle living
inside you. You overeat to keep the creature alive.
14 You slap yourself in the face when you do
something wrong.
15 You always point out other people’s errors.
16 You believe you are an expert in a random area
of scholarship and make up all kinds of “facts.”
17 You believe you must eat a few pieces of gravel
to help digest your food.
18 You love the smell of trash and always keep
some ripe garbage on hand.
19 You claim you were a human child stolen by
the faeries.
20 The smell of iron gives you diarrhea.
Odd Habits Table 3
d20 Odd Habit
1 You punctuate your sentences by spitting.
2 You collect the genitals of people you kill and
wear them as jewelry.
3 You refuse to wear shoes.
4 You keep a bit of iron on your person all the time.
5 You cry a lot.
6 You keep a large (5d20) collection of spoons.
7 You drool when you see or smell something tasty.
8 You drum your fingers when not doing anything.
9 You like to look through other people’s possessions.
10 You can sleep only if you are tied up.
11 Whenever you go someplace new, you feel
compelled to write your name somewhere.
12 You believe a ghost of a dead pig haunts you. You
can see it sometimes out of the corner of your eye.
13 You believe you can talk to dogs.
14 You dance all the time.
15 You are fawning, cringing, and pitiful.
16 You keep a pet chicken, whom you love very much.
17 You have an annoying, high-pitched voice.
18 You wear a cape.
19 You tell everyone you meet that the gods don’t exist.
20 You believe you were born to do great things and
never pass up the chance to brag about your destiny.
Personality
3d6 Personality
3 You are a bully. You enjoy tormenting things
that are weaker than you.
4–5 You love violence, especially when it’s random
and senseless.
6–8 You love playing tricks on others. You find their
pain hilarious!
9–12 You look out for yourself. Everyone else can
go right to Hell.
13–15 You’re just trying to stay alive!
16–17 You believe your people have lost their way,
and you hope to rise above the filth and squalor
to reclaim your place in the hidden kingdoms.
18 You live to serve the strong and powerful.
Relationships
3d6 Relationships
3 People are nothing more than means to ends. You
use and discard them without a second thought.
4–5 You think everyone is out to get you, so you keep
others at a distance.
6–8 Goblins are the master race! You prefer the
company of your own kind, but you can get along
with others if you need to.
9–12 You get along more or less with other people.
13–15 You love meeting new people and making friends.
16–17 You are loyal to your true friends.
18 You are everyone’s friend.
Desires and Fears*
1d6 Desire Fear
1 Filth Cleanliness
2 Wealth Poverty
3 Fame Death
4 Security Powerful people
5 Immortality Pain
6 Power Isolation
*Roll once for desire and once for fear.
Obligations
3d6 Obligations
3 Your word is worthless. You will break any
promise and discard any oath.
4–5 You might keep your word or you might break it.
6–8 You try to keep your promises, but you are easily
distracted.
9–12 You keep your word only if benefits you.
13–15 You usually keep your promises, believing that
it is right to do so.
16–17 It would take a lot to get you to go back on a
promise.
18 You always keep your word, no matter what it
costs you.

Morality
3d6 Morality
3 You are a wretched creature, ruled by your
appetites and whims. Good and evil have no
meaning to you, and you always do whatever
pleases you.
4–5 You are selfish, putting your needs and desires
above others’.
6–8 You rarely think through the consequences of your
actions and are never bothered when someone
gets hurt as a result of something you did.
9–12 You might do the right thing or you might not.
It all depends on the situation.
13–15 You try to do good, but you enjoy mischief
so much that it sometimes gets in the way.
16–17 You reserve your worst and nastiest tricks for
people who deserve it. Otherwise, you try to
do right by others.
18 You know right from wrong and you always strive
to do good.
Devotion
3d6 Devotion
3 You pledged service to the Devil.
4–5 You follow the tenets of Witchcraft, though
you don’t believe in the gods.
6–15 You are devoted to the Goblin King.
16–17 You are devoted to another member of the
Great Fey.
18 No power is worthy of your devotion.
```

### Goblin — Shadow of the Demon Lord Core

- **Entry Type:** Standard Ancestry
- **Source:** Shadow of the Demon Lord Core
- **Source Page:** 19
- **PDF Page:** 20

```text
Goblin
The Faerie Queen exiled the goblins long ago, for a crime
only she remembers. As part of their exile, she stripped
them of their immortality and doomed them to live
out their days in the mortal world. Goblins have since
infiltrated human societies, making their homes in rubbish
heaps and sewers where, to everyone’s surprise, they seem
quite happy doing the jobs no one else is at all interested in
performing. Picking through trash for choice treasures or
trawling the fetid waters oozing through the subterranean
tunnels for a bit of gold or a dropped coin is all goblins
need to keep them from making trouble for their neighbors.
Bizarre and Varied Appearance: All goblins are short
by human standards, but their height is the only thing
they have in common. No two goblins look alike. They
all have unusual physical characteristics that make them
distinct from one another, such as pig snouts in place
of noses, fangs, horns, a profusion of seemingly mobile
warts, and other less savory manifestations of their
physical corruption.
Weird Habits: Many goblins have weird habits. Some
keep their nail clippings and excretions in small bottles and
jars to prevent witches from stealing their names. Others
knock on wood when they need a bit of luck, keep odd bits
of rubbish as good luck charms, or can never bathe for fear
of losing their vital essence.
Common Names: Goblins love crude humor and it shows
in such names as Blix, Blunder, Bubo, Cough, Drips, Hack,
Pecker, Phlegm, Poop, Pox, Puke, Sludge, Snot, and Vomit.
Creating A Goblin
Starting Attribute Scores Strength 8, Agility 12, Intellect 10,
Will 9
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 1/2, Speed 10, Power 0
Damage 0, Insanity 0, Corruption 0
Languages and Professions You speak the Common
Tongue and Elvish.
Immune damage from disease; charmed, diseased
Iron Vulnerability You are impaired while you are in
contact with iron.
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Sneaky When you roll to become hidden or move silently,
you make the Agility challenge roll with 1 boon.
Level 4 Expert Goblin
Characteristics Health +4
You learn one spell or gain Spring Away.
Spring Away When a creature you can see gets a failure
on an attack roll against your Defense or Agility, you can
use a triggered action to retreat.
19

Character Creation
1
Goblin Distinctive Appearance
d20 Distinctive Appearance
1 You have a long, pointed nose.
2 You have bright green or orange skin.
3 You have the head of a dog.
4
You have a reptilian appearance with small horns
sprouting from the top of your head.
5 You have a wide, leering grin.
6 You have a pig’s snout in place of a nose.
7 You have long, slender fingers.
8 You have a tooth growing out from your forehead.
9 You have a tail.
10 Fur grows thickly on your arms and legs.
11 You are completely hairless.
12 You have all the warts.
13 A large cyst grows on your back.
14 You have an abnormally long and pointed chin.
15 A single horn grows out from the side of your head.
16 You have one eye.
17
You have 1d6 extra fingers, placed on your body
wherever you wish.
18 You have enormous ears.
19 You have stubby little legs.
20 Make something up!
Goblin Age
3d6 Age
3 You are a child, 6 years old or younger.
4–7 You are an adolescent, 7 to 10 years old.
8–12 You are a young adult, 11 to 25 years old.
13–15 You are a middle-aged adult, 26 to 50 years old.
16–17 You are an older adult, 51 to 75 years old.
18 You are a venerable adult, 76 years old or older.
Goblin Build
3d6 Build
3 You are short and spindly.
4 You are short and round.
5–6 You are short.
7–8 You are wiry.
9–12
You fall within the normal height and weight
ranges for goblins.
13–14 You are pudgy.
15–16 You are tall.
17 You are tall and lanky.
18 You are very tall and heavy.
20

Character Creation 1
Goblin Odd Habit
d20 Habit
1
You save all your secretions in small bottles and
give them as gifts to people you like.
2 You never bathe.
3 You punctuate your sentences by spitting.
4
You have tremendous flatulence, yet you seem
never to notice when you break wind.
5 You eat only candy.
6
You collect the genitals from creatures you kill
and wear them as jewelry.
7 You lick things to claim them as your own.
8 You dress in fancy clothes.
9 You refuse to wear shoes.
10 You keep cockroaches as pets.
11
You always inspect your bowel movements,
spreading the mess around with your fingers.
12 You keep a bit of iron on your person at all times.
13 You speak in a singsong voice.
14 You eat a bit of flesh from any living thing you kill.
15 You cry a lot.
16 You tell filthy jokes at inappropriate times.
17 You wear a child’s costume and refuse to take it off.
18 You keep a large collection of spoons.
19 You like to hide.
20 Make something up!
Goblin Background
d20 Background
1
You spent the last 1d6 years in a drunken stupor.
You’re not proud.
2
The Goblin King turned you into a toad. You
escaped that fate after you convinced an elf maiden
to kiss you. When she did and screamed, you killed
her. You start the game with 1 Corruption.
3 You accidentally got your entire tribe killed.
4 You were orphaned and raised by giant rats.
5 You accidentally released a demon into the world.
6
You spent two days believing you were a fearsome
dog. You start the game with 1 Insanity.
7 A hag made you her love slave for 1d6 years.
8
Dwarfs almost wiped out your tribe. You are one of
1d6 survivors.
9 You nearly drowned when the sewers flooded.
10 You earned a living working in your profession.
11
Choose a character. He or she saved your life and
you now owe that character a debt.
12
You are an unrepentant criminal. Add a random
criminal profession to your list of professions.
13
You traveled extensively. You speak one additional
language.
14 You stole a knife from a dashing knight.
15
You snuck into Alfheim and stole a lock of hair from
the Faerie Queen.
16 You killed and ate 100 diseased rats.
17 You were a henchman to a powerful wizard.
18 You found a signet ring in a sewer.
d20 Background
19
You are the seventeenth son or daughter of the
Goblin King.
20 You came into money and start the game with 2d6 cp.
Goblin Personality
3d6 Personality
3
You are a bully and enjoy tormenting things that
are weaker than you.
4
You like violence, especially when it’s random and
senseless.
5–6
You try to rise above the filth and squalor of your
people to do good in the world.
7–8
You love playing tricks on other people and find
their pain hilarious!
9–12 You look out for yourself. To hell with everyone else!
13–14 You’re just trying to stay alive!
15–16
Your people didn’t deserve exile, but exile you got.
You believe you will make places for yourselves
and prove to those stinking elves they were wrong.
17 You live to serve the strong and mighty.
18
You hope to redeem your people in the eyes of
the Faerie Queen.
```

### Grave Thrall

- **Entry Type:** Derived Ancestry
- **Source:** Kingdom of Skulls
- **Source Page:** 23
- **PDF Page:** 23

```text
Grave Thrall
When Father Death comes to claim the soul of the
newly dead, sometimes that soul refuses the call
and escapes the hook that would drag it into the
Underworld. Either by the intercession of magic, a
terrible curse, or some act of supreme willpower, the
soul returns to the meat and restores it to a semblance
of life, becoming undead. Grave thralls represent just
one of the many forms of undead that might result
from such refusals and are the most likely fate for
characters who cannot yet move on.
Walking Dead: As undead, grave thralls walk a road
between life and death. They can move, think, and
experience much as they did in life, but their organs
no longer work and begin to decay inside the husks of
their bodies. Their eyes being the first to go, the magic
sustaining them manifests in the dark sockets as
pinpricks of blue light. Their skin turns waxy, graying
until it draws tight over the bones. Internal organs
liquefy and spill out of their withered orifices, leaving
them hollowed out and empty.
Hateful Light: Sunlight strains the magic that
enables the soul to linger inside the grave thrall’s
body. While in areas lit by sunlight, the soul’s grip on
the body loosens and rattles about inside. As a result,
the grave thrall becomes weakened and sluggish.
Grave thralls withdraw from the sunlight so they can
regain control of themselves and the dark power that
gives them unlife.
Kingdom of Skulls Backgrounds
d20 Background
1 Your family turned to cannibalism to avoid starvation.
You were chosen to be eaten, but you ran away.
2 Your father was a soldier in the Dark Lady’s armies.
He died in battle, but his corpse was turned into a
grave thrall. You still see him from time to time.
3 You joined the Cult of the Dark Lady, pledging your
soul to the mistress of the land.
4 Your grandmother’s spirit haunted your home. You’d
spy her out of the corner of your eye from time to
time. She seemed to delight in scaring you.
5 You were captured by slavers in the Patchwork
Lands but won your freedom in the fighting pits.
You traveled west to find your fortune.
6 You believe your ancestors were among those who
traveled through Hell with the Dark Lady.
7 You secretly hate the Kingdom of Skulls and the Dark
Lady. You would do anything to escape this place.
8 You were kidnapped by a woman who had lost her
child and sought to make you its replacement.
9 You toiled on one of the kingdom’s farms, fighting
to grow a meager crop.
10 You traveled to Blötland and lived among the jotun
for a time.
11 You have spent your life trying to earn the gift of
undeath. One day, you might become worthy.
12 The Dark Lady once singled you out in a crowd and
spoke to you. You fell in love with her and pledged
to serve her until the end of your days.
13 A band of ghouls carried your sibling into the night.
You can still hear his or her screams.
14 In the hopes of winning the Dark Lady’s favor, you
sacrificed a sibling on an altar of stone. You gained
nothing from the act but guilt.
15 Centaurs attacked your village and killed everyone
but you.
16 You were a member of a band of brigands who
crossed over the eastern border to raid the
Patchwork Lands for supplies.
17 Your mother was possessed by a demon. She
tormented your family until you finally killed her. In
doing so, you released the demon, and you believe it
is still out there somewhere.
18 You found a petrified troll in the mouth of an old cave
high in the mountains. You fled when something stirred
in the darkness, but you think you can remember where
to find the cave if you want to return.
19 A horrible monster came out from the Darkening
Fen and threatened to ruin the crops. You joined
with others to track the beast down and kill it.
20 You washed up on the western shores with no
memory of who you are or from where you came.

Trapped in Bone and Flesh: The soul does not rest
easy in the flesh, for grave thralls are abominations by
any standard. The natural order weighs upon them,
the soul always fighting to remain where it is. Duty
and service give purpose, helping them to resist the
pressure they experience. Once the body breaks down
from injury, the soul’s hold loosens and usually slips
away, though powerful souls might continue on as
ghosts or something far worse.
Fearsome Silence: Grave thralls never draw breath
and thus cannot speak. They also find subtle movements
of their facial muscles to be difficult, so if they show any
expression, it’s weirdly exaggerated. Some grave thralls
learn to communicate using hand gestures and body
movements, but most just exist in stony silence.
Creating a Grave Thrall
You can either choose grave thrall as your ancestry for
a new character, or an existing character might become
a grave thrall. Either way, grave thralls begin as living
creatures of flesh and blood. Humans, dwarfs, orcs,
goblins, and similar creatures can become grave thralls,
but clockworks and changelings cannot.
If you create a new character with the grave
thrall ancestry, first create a character with another
ancestry that could become a ghoul and then apply
the following traits to your character, advancing the
character until it has the benefits for your group level.
The level 4 grave thrall expert benefits replace those
you would normally gain from your original ancestry.
You might become a grave thrall between
adventures if it makes sense for your character and
story. You can also become a grave thrall during an
adventure, especially if another character has the
appropriate Necromancy spell and casts it on your
corpse (see “Creating Undead” in Occult Philosophy).
If you become a grave thrall, simply apply the
following traits to your character.
Grave Thrall Traits
Attribute Scores Strength +1, Intellect –2, Will +2
Characteristics Perception +1
Fearsome When you attack a creature that can see you,
the target must get a success on a Will challenge roll or
become frightened for 1 minute. Whether the roll results
in a success or a failure, the target becomes immune to
your Fearsome trait until it completes a rest.
Immune damage from cold, disease, and poison; Insanity;
asleep, diseased, fatigued, poisoned
Undead You are not a living creature. If you become
incapacitated, you die and your soul slips free from
your body.
Silent You cannot speak.
Sunlight Weakness You are impaired while in areas lit by
sunlight.
Level 4 Grave Thrall Expert
Characteristics Health +5
Cling to Unlife When you become incapacitated, make a
Will challenge roll. On a success, you heal 1 damage. On a
failure, you die.
Duty Bound
Something anchors you to the world. Use the following
table to explain why your character remains.
Anchor
d6 Anchor
1 Revenge
2 Uncompleted mission
3 Protect a person or place
4 Cursed
5 Magic
6 Hatred
```

### Halfling — Uncommon Courage

- **Entry Type:** Expanded Ancestry
- **Source:** Uncommon Courage
- **Source Page:** 5
- **PDF Page:** 5

```text
Halfling Characters
Everything you need to create a halfling character can
be found in the Demon Lord’s Companion. The rules
in that book enable you to make a character quickly,
with enough information to portray it in the game.
This section, however, offers more advanced rules for
making halfling characters, with alternative features,
along with a slew of tables to develop the character’s
background, personality, and their appearance.
If you use the rules presented here, you need to
use the accompanying supporting tables here to
determine your character’s professions, languages
known, and starting equipment.
Creating a Halfling
Choose an option for Attribute Scores:
Random Attribute Scores Strength 1d3 + 7, Agility 1d3 + 9,
Intellect 1d3 + 8, Will 1d3 + 9
Standard Attribute Scores Strength 9, Agility 11, Intellect
10, Will 11
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1/2, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages You speak the Common Tongue.
Good Fortune Whenever a creature within short range rolls
a 1 on any die, you can use a triggered action to discard
the roll and let the creature roll again.
Uncommon Courage When you become frightened, you
can use a triggered action to make a Will challenge roll.
On a success, you remove the frightened affliction.
Level 4 Halfling Expert
Characteristics Health +4
You learn one spell or choose one of the talents below.
Cunning Escape If you make an attack roll with at least 1
boon, you can choose to reduce the number of boons by
1. After the attack, you can move up to half your Speed
without triggering a free attack.
Expert Thrower When you attack with a thrown weapon or
a sling, you make the attack roll with 1 boon.
Rising Fortunes Whenever you roll a 6 on the die for a
boon, you make all succeeding attack rolls and challenge
rolls with 1 boon for 1 round.
Shake Off The Pain When you would use Uncommon
Courage and you get a success on the challenge roll, you
can choose to remove one of the following afflictions:
fatigued, impaired, or frightened.
Halfling
Development Tables
The following tables help you create an incredibly
detailed halfling character by determining your
origins, background, appearance, personality,
professions, and the like. You must roll on each table
and take the results of each roll. Do not use any of the
tables in Shadow in conjunction with the tables here.
Origins Tables
The following tables help you determine your family
and upbringing.
Ancestors
3d6 Ancestors
3 One of your distant ancestors did something
so wicked that your descendants still bear the
shame. Your family has never been fully welcome
in their community.
4–5 Several ancestors were people of dubious
character, though their misdeeds were largely
kept secret.
6–8 One recent ancestor died under mysterious
circumstances. He or she was a character whom
many suspected of having strange thoughts and
odd mannerisms.
9–12 Your ancestors were ordinary and unexceptional
people.
13–15 One recent ancestor has been remembered by
your family and members of your community for
performing a great deed or making an incredible
discovery.
16–17 The people in your community look up to your
family for guidance and leadership.
18 One of your ancestors was a great hero to your
people, among the most famous halflings ever.

Family Tables
Use the following tables to detail your family
situation, such as their circumstances, siblings, what
happened to them, and your relationship with your
family. Here, unless instructed otherwise, roll on each
of the following tables.
Family Circumstances
3d6 Family Circumstance
3 You were orphaned or have no memory of your
family. Subtract 6 from your Childhood roll and
skip the Familial Relations roll.
4–5 Your family was destitute. Subtract 3 from your
Childhood roll.
6–8 Your family was poor. Subtract 1 from your
Childhood roll. To determine your family’s
profession, roll on the Common, Criminal, Military,
or Wilderness Professions tables.
9–12 Your family was just getting by. To determine your
family’s profession, roll on the Common, Criminal,
Military, or Wilderness Professions tables.
13–15 Your family lived comfortably. Add 1 to your
Childhood roll. To determine your family’s
profession, roll on the Common, Military, Religious,
or Wilderness Professions tables.
16–17 Your family was wealthy. Add 3 to your Childhood
roll. To determine your family’s profession, roll on
the Common, Military, Religious, or Wilderness
Professions tables.
18 Your family was rich. Add 6 to your Childhood roll.
Your family might have been merchants, a criminal
syndicate, or former adventurers.
Parents
3d6 Parental Status
3–4 Your parents died when you were young. You were
raised by a relative or a friend of the family. Roll on
the Causes of Death table to determine how they
died.
5–8 Your father died. Roll on the Causes of Death table
to determine how he died.
9–12 Your parents are alive.
13–16 Your mother died. Roll on the Causes of Death
table to determine how she died.
17–18 You have no idea what happened to your parents.
You might have been kidnapped and raised by your
captors. You could have run away from home. Or,
your parents disappeared.
Siblings
d20 Siblings
1–5 You have no siblings.
6–8 Roll a d6. On an odd number, you have a brother.
On an even number, you have a sister.
9–12 You have 1d3 siblings. Roll a d6 for each. On an
odd number, you have a brother. On an even
number, you have a sister.
13–15 You have 1d6 siblings. Roll a d6 for each. On an
odd number, you have a brother. On an even
number, you have a sister.
16–17 You have 1d6 + 2 siblings. Roll a d6 for each. On
an odd number, you have a brother. On an even
number, you have a sister.
18–20 You have 2d6 + 3 siblings. Roll a d6 for each. On
an odd number, you have a brother. On an even
number, you have a sister.
Sibling Ages*
d20 Sibling Age
1–2 The same age as you. The sibling is possibly a
twin, a bastard, or was adopted.
3–11 Younger
13–20 Older
* Roll once for each sibling you have.
Relationships*
3d6 Relationship
3 Hate
4 Animosity
5–6 Rivalry
7–8 Dislike
9–10 Neutral or no relationship
11–12 Tolerance
13–14 Goodwill

15–16 Friendship
17 Love
18 Intense love, possibly romantic love
* Roll once on this table for each parent and sibling to
determine your relationship with the character.
Sibling Fates*
3d6 Fate
3 Went insane
4–5 Unknown
6–8 Dead
9–12 Alive
13–15 Alive, but disgraced
16–17 Alive and well-regarded
18 Alive and famous
* Roll once on this table for each sibling. If the character is
dead, roll on the Cause of Death table to find out how.
Causes of Death
3d6 Cause of Death
3 Murder
4–5 Accident unrelated to profession
6–8 Hardship, hunger, or exposure
9–12 Natural causes or disease
13–15 War
16–17 Accident related to profession
18 Suicide
Appearance Tables
Use the following tables to determine your character’s
general age, height, weight, and distinguishing features.
Choose your own gender, skin, hair, and eye color.
Starting Ages
3d6 Age
3 You are a child, 11 years old or younger. You are
Size 1/4, and you halve your height and weight.
Roll once on the Childhood table and do not roll
on the Life Experiences tables.
4–5 You are an adolescent, 12 to 17 years old. Reduce
your height and weight by 25%. Roll once
on the Childhood table and once on the Life
Experiences table.
6–8 You are a young adult, 18 to 25 years old. Roll
once on the Childhood table and twice on the
Life Experiences table.
9–12 You are an adult, 26 to 35 years old. Roll once on
the Childhood table and three times on the Life
Experiences table.
13–15 You are a middle-aged adult, 36 to 55 years old.
Roll once on the Childhood table and four times
on the Life Experiences table.
16–17 You are an older adult, 56 to 75 years old. Roll
once on the Childhood table and five times on
the Life Experiences table.
18 You are a venerable adult, 76 years old or older.
Roll once on the Childhood table and six times
on the Life Experiences table.
Builds*
3d6 Build
3 You are quite small and slight, even for a halfling.
Reduce your height by 2d6 inches and your
weight by 2 pounds per inch reduced.
4–5 You are shorter than the average halfling.
Reduce your height by 2d6 inches and your
weight by 1 pound per inch reduced.
6–8 You are thin. Reduce your weight by 4d6 pounds.
9–12 You are of average height and weight.
13–15 You are heavy. Increase your weight by
6d6 pounds.
16–17 You are taller than the average halfling. Increase
your height by 2d6 inches and your weight by
1 pound per inch.
18 You are enormous. Increase your height by
3d6 inches and your weight by 2 pounds per
inch increased.
* The Build table modifies your starting height and weight. If
you are male, your starting height is 42 inches and weight is
100 pounds. If female, your starting height is 40 inches and
weight is 90 pounds.

Appearances
3d6 Appearance
3 Luck might have saved your life, but you did not
escape harm unscathed. You bear horrific scars
and your appearance evokes revulsion in anyone
who sees you.
4–5 You are downright ugly. Your features look like
they wandered around your head and settled in
wherever the felt comfortable.
6–8 You have an unattractive physical quality that
ruins your plain appearance.
9–12 You are more or less average for a halfling.
13–15 You have a physical quality that makes you
attractive.
16–17 You are comely, considered a great beauty.
18 You are striking to the point that your appearance
grabs attention from people around. You might
have several suitors or paramours, infatuated
stalkers, or people you have spurned who now
hate you.
Distinctive Traits and Mannerisms
d20 You…
1 laugh at inappropriate times.
2 drum your fingers when bored.
3 feel driven to touch things to make sure they are
real.
4 have a dry cough.
5 spit whenever disgusted.
6 make the sign against evil when you hear or see
something unusual.
7 have an annoying, braying laugh.
8 have a fondness for conies.
9 add an obsessive interest in riddles.
10 have a pipe in your mouth at all times.
11 take things that don’t belong to you.
12 have a curious side that sometimes lands you into
trouble.
13 have an infectious laugh.
14 have unusually bright eyes.
15 have irritable bowels.
16 are fanatic about cleanliness.
17 clap your hands when excited.
18 have a fondness for the bottle.
19 collect thimbles, nuts, marbles, or small stones.
20 enjoy telling filthy jokes.
Background Tables
The background tables determine from where your
character came and what your character did before
the game begins. Roll on the Life Experience table
a number of times as determined by your roll on
the Starting Age table. The following table might
direct you to roll on another table to discover what
happened during that experience.
Childhood
3d6 Childhood
3 Raiders attacked your home, killing everyone.
You escaped and somehow managed to
survive on your own. Gain a random wilderness
profession.
4–5 You ran away from home, joined the circus, or
took up with a traveler. Gain a random common,
criminal, or wilderness profession.
6–8 You worked in the family business. Add your
family’s profession to your list of professions.
9–12 You were apprenticed to an artisan. Add an
artisan of your choice to your list of professions.
13–15 You received an education. You can read and
write the Common Tongue. Add your family’s
profession to your list of professions.
16–17 You received a good education. You can read
and write the Common Tongue and can speak,
read, and write High Archaic. You gain a random
area of scholarship.
18 You attended one of the finest academies. You
can read and write the Common Tongue, and can
speak, read, and write High Archaic. You gain a
random area of scholarship. You also gain one
of the following professions: artist (painter, poet,
or writer) or musician (percussion, stringed, or
wind).
Life Experiences*
3d6 Experience
3 You Died! Roll on the Causes of Death table to
find out how. You can either start over with a new
character or be returned to life by some stroke of
luck. If you return to life, you start the game with
1d6 Insanity.
4–5 Roll on the Major Setbacks table.
6–8 Roll on the Minor Setbacks table.
9–12 You Worked! If you don’t have a profession
yet, gain a random profession. You spent time
working in one of your professions. Add 1 to your
roll on the Starting Lifestyles table.
13–15 Roll on the Minor Windfalls table.
16–17 Roll on the Major Windfalls table.
18 Roll on the Strange Events table.
* Roll on this table only if directed by the Age table.

Major Setbacks
d20 Major Setback
1 Your curiosity led you into a very dark place,
where you witnessed something that shattered
your sanity. Gain 1d3 + 1 Insanity.
2 You stole something of great importance.
Someone else took the blame and was executed
for the crime.
3 A plague wiped out your community. You were
the sole survivor.
4 You committed some unspeakable act that has
stained your soul. Gain 1d6 Corruption.
5 You became possessed by a demon. Gain
1 Corruption. Either an exorcist cast the demon
out or, if you have Demon Lord’s Companion, you
can start with the Possessed story complication.
6 You struggled in your profession due to poor
life choices. Subtract 3 from your Starting
Lifestyle roll.
7 You caught a terrible disease that left you
with nasty scars. If you have Demon Lord’s
Companion, you can start with the Plagued story
complication.
8 Brigands sacked your home. Subtract 3 from
your Starting Lifestyle roll.
9 You committed a crime and spent 2d6 years
performing hard labor. Add laborer to your
list of professions.
10 You killed someone. Gain 1 Corruption. Roll a d6.
On an even number, you got away with it. On an
odd number, you were imprisoned. Do not make
any more Life Experience rolls and add convict
to your list of professions.
11 You lost everything to disaster or war. Subtract 3
from your Starting Lifestyle roll.
12 You lost an eye, ear, or 1d3 fingers in a terrible
accident. If you have Demon Lord’s Companion,
you can add the Maimed story complication.
13 A dangerous drunk, your people drove you out
of town. Add sot to your list of professions and
subtract 1 from your Starting Lifestyle roll.
14 You saw a hideous monster or demon. Gain
1d3 Insanity. If you have Demon Lord’s Companion,
you can add the Mad story complication.
15 A fire swept through your community, forcing
you to start over. Subtract 3 from your Starting
Lifestyle roll.
16 You angered someone important and suffered
as a result. Subtract 3 from your Starting
Lifestyle roll.
17 You set out on a grand adventure only to
lose everyone you loved. You returned home,
penniless and scarred by your experiences.
Subtract 2 from your Starting Lifestyle roll.
18 You caused the death of a loved one, either by
intent or accident.
19 An evil hag cursed you, ruining your life. Either
subtract 2 from your Starting Lifestyle roll or,
if you have Demon Lord’s Companion, add the
Cursed story complication.
20 You made a dangerous enemy, one who seeks
to harm you. Work with the GM to create a
suitable nemesis.
Minor Setbacks
d20 Minor Setback
1 You discovered a terrible secret. To keep your
loved ones safe, you had to disappear.
2 Hard times forced you to make ends meet by
committing crimes. Gain a random criminal
profession.
3 An orc captured you and kept you as a pet for
1d3 years. The orc believed you were a lucky charm.
4 You went spelunking and became lost until a group
of gnomes rescued you.
5 You have terrible wanderlust. You can’t stay
put for more than 2d6 weeks at a time. Add one
language to the list of languages you can speak.
Once your “staying put” time has expired, add 1
bane to all social interaction challenge rolls until
you ramble on.
6 You worked in a series of awful and thankless jobs
in a large city.
7 A human fell in love with you, but you rejected the
relationship. Or, the reverse. Your choice.
8 One time, a wandering ogre swallowed you whole.
Somehow, you survived the experience and came
out the other end—filthy, but intact. Gain 1 Insanity,
and everyone in your community remembers, and
loves to tell, the tale.
9 You were abducted by faeries, but you managed
to escape.
10 You lost something valuable. Subtract 1 from your
Starting Lifestyle roll.
11 You suffered from a long, protracted illness.
Subtract 1 from your Starting Lifestyle roll.
12 A long romance ended in disaster, leaving you
heartbroken.
13 A strange pig-farmer kidnapped you and held you
prisoner for several weeks. Gain 1 Insanity.
14 After several hundred hangovers, you have
become addicted to drink. If you have Demon
Lord’s Companion, add the Addicted story
complication.
15 You lost an ear, a couple of teeth, or a finger.
16 You suffered financial trouble. Subtract 1 from your
Starting Lifestyle roll.
17 You had a fling with a sibling. It was a shameful,
sordid affair that eventually saw you shunned by
your family.
18 You lost a sibling, parent, spouse, child, or close
friend. The person might have died or disappeared
as you choose.
19 You joined a dark cult and became immersed in
their vile practices. Gain 1 Corruption and 1 Insanity.
20 Depression consumed you and you spent months
trapped in your own dark thoughts. Subtract 1 from
your Starting Lifestyle roll.

Minor Windfalls
d20 Minor Windfall
1 You befriended a traveling witch or wizard who
used to visit your community.
2 When monsters attacked your town, you led your
people to safety.
3 You fell in love and got married. Work with your
GM to detail your spouse.
4 You started a successful business related to one
of your professions. Add 1 to your Starting
Lifestyle roll.
5 You made an important connection. Choose
Influence, Information, or Security. This connection
can provide you the chosen benefit once (see
Connections in Shadow, page 207). Work with
your GM to define this character.
6 You traveled extensively. Add one language to
the list of languages you can speak.
7 You received an education or furthered your
education. Choose one of the following: you can
read and write one language you can speak, or you
gain a random area of scholarship.
8 You have 1d6 children! You can use the sibling
tables to come up with details about these cute
little rascals.
9 You changed jobs! Gain a random common
profession.
10 You have a pet cat (tiny animal).
11 You found a bag of coins. Add 1 to your Starting
Lifestyle roll.
12 You saved your community from certain
destruction. While you are physically scarred from
your efforts, you have the love and affection of
all your neighbors. When in your community, you
never have to pay for food or drink.
13 You found something interesting. Gain an
additional interesting thing.
14 After a string of bad luck, fortune has finally
come back to you. Start your first adventure
with Fortune.
15 You find a weapon of the GM’s choice.
16 You inherited or found a suit of soft leather armor.
17 You made a loyal friend! This character (halfling)
follows you, accompanies you, cooks and cleans
for you, and would travel to the ends of the Urth to
keep you safe.
18 You found a magical scroll containing an
incantation of a rank 0 spell of the GM’s choice.
19 You went into politics. Add Entertainer (Orator)
to your list of professions.
20 You came into money! Add 1 to your Starting
Lifestyle roll.
Major Windfalls
d20 Major Windfall
1 You went on a long journey with a band of dwarfs.
You plan to write about your experiences some day.
2 You apprenticed under a wizard. You discover one
tradition of the GM’s choice. Also, add scholar of
magic to your list of professions.
3 You did a great service for a faerie lord or lady.
You gain an enchanted object of the GM’s choice.
If you have Terrible Beauty, you instead gain a Favor
of the Great Fey (see Terrible Beauty, page 36).
4 You made an important connection. Choose
Influence, Information, or Security (see Connections
in Shadow, page 207). Come up with details about
this character with the GM.
5 You enjoyed great success in your profession.
Add 3 to your Starting Lifestyle roll.
6 You have a small house in your community or a
homestead in the wilderness. Work with the GM
to determine the location of your property and
the assets that come with it.
7 You hid someone who was being hunted by witch
hunters. The person thanked you and gave you a
purse containing 1d6 ss.
8 You assisted a druid in tending to animals injured
by a beastmen attack. The druid rewarded you
with a healing potion and an incantation of a rank
0 Nature or Primal spell.
9 You found a book of magic. The book contains
incantations of 1d3 + 1 rank 0 spells.
10 You found an alchemist’s workshop and stole
1d3 + 1 potions of the GM’s choice.
11 You had a sudden recollection of a past life.
Gain two random professions.
12 You made friends with a powerful figure, like an
archmage, high priest, general, or famous hero.
The GM determines the person’s identity and the
benefits your friendship provides.
13 You enjoyed great success in your business.
Add 3 to your Starting Lifestyle roll.
14 You befriended a dwarf who accompanies you on
your adventures and fights to the death to protect
you. Work out the details of the relationship with
the GM.
15 You inherited a fortune from a rich relative.
Add 6 to your Starting Lifestyle roll.
16 You find a weapon of your choice.
17 You have become quite famous. People
throughout the lands recognize you and know
your name. Work out the details of your fame
with the GM.
18 A fortuneteller warned you of a future peril.
Once, when you would die, you do not die and
are instead unconscious for 1d3 hours, after which
you heal 1 damage.
19 You joined a temple. Add a random religious
profession. Also, you discover one tradition
associated with your faith.
20 You developed a cast iron stomach. You make
challenge rolls to resist the effects of disease or
poison you consume with 2 boons.

Strange Events
d20 Event
1 A wandering giant grabbed you and stuck you in
its sack, along with a wheel of cheese, a frightened
sheep, and all manner of other weird objects. You
and the sheep escaped one night, with the cheese,
but you discovered you had been carried so far
away that you didn’t know how to get back home.
2 One night, you were abducted, carried away in a
flying ship, and studied extensively by the strange
people who captured you. You have a bit of metal
embedded under your skin at the base of your
spine. Your memories of this experience are spotty
at best.
3 You spent several years in a city, impersonating a
crying child so you could steal from strangers who
came to help you. You quit this act after you were
scooped up and thrown into an orphanage, where
you were made to eat porridge and suffer terrible
beatings by the headmaster. You escaped.
4 You went insane and manifested 1d3 different
personalities. Randomly determine each personality
and assign two random professions to each one.
5 You bargained with a devil, gaining 1d3 Corruption
and a random enchanted object out of the deal.
6 You were swallowed by a giant fish and forced to
live inside it for 1d20 weeks. A fisherman caught
the fish, dragged it out of the sea, and cut it open
to find you inside. It was a happy day for everyone
involved, except for the fish.
7 Plague swept through your community, wiping out
almost everyone. You have some delightful scars
on your body from this disease. If you have Demon
Lord’s Companion, you can add the Plagued story
complication.
8 You spent many years living among the faeries.
You made friends, enjoyed several lovers, and
learned much about their kind and culture. Add
Elvish to the list of languages you can speak.
9 You discovered a tome of unspeakable evil,
its pages brimming with terrible secrets. Gain
1d6 Insanity, 1 Corruption, and you discover the
Forbidden tradition.
10 One day, while tilling a field, you pulled some
strange thing out of the ground. You gain a random
enchanted object. In addition to its property,
the item also makes a warbling noise whenever
brought within short range of a faerie.
11 During your travels, you found a magic ring of
solid gold. While wearing the ring, you can choose
to gain 1 Corruption to cast the invisibility spell
from the Illusion tradition. You can only cast the
spell on yourself.
12 You took up with a knight and served as his or her
squire. Add squire to your list of professions and
you gain a suit of hard leather armor, a small sword,
and a small shield.
13 Your soul was replaced by an incarnation. If you
have Hunger in the Void, apply the incarnation
traits to your character. Otherwise, the incarnation
departed and left you with 1d6 Insanity.
14 Choose a character played by another player.
You have a strong connection to this character
and whenever you use an action to help the
character, you increase the number of boons
from helping by 1.
15 You found work as a fool in a noble’s court. Add
Entertainer (fool) to your list of professions and
start the game with 1d6 ss and motley dress.
16 You were bitten by a skinchanger! If you have
Tooth and Claw, apply the skinchanger traits to
your character. Otherwise, a witch freed you from
the curse. Henceforth, whenever a creature attacks
you with a Curse spell, you impose 1 bane on the
creature’s attack roll and you make the challenge
roll to resist the spell with 1 boon.
17 You formed a strong bond with a pack mule
(horse). The beast follows you wherever you
go and accompanies you on your adventures.
18 Your grandfather’s spirit haunts you. If you have
Demon Lord’s Companion, add the Haunted story
complication.
19 You came into fabulous riches. Add 6 to your
Starting Lifestyle roll.
20 A harvester found and captured you. It sliced off all
the bits it wanted and left you to die. You are now
missing an eye, four fingers, half of your face, and
both nipples. You cover your maiming with a mask,
gloves, and heavy clothing.

Halfling Profession Tables
Use the following tables in place of those in Shadow of
the Demon Lord to randomly determine your starting
professions as directed by your rolls on the previous
tables. Your profession also adds an item to your list of
starting equipment.
Random Profession
d6 Profession Table
1 Scholar: Area of Scholarship
2 Common Professions
3 Criminal Professions
4 Martial Professions
5 Religious Professions
6 Wilderness Professions
Scholar: Area of Scholarship*
d20 Area of Scholarship
1–2 Architecture and engineering
3–4 Etiquette, heraldry, law, and politics
5–6 Astronomy and navigation
7–8 Imperial history and geography
9–10 Pre-Imperial history and geography
11–12 Literature, philosophy, poetry, theology, and
the arts
13–14 Medicine and surgery
15–16 Natural sciences
17–18 Magical theory and the occult
19–20 Military sciences
* Add 1 book covering topics related to your area of
scholarship to your starting equipment.
Common Professions
d20 Profession
1 Apothecary or healer. You start with a healer’s kit.
2 Artisan such as baker, blacksmith, bookbinder,
brewer, carpenter, chandler, cobbler, gem cutter,
jeweler, leatherworker, mason, potter, printer,
scribe, or tailor. You start with a tool kit.
3 Artist such as painter or sculptor. If you’re literate,
you can choose writer or poet. You start with a tool
kit or writing kit.
4 Bartender or shopkeeper. Start with 1d6 cp.
5 Beggar. You start with a begging bowl or cap.
6 Boatman or ferryman. You start with a rowboat.
7–8 Cook, groom, scullion, or servant. You start with
an extra set of clothing.
9 Courtesan, prostitute, or camp follower.
You start with a cosmetics kit.
10 Drover or herder. You start with a staff.
11 Entertainer such as actor, athlete, comedian,
dancer, orator, puppeteer, singer, or storyteller.
You start with a costume, dress, or fine clothing
as appropriate for your profession.
12–13 Farmer. You start with a hoe, shovel, or rake.
14 Fisher. You start with a fishing pole and tackle box.
15 Gambler. You start with a pair of dice or deck
of cards.
16 Laborer such as porter, gravedigger, or stevedore.
You start with a backpack, shovel, coil of rope,
or something else chosen by the GM that’s
appropriate to your profession.
17 Merchant. You start the game with raw goods such
as textiles, grains, or something else worth 1d6 ss.
18 Musician using percussion, stringed, or wind
instruments. You start with a musical instrument.
19 Pilot, sailor, or teamster. You start with 1d6 cp.
20 Trade such as dyer, tanner, or butcher. You start
with 2d6 bits.
Criminal Professions
d20 Profession
1–2 Agitator, rebel, saboteur, or terrorist. You start
with 1d6 pamphlets related to the cause for which
you fight.
3–4 Bandit, pirate, or raider. You start with a bottle of
rotgut and a wanted poster showing your face.
5–6 Burglar or grave robber. You start with a set of
lock picks.
7–8 Charlatan, confidence artist, informant, or spy.
You start with a disguise kit.
9–10 Fence or smuggler. You start with 1d6 cp.
11 Forger. You start with a tool kit.
12–13 Mugger or thug. You start with 1d6 bits.
14–15 Murderer. You start with a garrote.
16–18 Pickpocket. You start with a stolen purse
containing 1d6 cp.
19–20 Poacher or rustler. You start with a coil of rope.
Military Professions
d20 Profession
1–2 Constable or detective. You start with a lantern
and flask of oil.
3–8 Conscript or militiaman. You start with a spear
and uniform.
9–10 Guard or henchman. You start with a club and
uniform.
11–12 Jailer or torturer. You start with a pair of manacles
or torturer’s tools.
13–16 Mercenary. You start with a sword and a contract
for your last job.
17–18 Patroller. You start with a lantern and flask of oil.
19–20 Marine or Soldier. You start with a uniform, small
shield, and sword or cutlass.

Religious Professions*
d6 Profession
1 Anchorite, flagellant, or fanatic
2 Evangelist or street preacher
3 Acolyte, devotee, or initiate
4 Keeper of a shrine
5 Minister of a small temple
6 Minister of a large temple
*Your profession is usually association with your faith.
You start with a symbol of your faith.
Wilderness Professions
d20 Profession
1–2 Animal trainer. You start with a small animal
that’s friendly to you.
3–4 Apothecary or healer. You start with a healer’s
kit.
5–6 Drover or herder. You start with a staff.
7–8 Guide or pioneer. You start with a map of
the region.
9–10 Hermit. You start with a week of rations and
a waterskin.
11–12 Hunter or gatherer. You start with a bow and
12 arrows.
13–14 Nomad. You start with a horse.
15–16 Spelunker. You start with a lantern, pick, and
2 flasks of oil.
17–18 Tracker. You start with a spear.
19–20 Woodcutter. You start with an axe.
Starting Equipment
You begin the game with equipment based on your
starting lifestyle and professions. To determine your
starting lifestyle, roll 3d6 and add to the roll all the
modifiers gained from your Life Experience rolls.
Then find the total on the Starting Lifestyle table
(Lifestyles are described in Shadow, page 100). In
addition to the equipment, your character starts out
with one Interesting Thing (Shadow, page 26).
Starting Lifestyle
3d6 Lifestyle
3 or less Destitute
4–5 Poor
6–12 Getting By
13–15 Comfortable
16–17 Wealthy
18 or more Rich
Clothing
Lifestyle Clothing
Destitute Foul rags and a blanket
Poor Patched, threadbare basic clothing with
a ratty cloak
Getting by Basic clothing with a cloak
Comfortable 1d3 sets of basic clothing with one fine cloak
Wealthy 1d3 sets of well-made basic clothing, a set
of noble’s clothing, and a fine cloak
Rich 1d3 sets of noble’s clothing and a fine cloak
Weapons
Lifestyle Weapons
Destitute Club or a sling with 20 stones
Poor Staff, club, or sling with 20 stones
Getting by Sling with 20 stones and a basic weapon
of your choice
Comfortable Dagger and either a staff, club, or sling
with 20 stones
Wealthy Dagger
Rich Dagger
Personal Gear
Lifestyle Personal Gear
Destitute —
Poor Sack, loaf of bread, handful of nuts, bottle
of water, flint and steel, a candle
Getting by Backpack, week of rations, waterskin
filled with water, coil of rope, tinderbox, 2
torches
Comfortable Backpack, week of rations, waterskin
filled with water, coil of rope, tinderbox, 2
torches
Wealthy Backpack, week of rations, waterskin filled
with water, coil of rope, tinderbox, lantern,
2 flasks of oil
Rich Cosmetics kit, bottle of perfume,
handkerchief
Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting by —
Comfortable Healing potion plus either a scroll
containing an incantation of a rank 0 spell,
a small shield, a healer’s kit, a tool kit, or a
writing kit
Wealthy Healing potion plus either a scroll
containing an incantation of a rank 0 spell,
a small shield, a healer’s kit, a tool kit, or a
writing kit
Rich Healing potion, a personal servant
(commoner), a guard (mercenary), and
three horses with bits, bridles, saddles, and
feed for each

Wealth
Lifestyle Wealth
Destitute —
Poor 1d6 bits
Getting by 1d6 cp
Comfortable 2d6 cp
Wealthy or Rich 1d6 ss
Personal Effects*
d20 Item
1 A brace of conies
2 A sack of potatoes
3 A pipe with pipe tobacco
4 A bag of confectioner’s sugar
5 A bag of marbles
6 A whittling knife
7 A pair of loaded dice
8 A comb and a bottle of perfume or aftershave
9 A bolt of cloth
10 An iron cooking pot
11 A rabbit’s foot
12 A flask containing liquid courage
13 A fancy hat
14 A monogrammed handkerchief
15 A bag of purloined vegetables
16 A fiddle with bow
17 A writing kit
18 A moustache brush and moustache wax
19 A pair of spectacles or a monocle
20 A girdle for your rounded belly
*Roll on this table regardless of your starting wealth.
Personality Tables
Use the following tables to help define your character’s
personality. The results from each table should guide
how you portray the character during play.
Personalities
3d6 Personality
3 You completely lack social skills. You say the
wrong thing, make weird comments, and laugh at
inappropriate times.
4–5 You are loud and overbearing. People find it hard
to be around you for any length of time.
6–8 You tend to be quiet and withdrawn. You become
uncomfortable in large groups.
9–12 Neither outgoing nor insular, you adapt to social
situations.
13–15 You are friendly and personable. You find it easy
to make friends.
16–17 Loud, boisterous, and quick with a jest, you are
always the life of the party.
18 You ooze charisma. Wherever you go and
whomever you meet, people want to know you,
be around you, and listen to what you say.
Relationships
3d6 Relationships
3 You hate other people and are never surprised
when they fail to live up to your expectations. You
have no friends and few acquaintances.
4–5 You dislike other people and you expect them to
disappoint you. You have few friends.
6–8 You find it hard to make lasting relationships. You
simply drift apart from people you befriend or
love.
9–12 You get along with other people. You have some
friends.
13–15 You value your relationships and put effort in
keeping them. You have several friends.
16–17 You cherish and relish your friendships and go
to great lengths to keep them. You have many
friends.
18 You have never met a stranger. You know just
about everyone. You have loads of friends.

Desires and Fears*
1d6
Desire
Fear
Adventure
Failure
Comfort
Insecurity
Family
Isolation
Friendship
Need
Love
Pain
Security
Shame
*Roll once for Desire and once for Fear.
Obligations
3d6 Obligations
3 Your word is worthless. You rarely follow through
on your promises and almost never keep your
oath.
4–5 You find rules cumbersome and inapplicable to
you. You flaunt convention and do what you want.
6–8 You follow the laws when it suits your purposes.
You keep up your end of a bargain if doing so
does not interfere with what you want to do.
9–12 You usually keep your word and break promises
only when you have to.
13–15 You strive to keep your word and consider a
promise broken to be failure.
16–17 The laws exist for a reason and you follow them
to the best of your ability. You live honorably and
others find you trustworthy.
18 You never break the law, even if it’s a law you
consider unjust. You always do what you say you
will and refuse to be around oath-breakers.
Moralities
3d6 Morality
3 If there’s a bottom to the well of depravity, you
haven’t found it yet. Your mind is a catalog of
perversity and you indulge your many vices as
often as you can.
4–5 You do whatever you want. Sometimes, you do
things that offend or even frighten others, but it
bothers you not. It’s your life and you do as you
please.
6–8 You have no trouble making the hard decisions.
You do what needs doing and to hell with the
consequences.
9–12 You normally look after yourself, but you can do
good works when you think about it.
13–15 You work to be a good person and try to do the
right thing, even if you sometimes fall short of
your goal.
16–17 Good and noble, you drive out impure thoughts
and selfish behaviors. You work to do good in
the world, even if doing so would deprive you of
something your want or set back an endeavor
important to you.
18 You cannot comprehend evil. You see the world
in black and white, right and wrong. You know
what side you stand on and you champion good
wherever you go.
Religious Beliefs
3d6 Religion
3 You belong to a heretical sect, worship the Devil,
or belong to a cult of the Demon Lord. Gain 1
Corruption.
4–5 You belong to a minor religion centered on a
small god.
6–8 You follow the tenets of Witchcraft.
9–12 You follow the teachings of the Old Faith.
13–15 You have no religious beliefs (do not roll on the
Piety table).
16–17 You belong to the cult of the New God.
18 You adhere to some other, strange religion of your
own making.
Pieties
3d6 Piety
3 You only pretend to have religious beliefs. You
don’t actually believe in anything.
4–5 You are a believer in name only. You have grave
doubts about your religion.
6–8 You have many questions about your faith, but
feel it’s better to have a religion than not to have
one at all.
9–12 The strength of your piety is neither too strong
nor too weak.
13–15 You have few doubts about your religious beliefs
and take great comfort from your faith.
16–17 You have strong religious convictions and believe
your god or gods watch over you.
18 You are a religious fanatic to the point that you
talk about your god or gods all the time, using
them to justify your behaviors. You sometimes
persecute people who do not believe as you do.
Gain 1 Insanity.
```

### Halfling — Demon Lord's Companion

- **Entry Type:** Standard Ancestry
- **Source:** Demon Lord's Companion
- **Source Page:** 7
- **PDF Page:** 8

```text
Halfling
Halflings are happiest when relaxing in their tidy homes
or sitting in the village pub, laughing with their friends
over mugs of Belinda’s Finest Stout. The wider world seems
large and dangerous, filled with people of low character
and evil intent. Yet halflings do find their way into the
most unexpected places, and when faced with peril, they
overcome their misgivings and do what needs to be done.
The reason? Luck. Halflings have all the luck in the world.
Small Humans: Halflings look like small humans. Their
appreciation for fine food shows in a heavy frame and a
paunch that usually hangs over the belt. Halflings always
dress their best, keep their clothes clean, comb their hair,
and wash their skin.
Halflings stand between 3 and 4 feet tall. Good eating and
a fondness for drink can make them portly, and halflings
can, as a result, weigh from 50 to 150 pounds.
7
1

Demon Lord’s Companion
Ancestries
• Simple Life: Halfling settlers entered the Empire’s lands
about six centuries ago, crossing crossed the mountains
from the west and settling in the foothills and plains.
There they built small communities where they could
grow crops and graze their flocks. Halflings made peace
with the local lords and paid for the land with gold
coins of unusual mint. The halflings had no objections
to joining the Empire or paying taxes, provided halfling
communities were free to see to their own affairs and
protect their lands. Halflings have proven to be good
neighbors, a gentle folk with great skill at farming and
herding.
		 Halflings have managed to stay clear from the Empire’s
troubles, conflict rarely coming to their doorsteps. The
orc uprising in the south, however, has cast a shadow
over their lands, and gangs of rampaging orcs have
attacked halfling towns and raided trade routes. Fearing
worse troubles on the horizon, halflings have begun to
pack up their families and belongings to begin again
somewhere safer. Currently, the refugees are a trickle, but
if they become a flood, famine is almost certain to follow
in the Empire.
• Pragmatic Courage: Halflings understand how the world
works better than most. They believe this life is but one
of many, and they have embraced this truth in a way that
makes them almost impervious to fear. Such fearlessness
makes halflings suited to exploring dangerous places,
since doubts and misgivings don’t get in the way of
getting the job done. Being unmoved by fear does not
mean halflings take ridiculous risks, but they don’t fret
when they have to do a dangerous task.
		 Without fear as a distraction, halflings can focus their
minds on whatever goal they set for themselves. They
are less likely to make critical mistakes and can usually
catch themselves before a situation goes sideways. Others
interpret this phenomenon as uncommon luck, favor
from the gods, or something else. The halfling reputation
for good luck leads some dark souls to keep halflings as
lucky charms, and some twisted folk believe halfling luck
lingers even after death.
• Common Names: Abigail, Alyse, Belinda, Caden, Cody,
Davin, Ernest, Esme, Eugenia, Gertrude, Irving, Landen,
Natille, Paxton, and Randy.
Creating a Halfling
Starting Attribute Scores Strength 9, Agility 11, Intellect 10,
Will 11
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 1/2, Speed 8, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common
Tongue.
Good Fortune Whenever a creature within short range rolls
a 1 on any die, you can use a triggered action to discard
the roll and let the creature roll the die again.
Uncommon Courage When you become frightened, you
can use a triggered action to make a Will challenge roll.
On a success, you remove the affliction.
Level 4 Expert Halfling
Characteristics Health +4
You either learn one spell or gain Rising Fortunes.
Rising Fortunes Whenever you roll a 6 on the die for a
boon, you make all attack rolls and challenge rolls with 1
boon for 1 round.
Halfling Age
3d6 Age
3 You are a child, 11 years old or younger
4–7 You are an adolescent, 12 to 17 years old
8–12 You are a young adult, 18 to 35 years old
13–15 You are a middle-aged adult, 36 to 55 years old
16–17 You are an older adult, 56 to 75 years old
18 You are a venerable adult, 76 years or older
8
1

Demon Lord’s Companion
Ancestries
Halfling Build
3d6 Build
3
You are quite small for a halfling, standing just 2 feet
tall and weighing 40 pounds.
4
You grew horizontally instead of vertically. You have
a rounded body and short, stubby limbs.
5–6 You are short for a halfling.
7–8 You are skinny no matter how much you eat.
9–12 You are normal height and weight for a halfling.
13–14 Good living has rewarded you with considerable bulk.
15–16
You are tall by halfling standards and can pass for a
short human.
17
You are tall and slender, with a willowy body. Your
family claims you have faerie blood.
18
You are enormous for a halfling, standing 5 feet tall
and weighing close to 200 pounds. Increase your
Size to 1.
Halfling Appearance
3d6 Appearance
3
Luck saved your life, but you did not escape death
unscathed. You bear horrific scars, your appearance
a mess that evokes revulsion in anyone who lays
eyes on you.
4
You are downright ugly. Your features look like they
wandered around your head and settled in where
they felt comfortable.
5–6
You have an unattractive quality that ruins your
otherwise plain appearance.
7–8
You have no distinctive physical qualities. People
sometimes forget you are there.
9–12 You are perfectly average and unremarkable.
13–14
Other halflings find you attractive, likely due to your
winning personality.
15–16 You are attractive.
17
You are striking, catching the eye of halflings and
humans alike.
18
You are a great beauty, an individual perfect by the
standards of your people and others. When you
enter a room, people notice.
Halfling Background
d20 Background
1
Your curiosity led you to a very dark place, where
you witnessed something that unhinged your mind.
You start the game with 1d3 + 1 Insanity.
2
You discovered a terrible secret. To keep your
family safe, you decided to disappear.
3
Hard times forced you to make ends meet by
committing crimes. Gain one criminal profession.
4
You stole something of great importance. Someone
else took the blame and was executed for the crime.
5
A nasty plague wiped out your community. You
were the sole survivor.
6
An orc captured you and kept you as a prisoner for
1d6 years. The orc believed you were a lucky charm.
7
You went spelunking and became lost until a group
of gnomes rescued you.
d20 Background
8
You have terrible wanderlust. You can’t stay put for
more than a few weeks at a time. Add one language
to the list of the languages you can speak.
9 You worked a series of a terrible jobs in a large city.
10 You earned a living working in your profession.
11
A human fell in love with you, but you rejected the
relationship.
12
You have a large immediate family with 2d6 + 3
members.
13
You befriended a powerful witch or wizard who
came to visit your community.
14
You received an education. You know how to read
the Common Tongue.
15
When your town came under attack, you led your
people to safety.
16
One time, an ogre swallowed you whole. Somehow,
you survived and came out the other end, filthy but
intact.
17
You were abducted by faeries, but you managed to
escape.
18
You went on a long journey with a band of dwarfs.
You plan to write about your experiences one day.
19
You found an odd treasure in a cave. You start
the game with one enchanted object of the GM’s
choice.
20
You came into money and start the game with 3d6
copper pennies.
Halfling Religion
3d6 Religion
3–4 You belong to the cult of the New God.
5–6 You studied a bit of witchcraft.
7–8 You follow the tenets of the Old Faith.
9–12 You have little use for the gods or religion.
13–18 You don’t believe the gods exist.
Halfling Personality
3d6 Personality
3
Something is wrong with you. You dream about
hurting people, cutting them up and making them
scream. You worry that you may one day act out on
these fantasies.
4
You have a hard time paying attention. You are
easily distracted and tend to abandon whatever
you’re doing to do something else.
5–6
You keep your head down and try not to cause
trouble.
7–8
You do what you want, when you want. You won’t
let anyone get in your way. You can’t soar with the
eagles when you’re scratching with the turkeys.
9–12
You try to do right by your friends, provided doing
so doesn’t slow you down.
13–14 You are a good person who enjoys helping others.
15–16
You look after your people, whether they are other
halflings or the people you call your friends. You
would do anything for them.
17
You always do what you think is right, even if doing
so gets you into trouble.
18
You are concerned about what others think of you
and alter your behavior to make others like you.
9
1

Demon Lord’s Companion
The paths characters walk are endless, each leading to a
different destiny. This chapter presents several new expert
paths and master paths. For guidelines on choosing paths,
see Shadow of the Demon Lord.
Expert Paths of Faith
Path Description
Shaman
Shamans commune and bond with unseen
spirits to gain aid and power.
Warden
Wardens draw strength from the natural
world and land to destroy its enemies.
Expert Paths of Power
Path Description
Elementalist
Armed with the power of air, earth, fire, and
water, elementalists attune to elements to
gain their properties.
Psychic Psychics use their mental power to fuel magic.
Expert Paths of Trickery
Path Description
Mountebank
Consummate scoundrels and tricksters,
mountebanks use deception to gain the
upper hand against their enemies.
Sage
Scholars without peer, sages rely on their
wits and learning to overcome challenges.
Expert Paths of War
Path Description
Mystic
Harnessing the power of the soul’s
energy, mystics escape the limitations of
body and mind to attain enlightenment.
Swashbuckler
Cunning and daring combatants,
swashbucklers overcome foes by
outwitting them.
Master Paths of Magic
Path Mastery
Alchemist Alchemy spells
Demonologist Demonology spells
Entropist Death spells
Medium Spiritualism spells
Mind Bender Telepathy spells
Psychokinetic Telekinesis spells
Master Paths of Skill
Path Mastery Path Mastery
Blackguard Fighting for evil Reaver Killing
Corsair Swift weapons Sapper Explosives
Martial
Artist
Unarmed
combat
Seeker
Focusing the
mind
10

Demon Lord’s Companion
Paths 2
```

### Hamadryad — Scions of Nature

- **Entry Type:** Expanded Ancestry
- **Source:** Scions of Nature
- **Source Page:** 3
- **PDF Page:** 3

```text
Hamadryad
Characters
The rules for creating hamadryad characters first appeared
in Demon Lord’s Companion 2. The following information
supplements the base rules to provide new options and
greater detail. If you use these rules, be sure to use the
supplementary tables also presented in the following pages
to determine your starting profession, languages, and
equipment.
Sentient Tree
You are a tree of a species you choose. You grow from
a surface in which you can root yourself, such as hard-
packed sand, earth, or stone. Though you lack eyes to
see, ears to hear, or mouth to speak, you can sense your
surroundings, being able to locate creatures and objects
within medium range, and you remain aware of time’s
passage. Being rooted in place prevents you from moving
or using an action or triggered action for any activity other
than to adopt a humanoid form. Your damage total remains
regardless of your current form.
You have the following attributes and characteristics
while in your natural form.
Strength —, Agility 0, Intellect/ Will as humanoid form
Perception as humanoid form
Defense 0
Health 100
Healing Rate 25
Size 3
Speed 0 (no benefit from bonuses to Speed)
Power as humanoid form
Humanoid Form
You can use an action to shrink and flow out of your tree
shape and into a humanoid shape. You appear as person
made of wood, possibly with twiglike growths, knobs,
flowers, leaves, and the like. Your arms end in gnarled
hands and your legs end in root-like appendages. Your eyes
emit a faint green light. You can remain in your humanoid
form for as long as you choose, until you use an action
while standing on a surface into which you can sink your
roots to return to your tree form, or until you become
incapacitated, at which point, you return to your tree form,
but felled.
Attribute Scores
You use the following attribute scores while in your
humanoid form. If you increase these scores from your
paths, the increases apply only to your humanoid form. You
can adjust the following scores as described in Shadow of
the Demon Lord, page 10.
Strength 9
Agility 10
Intellect 9
Will 11
Random Attribute Scores
If you prefer, you can generate a random set of
scores for your attributes. Roll four d3s, noting the
number rolled for each. You then add one number
rolled to the following base attribute scores:
Strength 7, Agility 8, Intellect 7, Will 9
Characteristics
You determine the values for your characteristics as follows.
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1
Speed 10
Power 0
Damage, Insanity, and Corruption 0
Languages You speak the Common Tongue.
Professions Determine your starting profession using the
tables presented below.
Hamadryad Traits
You have the following traits while in humanoid form.
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Immune damage from disease; charmed, diseased
Nature Stride You ignore the effects of moving across
difficult terrain caused by roots, undergrowth, trees, and
other flora.
Iron Vulnerability You are impaired for as long as you
remain in contact with iron. If you take damage from an
iron weapon, you become impaired until the end of your
next turn.
Vulnerable to Fire You take double damage from fire.
Level 4 Hamadryad Expert
Upon reaching level 4, you gain the following benefit from
your ancestry.
Health Increase your Health by 4.
Additional Hamadryad Trait
Gain one of the following traits.
Spell You learn one spell from a tradition you have
discovered.
Bludgeoning Branches In humanoid form, your unarmed
attacks deal 1d6 damage.
Deep Roots While you are in humanoid form and standing
on a surface of earth, sand, or stone, you can use an
action or a triggered action on your turn to anchor
yourself into place, becoming immobilized until you
become incapacitated or you end the effect using an
action or a triggered action used on your turn. Until the
effect ends, your Speed is 0 and you become immune
to any nonmagical effect that would move you against
your will. In addition, if your Defense is less than 15, it
becomes 15, and your weapon attacks deal 1d6 extra
damage.
Natural Flow When moving through wilderness in
humanoid form, plants aid in your movement. You can
move in any direction, but no more than 5 yards above
the ground, you can move across liquid surfaces, over
obstacles, such as pits, and through obstacles made of
plants as if they weren’t there.
Violent Growth While you are in humanoid form and
standing on an earthen or stone surface, your melee
weapons have the reach +1 property. If they already have
a reach property, the reach property increases by 1.
Hamadryad
Development
Choosing to play a hamadryad instead of some other
ancestry offers you great opportunities to play a realized
character and make the experience in fighting the Demon
Lord even more rewarding. The following sections provide
you with ideas and information to add detail to your
character beyond the basic numbers. Here, details on
upbringing, homeland, personal history, as well as physical
details, personality, behavior, and motivations all grant
you a useful framework within which you can play the
game. If you use these tables, use them instead of the ones
presented in Shadow of the Demon Lord and Demon Lord’s
Companion 2.
Upbringing
Most hamadryads grow in wholesome, safe environments,
surrounded by others of their kind. Your upbringing might
explore experiences you had in such a caring community or
it could explain why this background was denied to you.
Family
Use the family table to describe the people with whom you
spent your earliest years and, perhaps, until you reached
adulthood.
Homeland
As mentioned, hamadryads live deep inside forests whose
trees have never known the bite of an axe or the kiss of a
flame. Troubles responsible for stirring the hamadryads
from their woodlands might have had a deleterious effect
on your homeland.
Education
Hamadryads impart their knowledge to saplings to prepare
them for adulthood. The information imparted includes
their beliefs about their origins, knowledge of the lands
around them, as well as how to change shapes and to survive
while in those shapes. A particular grove, depending on
their history might impart more specialized knowledge. Your
education determines your starting professions.
Family
3d6 Family
3
A blight wiped out your community, leaving
you the sole survivor. You know little about the
hamadryads and their purpose in the world.
4–5
A vile magician stole you as a seedling and
brought you up for some nefarious purpose.
You were not able to absorb much about your
people’s culture before you were stolen.
6–8
You benefited from a caring, supportive family,
but it came to a sudden, tragic end when
monsters wiped out much of your community,
leaving you as the sole survivor.
9–12
You benefited from being raised by other
hamadryads and they filled your mind with all you
needed to know about the World Mother and the
purpose for which she made your kind.
13–15
Dark magic, vicious monsters, or some natural
catastrophe forced you to grow up early. You and
many others of your kin fled to safety.
16–17
The hamadryads who raised you were among
some of the oldest in the world. They believed
you had a special destiny and thus held you to a
higher standard than others.
18
You sprouted in the grove of the World Mother
herself. She watered your roots and coaxed you
into growing strong and true.
Homeland
3d6 Homeland
3
The remains of a once vibrant woodland reduced
to cinders by dark magic.
4–5
A tiny settlement on the borderlands of a hidden
kingdom, where you had regular contact with the
faeries.
6–8
A hidden grove where your people fought to
protect themselves against the monstrous
denizens that shared their territory.
9–12
A quiet, peaceful woodland that has only recently
become aware of the grave danger threatening
reality.
13–15
Alone in a land denuded of its trees, where you
were one of few survivors.
16–17
On the edges of a swamp or marsh, where the
threat of terrible things lurking in your vicinity
kept the charcoal burners and woodcutters at
bay.
18
A small forest growing from the top of an island
adrift above the desert wastes of the Desolation.
Education
3d6 Family
3
Some foul entity corrupted you, warping your
mind into something obscene. Gain 1 Corruption,
the ability to read, write, and speak Dark Speech,
and academic knowledge of magic or the occult.
4–5
Your elders taught you much about the secrets
of nature and magic, granting you academic
knowledge of both.
6–8
Your community prized its secrecy. You gain the
patroller and spy professions.
9–12
You received an education typical for most
hamadryads. You have academic knowledge of
religion and nature.
13–15
Your community emphasized protecting itself
from enemies and you received martial training
as a result. You gain the patroller and soldier
professions.
16–17
When you came of age, you spent much time
ranging throughout the lands. You gain the guide
and vagabond professions.
18
Early exposure to people other than hamadryads
broadened your horizons. You gain any two
professions of your choice.
Signature
Background Event
Something happened in your past that altered the course of
your development and, perhaps, laid bare the future road
you are to walk. Your signature background event describes
this happening. Either randomly determine or choose an
event from the following table or the one in Demon Lord’s
Companion 2, or come up with one of your own.
Signature Background Event
d20 Event
1
A wildfire swept through the forest in which you
lived. Among the few survivors, you discovered
evidence suggesting that the fire had a human
cause and came to believe they sought to wipe
out your family. You have sworn to find the culprit
and bring them to justice.
2
A ranger passing through your woodland home
caught your eye and you fell in love. You followed
this person at a distance until one day you found
the courage to introduce yourself. Rather than
reciprocate your feelings, the person screamed in
terror and when you tried to console them, quiet
them, you accidently broke them. You left the
body, vowing never to speak of the happening,
but you burn with shame and self-loathing.
3
A druid came to your grove and beseeched
your people for aid in defeating a monster
that had settled nearby. You joined with the
others to defeat the creature and earned the
druid’s goodwill as a result. Unfortunately, you
discovered that the so-called monster was drawn
here by actual monsters on which it fed. With the
creature dead, the monsters’ numbers have grown
and now overrun your forest.
4
You were raised to despise humans. When you
came of age, you joined the other hamadryads
who hunted these people. You lost count of
how many lives you took before your realized
the wrong you were doing. You broke with your
fellows and now seek redemption by helping
humans rather than harming them.
5
Beastmen spilled into your forest. Your people
ignored them for a time, but the beastmen
dragged a boulder and raised it like an altar in
the center of your grove. The hamadryads awoke
to drive them off, but the beastmen were too
numerous and they put most of your people to
the axe. You escaped with one other, but this
sister or brother died from their injuries. You have
been on the move ever since.
6
You left your community to join a cult dedicated
to the World Mother. Since this cult included
members of other ancestries, you believed
you would gain a greater understanding of the
goddess. Not long after joining, you heard some
of their beliefs given voice and found them
heretical, upsetting. You left the cult, but when
you returned home, you found your people had
vanished.
7
One day, you found a human child that had
become lost in your woods. You helped the child
find their way home, but a friendship formed and
the child visited you often in the woods. Years
later, the child had grown up, married, and had
children of their own, and you watched from afar,
helping when you could. Raiders fell on the house
and butchered everyone inside. The loss of your
human friend and their family fills you with hatred
that often gets the better of you.
8
You began a torrid love affair with a dryad and
the two of you met in the quiet places to love one
another. The dryad eventually grew weary of you
and took a mortal lover. You killed the mortal and
never forgave the dryad for the betrayal.
9
Dark magic infected your forest. It poisoned the
trees, sickened the wildlife, and corrupted you and
other members of your grove. You appear to be
a dead tree when in normal form and a humanoid
corpse when you adopt your other form.
d20 Event
10
When fire ravaged your forest, you took shelter
in a nearby human village. You remained there
for many years, where you found friendship and
acceptance.
11
Battling wizards fought in the skies above your
forest. Their spells filled the air overhead with
streaks of light, sparks, and bizarre shapes as the
two fought to the death. As you watched, one
got the upper hand on the other, and cast them
to the forest floor, defeated. You helped nurse
this magic-user back to health and gained an
understanding of the magical arts.
12
When a pair of lovers tried to carve their names
in your bark, you transformed and sent their
broken bodies hurtling away from you. Knowing
that others would come, you fled for the deep
wilderness and have since become lost.
13
People had been coming into your forest for
months under the cover of night. Your interest
piqued, you followed and saw they were
performing obscene rituals of dark and dreadful
power. You told the other hamadryads and
together you drove these cultists off. You fear
they might return, so you set off to enlist aid to
protect your people.
14
Two armies fought in a field not far from your
grove. You and other hamadryads went to watch
and witnessed the carnage. Shaken, you turned
your back on the world of humans, vowing to
leave them to their slaughter. You held this
position for years, but one day, the World Mother
visited you in your dreams and revealed that you
must aid humanity to save them from themselves.
15
A druid found you when you were a sapling and
raised you as their own. You grew up, but found
you prefer your humanoid form to your tree form.
16
A woodcutter mistook you for an ordinary tree.
You have the scar from the axe still. However,
once the woodcutter realized their error, they
nursed you back to health. A friendship, or
something more, formed, but the woodcutter
eventually sickened and died, leaving you alone
once more.
17
You are a skilled tree sculptor. You can work with
living wood to change its shape into any form you
please. Fame of your skill spreads across many
hamadryad communities in your lands.
18
You traveled far from your woodland home as
a seedling and eventually took root high in the
mountains, where you grew, unaware of your
nature until you became a full-grown tree. You
might have passed all your days this way, but a
traveler recognized you for what you are, and
awakened you to your true potential.
19
Your family dwelled in one of the hidden
kingdoms, having been welcomed there
generations ago by a powerful elf aristocrat after
some service done. When you came of age, you
felt drawn to the mortal world, eager to discover
the place your people left behind.
20
You bequeathed your heartwood to a mighty
wizard to make a staff with which they would
defeat a terrible demon. Although denied a part
of yourself, you believed your sacrifice had been
a good one. You learned later that this wizard
was corrupted by darkness and used the staff to
carry out acts of unfathomable evil. You hunt this
wizard now, having vowed to take back your gift.
Physical Features
Existence as a hamadryad means having two different
forms, with your natural form being that of a tree of any
species, and your humanoid form being that of a person
formed from wood, bark, branch, and shoot. You can use
the following tables to guide your decisions about what you
look like.
Tree Form
Hamadryads have tree forms resembling the dominant
species in the lands where they were planted. Some
hamadryads look like fir or pine trees, others like oaks or
maples. Some believe there are hamadryads who aren’t
trees at all, but are instead cacti. Demon Lord’s Companion 2
offers a reasonable set of twenty different types of trees and
that table can work well for you. Or, if you prefer, you can
use the following tables to assemble a form of your own.
Bark
d20 Bark Type
1–2 Shaggy or hairy
3–4 Papery
5–6 Thin and warty
7–8 Thick and rough
9–10 Spiked and smooth
11–12 Rough and knotty
d20 Bark Type
13–14 Banded or scaled
15–16 Whorled
17–18 Ropy
19–20 None
Branches
d6 Number of Branches
1 Three
2 Four
3 Five
4 Six
5 Seven
6 Eight
Leaves
d6 Leaves
1 Small, round or oval
2 Broad, flat
3 Pointed, spiked, leathery, shiny
4 Large, segmented
5 Needles, short or long
6 Soft, flowers
Humanoid Form
Across a wide spectrum does the hamadryad’s humanoid
appearance appear. Some can pass for human while others
look more like humanoid trees. The following tables
replace those in the Demon Lord’s Companion 2 for the
purpose of determining your humanoid form’s appearance.
Age
Hamadryads can live without fear of growing old. Once
they come of age, they stop physically aging and provided
they escape harm, their forms never change.
Distinctive Traits
You might have one or more physical traits that help
individuate you from others.
Personality
When coming up with your character’s personality, aim for
one that’s both compatible with you and how you prefer to
play, but, more importantly, one compatible with characters
played by the other players. Remember: don’t be a dick.
Dependability: The degree to which others can rely on
you to do what you say describes your dependability.
Sociability: The sociability aspect describes how well you
handle social situations, whether you seek them out or
avoid them.
Outlook: You can be a positive or negative person, but you
probably fall somewhere in between, experiencing ups
and downs as most people do.
Receptivity: How willing you are to accept changing
circumstances describes your receptivity.
Affability: Affability describes your conduct in social
situations.
Morality: You could be a good and virtuous person,
committed to helping others, or selfish, putting your
needs and desires above others.
Hamadryad Humanoid Build
3d6 Humanoid Build
3
You are 48 + 1d3 inches tall and you weigh 60 +
2d20 pounds.
4–5
You are 48 + 1d6 inches tall and you weigh 80 +
2d20 pounds.
6–8
You are 48 + 2d6 inches tall and you weigh 100 +
2d20 pounds.
9–12
You are 60 + 1d6 inches tall and you weigh 120 +
4d20 pounds.
13–15
You are 60 + 3d6 inches tall and you weigh 140 +
4d20 pounds.
16–17
You are 60 + 3d6 inches tall and you weigh 100 +
4d20 pounds.
18
You are 60 + 5d6 inches tall and you weigh 160 +
6d20 pounds.
Hamadryad Humanoid Appearance
3d6 Humanoid Appearance
3
You change little when you adopt a humanoid
form: your lower trunk splits into legs, two low
branches serve as arms, and a suggestion of a
face forms somewhere on the front of your upper
trunk.
4–5
You shed some of your tree nature when you
become humanoid, but your skin is bark, your
arms look like branches, while your legs seem like
trunks, ending it splayed feet fringed with roots.
Smaller branches crown your head.
6–8
You shed most of your tree form when you
become humanoid. Though obviously made of
wood, you have a shapely body and slender
branches grow from the top of your head.
9–12
You almost appear human when you adopt your
humanoid form, with a shapely form, skin having
only a subtle appearance of being wood, and
leafy vines for hair.
13–15
You can pass for human under casual inspection.
You have a full formed human body of seeming
flesh and of a color of wood. You have no body
hair, however.
16–17
When you shed your tree form, you appear
fully human, attractive and appealing, with soft,
supple skin, and long flowing hair adorned with
small, fragrant flowers.
18
You become a striking, captivating human when
you adopt your humanoid form. Bright green hair
flows down your back. Nothing about your form
reveals your true nature.
Hamadryad Age
d6 Age
1
You are young enough to still be considered a
sapling among your people. You are 10 + 2d20
years old.
2
You have just reached adulthood. You are 20 +
2d20 years old.
3–6 You are an adult and are 1d20 × 20 years old.
Hamadryad Distinctive Traits
d20 Distinctive Trait
1
Someone carved into your bark and you bear the
scar in both forms.
2
Your coloration changes with the seasons. You
appear pale in the winter, bright green in spring,
gold in summer, and red in autumn.
3
A small animal has a nest in your tree form. When
you transform, the animal scurries all over your
body. Nothing that happens to you or that you do
seems to rid you of this creature.
4 Your fingers look like leafy branches.
5
Sparrows follow you wherever you go. They alight
upon you, fluttering off, only to come back to you
when you’re at rest.
6
You lost a branch in a storm. The wood appears
raw and splintered. In your humanoid form, you’re
missing a finger.
7 You creak and groan when you move.
8
You freshen ordinary plants around you, causing
them to grow a bit straighter and appear a little
healthier.
9
You speak very slowly. You drag out
conversations, so that communicating with you
can sometimes be a chore.
10 You sprout flowers whenever you are happy.
11
You exude sap from your body and small things
sometimes stick to you.
12
Some sort of cable-like vine grows on your trunk
and appears as thick lines on your body when in
humanoid form.
13
Rather than eyes, you have empty eye sockets,
though you can see as normal.
14
Moss or fungi grows on your body, regardless of
the form you wear.
15
You have a constant problem with termites. Your
body repairs itself on its own, protecting you from
the worst damage, but sometimes these winged
insects fly around and annoy you.
16
When you become frightened, all the leaves or
nuts on your body (if any) fall to the ground
around you. They grow back a few hours later.
17
You have a bullet, small blade, or something else
embedded in your body, stuck there when you
were in tree form. You grew around the foreign
object.
18
Your body gives off a sweet, floral scent
reminiscent of cherry blossoms.
19
You have a hole in the trunk of your tree form that
carries over when you assume humanoid form.
You can store 1d3 objects inside this hole.
20
If you stand in place too long, roots grow from
your feet and dig into the surface on which you
stand. You can move normally, but you damage
the surface in the space you leave.
Dependability
3d6 Dependability
3
My word is worthless. If I do what I say that I’ll do,
it’s because it seemed like the thing to do at the
time.
4–5
I have a hard time remembering what I am
supposed to do. I’m easily distracted.
6–8
I make promises to make people happy. I often
don’t follow through, but mean no harm.
9–12
I do what I say I will do, provided I can. I mean,
something might come up. If so, sorry!
13–15
When I tell you I will do the thing, I mean it. If I
let you down, I beat myself up about it for a long
time.
16–17
I put other’s needs ahead of my own, so when I
make a commitment, I keep it, even if it costs me.
18
Nothing will make me break my word. I would
rather die than let someone down.
Sociability
3d6 Sociability
3
I can’t stand being around other people. The idea
of being in a conversation makes my leaves fall.
4–5
I avoid social situations when possible. Rarely do I
emerge from a conversation feeling better about
myself.
6–8
I am fine around people I call friends, but others?
No thank you.
9–12
I can hold my own in social situations. I’m also fine
when I’m alone.
13–15
I enjoy talking with others. You can learn all sorts
of things if you just take the time to get to know
people.
16–17
I am a social creature and seek out social events.
I’ve never met a stranger and I will talk to anyone.
18
I become a mess if I go too long without talking to
someone else. I have to be around people all the
time.
Outlook
3d6 Outlook
3
The world has become a sick place and there’s no
hope of improvement. We are doomed.
4–5
I find it hard to see the good in others. People are
just so selfish, so wicked. Why bother trying to
make a difference when it will all end anyway?
6–8
I’ve learned to expect nothing. Once I figured that
out, I’ve not been disappointed.
9–12
You have good days and bad, just like everyone
else. It might be possible to make a difference, but
it’s going to be difficult. It’s worth the trouble.
13–15
Things might be bad now, but they could always
be worse. I’m grateful for what I have and I hope
to help others overcome their challenges.
16–17
People make things out to be worse than they
really are. There are always challenges, but people
always beat them given time.
18
There’s nothing wrong. Everything is fine.
Everything is great!
Receptivity
3d6 Receptivity
3
I do what I do because it works. I don’t want to
hear about your new way of doing things. Change
for the sake of change just creates chaos.
4–5
I have a routine I like to follow and I do not
enjoy surprises. I make an effort to make sure
everything works the way it’s supposed to work.
6–8
I don’t see a lot of value in change. I mean, if you
can show me that your way is better, sure. But
good luck.
9–12
While I’m pretty comfortable with the way things
are, I’m also willing to change if it’s needed.
13–15
I believe that one should always work toward
improvement, to find a better way to live, love,
and laugh.
16–17
I chafe under routine. I hate doing the same thing
for too long and am on the lookout for ways to
change up my circumstances.
18
You never can tell what I’m going to do. I’m
changeable, random, and erratic. I thrive on chaos
and despise order.
Affability
3d6 Affability
3 I won’t speak up at all unless someone makes me.
4–5 I am quiet, reserved. I prefer to listen.
6–8
I don’t say much, but when I do speak, it’s usually
important.
9–12
I can handle myself in a social situation. I can listen,
pay attention, and respond to what others say.
13–15
I am a good conversationalist. People open up to
me and seem to enjoy my company.
16–17
I’m a talker. I can chat about anything and with
anyone. I sometimes get carried away and
dominate the conversation.
18
I am loud, boisterous, and probably offensive. I
take over conversations and when someone else
tries to talk, I just raise the volume.
Morality
3d6 Morality
3
Oh, I’m a delight. I want to see you squirm. I want
to make you suffer. Your pain is my pleasure. I am
cruel and wicked. I have obscene desires and I will
do almost anything to feed them.
4–5
Other people can look after themselves. I’m the
most important person in my life and so I take care
of myself, even if it means depriving someone else.
6–8
I’m selfish, but at least I know this about myself.
My inclination is to take what I want and do what
I want, but I can show restraint, especially if
someone points out my bad behavior.
9–12
I try to be a good person, but I’m also not perfect.
I fail sometimes, but I try to make up for my
shortcomings.
13–15
My empathic nature makes it hard for me not to
consider others’ feelings and needs. I help others
and I’d go without if I need to.
16–17
I follow a strong moral code. I know the difference
between right and wrong. If I err, the shame burns
me like fire and I will do anything to make amends.
18
I am a paragon of virtue. I have never had a selfish
thought. I am considerate, polite, kind, giving, and
cannot fathom any other way to be.
Professions
As hamadryads hail from self-sufficient communities in
the wilderness, they have little reason to learn trades to
enrich themselves. Instead, they develop skills useful to
their community and use those skills to make contributions
toward the common good. Such skills translate into a narrow
list of possible professions from which you should choose.
Hamadryad Professions
d20 Profession
1 Wood shaper
2 Planter
3 Sentry
4 Tracker
5 Naturalist
6 Herbalist
7 Gatherer
8 Nomad
9 Devotee of the World Mother
10 Community leader
11 Animal handler
12 Healer
13 Hunter of humanoids
14 Student of magic
15 Laborer
16 Singer
17 Envoy to the faeries
18 Astrologer
19 Gardener
20 Protector
Starting Equipment
Hamadryad communities place no value in wealth or
coin or commerce. Instead, they share resources and use
what they need and no more. As a result, you don’t have
a lifestyle in the manner of other characters and instead
begin the game with the following equipment.
Clothing: You have a set of simple clothing to cover
yourself when in humanoid form. The ensemble
includes shirt, pants, and a cloak with hood.
Weapons: You have club, bone-tipped spear, or staff.
Special Gear: You have 2 healing potions.
Interesting Thing: You have an interesting thing. You can
use whatever tables you like to determine its nature,
including the one that follows.
Hamadryad Interesting Things
d20 Interesting Thing
1
A pet crow that can communicate with you. It knows
nine words, four chosen by you, one chosen by a
different player of your choice, and four chosen by the
GM.
2 A small pouch of flower seeds that replenishes itself
once each day in the light of the rising sun.
3 A bird’s nest holding 1d6 eggs.
4 A small bag containing six doses of antifungal powder.
5 An infestation of mites!
6
A door in your body that appears only while you are
in tree form. The door opens onto someplace in a
hidden kingdom.
7 Four seedlings of new hamadryads awaiting planting.
8 A sword made from wood, but is as hard as steel.
9
A magical rose flower plucked from the World
Mother’s Grove. A creature who carries the rose and
dies returns to life, fully healed, 24 hours later. The
rose disappears.
10 Three magical fruits that function as potions of
healing when eaten.
11 Four bottles of faerie wine.
12
A tiny, harmless faerie who accompanies you where
you go and sings bawdy, offensive songs when you
ask it.
13 The severed head of an orc or human preserved in
amber.
14
A wasp nest filled with living wasps friendly to you.
You can use an action to drop the nest or throw it
to a point within short range. The nest breaks open
and releases a cloud of angry wasps into a 5-yard
radius centered on the nest. The wasps partially
obscure the space. In addition, when they appear
and again at the end of each round, each creature
in the area makes a Strength challenge roll. On a
failure, the creature takes 1d6 damage and becomes
poisoned for 1 minute. Once you use this interesting
thing, you lose it forever.
15 A bag of humanoid skulls collected from people
who trespassed on your territory.
16 A symbiotic vine that helps you carry two additional
items.
17 A pair of frisky squirrels that live in your branches.
18 A blackened scar from a lightning strike.
19 The petrified remains of one of your relatives.
20 A few coins (2d6 gp) of a far darrig’s treasure.
```

### Hamadryad — Demon Lord's Companion 2

- **Entry Type:** Standard Ancestry
- **Source:** Demon Lord's Companion 2
- **Source Page:** 7
- **PDF Page:** 8

```text
Hamadryad
For centuries, the hamadryads have hidden in the
deep forest, masquerading as ordinary trees. But as
the shadow has fallen on more and more of Urth,
spreading closer to their refuges, the resulting chaos
has drawn the hamadryads from their groves to join
the struggle against the enemies of creation—just as
they were charged to do long ago. These peoples of
the forest are unaccustomed to the ways of modern
civilization and find the world much stranger and
darker now than the way they remember it.
Daughters of the World Mother: When the
old gods withdrew from Urth to enter the magical
realms of the faerie, the World Mother lingered
long enough to touch the trunks of certain trees.
She imparted sentience to each tree she touched,
and the ability to adopt the humanoid forms of
her daughters. She charged her children with
safeguarding the world from the greed and evil of
mankind. Today, most hamadryads remain in service
to the goddess, ready to carry out their sacred duty
in these uncertain times. A few hamadryads worship
all old gods and uphold the tenets of the Old Faith.
People of the Woods: The World Mother gave
hamadryads the ability to flow their forms into
humanoid shapes so they could better serve her. This
gift provides them with mobility and speech and lets
them interact directly with others. The specific forms
that hamadryads adopt vary, of course. Some appear
almost human, while others look like animated trees
with branches for arms, roots for legs, and faces
etched in their bark. Most of these creatures’ bodies
fall somewhere between these extremes. Regardless of
details, in its humanoid form a hamadryad can wield
weapons and manipulate objects.
Hamadryads in human form typically stand 5 feet
tall and weigh 160 pounds. They do not usually have
body hair, and their skin looks like wood, betraying
their true nature. They often have bright, glowing eyes,
usually green, and soft, whispery voices that sound
much like the wind passing through their branches.
A long-lived people, hamadryads can survive for
centuries before succumbing to old age or infirmity.
Common Names: Hamadryads often go by the
names of the trees they resemble, such as Maple, Ash,
Holly, Oak, and so on.
Creating a Hamadryad
Attribute Scores Strength 9, Agility 10, Intellect 9, Will 11
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages You speak the Common Tongue and Elvish.
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Immune damage from disease; charmed, diseased
Nature Stride You ignore the effects of moving across
difficult terrain caused by roots, undergrowth, and trees.
Vulnerable to Fire You take double damage from fire.
Iron Vulnerability You are impaired while you are in contact
with iron.
Tree Form If you are standing on an earthen or rocky surface,
you can use an action to return to your true form, which
is that of a Size 3 tree. Everything you wear and carry
transforms with you. While in this form, you are blinded
and immobilized, though you can otherwise perceive your
surroundings and you can notice the passage of time. Also,
you cannot be moved unless you are incapacitated, at
which point you die. The only action you can take while in
this form is to assume your humanoid form.
Level 4 Hamadryad Expert
Characteristics Health +4
You either learn one spell or gain Deep Roots.
Deep Roots If you are standing on an earthen or rocky
surface, you can use an action, or a triggered action on
your turn, to cause roots to grow from your legs and sink
into the ground, anchoring you in place. You become
immobilized, and other creatures cannot move you by
nonmagical means. In addition, bark covers your body,
making your Defense 15 if it’s not higher than 15 already.
Finally, your weapon attacks deal 1d6 extra damage. The
effect lasts until you become incapacitated or until you use
an action, or a triggered action on your turn, to end it.

8
Hamadryad Age
d3 Age
1 You are young, less than 50 years old.
2–3
You are an adult and have stopped physically
aging. You are 1d20 × 20 years old. For each
century you have lived, add either one wilderness
profession to your list of professions or one
language to your list of known languages.
Hamadryad True Form
d20 True Form d20 True Form
1 Walnut 11 Willow
2 Oak 12 Chestnut
3 Dogwood 13 Hawthorn
4 Mulberry 14 Ash
5 Black poplar 15 Alder
6 Elm 16 Beech
7 Fig 17 Birch
8 Pine 18 Elder
9 Maple 19 Rowan
10 Cedar 20 Holly
Hamadryad Humanoid Build
3d6 Humanoid Build
3 You are 4 feet tall and weigh 80 pounds.
4–5 You are 4 feet tall and weigh 100 pounds.
6–8 You are 4 feet tall and weigh 120 pounds.
9–12 You are 5 feet tall and weigh 160 pounds.
13–15 You are 6 feet tall and weigh 180 pounds.
16–17 You are 6 feet tall and weigh 140 pounds.
18 You are 6 feet tall and weigh 200 pounds.
Hamadryad
Humanoid Appearance
3d6 Humanoid Appearance
3
You change little when you adopt a humanoid
form: your lower trunk splits into legs, two low
branches serve as arms, and an image of your face
appears somewhere on your trunk.
4–5
Your form is crude and lacks detail. Bark covers
your body.
6–8
You have a female form, and your skin appears to
be made from wood. Instead of hair, you have a
crown of branches sporting leaves.
9–12
Close inspection of your female form reveals you
are made from wood, though the grain is subtle.
Small branches rise from your head.
13–15
You appear human, with skin the color of the wood
from your tree, leaves for hair, and gleaming green
eyes.
16–17
You appear to be an attractive human female, with
smooth and supple skin and hair speckled with
leaves, twigs, and flowers.
18
You appear to be a beautiful human female of
flesh and blood. You show no signs of your true
nature other than having bright green hair.
Hamadryad Personality
3d6 Personality
3
You are a hateful, angry, and vengeful person, and
you view the world of mortals with disdain.
4–5
You resent the spread of humanity into the secret
places and consider humans accountable for the
present troubles darkening the world.
6–8
You distrust others and come off as standoffish
and suspicious.
9–12
You are curious about the world outside your forest
home, and you yearn to learn more about others.
13–15
You are pleasant and friendly. You try to find the
best in other people.
16–17
You are kind and generous, and you possess a
good heart. You try to help those in need.
18
You feel a deep connection to others and strive to
improve their lives in any way you can. You have a
good and noble soul.
Hamadryad Background
d20 Background
1
A wildfire swept through your wood, forcing you to
flee to avoid being destroyed in the blaze.
2
You helped a lost human find his or her way home and
found that you wanted to see more of the world.
3
You witnessed some terrible, horrifying act in your
forest home and fled from it. Gain 1d3 Insanity.
4
You murdered a band of woodcutters who came at
you with their axes. You made them suffer before
they died. Gain 1 Corruption.
5
You carried forth a seed from your tree form and
planted it in a distant land. You tended to the
sapling until it grew tall and strong.
6
You took a mortal for a lover and grieved as he or
she aged and died.
7
You grew up in one of the hidden kingdoms and
recently left to see the world beyond that magical realm.
8
A circle of druids protected you and worshiped you
as their goddess.
9
Foul cultists sacrificed a child in your presence. You vowed
that you would never let such a thing happen again.
10 You helped a faun threatened by an angry mob.
11
You left your home forest to escape a supernatural
blight that was killing all the trees.
12
A rampaging band of beastmen passed your way
before destroying a small nearby village. You went
to find survivors and found none.
13
You befriended a pair of halflings who wandered
into your grove and escorted them to safety, away
from the creatures hunting them.
14
A small child befriended you and taught you about the
wider world. When the child stopped coming to see
you, you went out to find what happened to him or her.
15
You heard the voice of Old Man Winter whispered
on the wind, telling of dark times ahead.
16
You traveled extensively. Add another language to
the list of languages you can speak.
18 Someone carved initials into your trunk.
19
You once danced with the faeries, who held a great
revel in your woods.
20
Someone buried a pouch near your roots. You dug
up the pouch and discovered it contained 2d6 cp.

9
```

### Hobgoblin

- **Entry Type:** Standard Ancestry
- **Source:** Terrible Beauty
- **Source Page:** 9
- **PDF Page:** 10

```text
Hobgoblin
When the fey go to war, they rely on the hobgoblins
to take up arms and lead the van. Made for battle,
hobgoblins are ever eager to wet their blades with the
blood of their enemies. The great fey created hobgoblins
from goblin stock, stripping them of their immortality.
They imbued what remained with might and courage,
to make them into obedient soldiers willing to die in the
defense of their lands and masters.
Same in Every Way: Identical to one another, all
hobgoblins have heavy, distended bellies that hang
like fleshy skirts over their thighs, spindly limbs, and
drooping facial features with heavy jowls. They all stand
exactly 5 feet, 4-1/2 inches tall and weigh 166 pounds no
matter how much or how little they eat. Each hobgoblin
has both male and female anatomy to make breeding
more efficient. Like goblins, hobgoblins are fecund, but
they never live for more than thirty-three years.
The Frenzy: Hobgoblins lose control in a fight,
becoming wild and violent killers. When they enter the
state known as “the frenzy,” they behave in odd ways and
undergo bizarre transformations. The change never lasts
long, and when they regain control, they revert to their
typical appearance and usual behavior.
Live to Serve: The highest ideal to which all
hobgoblins strive is to acquit themselves well in service
to their patrons, even if doing so means their death.
Hobgoblins venerate their patrons—the Faerie Queen,
the Goblin King, the Prince of Robins—almost as
gods and invoke their names when they are surprised,
angered, or amazed. Hobgoblins believe that their
people share one soul, so death holds no fear for them
so long as at least one hobgoblin lives.
Simple Ambitions: Hobgoblins were made to fight,
but battle does not occur frequently enough to hold
their attention. They spend their time between battles
drinking, fighting, and mating. Many hobgoblins
become quite skilled at making arms and armor, rivaling
dwarfs in their crafting
ability.
Common Names: A
hobgoblin’s full name
consists of three numbers.
The first number is the
sum of all the last numbers
of one’s grandparents.
The second is the sum of
the last numbers of one’s
parents. The third number
indicates one’s order of
birth within the family.
So, the second hobgoblin
born to the fourth and
fifth hobgoblins born
to the third, fifth, first,
and second
hobgoblins
would be
named 11-9-2.
Hobgoblins
typically refer
to each other
by the last
numbers of their
names, and some adopt
nicknames given to them by
their acquaintances.
Creating a
Hobgoblin
Starting Attribute
Scores Strength
11, Agility 10,
Intellect 9, Will 11.
These scores cannot
be adjusted during character creation.
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 1, Speed 10, Power 0
0 Damage, 1d3 Insanity, 0 Corruption
Languages and Professions You speak Elvish, and you
have the soldier profession.
Immune damage from disease; charmed, diseased
Iron Vulnerability You are impaired while you are in
contact with iron.
Shadowsight You see into areas obscured by shadows as if
those areas were lit.
Frenzy In combat, roll a d6 at the end of each round if you
are neither incapacitated nor subject to this trait. On a
6, you become frenzied for 1 minute. While frenzied, you
are immune to the frightened affliction, your attacks deal
1d6 extra damage, and all creatures that attack you make
their attack rolls with 1 boon.
Level 4 Expert Hobgoblin
Characteristics Health +5
You either learn one spell or gain Control Frenzy.
Control Frenzy While you are subject to your Frenzy trait,
you can use a triggered action on your turn to make a
Will challenge roll. On a success, the Frenzy effect ends
and you lose that trait for 1 minute.
dwarfs in their crafting
Common Names: A
hobgoblin’s full name
consists of three numbers.
The first number is the
sum of all the last numbers
of one’s grandparents.
The second is the sum of
the last numbers of one’s
parents. The third number
indicates one’s order of
birth within the family.
So, the second hobgoblin
born to the fourth and
fifth hobgoblins born
to the third, fifth, first,
numbers of their
names, and some adopt
nicknames given to them by
their acquaintances.
Creating a
Hobgoblin
Starting Attribute
Strength
11, Agility 10,
Intellect 9, Will 11.
These scores cannot
be adjusted during character creation.
equals your Intellect score + 1

Terrible Beauty
10
Hobgoblin Background
d20 Background
1 In a large, chaotic battle, you became separated
from your unit. You wandered off and became lost
in mortal lands.
2 Accused of cowardice, you left your homeland in
disgrace.
3 A spell whisked you from your homeland and
bound you to serve a mortal summoner. You
escaped the magical bonds when your summoner
died.
4 You spent the last 1d3 years hiding in the cellar
of a house owned by a human family. You often
crept up to watch the family members sleep.
5 A hag bound you to her service, compelling
you to steal children to feed to her ovens. You
escaped a few days ago, and you fear she might
find you and turn you into a toad.
6 You helped defend a faerie site from a rampaging
troll and bear the scars from that encounter with
pride.
7 You were a spy for the Lord of Hell in the realms
of faerie. You were discovered, but escaped
before your foes could kill you.
8 You were an elf’s henchman. You despised your
master.
9 You were a member of a small military unit in the
faerie realm.
10 You belonged to a company of hobgoblins
pledged to defend your hidden kingdom.
11 You were a sergeant in your military unit, leading
your team on forays against the enemies of the
hidden kingdoms.
12 You spent your early life protecting your
homeland but gave up that endeavor to explore
the mortal world.
13 You fled your homeland after you murdered an
elf. You have not been able to clean the faerie’s
blood from your hands.
14 You accompanied an elf out of Alfheim to combat
the growing darkness in the world. The elf might
be another character in the group, or someone
else from whom you have become separated.
15 Your homeland vanished, devoured by demons,
and you are the sole survivor.
16 You killed a human warrior in battle. You start the
game with a sword.
17 You befriended a young girl and served as her
protector. Now you wonder what became of her.
18 You lived with goblins for 1d3 years to learn
more about your people’s heritage. You left
disappointed with what you discovered.
19 You have mated with several hobgoblins, and you
have 1d6 children that you know about.
20 You spent many years as one of the Faerie
Queen’s guards. You left this service after
discovering some terrible secret.
Hobgoblin Age
3d6 Age
3 You are a small child, 3 years old or younger.
4–5 You are an adolescent, 4 to 8 years old.
6–8 You are a young adult, 9 to 12 years old.
9–12 You are an adult, 13 to 20 years old.
13–15 You are a mature adult, 21 to 24 years old.
16–17 You are an old adult, 25 to 29 years old.
18 You are a venerable adult, 30 to 33 years old.
Hobgoblin Frenzy Side Effect*
d20 Quirk
1 You scream and scream and scream some more.
2 You violently expel the contents of your guts from
your mouth and anus.
3 You shriek with horrible laughter.
4 Your facial features rearrange themselves.
5 You belch bubbles that emit stinking green
vapors when popped.
6 Rivers of sweat pour from your body.
7 Weird blue spots appear and move under your
skin all over your body.
8 You drop 1d6 small bricks from your rear that
land on the ground in your space the instant you
become frenzied.
9 You vomit on a randomly determined creature
within short range.
10 All closed objects within short range of you that
can be opened that are neither stuck nor locked
fly open.
11 Your breath steams.
12 Your eyes become as large as saucers and
bulge out from your face.
13 Your face collapses in on itself so that you have
a crooked crease running from the top of your
head down to your chin. You can perceive your
surroundings as normal.
14 You utter a stream of words in a language
you don’t know that sounds like nonsense to
everyone.
15 Steam whistles as it leaves your ears.
16 You reek of rancid ham.
17 Your hair stands on end.
18 Your jowls lengthen until they reach your chest.
19 You skip and dance while you move.
20 A ball of green flame appears and hangs over
your head. The flame is not hot and emits light as
a torch.
* The side effect applies while under the
effects of your Frenzy trait.
Terrible Beauty
10

Terrible Beauty
Terrible Beauty 11
Hobgoblin Personality
3d6 Personality
3 You hate everything. The only activity you like
more than watching things die is being the one to
kill them.
4–5 Something is wrong with you. You lack all sense
of duty and discipline, even when you’re not
under the influence of the frenzy. You bristle at
commands and smart off to your betters.
6–8 You are loyal to the faerie and consider mortals
to be nothing more than talking animals. You
tolerate them, at best.
9–12 You live to serve. You seek out a person of
authority to whom you can devote yourself. You
follow orders from this person, no matter how
despicable.
13–15 You take responsibility for your friends, and
you would die to protect them from harm.
16–17 You are in love with the Faerie Queen. You
know she will never reciprocate, but you hope
to one day make yourself worthy in her eyes.
Everything you do, you do for her.
18 Violence sickens you. You acquit yourself in
battle as needed, but when it’s over you must
spend a few moments being violently sick.
```

### Human — Only Human

- **Entry Type:** Ancestry Variant
- **Source:** Only Human
- **Source Page:** 5
- **PDF Page:** 5

```text
Human
Characters
Everything you need to make a human
character can be found in Shadow of
the Demon Lord. The rules in that book
help you create a character quickly and
with enough information to help you visualize and
portray the character in play. The following optional
rules are intended to give you more tools for building
varied human characters in order to reflect their natural
diversity and to help you individuate your character
from other humans in your group.
Creating a Human (Variant)
Choose an Attribute Scores option
Random Attribute Scores Strength 8 + 1d3, Agility 8 + 1d3,
Intellect 8 + 1d3, Will 8 + 1d3
Standard Attribute Scores Strength 10, Agility 10, Intellect 10,
Will 10. Increase one attribute by 1.
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1/2 or 1, Speed 10, Power 0
Languages and Professions You speak the Common Tongue.
You might gain additional languages and professions from
the Human Development tables.
Relations
As the dominant people on the continent,
humans tend to see the lands as theirs, an
outlook that occasionally causes friction
Humans generally fear
changelings. Not only could anyone be a
changeling in disguise, but the people
represent human vulnerability to
placing a piece of iron
in the other’s hand, to
determine if they’re human.
They’re an enigma to most
humans, and most consider them oddities,
wonders, tragic figures, or even terrifying
monstrosities. In most lands, clockworks
tend to be second-class citizens, finding
places as servants to the ones who made
them. The few who find freedom must
depend on the mercy of others to keep
Although humans and dwarfs
have clashed at times over the centuries,
they generally enjoy an uneasy peace.
Humans value their skill at working metal
and stone, but balk at their high prices and
what many see as arrogance. Dwarfs tend
to be stubborn, which humans might
find frustrating when they would gain
As with changelings, fauns
evoke fear and wonder in humans, fear because they
represent the power of the faerie, and wonder at the
Some humans have yet to
acknowledge orcs are a
free people and treat
them as if they were
still servants, an error
that almost always ends
in tragedy.
Elementals:
have little knowledge of the elemental
peoples—salamanders and gnomes, so
when they encounter them, they find them
strange and curious. Salamanders tend to
find fear and suspicion when they travel in
human lands, while gnomes can usually
pass themselves off as small humans,
goblins, or halflings to avoid drawing
attention to themselves.
Faeries: Attitudes toward faeries
depend a great deal on where the humans
live. In urban centers, faeries are rare
enough for some people to doubt their
existence. In the countryside, people
know better, and if they’re wise, they
show the faeries respect lest they anger
them. A mixture of fascination and
fear drives many interactions with the
faeries, since they are exotic and have
an odd manner, but they are also wildly
unpredictable and dangerous.
Human
Characters
Everything you need to make a human
character can be found in
the Demon Lord. The rules in that book
help you create a character quickly and
thrown off their chains, leading many to fret about the
repercussions their poor treatment is bound to bring.
Level 4 Human Expert
Characteristics Health +5
You discover a tradition, learn one spell from a tradition you
have already discovered, or gain the Determined talent,
which is described below.
Determined When you roll a 1 on the die from a boon, you
can reroll the die and use the new number.
Human Development Tables
Whether or not you use the variant human described
above, you can use the following tables in place of
those presented in Shadow of the Demon Lord to create
a more detailed background for your character. If you
do, you do not roll for random starting professions or
starting wealth as normal, and instead use all the tables
presented here. You must roll dice for each table and
take the result rolled.
Family Tables
The family tables define from whom your character
came.
Ancestors
3d6 Ancestors
3 Your ancestors were villains of the worst sort,
and their actions left a stain on your family’s
reputation. Most people know your family to
be villains.
4–5 Your family includes several disreputable
characters whose deeds have sullied your family’s
reputation throughout the province or city in
which you live.
6–8 At least one recent ancestor was a criminal
or did something shameful that’s known in
your community.
9–12 Your ancestors were ordinary and
unexceptional people.
13–15 At least one recent ancestor is known for
some great deed, discovery, or achievement.
16–17 Your family is well known throughout the
province or city in which you live for great
deeds and accomplishments.
18 Your ancestors include one of the greatest
people to have lived, ensuring your family
name is enshrined in the annals of history.
Family Circumstances
3d6 Family Circumstances
3 You were orphaned and have no memory of your
family. You have a –6 penalty to your roll on the
Childhood table.
4–5 You were born to a destitute family. You have a
–3 penalty to your roll on the Childhood table.
6–8 You were born to a poor family. You have a
–1 penalty to your roll on the Childhood table.
To determine your family’s profession, roll on
the Common, Criminal, Military, or Wilderness
Profession table.
9–12 Your family was getting by. To determine your
family’s profession, roll on the Common, Military,
Religious, or Wilderness table.
13–15 You were born to a comfortable family. You have
a +1 bonus to your roll on the Childhood table.
To determine your family’s profession, roll on the
Common, Military, Religious, or Wilderness table.
16–17 You were born to a wealthy family. You have a
+3 bonus to your roll on the Childhood table.
To determine your family’s profession, roll on the
Common, Military, Religious, or Wilderness table.
18 You were born to a rich family. You have a +6
bonus to your roll on the Childhood table. You
might come from a noble family, a crime family,
a religious leader, or a powerful user of magic.
Parents
3d6 Parents
3–4 Your parents are dead*. Unless you were
an orphan, a relative or friend of the family
raised you.
5–8 Your father is dead*.
9–12 Your parents are alive.
13–16 Your mother is dead*.
17–18 You do not know the fate of your parents. You
might have been kidnapped and raised by your
captors, ran away from home, or your parents
might have disappeared.
*Use the Circumstances of Death table to determine the
cause of death
Siblings*
d20 Siblings
1–4 You were an only child.
5–8 You have one sibling.
9–12 You have 1d3 + 1 siblings.
13–16 You have 1d6 + 2 siblings.
17–20 You have 2d6 siblings.
*For each sibling, roll on the Character Fate table.
Sibling GenderS
d6 Gender
1–3 Female
4–6 Male
Sibling AgeS
4d6 Age
4 Identical or fraternal
twin or triplet
5–14 Older
15–24 Younger
Character FateS
3d6 Fate
3 Insane
4–5 Unknown
6–8 Dead*
9–12 Alive**
13–15 Alive but disgraced**
16–17 Alive and well-regarded**
18 Alive and famous**
*Use the Circumstances of Death table to determine the
cause of death
**You can use some or all of the other tables to add detail
to your siblings.
Circumstances of Death
3d6 Circumstance
3 Murder
4–5 Accident unrelated to profession
6–8 Disease or famine
9–12 Natural causes
13–15 War
16–17 Accident related to profession
18 Suicide
Appearance Tables
Use the following tables to determine your character’s
appearance. You can decide your gender, skin, hair, and
eye color as none of these things matter.
AgeS
3d6 Age
3 You start the game as a child, no more than
11 years old. You are Size 1/2. Halve your height
and weight. Roll once on the Childhood table.
4–5 You start the game as an adolescent, from 12 to
17 years old. Reduce your height and weight by
25%. Roll once on the Childhood table and Life
Experience tables.
6–8 You start the game as a young adult, from 18 to 25
years old. Roll once on the Childhood table
and twice on the Life Experience table.
9–12 You start the game as an adult, from 26 to 35
years old. Roll once on the Childhood table and
three times on the Life Experience table.
13–15 You start the game as a middle-aged adult, from
36 to 55 years old. Roll once on the Childhood
table and four times on the Life Experience table.
16–17 You start the game as an older adult, from 56 to
75 years old. Roll once on the Childhood table
and five times on the Life Experience table.
18 You start the game as a venerable adult, 76 years
old or older. Roll once on the Childhood table and
six times on the Life Experience table.
BuildS*
3d6 Build
3 Reduce your height by 4d6 inches and your
weight by 2 pounds per inch. Reduce your Size
to 1/2 if you are not Size 1/2 already.
4–5 Reduce your height by 3d6 inches and your
weight by 1 pound per inch.
6–8 Reduce your weight by 4d6 pounds.
9–12 You are of average height and weight.
13–15 Increase your weight by 4d6 pounds.
16–17 Increase your height by 3d6 inches and your
weight by 1 pound per inch.
18 Increase your height by 4d6 inches and your
weight by 2 pounds per inch.
*The Build table modifies your starting height and weight.
If you’re male, your starting height is 70 inches and starting
weight is 160 pounds. If female, your starting height is
63 inches and weight is 120 pounds.
AppearanceS
3d6 Appearance
3 You are hideous. You look like a monster. Children
often cry when they see you, the weak of heart
might faint, and at least one person has vomited
after seeing you.
4–5 You are ugly. You have some characteristic that
makes you unseemly—a wen, beetling brows,
boils, a wandering eye, extensive scarring.
6–8 You are homely.
9–12 You are neither attractive nor unattractive.
13–15 You are attractive.
16–17 You are comely. Your appearance is exceptional,
and you are considered a great beauty.
18 You are beautiful. Heads turn to follow you
wherever you go. People might become
infatuated with you, stumbling over their words
and feeling flustered when you show them
attention.
Background Tables
The following tables help you determine your
character’s background and what, if any, significant
events happened to you before the game begins. You
start by rolling on the Childhood table and then roll
on the Life Experience table a number of times as
determined by your Age. The Life Experience table
might direct you to roll on another table to discover
what happened to you.
ChildhoodS
3d6 Childhood
3 or less You were kidnapped by faeries but you
managed to escape after some time. You
know how to speak the Common Tongue
and Elvish.
4–5 You ran away from home and were forced to
make your own way in the world. You know
how to speak the Common Tongue. You also
gain a common or criminal profession.
6–8 You helped in the family business. Add your
family’s profession to your list of professions.
If you were an orphan, you gain a common or
criminal profession.
9–12 You were apprenticed to an artisan.
Add an artisan of your choice to your
list of professions.
13–15 You received an education. You can speak,
read, and write the Common Tongue.
Add your family’s profession to your list
of professions.
16–17 You received a good education. You can
speak, read, and write the Common Tongue
and High Archaic. Roll on the Areas of
Scholarship table.
18 or more You attended one of the finest educational
institutions. You can speak, read, and write
the Common Tongue and High Archaic. Roll
on the Areas of Scholarship table. You can
also add one of the following professions:
artist (painter, poet, writer) or musician
(percussion, stringed, or wind).
Life ExperienceS
3d6 Experience
3 You Died! Roll on the Circumstances of Death
table to find out how. You can either start over or
be returned to life by some stroke of luck. If you
return to life, you start the game with 1d6 Insanity.
Or, if you’re using Tombs of the Desolation, you
can play a revenant or vampire.
4–5 Roll a d20 and find the result on the Major
Setback table.
6–8 Roll a d20 and find the result on the Minor
Setback table.
9–12 You Worked! Choose one of your professions.
You worked in your profession and saved a little
coin. Gain a +1 bonus to your Starting Lifestyle
roll.
13–15 Roll a d20 and find the result on the Minor
Windfall table.
16–17 Roll a d20 and find the result on the Major
Windfall table.
18 Roll a d20 and find the result on the Strange
table.
Major SetbackS
d20 Major Setback
1 You did something unspeakable, an act
that has forever after stained your soul. Gain
1d6 Corruption.
2 You did things you regret. Gain 1 Corruption.
3 Raiders, monsters, or a natural disaster destroyed
your hometown. You lived as a refugee for a time
until you finally settled elsewhere.
4 You became possessed by a demon. Gain
1 Corruption. Either an exorcist cast out the
demon or, if you have Demon Lord’s Companion,
you can start with the Possessed story
complication.
5 Your work failed as a result of your poor choices.
Take a –3 penalty to your Starting Lifestyle roll.
6 You caught a terrible disease that left you scarred.
Reduce your Appearance by two steps (minimum
hideous). If you have Demon Lord’s Companion,
you can add the Plagued story complication.
7 You spent 2d6 years in prison for a crime you
committed (gain 1 Corruption) or you didn’t
commit (gain 1d3 Insanity). Add the years spent
to your starting age.
8 You lost everything to a natural disaster or war.
Take a –3 penalty to your Starting Lifestyle roll.
9 You suffered a terrible injury that took an eye,
ear, 1d3 fingers, or even a hand. Reduce your
Appearance by one step (minimum hideous). If
you have Demon Lord’s Companion, you can add
the Maimed story complication.
10 A foul creature laid a curse on you, ruining
friendships, ending your marriage if you were
married, and causing terrible hardship. Take a
–1 penalty to your Starting Lifestyle roll. If you
have Demon Lord’s Companion, you can add the
Cursed story complication.
11 Someone close to you died: spouse, child, or
close friend.
12 You were press-ganged. You might have fought
as a peasant conscript, pulled an oar on a jotun
longship, or been forced to work as a sailor on a
pirate ship. Add soldier, sailor, or pirate to your
list of professions.
13 Your community drove you out and you lived as
an exile for 2d6 years of your life.
14 You once saw a demon. Gain 1d3 Insanity.
15 Slavers descended on your community, and you
were rounded up with many others. You lived for
1d6 years of your life as a slave, but you managed
to escape.
16 Hardship, grief, and suffering drove you mad.
Start the game with 1d6 + 1 Insanity, and if you
have the Demon Lord’s Companion, you can add
the Mad story complication.
17 A witch hunter or inquisitor accused you of
trafficking with dark forces. You were imprisoned,
tortured, and forced to confess. Somehow you
escaped the pyre, and you’ve been on the run
ever since. Reduce your Appearance by one step
(minimum hideous).
18 You caused the death of a loved one, either by
intent or accident.
19 You desecrated a holy site by intent or accident.
Choose a religion to which the site was holy. You
always feel uncomfortable around places and
symbols associated with that faith.
20 You made a dangerous enemy, one who actively
seeks your harm. Work with the GM to create a
suitable nemesis.
Minor SetbackS
d20 Minor Setback
1 You encountered a monster. It ate someone you
knew, but you managed to escape.
2 You contracted a disease, but you got better.
3 You lost an ear, a couple of teeth, or a finger. Or,
you might have a few ugly scars.
4 You suffered financial trouble. Take a –1 penalty
on your Starting Lifestyle roll.
5 A romance or relationship ended badly. You still
pine for the person.
6 People in your hometown dislike you. You were
accused of doing something that brought shame
to yourself, your family, and, possibly, your
community.
7 You saw something horrible and the experience
affected you. Gain 1 Insanity.
8 An argument estranged you from your family. You
haven’t spoken to them since.
9 Someone tried to kill you. You survived, but they
might try again.
10 You lost something valuable to you. Take a
–1 penalty on your Starting Lifestyle roll.
11 You became addicted to drink or an inexpensive
drug. If you have the Demon Lord’s Companion,
you can add the Addicted story complication.
12 You stole something from someone who needed
it, hurt someone innocent, or did some other bad
thing. Gain 1 Corruption.
13 You lost a life-long friend. Roll a d6. On an odd
number, it was your fault. On an even number,
it was his or her fault.
14 You learned a dangerous secret. Work with
the GM to come up with just what exactly
you learned.
15 You have no memory of what happened for
1d6 years of your life.
16 Someone you loved became injured because
of you.
17 Circumstances forced you to leave your
hometown and begin life anew somewhere else.
18 A sibling, parent, child, or spouse disappeared.
19 Brigands, orcs, beastmen, or something else
swept through your community causing
extensive damage. Take a –1 penalty to your
Starting Lifestyle roll.
20 You experienced a string of disappointments,
failures, and defeats, all of which left you bitter
and cynical about life.
Minor WindfallS
d20 Minor Windfall
1 You fell in love or you got married! Work with
your GM to create your love interest.
2 You started a business related to your profession.
Gain a +1 bonus on your Starting Lifestyle roll.
3 You had 1d3 children. They might be legitimate or
illegitimate as you decide. When you finish rolling
for your Life Experiences, you can roll on the
Character Fate table to determine what happened
to them.
4 You traveled extensively. Add one language to
the list of languages you can speak.
5 You made the acquaintance of someone
important. Choose Influence, Information, or
Security. This character can provide the benefit to
you once (see Connections in Shadow, page 207).
Work with the GM to define this character.
6 You got an education or furthered your education.
Choose one: Add a language to the list of
languages you can speak or gain a random area of
scholarship.
7 You inherited money from a relative or friend.
Gain a +1 bonus to your Starting Lifestyle roll.
8 You have a horse!
9 You took up a new field of work. Add one random
Common Profession to your list of professions.
10 You gain an additional Interesting Thing.
11 You exposed a foul conspiracy in your community.
You make attack rolls in social situations against
members of your community with 1 boon.
12 You saved the town from destruction and are now
considered a hero. You never have to pay for food
or drink while you’re in this town.
13 You found a healing potion.
14 You escaped nearly certain death. You start the
game with Fortune.
15 You found, or someone gave you, a weapon or an
implement of the GM’s choice.
16 You found, or someone gave you, a suit of soft
leather armor.
17 You made a lifelong friend (as commoner) who
will accompany you on your adventures and
help you.
18 You organized and led members of your
community to accomplish something of
consequence. As a result, you are well-regarded
by your neighbors. Add Entertainer (Orator) to
your list of professions if you don’t have it already.
19 You fought in a war and acquitted yourself
heroically. You got a medal worth 1 ss for
your service, and you add Soldier to your list
of starting professions.
20 You saved someone’s life, and this person is
forever in your debt. This character is friendly to
you and will always help you. Work with your GM
to determine the identity of this character and
the circumstances of your help.
Major WindfallS
d20 Major Windfall
1 You did a service for a faerie lord or lady. If you
have Terrible Beauty, you gain a random favor
(Terrible, page 36). If you don’t, you instead gain
an enchanted object of the GM’s choice.
2 You stumbled onto magical knowledge. You
discover one tradition of the GM’s choice.
3 You made an important connection. Work
with the GM to determine the identity of the
connection and the kind of aid the character can
give you—influence, information, or security (see
Connections in Shadow, page 207)
4 Great success in business grants you a +3 bonus
to your Starting Lifestyle roll.
5 You uncovered an enchanted object of the
GM’s choice.
6 You have a small house in town or a farm in the
wilderness. Work with the GM to determine the
location of your property and assets that come
with it.
7 You have the deed to a sailing ship, which you
can find at the nearest port.
8 You gain the deed to lands at a place of the
GM’s choosing.
9 You found a book of spells containing 1d3 + 1
rank 0 incantations.
10 You found a case containing 1d3 + 1 potions of
the GM’s choice.
11 A god spoke to you in your dreams, bestowing
favor onto you. You can invoke the favor
whenever you make an attack roll or challenge roll
to make the roll with 1 boon. Once you use it, roll a
d6. On an odd number, you lose favor forever.
12 You make a friend of a powerful individual—a
noble, high priest, wizard, or someone else. The
GM determines the identity of this friend and the
benefits such a friendship entails.
13 You found a chest filled with coin! Gain a
+3 bonus to your Starting Lifestyle roll.
14 A soldier owes you his or her life. The character
(as mercenary) accompanies you on your
adventures and serves until death. Work out
the details of the relationship with the GM.
15 You gain a stipend from a relative, friend, or
from some other source that pays for a wealthy
lifestyle. If you want to pay for a rich lifestyle,
reduce the price by 1 gc.
16 You gain a suit of armor or weapon of
your choice.
17 You have a small construct that serves you loyally
and obeys your spoken commands.
18 You are famous. People throughout the lands
in which the game begins know your name and
identify you by sight. Work out with the GM how
you gained such acclaim.
19 You helped save your town from monsters. You
are a hero to your neighbors, and you never
have to pay for food, drink, clothes, or lodgings
whenever you’re there. As well, you received a
token of the community’s appreciation worth 1 gc.
20 You received a warning about the future from
a spirit, god, or something else. You can escape
death once.
Strange EventS
d20 Strange Event
1 You spent 1d20 years living among the faerie.
When you escaped, you found no time had
passed in the mortal world, though you add
the years spent to your starting age. Note
the changes to your Size, height, and weight
if you stop being a child or adolescent as a
result. Add Elvish to the list of languages you
can speak.
2 You drank a potion that permanently
changed your skin color blue, purple, green,
bright orange, or something else.
3 You were transformed into an animal of the
GM’s choice. You only recently returned to
your normal form and now exhibit physical
traits and mannerisms of the animal whose
form you once assumed.
4 You found a strange tome filled with
obscene knowledge. Add the Occult as
an area of scholarship.
5 You had a religious epiphany and became a
fanatical believer in your religion. The first
time you make a fate roll, you can roll twice
and use either result.
6 A devil visited you. Roll a d6. On a 1, you
became seduced by the devil. Gain the
Shadowsight trait and 1d3 Corruption. On
a 2–5, you resisted the temptation and
drove the devil off. On a 6, you resisted the
temptation, but the devil haunts you still.
7 You discovered an old clockwork and turned
its key. The clockwork might be friendly to
you or not, as the GM decides.
8 You gained the attention of a spirit that
haunts you still. If you have Demon Lord’s
Companion, you can add the Haunted story
complication.
9 You were poisoned, but survived the
experience. You have stomach problems, and
your bowel movements are noisy and messy.
10 Being struck by lightning left you with a weird
scar. You also experience strange dreams.
11 You learned the location of a borderland to a
hidden kingdom. You haven’t crossed it yet,
but the things you witnessed there gave you
1d3 Insanity.
12 Once, strange beings captured you and
performed weird experiments on you.
After some time, you don’t know how
long, you were returned with 1d6 weird
scars on your body.
13 You died but someone raised you from
the dead. Gain 1d3 Insanity.
14 A demon killed everyone in your immediate
family. You were the lone survivor thanks to
your having found a suitable hiding place.
You watched as your family members were
torn apart. Gain 1 Corruption and 1d3 Insanity.
15 You were swallowed by a giant fish and lived
inside it for 1d6 years before you escaped
in its vomit. You were not alone inside the
fish and might have made friends with other
prisoners. Note the changes to your Size,
height, and weight if you stop being a child or
adolescent as a result.
16 You once laid eyes on Hell. Roll a d6. On a 1,
you became enamored by what you saw and
switched your religion to the Devil. On a 2–5,
you gain an amount of Insanity equal to the
number rolled. On a 6, you shrugged it off as
if it was nothing special.
17 You remember 1d3 previous lives.
Randomly determine a profession for
each life you remember, and add it to
your list of professions.
18 You were raised by dwarfs. You can speak,
read, and write Dwarfish.
19 You were bitten by a skinchanger. If you
have Tooth and Claw, apply skinchanger
to your character. If not, roll again, ignoring
this result.
20 A merrow (Terrible Beauty, page 46) seduced
you and lured you to spend one year under
the waves. Roll a d6. On a 1, you were horribly
mistreated and gain 1 Insanity. On a 2–5, you
remember nothing of your time among the
merrow only that one day you woke on a
beach. On a 6, you saw many wonders in the
depths and befriended the merrow.
Human Profession Tables
Use the following tables instead of those
in Shadow of the Demon Lord to randomly
determine your starting professions as directed
by the previous tables. Your profession also
adds an item to your list of starting equipment.
Random Professions
d6 Profession
1 Roll on the Scholar: Area of Scholarship table
2 Roll on the Common Profession table
3 Roll on the Criminal Profession table
4 Roll on the Military Profession table
5 Roll on the Religious Profession table
6 Roll on the Wilderness Profession table
torn apart. Gain 1 Corruption and 1d3 Insanity.
height, and weight if you stop being a child or
page 46) seduced
the waves. Roll a d6. On a 1, you were horribly
Scholar: AreaS of Scholarship*
d20 Area of Scholarship
1–2 Architecture and engineering
3–4 Etiquette, heraldry, law, and politics
5–6 Astronomy and navigation
7–8 Imperial history and geography
9–10 Pre-imperial history and geography
11–12 Literature, philosophy, poetry, theology,
and the arts
13–14 Medicine and surgery
15–16 Natural sciences
17–18 Military sciences
19–20 Magical theory
*Add 1 book covering topics related to your area of
scholarship to your starting equipment
Common Professions
d20 Profession
1 Apothecary or healer. You start with a healer’s kit.
2 Artisan such as baker, blacksmith, bookbinder,
brewer, carpenter, chandler, cobbler, gem cutter,
jeweler, leatherworker, mason, potter, printer,
scribe, or tailor. You start with a tool kit.
3 Artist such as painter or sculptor. If you’re literate,
you can choose writer or poet. You start with a
tool kit or writing kit.
4 Bartender or shopkeeper. You start with 1d6 cp.
5 Beggar or urchin. You start with a begging
bowl or cap.
6 Boatman, ferryman. You start with a rowboat.
7 Conscript. You start with a uniform.
8 Cook, groom, scullion, or servant. You start with
an extra set of clothing.
9 Courtesan, prostitute, or camp follower. You start
with a cosmetics kit.
10 Drover or herder. You start with a staff.
11 Entertainer such as actor, athlete, comedian,
dancer, orator, puppeteer, singer, or storyteller.
You start with a costume, dress, or fine clothing as
appropriate for your profession.
12 Farmer. You start with a hoe, shovel, or rake.
13 Fisher or whaler. You start with a fishing pole and
tackle box, or a harpoon.
14 Gambler. You start with a pair of dice or deck
of cards.
15 Laborer such as porter, grave digger, or
stevedore. You start with a backpack, shovel,
coil of rope, or something else chosen by the GM
that’s appropriate to your profession.
16 Merchant. You start the game with raw goods
such as textiles, grains, or something else worth
1d6 ss.
17 Miner or prospector. You start with a pick.
18 Musician using percussion, stringed, or wind
instruments. You start with a musical instrument.
19 Pilot, sailor, or teamster. You start with 1d6 cp.
20 Trade such as dyer, tanner, or butcher. You start
with 2d6 bits.
Criminal ProfessionS
d20 Profession
1–2 Agitator, rebel, saboteur, or terrorist. You start
with 1d6 pamphlets related to the cause for which
you fight.
3–4 Bandit, pirate, or raider. You start with a bottle of
rotgut and a wanted poster showing your face.
5–6 Burglar or grave robber. You start with a set of
lock picks.
7–8 Charlatan, confidence artist, informant, or spy.
You start with a disguise kit.
9–10 Fence or smuggler. You start with 1d6 cp.
11–12 Forger. You start with a tool kit.
13–14 Mugger or thug. You start with 1d6 bits.
15–16 Murderer. You start with a garrote.
17–18 Pickpocket. You start with a stolen purse
containing 1d6 cp.
19–20 Poacher or rustler. You start with a coil of rope.
Military ProfessionS
d20 Profession
1–2 Constable or detective. You start with a lantern
and flask of oil.
3–4 Conscript or militiaman. You start with a spear
and uniform.
5–6 Guard or henchman. You start with a club
and uniform.
7–8 Jailer or torturer. You start with a pair of manacles
or torturer’s tools.
9–10 Marine. You start with a sword.
11–12 Mercenary. You start with a sword and a contract
for your last job.
13–14 Officer. You start with a fancy uniform and sword.
15–16 Patroller. You start with a lantern and flask of oil.
17–18 Soldier. You start with a uniform, small shield,
and sword.
19–20 Squire. You start with a short sword and suit of
soft leather armor.
Religious ProfessionS*
d6 Profession
1 Anchorite, flagellant, fanatic
2 Evangelist or street preacher
3 Acolyte, devotee, or initiate
4 Militant such as a crusader. You start with a mace.
5 Minister of a small temple
6 Minister of a large temple
*Your profession is usually associated with your religion. As
well, you start with a symbol of your faith.
Wilderness ProfessionS
d20 Profession
1–2 Animal trainer. You start with a small animal that’s
friendly to you.
3–4 Apothecary or healer. You start with a healer’s kit.
5–6 Drover or herder. You start with a staff.
7–8 Guide or pioneer. You start with a map of
the region.
9–10 Hermit. You start with a week of rations and
a waterskin.
11–12 Hunter or gatherer. You start with a bow and
12 arrows.
13–14 Nomad. You start with a horse.
15–16 Spelunker. You start with a lantern, pick, and
2 flasks of oil.
17–18 Tracker. You start with a spear.
19–20 Woodcutter. You start with an axe.
Starting Equipment
All human characters start the game with the equipment
based on their starting lifestyle and their profession or
professions. To determine your starting lifestyle, roll 3d6
and add to the total of the roll the bonuses and penalties
gained from your Life Experience rolls. Find the total
on the Starting Lifestyle table (Lifestyles are described
in Shadow, page 100). In addition to the equipment, your
character starts the game with one Interesting Thing
(Shadow, page 26).
Starting LifestyleS
3d6 Lifestyle
3 or less Destitute
4–5 Poor
6–12 Getting By
13–15 Comfortable
16–17 Wealthy
18 or more Rich
Clothing
Lifestyle Clothing
Destitute Soiled rags and a blanket
Poor Patched, threadbare basic clothing and a
ratty cloak
Getting By Basic clothing and a cloak
Comfortable 1d3 sets of well-made basic clothing and
a fine cloak
Wealthy 1d3 sets of well-made basic clothing, a
set of noble’s clothing, and a fine cloak
Rich 1d3 sets of noble’s clothing and a
fine cloak
Weapons
Lifestyle Weapons
Destitute You have a club or a sling with 20 stones.
Poor You have a staff, club, or a sling with
20 stones.
Getting By You have a dagger. You also have a staff,
club, or sling with 20 stones.
Comfortable You have a dagger. You also have a staff,
club, or sling with 20 stones.
Wealthy You have a dagger
Rich You have a dagger.
Personal Gear
Lifestyle Personal Gear
Destitute —
Poor A sack, a loaf of bread, a waterskin filled
with water, a tinderbox, and a candle.
Getting By A backpack, a week of rations, a waterskin
filled with water, coil of rope, a tinderbox,
and 2 torches.
Comfortable A backpack, a week of rations, a waterskin
filled with water, coil of rope, a tinderbox,
and 2 torches.
Wealthy A backpack, a week of rations, a waterskin
filled with water, coil of rope, a tinderbox,
lantern, and 2 flasks of oil.
Rich —
Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting By —
Comfortable A healing potion plus one of the following:
a scroll containing an incantation of one
rank 0 spell, a small shield, a healer’s kit, a
tool kit, or a writing kit.
Wealthy A healing potion plus one of the following:
a scroll containing an incantation of one
rank 0 spell, a small shield, a healer’s kit, a
tool kit, or a writing kit.
Rich A healing potion, a personal servant (as
commoner), a guard (as mercenary), and
three horses with bits, bridles, and saddles.
Wealth
Lifestyle Wealth
Destitute 1d6 bits
Poor 2d6 bits
Getting By 1d6 cp
Comfortable 2d6 cp
Wealthy 1d6 ss
Rich 2d6 ss
Personality Tables
Use the following tables to help define your character’s
personality. The results should guide how you play your
character in the game.
PersonalitIES
3d6
Personality
3
You lack social skills. You are inept at conversing
with others, criticizing when you would
complement, insulting when you would befriend.
People loathe you.
4–5
You are unpleasant and a chore to be around.
People fi nd it easy to dislike you.
6–8
You are quiet and withdrawn. You are most
comfortable when you’re alone and become
uncomfortable in large crowds.
9–12
You are not particularly outgoing or withdrawn.
You can adapt to a variety of social situations.
13–15
You are friendly and personable. You make friends
easily when you try.
16–17
You are loud and boisterous. You are most
comfortable when you are the center of attention.
You energize people with your enthusiasm,
though some fi nd you overbearing.
18
You possess incredible charisma and fi nd yourself
commanding just about any room you enter.
Personable and magnetic, people want to be
your friend.
Relationships
3d6
Relationships
3
People are objects to be used and discarded.
4–5
You distrust other people and fi nd yourself
questioning their motives.
6–8
You only value your friends and family but
dislike others.
9–12
You get on well with people close to you and are
neutral about others.
13–15
You value your friends and family strongly and
get along with others.
16–17
You try to see the best in everyone you meet and
work to maintain and build new relationships.
18
All people are important and everyone has value
no matter what they have done.
FearS
DesireS
1d6
Fear
1d6
Value
1
Disgrace
1
Status
2
Failure
2
Fame
3
Death
3
Wealth
4
Isolation
4
Glory
5
Judgment
5
Love
6
Anonymity
6
Redemption
Obligations
3d6
Obligations
3
Your word is worthless. You break oaths, vows,
and laws whenever it suits you.
4–5
You disdain authority and obligation. You
grudgingly do as you say and frequently break
the law.
6–8
You obey the law and keep up your oaths when it
suits you.
9–12
You try to do what you say you will do, but you
don’t always succeed.
13–15
You value law and order and try to live up to
your obligations.
16–17
You almost never break an oath or violate the law.
Doing so is a serious breach of character.
18
You never break oaths or the law. Order is a
paramount concern for you, and you always live
up to your obligations no matter the cost.
Morality
3d6
Morality
3
You are vile, loathsome, and reprehensible. Your
sordid desires motivate you, and you do anything,
no matter how foul, to feed them.
4–5
You look after yourself fi rst and often do
questionable things to further your interests.
6–8
You are a pragmatist and do what you feel needs
to be done, even if such an act would cause
others harm.
9–12
You are capable of good and evil, though you
mostly see to your self interests and those of
people close to you.
13–15
You try to do good in most things, though you
occasionally slip up and do something you know
to be wrong.
16–17
You strive to do right in all things, to consider
others, to obey the laws, and to leave the world
better than how you found it.
18
You are a paragon of virtue. An evil thought has
never entered your head, and you make every
effort to do good works.
Religious Beliefs
3d6
Religion
3
You belong to a heretical sect, worship the Devil,
or belong to a cult of the Demon Lord.
4–5
You belong to a minor religion centered on a
small god.
6–8
You follow tenets of Witchcraft.
9–12
You belong to the cult of the New God.
13–15
You follow the teachings of the Old Faith.
16–17
You have no religious beliefs.
18
You follow the Dark Gods of the jotun (see
Uncertain Faith).
Piety
3d6
Piety
3
You only pretend to have your religious beliefs.
You instead believe in something else. Roll on the
Religious Beliefs table, and then roll on this table
again. Each time you gain this result after the fi rst,
gain 1 Insanity.
4–5
You are a believer in name only and have strong
doubts about your faith.
6–8
You are skeptical about your faith.
9–12
Your religious beliefs are neither strong nor weak.
13–15
You are fairly certain about your beliefs.
16–17
You have strong religious convictions.
18
You are a fanatic about your religious beliefs to
the point you fi nd it hard to be around people
who hold differing religious views. You might even
persecute people who do not believe as you do.
Gain 1 Insanity.
```

### Human — Shadow of the Demon Lord Core

- **Entry Type:** Standard Ancestry
- **Source:** Shadow of the Demon Lord Core
- **Source Page:** 11
- **PDF Page:** 12

```text
Human
Determination, resourcefulness, and sheer numbers helped
humanity rise from its humble, primitive origins to become
the most widespread and numerous people in the world.
Few places have escaped human expansion, and settlements
exist in mountains and swamps, desolate wastes and verdant
plains. Human civilization has defined the last thousand
years of history and continues even as the shadow falls.
Many Variations: Humans comprise many different ethnic
groups. Skin tones can range from almost black to albino
white, or green, blue, orange, pink, or something else. Some
humans have patterned skin, stripes, thick body hair, or no
hair at all. Humans also have many different shapes and
sizes. They range from 3 to 7 feet tall and weigh from 50 to 500
pounds or more. Most humans live about seventy years.
Strength in Numbers: Community plays a strong role
in human civilization. People are stronger when they
work together than when they work alone. The resulting
tribalism has been a source of strength and a great asset in
human expansion, but it has also been a source of conflict
that erupts into violence between rival groups.
Diverse Natures: Noble or crude, virtuous or wicked,
courageous or craven, greedy or selfless—most humans fall
somewhere between these extremes and behave in a way that
looks after their interests and those of their loved ones.
11

Character Creation
1
Religious Inclinations: Few humans question the gods’
existence, and many find their life’s meaning in worshiping
one or more gods. In the Northern Reach, humans might
belong to the Cult of the New God, follow the tenets of the
Old Faith, or practice witchcraft. See Chapter 8 for details
on religions.
Common Names: Aengus, Agnes, Aine, Alice, Anselm,
Beatrice, Breandan, Caitlin, Cormac, Ella, Fiona, Geoffrey,
Giselle, Henry, Joan, John, Kane, Kiera, Margery, Richard,
Roisin, Rordan, Saraid, Seamus, Walter, and Yvonne.
Creating A Human
Starting Attribute Scores Strength 10, Agility 10, Intellect
10, Will 10. Choose one attribute and increase it by 1.
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 1/2 or 1, Speed 10, Power 0
Damage 0, Insanity 0, Corruption 0
Languages and Professions You speak the Common
Tongue, and you can either speak one additional
language or add a random profession.
Level 4 Expert Human
Characteristics Health +5
You either learn one spell or gain Determined.
Determined When you roll a 1 on the die from a boon, you
can reroll the die and choose to use the new number.
Human Background
d20 Background
1
You died and returned to life. You start the game
with 1d6 Insanity.
2
You were briefly possessed by a demon. You start
the game with 1 Corruption.
3 You spent 1d6 years as a prisoner in a dungeon.
4
You murdered someone in cold blood. You start
the game with 1 Corruption.
5 You caught and recovered from a terrible disease.
6
You belonged to a strange cult and saw many
strange things. You start the game with 1 Insanity.
7 The faerie held you prisoner for 1d20 years.
8 You lost a loved one and their loss haunts you still.
9
You lost a finger, a few teeth, or an ear, or you
gained a scar.
10 You earned a living working in your profession.
11
You fell in love and the relationship ended well or
is ongoing.
12 You have a spouse and 1d6 - 2 children (minimum 0).
13
You traveled extensively. You speak one
additional language.
14
You received an education. You know how to read
the Common Tongue.
15 You saved your town from terrible monsters.
16
You foiled a plot to kill someone important or you
brought a killer to justice.
17
You performed a great deed and are a hero to the
people in your hometown.
d20 Background
18 You found an old treasure map.
19
Someone important and powerful owes you a
favor.
20
You came into money and start the game with
2d6 cp.
Human Personality
3d6 Personality
3
You are cruel, wicked, and self-serving. You enjoy
making others suffer.
4
You are erratic and unpredictable. You have a
hard time keeping your word and tend toward
capricious behavior.
5–6
Might makes right. Obedience to authority is the
highest ideal.
7–8
You look after yourself first and foremost. You’re
not above double-crossing friends.
9–12
You put your interests and those of your friends
above all else.
13–14 You help others because it’s the right thing to do.
15–16
You try to do what you think is right, even if it
breaks laws and social conventions.
17 Your honor and duty guide everything you do.
18
You are committed to good and noble causes,
and you never stray from your beliefs even if your
insisitence would cost you your life.
Human Religion
3d6 Religion
3 You belong to a cult dedicated to a dark power.
4 You belong to a heretical sect.
5–6 You were raised in the teachings of witchcraft.
7–10 You follow the tenets of the Old Faith.
11–15 You belong to the Cult of the New God.
16–18 You have no religion.
Human Age
3d6 Age
3 You are a child, 11 years old or younger.
4–7 You are an adolescent, 12 to 17 years old.
8–12 You are a young adult, 18 to 35 years old.
13–15 You are a middle-aged adult, 36 to 55 years old.
16–17 You are an older adult, 56 to 75 years old.
18 You are a venerable adult, 76 years old or older.
Human Build
3d6 Build
3 You are short and thin.
4 You are short and heavy.
5–6 You are short.
7–8 You are slender.
9–12 You are average in height and weight.
13–14 You are a bit overweight.
15–16 You are tall.
17 You are tall and thin.
18 You are very tall and heavy.
12

Character Creation 1
Human Appearance
3d6 Appearance
3
You are hideous. You look like a monster. Children
cry when they encounter you, the weak of heart
faint when they see you, and one person vomited
after getting a good look at your face.
4
You are ugly, and people find your visage unpleasant
thanks to a scar, wen, beetling brows, boils, piles, a
wandering or weeping eye, or something else of a
similar magnitude.
5–6
Most consider you homely: not quite ugly, but a bit
worse than plain.
7–8
You are plain and uninteresting to look upon. People
notice you, but your appearance fails to make an
impression.
9–12
You are perfectly average in appearance. You look
like everyone else.
13–14
You have a physical quality that makes you
attractive to others. You might have pretty eyes,
lips, hair, shape, or something else.
15–16
You have several attractive physical qualities that
make you quite comely.
17
You are one of the great beauties in the land,
an individual of almost unsurpassed form and
appearance. People notice you.
18
You put beautiful people to shame. You are so
striking, heads turn to follow you wherever you go.
People become infatuated with you, stumbling over
their words and feeling flustered when you show
them attention. There’s a fine line between love and
hate. Should you spurn the attentions of people you
enamor, their affection might sour to resentment
and even hatred.
```

### Incarnation

- **Entry Type:** Powerful Ancestry
- **Source:** Hunger in the Void
- **Source Page:** 72
- **PDF Page:** 73

```text
Incarnations
As the Shadow darkens all across the world, people
of all ancestries face horrors beyond imagining, their
very realities shaken by the inscrutable darkness
emerging from the Void. For help, people look to the
silent gods, the wise wizards in their ivory towers, and
anyone with the will and might to take a stand. Heroes
come from unlikely places, and sometimes even from
beyond the world itself.
Eternally Vigilant: To stanch the flood of demons
pouring into the universe, numerous genies sacrificed
themselves to an effort that would thwart the demons
and protect the integrity of the world. They forged an
invisible barrier, impervious to demonic intrusion.
To bolster this boundary, many genies merged with
it—literally investing themselves in the magic they
wrought. Over the eons, these genies have lost their
identities, subsumed beneath the importance of the
task they set out to undertake. They have no memory
of who they were or even having had a hand in the
shaping of reality. These genies, now known as
incarnations, exist purely to thwart the demons in
their bid to invade the universe.

73
Bodiless and Immortal: Like genies,
incarnations in their natural state have
no physical form. Instead, they are pure
motive force, not unlike the souls found in
mortals. Invisible and ephemeral, unless
an incarnation inhabits another creature,
it cannot interact with the world in any way.
Incarnations are difficult to harm by physical
means, though magic can destroy them. Short
of annihilation, incantations can exist for as long
as the universe.
Called to Serve: Incarnations have no
purpose other than to shield reality from
demonic influence, and thus most have never
been separated from the boundary they help
to preserve. From time to time, incarnations
abandon their post and descend to the world
to thwart efforts to unravel or weaken the
boundary to the Void. Only a few ever leave
the boundary at a time, and then only for a
short period. Leaving the boundary weakens it
and makes it vulnerable to additional fractures
or, worse, total failure.
Borrowed Bodies: When an incarnation
descends to the mortal world, it enters the
body of a living, mortal creature, suppressing
its soul and taking over the form much in
the way that demons can possess creatures.
Incarnations cannot possess faeries or
trolls—peoples not created by the genies—nor can
they inhabit the bodies of creatures that lack souls,
such as gnomes and salamanders. The people whose
bodies they borrow become completely insensate,
almost as if their souls ceased to exist. Once the
incarnation departs, the host’s mind and soul regain
their former place with no recollection of what has
happened or how much time has passed since the
individual was last in control.
Amoral Guardians: Incarnations have no concept
of good or evil. They do what needs to be done in
order to protect the universe. Their dedication to their
cause sometimes can result in questionable outcomes,
such as the killing of scores of innocents to expose
a vile cult of demon-worshipers or the execution of
an innocent creature to release the demon hiding
within it, but incarnations see such acts as necessary
to achieve their objectives. This said, an incarnation
never engages in activity that would weaken the
boundaries of reality, such as discovering dark magic
traditions or using relics influenced by demons or of
demonic origin.
Common Names: Some incarnations might use
the names of their hosts if revealing their true nature
would put them in danger. If not, they use their real
names. Sample names include Adriel, Azrael, Cassiel,
Dumah, Gadreel, Hesediel, Jehoel, Kushiel, Leliel,
Marut, Netzach, Nuriel, Phanuel, Raziel, Samael,
Uriel, and Zephon.
IncarnationCharacters
Because an incarnation has no physical form and
instead borrows the form of another creature, the
process of creating an incarnation character involves
more steps than creating a character of a normal
ancestry. As an incarnation, you borrow the body of a
living, mortal creature and remain in that body until
you choose to leave it or are forced out when the body
dies. Thus, over the course of a campaign, you might
inhabit several bodies, so you might find it helpful to
keep two character sheets, one for your natural form
and the other for the body you currently inhabit.
First Form
Before you create an incarnation, you must create
a character for your incarnation to inhabit. Choose
an ancestry from among human, clockwork, dwarf,
and orc. If you have Demon Lord’s Companion, you
can also choose halfling or faun. Other options
might be available at the GM’s discretion, though the
ancestry must be living, mortal, and have a soul—so
no elementals, faeries, or undead. Go through the
entire character creation process until you have a
finished character. Afterward, create your incarnation
character and, finally, apply the changes from your
incarnated form to the character you will inhabit.

74
Creating an Incarnation
Starting Attribute Scores Strength —, Agility 10, Intellect 10,
Will 10
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Will score
Healing Rate equals one-quarter your Health
Size 1/4, Speed 2, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions None
Darksight You can see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Invisible While in your natural form, you are invisible to all
creatures other than demons.
Hover You move by flying, and you never take damage from
landing after a fall.
Ephemeral You cannot touch or otherwise physically interact
with creatures or objects while in your natural form. You
lack the ability to speak, which also means you cannot cast
most spells. As well, you take no damage from weapons
or physical sources, though magic can affect you. You can
move through solid objects and other creatures, and you
ignore the effects of moving across difficult terrain.
Pure Spirit You take a penalty to Health equal to twice your
Corruption score.
Dissolution If you become incapacitated, your essence flows
back to the edge of reality, where it remains until the
universe is destroyed.
Contact You can use an action to touch the minds of any
number of creatures within short range, and you can
maintain this contact for as long as you concentrate. If
either you or a target moves beyond short range from the
other, the effect immediately ends. If a target knows at
least one language, you can communicate with each other
without speaking as long as you remain in contact.
Incarnate While in your natural form, you can attempt to
enter the body of one creature within short range. The
creature must be living and mortal, and must possess a
soul. Such creatures include, but are not limited to, humans,
dwarfs, halflings, fauns, orcs, and animals. You cannot
target demons, elementals, faeries, constructs, undead,
and similar creatures with this attack. Make a Will attack
roll against the target’s Will. On a success, you incarnate in
the target’s body and remain there until you use an action
to leave the target’s body or until the target’s body dies.
When you leave a living creature’s body, it has no memory
of the time it spent under your control and gains Insanity
equal to its Will score. See Incarnated Form, below, for the
effects of using this talent. On a failure, the target becomes
immune to your use of this talent until you complete a rest.
Powerful Ancestry When your group attains level 1, you
do not choose a novice path. Instead, whenever the
Advancement table in Shadow indicates you would gain
benefits from a novice path, you gain the benefits from
your ancestry for that level. If you incarnate into a creature
with the Powerful Ancestry trait, you gain none of its
features beyond level 0.
Incarnated Form
When you use the Incarnate talent, you fuse your statistics
with that of the target creature, as described below. The
target creature is fully under your control as if you were
that creature.
Attribute Scores You use the Strength and Agility of the
target creature, but retain your Intellect and Will.
Perception You use the target creature’s Perception
regardless of your Intellect score.
Defense You use the target creature’s Defense.
Health You use the target creature’s Health. You continue to
suffer penalties to Health from your Pure Spirit trait.
Healing Rate You use the target creature’s healing rate.
Size You use the target creature’s Size.
Speed You use the target creature’s Speed.
Power You use your Power.
Damage You use the target creature’s damage, and it applies
to its Health.
Insanity and Corruption You use your Insanity and
Corruption scores. If the target creature has any marks of
darkness, you retain them.
Languages You can speak, read, and write any languages
that either you know or the target creature knows.
Magic You retain any traditions you have discovered and any
spells you have learned, but you do not discover the target
creature’s traditions or learn the spells it has learned.
Traits and Talents You lose the Invisible, Hover, Insubstantial,
Ephemeral, Contact, and Incarnate traits and talents. You
retain all talents you gained from increasing your group’s
level. You gain all the traits from the target creature’s
ancestry, including any natural weapons—claws and teeth—
the target creature might have, but you do not gain any
talents the target gained from paths.
Unnerving Demeanor Other creatures can sense something
wrong or off about you. You make attack rolls in social
situations with 1 bane.
Level 1 Incarnation Novice
Attributes Increase your Intellect by 1 and your Will by 1
Characteristics Health +1 to natural form and +4 to
incarnated form
Retrieve Memories While in your incarnated form, you gain
all of the target creature’s professions.
Empowered Recovery You can use an action to heal damage
equal to your healing rate. For 1 round thereafter, you make
attack rolls and challenge rolls with 1 boon. Once you use
this talent, you cannot use it again until after you complete
a rest.
Level 2 Incarnation Novice
Characteristics Health +1 to natural form and +4 to
incarnated form
Gain one of the following benefits:
Magic You increase your Power by 1, discover a tradition, and
learn one spell from that tradition.
Weapon Training You make attack rolls with 1 boon when
you attack with a weapon.
Level 4 Incarnation Expert
Characteristics Health +1 to natural form and +4 to
incarnated form
Gain one of the following benefits:
Magic You discover a tradition or learn one spell from a
tradition you have already discovered.
Eternal Resolve You make Intellect and Will challenge rolls
with 1 boon.

75
Level 5 Incarnation Expert
Characteristics Health +1 to natural form and +4 to incarnated
form
Surging Confidence When the total of your attack roll is
20 or higher and beats the target number by 5 or more,
you make all attack rolls and challenge rolls with 1 boon
for 1 round.
Gain one of the following benefits:
Magic You increase your Power by 1 and either discover a
tradition or learn a spell from a tradition you have already
discovered.
Combat Prowess Your attacks with weapons deal 1d6 extra
damage.
Level 8 Incarnation Master
Characteristics Health +1 to natural form and +4 to incarnated
form
Gain one of the following benefits:
Magic You either discover a tradition or learn a spell from a
tradition you have already discovered.
Combat Expertise When you use an action to attack with a
weapon, you can either deal 1d6 extra damage with that
attack or make another attack against a different target
before your turn ends.
Incarnation Tables
The following tables supplement the ones you use
to detail the creature you create as your first form.
The Incarnation Personality table supersedes the
Personality table of your first form’s ancestry, and
the Incarnation Manifestation table describes any
physical changes that result when you incarnate in
a creature’s body. These signs disappear when you
relinquish control of the body.
Becoming an
Incarnation
If you’re already playing a character from
a suitable ancestry, you can choose, with
the GM’s permission, to be targeted by an
incarnation to become its vessel. Such an
event should occur between adventures,
because the incarnation would need some
time to become acquainted with its new
form. Make all the necessary adjustments to
your character, including the choices at the
indicated levels until you reach your group’s
current level. The transformation can reflect
the attention your group has earned from
beings that are charged with protecting
creation, or it could just let you develop
your character in an entirely different way,
changing out capabilities you had already
attained for new ones. If the incarnation
leaves your body (as determined by you and
the GM), you must decide whether you will
play your original character or continue to
play the incarnation.
Incarnation Manifestation
d20 Manifestation
1 Your eyes are solid white or black, though you can
see normally.
2 Faint writing in an unknown script appears all over
your body.
3 When you become angry, a tongue of fire appears
above your head, shedding light in a 1-yard radius.
4 Your words echo faintly when you speak.
5 A blue, gold, or silver geometrical shape appears on
the center of your forehead. Roll a d6 to determine
the number of sides on the shape, with a 1 indicating
a circle and a 2 indicating a cat’s-eye shape.
6 Your skin glows while you are within short range of a
demon not possessing another creature.
7 You cast no shadow.
8 You smell of ozone.
9 Flames within short range bend toward you.
10 When you attack, electricity crackles briefly across
your body.
11 Weird patterns appear in your skin, giving you a scaly
appearance.
12 You never perspire.
13 You cast no reflection in mirrors.
14 You are hairless.
15 Your skin appears to be made from polished marble.
16 Weird crystalline growths sprout from your body.
17 Your skin appears cracked and fissured, and from
inside the cracks shines faint light.
18 Tiny glyphs appear and spin slowly around your head.
19 You feel cold to the touch, as if you were dead.
20 You whisper and moan when you sleep, sounds that
originate from within your body’s original soul.
Incarnation Personality
d6 Personality
1 You believe that people are responsible for the troubles
blighting reality. You are haughty and arrogant.
2 You are cold and withdrawn.
3 You rarely show emotion, acting more as a machine
than a person.
4 You find it difficult to connect to other people, and you
often say the wrong or even worst possible thing.
5 You focus on your mission and never let anything get
in your way.
6 Unlike most incarnations, you care for the people in the
world and strive to protect them from harm.
```

### Jotun

- **Entry Type:** Powerful Ancestry
- **Source:** A Glorious Death
- **Source Page:** 6
- **PDF Page:** 7

```text
Jotun
Though it has been centuries since the jotun ravaged
the Empire’s western coasts, imperials still speak of
the giant-blooded raiders in hushed whispers. They
have good cause to fret, for since their crushing defeat
at the hands of the Empire’s elite soldiers and cunning
wizards, the jotun have bided their time, nursing their
hatred while waiting for the Great Wolf to devour the
sun, which will signal the time to set sail once more and
drown the Empire in blood.
Blood of Giants: Jotun boast that they have the blood
of giants flowing through their veins, and their great
size and menacing demeanor suggest there might be
something to their proclamations. Standing 8 to 10 feet
tall and weighing 400 to 800 pounds, they tower over
most people. Compared to humans, even the scrawniest
jotun benefit from big frames covered with slabs of
muscle. They all have thick, brutish features. Most find
the sun painful due to widespread albinism, which
accounts for their crimson eyes and chalky white skin.
Mankind’s Greatest Foes: The jotun plagued
civilization for centuries. Every year when the seas
thawed and the ice receded, the jotun would board
longships and raise black sails to venture north and visit
horror on the weak, the soft, and the fearful. Raiding was
necessary to the jotun’s survival because it provided the
grains, textiles, gold, and slaves to sustain their society.
Of course, raiding also meant battle, and every jotun saw
these expeditions as a way to become blooded and earn
a place among the jarl’s household.
Success in their incessant raiding along the Empire’s
southern coasts emboldened the jotun to venture into
the nation’s interior by sailing up rivers. Such a strike
into the heartland, along with the death of the emperor’s
heir, roused the full anger of the Alabaster Throne.
The emperor sent legions south to destroy them.
Although they were ferocious and battle-hardened, the
jotun could not stand against the Empire’s battle wizards
or ironclad soldiers.
For the Empire, breaking the jotun was not enough.
The imperial legions invaded their realm, crucified
their chieftains, and enslaved the people. From these
captives, they made the orcs that would serve the
emperors for centuries.
The jotun have since recovered from their defeat and
have endured the many centuries since while waiting for
their time of vengeance. Although most jotun remain in
the frozen wastes, a few seek their fortunes in the north
as mercenaries, guards, and adventurers.
Strength and Courage: A culture focused on battle
creates people who pride themselves on being strong
and brave. To join the ranks of the warriors, one must
pass the tests of blood and iron—a brutal series of
contests involving brawls, hurling weapons, fighting
beasts, and more that unfolds over several days. The
weak succumb, their bodies tossed into the dark waters
to feed the kraken that will one day rise from the depths
to crush the world. The survivors become champions,
battle-ready and proven.
Jotun enjoy crude humor, drinking, and boasting.
They tell riddles or enjoy the skalds’ tales of their
great heroes, the foibles of the gods, and the mishaps
that befell the wretched trows. Superstitious, the jotun
see omens everywhere and believe the gods walk
among them. Cowardice is the greatest crime a jotun
could commit. Many jotun believe that fleeing from an
enemy brings shame not only to themselves, but to their
entire clan.
The Wyrd: The jotun believe that Grimnir has laid
eyes on the beginnings of all things and has seen the
end as well. His knowledge means that all has been
decided, and each person’s fate has already been written.
The concept of the wyrd (which can be taken as destiny,
doom, or fate) haunts the jotun, shaping their view of the
world and defining the place they have in it. There can
be no escaping the doom foreseen by Grimnir, so there is
no sense fighting it. Accept what is, and chase glory until
the end.

7
Common Names: Arne, Astri, Bjorn, Bryhild, Eirik,
Freydis, Geir, Gisle, Gundrun, Gunnar, Gunnhold,
Gunnvor, Hakon, Harald, Hilde, Inge, Ingrid, Ivar, Knut,
Leif, Magnus, Olav, Ragnhild, Ranveig, Rolf, Sigrid,
Sigurd, Sigrunn, Siv, Snorre, Solveig, Steinar, Svanhild,
Torhild, Torstein, Torunn, Trygve, Turid, Ulf, Valdemar,
Vidar, Vigdis, Yngve, and Yngvild.
Creating a Jotun
Starting Attribute Scores Strength 13, Agility 9, Intellect 8,
Will 10
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 2, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common
Tongue and Trollish. You begin the game with one
profession, which you determine by rolling on the
Jotun Profession table.
Inured to Cold You take half damage from cold, and you
are never at risk of suffering the effects of exposure in
cold environments.
Powerful Ancestry When your group attains level 1, you
do not choose a novice path. Instead, whenever the
Advancement table in Shadow indicates you would gain
benefits from a novice path, you gain the benefits from
your ancestry for that level.
Level 1 Jotun Novice
Attributes Increase two by 1
Characteristics Health +6
Catch Your Breath You can use an action, or a triggered
action on your turn, to heal damage equal to your healing
rate. Once you use this talent, you cannot use it again until
you complete a rest.
Level 2 Jotun Novice
Characteristics Health +6
Gain one of the following benefits:
Magic You increase your Power by 1, discover a tradition,
and learn one spell from that tradition.
Weapon Training You make attack rolls with 1 boon when
you attack with a weapon.
Level 4 Jotun Expert
Characteristics Health +6
Gain one of the following benefits:
Magic You discover a tradition or learn one spell from
a tradition you have already discovered.
Blood of Giants Whenever you heal damage, you make
Strength attack rolls and challenge rolls with 1 boon
for 1 round.
Level 1 Jotun Novice

8
Level 5 Jotun Expert
Characteristics Health +6
Titan’s Strike When the total of your attack roll is 20 or
higher and exceeds the target number by at least 5, the
target takes 1d6 extra damage and must get a success on
a Strength challenge roll or fall prone.
Gain one of the following benefits:
Magic You increase your Power by 1 and either discover
a tradition or learn a spell from a tradition you have
already discovered.
Combat Prowess Your attacks with weapons deal
1d6 extra damage.
Level 8 Jotun Master
Characteristics Health +6
Gain one of the following benefits:
Magic You either discover a tradition or learn a spell from
a tradition you have already discovered.
Combat Expertise When you use an action to attack with
a weapon, you can either deal 1d6 extra damage with that
attack or make another attack against a different target
before your turn ends.
Jotun Build
3d6 Build
3 You are quite scrawny, under 8 feet in height
and weighing about 400 pounds.
4–5 You are short, about 8 feet tall.
6–8 You are slender, 500 pounds or less.
9–12 You are a typical jotun, 9 feet tall and
700 pounds.
13–15 You are heavyset. You weigh 850 pounds.
16–17 You stand 10 feet tall and weigh 800 pounds.
18 You are enormous, 11 feet tall and over
1,000 pounds.
Jotun Appearance
3d6 Appearance
3 You have a monstrous appearance. Crude
stitching holds your skin together, ugly scars
zigzag across your body, and you have more
blemishes than clear skin.
4–5 You have a sickly appearance, almost jaundiced,
with red-rimmed eyes and odd blotches marking
your skin.
6–8 You resemble most other jotun, but nasty scars
stand out all over your body.
9–12 You have chalky white skin, crimson eyes, and
thick, brutish features.
13–15 You are a fine-looking jotun, with white skin
and red eyes.
16–17 You have light blue skin with dark patches
under your eyes and in the creases of your skin.
Your irises are white with red flecks.
18 You have dark blue skin and piercing white eyes.
Your people believe you to have been touched
by the gods of blood and iron.
Jotun Personality
3d6 Personality
3 You are a lout. Cruel and vicious, you enjoy using
your strength to hurt other people.
4–5 You are a bully. You talk a big game, but you are
desperately afraid people will find out how scared
you really are.
6–8 Loud and boisterous, you pick fights you probably
shouldn’t.
9–12 You do and take what you want because you are
strong. You are given to boasts and never back
down from a challenge.
13–15 You have nothing to prove. You know your worth
and won’t be baited into a fight you could avoid.
16–17 You believe that with power comes responsibility.
You seek to uplift and inspire, rather than to take
down and destroy.
18 You regret your people’s aggressive tendencies
and strive to find peaceful solutions to your
problem, resorting to violence only when
you must.
Jotun Profession
d20 Profession
1 Scholar of geography, navigation, or war
2 Slave
3 Merchant or slaver
4 Sailor
5 Farmer or woodcutter
6 Laborer or shipwright
7 Entertainer (orator, singer, or storyteller)
8 Pirate
9 Thrall
10 Raider
11 Soldier
12 Clan guard
13 Mercenary
14 Fisher or whaler
15 Healer
16 Barbarian
17 Hunter or whaler
18 Scholar of folklore or history
19 Devotee of the Dark Gods
20 Scholar of astrology, magic, or the occult

9
Jotun Background
d20 Background
1 Your clan cast you out for cowardice. You might
strive either to regain your honor or to embrace
your nature.
2 While ranging across the Blasted Lands, you
encountered a band of cold ones and nearly
died in the fighting.
3 You were beaten badly after you challenged
another jotun to a duel. You bear the scars still.
4 Trows, cousins to the dwarfs, took you prisoner.
They treated you well, but you had to murder
several of them to escape.
5 You grew up hearing tales about the evil Empire
in the north. You hope to win glory and honor by
slaughtering the humans living there.
6 You became lost in the frozen wastes and
experienced unsettling visions. Start the game
with 1d3 Insanity.
7 You were widely feared and respected by
your clan. You earned your reputation for
being ferocious in a fight and leaving your
victims maimed.
8 You have a spouse and 1d3 children. You might
be estranged from them or work to provide for
their well-being.
9 You once saw the kraken destroy a ship. The
experience left you chilled, and you become
nervous in the open water.
10 You earned a living working in your profession.
11 You fell in love with a human who eventually
rejected you. You still have an eye for humans.
12 A raven of Grimnir, the one-eyed god of your
people, came to you and revealed your wyrd. You
left your homeland to seek it.
13 You left your homeland to see the world.
14 A storm destroyed your ship, and you alone
washed ashore in human lands.
15 You inherited a sword or a battleaxe. The weapon
is fine and covered in runes, though it does not
appear to be magical in nature.
16 You befriended a skald and learned many of the
old songs and stories.
17 A family member dabbled in dark magic and left a
stain on your clan’s reputation.
18 You performed a great deed, and your people
consider you a hero.
19 You will become jarl of your clan one day if you
can prove your worth.
20 You found a great treasure. Begin the game with
one enchanted object created by the GM.
Jotun Age
3d6 Age
3 You are a child, no more than 11 years old. Reduce
your height and weight by 50 percent.
4–5 You are an adolescent, from 12 to 17 years old.
Reduce your height and weight by 25 percent.
6–8 You are a young adult, from 18 to 25 years old.
9–12 You are an adult, from 26 to 35 years old.
13–15 You are a middle-aged adult, from 36 to 55 years
old.
16–17 You are an older adult, from 56 to 75 years old.
18 You are a venerable adult, 76 years old or older.
Size 2 Creatures
As a jotun, you are a Size 2 character, which
makes you quite a bit larger than most other
player characters. Size 2 characters have
several benefits and drawbacks, summarized
here.
• Your reach is 2 yards (Shadow, page 37)
• Your movement might be restricted by
space (Shadow, page 38)
• Size 1/2 and smaller creatures can freely
move through your space (Shadow, page 38).
• Armor and weapons cost double the listed
price (Shadow, pages 100 and 102)
• Your attacks with weapons that normally
deal 1d6 damage or more deal 1d6 extra
damage. Your attacks with weapons that
normally deal less than 1d6 damage instead
deal 1d6 damage (Shadow, page 102).
```

### Lizardman

- **Entry Type:** Standard Ancestry
- **Source:** Foulest Reptiles
- **Source Page:** 3
- **PDF Page:** 3

```text
Lizardmen Characters
You can use the following rules to create unique
lizardmen characters. Although you could use these
rules to create lizardmen player characters, lizardmen
are not likely to leave their lands or join forces with
members of other ancestries since they typically hunt
and eat them. Lizardmen are also somewhat tougher
than other ancestries and are thus not appropriate
ancestry options for most campaigns.
Creating a Lizardman
Attribute Scores Strength 1d3 + 12, Agility 1d3 + 9, Intellect
1d3 + 6, Will 1d3 + 7
Perception equals its Intellect score + 4
Defense equals its Agility score + 2
Health equals its Strength score
Healing Rate equals one-quarter its Health
Size 1, Speed 10, Power 0
0 Damage, 1d3 Insanity, 1d3 Corruption
Languages and Professions The lizardman speaks the tribal
tongue of its people.
Shadowsight The lizardman can see into areas obscured
by shadows as if those areas were lit.
Immune frightened
Swimmer The lizardman ignores difficult terrain while
swimming and never needs to make a challenge roll to
swim.
Rising Fury When the lizardman takes damage, it makes
its next attack roll before the end of the next round with
1 boon.
Natural Weapons A lizardman’s fangs count as basic
weapons that deal 1d6 damage.
Level 4 Lizardman Expert
Characteristics Health +4
Snapping Fangs The lizardman can use a triggered action
on its turn to attack with its fangs.
```

### Lutin

- **Entry Type:** Standard Ancestry
- **Source:** Faerie Friends
- **Source Page:** 2
- **PDF Page:** 2

```text
Lutins
Until recent days, no one knew the lutins existed. Even the
other faeries seem to have put them out of mind, though,
if asked, they would wave their hands and dismiss the
diminutive folk as an insignificant people who have done
little to distinguish themselves. Like gnomes, yerath, and
so many others, lutins seemed content to pass their days in
isolation until the outside world, with all the darkness that
has corrupted it, came to their doors.

Hidden Folk
Of all the peoples included in the extended family of
faeries, the lutins stand apart. Never did they consider
themselves masters of anything. Like the elves and others,
they awoke in the world in its first days. Rather than seek to
control it or make it their own, the lutins celebrated their
good fortune just for being alive. They took the creation as
it was and looked for a place where they could live in peace.
Thus did the lutins escape the bloody wars against the
elementals. So, too, did the catastrophic fighting between
elves and trolls pass them by. And when the Men of Gog
rejected the gods and turned all their hatred against the fey,
lutins were nowhere to be found.
As much as they hoped to avoid trouble, it eventually
found them. Pollution from mortal industry spilled into
their lands, causing trees to sicken and other plants to
wither. A spiritual sickness followed, spawned by the
rampant use of dark magic and soulless action. And
then came the wild monsters who killed without cause.
Something had to be done—the lutins could stand apart no
longer.

For the Good of All
Though humans bore responsibility for much of the evil at
large in the world, the lutins did not condemn them. They
understood that mortals were the world’s best hope for
salvation. So rather than denigrating, shunning, or seeking
vengeance against them, the lutins decided to help.
Too often, their high ideals break against the walls of
stubbornness and selfishness that characterize so many
human beings. Failure has seen some lutins abandon the
effort and seek refuge in the hidden kingdoms, but the
rest remain undeterred. They believe if they can reach one
person, they can reach two. The more people they help, the
more others might feel the duty to join the struggle against
the darkness.

Quintessential Little People
Lutins share many characteristics found in other faeries,
being immortal and strange looking, at least by human
standards. At just two feet tall and weighing next to
nothing, they can disappear in crowds. Lutins have
somewhat flattened heads, being wider than they are tall.
Large, pointed ears, often with thick hair growing from
them, jut out to the sides, and long, pointed noses stand out
from their faces. All lutins have thick hair on their heads,
and some pride themselves in growing luxurious nose and
ear hair.
In their lands, they go about unclothed. Out in the world,
though, they don whatever clothing they find at first and
then make clothes for themselves from materials they
acquire through licit or illicit means. Most prefer bright,
colorful hats that stand tall on their heads. The hats help
big folks see them so they don’t trample them. Some wear
dapper suits with vests, while others prefer loose dresses
and robes that catch the wind and swirl around their
diminutive bodies.
You decide your appearance. You can be tall or short, thin
or chunky, with lots of hair or little. Your appearance has
no bearing on your capabilities. You can use the Random
Lutin Builds table to determine your approximate height
and weight. The Lutin Distinctive Features tables helps you
come up with something unusual about your character.

Random Lutin Builds
3d6 Build
3 Short and plump, you stand 6 inches tall and weigh
25 pounds.
4–5 You have a slight build and weigh 15 pounds.
6–8 You stand 18 inches tall and weigh 15 pounds.
9–12 You stand 2 feet tall and weigh 20 pounds.
13–15 You stand 3 feet tall and weigh 40 pounds.
16–17 You have a thick, muscled, or flabby body and
weigh 30 pounds.
18 You stand 3 feet tall but weigh a mere 20 pounds.

LUTIN DISTINCTIVE FEATURES
d20 Distinctive Feature
1 You smell like old cheese.
2 You have body hair so thick it often becomes
snarled and knotted.
3 You keep your toenails so long that they curl under
your feet. You can slide across the ground as if you
were wearing skis.
4 Your sinuses produce a great deal of mucus. You
pick or blow your nose all the time.
5 You have no hair anywhere on your body.
6 One of your eyes wanders. Which eye it is changes
all the time.
7 You suffer from piles. You have a hard time sitting
down for long stretches.
8 A horn grows out from the side or back of your
head.
9 You have a large hump on your back.
10 You have a fancy moustache or pretty hair.
11 You have a long, pointed chin.
12 You have a stooped posture.
13 Dirt finds you. You appear filthy and have an odor of
freshly turned earth.
14 You have an infestation of body lice.
15 You love sweet foods, evident in your sticky face
and fingers.
16 You have a deep, rumbling voice.
17 A bird follows you around and poops on your head.
You seem unable to rid yourself of this friend, not
that you want to.
18 You have so many skin tags that you find it
unpleasant to be touched.
19 One of your eyes is bigger than the other.
20 You have bushy eyebrows and long, long eyelashes.
You sometimes have to lift the hair so you can see!

Hidden Homelands
After turning away from their immortal kin, lutins settled
in the most secret places, unknown to the nascent gods. In
hidden valleys, high up in mountain aeries, on paradisical
islands, and in the deepest, most primeval forests, they
made their homes and used magic to cover the paths they
took so that none might follow and disturb the peace they
hoped to create. In this isolation, they remained until
necessity forced them to emerge from their secret lands.
No lutins would harm anything in nature. Cutting down
trees or slaughtering animals for meat or fur is abhorrent
to them. Instead, lutins survive on nature’s bounty. They
forage without killing, eschew all flesh, and drink water
only. They leave no impression on the lands on which they
live—if they vanished, there would be no sign that they
were ever there.
Rather than make homes, lutins find shelter where they
can. A nice, dry cave serves, as can the area under the lower
branches of a great pine. When all else fails, they burrow
into the ground, sharing spaces with groundhogs, badgers,
and other wild things.

Cooperation and Community
Their ability to communicate with ordinary beasts and
their magical abilities explain some of the ways lutins
managed to live these long years, but they owe their
survival to a sense of community that knits them together.
Lutins see themselves as belonging to one large extended
family united by shared values and beliefs. When they
meet another lutin on the road, they speak as if they were
close friends. They share everything that might be of use to
the other.
Lutins want to have a similar relationship with other
people. Their long estrangement from their faerie cousins
grieves them; they would repair it if only the elves and
others would abandon their violent ways and embrace
peace. Similarly, lutins hope to inculcate their values in
mortals, though they understand that such a task might
prove impossible.
Their openness and trusting, friendly natures lead some
to regard them as foolish, unwise, and naïve even. Certainly,
some dark-hearted people exploit the lutins, leaving them
worse off than they were. Lutins tend to accept their fate,
always believing that tomorrow will be a better day.
A commitment to peace and a tendency toward pacifism
should not suggest lutins are incapable of protecting
themselves. Few would let a disagreement with humans
end in violence, but none believe any peaceful solution
can come from dealings with undead, demons, devils, and
other fell creatures. When they must, lutins use magic and
arms to protect themselves and their companions, fighting
with all the ferocity of berserkers.

Quirks
Everything about your character’s personality, outlook,
motivations, and ultimate goals can take whatever form you
like. Keep in mind, though, how your people’s dominant
culture sees the world, and consider how that might shape
your own views. The following table offers some quirks to
help make your character distinct. You can use them or not,
or you can make up one of your own!

LUTIN Personality Quirks
d20 Personality Quirk
1 When you talk to someone, you move up close and
touch them.
2 You pick at your ears when you think hard about
something.
3 Your nose twitches when you feel curious.
4 You gesture with your hands when talking.
5 Your ears flap when you are afraid.
6 You marvel at flowers and pet them.
7 You believe you can talk to bees.
8 You have a deep, chunky cough.
9 You have a downcast, morose demeanor.
10 You always repeat the last word of every sentence
you say.
11 You sigh and roll your eyes all the time.
12 You constantly crack your knuckles.
13 You make little, happy noises when you eat.
14 You simply cannot bear soap. You complain and
puke everywhere when you have to wash.
15 Potatoes are great! Everyone should know!
16 You fidget all the time. You speak fast and rush
about as if in a hurry.
17 You chew on your toenails.
18 You pretend to be an old person. You complain
about your knees, grunt when you kneel down,
moan when you stand up.
19 You whistle or hum a song without realizing it. You
have no idea what it is, but it seems pretty to you.
20 You cannot eat food on your own. Someone else
must chew it first and then spit it into your mouth.

Lutin Names
Lutins choose their own names. They favor names for
pretty things and positive emotions. Youngsters sometimes
go through a rebellious phase and choose ugly things
on purpose. They eventually grow out of it and take on a
different, more suitable moniker.

LUTIN Names
d20 Name
1 Buzz
2 Cloud
3 Cheery
4 Dinner
5 Elate
6 Friendship
7 Gum
8 Kisses
9 Love
10 Moon
11 Nice
12 Petal
13 Quiet
14 Rain
15 Rill
16 Smiles
17 Very
18 Wind
19 Wink
20 Yiff

A Cynical World
No lutin thought their mission would be easy, but they
never expected to find so many cynical, broken people
either. They find many trapped in worlds defined by their
own misery, others bent and broken by disappointment and
despair. Even folks who would find sympathy for the lutins’
mission have little reason to trust them. After all, what’s
more likely: good-hearted faeries coming out of hidden
places to right the world or wicked faeries who hide their
intentions behind kindly masks?
In towns and cities, lutins earn disappointment for the
trouble they take to help. In the countryside, though, where
people remember the old ways of dealing with the faeries,
lutins find greater acceptance. Halflings, rural humans,
and some returning faeries show more receptivity to lutin
efforts and welcome their help. Having heard stories of the
little people, some remote communities build tiny houses
hoping to attract them. Lutins lack the numbers to help
everyone, so even if they find a settlement and lend a hand
for a while, they move on soon after as the need to help
someone else outweighs whatever desires they might have
to put down roots in a welcoming community.

LUTIN Background Events
d20 Background Event
1 While exploring a forest, you entered a grove of
blighted trees. Investigation revealed they had been
sickened by dark magic.
2 An elf stumbled into your lands. They told you of
wicked humans determined to wipe the faeries from
Urth.
3 A Void breach opened and washed the lands
around it with demonic influence. Too many animals
were warped into horrid monsters for you to stay in
hiding.
4 You helped a pair of lost travelers out from your
homeland. You learned about the state of the world
from them.
5 Curiosity about the world drew you out to explore it.
6 Terrible dreams concerning a spreading darkness
left you chilled enough to seek out the source of
your nightmares.
7 A demon carved a path through your homeland. You
stayed alive by hiding.
8 You argued against returning to the world. You
changed your mind after learning from a traveling
lutin that monsters slaughtered a nearby settlement.
9 A hamadryad came to your community and begged
for help. You were the second to volunteer.
10 You owe a debt to a powerful faerie, who called on
you to settle accounts.
11 You left your home long ago. You settled in a human
village to help the good folk you found there.
12 Goblins, fleeing demons, stumbled into your
community. You patched up their wounds and
nursed them back to health. When they left, you
went with them.
13 You left your community to help others. During one
stop in a village, you saw a demon-possessed child
murder three grown men before archers took her
down.
14 You met a woman who lived in a pond. She rose
up from the algae-covered surface and told you a
terrible truth. You cannot remember what she said
but knew you could no longer stay among your
kind.
15 A magician’s spell whisked you from the comfort of
your home.
16 Murderous humans invaded your homeland under
the banner of their false god. You saved as many of
your friends as you could before you fled.
17 You befriended a troll. You had many great
conversations until an elf knight came and killed him.
18 You lived with a family of badgers for many years.
You loved them and they loved you.
19 You once climbed the tallest tree in the forest where
you lived. From the top, you could see distant,
strange lands. The vista enchanted you. You just
had to see what was out there.
20 You hid a child from their wrathful, abusive parent.
You became fast friends and helped the youngster
until they, one day, vanished.

Playing a Lutin
You can create a lutin character using the rules that appear
below.

Attributes
The following option lets you randomize your starting
attribute scores. If you prefer, you can use the typical scores
that appear parenthetically or randomize them all.
Strength d3 + 4 (6)    Agility d3 + 10 (12)
Intellect d3 + 8 (10)  Will d3 + 8 (10)

Characteristics
You determine the starting values for your characteristics as
follows.
Perception equals your Intellect score + 2
Defense equals your Agility score + 2
Health equals your Strength score
Healing Rate equals one-quarter of your Health score
Size 1/4, Speed 8, Power 0

Traits
As a lutin, you have certain traits common to all members of
your ancestry.
Languages You speak the Common Tongue and Elvish.
Professions You start with one of the following; Entertainer,
Gatherer, Guide, Healer, Nomad, or Tracker. Other options
might be available at your GM’s discretion.
Shadowsight You ignore the effects of obscurement on your
vision caused by shadows and dim lighting.
Iron Vulnerability You become impaired when in physical
contact with iron or an iron alloy for as long as you
maintain that contact.
Beast Tongue You learn the beast tongue spell from the
Primal tradition. You have double the normal number of
castings for this spell.
Sudden Strength You can use this trait after you make a
Strength attack roll or challenge roll. Add 10 to the roll’s
result. Once you use this trait, you lose access to it for 1
minute. You can use this trait a number of times equal to 1 +
half your level (minimum 1). You regain expended uses after
you rest.
Adopt Animal Form You can use an action to transform
yourself into one of the following creatures; a white cat
(tiny animal), a dog (small animal), or a horse (Shadow,
page 147). You remain in this form until you take damage,
gain Insanity, gain an affliction, or you touch an object
made from iron or iron alloy. You can use this trait a number
of times equal to 1 + half your level (minimum 1). You regain
expended uses after you rest.

Level 4 Lutin Expert
When you reach level 4, increase your Health by 2 and
choose one of the following traits.
Magic: You learn one spell from a tradition you have discovered.
Easy Transformation: When you use an action to transform, you
immediately gain one action. Use this action before the end of
your turn, or lose it.

Starting Equipment
Since your people have little use for crafts and trade, you
have a different set of starting equipment than what is
normally available to other characters. As a lutin, you start
the game with the following items.
Clothing: You have a smock, dress, or tunic made from rags.
Weapons: You have a club, spear, javelin, or staff.
Gear: You have a sack made from woven grass, nuts, and dried
berries to feed you for 7 days, a gourd full of clean water, and
one of the following: a sparrow friend, a collection of pretty
stones, or a cool stick.
Interesting Thing: You have an interesting thing. You can use
whatever interesting thing table you like.
```

### Man of Gog

- **Entry Type:** Ancestry Variant
- **Source:** Men of Gog
- **Source Page:** 43
- **PDF Page:** 43

```text
Heir of Gog
From enclaves hidden deep in the Desolation to the pale
neighbors who still live in the cities and towns all across the
Empire, hiding their heritage, the Men of Gog’s many heirs
have spread across the continent following the Hegemony’s
collapse. Their cunning descendants, still carrying the
original spark of Magog’s creation within them, have found
ways to survive, endure, or outright avoid the hostility earned
by their leaders’ wicked actions. Most Gog are every bit as
human as other people living in the Empire, though their
corrupted nature has led to the birth of numerous offshoots,
such as the troglodytes (see Wretched and Unclean), undead
(as described in Kingdom of Skulls and Tombs of the Desolation),
and beastmen (see The Hunger in the Void). Here, though, you
will find everything you need to create and play people in
whom the blood of the Gog still flows strong.
Men of Gog Statistics
Use the rules for creating human characters that are
found in Shadow of the Demon Lord or the Only Human
supplement. As a Man of Gog, you begin the game with
1 Corruption. Rather than use the normal background for
human characters, use the table above.
Men of Gog Backgrounds
d20 Background Event
1 You were killed. Choose one of the following
options. You are now a grave thrall (see Kingdom of
Skulls), a revenant (see Tombs of the Desolation), or
were restored to life with 1d6 Insanity.
2 Your parents told you that you began speaking
when you were born. Over the years, you have
begun to gain memories in a haphazard fashion of
a previous life, a life spent fighting for a shadowy,
nightmarish figure. You start the game with two
additional professions, neither of which can be
religious in nature.
3 You thought you were like everyone else. You had
no idea that the blood of Gog ran through your
veins. A crone revealed the truth to you and you
knew all the resentment that you had buried inside
you, all the rage and hatred was justified.
4 Knowing the truth of your heritage, you have
helped the cause of your people in small ways.
You burned down a shrine once and nearly beat
its priest to death.
5 Your ancestors were ardent followers of the
Witch-King and clung to the belief in his return.
They imprinted their expectations on their
descendants, who passed them down to theirs
until their beliefs came down to you. You know
the time is at hand, and that Ashrakal will return.
And you are ready.
6 Your heritage revealed itself in the black scrawl
that covers your back. Your mother would
read the writing in the Dark Speech, and the
unspeakable truths revealed in her readings
bestowed 1 Insanity on you.
7 You joined the crusaders watching the Desolation,
not to aid them in their struggle, but to sabotage
them when your people marched out of the
wastes.
8 You are convinced that you’re not alive. You rarely
eat or drink, you sleep only a few hours at night,
and never have any dreams.
9 You once killed a faerie in cold blood. You broke
the creature’s back and watched it slowly die in
agony. Gain 1 Corruption.
10 You know a secret member of the Brotherhood of
Shadows and have performed services for them at
various times.
d20 Background Event
11 You were orphaned and raised as a ward of a
faith. You never felt comfortable there and ran
away the first chance you got.
12 You were apprenticed to a dark magician and
witnessed truly depraved acts in his or her pursuit
of forbidden knowledge. The experience and your
part in the actions left your soul darkened. You
discovered the Forbidden tradition.
13 You suffer from vivid dreams about the Witch-
King and have convinced yourself that you are the
Witch-King reborn. Gain 1 Insanity.
14 Your most prized possession is a blackened blade
bearing the stamp of the Witch-King, which is a
crowned skull. The blade is always warm when
you touch it.
15 You know the truth about your heritage, but it
shames you. You believe that your ancestors
did lasting harm to the world and that you must
somehow make amends for what your people did.
16 You cannot hide your heritage. Your skin is so
white as to be translucent. You have coal black
eyes and a skull-shaped blotch on the palm of
each hand.
17 You hear voices in your head, the sounds of souls
trapped in the Underworld. The phantasmal noises
threaten to drive you insane. Gain 1d3 Insanity.
18 You believe it is your destiny to fetch the soul
of the Witch-King from Hell. You have spent
your life so far preparing for the rigors you will
undoubtedly face traveling into that nightmarish
realm.
19 One of your ancestors was seduced and sullied by
a devil. If you have Exquisite Agony, change your
ancestry to cambion, or start with 1 Corruption
and 1 mark of darkness.
20 Drawn by the darkness in your soul, a demon
tormented you until you went mad and then
took possession of your body. The demon now
lies dormant within you. If you have Demon
Lord’s Companion, you begin the game with the
Possessed story complication. If you do not have
this book, simply gain 1d3 Corruption.
```

### Molekin — The Great Mother’s Brood

- **Entry Type:** Expanded Ancestry
- **Source:** The Great Mother’s Brood
- **Source Page:** 4
- **PDF Page:** 4

```text
Molekin
Characters
You can create a molekin character using the rules
in Demon Lord’s Companion 2. However, the following
method offers more detail to help you fully realize your
character in play. If you use these rules, be sure to use the
supplementary tables also presented here to determine
your starting profession, languages, and equipment.
Attribute Scores
You use the following attribute scores. You can adjust the
following scores as described in Shadow of the Demon Lord,
page 10.
Strength 11
Agility 9
Intellect 10
Will 10
Characteristics
You determine the values for your characteristics as follows.
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1/2, Speed 10, Power 0
Damage, Insanity, and Corruption 0
Languages You speak the Common Tongue and Molekin.
Professions Determine your starting profession using the
tables presented below.
Random Attribute Scores
If you prefer, you can generate a random set of
scores for your attributes. Roll four d3s, noting the
number rolled for each. You then add one number
rolled to the following base attribute scores:
Strength 9, Agility 7, Intellect 8, Will 8.
Molekin Traits
You have the following traits from your ancestry.
Darksight You can see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Deep Sense You are never at risk of becoming lost while
traveling underground.
Claws Your unarmed strikes deal 1d3 damage instead of 1
damage.
Nearsighted You make attack rolls against targets beyond
short range with 1 bane. You make Perception rolls and
other challenge rolls that involve seeing something
beyond short range with 1 bane.
Level 4 Molekin Expert
Upon reaching level 4, you gain the following benefit from
your ancestry.
Health Increase your Health by 5.
Additional Molekin Trait
In addition, you gain one of the following traits.
Spell You learn one spell from a tradition you have
discovered.
Burrower You can move at half Speed through solid
surfaces made from earth or sand by using your claws
to burrow through them. In earth and tight-packed sand,
you leave a tunnel behind you when you move in this
way. The tunnel is large enough to accommodate a size
1/4 creature.
Long Claws Your claws lengthen. Now, your unarmed
strikes deal 1d6 + 2 damage.
Violent Surge If you are neither slowed nor immobilized,
you can use an action to move up to half your Speed.
When you stop moving, each creature you choose
within your reach makes an Agility challenge roll with
1 bane. On a failure, the creature takes 3d6 damage.
If the damage causes the creature to become injured,
the creature takes 1d6 extra damage. Once you use this
trait, you must wait at least 1 minute before you can use
it again. You can use this trait a number of times equal
to half your level; you regain all expended uses after
completing a rest.
Molekin
Development
Typical molekin society produces individuals that might
be challenging to play and portray. Cleaving close to the
cultural norms described in the preceding pages can also
create challenges fitting the character into the rest of the
group, understanding that arrogance, selfishness, and
viciousness do little to endear one to one’s fellows. The
following tables help develop a character that’s more than
a caricature of a person originating from a troubled culture
and one who might genuinely seek to find a place in the
surface world.
Upbringing
Nearly all molekin begin their lives torn from their mothers
and raised in a creche, where they had to fight to survive.
The following tables explore this scenario but also present
other options that could explain why you are so different
from other molekin found underground. The Family table
describes the circumstances of your birth and upbringing,
the Homeland table offers possible places where you grew
up, and the Education table describes how and what you
were taught.
Family
3d6 Family
3
You hated your birthmother from the moment
you learned you had been taken away. When
you came of age, you consulted a diviner and
determined your mother’s identity. You tracked
her down, killed her, and ate her remains, leaving
only bones.
4–5
You were so small and frail, no one expected
you to survive your time in the creche. You were
smart, quick, and cunning, though, and by setting
your rivals against each other, you were able to
keep yourself fed and clothed.
6–8
You nearly died in the creche. You lacked the
strength to claim a portion of the food, and you
had nothing to wear. For some reason, though,
a fellow creche-mate looked after you and made
sure you survived. You never saw that molekin
again, but you realized there might be another
way to live.
9–12
Growing up in a creche hardened you, prepared
you for the difficulties you have faced in society.
You bear the physical and mental scars from your
upbringing with a mixture of pride and horror.
13–15
You had many creche-mates. You watched a few
die young, devoured by your fellows. You saw
others steal and abuse the rest. As much as it hurt
you to do so, you too were forced to fight and
scrabble for food. Though some time has passed,
you can’t seem to shake the memories.
16–17
Unheard of in most molekin communities, you
were raised by the molekin who birthed you and
thus escaped the terrors of the creche. However,
being saved from the brutality faced by most of
your kind left you ill-prepared for dealing with
your own people.
18
Another people found you and raised you as their
own. Perhaps a dwarf took pity on you or maybe
a troglodyte band kept you as a slave. Choose the
homeland based on the people with whom you
lived.
Homeland
3d6 Homeland
3
A troglodyte band ambushed your community
and took you, along with many others, prisoner
with the intention of eating you. You managed
to escape but left too many of your people in the
clutches of your captors.
4–5
You were born after your family fled their
ancestral home. You lived in dark tunnels with
enemies on all sides.
6–8
You grew up in Dark Furnace, an enclave under
the Fire Peaks that was destroyed in a brief and
terrible war against the salamanders.
9–12
You come from the Deepest Grotto, a medium-
sized community under the Northern Reach.
This place benefited from stability and a strong
military presence.
13–15
You were born in the Shadow Deep, a famous
molekin city under the Northern Reach at the
edge of the Desolation. Shadow Deep recently fell
to undead spawned in the wasteland that were
delving underground for a route into the Empire.
16–17
You lived in the Draco Empire, a vast underground
civilization ruled by a dragon. In your community,
the people worshiped the dragon as their god and
thus you knew nothing of the Great Mother.
18
Your ancestors fled to the surface long ago and
established a settlement in the valleys of the
Tumbledowns.
Education
3d6 Education
3
As much as you feared the priests of the Great
Mother, you hated them. They controlled
everything and could do whatever they wished
without fear of reprisal. You worked in secret to
destabilize their control. Add agitator or rebel to
your list of professions.
4–5
You had few capabilities that made you stand out,
so you found work laboring, hauling, and carrying
for the people in your community. Add laborer or
servant to your list of professions.
6–8
You joined the Tunnel Guard, a warrior society
charged with exploring the neighboring caves and
tunnels. Add guide, soldier, or spelunker to your
starting professions.
9–12
Like so many other molekin, you were forced
to work in the mines. Add miner to your list of
professions.
13–15
Your family avoided martial pursuits and instead
embraced commerce. Add artisan or merchant to
your starting professions.
16–17
The dominant faith of your community, such as
the Great Mother, swallowed your life. You studied
the rites and rituals of your faith. Add devotee or
heretic to your list of professions.
18
You studied magic, the occult, and subjects
forbidden to your people. Add the magic or occult
area of scholarship to your list of professions.
Background Event
A situation in your past helped shape the person you have
become. You can create an event of your own that explains
something about the way you act, look, or both, or you
can generate one randomly using the following table or
the Molekin Background table found in Demon Lord’s
Companion 2.
Background Event
d20 Event
1
You and your people fought a bloody war against
the dwarfs after skirmishes and raids finally
provoked an overwhelming attack that resulted
in the near annihilation of your settlement. You
survived, but hatred for dwarfs burns hot in your
heart.
2
While you patrolled the tunnels nearer to the
surface, you encountered adventurers who had
run afoul of a monster and became lost. They paid
you in gold and gems to lead them back to the
surface. What you saw when you looked out of
the cave prompted you to explore the world of
light and sky.
3
The priests saw an opportunity to profit
themselves by a nearby conflict fought between
salamanders and troglodytes. The molekin would
raid each settlement while their soldiers fought
each other. A few successful raids brought wealth
and resources, but also attention from both
peoples who, in a rare act of cooperation, joined
forces to wipe your people out. You got away, but
only just.
4
The priests exiled you after you were caught
stealing food from the cult’s stores. You were
lucky to escape with your life; normally, the
priests kill anyone who crosses them.
5
A rival sullied your name by spreading lies about
you, claiming you had a yerath lover you met
in the deep tunnels. Although wildly untrue, the
mockery you endured became unbearable and
so you left. You dream of punishing these people,
one day, proving yourself better than them all.
6
A tunneling worm of incredible size swallowed
you and dozens of others. You survived on the
offal found in the worm’s guts, but, one by one,
your fellows died, poisoned by the noxious
atmosphere. You escaped by wriggling through
the worm’s innards until you pulled yourself free
from its anus.
7
You were among a group of raiders who preyed
on surface dwellers. You were captured and kept
a prisoner for many years. You recently escaped
to find yourself lost in a strange, new world.
8
Not only did your true love set you aside for
another, you were also publicly shamed for
something you did or didn’t do. It was clear that
there was no place for you in your community.
9
A devastating quake collapsed the cave in which
you lived. You pulled yourself out of the rubble
and struck out to find a new home.
10
You were dissatisfied by an ordinary life. Seeking
something new, something different, you left your
people behind you and never looked back.
11
A blight ravaged your community, making
foodstuffs scarce. You ventured to the surface to
beseech the surface-dwellers for aid. When you
returned, you found your people had gone.
12
While roaming the surface at night, you broke into
a home to see what you could take. Unfortunately,
the owners were present and a fight ensued,
resulting in their deaths. You cannot return to the
underground lest you lead the vengeful humans
there, so you took off. You have come to regret
your actions and hope to make amends in some
way.
d20 Event
13
A group of surface dwellers in bizarre costumes
descended into the earth. You followed and
found they were headed toward a bad place, one
forbidden. You were able to lead these people
astray, until they became lost in the darkness.
However, their spirits have haunted you ever
since. You fled to stay ahead of them.
14
A strange monster encountered in the deep stung
you, and its venom knocked you unconscious.
When you awoke, you felt bloated, full even. A
few days later, something hatched inside your
body and ate its way free. You survived, but you
bear terrible scars, markings so awful that your kin
shun you.
15
In a flash of light, you appeared in a laboratory
where you met a flustered and apologetic wizard.
The summoner explained they had no intention of
stealing you away, but they didn’t know how to
send you back.
16
A striking molekin appeared in your dreams and
exhorted you to help them, claiming they were
being held prisoner in some dark and terrible
place. It’s been years and the visitor is probably
dead, if they ever existed, but you search for them
still.
17
You have no equal when it comes to metalwork,
or so you thought. During an expedition, you
encountered metalwork done by dwarf artisans
and their works put yours to shame. You set out
to learn from them but were rebuffed.
18
During a mining expedition, you and your fellows
broke through a wall into a long-buried temple.
Strange metal skeletons shook off the dust and
dirt to attack you and your fellows. You escaped
in shame of your terror.
19
A violent quake caused the ground in the caves
where you lived to collapse, tumbling away into
darkness. The sole survivor, you hope to establish
a new colony somewhere else.
20
You found a curious object, an idol of some ugly
thing. You kept the idol close to you at all times.
Sometimes, the idol moves. Other times, the idol
whispers obscenities to you.
Physical Features
Humanoid-shaped moles, only the hard of seeing would
mistake molekin for ordinary humans. Molekin share
certain physical traits in common, and their physical
similarities make it harder for others to distinguish one
from another, at least until they live among them for a time.
Differences can be minor, with different colored skin and
hair, for example, or considerable: huge incisors, starfish
noses, and hairlessness.
Age
Young molekin are lean and wiry, owing to the
hardscrabble experiences of fighting for milk and food.
Those of middle years become fleshy, almost bloated, while
the elderly molekin drop their weight and their features
vanish into a sea of wrinkles.
Age
3d6 Age
3
You are a whelp, newly weaned, but still small
enough to be overlooked.
4–5
You’ve lived a bit, grown a bit, and stand on the
cusp of receiving the rewards and punishments of
adulthood.
6–8
Your people acknowledge you as an adult, though
you remain trim.
9–12
Having reached adulthood, you likely have a great
deal of weight, broad features, and a wide mouth.
13–15
Your weight has begun to fall, and wrinkles have
started appearing on your body
16–17
Your hair tufts, if you have them, have turned
white, your body appears bent, and you are a
mass of wrinkles.
18
You have almost reached the end of your life—and
it shows; your body is wrinkled and feeble. Your
claws have become brittle, and you’re missing
teeth. You have dizzy spells and empty spots in
your vision.
Appearance
Molekin have the same range of skin colorations found
among humans, but the most common colors are pink,
almost white, brown, and piebald. Tufts of hair grow
from their body, and some believe that the placement of
these tufts reflects the individual’s character. For example,
molekin with tufts growing from their heads are seen as
clever and cunning, while those with tufts growing on their
arms are believed to be indolent.
Appearance
3d6 Appearance
3
You have the stocky body of other molekin, but
you come from an offshoot, made distinct by
your hairless nose fringed by two dozen fleshy
tentacles, each measuring no more than a few
inches. You have short, coarse fur.
4–5
You have a slender body, small eyes, and pointed
nose.
6–8
Somewhat slighter and smaller than the typical
molekin, you nevertheless share the common
physical characteristics.
9–12
You have a squat, heavy body, broad head with a
wide, toothy mouth. Light fur covers your body.
13–15
You have a large, heavy body, covered in velvety
fur. Long whiskers extend out from the sides of
your face.
16–17
You have no body hair whatsoever, and your flesh
sags into wrinkled flaps. You have tiny eyes set
deep in a head dominated by your snout.
18
You have a big, blocky body, hairless with tiny
eyes and a big mouth fronted with long incisors.
Giant Bugs and Molekin
Insects of considerable size infest the deeper
depths of the subterranean realms. Such insects
include beetles and roaches, giant cave crickets,
centipedes, and more. Molekin domesticate these
creatures and use them as livestock, for labor, or
as mounts. For these creatures, use stat-blocks
for monsters, granting them additional traits as
needed to convey their unusual capabilities.
Distinctive Traits
You likely have some physical quality or mannerism
that helps you stand out from other molekin. Such traits
usually have no bearing on your capabilities but offer you
a descriptive element you can use when introducing your
character to other players.
Distinctive Traits
d20 Distinctive Trait
1
You have scars all over your body. These might
have come from a rough upbringing or a near-
lethal encounter with some deep-dwelling
monster.
2
One claw on each hand and foot is 1d6 inches
longer than the others.
3
Your incisors grew so large that they stick out
from your face even when you have your mouth
closed.
4 You have a big, sagging belly and wide flanks.
5 You have uncommonly short, stubby limbs.
6 You have a furry tail.
7
You have no eyes at all and instead perceive
everything around you out to a short distance.
You can even sense invisible creatures in this
range. Beyond short range, you count as if you
were blind.
8
You lack ears; you have small earholes protected
by extra skin.
9
If you don’t have them already, you have tentacles
fringing your nose. If you have tentacles, they are
longer than normal.
10 You have a stooped, cringing posture.
11
You have a deep, raspy voice or a high-pitched
squeaky one.
12
You have strange, bony nodules breaking through
your skin.
13
You have weird body markings across your torso.
Sometimes they shift around, move to different
positions, and adopt different shapes.
14 You have a foul odor: milk, rot, or feces.
15
No matter how much you scrub, you always seem
dirty, as if you had just dug yourself out of the
ground.
16
You have a voracious appetite. You seem to
always be snacking on roots and bugs.
17
When you become angry, you hiss and spit like a
cat.
18 You have an unusual bulge on your back or side.
19
You have a wide, yawning mouth filled with an
extra row of teeth.
20
Your skin, fur, or both have a color or pattern
unusual to other molekin. You might be green,
blue, or even covered in spots.
Personality
Your molekin character could have any personality you
like. The character might behave a lot like you do or
be completely different. If you need help developing a
personality, you can use the tables here to generate a
personality you can use for your character.
Dependability
3d6 Dependability
3
I go out of my way to cause trouble for others. I
make promises and break them. I betray alliances
and do my best to destroy everyone around me.
This way, I can have whatever I want.
4–5
In the creche, you do what you must to survive. I
look after myself—to hell with everyone else.
6–8
I’ve been betrayed so many times, it’s hard for me
to commit to anything. I’d rather go my own way
and rely on myself if I can.
9–12
For a long time, I thought friendship and
connection were vulnerabilities. I’m trying to
overcome this, and I make an effort to follow
through on what I say I will do.
13–15
My people know nothing of friendship or
connection, but I have come to know them and
cherish the people I have met. I am a loyal and
reliable companion.
16–17
I turned my back on my people’s selfishness.
I would do anything for my friends, and I
sometimes help strangers in need.
18
I do whatever I say I will do. My word is my honor,
and honor is my life.
Sociability
3d6 Sociability
3
I don’t give people time to stab me in the back. I
stab them in the front, first.
4–5
My whole life, I have been beaten, robbed,
betrayed. Making friendships only makes me
vulnerable.
6–8
I distrust almost everyone and prefer my own
company. I make friends slowly and socialize with
them only.
9–12
I have learned to set aside my mistrust and
engage with other people.
13–15
I find other people interesting and engage in
social activity when I can in order to learn more
about them.
16–17
After I realized that not everyone subscribes to
the views my people hold, I accept that there
could be another way to live. I have let down my
guard and now enjoy being around other people.
18
I dread being alone. It reminds me too much of
the life I escaped. I stay around people as often as
I can.
Outlook
3d6 Outlook
3
What’s left of the world belongs to those with
the strength to take it. The sooner you learn this
lesson, the better off you will be.
4–5
I don’t trust anyone. People serve their own
interests first and foremost. If I let down my
guard, they will find a way to hurt me.
6–8
Life is nasty, brutish, and short. I make the most of
what I have, for as long as I can have it.
9–12
I see the darkness in the world, but I still see
glimmers of light. I try to be part of that light and
leave the world better off than how I found it.
13–15
Life gives you no guarantees. But that shouldn’t
be cause for despair. We have to make the most
of what we have.
16–17
My situation could always be worse. I choose
to look on the bright side of things and reject
darkness.
18
I don’t believe any of those stories about the
world ending and all that nonsense. We live in
amazing times, and I am excited to do my part in
making the world a better place.
Receptivity
3d6 Receptivity
3
If it works, why change it? People keep trying to
improve on things and yet never realize that by
meddling with it, they risk breaking it.
4–5
I do things the way I do; and others had best mind
their own business.
6–8
I’m reluctant to change, but I am willing to listen
to new ideas.
9–12
I do things a particular way, sure, but I can change
my behavior when I need to.
13–15
I seek constant improvement. I want to grow,
experience, and live.
16–17
I can’t stand the humdrum routine of life. I rarely
stay in one place for long and try to shake up my
days and nights to keep things interesting.
18
No one controls me. I do as I want. I think I’m a
free spirit, even though others call me whimsical,
wild, and foolish.
Affability
3d6 Affability
3
I have nothing to say. Even if I did, it wouldn’t
make a difference.
4–5
I prefer to listen rather than fill the air with my
talk. I’m glad to share my knowledge and opinions,
but only if asked.
6–8
I avoid attracting attention to myself. When I do
speak, I do so to people I trust. Often, I will shut up
when someone else speaks.
9–12
I’ll speak when I need to, and I know when to keep
quiet.
13–15
I thrive in social situations and enjoy attention.
I’ll talk with almost anyone and on any subject. I
sometimes get carried away.
16–17
I have something to say about everything, and
I’ll share it with you whether you ask or not. I can
dominate conversations.
18
I’m such a talker that I can be too much for some
people. I tend to be loud, and my voice carries. I’ll
talk over other people, interrupt, and give advice
even when it’s clear no one wants it.
Morality
3d6 Morality
3
I will do anything I have to do to survive, even
if it means hurting other people. Sometimes, I
think I enjoy hurting them, and I’m not sure if this
troubles me.
4–5
I have spent my whole life looking after myself. I am
not about to change that now.
6–8
It’s difficult for me to put others’ needs ahead of
my own. I try when it matters, but I fall back on my
old ways of doing things more often than not.
9–12
I recognize the value in doing good and strive to
be a better person. I don’t always succeed.
13–15
I left behind the selfishness, greed, and cruelty of
my people and embrace the ways of others.
16–17
I help others as often as I can. I have done terrible
things, things I will never forget, but I hope to
atone for my past through virtue in the present.
18
My entire life has become focused on serving
others. I expect nothing in return, other than the
satisfaction that I helped.
Molekin Names
Molekin have single names, usually with one syllable.
Communal upbringing dispenses with the need for
molekin to have family names. If they mingle with other
molekin, they might use the name of their community as a
second name, such as “of Dark Furnace” or “of Black Pit.”
Famous molekin might gain additional appellation. For
example, a molekin who has eaten many whelps might be
called “Shad, Devourer of the Young,” while another who
traffics with demons could be called “Aag, Binder of Hates.”
Use the following table to generate a random primary
name.
Molekin Names
d20 Profession
1 Bol
2 Cacen
3 Derg
4 Fung
5 Gren
6 Gorp
7 Heep
8 Kimp
9 Llerg
10 Memn
11 Nerval
12 Picka
13 Slep
14 Teed
15 Tood
16 Umn
17 Vaash
18 Xed
19 Yd
20 Zoot
Molekin Professions
Nearly all molekin begin their lives in subterranean
communities. From their time in these places, molekin
learn techniques for survival and exploration. In addition
to the profession gained from your Education table result,
roll a d20 and find the result on the Molekin Professions
table.
Molekin Professions
d20 Profession
1 Breeder or Seed Giver
2 Bug Herder
3 Creche Keeper
4 Cricket Rider
5 Cultist of the Great Mother
6 Dabbler in the Dark Arts
7 Dwarf Hunter
8 Enclave Guard
9 Envoy
10 Fungal Farmer
11 Gem Cutter
12 Glue Maker
13 Laborer
14 Miner
15 Prospector
16 Spelunker
17 Tale Teller
18 Trader
19 Veteran of Many Battles
20 Wanderer
Starting Equipment
Molekin adventurers begin with whatever items they
can scavenge, steal, or borrow. If you were raised by a
culture and people other than the ones described here,
you can determine your starting lifestyle by normal
means. Otherwise, you begin the game with the following
equipment.
Clothing: You have a suit of armor (as soft leather armor)
made from insect leather, which you wear over simple
clothes.
Weapons: You have a club, spear, javelin, or staff.
Gear: You have a backpack, spare set of clothes, waterskin,
dry rations for about 7 days, and 2d6 cp.
Interesting Thing: You begin the game with one
interesting thing. You can use whatever tables you like
to determine its nature, including the one that follows.
Molekin Interesting Things
d20 Interesting Thing
1 A pouch containing 1d6 giant cricket eggs.
2 A pound of sand that, when mixed with water and
dries, hardens until it becomes like rock.
3 The skull from one of your creche-mates.
4 A bladder full of fermented molekin milk.
5 A sack filled with tasty mushrooms.
6 A helmet made from a giant cave cricket head.
7 A sword that makes a faint humming noise when
brought to within medium range of an elemental.
8 A mild addiction to psychotropic mushrooms.
9 A nasty scar given to you from one of your creche-
mates.
10 A necklace of incisors taken from rival molekin you
have slain.
11
A chunk of crystal that glows while in total
darkness. The light it radiates turns darkness within
short range to shadows.
12 The burning heart of a dead salamander contained
in a bronze cage.
13 A collection of beards shorn from dwarfs you have
defeated in battle.
14 A nasty skin condition.
15
Steel caps to wear on the tips of your claws.
Wearing the caps causes your unarmed strikes to
deal 1 extra damage.
16 A cloak made from dead beetles.
17 An egg from an unknown creature. Good eats or
new pet?
18 A dozen shrunken troglodyte heads, the hair of
each tied in a knot.
19 A gleaming battleaxe stolen from a dwarf’s tomb.
20 A big gemstone worth 10 gc.
```

### Molekin — Demon Lord's Companion 2

- **Entry Type:** Standard Ancestry
- **Source:** Demon Lord's Companion 2
- **Source Page:** 9
- **PDF Page:** 10

```text
Molekin
Long ago, the molekin excavated their homes
from the roots of the Firepeaks, a range of volcanic
mountains that forms the western border of the
Desolation. Most comfortable in the depths of the
earth and scornful of others, they built an empire
in the darkness and have ruled their dominion
unmolested for eons.
Yet now the dark times of the world have reached
even the molekin. Monsters from below, troglodytes
and others, have come boiling up from the deep
places, bent on slaughter. With nowhere left to
turn, the molekin have been forced to make their
way to the surface until they can find new homes
for themselves—which is no small challenge, since
these creatures despise most other peoples.
Ugly Delvers: By human standards, molekin
are ugly, typically standing 3 feet tall with fleshy
bodies that weigh around 130 pounds. Molekin
have wide faces with overlarge noses and small,
beady eyes, and pink, brown, or gray skin tufted
with long white hair. Their hands end in curling
claws, suitable for digging through earth and stone.
Most wear leather clothing crafted from the skins
of subterranean creatures.
Rule of the Strong: Molekin society permits—
even encourages—the strong to take from the weak.
Molekin believe that power belongs to those who
can hold on to it, and among themselves the most
dominant enforce their will by brutally oppressing
their inferiors. For many, this attitude also affects
their dealings with outsiders. Some molekin
believe themselves superior to other peoples and
come off as incredibly arrogant in social situations.
A few molekin are so accustomed to taking what
they want that they pursue criminal professions in
the world above, honing the talents they need for
making off with food, water, coins, children, or other
possessions they decide they want.
The Great Mother: All molekin worship a dark god
they call the Great Mother. Depictions show her to be
an enormous, bloated mole reclining on the crushed
bodies of her verminous offspring, the young suckling
on her many rows of teats. Molekin believe they
sprang from her cavernous womb, spilling into the
world like a flood. Afterward, they dug into the earth
in the expectation of returning to her, and now have
spent generations delving deeper and deeper in hopes
of finding the comforting moistness of their creator.
Priests of the Great Mother have access to the Earth,
Metal, and Shadow traditions.
Common Names: Bol, Cacen, Derg, Fung, Gren, Heep,
Kimp, Memn, Nerval, Picka, Slep, Teek, and Zoot.
Creating a Molekin
Attribute Scores Strength 11, Agility 9, Intellect 10, Will 10
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1/2, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common Tongue
and Molekin. Add miner to your list of professions.
Darksight You can see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit areas.
Claws Your unarmed strikes deal 1d3 damage instead of
1 damage.
Deep Sense You cannot become lost while traveling
underground.
Nearsighted When you make an attack roll against a
creature beyond short range, you make the attack roll
with 1 bane. As well, you make any roll that involves
seeing anything beyond short range with 1 bane.

10
Level 4 Molekin Expert
Characteristics Health +5
You either learn one spell or gain Burrower.
Burrower You can dig through earth or sand, moving at
half Speed. You leave behind a tunnel large enough to
accommodate a Size 1/4 or smaller creature.
Molekin Age
3d6 Age
3
You are a child, 6 years or younger. Your Size is
1/4. Halve your height and weight. After 1d6 years,
your Size becomes 1/2 and you double your height
and weight.
4–5 You are an adolescent, from 7 to 12 years old.
6–8 You are a young adult, from 13 to 24 years old.
9–12 You are an adult, from 25 to 36 years old.
13–15 You are a middle-aged adult, from 37 to 48 years old.
16–17 You are an older adult, from 49 to 56 years old.
18 You are a venerable adult, 57 years old or older.
Molekin Build
3d6 Build
3 You are short and either thin or heavy.
4–5 You are heavy.
6–8 You are short.
9–12 You are of average height and weight.
13–15 You are tall.
16–17 You are thin.
18 You are tall and either thin or heavy
Molekin Appearance
3d6 Appearance
3
You are hideous. You have broken teeth, and your
mottled pink body is covered with scabs.
4–5
Your flesh is gray and speckled with angry red
spots. You have runny eyes, and you lack body hair.
6–8 You are plain and uninteresting by molekin standards.
9–12 You look like most other molekin.
13–15
You have an interesting feature that makes you
stand out from other molekin.
16–17 You are clean and unblemished.
18
You have a thin coat of fur all over your body, and
you lack the blemishes that afflict many of your kind.
Molekin Personality
3d6 Personality
3
You have grand ambitions. You plot world
domination and the total subjugation of all people.
4–5
You despise other peoples and look after your
interests first. You are not above harming others
to get what you want.
6–8 Secretive and sneaky, you keep to yourself.
9–12
You don’t much like other people, especially if
they’re not molekin like you. You come off as
aggressive and insensitive.
13–15
Other people have their uses. You make alliances
when it suits you.
16–17
Other people interest you, so you set aside your
natural distrust to find out more about them. You
can be seen as patronizing and condescending,
however.
18
You value others and seek to make friends of those
you meet. You try to keep your word and do right
by others.
Molekin Background
d20 Background
1
You had a torrid love affair with a devil. Gain 1d3 +
1 Corruption.
2
You sold out your clan to troglodytes. Gain 1d6 + 1
Corruption.
3
The Great Mother visited you in your dreams.
You ventured to the surface to seize your destiny.
4 You murdered a rival in cold blood. Gain 1 Corruption.
5
You developed a foul infection in your skin that left
you covered in lesions, marring your appearance.
6
You were driven out from your community after
you denied the Great Mother’s existence.
7
A horrifying monster followed you home and
nearly killed everyone in your nest.
8
You had a dozen children and ate five of them
before you were dragged away and exiled by the
other molekin. Gain 1 Corruption.
9 You lost a finger, an eye, or a few teeth.
10 You toiled in the mines, as do most of your kind.
11
You got married and had an ocean of children.
Then you ran away from your responsibilities.
12
You found a vein of silver and kept its existence a
secret from your people.
13
You have traveled extensively. You can speak an
additional language.
14
You received an education. You can read and
write the languages you can speak.
15
You helped fight off a troglodyte attack and were
considered a hero by your people.
16 You helped oust a tyrant from your community.
17
You found a place among the dwarfs or
salamanders. Add Dwarfish or Firespeak to the list
of languages you can speak.
18
You found an underground complex filled with
treasure and terrifying things. You think you
remember the way back to this place.
19
You were among the first to leave your tunnels
and seek a place in the world above.
20 You came into money. Start the game with 2d6 cp.

11
```

### Naga — Guardians of the Cosmic Egg

- **Entry Type:** Expanded Ancestry
- **Source:** Guardians of the Cosmic Egg
- **Source Page:** 4
- **PDF Page:** 4

```text
Naga
Characters
Demon Lord’s Companion 2 contains the basic information
about the naga ancestry. You can use those rules to create a
quick character, or you can use the ones below to build one
with a great deal more detail and grounding in the world.
Attribute Scores
The following option lets you randomize your starting
attribute scores. If you prefer, you can just use the standard
array, which has been included parenthetically.
To determine your starting attribute scores, either use the
ones presented below or randomize them using the method
that follows.
Strength d3 + 7 (9) Agility d3 + 8 (10)
Intellect d3 + 8 (10) Will d3 + 9 (11)
Characteristics
You have values for characteristics as follows.
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 8, Power 0
Damage, Insanity, and Corruption 0
Languages You speak the Common Tongue and Naga.
Professions Use the Naga Professions table to randomly
generate your starting profession instead of the ones
found in Shadow of the Demon Lord.
Naga Traits
You have the following traits from your ancestry.
Magic You discover any one tradition.
Serpentine You cannot run. You make challenge rolls to
jump or leap with 1 bane. You impose 1 bane on rolls to
move you or knock you prone, and you make rolls to
avoid being moved or knocked prone with 1 boon.
Venomous Bite Any time you attack with an unarmed
strike, you can choose to use your fangs for that attack.
After a successful attack roll, in addition to the normal
effect, a flesh-and-blood target must make a Strength
challenge roll. If the target gets a failure, it becomes
poisoned for 1 minute. At the end of each round it
remains poisoned, the poisoned target makes a Will
challenge roll; on a failure, the target gains 1 Insanity.
Naga Professions
d20 Professions
1 Maker of Things
2 Apothecary
3 Hunter or Fisher
4 Educator of Hatchlings
5 Colony Guardian
6 Builder
7 Historian
8 Envoy
9 Gatherer
10 Acolyte of Shavra
11 Creche Keeper
12 Gatherer of Foods
13 Singer or Storyteller
14 Prophet
15 Weird Scientist
16 Worker or Laborer
17 Community Elder
18 Seer of the God’s Face (gain d3 Insanity)
19 Corrupted and Fallen (gain 1 Corruption)
20 Exile
Level 4 Naga Expert
Upon reaching level 4, increase your Health by 5 and
choose one of the traits that follow.
Invoke the Cosmic Egg You can use an action, or a
triggered action at any point during your turn, to invoke
the power of the Cosmic Egg. Supernatural awareness
fills your mind for 1 minute. The awareness imposes 1
bane on attack rolls made against you, grants 1 boon
on your challenge rolls to resist harmful effects, and
enhances your vision. You recognize visual illusions for
what they are, and you can see invisible creatures and
objects within the range of your vision. You can use this
trait a number of times per day equal to 1 + your Power
score. You regain expended uses when you complete a
rest.
Magic You learn one spell from a tradition you have
discovered.
Slippery Movement While you are not injured, you prevent
enemies from making free attacks against you when
triggered by your movement.
Wicked Fangs Your fangs lengthen until they emerge from
your mouth. When you use them to make an unarmed
strike, you make the attack roll with 1 boon, and your
attack deals 1d6 extra damage. In addition, you impose 1
bane on challenge rolls made to resist your venom.
Naga Development
As nagas began exploring the world outside their hidden
community only in recent days, you most likely grew up
on one of the Serpent’s Scales and spent most of your
life there. Use the following information to explore your
character’s origins and build the life they led prior to their
adventuring career. As you have charge of your character,
look at these paragraphs as sources of inspiration only. You
decide your character’s origins.
Life in a Naga Community
Excepting those nagas born in lands outside Ajra-Dah, no
naga knows their parentage. The Creche Keepers gather up
eggs and bring them to a communal place for protection
until the eggs hatch. Young nagas pass from the Creche
Keepers’ care to a communal home where educators feed,
clothe, and instruct them.
Educators undergo rigorous training, both to prepare
them for the work, but also to weed out those lacking the
qualities to adequately prepare the young for their future
roles in naga society. Though they tend the hatchlings and
teach them throughout their first years, educators keep an
emotional distance between themselves and their charges
to ensure no inappropriate bonds form. Any emotional
connection could stunt the young’s development.
In the first few years, educators identify the hatchlings’
talents by exposing them to all manner of subjects, from
history to magic, religion to the crafts. The educators sort
their charges into different professional paths. Youngsters
can choose a different option if they like, but most follow
the educators’ guidance.
Adolescence marks the moment when young nagas
become apprentices to learn specialized skills of use to the
colony. The community expects industriousness in their
apprentices and permits no foolishness or play. Nagas who
find themselves in trouble learn to avoid making the same
mistakes again after a touch from a shock lance (see Naga
Technology). Once they demonstrate proficiency in their
trade, the young nagas earn their places as full members of
their community.
Nagas form bonds with whomever they like. Connected
nagas share living spaces and form communities of their
own. Matters of sex give no cause for jealousy or rivalry.
They see reproduction as a necessary part of keeping their
community alive, but few take real pleasure in the act.
Nagas believe age breeds wisdom and thus afford the
elders in their community great respect. Often, elders who
find their work too difficult take charge of the apprentices
and draw upon their experience to train the ones who
will replace them. When the elders grow too old and too
infirm, they withdraw from the community into the care of
the priests. In time, the priests send their charges’ souls to
Shavra so they can be reborn.
Pivotal Event
Typical nagas live their entire lives within the bounds of the
islands of the Serpent’s Scales. Leaving Ajra-Dah requires
some egregious act that earns exile or special dispensation
from the priests to represent the colony to others. Use the
following table to explain how you made your way into the
world.
Naga Pivotal Events
d20 Pivotal Event
1–4
You broke or damaged a relic, violated a taboo, or
harmed another naga. Your people cast you out.
5–8
Enemies invaded your island and slaughtered your
community. You were among the survivors and
search for the rest of your people.
9–12
You joined an entourage sent out to broker peace
with a different people.
13–16 You snuck off to seek your fortune in the world.
17–20
You secured permission to scour the lands
for naga relics. You travel widely in hopes of
discovering some lost treasure.
Naga Physical
Traits
All nagas share the same general physical traits but
show great variation in the details. Facial structure, scale
patterns, tail length, and more make nagas individuals and
discernable from one another. You decide your character’s
appearance, but you can use the following tables to inspire
you.
Naga Aging
Only extraordinary circumstances see the very young or
the very old leave their communities. The young focus on
education, while the old teach or withdraw when their
ailments grow too great.
Nagas can live up to 120 years. As they age, their scales
become dull. Their skin hangs loose from their bodies.
Rheumy eyes, missing teeth, and bent posture signal
advanced years.
Starting Age
3d6 Age
3
You hatched from the egg just over ten years ago.
At the campaign’s start, halve your Size, height,
and weight. After 1d6 years, you reach adulthood,
which doubles your Size, height, and weight.
4–5
Young, you have lived up to 18 years old. You
have little experience yet, but greatness awaits.
6–8
You have lived long enough for your people to
consider you an adult. You can be up to 30 years
old.
9–12
You belong to the adult population, but you have
lived long enough to gain a bit of wisdom. You are
up to 50 years in age.
13–15
You begin to feel the weight of your years upon
you, though you remain able and fit. You are up to
70 years old.
16–17
Most of your life now lies behind you, and it shows
in your wrinkled appearance and somewhat
stooped posture. You are up to 90 years old.
18
You have outlived almost all of your peers
and count yourself as one of the last of your
generation.
Appearance
As humans vary greatly in appearance, so too do nagas.
Differences show up in height and weight, scale color, the
presence or absence of patterns in their scales, the number
and arrangement of their horns, as well as the difference in
facial features, builds, posture, and more.
Your character’s general appearance has no bearing on
their capabilities, but you might benefit from using your
appearance to suggest your character’s profession and,
eventually, path. Use the Distinctive Qualities table to help
make your character an individual.
Distinctive qualities
d20 Trait
1
Your serpent nature has a strong presence in
your facial features. Your head looks more like
a snake’s and has little in common with human
features.
2
You stand a bit shorter than other nagas, on the
very low end of average height.
3
You have a dozen or more horns growing from
the top of your head. They grow in different sizes,
some being quite small, like teeth, others large.
4
Your tail ends in an appendage that you can rattle
in the manner of a rattlesnake.
5
You were born with an unusual mutation. You
have legs instead of a tail.
6 You have black, green, or brown scales.
7 Your tail splits into two right before it ends.
8
The horns growing from your head have the
appearance of crystals. When you use magic, they
glow.
9
You have numerous scars all over your body. You
might have suffered from some mishap or fought
in battle.
d20 Trait
10
You have no real distinguishing traits; nothing
about you stands out.
11
Your scales form a colorful pattern, shapes, or,
eerily, words.
12
From your fingertips, you grow long, curling
talons. They are sharp enough that, when you
attack with them, they use the rules for knives
(Shadow of the Demon Lord, Chapter 6).
13 Your eyes seem to shine in the shadows.
14
You have a single horn emerging from the center
of your forehead.
15
You have an extra arm or extra digits on your
hands.
16
Your tail ends in a sharp spike—unarmed attacks
using it deal 1d3 damage.
17
You have brightly colored scales in red, yellow, or
white.
18
You have just two horns growing out from your
scalp.
19
You have a large body and big frame. You could
be muscled or corpulent, as you choose.
20
Some latent quality found in some nagas revealed
itself in your striking form. You have golden
scales and gleaming eyes. Oddly, you have small,
vestigial wings growing from your back.
Naga Personality
As with any person in Rûl, nagas comprise a wide range of
personalities and motivations. Their communities focus on
survival, cooperation, personal improvement, and service
to their goddess. These values can play a part in developing
your character’s personality.
If your character developed apart from the naga
settlements or broke with them, your character might
develop different values, possibly adopting those of the
people with whom they spend all their time.
The following table revises the one included in Demon
Lord’s Companion 2.
Naga Personality
3d6 Personality
3
You put yourself first in almost all situations. You
shake off obligations and pursue objectives that
help you. You also might have a malicious streak
or carry out evil activities.
4–5
You consider your people superior to all others,
and you might even see yourself as better than
other nagas. People find you arrogant and off-
putting. You sometimes act in a cruel manner
since you don’t see any point in being nice to
people less than yourself.
6–8
You find it difficult to connect with other
people, which makes you seem cold, aloof, and
disinterested in other folks. You have trouble
discerning people’s motives.
9–12
You exemplify your community’s ideals. You work
to improve yourself, you help the people closest
to you, and you sacrifice if needed to ensure the
comforts of your people.
3d6 Personality
13–15
You have an addiction to a mild sedative, or you
might just be flighty, easily distracted. Few people
take you seriously.
16–17
You believe goodness lies within all people.
You make it your work to help them overcome
their selfishness and live in the light. You can be
overbearing about your beliefs at times, but you
mean nothing by it. You just want to help people
become the best versions of themselves.
18
You are aggressive, wild, and intense. When you
choose a goal, you pursue it all costs. You have no
time for foolishness or silly behavior. There’s work
to be done, and it’s time to get on it.
Naga Names
Until they reach adolescence, nagas lack names. Only when
they begin their training do they choose the names by
which others know them.
Names might have specific meanings in their tongue
to reflect their physical or personality traits. Communal
upbringing eliminates the idea of family name. Instead,
nagas from a community share the same surname: the
name of their island. In cases where multiple nagas share
the same names, they might gain additional appellations,
such as Hithrik the Younger and Hithrik the Small, both of
Hymrea.
Naga Names
d20 Individual d20 Community
1–2 Cecere 1–4 Eshatha
3–4 Eshream 5–8 Hymrea
5–6 Hithrik 9–12 Ishish
7–8 Iyolyn 13–16 Salsaras
9–10 Mersseth 17–20 Valoss
11–12 Sisthra
13–14 Sossfuss
15–16 Thyrin
17–18 Ushkeck
19–20 Zaeze
Starting Equipment
Naga communities outfit their people with the gear they
need to make their way in the world. If you were exiled
or grew up somewhere else, use the normal rules for
generating your starting equipment. Otherwise, you have
the following items.
Clothing: You have a suit of armor (as hard leather) made
of thin layers of tree bark glued together and shaped to fit
your body.
Weapons: You have a club, spear, javelin, or staff.
Gear: You have a backpack, a spare tunic to cover your
upper body, a cloak, dry rations enough to last you for 7
days, and 2d6 cp.
Interesting Thing: You have an interesting thing.
Determine its nature however you like, such as using the
table below.
Naga Interesting Things
d20 Interesting Thing
1
A small metal box that makes a pinging noise
every now and then.
2
A cookbook written in Naga that describes 100
different ways to prepare mice and rats.
3 A scale from a dead or lost loved one.
4 A medal bestowed by your educator.
5 A wavy dagger with a jeweled pommel (1 gc).
6 A harmless pet snake (Size 1/4).
7 A few scalps from slain sailors.
8 A scrap of metal with odd writing on it.
9 A magnifying glass.
10
A small box from which a voice sometimes
sounds.
11 A shard of crystal that emits faint light.
12 A sword forged from green metal.
13 A 1-yard-square map of some strange land.
14 The voice of Shavra in your head.
15 A shield polished to a mirror finish.
16 A necklace of fingerbones.
17 Every shedding of your skin.
18 A tiny idol of the Unspeakable One.
19 A porcelain mask.
20 An incantation of a rank 1 spell of your choice.
```

### Naga — Demon Lord's Companion 2

- **Entry Type:** Standard Ancestry
- **Source:** Demon Lord's Companion 2
- **Source Page:** 11
- **PDF Page:** 12

```text
Naga
The Great Vault of Sekan, a holy temple
hidden on a remote island, was built
to house the Shedding, an enormous
serpent skin on which has been written
the history of the nagas. Much of the
writing has faded over the millennia, and
with it the lore of these reclusive people.
Enough evidence remains to tell the story
of how the nagas came to Urth eons ago,
having escaped the ruin of their world,
carrying with them the Cosmic Egg, the
last offspring of the Divine. Rather than
finding an empty world, they discovered
one filled with warring peoples, with cruel
faeries and wicked trolls, savage humans,
and countless others vying for dominance
over a war-torn landscape.
Rather than take part in the struggle, the
nagas hid themselves in the jungles on the
islands east of Rûl, using magic to keep
themselves and their works concealed.
For generations, they stayed out of view,
keeping their customs and protecting
what remained of their civilization, and
they might have continued to do so had
not the Demon Lord’s shadow begun to
creep across the lands. Having escaped
destruction at the Demon Lord’s hands
before, the nagas realized that if they did
not join the struggle against the shadow, it
would consume them as well as the rest of
the world. So, nagas have begun to emerge
from their hidden crèches to take their
part in defending their adopted world.
Serpentine Humanoids: Nagas combine
the features of humans and snakes, with
humanoid upper bodies and lower bodies
that taper into long, snake-like tails. Fine
scales of green, red, or brown cover their
upper bodies, and small horns crown their
heads, but they would otherwise appear
human if not for having a tail instead of
legs, which provides them locomotion in
the manner of a snake.
The God Incarnate: Nearly all nagas
worship a being known as Shavra, the
Light in the Void. The nagas protect their
god, whom they believe waits inside the
Cosmic Egg, which is kept hidden in a
place known only to the highest-ranking
priests. The nagas wait for the day when
Shavra hatches from the Egg to lead their
kind to a paradise where they can live

12
without fear of annihilation. None know exactly
when the Egg will hatch, but the nagas believe the
time is at hand. Priests of Shavra have access to the
Celestial, Order, and Protection traditions.
Students of Magic: All nagas have the ability to
work magic in at least small ways. Many see their
magical abilities as a gift from Shavra and pledge
their lives to serving their god, while some seek
other kinds of arcane knowledge, delving into the
magical arts and mastering them. Even those who
choose other paths retain this innate ability and
weave magic into whatever talents they develop.
Common Names: Cecere, Eshream, Hithrik,
Iyolyn, Mersseth, Sisthra, Sossfuss, Thyrin, Ushkeck,
and Zaeze.
Creating a Naga
Attribute Scores Strength 9, Agility 10, Intellect 10, Will 11
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 8, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common Tongue
and Naga, the tongue of the nagas.
Magic You discover one tradition of your choice.
Venomous Bite When you make an unarmed strike, you
can attack with your fangs. A success on your attack
roll against a living creature forces the target to make
a Strength challenge roll. A failure on the challenge roll
indicates the target becomes poisoned for 1 minute. At the
end of each round a target is poisoned in this way, it must
get a success on a Will challenge roll or gain 1 Insanity.
Level 4 Naga Expert
Characteristics Health +4
You either learn one spell or gain Invoke the Cosmic Egg.
Invoke the Cosmic Egg You can use an action, or a triggered
action on your turn, to invoke the power of the Cosmic
Egg. For 1 minute, you impose 1 bane on attack rolls made
against you, and you make challenge rolls to resist attacks
with 1 boon. In addition, you recognize illusions for what
they are and can see invisible creatures and objects within
the range of your vision. You can use this talent a number
of times per day equal to 1 + your Power score. You regain
expended uses when you complete a rest.
Naga Age
3d6 Age
3
You are a child, 10 years or younger. You are Size
1/2. Halve your height and weight. After 1d6 years,
your Size becomes 1 and you double your height
and weight.
4–5 You are an adolescent, from 11 to 18 years old.
6–8 You are a young adult, from 19 to 30 years old.
9–12 You are an adult, from 31 to 50 years old.
13–15 You are a middle-aged adult, from 51 to 70 years old.
16–17 You are an older adult, from 71 to 90 years old.
18 You are a venerable adult, 91 years old or older.
Naga Build
3d6 Build
3 You are short and either thin or heavy.
4–5 You are heavy with a thick tail.
6–8 You are short with a shortened tail.
9–12 You are of average height and weight.
13–15 You are tall, with a long, sinuous tail.
16–17 You are thin, with a slender tail.
18 You are tall and either thin or heavy.
Naga Appearance
3d6 Appearance
3
Your face is a nightmarish blend of human and
serpent qualities, all twisted and warped.
4–5
Your head appears to be that of a serpent.
You have no human features.
6–8
You have few distinguishing qualities and appear
plain by naga standards.
9–12 You are average-looking.
13–15 You have noble features and bearing.
16–17
You have a striking appearance, with a comely
face and a body covered in glittering scales.
18
Your appearance makes the hearts of people who
see you ache. Appealing to almost all peoples,
you have flawless facial features, a taut body, and
scales of bright gold.
Naga Personality
3d6 Personality
3
Malicious and thoroughly evil, you act only to get
what you want or to advance your goals.
4–5
You are cruel, unkind, and arrogant. You believe
yourself better than others, and you make no
effort to hide your disdain for them.
6–8
You are cold and aloof, disinterested in others
unless they serve your interests.
9–12
You are deeply spiritual and have spent long
periods in meditation, reflecting on the Cosmic
Egg to divine the moment of its hatching.

13
13–15
You are flighty, easily distracted. Your attention
wanders all over the place.
16–17
Others find you warm, friendly, and open-minded.
You make friends easily.
18
Your intensity can get the better of you. Sometimes,
you just do what you think you need to do,
regardless of the consequences. You might even
feel bad for hurting people who get in your way.
Naga Background
d20 Background
1
You once traveled to the Holy Crèche, the secret
holding place of the Cosmic Egg, but your
memory of the place was erased.
2
You rejected the teachings and values of your
people, wanting nothing to do with them. You
have left behind your culture to find your own way
in the world.
3
You traveled extensively. Add another language
to the list of languages you can speak.
4
You pored over a tome filled with dark and
unsettling secrets. Gain 1 Corruption.
5
The priests of Shavra sent you out into the world
to learn more about humanity and the shadow
creeping across the world.
6 You stood guard over the Shedding for many years.
7
The Cosmic Egg granted you a vision of the world
in the throes of death. You vowed you would do
everything in your power to stop this apocalypse
from happening.
8
Pirates found your community, which had been
hidden on a tiny island. The villains sacked it and
murdered dozens of nagas before they left.
9 You once traveled to a distant land.
10 You earned a living working in one of your professions.
11
An earthquake destroyed your home. You were
one of the few survivors forced to make your
home elsewhere.
12
During your travels, some people mistook you for
a monster and formed into a mob to drive you
out. You managed to escape.
13
You received an education. You know how to read
a language that you know how to speak.
14
You were raised by salamanders. Add Firespeak
to your list of languages.
15
You found a scroll containing an incantation of a
rank 0 spell (chosen by the GM).
16
You worked in the Great Vault, the repository
of the Shedding. You can read one language
you know how to speak, and you add scholar of
history to your list of professions.
17
You stole an important artifact from your people.
You start the game with a randomly determined
enchanted object.
18 You found a potion (of the GM’s choice).
19
You left home long ago and found a place for
yourself in one of the Free Cities.
20 You came into money. Start the game with 2d6 cp.
```

### Ogre

- **Entry Type:** Standard Ancestry
- **Source:** Ghastly Gourmands
- **Source Page:** 3
- **PDF Page:** 3

```text
Creating an Ogre
You can use the following rules to create unique
ogres for use as antagonists. While a player could
use these rules to create an ogre character, ogres
have advantages that make them unsuitable for
most groups.
Strength 13 + 1d3, Agility 8 + 1d3, Intellect 5 + 1d3, Will 7 +
1d3
Perception equals Intellect score
Defense equals Agility score + 5
Health equals three times Strength score
Inborn Cruelty and Madness start with 1d3 Insanity and 1d3 +
1 Corruption.
Descriptor Ogre, Size 2, Speed 10
Languages and Professions Gain Trollish language plus
Gourmand profession. Roll a d6. On a 6, the ogre knows
the Common Tongue as well.
Devour The ogre can use an action to target one Size 1 or
smaller Defenseless or Unconscious creature in reach. It
picks up and eats the target, killing it instantly.
Vomit The ogre can use a triggered action when harmed
to spray semi-digested food from its mouth into a Size 3
space adjacent to its own space. Each object in the space
vulnerable to acids takes 2d6 damage. Each creature in the
space takes 1d6 damage and makes an Agility challenge
roll. On a failure, the creature takes 1d6 extra damage.
The ogre loses access to this trait until it uses Devour or
completes rest.
Level 4 Ogre Expert
Health Increase by 20.
```

### Orc — Born to Kill

- **Entry Type:** Expanded Ancestry
- **Source:** Born to Kill
- **Source Page:** 9
- **PDF Page:** 9

```text
Orc Characters
Everything you need to create an orc character can
be found in Shadow of the Demon Lord. The rules
in that book let you make a character rapidly with
enough information to portray it in the game. This
section, however, offers advanced rules for making
orc characters, with alternative features and a slew
of tables to develop your character’s background,
appearance, and personality. If you use the rules
presented here, you need to use the accompanying
supporting tables to determine your character’s
professions, the languages they know, and their
starting equipment.
Creating an Orc
Choose an Attribute Scores option:
Random Attribute Scores Strength 1d3 + 9, Agility 1d3 + 8,
Intellect 1d3 + 7, Will 1d3 + 7
Standard Attribute Scores Strength 11, Agility 10,
Intellect 9, Will 9
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 12, Power 0
0 Damage, 0 Insanity, 1 Corruption
Languages You speak both the Common Tongue and
Dark Speech
Shadowsight You see in areas obscured by shadows
as if those areas were lit.
Level 4 Orc Expert
Characteristics Health +6
You learn one spell or choose one of the talents below.
Faith in Dark Gods When your attack results in a failure,
you can choose to gain 1d3 Insanity and turn the failure
into a success. You do not become frightened from
gaining Insanity in this way. Instead, you make attack
rolls with 1 boon for a number of rounds equal to your
Insanity total. Once you use this talent, you cannot use
it again until you complete a rest.
Rising Fury When you take damage, you make your next
attack roll before the end of the next round with 1 boon.
Tough as Nails Increase your Health by 4. Also, when you
are not wearing medium or heavy armor, you gain a
+1 bonus to Defense.
Orc Development Tables
The following tables help you create an incredibly
detailed orc character by determining your origins,
background, appearance, personality, professions,
and the like. You must roll on each table and take
the results of each roll. Do not use any of the tables
in Shadow in conjunction with the tables here.
Upbringing Tables
Most orcs in the Empire did not have families like
members of other ancestries do. Instead, orcs born
as slaves were taken from their mothers and raised
communally. The following tables describe the
circumstances of your upbringing.
Origins
d20 Origin
1–18 You were taken from your mother at birth
and raised with other orc children by human
overseers. Add soldier to your list of starting
professions and then roll on the Communal
Childhoods table.
19 You were raised by free orcs who had escaped
their slavery. Roll on the Free Childhoods table.
20 You were orphaned. Humans found and raised
you. Reduce your Corruption score by 1 and
remove the ability to speak Dark Speech. Roll
on the Adopted Childhoods table.
Communal Childhoods
d20 Communal Childhood
1–5 You were savagely beaten and poorly treated.
You nearly died from starvation, but you managed
to survive by eating rats.
6–10 You survived your upbringing by becoming a
lackey to a more powerful orc.
11–15 You were tough enough to get your share of
food and water.
16–20 You were one of the most dangerous children in
your clutch. You brutalized the other children.
Free Childhoods
3d6 Free Childhood
3 Your parents were killed and you were left to
fend for yourself. Add survivor to your list of
starting professions.
4–5 You learned the family business. Add a random
common profession to your list of professions.

6–8 Your family was found by orc soldiers, who
brutally slaughtered your parents, dragging
you and any siblings you had back to Caecras
for a proper upbringing. Add soldier to your list
of professions and roll on the Communal
Childhoods table.
9–12 You worked on your family farm. Add famer to
your list of professions.
13–15 Your family made the journey to the frozen
wastes where you lived on the edges of Blötland,
unwelcomed. Add hunter or forager to your list
of professions.
16–17 You were brought up in the faith of the Dark
Gods. Add acolyte to your list of professions.
18 You received an education. You can read and
write the Common Tongue and you gain one
random area of scholarship.
Adopted Childhoods
3d6 Adopted Childhood
3 Your parents were killed and you were left to
fend for yourself. Add survivor to your list of
starting professions.
4–5 Your family was found by orc soldiers, who
brutally slaughtered your parents, dragging
you and any siblings you had back to Caecras
for a proper upbringing. Add soldier to your
list of professions and roll on the Communal
Childhoods table.
6–8 You learned the family business. Add a random
common profession to your list of professions.
9–12 You worked on your family farm. Add farmer to
your list of professions.
13–15 You were shunned by your adopted family’s
community and you wound up killing a local
child. You ran away from home. Add exile to
your list of starting professions.
16–17 Your adopted family sheltered you from the rest
of the community and kept you hidden. You can
read and write the Common Tongue and you gain
a random area of scholarship.
18 You had a healthy, well-rounded upbringing.
You feel great affection for your adoptive family
and you get along with most humans. Add a
random profession to your list of professions.
Appearance Tables
Use the following tables to determine your character’s
general age, height, weight, and distinguishing features.
Choose your own gender, skin, hair, and eye color.
Note that the “Starting Ages” table applies to
orcs who grew up as slaves. Free orcs can live 75 years
or longer.
Starting Ages
3d6 Age
3 You are a child, 8 years old or younger. You are
Size 1/2 and you halve your height and weight.
You do not roll on the Life Experiences tables.
4–5 You are an adolescent, 9 to 12 years old. Reduce
your height and weight by 25%. Roll once on the
Life Experiences table.
6–8 You are a young adult, 13 to 16 years old. Roll
twice on the Life Experiences table.
9–12 You are an adult, 17 to 22 years old. Roll three
times on the Life Experiences table.
13–15 You are a middle-aged adult, 23 to 26 years old.
Roll four times on the Life Experiences table.
16–17 You are an older adult, 27 to 33 years old.
Roll five times on the Life Experiences table.
18 You are a venerable adult, 34 years old or older.
Roll six times on the Life Experiences table and
once on the Retirement table.
Builds
The Build table modifies your starting height and weight.
Regardless of gender, your starting height is 84 inches and
weight is 350 pounds.
3d6 Build
3 You are a runt. Reduce your height by 5d6 inches
and your weight by 4 pounds per inch reduced.
4–5 You are short. Reduce your height by 3d6 inches
and your weight by 4 pounds per inch.
6–8 You are thin. Reduce your weight by 6d6 pounds.
9–12 You are of average height and weight.
13–15 You are heavy. Increase your weight by 6d6 pounds.
16–17 You are tall. Increase your height by 3d6 inches
and your weight by 4 pounds per inch.
18 You are enormous. Increase your height by
5d6 inches and your weight by 4 pounds per inch.
Appearances
3d6 Appearance
3 You are grotesque. Your face is a mass of scars,
and your body is crisscrossed with even more
scars, your body held together by crude, leather
stitching. Open sores all over your flesh weep
streams of pus. You reek, stinking of excrement,
blood, and sickness.
4–5 You are monstrous, with thick, ugly features,
weird nodules jutting from your skin, and nasty
scars that cut jagged lines across your body.
6–8 You look like other orcs, but boils, lesions, and
weird, scabby patches cover your body.
9–12 You are brutish, with thick tusks jutting out from
your broad jaw, a sloping forehead, and tiny eyes
set below a pronounced bone ridge.
13–15 You look like other orcs, but your tusks are nubs
and your facial features are less severe. You might
have an odd skin coloration, patches of fur, or
unusual body markings.
16–17 You are a fine orc specimen with a fit body and
none of the blemishes common to your people.
18 You stand out from other orcs, a throwback to
your jotun heritage. You are an albino with red
eyes, and your skin is almost blue. Your body
lacks the blemishes and markings that mar
other orcs and you do not have tusks. You
could possibly pass for an ugly, shorter jotun.

Dark Deeds
The 1 Corruption most orcs have at the start
of the game reflects the darkness of the magic
responsible for their creation. This darkness
drives orcs to commit acts of horrific evil. Some
struggle to control their wicked impulses, while
others revel in them. You do not have to decide
what act(s) your character committed, but you
can if you want to. Suitable acts worthy of the
Corruption include murder, cannibalism, torturing
innocents, arson, and various kinds of assault.
As always when exploring the darkest elements
in Shadow, be mindful of the sensibilities and
feelings of your GM and fellow players, and avoid
choosing something your friends might find
offensive.
Distinctive Features
d20 You have…
1 large tusks
2 red, gleaming eyes
3 tattoos and brands all over your body
4 numerous piercings
5 a foul stench
6 a milky eye
7 a forked tongue
8 scarred hands
9 a barking laugh
10 a tendency to drool
11 a hump
12 bright green skin
13 occasional tremors
14 enormous breasts or sexual organ
15 hair sprouting from your nostrils and ears
16 large hands and feet
17 prolific body hair
18 a facial tic
19 irritable bowels
20 an extra finger on each hand and an extra
toe on each foot
Background Tables
The background tables determine from where your
character came and what your character did before
the game begins. Roll on the Life Experience table
a number of times as determined by your roll on
the Starting Age table. The following table might
direct you to roll on another table to discover what
happened during that experience.
Life Experiences
Roll on this table only if directed by the Age table.
3d6 Experience
3 You Died! Roll on the Causes of Death table to
find out how. You can either start over or be
returned to life by some stroke of luck. If you
return to life, you start the game with 1d6 Insanity.
If you’re using Tombs of the Desolation, you can
also become a revenant.
4–5 Roll on the Major Setbacks table.
6–8 Roll on the Minor Setbacks table.
9–12 You Worked! If you don’t have a profession yet,
gain a random profession. You spent time working
in one of your professions. Add 1 to your roll on
the Starting Lifestyles table.
13–15 Roll on the Minor Windfalls table.
16–17 Roll on the Major Windfalls table.
18 Roll on the Strange Events table.
Causes of Death
3d6 Cause
3 Murder
4–5 Accident unrelated to profession
6–8 Disease or famine
9–12 Natural causes
13–15 War
16–17 Accident related to profession
18 Suicide
Major Setbacks
d20 Major Setback
1 You surrendered to the darkness in your heart
and committed a series of unspeakable acts that
left you with 1d6 Corruption. Roll just once to
determine if you have a mark of darkness.
2 You were defeated in battle and held as a prisoner
for 1d6 months. You managed to escape by killing
your captors. Add convict to your list of professions.
3 When horrifying monsters attacked, you lost
your courage and fled. You still bear the shame
of your cowardice.
4 A demon possessed you. Gain 1 Corruption.
Either an exorcist cast it out or, if you have
Demon Lord’s Companion, you can start with
the Possessed story complication.
5 You failed to make much of yourself working in
your profession. Subtract 3 from your Starting
Lifestyle roll.
6 You caught a terrible disease that left you terribly
scarred. You either bear the scars of your affliction
or, if you have Demon Lord’s Companion, you can
start with the Plagued story complication.
7 You murdered a human and were imprisoned for
it. You were released after the orc uprising. Skip
all other Life Experience rolls, gain 1 Corruption,
and add convict to your list of professions.
8 You lost everything to disaster or war. Subtract
3 from your Starting Lifestyle roll.
9 You lost an eye, ear, or 1d3 fingers in a terrible
accident. If you have Demon Lord’s Companion,
you can add the Maimed story complication.

10 A faerie laid a curse on you for some wrong you
committed. The curse made life very difficult for
you. Subtract 1 from your Starting Lifestyle roll.
If you have Demon Lord’s Companion, you can
add the Cursed story complication.
11 One of your companions died. Roll on the
Causes of Death table to find out how.
12 You sailed the high seas, but your ship went down,
stranding you on an island for 1d20 months before
pirates rescued you. Add sailor or pirate to your
list of professions.
13 You butchered many innocent people.
Gain 1d3 Corruption.
14 You saw a hideous monster or demon. Gain 1d3
Insanity. If you have Demon Lord’s Companion,
you can add the Mad story complication.
15 You were captured by slavers and dragged
to Blötland, where you were forced to toil for
your jotun masters. You escaped 1d6 years later.
Add slave to your list of professions.
16 You angered someone important and suffered as a
result. Subtract 3 from your Starting Lifestyle roll.
17 You fought in the fighting pits for the
entertainment of others. You are now hideous,
covered in scars and missing an ear. Add pit
fighter to your list of professions.
18 You killed someone you loved. Gain 1 Corruption.
19 You burned down a temple of the New God, killing
the priest and the congregation. Gain
1d3 Corruption.
20 You made a dangerous enemy, one who seeks
to harm you. Work with the GM to create a
suitable nemesis.
Minor Setbacks
d20 Minor Setback
1 You slew a monster, but not before it devoured
someone important to you.
2 After you offended a gothí, the priest branded the
outcast symbol on your face with a hot iron.
3 You caught an enemy’s weapon with your mouth
and lost most, if not all, of your teeth as a result.
4 You unwisely blew your wealth on drink. Subtract
1 from your Starting Lifestyle roll.
5 You discovered the truth about what happens to
your people, but no one believed you when you
told them. Gain 1 Insanity.
6 Other orcs you know dislike you and say terrible
things about you. This sometimes makes you sad.
7 You saw something horrible. Gain 1 Insanity.
8 A gang of orcs ambushed you and beat you to the
brink of death. You recovered, but lost an eye.
9 You tried to murder someone important, but
botched the attempt. You know this person
will try to get revenge, but not when or how.
10 You lost something valuable. Subtract 1 from
your Starting Lifestyle roll.
11 You became addicted to an inexpensive drug.
If you have Demon Lord’s Companion, you can
add the Addicted story complication.
12 You murdered someone for a trinket. You believe they
haunt you. If you have Demon Lord’s Companion, you
can add the Haunted story complication.
13 During the uprising, you stayed loyal to the
Empire and fought against other orcs. You are
now considered a traitor to your people.
14 You learned a dangerous secret. Work with the
GM to determine the nature of the secret.
15 You suffered a nasty head wound, which caused
you to forget many things. Lose one profession
or the ability to speak one language.
16 You fell in love with a human, but your attentions
were rebuffed. You killed this person. Gain
1 Corruption.
17 The Dark Gods visit you in your dreams.
Gain 1 Insanity.
18 Someone important to you disappeared and you
haven’t seen this person since.
19 You were robbed. Subtract 1 from your Starting
Lifestyle roll.
20 A string of bitter disappointments and failures has
left you cynical.
Minor Windfalls
d20 Minor Windfall
1 If you were a slave to the Empire, a human broke
your chains and granted you freedom. Otherwise,
gain a random profession.
2 You fought bravely for the emperor and received
a medal to commemorate your deeds.
3 You traveled extensively. Add one language to
the list of languages you can speak.
4 If you were a slave, you managed to escape and
make a life for yourself in the wilderness. Add
hunter or forager to your list of professions.
5 You gained a reputation for being ferocious in
battle. Orcs who know you respect you.
6 You helped hunt down and destroy a large monster,
saving a human community in the process.
7 You helped defend a community from undead.
You are a hero to the people you saved.
8 You have a horse.
9 You found some coins on one of your victims.
Add 1 to your Starting Lifestyle roll.
10 You have a child.
11 You saved the life of someone important. Choose
Influence, Information, or Security. The character can
provide the benefit to you once (see Connections in
Shadow, page 207). Come up with details about this
character with the GM.
12 You got an education or furthered your education.
Choose one: Speak another language or gain a
random area of scholarship.
13 You changed careers! Gain a random profession.
14 You found something interesting. Gain one
Interesting Thing.
15 You acquired a large shield.
16 You found a healing potion.
17 You escape certain death! Start the game with
Fortune.
18 You gain a suit of soft or hard leather armor.
19 You fought heroically in a war. Your fellow orcs
branded you with a symbol of distinction. You
make attack rolls in social situations involving orcs
who see your brand with 1 boon.
20 You took a sword from the corpse of someone
you killed.

Major Windfalls
d20 Major Windfall
1 You either plundered a treasure vault or came
into a significant amount of money. Add 6 to
your Starting Lifestyle roll.
2 You did a great service for the Empire. You gain
an enchanted object of the GM’s choice.
3 You made an important connection. Choose
Influence, Information, or Security (see Connections
in Shadow, page 207). Come up with details about
this character with the GM.
4 You enjoyed great success in your business.
Add 3 to your Starting Lifestyle roll.
5 You survived a dark magic spell intended to
kill you. Choose one dark magic tradition. You
discover the tradition without gaining Corruption
for doing so.
6 You sank your earnings into property. You have
a small house on a plot of land in a wilderness
location of your choosing.
7 You helped escort a caravan to a distant
destination. Add 1 to your Starting Lifestyle roll
and you can speak an additional language.
8 If you were a slave soldier for the Empire, you
received a promotion. You gain a suit of mail
armor. Otherwise, you found a suit of mail armor.
9 You took a book of magic from a magician
you killed. The book contains incantations of
1d3 + 1 rank 0 spells.
10 You plundered an alchemist’s workshop and made
off with 1d3 + 1 potions of the GM’s choice.
11 A Valkyrie came for you while you were bleeding
out from a nasty wound, but you drove her away,
saying “It is not my time to die!” So impressed
by your ferocity, the Valkyrie bestowed her dark
blessing on you. You can invoke the blessing once
per day to add 1 boon whenever you make an
attack roll or challenge roll. Whenever you invoke
the blessing, roll a d6—if you roll a 1, you lose the
blessing forever.
12 You made a friend of a powerful figure—an
archmage, high priest, general, or hero. The
GM determines the person’s identity and the
benefits the friendship provides.
13 You found a chest of coins! Add 3 to your
Starting Lifestyle roll.
14 You saved the life of another orc. The character
(as an orc) accompanies you on your adventures,
serving you until death. Work out the details of
this relationship with your GM.
15 A noble took you as his or her love and showered
you with riches. Add 6 to your Starting Lifestyle roll.
16 You gain a bastard sword, warhammer, or greatsword.
17 You have a goblin henchman (as a goblin) who
accompanies you and obeys your commands.
18 You are famous, known all across the lands in
which you live. Work out the details about how
you became famous with the GM.
19 You took a vicious blow to the head. Reduce
your Intellect by 1 and make challenge rolls
to resist gaining Insanity with 1 boon.
20 A gothí revealed a warning to you of the future.
When you would die, you can choose not to die
and instead become unconscious for 1d3 hours.
Once you make this choice, you cannot make
it again.
Strange Events
d20 Event
1 During a battle against the dwarfs, you felt you
were doing wrong. Halfway through, you switched
sides and fought to protect the dwarfs. Add
Dwarfish to the list of languages you know how
to speak.
2 A witch you had wronged turned you into a toad.
You lived as a toad for 1d3 years before some
foolish do-gooder planted a kiss on your lips,
returning you to your normal form.
3 You fled the Empire and found work in the Pirate
Isles. Add sailor to your list of professions and add
1 to your Starting Lifestyle roll. You have recently
returned to the continent.
4 You have a curious mind. When not fighting, you
studied books you pried off your victims’ bodies.
You know how to read and write one of the
languages you know how to speak and you add
one area of scholarship.
5 You suffered terrible nightmares of blood, fire,
and death, of demons spilling into the world and
destroying everything. These experiences filled
you with hatred for demons and they grant you 1
boon on attack rolls you make against demons.
6 You became a fanatical follower of the Dark Gods.
The first time you ever make a fate roll, you can
roll twice and use either result.
7 You killed one of the wizards of the Tower
Arcane for offending you. You fled Caecras,
believing the other wizards seek revenge. You are
uncomfortable around all practitioners of magic,
never quite sure if they are an avenging wizard in
disguise or not.
8 Your life has been filled with drugs, alcohol,
prostitutes, and violence. Gain one interesting
thing.
9 You were trampled by horses. You have a
horseshoe impression on your forehead that has
still not healed.
10 You stumbled into the Void where you remained
for 1d6 years. Somehow, you escaped. Gain 1d6
Insanity and 1d3 Corruption.
11 You discovered a group of cultists and learned
the identity of one of their members. You have
told no one yet, but you’re weighing your options.
You might attempt blackmail or you might do the
right thing.
12 You were sent into the Northern Reach to
augment the soldiers there fighting the undead.
You remained for a time, killing your fair share of
walking corpses.
13 You were slain in battle but later raised from the
dead. Gain 1d3 Insanity.
14 You have a close bond with a character controlled
by another player. Whenever you or that
character uses an action to help the other, you or
that character grant the other 1 boon.
15 You found one of the entrances to Hell and went
through it. You stayed there for a time, finding
plenty of things to kill, but you grew weary and
sought to return home. You bargained with a devil
for your escape. Already doomed to Hell upon
death like most orcs, you know your suffering
will be even worse at the hands of the devil you
bargained with. Gain 1 Corruption.
16 You were bitten by a skinchanger. If you have
Tooth and Claw, you become a skinchanger. If
don’t have that supplement, instead add 3 to your
Starting Lifestyle roll.

17 You studied the basic methods of Battle magic.
You have discovered this tradition.
18 A rival tried to poison you. You recovered,
discovered the culprit, and killed him. You took
his head and had it turned into a revenant head
(see Demon Lord’s Companion, page 26). If you
don’t have the Companion, you instead get an
enchanted object of the GM’s choice.
19 Exposure to demonic energies caused you to
mutate. You gain a random mutation. If you have
The Hunger in the Void, use the tables on page 18
to determine your mutation. Otherwise, use the
Mutations table on page 198 of Shadow.
20 A hag ensorcelled you, and made you her lackey.
You served her for a year before a group of
killers found and destroyed her. Freed from
her influence, you ran off to find a better way
of life. Add a random profession to your list of
professions.
Retirement
Prior to the uprising, most orcs who reached the age
of 33 faced a grisly “retirement” (see “A Final Solution”
above). If your character is 33 years old, or older, roll
on the Retirement table to determine what happened
when you reached the end of your service.
Retirement
d6 Retirement
1 You were sent to the north, executed, and ground
up into meal to feed other orcs. You’re dead.
Create another character.
2 You were sent to be executed, but managed to
escape. You’ve been on the run ever since.
3 You were able to lie about your age because of
a clerical error, so you never got sent.
4 Something dreadful happened to separate you
from your unit and you’ve been on your own
ever since.
5 You were gifted a plot of land and a small farm,
as promised.
6 The uprising broke out right as you were on your
way to be retired.
Orc Profession Tables
Use the following tables in place of those in Shadow of
the Demon Lord to randomly determine your starting
professions as directed by your rolls on the previous
tables. Your profession also adds an item to your list
of starting equipment.
Random Profession
d6 Profession Table
1 Scholar: Areas of Scholarship
2 Common Professions
3 Criminal Professions
4 Martial Professions
5 Devotee of the Dark Gods. You start with a
symbol of your faith.
6 Wilderness Professions
Scholar: Area of Scholarship
Add 1 book covering topics related to your area of
scholarship to your starting equipment.
d20 Area of Scholarship
1 Architecture and engineering
2 Literature, philosophy, poetry, theology, and
the arts
3 Natural sciences
4 Magical theory
5 Imperial history and geography
6 Occult
7–20 Military sciences
Common Professions
d20 Profession
1 Healer. You start with a healer’s kit.
2 Artisan such as baker, blacksmith, bookbinder,
brewer, carpenter, chandler, cobbler, gem cutter,
jeweler, leatherworker, mason, potter, printer,
scribe, or tailor. You start with a tool kit.
3 Artist such as painter or sculptor. If you’re literate,
you can choose writer or poet. You start with a
tool kit or writing kit.
4–5 Beggar. You start with a begging bowl or cap.
6 Boatman or ferryman. You start with a rowboat.
7–8 Cook, groom, scullion, or servant. You start with
an extra set of clothing.
9 Courtesan, prostitute, or camp follower. You start
with a cosmetics kit.
10 Entertainer such as actor, athlete, comedian,
dancer, orator, puppeteer, singer, or storyteller.
You start with a costume, dress, or fine clothing
as appropriate for your profession.
11–12 Farmer. You start with a hoe, shovel, or rake.
13 Gambler. You start with a pair of dice or deck
of cards.
14–15 Laborer such as porter, gravedigger, or stevedore.
You start with a backpack, shovel, coil of rope,
or something else chosen by the GM that’s
appropriate to your profession.
16 Merchant. You start the game with raw goods
such as textiles, grains, or something else worth
1d6 ss.
17 Miner or prospector. You start with a pick.
18 Musician using percussion, stringed, or wind
instruments. You start with a musical instrument.
19 Pilot, sailor, or teamster. You start with 1d6 cp.
20 Trade such as dyer, tanner, or butcher. You start
with 2d6 bits.

Criminal Professions
d20 Profession
1–2 Agitator, rebel, saboteur, or terrorist. You start
with 1d6 pamphlets related to the cause for which
you fight.
3–6 Bandit, pirate, or raider. You start with a bottle of
rotgut and a wanted poster showing your face.
7–8 Burglar or grave robber. You start with a set of
lock picks.
9–10 Fence or smuggler. You start with 1d6 cp.
11–13 Mugger or thug. You start with 1d6 bits.
14–17 Murderer. You start with a garrote.
18 Pickpocket. You start with a stolen purse
containing 1d6 cp.
19–20 Poacher or rustler. You start with a coil of rope.
Martial Professions
d20 Profession
1–2 Constable or detective. You start with a lantern
and flask of oil.
3–4 Conscript or militiaman. You start with a spear
and uniform.
5–6 Guard or henchman. You start with a club and
uniform.
7–8 Jailer or torturer. You start with a pair of manacles
or torturer’s tools.
9–10 Marine. You start with a cutlass.
11–12 Mercenary. You start with a sword and a contract
for your last job.
13–14 Officer. You start with a fancy uniform and sword.
15–16 Patroller. You start with a lantern and flask of oil.
17–20 Soldier. You start with a uniform, small shield, and
sword.
Wilderness Professions
d20 Profession
1–2 Animal trainer. You start with a small animal
that’s friendly to you.
3–6 Guide or pioneer. You start with a map of the
region.
7 Hermit. You start with a week of rations and a
waterskin.
8–12 Hunter or gatherer. You start with a bow and
12 arrows.
13–14 Nomad. You start with a horse.
15–16 Spelunker. You start with a lantern, pick, and
2 flasks of oil.
17–18 Tracker. You start with a spear.
19–20 Woodcutter. You start with an axe.
Starting Equipment
You begin the game with equipment based on your
starting lifestyle and professions. To determine your
starting lifestyle, roll 3d6 and add to the roll all the
modifiers gained from your Life Experience rolls.
Then find the total on the Starting Lifestyle table
(Lifestyles are described in Shadow, page 100). In
addition to the equipment, your character starts out
with one Interesting Thing (Shadow, page 26).
Starting Lifestyle
3d6 Lifestyle
3 or less Destitute
4–5 Poor
6–12 Getting By
13–15 Comfortable
16–17 Wealthy
18 or more Rich
Clothing
Lifestyle Clothing
Destitute Foul rags and a blanket
Poor Patched, threadbare basic clothing
with a ratty cloak
Getting by Basic clothing with a cloak
Comfortable 1d3 sets of basic clothing with one
fine cloak
Wealthy 1d3 sets of well-made basic clothing, a
set of noble’s clothing, and a fine cloak
Rich 1d3 sets of noble’s clothing and a
fine cloak

Weapons
Lifestyle Weapons
Destitute Club or a sling with 20 stones
Poor Staff, club, or sling with 20 stones
Getting by Sling with 20 stones and a basic weapon
of your choice
Comfortable One military weapon of your choice plus
one shield or one basic weapon
Wealthy Bow with 20 arrows and one military
weapon of your choice
Rich Crossbow with 12 bolts, one military weapon
of your choice, plus two basic weapons of
your choice.
Personal Gear
Lifestyle Personal Gear
Destitute Sack with a hole in the bottom
Poor Sack, 1d6 onions, and skin with beer
Getting by Backpack, week of rations, small keg
filled with beer, and coil of rope
Comfortable Backpack, week of rations, small keg
filled with beer, and coil of rope
Wealthy Backpack, week of rations, small keg
filled with beer, bottle of spirits, and
coil of rope
Rich Backpack, week of rations, small keg
filled with beer, bottle of spirits, and
coil of rope
Special Gear
Lifestyle Special Gear
Destitute —
Poor —
Getting by —
Comfortable Healing potion
Wealthy 2 healing potions
Rich 3 healing potions
Wealth
Lifestyle Wealth
Destitute —
Poor 1d6 bits
Getting by 1d6 cp
Comfortable 2d6 cp
Wealthy or
Rich
1d6 ss
Personal Effects*
d20 Item
1 A box of 12 cigars
2 A shrunken head
3 A broken sword
4 A tattered battle standard
5 Crumbs from last night’s meal
6 A bag of onions
7 A pouch filled with various teeth
8 1d6 flesh rings
9 A bloodstained dress
10 A raspy voice
11 A dwarf’s beard
12 A pair of knuckledusters
13 A dented helmet
14 A wide belt with fancy buckle
15 A tanned human skin
16 Twenty filthy jokes
17 A halfling’s foot
18 1d6 torches
19 A contagious case of scabies
20 Three nails and a hammer
*Roll on this table regardless of your starting wealth.
Personality Tables
Use the following tables to help define your
character’s personality. The results from each
table should guide how you portray the character
during play.
Personalities
3d6 Personality
3 You lack empathy. You cannot comprehend
the pain, suffering, or misery other people feel.
You are dead inside.
4–5 You enjoy hurting people and laugh at their
screams. You are cruel beyond measure.
6–8 You are wild, untamed, and out of control.
You often act without thinking.
9–12 You are loud and aggressive. You have a hair-
trigger temper, resorting to violence to solve
your problems.
13–15 You are quiet and serious. You can usually control
your temper, but are still dangerous if provoked.
16–17 You are intense. You are quick to laugh and
quick to anger. Your moods swing all over the
place, one minute howling with laughter, the next
beating someone to a pulp.
18 You strive to expunge the corruption darkening
your soul and actively work for the good of
others. You have a temper, but it rarely gets
away from you.

Relationships
3d6 Relationships
3 You hate other people. You keep company
with others only so long as they have use.
4–5 You find it difficult to create or maintain
relationships. People just rub you the wrong way.
6–8 You have few friends who are not orcs.
You distrust other peoples.
9–12 You respect strength and courage, despise
weakness and cowardice.
13–15 You find it easy to make friends with orcs and
have even had a few relationships with people
who aren’t orcs.
16–17 You make friends easily. You might dislike certain
traits, but you can usually overlook flaws in others.
18 You crave friendship and camaraderie.
You will take it wherever you find it.
Desires and Fears*
1d6 Desire Fear
1 Death Failure
2 Freedom Captivity
3 Glory Cowardice
4 Treasure Weakness
5 Chaos The Dark Gods
6 Power Want
*Roll once for Desire and once for Fear
Obligations
3d6 Obligations
3 Your word is worthless. You break promises with
ease, sparing no thought for anyone you let down.
4–5 Ruled by your appetites, you find they sometimes
get in the way of keeping your oaths and
promises.
6–8 You might keep your word. You might not.
9–12 You fulfill obligations close to you. Otherwise,
you do what you want.
13–15 You try to follow through when you say you’ll do
something, but sometimes you get distracted.
16–17 You believe oaths to be sacred, which is why
you rarely make them.
18 You follow through on any promise you make.
Moralities
3d6 Morality
3 You indulge your every vice, carry out every
wicked desire, and you actively work to make
the world a worse place.
4–5 You put your needs first in all things. To Hell
with everyone else!
6–8 The ends justify the means.
9–12 You are capable of both good and evil. You do
what needs doing.
13–15 You strive to do right, but the darkness in your
heart sometimes leads you to terrible places.
16–17 You fight against the evil inside you. When you
stumble, you always try to make reparations.
18 The shame of what your people have become
burns in you, driving you to be noble and virtuous
in all you do.
Religious Beliefs
3d6 Religion
3 You do not believe in gods*
4–5 You follow the tenets of the Old Faith
6–15 You worship the Dark Gods
16–18 You belong to a heretical sect, worship the
Devil, or belong to a cult of the Demon Lord
*Do not roll on the Piety table.
Pieties
3d6 Piety
3 Your beliefs are distorted and considered
heretical by other members of your faith.
4–5 Your beliefs do not affect your decisions.
6–8 Your beliefs sometimes weigh on decisions
you make.
9–12 You hold your beliefs strongly and they influence
the decisions you make.
13–15 You are a fanatic about your religious beliefs
and you condemn people who do not believe
as you do. Gain 1 Insanity.
16–17 You are skeptical about your religious beliefs.
18 You have strong doubts about
your religious beliefs.
```

### Orc — Shadow of the Demon Lord Core

- **Entry Type:** Standard Ancestry
- **Source:** Shadow of the Demon Lord Core
- **Source Page:** 21
- **PDF Page:** 22

```text
Orc
Long believed to be the perfect soldiers, the orcs have thrown
off slavery’s shackles and risen up against their imperial
masters in a war that threatens to drown the Empire in blood.
Fearsome and Powerful: Mighty, threatening figures, orcs
tower over humans. Most have thick, coarse hair covering
their bodies. Some shave their body hair into lewd or
grotesque patterns to accentuate their fearsome look. Blotchy
skin, bone white to nearly black, blistered and scarred from
flaws in the magic that made them, gives them a ghastly
appearance aided in part by their brutish, exaggerated
features. Most orcs have short pug noses and wide mouths
filled with sharp teeth and a tusk or two. Orcs stand 6 to 8
feet tall and weigh 200 to 600 pounds.
Created to Kill: Dark wizards in service to the Empire
created the orcs from jotun prisoners brought from the icy
south to face the judgment of the Alabaster Throne. Using
vile magic, the wizards stripped away everything from the
giant-blooded warriors until they were little more than wild
animals. The Empire used these new soldiers in the wars
of conquest that would secure its hegemony for a thousand
years.
Slave Revolt: After centuries of slavery, the orcs turned
against their masters. Rumors claim the Orc King, Drudge,
strangled the emperor and seized the throne. Others
whisper that the orcs have made unholy pacts with the
Adversary and even now march against the other provinces.
Whether true or not, the rumors have done their work and
orcs all across the Empire have abandoned their posts or
slaughtered their masters.
Common Names: Bastard, Bunion, Dredface, Grubthumb,
Hate, Killer, Mung, Pliers, Pung, Stenchfist, and Wossname.
21

Character Creation
1
Creating An Orc
Starting Attribute Scores Strength 11, Agility 10, Intellect 9,
Will 9
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 1, Speed 12, Power 0
Damage 0, Insanity 0, Corruption 1
Languages and Professions You speak the Common
Tongue and Dark Speech.
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Level 4 Expert Orc
Characteristics Health +6
You learn one spell or gain Rising Fury.
Rising Fury When you take damage, you make your next
attack roll before the end of the next round with 1 boon.
Orc Age
3d6 Age
3 You are a child, 8 years old or younger.
4–7 You are an adolescent, 8 to 12 years old.
8–12 You are a young adult, 13 to 18 years old.
13–15 You are a middle-aged adult, 19 to 26 years old.
16–17 You are an older adult, 27 to 32 years old.
18 You are a venerable adult, 33 years old or older.
Orc Build
3d6 Build
3 You are short and wiry.
4 You are short and muscular.
5–6 You are short.
7–8 You are thin.
9–12 You are of average height and weight.
13–14 You are corpulent.
15–16 You are tall.
17 You are tall and gaunt.
18 You are a giant among orcs.
Orc Appearance
3d6 Appearance
3–5
You are grotesque. Your face is a mass of scar
tissue. Thick scars crisscross your body, held
together with crude, leather stitching. Swaths of
open sores weep streams of pus, and you reek of
excrement, blood, and rot.
6–8
You are monstrous, with thick, brutish features,
weird growths sprouting from your skin, and nasty
scars that cut jagged lines across your thick hide.
9–12
You are ugly. You have thick tusks jutting from your
broad jaw, a sloping forehead, and tiny eyes set
deep in your skull.
13–15
You are an orc of typical appearance, dirty and
unkempt.
22

Character Creation 1
3d6 Appearance
16–17
Your features are somewhat less brutish, though
you might have odd skin coloration, extra fur, and
thick features.
18
You stand out from other orcs. Your body is
remarkably free from the scars and injuries that
maim your fellows, and you are in pretty good
health.
Orc Background
d20 Background
1 You butchered helpless people. Gain 2 Corruption.
2
You were briefly possessed by a demon. Gain 1
Corruption.
3
You spent 1d6 years in the fighting pit, testing your skills
against other orcs for the amusement of the crowds.
4
You stayed loyal to the Empire and fought against
other orcs. You were branded as a traitor and cast out.
5 You caught the rot and lost your nose and ears.
6
You were chained to the oars in a slave ship for 1d6
years.
7
You were made a eunuch and stood guard over the
emperor’s concubines.
8
You have scar tissue over half your body from
when you were caught in the blast of a spell.
9
You escaped your slavery and have lived in the
wilderness ever since.
10 You earned a living working in your profession.
11
You fell in love with a human and were spurned for
your affections.
12
You sired or gave birth to 3d6 children. Roll 3d6
again and subtract that total from your total
number of children to find out how many are still
alive (minimum 0).
13
You traveled extensively. You speak one additional
language.
14
You received an education. You know how to read
and write the Common Tongue.
15
You fought bravely for the Emperor and were
awarded a medal for your courage.
16
You saved an important noble from an
assassination attempt.
17
A human broke your chains and freed you to find
your fortunes in the world.
18
You took a sword from the corpse of a warrior you
killed.
19
The Gods of Blood and Iron visit you in your
dreams. You start the game with 1 Insanity.
20 You came into money and start the game with 2d6 cp.
Orc Personality
3d6 Personality
3 You fight to liberate your people from slavery.
4
Orcs are more than the killers the emperor made
them to be. They are people, with hearts and
souls, dreams and ambitions. You believe you
must rise above the savagery and find your place.
5–6 The world is going to Hell. You say, let it.
7–8
You take care of yourself, take what you want,
and do what you want.
9–12 Kill!
3d6 Personality
13–14
You never question orders. You always do as
you’re commanded.
15–16
You want revenge and you’ll kill anyone that gets
in your way.
17
You believe you were made for a reason. Without
your chains, you have no purpose.
18
You believe your people have committed great
acts of evil in the Empire’s name. You strive to
right the wrongs.
```

### Pixie

- **Entry Type:** Standard Ancestry
- **Source:** Terrible Beauty
- **Source Page:** 11
- **PDF Page:** 12

```text
Pixie
The quintessential wee folk, many pixies use secret
ways to flutter across the borderlands into the mortal
world, where they cause trouble, spy, and play tricks on
larger, more foolish people. Pixies are the wildest of the
faerie, recognizing no authority other than their whims,
going wherever and doing whatever they please. Their
mercurial nature makes them unpredictable—a pixie
might be all laughter and jests one moment and pure
malice the next.
Endless Variety: The name “pixie” encompasses many
different families of faeries, typified by their small size
and magical nature. Generally, pixies look like tiny elfin
people, each about 8 inches tall and weighing no more
than a couple of pounds. They can be cute and cherubic
or strange and feral-looking, all teeth and claws. They
can have any skin coloration, with pink, blue, and green
being the most common hues. All can fly, and most do
so by using the wings on their backs. The ones that lack
wings flutter about through some quirk of magic.
Most people never lay eyes on pixies, thanks to their
natural invisibility, but children, animals, the simple-
minded, and supernatural creatures can all see pixies.
They can reveal themselves to other creatures, though
they rarely do so.
Wicked Tricksters: Pixies love games, and their
favorites involve playing tricks on larger creatures. The
tricks can be harmless fun, such as stealing a small item
or making scary noises in one’s home, but they can also
be dangerous. Some pixies see nothing wrong with
leading a woodcutter into a beastmen encampment to
see what happens or stealing horses and running them
to death.
Insignificant Pests: Most other fey consider pixies
to be a nuisance, seeing them as incorrigible tricksters.
Some pixies manage to find places of respect among the
faerie, but most languish in tiny cages, prized for their
sweet voices and charming appearance. Unscrupulous
goblins sometimes trap pixies to sell for use as
ingredients in dark incantations.
Common Names: Pixies name themselves after things
they consider pretty, such as Bluebell, Dew, Giggles,
Glimmer, Mist, Moonlight, Petal, Rain, and Sunshine.
Creating a Pixie
Starting Attribute Scores Strength 5, Agility 12, Intellect 10,
Will 8
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health, round down
Size 1/8, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak Elvish.
Immune damage from disease; charmed, diseased
Flutter You can move by flying, but if you fly higher than
5 yards above the ground, you fall.
Naturally Invisible You are invisible to most creatures aside
from other pixies. Animals, demons, faeries, monsters,
children, creatures with Intellect scores of 7 or lower,
and creatures with 5 Insanity or more can see you
clearly. You lose this trait from noon to one in the
afternoon and from midnight to one in the morning,
as well as at dawn, until the sun fully rises, and at dusk,
until the sun fully sets. If you come into contact with
iron, you lose this trait for 1 hour.
Glow You can use an action on your turn to become
visible and illuminate the area within 2 yards of you.
You remain visible until you use an action to become
invisible once more.
more than watching things die is being the one to
Something is wrong with you. You lack all sense
under the influence of the frenzy. You bristle at
You are loyal to the faerie and consider mortals
authority to whom you can devote yourself. You
ways to flutter across the borderlands into the mortal
world, where they cause trouble, spy, and play tricks on
larger, more foolish people. Pixies are the wildest of the
faerie, recognizing no authority other than their whims,

Terrible Beauty
12
Shadowsight You see into areas obscured by shadows
as if those areas were lit.
Iron Vulnerability You are impaired while in contact
with iron.
Wee Your weapon attacks deal half damage. Whenever
you increase Health from a path, you increase your
Health score by half the given amount.
Level 4 Expert Pixie
Characteristics Health +2
You either learn one spell or gain Dilate.
Dilate You can use an action to increase your Size to 1/2.
You remain at this Size until you use an action to return
to your normal Size. Until this effect ends, you lose the
Flutter, Naturally Invisible, and Glow traits, but you gain
a +5 bonus to Strength, and a bonus to Health equal to
2 for each level your group has attained. In addition, your
weapon attacks deal normal damage instead of
half damage.
Pixie Appearance
1d20 Appearance
1 You have the legs of a grasshopper or a cricket.
2 Your hair looks like dandelion fluff.
3 You have large, pointed ears.
4 While you are visible, you trail golden sparkles
whenever you move.
5 You have a pointed head.
6 You have a wide, toothy grin.
7 You are always filthy, no matter how much you
scrub.
8 You have the head of a bird or an insect.
9 You have flower petals in place of hair.
10 You can’t stand still, fidgeting constantly.
11 When you become visible, you look like you are
on fire.
12 The air around you always smells of fresh cut
grass, honey, or flowers.
13 The chime of tiny bells sounds whenever you
become visible.
14 When you become invisible, 1d6 bubbles float
away from you.
15 Your skin appears to be made from woven grass.
16 You prefer to go about unclothed.
17 You wear colorful ribbons in your hair.
18 You have many scars on your hands and feet from
being imprisoned in an iron cage.
19 Your wings are frayed and tattered. (If you don’t
have wings, you appear to be made from cloth
and have tiny buttons for eyes.)
20 Your skin is an unusual color or a pattern of
different colors.
Pixie Age
1d3 Age
1 You are young, less than 5 years old.
2–3 You are an adult, aged 1d20  5 years. For each
decade you have lived, add either one faerie
profession to your list of professions or one
language to your list of languages learned.
Pixie Background
1d20 Background
1 An elf kept you in a golden cage for half your life.
You recently escaped.
2 You loved a mortal child who was cursed never to
grow up.
3 You have spent many nights leading travelers
astray.
4 You served a hag and helped the monster steal
children.
5 You have always had a great fondness for horses
and would tangle yourself up in their manes,
urging them to gallop away from their owners.
6 You were a great explorer, discovering many
ocean caves.
7 You love making and repairing shoes.
8 You used to sneak into the homes of mortals to
steal their ribbons.
9 You helped goblins infiltrate the hidden kingdom
from which you come.
10 You have passed the years indulging your every
desire.
11 You once stole the eyes from a child. You have
them still.
12 You used to perform services for mortals in
exchange for a trinket, a token, or a saucer of
cream.
13 You plucked a wedding ring from a great lady, but
have since lost it.
14 You were a valued servant of an elf lord or lady
until you were discarded.
15 You befriended a mortal long ago and protected
your friend until he or she came of age. That
mortal can see you when you are invisible.
16 You stole a gold coin from the Great Dragon and
spent it on wine.
17 You fell in love with a nymph and pine for her still.
18 You once befriended a wild man of the wood and
helped him rescue his lady and two unicorns from
Hell.
19 A trick you played on a mortal resulted in a death.
You might or might not feel guilty.
20 You have spent your life in Hell and just recently
escaped. Gain 1d3 Corruption.
Pixie Build
3d6 Build
3 You are a mere wisp of a faerie, short and slight
for your kind.
4–5 You have a curvy or plump body.
6–8 You are quite small for a pixie.
9–12 You are typical for a pixie in both height and
weight.
13–15 You stand a bit taller than other pixies.
16–17 You look stretched out, tall with a willowy body.
18 For a pixie, you are tall and have a muscled
physique.

Terrible Beauty
Terrible Beauty 13
Pixie Personality
3d6 Personality
3 You are so wicked, you probably belong in Hell.
You thrive on sowing discord, you enjoy maiming
innocents, and you leave a trail of destruction
wherever you go.
4–5 You love to laugh, though the things you find
funny others find appalling. Nothing sets you off
like watching the surprise on a creature’s face
when the first jet of blood spurts from its body.
6–8 You live for pleasure. You take what you want,
do what you feel like doing, and go wherever you
want.
9–12 You are capricious and willful, doing and saying
what you please. You have a hard time keeping
promises, and you are easily distracted.
13–15 You are a free spirit, unbound by oath or
obligation. You are innocent in nature, though,
and you prefer not to harm others. You are not
above playing tricks on people you deem to be
too serious.
16–17 You lack the wildness typical of your people,
tending to be more focused and committed to
your goals. You strive to do good in all that you
do.
18 You are quite serious. You have no time for the
games your people play, finding them silly and
distracting.
Pixie Wings
3d6 Wings
3 You have no wings.
4–5 You have dragonfly wings.
6–8 You have moth wings.
9–12 You have butterfly wings.
13–15 You have wasp wings.
16–17 You have feathered wings.
18 You have leathery wings.
```

### Remade

- **Entry Type:** Derived Ancestry
- **Source:** Cult of the Cog God
- **Source Page:** 7
- **PDF Page:** 7

```text
Remade Characters
Humans, and rarely other ancestries, who come
under the sway of the Cog God sometimes experience
an overwhelming urge to become clockworks
themselves. Typically, the impulse manifests as
personality quirks, wherein the individual’s behavior
and movements match that of clockworks. They
might speak in weird, toneless voices, move in a stilted
manner, and forgo food and water until absolutely
necessary. On occasion, these individuals go to even
greater lengths and enlist the aid of a high priest to
transmigrate their souls into a clockwork body and
thus become “Remade.”
Only ancestries of flesh and blood can become
remade. If you want to play a Remade starting
character, use the normal rules for creating a
clockwork. If, however, you make the decision during
the campaign to become one, you can apply the
following alterations with your GM’s permission,
provided you are able to find access to a place and the
expertise to enable such a transformation to occur,
primarily the aid of someone who knows or has access
to the liberate soul spell, described below, and the bind
soul to machine spell, originally presented in Ghosts in
Machines.
LIBERATE SOUL NECROMANCY UTILITY 5
Requirement You must have an ornate vessel such as a
box or urn worth at least 1 gc and an ornate silver knife
worth 1 gc.
Target One restrained or unconscious living creature that
has a soul.
Upon casting this spell, you must concentrate for 1 hour,
during which time you cut the threads that bind the soul
to the target’s body. When you finish, the soul slips from
the body and moves into the prepared vessel where it
remains until the vessel is destroyed, at which point the soul
becomes a manes if it has 0 Corruption or a lemure if it has
any Corruption.
Remade Traits
Attributes You retain your Intellect and Will scores, but
reduce your Strength by 1 and your Agility by 2.
Defense Your base Defense becomes 13.
Size Your Size becomes 1.
Speed Your Speed becomes 8.
Insanity Your Insanity increases by 1d6.
Languages and Professions You retain all languages and
professions.
Ancestry Traits Lose all traits gained from your original
ancestry and gain Immune, Key, Mechanical Body, Wind
the Clock, and Repair Damage traits from the clockwork
ancestry. If your group level is 4 or higher and you gained
a talent from your original ancestry, replace that talent
with Grind the Gears. In addition, reduce your Health by
the amount gained from your level 4 feature from your
ancestry and increase it by 5.
Magic You retain all traditions discovered and all spells
learned.
Talents You retain all talents gained from your paths.
```

### Revenant

- **Entry Type:** Derived Ancestry
- **Source:** Tombs of the Desolation
- **Source Page:** 5
- **PDF Page:** 6

```text
Revenant
Sometimes death calls too soon, claiming the soul before a
mortal can fulfill a destiny, right a wrong, or repay a debt.
When the burden of responsibility proves too heavy to set
aside, death may stay its hand and let the mortal complete
those unfinished tasks as a revenant.
Between Life and Death: Revenants are neither fully
alive nor fully dead. They count as living creatures but
never suffer the ailments that plague the living, such as
the throes of fever or the agony of venom. They still can be
wounded and can be destroyed by weapons. But even when
brought low, the pull of their obligations drags revenants
from the grave once more to finish the work they began.
Deathly Pallor: Revenants look more or less as they did
when they were fully alive, but dark circles ring their eyes,
and they tend toward gauntness. New-made revenants
use cosmetics and pack their bodies with fragrant spices
to cover up the stench of decay. Simple disguises are
insufficient to mask the nature of older revenants, who use
magic to conceal the truth of what they have become.
Driven and Relentless: Mighty oaths, great injustices,
and strong emotions keep revenants in the world. Rising
from the grave instills them with a single-minded focus
on achieving their objectives. Not all emerge from the
transformation with their mental faculties intact; many
experience emotional swings that range from manic
exuberance to the blackest depression.
Tied to the Desolation: The Desolation is the source
of the power that creates revenants. In ancient times, the
Men of Gog who lived in this toxic place used foul magic to
extend their lifespans or to escape death altogether. Those
who could not afford such spells bargained directly with
Father Death to give them more time. The dour god refuses
most requests, but mortals who have been wronged and
crave vengeance sometimes gain his blessing, escaping the
Underworld until they can put their affairs in order.
Common Names: Revenants use the names they had
in life or adopt ones that summarize their new existence,
such as Raven, Harlequin, Tears, or Vengeance.
Creating a Revenant
First create a human, dwarf, or orc character. Other
ancestries may be available at the Game Master’s
discretion, but they must be living and mortal, possess
souls, and not be created by magic—so no changelings
or clockworks. Then apply the following traits to that
character.
Starting Attribute Scores Strength +1, Intellect –1
Characteristics Defense –1, Insanity +1d3
Immune damage from disease and poison; diseased,
fatigued, poisoned
Darksight You can see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Eternal Returns You die instantly when you become
incapacitated, and you remain dead for 1d3 hours. At
the end of this time, if your head is still attached to
your body, you return to life, heal damage equal to your
healing rate, and gain 1d3 Insanity. Otherwise, you are
destroyed.
One Foot in the Grave You heal only half the normal
amount of damage from magic and potions.
Level 4 Expert Revenant
Characteristics Health +6
You learn one spell, gain Eyes of the Underworld, or gain
an expert trait from your other ancestry.
Eyes of the Underworld You can use an action to make a
Will attack roll against the Will of one target creature
within short range that can see you. On a success, the
target becomes frightened for 1 minute. On a failure, the
target becomes immune to your use of this talent until it
completes a rest.
use cosmetics and pack their bodies with fragrant spices
to cover up the stench of decay. Simple disguises are
insufficient to mask the nature of older revenants, who use
magic to conceal the truth of what they have become.
Driven and Relentless:
and strong emotions keep revenants in the world. Rising
from the grave instills them with a single-minded focus
on achieving their objectives. Not all emerge from the
transformation with their mental faculties intact; many
experience emotional swings that range from manic
exuberance to the blackest depression.
Tied to the Desolation:
of the power that creates revenants. In ancient times, the
Men of Gog who lived in this toxic place used foul magic to
extend their lifespans or to escape death altogether. Those
who could not afford such spells bargained directly with
Father Death to give them more time. The dour god refuses
most requests, but mortals who have been wronged and
crave vengeance sometimes gain his blessing, escaping the
Underworld until they can put their affairs in order.
Common Names:
in life or adopt ones that summarize their new existence,
such as Raven, Harlequin, Tears, or Vengeance.
First create a human, dwarf, or orc character. Other
ancestries may be available at the Game Master’s
discretion, but they must be living and mortal, possess
souls, and not be created by magic—so no changelings
or clockworks. Then apply the following traits to that
character.
Starting Attribute Scores
Characteristics
Immune
fatigued, poisoned
Darksight

Tombs of the Desolation
Into the Wastes
Tombs of the Desolation
6
Into the Wastes
1
Optional Rule: Rising from the Dead
The GM might allow a dead character to return as a
revenant, provided he or she meets the criteria and doing so
would be appropriate to the story. For example, an expert
character might have been killed before she had a chance
to find her husband’s murderer, while a master character
could return to find the cure to a vile contagion that not
only destroyed him but threatens many others. If the GM
intervenes in this way, the character typically returns to life
at the start of the next adventure, with all damage healed,
and gains all the revenant traits.
Revenant Ancestry Tables
Use the tables from your character’s base ancestry to
determine his or her background before returning from
the dead. Then choose from or randomly determine the
options presented in the following tables to describe how
the character became a revenant and the effects of that
transformation on his or her personality and nature.
Cause of Death
d20 Cause
1 You were executed for a crime you did not
commit.
2 You were brutally murdered after watching your
loved ones die.
3 You stumbled into a violent situation and were
killed as a result.
4 You committed suicide.
5 You died protecting or fighting for a dark magic-
user.
6 Your spouse poisoned you.
7 Your sibling or parent murdered you.
8 A rival had you assassinated.
9 A lethal trap killed you suddenly.
10 A monster butchered you while you were fighting
to protect your loved ones.
11 A cultist ended your life using dark magic.
12 A demon tore you to pieces.
13 A falling piano or other heavy object abbreviated
your lifespan.
14 You succumbed to disease.
15 You died after fooling around with a dangerous
relic.
16 Some natural disaster claimed your life.
17 A psychopath tortured you for days before killing
you.
18 You drowned.
19 You were burned at the stake for demonology,
sorcery, or heresy.
20 Cultists sacrificed you to the Demon Lord.
Reason for Return
1d6 Reason for Return
1 Vengeance
2 Love
3 Duty or an oath
4 Delusion
5 Hate
6 Spreading chaos
Distinguishing Features
d20 Feature
1 You never cast a shadow.
2 You are so thin that you appear skeletal.
3 Vermin infest your body.
4 You have a curious odor.
5 You do not bleed.
6 You move with an awkward, jarring gait.
7 Your smile stretches weirdly across your face.
8 You’re missing a few fingers and toes.
9 You have a terrible scar as a result of your death.
10 You are bloated.
11 You smell of the spices you use to preserve your
flesh.
12 In place of eyes, you have glowing red pinpricks
floating in pools of darkness.
13 You have a raspy voice.
14 You have no teeth.
15 Your face never shows expressions.
16 You are always filthy, no matter how often you
bathe.
17 You wrap yourself in funerary linens.
18 Your eyes and mouth have been sewn shut, but
you can still see and speak.
19 Your neck is broken and never heals. Your head
flops about when you move.
20 The air around you grows chill.

Tombs of the Desolation
Into the Wastes
Tombs of the Desolation 7
1
Unusual Behavior
d20 Feature
1 You laugh at inappropriate times.
2 Your hands shake.
3 You sometimes see things that aren’t there.
4 You often think people are watching you.
5 You feel compelled to touch things.
6 You believe something to be true that is obviously
not, and you cling to that belief even when
presented with evidence that it is false.
7 You experience horrific nightmares that cause you
to wake up screaming.
8 You see dead people.
9 You frequently cut or harm yourself to feel pain.
10 You hear voices whispering to you at all times.
11 A person only you can see is always in your
field of view. It’s up to you to decide who this
individual is and what he or she looks like.
12 If you speak while angry, another entity uses your
voice to interject strange and unsettling words
and phrases into your speech.
13 You find most food and drink repulsive. You can
hold down only insects and foul water.
14 Your mood swings with little warning.
15 You always feel like you forgot something
important.
16 When you go to an unfamiliar place, you must
take a few moments to find all the exits.
17 You constantly scratch and tear at your skin.
18 Your eyes always flick back and forth.
19 You punctuate your speech with grotesque
croaking noises.
20 You sometimes hear the screech of ravens and
the beating of many wings when you attack
creatures that have souls.
```

### Salamander

- **Entry Type:** Standard Ancestry
- **Source:** Tombs of the Desolation
- **Source Page:** 7
- **PDF Page:** 8

```text
Salamander
The genies shaped the first salamanders from elemental
flame to serve as thralls to those wild and willful beings.
For centuries, the salamanders and their descendants
lived apart from the other peoples in the world, free from
machinations and intrigues, but the rise of terrible evils
has coaxed them out of hiding to walk the lands in their
final days.
Born from Fire: The genies formed salamanders by
infusing elemental flame with their own essence, granting
the fire solidity, humanoid form, and sentience. Their fiery
heritage is still evident in the tall, twisting horns rising from
salamanders’ brows, the spurs growing on their arms and
legs, and their crimson skin. With pupilless white eyes and
long, sharp teeth, salamanders’ features range from exotic
to diabolical. A typical salamander stands between 7 and 8
feet tall and can weigh up to 400 pounds.
Elementals: As elemental beings, salamanders enjoy
long lives, but lacking mortal souls, they cannot return
from death. When a salamander dies, its body burns up in
a flash of fire.
Slaves of the Genies: The genies made salamanders to
do their bidding, and salamanders believe they likewise
fashioned the world from chaos. Other elementals were
made to be creators and healers, but salamanders were
designed as destroyers. They fought the genies’ enemies:
the faerie, trolls, and anyone else who sought to bind and
control their masters. Thus their first encounters with
humanity were in battle, which left a lasting negative
impression. As madness infected the genies, their interest
in the world waned, leaving the salamanders free to find
their own destinies. Most made their homes in the Burning
Vaults, but some survived in the Desolation’s wastes.
Fierce and Volatile: A people of intense passion,
salamanders have difficulty hiding their emotions,
especially anger. In dealings with others, they can be
aggressive to the point of causing offense, even threatening,
if they don’t get their way. Such emotional outbursts never
last for long, though, and they quickly forget what raised
their ire in the first place.
Common Names: Azagad, Beruul, Dedan, Fereen,
Heeseh, Ignez, Seekriz, Zeez.
Creating a Salamander
Starting Attribute Scores Strength 10, Agility 9, Intellect 9,
Will 11
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
Damage 0, Insanity 0, Corruption 0
Languages and Professions You speak the Common
Tongue and Firespeak, a hissing and clicking language of
the flame elementals.
Immune damage from disease, fire, and poison; diseased,
poisoned
Cold Intolerant You take double damage from cold. When
you take damage from cold, you also become fatigued
for 1 round.
Heat At the end of the round, each creature grabbed by
you or that has grabbed you must get a success on a
Strength challenge roll or take 1d3 damage from the
intense heat radiating from your body.
Fiery Death When you die, flames burst from a point
within your space out to a number of yards equal to your
group level. Everything in the area takes damage equal
to 1d6 + your group level. Each creature in the area that
gets a success on an Agility challenge roll takes half the
damage instead.

Tombs of the Desolation
Into the Wastes
8
Into the Wastes
1
Level 4 Expert Salamander
Characteristics Health +5
You either learn one spell or gain Scorching Reprisal.
Scorching Reprisal When you become injured, you can use
a triggered action to release a burst of flames in a 2-yard
radius from a point within your space. Everything in the
area takes 1d6 damage. Each creature in the area that
gets a success on an Agility challenge roll instead takes
no damage.
Salamander Age
3d6 Age
3 You are a child, 8 years old or younger.
4–7 You are an adolescent, 9 to 15 years old.
8–12 You are a young adult, 16 to 50 years old.
13–15 You are a middle-aged adult, 51 to 100 years old.
16–17 You are an older adult, 101 to 150 years old.
18 You are a venerable adult, 151 years or older.
Salamander Personality
3d6 Personality
3 Hate consumes you. You enjoy hurting other
people.
4 You have a nasty temper and resort to violence
when angered.
5–6 You are a braggart and a bully.
7–8 You are rude to people you don’t know and
unfriendly to those you do know.
9–12 You are bold and aggressive.
13–14 You are friendly, charming, and boisterous.
15–16 You try to do the right thing, but your passions
sometimes get in the way.
17 You have learned to control your emotions, so that
you seem cold and reserved to others.
18 You have an infectious cheer. You put others at
ease, and people want to be around you.
Salamander Appearance
3d6 Appearance
3 You have a monstrous appearance
that even your own people find
unsettling. A profusion of horns and
spurs erupt from all over your body,
and your skin is a sickly, blotchy color.
Your visage is a snarling mass of bone
and flesh, eyes yellowed and dull.
4 You are a firetail, an offshoot of
the salamander race born with a
serpentine tail instead of legs. Aside
from this mutation, your features are
those of other salamanders. Your tail
imposes a –2 penalty to your Speed
but grants you 1 boon on attack rolls
made to grab.
5–6 You have crude, brutish features
with mottled orange-and-black skin.
You are considered plain or even
unattractive by your people.
7–8 You have 1d6 + 3 toothlike horns
growing from the top of your head.
Your skin is rough and scaly, pierced
by bizarre bone spurs all over your
body.
9–12 You have the appearance of a typical
salamander.
13–14 You are attractive for a salamander.
Your horns are smooth and spurs
small.
15–16 You are striking for a salamander.
Your black horns are smooth and
polished, your eyes blaze with an inner
radiance, and your skin is warm and
unbroken by spurs.
17 You are beautiful, even by the
standards of other peoples. You have
attractive features and a presence
that grabs attention. You have no
bone spurs, and only two small horns
sprout from your forehead.
18 Your appearance sets you apart from
nearly all of your kind. You have a
shapely or muscular form with
striking features. The horns and spurs
common to your race are arranged in
such a way that almost everyone
finds you appealing and perhaps a
little exotic.
Tombs of the Desolation
8

Tombs of the Desolation
Into the Wastes
Tombs of the Desolation 9
1
Salamander Background
d20 Background
1 You nearly died, and your body has suffered
as a result. You partly turned to flame and now
appear scorched and are missing a few of your
extremities.
2 You discovered the gates of Hell and passed
through them to live among the devils for 1d3
years. You start the game with 1d3 Insanity and 1
Corruption.
3 You were kidnapped and enslaved by a
wicked magician. After 1d6 years of abuse and
exploitation, you escaped.
4 You committed a crime against your people
and fled from your homeland to escape the
repercussions.
5 Undead besieged and destroyed your home. You
are the only survivor.
6 You briefly fell in with a cult dedicated to a
monstrous being known as the Inferno. You broke
with the cultists once they started summoning
demons. You start the game with 1 Corruption.
7 You ventured into the Desolation and survived to
tell of it.
8 You lost someone close to you.
9 You were captured by travelers and sold as a
slave in the Nine Cities. You only recently won
your freedom.
10 You earned a living working in your profession.
11 You fell in love with someone of a different
ancestry. You could have had a relationship with
another character, if you both agree.
12 You have a spouse and 1d6 � 2 children (minimum
0).
13 You left your home long ago to see the world.
You speak one additional language.
14 Your parents were leaders in your community, and
you have lived in their shadow your whole life.
15 You saved the life of someone important, and that
person now owes you a favor.
16 You were whisked away from your homeland by a
magician who summoned you to serve him or her
for a time.
17 Orphaned, you were found by a druid who raised
you in the ways of the Old Faith.
18 You found something unusual in the Desolation.
Start the game with one item from the Interesting
Things of the Desolation table (this is in addition
to the interesting thing that all characters start
with).
19 You helped defend your community. You start the
game with a spear.
20 You came into money and start the game with 2d6
cp.
Salamander Build
3d6 Build
3 You are short and slender.
4 You are short and muscular.
5–6 You are short for your people.
7–8 You are thin, willowy, or gaunt.
9–12 You have typical height and weight for
your people.
13–14 You are somewhat overweight.
15–16 You are tall.
17 You are tall and thin.
18 You tower over other salamanders, your body
hulking and powerful.
```

### Saprophican

- **Entry Type:** Standard Ancestry
- **Source:** Brood of the Mother Spore
- **Source Page:** 2
- **PDF Page:** 2

```text
The Saprophicans
Few people have ever met a saprophican and those
who have seldom met another. Nearly all of the fungus
folk live in small, isolated colonies in dense forests far
from settled lands. Fear of discovery, distrust of others’
motives, and superstition keep most saprophicans close
to their homes. Still, at some point in their lives, they
are compelled to venture forth and travel out from their
hidden places in order to found new colonies.
Mishap and violence most often abbreviate these
trips, which is why so few saprohicans are ever
seen. From time to time, one or two emerge from
the wild and venture into civilized lands. Despite the
fears some people in the lands of Rûl have against
strange and alien beings, the saprophicans find they
are usually able to integrate well with humanoids.
Affable, charming, and convincing are all traits
common among them, which helps to allay any fears
about their intentions. Once they find acceptance,
they can begin work on their true purpose:
establishing a new saprophican colony.
Colony Builders: As all fungus exists to spread its
spores, so too do the saprophicans. When saprophicans
reach maturity, they experience an intense desire to
leave their colony and establish new ones. They have
evolved humanoid shapes out of necessity, since these
forms are far less likely to be mistaken for something
dangerous or abhorrent. In fact, ages ago, saprophicans
appeared as animals, only twisted and bent to walk on
two legs. The early human tribes either fled in fear or
cut them down, thinking they were monsters.
Saprophicans embellish their forms with decorative
growths. Vibrant crowns of finger-like mushrooms
adorn their heads, bioluminescent frills shed soft light,
and blooms sweeten the air around them. Once they
ingratiate themselves with the settlement and squash
any misgivings, they integrate with the host settlement,
subsisting on the work of their neighbors as much as
possible. While not an inherently lazy people, they
prefer to work as little as possible themselves when
others can toil on their behalf. Eventually, they direct
their new community to help secure a suitable location
for a new colony. Some of the most successful of their
kind have convinced whole towns to take up arms
and root out bands of beastmen inhabiting what they
considered to be a choice site.
If they are able to find a suitable and safe location,
with fertile ground in which to grow new life, they
start work on creating a new colony, which comes at
the price of their own lives. Their bodies break down
to release a cloud of spores that settles into the earth,
where they then grow into the mycelia that covers each
colony. The mycelia connect with each other and draw
out nutrients from the ground to funnel into the husk
the saprophican left behind. It is from this husk that
the center of all saprophican colonies grows, a great
monument to their god, the Mother Spore. Contained
within this pillar are enough spores to infect a dozen
new hosts from any creature unfortunate to have made
their dens near this new colony.
Hidden Homes: A dense web of mycelium
surrounds each colony. Not only do the mycelium
alert the colony of trespassers by releasing spores of
its own, but also works as trap for anything foolish
enough to come too close. The tendrils wrap around
the legs of animals, entrapping them in fungal nets.
Saprophicans then infect these unfortunate creatures,
leaving them trapped while the spores take hold.
The mycelium swaddles the beast until the newly
formed saprophican is created, and the body is fit to
carry back to the colony’s heart. The fungus folk are
intensely secretive about their true origins, rightly
believing it would turn others against them if their
reproduction cycle became common knowledge.
This secrecy extends to the point that their society
forbids the infection of an intelligent creature with
the saprophican fungus. If a child goes missing in the
woods, the whole village searches for it, while no one
will miss a deer. Any who break this law are burned
alive until there is not even a spore left of them.
However, this does not stop the saprophicans from
killing any trespassers who might escape to reveal
their dreadful secret.
Parasitic Genesis: The spores take root in the lungs
of any creature who inhales them. Over the next
few days, the spores sprout fine web-like strands of
mycelium down into the lungs and up the throat,
through the nasal cavity, and then into the brain along
the olfactory nerve. After the mycelium borrowed
into the brain, the host is inexorably drawn towards
the nearest saprophican colony, where the rest of the
transformation can take place in solitude and safety.
By this point, whoever or whatever the host’s identity
or original existence was is lost, destroyed by the
fungal takeover of all the brain’s functions.
Once at the colony, the fungus begins to alter the host
body, spreading through veins and between muscles,
while contorting the animal’s figure into a humanoid
shape. Dense fungal growths fill the gaps left by this
process, and over time it builds a full body for itself
using its host as food and fertilizer. The animal’s bones
are kept intact and used as a rudimentary skeleton, as
saprophicans are unable to produce a fungus dense
enough to replace them. Often, they will seek out new
bones to serve as a more suitable skeleton, slowly
incorporating them over a few days, and, being unable
to repair these bones themselves, replacements must
be sought out for any breaks.
Strange Diets: Despite their efforts to integrate with
the mortals of Urth by taking on superficially reassuring
forms, they have not yet been able to mask one aspect
of their biology. Saprophicans are ravenous carnivores,
unable to eat anything but raw meat. They have a
specialized fungal “stomach” that putrefies the meat
before digesting it, which causes each saprophican to
smell slightly of decay shortly after each meal.
A Forgotten God: Each colony still worships the
same god, the Mother Spore, and a shrine to this
goddess—a giant pillar of slick, black fungus—stands
at the center of every community. Saprophicans
believe it was from her they were spawned. The
Mother Spore is a grim uncaring figure of death,
decay, and rebirth. She compels her brood to spread
their spores to the furthest corners of the continent,
and with the Shadow of the Demon Lord touching
even their secluded homes, saprophicans are leaving
their colonies in greater numbers.
The few scholars who have been able to study
saprophican religion—and did not pay with their
life for it—believe it is simply a distant offshoot of
the ancient World Mother cult. Instead of fertility
and vitality, their sect venerated decay as the start of
all life and rebirth. While each colony’s beliefs vary
in the details, they all believe that the Mother Spore
is something entirely other than the World Mother.
Priests of the Mother Spore have access to the Death,
Life, and Nature traditions.
Common Names: Ayoo, Bumbo, Coof, Eyish,
Floom, Gibble, Iggwye, Lumma, Maol, Muun, Numm,
Ooo, Opple, Puen, Unnu, and Wammble.
Creating a Saprophican
Starting Attribute Scores Strength 9, Agility 11, Intellect 10,
Will 11
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common
Tongue
Immune damage from disease and poison; diseased,
poisoned
Shadowsight You see in areas obscured by shadows as if
those areas were lit.
Language of the Mother Spore As a minor activity, you can
release a spore cloud from your body that spreads out
to a range of 10 yards from a point in your space. The
spores hang in the air for 1 round. Using these spores,
you can communicate a concept or emotion that can be
summarized in a few words to other saprophicans within
the spore cloud.
Spore Trail When you move, you dust the ground behind
you. If the dust falls on earth, sand, or wooden surfaces,
it remains for 1 hour. You can sense spore trails left by all
saprophicans.
Fire Vulnerability You take double damage from fire.
Level 4 Saprophican Expert
Characteristics Health +3
You learn one spell or gain Spore Burst.
Spore Burst You can use an action to release spores into
a 3-yard-long cone originating from a point you can
reach. Each creature in the area must make a Strength
challenge roll with 1 bane. On a failure, a creature
becomes diseased for 1 round. While diseased in this
way, the creature is charmed. On a roll of 0 or less for
a creature of flesh and blood, the target falls prone,
becomes defenseless for 1 round, and then becomes
infected with apotheosis spores (see below).
Apotheosis Spores
Saprophicans reproduce by infecting living creatures
with apotheosis spores released from their bodies.
An infected creature experiences difficulty breathing,
developing a wet cough resulting from the spores
growing in its lungs and throat. In a matter of days,
the spores kill the creature, taking over its body as
described under “Parasitic Genesis.”
Transmission A creature that breathes in spores becomes
exposed. One hour later, the creature must get a success on
a Strength challenge roll with 2 banes or suffer the stage 1
effects of the apotheosis spores.
Cure Only magic of rank 3 or higher can cure this infection.
• Stage 0 The creature recovers from apotheosis spores.
• Stage 1 The creature is diseased.
• Stage 2 As stage 1, but whenever the creature uses
an action or a triggered action, the creature becomes
fatigued for 1 round.
• Stage 3 The creature’s Intellect and Will drop to 5.
It loses all professions, talents, and spells learned.
The creature becomes compelled by the spores, and
usually goes some place secret and safe to complete
the transformation. After 1d3 months, the creature
transforms into a new saprophican and retains none of
its original statistics.
Recovery Each time the diseased creature completes a
rest and is at a stage less than 3, it must make a Strength
challenge roll with 3 banes.
• 20 or more: The creature moves down one stage.
• Success: No change.
• Failure: The creature moves up one stage.
• 0 or less: The creature moves up two stages.
Saprophican Age
3d6 Age
3 You are a child, 6 years old or younger.
4–7 You are an adolescent, 7 to 13 years old.
8–12 You are a young adult, 14 to 25 years old.
13–15 You are a middle-aged adult, 26 to 40 years old.
16–17 You are an older adult, 41 to 60 years old.
18 You are a venerable adult, 61 years old or older.
Saprophican Build
3d6 Build
3 You are short and either thin or heavy, as you choose.
4–6 You are somewhat short, but of average weight
for your height.
7–8 You are slender, though of average height.
9–12 You have a typical build, both in height and weight.
13–15 You are heavy for your height.
16–17 You are tall, but of average weight for your height.
18 You are extremely tall and either thin or heavy, as
you choose.
Saprophican Appearance
3d6 Appearance
3 You were unable to fully transform your host’s
body and now appear as a grim amalgamation
of fungal flesh, scraps of fur, and twisted,
disjointed bones. You are repulsive to others and
are met with horrified expressions and screams
everywhere you go.
4–5 You appear almost human, with a monstrous
deformity from your transformation. You might
hobble and limp with a warped leg, one arm may
be drastically shorter than the other, or you might
be missing an eye and your lips.
6–8 You appear human, but you stand almost upright,
and your face is more fungus than man. Your
approximation of the human form is unsettling to
others.
9–12 Your body and facial features are human but
have strange patterns and textures. Your host’s
skeleton, or some other feature of your true
nature easily reveals you to be something else
entirely.
13–15 You appear to be human in passing, but anyone
who interacts with you is soon disabused of that
notion.
16–17 From a distance, you appear to be an attractive
human, but up close the strange texture of your
flesh mars the facade.
18 Your body is perfectly sculpted to appear to be
an extraordinarily beautiful human. Only close
inspection, and your fungal adornments, would
suggest otherwise.
Saprophican Personality
3d6 Personality
3 You are a parasite. People are a resource to you
and you will take from them until there is nothing
left. You despise those who stand in your way.
4–5 Suspicion of other people drives your every
action. You are always looking over your shoulder.
3d6 Personality
6–8 You are well-meaning but lack social skills and
come off as arrogant or overbearing.
9–12 You are generally amiable, but you have trouble
overcoming your selfish nature.
13–15 You are friendly and find it easy to make friends.
16–17 You are outgoing and strive to make as many
friends as you can.
18 You have a magnetic personality and often find
people hang on your every word.
Saprophican Background
d20 Background
1 Your colony was discovered and destroyed. You
were the only survivor and still fear you’re being
hunted.
2 You see ever-shifting forms and faces in your
colony’s monument, but no one else can see them.
3 You have killed innocents to harvest their bones.
Start with 1d3 + 1 Corruption.
4 You have broken two of your bones and are now
seeking replacements.
5 One of your bones is made from silver and is worth
2d6 ss.
6 Your host body had eaten a metal cube with
strange runes on it. You have rescued the object,
and it is now in your possession.
7 You are thought to have infected an intelligent
creature, but escaped before you could be executed.
8 You traveled extensively. You speak one additional
language.
9 The Mother Spore came to you in a vision and
showed you where you should found a new colony.
You have since forgotten the directions.
10 Your colony disregards saprophican law and preys
on humans and other humanoid creatures.
11 You let a scholar study you and told them pieces of
your history. In return you received an education.
You know how to read and write the Common
Tongue.
12 You have some memories of a life you didn’t live
and are unsure where they came from. Start with
1 Insanity.
13 You have left your colony once before but were
chased off from the first settlement you found and
returned home dejected.
14 Bandits camped near your colony. You led the
effort to remove them from your lands.
15 An orc raid swept across your colony, and you
lived as a slave for months before escaping. Add
Slave to your list of professions.
16 You find yourself inexplicably imitating the habits
of your host animal when no one is looking.
17 You came into money and start the game with 2d6
cp.
18 Your colony believes the Mother Spore is a blight
on the world. You struggle to overcome the urge
to create a new colony.
19 You killed a trespasser to protect your colony.
This person had a strange set of keys and a map
you cannot read. You have not revealed them to
anyone, yet.
20 You prevented a fire from wiping out your colony
and are hailed as a hero. Your body bears a
gruesome scar from your actions.
Fungal Adornment
d20 Adornment
1 Your skull was a stag’s and you have covered its
antlers in a web of vibrant colors.
2 A cape of lace-like fungus hangs from your back.
3 Your body has bioluminescent whorls all across it.
You can faintly illuminate these patterns green or
blue.
4 Woven stalks in hues of gold and brass encircle
your head.
5 Blooms of miniscule, beautiful mushrooms grow
all over your arms.
6 A dense mass of fungus grows from your face
imitating a lush, full beard.
7 Purple coral-like fingers sprout from your head to
form a majestic crown.
8 Your body exudes delicate perfumed scents.
9 You use small fungi to imitate earrings, rings, and
jewelry of all kinds.
10 Stripes of muted contrasting colors ripple over
your whole body.
11 A large mushroom cap sits atop your head like a
wide hat.
12 Your neck is full of mushroom gills, opening and
closing with the rhythm of your speech, revealing
vibrant shades of blues, purples, and oranges.
13 Your head is covered in thin fungal stalks, which
you have grown to mimic intricately styled hair.
14 Lichen of all shapes and colors grows over your
body.
15 The sweet smells of honey and nectar hang in the
air around you.
16 Your whole body is a tapestry of colors, fungus
of every shape and hue overlap and crowd your
flesh.
17 You have an elaborate headdress of mushrooms.
18 Small, brightly colored mushrooms sprout from
your shoulders.
19 You have two fungal adornments. Roll again and
ignore duplicates and further rolls of 19 or 20 on
this table.
20 You have three fungal adornments. Roll again and
ignore duplicates and further rolls of 19 or 20 on
this table.
```

### Serpent Person

- **Entry Type:** Standard Ancestry
- **Source:** Freeport Companion
- **Source Page:** 7
- **PDF Page:** 8

```text
Serpent People
In a land far from Rûl, perhaps even in another world,
at a time long ago when little separated humankind
from the animals, stood the powerful empire of
Valossa, unmatched in magic and technology and
populated by a race of serpent people who had
enslaved all the younger races that dwelled in their
lands. The descendants of those people have spread
across the world, staying hidden from view and biding
their time until the day when they can rise up and
reclaim their rightful place as masters of Urth.
Reptilian Humanoids: Serpent people, a general
term used for Valossans, combine the features of
snakes and humans. Typical individuals stand 6 feet
tall and weigh around 150 pounds. Their slender
bodies have short limbs that end in clawed digits.
Serpent people have the heads of snakes, with some
rare examples having the hoods of cobras as well.
From the base of the spine extends a long tail that
drags on the ground.
Children of Yig: The serpent people owed their
empire and its advances to the beneficence of their
god, Yig, a serpentine deity who has largely passed
from memory. So long as the Valossans served the
snake god, they prospered, but when the Demon
Lord’s shadow fell upon them, when arrogance led to
corruption, Yig became angry and cast them down,
shattering their empire and scattering the survivors
across the world. Many serpent people became
debased and degenerate, having forgotten who they
were. Others evolved into different creatures, such
as the lizardmen found in the swamps of Rûl. A few,
though, managed to preserve their heritage and keep
their traditions alive well enough to have the hope of
one day rebuilding their civilization and returning to
their exalted place as Yig’s favored people.
A Divided People: Views on what to do to save
their kind deeply divide the intelligent serpent people.
A few cling to the worship of Yig, recalling their god
as a good and virtuous deity, but a sect called the
Sskethvai has grown to prominence. Its leaders deliver
fiery sermons to embolden the serpent people to take
the world by force and enslave the weaker peoples
living there. The sect has had some success in gaining
converts, and its actions have drawn attention from
certain powerful figures.
Many serpent people now live in the caves and
sewers beneath the city of Freeport; it is believed that
long ago one of their greatest cities sank off the coast
of the Serpent’s Teeth. Most serpent people found
in the city are degenerates, mad and vicious, but a
few cling to the tattered remains of their civilization.
Some worship the snake god Yig, while others are
fully in the thrall of the Unspeakable One. In fact,
serpent people played a key part in the efforts to
summon forth the Unspeakable One from the Void (as
detailed in the Freeport Trilogy). Now, serpent people
of all motivations move in secret inside Freeport and
elsewhere to shift history’s course in their favor.
Shapechangers: As a naturally magical people,
serpent people can alter their physical form to assume
the appearance of other humanoid-shaped creatures.
This ability was useful to the Valossans as they fled
the destruction of their homeland, and remains so
now as they seek to gather information about the
present world and the peoples they once called their
slaves. Unlike faeries that can change their shapes,
serpent people have nothing to fear from iron and
can remain in their changed forms for as long as they
remain conscious.
Degenerate Serpent People: Serpent people who
succumb to the temptations of darkness tend to
lose their minds and devolve, becoming hideous
degenerates that live little better than beasts in dark
and dank places. This vulnerability could be a curse
laid on them by their god, or it might be a side effect
of their magical nature, but whatever the cause,
serpent people who give in to dark temptations suffer
the transformation.

8
Part of the reason that degenerate serpent people
are more common than others is that serpent people
do not shed Corruption when they die. Instead, the
darkness stays with their souls and inhabits their new
bodies. Thus, when a degenerate dies, it’s almost a
sure thing that a newly hatched serpent person will
also be a degenerate.
Common Names: A’bar, E’star, I’dreken, K’stad,
M’kath, N’stakth, S’seth, S’till, T’tlan.
Creating a Serpent Person
Attribute Scores Strength 8, Agility 10, Intellect 11, Will 10
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak, read, and write the
Common Tongue. Roll a d6. On a 6, you can also speak,
read, and write Valossan, and you add scholar of ancient
Valossa to your list of professions.
Darksight You can see into areas obscured by shadows
and darkness within medium range as if those areas were
lit. Beyond this distance, you treat darkness as shadows
and shadows as lit.
Teeth Your teeth count as basic weapons that deal 1d3
damage and have the finesse property.
Curse of Yig When you gain Corruption, you gain Insanity
of an equal amount. Insanity gained in this way cannot
be removed except by magic. If you go mad while you
have Corruption, you take a penalty to Intellect equal to
half your Corruption. If this penalty would reduce your
Intellect to 5 or lower, you immediately and permanently
become a degenerate serpent person and use its
statistics in place of your own. The GM then takes
control of your character.
Level 4 Serpent Person Expert
Characteristics Health +4
You either learn one spell or gain Change Shape.
Change Shape You can use an action to assume the form
of a different living creature. The new form must have
a humanoid shape and be either Size 1/2 or Size 1. You
remain in this form until you become incapacitated or
use a triggered action at any time to return to your
normal form. You can use this talent a number of times
equal to 1 + your Power score. You regain expended uses
when you complete a rest.
Serpent Person Age
3d6 Age
3 You are a child, no more than 10 years old. You
are Size 1/2. Halve your height and weight.
4–5 You are an adolescent, from 11 to 15 years old.
Reduce your height and weight by 25%.
6–8 You are a young adult, from 16 to 20 years old.
9–12 You are an adult, from 21 to 135 years old.
13–15 You are a middle-aged adult, from 136 to 200 years old.
16–17 You are an older adult, from 201 to 300 years old.
18 You are a venerable adult, 301 years old or older.

9
Serpent Person Build*
3d6 Build
3 Reduce your height by 4d6 inches and your
weight by 2 pounds per inch. Reduce your Size
to 1/2 if you are not Size 1/2 already.
4–5 Reduce your height by 3d6 inches and your
weight by 1 pound per inch.
6–8 Reduce your weight by 4d6 pounds.
9–12 You are of average height and weight.
13–15 Increase your weight by 4d6 pounds.
16–17 Increase your height by 3d6 inches and your
weight by 1 pound per inch.
18 Increase your height by 4d6 inches and your
weight by 2 pounds per inch.
*The Build table modifies your starting height and weight.
Regardless of gender, your starting height is 72 inches, and
your starting weight is 150 pounds.
Serpent Person Appearance
3d6 Appearance
3 You are monstrous, freakish, and unpleasant to
behold. You have stubby limbs and a ropy body
covered with thick scales marred by scars. You
might have a cloudy eye, patches of missing
scales, or a vile stench you cannot quite hide.
4–5 You have a bent body, appearing broken and
malformed.
6–8 You have dull brown scales.
9–12 You look like most other serpent people, having a
scaled, snakelike body with short limbs, a serpent
head, and a long tail.
13–15 Your eyes gleam, and your silvery scales shine.
16–17 Your scales form a pleasing pattern on your body,
and your eyes are gleaming gold.
18 You have a cobra’s hood that opens when you are
angry. Your scales are gold and green, and you
have deep violet eyes.
Serpent Person Personality
3d6 Personality
3 You hear voices in your head that push you
toward evil action. You have urges to kill, maim,
and brutalize others, and it’s but a matter of time
before you give in.
4–5 You despise humans and other peoples. You have
heard the stories of ancient times when they were
your people’s slaves. Your towering arrogance
offends most people you meet.
6–8 You crave power, and you’ll do anything to get it.
9–12 You escaped the horrors that have befallen your
people and now, like others, hope to restore the
Valossans to their former greatness. You don’t
have much of an opinion about other peoples; you
are willing to treat them as they treat you, though
part of you sees them as being little better than
talking animals.
13–15 You seek to reclaim the glory of ancient Valossa
and are interested in recovering your people’s lost
lore and technology.
16–17 You recognize the rampant corruption in your
people and resist the temptation that darkness
offers. You strive to do good.
18 You have a good heart and hope to leave the world
a better place than you found it. Chiefly, you struggle
to free your degenerate kin from the corruption that
stains their souls and restore their minds.
Serpent Person Religion
3d6 Religion
3–5 You have a terrible secret, one you dare not reveal.
You have been a servant of the Unspeakable One
for many years and work to bring about his entry
into the world. Gain 1d3 Corruption.
6–15 You worship Yig, the god of your people. Roll a
d6. On a 1, you do not believe strongly. On a 6,
you are especially devout. On any other number,
you follow your god out of fear.
16–18 You are done with gods and have turned your
back on them all.
Serpent Person Background
d20 Background
1 You discovered a sect dedicated to the
Unspeakable One. The experience shook you,
leaving you with 1d3 Insanity.
2 You uncovered a relic from ancient Valossa, but it
was tainted by dark magic. Before you could rid
yourself of it, you gained 1 Corruption.
3 You spent 1d6 years living among the degenerate
serpent people, trying to understand them.
4 You murdered a human who had stumbled upon your
people’s caves. Start the game with 1 Corruption.
5 You caught a terrible disease, but you recovered.
6 You studied the teachings of Yig. Add scholar of
religion to your list of professions.
7 A cruel wizard captured you and held you
prisoner for 1d3 years before you escaped.
8 You spent years studying the world’s history.
Add scholar of history to your list of professions.
9 You were attacked and took a nasty wound.
You have a scar somewhere on your body.
10 You lived among other Valossans while doing little
of import.
11 You fell in love with a human woman. She does
not know you exist, and you keep your forbidden
feelings a secret.
12 You traveled to other enclaves of serpent people
to learn more about your kind. Add one language
to the list of languages you can speak.
13 You scoured the ruins of ancient Valossa and
discovered something interesting. You begin with
one additional interesting thing.
14 You studied humans extensively and befriended
one. Work with the GM to determine the identity
of this person and the nature of your relationship.
15 You saved your people from an attack by terrible
monsters clawing their way up from the depths of
the earth.
16 You brought a killer to justice, either a killer of
your people or of another race.
17 You were born to a person of great importance or
standing among your people.
18 You studied magic. Add scholar of magic to your
list of professions.
19 You came into possession of ancient Valossan
magic. Start the game with an incantation
containing two rank 0 spells.
20 You came into money. Start the game with 2d6 cp.

10
```

### Skinchanger

- **Entry Type:** Ancestry Template
- **Source:** Tooth & Claw
- **Source Page:** 2
- **PDF Page:** 2

```text
Skinchangers
All kinds of creatures can adopt different forms.
Students of Primal magic and Transformation
magic can become animals, clouds of mist, or even
other people. Changelings can mask their natural
appearance with the guise of a person they observe.
Hideous broodlings can become clouds of biting and
stinging insects, while nisse can balloon into giants.
The most notorious of the shapechanging creatures,
however, are the skinchangers, sometimes called
weres, scions of the Horned Lord, or lycanthropes.
What sets the skinchangers apart from other
shapeshifters is that they all bear a weighty curse. The
source of their affliction’s origin varies with the telling,
as revealed below, but in all cases it causes a beast to
come forth, transforming the skinchanger into a wild
and dangerous animal, or, sometimes something in
between. The forms skinchangers take vary wildly,
from wolves to leopards, ravens to rats, and just about
everything else in between. If it walks, crawls, slithers,
swims, or flies, somewhere in the world, there’s a
skinchanger that can adopt its form.
The Curse
The skinchanger curse has haunted the mortal
peoples since they first spread across Rûl, leaving
the stories about where it came from unreliable at
best. However, the dominant religions have some
of the most accepted explanations. Devotees of the
Old Faith believe the Horned Lord laid the curse on
mortals who poached sacred animals in his grove,
causing those people to become the beasts they had
slain. The Inquisition of the New God’s cult claims
the skinchanger curse is one more manifestation of
the corruption on the mortal soul, indicating a sullied
heart and diseased mind. All servants of the gods
count skinchangers as dangerous foes that can spread
their vile curse to their followers.
Not all view skinchangers as a menace. Among
the Woad, a wild, nomadic people that live in and
around the Empire, skinchangers within their ranks
are believed to be favored by their tribe’s patron spirit.
That members of the tribe can sometimes adopt
animal forms matching the spirit supports their
claim, though even the Woad admit the rapacious,
bloodthirsty skinchangers found outside their tribes
are dangerous, possibly estranged kin driven mad by
the loss of their custom and society.
All of these stories could be true, but in all
likelihood, the curse’s origin probably belongs to the
faeries. Many early encounters between the mortals
and immortals were peaceful, even supernatural
given that the gods of the Old Faith bear a striking
resemblance to many of the great fey who now rule
over the hidden kingdoms, yet many encounters
ended in violence, clashes that ultimately contributed
to the faeries decision to abandon the mortal world.
Leaving a curse to transform their enemies into wild,
destructive animals who preyed on other people is
just the sort of vengeance angry faeries might concoct.
Passing the Curse
Curses usually affect only the person on whom they
are bestowed. In other words, they’re not infectious.
Once you become cursed, you remain so until you
find a way to lift it. The skinchanger curse is the
big exception to the rule, however, as skinchangers
can bestow it onto creatures they scratch or bite.
Any living, mortal creature that becomes injured or
incapacitated from damage dealt by a skinchanger’s
natural weapons is at risk of gaining the skinchanger
curse.
In addition, the curse can pass from one generation
to the next. This is especially true for people with
strong ties to the faerie or who live in or near lands
steeped in faerie magic. Sometimes the curse passes
directly from father to son, mother to daughter,
or might wait one or more generations before a
descendant discovers she carries the curse when, one
night, she transforms in the light of the moon.
The Effects of the Curse
The effects of becoming cursed by a skinchanger do
not usually reveal themselves right away. The cursed
creature often goes several days or weeks unaware
of what will happen when the moon next rises full,
although cravings for raw meat, fascination with
the moon, and strange dreams of running with rats,
wolves, or roaming about the wilderness under the
cover of night are all common warning signs that
something is wrong. Once the moon rises full, the
cursed creature undergoes a painful transformation,
joints popping, skin sliding, fur or feathers bursting
from the pores until the victim becomes an animal in
body and mind. This lasts
until the moon sets,
at which point the
curse fades and the
creature returns to
its normal form,
likely covered
in blood, dirt,
and grass stains.
Henceforth, each
time the moon rises
full, the skinchanger
transforms, and its
mind shatters a bit
more until it eventually
becomes the monster it
fears lurks within.
from the pores until the victim becomes an animal in
body and mind. This lasts
more until it eventually
becomes the monster it

3
Lifting the Curse
A few remedies exist for those who become enslaved
to the moon. The best and most certain is to find the
skinchanger responsible for passing the curse and kill
it with a weapon made from silver. When the creature
dies, the curse lifts from each creature to whom it was
passed, but only from those who had not themselves
passed the curse onto others.
Magic can also lift the curse. The remove curse spell
from the Protection tradition (see Terrible Beauty for
this spell) has a chance to remove it. The caster must
cast the spell on a target while it is in its animal
or hybrid form. The target instantly returns to its
normal, humanoid form, but the next time the
moon rises full, the target must make a Will
challenge roll. A success indicates the curse was
removed successfully, while a failure indicates
the attempt fails, and the target transforms as
normal.
Finally, belladonna, known also as
wolfsbane, might lift the curse. An
uncommon herb commonly sold for
1d6 cp by apothecaries
and some witches, it
must be administered
as a tincture once
each day for seven
nights leading up
to the full moon.
Consuming the tincture
causes the creature to
take 1d6 damage and
become poisoned until
it completes a rest.
However, when the
full moon rises, the
creature can make a Will
challenge roll with 1 boon.
On a success, the curse is
lifted.
Skinchanger Characters
Skinchangers, like vampires, tend to be adversaries
and their presence in a group can be disruptive, at
least until the skinchanger gains some control over
the curse. If permitted in the campaign, you can
either create a skinchanger from scratch or become a
skinchanger after contracting the curse.
Starting Ancestry
The skinchanger curse affects only living,
mortal creatures such as humans, dwarfs,
fauns, halflings, and orcs. Other ancestries
might also produce skinchangers at the
GM’s discretion, but such ancestries must
be living and not created by magic—so no
vampires, clockworks, or changelings.
You can create a new skinchanger
character by first creating a character that
belongs to a permitted ancestry. Once you
finish, apply the following adjustments,
traits, and talents to the character. You
also apply them to a character who
becomes a skinchanger in play.
Skinchanger Traits
Attribute Scores Increase Strength
by 1 and decrease Intellect by 1.
Characteristics Increase Perception by 1. As well,
you gain 1d3 Insanity and 1 Corruption.
Silver Vulnerability When you take damage from
a silver weapon, you take a penalty to Health equal
to the damage. The penalty remains until after you
complete a rest.
Skinchanger Curse If you are in an area illuminated by
light cast by a full moon at the end of the round, you
become an animal. The kind of animal whose form you
assume is determined either by the skinchanger that
bestowed the curse if you gained it during play or by
rolling on the Animal Form table when you create your
character. You remain in this form until you are in an
area lit by sunlight at the end of any round, at which
point you immediately return to your normal form.
As you transform, you must make a Will challenge
roll with 3 banes. For each level your group has
attained, make the challenge roll with 1 boon.
Thus, if your group level is 1, you make the
challenge roll with 2 banes. You control
your character on a success, and the GM
takes control of your character until you
return to your normal form on a failure.
Under the GM’s control, you behave as a
vicious animal. In either case, you use the
animal’s statistics in place of your own,
though if you got a success on the Will
challenge roll, you use your Intellect and
Will scores in place of the animal’s.
from the Protection tradition (see Terrible Beauty for
this spell) has a chance to remove it. The caster must
cast the spell on a target while it is in its animal
or hybrid form. The target instantly returns to its
normal, humanoid form, but the next time the
moon rises full, the target must make a Will
challenge roll. A success indicates the curse was
removed successfully, while a failure indicates
the attempt fails, and the target transforms as
normal.
Finally, belladonna, known also as
wolfsbane, might lift the curse. An
uncommon herb commonly sold for
1d6 cp by apothecaries
and some witches, it
must be administered
as a tincture once
each day for seven
nights leading up
to the full moon.
Consuming the tincture
causes the creature to
take 1d6 damage and
become poisoned until
it completes a rest.
However, when the
full moon rises, the
creature can make a Will
challenge roll with 1 boon.
On a success, the curse is
The skinchanger curse affects only living,
mortal creatures such as humans, dwarfs,
fauns, halflings, and orcs. Other ancestries
might also produce skinchangers at the
GM’s discretion, but such ancestries must
be living and not created by magic—so no
vampires, clockworks, or changelings.
You can create a new skinchanger
character by first creating a character that
belongs to a permitted ancestry. Once you
finish, apply the following adjustments,
traits, and talents to the character. You
also apply them to a character who
becomes a skinchanger in play.
Skinchanger Traits
Attribute Scores
by 1 and decrease Intellect by 1.
Characteristics Increase Perception by 1. As well,
you gain 1d3 Insanity and 1 Corruption.
Silver Vulnerability When you take damage from
a silver weapon, you take a penalty to Health equal
to the damage. The penalty remains until after you
complete a rest.
Skinchanger Curse If you are in an area illuminated by
light cast by a full moon at the end of the round, you
become an animal. The kind of animal whose form you
assume is determined either by the skinchanger that
bestowed the curse if you gained it during play or by
rolling on the Animal Form table when you create your
character. You remain in this form until you are in an
area lit by sunlight at the end of any round, at which
point you immediately return to your normal form.
As you transform, you must make a Will challenge
roll with 3 banes. For each level your group has
attained, make the challenge roll with 1 boon.
Thus, if your group level is 1, you make the
challenge roll with 2 banes. You control
your character on a success, and the GM
takes control of your character until you
return to your normal form on a failure.
Under the GM’s control, you behave as a
vicious animal. In either case, you use the
animal’s statistics in place of your own,
though if you got a success on the Will
challenge roll, you use your Intellect and
Will scores in place of the animal’s.

4
When you cause a living creature to become injured or
incapacitated by an attack made with your natural weapons,
that creature must get a success on a Strength challenge roll
with 1 bane the next time it’s in an area lit by a full moon or it
too becomes a skinchanger.
Upon returning to your normal form, you must make a Will
challenge roll with 1 bane. On a failure, you gain 1d3 Insanity.
Level 4 Expert Skinchanger
Characteristics As your base ancestry.
You either learn one spell, gain the level 4 benefit from your
ancestry, or gain the Change Form talent.
Change Form You can use an action, or a triggered action on
your turn, to adopt your normal form, your animal form, or
a hybrid of your animal and humanoid forms. You remain
in the new form until you use Change Form again or you
become incapacitated, which causes you to return to your
normal form immediately. The animal form must be the
same as the form you adopt when under the effects of your
Skinchanger Curse. If you adopt an animal form, use the
animal’s statistics in place of your own, except you retain
this talent and your Intellect and Will scores. If you adopt
a hybrid form, you make the following adjustments to your
statistics.
• You gain the frightening (see Shadow, page 214) and
shadowsight traits if you don’t have them already.
• You gain a +2 bonus to Perception, a +2 bonus to
Defense, +10 bonus to Health, and a +2 bonus to Speed.
• You make Strength and Agility attack rolls and
challenge rolls with 1 boon.
• You gain Regeneration, allowing you to heal 1d6
damage at the end of each round if not incapacitated.
• You have natural weapons as appropriate to your
animal form—teeth, claws, horns—that function as
basic weapons with the finesse property and deal
1d6 damage.
Skinchanger Tables
The following tables help explain how you came by
the curse if you are creating a new skinchanger rather
than becoming cursed in play.
Curse Origins
d6 Result
1 You were cursed by magic after offending a
faerie, devil, or an evil witch.
2 You inherited the curse from one or both of your
parents.
3 A distant ancestor was a skinchanger, but the
curse lay dormant in your bloodline until it
reached you.
4 You became cursed after barely surviving a
skinchanger attack.
5 Someone you knew contracted the curse and
passed it onto you the first time they changed.
6 You have no idea how or why you became cursed.
One day, when the moon rose full, you changed.
Animal Form
d6 Form
3 Leopard (as medium animal with Speed 12)
4–5 Snake (as medium animal with poisonous trait)
6–8 Rat of unusual size (as small animal with climber,
pack fighting, and swimmer traits)
9–12 Wolf (as medium animal with darksight and pack
fighting trait)
13–15 Boar (as medium animal with ferocious trait)
16–17 Raven (as small animal with flier trait)
18 Black bear (as medium animal with the brutal
trait)
New Traits
• Brutal When you attack with a natural weapon, such as
your fist, claws, teeth, and the total of your attack roll is
20 or higher, the attack deals 1d6 extra damage.
• Ferocious When the ferocious creature would become
incapacitated, roll a d6. On a roll of 5 or 6, the creature
instead heals 10 damage.
Skinchanger Side-Effects
d20 Side-Effect
1 You only eat meat and then only when it’s raw.
2 Your eyes change to match those you possess in
your animal form.
3 You make animal noises when angry.
4 You do not sleep comfortably indoors.
5 You are exceptionally hairy, have feathers for hair,
or possess scaly skin.
6 You have a strong animal odor about you.
7 You have unusually large teeth.
8 Right before you transform into an animal, a
pentagram appears in the palm of each of your
hands.
9 When you walk barefoot, you leave behind animal
prints.
10 Your face changes slightly, resembling the
features of the animal into which you transform.
11 Normal animals behave around you as if you were
the animal whose form you can assume.
12 The shadow you cast has the shape of your animal
form.
13 Silver has a strong, repellent odor to you.
14 You become uncomfortable and paranoid around
people you haven’t met before.
15 Your eyes shine in the dark.
16 You become a wild animal in your dreams, racing
through the wilderness, hunting and killing.
17 You twitch, drool a lot, or have a weird facial tic.
18 You dislike water and rarely bathe.
19 You sniff strangers to see where they are headed
and where they’ve been.
20 You tend toward impulsive behavior, given to
acting on impulse.

5
Changing Forms in Armor
When a skinchanger adopts a hybrid or animal
form, any clothing or armor worn tears at
the seams and there’s a 1 in 6 chance that
the coverings are completely ruined. As well,
a skinchanger wearing armor during the
transformation takes 1d3 damage if wearing light
armor, 1d6 damage if wearing medium armor, or
1d6 + 3 damage if wearing heavy armor.
```

### Sylph — Heaven’s Sent

- **Entry Type:** Expanded Ancestry
- **Source:** Heaven’s Sent
- **Source Page:** 4
- **PDF Page:** 4

```text
Sylph Characters
The Demon Lord’s Companion 2 offers everything you
need to create sylph characters, from the rules for
using them to supplementary tables designed to help
you realize them in the game. Here, though, you will
find a different take on sylphs that reins in certain
traits to make them better suited for all groups of
characters. If you use the rules here, you will also
need to use the accompanying tables to determine
other aspects of your character such as starting
profession, languages, and equipment.
Creating a Sylph
Starting Attribute Scores Strength 8 or 1d3 + 6, Agility 11 or
1d3 + 9, Intellect 9 or 1d3 + 7, and Will 11 or 1d3 + 9
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages You speak Sylphen.
Immune damage from disease and poison; diseased,
poisoned afflictions
Flier If you wear leather or no armor, you can move by
flying. You lose this trait while you are injured.
Light as a Feather You never take damage from landing
after a fall.
Dying Winds When you die, your body dissolves into a
whirlwind that dissipates at the end of the round. Each
creature within 1 yard of the place where you died must
make a Strength challenge roll. On a failure, the creature
takes damage equal to your healing rate, flies 1d6 yards
in a straight line away from you, and then falls prone. On
a success, the creature just takes half the damage.
Level 4 Sylph Expert
Characteristics Health +4, Speed +4
You learn one spell or gain the Whirling Evasion talent.
Whirling Evasion When you take damage from a creature
you can see, you can use a triggered action to take half
the damage and move up to 1d3 yards without triggering
a free attack. This movement ignores difficult terrain. You
can use this trait a number of times equal to 1 + half your
level and regain expended uses when you finish a rest.
Sylph Development
The following entries help you develop your character’s
identity using a mixture of tables and information.
When presented with a table, unless the guidelines say
otherwise, you can choose a result, let a dice roll decide,
or make something up instead. Do not use any of the
tables presented in Shadow of the Demon Lord and Demon
Lord’s Companion 2 in conjunction with the tables here.
Upbringing
You might have come from a small family or large,
been orphaned and raised by a different people, or
sheltered for much of your upbringing so that now
the wider world appears wholly alien to you.
Immediate Family
Your immediate family describes the people around
whom you developed from birth to your starting age.
These might include one or more parents, siblings,
extended family members, and the like. Roll 3d6 and
find the total on the following table.
Foreachmentionedfamilymember,youcandecide
theirfateorrollad6:1indicatestherelationhasdied by
whatevermeansyoudecide;2,therelationisbelieved
deadbutmightnotbe;3,therelation’sstatushasnot been
determined;4orhigher,therelationisaliveandwell.
Your relations might have little or no presence in
the adventures through which you play and thus be
fully relegated to your background. You can, however,
develop these characters further. Doing so provides
the GM with potential adventure hooks—family
members might call on you directly for aid, find
themselves in peril, or have some other problem. If
you like, you can use the tables in this supplement
(or other supplements if someone other than sylphs
raised you) for development ideas.
Homeland
Nearly all sylphs grow up in environments
surrounded by their own people. Few ever mingle
with other peoples, and many consider such congress
dangerous. Your homeland gives you an idea about
the level of seclusion you experienced and might
inform how you see others.
Education
Most growing up in sylph communities enjoy some
exposure to artistic development, physical training,
philosophy, and mathematics, as well as literature,
history, and cosmology. Elders look for certain
aptitudes in the young and cultivate those talents
when possible. Although these communities prize
education, everyone has a part to play and most learn
trades that have value to their people.
Immediate Family
3d6 Result
3 Tragedy wiped out your enclave, leaving you
among the few survivors. Hardship dogged you
and you eventually had to fend for yourself. You
have few, if any, recollections of your family.
4–5 Your parents foisted you off on a distant monastery
for instruction, and you never saw them again.
6–8 Your parents were cruel and subjected you and
your siblings to awful torment. You fled as soon
as you could.
9–12 You belonged to a small family with a sibling or
two. Your home was neither happy nor sad. It
served its purpose.
13–15 You come from a large family with many siblings.
Your house was filled with laughter and happy
times, but there was darkness too. What was the
terrible secret?
16–17 You lost a beloved parent to violence. You and the
surviving parent made do, but you both felt the
absence keenly.
18 Another people raised you. Choose a different
ancestry and use that ancestry’s tables to build
your life experiences.
Sylph Homelands
d6 Homeland
1 You lived in a community where the dominant
ancestry was something other than your own.
Choose a different ancestry and come up with
a reason why you lived among those people.
2–3 You came of age in a secluded earthbound settlement
somewhere in the high mountains or on an island
unreachable by normal means. Where was this place?
What was its most interesting aspect?
4–5 You grew to adulthood on one of the sky islands and
likely took for granted the wonder of your floating
homeland. Does the sky island still fly or has it fallen?
6 You lived apart from all peoples. Your family might
have been exiled from their homeland or disaster
might have sent them fleeing for safety. You have
not seen a sylph other than your family members
and probably have little idea that other enclaves
still exist.
Sylph Education
d6 Result
1 You studied the ancient writings of your people.
Add one language to the list of languages you know
how to speak, read, and write, and gain a random
area of scholarship from the Academic Professions
table (Shadow, page 24).
2 You showed aptitude for the arts and learned to
express yourself through your creations. Add artisan,
artist, or entertainer to your list of professions.
3 Showing little interest in intellectual pursuits, you
found a place aiding your community in other ways.
Add apothecary, healer, farmer, or laborer to your
list of professions.
4 You felt confined by your homeland and ever sought
ways to explore the lands around it. Add explorer,
gatherer, or hunter to your list of professions.
5 Military service called to you, either to protect your
community or to wage war against enemies. Add
soldier to your list of professions.
6 You had an unusual education. Add any one
profession of your choice to your list of professions.
Signature
Background Event
Your life prior to undertaking your first adventure
can inform your character’s outlook and how
he or she reacts to challenges. You likely formed
relationships and lost them, enjoyed windfalls and
suffered setbacks, and might have even had strange
experiences as well. The following table offers a way
to generate a crucial life event that can help shape
your character’s identity. You can roll for a random
result, choose one, or let the offered options inspire
you to come up with one of your own.
Physical Features
Physical features broadly describe your character’s
appearance. Purely descriptive, they have little if any
impact on game play. Unlike humans, who display
incredible variety in form and appearance, sylphs tend
to have uniform builds. Their distinctive qualities come
from the coloration of their skin, hair, and eyes.
d20 Event
1
Drakes attacked your homeland, killing many. You
survived the carnage, but not without suffering a
terrible loss. You might have an irrational fear of
dragons and dragon-like creatures or commit your
life to hunting them to extinction.
2
You have always pushed yourself to fly higher and
higher. You once scaled Mount Fear’s slopes and
on reaching the top, threw yourself into the air. You
flew almost high enough to see the dome of the
world before you fell back to the ground.
3
A magician with wicked intentions cast a spell
that wrenched you from your life. You appeared
inside a summoning circle and remained there
for weeks. The magician questioned you, tested
your capabilities, and subjected you to magical
experiments. Eventually the magician made
an error, and you slipped free and killed the
summoner. You have taken steps to protect
yourself from such magic again.
4
After a heated quarrel with your family, you cut your
ties to them and left to see the world.
5
You have always traveled far and wide but
continually return to your community, where you
fell in love, had children, and contributed to their
raising. While you were on one of your expeditions,
something happened, and on your return you were
shocked to find your family had vanished.
6
A miscast spell brought destruction and devastation
to your community. You fought the spell’s effects to
save as many lives as you could.
7
Each sylph community relies on a force of defenders
to protect themselves against foes. Your protectors
wield lances and ride on the backs of giant ravens.
Their exploits inspired you and you joined their
efforts to protect your people.
8
While exploring the lands around your community,
you disturbed a dragon, who snatched you from
the air and kept you as part of its treasure for
many years. Your relationship began with you as
its prisoner, but in time you formed a bond that
became true friendship. Adventurers “rescued” you
by murdering the dragon in its lair and plundering its
treasure. You were too bewildered by the attack and
the loss to react.
9
You flew high enough to escape the world’s pull and
laid eyes upon the star-studded darkness of infinity.
The experience shook you and you have never flown
so high again.
10
You spent many years focused on your profession.
On looking back you realize you sacrificed time and
relationships. You have never felt more alone.
11
A voice you heard in the wind revealed a secret that
chilled you to the bone. What was this secret and
how does it apply to you?
d20 Event
12
You committed a crime, broke a tradition, or
brought shame to your family and community.
Your people branded you to mark you as a pariah
and cast you out, vowing your death if you ever
returned. What did you do to earn this fate?
13
You embraced the virtues embodied in the Storm
Lord and joined the rank of its guard. You feel the
storm raging within you, and your anger at what
the world has become fills you with a desperate
longing to scour the lands of what you see as an
infestation.
14
A colony of reen gained a foothold in your
community and transformed the people living there
into bizarre machine hybrids. You escaped with your
life and nothing else.
15
Demons spilled through a tear above your home
community and fell from the rift like maggots, each
transforming into something more awful than the
last. The invaders ripped your people apart, and you
watched as your lover was torn to wind by a hulking
anvil-headed brute. You flew away to escape, but
you have suffered nightmares ever since.
16
A great-great grandparent, long believed dead,
showed up in your homeland community, claiming
to have explored the world and made many terrible
discoveries. Your ancestor spoke of a coming war
with the Void, of a demonic invasion, of the end of
all things, in hopes of stirring your people to action.
Not long after, your relative disappeared without
a trace, leading you to believe someone murdered
your ancestor.
17
You learned that a lost sky island holds an ancient
relic that could be instrumental in securing the
world. You have spent years searching for it, and a
recent discovery suggests that it now tumbles over
the Desolation.
18
You fell in love with a mortal shepherd and, against
your family’s wishes, have left your world behind to
live with your one true love. Time passed, and your
lover aged and eventually died. Devastated by your
loss, you have no idea what to do next.
19
You traveled to the Valley of Sighs, a place
important to your people hidden in the Shield
Mountains. There you encountered a genie.
Rather than drive you off, the genie revealed the
unspeakable truth about demons and the Hunger in
the Void, and begged your forgiveness for making
you. Shaken, you fled the valley, but the memory
has never left you.
20
While flying one evening, you heard a voice in the
wind, a shriek that warned you of imminent danger.
Vampire bats were converging on you, and without
the warning they might have killed you. You now
listen to the wind for other messages.
Signature Background Events
Apparent Age
Time shows great kindness to sylphs, whose bodies
undergo few physical changes after reaching
adulthood and persist in their adult forms until
death finally claims them. As elementals, sylphs can
live indefinitely and without fear of succumbing to
sickness or toxins, but violence can snuff out their
lives as quickly as anyone’s.
Coloration
Sylph coloration draws from a palette containing all
the colors of the skies, from bone white to midnight
blue to the black of the space between the stars.
Coloration passes down from parents to offspring
only rarely; randomness determines a sylph’s
appearance. The following table gives you a selection
of possible colors for skin, eyes, and hair. You can have
different colors for each.
Appearance
Sylphs can pass for short, slight humans, but their
easy movements and sometimes exotic appearance
makes them stand out. Sylphs place little stock in
physical beauty, but many others find them striking
to the point of being captivated by them. Even sylphs
of average appearance find themselves appealing to
humans and others.
Apparent Age
d6 Result
1 You have yet to escape childhood, probably
no more than 10 years old. Your Size drops to
1/2. You’re about 3 feet tall and weigh about
30 pounds.
2 You have grown into adolescence, no longer
a child but not quite an adult. You stand about
4 feet tall and weigh as much as 100 pounds.
3 The blush of youth has not yet faded even though
you have reached adulthood. You stand about
5 feet tall and weigh around 120 pounds.
4–6 You have shed the last of your youthful qualities
and have grown into adulthood. You might be
30 years old or 300, but you have a timeless
quality that makes it impossible to discern your
actual age by appearance alone.
Coloration
d20 Coloration
1–2 Peach
3–4 White
5–6 Black
7–8 Light gray
9–10 Sky blue
11–12 Dark gray
13–14 Green
15–16 Pink
17–18 Azure
19–20 Purple
Appearance
3d6 Appearance
3 You have been horribly mangled, scarred, and
blighted. You might have been a great beauty
in the past, but tragedy has reduced you to a
monstrous appearance.
4–5 You appear strange and otherworldly. You have
such unusual features that others might find you
intimidating.
6–8 You lack any of the more interesting sylph traits.
Your coloration might be muted and you likely
lack any of the distinguishing characteristics for
which your people are famed.
9–12 Among sylphs, you appear more or less like
everyone else. Humans, halflings, and other
people find much to like about your appearance,
though, and many consider you attractive.
13–15 You have a quality that sets you apart from other
sylphs. You are considered a looker by your own
people and quite fetching by others.
16–17 No one would mistake you for being human.
Your body reveals your elemental heritage and
you possess qualities that others find unusual or
even strange.
18 Your appearance transcends normal standards
of beauty, and mortals find you both alluring
and frightening. You have a significant physical
quality that makes your elemental heritage
unmistakable.
Personality
d20 Trait
1–2 Silver tracery or filigree appears on your skin all
over your body.
3–4 Cloudlike patterns move just under your skin.
5–6 Your eyes flash when you experience strong
emotions.
7–8 Tiny sparkling flecks in your skin appear like
stars when you’re in darkness.
9–10 Your hair moves on its own, as if feathered by
a breeze.
11–12 Your body reflects the sky’s current appearance
wherever you happen to be.
13–14 You had images of birds inked into your skin
and, weirdly, they fly all over your body.
15–16 You never seem to be in contact with the
ground. Your feet are always an inch or so
above any surface on which you stand. You still
sink if you move onto a liquid and fall if you
move out onto empty space.
17–18 The sighs, moans, and shrieks of blowing wind
fringe your voice.
19–20 You shine and sparkle whenever you are in
sunlight.
Dependability
3d6 Dependability
3 You can’t depend on me for much of anything.
I almost never see things through and I’m given
to impulsive behavior.
4–5 I have a hard time staying organized and
prioritizing what’s important over what’s not.
6–8 Sometimes I become so distracted, I forget
what I am supposed to be doing.
9–12 I try to be conscientious, but I sometimes fall
short.
13–15 For the most part, I do what I say I will do. I try
to stay organized and keep my priorities right.
16–17 I lead an orderly, disciplined life. I almost
always do what I say I will do and people can
rely on me.
18 I become so focused on a task that I ignore
almost everything else until I finish. You can
depend on me to do one thing at a time.
Distinctive Traits
Many sylphs have interesting patterns and qualities
in their skin that help set them apart from others.
Some appear to have silvery filigree or sparkling
dots, or their skin color might change to match the
time of day in their environment. Add in all the
minor scars and breaks one might pick up and other
modifications one might make to add further detail
to your character’s looks. The following traits should
give you an interesting physical quality or inspire
you to make one up for yourself.
Personality
An individual’s personality forms from life
experiences, connections to others, and the
satisfaction of certain needs and the absence of
others. Your character can have any personality
you like, whether one like your own or someone
much different from you. If you like, you can make
use of the personality tables presented below. Each
lets you randomly generate a personality facet that,
when taken together, gives you an identity you can
adopt in play.
Dependability
The degree of dependability describes how reliable
you are and whether you follow through on your
promises and can make good decisions that recognize
the needs of others.
Sociability
Your sociability describes how well you get along
with others, but also how you regard strangers and
acquaintances.
Outlook
Your outlook reflects your most common state
of mind. You could be calm and confident or nervous
and pessimistic.
Receptiveness
Receptiveness describes your ability to try and do
new things as well as your ability to adapt to changing
circumstances.
Affability
How you behave in social situations comes down
to affability. You might be reserved or gregarious.
Morality
Your morality describes how you make decisions,
whether you veer toward selfless behavior or put
your own interests first.
Sociability
3d6 Sociability
3 People are the worst. I have few friends and
almost no close friends.
4–5 I avoid interacting with strangers, and it takes a
lot to get me to open up to others.
6–8 Some think me aloof and reserved, but I prefer to
keep to myself.
9–12 People can be good or bad. I don’t make a
judgment about them until I get to know them.
13–15 Sure, some people are bad, but most aren’t and
I try to give others the benefit of the doubt.
16–17 I like people and hate thinking badly of others.
I have never met a stranger.
18 I try to help everyone I meet, even to my
detriment.
Outlook
3d6 Outlook
3 Doom, doom, everywhere is doom. Nothing good
will ever happen to me and the whole world is
against me.
4–5 I have terrible nerves and am anxious most of the
time.
6–8 I am something of a pessimist. I expect the
worst in almost any situation so that I’ll never
be disappointed.
9–12 Life is what it is. I can be calm and collected or
nervous to the point of fearful. It all depends on
the situation.
13–15 I strive to be a positive, upbeat person. I look
for the good in things and hope for the best
outcomes.
16–17 I am calm, serene, and easygoing. Little bothers
me.
18 Give me enough time and I can figure it out.
There’s nothing too difficult, too complicated, too
dangerous that I’m not at least willing to try.
Receptiveness
3d6 Receptiveness
3 I’m not at all interested in breaking my routine. I
need order in my life.
4–5 If it’s not broken, why fix it? Be practical.
6–8 New ideas and activities make me uncomfortable.
9–12 I’m up for trying new things, just not all the time.
13–15 I’m always thinking about new ways to do things
and new activities to pursue. I might not do them
all, but I’m willing to try.
16–17 I’m always willing to do something different. I am
looking for new experiences.
18 You’ll never guess what I’m about to do. I tend to
act without warning or reason.
Affability
3d6 Affability
3 People exhaust me. I loathe social situations and
try to escape them as fast as I can.
4–5 I am quiet around other people, preferring my
own company to others.
6–8 I prefer to let others do the talking. I think about
what people say and consider every angle before
offering my opinion.
9–12 I can handle myself in social situations, but I’m
also fine when I am alone.
13–15 I enjoy social situations and good conversation.
16–17 I am outgoing, friendly, and love to have fun with
others.
18 I am loud and boisterous. I love being at the
center of attention.
Morality
3d6 Morality
3 I do what I want without regard for the
consequences.
4–5 Nothing and no one has greater importance than
myself. Other people come and go, and their
struggles and successes have nothing to do with
me unless they interfere with what I want to do.
6–8 You have to look after yourself because no one
else will. I’ll help out, but I’ll grumble about it.
9–12 I look out for myself, but I do try to do the right
thing when I can.
13–15 I know the difference between right and wrong.
I feel obligated to do the right thing.
16–17 I always strive to do good. I treat others with
kindness and respect, and lend a hand whenever
I can.
18 I make considerable sacrifices to help other
people. If everyone would make the same effort to
uplift and support one another, the world would
be a better place.
Additional Profession
As a starting character, you have two professions. You
derived your first from your education. Your second
profession, which you determine now, describes how
you presently make ends meet. Use the following
table only if your character remained in a sylph
community for the majority of time. If your character
lived or lives elsewhere, you can use the profession
tables in Shadow. Your profession also grants you a
bonus or a penalty to your starting lifestyle roll. If you
determine your profession using the Shadow tables,
roll a d6 to determine how it affects your lifestyle roll:
1, –2; 2, +0; 3, –1; 4, +1; 5, +0; 6, +2.
Sylph Professions
d20 Profession (lifestyle bonus or penalty)
1 Raven-handler (+0)
2 Apothecary or healer (–1)
3 Artisan or artist (+1)
4 Entertainer or musician (+0)
5 Farmer or herder (–1)
6 Laborer (–2)
7 Merchant (+1)
8 Politician (+2)
9 Servant (–1)
10 Scholar (roll on the Academic Professions
table in Shadow, page 24) (+1)
11 Criminal or outlaw (–3)
12 Constable or detective (+0)
13 Guard or soldier (+0)
14 Exile or hermit (–3)
15 Wanderer (–2)
16 Guide (–2)
17 Cartographer (+0)
18 Envoy (+1)
19 Storm God devotee (+2)
20 Reprobate (–3)
Starting Equipment
You begin the game with equipment determined
by your lifestyle and your most recently gained
profession. Roll a d6, add to it the bonus or penalty
from your profession, and find the total on the
following table.
Starting Lifestyle
Total Lifestyle Total Lifestyle
–1 or less Destitute 4–5 Comfortable
0–1 Poor 6–7 Wealthy
2–3 Getting By 8 Rich
Clothing
Lifestyle Clothing
Destitute Foul rags and a tattered blanket
Poor Threadbare and patched basic clothing
with a ratty cloak
Getting By Basic clothing and a cloak
Comfortable A fine cloak and three sets of basic
clothing
Wealthy A fine cloak, six sets of well-made basic
clothing, one set of noble’s clothing with
jewelry worth 5 gc
Rich A fine cloak, ten sets of noble’s clothing,
and jewelry worth 10 gc
Weapons
Lifestyle Weapons
Destitute Club or sling with 10 stones
Poor Staff, club, or sling with 10 stones
Getting By A basic weapon of your choice and a sling
with 10 stones
Comfortable A military or swift melee weapon of your
choice and a dagger
Wealthy A military or swift melee weapon of your
choice and a dagger
Rich A military or swift melee weapon of your
choice and a dagger
Personal Gear
Lifestyle Personal Gear
Destitute Dirt and crust
Poor Sack, loaf of bread, jug of water, flint and
steel, candle
Getting By Backpack, rations, skin filled with water, coil
of rope, tinderbox, 2 torches
Comfortable Backpack, rations, skin filled with water, coil
of rope, tinderbox, 2 torches
Wealthy Backpack, rations, skin filled with water, coil
of rope, lantern, 2 flasks of oil
Rich Backpack, rations, skin filled with water,
coil of rope, lantern, 2 flasks of oil, all of the
finest quality
Special Gear
Lifestyle Personal Gear
Destitute A profound odor
Poor Sadness and want
Getting By Nothing special
Comfortable A healing potion and one of the following:
scroll containing an incantation of a rank
0 spell, small shield, healer’s kit, tool kit, or
writing kit
Wealthy A healing potion and one of the following:
scroll containing an incantation of a rank
0 spell, small shield, healer’s kit, tool kit, or
writing kit
Rich Three healing potions, a personal servant
(commoner), and a bodyguard (mercenary)
Starting Funds
Lifestyle Starting Funds
Destitute —
Poor 1d6 bits
Getting By 1d6 cp
Comfortable 3d6 cp
Wealthy 1d6 ss
Rich 1d6 gc
```

### Sylph — Demon Lord's Companion 2

- **Entry Type:** Standard Ancestry
- **Source:** Demon Lord's Companion 2
- **Source Page:** 13
- **PDF Page:** 14

```text
Sylph
The sylphs are a people who were shaped from wind
and cloud by the genies after they spun the world into
existence. They served their creators as wardens of the
skies, in their role as makers of clouds and shepherds
of storms. When their creators went mad, the sylphs
retreated to the high places and have lived among
the mountains ever since—sometimes spotted from a
distance, but rarely encountered.
Heaven’s Children: Of all the elementals, sylphs
appear the most human, having a size and shape
similar to the mortal peoples. They have slim, willowy
bodies, with skin color that ranges from the purple
of thunderheads to the rose red of a new day’s dawn.
Their eyes give away their inhuman nature—the orbs
lack pupils or irises, their entire surfaces being white,
blue, or starry blackness. Most sylphs stand 5 feet tall
and weigh 120 pounds, regardless of gender.
Elementals: Like gnomes and salamanders, sylphs
lack mortal souls. For them, death is final, ending their
existence. When a sylph dies, it turns into a strong,
shrieking wind that buffets everything around it.
Windy Aeries: The sky beckons to sylphs, calling
them to soar as they did in ancient times, before
the fall of their creators. Most sylphs live in isolated
monasteries built atop the peaks and accessed by
steep staircases that wind up the mountainside. All
along the climb, one finds statues of mythological
creatures, erected to keep the sylphs’ enemies at
bay. In their communities, the sylphs pass the years
meditating and practicing their fighting forms, in
preparation for when their creators return to save
the world from the Demon Lord. Sylphs tend to be
guarded and do not welcome outsiders.
Spoken in Whispers: Sylphs communicate in their
native tongue, Sylphen. A breathy, airy language, it
lacks punctuation, and ideas are strung together in
long bursts of speech. Other people find the language
incomprehensible, and a linguist might work for years
to translate just a fraction of it.
Hail the Storm Lord: Most sylphs venerate a
being known to them as the Storm Lord, a figure
of lightning and thunder depicted as a three-faced
bearded man who rides in a chariot drawn by four
eagles, one for each wind (north, east, south, and
west). His symbol is a lightning bolt. The Storm Lord
is most likely a genie who was deified after centuries
of prayer and worship. Priests dedicated to the Storm
Lord have access to the Air, Destruction, and Storm
traditions.
Common Names: Alees, Erea, Feeth, Hithr, Iye,
Nefa, Ossa, Sa, Shasor, Siver, Ual, Usa, Ven, Vimvin,
and Wirrah.

14
Creating a Sylph
Attribute Scores Strength 8, Agility 11,
Intellect 9, Will 11
Perception equals your Intellect score + 1
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak Sylphen.
Immune damage from disease or poison;
diseased, poisoned
Light as a Feather You never take damage from
landing after a fall.
Whirling Evasion When you would take damage
from a creature you can see, you can use a
triggered action to take half the damage and
move up to 1d3 yards without triggering a free
attack. This movement ignores difficult terrain.
Dying Winds When you die, your body
transforms into a screaming whirlwind of air
that dissipates moments later. Each creature
within 1 yard of you must make a Strength
challenge roll. On a failure, a creature takes
damage equal to your healing rate, moves
1d6 yards away from you, and falls prone.
On a success, the creature just takes half the
damage.
Level 4 Sylph Expert
Characteristics Health +4
You either learn one spell or gain Zephyr Form.
Zephyr Form When you are not submerged in
a liquid, you can use an action, or a triggered
action on your turn, to assume a zephyr form.
You remain in this form for as long as you
concentrate, up to 1 hour. While in this form,
you gain the following benefits:
• You are invisible.
• You gain a +6 bonus to Speed and the
flier trait. You cannot fall while flying.
• You are immune to all damage.
• You can move freely through openings
wide enough to permit the passage of
air, and you can move through spaces
occupied by other creatures.
• You treat liquids as solid surfaces.
• When you move through a space
occupied by another creature that is your
Size or smaller, the creature must get a
success on a Strength challenge roll or
move 1d3 yards away from you and fall
prone.

15
Sylph Age
3d6 Starting Age
3
You are a child, no more than 9 years old. You are
Size 1/2. Halve your height and weight. After 1d6
years, your Size becomes 1 and you double your
height and weight.
4–5 You are an adolescent, from 10 to 15 years old.
6–8 You are a young adult, from 16 to 20 years old.
9–12 You are an adult, from 21 to 50 years old.
13–15 You are a middle-aged adult, from 51 to 100 years old.
16–17 You are an older adult, from 101 to 200 years old.
18 You are a venerable adult, 201 years old or older.
Sylph Build
3d6 Build
3 You are short and either thin or heavy.
4–5 You are heavy.
6–8 You are short.
9–12 You are of average height and weight.
13–15 You are tall.
16–17 You are thin.
18 You are tall and either thin or heavy.
Sylph Appearance
3d6 Appearance
3 You are hideous.
4–5 You are ugly.
6–8 You are plain and homely.
9–12 You are average-looking.
13–15 You are pretty or handsome.
16–17 You are striking.
18 You are beautiful.
Sylph Personality
3d6 Personality
3
Your changeable nature and violent mood swings
make you unpleasant to be around.
4–5
You cannot take anything seriously. You laugh at
inappropriate times and rarely follow through on
your promises.
6–8
Breezy and ethereal, you come off as if your head
is in the clouds. You are easily distracted.
9–12
You wear your emotions on your sleeve and you
aren’t ashamed to let others know how you feel.
13–15
Your emotions often change to match those of
people around you.
16–17
Warm and personable, you make friends wherever
you go. People want to be around you.
18
Violent and aggressive, you are an unending storm
of emotion.
Sylph Background
d20 Background
1 You survived an attack by drakes.
2 You climbed to the top of Mount Fear.
3
A vile summoner snatched you away from your
homeland with a spell and forced you into service.
4 You left behind your old life to see the world.
5
You had a family and children, but they vanished
while you were away. You have spent your life
searching for them.
6
When a giant lumbered into your community, you
led the children to safety.
7
You joined the Aerie Vanguard, warriors who flew on
the backs of the great ravens to guard your lands.
8
You were snatched by a dragon and kept as part
of its treasure until you managed to escape.
9
A strong wind swept you off the side of a
mountain, and after you finally landed, you
eventually made your way back home.
10 You earned a living working in your profession.
11
The oracles revealed that you would perform
some great work.
12 You were exiled after betraying your people.
13
The priests of the Storm Lord raised you and
taught you about their faith.
14
Slavers descended on your village and captured
you, then held you prisoner for a few years.
15
You found an old temple of the Storm Lord and
discovered an incantation of the shock Storm spell.
16 One of your ancestors was a great hero.
17
You found a place where a falling star landed.
Start with an extra interesting thing.
18 You inherited a rapier from your father or mother.
19
You found a ruined temple of an ancient,
forgotten god. There, you had a vision that
shattered your mind. You don’t remember
anything, but you gained 1d3 Insanity as a result of
the experience.
20 You came into money. Start the game with 2d6 cp.

16
```

### Troglodyte

- **Entry Type:** Standard Ancestry
- **Source:** Wretched and Unclean
- **Source Page:** 3
- **PDF Page:** 3

```text
Creating
Troglodytes
You can use the following rules to create unique
troglodyte characters. Add to these benefits from
paths you choose to create more powerful troglodytes.
Troglodytes do not cooperate with other peoples and
thus do not fit into typical groups.
Creating a Troglodyte
Starting Attribute Scores Strength 1d3 + 11, Agility 1d3 + 8,
Intellect 1d3 + 6, Will 1d3 + 7
Perception equals your Intellect score + 2
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 12, Power 0
0 Damage, — Insanity, 1d6 Corruption
Languages and Professions You speak Troglodytic
Immune gaining Insanity; frightened
Frightening A creature that has neither the frightening nor
horrifying traits must get a success on a Will challenge
roll or become frightened for a number of rounds equal
to 1d3 + its Insanity total. If the creature is already
frightened, it instead gains 1 Insanity. A creature cannot
again be affected by your frightening talent until after it
completes a rest.
Darksight You can see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Strength from Pain While you are injured, you make
attack rolls with 1 boon and your weapon attacks deal
1d6 extra damage.
Sunlight Weakness You are impaired while you are in areas
lit by sunlight.
Level 4 Troglodyte Expert
Characteristics Perception +2, Health +5
You learn one spell or gain Hide in Shadows.
Hide in Shadows You can attempt to hide when you are
at least partially obscured by shadows, even if you are
being observed.
```

### Undine

- **Entry Type:** Standard Ancestry
- **Source:** Freeport Companion
- **Source Page:** 10
- **PDF Page:** 11

```text
Undines
The wild people under the waves, called undines,
have lived in the songs and stories of sailors for many
years. They are considered by many a mythical race,
every tale merely one more of the yarns spun by old
salts deep in their cups. Some of those stories told of
helpful water spirits who would save the drowning
and lead the lost to safety. Others tell of wild and fierce
people who swam up from the depths to drag vessels to
a watery doom or called down wind and rain to batter
ships and send them off course, lost forever. Whether
they see the undines as friend or foe, most people who
live by the sea swear that the creatures are real, even if
those folk have never seen one.
Undines, of course, do exist, along with a variety
of other ocean-dwelling peoples—merrows, nereids,
sirens, and so forth. Undines stand apart from the
faeries and spirits of the sea in that they are elementals,
a soulless race created by the genies when the world
was still young, ordered to shape, nurture, and protect
their creation from the demons of the Void. Although
the genies have since gone mad and become scattered
across the lands far and wide, the undines and other
elemental peoples live on, remnants of those powerful
shapers of reality and keepers of the ancient lore.
Aloof Elementals: After the genies ceded their
mastery of the world to the faeries and the mortal
races, the elementals went their separate ways,
with the gnomes withdrawing underground, the
salamanders to the fiery, inhospitable places, and the
sylphs to high mountain peaks. The undines withdrew
to the ocean depths, where they have remained for
thousands of years, sometimes glimpsed but rarely
encountered. Undines divorced themselves from the
lesser peoples and other elementals alike, distrusting
all outsiders. Now that they have begun to return to the
world, they do so cautiously, finding it much changed
from the way they left it.
Returning to the World: Only in recent times have
the undines shown themselves to surface-dwellers
in any great numbers. What began as a trickle, with
a few envoys and traders bearing wonders from the
depths, has increased over the years as undine families
have begun settling in Freeport, coastal communities,
and other established settlements on remote islands.
Though undines are as comfortable out of the water
as in it, their recent arrival and commingling seems
odd to most land-dwellers, but the undines keep their
reasons to themselves, leaving only speculation over
what accounts for the behavior.

11
Born from Water: A tall, willowy people, undines
stand about 6 feet tall and weigh up to 120 pounds.
They have smooth, moist skin tinged with blue, green,
or, rarely, pink, and plain features, with large, dark
eyes, two small slits for nostrils, and wide mouths
with generous lips. Their skin sometimes shimmers,
as if it were covered in fine scales. All have webbing
between their fingers and toes.
Elementals: Undines, like other elementals, enjoy
a long life span, surviving for two centuries or longer.
Since they lack souls, they live but one life, and death
is always permanent for them. In fact, when undines
die, their bodies turn to water and collapse into a
brief, rushing flood.
Dividers of Land: The genies made the undines,
just as they made the gnomes, the sylphs, and the
salamanders, and as such, the undines had a purpose:
to enrich the lands with water and promote life all
over the world. It fell to them to divide the lands with
oceans, to carve out the beds for rivers and lakes, and
to couple with the sylphs to make the clouds that
brought the life-giving rains. When madness started
to afflict the genies, the undines withdrew to the seas,
leaving the world they had helped create to await a
time when their masters would return. Now, with the
shadow of the Demon Lord darkening the world, they
believe the awaited time is at hand.
Changeable Nature: An undine can be as calm
as a still pool or as tempestuous as a hurricane,
liable to switch from one mood to another with little
provocation and no warning. Undines can be warm
and comforting, or cold and biting. They never cling
to grudges, though, and consider the end of any
altercation to be the end of the problem that caused it.
The King under the Waves: Like other elementals,
undines do not worship gods in the manner of
mortals and instead serve the genies, as they were
made to do so long ago. Undines serve all the genies,
but they hold an affinity for those who mastered the
waters of the world. One figure in particular has risen
to prominence among the undines, an entity they call
the King under the Waves—a name they invoke but
never explain. In truth, this entity is an ancient, insane
genie locked beneath a sunken city. The undines
who serve this being keep their master in a state of
sleep, lest he waken and bring about the apocalypse.
Devotees of the King under the Waves have access to
the Destruction, Storm, and Water traditions.
Common Names: Anana, Bein, Callouch, Eeffre,
Frish, Louschen, Mascha, Nahsh, Oola, Sselesh,
Thundra, Yorrsh.
Creating an Undine
Attribute Scores Strength 10, Agility 10, Intellect 9, Will 10
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common
Tongue and Tidetongue, the language of the undine
people.
Shadowsight You see into areas obscured by shadows as
if those areas were lit.
Swimmer You ignore the effects of difficult terrain when
you swim.
Water Breathing You can breathe air and water.
Fire Intolerant You take double damage from fire. When
you take damage from fire, you also become impaired
for 1 round.
Watery Death When you die, you collapse into a pool of
water and spread across a flat surface out to a 3-yard
radius. The water extinguishes all flames, and each
standing creature in the area must get a success on an
Agility challenge roll or fall prone.
Flowing Step You can use an action to assume a watery
form, move up to your Speed, and return to your normal
form. This movement does not trigger free attacks. As
well, during this movement, you take half damage from
weapons and you can move through spaces occupied by
other creatures.
Level 4 Undine Expert
Characteristics Health +5
You either learn one spell or gain Water’s Might.
Water’s Might When you use Flowing Step, you make
attack rolls and challenge rolls with 1 boon for 1 round.
Undine Age
3d6 Age
3 You are a child, no more than 8 years old. You are
Size 1/2. Halve your height and weight.
4–5 You are an adolescent, from 9 to 15 years old.
Reduce your height and weight by 25%.
6–8 You are a young adult, from 16 to 30 years old.
9–12 You are an adult, from 31 to 50 years old.
13–15 You are a middle-aged adult, from 51 to 100 years
old.
16–17 You are an older adult, from 101 to 150 years old.
18 You are a venerable adult, 151 years old or older.
Undine Build*
3d6 Build
3 Reduce your height by 3d6 inches and your
weight by 1-1/2 pounds per inch. Reduce your Size
to 1/2 if you are not Size 1/2 already.
4–5 Reduce your height by 2d6 inches and your
weight by 1 pound per inch.
6–8 Reduce your weight by 3d6 pounds.
9–12 You are of average height and weight.
13–15 Increase your weight by 3d6 pounds.
16–17 Increase your height by 2d6 inches and your
weight by 1 pound per inch.
18 Increase your height by 3d6 inches and your
weight by 1-1/2 pounds per inch.
*The Build table modifies your starting height and weight.
Regardless of gender, your starting height is 72 inches, and
your starting weight is 120 pounds.

12
Undine Appearance
3d6 Appearance
3 You have gray, lusterless skin that peels and
flakes, large, milky white eyes, and your limbs
are all of differing lengths.
4–5 You have a hunched posture, a wide, toothy maw,
and large, unblinking eyes.
6–8 You have mottled skin, with alternating patches
of blue and green, overlarge eyes, and subtle
facial features.
9–12 You are average in appearance, having blue,
green, or pink skin, large dark eyes, and
understated facial features.
13–15 You have a slender body with silvery skin.
Your large eyes have a bluish color.
16–17 Fine silver and gold scales cover your body, and
you have small fins at your elbows, at your knees,
and growing from the top of your head.
18 Golden scales cover your sleek body, and a tall
fin runs from the center of your forehead down
the back of your skull, extending all the way to
the middle of your back. Similar fins adorn your
legs and arms. You are both striking and alien
to humans.
Undine Personality
3d6 Personality
3 You are cruel, vicious, and loathsome. You might
hide your nature or show your wickedness to all
you encounter.
4–5 You are wild and free, laughing all the time.
Others might find your personality uplifting,
even infectious, while some might find you
deeply irritating, never acting serious no matter
how dire the situation.
6–8 You tend to be aggressive and given to violent
outbursts. You can control yourself, but you
find it hard to do so when faced with frustrating
situations.
9–12 Your moods swing from one extreme to the other,
your personality as changeable as the sea.
13–15 You feel your moods shift all the time, but you
have learned to harness them and prevent them
from having power over you. Others might find
you intense, but you rarely lose control.
16–17 You rarely show emotion. Calm and collected, you
display restraint in almost any situation.
18 You strive to do good in the world, to transform
creation into something greater than the genies
imagined, into a place where all worlds are free
from the Void’s shadow. You show compassion
for other peoples and work to understand them
and their kind, so you can help them realize a
better path.
Undine Beliefs
3d6 Belief
3 You believe that some genies became the very
gods that mortals now worship, and thus you
commit yourself to one or more religions.
4–17 If the gods exist, they are powerful beings only
masquerading as deities. You serve your makers,
the genies, and believe them to be the true lords
of creation.
18 The genies abandoned your people and proved
themselves to be unworthy of respect or
adoration. You serve no one but yourself.
Undine Background
d20 Background
1 A brush with death left profound changes in your
body. In places, your skin appears watery, almost
translucent, and reveals your muscles, bones, and
possibly organs underneath.
2 You explored waters beyond those in the known
world and encountered many strange things.
Gain 1d3 Insanity.
3 You were captured in a fisher’s net and sold to
a freak show. Then you were held in a water-filled
tank for 1d6 years before you escaped.
4 You were exiled by your people and forced to
make your way among the land-dwellers.
5 Deep ones besieged your homeland. Although
you helped fight them off, they killed many people
you loved.
6 You found an ancient sunken city that held many
mind-bending wonders. Gain 1d3 Insanity.
7 You traveled to the far south to learn more about
the jotun. Add Trollish to the list of languages you
can speak.
8 A parent, spouse, or child disappeared, and you
have spent your time since searching for them.
9 You spent time in one of the Nine Cities to learn
more about humanity. You left unimpressed.
10 You earned a living working in your profession.
11 You fell in love with a member of a different
ancestry. Roll a d6. On an odd number, your lover
broke your heart. On an even number, you broke
your lover’s heart.
12 You have a spouse and 1d6 children.
13 You lived among the aquatic faerie for 1d6 years.
Add Elvish to the list of languages you can speak.
14 Your parents are leaders in your home community,
and you are expected to take their place when
they retire.
15 You saved the life of someone important, and
that person now owes you a favor. Work out the
details of this relationship with your GM.
16 A magician used a spell to summon you from your
homeland and bound you to serve her for the last
1d3 years.
17 You were separated from your family at a young
age, became lost, and then found by a fisher who
raised you.
18 You found something unusual under the sea.
Begin the game with an additional interesting
thing.
19 You helped defend your home community from
monsters. Start the game with a spear.
20 You came into money. Start the game with 2d6 cp.
A swarm of mottled green
sea demons bumped against
```

**Errata associada — Demon Lord Errata (10oct17) e Demon Lord Errata (19nov17), p. 2:** a linha de imunidades foi omitida de `Creating an Undine` em *Freeport Companion*: `Immune damage from disease and poison; diseased, poisoned`. Esta nota registra a correção publicada sem reescrever silenciosamente o `Full Entry` acima.

### Vampire

- **Entry Type:** Derived Ancestry
- **Source:** Tombs of the Desolation
- **Source Page:** 9
- **PDF Page:** 10

```text
Vampire
Vampires emerge from crypts and climb out of graves to
prey on the living when night falls. Most vampires are true
monsters, cruel and indiscriminate killers made incapable
of remorse by the unholy curse sustaining their unnatural
existence. A few manage to control the terrible impulses
and curb their appetites enough to cling to the tattered
shreds of their lost humanity.
Sire-Bound: A vampire can create another vampire by
bringing a human to the brink of death and feeding the
victim a measure of the vampire’s blood. This act kills
the victim, who then rises the next night as a vampire
under its sire’s control (see “Creating New Vampires” on
the next page). Since creating new vampires means more
competition for fresh blood and risks attention from
inquisitors and undead-slayers, vampires sire offspring
with great reluctance.
Maddening Thirst: Blood is never far from a vampire’s
thoughts, being needed to sustain its immortal existence.
The agony of this thirst and the fear of helplessness
combine in a relentless craving that intensifies the longer
the vampire goes without drinking.
Feral and Monstrous: Though traces of their humanity
linger in the vampires’ undead states, long, sharp fangs fill
their mouths, and their features become drawn and pale
by the pangs of blood thirst. When a vampire attacks, its
visage twists into something monstrous, its naked hunger
inspiring fear and panic.
Witch-King’s Curse: The Witch-King created the first
vampires from his most loyal servants, transforming them
into immortal subjects made dependent on him for blood.
The vampires in his service benefited from preternatural
strength, quickness, keen senses, and durability, making
them useful to the Dark One and loyal thanks to their
incessant thirst. All vampires descend from them, and it’s
believed some ancestors survive to this day, sealed in the
Desolation’s black tombs.
Common Names: Vampires might use their human
names or adopt new ones. Many feel the transformation
is a rebirth and assume new identities suited to their new
existences. Such vampires adopt noble titles or monikers
that reflect their new natures, such as the Red Duchess,
Shade, Desire, or She.

Tombs of the Desolation
Into the Wastes
Tombs of the Desolation
10
Into the Wastes
1
Creating a Vampire
All vampires begin as humans, so first create a human
character and then apply the following traits to that
character.
Attribute Scores Strength +1, Agility +1, Intellect +1, Will +1
Characteristics Perception +1, Defense +1 , Speed +2,
Insanity +1d6, Corruption +1d3
Immune damage from cold, disease, poison; asleep,
diseased, fatigued, immobilized, poisoned, and slowed
Darksight You can see in areas obscured by shadows and
darkness within medium range as if those areas were lit.
Beyond this distance, you treat darkness as shadows and
shadows as lit.
Sire-Bound You are bound to the vampire that created
you until it uses an action to free you or it is destroyed.
You cannot attack the vampire that made you, and you
become compelled by it while it is within short range
of you.
Dreadful Appearance When you attack a living creature
that can see you, the target must make a Will challenge
roll. The target becomes frightened for 1 minute on
a failure. On a success, it becomes immune to your
Dreadful Appearance until after it completes a rest.
Natural Weapons You have long fangs, which count as
swift finesse weapons that deal 1d6 damage.
Unnatural Existence Your healing rate is 0 and cannot be
increased above 0.
Blood Pool You need blood to sustain your existence. You
measure the blood you have accumulated in a pool of
blood points. When you first become a vampire, you
gain 1 blood point from the vampire that created you.
You add blood points to your pool using the Drink Blood
talent (see below) up to a maximum number equal to 1 +
your group level.
Each time you complete a rest, you must spend 1
point from your blood pool. If you have no blood points
to spend, you gain 1 Insanity and take a –1d6 penalty to
Health (minimum 0; see Torpor below). The penalty is
cumulative, and you are impaired while you have it. You
can remove the accumulated penalty to Health by using
an action to spend 1 blood point.
Blood Healing You can use an action or a triggered action
on your turn to expend 1 blood point and heal damage
equal to 1 + your group level.
Torpor When the penalty to your Health from the
Blood Pool trait drops your Health to 0, you become
unconscious, resembling a corpse. If you take any
damage while unconscious, you are instantly destroyed.
As an action, another creature can feed you fresh blood
from a living creature to remove the accumulated
penalty to your Health and end this affliction.
Drink Blood When a living creature you have grabbed
takes damage from an attack using your fangs, the
creature takes a penalty to its Health equal to its healing
rate for 1 hour, and you add 1 point to your blood pool.
While the creature has this penalty, it is fatigued.
Superstition While you can see the object of your
superstitious fear (see below), you make attack rolls and
challenge rolls with 3 banes.
Burned by Sunlight You take 2d6 damage and reduce your
blood pool by 1 at the end of each round you are in an
area lit by sunlight. As well, you take double damage
from Celestial spells and make challenge rolls to resist
those spells with 1 bane.
Level 4 Expert Vampire
Characteristics Health +6
Pass for Human You can use an action to alter your
appearance so that you look as you did in the prime
of your life. You keep this appearance until you take
damage, you attack, or you use an action to resume your
normal appearance.
Creating New Vampires
To create a “child,” or vampire brood, you must drain
blood from a living human until it becomes incapacitated
and then feed the victim your blood by using an action
and spending 1 blood point. The victim dies at the end of
the round. If the corpse is exposed to sunlight, it instantly
burns to ash. If, however, the corpse is interred somewhere
the light cannot reach, such as a tomb or a crypt, it rises as a
new vampire when the sun next sets.
Vampire Ancestry Tables
When determining your character’s background and
description, start with the human ancestry tables in Shadow
of the Demon Lord to establish your identity before you
became a vampire. Then choose or randomly determine
the options presented in the following tables to describe
how your character became a vampire and how the
experience affected you.
Superstitious Fear
d6 Superstitious Fear
1 Symbols of the gods
2 Mirrors
3 Running water
4 Cats
5 Silver
6 Garlic

Tombs of the Desolation
Into the Wastes
Tombs of the Desolation 11
1
Unusual Qualities
d20 Unusual Quality
1 You never cast a reflection on mirrored surfaces.
2 Your fangs sprout from the end of your tongue,
which is horrid and long.
3 You stink of decay.
4 Your eyes gleam redly.
5 All animals except rats, bats, and wolves are
hostile to you.
6 You look like a walking corpse. Suppurating
wounds and eruptions spread across your body,
your hair falls out in clumps, and your pupils are
milky white.
7 Your fingers lengthen into claws. They count as
swift finesse weapons that deal 1d3 damage.
8 You lose all your body hair.
9 You can speak only in whispers.
10 You weep blood.
11 Whorls and patterns cover your skin.
12 Flies follow you where you go.
13 You must bury yourself in dirt in order to rest.
14 You cannot create new vampires.
15 Children cry in your presence.
16 While the blood points in your blood pool equal
or exceed half your maximum, you appear bloated
and flushed.
17 You have a persistent, rattling cough.
18 Your skin is paper-thin and your body appears
skeletal.
19 Fur grows in the palms of your hands.
20 You cast no shadow.
Sire’s Identity
d6 Sire
1 Someone you met in passing but did not
really know
2 An ancestor or member of your family
3 A complete stranger
4 A rival or enemy
5 A close friend
6 Your lover
Sire’s Motive
d6 Your sire turned you into a vampire to . . .
1 . . . get revenge against you or someone else.
2 . . . torment you or someone else.
3 . . . gain a companion.
4 . . . acquire a servant.
5 . . . corrupt you.
6 . . . fight against his or her enemies.
Relationship to Sire
d6 Your sire . . .
1 . . . mistreats and abuses you, delighting in your
suffering.
2–3 . . . abandoned you, though he or she still has
power over you.
4 . . . has great affection for you.
5 . . . freed you.
6 . . . was destroyed. Roll again to determine the
earlier relationship, ignoring rolls of 6.
your hair falls out in clumps, and your pupils are
Your fingers lengthen into claws. They count as
You must bury yourself in dirt in order to rest.
While the blood points in your blood pool equal
or exceed half your maximum, you appear bloated
Your skin is paper-thin and your body appears

Tombs of the Desolation
Into the Wastes
Tombs of the Desolation
12
Into the Wastes
1
The paths characters walk near the
Desolation lead to strange and
dangerous places.
Prince of Darkness
Expert Path
Vampirism offers great power
at a terrible price. Vampires
are faster and stronger
than ordinary humans,
but they suffer from an
overpowering thirst for
blood. Unable to walk in
sunlight, they become
creatures of the night,
skulking in the shadows
to ambush their prey and
evade the inquisitors who
would consign them to
the purifying flames.
Their dependency on
fresh blood creates enemies
wherever vampires go.
Communities soon grow wise
to the predator in their midst;the
hunter becomes the prey as the
people gather into bloodthirsty mobs
intent on destroying it. Thus vampires
need cunning and control over their
dark impulses to survive the many
dangers arrayed against them.
Princes of darkness find ways to
keep their blood thirst in check and
to improve their talents. They suffer
from all the same weaknesses
as their fellows but develop
techniques to aid in hunting,
withstand enemies’ attacks, and
elude discovery and capture.
To choose this expert path, you
must be a vampire.
The paths characters walk near the
Desolation lead to strange and
dangerous places.
Prince of Darkness
Expert Path
Vampirism offers great power
at a terrible price. Vampires
fresh blood creates enemies
wherever vampires go.
Communities soon grow wise
to the predator in their midst;the
hunter becomes the prey as the
people gather into bloodthirsty mobs
intent on destroying it. Thus vampires
need cunning and control over their
dark impulses to survive the many
dangers arrayed against them.
Princes of darkness find ways to
keep their blood thirst in check and
to improve their talents. They suffer
from all the same weaknesses
as their fellows but develop
techniques to aid in hunting,
withstand enemies’ attacks, and
elude discovery and capture.
To choose this expert path, you
must be a vampire.
```

### Warg

- **Entry Type:** Beastman Ancestry
- **Source:** Hunger in the Void
- **Source Page:** 45
- **PDF Page:** 46

```text
Wargs
Fierce and volatile, wargs act as the driving force behind
beastmen armies. They cow the lesser beastmen, drive
them forward with barks and threats, and crash down
on their enemies, ripping and tearing, making meat
from their victims. Wargs think nothing of cutting down
beastmen that get in their way or that turn tail to run,
and many wargs spend as much time chopping up their
allies as they do murdering innocents.
Any shred of humanity that remains inside wargs
lies buried under hatred and cruelty. Wargs are little
more than wild, rabid animals. They attack without
provocation, mutilate their victims’ bodies, and then
move on to find something else to kill.
Most wargs stand between 6 and 7 feet tall and
weigh up to 300 pounds. They have muscled,
humanoid bodies covered in patchy fur (usually
brown, but gray and black are common as well). They
have the heads of wolves, with pronounced muzzles
filled with sharp teeth useful for tearing flesh. Most

46
wear armor they scavenge from their victims, such as
mail or hard leather. Since they don’t take care of their
gear, they spend time after a battle examining their
victims’ bodies for replacement components.
Wargs speak Dark Speech.
WARG BERSERK DIFFICULTY 50
Size 1 beastman
Perception 11 (+1); shadowsight
Defense 10; Health 60; Insanity 1d3 + 3; Corruption 1d3 + 1
Strength 15 (+5), Agility 10 (+0), Intellect 9 (–1), Will 10 (+0)
Speed 12
Immune frightened
Demonic Wrath While the warg is injured, it is consumed
by demonic wrath, making attack rolls with 1 boon and
dealing 1d6 extra damage with its weapon attacks.
ATTACK OPTIONS
Greatsword (melee) +5 with 1 boon (3d6)
SPECIAL ACTIONS
Vicious Bite When a warg takes damage from a creature
within its reach, it can use a triggered action to bite the
triggering creature. The warg makes a Strength attack
roll with 1 boon against the target creature’s Defense,
dealing 1d6 damage on a success.
Unchecked aggression is a trait of all wargs, but in the
wargs known as berserks, the violence is fueled from a
dark source. In the heat of battle, a warg berserk loses
all reason and restraint, transforming into a brutal
killing machine. When not fighting, berserks pass the
time cutting themselves up, gouging patterns in their
skin using broken bones from slain enemies. Warg
hunters work as scouts and assassins, prowling the
wild places for victims to kill. Like all beastmen, they
loathe humans and focus their attacks against them,
always singling out human targets in battle.
Creating a Warg
Unique warg characters have the following
statistics.
Starting Attribute Scores
Strength 1d3 + 11, Agility 1d3 + 10,
Intellect 1d3 + 7, Will 1d3 + 8
Perception equals its Intellect score + 2
Defense equals its Agility score
Health equals its Strength score + 2
Healing Rate equals one-quarter its Health
Size 1, Speed 12, Power 0
0 Damage, 1d3 Insanity, 1d3 Corruption
Languages and Professions Wargs understand
Dark Speech, but do not speak.
Vicious Bite When a warg takes damage from
a creature within its reach, the warg can
use a triggered action to bite the triggering
creature. The warg makes a Strength attack
roll with 1 boon against that creature’s
Defense, dealing 1d6 damage on a success.
Level 4 Expert Warg
Characteristics Health +6
Rending Bite The warg’s Vicious Bite deals
1d6 extra damage.
WARG HUNTER DIFFICULTY 25
Size 1 beastman
Perception 13 (+3); shadowsight
Defense 15 (mail); Health 30; Insanity 1d3 + 1; Corruption
1d3
Strength 13 (+3), Agility 12 (+2), Intellect 11 (+1), Will 10 (+0)
Speed 10
Manhunter The warg makes attack rolls with 1 boon against
halflings and humans.
ATTACK OPTIONS
Spear (melee) +3 with 1 boon (2d6)
Longbow (long range) +2 with 1 boon (2d6 + 1)
SPECIAL ATTACKS
Two Attacks The warg uses an action to attack two
different targets with either its spear or its longbow.
Attacks with its spear deal 1d6 damage, and attacks with
its longbow deal 1d6 + 1 damage.
SPECIAL ACTIONS
Hunter’s Mark The warg can use an action, or a triggered
action on its turn, to choose one creature it can see
within medium range. The target becomes the warg’s
mark until the warg completes a rest or uses Hunter’s
Mark again. The warg makes attack rolls against its mark
with 1 boon, and its attacks with weapons deal 1d6 extra
damage.
Mad Pursuit When a creature designated as the warg’s
mark moves, the warg can use a triggered action to
move up to half its Speed.
Vicious Bite When a warg takes damage from a creature
within its reach, it can use a triggered action to bite the
triggering creature. The warg makes a Strength attack
roll with 1 boon against the target creature’s Defense,
dealing 1d6 damage on a success.
```

### Woad

- **Entry Type:** Standard Ancestry
- **Source:** Song of the Woad
- **Source Page:** 7
- **PDF Page:** 7

```text
Woad Characters
Woad resemble humans, and have spirits similar
to human souls, but it is there the resemblance
ends. Most Woad stay with their tribes, having little
interest or cause to mingle with humanity, though
the Hare tribe has recently proved the exception.
However, as the Demon Lord’s shadow creeps across
Urth, fomenting chaos and discord, some Woad feel
moved to leave their people and join the struggle to
save the world.
Common Names: Bors, Cei, Dar, Eda, Fenno,
Makel, Nue, Pan, Ren, Sah, Ter, and Yaz.
Woad Priests
Woad can become priests as can members of any other
ancestry, however they almost always devote themselves
to the Ancestor who watches over their tribes. For more
information on the Woad religion, see Uncertain Faith.
Woad priests can discover traditions from Nature, Primal,
and Spiritualism.
Creating a Woad
Attribute Scores Strength 10, Agility 10, Intellect 9, Will 10
Perception equals your Intellect score
Defense equals your Agility score
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak your tribal dialect
of Woad
Tribal Affiliation Choose a Woad tribe to whom you
belong and gain its benefits.
Level 4
Characteristics Health +5
Magic You discover the Primal tradition or learn one
Primal spell.
Woad Tribes
Badger Tribe
Delver You can move through openings large enough
to permit the passage of Size 1/4 or larger creatures,
treating such openings as difficult terrain.
Escapist You make attack rolls to escape, as well as
challenge rolls to slip free from bonds, with 1 boon.
Bear Tribe
Healer’s Gift When you use an action to stabilize a creature
and the total of your roll is 20 or higher, the target also
heals damage equal to its healing rate.
Shield Other You can use an action, or a triggered action
on your turn, to protect a creature within your reach.
For as long as the target remains within your reach, you
impose 2 banes on the attack rolls of any creature you
can see that attacks the protected creature.

Boar Tribe
Attributes Increase Strength by 1
Characteristics Health +4
Deer Tribe
Characteristics Speed +2
Stealthy You make challenge rolls to hide and sneak with
1 boon.
Eagle Tribe
Characteristics Gain 1 Corruption.
Vicious You gain a +2 bonus to weapon damage rolls
against injured creatures.
Fox Tribe
Languages You know how to speak two additional
languages of your choice
Song Magic You discover the Song tradition.
Hare Tribe
Attributes Increase Intellect by 1
Languages You can read and write the Common Tongue
and you know how to speak another language.
Negotiator You make attack rolls in social situations to
deceive or persuade with 1 boon.
Horse Tribe
Languages You can speak Centauri.
Fast as the Wind When you use an action to rush, you
gain a +4 bonus to Speed.
Otter Tribe
Expert Swimmer You ignore difficult terrain imposed
by swimming and you make challenge rolls to swim
with 1 boon.
Aggression Once per round, when you take damage, you
make attack rolls with 1 boon until the end of the round.
Owl Tribe
Slow Fall When you would take damage from a fall, you
halve the damage.
Spirit Step You can use an action to teleport to an open
space within short range. You can use this talent a
number of times equal to 3 + your Power. You regain
expended uses when you complete a rest.
Raven Tribe
Skilled Climber You make challenge rolls to climb with
1 boon.
Hidden Threat When you attack a creature from which
you are hidden, your attack deals 1d6 extra damage.
Snake Tribe
Nimble Stride Creatures making free attacks against you
make their attack rolls with 1 bane.
Robust Constitution You take half damage from poison.
In addition, you make challenge rolls to avoid or remove
the poisoned affliction with 1 boon.
Wolf Tribe
Characteristics Increase Perception by 1.
Pack Attack When you attack a creature within the reach
of at least one creature friendly to you, you make the
attack roll with 1 boon.
Woad Tables
You can use the human tables in Shadow or Only
Human to determine your character’s age, build,
appearance, and personality. As a Woad, you
venerate the Firstborne spirit of your chosen tribe,
and use the following Woad Background table in
place of the Human Background table.
Woad Background
d20 Background
1 You were exiled from your tribe after you were
discovered trying to plant some seeds you found.
2 At a young age, you brutally murdered two
slavers trying to kidnap you. Gain 1 Insanity.
3 You became separated from your tribe, lost in
the wilds for 1d20 months before settling among
the humans. Add the Common Tongue to the
languages you can speak; re-roll if you already
speak Common.
4 You ambushed and killed a traveler who you
knew had permission to cross your tribe’s land.
Gain 1 Corruption.
5 You and your partner have tried unsuccessfully to
have a child. The tribe believes your spirits were
fading and sent you to live with the Hare tribe as
punishment. If you are a Hare, re-roll.
6 You are the parent of 1d3 children.
7 The Inquisition murdered your entire family.
8 You started your adventuring life with a band
of goblins who stole your interesting thing and
then tried to sell you into slavery.
9 A farmer caught you destroying his crops during
a night raid and branded your chest with a hot
iron that read “Geoff’s Cattle,” upon which no
hair grows.
10 You traveled briefly with explorers mapping your
territory. Add one wilderness profession.
11 Your tribe sent you into the settled world to find
news of the Eagle tribe. If you are an Eagle, re-roll.
12 You led an ambush against poachers in your
tribe’s land and dealt the killing blow to the
offenders.
13 You discover that you were actually born to
a different tribe, and raised by the current
tribe you’re in after they killed your parents
for trespassing.
14 You studied the books found on a corpse in
the forest. You know how to read the Common
Tongue.
15 You are the swiftest runner in your tribe.
16 Your tribe arranged a marriage for you to a
member of another tribe.
17 Your tribe deals extensively with the surrounding
villages. You learn one extra language.
18 You traveled to the Field Without End and
remained there for a time. Add 1d20 years to
your starting age.
19 Your uncle gave you something shiny he found.
It is worth 2d6 cp.
20 You became the chief of your tribe when the
former chief died.
```

### Yerath — Children of the Hive

- **Entry Type:** Expanded Ancestry
- **Source:** Children of the Hive
- **Source Page:** 4
- **PDF Page:** 4

```text
Yerath
Characters
Social structure and scarce numbers make yerath
adventurers nearly nonexistence. Most yerath adventurers
began their lives as anomalies who took up the life of
adventure to fulfill some objective, out of simple curiosity,
or for want of anything better to do. You can create a yerath
character using the rules in Demon Lord’s Companion 2. If
you use that option, your character belonged to a caste and
exited from the hive over some trauma, accident, or other
negative circumstance. You can use the rules here, though,
to create an anomalous yerath. If you do, be sure to use
the supplementary tables that follow in place of the one in
Shadow of the Demon Lord and in the mentioned companion
book.
Attributes
The following option lets you randomize your starting
attribute scores. If you prefer, you can just use the typical
scores, which appear parenthetically after each.
Strength d3 + 9 (11) Agility d3 + 8 (10)
Intellect d3 + 8 (10) Will d3 + 8 (10)
Characteristics
You have values for characteristics as follows.
Defense 12
Health equals your Strength score
Perception equals your Intellect score
Healing Rate equals one-quarter your Health score
Size 1, Speed 10, Power 0
Damage 0 Insanity 0 Corruption 0
Traits
As an anomalous yerath, you have the following traits.
Languages You speak the Common Tongue and Yerathi
Professions Choose worker, soldier, or pathfinder. Your
choice represents the role into which you were thrust prior
to realizing your anomalous nature.
Extra Arms You have a second pair of arms extending
out from your sides beneath your shoulders. You can
perform delicate tasks with them and use them to carry
small, lightweight objects. They lack the strength to wield
weapons or carry anything heavy on their own. When
you have all four hands free, your Strength counts as 2
higher for the purpose of lifting, dragging, and shoving. In
addition, you can use a triggered action on your turn to
reload a weapon you can reach.
Flutter You can use an action to unfurl your wings and thus
gain the Flier trait at half your normal Speed, but you grant
1 boon on attack rolls made against you. You lose this trait
at the end of the round in which you used it.
Musk You can use an action, or a triggered action when
you take damage, to spray musk inside a 1-yard cube
originating from a point in reach. Each creature in the
target space makes a Strength challenge roll. On a failure,
the creature becomes impaired for 1 round.
As part of using this talent, you can also chemically
alter the smell of your musk to leave a message for other
yerath. The message can be as simple as an emotion such
as fear or hatred, or as complex as food nearby, safe place
to rest. For 24 hours after you use this trait, any yerath
within 5 yards of anything that touched your musk gets
your message.
Once you use this trait, you can use it again after 1
minute.
LEVEL 4 YERATH EXPERT
When you reach level 4, increase your Defense by 1 and
your Health by 4. Choose one of the following traits.
Caustic Musk When you use your Musk trait, you can choose
to make your excretion caustic. A creature that fails the
Strength challenge roll also takes 1d6 damage and 1 extra
damage at the end of each round for 1 minute. A creature
can end the extra damage by using an action to clean the
muck away.
Deflecting Carapace You can use a triggered action when
a creature attacks you to use your carapace to block the
attack. Impose 1 bane on the attack roll that enabled the
use of this trait.
Magic You learn one spell from a tradition you have
discovered.
Swift Wings You can use a triggered action on your turn to
use your Flutter trait.
Yerath
Development
It takes a significant event for a yerath to leave their hive.
Under normal circumstance, it simply does not happen.
Being a hive anomaly goes a long way toward explaining
why you leave. Lacking a role to place you within the
hierarchy and the exclusion you face could drive you from
your home. If you chose a different origin, maybe your
hive collapsed from the death of the queen, an outbreak
of plague, infestation of some parasite, or an attack by
enemies. As you make all decisions about your character,
you can come up with any explanation that works.
However, the following entries offer some guidance about
why you live apart from your kin.
Catastrophic
Beginnings
As mentioned, some significant, ruinous event can cause
a colony to fall apart and scatter the survivors. Few yerath
live long after separation from the hive. Despair sets in and
with it comes a loss of appetite or interest in doing much
of anything. It takes great determination to throw off the
melancholy and make a life after the hive. You can use the
Catastrophic Beginnings table to explain what happened to
your community.
Catastrophic Beginnings
d6 Pivotal Event
1
A natural disaster wiped out your people. Waters
flooded your tunnels or an earthquake might have
shook the colony’s dome to rubble.
2
Troglodytes invaded the tunnels under the hive.
They considered your people food and hunted you
to the brink of extinction.
3
An infestation of torch moths invaded the hive. The
moths feed on yerath larva, as well as the genitals
of a yerath queen. Inaction or inability allowed the
moths to wreak havoc.
4
A villainous magic-user came to the hive to secure
an egg from the queen. She refused. The magic-user
destroyed her and took an egg from the unhatched.
Without a queen, the colony disintegrated.
5
Craven humans discovered the hive and, out of fear,
gathered a force to cleanse it. Few yerath survived.
6
The lack of a shared language between your
people and dwarfs, humans, or some other group
led to regrettable deaths. Unable to bridge the
understanding divide, the violence escalated until
almost none of you remained.
Anomalous
Motivations
An accident of birth set you apart from your fellows. Try
as you might, fitting in escapes you. Rather than suffer the
indignity of ostracism, you left. What you hope to find out
there, in the world, is up to you.
Anomalous Motivations
d6 Motivation
1
You envision a future for the yerath in which your
people live free from the rigid hierarchy. You believe
your people’s survival depends on evolving beyond
old, outdated ideas.
2
You hope to revive the yerath colonies in the
north. The queen entrusted you with an egg of an
unhatched queen for you to establish in a hive you
reclaim.
3
You would learn the secret history of your people.
From where did they come? And why come here
instead of someplace else?
4
You seek knowledge from other people. You yearn
to learn their ways in hopes of opening avenues of
understanding between your kind and theirs.
5
You sense a coming catastrophe, an event
threatening to doom the whole world. It might
seem absurd that you could do much about these
troubles, but you have convinced yourself you have
a part to play in deciding the future of Urth.
6
You believe other colonies exist out there still. You
aim to find them.
Yerath Physical
Traits
Station determines your physique and stature. The queen
made you in accordance with the function she bestows on
you. As a drone, you stand about 4 feet tall and weigh in at
100 pounds. As a scout, you stand 5 feet tall and weigh 120
pounds. Finally, you stand 6 feet tall and weigh 160 pounds
as a soldier. As an anomaly, you have no purpose within the
hive and thus enjoy a wider range of variation in height and
weight. To determine your height in feet, roll a d3 and add it
to 3. For every foot of height, you weigh 25 pounds.
Yerath Age
You can expect to live about 60 years. At adulthood, which
you reach at 6 years, you take your place in yerath society.
Before then, you emerge from your larval state at 3 and
enjoy a brief adolescence until adulthood. A hive’s control
over its young makes it unlikely for others to encounter
them unless something happens to the colony.
Yerath Appearance
Outside of the scars and scrapes incurred from carrying
out their tasks, yerath from a particular hive have few
variations between members of the same rank. Scent plays
an important part in individuation rather than appearance,
such that one drone can identify another by tasting the
other’s peculiar pheromones.
From hive to hive, the differences become more
pronounced. Most look just like bipedal cockroaches, but
others resemble other kinds of beetles, while one hive
produces yerath who look like giant praying mantises.
You can decide your appearance, as what you look like
makes no difference to your capabilities. You can also use
the Yerath Distinctive Qualities table to come up with
something that makes you look even more distinct.
Yerath Distinctive Qualities
d20 Distinctive Quality
1
You have iridescent wings in all the colors of the
rainbow.
2 Your carapace has numerous dents and scratches.
3
You’re missing one of your forelimbs. You replaced it
with a prosthetic.
4 You have long or short antennae.
5 You have a strong, musty odor.
6
Your eyes seem large even by your people’s
standards.
7 You always cover your mouth when you eat.
8 You have overlarge mandibles.
9
Bits of web and dust cover your body no matter
how clean you keep yourself.
10
When you become excited, you make a sweet
trilling noise.
11
You have extra barbs and thick hairs on your upper
arms.
12
Unlike the brown or black carapaces common to
yerath, you have an unusual coloration, perhaps
even patterned.
13 You have a deep, gurgling voice.
14
You have a pleasant smell, of damp earth, fresh-cut
grass, or flowers.
15
You have a secondary pair of antennae, much
shorter than your primary.
16
You have a third pair of arms. Though useless, they
make for a great conversation starter.
17 You have a bent, stooped posture.
18 You have an unusually long tongue.
19
You have a nasty crack in your abdomen. It healed,
but it troubles you still.
20
You stand a foot taller or shorter than normal. (If
you’re an anomaly, increase or decrease your height
by one foot.)
Yerath
Personalities
The colony’s health and security remain at the forefront of
its members, leaving little room for personality quirks to
develop. Most yerath have a seriousness others find boring
once the novelty of talking to a giant bug wears off. Ask
them about their work, though, and they become quite
animated, enthusiastic even.
Anomalous yerath have the same ranges of personality
that humans have, and can be good-hearted or villainous,
considerate or selfish. Such yerath do form strong bonds
with the people closest to them and regard their social
circle as a makeshift hive. If you create a drone, scout, or
soldier, use the personality table in Demon Lord’s Companion
2. Otherwise, use the following table.
yerath personalities
3d6 Personality
3
You have so little in common with people outside
your birth hive, you exist in a state of constant
bafflement. You find it difficult to keep up with
what’s going on around you and why.
4–5 Others find you dull, slow, and uninteresting.
6–8
People seem tasty. You’d love to sample their
flesh. You know, though, doing so could land you in
trouble. For now, you keep your interest to yourself.
9–12
You pine for your hive. You know you have no place
there, but you miss the order, the focus, and the
discipline of your people.
13–15
You exult in your freedom. You want to see the
world, experience everything, meet new people.
16–17
People interest you so much, you can just talk to
them for hours. Their personalities, their interests
captivate you. Maybe by meeting more people, you
can discover an identify for yourself.
18
All this stuff, all these people distract you from your
true purpose. You become vexed all the time and
lash out when the frustration grows too great.
Yerath Names
As yerath live their lives as cogs in the great machine of
their communities, they place little stock in names. In fact,
only yerath who travel away from their hives adopt names
in favor of being called “you” or something worse. Some
of the more common names appear on the associated
table, though a yerath might gain a name affiliated with
a different ancestry or maybe just a nickname, such as
Cricket or Twitch.
Yerath Names
d20 Name d20 Name
1 Bedee 11 Not
2 Chatten 12 Prepaat
3 Chech 13 Pteem
4 Chiruut 14 Qim
5 Daken 15 Tirru
6 Iet 16 Titii
7 Jeje 17 Truk
8 Kad 18 Tyten
9 Kik 19 Veech
10 K’riit 20 Z’z
Yerath Starting
Equipment
You begin your career with things your people found that
might have use. Such items show their age. Weapons bear
pits and notches. Cloaks have frayed edges. If you have
some other origin than a hive, you can use the normal rules
for generating your starting equipment. Otherwise, you
have the following items.
Clothing: You have a tattered cloak in a color you choose.
Weapons: You have a club, spear, javelin, or staff.
Gear: You have a backpack, food morsels enough to last you
7 days, a waterskin, and a pouch containing 3d6 cp.
Interesting Thing: You have an interesting thing. You
determine its nature in whatever way you like, though
consider using the table provided for this purpose.
Yerath Interesting Things
d20 Interesting Thing
1 An old, hollowed out yerath head.
2 A lump of stinky wax.
3 A potsherd from some ancient civilization.
4 An obligation to your people.
5 A sword with runes inscribed on the blade.
6 A flea circus!
7 A bit of cloth torn from a banner.
8
A metal sphere that emits dim light for a few
minutes after vigorous rubbing.
9 A bag of food—dead drone parts (3d6 days).
10 A piece of stone bearing a human handprint.
11 A pet rat named Simon.
12 A few lead balls.
13 A gnawed piece of wood (as a club).
14 A debt owed to you by your queen.
15 A large shield with an ornate boss.
16 A map of the surrounding lands.
17
A human bone on which has been inscribed an
incantation of a rank 1 spell of the GM’s choice.
18 A battleaxe that once belonged to a jotun.
19 A unhatched yerath egg.
20 A wasp nest filled with friendly wasps!
```

### Yerath — Demon Lord's Companion 2

- **Entry Type:** Standard Ancestry
- **Source:** Demon Lord's Companion 2
- **Source Page:** 16
- **PDF Page:** 17

```text
Yerath
Most people who live in the Patchwork Lands believe
that the mounds dotting the southern and eastern
reaches of the landscape are merely strange terrain.
Few have any idea that these denuded hills belong
to the yerathi, human-sized sentient insects who
have toiled in the depths for as long as or longer
than humans have claimed the continent. Although
bizarre in appearance and unsettling to those who
have an aversion to insects, yerathi harbor no ill
intentions and strive to foster peace in the world
outside their homes.
Bug People: Wholly alien compared to most other
peoples on the continent, yerathi resemble human-
sized cockroaches. They have a thick carapace,
triangular heads with bulging, globular eyes, and
small mouths surrounded by mandibles. Yerathi have
six limbs: two legs, two strong arms, and two smaller,
weaker arms that they use for tasks that required
manual dexterity. Height and weight depends
on caste, with soldiers being the largest and the
genderless drones the smallest.
Caste System: Yerathi live in a rigid society divided
into castes. Each yerath offspring is assigned to its
caste based on its physical characteristics. The highest
caste within each hive is occupied by just one yerath:
the queen. She rules over the hive as a god. Under her
are her consorts, strong and powerful yerathi who
are her mates and her divine representatives. Below
them in the hierarchy are the soldiers, who defend
the hive. Beneath them are the scouts, who forage for
food, patrol the surrounding area, and scavenge for
materials. Finally, at the bottom are the drones, who
handle all the other labor. Outside their hives, yerathi
mingle with each other regardless of caste, but inside
the hives, a yerath can speak to or interact with a
yerath of a higher caste only if addressed first.
Musk: Yerathi communicate with each other
using a clicking, hissing language. They can learn
the Common Tongue, though they find it difficult to
form the words. Yerathi can also leave messages by
squirting musk on rocks. The chemical composition
of the musk communicates a particular concept to
other yerathi, such as danger, fear, safety, or the like.
Once sprayed, the musk retains potency for a few weeks.
Queen Worship: The yerathi worship their queens
as gods. Their faith in their patrons gives these queens
great magical power, though not quite that wielded
by the old gods. A queen grants her priests, who most
often come from the consort caste, access to the Battle,
Earth, and Life traditions.
Common Names: Chatten, Chech, Chiruut, Daken,
Iet, Jekt, Kad, Kik, Not, Qim, Tirru, and Tyten.
Creating a Yerath
Attribute Scores Strength 9, Agility 10, Intellect 10, Will 9
Perception equals your Intellect score
Defense 12
Health equals your Strength score
Healing Rate equals one-quarter your Health
Size 1, Speed 10, Power 0
0 Damage, 0 Insanity, 0 Corruption
Languages and Professions You speak the Common Tongue
and the Yerath language.
Caste Roll on the Yerath Caste table to determine your caste.
You gain benefits based on the result of your roll.
Drone Add laborer to your list of professions. Increase your
Strength by 2 and Will by 1.
Scout Add guide to your list of professions. Increase your
Agility by 1 and your Perception by 1.
Soldier Add soldier to your list of professions. Increase your
Strength by 2, and your starting Defense is 13 instead of 12.
Extra Arms You have a second pair of arms that end in hands.
These appendages are useful only for fine manipulation
and carrying small, lightweight objects or performing minor
activities. On your turn, you can use a triggered action to
reload a weapon.
Flutter You can use an action to unfurl your wings, which lets
you move by flying until the end of the round, although
you fly at half Speed. While your wings are unfurled, you
grant 1 boon on attack rolls made against you.
Musk You can use an action, or a triggered action when
you take damage, to squirt your musk into a 1-yard cube
originating from a point you can reach. Any creature in
that space must get a success on a Strength challenge

17
roll or become impaired for 1 round. Once you use your
Musk, you must wait at least 1 minute before you can use
it again. As part of using this talent, you can use the scent
to communicate one concept such as fear, anger, sorrow,
or security. Any yerathi within 5 yards of the space can
perceive this message.
Level 4 Yerath Expert
Characteristics Defense +1, Health +4
You either learn one spell or gain Swift Wings.
Swift Wings You can use a triggered action on your turn to
use Flutter.
Yerath Caste
d6 Caste
1–3
You are a drone. You stand 4 feet tall and weigh
100 pounds.
4–5
You are a scout. You stand 5 feet tall and weigh
120 pounds.
6
You are a soldier. You stand 6 feet tall and weigh
160 pounds.
Yerath Age
3d6 Starting Age
3
You are a child, no more than 3 years old. You are
Size 1/2. Halve your height and weight. After 1d3 +
1 years, your Size becomes 1 and you double your
height and weight.
4–5 You are an adolescent, from 4 to 5 years old.
6–8 You are a young adult, from 6 to 10 years old.
9–12 You are an adult, from 11 to 20 years old.
13–15 You are a middle-aged adult, from 21 to 40 years old.
16–17 You are an older adult, from 41 to 60 years old.
18 You are a venerable adult, 61 years old or older.
Yerath Personality
3d6 Personality
3 You come off as dull and uninteresting.
4–5
Bitterness fills your heart, and you have a
pessimistic outlook on just about everything.
6–8
You lack empathy. Your scientific interests lead
you to perform certain actions that others might
deem unethical or even immoral.
9–12
You’re curious and inquisitive, never happier than
when you’re learning something new.
13–15 Skittish and manic, you excite easily.
16–17
You are utterly devoted to your queen. No matter
where you go, she rules your heart, despite the
fact that you will never be her consort.
18
Hatred consumes you, and you commit yourself to
vengeance for something done to you or your kind.
Yerath Background
d20 Background
1
Monsters destroyed your hive. You were the
only survivor.
2
You discovered a shrine to an ancient and
terrible being. The experience twisted your
soul, giving you 1 Corruption.
3
You became cut off from your hive. Alone, you
struck out to find your own way.
4
Something murdered your queen, sending your
hive into disarray. Gain 1d3 Insanity.
5
You fought soldiers of the bandit princes who
rule over the Patchwork Lands and grew to
hate them.
6
You found a bit of weird technology. Start with
a random enchanted object.
7
You’re secretly a queen. Your height and
weight do not change, but you increase
your Intellect and Will by 1 each instead of
the increases you received for your original
caste. You fled your hive to avoid your
responsibilities, and you want to never return.
8
A wizard captured you to learn more about
your people. By the time you escaped, you
were far from home.
9
You traveled extensively. Add another language
to the list of languages you can speak.
10 You worked in your profession.
11
A human saved your life. You owe this person
a debt. This character might be played by
another player or someone under the GM’s
control.
12
You were sent out from your hive to learn more
about the world. Add one area of scholarship to
your list of professions.
13
A powerful witch cursed you to become human.
You remained in that form for several years
before returning to your normal form.
14
You made a great discovery or performed a
heroic deed, making you a hero of your people.
15
You found something interesting. Start with an
extra interesting thing.
16
Deep underground, you discovered a passage
to a gnome enclave and made friends of the
people living there. You stayed with them long
enough to learn their language. Add Gnomish
to the list of languages you can speak.
17 You took a sword from a human corpse.
18
You found an incantation of a rank 0 spell (of
the GM’s choice).
19
You offended the queen and were exiled as
a result.
20 You came into money. Start the game with 2d6 cp.

18
```
