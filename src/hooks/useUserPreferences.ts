import { useState, useEffect } from 'react';
import type { UserPreferences, Team } from '../types/football';

const STORAGE_KEY = 'football-loanee-tracker-preferences';

const defaultPreferences: UserPreferences = {
  favoriteTeams: [],
  notifications: {
    liveScores: true,
    matchResults: true,
    playerUpdates: true
  }
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = (newPreferences: UserPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const addFavoriteTeam = (team: Team) => {
    const isAlreadyFavorite = preferences.favoriteTeams.some(t => t.id === team.id);
    if (!isAlreadyFavorite) {
      const newPreferences = {
        ...preferences,
        favoriteTeams: [...preferences.favoriteTeams, team]
      };
      savePreferences(newPreferences);
    }
  };

  const removeFavoriteTeam = (teamId: number) => {
    const newPreferences = {
      ...preferences,
      favoriteTeams: preferences.favoriteTeams.filter(t => t.id !== teamId)
    };
    savePreferences(newPreferences);
  };

  const updateNotificationSettings = (settings: Partial<UserPreferences['notifications']>) => {
    const newPreferences = {
      ...preferences,
      notifications: { ...preferences.notifications, ...settings }
    };
    savePreferences(newPreferences);
  };

  return {
    preferences,
    isLoading,
    addFavoriteTeam,
    removeFavoriteTeam,
    updateNotificationSettings,
    savePreferences
  };
};
