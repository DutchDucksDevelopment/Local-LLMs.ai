import { CreateMLCEngine } from "@mlc-ai/web-llm";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { prebuiltAppConfig } from "@mlc-ai/web-llm";

const output = document.querySelector("#output");
const outputtext = document.getElementById("outputtext")
const progressBar = document.querySelector("#model-progress");
const button = document.querySelector("#send");
const promptBox = document.querySelector("#prompt");
const loadbutton = document.getElementById("load");
const modeldropdown = document.getElementById("modeldropdown");
const modelselector = document.getElementById("modelselector");
const sendbar = document.getElementById("sendbar");

if (localStorage.getItem("modelId")) {
	modeldropdown.value = localStorage.getItem("modelId")
}


button.disabled = true;
console.log(prebuiltAppConfig.model_list.map((model) => model.model_id));

loadbutton.addEventListener("click", async () => {
	localStorage.setItem("modelId", modeldropdown.value)
	progressBar.style.display = "flex";
	outputtext.style.display = "flex";
	console.log(modeldropdown.value)
	let modelId = modeldropdown.value;
	console.log(modelId)
	try {
		outputtext.textContent = `Loading model ${modelId}...`;
		const engine = await CreateMLCEngine(modelId, {
			initProgressCallback: ({ progress, text }) => {
				const percent = Math.round(progress * 100);

				progressBar.value = percent;
				outputtext.textContent = `Loading model ${modelId}... ${percent}% — ${text}`;
			},
		});

		outputtext.textContent = "Model ready.";
		progressBar.value = 100;
		progressBar.remove();
		button.disabled = false;
		modelselector.style.display = "none";
		sendbar.style.display = "flex";
		
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
				outputtext.textContent = `Error: ${error.message}`;
			} finally {
				button.disabled = false;
			}
		});
} 	catch (error) {
		outputtext.style.display = "flex";
		output.textContent = `Model failed to load: ${error.message}`;
	}
})
