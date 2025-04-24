# Track Manager UI

A modern single-page application for managing music tracks.  
Built for the **Genesis Front-End School Case** 

## Features

- Create, edit, delete tracks
- Upload and play audio files (MP3/WAV)
- Search and filter by genre and artist
- Sort tracks by title, artist, album, created date
- Paginated track list with responsive controls

---

## Stack

- **Core Technologies**: React 19, TypeScript, SCSS Modules
- **Routing**: React Router v7
- **State Management**: React useState, custom hooks, Context API  
- **API Communication**: Axios
- **Pagination**: react-responsive-pagination
- **Form Handling**: Controlled components with validation
- **Validation**: Custom validation (image URL, file type/size)
- **Styling**: SCSS Modules, clsx
- **Utilities**: lodash, debounce
- **Bundler**: Vite
- **Linting**: ESLint, Prettier
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel

---

## Local Development

To run the app locally:

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on the example:

```bash
cp .env.example .env
```

> If you don’t create a `.env` file, the app assumes the backend runs at `http://localhost:8000`, and the frontend will be available at `http://localhost:3000`.

3. Start the development server:

```bash
npm run start
```

---

## Available Scripts

The following npm scripts are available in the `music-tracker-ui` project:

| Script       | Command             | Description                                                           |
|--------------|---------------------|-----------------------------------------------------------------------|
| Start        | `npm run start`     | Launches the Vite development server for local development           |
| Build        | `npm run build`     | Compiles TypeScript and builds the production-ready bundle           |
| Preview      | `npm run preview`   | Serves the production build locally for preview                      |
| Lint         | `npm run lint`      | Runs ESLint to analyze code quality                                  |
| Lint:fix     | `npm run lint:fix`  | Runs ESLint and automatically fixes style issues                     |
| Format       | `npm run format`    | Formats all files in the project using Prettier                      |
| Test         | `npm run test`      | Runs all unit and integration tests using Jest                       |

> 📦 You can also run these scripts using `pnpm` or `yarn`, depending on your package manager of choice.

---

## Links

- **Repository**: [https://github.com/teiatan/music-tracker-ui](https://github.com/teiatan/music-tracker-ui)
- **Live**: [https://music-tracker-ui.vercel.app/](https://music-tracker-ui.vercel.app)

