/**
 * js/workout-player.js
 * Interactive Real-Time Workout Player & Live Voice Personal Trainer Guide
 */

class WorkoutPlayer {
    constructor(soundEngine, voiceCoach, onSessionComplete) {
        this.soundEngine = soundEngine;
        this.voiceCoach = voiceCoach;
        this.onSessionComplete = onSessionComplete;

        this.routine = [];
        this.currentIndex = 0;
        this.phase = 'idle'; // 'prep' | 'work' | 'rest' | 'paused' | 'completed'
        this.timeLeft = 0;
        this.totalDuration = 0;
        this.timerInterval = null;
        this.isMuted = false;
        this.halfwayCued = false;
        this.tenSecCued = false;

        // Metrik akumulasi
        this.caloriesBurned = 0;
        this.secondsElapsed = 0;

        this.dom = {
            playerModal: null,
            timerNumber: null,
            exerciseTitle: null,
            exerciseSubtitle: null,
            animContainer: null,
            phaseBadge: null,
            progressBar: null,
            nextPreview: null,
            btnPause: null,
            btnSkip: null,
            btnPrev: null,
            btnToggleSound: null
        };
    }

    initDomElements() {
        this.dom.playerModal = document.getElementById('workoutPlayerModal');
        this.dom.timerNumber = document.getElementById('playerTimerDisplay');
        this.dom.radialProgress = document.getElementById('playerRadialProgress');
        this.dom.liveCalories = document.getElementById('playerLiveCalories');
        this.dom.exerciseTitle = document.getElementById('playerExerciseTitle');
        this.dom.exerciseSubtitle = document.getElementById('playerExerciseSubtitle');
        this.dom.animContainer = document.getElementById('playerAnimContainer');
        this.dom.phaseBadge = document.getElementById('playerPhaseBadge');
        this.dom.progressBar = document.getElementById('playerProgressBar');
        this.dom.nextPreview = document.getElementById('playerNextPreview');
        this.dom.btnPause = document.getElementById('playerBtnPause');
        this.dom.btnSkip = document.getElementById('playerBtnSkip');
        this.dom.btnPrev = document.getElementById('playerBtnPrev');
        this.dom.btnToggleSound = document.getElementById('playerBtnToggleSound');
    }

    startWorkout(exercisesList, sessionTitle = "Sesi Latihan Hari Ini") {
        if (!exercisesList || exercisesList.length === 0) {
            alert("Tidak ada gerakan dalam program ini.");
            return;
        }

        this.routine = exercisesList;
        this.currentIndex = 0;
        this.caloriesBurned = 0;
        this.secondsElapsed = 0;
        this.sessionTitle = sessionTitle;

        this.initDomElements();

        if (this.dom.playerModal) {
            this.dom.playerModal.classList.add('active');
            this.dom.playerModal.style.display = 'flex';
            document.body.classList.add('workout-active-overflow');
        }

        // Mulai fase persiapan (Get Ready 5 detik)
        this.startPreparationPhase();
    }

    startPreparationPhase() {
        this.phase = 'prep';
        this.timeLeft = 5;
        this.halfwayCued = false;
        this.tenSecCued = false;

        const currentEx = this.routine[this.currentIndex];
        
        this.updateUi();
        this.voiceCoach.speak(`Bersiap! Sesi latihan dimulai dalam lima detik. Gerakan pertama: ${currentEx.name}.`);

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 1) {
                this.soundEngine.playBeep(440 + (5 - this.timeLeft) * 80, 0.1);
            } else if (this.timeLeft === 1) {
                this.soundEngine.playBeep(880, 0.25);
            }

