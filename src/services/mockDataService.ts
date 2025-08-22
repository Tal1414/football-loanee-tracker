import teamsData from '../mockData/teams.json';
import playersData from '../mockData/players.json';
import matchesData from '../mockData/matches.json';
import leaguesData from '../mockData/leagues.json';
import type { Team, Player, Match, PlayerStats } from '../types/football';

export class MockDataService {
  // Teams
  static async getAllTeams(): Promise<Team[]> {
    return teamsData.data.map(team => ({
      id: team.id,
      name: team.name,
      shortName: team.short_name,
      tla: team.tla,
      crest: team.crest,
      country: team.country,
      league: team.league,
      founded: team.founded
    }));
  }

  static async searchTeams(query: string): Promise<Team[]> {
    const teams = await this.getAllTeams();
    const searchTerm = query.toLowerCase();
    
    return teams.filter(team => 
      team.name.toLowerCase().includes(searchTerm) ||
      team.shortName.toLowerCase().includes(searchTerm) ||
      team.tla.toLowerCase().includes(searchTerm)
    );
  }

  static async getTeamById(id: number): Promise<Team | null> {
    const teams = await this.getAllTeams();
    return teams.find(team => team.id === id) || null;
  }

  // Players
  static async getPlayers(): Promise<Player[]> {
    return playersData.data.map(player => ({
      id: player.id,
      name: player.name,
      firstName: player.first_name,
      lastName: player.last_name,
      dateOfBirth: player.date_of_birth,
      nationality: player.nationality,
      position: player.position,
      specificPosition: player.specific_position,
      shirtNumber: player.shirt_number,
      lastUpdated: player.last_updated,
      photo: player.photo,
      teamId: player.team_id,
      teamName: player.team_name,
      isOnLoan: player.is_on_loan,
      loanedFrom: player.loaned_from || undefined,
      loanedTo: player.loaned_to || undefined,
      loanEndDate: player.loan_end_date || undefined
    }));
  }

  static async getTeamPlayers(teamName: string): Promise<Player[]> {
    const players = await this.getPlayers();
    return players.filter(player => 
      player.teamName.toLowerCase() === teamName.toLowerCase() ||
      player.loanedFrom?.toLowerCase() === teamName.toLowerCase()
    );
  }

  static async getPlayerById(id: number): Promise<Player | null> {
    const players = await this.getPlayers();
    return players.find(player => player.id === id) || null;
  }

  // Matches
  static async getAllFixtures(): Promise<Match[]> {
    return matchesData.data.map(match => ({
      id: match.id,
      homeTeam: {
        id: match.home_team.id,
        name: match.home_team.name,
        shortName: match.home_team.short_name,
        tla: match.home_team.tla,
        crest: match.home_team.crest,
        country: match.home_team.country,
        league: match.home_team.league,
        founded: match.home_team.founded
      },
      awayTeam: {
        id: match.away_team.id,
        name: match.away_team.name,
        shortName: match.away_team.short_name,
        tla: match.away_team.tla,
        crest: match.away_team.crest,
        country: match.away_team.country,
        league: match.away_team.league,
        founded: match.away_team.founded
      },
      homeScore: match.home_score,
      awayScore: match.away_score,
      status: match.status as 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED',
      date: match.date,
      competition: match.competition,
      venue: match.venue,
      referee: match.referee,
      minute: match.minute,
      loanedPlayers: match.loaned_players?.map(lp => ({
        playerId: lp.player_id,
        name: lp.name,
        team: lp.team,
        isStarting: lp.is_starting,
        position: lp.position
      }))
    }));
  }

  static async getRecentMatches(): Promise<Match[]> {
    const allFixtures = await this.getAllFixtures();
    return allFixtures.filter(fixture => fixture.status === 'FINISHED').slice(0, 5);
  }

  static async getUpcomingMatches(): Promise<Match[]> {
    const allFixtures = await this.getAllFixtures();
    return allFixtures.filter(fixture => 
      fixture.status === 'SCHEDULED'
    ).slice(0, 10);
  }

  // Leagues
  static async getAvailableLeagues(): Promise<any[]> {
    return leaguesData.data.map(league => ({
      id: league.id,
      name: league.name,
      country: league.country,
      flag: league.flag,
      logo: league.logo,
      season: league.season,
      status: league.status
    }));
  }

  static async getLeagueById(id: number): Promise<any | null> {
    const leagues = await this.getAvailableLeagues();
    return leagues.find(league => league.id === id) || null;
  }

  // Player Statistics (Mock data)
  static async getPlayerStats(playerId: number): Promise<PlayerStats | null> {
    const player = await this.getPlayerById(playerId);
    if (!player) return null;

    // Generate realistic mock stats based on player position
    const baseStats = {
      playerId: player.id,
      season: '2024/2025',
      competition: this.getTeamLeague(player.teamName),
      team: player.teamName,
      appearances: Math.floor(Math.random() * 20) + 5,
      minutesPlayed: Math.floor(Math.random() * 1800) + 300,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
      saves: 0
    };

    // Adjust stats based on position
    switch (player.position) {
      case 'Forward':
        baseStats.goals = Math.floor(Math.random() * 15) + 2;
        baseStats.assists = Math.floor(Math.random() * 8) + 1;
        break;
      
      case 'Midfielder':
        baseStats.goals = Math.floor(Math.random() * 8) + 1;
        baseStats.assists = Math.floor(Math.random() * 12) + 2;
        break;
      
      case 'Defender':
        baseStats.goals = Math.floor(Math.random() * 3) + 1;
        baseStats.assists = Math.floor(Math.random() * 5) + 1;
        baseStats.cleanSheets = Math.floor(Math.random() * 8) + 2;
        break;
      
      case 'Goalkeeper':
        baseStats.cleanSheets = Math.floor(Math.random() * 10) + 3;
        baseStats.saves = Math.floor(Math.random() * 80) + 30;
        break;
    }

    return baseStats;
  }

  // Helper method to get team league
  private static getTeamLeague(teamName: string): string {
    const teamToLeague: { [key: string]: string } = {
      'Arsenal': 'Premier League',
      'Chelsea': 'Premier League',
      'Manchester United': 'Premier League',
      'Manchester City': 'Premier League',
      'Liverpool': 'Premier League',
      'Tottenham Hotspur': 'Premier League',
      'Newcastle United': 'Premier League',
      'Aston Villa': 'Premier League',
      'Leicester City': 'Championship',
      'Southampton': 'Championship',
      'Ipswich Town': 'Championship',
      'Sunderland': 'Championship',
      'Burnley': 'Premier League',
      'Sheffield United': 'Premier League',
      'Swansea City': 'Championship',
      'Cardiff City': 'Championship',
      'Sevilla': 'La Liga',
      'Real Betis': 'La Liga',
      'Nantes': 'Ligue 1',
      'Lyon': 'Ligue 1',
      'Nottingham Forest': 'Premier League',
      'Benfica': 'Primeira Liga',
      'Porto': 'Primeira Liga',
      'Mainz 05': 'Bundesliga'
    };
    
    return teamToLeague[teamName] || 'Unknown League';
  }
}
