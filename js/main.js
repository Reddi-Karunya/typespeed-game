// js/main.js
// Entry point — wires game logic, UI, and event listeners

(function () {
  'use strict';

  // ─── SETUP ───────────────────────────────────────────

  const game = new TypingGame();
  const ui   = new TypingUI(game);

  // Expose focusInput globally for onclick in HTML
  window.game = { focusInput: () => ui.focusInput() };

  // ─── INIT / RESTART ──────────────────────────────────

  function initGame() {
    game.init();
    ui.hideResult();
    ui.resetTimer();
    ui.resetLiveStats();
    ui.renderWords();
    ui.updateCipherIndicator();
    ui.showHint();
    ui.hiddenInput.value = '';
  }

  // ─── INPUT HANDLER ───────────────────────────────────

  ui.hiddenInput.addEventListener('input', () => {
    if (game.finished) return;

    const val = ui.hiddenInput.value;

    // Start timer on first keystroke
    if (!game.started) {
      game.started = true;
      ui.hideHint();
      game.startTimer(
        (timeLeft) => {
          ui.updateTimer(timeLeft);
          ui.updateLiveStats();
        },
        (result) => {
          ui.showResult(result);
        }
      );
    }

    // Space = submit word
    if (val.endsWith(' ')) {
      const typed = val.trim();
      const wi    = game.currentWordIdx;
      const { correct, expected } = game.submitWord(typed);

      // Mark submitted word in DOM
      ui.markWord(wi, typed, expected);

      // Feedback
      if (correct) {
        ui.spawnParticles(wi);
      } else {
        ui.glitchFlash();
      }

      ui.hiddenInput.value = '';
      ui.updateLiveStats();
      ui.updateCursor();
      return;
    }

    // Live character highlighting
    ui.highlightCurrentWord(val);
  });

  // ─── FOCUS / BLUR ─────────────────────────────────────

  ui.hiddenInput.addEventListener('focus', () => {
    if (!game.started && !game.finished) {
      ui.hideHint();
    }
  });

  ui.hiddenInput.addEventListener('blur', () => {
    if (!game.started) {
      ui.showHint();
    }
  });

  // ─── KEYBOARD SHORTCUTS ───────────────────────────────

  document.addEventListener('keydown', (e) => {
    // Tab = restart
    if (e.key === 'Tab') {
      e.preventDefault();
      initGame();
      return;
    }
    // Any printable key focuses input (if not finished)
    if (!game.finished && e.key.length === 1) {
      ui.focusInput();
    }
  });

  // ─── TOOLBAR — TIME BUTTONS ───────────────────────────

  document.querySelectorAll('[data-time]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-time]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      game.setTime(parseInt(btn.dataset.time, 10));
      initGame();
    });
  });

  // ─── TOOLBAR — DIFFICULTY BUTTONS ────────────────────

  document.querySelectorAll('[data-diff]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      game.setDifficulty(btn.dataset.diff);
      initGame();
    });
  });

  // ─── CONTROL BUTTONS ─────────────────────────────────

  document.getElementById('restart-btn').addEventListener('click', () => initGame());
  document.getElementById('new-words-btn').addEventListener('click', () => initGame());
  document.getElementById('res-restart-btn').addEventListener('click', () => initGame());
  document.getElementById('res-new-btn').addEventListener('click', () => initGame());

  // ─── BOOT ─────────────────────────────────────────────

  initGame();

})();
