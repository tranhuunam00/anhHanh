const fs = require("node:fs");
const path = require("node:path");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return env;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        return env;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      env[key] = value.replace(/^["']|["']$/g, "");
      return env;
    }, {});
}

const env = {
  ...loadEnvFile(path.join(__dirname, ".env")),
  PORT: "3010"
};

module.exports = {
  apps: [
    {
      name: "hanh-chinh-cong-bot",
      script: "src/server.js",
      cwd: __dirname,
      env
    }
  ]
};
