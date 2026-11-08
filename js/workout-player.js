/**
 * js/workout-player.js
 * Interactive Real-Time Workout Player & Live Voice Personal Trainer Guide (v5.0)
 * Fitur Lengkap:
 * 1. Dual Execution Mode:
 *    - Mode Waktu (Timer Countdown): Coach mengingatkan di titik-titik waktu tersisa (30s, 20s, separuh waktu, 15s, 10s, 5-4-3-2-1).
 *    - Mode Repetisi (Live Rep Counter): Coach menghitung setiap repetisi secara lisan ("Satu! ... Dua! ... Tiga!") sesuai ritme biomekanik gerakan + panduan napas & semangat!
 * 2. Interactive Rest Phase (Fase Jeda / Istirahat):
 *    - Countdown timer jeda + tombol "+15d" dan "Lewati Istirahat".
 *    - Coach aktif memberikan informasi otot gerakan berikutnya, tips pemulihan napas, dan membakar semangat di tengah jeda serta mengingatkan di sisa 10 detik & 5-4-3-2-1 sebelum set berikutnya dimulai.
 * 3. Single Exercise / Multi-Set Mode:
 *    - Bisa langsung dimulai dari Katalog Gerakan, Modal Detail Gerakan, maupun baris gerakan di Jadwal Harian.
 */

class WorkoutPlayer {
    constructor(soundEngine, voiceCoach, onSessionComplete) {
        this.soundEngine = soundEngine;
        this.voiceCoach = voiceCoach;
        this.onSessionComplete = onSessionComplete;

        this.routine = [];
        this.currentIndex = 0;
        this.phase = 'idle'; // 'prep' | 'work' | 'rest' | 'paused' | 'completed'
        this.executionMode = 'time'; // 'time' (Countdown Waktu) | 'reps' (Hitungan Repetisi Coach)

        // State untuk Mode Waktu
        this.timeLeft = 0;
        this.totalDuration = 0;
        this.cuedMilestones = new Set();

        // State untuk Mode Repetisi
        this.currentRep = 0;
        this.targetReps = 12;
        this.repCadenceTimer = null;
        this.repSubStep = 0;

        this.timerInterval = null;
        this.isMuted = false;
        this.lastRenderedState = '';
        this.isSingleExerciseSession = false;

        // Metrik akumulasi
        this.caloriesBurned = 0;
        this.secondsElapsed = 0;

        this.dom = {
            playerModal: null,
            timerNumber: null,
            timerUnitLabel: null,
            radialProgress: null,
            liveCalories: null,
            exerciseTitle: null,
            exerciseSubtitle: null,
            animContainer: null,
            phaseBadge: null,
            progressBar: null,
            nextPreview: null,
            coachTeleprompter: null,
            modeSwitchContainer: null,
            btnModeTime: null,
            btnModeReps: null,
            btnPause: null,
            btnSkip: null,
            btnPrev: null,
            btnToggleSound: null
        };
    }

    initDomElements() {
        this.dom.playerModal = document.getElementById('workoutPlayerModal');
        this.dom.timerNumber = document.getElementById('playerTimerDisplay');
        this.dom.timerUnitLabel = document.getElementById('playerTimerUnitLabel');
        this.dom.radialProgress = document.getElementById('playerRadialProgress');
        this.dom.liveCalories = document.getElementById('playerLiveCalories');
        this.dom.exerciseTitle = document.getElementById('playerExerciseTitle');
        this.dom.exerciseSubtitle = document.getElementById('playerExerciseSubtitle');
        this.dom.animContainer = document.getElementById('playerAnimContainer');
        this.dom.phaseBadge = document.getElementById('playerPhaseBadge');
        this.dom.progressBar = document.getElementById('playerProgressBar');
        this.dom.nextPreview = document.getElementById('playerNextPreview');
        this.dom.coachTeleprompter = document.getElementById('playerCoachSpeechText');
        this.dom.modeSwitchContainer = document.getElementById('playerModeSwitchBox');
        this.dom.btnModeTime = document.getElementById('playerBtnModeTime');
        this.dom.btnModeReps = document.getElementById('playerBtnModeReps');
        this.dom.btnPause = document.getElementById('playerBtnPause');
        this.dom.btnSkip = document.getElementById('playerBtnSkip');
        this.dom.btnPrev = document.getElementById('playerBtnPrev');
        this.dom.btnToggleSound = document.getElementById('playerBtnToggleSound');
    }

