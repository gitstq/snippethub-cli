/**
 * SnippetHub - Storage Management
 *
 * Handles all data persistence operations for snippets
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Snippet, SnippetFilter, SnippetStats, SnippetExport, SearchResult } from './types';
import { ConfigManager } from './config';
import Fuse from 'fuse.js';

/**
 * Storage manager class
 */
export class StorageManager {
  private configManager: ConfigManager;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
  }

  /**
   * Load all snippets from storage
   */
  async loadSnippets(): Promise<Snippet[]> {
    try {
      const snippetsPath = this.configManager.getSnippetsPath();
      if (await fs.pathExists(snippetsPath)) {
        return await fs.readJson(snippetsPath);
      }
      return [];
    } catch (error) {
      console.error('Error loading snippets:', error);
      return [];
    }
  }

  /**
   * Save snippets to storage
   */
  async saveSnippets(snippets: Snippet[]): Promise<void> {
    const snippetsPath = this.configManager.getSnippetsPath();
    await fs.writeJson(snippetsPath, snippets, { spaces: 2 });
  }

  /**
   * Create a new snippet
   */
  async createSnippet(
    title: string,
    code: string,
    language: string,
    options: {
      description?: string;
      tags?: string[];
      source?: string;
    } = {}
  ): Promise<Snippet> {
    const snippets = await this.loadSnippets();

    const snippet: Snippet = {
      id: uuidv4(),
      title,
      code,
      language: language.toLowerCase(),
      description: options.description || '',
      tags: options.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      source: options.source,
      isFavorite: false
    };

    snippets.push(snippet);
    await this.saveSnippets(snippets);

    return snippet;
  }

  /**
   * Get a snippet by ID
   */
  async getSnippet(id: string): Promise<Snippet | null> {
    const snippets = await this.loadSnippets();
    return snippets.find(s => s.id === id) || null;
  }

  /**
   * Update a snippet
   */
  async updateSnippet(id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>): Promise<Snippet | null> {
    const snippets = await this.loadSnippets();
    const index = snippets.findIndex(s => s.id === id);

    if (index === -1) {
      return null;
    }

    snippets[index] = {
      ...snippets[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveSnippets(snippets);
    return snippets[index];
  }

  /**
   * Delete a snippet
   */
  async deleteSnippet(id: string): Promise<boolean> {
    const snippets = await this.loadSnippets();
    const index = snippets.findIndex(s => s.id === id);

    if (index === -1) {
      return false;
    }

    snippets.splice(index, 1);
    await this.saveSnippets(snippets);
    return true;
  }

  /**
   * Filter snippets
   */
  async filterSnippets(filter: SnippetFilter): Promise<Snippet[]> {
    let snippets = await this.loadSnippets();

    if (filter.language) {
      snippets = snippets.filter(s =>
        s.language.toLowerCase() === filter.language!.toLowerCase()
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      snippets = snippets.filter(s =>
        filter.tags!.some(tag => s.tags.includes(tag))
      );
    }

    if (filter.isFavorite !== undefined) {
      snippets = snippets.filter(s => s.isFavorite === filter.isFavorite);
    }

    // Sort by updatedAt (newest first)
    snippets.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return snippets;
  }

  /**
   * Search snippets using Fuse.js for fuzzy search
   */
  async searchSnippets(query: string): Promise<SearchResult[]> {
    const snippets = await this.loadSnippets();

    const fuseOptions = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'code', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true
    };

    const fuse = new Fuse(snippets, fuseOptions);
    const results = fuse.search(query);

    return results.map(result => ({
      snippet: result.item,
      score: result.score || 1,
      matches: result.matches?.map(m => m.key || '').filter(Boolean) || []
    }));
  }

  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    const snippets = await this.loadSnippets();
    const tagsSet = new Set<string>();

    snippets.forEach(s => {
      s.tags.forEach(tag => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  }

  /**
   * Get all unique languages
   */
  async getAllLanguages(): Promise<string[]> {
    const snippets = await this.loadSnippets();
    const languagesSet = new Set<string>();

    snippets.forEach(s => {
      languagesSet.add(s.language);
    });

    return Array.from(languagesSet).sort();
  }

  /**
   * Get snippet statistics
   */
  async getStats(): Promise<SnippetStats> {
    const snippets = await this.loadSnippets();

    const languageCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    let totalUsage = 0;

    snippets.forEach(s => {
      languageCounts[s.language] = (languageCounts[s.language] || 0) + 1;
      s.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      totalUsage += s.usageCount;
    });

    const topLanguage = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    return {
      totalSnippets: snippets.length,
      totalLanguages: Object.keys(languageCounts).length,
      totalTags: Object.keys(tagCounts).length,
      topLanguage,
      topTags,
      totalUsage
    };
  }

  /**
   * Increment usage count for a snippet
   */
  async incrementUsage(id: string): Promise<void> {
    const snippet = await this.getSnippet(id);
    if (snippet) {
      await this.updateSnippet(id, {
        usageCount: snippet.usageCount + 1
      });
    }
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<boolean> {
    const snippet = await this.getSnippet(id);
    if (!snippet) {
      return false;
    }

    await this.updateSnippet(id, { isFavorite: !snippet.isFavorite });
    return !snippet.isFavorite;
  }

  /**
   * Export snippets to file
   */
  async exportSnippets(exportPath: string, filter?: SnippetFilter): Promise<number> {
    let snippets = await this.loadSnippets();

    if (filter) {
      snippets = await this.filterSnippets(filter);
    }

    const exportData: SnippetExport = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      snippets
    };

    await fs.writeJson(exportPath, exportData, { spaces: 2 });
    return snippets.length;
  }

  /**
   * Import snippets from file
   */
  async importSnippets(importPath: string, options: { merge?: boolean } = {}): Promise<number> {
    const importData: SnippetExport = await fs.readJson(importPath);

    if (!importData.snippets || !Array.isArray(importData.snippets)) {
      throw new Error('Invalid import file format');
    }

    let existingSnippets: Snippet[] = [];
    if (options.merge) {
      existingSnippets = await this.loadSnippets();
    }

    // Generate new IDs to avoid conflicts
    const newSnippets = importData.snippets.map(s => ({
      ...s,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const allSnippets = [...existingSnippets, ...newSnippets];
    await this.saveSnippets(allSnippets);

    return newSnippets.length;
  }

  /**
   * Create a backup
   */
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `snippets-backup-${timestamp}.json`;
    const backupPath = path.join(this.configManager.getBackupDir(), backupFileName);

    await this.exportSnippets(backupPath);
    return backupPath;
  }

  /**
   * List all backups
   */
  async listBackups(): Promise<string[]> {
    const backupDir = this.configManager.getBackupDir();
    if (!(await fs.pathExists(backupDir))) {
      return [];
    }

    const files = await fs.readdir(backupDir);
    return files
      .filter(f => f.startsWith('snippets-backup-') && f.endsWith('.json'))
      .sort()
      .reverse();
  }

  /**
   * Restore from backup
   */
  async restoreBackup(backupFileName: string): Promise<number> {
    const backupPath = path.join(this.configManager.getBackupDir(), backupFileName);
    return await this.importSnippets(backupPath);
  }
}
