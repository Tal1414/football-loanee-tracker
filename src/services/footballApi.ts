import type { Team, Player, Match, PlayerStats } from '../types/football';

// Enhanced mock data based on real API responses to reduce API calls during development
const MOCK_DATA = {
  teams: [
    {
      id: 33,
      name: 'Manchester United',
      shortName: 'Man Utd',
      tla: 'MUN',
      crest: 'https://media.api-sports.io/football/teams/33.png',
      country: 'England',
      league: 'Premier League',
      founded: 1878
    },
    {
      id: 11,
      name: 'Arsenal',
      shortName: 'Arsenal',
      tla: 'ARS',
      crest: 'https://media.api-sports.io/football/teams/11.png',
      country: 'England',
      league: 'Premier League',
      founded: 1886
    },
    {
      id: 3,
      name: 'Manchester City',
      shortName: 'Man City',
      tla: 'MCI',
      crest: 'https://media.api-sports.io/football/teams/50.png',
      country: 'England',
      league: 'Premier League',
      founded: 1880
    }
  ],
  players: [
    // Real Manchester United players from 2023-2024 season with loan status
    {
      id: 174,
      name: 'C. Eriksen',
      firstName: 'Christian',
      lastName: 'Dannemann Eriksen',
      dateOfBirth: '1992-02-14',
      nationality: 'Denmark',
      position: 'Midfielder',
      shirtNumber: 14,
      lastUpdated: '2024-01-01',
      photo: 'https://media.api-sports.io/football/players/174.png',
      teamId: 33,
      teamName: 'Manchester United',
      isOnLoan: false,
      loanedFrom: undefined,
      loanedTo: undefined,
      loanEndDate: undefined
    },
    {
      id: 378,
      name: 'Alex Telles',
      firstName: 'Alex',
      lastName: 'Nicolao Telles',
      dateOfBirth: '1992-12-15',
      nationality: 'Brazil',
      position: 'Defender',
      shirtNumber: 27,
      lastUpdated: '2024-01-01',
      photo: 'https://media.api-sports.io/football/players/378.png',
      teamId: 33,
      teamName: 'Manchester United',
      isOnLoan: true,
      loanedFrom: 'Manchester United',
      loanedTo: 'Al Nassr',
      loanEndDate: '2025-06-30'
    },
    {
      id: 739,
      name: 'Reguilón',
      firstName: 'Sergio',
      lastName: 'Reguilón Rodríguez',
      dateOfBirth: '1996-12-16',
      nationality: 'Spain',
      position: 'Defender',
      shirtNumber: 15,
      lastUpdated: '2024-01-01',
      photo: 'https://media.api-sports.io/football/players/739.png',
      teamId: 33,
      teamName: 'Manchester United',
      isOnLoan: true,
      loanedFrom: 'Manchester United',
      loanedTo: 'Brentford',
      loanEndDate: '2025-06-30'
    },
    // Additional loaned players for demonstration
    {
      id: 1001,
      name: 'Jadon Sancho',
      firstName: 'Jadon',
      lastName: 'Sancho',
      dateOfBirth: '2000-03-25',
      nationality: 'England',
      position: 'Forward',
      shirtNumber: 25,
      lastUpdated: '2024-01-01',
      photo: 'https://media.api-sports.io/football/players/1001.png',
      teamId: 33,
      teamName: 'Manchester United',
      isOnLoan: true,
      loanedFrom: 'Manchester United',
      loanedTo: 'Borussia Dortmund',
      loanEndDate: '2025-06-30'
    },
    {
      id: 1002,
      name: 'Donny van de Beek',
      firstName: 'Donny',
      lastName: 'van de Beek',
      dateOfBirth: '1997-04-18',
      nationality: 'Netherlands',
      position: 'Midfielder',
      shirtNumber: 34,
      lastUpdated: '2024-01-01',
      photo: 'https://media.api-sports.io/football/players/1002.png',
      teamId: 33,
      teamName: 'Manchester United',
      isOnLoan: true,
      loanedFrom: 'Manchester United',
      loanedTo: 'Eintracht Frankfurt',
      loanEndDate: '2025-06-30'
    },
    {
      id: 1003,
      name: 'Facundo Pellistri',
      firstName: 'Facundo',
      lastName: 'Pellistri',
      dateOfBirth: '2001-12-20',
      nationality: 'Uruguay',
      position: 'Forward',
      shirtNumber: 28,
      lastUpdated: '2024-01-01',
      photo: 'https://media.api-sports.io/football/players/1003.png',
      teamId: 33,
      teamName: 'Manchester United',
      isOnLoan: true,
      loanedFrom: 'Manchester United',
      loanedTo: 'Granada',
      loanEndDate: '2025-06-30'
    },
    {
      id: 1004,
      name: 'Hannibal Mejbri',
      firstName: 'Hannibal',
      lastName: 'Mejbri',
      dateOfBirth: '2003-01-21',
      nationality: 'Tunisia',
      position: 'Midfielder',
      shirtNumber: 46,
      lastUpdated: '2024-01-01',
      photo: 'https://media.api-sports.io/football/players/1004.png',
      teamId: 33,
      teamName: 'Manchester United',
      isOnLoan: true,
      loanedFrom: 'Manchester United',
      loanedTo: 'Sevilla',
      loanEndDate: '2025-06-30'
    },
    {
      id: 1005,
      name: 'Alvaro Fernandez',
      firstName: 'Alvaro',
      lastName: 'Fernandez',
      dateOfBirth: '2003-06-23',
      nationality: 'Spain',
      position: 'Defender',
      shirtNumber: 29,
      lastUpdated: '2024-01-01',
      photo: 'https://media.api-sports.io/football/players/1005.png',
      teamId: 33,
      teamName: 'Manchester United',
      isOnLoan: true,
      loanedFrom: 'Manchester United',
      loanedTo: 'Benfica',
      loanEndDate: '2025-06-30'
    }
  ],
  matches: [
    // Live matches for loaned players' teams
    {
      id: 1,
      homeTeam: {
        id: 33,
        name: 'Manchester United',
        shortName: 'Man United',
        tla: 'MUN',
        crest: 'https://media.api-sports.io/football/teams/33.png',
        country: 'England',
        league: 'Premier League',
        founded: 1878
      },
      awayTeam: {
        id: 34,
        name: 'Newcastle United',
        shortName: 'Newcastle',
        tla: 'NEW',
        crest: 'https://media.api-sports.io/football/teams/34.png',
        country: 'England',
        league: 'Premier League',
        founded: 1892
      },
      homeScore: 2,
      awayScore: 1,
      status: 'LIVE' as const,
      date: '2025-01-15T20:00:00Z',
      competition: 'Premier League',
      venue: 'Old Trafford',
      referee: 'Michael Oliver',
      minute: 67
    },
    // Upcoming matches for loaned players' teams
    {
      id: 2,
      homeTeam: {
        id: 35,
        name: 'Borussia Dortmund',
        shortName: 'Dortmund',
        tla: 'BVB',
        crest: 'https://media.api-sports.io/football/teams/35.png',
        country: 'Germany',
        league: 'Bundesliga',
        founded: 1909
      },
      awayTeam: {
        id: 36,
        name: 'Bayern Munich',
        shortName: 'Bayern',
        tla: 'BAY',
        crest: 'https://media.api-sports.io/football/teams/36.png',
        country: 'Germany',
        league: 'Bundesliga',
        founded: 1900
      },
      homeScore: undefined,
      awayScore: undefined,
      status: 'SCHEDULED' as const,
      date: '2025-01-20T19:30:00Z',
      competition: 'Bundesliga',
      venue: 'Signal Iduna Park',
      referee: 'Felix Brych',
      minute: undefined
    }
  ]
};

