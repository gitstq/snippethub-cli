#!/usr/bin/env node

/**
 * SnippetHub CLI
 *
 * A powerful command-line tool for managing code snippets
 *
 * @author Lobster Dev Team
 * @version 1.0.0
 * @license MIT
 */

import { Command } from 'commander';
import { getConfigManager } from './config';
import { StorageManager } from './storage';
import { CommandHandler } from './commands';
import { printWelcome, printError } from './display';

const program = new Command();

// Initialize application
async function initialize() {
  const configManager = getConfigManager();
  await configManager.initialize();

  const storageManager = new StorageManager(configManager);
  return new CommandHandler(storageManager, configManager);
}

// CLI Configuration
program
  .name('snippethub')
  .alias('snip')
  .description('🚀 A powerful CLI tool for managing code snippets')
  .version('1.0.0', '-v, --version', 'Display version number')
  .helpOption('-h, --help', 'Display help information')
  .addHelpCommand('help [command]', 'Display help for command');

// Welcome message on startup
program.hook('preAction', async () => {
  if (process.argv.length <= 2) {
    printWelcome();
  }
});

// Initialize command
program
  .command('init')
  .description('Initialize SnippetHub configuration')
  .action(async () => {
    try {
      const handler = await initialize();
      await handler.init();
    } catch (error) {
      printError(`Initialization failed: ${error}`);
      process.exit(1);
    }
  });

// Add command
program
  .command('add')
  .alias('create')
  .description('Add a new code snippet')
  .option('-t, --title <title>', 'Snippet title')
  .option('-c, --code <code>', 'Code content')
  .option('-l, --language <language>', 'Programming language')
  .option('-i, --interactive', 'Use interactive mode', true)
  .action(async (options) => {
    try {
      const handler = await initialize();
      await handler.add(options);
    } catch (error) {
      printError(`Failed to add snippet: ${error}`);
      process.exit(1);
    }
  });

// List command
program
  .command('list')
  .alias('ls')
  .description('List all snippets')
  .option('-l, --language <language>', 'Filter by language')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-f, --favorite', 'Show only favorites')
  .option('-n, --limit <number>', 'Limit number of results', parseInt)
  .action(async (options) => {
    try {
      const handler = await initialize();
      await handler.list(options);
    } catch (error) {
      printError(`Failed to list snippets: ${error}`);
      process.exit(1);
    }
  });

// Show command
program
  .command('show <id>')
  .alias('view')
  .description('Show snippet details')
  .option('-c, --copy', 'Copy code to clipboard')
  .action(async (id, options) => {
    try {
      const handler = await initialize();
      await handler.show(id, options);
    } catch (error) {
      printError(`Failed to show snippet: ${error}`);
      process.exit(1);
    }
  });

// Search command
program
  .command('search [query]')
  .alias('find')
  .description('Search snippets by keyword')
  .option('-i, --interactive', 'Use interactive mode')
  .action(async (query, options) => {
    try {
      const handler = await initialize();
      await handler.search(query, options);
    } catch (error) {
      printError(`Failed to search snippets: ${error}`);
      process.exit(1);
    }
  });

// Edit command
program
  .command('edit <id>')
  .alias('update')
  .description('Edit an existing snippet')
  .action(async (id) => {
    try {
      const handler = await initialize();
      await handler.edit(id);
    } catch (error) {
      printError(`Failed to edit snippet: ${error}`);
      process.exit(1);
    }
  });

// Delete command
program
  .command('delete <id>')
  .alias('remove')
  .description('Delete a snippet')
  .option('-f, --force', 'Force deletion without confirmation')
  .action(async (id, options) => {
    try {
      const handler = await initialize();
      await handler.delete(id, options);
    } catch (error) {
      printError(`Failed to delete snippet: ${error}`);
      process.exit(1);
    }
  });

// Favorite command
program
  .command('favorite <id>')
  .alias('fav')
  .description('Toggle favorite status for a snippet')
  .action(async (id) => {
    try {
      const handler = await initialize();
      await handler.favorite(id);
    } catch (error) {
      printError(`Failed to toggle favorite: ${error}`);
      process.exit(1);
    }
  });

// Tags command
program
  .command('tags')
  .alias('tag')
  .description('List all available tags')
  .action(async () => {
    try {
      const handler = await initialize();
      await handler.tags();
    } catch (error) {
      printError(`Failed to list tags: ${error}`);
      process.exit(1);
    }
  });

// Languages command
program
  .command('languages')
  .alias('langs')
  .description('List all used programming languages')
  .action(async () => {
    try {
      const handler = await initialize();
      await handler.languages();
    } catch (error) {
      printError(`Failed to list languages: ${error}`);
      process.exit(1);
    }
  });

// Stats command
program
  .command('stats')
  .alias('statistics')
  .description('Show snippet statistics')
  .action(async () => {
    try {
      const handler = await initialize();
      await handler.stats();
    } catch (error) {
      printError(`Failed to get statistics: ${error}`);
      process.exit(1);
    }
  });

// Export command
program
  .command('export <path>')
  .description('Export snippets to JSON file')
  .option('-f, --filter <tag>', 'Filter by tag')
  .action(async (path, options) => {
    try {
      const handler = await initialize();
      await handler.export(path, options);
    } catch (error) {
      printError(`Failed to export snippets: ${error}`);
      process.exit(1);
    }
  });

// Import command
program
  .command('import <path>')
  .description('Import snippets from JSON file')
  .option('-m, --merge', 'Merge with existing snippets')
  .action(async (path, options) => {
    try {
      const handler = await initialize();
      await handler.import(path, options);
    } catch (error) {
      printError(`Failed to import snippets: ${error}`);
      process.exit(1);
    }
  });

// Backup command
program
  .command('backup')
  .description('Create a backup of all snippets')
  .action(async () => {
    try {
      const handler = await initialize();
      await handler.backup();
    } catch (error) {
      printError(`Failed to create backup: ${error}`);
      process.exit(1);
    }
  });

// List backups command
program
  .command('backups')
  .alias('list-backups')
  .description('List all available backups')
  .action(async () => {
    try {
      const handler = await initialize();
      await handler.listBackups();
    } catch (error) {
      printError(`Failed to list backups: ${error}`);
      process.exit(1);
    }
  });

// Restore command
program
  .command('restore <file>')
  .description('Restore snippets from backup')
  .action(async (file) => {
    try {
      const handler = await initialize();
      await handler.restore(file);
    } catch (error) {
      printError(`Failed to restore backup: ${error}`);
      process.exit(1);
    }
  });

// Copy command
program
  .command('copy <id>')
  .alias('cp')
  .description('Copy snippet code to clipboard')
  .action(async (id) => {
    try {
      const handler = await initialize();
      await handler.copy(id);
    } catch (error) {
      printError(`Failed to copy snippet: ${error}`);
      process.exit(1);
    }
  });

// Config command
program
  .command('config')
  .description('Show current configuration')
  .action(async () => {
    try {
      const handler = await initialize();
      await handler.showConfig();
    } catch (error) {
      printError(`Failed to show config: ${error}`);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
