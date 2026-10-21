const output = document.querySelector("#output");
const progressBar = document.querySelector("#model-progress");
const button = document.querySelector("#send");
const promptBox = document.querySelector("#prompt");

button.disabled = true;

try {
  const engine = await CreateMLCEngine(modelId, {
    initProgressCallback: ({ progress, text }) => {
      const percent = Math.round(progress * 100);

      progressBar.value = percent;
      output.textContent = `Loading model (~1GB)… ${percent}% — ${text}`;
    },
  });

  output.textContent = "Model ready.";
  progressBar.value = 100;
  button.disabled = false;

  button.addEventListener("click", async () => {
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
} catch (error) {
  output.textContent = `Model failed to load: ${error.message}`;
}
