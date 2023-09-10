const request = require("supertest")
const app = require('../app')

describe("GET /products", () => {
  it("should return all products", () => {
    return request(app)
      .get('/products')
      .expect(200)
  });
});

describe("POST /product", () => {
  it("should create a product", () => {
    return request(app)
      .post('/products')
      .set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGZiMmExN2QwMzYwMmNhMTM0NDhmNjIiLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwibmFtZSI6IktKdWFuIiwic3RyZWV0IjoiY2F2YW5pbGFhcyIsIm51bWJlciI6MywiaWF0IjoxNjk0MzUxMzQ5LCJleHAiOjE2OTQzNTg1NDl9.BLGFG6iKn5BaHcH230qCznWFfagR5Q-DW5C6s7SHicA'})
      .send({
        "name": "Objecto de tests",
        "description": "secret",
        "category": "gold",
        "price": 15
    })
      .expect(201)
  });
});