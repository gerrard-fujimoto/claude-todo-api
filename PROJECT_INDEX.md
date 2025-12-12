# Project Index: Todo API

生成日時: 2025-12-12

## 📁 プロジェクト構造

```
claude-todo-api/
├── src/                    # ソースコード
│   ├── index.ts           # サーバー起動エントリーポイント
│   ├── app.ts             # Expressアプリケーションとルート定義
│   ├── types.ts           # TypeScript型定義
│   ├── utils.ts           # ビジネスロジックとヘルパー関数
│   ├── app.test.ts        # APIエンドポイント統合テスト (214行)
│   └── utils.test.ts      # ユーティリティ関数ユニットテスト (160行)
├── dist/                   # ビルド済みJavaScriptファイル (tsc出力)
├── .claude/                # Claude Code設定
│   ├── commands/          # カスタムSlash Commands
│   │   ├── api-docs.md
│   │   ├── commit-msg.md
│   │   ├── lint.md
│   │   └── test-report.md
│   └── skills/            # プロジェクト固有のSkills
│       ├── typescript-dev/
│       ├── doc-coauthoring/
│       ├── api-design/
│       ├── todo-code-review/
│       └── webapp-testing/
├── package.json            # npm設定と依存関係
├── tsconfig.json          # TypeScriptコンパイラ設定
├── jest.config.js         # Jest設定
├── CLAUDE.md              # プロジェクト固有のClaude指示
├── CLAUDE.local.md        # 個人用ローカル設定
└── README.md              # プロジェクトドキュメント
```

## 🚀 エントリーポイント

- **CLI/Server**: `src/index.ts` - サーバー起動のみを担当 (PORT: 3000)
- **App Core**: `src/app.ts` - Expressアプリケーション設定とルート定義
- **Tests**: `src/app.test.ts`, `src/utils.test.ts` - Jest + Supertest による包括的テスト

## 📦 コアモジュール

### Module: app
- **Path**: `src/app.ts`
- **Exports**: `app`, `todos`, `resetTodos()`
- **Purpose**: Expressアプリケーションインスタンス、全APIルート定義、インメモリストレージ

### Module: types
- **Path**: `src/types.ts`
- **Exports**: `Priority`, `Todo`, `CreateTodoRequest`, `ErrorResponse`, `TodoQueryParams`, `TodoParams`
- **Purpose**: プロジェクト全体の型定義を集約

### Module: utils
- **Path**: `src/utils.ts`
- **Exports**:
  - 定数: `PRIORITY_ORDER`, `DEFAULT_PRIORITY`, `VALID_PRIORITIES`
  - 関数: `isValidPriority()`, `createErrorResponse()`, `sortByPriority()`, `findTodoById()`, `findTodoIndexById()`
- **Purpose**: ビジネスロジック、バリデーション、検索・ソート処理

### Module: index
- **Path**: `src/index.ts`
- **Exports**: なし (サーバー起動のみ)
- **Purpose**: appをインポートして指定ポートでlistenする

## 🔧 設定ファイル

- **package.json**: プロジェクトメタデータ、npm scripts、依存関係管理
- **tsconfig.json**: TypeScriptコンパイラ設定 (target: ES2020, strict mode, dist/出力)
- **jest.config.js**: テスト設定 (ts-jest, node環境, src/ルート, カバレッジ収集)
- **CLAUDE.md**: プロジェクト規約、アーキテクチャ、API仕様
- **CLAUDE.local.md**: 個人用開発環境設定 (PORT: 3001, テストデータ、curlエイリアス)

## 📚 ドキュメント

- **README.md**: プロジェクト概要、セットアップ手順、API仕様、使用例
- **CLAUDE.md**: 開発規約、アーキテクチャ、責務分離の説明
- **.claude/skills/**: 開発ワークフロー (TypeScript開発、API設計、ドキュメント執筆、コードレビュー、Webテスト)
- **.claude/commands/**: カスタムコマンド (APIドキュメント生成、コミットメッセージ、Lint、テストレポート)

## 🧪 テストカバレッジ

- **統合テスト**: `src/app.test.ts` (214行)
  - 全APIエンドポイント (GET, POST, PUT, DELETE)
  - エラーハンドリング (404, 400, JSONパースエラー)
  - クエリパラメータフィルタリング
  - 優先度バリデーション

- **ユニットテスト**: `src/utils.test.ts` (160行)
  - 優先度バリデーション (`isValidPriority`)
  - ソート処理 (`sortByPriority`)
  - 検索処理 (`findTodoById`, `findTodoIndexById`)
  - エラーレスポンス生成 (`createErrorResponse`)

- **合計**: 374行のテストコード

## 🔗 主要依存関係

### Production
- **express**: ^4.18.2 - Webフレームワーク

### Development
- **typescript**: ^5.3.3 - 型安全な開発環境
- **ts-node**: ^10.9.2 - TypeScript直接実行 (dev環境)
- **jest**: ^29.7.0 - テストフレームワーク
- **ts-jest**: ^29.1.1 - JestのTypeScriptサポート
- **supertest**: ^6.3.3 - HTTP統合テスト
- **@types/express**: ^4.17.21 - Express型定義
- **@types/jest**: ^29.5.11 - Jest型定義
- **@types/node**: ^20.10.6 - Node.js型定義
- **@types/supertest**: ^6.0.2 - Supertest型定義

## 📝 クイックスタート

```bash
# 1. 依存関係のインストール
npm install

# 2. 開発サーバー起動 (ts-node)
npm run dev

# 3. テスト実行
npm test

# 4. カバレッジ付きテスト
npm run test:coverage

# 5. ビルド (TypeScript → JavaScript)
npm run build

# 6. 本番環境で起動
npm start
```

## 🎯 API エンドポイント概要

- **GET /todos**: Todo一覧取得 (優先度順ソート、?completed=true/false フィルタリング可能)
- **POST /todos**: Todo作成 (title必須、priority任意: high/medium/low)
- **PUT /todos/:id/complete**: Todo完了状態に変更
- **DELETE /todos/:id**: Todo削除

優先度ソート順: high(1) → medium(2) → low(3)

## 🏗️ アーキテクチャ設計の特徴

### 責務分離
- `index.ts`: サーバー起動のみ
- `app.ts`: アプリケーションロジックとルート定義 (テスト可能なよう分離)
- `utils.ts`: ビジネスロジックとヘルパー関数
- `types.ts`: 型定義の集約

### データストレージ
- インメモリ配列 (`todos`) - データベース不要のシンプル構成
- `resetTodos()` でテスト前のクリーンアップ可能

### エラーハンドリング
- グローバルエラーハンドラー
- JSONパースエラーハンドラー
- 404エラーハンドリング
- バリデーションエラー (400)

### テスト戦略
- 統合テスト: Supertest でAPIエンドポイントをテスト
- ユニットテスト: ビジネスロジックを独立してテスト
- サーバーを起動せずにテスト可能 (app.tsの設計)

## 📊 統計情報

- **ソースコード**: 6ファイル (index.ts, app.ts, types.ts, utils.ts, app.test.ts, utils.test.ts)
- **テストコード**: 374行
- **設定ファイル**: 3ファイル (package.json, tsconfig.json, jest.config.js)
- **Claude Skills**: 5種類 (TypeScript開発、API設計、ドキュメント執筆、コードレビュー、Webテスト)
- **カスタムコマンド**: 4種類 (api-docs, commit-msg, lint, test-report)
- **API エンドポイント**: 4種類 (GET, POST, PUT, DELETE)

---

**インデックスサイズ**: ~4KB
**フルコードベース**: ~58KB
**削減率**: 93%