export class FootballApiService {
  // Search for teams
  static async searchTeams(query: string): Promise<Team[]> {
    // Use mock data to avoid API calls
    console.log('Using mock data for team search to avoid API calls');
    return MOCK_DATA.teams.filter(team => 
      team.name.toLowerCase().includes(query.toLowerCase()) ||
      team.shortName.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get team players including loaned ones
  static async getTeamPlayers(teamId: number): Promise<Player[]> {
    // Use mock data to avoid API calls
    console.log('Using mock data for team players to avoid API calls');
    return MOCK_DATA.players.filter(player => player.teamId === teamId);
  }



  // Get player statistics
  static async getPlayerStats(playerId: number, season: string = '2023'): Promise<PlayerStats[]> {
    // Use mock data to avoid API calls
    console.log('Using mock data for player stats to avoid API calls');
    return [{
      playerId,
      season,
      competition: 'Premier League',
      team: 'Stevenage',
      appearances: 15,
      goals: 2,
      assists: 3,
      yellowCards: 1,
      redCards: 0,
      minutesPlayed: 1350
    }];
  }

  // Get team matches
  static async getTeamMatches(teamId: number): Promise<Match[]> {
    // Use mock data to avoid API calls
    console.log('Using mock data for team matches to avoid API calls');
    return MOCK_DATA.matches.filter(match => 
      match.homeTeam.id === teamId || match.awayTeam.id === teamId
    );
  }

  // Get live matches
  static async getLiveMatches(): Promise<Match[]> {
    // Use mock data to avoid API calls
    console.log('Using mock data for live matches to avoid API calls');
    return MOCK_DATA.matches.filter(match => match.status === 'LIVE');
  }

  // Get upcoming matches
  static async getUpcomingMatches(): Promise<Match[]> {
    // Use mock data to avoid API calls
    console.log('Using mock data for upcoming matches to avoid API calls');
    return MOCK_DATA.matches.filter(match => match.status === 'SCHEDULED');
  }

  // Get live matches for teams where loaned players are playing
  static async getLiveMatchesForLoanedPlayers(loanedPlayers: Player[]): Promise<Match[]> {
    if (loanedPlayers.length === 0) return [];
    
    // Use mock data to avoid API calls
    console.log('Using mock data for live matches for loaned players to avoid API calls');
    
    // Get unique team IDs where loaned players are currently playing
    const loanedPlayerTeamIds = [...new Set(loanedPlayers.map(player => player.teamId))];
    
    // Get live matches for those teams
    const allLiveMatches = await this.getLiveMatches();
    return allLiveMatches.filter(match => 
      loanedPlayerTeamIds.includes(match.homeTeam.id) || loanedPlayerTeamIds.includes(match.awayTeam.id)
    );
  }

  // Get upcoming matches for teams where loaned players are playing
  static async getUpcomingMatchesForLoanedPlayers(loanedPlayers: Player[]): Promise<Match[]> {
    if (loanedPlayers.length === 0) return [];
    
    // Use mock data to avoid API calls
    console.log('Using mock data for upcoming matches for loaned players to avoid API calls');
    
    // Get unique team IDs where loaned players are currently playing
    const loanedPlayerTeamIds = [...new Set(loanedPlayers.map(player => player.teamId))];
    
    // Get upcoming matches for those teams
    const allUpcomingMatches = await this.getUpcomingMatches();
    return allUpcomingMatches.filter(match => 
      loanedPlayerTeamIds.includes(match.homeTeam.id) || loanedPlayerTeamIds.includes(match.awayTeam.id)
    );
  }
}
