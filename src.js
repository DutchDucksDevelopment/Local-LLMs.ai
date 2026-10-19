import { CreateMLCEngine } from "/@mlc-ai/web-llm";

const output = document.querySelector("#output");
const button = document.querySelector("#send");
const promptBox = document.querySelector("#prompt");

// Choose a model ID available in this WebLLM version.
const modelId = "Llama-3.2-1B-Instruct-q4f32_1-MLC";

output.textContent = "Loading model…";

const engine = await CreateMLCEngine(modelId, {
  initProgressCallback: (progress) => {
    output.textContent = progress.text;
  },
});

output.textContent = "Model ready.";

button.addEventListener("click", async () => {
  console.log("yuh")
  button.disabled = true;
  output.textContent = "Generating…";

  try {
    const response = await engine.chat.completions.create({
      messages: [{ role: "user", content: promptBox.value }],
    });

    output.textContent = response.choices[0].message.content;
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
  } finally {
    button.disabled = false;
  }
});
