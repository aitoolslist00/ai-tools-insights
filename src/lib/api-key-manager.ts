import { getSetting } from './db';

interface KeyStatus {
  key: string;
  lastUsed: number;
  failCount: number;
  lastError?: string;
  lastFailTime?: number;
}

class APIKeyManager {
  private geminiKeys: KeyStatus[] = [];
  private newsKeys: KeyStatus[] = [];
  private geminiCurrentIndex = 0;
  private newsCurrentIndex = 0;
  private lastReload = 0;
  private reloadInterval = 60000;

  private async loadKeys() {
    const now = Date.now();
    if (now - this.lastReload < this.reloadInterval && this.geminiKeys.length > 0) {
      return;
    }

    try {
      const geminiKeysJson = await getSetting('GEMINI_API_KEYS') || '[]';
      const newsKeysJson = await getSetting('NEWSAPI_KEYS') || '[]';

      const geminiKeysArray = JSON.parse(geminiKeysJson);
      const newsKeysArray = JSON.parse(newsKeysJson);

      this.geminiKeys = geminiKeysArray
        .filter((key: string) => key && key.trim().length > 10)
        .map((key: string) => ({
          key: key.trim(),
          lastUsed: 0,
          failCount: 0
        }));

      this.newsKeys = newsKeysArray.map((key: string) => ({
        key,
        lastUsed: 0,
        failCount: 0
      }));

      this.lastReload = now;
      
      console.log(`🔑 Loaded ${this.geminiKeys.length} Gemini keys and ${this.newsKeys.length} NewsAPI keys`);
      
      if (this.geminiKeys.length > 0) {
        console.log(`🔑 Gemini keys loaded:`, this.geminiKeys.map((k, i) => 
          `#${i+1}: ${k.key.substring(0, 15)}... (${k.key.length} chars)`
        ).join(', '));
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
      this.geminiKeys = [];
      this.newsKeys = [];
    }
  }

  async getNextGeminiKey(): Promise<string | null> {
    await this.loadKeys();

    if (this.geminiKeys.length === 0) {
      const oldKey = await getSetting('GEMINI_API_KEY');
      if (oldKey) {
        console.log('⚠️ Using legacy single Gemini API key');
        return oldKey;
      }
      return null;
    }

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    this.geminiKeys.forEach(k => {
      if (k.failCount > 0 && k.lastFailTime && (now - k.lastFailTime) > fiveMinutes) {
        console.log(`🔄 Resetting fail count for key (5 min cooldown expired)`);
        k.failCount = 0;
        k.lastError = undefined;
      }
    });

    const availableKeys = this.geminiKeys.filter(k => k.failCount < 5);
    
    if (availableKeys.length === 0) {
      console.warn('⚠️ All Gemini keys have failed, resetting all fail counts');
      this.geminiKeys.forEach(k => {
        k.failCount = 0;
        k.lastError = undefined;
      });
      return this.geminiKeys[0]?.key || null;
    }

    this.geminiCurrentIndex = (this.geminiCurrentIndex + 1) % this.geminiKeys.length;
    let attempts = 0;
    
    while (this.geminiKeys[this.geminiCurrentIndex].failCount >= 5 && attempts < this.geminiKeys.length) {
      this.geminiCurrentIndex = (this.geminiCurrentIndex + 1) % this.geminiKeys.length;
      attempts++;
    }

    const selectedKey = this.geminiKeys[this.geminiCurrentIndex];
    selectedKey.lastUsed = Date.now();
    
    console.log(`🔑 Using Gemini key #${this.geminiCurrentIndex + 1} (fail count: ${selectedKey.failCount})`);
    return selectedKey.key;
  }

  async getNextNewsKey(): Promise<string | null> {
    await this.loadKeys();

    if (this.newsKeys.length === 0) {
      const oldKey = await getSetting('NEWSAPI_KEY');
      if (oldKey) {
        console.log('⚠️ Using legacy single NewsAPI key');
        return oldKey;
      }
      return null;
    }

    const availableKeys = this.newsKeys.filter(k => k.failCount < 3);
    
    if (availableKeys.length === 0) {
      console.warn('⚠️ All NewsAPI keys have failed, resetting fail counts');
      this.newsKeys.forEach(k => k.failCount = 0);
      return this.newsKeys[0]?.key || null;
    }

    this.newsCurrentIndex = (this.newsCurrentIndex + 1) % this.newsKeys.length;
    let attempts = 0;
    
    while (this.newsKeys[this.newsCurrentIndex].failCount >= 3 && attempts < this.newsKeys.length) {
      this.newsCurrentIndex = (this.newsCurrentIndex + 1) % this.newsKeys.length;
      attempts++;
    }

    const selectedKey = this.newsKeys[this.newsCurrentIndex];
    selectedKey.lastUsed = Date.now();
    
    console.log(`📰 Using NewsAPI key #${this.newsCurrentIndex + 1} (fail count: ${selectedKey.failCount})`);
    return selectedKey.key;
  }

  markGeminiKeyFailed(key: string, error?: string) {
    const keyStatus = this.geminiKeys.find(k => k.key === key);
    if (keyStatus) {
      keyStatus.failCount++;
      keyStatus.lastError = error;
      keyStatus.lastFailTime = Date.now();
      console.warn(`❌ Gemini key failed (count: ${keyStatus.failCount}/5): ${error}`);
    }
  }

  markNewsKeyFailed(key: string, error?: string) {
    const keyStatus = this.newsKeys.find(k => k.key === key);
    if (keyStatus) {
      keyStatus.failCount++;
      keyStatus.lastError = error;
      console.warn(`❌ NewsAPI key failed (count: ${keyStatus.failCount}): ${error}`);
    }
  }

  markGeminiKeySuccess(key: string) {
    const keyStatus = this.geminiKeys.find(k => k.key === key);
    if (keyStatus) {
      if (keyStatus.failCount > 0) {
        console.log(`✅ Gemini key succeeded, resetting fail count from ${keyStatus.failCount} to 0`);
      }
      keyStatus.failCount = 0;
    }
  }

  markNewsKeySuccess(key: string) {
    const keyStatus = this.newsKeys.find(k => k.key === key);
    if (keyStatus && keyStatus.failCount > 0) {
      keyStatus.failCount = Math.max(0, keyStatus.failCount - 1);
      console.log(`✅ NewsAPI key succeeded, reducing fail count to ${keyStatus.failCount}`);
    }
  }

  async getAllGeminiKeys(): Promise<string[]> {
    await this.loadKeys();
    return this.geminiKeys.map(k => k.key);
  }

  async getAllNewsKeys(): Promise<string[]> {
    await this.loadKeys();
    return this.newsKeys.map(k => k.key);
  }

  async getKeyStats() {
    await this.loadKeys();
    return {
      gemini: {
        total: this.geminiKeys.length,
        healthy: this.geminiKeys.filter(k => k.failCount < 5).length,
        failed: this.geminiKeys.filter(k => k.failCount >= 5).length
      },
      news: {
        total: this.newsKeys.length,
        healthy: this.newsKeys.filter(k => k.failCount < 3).length,
        failed: this.newsKeys.filter(k => k.failCount >= 3).length
      }
    };
  }

  async resetAllGeminiKeys() {
    await this.loadKeys();
    console.log('🔄 Resetting all Gemini API keys...');
    this.geminiKeys.forEach(k => {
      k.failCount = 0;
      k.lastError = undefined;
      k.lastFailTime = undefined;
    });
    console.log('✅ All Gemini keys reset');
  }

  async resetAllNewsKeys() {
    await this.loadKeys();
    console.log('🔄 Resetting all NewsAPI keys...');
    this.newsKeys.forEach(k => {
      k.failCount = 0;
      k.lastError = undefined;
      k.lastFailTime = undefined;
    });
    console.log('✅ All NewsAPI keys reset');
  }
}

export const apiKeyManager = new APIKeyManager();
