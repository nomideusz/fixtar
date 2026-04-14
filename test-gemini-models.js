import dotenv from "dotenv";
dotenv.config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  const models = data.models.filter(m => m.name.includes("imagen")).map(m => m.name);
  console.log("Imagen models:", models);
}
test();
