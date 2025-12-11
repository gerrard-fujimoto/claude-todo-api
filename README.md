# Todo API

Express.jsとTypeScriptで作成したシンプルで型安全なTodo管理APIです。

## 📋 プロジェクト概要

このプロジェクトは、Todo（タスク）の管理を行うRESTful APIです。以下の特徴があります：

- **TypeScript**: 型安全な開発環境
- **Express.js**: 軽量で高速なWebフレームワーク
- **優先度管理**: タスクに優先度（high/medium/low）を設定可能
- **自動ソート**: 優先度順に自動的にソート
- **フィルタリング**: 完了/未完了でフィルタリング可能
- **テスト**: Jest + Supertestによる包括的なテストカバレッジ
- **エラーハンドリング**: グローバルエラーハンドラーによる堅牢なエラー処理

## 🚀 技術スタック

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Testing**: Jest, Supertest
- **Build Tool**: TypeScript Compiler (tsc)
- **Dev Tools**: ts-node

## 📦 セットアップ

### 前提条件

- Node.js (v18以上推奨)
- npm (v9以上推奨)

### インストール手順

```bash
# リポジトリをクローン
git clone <repository-url>
cd claude-todo-api

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

サーバーが起動すると、以下のメッセージが表示されます：
```
Todo API server is running on http://localhost:3000
```

### ビルドと本番環境での起動

```bash
# TypeScriptをJavaScriptにコンパイル
npm run build

# 本番環境で起動
npm start
```

## 🧪 テスト

```bash
# すべてのテストを実行
npm test

# テストをウォッチモードで実行（ファイル変更を自動検知）
npm run test:watch

# カバレッジレポート付きでテストを実行
npm run test:coverage
```

### テストカバレッジ

- **APIエンドポイント**: すべてのCRUD操作
- **エラーハンドリング**: バリデーション、404エラー、JSONパースエラー
- **ユーティリティ関数**: ソート、検索、バリデーション

## ✨ 機能

- ✅ **CRUD操作**: Todo の作成、読取、更新、削除
- ✅ **優先度管理**: 3段階の優先度（high / medium / low）
- ✅ **自動ソート**: 優先度順での自動ソート（high → medium → low）
- ✅ **フィルタリング**: 完了状態でのフィルタリング
- ✅ **バリデーション**: 入力値の厳格なバリデーション
- ✅ **エラーハンドリング**: グローバルエラーハンドラー
- ✅ **型安全性**: TypeScriptによる完全な型定義
- ✅ **インメモリストレージ**: データベース不要のシンプルな構成

## API エンドポイント

### 1. Todo一覧取得（優先度順にソート、フィルタリング対応）
```
GET http://localhost:3000/todos
GET http://localhost:3000/todos?completed=true   # 完了済みのみ
GET http://localhost:3000/todos?completed=false  # 未完了のみ
```

**クエリパラメータ:**
- `completed` (オプション): `"true"` または `"false"` で完了状態をフィルタリング
  - 省略時: すべてのTodoを返す
  - `?completed=true`: 完了済みのTodoのみ
  - `?completed=false`: 未完了のTodoのみ

**レスポンス例:**
```json
[
  {
    "id": "1702345678901",
    "title": "緊急タスク",
    "completed": false,
    "priority": "high",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "1702345678902",
    "title": "買い物に行く",
    "completed": false,
    "priority": "medium",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**ソート順**: high → medium → low

### 2. Todo作成
```
POST http://localhost:3000/todos
Content-Type: application/json

{
  "title": "買い物に行く",
  "priority": "medium"  // オプション: "high" | "medium" | "low" (デフォルト: "medium")
}
```

**レスポンス例:**
```json
{
  "id": "1702345678901",
  "title": "買い物に行く",
  "completed": false,
  "priority": "medium",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**優先度フィールド**:
- `priority` は省略可能（デフォルト: `"medium"`）
- 不正な値が指定された場合も `"medium"` が設定されます

### 3. Todo完了
```
PUT http://localhost:3000/todos/:id/complete
```

**パラメータ:**
- `id` (必須): TodoのID

**成功レスポンス (200 OK):**
```json
{
  "id": "1702345678901",
  "title": "買い物に行く",
  "completed": true,
  "priority": "medium",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**エラーレスポンス (404 Not Found):**
```json
{
  "error": "Todo not found"
}
```

### 4. Todo削除
```
DELETE http://localhost:3000/todos/:id
```

**パラメータ:**
- `id` (必須): TodoのID

**成功レスポンス (200 OK):**
```json
{
  "id": "1702345678901",
  "title": "買い物に行く",
  "completed": false,
  "priority": "medium",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**エラーレスポンス (404 Not Found):**
```json
{
  "error": "Todo not found"
}
```

## 💻 curlでの動作確認例

### 基本的な使い方

```bash
# 1. 優先度が高いTodoを作成
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "緊急タスク", "priority": "high"}'

# 2. 優先度が低いTodoを作成
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "後でやる", "priority": "low"}'

# 3. 優先度を指定せずにTodoを作成（デフォルト: medium）
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "買い物に行く"}'

