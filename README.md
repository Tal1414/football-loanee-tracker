# Football Loanee Tracker ⚽

A modern web application to track and follow football players on loan from your favorite clubs. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🏟️ **Team Selection**: Choose your favorite football clubs
- 👥 **Player Tracking**: Follow loaned players' performances
- 📊 **Live Statistics**: Real-time match data and player stats
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🔔 **Smart Notifications**: Stay updated with live scores and results
- 🎨 **Modern UI**: Clean, intuitive interface with beautiful design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd football-loanee-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up your API key:
   - Get a free API key from [API-Football](https://www.api-football.com/)
   - Create a `.env` file in the root directory:
```env
VITE_API_FOOTBALL_KEY=your-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Integration

This app uses the API-Football service for reliable football data. The service provides:
- Team information and search
- Player statistics and details
- Live match data
- Historical match results
- League standings and fixtures

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Header.tsx      # Navigation header
│   ├── PlayerCard.tsx  # Player information card
│   └── TeamSearch.tsx  # Team search component
├── hooks/              # Custom React hooks
│   └── useUserPreferences.ts
├── services/           # API services
│   └── footballApi.ts
├── types/              # TypeScript interfaces
│   └── football.ts
└── utils/              # Utility functions
```

## Usage

1. **Select Your Teams**: Search and add your favorite football clubs
2. **View Loaned Players**: See all players currently on loan from your teams
3. **Track Performance**: Monitor live scores, statistics, and match results
4. **Stay Updated**: Get notifications about important events

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

Built with ❤️ for football fans around the world!
# football-loanee-tracker
