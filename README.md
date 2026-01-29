# WordPlay: A Daily Word Puzzle Game

This project is a web-based word puzzle game, similar to Wordle. It's built with Next.js and React, and styled with Tailwind CSS.

## Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

Here's a breakdown of the key files and directories in the project:

### Root Directory

-   `apphosting.yaml`: Configuration file for deploying the application to Firebase App Hosting.
-   `next.config.ts`: The configuration file for Next.js. It's set up for standalone output for optimized deployment.
-   `package.json`: Defines the project's dependencies and scripts.
-   `tailwind.config.ts`: Configuration for the Tailwind CSS utility-first framework.
-   `tsconfig.json`: The configuration file for the TypeScript compiler.
-   `allowed_answers.txt`: A list of all possible solutions for the word puzzle. A word is chosen from this list at the start of each game.
-   `allowed_guesses.txt`: A comprehensive list of all valid words that a player can guess. This includes all the words from `allowed_answers.txt` plus many more.

### `src/app`

This directory contains the core of the Next.js application, following the App Router paradigm.

-   `globals.css`: Contains global styles and CSS variables for theming, using Tailwind CSS's `@layer` directive. The color scheme is defined here using HSL values for easy customization.
-   `layout.tsx`: The root layout for the entire application. It sets up the basic HTML structure, including `<html>` and `<body>` tags, and applies global fonts.
-   `page.tsx`: The main page of the application. It reads the word lists from the text files and passes them to the main `Game` component.

### `src/components`

This directory is organized into two main sub-directories:

-   `ui/`: Contains reusable, general-purpose UI components built with ShadCN UI. These components (`Button`, `AlertDialog`, `Toast`) are used to build the application's interface.
-   `wordle/`: Contains components that are specific to the Wordle game itself.
    -   `Game.tsx`: The main stateful component that manages the entire game flow, including the current guess, past guesses, game state (win/loss), and user input.
    -   `Grid.tsx`: Renders the 6x5 grid of tiles, displaying completed rows, the current row being typed, and empty rows.
    -   `Row.tsx`: Defines the different types of rows in the grid: `CompletedRow`, `CurrentRow`, and `EmptyRow`.
    -   `Tile.tsx`: Represents a single letter tile in the grid. Its appearance changes based on whether the letter is correct, present, or absent in the solution word.
    -   `Keyboard.tsx`: The on-screen keyboard that allows users to input guesses. The keys change color to reflect the status of each letter.
    -   `GameEndModal.tsx`: A dialog that appears at the end of the game to inform the player if they've won or lost, and what the correct word was.

### `src/hooks`

-   `use-toast.ts`: A custom React hook for triggering and managing toast notifications, used for providing feedback to the user (e.g., "Not in word list").

### `src/lib`

-   `helpers.ts`: Contains core game logic functions, such as `getGuessStatuses`, which determines the status (correct, present, absent) of each letter in a guess.
-   `utils.ts`: Contains utility functions. The `cn` function is a helper for conditionally combining Tailwind CSS classes.
