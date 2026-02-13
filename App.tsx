
import React, { useState, useEffect } from 'react';
import { GameState, NPC, Item } from './types';
import { INITIAL_NPCS, INITIAL_QUESTS, ITEMS } from './constants';
import Map from './components/Map';
import TheoryQuiz from './components/TheoryQuiz';
import { Box, Scroll, Star, Radio, Compass, Zap, Target, Award, ShieldCheck, AlertCircle, Info, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerPos: { x: 50, y: 55 }, // Spostato più vicino al centro (50, 50)
    dimension: 'NORMAL',
    inventory: [],
    activeQuests: INITIAL_QUESTS,
    completedQuests: [],
    currentLevel: 1
  });

  const [currentNPC, setCurrentNPC] = useState<NPC | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [discoveredItem, setDiscoveredItem] = useState<Item | null>(null);
  const [levelUpMessage, setLevelUpMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Filtra gli NPC in base al livello attuale
  const visibleNPCs = INITIAL_NPCS.filter(npc => npc.level === gameState.currentLevel);

  useEffect(() => {
    const npcsOfCurrentLevel = INITIAL_NPCS.filter(n => n.level === gameState.currentLevel);
    const completedOfThisLevel = npcsOfCurrentLevel.filter(n => gameState.completedQuests.includes(n.id));

    if (completedOfThisLevel.length >= npcsOfCurrentLevel.length && gameState.currentLevel < 4) {
      setTimeout(() => {
        setLevelUpMessage(true);
      }, 1000);
    }
  }, [gameState.completedQuests, gameState.currentLevel]);

  const triggerFlash = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
  };

  const handleNPCClick = (npc: NPC) => {
    if (gameState.completedQuests.includes(npc.id)) return;

    // Controllo oggetto richiesto
    if (npc.requiredItemId && !gameState.inventory.includes(npc.requiredItemId)) {
      const missingItem = ITEMS[npc.requiredItemId];
      setErrorMessage(`ACCESSO NEGATO: ${npc.name} richiede "${missingItem.name}" per procedere.`);
      triggerFlash(); 
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    triggerFlash();
    setCurrentNPC(npc);
    setShowQuiz(true);
    setErrorMessage(null);
  };

  const goToNextLevel = () => {
    triggerFlash();
    setGameState(prev => ({ ...prev, currentLevel: prev.currentLevel + 1 }));
    setLevelUpMessage(false);
  };

  const toggleDimension = () => {
    triggerFlash();
    setGameState(prev => ({
      ...prev,
      dimension: prev.dimension === 'NORMAL' ? 'UPSIDE_DOWN' : 'NORMAL'
    }));
  };

  const handleQuizSuccess = () => {
    if (currentNPC?.rewardItemId) {
      const item = ITEMS[currentNPC.rewardItemId];
      setDiscoveredItem(item);
      setShowQuiz(false);
    }
  };

  const collectItem = () => {
    if (!discoveredItem || !currentNPC) return;
    setGameState(prev => ({
      ...prev,
      inventory: [...new Set([...prev.inventory, discoveredItem.id])],
      completedQuests: [...prev.completedQuests, currentNPC.id]
    }));
    setDiscoveredItem(null);
    setCurrentNPC(null);
  };

  const getItemIcon = (iconName: string, size = 24) => {
    switch(iconName) {
      case 'Radio': return <Radio size={size} className="text-blue-400" />;
      case 'Compass': return <Compass size={size} className="text-red-400" />;
      case 'Zap': return <Zap size={size} className="text-yellow-400" />;
      case 'Target': return <Target size={size} className="text-purple-400" />;
      case 'Star': return <Star size={size} className="text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck size={size} className="text-emerald-400" />;
      default: return <Box size={size} className="text-slate-400" />;
    }
  };

  const getLevelName = (level: number) => {
    switch(level) {
      case 1: return "Hawkins Middle School";
      case 2: return "Starcourt Mall";
      case 3: return "Secret Russian Lab";
      case 4: return "Hopper's Cabin";
      default: return "Hawkins";
    }
  };

  return (
    <div className={`min-h-screen ${gameState.dimension === 'UPSIDE_DOWN' ? 'bg-[#0a0005]' : 'bg-slate-950'} text-white p-4 font-mono transition-colors duration-1000 overflow-hidden`}>
      
      {/* Effetto Flash Interazione */}
      {isFlashing && <div className="fixed inset-0 bg-white/60 z-[99999] pointer-events-none animate-flash-overlay" />}

      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <h1 className="retro-font text-2xl text-red-600 flicker tracking-tighter uppercase">Hawkins Logic</h1>
            <div className="bg-red-600 text-white px-3 py-1 text-[10px] rounded animate-pulse font-black shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              LV. {gameState.currentLevel}
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[9px] font-bold tracking-[0.2em] uppercase">
            <MapPin size={10} /> {getLevelName(gameState.currentLevel)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDimension}
            className={`px-6 py-2 retro-font text-[9px] border-2 transition-all ${gameState.dimension === 'NORMAL' ? 'border-slate-700 hover:border-blue-500 hover:bg-blue-900/10' : 'border-red-600 bg-red-950/40 text-red-400 flicker'}`}
          >
            {gameState.dimension === 'NORMAL' ? 'DIMENSIONE: NORMALE' : 'DIMENSIONE: SOTTOSOPRA'}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
        
        {/* Sinistra: Zaino Dettagliato */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <section className="bg-slate-900/40 border border-slate-800 p-4 rounded-lg shadow-inner">
            <h2 className="text-[10px] font-bold text-amber-500 flex items-center gap-2 mb-3">
              <Scroll size={14} /> PROGRESSO SQUADRA
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400 uppercase">
                <span>Codici Risolti</span>
                <span>{gameState.completedQuests.length} / 10</span>
              </div>
              <div className="bg-black/60 h-2 w-full rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${(gameState.completedQuests.length / 10) * 100}%` }}
                />
              </div>
            </div>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg flex-1 flex flex-col overflow-hidden shadow-2xl">
             <h2 className="text-[10px] font-bold text-blue-400 flex items-center gap-2 mb-4 uppercase">
              <Box size={14} /> Inventario di Hawkins
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {gameState.inventory.map(id => (
                <div key={id} className="group bg-black/50 p-3 border border-slate-800 rounded-lg flex gap-4 hover:border-blue-500/50 transition-all hover:bg-slate-900/40 animate-in slide-in-from-left-4">
                  <div className="flex-shrink-0 bg-slate-900 p-2 rounded-md border border-slate-700 group-hover:bg-blue-900/20 transition-colors animate-swing">
                    {getItemIcon(ITEMS[id].icon, 24)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-blue-100 uppercase mb-1 tracking-tight">{ITEMS[id].name}</h3>
                    <p className="text-[9px] text-slate-500 leading-tight font-sans italic opacity-80">"{ITEMS[id].description}"</p>
                  </div>
                </div>
              ))}
              {gameState.inventory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-10">
                  <Box size={48} className="mb-4" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Lo zaino è vuoto</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Centro: Mappa */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Map 
            playerPos={gameState.playerPos}
            dimension={gameState.dimension}
            npcs={visibleNPCs}
            onNPCInteract={handleNPCClick}
            onMove={(x, y) => setGameState(prev => ({ ...prev, playerPos: { x, y } }))}
          />
          
          {/* Terminale Notifiche */}
          <div className="relative">
            <div className={`transition-all duration-500 p-3 rounded border font-mono text-[11px] h-12 flex items-center gap-3 shadow-lg
              ${errorMessage ? 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-black/80 border-slate-800 text-emerald-400 italic'}
            `}>
              {errorMessage ? <AlertCircle size={16} className="animate-pulse" /> : <Info size={16} />}
              <span className={errorMessage ? 'animate-bounce' : ''}>
                {errorMessage || `> SEGNALE RICEVUTO: Raggiungi il centro della mappa per incontrare la squadra.`}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Modali */}
      {showQuiz && currentNPC && (
        <TheoryQuiz 
          subject={currentNPC.theorySubject} 
          onSuccess={handleQuizSuccess} 
          onClose={() => setShowQuiz(false)} 
        />
      )}

      {discoveredItem && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-6 text-center backdrop-blur-xl">
          <div className="max-w-md animate-in zoom-in duration-500">
             <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center bg-slate-900 border-4 border-amber-500 rounded-3xl shadow-[0_0_60px_rgba(251,191,36,0.3)]">
                <div className="animate-swing">
                  {getItemIcon(discoveredItem.icon, 100)}
                </div>
                <Star className="absolute -top-6 -right-6 text-amber-500 animate-spin-slow" size={50} fill="currentColor" />
             </div>
             <h2 className="retro-font text-xl text-white mb-2 uppercase tracking-tighter">Nuovo Oggetto Sbloccato!</h2>
             <h3 className="text-3xl font-black text-amber-500 uppercase mb-4">{discoveredItem.name}</h3>
             <div className="bg-slate-800/50 p-4 rounded-lg mb-8 border border-slate-700">
               <p className="text-slate-300 italic text-sm leading-relaxed">"{discoveredItem.description}"</p>
             </div>
             <button 
               onClick={collectItem}
               className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-sm rounded-xl shadow-[0_10px_30px_rgba(217,119,6,0.4)] transition-all transform hover:scale-105 active:scale-95"
             >
               Aggiungi allo Zaino
             </button>
          </div>
        </div>
      )}

      {levelUpMessage && (
        <div className="fixed inset-0 z-[1000] bg-red-950/40 backdrop-blur-2xl flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-900 border-4 border-emerald-500 p-10 rounded-2xl shadow-[0_0_120px_rgba(16,185,129,0.4)] animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50 shadow-inner">
                <Award className="text-emerald-500" size={60} />
             </div>
             <h2 className="retro-font text-2xl text-white mb-4 uppercase tracking-tight">Zona Messa in Sicurezza</h2>
             <p className="text-slate-400 mb-8 font-mono text-sm uppercase tracking-widest">Procedere alla prossima area di Hawkins.</p>
             <button 
               onClick={goToNextLevel}
               className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-sm rounded-lg transition-all shadow-[0_4px_30px_rgba(16,185,129,0.5)] transform hover:scale-105"
             >
               Avanza al Livello {gameState.currentLevel + 1}
             </button>
          </div>
        </div>
      )}

      {/* Vittoria Finale */}
      {gameState.completedQuests.length === 10 && (
        <div className="fixed inset-0 z-[2000] bg-[#0a0000] flex flex-col items-center justify-center text-center p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] animate-pulse"></div>
          <Award className="text-amber-500 mb-8 animate-bounce shadow-2xl" size={140} />
          <h1 className="retro-font text-5xl text-red-600 mb-6 uppercase flicker tracking-widest">MISSIONE COMPIUTA</h1>
          <p className="text-emerald-400 font-mono text-2xl max-w-2xl mb-12 leading-relaxed">
            Hai decifrato tutti i codici russi e salvato i tuoi amici. Hawkins è di nuovo (temporaneamente) al sicuro. Il Sottosopra è stato ricacciato indietro.
          </p>
          <div className="flex gap-6">
            <button 
              onClick={() => window.location.reload()}
              className="px-12 py-5 bg-white text-black font-black uppercase hover:bg-amber-500 transition-all rounded shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-110"
            >
              Rigioca Avventura
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
