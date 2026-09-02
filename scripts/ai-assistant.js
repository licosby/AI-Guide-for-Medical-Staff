document.addEventListener("DOMContentLoaded", () => {
  window.runLocalAI = function() {
    const input = document.getElementById("aiInput").value.toLowerCase();
    const output = document.getElementById("aiOutput");

    // JCAHO compliance checks
    if (input.includes("jcaho") || input.includes("joint commission") || input.includes("policy")) {
      let response = "JCAHO Compliance Rules:\n\n";
      jcahoRules.forEach(rule => {
        response += `• ${rule.category}: ${rule.rule}\n`;
      });
      output.textContent = response;
      return;
    }

    if (input.includes("ethics")) {
      output.textContent = jcahoRules.find(r => r.category === "Ethical Standards").rule;
      return;
    }

    if (input.includes("privacy")) {
      output.textContent = jcahoRules.find(r => r.category === "Privacy").rule;
      return;
    }

    // Compliance checking
    for (const rule of complianceRules) {
      for (const word of rule.triggerWords) {
        if (input.includes(word)) {
          output.textContent = `⚠️ Compliance Alert: ${rule.alert}`;
          return;
        }
      }
    }

    output.textContent = "AI cannot determine risk. Human oversight required.";
  };
});
