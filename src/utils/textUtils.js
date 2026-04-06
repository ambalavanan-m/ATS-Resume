import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
// Since we are running in a local environment, we might want to use a local worker or a CDN.
// For Vite, we can often just import the worker directly. 
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
};

export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with', 'who', 'whom', 'which'
]);

export const extractKeywords = (text) => {
  const words = normalizeText(text).split(' ');
  return [...new Set(words.filter(word => word.length > 2 && !STOP_WORDS.has(word)))];
};

export const ACTION_VERBS = new Set([
  "developed", "built", "led", "managed", "created", "designed", "implemented", "optimized", "increased", "decreased", "mentored", "orchestrated", "engineered", "automated", "delivered", "coordinated", "collaborated"
]);

export const SOFT_SKILLS = new Set([
  "leadership", "communication", "teamwork", "collaboration", "problem solving", "critical thinking", 
  "adaptability", "time management", "creativity", "work ethic", "attention to detail", "interpersonal",
  "negotiation", "conflict resolution", "emotional intelligence", "mentoring", "presentation", "public speaking"
]);

export const categorizeSkills = (keywords) => {
  const soft = [];
  const hard = [];
  
  keywords.forEach(kw => {
    if (SOFT_SKILLS.has(kw.toLowerCase())) {
      soft.push(kw);
    } else {
      hard.push(kw);
    }
  });

  return { soft, hard };
};
