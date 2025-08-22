# Football Loanee Tracker ⚽

A comprehensive web application to track football players on loan from your favorite teams across different leagues and competitions.

## 🚀 Features

- **Team Selection**: Choose your favorite football clubs
- **Loan Tracking**: Monitor players loaned out from your favorite teams
- **Match Updates**: View recent and upcoming matches featuring loaned players
- **Player Statistics**: Detailed performance metrics for each player
- **Multi-League Support**: Coverage across Premier League, Championship, La Liga, Ligue 1, Bundesliga, and more

## 🏗️ Architecture

### Current Setup (Mock Data)
The app currently uses comprehensive mock data that simulates a real football API:

- **`src/mockData/`**: JSON files containing realistic football data
  - `teams.json`: 24 teams with real crests and information
  - `players.json`: 20 players with accurate loan data for 2024/2025 season
  - `matches.json`: 8 fixtures (recent + upcoming) with loaned players
  - `leagues.json`: 8 major European leagues

### Future Setup (SportMonks Premium)
When you get SportMonks Premium, the app will seamlessly switch to real API data:

- **Direct API calls** to SportMonks (no proxy needed)
- **Smart caching** for different data types
- **Real-time updates** for live matches and transfers

## 🎯 Smart Caching Strategy

The app implements intelligent caching to optimize API usage:

| Data Type | Cache Duration | Update Frequency |
|-----------|----------------|------------------|
| **Team Logos** | 1 year | Static, rarely changes |
| **Player Photos** | 1 year | Static, rarely changes |
| **League Data** | 1 week | Season updates, standings |
| **Loan Data** | Dynamic | Transfer window dependent |
| **Match Data** | Dynamic | Match status dependent |

### Transfer Window Awareness
- **Summer Window** (July-September): 6-hour cache
- **Winter Window** (January): 6-hour cache
- **Off-season**: 1-week cache

### Match Status Caching
- **Finished Matches**: 1 day
- **Scheduled Matches**: 12 hours
- **Live Matches**: 5 minutes

## 🛠️ Development

### Prerequisites
- Node.js 20.19.0+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── PlayerCard.tsx  # Individual player display
│   ├── Header.tsx      # Navigation header
│   └── TeamSearch.tsx  # Team search functionality
├── services/           # Data services
│   ├── sportmonksApi.ts    # Main API service
│   ├── mockDataService.ts  # Mock data loader
│   └── cacheService.ts     # Smart caching system
├── mockData/           # Mock data files
│   ├── teams.json      # Team information
│   ├── players.json    # Player and loan data
│   ├── matches.json    # Fixture data
│   └── leagues.json    # League information
├── types/              # TypeScript definitions
│   └── football.ts     # Football data interfaces
└── hooks/              # Custom React hooks
    └── useUserPreferences.ts
```

## 🔄 Migration to Real API

When you get SportMonks Premium:

1. **Update API Token**: Replace placeholder in `sportmonksApi.ts`
2. **Enable Real Calls**: Uncomment direct API calls
3. **Configure Caching**: Set up cache service with real data
4. **Test Integration**: Verify all endpoints work correctly

The app is designed to work identically with both mock and real data!

## 🎨 Design Features

- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean, professional interface
- **Real Team Crests**: Official club logos from Wikipedia
- **Player Photos**: Real player images where available
- **Country Flags**: Emoji flags for player nationalities
- **Position Badges**: Specific position indicators (RW, CM, LB, etc.)

## 📊 Data Coverage

### Teams (24)
- **Premier League**: Arsenal, Chelsea, Man United, Man City, Liverpool, Tottenham, Newcastle, Aston Villa, Burnley, Sheffield United, Nottingham Forest
- **Championship**: Leicester City, Southampton, Ipswich Town, Sunderland, Swansea City, Cardiff City
- **European**: Sevilla, Real Betis, Nantes, Lyon, Benfica, Porto, Mainz 05

### Players (20)
- **Arsenal**: Charlie Patino, Marquinhos, Nuno Tavares
- **Chelsea**: Cesare Casadei, David Datro Fofana
- **Man United**: Hannibal Mejbri, Alvaro Fernandez, Amad Diallo, Facundo Pellistri
- **Liverpool**: Sepp van den Berg
- **Tottenham**: Dane Scarlett

### Leagues (8)
- Premier League (England)
- Championship (England)
- La Liga (Spain)
- Ligue 1 (France)
- Bundesliga (Germany)
- Serie A (Italy)
- Primeira Liga (Portugal)
- Eredivisie (Netherlands)

## 🚀 Performance

- **Lazy Loading**: Data loaded only when needed
- **Smart Caching**: Reduces redundant API calls
- **Optimized Images**: Compressed team crests and player photos
- **Efficient Filtering**: Fast search and filtering algorithms

## 🔮 Future Enhancements

- **Real-time Updates**: Live match data and scores
- **Transfer Alerts**: Notifications for loan changes
- **Player Comparison**: Side-by-side player statistics
- **Historical Data**: Past loan performance tracking
- **Mobile App**: Native iOS/Android applications

## 📝 License

This project is for personal use and educational purposes.

---

**Ready to track your favorite team's loaned players? Start by selecting your teams above!** 🎯⚽
