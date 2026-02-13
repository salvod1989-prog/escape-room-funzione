
import { NPC, Item, Quest } from './types';

export const MAP_SIZE = 100;

export const ITEMS: Record<string, Item> = {
  CEREBRO_PART: { id: 'CEREBRO_PART', name: 'Pezzo di Cerebro', description: 'Un trasmettitore radio potenziato costruito da Dustin.', icon: 'Radio', type: 'TOOL' },
  SLINGSHOT: { id: 'SLINGSHOT', name: 'Fionda di Lucas', description: 'Precisa e letale contro i Demogorgoni.', icon: 'Target', type: 'TOOL' },
  WALKIE_TALKIE: { id: 'WALKIE_TALKIE', name: 'Walkie-Talkie', description: 'Per comunicare tra le dimensioni.', icon: 'Radio', type: 'TOOL' },
  DND_MANUAL: { id: 'DND_MANUAL', name: 'Manuale D&D', description: 'Contiene le statistiche di ogni mostro.', icon: 'Zap', type: 'QUEST_ITEM' },
  MATH_TROPHY: { id: 'MATH_TROPHY', name: 'Trofeo di Matematica', description: 'Erica lo ha vinto con il massimo dei voti.', icon: 'Star', type: 'QUEST_ITEM' },
  SCOOP_AWAY_HAT: { id: 'SCOOP_AWAY_HAT', name: 'Cappello Scoop Away', description: 'L\'uniforme ufficiale del centro commerciale.', icon: 'Compass', type: 'CONSUMABLE' },
  RUSSIAN_TAPE: { id: 'RUSSIAN_TAPE', name: 'Nastro Russo', description: 'Una registrazione misteriosa da decriptare.', icon: 'Radio', type: 'QUEST_ITEM' },
  WALKMAN: { id: 'WALKMAN', name: 'Walkman di Max', description: 'Suona "Running Up That Hill" a ripetizione.', icon: 'Radio', type: 'TOOL' },
  EGGOS: { id: 'EGGOS', name: 'Scatola di Eggos', description: 'Il cibo preferito di Eleven. Ne va matta.', icon: 'Zap', type: 'CONSUMABLE' },
  POLICE_BADGE: { id: 'POLICE_BADGE', name: 'Distintivo di Hopper', description: 'Simbolo di autorità ad Hawkins.', icon: 'ShieldCheck', type: 'QUEST_ITEM' }
};

