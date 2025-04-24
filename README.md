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

## Links

- **Repository**: [https://github.com/teiatan/music-tracker-ui](https://github.com/teiatan/music-tracker-ui)
- **Live**: [https://music-tracker-ui.vercel.app/](https://music-tracker-ui.vercel.app)

