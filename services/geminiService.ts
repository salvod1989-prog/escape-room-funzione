
import { GoogleGenAI, Type } from "@google/genai";

const INDOVINELLI_DATA: Record<string, any> = {
  "Il Buttafuori della Discoteca": {
    question: "Hai una lista di età (colonna A). Chi ha 16 anni o più entra, gli altri 'A casa!'. Digita la formula completa per la cella B1.",
    options: ["=SE(A1>=16;\"Entra\";\"A casa!\")", "=SOMMA(A1:A10)", "=MEDIA(A1:A10)"],
    correctIndex: 0,
    feedbackCorrect: "Codice Accettato! La formula è corretta.",
    feedbackIncorrect: "Errore di sintassi. Ricorda il SE e le virgolette per il testo."
  },
  "L'Invasione Aliena": {
    question: "Hai 200 navicelle (colonna A). Alcune sono 'Zorg'. Digita la formula per contare quante celle contengono esattamente 'Zorg'.",
    options: ["=CONTA.NUMERI(A1:A200)", "=CONTA.SE(A1:A200;\"Zorg\")", "=CONTA.VUOTE(A1:A200)"],
    correctIndex: 1,
    feedbackCorrect: "Rilevamento completato! Gli Zorg sono sotto controllo.",
    feedbackIncorrect: "Sbagliato. Usa CONTA.SE(intervallo; criterio)."
  },
  "Il Ladro Confuso": {
    question: "Un'agenda ha password e PIN in colonna A (A1:A100). Digita la formula che conta solo le celle che contengono numeri.",
    options: ["=CONTA.NUMERI(A1:A100)", "=CONTA.VALORI(A1:A100)", "=CONTA.SE(A1:A100; \">0\")"],
    correctIndex: 0,
    feedbackCorrect: "PIN estratti! Il database è ora accessibile.",
    feedbackIncorrect: "No. CONTA.NUMERI è la funzione specifica per i valori numerici."
  },
  "Il Mistero della Nave Fantasma": {
    question: "Sulla nave (da B1 a B50) alcune celle sono vuote. Digita la formula per scoprire quanti marinai mancano.",
    options: ["=CONTA.VALORI(B1:B50)", "=CONTA.VUOTE(B1:B50)", "=SE(B1=\"\";1;0)"],
    correctIndex: 1,
    feedbackCorrect: "Appello completato. Sappiamo chi manca.",
    feedbackIncorrect: "Devi contare le celle vuote nell'intervallo B1:B50."
  },
  "Il Misuratore di Livello (Stile Dragon Ball)": {
    question: "Energia in A1. <1000 'Debole', <=8000 'Forte', >8000 'SUPREMO'. Digita la formula PIÙ.SE completa.",
    options: ["=PIÙ.SE(A1<1000;\"Debole\";A1<=8000;\"Forte\";A1>8000;\"SUPREMO\")", "=SE(A1>8000; \"SUPREMO\")", "=SOMMA.SE(A1; \">8000\")"],
    correctIndex: 0,
    feedbackCorrect: "Livello di potenza analizzato correttamente!",
    feedbackIncorrect: "Controlla i punti e virgola e le condizioni del PIÙ.SE."
  },
  "Caccia al Forziere di Barbanera": {
    question: "Se A1 contiene 'X' scrivi 'Scava!', altrimenti 'Scappa!'. Digita la formula SE completa.",
    options: ["=SE(A1=\"X\";\"Scava!\";\"Scappa!\")", "=SE(A1=X; Scava; Scappa)", "=O(A1=\"X\"; \"Scava!\")"],
    correctIndex: 0,
    feedbackCorrect: "X segna il punto! Inizia a scavare.",
    feedbackIncorrect: "Ricorda di mettere i testi tra virgolette e usare il punto e virgola."
  },
  "Il Torneo di eSports": {
    question: "Hai 80 partite in colonna A. Conta quante volte appare la scritta 'Sconfitta'.",
    options: ["=CONTA.SE(A1:A80;\"Sconfitta\")", "=SOMMA(A1:A80)", "=CONTA.NUMERI(A1:A80)"],
    correctIndex: 0,
    feedbackCorrect: "Analisi sconfitte completata. Dobbiamo allenarci di più.",
    feedbackIncorrect: "Usa CONTA.SE con il criterio tra virgolette."
  },
  "L'Agente Segreto Smemorato": {
    question: "In A1:A100 ci sono nomi e coordinate numeriche. Conta quante celle contengono numeri.",
    options: ["=CONTA.NUMERI(A1:A100)", "=LUNGHEZZA(A1:A100)", "=SOMMA(A1:A100)"],
    correctIndex: 0,
    feedbackCorrect: "Coordinate intercettate! L'agente è salvo.",
    feedbackIncorrect: "La funzione corretta conta solo i valori numerici."
  },
  "I Compiti Mangiati dal Cane": {
    question: "Intervallo B1:B25. Conta quante celle sono vuote (compiti non consegnati).",
    options: ["=CONTA.VUOTE(B1:B25)", "=CONTA.SE(B1:B25; \"\")", "=CONTA.VALORI(B1:B25)"],
    correctIndex: 0,
    feedbackCorrect: "Cani identificati. Preparati per la punizione.",
    feedbackIncorrect: "CONTA.VUOTE è la via più veloce."
  },
  "La Pagella della Scuola di Magia": {
    question: "Voto in A1: <5 'Troll', <=7 'Apprendista', <=10 'Mago'. Digita la formula PIÙ.SE.",
    options: ["=PIÙ.SE(A1<5;\"Troll\";A1<=7;\"Apprendista\";A1<=10;\"Mago\")", "=CERCA.VERT(A1; B1:C10; 2)", "=SE(A1>5; \"Mago\")"],
    correctIndex: 0,
    feedbackCorrect: "Diploma magico ottenuto! Sei un vero Mago di Excel.",
    feedbackIncorrect: "La sintassi del PIÙ.SE richiede condizione; valore per ogni fascia."
  }
};

export async function generateTheoryQuestion(subject: string) {
  if (INDOVINELLI_DATA[subject]) {
    return INDOVINELLI_DATA[subject];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un indovinello logico su questo tema di calcolo elettronico (Excel/Spreadsheet): ${subject}. 
      Stile anni '80. La risposta corretta DEVE essere una formula completa di Excel che inizia con '='.
      Fornisci 3 opzioni, dove solo una è la formula corretta e completa.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            feedbackCorrect: { type: Type.STRING },
            feedbackIncorrect: { type: Type.STRING }
          },
          required: ["question", "options", "correctIndex", "feedbackCorrect", "feedbackIncorrect"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return INDOVINELLI_DATA["Il Buttafuori della Discoteca"];
  }
}

export async function generateAtmosphericDescription(dimension: string, x: number, y: number) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Descrivi brevemente cosa vede il giocatore a Hawkins (x:${x}, y:${y}) in dimensione ${dimension}. Usa uno stile cupo se Upside Down, altrimenti stile anni '80 vibrante.`
    });
    return response.text;
  } catch (error) {
    return "L'atmosfera è tesa. Senti il ronzio dell'elettricità statica nell'aria.";
  }
}
