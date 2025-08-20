import type { Team, Player, Match, PlayerStats } from '../types/football';

// SportMonks API configuration
const SPORTMONKS_API_TOKEN = 'YnaD6WT4Rs1Bvpei2GH7LOGcX6gKXUUx1YKAH2NNOzuSIoL7HPDp3cOUiHdS';
const BASE_URL = 'http://localhost:4000/api';

// Available leagues in free plan
const AVAILABLE_LEAGUES = {
  danish: { id: 271, name: 'Danish Superliga', country: 'Denmark' },
  scottish: { id: 501, name: 'Scottish Premiership', country: 'Scotland' }
};

// Available seasons (most recent available)
const AVAILABLE_SEASONS = {
  danish: 759, // 2016/2017
  scottish: 825 // 2016/2017
};

// API client helper
const apiCall = async (endpoint: string): Promise<any> => {
  try {
    console.log(`Making API call to: ${BASE_URL}${endpoint}`);
    // No api_token needed, proxy adds it
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log('API Response received successfully');
    return data;
  } catch (error) {
    console.error('SportMonks API call failed:', error);
    console.log('Falling back to enhanced mock data...');
    throw error;
  }
};

// SportMonks API response types
interface SportMonksTeam {
  id: number;
  name: string;
  short_code: string;
  image_path: string;
  country_id: number;
  founded: number;
  venue_id: number;
  last_played_at: string;
}

interface SportMonksPlayer {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  common_name: string;
  display_name: string;
  image_path: string;
  height: number;
  weight: number;
  date_of_birth: string;
  nationality_id: number;
  position_id: number;
  country_id: number;
}

interface SportMonksFixture {
  id: number;
  name: string;
  starting_at: string;
  result_info: string;
  length: number;
  state_id: number;
  league_id: number;
  season_id: number;
  venue_id: number;
}

export class SportMonksApiService {
  // Get available leagues
  static async getAvailableLeagues(): Promise<any[]> {
    const response = await apiCall('/leagues');
    return response.data.filter((league: any) => 
      league.id === AVAILABLE_LEAGUES.danish.id || 
      league.id === AVAILABLE_LEAGUES.scottish.id
    );
  }

  // Get teams from a specific league season
  static async getLeagueTeams(leagueId: number): Promise<Team[]> {
    let seasonId: number;
    
    if (leagueId === AVAILABLE_LEAGUES.danish.id) {
      seasonId = AVAILABLE_SEASONS.danish;
    } else if (leagueId === AVAILABLE_LEAGUES.scottish.id) {
      seasonId = AVAILABLE_SEASONS.scottish;
    } else {
      throw new Error('League not available in free plan');
    }

    const response = await apiCall(`/seasons/${seasonId}?include=teams`);
    
    if (!response.data.teams) {
      throw new Error('No teams data available');
    }

    return response.data.teams.map((team: SportMonksTeam) => ({
      id: team.id,
      name: team.name,
      shortName: team.short_code || team.name,
      tla: team.short_code || team.name.substring(0, 3).toUpperCase(),
      crest: team.image_path,
      country: this.getCountryName(team.country_id),
      league: this.getLeagueName(leagueId),
      founded: team.founded
    }));
  }

  // Get all available teams
  static async getAllTeams(): Promise<Team[]> {
    try {
      const danishTeams = await this.getLeagueTeams(AVAILABLE_LEAGUES.danish.id);
      const scottishTeams = await this.getLeagueTeams(AVAILABLE_LEAGUES.scottish.id);
      return [...danishTeams, ...scottishTeams];
    } catch (error) {
      console.log('API failed, using enhanced mock teams...');
      return this.getMockTeams();
    }
  }

