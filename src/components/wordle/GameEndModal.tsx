"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type GameEndModalProps = {
  isOpen: boolean;
  isGameWon: boolean;
  solution: string;
  onClose: () => void;
};

export function GameEndModal({ isOpen, isGameWon, solution, onClose }: GameEndModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isGameWon ? 'Congratulations!' : 'Nice try!'}</AlertDialogTitle>
          <AlertDialogDescription>
            {isGameWon ? 'You guessed the word correctly.' : `The word was ${solution}.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
