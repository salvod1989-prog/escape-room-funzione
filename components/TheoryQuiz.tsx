
import React, { useState, useEffect, useRef } from 'react';
import { generateTheoryQuestion } from '../services/geminiService';
import { Loader2, Terminal, CheckCircle2, XCircle, Send, ChevronRight, Cpu, Info } from 'lucide-react';

interface TheoryQuizProps {
  subject: string;
  onSuccess: () => void;
  onClose: () => void;
}

const TheoryQuiz: React.FC<TheoryQuizProps> = ({ subject, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState<any>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [systemLog, setSystemLog] = useState<string[]>(['Inizializzazione decrittatore...', 'Accesso al nodo locale Hawkins...']);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await generateTheoryQuestion(subject);
        setQuestionData(data);
        setSystemLog(prev => [...prev, 'Dati ricevuti con successo.', 'In attesa di formula completa...']);
      } catch (err) {
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [subject]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleValidate = () => {
    if (!typedAnswer.trim() || !questionData || isSubmitted) return;

    // Normalizzazione per il confronto: togliamo spazi e rendiamo minuscolo
    const cleanGuess = typedAnswer.replace(/\s+/g, '').toLowerCase();
    const cleanCorrect = questionData.options[questionData.correctIndex].replace(/\s+/g, '').toLowerCase();
    
    // Richiede che la formula inizi con '='
    const startsWithEqual = typedAnswer.trim().startsWith('=');
    const isRight = startsWithEqual && cleanGuess === cleanCorrect;

    setIsSubmitted(true);
    setIsCorrect(isRight);
    
    if (!startsWithEqual) {
      setFeedback("ERRORE: Ogni formula magica di Hawkins deve iniziare con il simbolo '='.");
    } else {
      setFeedback(isRight ? questionData.feedbackCorrect : questionData.feedbackIncorrect);
    }

    setSystemLog(prev => [...prev, `Input: ${typedAnswer}`, isRight ? 'STATO: FORMULA VALIDATA' : 'STATO: ERRORE SINTASSI']);

    if (isRight) {
      setTimeout(() => onSuccess(), 3000);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={50} />
        <p className="retro-font text-emerald-500 text-sm animate-pulse">CARICAMENTO PROTOCOLLO HACKING...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border-4 border-emerald-500 rounded-lg shadow-[0_0_60px_rgba(16,185,129,0.4)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto">
        
        {/* Sinistra: Sidebar Tech */}
        <div className="hidden md:flex w-56 bg-black/40 border-r border-emerald-500/30 p-4 flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-500 opacity-50">
            <Cpu size={14} />
            <span className="text-[8px] retro-font">SYS_MONITOR</span>
          </div>
          <div className="flex-1 font-mono text-[10px] text-emerald-500/60 overflow-hidden">
             {systemLog.map((log, i) => (
               <div key={i} className="mb-2 leading-tight">> {log}</div>
             ))}
             <div className="animate-pulse">_</div>
          </div>
          <div className="mt-auto bg-emerald-900/20 p-2 border border-emerald-500/30 rounded">
             <div className="flex items-center gap-2 text-emerald-400 mb-1">
               <Info size={12} />
               <span className="text-[9px] font-bold">TIPS</span>
             </div>
             <p className="text-[9px] text-emerald-500/70 leading-tight">
               Usa sempre il punto e virgola (;) per separare gli argomenti e le virgolette (") per il testo.
             </p>
          </div>
        </div>

        {/* Destra: Content area */}
        <div className="flex-1 flex flex-col">
          {/* Terminal Header */}
          <div className="bg-emerald-500 p-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-slate-900" />
              <span className="text-slate-900 font-bold text-xs uppercase">DECRYPT_ENGINE_LOGIC_PRO</span>
            </div>
            <button onClick={onClose} className="text-slate-900 font-bold hover:bg-white/20 px-2 rounded">ESC</button>
          </div>

          <div className="p-8 space-y-8 flex-1 flex flex-col justify-center">
            {/* Question Text */}
            <div className="space-y-2">
              <p className="text-emerald-500/50 text-[10px] font-mono uppercase tracking-[0.3em]">REQUISITO CRITTOGRAFICO:</p>
              <h2 className="text-xl md:text-2xl text-white font-serif leading-relaxed italic border-l-4 border-emerald-500/30 pl-4">
                {questionData?.question}
              </h2>
            </div>

            {/* BOX DI RISPOSTA */}
            <div className="space-y-4">
              <div className={`flex items-center bg-black border-2 p-6 rounded-md transition-all
                ${isSubmitted ? (isCorrect ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-red-500 bg-red-950/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]') : 'border-emerald-500/30 focus-within:border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]'}`}>
                
                <span className="text-emerald-500 text-3xl font-mono mr-4 select-none animate-pulse">_</span>
                
                <input 
                  ref={inputRef}
                  type="text"
                  placeholder="INSERISCI FORMULA COMPLETA (es: =SE(...))"
                  className="bg-transparent border-none outline-none flex-1 text-xl md:text-2xl font-mono text-emerald-400 placeholder:text-emerald-900"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                  disabled={isSubmitted}
                  spellCheck={false}
                  autoComplete="off"
                />
                
                {isSubmitted && (
                  <div className="ml-4">
                    {isCorrect ? <CheckCircle2 className="text-emerald-500" size={32} /> : <XCircle className="text-red-500" size={32} />}
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Section */}
            {isSubmitted && (
              <div className={`p-4 rounded border-l-4 font-mono text-sm leading-relaxed animate-in slide-in-from-top-2
                ${isCorrect ? 'bg-emerald-900/20 border-emerald-500 text-emerald-200 shadow-lg' : 'bg-red-900/20 border-red-500 text-red-200 shadow-lg'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-black px-2 py-0.5 bg-current/10 rounded uppercase text-[10px]">
                    {isCorrect ? 'SUCCESS' : 'FAILURE'}
                  </span>
                  <span className="opacity-50">—</span>
                  <span className="font-bold uppercase tracking-widest">{isCorrect ? 'Sequenza Corretta' : 'Sintassi Errata'}</span>
                </div>
                {feedback}
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
               <div className="text-[10px] text-emerald-500/40 uppercase tracking-widest font-mono">
                 {isSubmitted ? (isCorrect ? 'Decrittazione ultimata' : 'Analisi fallita') : 'Richiesto: Formula Excel Valida'}
               </div>
               <div className="flex gap-4 w-full md:w-auto">
                 {isSubmitted && !isCorrect && (
                   <button 
                    onClick={() => { setIsSubmitted(false); setTypedAnswer(''); setSystemLog(prev => [...prev, 'Sequenza ripristinata.']); }}
                    className="flex-1 md:flex-none px-6 py-2 border-2 border-red-500 text-red-500 font-bold uppercase text-xs hover:bg-red-500 hover:text-white transition-all"
                   >
                     Riprova
                   </button>
                 )}
                 <button 
                   onClick={handleValidate}
                   disabled={isSubmitted || !typedAnswer.trim()}
                   className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 font-bold uppercase text-sm transition-all
                     ${isSubmitted || !typedAnswer.trim() ? 'bg-slate-800 text-slate-600' : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}
                   `}
                 >
                   {isSubmitted ? (isCorrect ? 'ACCESSO GARANTITO' : 'ERR_SYNTAX') : <><Send size={18} /> Invia Formula</>}
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryQuiz;