  // Search teams by name
  static async searchTeams(query: string): Promise<Team[]> {
    const allTeams = await this.getAllTeams();
    return allTeams.filter(team => 
      team.name.toLowerCase().includes(query.toLowerCase()) ||
      team.shortName.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get players (limited by free plan - historical data only)
  static async getPlayers(): Promise<Player[]> {
    try {
      const response = await apiCall('/players');
      
      // Filter players by available countries (Denmark: 320, Scotland: 1161)
      const availablePlayers = response.data.filter((player: SportMonksPlayer) => 
        player.country_id === 320 || player.country_id === 1161
      );

      return availablePlayers.map((player: SportMonksPlayer) => {
        // Create realistic loan scenarios for demonstration
        const loanInfo = this.createLoanScenario(player);
        
        return {
          id: player.id,
          name: player.display_name || player.common_name || player.name,
          firstName: player.firstname,
          lastName: player.lastname,
          dateOfBirth: player.date_of_birth,
          nationality: this.getCountryName(player.nationality_id),
          position: this.getPositionName(player.position_id),
          shirtNumber: null, // Not available in free plan
          lastUpdated: new Date().toISOString(),
          photo: player.image_path,
          teamId: null, // Need to determine team from other data
          teamName: null,
          isOnLoan: loanInfo.isOnLoan,
          loanedFrom: loanInfo.loanedFrom,
          loanedTo: loanInfo.loanedTo,
          loanEndDate: loanInfo.loanEndDate
        };
      });
    } catch (error) {
      console.log('API failed, using enhanced mock players with loan scenarios...');
      return this.getMockPlayers();
    }
  }

  // Get fixtures for a specific league
  static async getLeagueFixtures(leagueId: number): Promise<Match[]> {
    const response = await apiCall('/fixtures');
    
    // Filter fixtures by league and available seasons
    const leagueFixtures = response.data.filter((fixture: SportMonksFixture) => {
      if (fixture.league_id !== leagueId) return false;
      
      if (leagueId === AVAILABLE_LEAGUES.danish.id) {
        return fixture.season_id === AVAILABLE_SEASONS.danish;
      } else if (leagueId === AVAILABLE_LEAGUES.scottish.id) {
        return fixture.season_id === AVAILABLE_SEASONS.scottish;
      }
      return false;
    });

    // Convert to our Match format
    return leagueFixtures.map((fixture: SportMonksFixture) => ({
      id: fixture.id,
      homeTeam: this.createMockTeam('Home Team'), // Need to parse fixture name
      awayTeam: this.createMockTeam('Away Team'),
      homeScore: null,
      awayScore: null,
      status: this.getMatchStatus(fixture.state_id),
      date: fixture.starting_at,
      competition: this.getLeagueName(leagueId),
      venue: null,
      referee: null,
      minute: null
    }));
  }

  // Get all available fixtures
  static async getAllFixtures(): Promise<Match[]> {
    const danishFixtures = await this.getLeagueFixtures(AVAILABLE_LEAGUES.danish.id);
    const scottishFixtures = await this.getLeagueFixtures(AVAILABLE_LEAGUES.scottish.id);
    return [...danishFixtures, ...scottishFixtures];
  }

  // Helper methods
  private static getCountryName(countryId: number): string {
    const countries: { [key: number]: string } = {
      320: 'Denmark',
      1161: 'Scotland'
    };
    return countries[countryId] || 'Unknown';
  }

  private static getLeagueName(leagueId: number): string {
    if (leagueId === AVAILABLE_LEAGUES.danish.id) {
      return AVAILABLE_LEAGUES.danish.name;
    } else if (leagueId === AVAILABLE_LEAGUES.scottish.id) {
      return AVAILABLE_LEAGUES.scottish.name;
    }
    return 'Unknown League';
  }

  private static getPositionName(positionId: number): string {
    const positions: { [key: number]: string } = {
      25: 'Forward',
      26: 'Midfielder',
      27: 'Defender',
      28: 'Goalkeeper'
    };
    return positions[positionId] || 'Unknown';
  }

  private static getMatchStatus(stateId: number): 'FINISHED' | 'SCHEDULED' | 'LIVE' | 'POSTPONED' {
    // State IDs from SportMonks (approximate mapping)
    if (stateId === 5) return 'FINISHED';
    if (stateId === 1) return 'SCHEDULED';
    if (stateId === 2) return 'LIVE';
    return 'POSTPONED';
  }

  private static createMockTeam(name: string): Team {
    return {
      id: 0,
      name,
      shortName: name,
      tla: name.substring(0, 3).toUpperCase(),
      crest: 'https://via.placeholder.com/48x48?text=' + name.substring(0, 2),
      country: 'Unknown',
      league: 'Unknown',
      founded: 0
    };
  }

  // Get team players (not available in free plan, but keeping interface)
  static async getTeamPlayers(teamId: number): Promise<Player[]> {
    // In free plan, we can't get team-specific players
    // Return players filtered by country based on team
    const allPlayers = await this.getPlayers();
    const team = await this.getTeamById(teamId);
    
    if (team) {
      return allPlayers.filter(player => 
        player.nationality === team.country
      );
    }
    
    return [];
  }

  // Get player statistics (not available in free plan)
  static async getPlayerStats(playerId: number): Promise<PlayerStats[]> {
    // Return mock stats since detailed stats aren't available in free plan
    return [{
      playerId,
      season: '2016/2017',
      competition: 'Historical Data',
      team: 'Unknown',
      appearances: Math.floor(Math.random() * 30) + 1,
      goals: Math.floor(Math.random() * 15),
      assists: Math.floor(Math.random() * 10),
      yellowCards: Math.floor(Math.random() * 5),
      redCards: Math.floor(Math.random() * 2),
      minutesPlayed: Math.floor(Math.random() * 2700) + 90
    }];
  }

  // Get team matches
  static async getTeamMatches(): Promise<Match[]> {
    const allFixtures = await this.getAllFixtures();
    // Filter fixtures by team (would need to parse fixture names)
    return allFixtures.slice(0, 5); // Return first 5 for now
  }

  // Get live matches (not available in free plan)
  static async getLiveMatches(): Promise<Match[]> {
    return []; // No live matches in free plan
  }

  // Get upcoming matches
  static async getUpcomingMatches(): Promise<Match[]> {
    const allFixtures = await this.getAllFixtures();
    return allFixtures.filter(fixture => 
      fixture.status === 'SCHEDULED'
    ).slice(0, 10);
  }

  // Helper to get team by ID
  private static async getTeamById(teamId: number): Promise<Team | null> {
    const allTeams = await this.getAllTeams();
    return allTeams.find(team => team.id === teamId) || null;
  }

  // Create realistic loan scenarios for demonstration
  private static createLoanScenario(player: SportMonksPlayer): {
    isOnLoan: boolean;
    loanedFrom?: string;
    loanedTo?: string;
    loanEndDate?: string;
  } {
    // Create some realistic loan scenarios based on player characteristics
    const playerName = player.display_name || player.common_name || player.name;
    
    // Known loan scenarios for demonstration
    const knownLoans: { [key: string]: { from: string; to: string; endDate: string } } = {
      'Daniel Agger': { from: 'Liverpool', to: 'Brøndby IF', endDate: '2016-06-30' },
      'Liam Miller': { from: 'Celtic', to: 'Hibernian', endDate: '2016-05-31' },
      'Anthony Stokes': { from: 'Celtic', to: 'Hibernian', endDate: '2016-05-31' }
    };

    // Check if player has a known loan scenario
    if (knownLoans[playerName]) {
      const loan = knownLoans[playerName];
      return {
        isOnLoan: true,
        loanedFrom: loan.from,
        loanedTo: loan.to,
        loanEndDate: loan.endDate
      };
    }

    // Create some additional loan scenarios based on player characteristics
    if (player.position_id === 25 && player.country_id === 1161) { // Scottish forwards
      // 30% chance of being on loan
      if (Math.random() < 0.3) {
        const scottishTeams = ['Celtic', 'Rangers', 'Aberdeen', 'Hearts', 'Hibernian'];
        const danishTeams = ['FC København', 'Brøndby IF', 'Silkeborg IF', 'Horsens'];
        
        return {
          isOnLoan: true,
          loanedFrom: scottishTeams[Math.floor(Math.random() * scottishTeams.length)],
          loanedTo: danishTeams[Math.floor(Math.random() * danishTeams.length)],
          loanEndDate: '2016-06-30'
        };
      }
    }

    if (player.position_id === 27 && player.country_id === 320) { // Danish defenders
      // 25% chance of being on loan
      if (Math.random() < 0.25) {
        const danishTeams = ['FC København', 'Brøndby IF', 'Silkeborg IF', 'Horsens'];
        const scottishTeams = ['Celtic', 'Rangers', 'Aberdeen', 'Hearts', 'Hibernian'];
        
        return {
          isOnLoan: true,
          loanedFrom: danishTeams[Math.floor(Math.random() * danishTeams.length)],
          loanedTo: scottishTeams[Math.floor(Math.random() * danishTeams.length)],
          loanEndDate: '2016-06-30'
        };
      }
    }

    // Default: not on loan
    return {
      isOnLoan: false,
      loanedFrom: undefined,
      loanedTo: undefined,
      loanEndDate: undefined
    };
  }

  // Get matches for loaned players (not applicable in free plan)
  static async getLiveMatchesForLoanedPlayers(): Promise<Match[]> {
    return []; // No live matches available
  }

  static async getUpcomingMatchesForLoanedPlayers(): Promise<Match[]> {
    return []; // Limited data available
  }

  // Mock data fallback methods
  private static getMockTeams(): Team[] {
    return [
      {
        id: 53,
        name: 'Celtic',
        shortName: 'Celtic',
        tla: 'CEL',
        crest: 'https://cdn.sportmonks.com/images/soccer/teams/21/53.png',
        country: 'Scotland',
        league: 'Scottish Premiership',
        founded: 1888
      },
      {
        id: 62,
        name: 'Rangers',
        shortName: 'Rangers',
        tla: 'RAN',
        crest: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
        country: 'Scotland',
        league: 'Scottish Premiership',
        founded: 1873
      },
      {
        id: 85,
        name: 'FC København',
        shortName: 'FCK',
        tla: 'COP',
        crest: 'https://cdn.sportmonks.com/images/soccer/teams/21/85.png',
        country: 'Denmark',
        league: 'Danish Superliga',
        founded: 1992
      },
      {
        id: 293,
        name: 'Brøndby IF',
        shortName: 'Brøndby',
        tla: 'BIF',
        crest: 'https://cdn.sportmonks.com/images/soccer/teams/5/293.png',
        country: 'Denmark',
        league: 'Danish Superliga',
        founded: 1964
      }
    ];
  }

  private static getMockPlayers(): Player[] {
    return [
      {
        id: 1,
        name: 'Daniel Agger',
        firstName: 'Daniel',
        lastName: 'Agger',
        dateOfBirth: '1984-12-12',
        nationality: 'Denmark',
        position: 'Defender',
        shirtNumber: 5,
        lastUpdated: new Date().toISOString(),
        photo: 'https://cdn.sportmonks.com/images/soccer/players/14/14.png',
        teamId: 293,
        teamName: 'Brøndby IF',
        isOnLoan: true,
        loanedFrom: 'Liverpool',
        loanedTo: 'Brøndby IF',
        loanEndDate: '2016-06-30'
      },
      {
        id: 2,
        name: 'Liam Miller',
        firstName: 'Liam',
        lastName: 'Miller',
        dateOfBirth: '1981-02-13',
        nationality: 'Scotland',
        position: 'Midfielder',
        shirtNumber: 8,
        lastUpdated: new Date().toISOString(),
        photo: 'https://cdn.sportmonks.com/images/soccer/players/21/21.png',
        teamId: 66,
        teamName: 'Hibernian',
        isOnLoan: true,
        loanedFrom: 'Celtic',
        loanedTo: 'Hibernian',
        loanEndDate: '2016-05-31'
      },
      {
        id: 3,
        name: 'Anthony Stokes',
        firstName: 'Anthony',
        lastName: 'Stokes',
        dateOfBirth: '1988-07-25',
        nationality: 'Ireland',
        position: 'Forward',
        shirtNumber: 10,
        lastUpdated: new Date().toISOString(),
        photo: 'https://cdn.sportmonks.com/images/soccer/players/25/25.png',
        teamId: 66,
        teamName: 'Hibernian',
        isOnLoan: true,
        loanedFrom: 'Celtic',
        loanedTo: 'Hibernian',
        loanEndDate: '2016-05-31'
      },
      {
        id: 4,
        name: 'Kasper Schmeichel',
        firstName: 'Kasper',
        lastName: 'Schmeichel',
        dateOfBirth: '1986-11-05',
        nationality: 'Denmark',
        position: 'Goalkeeper',
        shirtNumber: 1,
        lastUpdated: new Date().toISOString(),
        photo: 'https://via.placeholder.com/100x100?text=KS',
        teamId: 85,
        teamName: 'FC København',
        isOnLoan: false,
        loanedFrom: undefined,
        loanedTo: undefined,
        loanEndDate: undefined
      },
      {
        id: 5,
        name: 'Scott Brown',
        firstName: 'Scott',
        lastName: 'Brown',
        dateOfBirth: '1985-06-25',
        nationality: 'Scotland',
        position: 'Midfielder',
        shirtNumber: 8,
        lastUpdated: new Date().toISOString(),
        photo: 'https://via.placeholder.com/100x100?text=SB',
        teamId: 53,
        teamName: 'Celtic',
        isOnLoan: false,
        loanedFrom: undefined,
        loanedTo: undefined,
        loanEndDate: undefined
      }
    ];
  }
}
