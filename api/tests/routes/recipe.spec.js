/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Recipe, conn } = require('../../src/db.js');

const agent = session(app);
const recipe = {
  name: "Test recipe",
  summary: "Soy el summary",
  spoonacularScore: 97,
  healthScore: 40
};
var id

describe('Recipe routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Recipe.sync({ force: true })
    .then(() => Recipe.create(recipe)));

  describe('GET /api/recipes', () => {
    it('should get the recipes with code 200', () =>
      agent.get('/api/recipes').expect(200)
    );
  });

  describe('GET /api/recipes?name=Test', () => {
    it('should get the recipes that includes the query with code 200', () =>
      agent.get('/api/recipes?name=Test')
      .expect(200)
      .expect(res => {
        expect(res.body[0]?.name).equal('Test recipe')
      })
    );

    it('should send a message if no recipes are found with the query', () =>
      agent.get('/api/recipes?name=TestNotFound')
      .expect(200)
      .expect(res => {
        expect(res.text).equal('No recipes found.')
      })
    );
  });

  

  describe('GET /api/recipes/id', () => {
    it('should get the recipe by id with code 200', () =>
      agent.get('/api/recipes')
      .expect(200)
      .expect(res => {
        agent.get('/api/recipes/' + res.body[10].id)
        .expect(res => {
          expect(res.body[0]?.name).equal('Test recipe')
        })
      })
    );
  });

  it('should send code 404 if not found', () =>
      agent.get('/api/recipes/asd')
      .expect(404)
    );
});


