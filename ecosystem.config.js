module.exports = {
  apps: [
    {
      name: "shotlang",
      script: "run_production.py",
      interpreter: "python3",
      env: {
        PORT: 5100,
        HOST: "0.0.0.0",
        PYTHONUNBUFFERED: "1",
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
