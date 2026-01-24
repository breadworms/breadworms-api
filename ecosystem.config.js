module.exports = {
  apps: [
    {
      name: "breadworms-api",
      script: "./index.js",
      wait_ready: true,
      shutdown_with_message: true // Windows
    }
  ]
}
