import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
        model: e.target.model.value
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>AI - Text2Image</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl"> 输入文字，生成图片 </h1>

      <form className="w-full flex flex-col" onSubmit={handleSubmit}>
        <div className={"mt-2 mb-2"}>选择模型：
          <select name="model">
            <option value="1">Stable Diffusion</option>
            <option value="2">Lora</option>
            <option value="3">Midjourney Diffusion</option>
            <option value="4">Openjourney</option>
            <option value="5">Midjourney</option>
          </select>
        </div>

        <p>使用英文输入</p>
        <div className={"w-full flex"}>
          <input
              type="text"
              className="flex-grow"
              name="prompt"
              placeholder="Enter a prompt to display an image"
          />
          <button className="button" type="submit">
            Go!
          </button>
        </div>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
        </>
      )}
    </div>
  );
}
