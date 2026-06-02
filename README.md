<div align="center">

# 🚀 SnippetHub CLI

**Your Personal Code Snippet Manager**

[![npm version](https://img.shields.io/npm/v/snippethub-cli.svg)](https://www.npmjs.com/package/snippethub-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

[English](#english) | [简体中文](#简体中文) | [繁體中文](#繁體中文)

</div>

---

<a name="english"></a>
## 🇺🇸 English

### 🎉 Introduction

**SnippetHub CLI** is a powerful, lightweight command-line tool designed for developers to efficiently manage code snippets. Say goodbye to scattered notes, forgotten solutions, and repetitive code writing!

#### Why SnippetHub?

- 🔒 **100% Local Storage** - Your code stays on your machine, complete privacy
- ⚡ **Lightning Fast** - Optimized for speed with fuzzy search
- 🎨 **Beautiful Display** - Syntax highlighting for 50+ languages
- 🏷️ **Smart Organization** - Tag-based categorization system
- 📋 **Clipboard Ready** - One-click copy to clipboard
- 💾 **Backup & Restore** - Never lose your snippets

### ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🔍 **Full-Text Search** | Fuzzy search across titles, code, descriptions, and tags |
| 🌈 **Syntax Highlighting** | Support for 50+ programming languages |
| 🏷️ **Tag Management** | Organize snippets with custom tags |
| ⭐ **Favorites** | Mark frequently used snippets as favorites |
| 📊 **Statistics** | Track usage and analyze your snippet library |
| 📤 **Import/Export** | JSON format for easy backup and sharing |
| 🔄 **Auto Backup** | Automatic backup with configurable intervals |
| 📋 **Clipboard Integration** | Copy code directly to clipboard |

### 🚀 Quick Start

#### Installation

```bash
# Install globally via npm
npm install -g snippethub-cli

# Or use npx (no installation required)
npx snippethub-cli
```

#### Requirements

- **Node.js** >= 14.0.0
- **npm** or **yarn**

#### First Run

```bash
# Initialize SnippetHub
snip init

# Add your first snippet
snip add

# List all snippets
snip list
```

### 📖 Usage Guide

#### Adding Snippets

```bash
# Interactive mode (recommended)
snip add

# Quick add with options
snip add --title "Array Unique" --code "[...new Set(array)]" --language javascript --tags "array,es6"
```

#### Searching Snippets

```bash
# Search by keyword
snip search "array unique"

# Interactive search
snip search -i
```

#### Managing Snippets

```bash
# Show snippet details
snip show <id>

# Edit snippet
snip edit <id>

# Delete snippet
snip delete <id>

# Toggle favorite
snip favorite <id>

# Copy to clipboard
snip copy <id>
```

#### Organization

```bash
# List all tags
snip tags

# List all languages
snip languages

# Filter by language
snip list --language python

# Filter by tag
snip list --tag "utility"

# Show favorites only
snip list --favorite
```

#### Backup & Export

```bash
# Create backup
snip backup

# List backups
snip backups

# Restore from backup
snip restore <backup-file>

# Export snippets
snip export ./my-snippets.json

# Import snippets
snip import ./my-snippets.json --merge
```

#### Statistics

```bash
# View statistics
snip stats
```

### 💡 Design Philosophy

SnippetHub was built with these principles:

1. **Developer-First** - Designed by developers, for developers
2. **Privacy-First** - All data stored locally, no cloud dependency
3. **Speed Matters** - Fast operations with minimal overhead
4. **Beautiful CLI** - Rich terminal UI with colors and formatting
5. **Extensible** - Easy to extend and customize

### 📦 Project Structure

```
snippethub-cli/
├── src/
│   ├── index.ts        # CLI entry point
│   ├── types.ts        # Type definitions
│   ├── config.ts       # Configuration management
│   ├── storage.ts      # Data persistence
│   ├── display.ts      # UI rendering
│   └── commands.ts     # Command handlers
├── dist/               # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

### 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<a name="简体中文"></a>
## 🇨🇳 简体中文

### 🎉 项目介绍

**SnippetHub CLI** 是一款专为开发者设计的强大、轻量级命令行代码片段管理工具。告别散乱的笔记、遗忘的解决方案和重复的代码编写！

#### 为什么选择 SnippetHub？

- 🔒 **100% 本地存储** - 代码保存在您的机器上，完全私密
- ⚡ **极速搜索** - 模糊搜索，快速定位
- 🎨 **精美显示** - 支持 50+ 种编程语言的语法高亮
- 🏷️ **智能组织** - 基于标签的分类系统
- 📋 **一键复制** - 一键复制到剪贴板
- 💾 **备份恢复** - 永不丢失您的代码片段

### ✨ 核心特性

| 特性 | 描述 |
|------|------|
| 🔍 **全文搜索** | 支持标题、代码、描述和标签的模糊搜索 |
| 🌈 **语法高亮** | 支持 50+ 种编程语言 |
| 🏷️ **标签管理** | 使用自定义标签组织代码片段 |
| ⭐ **收藏功能** | 标记常用代码片段为收藏 |
| 📊 **统计分析** | 追踪使用情况，分析代码库 |
| 📤 **导入导出** | JSON 格式，便于备份和分享 |
| 🔄 **自动备份** | 可配置的自动备份间隔 |
| 📋 **剪贴板集成** | 直接复制代码到剪贴板 |

### 🚀 快速开始

#### 安装

```bash
# 通过 npm 全局安装
npm install -g snippethub-cli

# 或使用 npx（无需安装）
npx snippethub-cli
```

#### 环境要求

- **Node.js** >= 14.0.0
- **npm** 或 **yarn**

#### 首次运行

```bash
# 初始化 SnippetHub
snip init

# 添加第一个代码片段
snip add

# 列出所有代码片段
snip list
```

### 📖 使用指南

#### 添加代码片段

```bash
# 交互式模式（推荐）
snip add

# 使用选项快速添加
snip add --title "数组去重" --code "[...new Set(array)]" --language javascript --tags "array,es6"
```

#### 搜索代码片段

```bash
# 按关键词搜索
snip search "数组去重"

# 交互式搜索
snip search -i
```

#### 管理代码片段

```bash
# 显示代码片段详情
snip show <id>

# 编辑代码片段
snip edit <id>

# 删除代码片段
snip delete <id>

# 切换收藏状态
snip favorite <id>

# 复制到剪贴板
snip copy <id>
```

#### 组织管理

```bash
# 列出所有标签
snip tags

# 列出所有语言
snip languages

# 按语言筛选
snip list --language python

# 按标签筛选
snip list --tag "utility"

# 仅显示收藏
snip list --favorite
```

#### 备份与导出

```bash
# 创建备份
snip backup

# 列出备份
snip backups

# 从备份恢复
snip restore <backup-file>

# 导出代码片段
snip export ./my-snippets.json

# 导入代码片段
snip import ./my-snippets.json --merge
```

#### 统计信息

```bash
# 查看统计
snip stats
```

### 💡 设计理念

SnippetHub 遵循以下设计原则：

1. **开发者优先** - 由开发者设计，为开发者服务
2. **隐私优先** - 所有数据本地存储，无云端依赖
3. **速度至上** - 快速操作，最小开销
4. **精美界面** - 丰富的终端 UI，带颜色和格式化
5. **可扩展性** - 易于扩展和自定义

### 📦 项目结构

```
snippethub-cli/
├── src/
│   ├── index.ts        # CLI 入口
│   ├── types.ts        # 类型定义
│   ├── config.ts       # 配置管理
│   ├── storage.ts      # 数据持久化
│   ├── display.ts      # UI 渲染
│   └── commands.ts     # 命令处理器
├── dist/               # 编译输出
├── package.json
├── tsconfig.json
└── README.md
```

### 🤝 贡献指南

我们欢迎贡献！请参阅我们的[贡献指南](CONTRIBUTING.md)。

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 📄 开源协议

本项目采用 MIT 协议开源 - 详见 [LICENSE](LICENSE) 文件。

---

<a name="繁體中文"></a>
## 🇹🇼 繁體中文

### 🎉 專案介紹

**SnippetHub CLI** 是一款專為開發者設計的強大、輕量級命令行程式碼片段管理工具。告別散亂的筆記、遺忘的解決方案和重複的程式碼編寫！

#### 為什麼選擇 SnippetHub？

- 🔒 **100% 本地儲存** - 程式碼儲存在您的電腦上，完全私密
- ⚡ **極速搜尋** - 模糊搜尋，快速定位
- 🎨 **精美顯示** - 支援 50+ 種程式語言的語法高亮
- 🏷️ **智慧組織** - 基於標籤的分類系統
- 📋 **一鍵複製** - 一鍵複製到剪貼簿
- 💾 **備份恢復** - 永不遺失您的程式碼片段

### ✨ 核心特性

| 特性 | 描述 |
|------|------|
| 🔍 **全文搜尋** | 支援標題、程式碼、描述和標籤的模糊搜尋 |
| 🌈 **語法高亮** | 支援 50+ 種程式語言 |
| 🏷️ **標籤管理** | 使用自訂標籤組織程式碼片段 |
| ⭐ **收藏功能** | 標記常用程式碼片段為收藏 |
| 📊 **統計分析** | 追蹤使用情況，分析程式碼庫 |
| 📤 **匯入匯出** | JSON 格式，便於備份和分享 |
| 🔄 **自動備份** | 可配置的自動備份間隔 |
| 📋 **剪貼簿整合** | 直接複製程式碼到剪貼簿 |

### 🚀 快速開始

#### 安裝

```bash
# 透過 npm 全域安裝
npm install -g snippethub-cli

# 或使用 npx（無需安裝）
npx snippethub-cli
```

#### 環境要求

- **Node.js** >= 14.0.0
- **npm** 或 **yarn**

#### 首次執行

```bash
# 初始化 SnippetHub
snip init

# 新增第一個程式碼片段
snip add

# 列出所有程式碼片段
snip list
```

### 📖 使用指南

#### 新增程式碼片段

```bash
# 互動式模式（推薦）
snip add

# 使用選項快速新增
snip add --title "陣列去重" --code "[...new Set(array)]" --language javascript --tags "array,es6"
```

#### 搜尋程式碼片段

```bash
# 按關鍵詞搜尋
snip search "陣列去重"

# 互動式搜尋
snip search -i
```

#### 管理程式碼片段

```bash
# 顯示程式碼片段詳情
snip show <id>

# 編輯程式碼片段
snip edit <id>

# 刪除程式碼片段
snip delete <id>

# 切換收藏狀態
snip favorite <id>

# 複製到剪貼簿
snip copy <id>
```

#### 組織管理

```bash
# 列出所有標籤
snip tags

# 列出所有語言
snip languages

# 按語言篩選
snip list --language python

# 按標籤篩選
snip list --tag "utility"

# 僅顯示收藏
snip list --favorite
```

#### 備份與匯出

```bash
# 建立備份
snip backup

# 列出備份
snip backups

# 從備份恢復
snip restore <backup-file>

# 匯出程式碼片段
snip export ./my-snippets.json

# 匯入程式碼片段
snip import ./my-snippets.json --merge
```

#### 統計資訊

```bash
# 檢視統計
snip stats
```

### 💡 設計理念

SnippetHub 遵循以下設計原則：

1. **開發者優先** - 由開發者設計，為開發者服務
2. **隱私優先** - 所有資料本地儲存，無雲端依賴
3. **速度至上** - 快速操作，最小開銷
4. **精美介面** - 豐富的終端 UI，帶顏色和格式化
5. **可擴充套件性** - 易於擴充套件和自定義

### 📦 專案結構

```
snippethub-cli/
├── src/
│   ├── index.ts        # CLI 入口
│   ├── types.ts        # 型別定義
│   ├── config.ts       # 配置管理
│   ├── storage.ts      # 資料持久化
│   ├── display.ts      # UI 渲染
│   └── commands.ts     # 命令處理器
├── dist/               # 編譯輸出
├── package.json
├── tsconfig.json
└── README.md
```

### 🤝 貢獻指南

我們歡迎貢獻！請參閱我們的[貢獻指南](CONTRIBUTING.md)。

1. Fork 本倉庫
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 建立 Pull Request

### 📄 開源協議

本專案採用 MIT 協議開源 - 詳見 [LICENSE](LICENSE) 檔案。

---

<div align="center">

**Made with ❤️ by Lobster Dev Team**

[⭐ Star us on GitHub](https://github.com/gitstq/snippethub-cli) | [🐛 Report Bug](https://github.com/gitstq/snippethub-cli/issues) | [💡 Request Feature](https://github.com/gitstq/snippethub-cli/issues)

</div>
