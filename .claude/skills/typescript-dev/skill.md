---
name: typescript-development
description: TypeScript development standards including strict mode, type safety, and Jest testing. Use when writing TypeScript code, creating tests, refactoring existing code, or reviewing code quality. Trigger keywords: TypeScript, strict mode, type safety, Jest, testing, refactor, code quality, 型安全性, テスト作成, リファクタリング
---

# typescript-development

TypeScript development standards including strict mode, type safety, and Jest testing

---

## TypeScript開発規約

### Strict Mode設定

**必須要件**:
- `tsconfig.json`で`"strict": true`を設定し、厳格な型チェックを有効化する
- 型安全性を最優先し、`any`型の使用は避ける

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 型定義のベストプラクティス

#### 明示的な型定義
すべての関数に明示的な戻り値の型を定義する:

```typescript
// ✅ Good: 明示的な戻り値の型定義
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad: 型推論に依存
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### Type Alias vs Interface
type aliasを優先的に使用する:

```typescript
// ✅ Good: type aliasを使用
type User = {
  id: number;
  name: string;
  email: string;
};

type Priority = 'high' | 'medium' | 'low';

// 使用可能だが、type aliasを優先
interface IUser {
  id: number;
  name: string;
}
```

#### モダンな型機能の活用

```typescript
// Optional chaining
const userName = user?.profile?.name;

// Nullish coalescing
const displayName = userName ?? 'Anonymous';

// 分割代入と型定義
const { id, title, completed }: Todo = todoItem;
```

### 命名規則

```typescript
// 変数・関数: camelCase
const todoList: Todo[] = [];
const getUserById = (id: number): User | undefined => { /* ... */ };

// 型・インターフェース: PascalCase
type TodoItem = { /* ... */ };
type CreateTodoRequest = { /* ... */ };

// 定数: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_PRIORITY: Priority = 'medium';

// Enum: PascalCase (キーもPascalCase)
enum TodoStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
}
```

### エラーハンドリング

早期リターンパターンでネストを減らす:

```typescript
// ✅ Good: 早期リターン
function processTodo(id: number): Todo | null {
  const todo = findTodoById(id);
  if (!todo) {
    return null;
  }

  if (todo.completed) {
    return todo;
  }

  // 処理を続ける...
  return updatedTodo;
}

// ❌ Bad: ネストが深い
function processTodo(id: number): Todo | null {
  const todo = findTodoById(id);
  if (todo) {
    if (!todo.completed) {
      // 処理...
    } else {
      return todo;
    }
  } else {
    return null;
  }
}
```

明示的なエラーメッセージ:

```typescript
// ✅ Good
throw new Error(`Todo with id ${id} not found`);

// ❌ Bad
throw new Error('Not found');
```

---

## Jestテスト規約

### テスト要件

- **テストフレームワーク**: Jest
- **カバレッジ目標**: 80%以上を目指す
- **統合テスト**: supertestを使用してAPIエンドポイントをテスト
- **ユニットテスト**: ユーティリティ関数とビジネスロジックを個別にテスト

### テスト実行コマンド

```bash
npm test              # すべてのテストを実行
npm run test:watch    # ウォッチモードでテスト実行
npm run test:coverage # カバレッジレポート付きでテスト実行
```

### テスト構造: AAA Pattern

**Arrange-Act-Assert パターン**を使用する:

```typescript
describe('GET /todos', () => {
  it('should return all todos', async () => {
    // Arrange (準備)
    const expectedTodos = [
      { id: 1, title: 'Test Todo 1', completed: false },
      { id: 2, title: 'Test Todo 2', completed: true },
    ];

    // Act (実行)
    const response = await request(app).get('/todos');

    // Assert (検証)
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedTodos);
  });
});
```

### テストの階層構造

`describe`と`it`で論理的に整理する:

```typescript
describe('Todo API', () => {
  // 各テストケース前にデータをクリーンアップ
  beforeEach(() => {
    resetTodos();
  });

  describe('GET /todos', () => {
    it('should return all todos', async () => {
      // テストコード
    });

    it('should filter by completed status', async () => {
      // テストコード
    });

    it('should sort by priority', async () => {
      // テストコード
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      // テストコード
    });

    it('should return 400 if title is missing', async () => {
      // テストコード
    });
  });

  describe('PUT /todos/:id/complete', () => {
    it('should mark todo as completed', async () => {
      // テストコード
    });

    it('should return 404 if todo not found', async () => {
      // テストコード
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      // テストコード
    });

    it('should return 404 if todo not found', async () => {
      // テストコード
    });
  });
});
```

### ユニットテストの例

ユーティリティ関数は独立してテスト可能にする:

```typescript
describe('sortByPriority', () => {
  it('should sort todos by priority order', () => {
    // Arrange
    const todos: Todo[] = [
      { id: 1, title: 'Low', priority: 'low', completed: false, createdAt: new Date() },
      { id: 2, title: 'High', priority: 'high', completed: false, createdAt: new Date() },
      { id: 3, title: 'Medium', priority: 'medium', completed: false, createdAt: new Date() },
    ];

    // Act
    const sorted = sortByPriority(todos);

    // Assert
    expect(sorted[0].priority).toBe('high');
    expect(sorted[1].priority).toBe('medium');
    expect(sorted[2].priority).toBe('low');
  });
});

