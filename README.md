# Vanquish Comics

A modern web application for browsing and reading comics.

## Deployment Status

Latest deployment: [Date: 2025-05-12]

A Next.js application for browsing superhero characters and comics. This project uses a mock superhero API to display information about various heroes from both DC and Marvel universes.

## Features

- Browse featured superheroes
- View detailed character information
- Search for specific characters
- Add characters to favorites
- Responsive design for mobile and desktop
- Dark mode UI with Tailwind CSS styling

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Firebase](https://firebase.google.com/) (optional) - Authentication and data storage
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vanquish-comics.git
   cd vanquish-comics
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables (optional for Firebase integration):
   ```
   # Firebase Configuration (optional)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

   # SuperHero API (optional, using mock data by default)
   NEXT_PUBLIC_SUPERHERO_API_KEY=your-superhero-api-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vanquish-comics/
├── public/             # Static assets
│   └── images/         # Image files
├── src/                # Source code
│   ├── app/            # App router pages
│   ├── components/     # Reusable UI components
│   └── lib/            # Utility functions and libraries
│       ├── api/        # API services
│       ├── contexts/   # React contexts
│       └── firebase/   # Firebase configuration
├── .env.local          # Environment variables
├── tailwind.config.js  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

## Firebase Integration (Optional)

This project includes Firebase integration for authentication and storing user favorites. To enable Firebase:

1. Create a Firebase project at [https://firebase.google.com/](https://firebase.google.com/)
2. Set up Authentication with Email/Password
3. Create a Firestore database
4. Add your Firebase credentials to the `.env.local` file

## Comics API Integration

This project uses the ComicVine API to fetch real comic book data. To use this feature:

1. Sign up for a free API key at [ComicVine](https://comicvine.gamespot.com/api/)
2. Add your API key to the `.env.local` file:
   ```
   NEXT_PUBLIC_COMICVINE_API_KEY=your_key_here
   ```

If you don't provide an API key, the application will fall back to using mock data, which is useful for development.

## Development

### Running Tests
```bash
npm run test
# or
yarn test
```

### Building for Production
```bash
npm run build
# or
yarn build
```

### Starting Production Server
```bash
npm run start
# or
yarn start
```

## Customization

- **Styling**: Update the Tailwind CSS theme in `tailwind.config.js`
- **API**: Replace mock data with a real API by updating services in `src/lib/api/`
- **Environment**: Configure environment variables in `.env.local`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Character data structure based on [SuperHero API](https://superheroapi.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
