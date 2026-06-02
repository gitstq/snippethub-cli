/**
 * SnippetHub - Display Utilities
 *
 * Handles all UI rendering and formatting
 */

import chalk from 'chalk';
import boxen from 'boxen';
import { table } from 'table';
import hljs from 'highlight.js';
import { Snippet, SnippetStats, SearchResult } from './types';

/**
 * Language colors for syntax highlighting
 */
const LANGUAGE_COLORS: Record<string, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#007396',
  go: '#00add8',
  rust: '#dea584',
  cpp: '#f34b7d',
  c: '#555555',
  csharp: '#239120',
  php: '#4f5d95',
  ruby: '#701516',
  swift: '#ffac45',
  kotlin: '#a97bff',
  html: '#e34c26',
  css: '#563d7c',
  sql: '#e38c00',
  bash: '#89e051',
  json: '#292929',
  yaml: '#cb171e',
  markdown: '#083fa1',
  dockerfile: '#384d54',
  vue: '#4fc08d',
  react: '#61dafb',
  angular: '#dd0031',
  shell: '#89e051',
  powershell: '#012456',
  perl: '#0298c3',
  lua: '#000080',
  r: '#198ce7',
  scala: '#c22d40',
  dart: '#00b4ab',
  flutter: '#02569b',
  elixir: '#6e4a7e',
  haskell: '#5e5086',
  clojure: '#db5855',
  groovy: '#4298b8',
  julia: '#a270ba',
  matlab: '#e16737',
  objectivec: '#438eff',
  pascal: '#e3f171',
  vim: '#199f4b',
  xml: '#0060ac',
  graphql: '#e10098',
  regex: '#0097a7'
};

/**
 * Get color for a language
 */
export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language.toLowerCase()] || '#808080';
}

/**
 * Format a snippet for display
 */
export function formatSnippet(snippet: Snippet, options: { showCode?: boolean; compact?: boolean } = {}): string {
  const { showCode = true, compact = false } = options;

  const langColor = getLanguageColor(snippet.language);
  const langBadge = chalk.bgHex(langColor).black(` ${snippet.language.toUpperCase()} `);
  const favIcon = snippet.isFavorite ? chalk.red('★') : chalk.gray('☆');

  if (compact) {
    return `${favIcon} ${chalk.cyan(snippet.title)} ${langBadge} ${chalk.gray(`[${snippet.tags.join(', ')}]`)}`;
  }

  let output = '\n';
  output += boxen(
    `${favIcon} ${chalk.bold.white(snippet.title)} ${langBadge}\n` +
    `${chalk.gray('ID:')} ${snippet.id}\n` +
    `${chalk.gray('Tags:')} ${snippet.tags.map(t => chalk.blue(`#${t}`)).join(' ')}\n` +
    `${chalk.gray('Usage:')} ${snippet.usageCount} ${chalk.gray('|')} ${chalk.gray('Updated:')} ${formatDate(snippet.updatedAt)}`,
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  );

  if (snippet.description) {
    output += '\n' + chalk.gray(snippet.description) + '\n';
  }

  if (showCode && snippet.code) {
    output += '\n' + formatCode(snippet.code, snippet.language) + '\n';
  }

  return output;
}

/**
 * Format code with syntax highlighting
 */
export function formatCode(code: string, language: string): string {
  try {
    const highlighted = hljs.highlight(code, { language: language.toLowerCase() }).value;
    // Convert HTML highlighting to terminal colors
    return highlighted
      .replace(/<span class="hljs-keyword">([^<]+)<\/span>/g, chalk.magenta('$1'))
      .replace(/<span class="hljs-string">([^<]+)<\/span>/g, chalk.green('$1'))
      .replace(/<span class="hljs-number">([^<]+)<\/span>/g, chalk.yellow('$1'))
      .replace(/<span class="hljs-comment">([^<]+)<\/span>/g, chalk.gray('$1'))
      .replace(/<span class="hljs-function">([^<]+)<\/span>/g, chalk.blue('$1'))
      .replace(/<span class="hljs-class">([^<]+)<\/span>/g, chalk.cyan('$1'))
      .replace(/<span class="hljs-title">([^<]+)<\/span>/g, chalk.yellow('$1'))
      .replace(/<span class="hljs-params">([^<]+)<\/span>/g, chalk.white('$1'))
      .replace(/<span class="hljs-built_in">([^<]+)<\/span>/g, chalk.cyan('$1'))
      .replace(/<span class="hljs-literal">([^<]+)<\/span>/g, chalk.magenta('$1'))
      .replace(/<span class="hljs-regexp">([^<]+)<\/span>/g, chalk.red('$1'))
      .replace(/<span class="hljs-attr">([^<]+)<\/span>/g, chalk.yellow('$1'))
      .replace(/<span class="hljs-tag">([^<]+)<\/span>/g, chalk.blue('$1'))
      .replace(/<span class="hljs-name">([^<]+)<\/span>/g, chalk.red('$1'));
  } catch (error) {
    // If highlighting fails, return plain code
    return code;
  }
}

/**
 * Format snippets as a table
 */
