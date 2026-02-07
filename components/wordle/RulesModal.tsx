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

type RulesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>How to play</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-left space-y-3 text-sm text-muted-foreground">
              <p>Guess the <strong className="text-foreground">WORDPLAY</strong> in 6 tries.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Each guess must be a valid 5-letter word.</li>
                <li>After each guess, the tiles change color to show how close you were.</li>
              </ul>
              <div className="space-y-1.5 pt-1">
                <p className="text-foreground font-medium">Tile colors:</p>
                <p><span className="font-semibold text-correct">Green</span> — letter is in the word and in the correct spot.</p>
                <p><span className="font-semibold text-accent">Yellow</span> — letter is in the word but in the wrong spot.</p>
                <p><span className="font-semibold text-primary">Gray</span> — letter is not in the word.</p>
              </div>
              <p className="pt-1">A new puzzle is available every day. You get one game per day.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
