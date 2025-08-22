import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import type { Player, PlayerStats } from '../types/football';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [stats, setStats] = useState<PlayerStats | null>(null);

  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const loadPlayerStats = async () => {
      try {
        console.log('Loading stats for player:', player.id);
        // Create mock stats for the player since we're not using real API
        const mockStats = {
          playerId: player.id,
          season: '2024/2025',
          competition: getTeamLeague(player.loanedTo || player.teamName),
          team: player.loanedTo || player.teamName,
          appearances: Math.floor(Math.random() * 25) + 5,
          goals: Math.floor(Math.random() * 8),
          assists: Math.floor(Math.random() * 6),
          yellowCards: Math.floor(Math.random() * 3),
          redCards: Math.floor(Math.random() * 1),
          minutesPlayed: Math.floor(Math.random() * 1800) + 450
        };
        
        console.log('Created mock stats:', mockStats);
        setStats(mockStats);
      } catch (error) {
        console.error('Failed to load player stats:', error);
        setStats(null);
      }
    };
    loadPlayerStats();
  }, [player.id, player.isOnLoan, player.loanedTo, player.teamName]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };





  // Convert country names to flag emojis
  const getCountryFlag = (countryName: string): string => {
    const countryToFlag: { [key: string]: string } = {
      // Major countries
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Brazil': '🇧🇷',
      'Portugal': '🇵🇹',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Argentina': '🇦🇷',
      'Uruguay': '🇺🇾',
      'Colombia': '🇨🇴',
      'Chile': '🇨🇱',
      'Mexico': '🇲🇽',
      'United States': '🇺🇸',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Morocco': '🇲🇦',
      'Senegal': '🇸🇳',
      'Nigeria': '🇳🇬',
      'Ghana': '🇬🇭',
      'Ivory Coast': '🇨🇮',
      'Egypt': '🇪🇬',
      'Tunisia': '🇹🇳',
      'Algeria': '🇩🇿',
      'South Africa': '🇿🇦',
      'Poland': '🇵🇱',
      'Czech Republic': '🇨🇿',
      'Slovakia': '🇸🇰',
      'Hungary': '🇭🇺',
      'Romania': '🇷🇴',
      'Bulgaria': '🇧🇬',
      'Serbia': '🇷🇸',
      'Croatia': '🇭🇷',
      'Slovenia': '🇸🇮',
      'Bosnia and Herzegovina': '🇧🇦',
      'Montenegro': '🇲🇪',
      'North Macedonia': '🇲🇰',
      'Albania': '🇦🇱',
      'Kosovo': '🇽🇰',
      'Greece': '🇬🇷',
      'Turkey': '🇹🇷',
      'Ukraine': '🇺🇦',
      'Belarus': '🇧🇾',
      'Moldova': '🇲🇩',
      'Latvia': '🇱🇻',
      'Lithuania': '🇱🇹',
      'Estonia': '🇪🇪',
      'Finland': '🇫🇮',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Iceland': '🇮🇸',
      'Ireland': '🇮🇪',
      'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      'Northern Ireland': '🏴󠁧󠁢󠁮󠁩󠁲󠁿',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Luxembourg': '🇱🇺',
      'Liechtenstein': '🇱🇮',
      'Monaco': '🇲🇨',
      'Andorra': '🇦🇩',
      'San Marino': '🇸🇲',
      'Vatican City': '🇻🇦',
      'Malta': '🇲🇹',
      'Cyprus': '🇨🇾',
      'Israel': '🇮🇱',
      'Palestine': '🇵🇸',
      'Lebanon': '🇱🇧',
      'Syria': '🇸🇾',
      'Iraq': '🇮🇶',
      'Iran': '🇮🇷',
      'Afghanistan': '🇦🇫',
      'Pakistan': '🇵🇰',
      'Bangladesh': '🇧🇩',
      'Sri Lanka': '🇱🇰',
      'Nepal': '🇳🇵',
      'Bhutan': '🇧🇹',
      'Myanmar': '🇲🇲',
      'Thailand': '🇹🇭',
      'Vietnam': '🇻🇳',
      'Laos': '🇱🇦',
      'Cambodia': '🇰🇭',
      'Malaysia': '🇲🇾',
      'Singapore': '🇸🇬',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'Taiwan': '🇹🇼',
      'Hong Kong': '🇭🇰',
      'Macau': '🇲🇴',
      'Mongolia': '🇲🇳',
      'Kazakhstan': '🇰🇿',
      'Uzbekistan': '🇺🇿',
      'Kyrgyzstan': '🇰🇬',
      'Tajikistan': '🇹🇯',
      'Turkmenistan': '🇹🇲',
      'Azerbaijan': '🇦🇿',
      'Georgia': '🇬🇪',
      'Armenia': '🇦🇲',
      'Russia': '🇷🇺',
      'United Kingdom': '🇬🇧'
    };
    
    return countryToFlag[countryName] || '🏳️'; // Default to white flag if country not found
  };

  // Get the league for a team
  const getTeamLeague = (teamName: string): string => {
    const teamToLeague: { [key: string]: string } = {
      // Premier League teams
      'Arsenal': 'Premier League',
      'Chelsea': 'Premier League',
      'Manchester United': 'Premier League',
      'Manchester City': 'Premier League',
      'Liverpool': 'Premier League',
      'Tottenham Hotspur': 'Premier League',
      'Aston Villa': 'Premier League',
      'Newcastle United': 'Premier League',
      'Brighton & Hove Albion': 'Premier League',
      'West Ham United': 'Premier League',
      'Crystal Palace': 'Premier League',
      'Brentford': 'Premier League',
      'Fulham': 'Premier League',
      'Wolverhampton Wanderers': 'Premier League',
      'Everton': 'Premier League',
      'Nottingham Forest': 'Premier League',
      'Burnley': 'Premier League',
      'Sheffield United': 'Premier League',
      'Luton Town': 'Premier League',
      'Bournemouth': 'Premier League',
      
      // Championship teams
      'Leicester City': 'Championship',
      'Southampton': 'Championship',
      'Ipswich Town': 'Championship',
      'Swansea City': 'Championship',
      'Cardiff City': 'Championship',
      'Sunderland': 'Championship',
      'Blackburn Rovers': 'Championship',
      'Watford': 'Championship',
      'Middlesbrough': 'Championship',
      'Hull City': 'Championship',
      'Stoke City': 'Championship',
      'Bristol City': 'Championship',
      'Preston North End': 'Championship',
      'Millwall': 'Championship',
      'Coventry City': 'Championship',
      'Birmingham City': 'Championship',
      'Plymouth Argyle': 'Championship',
      'Huddersfield Town': 'Championship',
      'Rotherham United': 'Championship',
      'Queens Park Rangers': 'Championship',
      'Norwich City': 'Championship',
      
      // Scottish Premiership teams
      'Celtic': 'Scottish Premiership',
      'Rangers': 'Scottish Premiership',
      'Aberdeen': 'Scottish Premiership',
      'Hearts': 'Scottish Premiership',
      'Hibernian': 'Scottish Premiership',
      'Motherwell': 'Scottish Premiership',
      'St. Johnstone': 'Scottish Premiership',
      'Kilmarnock': 'Scottish Premiership',
      'Dundee': 'Scottish Premiership',
      'Dundee United': 'Scottish Premiership',
      'St. Mirren': 'Scottish Premiership',
      'Livingston': 'Scottish Premiership',
      
      // French Ligue 1 teams
      'Paris Saint-Germain': 'Ligue 1',
      'Marseille': 'Ligue 1',
      'Monaco': 'Ligue 1',
      'Lyon': 'Ligue 1',
      'Lille': 'Ligue 1',
      'Nantes': 'Ligue 1',
      'Strasbourg': 'Ligue 1',
      'Nice': 'Ligue 1',
      'Rennes': 'Ligue 1',
      'Reims': 'Ligue 1',
      'Toulouse': 'Ligue 1',
      'Montpellier': 'Ligue 1',
      'Brest': 'Ligue 1',
      'Lens': 'Ligue 1',
      'Clermont Foot': 'Ligue 1',
      'Metz': 'Ligue 1',
      'Le Havre': 'Ligue 1',
      'Troyes': 'Ligue 1',
      'Angers': 'Ligue 1',
      'Auxerre': 'Ligue 1',
      
      // Spanish La Liga teams
      'Real Madrid': 'La Liga',
      'Barcelona': 'La Liga',
      'Atletico Madrid': 'La Liga',
      'Sevilla': 'La Liga',
      'Villarreal': 'La Liga',
      'Real Sociedad': 'La Liga',
      'Athletic Bilbao': 'La Liga',
      'Real Betis': 'La Liga',
      'Valencia': 'La Liga',
      'Getafe': 'La Liga',
      'Girona': 'La Liga',
      'Rayo Vallecano': 'La Liga',
      'Osasuna': 'La Liga',
      'Celta Vigo': 'La Liga',
      'Mallorca': 'La Liga',
      'Alaves': 'La Liga',
      'Las Palmas': 'La Liga',
      'Granada': 'La Liga',
      'Cadiz': 'La Liga',
      'Almeria': 'La Liga',
      
      // Portuguese Primeira Liga teams
      'Benfica': 'Primeira Liga',
      'Porto': 'Primeira Liga',
      'Sporting CP': 'Primeira Liga',
      'Braga': 'Primeira Liga',
      'Vitoria Guimaraes': 'Primeira Liga',
      'Moreirense': 'Primeira Liga',
      'Farense': 'Primeira Liga',
      'Estoril': 'Primeira Liga',
      'Boavista': 'Primeira Liga',
      'Famalicao': 'Primeira Liga',
      'Gil Vicente': 'Primeira Liga',
      'Arouca': 'Primeira Liga',
      'Chaves': 'Primeira Liga',
      'Vizela': 'Primeira Liga',
      'Portimonense': 'Primeira Liga',
      'Casa Pia': 'Primeira Liga',
      'Rio Ave': 'Primeira Liga',
      'Estrela da Amadora': 'Primeira Liga',
      
      // German Bundesliga teams
      'Bayern Munich': 'Bundesliga',
      'Borussia Dortmund': 'Bundesliga',
      'RB Leipzig': 'Bundesliga',
      'Bayer Leverkusen': 'Bundesliga',
      'VfB Stuttgart': 'Bundesliga',
      'Eintracht Frankfurt': 'Bundesliga',
      'Hoffenheim': 'Bundesliga',
      'SC Freiburg': 'Bundesliga',
      'VfL Wolfsburg': 'Bundesliga',
      '1. FC Heidenheim': 'Bundesliga',
      '1. FC Union Berlin': 'Bundesliga',
      '1. FC Köln': 'Bundesliga',
      'FSV Mainz 05': 'Bundesliga',
      'SV Darmstadt 98': 'Bundesliga',
      'VfL Bochum': 'Bundesliga',
      'FC Augsburg': 'Bundesliga',
      'Borussia Mönchengladbach': 'Bundesliga',
      'Werder Bremen': 'Bundesliga',
      '1. FC Nürnberg': 'Bundesliga',
      
      // Dutch Eredivisie teams
      'Ajax': 'Eredivisie',
      'PSV Eindhoven': 'Eredivisie',
      'Feyenoord': 'Eredivisie',
      'AZ Alkmaar': 'Eredivisie',
      'FC Twente': 'Eredivisie',
      'SC Heerenveen': 'Eredivisie',
      'FC Utrecht': 'Eredivisie',
      'Vitesse': 'Eredivisie',
      'Heracles Almelo': 'Eredivisie',
      'FC Volendam': 'Eredivisie',
      'Sparta Rotterdam': 'Eredivisie',
      'NEC Nijmegen': 'Eredivisie',
      'Go Ahead Eagles': 'Eredivisie',
      'PEC Zwolle': 'Eredivisie',
      'RKC Waalwijk': 'Eredivisie',
      'Excelsior': 'Eredivisie',
      'Almere City': 'Eredivisie',
      'Fortuna Sittard': 'Eredivisie',
      'FC Emmen': 'Eredivisie'
    };
    
    return teamToLeague[teamName] || 'Unknown League';
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 max-w-sm">
      {/* Compact Player Header */}
      <div className="relative bg-gradient-to-br from-slate-800 to-blue-900 p-4">
        <div className="flex items-center space-x-4">
          {/* Compact Photo */}
          <div className="flex-shrink-0">
            <img
              src={player.photo || ''}
              alt={`${player.name} photo`}
              className="w-16 h-16 rounded-xl object-cover border-2 border-white/30 shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Compact Fallback */}
            <div className="hidden w-16 h-16 rounded-xl border-2 border-white/30 shadow-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {(player.firstName?.charAt(0) || '')}{(player.lastName?.charAt(0) || '')}
              </span>
            </div>
          </div>
          
          {/* Compact Player Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-2 truncate">{player.name}</h3>
            
            {/* Compact Three-Badge System */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-500 text-white">
                {player.position}
              </span>
              {player.specificPosition && (
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-purple-500 text-white">
                  {player.specificPosition}
                </span>
              )}
              {player.shirtNumber && (
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-white/20 text-white border border-white/30">
                  #{player.shirtNumber}
                </span>
              )}
            </div>
            
            {/* Compact Nationality */}
            <div className="flex items-center space-x-2 text-white/80">
              <span className="text-sm">{getCountryFlag(player.nationality)}</span>
              <span className="text-xs font-medium">{player.nationality}</span>
            </div>
          </div>
        </div>

        {/* Compact Loan Information */}
        {player.isOnLoan && (
          <div className="mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold">On loan</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-emerald-100">Ends {player.loanEndDate ? formatDate(player.loanEndDate) : 'Unknown'}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-emerald-100">
              <span className="font-medium">{player.loanedFrom}</span>
              <span className="mx-2">→</span>
              <span className="font-medium">{player.loanedTo}</span>
            </div>
          </div>
        )}
      </div>

      {/* Compact Stats Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900">Statistics</h4>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              showStats
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showStats ? 'Hide' : 'View'}
          </button>
        </div>

        {showStats && stats && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{stats.appearances}</div>
                <div className="text-xs text-gray-600">Apps</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{stats.goals}</div>
                <div className="text-xs text-gray-600">Goals</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{stats.assists}</div>
                <div className="text-xs text-gray-600">Assists</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{Math.round(stats.minutesPlayed / 90)}</div>
                <div className="text-xs text-gray-600">Games</div>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500 bg-white px-3 py-2 rounded border">
              {stats.season} • {stats.competition}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
