---
name: doc-coauthoring
description: Guide users through a structured workflow for co-authoring technical documentation in Japanese. Use when user wants to write API documentation, technical specifications, architecture docs, README files, or similar structured technical content. Trigger keywords: document creation, technical docs, README, API documentation, architecture docs, ドキュメント作成, 仕様書作成, README作成, 技術ドキュメント, 設計書
---

# doc-coauthoring

技術ドキュメントの共同執筆を構造化されたワークフローでガイドします。

---

## Overview (概要)

このスキルは、ユーザーが以下のような技術ドキュメントを作成する際に、効率的にコンテキストを伝達し、反復的に内容を洗練し、読者にとって有用なドキュメントを作成するためのワークフローを提供します。

**対象となるドキュメント:**
- API仕様書 (API documentation)
- 技術仕様書 (Technical specifications)
- アーキテクチャドキュメント (Architecture docs)
- READMEファイル
- 設計書 (Design documents)
- 運用ガイド (Operation guides)

**トリガーキーワード:**
- 「ドキュメントを作成したい」
- 「仕様書を書きたい」
- 「READMEを作成」
- 「技術ドキュメント」
- 「設計書」

---

## 3段階のワークフロー

### Stage 1: Context Gathering (コンテキスト収集)

**目標:** ユーザーが知っていることとClaudeが知っていることのギャップを埋める

#### 1.1 初期質問 (Initial Questions)

以下の質問でドキュメントの方向性を確認:

1. **ドキュメントの種類** - どのような種類のドキュメントを作成しますか?
2. **対象読者 (Audience)** - 誰がこのドキュメントを読みますか?
3. **目的 (Impact)** - このドキュメントで読者にどのような影響を与えたいですか?
4. **フォーマット/テンプレート** - 既存のテンプレートや参考にすべき形式はありますか?
5. **制約事項 (Constraints)** - 長さ、形式、含めるべき/除外すべき内容はありますか?

#### 1.2 情報収集 (Info Dumping)

ユーザーに以下の情報を自由に提供してもらう:
- 背景情報
- これまでの議論や決定事項
- 技術的な詳細
- ステークホルダーの懸念事項

#### 1.3 明確化のための質問 (Clarifying Questions)

情報収集後、5-10個の質問をして理解を深める。

---

### Stage 2: Refinement & Structure (精緻化と構造化)

**目標:** セクションごとにブレインストーミング、キュレーション、反復的な精緻化を行う

#### 2.1 セクション構成の提案

ドキュメントの種類に応じた標準的なセクション構成を提案。

#### 2.2 各セクションの作成プロセス

1. 明確化のための質問 (5-10個)
2. ブレインストーミング (5-20個のオプション)
3. キュレーション (ユーザーによる選択)
4. ギャップチェック
5. ドラフト作成 (Edit toolのstr_replaceを使用)
6. 反復的な精緻化
7. 品質チェック

#### 2.3 重要なルール

- Edit toolの使用: すべての編集は`str_replace`で行う
- 全文再出力禁止: ドキュメント全体を再出力しない
- リンク提供: すべての変更後にファイルリンクを提供

---

### Stage 3: Reader Testing (読者テスト)

**目標:** 新しいClaudeインスタンスでドキュメントをテストし、実際の読者が見る前に盲点を発見する

#### 3.1 想定読者の質問を予測 (5-10個)

対象読者が持ちそうな質問を生成。

#### 3.2 テスト方法

新しいClaudeインスタンスでテストし、曖昧さ、矛盾のチェックを実施。

---

## Best Practices (ベストプラクティス)

### トーンとアプローチ

- 直接的で手続き的
- 理由の簡潔な説明
- ユーザーの主導権を尊重

### ファイル管理

- Write tool: 完全なセクションのドラフト作成時
- Edit tool: すべての編集作業
- リンク: すべての変更後に提供

---

## Common Pitfalls (よくある間違い)

### 避けるべきこと

1. **コンテキスト収集のスキップ**
   - 十分な情報なしでドキュメント作成を開始

2. **全文の再出力**
   - Edit toolを使わずに全体を書き直す

3. **Reader Testingの省略**
   - 自分の知識でドキュメントを評価

---

## 適用タイミング

このスキルは以下のタイミングで適用してください:

1. **ドキュメント作成の言及**
   - 「ドキュメントを書く」
   - 「仕様書を作成」

2. **特定のドキュメントタイプ**
   - API仕様書
   - 設計書
   - 技術仕様書

3. **大規模な執筆タスクの開始**
   - 構造化されたコンテンツが必要な場合
