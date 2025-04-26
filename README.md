# 10x-Flashcards

A web application that accelerates learning through AI-generated flashcards and spaced repetition.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
[![CI](https://github.com/Arthez/10x-flashcards/actions/workflows/ci.yml/badge.svg)](https://github.com/Arthez/10x-flashcards/actions/workflows/ci.yml)

## Project Description

10x-Flashcards is a web application designed to help users learn more effectively by streamlining the creation of educational flashcards. The application allows users to generate flashcards using AI or create them manually, and integrates with a spaced repetition algorithm to facilitate efficient learning.

### Key Features

- **AI-Generated Flashcards**: Convert large text inputs into focused learning materials
- **Manual Flashcard Creation**: Create custom flashcards directly
- **User Authentication**: Secure email/password registration and login
- **Flashcard Management**: Browse, edit, and delete your flashcards
- **Statistics**: Check your flashcard creation statistics
- **Spaced Repetition Learning**: Study flashcards using effective learning algorithms

## Tech Stack

### Frontend
- [Astro](https://astro.build/) 5 - Modern web framework for building fast, content-focused websites
- [React](https://react.dev/) 19 - UI library for building interactive components
- [TypeScript](https://www.typescriptlang.org/) 5 - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) 4 - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS

### Backend
- [Supabase](https://supabase.com/) - Open source Firebase alternative with PostgreSQL database, authentication, and SDK

### AI Integration
- [Openrouter.ai](https://openrouter.ai/) - API for accessing various AI models

### CI/CD & Hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD automation
- [DigitalOcean](https://www.digitalocean.com/) - Cloud hosting via Docker

## Dependencies

### Core
- [astro](https://astro.build/) - Core framework for building the application
- [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) - Server-side rendering adapter for Astro
- [@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/) - Integration for using React components in Astro
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) - Generates XML sitemaps for SEO

### UI Components
- [react](https://react.dev/) - UI library for building interactive components
- [react-dom](https://react.dev/) - React package for DOM rendering
- [@radix-ui/react-slot](https://www.radix-ui.com/primitives/docs/utilities/slot) - Utility component for component composition
- [lucide-react](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [class-variance-authority](https://cva.style/docs) - Library for creating variant components with TypeScript
- [clsx](https://github.com/lukeed/clsx) - Utility for constructing className strings conditionally
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Merge Tailwind CSS classes without style conflicts
- [tw-animate-css](https://github.com/bentzibentz/tailwindcss-animate) - Animation utilities for Tailwind CSS

## Getting Started Locally

### Prerequisites
- Node.js 22.14.0
- npm 10.9.2

You can use NVM to install the correct Node.js version:
```bash
nvm install 22.14.0
nvm use 22.14.0
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/Arthez/10x-flashcards.git
cd 10x-flashcards
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
# Required environment variables will be documented here
```

4. Start the development server
```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run preview`: Preview the production build locally
- `npm run astro`: Run Astro CLI commands
- `npm run lint`: Run ESLint to check for issues
- `npm run lint:fix`: Run ESLint and fix issues automatically
- `npm run format`: Format code with Prettier

## Project Scope

### Included in MVP
- User registration and authentication (email/password)
- AI-generated flashcards
- Manual flashcard creation
- Browsing, editing, and deleting flashcards
- User statistics
- Basic spaced repetition learning algorithm

### Not Included in MVP
- Advanced spaced repetition algorithm (like SuperMemo or Anki)
- Import functionality for various formats (PDF, DOCX)
- Flashcard sharing between users
- Integration with educational platforms and social media
- Mobile application support
- Advanced data storage security and scalability features

## Project Status

The project is currently in early development (version 0.0.1). We are working on implementing the core features defined in the MVP scope.

### Success Metrics
- 75% of AI-generated flashcards must be accepted by users
- Users should create 75% of their flashcards using the AI generation feature

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

```md
.
├── src/
│   ├── layouts/    # Astro layouts
│   ├── pages/      # Astro pages
│   │   └── api/    # API endpoints
│   ├── components/ # UI components (Astro & React)
│   └── assets/     # Static assets
├── public/         # Public assets
```

## AI Development Support

This project is configured with AI development tools to enhance the development experience, providing guidelines for:

- Project structure
- Coding practices
- Frontend development
- Styling with Tailwind
- Accessibility best practices
- Astro and React guidelines

### Cursor IDE

The project includes AI rules in `.cursor/rules/` directory that help Cursor IDE understand the project structure and provide better code suggestions.

### GitHub Copilot

AI instructions for GitHub Copilot are available in `.github/copilot-instructions.md`
