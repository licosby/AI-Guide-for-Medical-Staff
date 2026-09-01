function runLocalAI() {
  const input = document.getElementById("aiInput").value.toLowerCase();
  const output = document.getElementById("aiOutput");

  if (input.includes("pain")) {
    output.textContent = "AI suggests assessing severity and checking for red‑flag symptoms.";
  } else if (input.includes("medication")) {
    output.textContent = "AI recommends reviewing dosage, interactions, and patient history.";
  } else if (input.includes("side effects")) {
    output.textContent = "AI advises comparing treatment options for risk versus comfort.";
  } else {
    output.textContent = "AI cannot determine risk. Human oversight required.";
  }
}
// JCAHO compliance checks
if (input.includes("jacho") || input.includes("joint commission") || input.includes("policy")) {
  let response = "JCAHO Compliance Rules:\n\n";
  jachoRules.forEach(rule => {
    response += `• ${rule.category}: ${rule.rule}\n`;
  });
  output.textContent = response;
  return;
}

if (input.includes("ethics")) {
  output.textContent = jachoRules.find(r => r.category === "Ethical Standards").rule;
  return;
}

if (input.includes("privacy")) {
  output.textContent = jachoRules.find(r => r.category === "Privacy").rule;
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
