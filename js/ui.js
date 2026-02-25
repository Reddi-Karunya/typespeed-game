// js/ui.js
// DOM manipulation, rendering, effects

class TypingUI {
  constructor(game) {
    this.game = game;

    // Elements
    this.wordDisplay    = document.getElementById('word-display');
    this.hiddenInput    = document.getElementById('hidden-input');
    this.timerEl        = document.getElementById('timer');
    this.progressFill   = document.getElementById('progress-fill');
    this.clickHint      = document.getElementById('click-hint');
    this.typingCard     = document.getElementById('typing-card');
    this.controls       = document.getElementById('controls');
    this.resultScreen   = document.getElementById('result-screen');
    this.particleCont   = document.getElementById('particle-container');

    // Live stat els
    this.liveWpm     = document.getElementById('live-wpm');
    this.liveAcc     = document.getElementById('live-acc');
    this.liveCorrect = document.getElementById('live-correct');
    this.liveErrors  = document.getElementById('live-errors');

    // Result els
    this.resWpm     = document.getElementById('res-wpm');
    this.resAcc     = document.getElementById('res-acc');
    this.resCorrect = document.getElementById('res-correct');
    this.resRaw     = document.getElementById('res-raw');
    this.resErrors  = document.getElementById('res-errors');
    this.resChars   = document.getElementById('res-chars');
    this.resTime    = document.getElementById('res-time');
    this.rankBadge  = document.getElementById('rank-badge');

    // Session els
    this.bestWpmDisplay = document.getElementById('best-wpm-display');
    this.testsDoneDisplay = document.getElementById('tests-done-display');
    this.cipherMeta        = document.getElementById('cipher-meta');
    this.cipherIndicator   = document.getElementById('cipher-indicator');
  }

  // ─── RENDER WORDS ──────────────────────────────────────

  renderWords() {
    this.wordDisplay.innerHTML = '';
    this.wordDisplay.scrollTop = 0;

    this.game.words.forEach((word, wi) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'word';
      wordEl.id = `w-${wi}`;

      word.split('').forEach((ch, ci) => {
        const charEl = document.createElement('span');
        charEl.className = 'char pending';
        charEl.id = `c-${wi}-${ci}`;
        charEl.textContent = this.game.difficulty === 'cipher'
          ? this._encodeChar(ch, this.game.cipherShift)
          : ch;
        wordEl.appendChild(charEl);
      });

      this.wordDisplay.appendChild(wordEl);
    });

