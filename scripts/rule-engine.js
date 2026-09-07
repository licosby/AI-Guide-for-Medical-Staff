async function loadRules() {
    const response = await fetch("../scripts/rules.json");
    return await response.json();
}

async function analyzePlanText(planText) {
    const plan = planText.toLowerCase();
    const rules = await loadRules();

    let alerts = [];
    let score = 0;

    // Danger symptoms
    rules.dangerSymptoms.forEach(rule => {
        if (plan.includes(rule.term)) {
            alerts.push({ level: rule.level, msg: rule.msg });
            score += 10;
        }
    });

    // Missing info
    rules.missingInfo.forEach(rule => {
        if (!plan.includes(rule.term)) {
            alerts.push({ level: rule.level, msg: rule.msg });
            score += rule.level === "high" ? 5 : rule.level === "medium" ? 3 : 1;
        }
    });

    // Medication rules
    rules.medicationRules.forEach(rule => {
        if (rule.combo) {
            if (plan.includes(rule.combo[0]) && plan.includes(rule.combo[1])) {
                alerts.push({ level: rule.level, msg: rule.msg });
                score += 8;
            }
        } else if (plan.includes(rule.term) && !plan.includes(rule.requires)) {
            alerts.push({ level: rule.level, msg: rule.msg });
            score += 5;
        }
    });

    // Risk level
    let riskLevel = score >= 12 ? "HIGH RISK"
                 : score >= 6  ? "MODERATE RISK"
                 : "LOW RISK";

    return { alerts, score, riskLevel };
}
