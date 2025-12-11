import request from 'supertest';
import { app, resetTodos } from './app';

describe('Todo API', () => {
  // 各テストの前にtodosをリセット
  beforeEach(() => {
    resetTodos();
  });

  describe('POST /todos', () => {
    test('Todoの作成が成功すること', async () => {
      const newTodo = {
        title: '買い物に行く',
        priority: 'high',
      };

      const response = await request(app)
        .post('/todos')
        .send(newTodo)
        .expect(201);

      expect(response.body).toMatchObject({
        title: '買い物に行く',
        priority: 'high',
        completed: false,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
    });

    test('優先度を指定しない場合、デフォルトでmediumが設定されること', async () => {
      const newTodo = {
        title: 'デフォルト優先度のタスク',
      };

      const response = await request(app)
        .post('/todos')
        .send(newTodo)
        .expect(201);

      expect(response.body.priority).toBe('medium');
    });

    test('空のtitleでTodo作成するとエラーになること', async () => {
      const invalidTodo = {
        title: '',
      };

      const response = await request(app)
        .post('/todos')
        .send(invalidTodo)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Title is required',
      });
    });

    test('空白のみのtitleでTodo作成するとエラーになること', async () => {
      const invalidTodo = {
        title: '   ',
      };

      const response = await request(app)
        .post('/todos')
        .send(invalidTodo)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Title is required',
      });
    });

    test('titleが存在しない場合エラーになること', async () => {
      const response = await request(app)
        .post('/todos')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Title is required',
      });
    });
  });

  describe('GET /todos', () => {
    test('Todo一覧が優先度順にソートされて取得できること', async () => {
      // 複数のTodoを作成（優先度がバラバラ）
      await request(app).post('/todos').send({ title: 'Low priority task', priority: 'low' });
      await request(app).post('/todos').send({ title: 'High priority task', priority: 'high' });
      await request(app).post('/todos').send({ title: 'Medium priority task', priority: 'medium' });

      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toHaveLength(3);
      // 優先度順: high -> medium -> low
      expect(response.body[0].priority).toBe('high');
      expect(response.body[1].priority).toBe('medium');
      expect(response.body[2].priority).toBe('low');
    });

    test('completed=trueで完了済みTodoのみ取得できること', async () => {
      // Todoを作成
      const res1 = await request(app).post('/todos').send({ title: 'Task 1' });
      const res2 = await request(app).post('/todos').send({ title: 'Task 2' });

      // 1つ目を完了にする
      await request(app).put(`/todos/${res1.body.id}/complete`);

      const response = await request(app)
        .get('/todos?completed=true')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].completed).toBe(true);
      expect(response.body[0].title).toBe('Task 1');
    });

    test('completed=falseで未完了Todoのみ取得できること', async () => {
      // Todoを作成
      const res1 = await request(app).post('/todos').send({ title: 'Task 1' });
      await request(app).post('/todos').send({ title: 'Task 2' });

      // 1つ目を完了にする
      await request(app).put(`/todos/${res1.body.id}/complete`);

      const response = await request(app)
        .get('/todos?completed=false')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].completed).toBe(false);
      expect(response.body[0].title).toBe('Task 2');
    });
  });

  describe('PUT /todos/:id/complete', () => {
    test('Todoの完了ステータスが更新されること', async () => {
      // Todoを作成
      const createResponse = await request(app)
        .post('/todos')
        .send({ title: 'テストタスク' });

      const todoId = createResponse.body.id;

      // Todoを完了にする
      const updateResponse = await request(app)
        .put(`/todos/${todoId}/complete`)
        .expect(200);

      expect(updateResponse.body.completed).toBe(true);
      expect(updateResponse.body.id).toBe(todoId);
      expect(updateResponse.body.title).toBe('テストタスク');
    });

    test('存在しないIDで更新するとエラーになること', async () => {
      const response = await request(app)
        .put('/todos/non-existent-id/complete')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Todo not found',
      });
    });
  });

  describe('DELETE /todos/:id', () => {
    test('Todoが削除できること', async () => {
      // Todoを作成
      const createResponse = await request(app)
        .post('/todos')
        .send({ title: '削除するタスク' });

      const todoId = createResponse.body.id;

      // Todoを削除
      const deleteResponse = await request(app)
        .delete(`/todos/${todoId}`)
        .expect(200);

      expect(deleteResponse.body.id).toBe(todoId);

      // 削除されたことを確認
      const getResponse = await request(app).get('/todos');
      expect(getResponse.body).toHaveLength(0);
    });

    test('存在しないIDで削除するとエラーになること', async () => {
      const response = await request(app)
        .delete('/todos/non-existent-id')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Todo not found',
      });
    });
  });

  describe('エラーハンドリング', () => {
    test('不正なJSONを送信するとエラーになること', async () => {
      const response = await request(app)
        .post('/todos')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid JSON',
      });
    });
  });
});
