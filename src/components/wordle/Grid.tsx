import { CompletedRow, CurrentRow, EmptyRow } from './Row';

type GridProps = {
  solution: string;
  guesses: string[];
  currentGuess: string;
  isRevealing?: boolean;
  currentRowClassName?: string;
};

export function Grid({ solution, guesses, currentGuess, isRevealing, currentRowClassName }: GridProps) {
  const empties = guesses.length < 5 ? Array(5 - guesses.length).fill('') : [];

  return (
    <div className="flex grow items-center justify-center w-full">
      <div className="grid max-w-sm w-full grid-rows-6 gap-1.5 p-2">
        {guesses.map((guess, i) => (
          <CompletedRow
            key={i}
            solution={solution}
            guess={guess}
            isRevealing={isRevealing && guesses.length - 1 === i}
          />
        ))}
        {guesses.length < 6 && <CurrentRow guess={currentGuess} className={currentRowClassName} />}
        {empties.map((_, i) => (
          <EmptyRow key={i} />
        ))}
      </div>
    </div>
  );
}
