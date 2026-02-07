import { cn } from '@/lib/utils';
import type { LetterStatus } from '@/lib/helpers';

const FLIP_DURATION_MS = 400;
const FLIP_STAGGER_MS = 125;

type TileProps = {
  char?: string;
  status?: LetterStatus;
  isRevealing?: boolean;
  isCompleted?: boolean;
  position?: number;
};

const faceBase =
  'absolute inset-0 flex items-center justify-center rounded border-2 text-2xl sm:text-3xl font-bold uppercase [backface-visibility:hidden]';

export function Tile({ char, status, isRevealing, isCompleted, position = 0 }: TileProps) {
  const charExists = char && char !== ' ';

  if (isRevealing && charExists && status) {
    return (
      <div
        className="relative h-14 w-14 sm:w-16 sm:h-16"
        style={{ perspective: '1000px' }}
      >
        <div
          className="absolute inset-0 [transform-style:preserve-3d] animate-flip"
          style={{
            animationDelay: `${position * FLIP_STAGGER_MS}ms`,
            animationDuration: `${FLIP_DURATION_MS}ms`,
          }}
        >
          <div
            className={cn(
              faceBase,
              'border-muted-foreground bg-transparent'
            )}
          >
            {char}
          </div>
          <div
            className={cn(
              faceBase,
              status === 'absent' && 'border-primary bg-primary text-primary-foreground',
              status === 'present' && 'border-accent bg-accent text-accent-foreground',
              status === 'correct' && 'border-correct bg-correct text-primary-foreground'
            )}
            style={{ transform: 'rotateX(180deg)' }}
          >
            {char}
          </div>
        </div>
      </div>
    );
  }

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
