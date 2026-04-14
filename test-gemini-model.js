import dotenv from "dotenv";
dotenv.config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001?key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  console.log("Model Info:", JSON.stringify(data, null, 2));
}
test();