export function formatSnippetsTable(snippets: Snippet[]): string {
  if (snippets.length === 0) {
    return chalk.yellow('No snippets found.');
  }

  const data = [
    [chalk.bold('ID'), chalk.bold('Title'), chalk.bold('Language'), chalk.bold('Tags'), chalk.bold('★'), chalk.bold('Usage')]
  ];

  snippets.forEach(s => {
    data.push([
      s.id.substring(0, 8),
      s.title.substring(0, 30),
      s.language,
      s.tags.slice(0, 3).join(', '),
      s.isFavorite ? '★' : '',
      s.usageCount.toString()
    ]);
  });

  return table(data, {
    border: {
      topBody: '─',
      topJoin: '┬',
      topLeft: '┌',
      topRight: '┐',
      bottomBody: '─',
      bottomJoin: '┴',
      bottomLeft: '└',
      bottomRight: '┘',
      bodyLeft: '│',
      bodyRight: '│',
      bodyJoin: '│',
      joinBody: '─',
      joinLeft: '├',
      joinRight: '┤',
      joinJoin: '┼'
    }
  });
}

/**
 * Format search results
 */
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return chalk.yellow('No matching snippets found.');
  }

  let output = chalk.green(`\n✓ Found ${results.length} matching snippet(s)\n`);

  results.forEach((result, index) => {
    const score = Math.round((1 - result.score) * 100);
    const matchInfo = result.matches.length > 0
      ? chalk.gray(`(matched: ${result.matches.join(', ')})`)
      : '';

    output += `\n${chalk.cyan(`${index + 1}.`)} ${formatSnippet(result.snippet, { compact: true })} ${chalk.yellow(`${score}%`)} ${matchInfo}`;
  });

  return output;
}

/**
 * Format statistics
 */
export function formatStats(stats: SnippetStats): string {
  const data = [
    [chalk.bold('Metric'), chalk.bold('Value')],
    ['Total Snippets', stats.totalSnippets.toString()],
    ['Total Languages', stats.totalLanguages.toString()],
    ['Total Tags', stats.totalTags.toString()],
    ['Top Language', stats.topLanguage || 'N/A'],
    ['Top Tags', stats.topTags.slice(0, 3).join(', ') || 'N/A'],
    ['Total Usage', stats.totalUsage.toString()]
  ];

  return boxen(
    table(data, {
      border: {
        topBody: '─',
        topJoin: '┬',
        topLeft: '┌',
        topRight: '┐',
        bottomBody: '─',
        bottomJoin: '┴',
        bottomLeft: '└',
        bottomRight: '┘',
        bodyLeft: '│',
        bodyRight: '│',
        bodyJoin: '│',
        joinBody: '─',
        joinLeft: '├',
        joinRight: '┤',
        joinJoin: '┼'
      }
    }),
    {
      title: chalk.bold.white('📊 Snippet Statistics'),
      titleAlignment: 'center',
      padding: 1,
      borderStyle: 'double',
      borderColor: 'green'
    }
  );
}

/**
 * Format tags list
 */
export function formatTagsList(tags: string[]): string {
  if (tags.length === 0) {
    return chalk.yellow('No tags found.');
  }

  const columns = 4;
  const rows = Math.ceil(tags.length / columns);

  let output = chalk.bold.white('\n🏷️  Available Tags\n\n');

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      const index = i + j * rows;
      if (index < tags.length) {
        row.push(chalk.blue(`#${tags[index]}`));
      }
    }
    output += row.join('  ') + '\n';
  }

  return output;
}

/**
 * Format languages list
 */
export function formatLanguagesList(languages: string[]): string {
  if (languages.length === 0) {
    return chalk.yellow('No languages found.');
  }

  let output = chalk.bold.white('\n🔤 Languages Used\n\n');

  languages.forEach(lang => {
    const color = getLanguageColor(lang);
    output += chalk.hex(color)(`● ${lang}`) + '\n';
  });

  return output;
}

/**
 * Format date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Print welcome banner
 */
export function printWelcome(): void {
  console.log(
    boxen(
      chalk.cyan.bold('🚀 SnippetHub CLI\n') +
      chalk.white('Your personal code snippet manager\n') +
      chalk.gray('Version 1.0.0 | MIT License'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        textAlignment: 'center'
      }
    )
  );
}

/**
 * Print help information
 */
export function printHelp(): void {
  console.log(chalk.bold.white('\n📖 Quick Start Guide\n'));
  console.log(`${chalk.cyan('snip add')}       - Add a new snippet`);
  console.log(`${chalk.cyan('snip list')}      - List all snippets`);
  console.log(`${chalk.cyan('snip search')}    - Search snippets`);
  console.log(`${chalk.cyan('snip show')}      - Show snippet details`);
  console.log(`${chalk.cyan('snip edit')}      - Edit a snippet`);
  console.log(`${chalk.cyan('snip delete')}    - Delete a snippet`);
  console.log(`${chalk.cyan('snip tags')}      - List all tags`);
  console.log(`${chalk.cyan('snip stats')}     - Show statistics`);
  console.log(`${chalk.cyan('snip export')}    - Export snippets`);
  console.log(`${chalk.cyan('snip import')}    - Import snippets`);
  console.log(`${chalk.cyan('snip backup')}    - Create backup`);
  console.log(chalk.gray('\nRun "snip --help" for more information\n'));
}

/**
 * Print success message
 */
export function printSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

/**
 * Print error message
 */
export function printError(message: string): void {
  console.error(chalk.red(`✗ ${message}`));
}

/**
 * Print warning message
 */
export function printWarning(message: string): void {
  console.log(chalk.yellow(`⚠ ${message}`));
}

/**
 * Print info message
 */
export function printInfo(message: string): void {
  console.log(chalk.blue(`ℹ ${message}`));
}
