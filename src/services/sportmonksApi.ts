import type { Team, Player, Match, PlayerStats } from '../types/football';
import { MockDataService } from './mockDataService';

// SportMonks API configuration - will be updated when Premium is available
const BASE_URL = 'https://api.sportmonks.com/v3/football';

// API client helper for future Premium integration
const apiCall = async (endpoint: string, token: string): Promise<any> => {
  try {
    console.log(`Making API call to: ${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}?api_token=${token}`, {
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
    return MockDataService.getAvailableLeagues();
  }

  // Get teams from a specific league season
  static async getLeagueTeams(leagueId: number): Promise<Team[]> {
    // For now, return all teams since we have comprehensive data
    return MockDataService.getAllTeams();
  }

  // Get all teams
  static async getAllTeams(): Promise<Team[]> {
    return MockDataService.getAllTeams();
  }

  // Search teams
  static async searchTeams(query: string): Promise<Team[]> {
    return MockDataService.searchTeams(query);
  }

  // Get players
  static async getPlayers(): Promise<Player[]> {
    return MockDataService.getPlayers();
  }

  // Get team players
  static async getTeamPlayers(teamName: string): Promise<Player[]> {
    return MockDataService.getTeamPlayers(teamName);
  }

  // Get all fixtures
  static async getAllFixtures(): Promise<Match[]> {
    return MockDataService.getAllFixtures();
  }

  // Get recent matches
  static async getRecentMatches(): Promise<Match[]> {
    return MockDataService.getRecentMatches();
  }

  // Get upcoming matches
  static async getUpcomingMatches(): Promise<Match[]> {
    return MockDataService.getUpcomingMatches();
  }

  // Get player statistics
  static async getPlayerStats(playerId: number): Promise<PlayerStats | null> {
    return MockDataService.getPlayerStats(playerId);
  }
}
