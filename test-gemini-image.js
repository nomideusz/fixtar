import dotenv from "dotenv";
dotenv.config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  // Try generateImages method instead of predict
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [ { prompt: "A simple red cube on a white background." } ],
      parameters: { sampleCount: 1 }
    })
  });

  const data = await response.json();
  console.log("Status:", response.status);
  if (data.error) {
      console.log("Error:", data.error.message);
  } else {
      console.log("Success! Received keys:", Object.keys(data));
      if(data.predictions && data.predictions.length > 0) {
          console.log("Got image data!");
      }
  }
}
test();
