// Detect correct path depending on whether you're in /pages/ or root
const path = window.location.pathname.includes("/pages/")
  ? "../components/ai-assistant.html"
  : "components/ai-assistant.html";

// Load the AI assistant component
fetch(path)
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML("beforeend", html);
  });
