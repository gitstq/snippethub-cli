/**
 * SnippetHub - Command Handlers
 *
 * Implements all CLI commands
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import ora from 'ora';
import { StorageManager } from './storage';
import { ConfigManager } from './config';
import {
  formatSnippet,
  formatSnippetsTable,
  formatSearchResults,
  formatStats,
  formatTagsList,
  formatLanguagesList,
  printWelcome,
  printHelp,
  printSuccess,
  printError,
  printWarning,
  printInfo
} from './display';
import { Snippet } from './types';

/**
 * Command handler class
 */
export class CommandHandler {
  private storage: StorageManager;
  private config: ConfigManager;

  constructor(storage: StorageManager, config: ConfigManager) {
    this.storage = storage;
    this.config = config;
  }

  /**
   * Initialize the application
   */
  async init(): Promise<void> {
    await this.config.initialize();
    printWelcome();
    printHelp();
  }

  /**
   * Add a new snippet
   */
  async add(options: { interactive?: boolean; title?: string; code?: string; language?: string } = {}): Promise<void> {
    try {
      let { title, code, language } = options;

      if (options.interactive || !title || !code) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Snippet title:',
            when: !title,
            validate: (input: string) => input.trim() !== '' || 'Title is required'
          },
          {
            type: 'editor',
            name: 'code',
            message: 'Code content:',
            when: !code,
            validate: (input: string) => input.trim() !== '' || 'Code is required'
          },
          {
            type: 'input',
            name: 'language',
            message: 'Programming language:',
            when: !language,
            default: 'javascript'
          },
          {
            type: 'input',
            name: 'description',
            message: 'Description (optional):'
          },
          {
            type: 'input',
            name: 'tags',
            message: 'Tags (comma-separated):',
            filter: (input: string) => input.split(',').map(t => t.trim()).filter(Boolean)
          }
        ]);

        title = title || answers.title;
        code = code || answers.code;
        language = language || answers.language;
        var { description, tags } = answers;
      }

      const spinner = ora('Creating snippet...').start();
      const snippet = await this.storage.createSnippet(title!, code!, language!, {
        description,
        tags
      });
      spinner.stop();

      printSuccess(`Snippet "${snippet.title}" created successfully!`);
      console.log(formatSnippet(snippet, { showCode: false }));
    } catch (error) {
      printError(`Failed to create snippet: ${error}`);
    }
  }

  /**
   * List all snippets
   */
  async list(options: { language?: string; tag?: string; favorite?: boolean; limit?: number } = {}): Promise<void> {
    try {
      const spinner = ora('Loading snippets...').start();
      const snippets = await this.storage.filterSnippets({
        language: options.language,
        tags: options.tag ? [options.tag] : undefined,
        isFavorite: options.favorite
      });
      spinner.stop();

      if (snippets.length === 0) {
        printWarning('No snippets found.');
        return;
      }

      const limit = options.limit || snippets.length;
      const displaySnippets = snippets.slice(0, limit);

      printInfo(`Showing ${displaySnippets.length} of ${snippets.length} snippet(s)`);
      console.log(formatSnippetsTable(displaySnippets));
    } catch (error) {
      printError(`Failed to list snippets: ${error}`);
    }
  }

  /**
   * Show snippet details
   */
  async show(id: string, options: { copy?: boolean } = {}): Promise<void> {
    try {
      const snippet = await this.storage.getSnippet(id);

      if (!snippet) {
        // Try partial match
        const allSnippets = await this.storage.loadSnippets();
        const matches = allSnippets.filter(s =>
          s.id.toLowerCase().includes(id.toLowerCase()) ||
          s.title.toLowerCase().includes(id.toLowerCase())
        );

        if (matches.length === 0) {
          printError(`Snippet not found: ${id}`);
          return;
        }

        if (matches.length === 1) {
          console.log(formatSnippet(matches[0]));
          await this.storage.incrementUsage(matches[0].id);

          if (options.copy) {
            await clipboardy.write(matches[0].code);
            printSuccess('Code copied to clipboard!');
          }
          return;
        }

        printInfo(`Multiple matches found for "${id}":`);
        console.log(formatSnippetsTable(matches));
        return;
      }

      console.log(formatSnippet(snippet));
      await this.storage.incrementUsage(snippet.id);

      if (options.copy) {
        await clipboardy.write(snippet.code);
        printSuccess('Code copied to clipboard!');
      }
    } catch (error) {
      printError(`Failed to show snippet: ${error}`);
    }
  }

  /**
   * Search snippets
   */
  async search(query: string, options: { interactive?: boolean } = {}): Promise<void> {
    try {
      let searchQuery = query;

      if (options.interactive || !query) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'query',
            message: 'Search query:',
            validate: (input: string) => input.trim() !== '' || 'Query is required'
          }
        ]);
        searchQuery = answers.query;
      }

      const spinner = ora('Searching...').start();
      const results = await this.storage.searchSnippets(searchQuery);
      spinner.stop();

      console.log(formatSearchResults(results));

      if (results.length > 0) {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: 'View snippet details', value: 'view' },
              { name: 'Copy to clipboard', value: 'copy' },
              { name: 'Nothing', value: 'nothing' }
            ]
          }
        ]);

        if (action === 'view' || action === 'copy') {
          const { index } = await inquirer.prompt([
            {
              type: 'number',
              name: 'index',
              message: 'Enter snippet number:',
              validate: (input: number) =>
                input > 0 && input <= results.length || 'Invalid number'
            }
          ]);

          const snippet = results[index - 1].snippet;

          if (action === 'view') {
            console.log(formatSnippet(snippet));
          } else {
            await clipboardy.write(snippet.code);
            printSuccess('Code copied to clipboard!');
          }

          await this.storage.incrementUsage(snippet.id);
        }
      }
    } catch (error) {
      printError(`Failed to search snippets: ${error}`);
    }
  }

  /**
   * Edit a snippet
   */
  async edit(id: string): Promise<void> {
    try {
      const snippet = await this.storage.getSnippet(id);

      if (!snippet) {
        printError(`Snippet not found: ${id}`);
        return;
      }

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Title:',
          default: snippet.title
        },
        {
          type: 'editor',
          name: 'code',
          message: 'Code:',
          default: snippet.code
        },
        {
          type: 'input',
          name: 'language',
          message: 'Language:',
          default: snippet.language
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description:',
          default: snippet.description
        },
        {
          type: 'input',
          name: 'tags',
          message: 'Tags (comma-separated):',
          default: snippet.tags.join(', '),
          filter: (input: string) => input.split(',').map(t => t.trim()).filter(Boolean)
        }
      ]);

      const spinner = ora('Updating snippet...').start();
      const updated = await this.storage.updateSnippet(id, answers);
      spinner.stop();

      if (updated) {
        printSuccess('Snippet updated successfully!');
        console.log(formatSnippet(updated, { showCode: false }));
      }
    } catch (error) {
      printError(`Failed to edit snippet: ${error}`);
    }
  }

  /**
   * Delete a snippet
   */
  async delete(id: string, options: { force?: boolean } = {}): Promise<void> {
    try {
      const snippet = await this.storage.getSnippet(id);

      if (!snippet) {
        printError(`Snippet not found: ${id}`);
        return;
      }

      let confirmed = options.force;

      if (!confirmed) {
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to delete "${snippet.title}"?`,
            default: false
          }
        ]);
        confirmed = answers.confirm;
      }

      if (confirmed) {
        const spinner = ora('Deleting snippet...').start();
        const deleted = await this.storage.deleteSnippet(id);
        spinner.stop();

        if (deleted) {
          printSuccess('Snippet deleted successfully!');
        }
      } else {
        printInfo('Deletion cancelled.');
      }
    } catch (error) {
      printError(`Failed to delete snippet: ${error}`);
    }
  }

  /**
   * Toggle favorite status
   */
  async favorite(id: string): Promise<void> {
    try {
      const isFavorite = await this.storage.toggleFavorite(id);

      if (isFavorite === undefined) {
        printError(`Snippet not found: ${id}`);
        return;
      }

      printSuccess(isFavorite ? 'Added to favorites!' : 'Removed from favorites!');
    } catch (error) {
      printError(`Failed to toggle favorite: ${error}`);
    }
  }

  /**
   * List all tags
   */
  async tags(): Promise<void> {
    try {
      const tags = await this.storage.getAllTags();
      console.log(formatTagsList(tags));
    } catch (error) {
      printError(`Failed to list tags: ${error}`);
    }
  }

  /**
   * List all languages
   */
  async languages(): Promise<void> {
    try {
      const languages = await this.storage.getAllLanguages();
      console.log(formatLanguagesList(languages));
    } catch (error) {
      printError(`Failed to list languages: ${error}`);
    }
  }

  /**
   * Show statistics
   */
  async stats(): Promise<void> {
    try {
      const spinner = ora('Calculating statistics...').start();
      const stats = await this.storage.getStats();
      spinner.stop();

      console.log(formatStats(stats));
    } catch (error) {
      printError(`Failed to get statistics: ${error}`);
    }
  }

  /**
   * Export snippets
   */
  async export(outputPath: string, options: { filter?: string } = {}): Promise<void> {
    try {
      const spinner = ora('Exporting snippets...').start();
      const count = await this.storage.exportSnippets(outputPath, {
        tags: options.filter ? [options.filter] : undefined
      });
      spinner.stop();

      printSuccess(`Exported ${count} snippet(s) to ${outputPath}`);
    } catch (error) {
      printError(`Failed to export snippets: ${error}`);
    }
  }

  /**
   * Import snippets
   */
  async import(inputPath: string, options: { merge?: boolean } = {}): Promise<void> {
    try {
      if (!(await fs.pathExists(inputPath))) {
        printError(`File not found: ${inputPath}`);
        return;
      }

      const spinner = ora('Importing snippets...').start();
      const count = await this.storage.importSnippets(inputPath, { merge: options.merge });
      spinner.stop();

      printSuccess(`Imported ${count} snippet(s)`);
    } catch (error) {
      printError(`Failed to import snippets: ${error}`);
    }
  }

  /**
   * Create backup
   */
  async backup(): Promise<void> {
    try {
      const spinner = ora('Creating backup...').start();
      const backupPath = await this.storage.createBackup();
      spinner.stop();

      printSuccess(`Backup created: ${backupPath}`);
    } catch (error) {
      printError(`Failed to create backup: ${error}`);
    }
  }

  /**
   * List backups
   */
  async listBackups(): Promise<void> {
    try {
      const backups = await this.storage.listBackups();

      if (backups.length === 0) {
        printWarning('No backups found.');
        return;
      }

      printInfo(`Found ${backups.length} backup(s):`);
      backups.forEach((backup, index) => {
        console.log(`  ${index + 1}. ${backup}`);
      });
    } catch (error) {
      printError(`Failed to list backups: ${error}`);
    }
  }

  /**
   * Restore from backup
   */
  async restore(backupFile: string): Promise<void> {
    try {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'This will replace all current snippets. Continue?',
          default: false
        }
      ]);

      if (!confirm) {
        printInfo('Restore cancelled.');
        return;
      }

      const spinner = ora('Restoring from backup...').start();
      const count = await this.storage.restoreBackup(backupFile);
      spinner.stop();

      printSuccess(`Restored ${count} snippet(s)`);
    } catch (error) {
      printError(`Failed to restore backup: ${error}`);
    }
  }

  /**
   * Show configuration
   */
  async showConfig(): Promise<void> {
    try {
      const config = this.config.getConfig();
      printInfo('Current configuration:');
      console.log(JSON.stringify(config, null, 2));
    } catch (error) {
      printError(`Failed to show config: ${error}`);
    }
  }

  /**
   * Copy snippet code to clipboard
   */
  async copy(id: string): Promise<void> {
    try {
      const snippet = await this.storage.getSnippet(id);

      if (!snippet) {
        printError(`Snippet not found: ${id}`);
        return;
      }

      await clipboardy.write(snippet.code);
      await this.storage.incrementUsage(snippet.id);

      printSuccess(`Code from "${snippet.title}" copied to clipboard!`);
    } catch (error) {
      printError(`Failed to copy snippet: ${error}`);
    }
  }
}
