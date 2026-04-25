import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

describe('TaskFlow API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 1. Login
  describe('Auth', () => {
    it('POST /auth/login — should return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'doris@acme.com', password: 'admin123' })
        .expect(201);

      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      accessToken = res.body.data.accessToken;
    });
  });

  // 2. Projects
  describe('Projects', () => {
    it('POST /projects — should create a project', async () => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Proyecto E2E', description: 'Test e2e' })
        .expect(201);

      expect(res.body.data.name).toBe('Proyecto E2E');
      projectId = res.body.data.id;
    });

    it('GET /projects — should return paginated projects', async () => {
      const res = await request(app.getHttpServer())
        .get('/projects?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta).toBeDefined();
    });

    it('GET /projects/:id — should return one project', async () => {
      const res = await request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.id).toBe(projectId);
    });
  });

  // 3. Tasks
  describe('Tasks', () => {
    it('POST /projects/:projectId/tasks — should create a task', async () => {
      const res = await request(app.getHttpServer())
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Tarea E2E', priority: 'HIGH' })
        .expect(201);

      expect(res.body.data.title).toBe('Tarea E2E');
      taskId = res.body.data.id;
    });

    it('GET /projects/:projectId/tasks — should return tasks', async () => {
      const res = await request(app.getHttpServer())
        .get(`/projects/${projectId}/tasks?page=1&limit=10`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // 4. Comments
  describe('Comments', () => {
    it('POST /tasks/:taskId/comments — should create a comment', async () => {
      const res = await request(app.getHttpServer())
        .post(`/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Comentario E2E' })
        .expect(201);

      expect(res.body.data.content).toBe('Comentario E2E');
    });

    it('GET /tasks/:taskId/comments — should return comments', async () => {
      const res = await request(app.getHttpServer())
        .get(`/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // 5. Validaciones
  describe('Validations', () => {
    it('POST /projects — should return 400 with empty body', async () => {
      await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });

    it('GET /projects — should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/projects')
        .expect(401);
    });

    it('GET /projects/invalid-uuid — should return 400', async () => {
      await request(app.getHttpServer())
        .get('/projects/banana')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });
});