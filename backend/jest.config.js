module.exports = {
  coverageReporters: ["lcov", "text-summary"],
  collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js"],
  testEnvironment: "node",
  verbose: true,
};
