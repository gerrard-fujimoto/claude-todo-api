# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Todo API - TypeScript + Express による RESTful API
作業ディレクトリは常に以下のディレクトリを起点としてください。
- /Users/gerrard/claude-todo-api/

## 利用可能なSkills

プロジェクト固有の開発規約とワークフローは以下のSkillsで管理されています:

- **[typescript-development](.claude/skills/typescript-dev/skill.md)**: TypeScript開発規約、Jest テスト規約、コーディングスタイル
- **[doc-coauthoring](.claude/skills/doc-coauthoring/skill.md)**: 技術ドキュメント共同執筆ワークフロー（API仕様書、README、設計書等）
- **[api-design](.claude/skills/api-design/skill.md)**: REST API設計、エラーハンドリング、バリデーション *(準備中)*

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
