import type { Team, Player, Match, PlayerStats } from '../types/football';
import { MockDataService } from './mockDataService';

export class SportMonksApiService {
  // Get available leagues
  static async getAvailableLeagues(): Promise<unknown[]> {
    return MockDataService.getAvailableLeagues();
  }

  // Get teams from a specific league season
  static async getLeagueTeams(): Promise<Team[]> {
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

  // Get player stats
  static async getPlayerStats(playerId: number): Promise<PlayerStats | null> {
    return MockDataService.getPlayerStats(playerId);
  }

  // Helper method to get league name by ID
  static getLeagueName(leagueId: number): string {
    switch (leagueId) {
      case 271:
        return 'Danish Superliga';
      case 501:
        return 'Scottish Premiership';
      default:
        return 'Unknown League';
    }
  }
}
