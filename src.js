import { CreateMLCEngine } from "@mlc-ai/web-llm";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { prebuiltAppConfig } from "@mlc-ai/web-llm";

let modelId = "Qwen3.5-0.8B-q4f16_1-MLC";
const output = document.querySelector("#output");
const outputtext = document.getElementById("outputtext")
const progressBar = document.querySelector("#model-progress");
const button = document.querySelector("#send");
const promptBox = document.querySelector("#prompt");

button.disabled = true;
console.log(prebuiltAppConfig.model_list.map((model) => model.model_id));


try {
  const engine = await CreateMLCEngine(modelId, {
    initProgressCallback: ({ progress, text }) => {
      const percent = Math.round(progress * 100);

      progressBar.value = percent;
      outputtext.textContent = `Loading model Qwen3.5 0.8B (~1GB)… ${percent}% — ${text}`;
    },
  });

  outputtext.textContent = "Model ready.";
  progressBar.value = 100;
  progressBar.remove();
  button.disabled = false;

  button.addEventListener("click", async () => {
    button.disabled = true;
    outputtext.style.display = "flex";
    outputtext.textContent = "Generating…";

    try {
      const response = await engine.chat.completions.create({
        messages: [{ role: "user", content: promptBox.value }],
      });

      let replytext = DOMPurify.sanitize(
		marked.parse(response.choices[0].message.content)
	  );
	  output.insertAdjacentHTML("beforeend", replytext);
	  outputtext.style.display = "none";
    } catch (error) {
      output.textContent = `Error: ${error.message}`;
    } finally {
      button.disabled = false;
    }
  });
} catch (error) {
  outputtext.style.display = "flex";
  output.textContent = `Model failed to load: ${error.message}`;
}
