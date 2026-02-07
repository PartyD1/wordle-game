
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getGuessStatuses, LetterStatus, WORD_LENGTH } from '@/lib/helpers';
import { getDayIndex, getDailySolution } from '@/lib/daily';
import { Grid } from '@/components/wordle/Grid';
import { Keyboard } from '@/components/wordle/Keyboard';
import { GameEndModal } from '@/components/wordle/GameEndModal';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const REVEAL_ANIMATION_DURATION = 0;
const STORAGE_KEY = 'wordplay-game-state';

interface StoredState {
  dayIndex: number;
  guesses: string[];
  currentGuess: string;
  isGameWon: boolean;
  isGameLost: boolean;
}

interface GameProps {
  solutions: string[];
  validGuesses: string[];
}

export default function Game({ solutions, validGuesses }: GameProps) {
  const { toast } = useToast();
  const hasRestoredRef = useRef(false);
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [keyStatuses, setKeyStatuses] = useState<{ [key: string]: LetterStatus }>({});
  const [isRevealing, setIsRevealing] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [shakeCurrentRow, setShakeCurrentRow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set daily solution and restore state from localStorage (once per mount)
  useEffect(() => {
    if (solutions.length === 0) return;
    const dayIndex = getDayIndex();
    const dailySolution = getDailySolution(solutions);
    setSolution(dailySolution);

    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    try {
      const raw = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored: StoredState = JSON.parse(raw);
      if (stored.dayIndex !== dayIndex) return;

      setGuesses(stored.guesses ?? []);
      setCurrentGuess(stored.currentGuess ?? '');
      setIsGameWon(!!stored.isGameWon);
      setIsGameLost(!!stored.isGameLost);
      if (stored.isGameWon || stored.isGameLost) {
        setIsModalOpen(true);
      }

      const mergedKeyStatuses: { [key: string]: LetterStatus } = {};
      (stored.guesses ?? []).forEach((guess) => {
        const statuses = getGuessStatuses(guess, dailySolution);
        guess.split('').forEach((char, i) => {
          if (mergedKeyStatuses[char] !== 'correct') {
            mergedKeyStatuses[char] = statuses[i];
          }
        });
      });
      setKeyStatuses(mergedKeyStatuses);
    } catch {
      // ignore invalid or old stored state
    }
  }, [solutions]);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined' || !solution) return;
    const dayIndex = getDayIndex();
    const toStore: StoredState = {
      dayIndex,
      guesses,
      currentGuess,
      isGameWon,
      isGameLost,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // ignore quota or other errors
    }
  }, [solution, guesses, currentGuess, isGameWon, isGameLost]);

  const validGuessSet = useMemo(() => new Set(validGuesses), [validGuesses]);

  const resetGame = useCallback(() => {
    setGuesses([]);
    setCurrentGuess('');
    setKeyStatuses({});
    setIsGameWon(false);
    setIsGameLost(false);
    setIsModalOpen(false);
  }, []);

  const checkWordValidity = (word: string) => {
    return validGuessSet.has(word.toUpperCase());
  };
  
  const onChar = (value: string) => {
    if (currentGuess.length < WORD_LENGTH && guesses.length < 6 && !isGameWon) {
      setCurrentGuess((prev) => prev + value);
    }
  };

  const onDelete = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const onEnter = () => {
    if (isGameWon || isGameLost || !solution) {
      return;
    }

    if (currentGuess.length !== WORD_LENGTH) {
      setShakeCurrentRow(true);
      setTimeout(() => setShakeCurrentRow(false), 500);
      return toast({ title: 'Not enough letters', variant: 'destructive' });
    }

    if (!checkWordValidity(currentGuess)) {
      setShakeCurrentRow(true);
      setTimeout(() => setShakeCurrentRow(false), 500);
      return toast({ title: 'Not in word list', variant: 'destructive' });
    }

    setIsRevealing(true);
    setTimeout(() => {
      setIsRevealing(false);
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);

      const newKeyStatuses = { ...keyStatuses };
      const statuses = getGuessStatuses(currentGuess, solution);
      currentGuess.split('').forEach((char, i) => {
        const status = statuses[i];
        if (newKeyStatuses[char] !== 'correct') {
          newKeyStatuses[char] = status;
        }
      });
      setKeyStatuses(newKeyStatuses);
      
      setCurrentGuess('');

      if (currentGuess.toUpperCase() === solution.toUpperCase()) {
        setIsGameWon(true);
        setTimeout(() => setIsModalOpen(true), 500);
      } else if (newGuesses.length === 6) {
        setIsGameLost(true);
        setTimeout(() => setIsModalOpen(true), 500);
      }

    }, REVEAL_ANIMATION_DURATION);
  };
  
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isGameWon || isGameLost || isRevealing) return;

      if (event.key === 'Enter') {
        onEnter();
      } else if (event.key === 'Backspace') {
        onDelete();
      } else if (event.key.match(/^[a-zA-Z]$/)) {
        onChar(event.key.toUpperCase());
      }
    },
    [isGameWon, isGameLost, isRevealing, onEnter, onDelete, onChar]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!solution) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <header className="flex items-center justify-center w-full max-w-lg mx-auto mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wider">WORDPLAY</h1>
        </header>
        <p>Loading game...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col items-center p-2 sm:p-4">
      <header className="flex items-center justify-center relative border-b pb-2 w-full max-w-lg mx-auto mb-2 shrink-0">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider">WORDPLAY</h1>
      </header>
      
      <div className="flex flex-col items-center justify-center w-full flex-grow relative">
        <Grid
          solution={solution}
          guesses={guesses}
          currentGuess={currentGuess}
          isRevealing={isRevealing}
          currentRowClassName={shakeCurrentRow ? 'animate-shake' : ''}
        />

        {(isGameWon || isGameLost) && (
            <Button onClick={resetGame} variant="outline" size="lg" className="my-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
        )}
      </div>
      
      <div className="shrink-0 w-full flex justify-center pb-2">
        <Keyboard onChar={onChar} onDelete={onDelete} onEnter={onEnter} keyStatuses={keyStatuses} disabled={isGameWon || isGameLost}/>
      </div>
      
      <GameEndModal
        isOpen={isModalOpen}
        isGameWon={isGameWon}
        solution={solution}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
