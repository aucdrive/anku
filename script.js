    const defaultConfig = {
      your_name: "Tarush",
      partner_name: "Ankita",
      main_question: "Will You Marry Me?",
      meeting_date: "August 2021",
      proposal_date: "October 2, 2021",
      what_love: "Your laugh, your voice, your understanding"
    };

    let noAttempts = 0;
    const sarcasmMessages = [
      "Escape attempts: 1/5 - You can do better! 😜",
      "Escape attempts: 2/5 - The button is ALIVE and disagrees 🤖",
      "Escape attempts: 3/5 - Getting desperate? That's cute 😏",
      "Escape attempts: 4/5 - One more and DESTINY TAKES OVER! ⚠️",
      "Escape attempts: 5/5 - DESTINY WINS! Time to say YES! 💕"
    ];

    const noMessages = [
      "Nice Try 😜", "System Error: 'No' Unavailable", "Think again 😏",
      "Finger slipped?", "WRONG!", "Error 404 🤭", "Destiny disagrees!", "The button has feelings too! 😂"
    ];

    const loadingMessages = [
      "Initializing Love Proposal System…",
      "Loading all your beautiful memories…",
      "Checking if you'll say YES… (99.9% confident 😎)",
      "Preparing to change your life…"
    ];

    async function runLoadingAnimation() {
      const loadingText = document.getElementById('loading-text');
      const progressFill = document.getElementById('progress-fill');
      
      for (let i = 0; i < loadingMessages.length; i++) {
        loadingText.textContent = loadingMessages[i];
        progressFill.style.width = `${((i + 1) / loadingMessages.length) * 100}%`;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      document.getElementById('loading-screen').classList.add('hidden');
      document.getElementById('main-content').classList.remove('hidden');
      createFloatingHearts();
      createSparkles();
    }

    function createFloatingHearts() {
      const container = document.getElementById('floating-hearts');
      const hearts = ['💕', '💖', '💗', '💘', '💝', '💓', '♥️', '❤️'];
      for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'absolute text-2xl md:text-4xl opacity-20 floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(heart);
      }
    }

    function createSparkles() {
      const container = document.getElementById('sparkles');
      for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'absolute w-2 h-2 bg-yellow-300 rounded-full sparkle opacity-60';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(sparkle);
      }
    }

    // Photo Upload with Netlify Form Submission
    document.getElementById('photo-upload').addEventListener('change', async function(e) {
      const file = e.target.files[0];
      if (file) {
        // Show preview immediately
        const reader = new FileReader();
        reader.onload = function(event) {
          document.getElementById('placeholder-image').classList.add('hidden');
          document.getElementById('actual-image').src = event.target.result;
          document.getElementById('actual-image').classList.remove('hidden');
          createHeartBurst(document.getElementById('image-container'));
        };
        reader.readAsDataURL(file);

        // Submit to Netlify form
        const formData = new FormData();
        formData.append('proposal_photo', file);
        formData.append('partner_name', defaultConfig.partner_name);
        
        try {
          await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              'form-name': 'photo-submission',
              'proposal_photo': file.name,
              'partner_name': defaultConfig.partner_name
            })
          });
          showPopup('Photo saved! 💾✨', '✅');
        } catch (error) {
          console.error('Photo upload error:', error);
          showPopup('Photo preview saved locally! 📸', '💾');
        }
      }
    });

    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const buttonsContainer = document.getElementById('buttons-container');
    let noBtnScale = 1;
    
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); });
    
    function moveNoButton() {
      noAttempts++;
      document.getElementById('no-attempts').classList.remove('hidden');
      document.getElementById('attempt-count').textContent = noAttempts;
      document.getElementById('sarcasm-message').textContent = noAttempts <= sarcasmMessages.length ? sarcasmMessages[noAttempts - 1] : "Keep trying! The button loves this game 😂";
      
      const containerRect = buttonsContainer.getBoundingClientRect();
      const maxX = Math.max(0, containerRect.width - noBtn.offsetWidth - 40);
      const maxY = Math.max(0, containerRect.height - noBtn.offsetHeight - 20);
      
      noBtnScale = Math.max(0.5, noBtnScale - 0.1);
      
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      const rotation = (Math.random() - 0.5) * 50;
      
      noBtn.style.position = 'absolute';
      noBtn.style.left = `${newX}px`;
      noBtn.style.top = `${newY}px`;
      noBtn.style.transform = `rotate(${rotation}deg) scale(${noBtnScale})`;
      
      const msg = noMessages[Math.floor(Math.random() * noMessages.length)];
      showPopup(msg, "😜");
    }
    
    noBtn.addEventListener('click', function(e) {
      e.preventDefault();
    });

    function showPopup(message, emoji) {
      document.getElementById('popup-text').textContent = message;
      document.getElementById('popup-emoji').textContent = emoji;
      document.getElementById('popup-message').classList.remove('hidden');
    }

    document.getElementById('popup-close').addEventListener('click', () => {
      document.getElementById('popup-message').classList.add('hidden');
    });

    yesBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.15)';
      createHeartBurst(this);
    });

    yesBtn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });

    yesBtn.addEventListener('click', triggerSuccess);

    function createHeartBurst(element) {
      const rect = element.getBoundingClientRect ? element.getBoundingClientRect() : element.parentElement.getBoundingClientRect();
      const hearts = ['💕', '💖', '💗', '💘', '💝'];
      for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle fixed text-2xl pointer-events-none z-50';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px`;
        heart.style.top = `${rect.top}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
      }
    }

    function triggerSuccess() {
      createConfetti();
      createFireworks();
      setTimeout(() => {
        document.body.classList.add('success-active');
        document.getElementById('success-view').classList.remove('hidden');
        document.getElementById('success-view').scrollTop = 0;
      }, 500);
    }

    function createConfetti() {
      const colors = ['#ff6b9d', '#c44eb9', '#ffd93d', '#6bcb77', '#4d96ff', '#ff8fab'];
      for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }
    }

    function createFireworks() {
      const colors = ['#ff6b9d', '#c44eb9', '#ffd93d', '#6bcb77'];
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight * 0.6;
          for (let j = 0; j < 4; j++) {
            const ring = document.createElement('div');
            ring.className = 'firework-ring';
            ring.style.left = `${x}px`;
            ring.style.top = `${y}px`;
            ring.style.width = `${40 + j * 25}px`;
            ring.style.height = `${40 + j * 25}px`;
            ring.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
            ring.style.animationDelay = `${j * 0.1}s`;
            document.body.appendChild(ring);
            setTimeout(() => ring.remove(), 1200);
          }
        }, i * 200);
      }
    }

    document.getElementById('music-toggle').addEventListener('click', function() {
      const musicPlaying = document.getElementById('music-icon').textContent === '🔇';
      document.getElementById('music-icon').textContent = musicPlaying ? '🔊' : '🔇';
      if (musicPlaying) showPopup("🎵 Imagine beautiful romantic music playing right now... 🎵", "🎶");
    });

    async function onConfigChange(config) {
      const your = config.your_name || defaultConfig.your_name;
      const partner = config.partner_name || defaultConfig.partner_name;
      const question = config.main_question || defaultConfig.main_question;
      const meeting = config.meeting_date || defaultConfig.meeting_date;
      const proposal = config.proposal_date || defaultConfig.proposal_date;
      const love = config.what_love || defaultConfig.what_love;
      
      document.getElementById('main-heading').textContent = `${partner}… ${question} 💍`;
      document.getElementById('story-summary').textContent = `We met in ${meeting} and fell in love through conversations, ${love}. Now I'm proposing on ${proposal}!`;
      document.getElementById('final-heading').textContent = `${partner}, You're My Favorite Message`;
      document.getElementById('couple-names').textContent = `${partner} + ${your} = Forever Starting NOW 💕`;
      document.getElementById('footer-text').innerHTML = `Made With All My Heart By <span class="text-pink-600 font-bold">${your}</span> 💝`;
      document.getElementById('footer-final').innerHTML = `Made With All My Love & Every Beat Of My Heart By <span class="text-pink-600">${your}</span> 💝`;
    }

    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: () => ({ recolorables: [], borderables: [], fontEditable: undefined, fontSizeable: undefined }),
        mapToEditPanelValues: (config) => new Map([
          ["your_name", config.your_name || defaultConfig.your_name],
          ["partner_name", config.partner_name || defaultConfig.partner_name],
          ["main_question", config.main_question || defaultConfig.main_question],
          ["meeting_date", config.meeting_date || defaultConfig.meeting_date],
          ["proposal_date", config.proposal_date || defaultConfig.proposal_date],
          ["what_love", config.what_love || defaultConfig.what_love]
        ])
      });
    }

    runLoadingAnimation();