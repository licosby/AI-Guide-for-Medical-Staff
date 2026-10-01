# **AI Guide for Medical Staff**

## **What is this?**

AI Guide for Medical Staff is an interactive, clinician‑focused training tool that demonstrates how AI‑assisted treatment plans can be made transparent, explainable, and safe. It provides modules for exploring risk scoring, bias detection, safety considerations, and explainability — helping clinicians understand _how_ AI reaches its recommendations.

---

## **Why does it exist?**

As AI becomes more common in healthcare, clinicians need tools that reveal:

- **How**  
    AI forms its recommendations
- **Where**  
    risks or biases may appear
- **What**  
    clinical factors influence decision‑making
- **Why**  
    certain alerts or risk scores are triggered

This project creates a safe, educational environment for learning these concepts without using real patient data. It models human‑centered AI design and demonstrates how transparency builds clinician trust.

---

## **What tools did I use?**

- **React (TypeScript)**  
    — modular component architecture
- **Vite**  
    — fast development server and build pipeline
- **TypeScript**  
    — type‑safe medical logic and rule calculations
- **Google Gemini**  
    — assisted with structured medical logic and UI flow
- **GitHub Copilot**  
    — supported early development during Project 01 
- **VS Code**  
    — primary development environment
- **Netlify + GitHub**  
    — deployment and continuous integration

---

## **How to access it**

- **Live Site:**  
    👉 https://hcaicompliantassistant.netlify.app
- **Run Locally:**
    
    ```bash
    npm install
    npm run dev
    ```
    
    Then open the local development URL provided by Vite.

---

## **What changed from Project 01 to Project 02**

- Rebuilt from static HTML/CSS/JS into a full **React + Vite + TypeScript** application
- Added **Risk‑to‑Human Calculator** with weighted scoring logic
- Added **Explainability Viewer** with reasoning paths and factor breakdowns
- Added **Safe‑AI Decision Tree** for visualizing clinical logic flow
- Improved **responsive design**, spacing, hierarchy, and clinician‑focused UI
- Introduced **modular architecture** for scalability and maintainability
- Deployed via **Netlify** for faster updates and automated builds

---

**Built for Healthcare. Designed for Safety.** HIPAA‑aware • Joint Commission Aligned (prototype) • Clinician‑focused _Not valid legal medical advice._
