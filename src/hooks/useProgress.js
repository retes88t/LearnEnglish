import { useCallback, useEffect, useMemo, useState } from 'react';

const MASTER_STREAK = 3; // aciertos seguidos necesarios para considerar una palabra "dominada"

const loadProgress = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const emptyEntry = () => ({ streak: 0, correct: 0, wrong: 0, seen: 0, status: 'new' });

function statusFromStreak(streak) {
  if (streak >= MASTER_STREAK) return 'mastered';
  return 'learning';
}

// Progreso de práctica para un módulo (adjetivos, linking verbs, ...). Cada
// módulo guarda su progreso por separado en localStorage, según su
// `storageKey`, así que cambiar de módulo no mezcla ni pierde el progreso
// de los demás.
export function useProgress(module) {
  const { storageKey, words } = module;
  const [progress, setProgress] = useState(() => loadProgress(storageKey));

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // almacenamiento no disponible (modo privado, cuota llena, etc.) - se ignora
    }
  }, [progress, storageKey]);

  const getEntry = useCallback((id) => progress[id] ?? emptyEntry(), [progress]);

  const registerAnswer = useCallback((id, isCorrect) => {
    setProgress((prev) => {
      const current = prev[id] ?? emptyEntry();
      const streak = isCorrect ? Math.min(current.streak + 1, MASTER_STREAK) : 0;
      const next = {
        streak,
        correct: current.correct + (isCorrect ? 1 : 0),
        wrong: current.wrong + (isCorrect ? 0 : 1),
        seen: current.seen + 1,
        status: statusFromStreak(streak),
      };
      return { ...prev, [id]: next };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
  }, []);

  const stats = useMemo(() => {
    let nuevas = 0;
    let enProgreso = 0;
    let dominadas = 0;

    words.forEach(({ id }) => {
      const entry = progress[id];
      if (!entry || entry.seen === 0) {
        nuevas += 1;
      } else if (entry.status === 'mastered') {
        dominadas += 1;
      } else {
        enProgreso += 1;
      }
    });

    return {
      total: words.length,
      nuevas,
      enProgreso,
      dominadas,
      porcentajeDominado: words.length > 0 ? Math.round((dominadas / words.length) * 100) : 0,
    };
  }, [progress, words]);

  return { progress, getEntry, registerAnswer, resetProgress, stats, MASTER_STREAK };
}
