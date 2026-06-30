const request = require('supertest');
const { app } = require('../server');

describe('AI Controller API Endpoints', () => {
  describe('POST /api/ai/echo', () => {
    it('should return 400 if message is missing', async () => {
      const res = await request(app).post('/api/ai/echo').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Message is required');
    });

    it('should return a fallback response and sentiment analysis if no API key is provided', async () => {
      const res = await request(app).post('/api/ai/echo').send({ message: 'I feel very sad today.' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('response');
      expect(res.body).toHaveProperty('sentiment');
      expect(res.body.sentiment.emotion).toBe('sadness');
    });
  });

  describe('POST /api/ai/sentiment', () => {
    it('should analyze sentiment correctly', async () => {
      const res = await request(app).post('/api/ai/sentiment').send({ text: 'I am so happy and excited!' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.sentiment.emotion).toBe('joy');
    });

    it('should detect cognitive distortions like catastrophizing', async () => {
      const res = await request(app).post('/api/ai/sentiment').send({ text: 'This is the worst disaster ever.' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.distortion).toBe('Catastrophizing');
    });
  });

  describe('POST /api/ai/embed', () => {
    it('should return 400 if text is missing', async () => {
      const res = await request(app).post('/api/ai/embed').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Text is required');
    });

    it('should return a 768-dimensional embedding vector', async () => {
      const res = await request(app).post('/api/ai/embed').send({ text: 'I am meditating.' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('embedding');
      expect(Array.isArray(res.body.embedding)).toBe(true);
      expect(res.body.embedding.length).toBe(768);
    });
  });
});
