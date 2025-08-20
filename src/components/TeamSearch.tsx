import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Trophy } from 'lucide-react';
import type { Team } from '../types/football';
import { SportMonksApiService } from '../services/sportmonksApi';

interface TeamSearchProps {
  onTeamSelect: (team: Team) => void;
  selectedTeams: Team[];
}

const TeamSearch: React.FC<TeamSearchProps> = ({ onTeamSelect, selectedTeams }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchTeams = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const teams = await SportMonksApiService.searchTeams(query);
        setResults(teams.filter(team => 
          !selectedTeams.some(selected => selected.id === team.id)
        ));
        setShowResults(true);
      } catch (error) {
        console.error('Failed to search teams:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchTeams, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, selectedTeams]);

  const handleTeamSelect = (team: Team) => {
    onTeamSelect(team);
    setQuery('');
    setShowResults(false);
  };

  const isAlreadySelected = (teamId: number) => {
    return selectedTeams.some(team => team.id === teamId);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search for your favorite team..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none shadow-lg hover:shadow-xl transition-all duration-200 text-gray-900 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute z-20 w-full mt-3 bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                <span className="text-gray-600 font-medium">Searching teams...</span>
              </div>
            </div>
          ) : (
            <div className="py-3">
              {results.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  disabled={isAlreadySelected(team.id)}
                  className={`w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group ${
                    isAlreadySelected(team.id) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={team.crest}
                        alt={`${team.name} crest`}
                        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/48x48?text=${team.tla}`;
                        }}
                      />
                      {team.founded > 0 && (
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {team.founded}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                          {team.name}
                        </h3>
                        {team.league && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            {team.league}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span>{team.country}</span>
                        </div>
                        {team.tla && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-mono font-bold">
                            {team.tla}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full group-hover:scale-110 transition-transform duration-200">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamSearch;
