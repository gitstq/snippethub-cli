/**
 * SnippetHub - Configuration Management
 * 
 * Handles all configuration and data directory operations
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { Config } from './types';

const CONFIG_FILE = 'config.json';
const SNIPPETS_FILE = 'snippets.json';
const BACKUP_DIR = 'backups';

/**
 * Get the default data directory
 */
export function getDefaultDataDir(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, '.snippethub');
}

/**
 * Configuration manager class
 */
export class ConfigManager {
  private dataDir: string;
  private configPath: string;
  private snippetsPath: string;
  private backupDir: string;
  private config: Config;

  constructor(dataDir?: string) {
    this.dataDir = dataDir || getDefaultDataDir();
    this.configPath = path.join(this.dataDir, CONFIG_FILE);
    this.snippetsPath = path.join(this.dataDir, SNIPPETS_FILE);
    this.backupDir = path.join(this.dataDir, BACKUP_DIR);
    
    this.config = this.loadConfig();
  }

  /**
   * Initialize the data directory
   */
  async initialize(): Promise<void> {
    await fs.ensureDir(this.dataDir);
    await fs.ensureDir(this.backupDir);
    
    // Create config if not exists
    if (!await fs.pathExists(this.configPath)) {
      await this.saveConfig(this.getDefaultConfig());
    }
    
    // Create snippets file if not exists
    if (!await fs.pathExists(this.snippetsPath)) {
      await fs.writeJson(this.snippetsPath, [], { spaces: 2 });
    }
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): Config {
    return {
      dataDir: this.dataDir,
      syntaxHighlight: true,
      theme: 'auto',
      pageSize: 10,
      autoBackup: true,
      backupInterval: 7
    };
  }

  /**
   * Load configuration from file
   */
  private loadConfig(): Config {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readJsonSync(this.configPath);
        return { ...this.getDefaultConfig(), ...data };
      }
    } catch (error) {
      console.warn('Failed to load config, using defaults');
    }
    return this.getDefaultConfig();
  }

  /**
   * Save configuration to file
   */
  async saveConfig(config: Config): Promise<void> {
    this.config = config;
    await fs.writeJson(this.configPath, config, { spaces: 2 });
  }

  /**
   * Get current configuration
   */
  getConfig(): Config {
    return this.config;
  }

  /**
   * Update configuration
   */
  async updateConfig(updates: Partial<Config>): Promise<void> {
    this.config = { ...this.config, ...updates };
    await this.saveConfig(this.config);
  }

  /**
   * Get snippets file path
   */
  getSnippetsPath(): string {
    return this.snippetsPath;
  }

  /**
   * Get backup directory path
   */
  getBackupDir(): string {
    return this.backupDir;
  }

  /**
   * Get data directory path
   */
  getDataDir(): string {
    return this.dataDir;
  }

  /**
   * Reset configuration to defaults
   */
  async resetConfig(): Promise<void> {
    await this.saveConfig(this.getDefaultConfig());
  }
}

// Export singleton instance
let configManager: ConfigManager | null = null;

export function getConfigManager(dataDir?: string): ConfigManager {
  if (!configManager) {
    configManager = new ConfigManager(dataDir);
  }
  return configManager;
}

export function resetConfigManager(): void {
  configManager = null;
}
