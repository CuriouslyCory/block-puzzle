# Block Puzzle App

This is a modern, interactive block puzzle game built with the T3 Stack. Players try to fit various shapes onto a grid, clearing lines and scoring points without running out of space.

## Features

- Interactive drag-and-drop gameplay
- Various block shapes with different colors
- Score tracking
- Line clearing mechanics
- Game over detection
- User authentication

## Tech Stack

This project is built using the T3 Stack, which includes:

- Next.js for the frontend and API routes
- TypeScript for type-safe code
- tRPC for end-to-end typesafe APIs
- Prisma for database ORM
- NextAuth.js for authentication
- Tailwind CSS for styling

## Game Mechanics

- Players are presented with a grid and a selection of shapes.
- Shapes can be dragged and dropped onto the grid.
- When a row or column is completely filled, it clears and awards points.
- The game ends when no more shapes can be placed on the grid.

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up your environment variables (see `.env.example`)
4. Run the development server with `pnpm dev`

## Authentication

This app uses Discord for authentication. Users need to sign in to play the game and have their scores saved.

## Contributions

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

This project was bootstrapped with `create-t3-app`. For more information on the T3 Stack, visit [create.t3.gg](https://create.t3.gg/).

# Credits

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
