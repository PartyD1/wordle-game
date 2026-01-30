"use client";

import { cn } from '@/lib/utils';
import { LetterStatus } from '@/lib/helpers';
import { Delete } from 'lucide-react';

type KeyProps = {
  value: string;
  status?: LetterStatus;
  onClick: (value: string) => void;
  isLarge?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
};

function Key({ value, status, onClick, isLarge, children, disabled }: KeyProps) {
  const classes = cn(
    'flex items-center justify-center rounded font-bold uppercase h-12 sm:h-14 cursor-pointer select-none transition-colors',
    isLarge ? 'flex-grow-[1.5] text-xs' : 'flex-grow',
    {
      'bg-zinc-500 hover:bg-zinc-600 text-white': !status,
      'bg-primary text-primary-foreground': status === 'absent',
      'bg-accent text-accent-foreground': status === 'present',
      'bg-correct text-primary-foreground': status === 'correct',
      'opacity-50 cursor-not-allowed': disabled,
    }
  );

  return (
    <button className={classes} onClick={() => onClick(value)} disabled={disabled}>
      {children || value}
    </button>
  );
}

type KeyboardProps = {
  onChar: (value: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  keyStatuses: { [key: string]: LetterStatus };
  disabled?: boolean;
};

export function Keyboard({ onChar, onDelete, onEnter, keyStatuses, disabled }: KeyboardProps) {
  const handleKeyClick = (value: string) => {
    if (disabled) {
      return;
    }
    if (value === 'Enter') {
      onEnter();
    } else if (value === 'Backspace') {
      onDelete();
    } else {
      onChar(value);
    }
  };

  return (
    <div className="w-full max-w-[32rem] mx-auto flex flex-col gap-1.5">
      {['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
          {i === 2 && <Key value="Enter" onClick={handleKeyClick} isLarge disabled={disabled}>Enter</Key>}
          {row.split('').map((char) => (
            <Key key={char} value={char.toUpperCase()} onClick={handleKeyClick} status={keyStatuses[char.toUpperCase()]} disabled={disabled} />
          ))}
          {i === 2 && <Key value="Backspace" onClick={handleKeyClick} isLarge disabled={disabled}><Delete size={20} /></Key>}
        </div>
      ))}
    </div>
  );
}