describe('isValidPriority', () => {
  it('should return true for valid priorities', () => {
    expect(isValidPriority('high')).toBe(true);
    expect(isValidPriority('medium')).toBe(true);
    expect(isValidPriority('low')).toBe(true);
  });

  it('should return false for invalid priorities', () => {
    expect(isValidPriority('urgent')).toBe(false);
    expect(isValidPriority('')).toBe(false);
    expect(isValidPriority('HIGH')).toBe(false);
  });
});
```

### 統合テストの例

APIエンドポイントをテストする場合:

```typescript
import request from 'supertest';
import app, { resetTodos } from '../src/app';

describe('Todo API Integration Tests', () => {
  beforeEach(() => {
    resetTodos();
  });

  it('should create, complete, and delete a todo', async () => {
    // Create
    const createResponse = await request(app)
      .post('/todos')
      .send({ title: 'Test Todo', priority: 'high' });

    expect(createResponse.status).toBe(201);
    const todoId = createResponse.body.id;

    // Complete
    const completeResponse = await request(app)
      .put(`/todos/${todoId}/complete`);

    expect(completeResponse.status).toBe(200);
    expect(completeResponse.body.completed).toBe(true);

    // Delete
    const deleteResponse = await request(app)
      .delete(`/todos/${todoId}`);

    expect(deleteResponse.status).toBe(204);

    // Verify deletion
    const getResponse = await request(app).get('/todos');
    expect(getResponse.body).toHaveLength(0);
  });
});
```

### テストカバレッジ確認

```bash
npm run test:coverage
```

カバレッジレポートで以下を確認:
- **Statements**: 80%以上
- **Branches**: 80%以上
- **Functions**: 80%以上
- **Lines**: 80%以上

---

## コーディングスタイル

### インデントとフォーマット

- **インデント**: 2スペース（タブではなくスペース）
- **セミコロン**: 必ず使用する
- **引用符**: シングルクォート(`'`)を優先、JSONやJSX内ではダブルクォート(`"`)
- **改行**: LF（Unix形式）
- **末尾カンマ**: 配列やオブジェクトの最後の要素にも付ける（trailing comma）

```typescript
// ✅ Good
const config = {
  port: 3000,
  host: 'localhost',
  debug: true,  // 末尾カンマ
};

// ✅ Good: シングルクォート使用
const message = 'Hello, World!';

// ✅ Good: アロー関数
const double = (n: number): number => n * 2;
```

### コメント

JSDocスタイルで関数をドキュメント化:

```typescript
/**
 * Todoアイテムを作成する
 *
 * @param title - Todoのタイトル
 * @param priority - 優先度（デフォルト: 'medium'）
 * @returns 作成されたTodoオブジェクト
 */
function createTodo(title: string, priority: Priority = 'medium'): Todo {
  return {
    id: generateId(),
    title,
    priority,
    completed: false,
    createdAt: new Date(),
  };
}
```

複雑なロジックには説明コメントを付けるが、コード自体が自己説明的であることを優先:

```typescript
// ✅ Good: コードが自己説明的
const activeTodos = todos.filter(todo => !todo.completed);

// ❌ Bad: 不要なコメント
// Filter todos to get only active ones
const activeTodos = todos.filter(todo => !todo.completed);

// ✅ Good: 複雑なロジックには説明を付ける
// 優先度でソートし、同じ優先度の場合は作成日時の降順でソート
const sortedTodos = todos.sort((a, b) => {
  const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  if (priorityDiff !== 0) return priorityDiff;
  return b.createdAt.getTime() - a.createdAt.getTime();
});
```

---

## 適用タイミング

このSkillは以下のタイミングで適用してください:

1. **新規TypeScriptファイル作成時**
   - strict modeの設定確認
   - 型定義の実装
   - 命名規則の遵守

2. **既存コードのリファクタリング時**
   - `any`型の除去
   - 明示的な型定義の追加
   - エラーハンドリングの改善

3. **テスト作成時**
   - AAAパターンの使用
   - describe/itの階層構造
   - カバレッジ目標の確認

4. **コードレビュー時**
   - 型安全性の確認
   - テストの充足性チェック
   - スタイルガイドの遵守確認