            this.timeLeft--;
            this.updateUi();

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.soundEngine.playWhistle();
                this.startWorkPhase();
            }
        }, 1000);
    }

    startWorkPhase() {
        this.phase = 'work';
        const currentEx = this.routine[this.currentIndex];
        this.timeLeft = currentEx.duration || currentEx.defaultDuration || 40;
        this.totalDuration = this.timeLeft;
        this.halfwayCued = false;
        this.tenSecCued = false;

        this.updateUi();

        // Voice Coach intruksi awal gerakan
        const cueStart = currentEx.voiceCues?.start || `Mulai ${currentEx.name}! Pertahankan form terbaik!`;
        this.voiceCoach.speak(cueStart);

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.secondsElapsed++;
            
            // Hitung estimasi kalori terbakar
            const calPerSec = (currentEx.caloriesPerMin || 9.0) / 60;
            this.caloriesBurned += calPerSec;

            // Trigger Voice Coach Cues
            // 1. Separuh Waktu (50%)
            if (!this.halfwayCued && this.timeLeft <= Math.floor(this.totalDuration / 2)) {
                this.halfwayCued = true;
                this.soundEngine.playChime();
                const halfCue = currentEx.voiceCues?.halfway || "Setengah waktu selesai! Pertahankan ritme, kamu luar biasa!";
                this.voiceCoach.speak(halfCue);
            }

            // 2. Countdown 10 Detik Terakhir
            if (!this.tenSecCued && this.timeLeft === 10) {
                this.tenSecCued = true;
                const tenCue = currentEx.voiceCues?.almostDone || "10 detik lagi! Tahan dan dorong sekuat tenaga!";
                this.voiceCoach.speak(tenCue);
            }

            // Beep 3, 2, 1 terakhir
            if (this.timeLeft <= 3 && this.timeLeft > 0) {
                this.soundEngine.playBeep(520, 0.1);
            }

            this.updateUi();

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.soundEngine.playBeep(780, 0.3);
                this.finishCurrentExercise();
            }
        }, 1000);
    }

    finishCurrentExercise() {
        if (this.currentIndex < this.routine.length - 1) {
            // Masuk ke fase istirahat (Rest Phase)
            this.startRestPhase();
        } else {
            // Seluruh gerakan selesai (Sesi Tamat)
            this.completeWorkoutSession();
        }
    }

    startRestPhase() {
        this.phase = 'rest';
        this.timeLeft = 30; // 30 detik istirahat standar
        this.totalDuration = 30;

        const nextEx = this.routine[this.currentIndex + 1];

        this.updateUi();

        // Voice coach bimbingan istirahat
        this.voiceCoach.speak(`Selesai! Waktu istirahat tiga puluh detik. Tarik napas dalam dan minum seteguk air. Gerakan selanjutnya: ${nextEx.name}.`);

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft <= 3 && this.timeLeft > 0) {
                this.soundEngine.playBeep(480, 0.1);
            }

            this.updateUi();

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.currentIndex++;
                this.soundEngine.playWhistle();
                this.startWorkPhase();
            }
        }, 1000);
    }

    skipRest() {
        if (this.phase === 'rest') {
            clearInterval(this.timerInterval);
            this.currentIndex++;
            this.soundEngine.playWhistle();
            this.startWorkPhase();
        }
    }

    pauseWorkout() {
        if (this.phase === 'work' || this.phase === 'rest' || this.phase === 'prep') {
            this.savedPhase = this.phase;
            this.phase = 'paused';
            clearInterval(this.timerInterval);
            this.voiceCoach.stop();
            this.updateUi();
        } else if (this.phase === 'paused') {
            this.phase = this.savedPhase || 'work';
            this.resumeTimer();
            this.updateUi();
        }
    }

    resumeTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.secondsElapsed++;

            if (this.phase === 'work') {
                const currentEx = this.routine[this.currentIndex];
                const calPerSec = (currentEx.caloriesPerMin || 9.0) / 60;
                this.caloriesBurned += calPerSec;

                if (!this.halfwayCued && this.timeLeft <= Math.floor(this.totalDuration / 2)) {
                    this.halfwayCued = true;
                    this.soundEngine.playChime();
                }
                if (this.timeLeft <= 3 && this.timeLeft > 0) {
                    this.soundEngine.playBeep(520, 0.1);
                }
            }

            this.updateUi();

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                if (this.phase === 'work') {
                    this.finishCurrentExercise();
                } else if (this.phase === 'rest') {
                    this.currentIndex++;
                    this.startWorkPhase();
                }
            }
        }, 1000);
    }

    nextExercise() {
        clearInterval(this.timerInterval);
        this.voiceCoach.stop();
        if (this.currentIndex < this.routine.length - 1) {
            this.currentIndex++;
            this.startWorkPhase();
        } else {
            this.completeWorkoutSession();
        }
    }

    prevExercise() {
        clearInterval(this.timerInterval);
        this.voiceCoach.stop();
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.startWorkPhase();
        } else {
            this.startWorkPhase();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.voiceCoach.enabled = !this.isMuted;
        if (this.isMuted) {
            this.voiceCoach.stop();
        }
        if (this.dom.btnToggleSound) {
            this.dom.btnToggleSound.innerHTML = this.isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        }
    }

    stopAndClose() {
        if (confirm("Apakah kamu yakin ingin menghentikan sesi latihan ini?")) {
            clearInterval(this.timerInterval);
            this.voiceCoach.stop();
            if (this.dom.playerModal) {
                this.dom.playerModal.classList.remove('active');
                this.dom.playerModal.style.display = 'none';
                document.body.classList.remove('workout-active-overflow');
            }
            this.phase = 'idle';
        }
    }

    completeWorkoutSession() {
        this.phase = 'completed';
        clearInterval(this.timerInterval);
        this.voiceCoach.stop();

        this.soundEngine.playVictory();
        this.voiceCoach.speak("Luar biasa! Kamu berhasil menuntaskan seluruh repetisi latihan hari ini dengan gemilang! Bangga dengan kerja kerasmu!");

        if (this.dom.playerModal) {
            this.dom.playerModal.classList.remove('active');
            this.dom.playerModal.style.display = 'none';
            document.body.classList.remove('workout-active-overflow');
        }

        const sessionResult = {
            title: this.sessionTitle,
            exercisesCount: this.routine.length,
            totalSeconds: this.secondsElapsed,
            calories: Math.round(this.caloriesBurned),
            completedAt: new Date().toISOString()
        };

        if (typeof this.onSessionComplete === 'function') {
            this.onSessionComplete(sessionResult);
        }
    }

    updateUi() {
        const currentEx = this.routine[this.currentIndex] || {};
        const nextEx = this.routine[this.currentIndex + 1];

        // Format waktu 00:00 atau detik
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        const formattedTime = (mins > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : `${secs}`);

        if (this.dom.timerNumber) {
            this.dom.timerNumber.innerText = formattedTime;
        }

        // Circular Radial Progress Ring (440px circumference = 2 * PI * 70)
        if (this.dom.radialProgress) {
            const circumference = 440;
            const targetDuration = (this.phase === 'prep') ? 5 : ((this.phase === 'rest') ? 30 : (this.totalDuration || 40));
            const ratio = Math.max(0, Math.min(1, this.timeLeft / targetDuration));
            const offset = circumference * (1 - ratio);
            this.dom.radialProgress.style.strokeDashoffset = offset;

            if (this.phase === 'work') {
                this.dom.radialProgress.style.stroke = 'var(--neon-volt)';
            } else if (this.phase === 'rest') {
                this.dom.radialProgress.style.stroke = 'var(--neon-cyan)';
            } else if (this.phase === 'prep') {
                this.dom.radialProgress.style.stroke = 'var(--neon-amber)';
            } else {
                this.dom.radialProgress.style.stroke = 'var(--neon-rose)';
            }
        }

        // Live Burned Calories Ticker
        if (this.dom.liveCalories) {
            this.dom.liveCalories.innerText = `${Math.round(this.caloriesBurned)} kkal`;
        }

        // Title & Subtitle
        if (this.dom.exerciseTitle) {
            if (this.phase === 'prep') {
                this.dom.exerciseTitle.innerText = "BERSIAP-SIAP!";
            } else if (this.phase === 'rest') {
                this.dom.exerciseTitle.innerText = "WAKTU ISTIRAHAT & REHIDRASI";
            } else if (this.phase === 'paused') {
                this.dom.exerciseTitle.innerText = "LATIHAN DIJEDA";
            } else {
                this.dom.exerciseTitle.innerText = currentEx.name || "Latihan";
            }
        }

        if (this.dom.exerciseSubtitle) {
            if (this.phase === 'prep') {
                this.dom.exerciseSubtitle.innerText = `Gerakan Pembuka: ${currentEx.name}`;
            } else if (this.phase === 'rest') {
                this.dom.exerciseSubtitle.innerText = nextEx ? `Berikutnya: ${nextEx.name}` : "Hampir Selesai!";
            } else {
                const targetText = currentEx.targetMuscles?.primary?.join(', ') || 'Seluruh Tubuh';
                this.dom.exerciseSubtitle.innerHTML = `<span class="badge bg-success-subtle text-success me-2">Target Otot:</span> ${targetText}`;
            }
        }

        // Badge Status Phase
        if (this.dom.phaseBadge) {
            if (this.phase === 'work') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-work';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-fire me-1"></i> AKTIF BERLATIH (${this.currentIndex + 1} / ${this.routine.length})`;
            } else if (this.phase === 'rest') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-rest';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-coffee me-1"></i> ISTIRAHAT (Napas Dalam)`;
            } else if (this.phase === 'prep') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-prep';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-flag me-1"></i> BERSIAP!`;
            } else if (this.phase === 'paused') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-paused';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-pause me-1"></i> PAUSED`;
            }
        }

        // Progress Bar (Total gerakan tuntas)
        if (this.dom.progressBar) {
            const pct = Math.round(((this.currentIndex) / this.routine.length) * 100);
            this.dom.progressBar.style.width = `${pct}%`;
        }

        // Animation Container
        if (this.dom.animContainer) {
            if (this.phase === 'rest') {
                this.dom.animContainer.innerHTML = `
                    <div class="rest-visual-box text-center p-4">
                        <div class="water-rest-icon mb-3"><i class="fas fa-tint text-info fa-3x fa-beat"></i></div>
                        <h4 class="text-white fw-bold mb-1">Tarik Napas Teratur</h4>
                        <p class="text-muted small mb-3">Rilekskan otot, teguk air sedikit dan siapkan mental untuk gerakan berikutnya.</p>
                        <button class="btn btn-outline-success btn-sm rounded-pill px-4" onclick="window.playerInstance.skipRest()">
                            Lewati Istirahat <i class="fas fa-forward ms-1"></i>
                        </button>
                    </div>
                `;
            } else {
                const animSvg = window.getExerciseAnimationSvg ? 
                    window.getExerciseAnimationSvg(currentEx.svgType, this.phase === 'work') : 
                    '<div class="py-5 text-center text-muted">Animasi Gerakan Aktif</div>';
                this.dom.animContainer.innerHTML = animSvg;
            }
        }

        // Next Exercise Preview
        if (this.dom.nextPreview) {
            if (nextEx) {
                this.dom.nextPreview.innerHTML = `
                    <span class="text-muted small">Gerakan Selanjutnya:</span>
                    <strong class="text-light ms-2">${nextEx.name}</strong>
                `;
            } else {
                this.dom.nextPreview.innerHTML = `<span class="text-success small fw-bold"><i class="fas fa-trophy me-1"></i> Ini Gerakan Terakhir!</span>`;
            }
        }

        // Pause/Play Button State
        if (this.dom.btnPause) {
            this.dom.btnPause.innerHTML = this.phase === 'paused' ? 
                '<i class="fas fa-play"></i>' : 
                '<i class="fas fa-pause"></i>';
        }
    }
}

// Global Export
window.WorkoutPlayer = WorkoutPlayer;
