import React, { useState, useEffect, useCallback } from 'react';
import { Flag, TrendingUp, Eye, Calendar, Star } from 'lucide-react';
import type { Player, PlayerStats } from '../types/football';
import { SportMonksApiService } from '../services/sportmonksApi';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const loadPlayerStats = async () => {
      setIsLoading(true);
      try {
        const playerStats = await SportMonksApiService.getPlayerStats(player.id);
        let relevantStats = playerStats;
        if (player.isOnLoan && player.loanedTo) {
          relevantStats = playerStats.filter(
            (stat) => stat.team && stat.team.toLowerCase() === player.loanedTo!.toLowerCase()
          );
        }
        if (relevantStats.length > 0) {
          setStats(relevantStats[0]);
        } else {
          setStats(undefined);
        }
      } catch (error) {
        setStats(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlayerStats();
  }, [player.id, player.isOnLoan, player.loanedTo]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      'Forward': 'bg-gradient-to-r from-red-500 to-red-600 text-white',
      'Midfielder': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      'Defender': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      'Goalkeeper': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
    };
    return colors[position] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  const getPositionIcon = (position: string) => {
    const icons: { [key: string]: string } = {
      'Forward': '⚽',
      'Midfielder': '🔄',
      'Defender': '🛡️',
      'Goalkeeper': '🧤'
    };
    return icons[position] || '👤';
  };

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300">
      {/* Player Header with Gradient Background */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 relative">
            <div className="relative">
              <img
                src={player.photo || `https://via.placeholder.com/100x100?text=${player.name.charAt(0)}`}
                alt={`${player.name} photo`}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/50 shadow-lg group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/100x100?text=${player.name.charAt(0)}`;
                }}
              />
              {/* Position Badge */}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <span className="text-lg">{getPositionIcon(player.position)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate mb-2">{player.name}</h3>
            
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getPositionColor(player.position)}`}>
                {player.position}
              </span>
              {player.shirtNumber && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                  #{player.shirtNumber}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Flag className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{player.nationality}</span>
            </div>
          </div>
        </div>

        {/* Loan Information with Enhanced Design */}
        {player.isOnLoan && (
          <div className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <p className="text-sm font-bold">Currently on loan</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-blue-100">
                    <span className="text-xs font-medium">From:</span>
                    <span className="text-sm font-semibold">{player.loanedFrom || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <span className="text-xs font-medium">To:</span>
                    <span className="text-sm font-semibold">{player.loanedTo || 'Unknown'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 p-2 rounded-xl">
                  <p className="text-xs text-blue-100">Loan ends</p>
                  <p className="text-sm font-bold">{player.loanEndDate ? formatDate(player.loanEndDate) : 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player Stats Section */}
      <div className="p-6">
        {showStats && stats ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Season Statistics</h4>
              <button
                onClick={() => setShowStats(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Hide Stats
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-100">
                <div className="text-2xl font-bold text-green-600">{stats.appearances}</div>
                <div className="text-xs text-green-700 font-medium">Appearances</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{stats.goals}</div>
                <div className="text-xs text-blue-700 font-medium">Goals</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">{stats.assists}</div>
                <div className="text-xs text-purple-700 font-medium">Assists</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-600">{stats.minutesPlayed}</div>
                <div className="text-xs text-yellow-700 font-medium">Minutes</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Competition:</span>
                <span className="font-semibold text-gray-900">{stats.competition}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Team:</span>
                <span className="font-semibold text-gray-900">{stats.team}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setShowStats(true)}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>View Statistics</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer with Additional Info */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span>Updated: {player.lastUpdated ? formatDate(player.lastUpdated) : 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
