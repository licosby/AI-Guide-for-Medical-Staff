// jcaho-rules.js
// Basic JCAHO compliance and safety rules dataset

const jcahoRules = [
  {
    category: "Patient Safety",
    rule: "Clinical decisions must prioritize patient safety and minimize risk of harm."
  },
  {
    category: "Ethical Standards",
    rule: "AI recommendations must align with hospital ethics policies and respect patient autonomy."
  },
  {
    category: "Documentation",
    rule: "AI-assisted decisions must be documented with rationale and clinician oversight."
  },
  {
    category: "Privacy",
    rule: "Patient data must be handled according to HIPAA and Joint Commission confidentiality standards."
  },
  {
    category: "Accountability",
    rule: "Clinicians remain responsible for final decisions; AI tools serve as support only."
  }
];

const complianceRules = [
  {
    triggerWords: ["wrong dose", "no consent", "privacy breach", "unsafe", "error", "neglect"],
    alert: "⚠️ Compliance Alert: Potential violation of JCAHO or hospital safety standards detected."
  }
];
