import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function test() {
  const transport = new SSEClientTransport(new URL("http://localhost:3000/api/mcp/sse"));
  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );

  try {
    console.log("Connecting to local MCP server...");
    await client.connect(transport);
    console.log("Connected!");

    console.log("Listing tools...");
    const tools = await client.listTools();
    console.log("Tools found:", JSON.stringify(tools, null, 2));

    console.log("Testing search_hotels tool...");
    const result = await client.callTool({
      name: "search_hotels",
      arguments: { query: "Jakarta" }
    });
    console.log("Search result:", JSON.stringify(result, null, 2));

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

test();
