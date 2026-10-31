# ⚡ IntellMeet AI — Enterprise Meeting & Collaboration Platform

> An ultra-interactive, production-grade demo website for **IntellMeet AI**, built with **HTML5, CSS3, and JavaScript (ES6+)** featuring **WebRTC video conferencing, OpenAI realtime transcription & diarization, smart action item extraction, and live AI Copilot.**

🔗 **Live Demo:** [https://effervescent-licorice-3aacb8.netlify.app/](https://effervescent-licorice-3aacb8.netlify.app/)  
💻 **GitHub Repository:** [https://github.com/bipulsinghaniya/IntellMeet](https://github.com/bipulsinghaniya/IntellMeet)  
📄 **Written Documentation (PDF):** [IntellMeet_Documentation.pdf](https://drive.google.com/file/d/1sPQcuXVjvMEfNEx3zRTB9djf9qnULVoH/view)  
📹 **Video Demo / Drive Recording:** [Watch the project recording](https://drive.google.com/file/d/13QeOQaMQXLbKN1MC3Gn6lPSwYj5cQMbY/view?usp=sharing)

---

## 🌟 Key Features & Interactive Capabilities

### 1. 🎥 Live Interactive Meeting Room ("IntellMeet Studio")
- **Real Camera Feed & Avatar Fallback:** Connects to real webcam via `navigator.mediaDevices.getUserMedia` or seamlessly switches to dynamic voice-reactive animated avatars.
- **4-Participant Video Conference Grid:** Real-time speaker diarization, animated audio visualizer waves, speaking indicators, and name tags.
- **Microphone Controls & Equalizer:** Real-time mute/unmute toggling with custom audio feedback.
- **Interactive Presentation Screen Share:** Displays live engineering architecture slides with MongoDB Atlas latency benchmarks.
- **Physics Reaction Emoji Cannon:** Click reactions (👏, 🎉, ❤️, 🚀, 🔥, 💡) to burst floating animated emojis across the stage.
- **Web Speech API Integration:** Transcribes your real microphone voice directly into the meeting stream in real-time.

### 2. 🧠 Real-Time AI Meeting Copilot ("Ask IntellMeet")
- Ask questions directly to the in-meeting AI copilot (e.g. *"What decisions have been made so far?"*, *"Who owns the migration?"*, *"Draft a 3-bullet summary"*).
- Instant streaming responses with typing animations.

### 3. ✅ Smart Action Item Extractor & Live Kanban
- Tasks automatically extract from spoken dialogue with priority tags (**High**, **Medium**, **Low**) and assignees.
- Check off items to watch the progress bar and completion percentage dynamically calculate.
- "+ Add Task" button to insert custom tasks on the fly.

### 4. 🧪 Standalone AI Intelligence Lab / Playground
- Select from 3 real-world enterprise scenarios (*Sprint Planning & Cloud Migration*, *Executive Board Review*, *SOC-2 Security Audit*) or paste your own meeting transcript.
- Click **"Run IntellMeet AI Pipeline"** to trigger a 4-step animated NLP processing pipeline (*Diarization → Context Extraction → Action Mapping → Sentiment Analysis*).

### 5. 🏗️ MERN + WebRTC + OpenAI Architecture Explorer
- Clickable architecture cards for **React Client**, **Socket.io Signaling**, **Node.js Gateway**, **MongoDB Atlas**, **OpenAI Pipeline**, and **Security & E2EE**.
- Dynamically updates live code snippets and technical specifications.

### 6. 📊 Interactive Organization ROI Calculator
- Interactive sliders for **Team Size**, **Meetings per Week**, and **Hourly Rate**.
- Real-time calculations of annual financial savings ($), hours saved per person, and reclaimed company hours.

### 7. 🔊 Web Audio API Synthesizer
- Built-in zero-dependency procedural audio synthesizer providing subtle futuristic audio cues for room joins, clicks, emoji pops, and task completion (with mute button in the header).

---

## 🚀 How to Run the Website

### Option 1: Direct Browser Launch (No installation required)
Simply double-click or open **`index.html`** in any modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).

### Option 2: Local HTTP Server (Optional)
If you have Node.js installed, you can start a local development server from this directory:
```bash
npx serve .
# or
npx live-server
```
Then open `http://localhost:3000` or `http://localhost:8080`.

---

## 📁 File Structure

```
├── index.html                  # Semantic HTML5 structure, modals, layouts, and Lucide icons
├── style.css                   # Modern glassmorphism dark-theme design system and responsive grid
├── app.js                      # Realtime meeting simulator, Web Audio synthesizer, WebRTC, AI Copilot
├── IntellMeet_Documentation.pdf # Comprehensive 8-page technical documentation & architecture report
├── FEEDBACK.md                 # Personal reflection, learnings, challenges faced & takeaways
├── task.md                     # Project specification brief
└── README.md                   # Documentation and walkthrough
```