    /**
     * Mulai Sesi Latihan Lengkap (atau Single Exercise)
     * @param {Array} exercisesList - Daftar gerakan
     * @param {String} sessionTitle - Judul sesi
     * @param {Object} options - { initialMode: 'time'|'reps', startIndex: 0, isSingle: false }
     */
    startWorkout(exercisesList, sessionTitle = "Sesi Latihan Hari Ini", options = {}) {
        if (!exercisesList || exercisesList.length === 0) {
            alert("Tidak ada gerakan dalam program ini.");
            return;
        }

        this.routine = exercisesList;
        this.currentIndex = options.startIndex || 0;
        this.caloriesBurned = 0;
        this.secondsElapsed = 0;
        this.sessionTitle = sessionTitle;
        this.lastRenderedState = '';
        this.isSingleExerciseSession = !!options.isSingle;

        // Tentukan mode awal: 'time' atau 'reps'
        const currentEx = this.routine[this.currentIndex];
        if (options.initialMode) {
            this.executionMode = options.initialMode;
        } else if (currentEx && currentEx.svgType === 'plank') {
            this.executionMode = 'time';
        } else {
            this.executionMode = this.executionMode || 'time';
        }

        this.initDomElements();
        this.updateModeButtonsUI();

        if (this.dom.playerModal) {
            this.dom.playerModal.classList.add('active');
            this.dom.playerModal.style.display = 'flex';
            document.body.classList.add('workout-active-overflow');
        }

        this.startPreparationPhase();
    }

    /**
     * Mulai Latihan 1 Gerakan Spesifik (Misalnya dari Katalog Gerakan atau Modal Detail)
     * Otomatis membuat 3 Set latihan dengan jeda istirahat terpandu Coach!
     */
    startSingleExerciseSession(exerciseId, preferredMode = 'reps', totalSets = 3) {
        const baseEx = window.EXERCISE_DATABASE?.[exerciseId];
        if (!baseEx) return;

        // Jika gerakan statis seperti Plank, gunakan mode 'time'
        const mode = (baseEx.svgType === 'plank') ? 'time' : preferredMode;

        const setsList = [];
        for (let s = 1; s <= totalSets; s++) {
            setsList.push({
                ...baseEx,
                name: `${baseEx.name} (Set ${s}/${totalSets})`,
                duration: baseEx.defaultDuration || 40,
                targetReps: baseEx.defaultReps || 12
            });
        }

        this.startWorkout(setsList, `Latihan Fokus: ${baseEx.name}`, {
            initialMode: mode,
            startIndex: 0,
            isSingle: true
        });
    }

    /**
     * Ganti Mode Panduan Coach secara Live (Mode Countdown Waktu <-> Mode Hitungan Repetisi)
     */
    switchExecutionMode(newMode) {
        if (newMode !== 'time' && newMode !== 'reps') return;
        const currentEx = this.routine[this.currentIndex];
        if (newMode === 'reps' && currentEx && currentEx.svgType === 'plank') {
            this.voiceCoach.speak("Gerakan Plank adalah latihan tahanan statis, jadi Coach memandumu menggunakan mode hitungan waktu detik!");
            return;
        }

        this.executionMode = newMode;
        this.updateModeButtonsUI();

        if (this.phase === 'work') {
            clearInterval(this.timerInterval);
            clearTimeout(this.repCadenceTimer);
            this.voiceCoach.stop();
            this.startWorkPhase();
        } else {
            const modeLabel = newMode === 'reps' ? 'Mode Hitungan Repetisi Coach' : 'Mode Timer Countdown Waktu';
            this.voiceCoach.speak(`Berpindah ke ${modeLabel}!`);
            this.updateUi();
        }
    }

    updateModeButtonsUI() {
        if (this.dom.btnModeTime && this.dom.btnModeReps) {
            if (this.executionMode === 'time') {
                this.dom.btnModeTime.classList.add('active', 'btn-success');
                this.dom.btnModeTime.classList.remove('btn-outline-secondary');
                this.dom.btnModeReps.classList.remove('active', 'btn-success');
                this.dom.btnModeReps.classList.add('btn-outline-secondary');
            } else {
                this.dom.btnModeReps.classList.add('active', 'btn-success');
                this.dom.btnModeReps.classList.remove('btn-outline-secondary');
                this.dom.btnModeTime.classList.remove('active', 'btn-success');
                this.dom.btnModeTime.classList.add('btn-outline-secondary');
            }
        }
    }

    clearAllTimers() {
        clearInterval(this.timerInterval);
        clearTimeout(this.repCadenceTimer);
    }

    /**
     * FASE 1: PERSIAPAN (GET READY COUNTDOWN 5 DETIK)
     */
    startPreparationPhase() {
        this.clearAllTimers();
        this.phase = 'prep';
        this.timeLeft = 5;
        this.cuedMilestones.clear();

        const currentEx = this.routine[this.currentIndex];
        const targetInfo = (this.executionMode === 'reps' && currentEx.svgType !== 'plank')
            ? `Target kita ${currentEx.targetReps || currentEx.defaultReps || 12} repetisi, ikuti aba-aba hitungan saya!`
            : `Durasi ${currentEx.duration || currentEx.defaultDuration || 40} detik, saya akan mengingatkan sisa waktumu!`;

        this.updateUi();
        this.voiceCoach.speak(`Bersiap! Ambil posisi untuk ${currentEx.name}. ${targetInfo} Mulai dalam lima detik!`);

        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 1) {
                this.soundEngine.playBeep(440 + (5 - this.timeLeft) * 80, 0.1);
            } else if (this.timeLeft === 1) {
                this.soundEngine.playBeep(880, 0.25);
            }

