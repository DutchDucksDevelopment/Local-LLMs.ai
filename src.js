import { CreateMLCEngine } from "@mlc-ai/web-llm";
import DOMPurify from "dompurify";
import { marked } from "marked";

const modelId = "Llama-3.2-1B-Instruct-q4f32_1-MLC";
const output = document.querySelector("#output");
const outputtext = document.getElementById("outputtext")
const progressBar = document.querySelector("#model-progress");
const button = document.querySelector("#send");
const promptBox = document.querySelector("#prompt");

button.disabled = true;

try {
  const engine = await CreateMLCEngine(modelId, {
    initProgressCallback: ({ progress, text }) => {
      const percent = Math.round(progress * 100);

      progressBar.value = percent;
      outputtext.textContent = `Loading model (~1GB)… ${percent}% — ${text}`;
    },
  });

  outputtext.textContent = "Model ready.";
  progressBar.value = 100;
  button.disabled = false;

  button.addEventListener("click", async () => {
    button.disabled = true;
    outputtext.textContent = "Generating…";

    try {
      const response = await engine.chat.completions.create({
        messages: [{ role: "user", content: promptBox.value }],
      });

      replytext = output.innerHTML = DOMPurify.sanitize(
		marked.parse(response.choices[0].message.content)
	  output.insertAdjacentHTML("beforeend", replytext);
	);
    } catch (error) {
      output.textContent = `Error: ${error.message}`;
    } finally {
      button.disabled = false;
    }
  });
} catch (error) {
  output.textContent = `Model failed to load: ${error.message}`;
}
