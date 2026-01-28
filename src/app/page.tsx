  import fs from 'fs';
import path from 'path';
import Game from '@/components/wordle/Game';

const getWords = (filePath: string): string[] => {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return fileContents.split('\n').map(word => word.trim().toUpperCase());
};

export default function Home() {
  const allowedAnswers = getWords('allowed_answers.txt');
  const allowedGuesses = getWords('allowed_guesses.txt');
  const solution = allowedAnswers[Math.floor(Math.random() * allowedAnswers.length)];

  return (
    <Game solution={solution} validGuesses={allowedGuesses} />
  );
}
