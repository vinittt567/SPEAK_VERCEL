import { createServer } from "./server/index.js";
import { connectToDatabase } from "./server/database/connection.js";

const app = createServer();
const port = process.env.PORT || 3000;

// Connect to database
connectToDatabase();

app.listen(port, () => {
  console.log(`🚀 SPEAK Server running on port ${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`🔒 Auth: http://localhost:${port}/api/auth`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});