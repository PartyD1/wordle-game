  import fs from 'fs';
import path from 'path';
import Game from '@/components/wordle/Game';

const getWords = (filePath: string): string[] => {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return fileContents.split('\n').map(word => word.trim().toUpperCase()).filter(Boolean);
};

export default function Home() {
  const allowedAnswers = getWords('allowed_answers.txt');
  const allowedGuessesFromFile = getWords('allowed_guesses.txt');
  const validGuesses = [...new Set([...allowedAnswers, ...allowedGuessesFromFile])];

  return (
    <Game solutions={allowedAnswers} validGuesses={validGuesses} />
  );
}
