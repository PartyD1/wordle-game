import { VALID_GUESSES, SOLUTIONS } from './words';

export const WORD_LENGTH = 5;

export type LetterStatus = 'correct' | 'present' | 'absent';

export const getSolution = () => {
  const today = new Date();
  // Simple logic to get a "daily" word. Changes word each day of the month.
  const index = today.getDate() % SOLUTIONS.length;
  return SOLUTIONS[index].toUpperCase();
};

export const checkWordValidity = (word: string) => {
  return VALID_GUESSES.includes(word.toLowerCase());
};

export const getGuessStatuses = (guess: string, solution: string): LetterStatus[] => {
  const splitSolution = solution.split('');
  const splitGuess = guess.split('');

  const solutionCharsTaken = splitSolution.map(() => false);

  const statuses: LetterStatus[] = Array(guess.length).fill('absent');

  // Handle correct letters
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = 'correct';
      solutionCharsTaken[i] = true;
    }
  });

  // Handle present letters
  splitGuess.forEach((letter, i) => {
    if (statuses[i] === 'correct') {
      return;
    }

    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    );

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present';
      solutionCharsTaken[indexOfPresentChar] = true;
    }
  });

  return statuses;
};