    this.updateCursor();
  }

  // ─── CURSOR ────────────────────────────────────────────

  updateCursor() {
    // Clear old cursors
    this.wordDisplay.querySelectorAll('.cursor').forEach(el => el.classList.remove('cursor'));
    // Clear ghost cursor spans
    this.wordDisplay.querySelectorAll('.char-ghost').forEach(el => el.remove());

    const wi  = this.game.currentWordIdx;
    const ci  = this.game.currentCharIdx;
    const charEl = document.getElementById(`c-${wi}-${ci}`);

    if (charEl) {
      charEl.classList.add('cursor');
    } else {
      // Cursor at end of word — add ghost span
      const wordEl = document.getElementById(`w-${wi}`);
      if (wordEl) {
        const ghost = document.createElement('span');
        ghost.className = 'char cursor char-ghost';
        ghost.innerHTML = '&nbsp;';
        ghost.style.width = '2px';
        wordEl.appendChild(ghost);
      }
    }

    this._scrollCurrentWordIntoView();
  }

  _scrollCurrentWordIntoView() {
    const wordEl = document.getElementById(`w-${this.game.currentWordIdx}`);
    if (!wordEl) return;

    const dispRect = this.wordDisplay.getBoundingClientRect();
    const wordRect = wordEl.getBoundingClientRect();

    if (wordRect.bottom > dispRect.bottom) {
      this.wordDisplay.scrollTop += wordRect.bottom - dispRect.bottom + 8;
    }
  }

  // ─── LIVE CHAR HIGHLIGHT ───────────────────────────────

  /**
   * Update character highlighting for the current word as user types.
   * @param {string} val - current input value
   */
  highlightCurrentWord(val) {
    const wi      = this.game.currentWordIdx;
    const word    = this.game.words[wi] || '';
    const wordEl  = document.getElementById(`w-${wi}`);
    if (!wordEl) return;

    // Update existing chars
    const charEls = wordEl.querySelectorAll('.char[id]');
    charEls.forEach((el, ci) => {
      el.classList.remove('cursor', 'correct', 'wrong', 'pending');
      if (val[ci] === undefined) {
        el.classList.add('pending');
      } else if (val[ci] === word[ci]) {
        el.classList.add('correct');
      } else {
        el.classList.add('wrong');
      }
    });

    // Remove previous extra chars
    wordEl.querySelectorAll('.char.extra').forEach(el => el.remove());

    // Add extra chars beyond word length
    if (val.length > word.length) {
      for (let i = word.length; i < val.length; i++) {
        const extra = document.createElement('span');
        extra.className = 'char extra';
        extra.textContent = val[i];
        wordEl.appendChild(extra);
      }
    }

    // Update cursor position
    this.game.currentCharIdx = val.length;
    this.updateCursor();
  }

  // ─── MARK SUBMITTED WORD ──────────────────────────────

  markWord(wi, typed, expected) {
    const wordEl = document.getElementById(`w-${wi}`);
    if (!wordEl) return;

    // Remove ghost cursors
    wordEl.querySelectorAll('.char-ghost').forEach(el => el.remove());

    // Mark each character
    const chars = wordEl.querySelectorAll('.char[id]');
    chars.forEach((el, ci) => {
      el.classList.remove('pending', 'correct', 'wrong', 'cursor', 'extra');
      if (typed[ci] === undefined) {
        el.classList.add('pending'); // untyped (word too short)
      } else if (typed[ci] === expected[ci]) {
        el.classList.add('correct');
      } else {
        el.classList.add('wrong');
      }
    });

    // Mark extra typed characters
    if (typed.length > expected.length) {
      // Remove live extras first
      wordEl.querySelectorAll('.char.extra').forEach(el => el.remove());
      for (let i = expected.length; i < typed.length; i++) {
        const el = document.createElement('span');
        el.className = 'char extra';
        el.textContent = typed[i];
        wordEl.appendChild(el);
      }
    }
  }

  // ─── TIMER ─────────────────────────────────────────────

  updateTimer(timeLeft) {
    this.timerEl.textContent = timeLeft;
    const pct = this.game.getProgress() * 100;
    this.progressFill.style.width = pct + '%';

    if (timeLeft <= 5) {
      this.timerEl.classList.add('urgent');
    }
  }

  resetTimer() {
    this.timerEl.textContent = this.game.totalTime;
    this.timerEl.classList.remove('urgent');
    this.progressFill.style.width = '0%';
    // Force transition restart
    this.progressFill.style.transition = 'none';
    requestAnimationFrame(() => {
      this.progressFill.style.transition = 'width 0.9s linear';
    });
  }

  // ─── LIVE STATS ────────────────────────────────────────

  updateLiveStats() {
    const s = this.game.getLiveStats();
    this.liveWpm.textContent     = s.wpm;
    this.liveAcc.textContent     = s.acc;
    this.liveCorrect.textContent = s.correct;
    this.liveErrors.textContent  = s.errors;
  }

  resetLiveStats() {
    this.liveWpm.textContent     = '0';
    this.liveAcc.textContent     = '100';
    this.liveCorrect.textContent = '0';
    this.liveErrors.textContent  = '0';
  }

  // ─── RESULT SCREEN ─────────────────────────────────────

  showResult(result) {
    this.typingCard.style.display = 'none';
    this.controls.style.display   = 'none';
    this.resultScreen.classList.add('show');

    this.resWpm.textContent     = result.wpm;
    this.resAcc.textContent     = result.acc + '%';
    this.resCorrect.textContent = result.correct;
    this.resRaw.textContent     = result.rawWpm;
    this.resErrors.textContent  = result.errors;
    this.resChars.textContent   = result.chars;
    this.resTime.textContent    = result.time + 's';

    this.rankBadge.textContent   = result.rank.label;
    this.rankBadge.style.color   = result.rank.color;
    this.rankBadge.style.borderColor = result.rank.color;
    this.rankBadge.style.boxShadow   = `0 0 24px ${result.rank.color}40`;

    this.updateSessionStats();
  }

  hideResult() {
    this.resultScreen.classList.remove('show');
    this.typingCard.style.display = '';
    this.controls.style.display   = '';
  }

  updateSessionStats() {
    const best = this.game.bestWPM;
    this.bestWpmDisplay.textContent  = best > 0 ? best : '—';
    this.testsDoneDisplay.textContent = this.game.testsDone;
    this.updateCipherIndicator();
  }

  // ─── HINTS ─────────────────────────────────────────────

  showHint()  { this.clickHint.classList.remove('hidden'); }
  hideHint()  { this.clickHint.classList.add('hidden'); }

  // ─── FOCUS ─────────────────────────────────────────────

  focusInput() {
    this.hiddenInput.focus();
  }

  // ─── PARTICLES ─────────────────────────────────────────

  spawnParticles(wordIndex) {
    const wordEl = document.getElementById(`w-${wordIndex}`);
    if (!wordEl) return;

    const rect = wordEl.getBoundingClientRect();
    const contRect = document.body.getBoundingClientRect();

    const count = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size = 2 + Math.random() * 3;
      const x    = rect.left - contRect.left + Math.random() * rect.width;
      const y    = rect.top - contRect.top;
      const dur  = 0.8 + Math.random() * 0.8;
      const col  = Math.random() > 0.3 ? '#00ff88' : '#7c3aed';

      p.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${col};
        box-shadow: 0 0 ${size * 2}px ${col};
        animation-duration: ${dur}s;
        animation-delay: ${Math.random() * 0.2}s;
      `;

      this.particleCont.appendChild(p);
      setTimeout(() => p.remove(), (dur + 0.3) * 1000);
    }
  }

  // ─── GLITCH FLASH ──────────────────────────────────────

  glitchFlash() {
    this.typingCard.classList.add('glitch-flash');
    setTimeout(() => this.typingCard.classList.remove('glitch-flash'), 300);
  }

  // ─── CIPHER ────────────────────────────────────────────

  _encodeChar(ch, shift) {
    const code = ch.charCodeAt(0);
    // Uppercase A-Z
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }
    // Lowercase a-z
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }
    return ch;
  }

  updateCipherIndicator() {
    if (!this.cipherMeta) return;
    if (this.game.difficulty === 'cipher' && this.game.cipherShift > 0) {
      this.cipherIndicator.textContent = `+${this.game.cipherShift}`;
      this.cipherMeta.style.display = '';
    } else {
      this.cipherMeta.style.display = 'none';
    }
  }
}
