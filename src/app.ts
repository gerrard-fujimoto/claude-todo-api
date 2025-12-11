import express, { Request, Response, NextFunction } from 'express';
import { Todo, CreateTodoRequest, TodoQueryParams, TodoParams, ErrorResponse } from './types';
import {
  DEFAULT_PRIORITY,
  isValidPriority,
  createErrorResponse,
  sortByPriority,
  findTodoById,
  findTodoIndexById,
} from './utils';

export const app = express();

app.use(express.json());

export let todos: Todo[] = [];

// テスト用にtodosをリセットする関数
export const resetTodos = () => {
  todos = [];
};

// GET /todos - Todo一覧取得（優先度順にソート、completed フィルタリング対応）
app.get('/todos', (req: Request<{}, {}, {}, TodoQueryParams>, res: Response) => {
  const { completed } = req.query;

  // フィルタリング処理
  let filteredTodos = todos;
  if (completed === 'true') {
    filteredTodos = todos.filter(t => t.completed === true);
  } else if (completed === 'false') {
    filteredTodos = todos.filter(t => t.completed === false);
  }

  // 優先度順にソート
  const sortedTodos = sortByPriority(filteredTodos);

  res.json(sortedTodos);
});

// POST /todos - Todo作成
app.post('/todos', (req: Request<{}, {}, CreateTodoRequest>, res: Response<Todo | ErrorResponse>) => {
  const { title, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json(createErrorResponse('Title is required'));
    return;
  }

  // 優先度のバリデーション
  const finalPriority = priority && isValidPriority(priority) ? priority : DEFAULT_PRIORITY;

  const newTodo: Todo = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    priority: finalPriority,
    createdAt: new Date(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id/complete - Todo完了
app.put('/todos/:id/complete', (req: Request<TodoParams>, res: Response<Todo | ErrorResponse>) => {
  const { id } = req.params;
  const todo = findTodoById(todos, id);

  if (!todo) {
    res.status(404).json(createErrorResponse('Todo not found'));
    return;
  }

  todo.completed = true;
  res.json(todo);
});

// DELETE /todos/:id - Todo削除
app.delete('/todos/:id', (req: Request<TodoParams>, res: Response<Todo | ErrorResponse>) => {
  const { id } = req.params;
  const index = findTodoIndexById(todos, id);

  if (index === -1) {
    res.status(404).json(createErrorResponse('Todo not found'));
    return;
  }

  const deletedTodo = todos.splice(index, 1)[0];
  res.json(deletedTodo);
});

// JSONパースエラーハンドラー
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(createErrorResponse('Invalid JSON'));
    return;
  }
  next();
});

// グローバルエラーハンドラー
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json(createErrorResponse('Internal server error'));
});
