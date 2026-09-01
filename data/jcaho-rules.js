const jachoRules = [
  {
    category: "Patient Safety",
    rule: "All clinical decisions must prioritize patient safety and minimize risk of harm."
  },
  {
    category: "Ethical Standards",
    rule: "AI recommendations must align with hospital ethics policies and respect patient autonomy."
  },
  {
    category: "Documentation",
    rule: "Every AI‑assisted decision must be documented with rationale and clinician oversight."
  },
  {
    category: "Privacy",
    rule: "Patient data must be anonymized and handled according to HIPAA and JCAHO confidentiality standards."
  },
  {
    category: "Accountability",
    rule: "Clinicians remain responsible for final decisions; AI tools serve as support only."
  }
];
const complianceRules = [
  {
    category: "Medication Safety",
    triggerWords: ["wrong dose", "double dose", "contraindicated", "unsafe medication"],
    alert: "This treatment plan may violate JCAHO medication safety standards."
  },
  {
    category: "Patient Consent",
    triggerWords: ["no consent", "without consent", "forced treatment"],
    alert: "JCAHO requires documented informed consent before treatment."
  },
  {
    category: "Documentation",
    triggerWords: ["not documented", "missing documentation", "no chart note"],
    alert: "JCAHO mandates complete documentation for all clinical decisions."
  },
  {
    category: "Privacy",
    triggerWords: ["shared patient info", "public data", "no privacy"],
    alert: "This violates HIPAA and Joint Commission confidentiality standards."
  },
  {
    category: "Ethical Standards",
    triggerWords: ["bias", "discrimination", "unfair treatment"],
    alert: "This may violate JCAHO ethical care requirements."
  }
];
