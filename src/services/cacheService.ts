interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  teamLogos: number;      // 1 year in milliseconds
  playerPhotos: number;   // 1 year in milliseconds
  leagueData: number;     // 1 week in milliseconds
  loanData: number;       // Transfer window dependent
  matchData: number;      // Match completion dependent
}

export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, CacheItem<any>>();
  
  // Cache TTL configuration (in milliseconds)
  private readonly config: CacheConfig = {
    teamLogos: 365 * 24 * 60 * 60 * 1000,        // 1 year
    playerPhotos: 365 * 24 * 60 * 60 * 1000,     // 1 year
    leagueData: 7 * 24 * 60 * 60 * 1000,         // 1 week
    loanData: 24 * 60 * 60 * 1000,               // 1 day (will be updated for transfer windows)
    matchData: 60 * 60 * 1000                     // 1 hour (will be updated when matches finish)
  };

  private constructor() {
    // Initialize cache cleanup
    this.startCleanupInterval();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Set cache item with appropriate TTL based on data type
   */
  public set<T>(key: string, data: T, type: keyof CacheConfig): void {
    const ttl = this.config[type];
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Get cache item if it exists and is not expired
   */
  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Check if cache item exists and is valid
   */
  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove specific item from cache
   */
  public delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Update loan data TTL based on transfer window status
   * Transfer windows: Summer (July-September), Winter (January)
   */
  public updateLoanDataTTL(): void {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    
    // Check if we're in a transfer window
    const isTransferWindow = (month >= 7 && month <= 9) || month === 1;
    
    if (isTransferWindow) {
      // During transfer window, update loan data more frequently
      this.config.loanData = 6 * 60 * 60 * 1000; // 6 hours
    } else {
      // Outside transfer window, update less frequently
      this.config.loanData = 7 * 24 * 60 * 60 * 1000; // 1 week
    }
  }

  /**
   * Update match data TTL based on match status
   */
  public updateMatchDataTTL(_matchId: string, status: string): void {
    if (status === 'FINISHED') {
      // Finished matches can be cached longer
      this.config.matchData = 24 * 60 * 60 * 1000; // 1 day
    } else if (status === 'SCHEDULED') {
      // Scheduled matches can be cached longer
      this.config.matchData = 12 * 60 * 60 * 1000; // 12 hours
    } else {
      // Live matches need frequent updates
      this.config.matchData = 5 * 60 * 1000; // 5 minutes
    }
  }

  /**
   * Force refresh specific data type
   */
  public forceRefresh(type: keyof CacheConfig): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_item, key) => {
      if (key.startsWith(type)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Start automatic cache cleanup
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];
      
      this.cache.forEach((item, key) => {
        if (now - item.timestamp > item.ttl) {
          keysToDelete.push(key);
        }
      });
      
      keysToDelete.forEach(key => this.cache.delete(key));
      
      if (keysToDelete.length > 0) {
        console.log(`Cache cleanup: removed ${keysToDelete.length} expired items`);
      }
    }, 60 * 1000); // Run every minute
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();
