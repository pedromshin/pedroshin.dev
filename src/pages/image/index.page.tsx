import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import { Loader } from "@mantine/core";

const containerStyle = {
  margin: "0 auto",
  padding: "20px",
  display: "flex",
  gap: 40,
};

const formStyle = {
  marginTop: "20px",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "100%",
  outline: "none",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "100%",
  outline: "none",
  marginTop: "20px",
};

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

const config = new Configuration({
  apiKey: OPEN_AI_KEY,
});

const openAI = new OpenAIApi(config);

function App() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const width = 512;
  const height = 512;

  const generateImage = async () => {
    setLoading(true);
    const res = await openAI.createImage({
      prompt: prompt,
      n: 1,
      size: `${width}x${height}`,
    });

    setLoading(false);

    const image = res?.data?.data?.[0]?.url;

    if (image) setResult(image);
  };

  return (
    <div style={{ ...containerStyle, flexDirection: "column" }}>
      <div>
        <h2>Generate an Image using Open AI API</h2>
        <form onSubmit={generateImage} style={formStyle}>
          <input
            value={prompt}
            placeholder="Search Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh.."
            onChange={(e) => setPrompt(e.target.value)}
            style={inputStyle}
          />
        </form>
        <button onClick={generateImage} style={buttonStyle}>
          Generate
        </button>
      </div>
      <>
        {!loading ? (
          result.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="result-image"
              src={result}
              alt="result"
              width={width}
              height={height}
            />
          ) : (
            <></>
          )
        ) : (
          <Loader />
        )}
      </>
    </div>
  );
}

export default App;
