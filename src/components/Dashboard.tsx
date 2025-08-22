import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, AlertCircle, Star, Clock, MapPin } from 'lucide-react';
import type { Team, Player, Match } from '../types/football';
import { SportMonksApiService } from '../services/sportmonksApi';
import { useUserPreferences } from '../hooks/useUserPreferences';
import TeamSearch from './TeamSearch';
import PlayerCard from './PlayerCard';

const Dashboard: React.FC = () => {
  const { preferences, addFavoriteTeam, removeFavoriteTeam } = useUserPreferences();
  const [loanedPlayers, setLoanedPlayers] = useState<Player[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load loaned players
        const players = await SportMonksApiService.getPlayers();
        const filteredPlayers = players.filter(player => 
          player.isOnLoan && 
          preferences.favoriteTeams.some(team => team.name === player.loanedFrom)
        );
        setLoanedPlayers(filteredPlayers);

        // Load recent matches
        const recent = await SportMonksApiService.getRecentMatches();
        const filteredRecent = recent.filter(match => 
          match.loanedPlayers && 
          match.loanedPlayers.length > 0 &&
          match.loanedPlayers.some(loanedPlayer => 
            // Check if this loaned player is FROM one of our favorite teams
            filteredPlayers.some(player => 
              player.id === loanedPlayer.playerId && 
              player.loanedFrom && 
              preferences.favoriteTeams.some(favTeam => favTeam.name === player.loanedFrom)
            )
          )
        );
        setRecentMatches(filteredRecent);

        // Load upcoming matches
        const upcoming = await SportMonksApiService.getUpcomingMatches();
        const filteredUpcoming = upcoming.filter(match => 
          match.loanedPlayers && 
          match.loanedPlayers.length > 0 &&
          match.loanedPlayers.some(loanedPlayer => 
            // Check if this loaned player is FROM one of our favorite teams
            filteredPlayers.some(player => 
              player.id === loanedPlayer.playerId && 
              player.loanedFrom && 
              preferences.favoriteTeams.some(favTeam => favTeam.name === player.loanedFrom)
            )
          )
        );
        setUpcomingMatches(filteredUpcoming);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (preferences.favoriteTeams.length > 0) {
      loadData();
    } else {
      // If no favorite teams, still set loading to false to show the team selection interface
      setIsLoading(false);
    }
  }, [preferences.favoriteTeams]);

  const handleTeamSelect = (team: Team) => {
    addFavoriteTeam(team);
  };

  const handleTeamRemove = (teamId: number) => {
    removeFavoriteTeam(teamId);
  };



  const formatMatchTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    LoaneeTracker ⚽
                  </h1>
                  <p className="text-blue-100 text-xl max-w-2xl leading-relaxed">
                    Follow your favorite club's loaned players across the world. Track their performances, 
                    watch live matches, and never miss a moment of their development journey.
                  </p>
                </div>
              </div>
              
              {/* Enhanced Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">{preferences.favoriteTeams.length}</div>
                  <div className="text-blue-100 text-sm">Favorite Teams</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">{loanedPlayers.length}</div>
                  <div className="text-blue-100 text-sm">Loaned Players</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">{recentMatches.length}</div>
                  <div className="text-blue-100 text-sm">Recent Matches</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">{upcomingMatches.length}</div>
                  <div className="text-blue-100 text-sm">Upcoming Matches</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Team Selection */}
        {preferences.favoriteTeams.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 mb-12">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-3xl inline-block mb-8">
                <Trophy className="w-24 h-24 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Get Started</h2>
              <p className="text-gray-600 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
                Choose your favorite football clubs to start tracking their loaned players. 
                We'll show you live matches, upcoming fixtures, and player statistics 
                for all the teams you care about.
              </p>
              <div className="bg-blue-50 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works:</h3>
                <ul className="text-blue-800 text-left space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Select your favorite teams from the search below</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>View all their loaned players across different clubs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Track live matches and upcoming fixtures</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Monitor individual player statistics and performance</span>
                  </li>
                </ul>
              </div>
              <TeamSearch onTeamSelect={handleTeamSelect} selectedTeams={preferences.favoriteTeams} />
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                  <Star className="w-8 h-8 text-yellow-500 mr-3" />
                  Your Favorite Teams
                </h2>
                <p className="text-gray-600 text-lg">
                  Track loaned players from {preferences.favoriteTeams.length} selected team{preferences.favoriteTeams.length !== 1 ? 's' : ''}
                </p>
              </div>
              <TeamSearch onTeamSelect={handleTeamSelect} selectedTeams={preferences.favoriteTeams} />
            </div>
            
            {/* Selected Teams Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {preferences.favoriteTeams.map((team) => (
                <div key={team.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <img src={team.crest} alt={team.name} className="w-12 h-12 rounded-xl" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-600">{team.league}</p>
                    </div>
                    <button
                      onClick={() => handleTeamRemove(team.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <span className="sr-only">Remove {team.name}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {preferences.favoriteTeams.length > 0 && (
          <>
            {/* Enhanced Loaned Players */}
            <div className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-3">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  Loaned Players
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl">
                  These are the players from your favorite teams who are currently on loan at other clubs. 
                  Track their development and performance across different leagues and competitions.
                </p>
              </div>
              
              {loanedPlayers.filter(p => p.isOnLoan).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {loanedPlayers.filter(p => p.isOnLoan).map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-12 text-center shadow-xl">
                  <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-6 rounded-3xl inline-block mb-6">
                    <AlertCircle className="w-20 h-20 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Loaned Players Found</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    Currently, there are no players on loan from your selected favorite teams. 
                    This could mean all players are at their parent club, or the loan period has ended.
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Live Matches Section */}
            <div className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-3">
                  <Calendar className="w-8 h-8 text-green-600 mr-3" />
                  Recent Matches
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl">
                  Watch recent matches where your loaned players were playing. 
                  See real-time scores, match progress, and which players were starting or on the bench.
                </p>
              </div>
              
              {recentMatches && recentMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentMatches.map((match) => (
                    <div key={match.id} className="bg-white/80 rounded-2xl p-6 shadow-lg border border-blue-200 relative overflow-hidden">
                      {/* Match Status Indicator */}
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                        FINISHED
                      </div>
                      
                      {/* Match Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-12 h-12 rounded-xl" />
                        <span className="font-bold text-lg">{match.homeTeam.name}</span>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{match.homeScore} - {match.awayScore}</div>
                          <div className="text-sm text-blue-600 font-medium">Final Score</div>
                        </div>
                        <span className="font-bold text-lg">{match.awayTeam.name}</span>
                        <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-12 h-12 rounded-xl" />
                      </div>
                      
                      {/* Match Details */}
                      <div className="text-gray-700 mb-3 text-center">{match.competition}</div>
                      <div className="text-gray-500 text-sm text-center mb-4">{match.venue}</div>
                      
                      {/* Loaned Players Information */}
                      {match.loanedPlayers && match.loanedPlayers.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Your Loaned Players:</h4>
                          <div className="space-y-2">
                            {match.loanedPlayers
                              .filter(loanedPlayer => 
                                loanedPlayers.some(player => 
                                  player.id === loanedPlayer.playerId && 
                                  player.loanedFrom && 
                                  preferences.favoriteTeams.some(favTeam => favTeam.name === player.loanedFrom)
                                )
                              )
                              .map((loanedPlayer) => (
                                <div key={loanedPlayer.playerId} className="flex items-center justify-between text-sm bg-blue-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-blue-600">{loanedPlayer.name}</span>
                                    <span className="text-gray-500">({loanedPlayer.position})</span>
                                  </div>
                                  <div className="text-gray-600 text-xs">
                                    {loanedPlayer.team}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8 text-center shadow-xl">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-3xl inline-block mb-6">
                    <Calendar className="w-20 h-20 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Recent Matches</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    There are currently no recent matches for the clubs where your favorite teams' players are on loan. 
                    Check back later or view upcoming matches below.
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Upcoming Matches Section */}
            {upcomingMatches.length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-3">
                    <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                    Upcoming Matches
                  </h2>
                  <p className="text-gray-600 text-lg max-w-3xl">
                    Mark your calendar for these upcoming matches featuring your loaned players. 
                    See which teams they'll be playing for and when the matches are scheduled.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                      {/* Match Header */}
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center space-x-2 text-gray-600 mb-3">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-medium">{formatMatchTime(match.date)}</span>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full inline-block font-medium">
                          {match.competition}
                        </div>
                      </div>
                      
                      {/* Teams */}
                      <div className="space-y-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <img src={match.homeTeam.crest} alt="" className="w-10 h-10 object-contain" />
                          <span className="text-lg font-semibold text-gray-900">{match.homeTeam.shortName}</span>
                        </div>
                        
                        <div className="text-center">
                          <span className="text-xl font-bold text-gray-400 bg-gray-100 px-6 py-3 rounded-full">VS</span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <img src={match.awayTeam.crest} alt="" className="w-10 h-10 object-contain" />
                          <span className="text-lg font-semibold text-gray-900">{match.awayTeam.shortName}</span>
                        </div>
                      </div>
                      
                      {/* Venue */}
                      {match.venue && (
                        <div className="text-center mb-4">
                          <div className="flex items-center justify-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{match.venue}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Loaned Players Information */}
                      {match.loanedPlayers && match.loanedPlayers.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Your Loaned Players:</h4>
                          <div className="space-y-2">
                            {match.loanedPlayers
                              .filter(loanedPlayer => 
                                loanedPlayers.some(player => 
                                  player.id === loanedPlayer.playerId && 
                                  player.loanedFrom && 
                                  preferences.favoriteTeams.some(favTeam => favTeam.name === player.loanedFrom)
                                )
                              )
                              .map((loanedPlayer) => (
                                <div key={loanedPlayer.playerId} className="flex items-center justify-between text-sm bg-blue-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-blue-600">{loanedPlayer.name}</span>
                                    <span className="text-gray-500">({loanedPlayer.position})</span>
                                  </div>
                                  <div className="text-gray-600 text-xs">
                                    {loanedPlayer.team}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
