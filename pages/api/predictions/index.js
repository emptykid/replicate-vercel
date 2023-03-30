import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const modelList = [
      "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf", // stable diffusion
      "9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb", // lora
      "436b051ebd8f68d23e83d22de5e198e0995357afef113768c20f0b6fcef23c8b", // midjourney diffusion
      "9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb", // openjourney
  ];

  console.log(req.body.prompt);
  console.log('model: ' + req.body.model);

  const prediction = await replicate.predictions.create({
    // Pinned to a specific version of Stable Diffusion
    // See https://replicate.com/stability-ai/stable-diffussion/versions
    //version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
    version: modelList[parseInt(req.body.model) - 1],

    // This is the text prompt that will be submitted by a form on the frontend
    input: { prompt: req.body.prompt },
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
