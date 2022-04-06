module.exports = {
  roots: ["<rootDir>/src"],
  testRegex: "(/src/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    // Handle module aliases
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
