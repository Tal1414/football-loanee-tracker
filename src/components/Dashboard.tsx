import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Users, Calendar, AlertCircle, Star, Clock, MapPin } from 'lucide-react';
import type { Team, Player, Match } from '../types/football';
import { SportMonksApiService } from '../services/sportmonksApi';
import { useUserPreferences } from '../hooks/useUserPreferences';
import TeamSearch from './TeamSearch';
import PlayerCard from './PlayerCard';

const Dashboard: React.FC = () => {
  const { preferences, addFavoriteTeam, removeFavoriteTeam } = useUserPreferences();
  const [loanedPlayers, setLoanedPlayers] = useState<Player[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load players from all favorite teams
      const allPlayers: Player[] = [];
      for (const team of preferences.favoriteTeams) {
        const players = await SportMonksApiService.getTeamPlayers(team.id);
        allPlayers.push(...players);
      }
      setLoanedPlayers(allPlayers);

      // Load live matches (not available in free plan)
      const live = await SportMonksApiService.getLiveMatches();
      setLiveMatches(live);

      // Load upcoming matches
      const upcoming = await SportMonksApiService.getUpcomingMatches();
      setUpcomingMatches(upcoming);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [preferences.favoriteTeams]);

  useEffect(() => {
    if (preferences.favoriteTeams.length > 0) {
      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [preferences.favoriteTeams, loadDashboardData]);

  const handleTeamSelect = (team: Team) => {
    addFavoriteTeam(team);
  };

  const handleTeamRemove = (teamId: number) => {
    removeFavoriteTeam(teamId);
  };

  const getMatchStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'LIVE': 'text-white bg-gradient-to-r from-red-500 to-red-600',
      'IN_PLAY': 'text-white bg-gradient-to-r from-red-500 to-red-600',
      'FINISHED': 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200',
      'SCHEDULED': 'text-white bg-gradient-to-r from-blue-500 to-blue-600',
      'POSTPONED': 'text-white bg-gradient-to-r from-yellow-500 to-yellow-600'
    };
    return colors[status] || 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200';
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
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">LoaneeTracker ⚽</h1>
                <p className="text-blue-100 text-lg">
                  Follow your favorite club's loaned players and never miss their performances
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Selection */}
        {preferences.favoriteTeams.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 mb-12">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-3xl inline-block mb-6">
                <Trophy className="w-20 h-20 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Choose your favorite football clubs to start tracking their loaned players and never miss a moment of their journey
              </p>
              <TeamSearch onTeamSelect={handleTeamSelect} selectedTeams={preferences.favoriteTeams} />
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-3" />
                Your Favorite Teams
              </h2>
              <TeamSearch onTeamSelect={handleTeamSelect} selectedTeams={preferences.favoriteTeams} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {preferences.favoriteTeams.map((team) => (
                <div
                  key={team.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={team.crest}
                      alt={`${team.name} crest`}
                      className="w-16 h-16 mx-auto mb-4 object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/64x64?text=' + team.tla;
                      }}
                    />
                    <button
                      onClick={() => handleTeamRemove(team.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {team.shortName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {preferences.favoriteTeams.length > 0 && (
          <>
            {/* Loaned Players */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                Loaned Players ({loanedPlayers.filter(p => p.isOnLoan).length})
              </h2>
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
                    Currently, there are no players on loan from your favorite teams.
                  </p>
                </div>
              )}
            </div>

            {/* Live Matches for Loaned Players' Clubs */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 text-green-600 mr-3" />
                Live Matches (Loaned Players' Clubs)
              </h2>
              {liveMatches && liveMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveMatches.map((match) => (
                    <div key={match.id} className="bg-white/80 rounded-2xl p-6 shadow-lg flex flex-col items-center">
                      <div className="flex items-center space-x-4 mb-4">
                        <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-10 h-10 rounded-full" />
                        <span className="font-bold text-lg">{match.homeTeam.name}</span>
                        <span className="text-xl font-bold">vs</span>
                        <span className="font-bold text-lg">{match.awayTeam.name}</span>
                        <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-10 h-10 rounded-full" />
                      </div>
                      <div className="text-gray-700 mb-2">{match.competition}</div>
                      <div className="text-gray-500 text-sm">{match.date ? new Date(match.date).toLocaleString() : ''}</div>
                      <div className="mt-2 text-green-600 font-bold">{match.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8 text-center shadow-xl">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-3xl inline-block mb-6">
                    <Calendar className="w-20 h-20 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Live Matches</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    There are currently no live matches for the clubs where your favorite teams' players are on loan.
                  </p>
                </div>
              )}
            </div>

            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 text-green-600 mr-3" />
                  Upcoming Matches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatMatchTime(match.date)}</span>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                          {match.competition}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Home Team */}
                        <div className="flex items-center space-x-3">
                          <img src={match.homeTeam.crest} alt="" className="w-8 h-8 object-contain" />
                          <span className="text-base font-semibold text-gray-900">{match.homeTeam.shortName}</span>
                        </div>
                        
                        {/* VS Separator */}
                        <div className="text-center">
                          <span className="text-lg font-bold text-gray-400 bg-gray-100 px-4 py-2 rounded-full">VS</span>
                        </div>
                        
                        {/* Away Team */}
                        <div className="flex items-center space-x-3">
                          <img src={match.awayTeam.crest} alt="" className="w-8 h-8 object-contain" />
                          <span className="text-base font-semibold text-gray-900">{match.awayTeam.shortName}</span>
                        </div>
                      </div>
                      
                      {match.venue && (
                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                          <div className="flex items-center justify-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{match.venue}</span>
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
