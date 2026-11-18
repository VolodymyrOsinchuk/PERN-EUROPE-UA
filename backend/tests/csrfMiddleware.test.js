const test = require("node:test");
const assert = require("node:assert/strict");
const csrfMiddleware = require("../middleware/csrfMiddleware");

const middleware = csrfMiddleware(["https://frontend.example"]);

function invoke({ method = "POST", headers = {}, cookies = {} } = {}) {
  let nextCalled = false;
  let statusCode = null;
  const req = {
    method,
    headers,
    cookies,
    get(name) {
      return headers[name.toLowerCase()];
    },
  };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json() {
      return this;
    },
  };

  middleware(req, res, () => {
    nextCalled = true;
  });

  return { nextCalled, statusCode };
}

test("allows safe methods with a cookie", () => {
  assert.equal(invoke({ method: "GET", cookies: { token: "session" } }).nextCalled, true);
});

test("allows cookie-authenticated writes from the configured origin", () => {
  const result = invoke({
    cookies: { token: "session" },
    headers: { origin: "https://frontend.example" },
  });
  assert.equal(result.nextCalled, true);
});

test("allows a configured referer when Origin is absent", () => {
  const result = invoke({
    cookies: { token: "session" },
    headers: { referer: "https://frontend.example/profile" },
  });
  assert.equal(result.nextCalled, true);
});

test("rejects cookie-authenticated writes from untrusted or missing origins", () => {
  assert.equal(
    invoke({
      cookies: { token: "session" },
      headers: { origin: "https://attacker.example" },
    }).statusCode,
    403,
  );
  assert.equal(invoke({ cookies: { token: "session" } }).statusCode, 403);
});

test("does not block bearer-authenticated or anonymous writes", () => {
  assert.equal(
    invoke({ headers: { authorization: "Bearer token" } }).nextCalled,
    true,
  );
  assert.equal(invoke().nextCalled, true);
});
