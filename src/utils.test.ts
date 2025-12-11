import {
  isValidPriority,
  createErrorResponse,
  sortByPriority,
  findTodoById,
  findTodoIndexById,
  DEFAULT_PRIORITY,
  PRIORITY_ORDER,
} from './utils';
import { Todo } from './types';

describe('Utils', () => {
  describe('isValidPriority', () => {
    test('有効な優先度の場合trueを返す', () => {
      expect(isValidPriority('high')).toBe(true);
      expect(isValidPriority('medium')).toBe(true);
      expect(isValidPriority('low')).toBe(true);
    });

    test('無効な優先度の場合falseを返す', () => {
      expect(isValidPriority('invalid')).toBe(false);
      expect(isValidPriority('')).toBe(false);
      expect(isValidPriority(null)).toBe(false);
      expect(isValidPriority(undefined)).toBe(false);
      expect(isValidPriority(123)).toBe(false);
    });
  });

  describe('createErrorResponse', () => {
    test('エラーレスポンスオブジェクトを作成する', () => {
      const result = createErrorResponse('Test error');
      expect(result).toEqual({ error: 'Test error' });
    });
  });

  describe('sortByPriority', () => {
    test('優先度順にソートされる（high -> medium -> low）', () => {
      const todos: Todo[] = [
        {
          id: '1',
          title: 'Low task',
          completed: false,
          priority: 'low',
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'High task',
          completed: false,
          priority: 'high',
          createdAt: new Date(),
        },
        {
          id: '3',
          title: 'Medium task',
          completed: false,
          priority: 'medium',
          createdAt: new Date(),
        },
      ];

      const sorted = sortByPriority(todos);

      expect(sorted[0].priority).toBe('high');
      expect(sorted[1].priority).toBe('medium');
      expect(sorted[2].priority).toBe('low');
    });

    test('元の配列を変更しない', () => {
      const todos: Todo[] = [
        {
          id: '1',
          title: 'Low task',
          completed: false,
          priority: 'low',
          createdAt: new Date(),
        },
      ];

      const original = [...todos];
      sortByPriority(todos);

      expect(todos).toEqual(original);
    });
  });

  describe('findTodoById', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Task 1',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Task 2',
        completed: false,
        priority: 'high',
        createdAt: new Date(),
      },
    ];

    test('IDが一致するTodoを返す', () => {
      const result = findTodoById(todos, '2');
      expect(result).toBeDefined();
      expect(result?.id).toBe('2');
      expect(result?.title).toBe('Task 2');
    });

    test('IDが存在しない場合undefinedを返す', () => {
      const result = findTodoById(todos, 'non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('findTodoIndexById', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Task 1',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Task 2',
        completed: false,
        priority: 'high',
        createdAt: new Date(),
      },
    ];

    test('IDが一致するTodoのインデックスを返す', () => {
      const result = findTodoIndexById(todos, '2');
      expect(result).toBe(1);
    });

    test('IDが存在しない場合-1を返す', () => {
      const result = findTodoIndexById(todos, 'non-existent');
      expect(result).toBe(-1);
    });
  });

  describe('定数', () => {
    test('DEFAULT_PRIORITYがmedium', () => {
      expect(DEFAULT_PRIORITY).toBe('medium');
    });

    test('PRIORITY_ORDERが正しく定義されている', () => {
      expect(PRIORITY_ORDER).toEqual({
        high: 1,
        medium: 2,
        low: 3,
      });
    });
  });
});
