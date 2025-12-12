---
name: todo-code-review
description: Comprehensive code review guidelines for Todo API project. Use when reviewing code changes, pull requests, or conducting quality checks. Covers RESTful API design, error handling consistency, test coverage, TypeScript type safety, and Express.js best practices. Trigger keywords: code review, pull request, PR, quality check, review, コードレビュー, PRレビュー, 品質チェック, レビュー依頼
---

# todo-code-review

Todo APIプロジェクト専用のコードレビューガイドライン

---

## Overview (概要)

このスキルは、Todo APIプロジェクトのコードレビューを体系的に実施するためのガイドラインを提供します。

**対象:**
- プルリクエストのレビュー
- コード品質チェック
- リファクタリング前の評価
- 新機能実装のレビュー
- バグ修正の検証

**トリガーキーワード:**
- 「コードレビュー」
- 「PRレビュー」
- 「品質チェック」
- 「レビュー依頼」

---

## レビュープロセス

### Phase 1: 初期評価

1. **変更内容の理解**
2. **影響範囲の特定**
3. **優先度の判定**

---

## 1. RESTful API設計の評価

### チェック項目

#### 1.1 エンドポイント設計

**リソース命名規則:**
```typescript
// Good: 複数形のリソース名
GET    /todos
POST   /todos
PUT    /todos/:id/complete
DELETE /todos/:id

// Bad: 単数形や動詞を含む
GET /getTodos
POST /createTodo
```

#### 1.2 HTTPステータスコードの適切性

```typescript
// Good: 適切なステータスコード
200 OK          - GET, PUT成功
201 Created     - POST成功
204 No Content  - DELETE成功
400 Bad Request - バリデーションエラー
404 Not Found   - リソースが見つからない
500 Internal    - サーバーエラー
```

---

## 2. エラーハンドリングの一貫性

### チェック項目

#### 2.1 エラーレスポンス形式の統一

すべてのエラーは `{ error: string }` 形式

```typescript
// Good: 統一された形式
if (!title) {
  return res.status(400).json({ error: 'Title is required' });
}

// Bad: 形式が不統一
return res.status(400).json({ message: 'Invalid input' });
```

#### 2.2 早期リターンパターン

```typescript
// Good: 早期リターン
if (!todo) {
  return res.status(404).json({ error: 'Todo not found' });
}
```

---

## 3. テストカバレッジの確認

### カバレッジ目標: 80%以上

**確認コマンド:**
```bash
npm run test:coverage
```

**必須テストケース:**

```typescript
describe('POST /todos', () => {
  // 正常系
  it('should create a new todo', async () => {});

  // 異常系
  it('should return 400 if title is missing', async () => {});
  it('should return 400 if priority is invalid', async () => {});
});
```

---

## 4. TypeScript型安全性

### チェック項目

#### 4.1 明示的な型定義

```typescript
// Good: 明示的な型定義
function findTodoById(id: number): Todo | undefined {
  return todos.find(todo => todo.id === id);
}

// Bad: 型推論に依存
function findTodoById(id: number) {
  return todos.find(todo => todo.id === id);
}
```

#### 4.2 any型の回避

```typescript
// Good: 具体的な型定義
type CreateTodoRequest = {
  title: string;
  priority?: Priority;
};

// Bad: any型の使用
function processTodo(todo: any): any {}
```

---

## 5. Express.js ベストプラクティス

### チェック項目

#### 5.1 ミドルウェアの適切な使用

```typescript
// Good: 共通処理はミドルウェアで
app.use(express.json());
```

#### 5.2 環境変数の管理

```typescript
// Good: 環境変数で設定を管理
const PORT = process.env.PORT || 3000;
```

---

## レビューチェックリスト

### 必須チェック項目

#### API設計
- [ ] エンドポイントが複数形のリソース名を使用
- [ ] HTTPメソッドが適切
- [ ] ステータスコードが正しい

#### エラーハンドリング
- [ ] すべてのエラーが `{ error: string }` 形式
- [ ] バリデーションエラーが400を返す
- [ ] 早期リターンパターンを使用

#### テスト
- [ ] カバレッジが80%以上
- [ ] 正常系・異常系テストがある
- [ ] AAAパターンに従っている

#### TypeScript
- [ ] 明示的な型定義がある
- [ ] `any`型を使用していない

---

## Common Pitfalls (よくある間違い)

### 避けるべきこと

#### 1. エラーレスポンスの不統一

```typescript
// Bad
res.status(400).json({ message: 'Error' });
res.status(404).send('Not found');

// Good
res.status(400).json({ error: 'Error' });
res.status(404).json({ error: 'Not found' });
```

#### 2. バリデーションの欠如

```typescript
// Bad: バリデーションなし
app.post('/todos', (req, res) => {
  const { title, priority } = req.body;
  const todo = createTodo(title, priority);
  res.status(201).json(todo);
});

// Good: 適切なバリデーション
app.post('/todos', (req, res) => {
  const { title, priority = 'medium' } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = createTodo(title, priority);
  res.status(201).json(todo);
});
```

---

## レビューフロー

### Step 1: 自動チェック

```bash
npm run build       # 型チェック
npm run lint        # リンター
npm test            # テスト実行
npm run test:coverage # カバレッジ確認
```

### Step 2: 手動レビュー

1. API設計の確認
2. エラーハンドリングの確認
3. テストカバレッジの確認
4. TypeScript型安全性の確認

### Step 3: フィードバック

**優先度:**
- Critical: セキュリティ問題、本番影響バグ
- High: エラーハンドリング欠如、カバレッジ不足
- Medium: 可読性、パフォーマンス
- Low: スタイル微調整

### Step 4: 承認基準

- [ ] すべてのCritical指摘が修正済み
- [ ] すべてのHigh指摘が修正済み
- [ ] テストがすべて成功
- [ ] カバレッジが80%以上
- [ ] ビルドが成功

---

## 適用タイミング

このスキルは以下のタイミングで適用してください:

1. **プルリクエストレビュー時**
   - すべてのチェックリストを確認

2. **コード品質チェック時**
   - 定期的な品質監査

3. **新機能実装レビュー時**
   - API設計の妥当性確認

4. **バグ修正レビュー時**
   - 根本原因の確認
   - テストケースの追加確認
