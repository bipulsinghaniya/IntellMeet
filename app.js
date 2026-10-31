/**
 * IntellMeet AI - Enterprise Meeting & Collaboration Platform
 * Interactive Client Application & Realtime Simulator
 * Built for MERN + WebRTC + OpenAI Platform Demonstration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ==========================================================================
  // 1. Web Audio API Sound Synthesizer (Zero-asset audio cues)
  // ==========================================================================
  class SoundSynthesizer {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playChime(type = 'join') {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'join') {
        // Futuristic rising dual tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'pop') {
        // Soft bubble pop for emojis
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'ping') {
        // Crisp notification ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'click') {
        // Subtle toggle click
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'done') {
        // Major chord arpeggio for task/pipeline complete
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, idx) => {
          const subOsc = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();
          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
          subGain.gain.setValueAtTime(0.08, now + idx * 0.08);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
          subOsc.connect(subGain);
          subGain.connect(this.ctx.destination);
          subOsc.start(now + idx * 0.08);
          subOsc.stop(now + idx * 0.08 + 0.25);
        });
      }
    }
  }

  const sound = new SoundSynthesizer();

  const toggleAudioBtn = document.getElementById('toggleAudioBtn');
  if (toggleAudioBtn) {
    toggleAudioBtn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      toggleAudioBtn.classList.toggle('active', sound.enabled);
      toggleAudioBtn.innerHTML = sound.enabled
        ? '<i data-lucide="volume-2"></i>'
        : '<i data-lucide="volume-x"></i>';
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // ==========================================================================
  // 2. Interactive Canvas Particles Background
  // ==========================================================================
  const canvas = document.getElementById('canvas-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(width < 768 ? 30 : 65, 80);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse repulsion
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 80) {
          p.x += (mdx / mdist) * 1.5;
          p.y += (mdy / mdist) * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 172, 254, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  // Latency random micro-fluctuation in hero bar
  const metricLatency = document.getElementById('metricLatency');
  if (metricLatency) {
    setInterval(() => {
      const lat = Math.floor(16 + Math.random() * 6);
      metricLatency.textContent = lat;
    }, 3500);
  }

  // ==========================================================================
  // 3. Live Meeting Room Simulation Controller
  // ==========================================================================
  const meetingModal = document.getElementById('meetingModal');
  const openMeetingModalBtn = document.getElementById('openMeetingModalBtn');
  const heroLaunchBtn = document.getElementById('heroLaunchBtn');
  const closeMeetingModalBtn = document.getElementById('closeMeetingModalBtn');

  // Controls
  const toggleMicBtn = document.getElementById('toggleMicBtn');
  const toggleCamBtn = document.getElementById('toggleCamBtn');
  const toggleShareBtn = document.getElementById('toggleShareBtn');
  const toggleHandBtn = document.getElementById('toggleHandBtn');
  const endMeetingBtn = document.getElementById('endMeetingBtn');
  const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');

  // Media elements
  const localVideo = document.getElementById('localVideo');
  const userAvatarFallback = document.getElementById('userAvatarFallback');
  const userVideoCard = document.getElementById('userVideoCard');
  const userHandBadge = document.getElementById('userHandBadge');
  const micLabel = document.getElementById('micLabel');
  const camLabel = document.getElementById('camLabel');
  const screenShareView = document.getElementById('screenShareView');
  const closeScreenShareBtn = document.getElementById('closeScreenShareBtn');
  const emojiCannonLayer = document.getElementById('emojiCannonLayer');

  // State
  let isMeetingActive = false;
  let isMicMuted = false;
  let isCamActive = false;
  let isScreenSharing = false;
  let isHandRaised = false;
  let localStream = null;
  let meetingTimerInterval = null;
  let meetingSeconds = 252; // start at 04:12

  function formatTimer(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `00:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function startMeetingSimulation() {
    isMeetingActive = true;
    meetingModal.classList.add('open');
    meetingModal.setAttribute('aria-hidden', 'false');
    sound.playChime('join');

    // Timer
    if (meetingTimerInterval) clearInterval(meetingTimerInterval);
    meetingTimerInterval = setInterval(() => {
      meetingSeconds++;
      const timerEl = document.getElementById('meetingTimer');
      if (timerEl) timerEl.textContent = formatTimer(meetingSeconds);
    }, 1000);

    // Start auto multi-speaker conversation simulation
    startSimulatedDialogue();
  }

  function stopMeetingSimulation() {
    isMeetingActive = false;
    meetingModal.classList.remove('open');
    meetingModal.setAttribute('aria-hidden', 'true');
    if (meetingTimerInterval) clearInterval(meetingTimerInterval);

    // Stop real camera tracks if active
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
    }
    if (localVideo) {
      localVideo.srcObject = null;
      localVideo.classList.remove('active-video');
    }
    isCamActive = false;
    if (camLabel) camLabel.textContent = 'Camera';
    if (toggleCamBtn) toggleCamBtn.classList.remove('active-blue');
    if (userAvatarFallback) userAvatarFallback.style.display = 'flex';
  }

  if (openMeetingModalBtn) openMeetingModalBtn.addEventListener('click', startMeetingSimulation);
  if (heroLaunchBtn) heroLaunchBtn.addEventListener('click', startMeetingSimulation);
  if (closeMeetingModalBtn) closeMeetingModalBtn.addEventListener('click', stopMeetingSimulation);

  // Fullscreen
  if (toggleFullscreenBtn) {
    toggleFullscreenBtn.addEventListener('click', () => {
      const windowEl = document.querySelector('.meeting-window');
      if (!document.fullscreenElement) {
        windowEl.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Toggle Mic
  if (toggleMicBtn) {
    toggleMicBtn.addEventListener('click', () => {
      isMicMuted = !isMicMuted;
      sound.playChime('click');
      toggleMicBtn.classList.toggle('muted', isMicMuted);
      micLabel.textContent = isMicMuted ? 'Unmute' : 'Mute';

      const userMicIcon = document.getElementById('userMicIcon');
      if (userMicIcon) {
        userMicIcon.innerHTML = isMicMuted
          ? '<i data-lucide="mic-off" style="width:12px; height:12px; color:#ef4444;"></i>'
          : '<i data-lucide="mic" style="width:12px; height:12px;"></i>';
        if (window.lucide) window.lucide.createIcons();
      }

      // If speech recognition is active, toggle audio tracks
      if (localStream) {
        localStream.getAudioTracks().forEach((track) => {
          track.enabled = !isMicMuted;
        });
      }
    });
  }

  // Toggle Camera (Real WebRTC MediaStream with animated avatar fallback)
  if (toggleCamBtn) {
    toggleCamBtn.addEventListener('click', async () => {
      sound.playChime('click');
      if (!isCamActive) {
        try {
          // Attempt real camera stream
          localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: false
          });
          localVideo.srcObject = localStream;
          localVideo.classList.add('active-video');
          userAvatarFallback.style.display = 'none';
          isCamActive = true;
          toggleCamBtn.classList.add('active-blue');
          camLabel.textContent = 'Stop Cam';
        } catch (err) {
          console.warn('Webcam permission not granted or device unavailable. Using avatar fallback simulation.');
          // Simulated camera mode
          isCamActive = true;
          toggleCamBtn.classList.add('active-blue');
          camLabel.textContent = 'Cam (Sim)';
          userAvatarFallback.style.display = 'flex';
          userVideoCard.classList.add('active-speaker');
        }
      } else {
        // Turn off camera
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
          localStream = null;
        }
        localVideo.srcObject = null;
        localVideo.classList.remove('active-video');
        userAvatarFallback.style.display = 'flex';
        isCamActive = false;
        toggleCamBtn.classList.remove('active-blue');
        camLabel.textContent = 'Camera';
        userVideoCard.classList.remove('active-speaker');
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Toggle Screen Share
  if (toggleShareBtn) {
    toggleShareBtn.addEventListener('click', () => {
      isScreenSharing = !isScreenSharing;
      sound.playChime('click');
      screenShareView.classList.toggle('active', isScreenSharing);
      toggleShareBtn.classList.toggle('active-blue', isScreenSharing);
    });
  }
  if (closeScreenShareBtn) {
    closeScreenShareBtn.addEventListener('click', () => {
      isScreenSharing = false;
      screenShareView.classList.remove('active');
      toggleShareBtn.classList.remove('active-blue');
    });
  }

  // Toggle Raise Hand
  if (toggleHandBtn) {
    toggleHandBtn.addEventListener('click', () => {
      isHandRaised = !isHandRaised;
      sound.playChime(isHandRaised ? 'ping' : 'click');
      userHandBadge.classList.toggle('show', isHandRaised);
      toggleHandBtn.classList.toggle('active-amber', isHandRaised);
    });
  }

  // Emoji Reaction Burst Cannon
  document.querySelectorAll('.btn-emoji').forEach((btn) => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      sound.playChime('pop');
      spawnFloatingEmoji(emoji);
    });
  });

  function spawnFloatingEmoji(emojiChar) {
    if (!emojiCannonLayer) return;
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emojiChar;
    // Random horizontal position between 15% and 85%
    el.style.left = `${15 + Math.random() * 70}%`;
    emojiCannonLayer.appendChild(el);

    setTimeout(() => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 2400);
  }

  // Random reaction burst from team members every 12 seconds
  setInterval(() => {
    if (isMeetingActive && Math.random() > 0.4) {
      const teamEmojis = ['👍', '🎉', '🔥', '🚀', '💡', '👏'];
      const randomEmoji = teamEmojis[Math.floor(Math.random() * teamEmojis.length)];
      spawnFloatingEmoji(randomEmoji);
    }
  }, 11000);

  // Toggle Sidebar on smaller screens
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', () => {
      const sidebar = document.querySelector('.meeting-sidebar');
      if (sidebar) {
        sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
      }
    });
  }

  // ==========================================================================
  // 4. In-Meeting Multi-Speaker Dialogue Simulation
  // ==========================================================================
  const cardElena = document.getElementById('cardElena');
  const cardMarcus = document.getElementById('cardMarcus');
  const cardPriya = document.getElementById('cardPriya');
  const transcriptStream = document.getElementById('transcriptStream');

  const dialogueScript = [
    {
      speaker: 'Elena Vance',
      tagColor: '#ec4899',
      card: cardElena,
      text: 'Good morning everyone! Let’s review the migration benchmarks. We shifted our WebRTC SFU mesh servers from us-east to the multi-region cluster.',
      time: '10:32 AM',
      actionItem: null
    },
    {
      speaker: 'Marcus Chen',
      tagColor: '#38bdf8',
      card: cardMarcus,
      text: 'Yes, looking at the Atlas analytics, MongoDB connection pooling reduced 99th percentile query latency from 85ms down to 18ms under load.',
      time: '10:33 AM',
      actionItem: {
        title: 'Review MongoDB Atlas sharding cluster metrics',
        assignee: 'Marcus Chen',
        priority: 'high'
      }
    },
    {
      speaker: 'Priya Patel',
      tagColor: '#34d399',
      card: cardPriya,
      text: 'That’s a huge win for user perceived latency. How does this impact our SOC-2 Type II audit report for next month?',
      time: '10:34 AM',
      actionItem: null
    },
    {
      speaker: 'Elena Vance',
      tagColor: '#ec4899',
      card: cardElena,
      text: 'All media traffic remains strictly end-to-end encrypted with DTLS-SRTP keys managed client-side. The database only stores encrypted metadata.',
      time: '10:35 AM',
      actionItem: {
        title: 'Export DTLS-SRTP key management audit logs for SOC-2',
        assignee: 'Elena Vance',
        priority: 'med'
      }
    },
    {
      speaker: 'Marcus Chen',
      tagColor: '#38bdf8',
      card: cardMarcus,
      text: 'I will finish setting up automated Canary deployments in our CI/CD pipeline by tomorrow afternoon.',
      time: '10:36 AM',
      actionItem: {
        title: 'Implement Canary release pipeline with automated rollback',
        assignee: 'Marcus Chen',
        priority: 'high'
      }
    }
  ];

  let dialogueIndex = 0;
  let dialogueTimer = null;

  function startSimulatedDialogue() {
    if (dialogueTimer) clearInterval(dialogueTimer);

    // Initial populate
    if (transcriptStream && transcriptStream.children.length === 0) {
      appendTranscriptEntry(dialogueScript[0]);
    }

    dialogueTimer = setInterval(() => {
      if (!isMeetingActive) return;
      dialogueIndex = (dialogueIndex + 1) % dialogueScript.length;
      const current = dialogueScript[dialogueIndex];

      // Highlight active speaker card
      [cardElena, cardMarcus, cardPriya].forEach((c) => {
        if (c) c.classList.remove('active-speaker');
      });
      if (current.card) {
        current.card.classList.add('active-speaker');
      }

      // Append transcript
      appendTranscriptEntry(current);

      // Add action item if any
      if (current.actionItem) {
        addActionItem(current.actionItem);
      }
    }, 7500);
  }

  function appendTranscriptEntry(item) {
    if (!transcriptStream) return;
    const entry = document.createElement('div');
    entry.className = 'transcript-entry streaming';
    entry.innerHTML = `
      <div class="transcript-speaker-meta">
        <span class="speaker-tag" style="color:${item.tagColor};">
          <i data-lucide="user" style="width:12px; height:12px;"></i>
          ${item.speaker}
        </span>
        <span class="transcript-time">${item.time}</span>
      </div>
      <div class="transcript-text">${item.text}</div>
    `;
    transcriptStream.appendChild(entry);
    transcriptStream.scrollTop = transcriptStream.scrollHeight;
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      entry.classList.remove('streaming');
    }, 2000);
  }

  // ==========================================================================
  // 5. In-Meeting Web Speech API (Real Speech-to-Text when user talks)
  // ==========================================================================
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    try {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onresult = (event) => {
        if (isMicMuted || !isMeetingActive) return;
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text.length > 2) {
            appendTranscriptEntry({
              speaker: 'You (Host)',
              tagColor: 'var(--accent-cyan)',
              card: userVideoCard,
              text: text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actionItem: null
            });
            userVideoCard.classList.add('active-speaker');
            setTimeout(() => userVideoCard.classList.remove('active-speaker'), 2500);
          }
        }
      };

      recognizer.onerror = () => {};
      recognizer.onend = () => {
        if (isMeetingActive && !isMicMuted) {
          try { recognizer.start(); } catch(e) {}
        }
      };

      // Start recognition when modal opens
      openMeetingModalBtn?.addEventListener('click', () => {
        try { recognizer.start(); } catch (e) {}
      });
      heroLaunchBtn?.addEventListener('click', () => {
        try { recognizer.start(); } catch (e) {}
      });
    } catch (e) {
      console.log('Web Speech API not enabled in this browser session.');
    }
  }

  // ==========================================================================
  // 6. AI Copilot Chat ("Ask IntellMeet")
  // ==========================================================================
  const copilotForm = document.getElementById('copilotForm');
  const copilotInput = document.getElementById('copilotInput');
  const copilotMessages = document.getElementById('copilotMessages');

  function sendCopilotQuery(promptText) {
    if (!promptText.trim()) return;

    sound.playChime('click');

    // User message bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'copilot-bubble user';
    userBubble.textContent = promptText;
    copilotMessages.appendChild(userBubble);
    copilotInput.value = '';
    copilotMessages.scrollTop = copilotMessages.scrollHeight;

    // AI thinking typing placeholder
    const aiBubble = document.createElement('div');
    aiBubble.className = 'copilot-bubble ai';
    aiBubble.innerHTML = `<em>Thinking...</em>`;
    copilotMessages.appendChild(aiBubble);
    copilotMessages.scrollTop = copilotMessages.scrollHeight;

    setTimeout(() => {
      sound.playChime('ping');
      const response = generateCopilotResponse(promptText);
      aiBubble.innerHTML = response;
      copilotMessages.scrollTop = copilotMessages.scrollHeight;
    }, 700);
  }

  function generateCopilotResponse(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('decision') || p.includes('so far')) {
      return `📌 <strong>Decisions Recorded:</strong><br>
      • Migrated WebRTC SFU mesh to multi-region cluster.<br>
      • Confirmed MongoDB Atlas connection pool drop to 18ms.<br>
      • Maintained client-side E2EE DTLS-SRTP encryption standard.`;
    } else if (p.includes('migration') || p.includes('cloud') || p.includes('who')) {
      return `👤 <strong>Owner:</strong> Marcus Chen is leading the multi-region migration and Canary deployment pipeline with Elena Vance verifying failover latency.`;
    } else if (p.includes('summary') || p.includes('bullet')) {
      return `📋 <strong>Executive 3-Point Summary:</strong><br>
      1. <strong>Performance:</strong> Database latency cut by 42% via connection pool tuning.<br>
      2. <strong>Security:</strong> Full SOC-2 compliance verification in progress.<br>
      3. <strong>Next Release:</strong> IntellMeet v2.4 Canary rollout scheduled for Friday.`;
    } else if (p.includes('blocker')) {
      return `✅ <strong>Zero Critical Blockers:</strong> No blocking issues raised. Staging test coverage is currently at 94.6%.`;
    } else {
      return `🤖 <strong>Copilot Analysis:</strong> Based on the meeting discussion, the team is aligned on architecture goals, database optimizations, and the upcoming v2.4 production rollout.`;
    }
  }

  if (copilotForm) {
    copilotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendCopilotQuery(copilotInput.value);
    });
  }

  document.querySelectorAll('.quick-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) sendCopilotQuery(prompt);
    });
  });

  // ==========================================================================
  // 7. Smart Action Items Manager
  // ==========================================================================
  const actionItemsList = document.getElementById('actionItemsList');
  const taskProgressPercent = document.getElementById('taskProgressPercent');
  const taskProgressBar = document.getElementById('taskProgressBar');
  const actionBadgeCount = document.getElementById('actionBadgeCount');
  const addCustomTaskBtn = document.getElementById('addCustomTaskBtn');

  let actionItems = [
    {
      id: 1,
      title: 'Optimize MongoDB connection pooling & Redis cluster',
      assignee: 'Marcus Chen',
      priority: 'high',
      completed: true
    },
    {
      id: 2,
      title: 'Review WebRTC reconnection backoff algorithms',
      assignee: 'Elena Vance',
      priority: 'high',
      completed: true
    },
    {
      id: 3,
      title: 'Schedule client security review & SOC-2 compliance check',
      assignee: 'Priya Patel',
      priority: 'med',
      completed: false
    },
    {
      id: 4,
      title: 'Finalize release notes and changelog for v2.4',
      assignee: 'You (Host)',
      priority: 'low',
      completed: false
    }
  ];

  function renderActionItems() {
    if (!actionItemsList) return;
    actionItemsList.innerHTML = '';

    const completedCount = actionItems.filter((i) => i.completed).length;
    const totalCount = actionItems.length;
    const percent = Math.round((completedCount / (totalCount || 1)) * 100);

    if (taskProgressPercent) taskProgressPercent.textContent = `${percent}%`;
    if (taskProgressBar) taskProgressBar.style.width = `${percent}%`;
    if (actionBadgeCount) actionBadgeCount.textContent = `Tasks (${totalCount})`;

    actionItems.forEach((item) => {
      const card = document.createElement('div');
      card.className = `action-item-card ${item.completed ? 'completed' : ''}`;
      card.innerHTML = `
        <input type="checkbox" class="action-checkbox" ${item.completed ? 'checked' : ''} data-id="${item.id}">
        <div class="action-body">
          <div class="action-title">${item.title}</div>
          <div class="action-meta">
            <span>👤 ${item.assignee}</span>
            <span class="priority-badge priority-${item.priority}">${item.priority.toUpperCase()}</span>
          </div>
        </div>
      `;
      actionItemsList.appendChild(card);
    });

    // Checkbox events
    document.querySelectorAll('.action-checkbox').forEach((box) => {
      box.addEventListener('change', (e) => {
        sound.playChime('click');
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        const item = actionItems.find((i) => i.id === id);
        if (item) {
          item.completed = e.target.checked;
          renderActionItems();
        }
      });
    });
  }

  function addActionItem(taskObj) {
    actionItems.unshift({
      id: Date.now(),
      title: taskObj.title,
      assignee: taskObj.assignee || 'Unassigned',
      priority: taskObj.priority || 'med',
      completed: false
    });
    renderActionItems();
    sound.playChime('ping');
  }

  if (addCustomTaskBtn) {
    addCustomTaskBtn.addEventListener('click', () => {
      const title = prompt('Enter Action Item / Task title:');
      if (title && title.trim()) {
        addActionItem({
          title: title.trim(),
          assignee: 'You (Host)',
          priority: 'high'
        });
      }
    });
  }

  renderActionItems();

  // ==========================================================================
  // 8. Meeting Sidebar Tab Switching
  // ==========================================================================
  const sidebarTabBtns = document.querySelectorAll('.sidebar-tab-btn');
  const sidebarPanels = document.querySelectorAll('.sidebar-panel');

  sidebarTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sound.playChime('click');
      const targetId = btn.getAttribute('data-tab');

      sidebarTabBtns.forEach((b) => b.classList.remove('active'));
      sidebarPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });

  // ==========================================================================
  // 9. Meeting Chat & Poll Interaction
  // ==========================================================================
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (!msg) return;

      sound.playChime('click');
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg';
      userMsg.innerHTML = `
        <div class="chat-msg-header"><span style="color:var(--accent-cyan);">You (Host)</span><span>Just now</span></div>
        <div class="chat-msg-bubble" style="background:rgba(0,242,254,0.08); border-color:var(--accent-cyan);">${msg}</div>
      `;
      chatMessages.appendChild(userMsg);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulated team reply
      setTimeout(() => {
        sound.playChime('ping');
        const reply = document.createElement('div');
        reply.className = 'chat-msg';
        reply.innerHTML = `
          <div class="chat-msg-header"><span>Elena Vance</span><span>Just now</span></div>
          <div class="chat-msg-bubble">Understood! Updating the shared deployment checklist now.</div>
        `;
        chatMessages.appendChild(reply);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1500);
    });
  }

  // Poll votes
  const pollOptionBtns = document.querySelectorAll('.poll-option-btn');
  let hasVoted = false;
  pollOptionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (hasVoted) return;
      hasVoted = true;
      sound.playChime('pop');
      const vote = btn.getAttribute('data-vote');
      if (vote === 'yes') {
        const yesEl = document.getElementById('pollVoteYes');
        if (yesEl) yesEl.textContent = '4 votes (80%)';
      } else {
        const noEl = document.getElementById('pollVoteNo');
        if (noEl) noEl.textContent = '2 votes (40%)';
      }
      btn.style.borderColor = 'var(--accent-cyan)';
    });
  });

  // ==========================================================================
  // 10. Meeting Summary & Minutes Export Modal
  // ==========================================================================
  const exportModal = document.getElementById('exportModal');
  const closeExportModalBtn = document.getElementById('closeExportModalBtn');
  const exportPreviewText = document.getElementById('exportPreviewText');
  const copySummaryBtn = document.getElementById('copySummaryBtn');
  const downloadSummaryBtn = document.getElementById('downloadSummaryBtn');

  function generateMarkdownSummary() {
    return `# IntellMeet AI - Executive Meeting Summary & Action Protocol
**Date:** ${new Date().toLocaleDateString()} | **Meeting Duration:** ${formatTimer(meetingSeconds)}
**Room:** Sprint 42 Architecture & Cloud Migration Review
**Security:** E2EE Encrypted (DTLS-SRTP) • SOC-2 Type II Certified
**Attendees:** Elena Vance, Marcus Chen, Priya Patel, Host

---

## 🎯 Executive Summary
The engineering leadership reviewed the Q3 multi-region WebRTC SFU mesh migration and database optimization results. By implementing connection pooling in MongoDB Atlas and Redis cluster caching, 99th percentile query latency dropped from 85ms down to 18ms (a 42% performance gain).

## 💡 Key Decisions
1. **Canary Rollout:** Scheduled IntellMeet v2.4 Canary deployment for Friday with automated telemetry rollback triggers.
2. **Security Compliance:** DTLS-SRTP key management verification verified for upcoming SOC-2 Type II audit.
3. **Database Topology:** Multi-region cluster migration validated with 0ms downtime.

## 📋 Action Items & Task Allocations
${actionItems.map((item, idx) => `${idx + 1}. [${item.completed ? 'x' : ' '}] **${item.title}** (Owner: ${item.assignee}) - Priority: ${item.priority.toUpperCase()}`).join('\n')}

---
*Generated automatically by IntellMeet AI Realtime Engine (Whisper + GPT-4o)*
`;
  }

  if (endMeetingBtn) {
    endMeetingBtn.addEventListener('click', () => {
      stopMeetingSimulation();
      sound.playChime('done');
      if (exportPreviewText) {
        exportPreviewText.textContent = generateMarkdownSummary();
      }
      if (exportModal) {
        exportModal.classList.add('open');
        exportModal.setAttribute('aria-hidden', 'false');
      }
    });
  }

  if (closeExportModalBtn) {
    closeExportModalBtn.addEventListener('click', () => {
      exportModal.classList.remove('open');
      exportModal.setAttribute('aria-hidden', 'true');
    });
  }

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      const text = generateMarkdownSummary();
      navigator.clipboard.writeText(text).then(() => {
        sound.playChime('ping');
        copySummaryBtn.innerHTML = '<i data-lucide="check"></i><span>Copied to Clipboard!</span>';
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          copySummaryBtn.innerHTML = '<i data-lucide="copy"></i><span>Copy to Clipboard</span>';
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      });
    });
  }

  if (downloadSummaryBtn) {
    downloadSummaryBtn.addEventListener('click', () => {
      const text = generateMarkdownSummary();
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `IntellMeet-Summary-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      sound.playChime('done');
    });
  }

  // ==========================================================================
  // 11. Interactive AI Intelligence Lab / Playground
  // ==========================================================================
  const playgroundInput = document.getElementById('playgroundInput');
  const runAiPipelineBtn = document.getElementById('runAiPipelineBtn');
  const aiOutputContent = document.getElementById('aiOutputContent');
  const scenarioChips = document.querySelectorAll('.scenario-chip');

  const scenarios = {
    sprint: `Elena Vance (10:02): Good morning team. Let's do a quick sync on our AWS Frankfurt cluster migration and database query bottlenecks.
Marcus Chen (10:03): I profiled MongoDB Atlas queries yesterday. Adding compound indexes on { workspaceId: 1, createdAt: -1 } reduced latency from 95ms to 18ms.
Priya Patel (10:05): That is fantastic. Let's make sure we test failover latency during peak hours before we cut over all customer traffic.
Elena Vance (10:06): Agreed. Marcus, please document the failover drill and run stress tests by Thursday afternoon. I'll verify the Redis cluster cache hit ratio.`,

    board: `Sarah Jenkins (09:15): Welcome everyone to our Q3 Executive Review. Let's examine our meeting platform engagement metrics.
David Wu (09:17): Daily active meetings grew by 142% quarter-over-quarter. Average customer retention is holding steady at 98.4%.
Sarah Jenkins (09:20): Excellent work. Our primary bottleneck is enterprise onboarding cycle time, which currently averages 14 days.
Elena Vance (09:22): We can automate SSO SAML provisioning with Okta and Google Workspace to cut that cycle down to under 2 days. I will lead that initiative.`,

    security: `Alex Rivera (14:00): This is our annual SOC-2 Type II audit readiness review. Let's inspect our WebRTC media encryption protocol.
Marcus Chen (14:02): All audio and video streams use DTLS-SRTP with Ephemeral Diffie-Hellman keys generated per session. No plaintext media touches the signaling server.
Alex Rivera (14:05): Perfect. What about database backup retention and KMS key rotation?
Elena Vance (14:06): Backups are AES-256 encrypted at rest in MongoDB Atlas with annual KMS customer key rotation verified. I will produce the signed audit report for Deloitte by Friday.`
  };

  if (playgroundInput) {
    playgroundInput.value = scenarios.sprint;
  }

  scenarioChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      sound.playChime('click');
      scenarioChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const sc = chip.getAttribute('data-scenario');
      if (scenarios[sc]) {
        playgroundInput.value = scenarios[sc];
      }
    });
  });

  if (runAiPipelineBtn) {
    runAiPipelineBtn.addEventListener('click', () => {
      const text = playgroundInput.value.trim();
      if (!text) return;

      sound.playChime('click');
      runAiPipelineBtn.disabled = true;
      runAiPipelineBtn.innerHTML = `<span>Processing Intelligence...</span>`;

      // Animate pipeline step indicators
      const steps = ['step1', 'step2', 'step3', 'step4'];
      steps.forEach((s) => {
        const el = document.getElementById(s);
        if (el) {
          el.classList.remove('done');
          el.classList.add('active');
        }
      });

      let currentStep = 0;
      const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
          const el = document.getElementById(steps[currentStep]);
          if (el) {
            el.classList.remove('active');
            el.classList.add('done');
          }
          currentStep++;
        } else {
          clearInterval(stepInterval);
          finishAiPipeline(text);
        }
      }, 350);
    });
  }

  function finishAiPipeline(transcriptText) {
    runAiPipelineBtn.disabled = false;
    runAiPipelineBtn.innerHTML = `<i data-lucide="sparkles"></i><span>Run IntellMeet AI Pipeline</span>`;
    sound.playChime('done');
    if (window.lucide) window.lucide.createIcons();

    if (!aiOutputContent) return;

    aiOutputContent.innerHTML = `
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:12px; padding:1rem;">
        <h4 style="font-size:0.9rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
          <i data-lucide="file-text" style="width:14px; height:14px;"></i>
          Executive Summary
        </h4>
        <p style="font-size:0.82rem; color:#cbd5e1; line-height:1.5;">
          The team conducted technical alignment on architecture performance and compliance. Key performance indicators showed significant latency reductions and high team alignment with concrete next steps assigned.
        </p>
      </div>

      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:12px; padding:1rem;">
        <h4 style="font-size:0.9rem; font-weight:700; color:var(--accent-emerald); margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
          <i data-lucide="check-circle" style="width:14px; height:14px;"></i>
          Auto-Extracted Action Items
        </h4>
        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.8rem;">
          <div style="display:flex; justify-content:space-between; padding:0.4rem 0.6rem; background:rgba(0,0,0,0.3); border-radius:6px;">
            <span>Document failover drill and run stress tests</span>
            <span style="color:var(--accent-cyan); font-weight:700;">Marcus Chen (High)</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:0.4rem 0.6rem; background:rgba(0,0,0,0.3); border-radius:6px;">
            <span>Verify Redis cluster cache hit ratio</span>
            <span style="color:var(--accent-cyan); font-weight:700;">Elena Vance (Med)</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:0.4rem 0.6rem; background:rgba(0,0,0,0.3); border-radius:6px;">
            <span>Produce signed SOC-2 audit logs for compliance</span>
            <span style="color:var(--accent-cyan); font-weight:700;">Elena Vance (High)</span>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <span class="quick-chip">Topic: WebRTC Mesh</span>
        <span class="quick-chip">Topic: MongoDB Sharding</span>
        <span class="quick-chip">Topic: Latency Reduction</span>
        <span class="quick-chip">Topic: E2EE Security</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // Pre-run on load for immediate visual delight
  finishAiPipeline(scenarios.sprint);

  // ==========================================================================
  // 12. Interactive Architecture Explorer (MERN + WebRTC + AI)
  // ==========================================================================
  const archCards = document.querySelectorAll('.arch-card');
  const archDetailTitle = document.getElementById('archDetailTitle');
  const archDetailDesc = document.getElementById('archDetailDesc');
  const archDetailTags = document.getElementById('archDetailTags');
  const archCodeSnippet = document.getElementById('archCodeSnippet');

  const archData = {
    frontend: {
      title: 'React Client & WebRTC Mesh Layer',
      desc: 'Built with React hooks and modern WebRTC standard APIs. Coordinates peer-to-peer MediaStreams, local camera audio visualizers via Web Audio API, and canvas-based screensharing.',
      tags: ['React 18', 'WebRTC PeerConnection', 'AudioContext', 'Tailwind/CSS Glassmorphism'],
      code: `// React WebRTC Client Hook
const useWebRTC = (roomId, localVideoRef) => {
  useEffect(() => {
    const initPeer = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      localVideoRef.current.srcObject = stream;
      socket.emit('join-room', { roomId, peerId: socket.id });
    };
    initPeer();
  }, [roomId]);
};`
    },
    socket: {
      title: 'Socket.io Realtime Signaling Gateway',
      desc: 'Handles bidirectional low-latency message routing for ICE candidate exchanges, active speaker broadcasts, emoji bursts, and live transcription token streaming.',
      tags: ['Socket.io v4', 'Redis Pub/Sub Adapter', 'WebSocket', 'Sub-15ms Latency'],
      code: `// Node.js Socket.io Signaling Hub
io.on('connection', (socket) => {
  socket.on('send-ice-candidate', ({ targetPeer, candidate }) => {
    io.to(targetPeer).emit('receive-ice-candidate', { sender: socket.id, candidate });
  });

  socket.on('speaker-diarization-token', (tokenData) => {
    socket.to(tokenData.roomId).emit('stream-transcript', tokenData);
  });
});`
    },
    backend: {
      title: 'Node.js & Express Enterprise API',
      desc: 'Provides secure REST endpoints for workspace management, JWT authentication, user roles (RBAC), and webhooks to tools like Jira, Slack, and Linear.',
      tags: ['Node.js 22', 'Express', 'JWT Authentication', 'Rate Limiter'],
      code: `// Express Secure Meeting Route
app.post('/api/meetings/create', verifyJWT, async (req, res) => {
  const { title, teamId, isE2EE } = req.body;
  const meeting = await Meeting.create({
    hostId: req.user.id,
    title,
    teamId,
    encryptionMode: isE2EE ? 'AES-256-GCM' : 'Standard'
  });
  res.status(201).json({ success: true, meeting });
});`
    },
    db: {
      title: 'MongoDB Atlas Persistence & Vector Store',
      desc: 'Stores multi-tenant workspaces, structured meeting transcripts, extracted action items, and indexed OpenAI vector embeddings for semantic search across past meetings.',
      tags: ['MongoDB Atlas', 'Mongoose Schema', 'Vector Search Indexes', 'Time-Series Collections'],
      code: `// MongoDB Action Item Schema
const ActionItemSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', index: true },
  title: { type: String, required: true },
  assignee: { type: String, required: true },
  priority: { type: String, enum: ['high', 'med', 'low'], default: 'med' },
  completed: { type: Boolean, default: false },
  embedding: [Number] // 1536-dim vector for semantic search
});`
    },
    ai: {
      title: 'OpenAI GPT-4o & Whisper Speech Pipeline',
      desc: 'Continuous streaming audio chunk processing via Whisper speech-to-text with multi-speaker diarization and generative GPT-4o summarization for instant action item extraction.',
      tags: ['OpenAI Whisper', 'GPT-4o Realtime', 'Streaming NLP', 'Function Calling'],
      code: `// Continuous AI Action Extraction Service
async function extractMeetingIntelligence(transcriptStream) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Extract decisions, summary, and action items.' },
      { role: 'user', content: transcriptStream }
    ],
    response_format: { type: 'json_object' }
  });
  return JSON.parse(response.choices[0].message.content);
}`
    },
    security: {
      title: 'Security, Encryption & Compliance Vault',
      desc: 'End-to-end encrypted media with DTLS-SRTP, client-side key derivation, TLS 1.3 transport security, role-based access control, and SOC-2 audit logging.',
      tags: ['DTLS-SRTP', 'E2EE Encryption', 'SOC-2 Type II', 'Role-Based Access Control'],
      code: `// Cryptographic Key Fingerprint Verification
const verifyPeerFingerprint = (peerCertificate, expectedHash) => {
  const certDigest = crypto.createHash('sha256').update(peerCertificate).digest('hex');
  if (certDigest !== expectedHash) {
    throw new SecurityException('Peer fingerprint mismatch! Terminating stream.');
  }
  return true;
};`
    }
  };

  archCards.forEach((card) => {
    card.addEventListener('click', () => {
      sound.playChime('click');
      archCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      const layer = card.getAttribute('data-layer');
      const data = archData[layer];
      if (data) {
        if (archDetailTitle) archDetailTitle.textContent = data.title;
        if (archDetailDesc) archDetailDesc.textContent = data.desc;
        if (archCodeSnippet) archCodeSnippet.textContent = data.code;
        if (archDetailTags) {
          archDetailTags.innerHTML = data.tags
            .map((t) => `<span class="quick-chip">${t}</span>`)
            .join('');
        }
      }
    });
  });

  // ==========================================================================
  // 13. Interactive ROI & Productivity Calculator
  // ==========================================================================
  const inputTeamSize = document.getElementById('inputTeamSize');
  const inputMeetingsWeek = document.getElementById('inputMeetingsWeek');
  const inputHourlyRate = document.getElementById('inputHourlyRate');

  const valTeamSize = document.getElementById('valTeamSize');
  const valMeetingsWeek = document.getElementById('valMeetingsWeek');
  const valHourlyRate = document.getElementById('valHourlyRate');

  const calcAnnualSavings = document.getElementById('calcAnnualSavings');
  const calcHoursPerPerson = document.getElementById('calcHoursPerPerson');
  const calcTotalHoursOrg = document.getElementById('calcTotalHoursOrg');

  function updateCalculator() {
    const team = parseInt(inputTeamSize.value, 10);
    const meetings = parseInt(inputMeetingsWeek.value, 10);
    const rate = parseInt(inputHourlyRate.value, 10);

    if (valTeamSize) valTeamSize.textContent = team;
    if (valMeetingsWeek) valMeetingsWeek.textContent = meetings;
    if (valHourlyRate) valHourlyRate.textContent = rate;

    // IntellMeet saves ~25 minutes (0.42 hrs) per meeting on notes, alignment, and action item follow-ups
    const hoursSavedPerPersonPerWeek = meetings * 0.26;
    const hoursSavedPerPersonPerMonth = (hoursSavedPerPersonPerWeek * 4.33).toFixed(1);
    const totalHoursPerYear = Math.round(team * hoursSavedPerPersonPerWeek * 50);
    const annualDollars = totalHoursPerYear * rate;

    if (calcHoursPerPerson) calcHoursPerPerson.textContent = `${hoursSavedPerPersonPerMonth} hrs`;
    if (calcTotalHoursOrg) calcTotalHoursOrg.textContent = `${totalHoursPerYear.toLocaleString()} hrs`;
    if (calcAnnualSavings) calcAnnualSavings.textContent = `$${annualDollars.toLocaleString()}`;
  }

  [inputTeamSize, inputMeetingsWeek, inputHourlyRate].forEach((slider) => {
    if (slider) {
      slider.addEventListener('input', updateCalculator);
    }
  });

  updateCalculator();

  console.log('⚡ IntellMeet AI Platform Demo Initialized Successfully.');
});

