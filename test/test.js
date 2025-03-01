const request = require("supertest");
var assert = require("assert");
const app = require("../index");
const Mocha = require("mocha");
/**
 * Testing create game endpoint
 */
describe("POST /api/games", function () {
  let data = {
    publisherId: "1234567890",
    name: "Test App",
    platform: "ios",
    storeId: "1234",
    bundleId: "test.bundle.id",
    appVersion: "1.0.0",
    isPublished: true,
  };
  it("respond with 200 and an object that matches what we created", function (done) {
    request(app)
      .post("/api/games")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.publisherId, "1234567890");
        assert.strictEqual(result.body.name, "Test App");
        assert.strictEqual(result.body.platform, "ios");
        assert.strictEqual(result.body.storeId, "1234");
        assert.strictEqual(result.body.bundleId, "test.bundle.id");
        assert.strictEqual(result.body.appVersion, "1.0.0");
        assert.strictEqual(result.body.isPublished, true);
        done();
      });
  });
});

/**
 * Testing get all games endpoint
 */
describe("GET /api/games", function () {
  it("respond with json containing a list that includes the game we just created", function (done) {
    request(app)
      .get("/api/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body[0].publisherId, "1234567890");
        assert.strictEqual(result.body[0].name, "Test App");
        assert.strictEqual(result.body[0].platform, "ios");
        assert.strictEqual(result.body[0].storeId, "1234");
        assert.strictEqual(result.body[0].bundleId, "test.bundle.id");
        assert.strictEqual(result.body[0].appVersion, "1.0.0");
        assert.strictEqual(result.body[0].isPublished, true);
        done();
      });
  });
});

/**
 * Testing update game endpoint
 */
describe("PUT /api/games/1", function () {
  let data = {
    id: 1,
    publisherId: "999000999",
    name: "Test App Updated",
    platform: "android",
    storeId: "5678",
    bundleId: "test.newBundle.id",
    appVersion: "1.0.1",
    isPublished: false,
  };
  it("respond with 200 and an updated object", function (done) {
    request(app)
      .put("/api/games/1")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.publisherId, "999000999");
        assert.strictEqual(result.body.name, "Test App Updated");
        assert.strictEqual(result.body.platform, "android");
        assert.strictEqual(result.body.storeId, "5678");
        assert.strictEqual(result.body.bundleId, "test.newBundle.id");
        assert.strictEqual(result.body.appVersion, "1.0.1");
        assert.strictEqual(result.body.isPublished, false);
        done();
      });
  });
});

/**
 * Testing delete game endpoint
 */
describe("DELETE /api/games/1", function () {
  it("respond with 200", function (done) {
    request(app)
      .delete("/api/games/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

/**
 * Testing populate games endpoint
 */
describe("POST /api/games/populate", function () {
  it("should populate games and return them", async () => {
    request(app)
      .post("/api/games/populate")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(Array.isArray(result.body), true);
        assert.ok(result.body.length > 0);

        // Verify structure of first game
        const game = result.body[0];
        assert.ok(game.hasOwnProperty("publisherId"));
        assert.ok(game.hasOwnProperty("name"));
        assert.ok(game.hasOwnProperty("platform"));
        assert.ok(game.hasOwnProperty("storeId"));
        assert.ok(game.hasOwnProperty("bundleId"));
        assert.ok(game.hasOwnProperty("appVersion"));
        assert.ok(game.hasOwnProperty("isPublished"));
        done();
      });
  });
});

/**
 * Testing search games endpoint
 */
describe("POST /api/games/search", function () {
  Mocha.beforeEach(async () => {
    await request(app).post("/api/games").send({
      publisherId: "111111111",
      name: "Car Game",
      platform: "ios",
      storeId: "1111",
      bundleId: "test1.bundle.id",
      appVersion: "1.0.0",
      isPublished: true,
    });

    await request(app).post("/api/games").send({
      publisherId: "222222222",
      name: "Racing Game",
      platform: "android",
      storeId: "2222",
      bundleId: "test2.bundle.id",
      appVersion: "1.0.1",
      isPublished: false,
    });
  });

  it("respond with 200 and all games when no filters are provided", function (done) {
    request(app)
      .post("/api/games/search")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.length >= 2, true);
        done();
      });
  });

  it("respond with 200 and matching games when searching by platform", function (done) {
    request(app)
      .post("/api/games/search")
      .send({ platform: "ios" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.length >= 1, true);
        assert.strictEqual(result.body[0].platform, "ios");
        done();
      });
  });

  it("respond with 200 and matching games when searching by both name and platform", function (done) {
    request(app)
      .post("/api/games/search")
      .send({ name: "Car", platform: "ios" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.length >= 1, true);
        assert.strictEqual(result.body[0].name.includes("Car"), true);
        assert.strictEqual(result.body[0].platform, "ios");
        done();
      });
  });

  it("respond with 200 and empty array when no matches found", function (done) {
    request(app)
      .post("/api/games/search")
      .send({ name: "NonExistent", platform: "windows" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.length, 0);
        done();
      });
  });
  Mocha.afterEach(async () => {
    await request(app).delete("/api/games/1");
    await request(app).delete("/api/games/2");
  });
});

/**
 * Testing get all games endpoint
 */
describe("GET /api/games", function () {
  Mocha.before(async () => {
    const games = await request(app).get("/api/games");
    for (const game of games.body) {
      await request(app).delete(`/api/games/${game.id}`);
    }
  });
  it("respond with json containing no games", function (done) {
    request(app)
      .get("/api/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.length, 0);
        done();
      });
  });
});
