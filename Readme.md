# UniGigs

UniGigs is a SaaS platform designed for university students to exchange freelancing services within their academic community. The platform enables students to showcase skills, earn money, and access affordable services from trusted peers.

## Research Background

This project implements research findings on gamification and motivational design in SaaS applications. Key research demonstrates that well-designed gamification elements can enhance user engagement by addressing fundamental psychological needs:
- Autonomy through voluntary participation
- Competence via clear feedback and progression systems
- Relatedness through community features

For more details, refer to the full research paper: "UniGigs: Motivational Design Paper".

## Features

### Core Functionality
- **Dual Role System**: Seamlessly switch between service provider and service seeker roles
- **Gig Management**: Create, update, and manage service listings
- **Real-time Chat**: Built-in messaging system for direct communication
- **Secure Payments**: Token-based transaction system with real currency conversion
- **Profile Management**: Showcase skills, experience, and academic background
- **Notification System**: Stay informed about gig updates and messages

### Motivational Design Elements
- **Token System**: Gamified currency for transactions
- **Login Streaks**: Daily rewards for consistent platform engagement
- **User Levels**: Progress-based trust system (Beginner → Pro)
- **Leaderboard**: Competitive ranking based on completed gigs

## Project Structure

```
.
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── utils/           # Utility functions
│   │   ├── views/           # Page components
│   │   └── routes/          # Application routing
│   ├── cypress/             # E2E testing
│   └── public/              # Static assets
│
└── functions/               # Backend Firebase functions
    └── src/
        ├── common.ts        # Shared utilities
        ├── firebase.ts      # Firebase configuration
        ├── index.ts         # Main entry point
        └── stripe.ts        # Payment integration
```

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase Functions
- **Database**: Firestore
- **Testing**: Cypress
- **Payments**: Stripe integration
# UniGigs

[Previous sections remain the same until Getting Started]

## Getting Started

1. Clone the repository

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install functions dependencies
cd ../functions
npm install
```

3. Set up environment variables:
   - Create `.env` files in both `frontend` and `functions` directories
   - Add necessary Firebase and Stripe configuration

4. Development Options:

### Regular Development
To start all development services concurrently:
```bash
npm run dev
```
This runs:
- Firebase emulators with data import
- Frontend development server
- API watch mode for functions

### Testing Mode
To run the application in testing mode:
```bash
npm run test
```
This runs:
- Firebase emulators
- Cypress test runner
- Frontend build in watch mode

### Individual Commands
Firebase Emulator Options:
```bash
# Start emulators and export data on exit
npm run firebase:export

# Start emulators with data import
npm run watch:firebase

# Start emulators with empty data
npm run firebase:empty
```

Frontend Development:
```bash
# Start frontend in watch mode
npm run test:frontend
```

Cypress Testing:
```bash
# Open Cypress test runner
npm run test:cypress
```

API Development:
```bash
# Watch mode for Firebase functions
npm run watch:api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
