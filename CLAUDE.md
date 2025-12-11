# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コーディング規約

### TypeScript
- **strict mode**: `tsconfig.json`で`"strict": true`を設定し、厳格な型チェックを有効化する
- 型安全性を最優先し、`any`型の使用は避ける

### エラーハンドリング
- すべてのエラーレスポンスは `{ error: string }` 形式にする
- `createErrorResponse()`ヘルパー関数([src/utils.ts](src/utils.ts))を使用して一貫性を保つ
- 適切なHTTPステータスコード(400, 404, 500など)を返す

### バリデーション
- すべてのエンドポイントで入力バリデーションを実装する
- リクエストボディ、パラメータ、クエリパラメータのバリデーションを徹底する
- バリデーションエラーは400 Bad Requestで返す

### テスト
- **テストフレームワーク**: Jestを使用
- **カバレッジ目標**: 80%以上を目指す
- 統合テスト: supertestを使用してAPIエンドポイントをテスト
- ユニットテスト: ユーティリティ関数とビジネスロジックを個別にテスト
- テスト実行: `npm run test:coverage`でカバレッジを確認

## 依存関係とインストールのルール (厳守)
- **セットアップ時**: `package-lock.json` が存在する場合は、絶対に `npm install` を使わず、**必ず `npm ci` を使用する**。
  - 理由: ロックファイルのバージョンを厳守し、サプライチェーン攻撃や意図しないバージョンアップを防ぐため。
- **パッケージ追加時**:
  - 新規パッケージを追加する際は、可能な限り `--ignore-scripts` フラグを付ける (`npm install [package] --ignore-scripts`)。
  - インストールしようとしているパッケージ名にタイプミスがないか(Typosquatting対策)、実行前に必ず確認する。
- **監査**: パッケージ操作後は必ず `npm audit` を実行し、脆弱性をチェックする。

## 開発コマンド

### 開発サーバー
```bash
npm run dev
```
ts-nodeで[src/index.ts](src/index.ts)を直接実行し、開発サーバーを起動(ポート3000)

### ビルド
```bash
npm run build
```
TypeScriptファイルをコンパイルして`dist/`ディレクトリにJavaScriptファイルを生成

### 本番サーバー起動
```bash
npm start
```
ビルド済みの`dist/index.js`を実行

### テスト
```bash
npm test              # すべてのテストを実行
npm run test:watch    # ウォッチモードでテスト実行
npm run test:coverage # カバレッジレポート付きでテスト実行
```

## アーキテクチャ

### エントリーポイントと責務分離

- **[src/index.ts](src/index.ts)**: サーバー起動のみを担当。Expressアプリケーションのインスタンスをインポートしてlistenする
- **[src/app.ts](src/app.ts)**: Expressアプリケーションの設定とすべてのルート定義を含む。テスト時にサーバーを起動せずにアプリケーションロジックをテストできるよう、appインスタンスをエクスポート

この分離により、`app.test.ts`では`app`をインポートしてsupertestで統合テストを実行でき、実際のサーバーを起動せずにAPIエンドポイントをテスト可能。

### データストレージ

現在のストレージはインメモリ配列(`todos`)。[src/app.ts](src/app.ts)でエクスポートされた`todos`配列がすべてのTodoデータを保持。テスト用に`resetTodos()`関数もエクスポートされており、各テストケース前にデータをクリーンアップ可能。

### ユーティリティとビジネスロジック

[src/utils.ts](src/utils.ts)にビジネスロジックとヘルパー関数を集約:
- 優先度のバリデーション(`isValidPriority`)
- 優先度順ソート(`sortByPriority`)
- Todo検索関数(`findTodoById`, `findTodoIndexById`)
- 定数定義(`PRIORITY_ORDER`, `DEFAULT_PRIORITY`)

この設計により、ビジネスロジックを独立してユニットテスト可能。

### 型定義

[src/types.ts](src/types.ts)にすべての型定義を集約:
- `Todo`: 優先度(`priority`)とタイムスタンプ(`createdAt`)を持つTodoオブジェクト
- `Priority`: 'high' | 'medium' | 'low'のユニオン型
- `CreateTodoRequest`: POSTリクエストのボディ型
- `TodoQueryParams`, `TodoParams`: ルートパラメータとクエリパラメータの型

## API仕様

- `GET /todos?completed=<true|false>`: Todo一覧取得(優先度順にソート、completedでフィルタリング可能)
- `POST /todos`: Todo作成(title必須、priority任意)
- `PUT /todos/:id/complete`: Todoを完了状態に変更
- `DELETE /todos/:id`: Todoを削除

優先度のソート順: high(1) → medium(2) → low(3)
