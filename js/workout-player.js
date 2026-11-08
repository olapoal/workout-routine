/**
 * js/workout-player.js
 * Interactive Real-Time Workout Player & Live Voice Personal Trainer Guide (v3.0)
 * - Smooth 60 FPS Biomechanical Canvas preservation (tanpa kedip/reset setiap detik)
 * - Live Personal Trainer Tempo, Rep & Breathing Cues setiap beberapa detik
 * - Spoken Countdown 5-4-3-2-1 + Live Coach Teleprompter Bar
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
        this.lastRenderedState = '';

        // Metrik akumulasi
        this.caloriesBurned = 0;
        this.secondsElapsed = 0;

        this.dom = {
            playerModal: null,
            timerNumber: null,
            radialProgress: null,
            liveCalories: null,
            exerciseTitle: null,
            exerciseSubtitle: null,
            animContainer: null,
            phaseBadge: null,
            progressBar: null,
            nextPreview: null,
            coachTeleprompter: null,
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
        this.dom.coachTeleprompter = document.getElementById('playerCoachSpeechText');
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
        this.lastRenderedState = '';

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
        const prepSpeech = `Bersiap! Sesi dimulai dalam lima detik. Ambil posisi untuk gerakan pertama: ${currentEx.name}. Fokuskan pikiranmu!`;
        this.voiceCoach.speak(prepSpeech);

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

        // Voice Coach instruksi awal gerakan + pernapasan
        const cueStart = currentEx.voiceCues?.start || `Mulai ${currentEx.name}! Pertahankan form terbaik!`;
        this.voiceCoach.speak(cueStart);

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.secondsElapsed++;
            
            // Hitung estimasi kalori terbakar
            const calPerSec = (currentEx.caloriesPerMin || 9.0) / 60;
            this.caloriesBurned += calPerSec;

            const elapsedInSet = this.totalDuration - this.timeLeft;

            // 1. Live PT Tempo & Breathing Cue pada detik ke-9 (jika belum separuh waktu)
            if (elapsedInSet === 9 && this.timeLeft > 15) {
                const breathTip = currentEx.breathing || "Atur napas teratur, jangan menahan napas!";
                this.voiceCoach.speak(`Bagus sekali! Jaga ritme gerakanmu. ${breathTip}`);
            }

            // 2. Separuh Waktu (50%)
            if (!this.halfwayCued && this.timeLeft === Math.floor(this.totalDuration / 2)) {
                this.halfwayCued = true;
                this.soundEngine.playChime();
                const halfCue = currentEx.voiceCues?.halfway || "Setengah waktu terlewati! Pertahankan kontrol ototmu, kamu sangat kuat!";
                this.voiceCoach.speak(halfCue);
            }

            // 3. Countdown 10 Detik Terakhir
            if (!this.tenSecCued && this.timeLeft === 10) {
                this.tenSecCued = true;
                const tenCue = currentEx.voiceCues?.almostDone || "Sepuluh detik terakhir! Jangan berhenti sekarang, habiskan sisa tenagamu!";
                this.voiceCoach.speak(tenCue);
            }

            // 4. Hitungan Suara PT 3-2-1 Terakhir + Beep
            if (this.timeLeft <= 3 && this.timeLeft > 0) {
                this.soundEngine.playBeep(560 + (3 - this.timeLeft) * 90, 0.11);
                const countWords = { 3: "Tiga!", 2: "Dua!", 1: "Satu! Tahan!" };
                if (countWords[this.timeLeft] && !this.voiceCoach.isSpeaking) {
                    this.voiceCoach.speak(countWords[this.timeLeft]);
                }
            }

            this.updateUi();

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.soundEngine.playBeep(820, 0.32);
                this.finishCurrentExercise();
            }
        }, 1000);
    }

    finishCurrentExercise() {
        if (this.currentIndex < this.routine.length - 1) {
            this.startRestPhase();
        } else {
            this.completeWorkoutSession();
        }
    }

    startRestPhase() {
        this.phase = 'rest';
        this.timeLeft = 25; // 25 detik istirahat aktif
        this.totalDuration = 25;

        const nextEx = this.routine[this.currentIndex + 1];

        this.updateUi();

        const targetMuscles = nextEx.targetMuscles?.primary?.join(' dan ') || 'otot utama';
        this.voiceCoach.speak(`Set selesai, kerja bagus! Istirahat dua puluh lima detik. Lemaskan bahu, tarik napas panjang lewat hidung, dan teguk sedikit air. Bersiap untuk gerakan ke-${this.currentIndex + 2}: ${nextEx.name} untuk melatih ${targetMuscles}.`);

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft === 6) {
                this.voiceCoach.speak(`Enam detik lagi! Ambil posisi untuk ${nextEx.name}!`);
            }

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
            this.voiceCoach.speak("Latihan dijeda sejenak. Tekan tombol lanjutkan kapan pun kamu siap!");
            this.updateUi();
        } else if (this.phase === 'paused') {
            this.phase = this.savedPhase || 'work';
            this.voiceCoach.speak("Ayo kita lanjutkan! Fokus kembali!");
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

    /**
     * Tombol Interaktif di dalam Workout Player: Minta Semangat PT Langsung!
     */
    triggerLiveMotivation() {
        this.soundEngine.playChime();
        const currentEx = this.routine[this.currentIndex] || {};
        const cheers = [
            `Ayo jangan menyerah di ${currentEx.name || 'gerakan ini'}! Rasa panas di ototmu itu tandanya lemak sedang hancur dan ototmu sedang terbentuk! Dorong terus!`,
            `Kuatkan mentalmu! Tinggal ${this.timeLeft} detik lagi! Bayangkan hasil tubuh atletis yang kamu impikan, sikat habis repetisi ini!`,
            `Posturmu keren banget! Kunci perutmu, jaga napas tetap stabil, tunjukkan bahwa kamu lebih tangguh dari rasa lelahmu!`
        ];
        const msg = cheers[Math.floor(Math.random() * cheers.length)];
        this.voiceCoach.speak(msg);
    }

    /**
     * Tombol Interaktif di dalam Workout Player: Bacakan Koreksi Form & Teknik
     */
    triggerLiveFormTip() {
        const currentEx = this.routine[this.currentIndex];
        if (!currentEx) return;
        const step = currentEx.steps?.[0] || '';
        const mistake = currentEx.commonMistakes?.[0] || '';
        const msg = `Panduan presisi untuk ${currentEx.name}: ${step} Hindari kesalahan ini: ${mistake} Tempo ideal: ${currentEx.tempo || 'terkontrol'}.`;
        this.voiceCoach.speak(msg);
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
                '<i class="fas fa-volume-mute text-danger"></i>' : 
                '<i class="fas fa-volume-up text-success"></i>';
        }
    }

    stopAndClose() {
        if (confirm("Apakah kamu yakin ingin mengakhiri sesi latihan ini lebih awal?")) {
            clearInterval(this.timerInterval);
            this.voiceCoach.stop();
            if (window.BiomechEngine) window.BiomechEngine.stopActive();
            if (this.dom.playerModal) {
                this.dom.playerModal.classList.remove('active');
                this.dom.playerModal.style.display = 'none';
                document.body.classList.remove('workout-active-overflow');
            }
            this.phase = 'idle';
            this.lastRenderedState = '';
        }
    }

    completeWorkoutSession() {
        this.phase = 'completed';
        clearInterval(this.timerInterval);
        this.voiceCoach.stop();
        if (window.BiomechEngine) window.BiomechEngine.stopActive();

        this.soundEngine.playVictory();
        this.voiceCoach.speak("Luar biasa! Kamu berhasil menuntaskan seluruh sesi latihan hari ini dengan sempurna! Saya sangat bangga dengan dedikasi dan kerja kerasmu. Sekarang minum air putih dan istirahatkan ototmu!");

        if (this.dom.playerModal) {
            this.dom.playerModal.classList.remove('active');
            this.dom.playerModal.style.display = 'none';
            document.body.classList.remove('workout-active-overflow');
        }

        const sessionResult = {
            title: this.sessionTitle,
            exercisesCount: this.routine.length,
            totalSeconds: this.secondsElapsed,
            calories: Math.max(12, Math.round(this.caloriesBurned)),
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
            const targetDuration = (this.phase === 'prep') ? 5 : ((this.phase === 'rest') ? 25 : (this.totalDuration || 40));
            const ratio = Math.max(0, Math.min(1, this.timeLeft / targetDuration));
            const offset = circumference * (1 - ratio);
            this.dom.radialProgress.style.strokeDashoffset = offset;

            if (this.phase === 'work') {
                this.dom.radialProgress.style.stroke = '#10b981';
            } else if (this.phase === 'rest') {
                this.dom.radialProgress.style.stroke = '#38bdf8';
            } else if (this.phase === 'prep') {
                this.dom.radialProgress.style.stroke = '#f59e0b';
            } else {
                this.dom.radialProgress.style.stroke = '#f43f5e';
            }
        }

        // Live Burned Calories Ticker
        if (this.dom.liveCalories) {
            this.dom.liveCalories.innerText = `${Math.round(this.caloriesBurned)} kkal`;
        }

        // Title & Subtitle
        if (this.dom.exerciseTitle) {
            if (this.phase === 'prep') {
                this.dom.exerciseTitle.innerText = `BERSIAP: ${currentEx.name || 'Latihan'}`;
            } else if (this.phase === 'rest') {
                this.dom.exerciseTitle.innerText = "PEMULIHAN NAPAS & REHIDRASI";
            } else if (this.phase === 'paused') {
                this.dom.exerciseTitle.innerText = "SESI LATIHAN DIJEDA";
            } else {
                this.dom.exerciseTitle.innerText = currentEx.name || "Latihan";
            }
        }

        if (this.dom.exerciseSubtitle) {
            if (this.phase === 'prep') {
                this.dom.exerciseSubtitle.innerHTML = `<span class="text-warning fw-semibold">Ambil posisi awal sekarang</span> • Target: ${currentEx.targetMuscles?.primary?.join(', ') || 'Full Body'}`;
            } else if (this.phase === 'rest') {
                this.dom.exerciseSubtitle.innerText = nextEx ? `Bersiap Gerakan Selanjutnya: ${nextEx.name}` : "Hampir Selesai!";
            } else {
                const targetText = currentEx.targetMuscles?.primary?.join(', ') || 'Seluruh Tubuh';
                this.dom.exerciseSubtitle.innerHTML = `<span class="badge bg-success-subtle text-success me-2">Otot Aktif:</span> ${targetText} <span class="mx-2 text-muted">•</span> <span class="text-info small">${currentEx.tempo || 'Tempo Stabil'}</span>`;
            }
        }

        // Badge Status Phase
        if (this.dom.phaseBadge) {
            if (this.phase === 'work') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-work';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-fire me-1"></i> GERAKAN ${this.currentIndex + 1} DARI ${this.routine.length}`;
            } else if (this.phase === 'rest') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-rest';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-wind me-1"></i> FASE ISTIRAHAT`;
            } else if (this.phase === 'prep') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-prep';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-bolt me-1"></i> BERSIAP MULAI`;
            } else if (this.phase === 'paused') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-paused';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-pause me-1"></i> DIJEDA`;
            }
        }

        // Progress Bar (Total gerakan tuntas)
        if (this.dom.progressBar) {
            const pct = Math.round(((this.currentIndex) / this.routine.length) * 100);
            this.dom.progressBar.style.width = `${pct}%`;
        }

        // PENTING: Render ulang kontainer animasi HANYA saat fase (rest vs aktif) atau indeks gerakan berubah
        // agar kanvas 60 FPS tidak berkedip/reset setiap detik!
        const desiredStateKey = (this.phase === 'rest') ? `rest_${this.currentIndex}` : `active_${this.currentIndex}_${currentEx.svgType}`;
        if (this.dom.animContainer && this.lastRenderedState !== desiredStateKey) {
            this.lastRenderedState = desiredStateKey;

            if (this.phase === 'rest') {
                const nextAnimHtml = nextEx && window.getExerciseAnimationSvg
                    ? window.getExerciseAnimationSvg(nextEx.svgType, false)
                    : '';
                this.dom.animContainer.innerHTML = `
                    <div class="rest-visual-box text-center p-3 w-100">
                        <div class="d-flex align-items-center justify-content-between mb-2 px-2">
                            <span class="badge bg-info bg-opacity-15 text-info border border-info border-opacity-25 px-3 py-1 rounded-pill">
                                <i class="fas fa-droplet me-1"></i> Tarik Napas & Minum Air
                            </span>
                            <button class="btn btn-success btn-sm rounded-pill px-3 fw-bold" onclick="window.playerInstance.skipRest()">
                                Lewati Istirahat <i class="fas fa-forward ms-1"></i>
                            </button>
                        </div>
                        ${nextEx ? `<div class="small text-secondary mb-2">Preview Gerakan Berikutnya: <strong class="text-white">${nextEx.name}</strong></div>` : ''}
                        ${nextAnimHtml}
                    </div>
                `;
            } else {
                const animHtml = window.getExerciseAnimationSvg
                    ? window.getExerciseAnimationSvg(currentEx.svgType, true)
                    : '<div class="py-5 text-center text-muted">Animasi Gerakan Aktif</div>';
                this.dom.animContainer.innerHTML = animHtml;
            }
        }

        // Next Exercise Preview
        if (this.dom.nextPreview) {
            if (nextEx) {
                this.dom.nextPreview.innerHTML = `
                    <span class="text-muted small">Selanjutnya (${this.currentIndex + 2}/${this.routine.length}):</span>
                    <strong class="text-light ms-2">${nextEx.name}</strong>
                    <span class="text-success small font-monospace ms-2">(${nextEx.duration || 40}s)</span>
                `;
            } else {
                this.dom.nextPreview.innerHTML = `<span class="text-success small fw-bold"><i class="fas fa-trophy me-1"></i> Ini Gerakan Terakhir! Berikan 100% Tenagamu!</span>`;
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
