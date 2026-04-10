# ♻️ Device Repurposing Assistant

The **Device Repurposing Assistant** is an AI-powered SaaS platform that helps reduce global e-waste by identifying old electronics and securely generating tailored, step-by-step DIY projects to give them a second life.

Built using modern Next.js 16 architecture, this highly-responsive frontend seamlessly interfaces with a standalone FastAPI vision-and-LLM microservice.

**🔗 Live Demo:** [https://device-repurposing-assistant.vercel.app](https://device-repurposing-assistant.vercel.app)
---

## 🚀 Key Features

*   **Automated Device Detection:** Upload an image of an old phone, tablet, or gadget and have the AI system extract the brand, model, and physical condition. (Manual overrides are also supported).
*   **Hardware Knowledge Extraction:** Automatically queries device databases to identify the physical components (e.g., Logic boards, Cameras, Batteries) and capabilities (Bluetooth, Wi-Fi) of the confirmed device.
*   **AI Project Brainstorming:** A Retrieval-Augmented Generation (RAG) pipeline evaluates the device's hardware context and brainstorms Easy, Medium, and Hard DIY maker projects—complete with full execution steps.
*   **Premium Dashboard UI:** A highly responsive, slick web aesthetic utilizing elevated cards, atomic components, and `next-themes` for instantaneous Light/Dark mode transitions.

## 🛠 Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Core:** React 19
*   **Styling:** Tailwind CSS v4 (Vanilla API)
*   **Theming:** `next-themes` (0-Lag Transitions via React Context)
*   **Language:** TypeScript
*   **Icons:** `lucide-react`

---

## ⚙️ Run Locally

To get the application running on your local machine for development:

1. **Ensure you have Node.js installed.**
2. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```
3. **Install the dependencies:**
   ```bash
   npm install
   ```
4. **Spin up the development server:**
   ```bash
   npm run dev
   ```
   *The server will typically start at [http://localhost:3000](http://localhost:3000)*

---

## 📡 API Architecture & User Flow

This frontend acts as a highly responsive client, transmitting stateless execution data across 4 distinct steps to the production Python backend (`device-rag-backend.onrender.com`).

*   **Step 1:** `POST /api/detect-device` ➔ Ingests user image `FormData` and outputs an initial `device_id` and confidence guess.
*   **Step 2:** `POST /api/confirm-device` ➔ Contextualization interface allowing manual overrides/corrections from the user.
*   **Step 3:** `POST /api/device-specs` ➔ Triggers specialized database extraction for specific components and capabilities.
*   **Step 4:** `POST /api/generate-ideas` ➔ Triggers the LLM intelligence agent to map the capabilities into segmented DIY execution guides.

*(Note: User session state is locally managed utilizing `sessionStorage` globally across these routes to ensure the backend remains stateless/RESTful).*