# 4. Todo一覧取得（優先度順にソートされる: high → medium → low）
curl http://localhost:3000/todos

# 5. 完了済みのTodoのみ取得
curl "http://localhost:3000/todos?completed=true"

# 6. 未完了のTodoのみ取得
curl "http://localhost:3000/todos?completed=false"

# 7. Todoを完了にする（idは作成時に返された値を使用）
curl -X PUT http://localhost:3000/todos/1702345678901/complete

# 8. Todoを削除
curl -X DELETE http://localhost:3000/todos/1702345678901
```

### 実践的なワークフロー例

```bash
# ステップ1: 複数のTodoを作成
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "プレゼン資料作成", "priority": "high"}'

curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "メール返信", "priority": "medium"}'

curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "ブログ記事を読む", "priority": "low"}'

# ステップ2: 一覧を確認（優先度順にソートされる）
curl http://localhost:3000/todos

# ステップ3: 最初のタスクを完了にする（返されたIDを使用）
curl -X PUT http://localhost:3000/todos/<返されたID>/complete

# ステップ4: 未完了のタスクのみ表示
curl "http://localhost:3000/todos?completed=false"
```

## 📂 プロジェクト構造

```
claude-todo-api/
├── src/
│   ├── app.ts           # Expressアプリケーションのメインロジック
│   ├── app.test.ts      # APIエンドポイントのテスト
│   ├── index.ts         # サーバー起動エントリーポイント
│   ├── types.ts         # TypeScript型定義
│   ├── utils.ts         # ヘルパー関数と定数
│   └── utils.test.ts    # ユーティリティ関数のテスト
├── dist/                # ビルド済みJavaScriptファイル（自動生成）
├── package.json         # プロジェクト設定と依存関係
├── tsconfig.json        # TypeScript設定
├── jest.config.js       # Jest設定
└── README.md            # このファイル
```

## 🔧 HTTPステータスコード

| ステータスコード | 説明 | 発生条件 |
|----------------|------|---------|
| **200 OK** | 成功 | GET、PUT、DELETE の成功時 |
| **201 Created** | 作成成功 | POST でTodoが正常に作成された |
| **400 Bad Request** | リクエストエラー | タイトルが空、不正なJSON |
| **404 Not Found** | リソース未検出 | 指定されたIDのTodoが存在しない |
| **500 Internal Server Error** | サーバーエラー | 予期しないエラーが発生 |

## ⚠️ エラーレスポンス一覧

すべてのエラーレスポンスは以下の形式で返されます：

```json
{
  "error": "エラーメッセージ"
}
```

### エラーメッセージ一覧

| エラーメッセージ | HTTPステータス | 発生条件 |
|----------------|---------------|---------|
| `Title is required` | 400 | titleが空、null、または空白のみ |
| `Invalid JSON` | 400 | 不正なJSON形式のリクエスト |
| `Todo not found` | 404 | 指定されたIDのTodoが存在しない |
| `Internal server error` | 500 | 予期しないサーバーエラー |

## 🎯 開発のポイント

### 型安全性

このプロジェクトはTypeScriptの型システムを最大限活用しています：

```typescript
// 型定義の例
export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
}
```

### コードの再利用性

ヘルパー関数を活用して、コードの重複を削減しています：

```typescript
// utils.ts から
export const sortByPriority = (todos: Todo[]): Todo[] => { ... };
export const findTodoById = (todos: Todo[], id: string): Todo | undefined => { ... };
```

### エラーハンドリング

グローバルエラーハンドラーで予期しないエラーもキャッチします：

```typescript
// JSONパースエラー
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(createErrorResponse('Invalid JSON'));
    return;
  }
  next();
});
```

## 📝 今後の拡張案

- [ ] データベース連携（MongoDB、PostgreSQLなど）
- [ ] 認証・認可機能
- [ ] ページネーション
- [ ] Todoの期限管理
- [ ] タグ機能
- [ ] 検索機能（タイトルでの検索）
- [ ] Docker対応
- [ ] CI/CD パイプライン

## 📄 ライセンス

ISC

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

---

**作成者**: Claude Code
**最終更新**: 2025年12月
