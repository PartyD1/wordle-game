import { Tile } from './Tile';
import { getGuessStatuses } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { WORD_LENGTH } from '@/lib/helpers';

export function CompletedRow({
  guess,
  solution,
  isRevealing,
}: {
  guess: string;
  solution: string;
  isRevealing?: boolean;
}) {
  const statuses = getGuessStatuses(guess, solution);

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {guess.split('').map((char, i) => (
        <Tile key={i} char={char} status={statuses[i]} isCompleted isRevealing={isRevealing} position={i} />
      ))}
    </div>
  );
}

export function CurrentRow({ guess, className }: { guess: string; className?: string }) {
  const splitGuess = guess.split('');
  const emptyCells = Array(WORD_LENGTH - splitGuess.length).fill('');

  return (
    <div className={cn('grid grid-cols-5 gap-1.5', className)}>
      {splitGuess.map((char, i) => (
        <Tile key={i} char={char} />
      ))}
      {emptyCells.map((_, i) => (
        <Tile key={i} />
      ))}
    </div>
  );
}

export function EmptyRow() {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array(WORD_LENGTH).fill(0).map((_, i) => (
        <Tile key={i} />
      ))}
    </div>
  );
}