export const INITIAL_NPCS: NPC[] = [
  // LIVELLO 1 - Hawkins Middle School (Hub Superiore)
  {
    id: 'dustin_1',
    name: 'Dustin Henderson',
    role: 'Nerd Supremo',
    position: { x: 40, y: 42 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dustin',
    theorySubject: 'Il Buttafuori della Discoteca',
    dialogue: ["Ehi! Stiamo cercando di entrare nel database segreto. Immagina di essere un buttafuori... che formula useresti?"],
    rewardItemId: 'CEREBRO_PART',
    level: 1
  },
  {
    id: 'lucas_3',
    name: 'Lucas Sinclair',
    role: 'Il Cecchino',
    position: { x: 60, y: 42 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    theorySubject: 'L\'Invasione Aliena',
    dialogue: ["Il pezzo di Cerebro! Ottimo lavoro. Ora dobbiamo contare gli Zorg prima che ci mangino i compiti!"],
    requiredItemId: 'CEREBRO_PART',
    rewardItemId: 'SLINGSHOT',
    level: 1
  },
  {
    id: 'mike_2',
    name: 'Mike Wheeler',
    role: 'Il Paladino',
    position: { x: 50, y: 35 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    theorySubject: 'Il Ladro Confuso',
    dialogue: ["Lucas ha fiducia in te, ecco la fionda. Ma ora aiutami a separare le password dai PIN bancari!"],
    requiredItemId: 'SLINGSHOT',
    rewardItemId: 'WALKIE_TALKIE',
    level: 1
  },
  // LIVELLO 2 - Starcourt Mall (Hub Centrale)
  {
    id: 'will_4',
    name: 'Will Byers',
    role: 'Will il Saggio',
    position: { x: 38, y: 50 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Will',
    theorySubject: 'Il Mistero della Nave Fantasma',
    dialogue: ["Passo... mi senti? Qualcosa non va nel sottosuolo del Mall. Alcune postazioni sono vuote!"],
    requiredItemId: 'WALKIE_TALKIE',
    rewardItemId: 'DND_MANUAL',
    level: 2
  },
  {
    id: 'erica_5',
    name: 'Erica Sinclair',
    role: 'La Mente',
    position: { x: 50, y: 50 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erica',
    theorySubject: 'Il Misuratore di Livello (Stile Dragon Ball)',
    dialogue: ["Ascolta nerd, non ho tempo per i tuoi giochetti. Se vuoi questo manuale, devi misurare l'energia nemica!"],
    requiredItemId: 'DND_MANUAL',
    rewardItemId: 'MATH_TROPHY',
    level: 2
  },
  {
    id: 'steve_6',
    name: 'Steve Harrington',
    role: 'La Baby Sitter',
    position: { x: 62, y: 50 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve',
    theorySubject: 'Caccia al Forziere di Barbanera',
    dialogue: ["Erica dice che sei sveglio. Vediamo se sai trovare l'oro di Barbanera o se finirai in trappola."],
    requiredItemId: 'MATH_TROPHY',
    rewardItemId: 'SCOOP_AWAY_HAT',
    level: 2
  },
  // LIVELLO 3 - Hawkins Lab (Hub Inferiore)
  {
    id: 'robin_8',
    name: 'Robin Buckley',
    role: 'La Linguista',
    position: { x: 42, y: 58 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robin',
    theorySubject: 'Il Torneo di eSports',
    dialogue: ["Bel cappello! Fa molto 'Scoop'. Ora decifriamo i risultati di questo torneo russo..."],
    requiredItemId: 'SCOOP_AWAY_HAT',
    rewardItemId: 'RUSSIAN_TAPE',
    level: 3
  },
  {
    id: 'max_7',
    name: 'Max Mayfield',
    role: 'Mad Max',
    position: { x: 58, y: 58 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    theorySubject: 'L\'Agente Segreto Smemorato',
    dialogue: ["Il nastro è rovinato. Dobbiamo filtrare i nomi delle pizze per trovare i codici segreti!"],
    requiredItemId: 'RUSSIAN_TAPE',
    rewardItemId: 'WALKMAN',
    level: 3
  },
  {
    id: 'eleven_9',
    name: 'Eleven',
    role: 'Undici',
    position: { x: 50, y: 65 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eleven',
    theorySubject: 'I Compiti Mangiati dal Cane',
    dialogue: ["Amici... non mentono. Ma i cani mangiano i compiti. Quante celle vuote vedi?"],
    requiredItemId: 'WALKMAN',
    rewardItemId: 'EGGOS',
    level: 3
  },
  // BOSS FINALE - Centro esatto (Hopper's Cabin)
  {
    id: 'hopper_10',
    name: 'Jim Hopper',
    role: 'Il Capo',
    position: { x: 50, y: 50 },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hopper',
    theorySubject: 'La Pagella della Scuola di Magia',
    dialogue: ["Hai gli Eggos? Bene. Undici è al sicuro. Risolviamo l'ultimo registro di Hogwarts e andiamo a casa."],
    requiredItemId: 'EGGOS',
    rewardItemId: 'POLICE_BADGE',
    level: 4
  }
];

export const INITIAL_QUESTS: Quest[] = [
  { id: 'q_logic', title: 'Operazione Hawkins', description: 'Supera i 4 livelli di enigmi basati sulle formule magiche di Excel.', status: 'ACTIVE', isMain: true }
];
