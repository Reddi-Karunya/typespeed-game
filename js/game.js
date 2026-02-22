// js/game.js
// Core game state and logic

class TypingGame {
  constructor() {
    // Config
    this.totalTime   = 15;
    this.difficulty  = 'normal';

    // Session best
    this.bestWPM    = 0;
    this.testsDone  = 0;

    // Runtime state
    this._reset();
  }

  // ─── INIT ──────────────────────────────────────────────

  _reset() {
    this.words          = [];
    this.currentWordIdx = 0;
    this.currentCharIdx = 0;
    this.typedWords     = [];
    this.started        = false;
    this.finished       = false;
    this.correctWords   = 0;
    this.errorWords     = 0;
    this.totalChars     = 0;
    this.timeLeft       = this.totalTime;
    this._clearTimer();
  }

  init() {
    this._reset();
    this.words = getWordList(this.difficulty, 100);
  }

  // ─── TIMER ─────────────────────────────────────────────

  startTimer(onTick, onEnd) {
    this._onTick = onTick;
    this._onEnd  = onEnd;
    this._interval = setInterval(() => {
      this.timeLeft--;
      if (this._onTick) this._onTick(this.timeLeft);
      if (this.timeLeft <= 0) this.endGame();
    }, 1000);
  }

  _clearTimer() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  // ─── WORD SUBMISSION ───────────────────────────────────

  /**
   * Called when user presses Space to submit current word.
   * @param {string} typed - the text the user typed (trimmed)
   * @returns {{ correct: boolean, expected: string }}
   */
  submitWord(typed) {
    const expected = this.words[this.currentWordIdx] || '';
    const isCorrect = typed === expected;

    this.typedWords.push({ typed, expected, isCorrect });

    if (isCorrect) {
      this.correctWords++;
    } else {
      this.errorWords++;
    }

    this.totalChars += typed.length + 1; // +1 for space
    this.currentWordIdx++;
    this.currentCharIdx = 0;

    return { correct: isCorrect, expected };
  }

  // ─── LIVE STATS ────────────────────────────────────────

  getLiveStats() {
    const elapsed = this.totalTime - this.timeLeft;
    const mins    = elapsed / 60;
    const wpm     = mins > 0 ? Math.round(this.correctWords / mins) : 0;
    const total   = this.typedWords.length;
    const acc     = total > 0 ? Math.round((this.correctWords / total) * 100) : 100;

    return { wpm, acc, correct: this.correctWords, errors: this.errorWords };
  }

  // ─── END ───────────────────────────────────────────────

  endGame() {
    this._clearTimer();
    this.finished = true;

    const mins     = this.totalTime / 60;
    const wpm      = Math.round(this.correctWords / mins);
    const rawWpm   = Math.round(this.typedWords.length / mins);
    const total    = this.typedWords.length;
    const acc      = total > 0 ? Math.round((this.correctWords / total) * 100) : 100;

    this.testsDone++;
    if (wpm > this.bestWPM) this.bestWPM = wpm;

    const result = {
      wpm, rawWpm, acc,
      correct:  this.correctWords,
      errors:   this.errorWords,
      chars:    this.totalChars,
      time:     this.totalTime,
      rank:     this._getRank(wpm),
    };

    if (this._onEnd) this._onEnd(result);
    return result;
  }

  // ─── RANK ──────────────────────────────────────────────

  _getRank(wpm) {
    if (wpm >= 120) return { label: '⚡ LEGENDARY',    color: '#ffd700' };
    if (wpm >=  90) return { label: '🔥 EXPERT',       color: '#00ff88' };
    if (wpm >=  70) return { label: '▲ ADVANCED',      color: '#7c3aed' };
    if (wpm >=  50) return { label: '◆ INTERMEDIATE',  color: '#00b4d8' };
    if (wpm >=  30) return { label: '● BEGINNER',      color: '#94a3b8' };
    return              { label: '○ NOVICE',           color: '#4a4a70' };
  }

  // ─── HELPERS ───────────────────────────────────────────

  setTime(t) {
    this.totalTime = t;
  }

  setDifficulty(d) {
    this.difficulty = d;
  }

  getProgress() {
    return (this.totalTime - this.timeLeft) / this.totalTime;
  }
}