            this.timeLeft--;
            this.updateUi();

            if (this.timeLeft <= 0) {
                this.clearAllTimers();
                this.soundEngine.playWhistle();
                this.startWorkPhase();
            }
        }, 1000);
    }

    /**
     * FASE 2: EKSEKUSI GERAKAN (MODE WAKTU ATAU MODE REPETISI)
     */
    startWorkPhase() {
        this.clearAllTimers();
        this.phase = 'work';
        const currentEx = this.routine[this.currentIndex];

        // Jika gerakan Plank, otomatis pakai Mode Waktu
        const effectiveMode = (currentEx.svgType === 'plank') ? 'time' : this.executionMode;

        if (effectiveMode === 'reps') {
            this.startRepCountingWorkPhase(currentEx);
        } else {
            this.startTimedCountdownWorkPhase(currentEx);
        }
    }

    /**
     * MODE A: TIMER COUNTDOWN DENGAN PENGINGAT TITIK-TITIK WAKTU OLEH COACH
     */
    startTimedCountdownWorkPhase(currentEx) {
        this.timeLeft = currentEx.duration || currentEx.defaultDuration || 40;
        this.totalDuration = this.timeLeft;
        this.cuedMilestones.clear();

        this.updateUi();

        const cueStart = currentEx.voiceCues?.start || `Mulai ${currentEx.name} sekarang! Jaga form dan pernapasanmu!`;
        this.voiceCoach.speak(`${cueStart} Waktu berjalan ${this.totalDuration} detik!`);

        const halfwayPoint = Math.floor(this.totalDuration / 2);

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.secondsElapsed++;

            const calPerSec = (currentEx.caloriesPerMin || 9.0) / 60;
            this.caloriesBurned += calPerSec;

            const elapsed = this.totalDuration - this.timeLeft;

            // 1. Detik ke-8: Panduan Pernapasan & Fokus Otot
            if (elapsed === 8 && this.timeLeft > 14 && !this.cuedMilestones.has('breath')) {
                this.cuedMilestones.add('breath');
                const breathTip = currentEx.breathing || 'Tarik napas lewat hidung, hembuskan kuat lewat mulut!';
                this.voiceCoach.speak(`Bagus! Pertahankan temponya. ${breathTip}`);
            }

            // 2. Titik Sisa 30 Detik (Untuk durasi >= 45 detik)
            if (this.totalDuration >= 45 && this.timeLeft === 30 && !this.cuedMilestones.has('30s')) {
                this.cuedMilestones.add('30s');
                this.soundEngine.playBeep(620, 0.08);
                this.voiceCoach.speak(`Waktu tersisa tiga puluh detik! Jaga kontrol ototmu tetap stabil!`);
            }

            // 3. Titik Separuh Waktu (50% Durasi)
            if (this.timeLeft === halfwayPoint && Math.abs(halfwayPoint - 20) > 2 && Math.abs(halfwayPoint - 15) > 2 && !this.cuedMilestones.has('half')) {
                this.cuedMilestones.add('half');
                this.soundEngine.playChime();
                const halfCue = currentEx.voiceCues?.halfway || 'Separuh waktu terlewati! Kamu sangat tangguh!';
                this.voiceCoach.speak(`Setengah jalan, sisa ${this.timeLeft} detik! ${halfCue}`);
            }

            // 4. Titik Sisa 20 Detik (Untuk durasi >= 35 detik)
            if (this.totalDuration >= 35 && this.timeLeft === 20 && !this.cuedMilestones.has('20s')) {
                this.cuedMilestones.add('20s');
                this.soundEngine.playChime();
                this.voiceCoach.speak(`Sisa waktu dua puluh detik lagi! Rasakan otot ${currentEx.targetMuscles?.primary?.[0] || 'utamamu'} bekerja keras!`);
            }

            // 5. Titik Sisa 15 Detik (Untuk durasi < 35 detik)
            if (this.totalDuration < 35 && this.timeLeft === 15 && !this.cuedMilestones.has('15s')) {
                this.cuedMilestones.add('15s');
                this.soundEngine.playChime();
                this.voiceCoach.speak(`Sisa lima belas detik! Jangan kendurkan posturmu!`);
            }

            // 6. Titik Sisa 10 Detik Terakhir!
            if (this.timeLeft === 10 && !this.cuedMilestones.has('10s')) {
                this.cuedMilestones.add('10s');
                this.soundEngine.playBeep(700, 0.12);
                const tenCue = currentEx.voiceCues?.almostDone || 'Jangan berhenti sekarang, dorong sampai akhir!';
                this.voiceCoach.speak(`Sepuluh detik terakhir! ${tenCue}`);
            }

            // 7. Hitungan Mundur Lisan Coach 5 - 4 - 3 - 2 - 1
            if (this.timeLeft === 5 && !this.cuedMilestones.has('5s')) {
                this.cuedMilestones.add('5s');
                this.soundEngine.playBeep(660, 0.1);
                this.voiceCoach.speak(`Lima detik lagi! Empat! Tiga! Dua! Satu!`);
            } else if (this.timeLeft <= 4 && this.timeLeft > 0) {
                this.soundEngine.playBeep(660 + (5 - this.timeLeft) * 60, 0.1);
            }

            this.updateUi();

            if (this.timeLeft <= 0) {
                this.clearAllTimers();
                this.soundEngine.playBeep(880, 0.35);
                this.finishCurrentExercise();
            }
        }, 1000);
    }

    /**
     * MODE B: HITUNGAN REPETISI LANGSUNG OLEH COACH (LIVE REP COUNTER)
     * Coach memandu fase turun/naik dan menghitung "Satu! ... Dua! ... Tiga!" sampai target repetisi tercapai!
     */
    startRepCountingWorkPhase(currentEx) {
        this.targetReps = currentEx.targetReps || currentEx.defaultReps || 12;
        this.currentRep = 0;

        // Durasi per 1 repetisi penuh disesuaikan dengan jenis gerakan (rata-rata 2.8 - 3.6 detik agar form terkontrol)
        const fastMovements = ['jumping_jack', 'climber'];
        const repDurationMs = fastMovements.includes(currentEx.svgType) ? 2300 : 3400;

        // Ticker detik dan kalori di background
        this.timerInterval = setInterval(() => {
            if (this.phase === 'work') {
                this.secondsElapsed++;
                const calPerSec = (currentEx.caloriesPerMin || 9.5) / 60;
                this.caloriesBurned += calPerSec;
                if (this.dom.liveCalories) {
                    this.dom.liveCalories.innerText = `${Math.round(this.caloriesBurned)} kkal`;
                }
            }
        }, 1000);

        this.updateUi();

        const angkaKata = [
            '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh',
            'Sebelas', 'Dua belas', 'Tiga belas', 'Empat belas', 'Lima belas', 'Enam belas', 'Tujuh belas',
            'Delapan belas', 'Sembilan belas', 'Dua puluh', 'Dua puluh satu', 'Dua puluh dua', 'Dua puluh tiga',
            'Dua puluh empat', 'Dua puluh lima', 'Dua puluh enam', 'Dua puluh tujuh', 'Dua puluh delapan',
            'Dua puluh sembilan', 'Tiga puluh'
        ];

        // Petunjuk fase gerak sesuai tipe latihan
        const getActionCue = (svgType, repNum) => {
            if (svgType === 'pushup') return repNum % 2 === 1 ? 'Turun dada... Dorong naik!' : 'Tarik napas turun... Hembuskan dorong!';
            if (svgType === 'squat' || svgType === 'lunge') return repNum % 2 === 1 ? 'Turun pinggul... Berdiri kuat!' : 'Jongkok dalam... Dorong tumit!';
            if (svgType === 'crunch' || svgType === 'bicycle' || svgType === 'leg_raise') return repNum % 2 === 1 ? 'Angkat dan peras perut!' : 'Kontraksi core... Tahan!';
            if (svgType === 'bent_row' || svgType === 'bicep_curl') return repNum % 2 === 1 ? 'Tarik beban... Turun perlahan!' : 'Remas otot di puncak!';
            if (svgType === 'shoulder_press') return 'Dorong ke atas kepala... Kontrol turun!';
            if (svgType === 'glute_bridge' || svgType === 'superman') return 'Angkat tinggi dan tahan... Turun!';
            return 'Gerak penuh semangat!';
        };

        // Kalimat pembuka sebelum repetisi ke-1
        this.voiceCoach.speak(`Mulai ${currentEx.name}! Target ${this.targetReps} repetisi. Ikuti hitungan saya!`);

        const runNextRep = () => {
            if (this.phase !== 'work') return;

            this.currentRep++;
            this.soundEngine.playBeep(580 + (this.currentRep * 12), 0.09);
            this.updateUi();

            const numWord = angkaKata[this.currentRep] || `${this.currentRep}`;
            const halfRep = Math.floor(this.targetReps / 2);
            const remainingReps = this.targetReps - this.currentRep;

            let coachLine = `${numWord}!`;

            if (this.currentRep === 1) {
                coachLine = `Satu! ${getActionCue(currentEx.svgType, 1)}`;
            } else if (this.currentRep === 3) {
                coachLine = `Tiga! Bagus, pertahankan ritme napasmu!`;
            } else if (this.currentRep === halfRep) {
                this.soundEngine.playChime();
                coachLine = `${numWord}! Setengah jalan, tinggal ${remainingReps} repetisi lagi! Jangan kasih kendor!`;
            } else if (remainingReps === 3) {
                coachLine = `${numWord}! Tinggal tiga repetisi terakhir! Habiskan tenagamu!`;
            } else if (remainingReps === 2) {
                coachLine = `${numWord}! Dua lagi, ayo paksa ototmu!`;
            } else if (remainingReps === 1) {
                coachLine = `${numWord}! Satu repetisi terakhir, berikan yang paling sempurna!`;
            } else if (remainingReps === 0) {
                coachLine = `${numWord}! Selesai! Target ${this.targetReps} repetisi tuntas dengan gemilang!`;
            } else if (this.currentRep % 2 === 0) {
                coachLine = `${numWord}! ${getActionCue(currentEx.svgType, this.currentRep)}`;
            } else {
                coachLine = `${numWord}! Mantap!`;
            }

            this.voiceCoach.speak(coachLine);

            if (this.currentRep >= this.targetReps) {
                this.repCadenceTimer = setTimeout(() => {
                    if (this.phase === 'work') {
                        this.soundEngine.playBeep(880, 0.35);
                        this.finishCurrentExercise();
                    }
                }, 2200);
            } else {
                this.repCadenceTimer = setTimeout(runNextRep, repDurationMs);
            }
        };

        // Mulai repetisi pertama setelah pengantar singkat (2.2 detik)
        this.repCadenceTimer = setTimeout(runNextRep, 2200);
    }

    finishCurrentExercise() {
        this.clearAllTimers();
        if (this.currentIndex < this.routine.length - 1) {
            this.startRestPhase();
        } else {
            this.completeWorkoutSession();
        }
    }

    /**
     * FASE 3: JEDA ISTIRAHAT (REST PHASE) DENGAN COUNTDOWN, INFO GERAKAN BERIKUTNYA & MOTIVASI COACH
     */
    startRestPhase() {
        this.clearAllTimers();
        this.phase = 'rest';
        this.timeLeft = 25; // 25 detik waktu jeda standar
        this.totalDuration = 25;
        this.cuedMilestones.clear();

        const completedEx = this.routine[this.currentIndex];
        const nextEx = this.routine[this.currentIndex + 1];
        const nextMuscles = nextEx.targetMuscles?.primary?.join(' dan ') || 'otot utama';
        const nextTargetText = (this.executionMode === 'reps' && nextEx.svgType !== 'plank')
            ? `${nextEx.targetReps || nextEx.defaultReps || 12} repetisi`
            : `durasi ${nextEx.duration || nextEx.defaultDuration || 40} detik`;

        this.updateUi();

        // Coach langsung memberikan apresiasi, instruksi jeda, dan info detail gerakan selanjutnya
        this.voiceCoach.speak(
            `Kerja bagus menyelesaikan ${completedEx.name}! Sekarang waktu jeda istirahat dua puluh lima detik. ` +
            `Atur napasmu perlahan lewat hidung, lemaskan bahu, dan minum seteguk air. ` +
            `Gerakan selanjutnya adalah ${nextEx.name} dengan target ${nextTargetText} untuk membentuk ${nextMuscles}.`
        );

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.secondsElapsed++;

            // 1. Saat waktu jeda tersisa 14 detik: Coach memberikan semangat & tips teknik gerakan berikutnya
            if (this.timeLeft === 14 && !this.cuedMilestones.has('rest_info')) {
                this.cuedMilestones.add('rest_info');
                const tip = nextEx.voiceCues?.tip || nextEx.steps?.[0] || 'Jaga postur tubuh tetap tegap dan stabil.';
                this.voiceCoach.speak(`Waktu istirahat tersisa empat belas detik! Tetap semangat, jangan biarkan tubuhmu dingin. Tips untuk ${nextEx.name}: ${tip}`);
            }

            // 2. Saat waktu jeda tersisa 7 detik: Peringatan bersiap ambil posisi!
            if (this.timeLeft === 7 && !this.cuedMilestones.has('rest_7s')) {
                this.cuedMilestones.add('rest_7s');
                this.soundEngine.playChime();
                this.voiceCoach.speak(`Tujuh detik lagi jeda berakhir! Ayo kembali ke matras dan ambil posisi untuk ${nextEx.name}!`);
            }

            // 3. Hitungan mundur 3 - 2 - 1 akhir jeda
            if (this.timeLeft <= 3 && this.timeLeft > 0) {
                this.soundEngine.playBeep(500 + (3 - this.timeLeft) * 100, 0.1);
                if (this.timeLeft === 3 && !this.cuedMilestones.has('rest_3s')) {
                    this.cuedMilestones.add('rest_3s');
                    this.voiceCoach.speak(`Tiga! Dua! Satu! Ayo mulai!`);
                }
            }

            this.updateUi();

            if (this.timeLeft <= 0) {
                this.clearAllTimers();
                this.currentIndex++;
                this.soundEngine.playWhistle();
                this.startWorkPhase();
            }
        }, 1000);
    }

    /**
     * Tambah Waktu Jeda Istirahat (+15 Detik) jika Trainee masih butuh mengatur napas
     */
    addRestTime(extraSeconds = 15) {
        if (this.phase === 'rest') {
            this.timeLeft += extraSeconds;
            this.totalDuration = Math.max(this.totalDuration, this.timeLeft);
            this.soundEngine.playBeep(600, 0.08);
            this.voiceCoach.speak(`Waktu istirahat ditambah lima belas detik. Sekarang sisa ${this.timeLeft} detik, tarik napas dalam dan pulihkan tenagamu!`);
            this.updateUi();
        }
    }

    skipRest() {
        if (this.phase === 'rest') {
            this.clearAllTimers();
            this.currentIndex++;
            this.soundEngine.playWhistle();
            this.startWorkPhase();
        }
    }

    /**
     * Tambah 1 Repetisi Manual (Jika di Mode Repetisi user ingin mempercepat hitungan)
     */
    manualAdvanceRep() {
        const currentEx = this.routine[this.currentIndex];
        if (this.phase === 'work' && this.executionMode === 'reps' && currentEx?.svgType !== 'plank') {
            clearTimeout(this.repCadenceTimer);
            this.currentRep++;
            this.soundEngine.playBeep(680, 0.08);
            this.updateUi();
            if (this.currentRep >= this.targetReps) {
                this.voiceCoach.speak(`${this.currentRep}! Target repetisi selesai! Luar biasa!`);
                this.finishCurrentExercise();
            } else {
                this.voiceCoach.speak(`${this.currentRep}! Lanjut, sisa ${this.targetReps - this.currentRep} repetisi lagi!`);
            }
        }
    }

    pauseWorkout() {
        if (this.phase === 'work' || this.phase === 'rest' || this.phase === 'prep') {
            this.savedPhase = this.phase;
            this.phase = 'paused';
            this.clearAllTimers();
            this.voiceCoach.speak("Latihan dijeda. Atur napasmu, tekan tombol lanjutkan kapan pun kamu siap!");
            this.updateUi();
        } else if (this.phase === 'paused') {
            this.phase = this.savedPhase || 'work';
            this.voiceCoach.speak("Ayo kita lanjutkan kembali! Fokus penuh!");
            if (this.phase === 'work' && this.executionMode === 'reps' && this.routine[this.currentIndex]?.svgType !== 'plank') {
                // Lanjutkan dari repetisi terakhir
                this.resumeRepCounting();
            } else {
                this.resumeTimer();
            }
            this.updateUi();
        }
    }

    resumeRepCounting() {
        this.clearAllTimers();
        const currentEx = this.routine[this.currentIndex];
        const repDurationMs = ['jumping_jack', 'climber'].includes(currentEx?.svgType) ? 2300 : 3400;

        this.timerInterval = setInterval(() => {
            if (this.phase === 'work') {
                this.secondsElapsed++;
                const calPerSec = (currentEx.caloriesPerMin || 9.5) / 60;
                this.caloriesBurned += calPerSec;
                if (this.dom.liveCalories) {
                    this.dom.liveCalories.innerText = `${Math.round(this.caloriesBurned)} kkal`;
                }
            }
        }, 1000);

        const stepRep = () => {
            if (this.phase !== 'work') return;
            this.currentRep++;
            this.soundEngine.playBeep(600, 0.08);
            this.updateUi();

            const rem = this.targetReps - this.currentRep;
            if (rem <= 0) {
                this.voiceCoach.speak(`${this.currentRep}! Selesai! Set yang sangat mantap!`);
                this.repCadenceTimer = setTimeout(() => this.finishCurrentExercise(), 1800);
            } else {
                this.voiceCoach.speak(`${this.currentRep}! Sisa ${rem} lagi!`);
                this.repCadenceTimer = setTimeout(stepRep, repDurationMs);
            }
        };

        this.repCadenceTimer = setTimeout(stepRep, 1800);
    }

    resumeTimer() {
        this.clearAllTimers();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.secondsElapsed++;

            if (this.phase === 'work') {
                const currentEx = this.routine[this.currentIndex];
                const calPerSec = (currentEx.caloriesPerMin || 9.0) / 60;
                this.caloriesBurned += calPerSec;

                if (this.timeLeft === 10) {
                    this.voiceCoach.speak("Sepuluh detik terakhir! Dorong terus!");
                }
                if (this.timeLeft <= 3 && this.timeLeft > 0) {
                    this.soundEngine.playBeep(520, 0.1);
                }
            } else if (this.phase === 'rest') {
                if (this.timeLeft === 5) {
                    this.voiceCoach.speak("Lima detik lagi jeda selesai, ambil posisi!");
                }
                if (this.timeLeft <= 3 && this.timeLeft > 0) {
                    this.soundEngine.playBeep(480, 0.1);
                }
            }

            this.updateUi();

            if (this.timeLeft <= 0) {
                this.clearAllTimers();
                if (this.phase === 'work') {
                    this.finishCurrentExercise();
                } else if (this.phase === 'rest') {
                    this.currentIndex++;
                    this.soundEngine.playWhistle();
                    this.startWorkPhase();
                } else if (this.phase === 'prep') {
                    this.soundEngine.playWhistle();
                    this.startWorkPhase();
                }
            }
        }, 1000);
    }

    triggerLiveMotivation() {
        this.soundEngine.playChime();
        const currentEx = this.routine[this.currentIndex] || {};
        const remainText = (this.executionMode === 'reps' && this.phase === 'work')
            ? `tinggal ${Math.max(1, this.targetReps - this.currentRep)} repetisi lagi`
            : `tinggal ${this.timeLeft} detik lagi`;

        const cheers = [
            `Ayo jangan menyerah di ${currentEx.name || 'gerakan ini'}! Cuma ${remainText}! Rasa panas di ototmu itu tandanya lemak sedang hancur dan ototmu sedang terbentuk!`,
            `Kuatkan mentalmu! Tinggal ${remainText}! Bayangkan hasil tubuh atletis yang kamu impikan, sikat habis sampai tuntas!`,
            `Posturmu keren banget! Kunci perutmu, jaga napas tetap stabil, tunjukkan bahwa kamu jauh lebih tangguh dari rasa lelahmu!`
        ];
        const msg = cheers[Math.floor(Math.random() * cheers.length)];
        this.voiceCoach.speak(msg);
    }

    triggerLiveFormTip() {
        const currentEx = this.routine[this.currentIndex];
        if (!currentEx) return;
        const step = currentEx.steps?.[0] || '';
        const mistake = currentEx.commonMistakes?.[0] || '';
        const msg = `Panduan teknik untuk ${currentEx.name}: ${step} Hindari kesalahan ini: ${mistake} Pernapasan: ${currentEx.breathing || 'teratur'}.`;
        this.voiceCoach.speak(msg);
    }

    nextExercise() {
        this.clearAllTimers();
        this.voiceCoach.stop();
        if (this.currentIndex < this.routine.length - 1) {
            this.currentIndex++;
            this.startWorkPhase();
        } else {
            this.completeWorkoutSession();
        }
    }

    prevExercise() {
        this.clearAllTimers();
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
        if (confirm("Apakah kamu yakin ingin mengakhiri sesi latihan ini?")) {
            this.clearAllTimers();
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
        this.clearAllTimers();
        this.voiceCoach.stop();
        if (window.BiomechEngine) window.BiomechEngine.stopActive();

        this.soundEngine.playVictory();
        this.voiceCoach.speak("Luar biasa! Kamu berhasil menuntaskan seluruh latihan dengan sempurna! Saya sangat bangga dengan kerja keras dan disiplinmu hari ini. Sekarang minum air putih dan istirahatkan ototmu!");

        if (this.dom.playerModal) {
            this.dom.playerModal.classList.remove('active');
            this.dom.playerModal.style.display = 'none';
            document.body.classList.remove('workout-active-overflow');
        }

        const sessionResult = {
            title: this.sessionTitle,
            exercisesCount: this.routine.length,
            totalSeconds: Math.max(15, this.secondsElapsed),
            calories: Math.max(10, Math.round(this.caloriesBurned)),
            completedAt: new Date().toISOString(),
            isSingleExercise: this.isSingleExerciseSession
        };

        if (typeof this.onSessionComplete === 'function') {
            this.onSessionComplete(sessionResult);
        }
    }

    updateUi() {
        const currentEx = this.routine[this.currentIndex] || {};
        const nextEx = this.routine[this.currentIndex + 1];
        const isRepModeWork = (this.phase === 'work' && this.executionMode === 'reps' && currentEx.svgType !== 'plank');

        // 1. Update Angka Utama di Lingkaran Radial (Detik vs Hitungan Repetisi)
        if (this.dom.timerNumber) {
            if (isRepModeWork) {
                this.dom.timerNumber.innerText = `${this.currentRep}/${this.targetReps}`;
            } else {
                const mins = Math.floor(this.timeLeft / 60);
                const secs = this.timeLeft % 60;
                const formattedTime = (mins > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : `${secs}`);
                this.dom.timerNumber.innerText = formattedTime;
            }
        }

        if (this.dom.timerUnitLabel) {
            if (isRepModeWork) {
                this.dom.timerUnitLabel.innerText = 'REPETISI';
            } else if (this.phase === 'rest') {
                this.dom.timerUnitLabel.innerText = 'DETIK JEDA';
            } else {
                this.dom.timerUnitLabel.innerText = 'DETIK SISA';
            }
        }

        // 2. Circular Radial Progress Ring (440px circumference = 2 * PI * 70)
        if (this.dom.radialProgress) {
            const circumference = 440;
            let ratio = 1;

            if (isRepModeWork) {
                ratio = Math.max(0, Math.min(1, this.currentRep / Math.max(1, this.targetReps)));
            } else {
                const targetDuration = (this.phase === 'prep') ? 5 : ((this.phase === 'rest') ? (this.totalDuration || 25) : (this.totalDuration || 40));
                ratio = Math.max(0, Math.min(1, this.timeLeft / targetDuration));
            }

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

        // 3. Live Burned Calories Ticker
        if (this.dom.liveCalories) {
            this.dom.liveCalories.innerText = `${Math.round(this.caloriesBurned)} kkal`;
        }

        // 4. Title & Subtitle
        if (this.dom.exerciseTitle) {
            if (this.phase === 'prep') {
                this.dom.exerciseTitle.innerText = `BERSIAP: ${currentEx.name || 'Latihan'}`;
            } else if (this.phase === 'rest') {
                this.dom.exerciseTitle.innerText = `JEDA ISTIRAHAT (${this.timeLeft} Detik)`;
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
                this.dom.exerciseSubtitle.innerHTML = nextEx
                    ? `<span class="text-info fw-semibold">Bersiap Selanjutnya:</span> <strong class="text-white">${nextEx.name}</strong> (${nextEx.targetMuscles?.primary?.join(', ') || 'Full Body'})`
                    : "Hampir Selesai!";
            } else {
                const targetText = currentEx.targetMuscles?.primary?.join(', ') || 'Seluruh Tubuh';
                const modeBadge = isRepModeWork
                    ? `<span class="badge bg-info-subtle text-info ms-1">+1 Rep: Ketuk Lingkaran</span>`
                    : `<span class="text-info small">${currentEx.tempo || 'Tempo Stabil'}</span>`;
                this.dom.exerciseSubtitle.innerHTML = `<span class="badge bg-success-subtle text-success me-2">Otot Aktif:</span> ${targetText} <span class="mx-2 text-muted">•</span> ${modeBadge}`;
            }
        }

        // 5. Badge Status Phase
        if (this.dom.phaseBadge) {
            if (this.phase === 'work') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-work';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-fire me-1"></i> SET ${this.currentIndex + 1} DARI ${this.routine.length}`;
            } else if (this.phase === 'rest') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-rest';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-wind me-1"></i> JEDA ISTIRAHAT & INFO COACH`;
            } else if (this.phase === 'prep') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-prep';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-bolt me-1"></i> BERSIAP MULAI`;
            } else if (this.phase === 'paused') {
                this.dom.phaseBadge.className = 'player-phase-pill phase-paused';
                this.dom.phaseBadge.innerHTML = `<i class="fas fa-pause me-1"></i> DIJEDA`;
            }
        }

        // 6. Progress Bar (Total gerakan tuntas)
        if (this.dom.progressBar) {
            const pct = Math.round(((this.currentIndex) / this.routine.length) * 100);
            this.dom.progressBar.style.width = `${pct}%`;
        }

        // 7. Kontainer Animasi 60 FPS (Dipertahankan tanpa kedip)
        const desiredStateKey = (this.phase === 'rest') ? `rest_${this.currentIndex}` : `active_${this.currentIndex}_${currentEx.svgType}`;
        if (this.dom.animContainer && this.lastRenderedState !== desiredStateKey) {
            this.lastRenderedState = desiredStateKey;

            if (this.phase === 'rest') {
                const nextAnimHtml = nextEx && window.getExerciseAnimationSvg
                    ? window.getExerciseAnimationSvg(nextEx.svgType, true)
                    : '';
                this.dom.animContainer.innerHTML = `
                    <div class="rest-visual-box text-center p-2 w-100">
                        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2 px-2">
                            <span class="badge bg-info bg-opacity-15 text-info border border-info border-opacity-25 px-3 py-1 rounded-pill">
                                <i class="fas fa-droplet me-1"></i> Fase Pemulihan Napas & Otot
                            </span>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-info btn-sm rounded-pill px-3 fw-semibold" onclick="window.playerInstance.addRestTime(15)">
                                    <i class="fas fa-plus me-1"></i> 15 Detik Jeda
                                </button>
                                <button class="btn btn-success btn-sm rounded-pill px-3 fw-bold" onclick="window.playerInstance.skipRest()">
                                    Mulai Sekarang <i class="fas fa-forward ms-1"></i>
                                </button>
                            </div>
                        </div>
                        ${nextEx ? `<div class="small text-secondary mb-2">Preview Gerakan Berikutnya: <strong class="text-white">${nextEx.name}</strong> • <span class="text-success">${nextEx.breathing || 'Atur napas'}</span></div>` : ''}
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

        // 8. Next Exercise Preview
        if (this.dom.nextPreview) {
            if (nextEx) {
                const nextTargetBadge = (this.executionMode === 'reps' && nextEx.svgType !== 'plank')
                    ? `${nextEx.targetReps || nextEx.defaultReps || 12} Repetisi`
                    : `${nextEx.duration || nextEx.defaultDuration || 40} Detik`;
                this.dom.nextPreview.innerHTML = `
                    <span class="text-muted small">Selanjutnya (${this.currentIndex + 2}/${this.routine.length}):</span>
                    <strong class="text-light ms-2">${nextEx.name}</strong>
                    <span class="text-success small font-monospace ms-2">(${nextTargetBadge})</span>
                `;
            } else {
                this.dom.nextPreview.innerHTML = `<span class="text-success small fw-bold"><i class="fas fa-trophy me-1"></i> Set Terakhir! Berikan 100% Tenagamu Sampai Tuntas!</span>`;
            }
        }

        // 9. Pause/Play Button State
        if (this.dom.btnPause) {
            this.dom.btnPause.innerHTML = this.phase === 'paused' ? 
                '<i class="fas fa-play"></i>' : 
                '<i class="fas fa-pause"></i>';
        }
    }
}

// Global Export
window.WorkoutPlayer = WorkoutPlayer;
