export type LetterStatus = 'correct' | 'present' | 'absent';

export const WORD_LENGTH = 5;

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
