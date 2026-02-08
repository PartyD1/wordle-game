import { cn } from '@/lib/utils';
import type { LetterStatus } from '@/lib/helpers';

type TileProps = {
  char?: string;
  status?: LetterStatus;
  isRevealing?: boolean;
  isCompleted?: boolean;
  position?: number;
};

export function Tile({ char, status, isRevealing, isCompleted, position = 0 }: TileProps) {
  const charExists = char && char !== ' ';

  const tileClasses = cn(
    'flex items-center justify-center h-14 w-14 sm:w-16 sm:h-16 border-2 text-2xl sm:text-3xl font-bold uppercase rounded',
    {
      'bg-transparent border-border': !status,
      'border-muted-foreground': charExists && !status,
      'bg-primary border-primary text-primary-foreground': status === 'absent',
      'bg-accent border-accent text-accent-foreground': status === 'present',
      'bg-correct border-correct text-primary-foreground': status === 'correct',
      'animate-pop-in': charExists && !isCompleted,
    }
  );

  return (
    <div
      className={tileClasses}
      style={{
        animationDuration: '150ms',
      }}
    >
      {char}
    </div>
  );
}
