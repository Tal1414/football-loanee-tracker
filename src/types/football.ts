export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  country: string;
  league: string;
  founded: number;
}

export interface Player {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  nationality: string;
  position: string;
  shirtNumber?: number;
  lastUpdated: string;
  photo?: string;
  teamId: number;
  teamName: string;
  isOnLoan: boolean;
  loanedFrom?: string;
  loanedTo?: string;
  loanEndDate?: string;
}

export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED';
  date: string;
  competition: string;
  venue?: string;
  referee?: string;
  minute?: number;
}

export interface PlayerStats {
  playerId: number;
  season: string;
  competition: string;
  team: string;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  cleanSheets?: number;
  saves?: number;
  goalsConceded?: number;
}

export interface UserPreferences {
  favoriteTeams: Team[];
  notifications: {
    liveScores: boolean;
    matchResults: boolean;
    playerUpdates: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// API Response Types
export interface ApiTeamResponse {
  team: {
    id: number;
    name: string;
    code: string;
    logo: string;
    country: string;
    founded: number;
  };
  league?: {
    name: string;
  };
}

export interface ApiPlayerResponse {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    birth?: {
      date: string;
    };
    nationality: string;
    updated: string;
    photo?: string;
  };
  statistics: Array<{
    games?: {
      position?: string;
      number?: number;
    };
    team?: {
      id: number;
      name: string;
    };
  }>;
}

export interface ApiPlayerStatsResponse {
  player: {
    id: number;
  };
  league?: {
    name: string;
  };
  team?: {
    name: string;
  };
  statistics?: {
    games?: {
      appearences?: number;
      minutes?: number;
    };
    goals?: {
      total?: number;
      assists?: number;
      conceded?: number;
    };
    cards?: {
      yellow?: number;
      red?: number;
    };
    clean_sheets?: {
      total?: number;
    };
    saves?: {
      total?: number;
    };
  };
}

export interface ApiMatchResponse {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      elapsed?: number;
    };
    venue?: {
      name: string;
    };
    referee?: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      code: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      code: string;
      logo: string;
    };
  };
  goals: {
    home?: number;
    away?: number;
  };
  league?: {
    name: string;
    country: string;
  };
}
