import { Priority, Todo, ErrorResponse } from './types';

// 定数
export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

export const DEFAULT_PRIORITY: Priority = 'medium';

export const VALID_PRIORITIES: Priority[] = ['high', 'medium', 'low'];

// 型ガード: 優先度が有効かチェック
export const isValidPriority = (priority: any): priority is Priority => {
  return VALID_PRIORITIES.includes(priority);
};

// エラーレスポンスを作成
export const createErrorResponse = (message: string): ErrorResponse => {
  return { error: message };
};

// Todoを優先度順にソート
export const sortByPriority = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });
};

// TodoをIDで検索
export const findTodoById = (todos: Todo[], id: string): Todo | undefined => {
  return todos.find(t => t.id === id);
};

// TodoのインデックスをIDで検索
export const findTodoIndexById = (todos: Todo[], id: string): number => {
  return todos.findIndex(t => t.id === id);
};
