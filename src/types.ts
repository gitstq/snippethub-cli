/**
 * SnippetHub - Type Definitions
 * 
 * Core type definitions for the snippet management system
 */

/**
 * Represents a single code snippet
 */
export interface Snippet {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Snippet title */
  title: string;
  
  /** Code content */
  code: string;
  
  /** Programming language for syntax highlighting */
  language: string;
  
  /** Description or notes */
  description?: string;
  
  /** Tags for categorization */
  tags: string[];
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Usage count */
  usageCount: number;
  
  /** Source URL (if imported from web) */
  source?: string;
  
  /** Is favorite */
  isFavorite: boolean;
}

/**
 * Snippet filter options
 */
export interface SnippetFilter {
  /** Filter by language */
  language?: string;
  
  /** Filter by tags */
  tags?: string[];
  
  /** Filter by favorite status */
  isFavorite?: boolean;
  
  /** Search query */
  query?: string;
}

/**
 * Snippet statistics
 */
export interface SnippetStats {
  /** Total number of snippets */
  totalSnippets: number;
  
  /** Number of languages used */
  totalLanguages: number;
  
  /** Number of unique tags */
  totalTags: number;
  
  /** Most used language */
  topLanguage: string;
  
  /** Most used tags */
  topTags: string[];
  
  /** Total usage count across all snippets */
  totalUsage: number;
}

/**
 * Configuration options
 */
export interface Config {
  /** Data directory path */
  dataDir: string;
  
  /** Default editor */
  editor?: string;
  
  /** Enable syntax highlighting */
  syntaxHighlight: boolean;
  
  /** Theme for display */
  theme: 'light' | 'dark' | 'auto';
  
  /** Items per page in list view */
  pageSize: number;
  
  /** Enable auto backup */
  autoBackup: boolean;
  
  /** Backup interval in days */
  backupInterval: number;
}

/**
 * Import/Export format
 */
export interface SnippetExport {
  /** Export format version */
  version: string;
  
  /** Export timestamp */
  exportedAt: string;
  
  /** Snippet data */
  snippets: Snippet[];
}

/**
 * Language definition
 */
export interface Language {
  /** Language identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** File extensions */
  extensions: string[];
  
  /** Highlight.js language key */
  highlightKey: string;
}

/**
 * Search result with score
 */
export interface SearchResult {
  /** Matched snippet */
  snippet: Snippet;
  
  /** Match score (0-1) */
  score: number;
  
  /** Matched fields */
  matches: string[];
}
