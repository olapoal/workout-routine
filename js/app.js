/**
 * js/app.js
 * Logika Utama Aplikasi Workout Routine Pro
 * - Onboarding Questionnaire & Personalized Program Generator
 * - Tab Navigation & Dynamic UI Rendering
 * - Exercise Library Modal & Form Detail
 * - Nutrition & Macro Calculator
 * - Hydration Tracker & Workout Streak
 */

class WorkoutApp {
    constructor() {
        this.soundEngine = new SoundEffectsEngine();
        this.voiceCoach = new VoiceCoachEngine();
        this.authManager = new LynkAuthManager();
        this.voiceAI = new VoiceAIPersonalTrainer(this.soundEngine, this.voiceCoach);
        this.player = new WorkoutPlayer(this.soundEngine, this.voiceCoach, (result) => this.handleWorkoutCompleted(result));
        window.playerInstance = this.player;

        this.profile = this.loadTraineeProfile();
        this.activeDay = 1;
        this.activeCategoryFilter = 'all';
        this.activeEquipmentFilter = 'all';
        this.exerciseSearchQuery = '';
        this.selectedMuscleZone = 'abs';
        this.lastMealPlanSpeech = '';

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupVoiceAICallbacks();

        if (!this.profile) {
            this.showOnboardingModal();
        } else {
            this.renderApp();
        }

        // Muat pengaturan suara tersimpan
        this.loadSettings();
    }

    loadTraineeProfile() {
        try {
            const raw = localStorage.getItem('workout_trainee_profile');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    saveTraineeProfile(profile) {
        this.profile = profile;
        localStorage.setItem('workout_trainee_profile', JSON.stringify(profile));
    }

    loadSettings() {
        const savedVoice = localStorage.getItem('workout_voice_persona') || 'bima';
        this.voiceCoach.selectedPersona = savedVoice;

        const selectVoiceEl = document.getElementById('settingVoicePersona');
        if (selectVoiceEl) selectVoiceEl.value = savedVoice;

        const quickPersonaEl = document.getElementById('quickPersonaSelect');
        if (quickPersonaEl) quickPersonaEl.value = savedVoice;

        this.updateCoachCommandBarPersona(savedVoice);
        this.refreshGeminiKeyUI();
    }

    refreshGeminiKeyUI() {
        const geminiInput = document.getElementById('inputGeminiApiKey');
        const badgeEl = document.getElementById('geminiKeyStatusBadge');
        const helperEl = document.getElementById('geminiKeyHelperText');

        const isDefault = !this.voiceAI || this.voiceAI.isUsingDefaultEmbeddedKey();

        if (geminiInput) {
            geminiInput.value = isDefault
                ? 'DEFAULT_EMBEDDED_GEMINI_LIVE_KEY'
                : (this.voiceAI ? this.voiceAI.geminiApiKey : '');
        }

        if (badgeEl) {
            if (isDefault) {
                badgeEl.className = 'badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-1 rounded-pill';
                badgeEl.innerHTML = '<i class="fas fa-check-circle me-1"></i> Aktif: AI Cloud Bawaan (Embedded)';
            } else {
                badgeEl.className = 'badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 px-3 py-1 rounded-pill';
                badgeEl.innerHTML = '<i class="fas fa-key me-1"></i> Aktif: Kunci Gemini API Kustom';
            }
        }

        if (helperEl) {
            if (isDefault) {
                helperEl.className = 'text-success d-block mt-1';
                helperEl.innerHTML = '<i class="fas fa-shield-halved me-1"></i> Menggunakan Kunci AI Cloud Bawaan (Embedded). Percakapan suara AI siap digunakan tanpa konfigurasi tambahan.';
            } else {
                helperEl.className = 'text-info d-block mt-1';
                helperEl.innerHTML = '<i class="fas fa-key me-1"></i> Menggunakan Kunci Gemini API Kustom milik Anda. Klik "Reset ke Bawaan" kapan saja untuk kembali ke kunci bawaan aplikasi.';
            }
        }
    }

    updateCoachCommandBarPersona(personaKey) {
        const persona = this.voiceCoach.personas[personaKey] || this.voiceCoach.personas.bima;
        const titleEl = document.getElementById('liveCoachPersonaTitle');
        const roleEl = document.getElementById('liveCoachPersonaRole');
        if (titleEl) titleEl.textContent = `${persona.name} — AI Personal Trainer`;
        if (roleEl) roleEl.textContent = `${persona.role} • Siap Memandu Suara`;
    }

    triggerCoachPepTalk() {
        if (this.soundEngine) this.soundEngine.playChime();
        this.voiceCoach.speakMotivationBoost(this.profile);
    }

    triggerCoachDailyBriefing() {
        if (this.soundEngine) this.soundEngine.playBeep(640, 0.08);
        const currentDayData = this.profile?.programSchedule?.find(d => d.dayNumber === this.activeDay) || this.profile?.programSchedule?.[0];
        this.voiceCoach.speakWorkoutBriefing(currentDayData, this.profile);
    }

    triggerCoachNutritionGuide() {
        if (this.soundEngine) this.soundEngine.playBeep(720, 0.08);
        this.voiceCoach.speakNutritionGuide(this.profile);
    }

    bindEvents() {
        // Tab Navigation
        document.querySelectorAll('[data-app-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = btn.getAttribute('data-app-tab');
                this.switchTab(targetTab);
            });
        });

        // Filter Katalog Gerakan
        document.querySelectorAll('[data-exercise-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-exercise-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeCategoryFilter = btn.getAttribute('data-exercise-filter');
                this.renderExerciseLibrary();
            });
        });

        const searchInput = document.getElementById('exerciseSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.exerciseSearchQuery = (e.target.value || '').trim().toLowerCase();
                this.renderExerciseLibrary();
            });
        }

        const equipSelect = document.getElementById('exerciseEquipmentFilter');
        if (equipSelect) {
            equipSelect.addEventListener('change', (e) => {
                this.activeEquipmentFilter = e.target.value || 'all';
                this.renderExerciseLibrary();
            });
        }

        const btnSaveBodyLog = document.getElementById('btnSaveBodyLog');
        if (btnSaveBodyLog) {
            btnSaveBodyLog.addEventListener('click', () => this.saveBodyMetricsLog());
        }

        // Setup Multi-Step Onboarding Wizard
        this.setupOnboardingEvents();

        // Form Onboarding Submit
        const onboardingForm = document.getElementById('onboardingForm');
        if (onboardingForm) {
            onboardingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.triggerPlanGeneration();
            });
        }

        // Voice AI Chat Input (Mic Toggle & Send Text)
        const btnVoiceMic = document.getElementById('btnVoiceAIMic');
        if (btnVoiceMic) {
            btnVoiceMic.addEventListener('click', () => {
                this.voiceAI.toggleListening();
            });
        }

        const btnSendText = document.getElementById('btnVoiceAISendText');
        const inputVoiceText = document.getElementById('inputVoiceAIText');
        if (btnSendText && inputVoiceText) {
            const sendMsg = () => {
                const text = inputVoiceText.value.trim();
                if (text) {
                    this.voiceAI.handleUserInput(text);
                    inputVoiceText.value = '';
                }
            };
            btnSendText.addEventListener('click', sendMsg);
            inputVoiceText.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') sendMsg();
            });
        }

        // Quick Suggestion Chips untuk Tanya Coach AI
        document.querySelectorAll('.prompt-pill, .ai-prompt-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const prompt = chip.getAttribute('data-prompt');
                if (prompt) {
                    this.voiceAI.handleUserInput(prompt);
                }
            });
        });

        // Quick Persona Select di Dashboard Command Bar
        const quickPersonaEl = document.getElementById('quickPersonaSelect');
        if (quickPersonaEl) {
            quickPersonaEl.addEventListener('change', (e) => {
                const val = e.target.value;
                this.voiceCoach.selectedPersona = val;
                localStorage.setItem('workout_voice_persona', val);
                const settingSelect = document.getElementById('settingVoicePersona');
                if (settingSelect) settingSelect.value = val;
                this.updateCoachCommandBarPersona(val);
                const p = this.voiceCoach.personas[val];
                this.voiceCoach.speak(`Halo! Sekarang saya ${p.name} yang mendampingi latihanmu. ${p.tagline}`);
            });
        }

        // Verifikasi Email Paywall
        const formAuth = document.getElementById('formVerifyEmail');
        if (formAuth) {
            formAuth.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('inputBuyerEmail');
                if (emailInput) {
                    this.authManager.verifyAndUnlock(emailInput.value);
                }
            });
        }

        // Demo Mode Button
        const btnDemo = document.getElementById('btnStartDemo');
        if (btnDemo) {
            btnDemo.addEventListener('click', () => {
                this.authManager.startDemoMode();
            });
        }

        // Logout Lisensi
        const btnRevoke = document.getElementById('btnRevokeLicense');
        if (btnRevoke) {
            btnRevoke.addEventListener('click', () => {
                this.authManager.logout();
            });
        }

        // Macro Calculator Submit
        const formMacro = document.getElementById('macroCalculatorForm');
        if (formMacro) {
            formMacro.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateNutritionMacros();
            });
        }

        // Hydration Counter
        const btnDrink = document.getElementById('btnDrinkWater');
        const btnResetWater = document.getElementById('btnResetWater');
        if (btnDrink) {
            btnDrink.addEventListener('click', () => this.addWaterGlass());
        }
        if (btnResetWater) {
            btnResetWater.addEventListener('click', () => this.resetWaterIntake());
        }

        // Settings Listeners
        const voiceSelect = document.getElementById('settingVoicePersona');
        if (voiceSelect) {
            voiceSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                this.voiceCoach.selectedPersona = val;
                localStorage.setItem('workout_voice_persona', val);
                const quickEl = document.getElementById('quickPersonaSelect');
                if (quickEl) quickEl.value = val;
                this.updateCoachCommandBarPersona(val);
            });
        }

        const btnTestVoice = document.getElementById('btnTestVoiceCoach');
        if (btnTestVoice) {
            btnTestVoice.addEventListener('click', () => {
                const p = this.voiceCoach.personas[this.voiceCoach.selectedPersona];
                this.voiceCoach.speak(`Halo! Saya ${p.name}. ${p.tagline} Mari kita bakar kalori hari ini!`);
            });
        }

        const btnSaveGemini = document.getElementById('btnSaveGeminiKey');
        if (btnSaveGemini) {
            btnSaveGemini.addEventListener('click', () => {
                const keyInput = document.getElementById('inputGeminiApiKey');
                if (keyInput) {
                    const key = keyInput.value.trim();
                    const mode = this.voiceAI.setCustomApiKey(key);
                    this.refreshGeminiKeyUI();
                    if (mode === 'custom') {
                        alert("Kunci Gemini API Kustom berhasil diaktifkan! Anda dapat mengembalikannya ke kunci bawaan kapan saja dengan tombol 'Reset ke Bawaan'.");
                    } else {
                        alert("Menggunakan Kunci AI Cloud Bawaan (Embedded) aplikasi.");
                    }
                }
            });
        }

        const btnResetGemini = document.getElementById('btnResetGeminiKey');
        if (btnResetGemini) {
            btnResetGemini.addEventListener('click', () => {
                this.voiceAI.resetToDefaultEmbeddedKey();
                this.refreshGeminiKeyUI();
                alert("Berhasil dikembalikan ke Kunci AI Cloud Bawaan (Embedded)! AI Personal Trainer siap diajak ngobrol langsung.");
            });
        }

        const btnResetAssessment = document.getElementById('btnResetAssessment');
        if (btnResetAssessment) {
            btnResetAssessment.addEventListener('click', () => {
                if (confirm("Reset seluruh data assessment dan buat program baru dari awal?")) {
                    localStorage.removeItem('workout_trainee_profile');
                    this.profile = null;
                    this.showOnboardingModal();
                }
            });
        }
    }

    setupVoiceAICallbacks() {
        const orbStage = document.getElementById('voiceAIOrbStage');
        const micSphere = document.querySelector('#btnVoiceAIMic .voice-orb-sphere');
        const statusLabel = document.getElementById('voiceAIStatusLabel');

        this.voiceAI.callbacks = {
            onStateChange: (state, isLiveActive) => {
                if (state === 'listening') {
                    if (orbStage) orbStage.className = 'voice-ai-stage listening';
                    if (micSphere) micSphere.innerHTML = '<i class="fas fa-microphone-lines fa-beat"></i>';
                    if (statusLabel) statusLabel.innerHTML = '<span class="text-danger fw-bold"><i class="fas fa-circle fa-beat me-1"></i> Gemini Live Mendengarkan Anda... Silakan langsung bicara!</span>';
                } else if (state === 'thinking') {
                    if (orbStage) orbStage.className = 'voice-ai-stage thinking';
                    if (micSphere) micSphere.innerHTML = '<i class="fas fa-brain fa-spin"></i>';
                    if (statusLabel) statusLabel.innerHTML = '<span class="text-warning fw-bold"><i class="fas fa-sparkles me-1"></i> Coach sedang merespons...</span>';
                } else if (state === 'speaking') {
                    if (orbStage) orbStage.className = 'voice-ai-stage speaking';
                    if (micSphere) micSphere.innerHTML = '<i class="fas fa-volume-high fa-beat-fade"></i>';
                    if (statusLabel) statusLabel.innerHTML = '<span class="text-success fw-bold"><i class="fas fa-wave-square me-1"></i> Coach sedang berbicara... (Setelah selesai, otomatis giliran Anda)</span>';
                } else if (state === 'paused') {
                    if (orbStage) orbStage.className = 'voice-ai-stage';
                    if (micSphere) micSphere.innerHTML = '<i class="fas fa-microphone-slash text-warning"></i>';
                    if (statusLabel) statusLabel.innerHTML = '<span class="text-warning fw-semibold">Mikrofon dijeda sementara • Klik "Lanjut" untuk berbicara lagi</span>';
                } else {
                    // Idle
                    if (orbStage) orbStage.className = 'voice-ai-stage';
                    if (micSphere) micSphere.innerHTML = '<i class="fas fa-microphone"></i>';
                    if (statusLabel) statusLabel.innerText = isLiveActive
                        ? 'Menyiapkan saluran suara dua arah...'
                        : 'Klik 1x Orb di atas untuk mulai ngobrol dua arah (Hands-Free Gemini Live)';
                }
            },

            onUserMessage: (msg) => {
                this.appendChatMessage('user', msg);
            },

            onCoachReply: (reply) => {
                this.appendChatMessage('coach', reply);
            }
        };
    }

    appendChatMessage(sender, text) {
        const log = document.getElementById('voiceAIChatLog');
        if (!log) return;

        const isUser = sender === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bubble-row ${isUser ? 'chat-row-user' : 'chat-row-coach'}`;

        const personaName = this.voiceCoach.personas[this.voiceCoach.selectedPersona]?.name || 'Coach AI';
        const safeText = text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

        msgDiv.innerHTML = `
            <div class="chat-bubble ${isUser ? 'bubble-user' : 'bubble-coach'}">
                <div class="bubble-header mb-1 small text-muted d-flex align-items-center justify-content-between gap-3">
                    <span>
                        <i class="fas ${isUser ? 'fa-user' : 'fa-headset text-success'} me-1"></i>
                        ${isUser ? 'Anda' : personaName}
                    </span>
                    ${!isUser ? `
                        <button type="button" class="btn btn-link btn-sm p-0 text-success text-decoration-none" title="Putar Ulang Suara" onclick="window.appInstance.voiceCoach.speak('${safeText}')">
                            <i class="fas fa-volume-high me-1"></i>Putar Suara
                        </button>
                    ` : ''}
                </div>
                <div class="bubble-content">${text}</div>
            </div>
        `;

        log.appendChild(msgDiv);
        log.scrollTop = log.scrollHeight;
    }

    switchTab(tabId) {
        document.querySelectorAll('.app-tab-panel').forEach(p => p.classList.add('d-none'));
        document.querySelectorAll('[data-app-tab]').forEach(b => b.classList.remove('active'));

        const targetPanel = document.getElementById(`tab-${tabId}`);
        document.querySelectorAll(`[data-app-tab="${tabId}"]`).forEach(btn => btn.classList.add('active'));

        if (targetPanel) targetPanel.classList.remove('d-none');

        const fab = document.querySelector('.floating-coach-fab-group');
        if (fab) {
            if (tabId === 'voice-ai') fab.classList.add('d-none');
            else fab.classList.remove('d-none');
        }

        if (tabId === 'exercises') {
            this.renderExerciseLibrary();
        } else if (tabId === 'routine') {
            this.renderDailyRoutineView();
        } else if (tabId === 'progress') {
            this.renderProgressAndAnatomyTab();
        }
    }

    setupOnboardingEvents() {
        this.currentOnboardingStep = 1;
        this.totalOnboardingSteps = 6;

        // Custom Selection Card Click Listener (Level, Goal, Duration, Equipment, Time, Physical)
        document.querySelectorAll('.onboarding-select-card').forEach(card => {
            card.addEventListener('click', () => {
                const targetInput = card.getAttribute('data-input-target');
                const val = card.getAttribute('data-value');
                if (!targetInput || !val) return;

                // Deselect siblings with the same target
                document.querySelectorAll(`.onboarding-select-card[data-input-target="${targetInput}"]`).forEach(c => {
                    c.classList.remove('selected');
                });
                card.classList.add('selected');

                // Update hidden input
                const hiddenEl = document.getElementById(`hidden_${targetInput}`);
                if (hiddenEl) hiddenEl.value = val;

                // Micro audio haptic feedback
                if (this.soundEngine) this.soundEngine.playBeep(650, 0.04);
            });
        });

        // Frequency Selector (Step 5)
        document.querySelectorAll('.btn-freq-select').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-freq-select').forEach(b => {
                    b.classList.remove('active', 'btn-pro-primary');
                    b.classList.add('btn-outline-secondary');
                });
                btn.classList.add('active', 'btn-pro-primary');
                btn.classList.remove('btn-outline-secondary');

                const freq = btn.getAttribute('data-freq') || '4';
                const hiddenFreq = document.getElementById('hidden_ob_frequency');
                if (hiddenFreq) hiddenFreq.value = freq;
                if (this.soundEngine) this.soundEngine.playBeep(650, 0.04);
            });
        });

        // Next Step Button
        const btnNext = document.getElementById('btnNextOnboardingStep');
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (this.currentOnboardingStep < this.totalOnboardingSteps) {
                    this.goToOnboardingStep(this.currentOnboardingStep + 1);
                } else {
                    this.triggerPlanGeneration();
                }
            });
        }

        // Previous Step Button
        const btnPrev = document.getElementById('btnPrevOnboardingStep');
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (this.currentOnboardingStep > 1) {
                    this.goToOnboardingStep(this.currentOnboardingStep - 1);
                }
            });
        }
    }

    goToOnboardingStep(stepNumber) {
        this.currentOnboardingStep = Math.max(1, Math.min(stepNumber, this.totalOnboardingSteps));

        // Switch active step pane
        document.querySelectorAll('.onboarding-step-pane').forEach(pane => {
            const step = parseInt(pane.getAttribute('data-step'), 10);
            if (step === this.currentOnboardingStep) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        // Update Step Label
        const stepLabel = document.getElementById('onboardingStepLabel');
        if (stepLabel) stepLabel.textContent = this.currentOnboardingStep;

        // Update Progress Bar
        const progressBar = document.getElementById('onboardingProgressIndicator');
        if (progressBar) {
            const pct = Math.round((this.currentOnboardingStep / this.totalOnboardingSteps) * 100);
            progressBar.style.width = `${pct}%`;
        }

        // Toggle Prev Button
        const btnPrev = document.getElementById('btnPrevOnboardingStep');
        if (btnPrev) {
            if (this.currentOnboardingStep > 1) {
                btnPrev.classList.remove('d-none');
            } else {
                btnPrev.classList.add('d-none');
            }
        }

        // Update Next Button Text & Style
        const btnNext = document.getElementById('btnNextOnboardingStep');
        if (btnNext) {
            if (this.currentOnboardingStep === this.totalOnboardingSteps) {
                btnNext.innerHTML = `<i class="fas fa-magic me-2"></i> Buat Program Pribadi Saya`;
                btnNext.classList.remove('btn-pro-primary');
                btnNext.classList.add('btn-success');
            } else {
                btnNext.innerHTML = `Lanjut <i class="fas fa-arrow-right ms-2"></i>`;
                btnNext.classList.remove('btn-success');
                btnNext.classList.add('btn-pro-primary');
            }
        }
    }

    triggerPlanGeneration() {
        const loadingBox = document.getElementById('onboardingLoadingBox');
        const footerNav = document.getElementById('onboardingFooterNav');
        const headerBox = document.getElementById('onboardingHeaderBox');

        // Hide panes & navigation
        document.querySelectorAll('.onboarding-step-pane').forEach(p => p.classList.remove('active'));
        if (footerNav) footerNav.classList.add('d-none');
        if (headerBox) headerBox.classList.add('d-none');
        if (loadingBox) loadingBox.classList.remove('d-none');

        // Audio generation sequence
        if (this.soundEngine) {
            this.soundEngine.playBeep(440, 0.08);
            setTimeout(() => this.soundEngine.playBeep(660, 0.08), 350);
            setTimeout(() => this.soundEngine.playBeep(880, 0.12), 700);
        }

        // 1.5 seconds simulated calculation
        setTimeout(() => {
            this.handleOnboardingSubmit();

            // Reset modal DOM state for future visits
            if (loadingBox) loadingBox.classList.add('d-none');
            if (footerNav) footerNav.classList.remove('d-none');
            if (headerBox) headerBox.classList.remove('d-none');
            this.goToOnboardingStep(1);
        }, 1500);
    }

    showOnboardingModal() {
        const modal = document.getElementById('onboardingModal');
        if (modal) {
            this.goToOnboardingStep(1);
            modal.classList.add('active');
            modal.style.display = 'flex';
        }
    }

    hideOnboardingModal() {
        const modal = document.getElementById('onboardingModal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    handleOnboardingSubmit() {
        const level = document.getElementById('hidden_ob_level')?.value || 'beginner';
        const goal = document.getElementById('hidden_ob_goal')?.value || 'sixpack';
        const duration = parseInt(document.getElementById('hidden_ob_duration')?.value || '30', 10);
        const equipment = document.getElementById('hidden_ob_equipment')?.value || 'none';
        const sessionTime = parseInt(document.getElementById('hidden_ob_time')?.value || '25', 10);
        const frequency = parseInt(document.getElementById('hidden_ob_frequency')?.value || '4', 10);
        const physical = document.getElementById('hidden_ob_physical')?.value || 'none';

        const profile = {
            level,
            goal,
            duration,
            equipment,
            sessionTime,
            frequency,
            physical,
            createdAt: new Date().toISOString(),
            completedDays: []
        };

        // Buat cetak biru program latihan
        profile.programSchedule = this.generateWorkoutBlueprint(profile);

        this.saveTraineeProfile(profile);
        this.hideOnboardingModal();
        this.renderApp();

        // Sambutan audio fanfare & Voice Coach
        if (this.soundEngine) this.soundEngine.playFanfare();
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;
        setTimeout(() => {
            this.voiceCoach.speak(`Selamat datang di program latihan pribadimu! Saya ${persona.name}. Program ${duration} hari telah dibuat khusus untuk target ${this.getGoalLabel(goal)}. Siapkan semangatmu, mari kita mulai hari pertama!`);
        }, 600);
    }

    getGoalLabel(goal) {
        switch (goal) {
            case 'sixpack': return 'Membentuk Otot Sixpack & Core';
            case 'belly_fat': return 'Mengecilkan Perut Buncit';
            case 'fat_loss': return 'Turun Berat Badan & Fat Loss';
            case 'muscle_gain': return 'Hipertrofi & Pembentukan Otot';
            case 'posture': return 'Perbaikan Postur & Stamina Atletik';
            default: return 'Kebugaran Menyeluruh';
        }
    }

    /**
     * Program Generator Cerdas
     * Menghasilkan jadwal hari-demi-hari (Day 1 s/d Day N) dengan pola split & rest day seimbang
     */
    generateWorkoutBlueprint(profile) {
        const days = [];
        const totalDays = profile.duration;
        const freqPerWeek = profile.frequency; // e.g. 4 hari per minggu

        for (let i = 1; i <= totalDays; i++) {
            const dayInWeek = ((i - 1) % 7) + 1; // 1 - 7
            const isRestDay = dayInWeek > freqPerWeek;

            if (isRestDay) {
                days.push({
                    dayNumber: i,
                    isRest: true,
                    title: `Hari ${i}: Rest & Active Recovery`,
                    description: 'Hari pemulihan aktif. Otot berkembang dan pulih saat istirahat. Minum 2.5L air dan lakukan stretching ringan.',
                    exercises: []
                });
            } else {
                const dayTheme = this.resolveDayTheme(profile.goal, dayInWeek, profile.equipment);
                const exercises = this.selectExercisesForSession(dayTheme.category, profile);
                days.push({
                    dayNumber: i,
                    isRest: false,
                    title: `Hari ${i}: ${dayTheme.title}`,
                    description: dayTheme.description,
                    exercises: exercises
                });
            }
        }

        return days;
    }

    resolveDayTheme(goal, dayInWeek, equipment) {
        if (goal === 'sixpack' || goal === 'belly_fat') {
            const themes = [
                { title: 'Core Crusher & Upper Abs', category: 'abs', description: 'Fokus pembakaran lemak perut dan kontraksi sixpack atas.' },
                { title: 'Lower Belly Burn & Hip Flexors', category: 'abs', description: 'Kikis lemak perut bawah dengan leg raises & hollow hold.' },
                { title: 'Full Body HIIT Fat Melter', category: 'cardio', description: 'Pacu detak jantung untuk menguras kalori secara masif.' },
                { title: 'Obliques & Side Waist Shaper', category: 'abs', description: 'Perampingan pinggang samping dan kestabilan rotasi.' },
                { title: 'Spartan Core & Chest Definition', category: 'chest', description: 'Kombinasi push-up dan penguatan core menyeluruh.' },
                { title: 'Cardio Core Ignition', category: 'cardio', description: 'Kardio pembakar visceral fat dengan mountain climbers.' }
            ];
            return themes[(dayInWeek - 1) % themes.length];
        } else if (goal === 'muscle_gain') {
            const themes = [
                { title: 'Chest, Shoulders & Triceps (Push)', category: 'chest', description: 'Fokus dorongan otot dada bidang dan lengan tegap.' },
                { title: 'Back & Posture Builder (Pull)', category: 'back', description: 'Tebalkan sayap punggung dan perbaiki postur tubuh.' },
                { title: 'Legs & Glutes Power', category: 'legs', description: 'Bangun pondasi kaki yang kokoh dan lonjakan metabolisme.' },
                { title: 'Upper Body Pump', category: 'arms', description: 'Isolasi bicep, tricep, dan bahu untuk volume otot padat.' }
            ];
            return themes[(dayInWeek - 1) % themes.length];
        } else {
            // Fat loss / Stamina General
            const themes = [
                { title: 'Full Body Metabolic Blast', category: 'fullbody', description: 'Latihan sirkuit seluruh tubuh untuk membakar lemak 24 jam.' },
                { title: 'Legs & Core Burner', category: 'legs', description: 'Kombinasi otot terbesar tubuh untuk pembakaran kalori tinggi.' },
                { title: 'Upper Body Conditioning', category: 'chest', description: 'Ketahanan dada, punggung, dan lengan.' },
                { title: 'HIIT Cardio & Stamina Booster', category: 'cardio', description: 'Kapasitas paru-paru dan detak jantung atletik.' }
            ];
            return themes[(dayInWeek - 1) % themes.length];
        }
    }

    selectExercisesForSession(category, profile) {
        const all = Object.values(window.EXERCISE_DATABASE || {});
        let pool = all;

        // Filter alat
        if (profile.equipment === 'none') {
            pool = pool.filter(ex => ex.equipment === 'none');
        }

        // Filter cedera sendi (misal lutut sakit)
        if (profile.physical === 'knee') {
            pool = pool.filter(ex => ex.id !== 'jumping_squats' && ex.id !== 'burpees' && ex.id !== 'high_knees');
        }

        // Filter kategori yang relevan
        let matched = pool.filter(ex => ex.category === category || ex.category === 'fullbody');
        if (matched.length < 4) {
            matched = pool; // jika kurang, ambil dari pool umum
        }

        // Acak dan ambil 5-7 gerakan sesuai durasi sesi
        const count = profile.sessionTime >= 40 ? 7 : (profile.sessionTime <= 15 ? 4 : 5);
        const shuffled = [...matched].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        // Sesuaikan durasi per gerakan dengan level
        return selected.map(ex => {
            let dur = ex.defaultDuration || 40;
            if (profile.level === 'beginner') dur = Math.max(25, dur - 10);
            if (profile.level === 'advanced') dur = dur + 15;
            return {
                ...ex,
                duration: dur
            };
        });
    }

    renderApp() {
        if (!this.profile) return;

        // Render Hero Badge Info
        const profileBadge = document.getElementById('traineeProfileSummary');
        if (profileBadge) {
            profileBadge.innerHTML = `
                <div class="d-flex flex-wrap align-items-center gap-2">
                    <span class="pro-chip"><i class="fas fa-bullseye text-success me-1"></i> Target: ${this.getGoalLabel(this.profile.goal)}</span>
                    <span class="pro-chip"><i class="fas fa-layer-group text-warning me-1"></i> Level: ${this.profile.level.toUpperCase()}</span>
                    <span class="pro-chip"><i class="fas fa-calendar-alt text-info me-1"></i> Durasi: ${this.profile.duration} Hari</span>
                    <span class="pro-chip"><i class="fas fa-dumbbell me-1"></i> ${this.profile.equipment === 'none' ? 'Bodyweight' : 'Dumbbell'}</span>
                </div>
            `;
        }

        this.renderDailyRoutineView();
        this.renderExerciseLibrary();
        this.renderHydrationTracker();
        this.renderWorkoutStats();
        this.renderProgressAndAnatomyTab();
    }

    renderDailyRoutineView() {
        if (!this.profile || !this.profile.programSchedule) return;

        const schedule = this.profile.programSchedule;
        const calendarContainer = document.getElementById('programDaysCarousel');
        const activeDayCard = document.getElementById('todayRoutineContainer');

        // Render Carousel Hari (Day 1 s/d Day N)
        if (calendarContainer) {
            calendarContainer.innerHTML = '';
            schedule.forEach(day => {
                const isCompleted = this.profile.completedDays?.includes(day.dayNumber);
                const isActive = day.dayNumber === this.activeDay;

                const dayPill = document.createElement('div');
                dayPill.className = `timeline-pill ${isActive ? 'pill-active' : ''}`;
                dayPill.innerHTML = `
                    <div class="pill-day">Hari ${day.dayNumber}</div>
                    <div class="pill-icon">
                        ${isCompleted ? '<i class="fas fa-check-circle text-success"></i>' : (day.isRest ? '<i class="fas fa-moon text-info"></i>' : '<i class="fas fa-dumbbell"></i>')}
                    </div>
                    <div class="pill-sub">${day.isRest ? 'Istirahat' : 'Latihan'}</div>
                `;

                dayPill.addEventListener('click', () => {
                    this.activeDay = day.dayNumber;
                    this.renderDailyRoutineView();
                });

                calendarContainer.appendChild(dayPill);
            });
        }

        // Render Detail Hari yang Aktif
        const currentDayData = schedule.find(d => d.dayNumber === this.activeDay) || schedule[0];

        if (activeDayCard && currentDayData) {
            if (currentDayData.isRest) {
                activeDayCard.innerHTML = `
                    <div class="pro-card text-center p-5">
                        <div class="mb-3"><i class="fas fa-moon text-info fa-3x"></i></div>
                        <h3 class="text-white fw-bold mb-2">${currentDayData.title}</h3>
                        <p class="text-secondary max-w-600 mx-auto mb-4">${currentDayData.description}</p>
                        
                        <div class="row g-3 justify-content-center text-start max-w-700 mx-auto mb-4">
                            <div class="col-md-6">
                                <div class="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-25 h-100">
                                    <h6 class="text-success fw-bold"><i class="fas fa-tint me-2"></i>Hidrasi & Nutrisi</h6>
                                    <p class="small text-secondary mb-0">Minum 2-3 liter air hari ini dan pastikan asupan protein tetap tercukupi untuk rekonstruksi jaringan otot.</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-25 h-100">
                                    <h6 class="text-warning fw-bold"><i class="fas fa-walking me-2"></i>Mobilitas Ringan</h6>
                                    <p class="small text-secondary mb-0">Lakukan peregangan fleksibilitas 10 menit atau jalan santai agar sirkulasi pemulihan darah optimal.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button class="btn btn-pro-secondary" onclick="window.appInstance.markDayAsDone(${currentDayData.dayNumber})">
                                <i class="fas fa-check me-2"></i> Tandai Hari Istirahat Selesai
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // Tampilkan Daftar Gerakan Hari Ini
                const exListHtml = currentDayData.exercises.map((ex, idx) => `
                    <div class="exercise-row flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-3">
                            <span class="exercise-step-badge">${idx + 1}</span>
                            <div>
                                <h6 class="text-white fw-semibold mb-0" style="font-size: 0.98rem;">${ex.name}</h6>
                                <div class="small text-muted">
                                    <span class="text-success fw-medium font-monospace">${ex.duration} detik</span>
                                    <span class="mx-1">•</span>
                                    <span class="text-info fw-medium font-monospace">${ex.defaultReps || 12} repetisi</span>
                                    <span class="mx-1">•</span>
                                    <span>${ex.targetMuscles?.primary?.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 ms-auto">
                            <button class="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1" title="Ganti dengan variasi gerakan lain" onclick="window.appInstance.swapRoutineExercise(${idx})">
                                <i class="fas fa-shuffle"></i>
                            </button>
                            <button class="btn btn-pro-secondary btn-sm" onclick="window.appInstance.openExerciseDetailModal('${ex.id}')">
                                <i class="fas fa-eye me-1"></i> Detail Form
                            </button>
                            <button class="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold" title="Mulai gerakan ini dengan panduan Coach" onclick="window.appInstance.startWorkoutFromIndex(${idx}, 'reps')">
                                <i class="fas fa-play me-1"></i> Mulai (Repetisi)
                            </button>
                            <button class="btn btn-outline-info btn-sm rounded-pill px-3 fw-semibold" title="Mulai gerakan ini dengan Countdown Waktu" onclick="window.appInstance.startWorkoutFromIndex(${idx}, 'time')">
                                <i class="fas fa-stopwatch me-1"></i> Timer
                            </button>
                        </div>
                    </div>
                `).join('');

                const isDone = this.profile.completedDays?.includes(currentDayData.dayNumber);

                activeDayCard.innerHTML = `
                    <div class="pro-card p-4 p-md-5">
                        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                            <div>
                                <span class="pro-chip chip-active mb-2">
                                    <i class="fas fa-fire me-1"></i> Sesi Hari Ke-${currentDayData.dayNumber}
                                </span>
                                <h3 class="text-white fw-bold mb-1">${currentDayData.title}</h3>
                                <p class="text-secondary small mb-0">${currentDayData.description}</p>
                            </div>
                            <div class="d-flex flex-wrap gap-2">
                                <button class="btn btn-pro-primary" onclick="window.appInstance.startActiveWorkout('reps')">
                                    <i class="fas fa-hashtag me-2"></i> Mulai Sesi (Hitungan Repetisi Coach)
                                </button>
                                <button class="btn btn-outline-info rounded-pill px-4 py-2 fw-bold" onclick="window.appInstance.startActiveWorkout('time')">
                                    <i class="fas fa-stopwatch me-2"></i> Mulai Sesi (Countdown Waktu)
                                </button>
                            </div>
                        </div>

                        <div class="p-3 rounded-3 mb-4 bg-dark bg-opacity-40 d-flex flex-wrap gap-4 border border-secondary border-opacity-20 small">
                            <div><span class="text-muted">Total Gerakan:</span> <strong class="text-white ms-1 font-monospace">${currentDayData.exercises.length} Latihan</strong></div>
                            <div><span class="text-muted">Estimasi Waktu:</span> <strong class="text-white ms-1 font-monospace">~${Math.round(currentDayData.exercises.length * 1.5)} Menit</strong></div>
                            <div><span class="text-muted">Target Kalori:</span> <strong class="text-warning ms-1 font-monospace">~${currentDayData.exercises.length * 28} kkal</strong></div>
                            <div><span class="text-muted">Pelatih Suara:</span> <strong class="text-success ms-1">${this.voiceCoach.personas[this.voiceCoach.selectedPersona]?.name} Aktif</strong></div>
                        </div>

                        <h6 class="text-white fw-bold mb-3"><i class="fas fa-list-check text-success me-2"></i>Rangkaian Gerakan Latihan:</h6>
                        <div class="exercises-list-wrapper mb-4">
                            ${exListHtml}
                        </div>

                        ${isDone ? `
                            <div class="alert alert-success border-0 rounded-3 d-flex align-items-center" style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.25) !important;">
                                <i class="fas fa-check-circle text-success fa-2x me-3"></i>
                                <div>
                                    <h6 class="fw-bold mb-0 text-white">Hari Ini Telah Dituntaskan!</h6>
                                    <span class="small text-secondary">Luar biasa! Konsistensi latihan Anda hari ini membawa Anda lebih dekat ke target tubuh impian.</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        }
    }

    startActiveWorkout(mode = 'time') {
        const schedule = this.profile?.programSchedule;
        const currentDayData = schedule?.find(d => d.dayNumber === this.activeDay);
        if (!currentDayData || !currentDayData.exercises || currentDayData.exercises.length === 0) {
            alert("Tidak ada gerakan untuk sesi ini.");
            return;
        }

        this.player.startWorkout(currentDayData.exercises, currentDayData.title, {
            initialMode: mode,
            startIndex: 0
        });
    }

    startWorkoutFromIndex(index = 0, mode = 'reps') {
        const schedule = this.profile?.programSchedule;
        const currentDayData = schedule?.find(d => d.dayNumber === this.activeDay);
        if (!currentDayData || !currentDayData.exercises || currentDayData.exercises.length === 0) {
            alert("Tidak ada gerakan untuk sesi ini.");
            return;
        }

        this.player.startWorkout(currentDayData.exercises, currentDayData.title, {
            initialMode: mode,
            startIndex: index
        });
    }

    startSingleExercise(exerciseId, mode = 'reps') {
        this.closeExerciseDetailModal();
        this.player.startSingleExerciseSession(exerciseId, mode, 3);
    }

    /**
     * FITUR PRO 1: Sesi Latihan Kilat 1-Klik (Express Workouts)
     */
    startExpressWorkout(type = 'hiit7') {
        const all = Object.values(window.EXERCISE_DATABASE || {});
        if (all.length === 0) return;

        let title = 'Express Workout';
        let selectedIds = [];
        let mode = 'time';

        if (type === 'warmup') {
            title = 'Express: Pemanasan & Mobilitas Sendi (5 Menit)';
            selectedIds = ['jumping_jacks', 'bodyweight_squat', 'glute_bridge', 'incline_pushup'];
            mode = 'time';
        } else if (type === 'hiit7') {
            title = 'Express: Tabata HIIT Pembakar Lemak (7 Menit)';
            selectedIds = ['jumping_jacks', 'high_knees', 'mountain_climbers', 'burpees', 'jumping_squats'];
            mode = 'time';
        } else if (type === 'abs5') {
            title = 'Express: Sixpack Core Blaster (6 Menit)';
            selectedIds = ['plank_hold', 'bicycle_crunches', 'leg_raises', 'russian_twists', 'mountain_climbers'];
            mode = 'reps';
        } else if (type === 'chest5') {
            title = 'Express: Upper Body Dada & Lengan (6 Menit)';
            selectedIds = ['standard_pushup', 'incline_pushup', 'diamond_pushup', 'tricep_dips'];
            mode = 'reps';
        }

        const exercises = selectedIds
            .map(id => window.EXERCISE_DATABASE[id])
            .filter(Boolean)
            .map(ex => ({
                ...ex,
                duration: type === 'warmup' ? 30 : 35,
                defaultReps: ex.defaultReps || 12
            }));

        if (exercises.length === 0) {
            exercises.push(...all.slice(0, 4).map(ex => ({ ...ex, duration: 35 })));
        }

        this.player.startWorkout(exercises, title, {
            initialMode: mode,
            startIndex: 0
        });
    }

    /**
     * FITUR PRO 2: Ganti / Swap Gerakan Harian dengan 1 Klik
     */
    swapRoutineExercise(index) {
        const schedule = this.profile?.programSchedule;
        const currentDayData = schedule?.find(d => d.dayNumber === this.activeDay);
        if (!currentDayData || !currentDayData.exercises || !currentDayData.exercises[index]) return;

        const currentEx = currentDayData.exercises[index];
        const currentIds = new Set(currentDayData.exercises.map(e => e.id));
        const all = Object.values(window.EXERCISE_DATABASE || {});

        let candidates = all.filter(e => e.category === currentEx.category && !currentIds.has(e.id));
        if (candidates.length === 0) {
            candidates = all.filter(e => !currentIds.has(e.id));
        }
        if (candidates.length === 0) return;

        const replacement = candidates[Math.floor(Math.random() * candidates.length)];
        currentDayData.exercises[index] = {
            ...replacement,
            duration: currentEx.duration || replacement.defaultDuration || 40
        };

        this.saveTraineeProfile(this.profile);
        this.soundEngine.playBeep(680, 0.06);
        this.renderDailyRoutineView();
    }

    handleWorkoutCompleted(result) {
        if (!this.profile) return;

        if (!this.profile.completedDays) {
            this.profile.completedDays = [];
        }

        if (!result.isSingleExercise && !this.profile.completedDays.includes(this.activeDay)) {
            this.profile.completedDays.push(this.activeDay);
        }

        if (!this.profile.workoutHistory) {
            this.profile.workoutHistory = [];
        }

        this.profile.workoutHistory.push(result);
        this.saveTraineeProfile(this.profile);

        // Munculkan Modal Perayaan Kemenangan (Victory Celebration)
        this.showVictoryModal(result);
        this.renderApp();
    }

    markDayAsDone(dayNumber) {
        if (!this.profile.completedDays) this.profile.completedDays = [];
        if (!this.profile.completedDays.includes(dayNumber)) {
            this.profile.completedDays.push(dayNumber);
            this.saveTraineeProfile(this.profile);
            this.renderDailyRoutineView();
            alert(`Hari ke-${dayNumber} berhasil ditandai selesai!`);
        }
    }

    showVictoryModal(result) {
        const modal = document.getElementById('workoutVictoryModal');
        if (!modal) return;

        const durMins = Math.round(result.totalSeconds / 60);
        document.getElementById('victoryCalories').innerText = `${result.calories} kkal`;
        document.getElementById('victoryDuration').innerText = `${durMins > 0 ? durMins : 1} menit`;
        document.getElementById('victoryExercises').innerText = `${result.exercisesCount} Gerakan`;
        document.getElementById('victoryStreak').innerText = `${this.profile.completedDays.length} Hari`;

        modal.classList.add('active');
        modal.style.display = 'flex';

        // Efek Confetti Partikel
        this.fireConfetti();
    }

    closeVictoryModal() {
        const modal = document.getElementById('workoutVictoryModal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    fireConfetti() {
        // Simple DOM-based confetti particles
        const container = document.getElementById('confettiContainer') || document.body;
        for (let i = 0; i < 40; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti-piece';
            conf.style.left = `${Math.random() * 100}vw`;
            conf.style.backgroundColor = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#a855f7'][Math.floor(Math.random() * 5)];
            conf.style.animationDuration = `${1.5 + Math.random() * 2}s`;
            conf.style.opacity = Math.random();
            container.appendChild(conf);

            setTimeout(() => conf.remove(), 3500);
        }
    }

    renderExerciseLibrary() {
        const grid = document.getElementById('exerciseLibraryGrid');
        if (!grid) return;

        const all = Object.values(window.EXERCISE_DATABASE || {});
        let filtered = all;

        if (this.activeCategoryFilter !== 'all') {
            filtered = filtered.filter(ex => ex.category === this.activeCategoryFilter);
        }

        if (this.activeEquipmentFilter && this.activeEquipmentFilter !== 'all') {
            filtered = filtered.filter(ex => (ex.equipment || 'none') === this.activeEquipmentFilter);
        }

        if (this.exerciseSearchQuery) {
            const q = this.exerciseSearchQuery;
            filtered = filtered.filter(ex => {
                const nameMatch = (ex.name || '').toLowerCase().includes(q) || (ex.englishName || '').toLowerCase().includes(q);
                const muscleMatch = (ex.targetMuscles?.primary || []).join(' ').toLowerCase().includes(q) ||
                                    (ex.targetMuscles?.secondary || []).join(' ').toLowerCase().includes(q);
                return nameMatch || muscleMatch || (ex.category || '').toLowerCase().includes(q);
            });
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="pro-card p-5 text-center">
                        <i class="fas fa-dumbbell fa-2x text-muted mb-3"></i>
                        <h5 class="text-white fw-bold">Gerakan Tidak Ditemukan</h5>
                        <p class="text-secondary small mb-0">Coba gunakan kata kunci pencarian lain atau pilih kategori "Semua Gerakan".</p>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(ex => {
            const primaryMuscle = ex.targetMuscles?.primary?.join(', ') || 'Semua Otot';
            const isStaticPlank = ex.svgType === 'plank';
            const equipBadge = ex.equipment === 'dumbbell' ? '🏋️ Dumbbell' : '🤸 Bodyweight';
            return `
                <div class="col-md-6 col-lg-4">
                    <div class="pro-card pro-card-hover h-100 overflow-hidden d-flex flex-column justify-content-between">
                        <div class="p-3 bg-black bg-opacity-40 text-center border-bottom border-secondary border-opacity-15 position-relative">
                            <span class="badge bg-dark border border-secondary border-opacity-50 text-secondary position-absolute top-0 end-0 m-2" style="font-size: 0.68rem;">${equipBadge}</span>
                            ${window.getExerciseAnimationSvg ? window.getExerciseAnimationSvg(ex.svgType, false) : ''}
                        </div>
                        <div class="p-4 d-flex flex-column justify-content-between flex-grow-1">
                            <div>
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="pro-chip chip-active" style="font-size: 0.72rem; padding: 0.2rem 0.6rem;">${ex.category.toUpperCase()}</span>
                                    <span class="text-secondary small font-monospace">${ex.defaultDuration || 40}s • ${ex.defaultReps || 12} Rep • ~28 kkal</span>
                                </div>
                                <h5 class="text-white fw-bold mb-1" style="font-size: 1.05rem;">${ex.name}</h5>
                                <p class="small text-secondary mb-2">${ex.englishName}</p>
                                <div class="small text-muted mb-3"><span class="text-secondary fw-semibold">Target Otot:</span> ${primaryMuscle}</div>
                            </div>
                            <div class="mt-2 d-flex flex-column gap-2">
                                <div class="d-flex gap-2">
                                    <button class="btn btn-pro-primary btn-sm flex-grow-1 py-2 fw-bold" onclick="window.appInstance.startSingleExercise('${ex.id}', '${isStaticPlank ? 'time' : 'reps'}')">
                                        <i class="fas fa-play me-1"></i> Mulai (${isStaticPlank ? 'Timer Coach' : 'Hitungan Rep'})
                                    </button>
                                    <button class="btn btn-outline-info btn-sm rounded-pill px-3 py-2 fw-semibold" title="Mulai dengan Countdown Waktu" onclick="window.appInstance.startSingleExercise('${ex.id}', 'time')">
                                        <i class="fas fa-stopwatch"></i>
                                    </button>
                                </div>
                                <button class="btn btn-pro-secondary btn-sm w-100" onclick="window.appInstance.openExerciseDetailModal('${ex.id}')">
                                    <i class="fas fa-info-circle me-1"></i> Detail Form & Panduan Teknik
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    openExerciseDetailModal(exerciseId) {
        const ex = window.EXERCISE_DATABASE[exerciseId];
        if (!ex) return;

        const modal = document.getElementById('exerciseDetailModal');
        if (!modal) return;

        document.getElementById('detailModalTitle').innerText = ex.name;
        document.getElementById('detailModalSubtitle').innerText = ex.englishName;
        
        // Animasi SVG
        const animBox = document.getElementById('detailModalAnimBox');
        if (animBox && window.getExerciseAnimationSvg) {
            animBox.innerHTML = window.getExerciseAnimationSvg(ex.svgType, true);
        }

        // Otot Primer & Sekunder
        document.getElementById('detailModalPrimaryMuscles').innerText = ex.targetMuscles?.primary?.join(', ') || '-';
        document.getElementById('detailModalSecondaryMuscles').innerText = ex.targetMuscles?.secondary?.join(', ') || '-';
        document.getElementById('detailModalTempo').innerText = ex.tempo || '-';
        document.getElementById('detailModalBreathing').innerText = ex.breathing || '-';

        // Langkah-langkah
        const stepsContainer = document.getElementById('detailModalSteps');
        if (stepsContainer) {
            stepsContainer.innerHTML = ex.steps.map((s, idx) => `
                <li class="mb-2"><span class="text-success fw-bold me-2">${idx + 1}.</span>${s}</li>
            `).join('');
        }

        // Kesalahan Umum
        const mistakesContainer = document.getElementById('detailModalMistakes');
        if (mistakesContainer) {
            mistakesContainer.innerHTML = ex.commonMistakes.map(m => `
                <li class="mb-2 text-danger-subtle"><i class="fas fa-times-circle text-danger me-2"></i>${m}</li>
            `).join('');
        }

        // Tombol Dengarkan Suara PT & Tombol Mulai Latihan Gerakan Ini
        const btnListenCoach = document.getElementById('btnDetailListenCoach');
        if (btnListenCoach) {
            btnListenCoach.onclick = () => {
                const cue = ex.voiceCues?.start || `Lakukan gerakan ${ex.name} dengan form yang benar.`;
                this.voiceCoach.speak(cue);
            };
        }

        const btnStartReps = document.getElementById('btnDetailStartReps');
        if (btnStartReps) {
            btnStartReps.onclick = () => {
                this.startSingleExercise(ex.id, ex.svgType === 'plank' ? 'time' : 'reps');
            };
        }

        const btnStartTimer = document.getElementById('btnDetailStartTimer');
        if (btnStartTimer) {
            btnStartTimer.onclick = () => {
                this.startSingleExercise(ex.id, 'time');
            };
        }

        modal.classList.add('active');
        modal.style.display = 'flex';
    }

    closeExerciseDetailModal() {
        const modal = document.getElementById('exerciseDetailModal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            this.voiceCoach.stop();
            if (window.BiomechEngine) window.BiomechEngine.stopActive();
        }
    }

    // === NUTRISI & MACRO CALCULATOR ===
    calculateNutritionMacros() {
        const gender = document.querySelector('input[name="macro_gender"]:checked')?.value || 'male';
        const age = parseInt(document.getElementById('macroAge')?.value || '25', 10);
        const weight = parseFloat(document.getElementById('macroWeight')?.value || '70');
        const height = parseFloat(document.getElementById('macroHeight')?.value || '170');
        const activity = parseFloat(document.getElementById('macroActivity')?.value || '1.375');
        const goal = document.getElementById('macroGoal')?.value || 'maintain';

        // Harris-Benedict BMR Formula
        let bmr = 0;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        const tdee = Math.round(bmr * activity);
        let targetCalories = tdee;

        if (goal === 'cut') {
            targetCalories = Math.round(tdee - 450); // Defisit kalori
        } else if (goal === 'bulk') {
            targetCalories = Math.round(tdee + 350); // Surplus kalori
        }

        // Makronutrisi
        // Protein: 2.0g per kg berat badan
        const proteinGrams = Math.round(weight * 2.0);
        const proteinCal = proteinGrams * 4;

        // Fat: 25% dari total kalori
        const fatCal = targetCalories * 0.25;
        const fatGrams = Math.round(fatCal / 9);

        // Carbs: Sisa kalori
        const carbsCal = Math.max(0, targetCalories - (proteinCal + fatCal));
        const carbsGrams = Math.round(carbsCal / 4);

        // Tampilkan Hasil
        const resBox = document.getElementById('macroResultBox');
        if (resBox) {
            resBox.classList.remove('d-none');
            document.getElementById('resTdee').innerText = `${tdee} kkal`;
            document.getElementById('resTargetCal').innerText = `${targetCalories} kkal`;
            document.getElementById('resProtein').innerText = `${proteinGrams}g (${proteinCal} kkal)`;
            document.getElementById('resCarbs').innerText = `${carbsGrams}g (${carbsCal} kkal)`;
            document.getElementById('resFat').innerText = `${fatGrams}g (${Math.round(fatCal)} kkal)`;
        }

        // Render Rekomendasi Jadwal Menu Makan Harian Indonesia
        this.renderIndonesianMealPlan(goal, targetCalories, proteinGrams, carbsGrams);
    }

    renderIndonesianMealPlan(goal, targetCalories, proteinGrams, carbsGrams) {
        const container = document.getElementById('resIndonesianMealPlan');
        if (!container) return;

        const pPerMeal = Math.round(proteinGrams / 3.5);
        let meals = [];

        if (goal === 'cut') {
            meals = [
                { time: '🌅 Sarapan Pagi (07:00)', title: '3 Putih + 1 Kuning Telur Rebus & Oatmeal Pisang', macros: `~${pPerMeal}g Protein • 380 kkal`, desc: 'Kenyang lebih lama dan menjaga gula darah stabil di pagi hari.' },
                { time: '☀️ Makan Siang (12:30)', title: '150g Dada Ayam Bakar/Panggang + 1 Kepal Nasi Merah/Putih + Lalapan Sayur', macros: `~${pPerMeal + 12}g Protein • 520 kkal`, desc: 'Hindari kuah bersantan kental dan kulit ayam goreng tepung.' },
                { time: '⚡ Snack Sebelum Latihan (16:00)', title: 'Kopi Hitam Tanpa Gula + 1 Buah Apel / 2 Keping Tempe Kukus', macros: `~10g Protein • 160 kkal`, desc: 'Mendongkrak fokus dan pembakaran lemak saat sesi latihan sore.' },
                { time: '🌙 Makan Malam (19:00)', title: 'Ikan Bakar / Pepes Ikan / Tahu Tempe Bacem Tanpa Minyak + Tumis Brokoli', macros: `~${pPerMeal + 5}g Protein • 430 kkal`, desc: 'Tinggi protein dan serat untuk pemulihan otot saat tidur tanpa menumpuk lemak.' }
            ];
        } else if (goal === 'bulk') {
            meals = [
                { time: '🌅 Sarapan Pagi (07:00)', title: '3 Telur Dadar + 2 Lembar Roti Gandum Selai Kacang + Susu Tinggi Protein', macros: `~${pPerMeal + 5}g Protein • 640 kkal`, desc: 'Surplus energi bersih untuk memulai sintesis protein pagi hari.' },
                { time: '☀️ Makan Siang (12:30)', title: '180g Dada Ayam / Daging Sapi Tanpa Lemak + 1,5 Porsi Nasi Putih + Sayur Bayam', macros: `~${pPerMeal + 15}g Protein • 760 kkal`, desc: 'Karbohidrat kompleks mengisi penuh glikogen otot agar angkatan makin kuat.' },
                { time: '⚡ Post-Workout Shake/Snack (16:30)', title: '2 Buah Pisang + Susu Whey / Kedelai + 3 Potong Tempe', macros: `~24g Protein • 420 kkal`, desc: 'Langsung memperbaiki serat otot yang bekerja keras setelah latihan.' },
                { time: '🌙 Makan Malam (19:30)', title: 'Ikan Tuna / Ayam Panggang + Kentang Rebus / Nasi + Capcay Sayur', macros: `~${pPerMeal + 8}g Protein • 650 kkal`, desc: 'Menjaga tubuh tetap anabolik sepanjang malam.' }
            ];
        } else {
            meals = [
                { time: '🌅 Sarapan Pagi (07:00)', title: '2 Butir Telur Orak-Arik + Bubur Oatmeal / Nasi Uduk Porsi Kecil Tanpa Gorengan', macros: `~${pPerMeal}g Protein • 450 kkal`, desc: 'Komposisi seimbang untuk stamina kerja dan latihan harian.' },
                { time: '☀️ Makan Siang (12:30)', title: '150g Ayam Panggang / Ikan Kembung + Nasi Secukupnya + Sayur Asem', macros: `~${pPerMeal + 10}g Protein • 580 kkal`, desc: 'Sumber protein lokal berkualitas tinggi dengan mikronutrisi lengkap.' },
                { time: '⚡ Camilan Sore (16:00)', title: 'Edamame Rebus / Kacang Almond + Buah Pepaya atau Pisang', macros: `~12g Protein • 210 kkal`, desc: 'Menjaga energi sore hari sebelum berolahraga.' },
                { time: '🌙 Makan Malam (19:00)', title: 'Sup Tahu Ayam + Tempe Panggang + Tumis Kangkung', macros: `~${pPerMeal + 4}g Protein • 480 kkal`, desc: 'Ringan di pencernaan namun kaya asam amino pemulih otot.' }
            ];
        }

        this.lastMealPlanSpeech = `Berdasarkan perhitungan tubuhmu, target kalorimu adalah ${targetCalories} kalori dengan ${proteinGrams} gram protein per hari. Untuk sarapan pagi, konsumsi ${meals[0].title}. Untuk makan siang, pilih ${meals[1].title}. Sore hari sebelum latihan, nikmati ${meals[2].title}. Dan untuk makan malam, tutup dengan ${meals[3].title}.`;

        container.innerHTML = meals.map(m => `
            <div class="col-md-6">
                <div class="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 h-100">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="text-warning small fw-bold">${m.time}</span>
                        <span class="badge bg-success bg-opacity-20 text-success border border-success border-opacity-25 font-monospace" style="font-size: 0.7rem;">${m.macros}</span>
                    </div>
                    <h6 class="text-white fw-bold mb-1" style="font-size: 0.92rem;">${m.title}</h6>
                    <p class="text-secondary small mb-0" style="font-size: 0.78rem;">${m.desc}</p>
                </div>
            </div>
        `).join('');
    }

    speakCustomMealPlan() {
        if (this.lastMealPlanSpeech) {
            this.voiceCoach.speak(this.lastMealPlanSpeech);
        } else {
            this.calculateNutritionMacros();
            if (this.lastMealPlanSpeech) this.voiceCoach.speak(this.lastMealPlanSpeech);
        }
    }

    // === HYDRATION TRACKER (INTERACTIVE 8 GLASSES) ===
    renderHydrationTracker() {
        const todayStr = new Date().toISOString().split('T')[0];
        let waterData = JSON.parse(localStorage.getItem('workout_water_intake') || '{}');

        if (waterData.date !== todayStr) {
            waterData = { date: todayStr, count: 0 };
            localStorage.setItem('workout_water_intake', JSON.stringify(waterData));
        }

        const count = waterData.count || 0;
        const total = 8; // 8 gelas (2000 ml)
        const pct = Math.min(100, Math.round((count / total) * 100));

        const bar = document.getElementById('waterProgressBar');
        const text = document.getElementById('waterProgressText');
        const mlText = document.getElementById('waterVolumeText');
        const cupsGrid = document.getElementById('waterGlassesInteractiveGrid');

        if (bar) bar.style.width = `${pct}%`;
        if (text) text.innerText = `${count} / ${total} Gelas`;
        if (mlText) mlText.innerText = `(${count * 250} ml / 2000 ml)`;

        if (cupsGrid) {
            let cupsHtml = '';
            for (let i = 1; i <= total; i++) {
                const isFilled = i <= count;
                cupsHtml += `
                    <button type="button" class="water-cup-btn ${isFilled ? 'filled' : ''}" onclick="window.appInstance.setWaterGlassCount(${i})" title="Gelas ke-${i} (${i * 250} ml)">
                        <i class="fas fa-glass-water"></i>
                    </button>
                `;
            }
            cupsGrid.innerHTML = cupsHtml;
        }
    }

    setWaterGlassCount(targetCount) {
        const todayStr = new Date().toISOString().split('T')[0];
        localStorage.setItem('workout_water_intake', JSON.stringify({ date: todayStr, count: targetCount }));
        this.soundEngine.playBeep(720, 0.07);
        this.renderHydrationTracker();
        this.renderProgressAndAnatomyTab();

        if (targetCount === 8) {
            this.voiceCoach.speak("Luar biasa! Target hidrasi delapan gelas air putih hari ini sudah terpenuhi seratus persen. Metabolisme dan pemulihan ototmu akan bekerja sangat optimal!");
        }
    }

    addWaterGlass() {
        const todayStr = new Date().toISOString().split('T')[0];
        let waterData = JSON.parse(localStorage.getItem('workout_water_intake') || '{}');
        if (waterData.date !== todayStr) waterData = { date: todayStr, count: 0 };

        waterData.count = (waterData.count || 0) + 1;
        this.setWaterGlassCount(waterData.count);
    }

    resetWaterIntake() {
        const todayStr = new Date().toISOString().split('T')[0];
        localStorage.setItem('workout_water_intake', JSON.stringify({ date: todayStr, count: 0 }));
        this.renderHydrationTracker();
    }

    renderWorkoutStats() {
        if (!this.profile) return;
        const completedCount = this.profile.completedDays?.length || 0;
        const totalProgramDays = this.profile.duration || 30;
        const pct = Math.round((completedCount / totalProgramDays) * 100);

        const history = this.profile.workoutHistory || [];
        const historyCalories = history.reduce((acc, item) => acc + (item.calories || 0), 0);
        const totalCalories = Math.max(historyCalories, completedCount * 145);

        // Hitung Level XP & Rank Athlete
        const xpPoints = (completedCount * 150) + Math.round(totalCalories * 0.5);
        const level = Math.max(1, Math.floor(xpPoints / 200) + 1);
        let rankTitle = 'Rookie Starter';
        if (level >= 10) rankTitle = 'Spartan Legend';
        else if (level >= 7) rankTitle = 'Elite Titan';
        else if (level >= 4) rankTitle = 'Pro Gladiator';
        else if (level >= 2) rankTitle = 'Active Warrior';

        const streakEl = document.getElementById('statStreakDays');
        const pctEl = document.getElementById('statProgressPercent');
        const progressEl = document.getElementById('statTotalProgressBar');
        const calEl = document.getElementById('statTotalCalories');
        const lvlEl = document.getElementById('statAthleteLevel');
        const rankSubEl = document.getElementById('statAthleteRankSub');
        const navRankEl = document.getElementById('navbarAthleteRankBadge');

        if (streakEl) streakEl.innerText = `${completedCount} Hari`;
        if (pctEl) pctEl.innerText = `${pct}%`;
        if (progressEl) progressEl.style.width = `${pct}%`;
        if (calEl) calEl.innerText = `${totalCalories} kkal`;
        if (lvlEl) lvlEl.innerText = `Lv. ${level}`;
        if (rankSubEl) rankSubEl.innerText = rankTitle;
        if (navRankEl) navRankEl.innerText = `⚡ Lv.${level} ${rankTitle}`;
    }

    // === TAB PROGRES, PETA OTOT ANATOMI & PENCAPAIAN ===
    renderProgressAndAnatomyTab() {
        this.selectMuscleZone(this.selectedMuscleZone || 'abs', 'Otot Perut Sixpack & Core', false);
        this.renderBodyMetricsChart();
        this.renderAchievements();
        this.renderWorkoutHistoryList();
    }

    selectMuscleZone(zoneKey, zoneTitle, speakFeedback = true) {
        this.selectedMuscleZone = zoneKey;
        const panel = document.getElementById('selectedMuscleZonePanel');
        if (!panel) return;

        // Highlight active SVG group
        document.querySelectorAll('.body-muscle-zone .muscle-part').forEach(el => {
            el.classList.remove('active-zone');
        });
        document.querySelectorAll(`.body-muscle-zone[data-muscle-zone="${zoneKey}"] .muscle-part`).forEach(el => {
            el.classList.add('active-zone');
        });

        const all = Object.values(window.EXERCISE_DATABASE || {});
        const matched = all.filter(e => e.category === zoneKey);

        panel.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="text-success fw-bold mb-0"><i class="fas fa-crosshairs me-1"></i> ${zoneTitle}</h6>
                <span class="badge bg-dark border border-secondary border-opacity-50">${matched.length} Gerakan</span>
            </div>
            <div class="d-flex flex-column gap-2">
                ${matched.slice(0, 4).map(ex => `
                    <div class="d-flex align-items-center justify-content-between p-2 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-15">
                        <div>
                            <div class="text-white small fw-bold">${ex.name}</div>
                            <div class="text-muted" style="font-size: 0.72rem;">${ex.defaultReps || 12} Rep • ${ex.defaultDuration || 40}s</div>
                        </div>
                        <div class="d-flex gap-1">
                            <button class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-1 small" onclick="window.appInstance.openExerciseDetailModal('${ex.id}')">Form</button>
                            <button class="btn btn-xs btn-success rounded-pill px-3 py-1 small fw-bold text-dark" onclick="window.appInstance.startSingleExercise('${ex.id}', '${ex.svgType === 'plank' ? 'time' : 'reps'}')">
                                <i class="fas fa-play me-1"></i> Mulai
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        if (speakFeedback && this.soundEngine) {
            this.soundEngine.playBeep(640, 0.05);
        }
    }

    saveBodyMetricsLog() {
        const wInput = document.getElementById('inputTrackWeight');
        const waistInput = document.getElementById('inputTrackWaist');
        const weight = parseFloat(wInput?.value || '0');
        const waist = parseFloat(waistInput?.value || '0');

        if (!weight || weight < 25 || weight > 250) {
            alert("Masukkan berat badan yang valid (dalam kg).");
            return;
        }

        const logs = JSON.parse(localStorage.getItem('workout_body_logs') || '[]');
        logs.push({
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            weight,
            waist: waist || null,
            ts: Date.now()
        });

        localStorage.setItem('workout_body_logs', JSON.stringify(logs.slice(-12)));
        if (this.soundEngine) this.soundEngine.playChime();
        this.renderBodyMetricsChart();
        this.voiceCoach.speak(`Progres fisik berhasil dicatat! Berat badanmu saat ini ${weight} kilogram. Terus jaga konsistensi latihan dan nutrisimu!`);
    }

    renderBodyMetricsChart() {
        const container = document.getElementById('bodyWeightChartContainer');
        const bmiBadge = document.getElementById('bmiStatusBadge');
        if (!container) return;

        let logs = JSON.parse(localStorage.getItem('workout_body_logs') || '[]');
        if (logs.length === 0) {
            logs = [
                { date: 'Awal', weight: 70.0, waist: 84 },
                { date: 'Minggu 1', weight: 69.2, waist: 83 },
                { date: 'Hari Ini', weight: 68.5, waist: 81.5 }
            ];
        }

        const latest = logs[logs.length - 1];
        const heightM = 1.70;
        const bmi = (latest.weight / (heightM * heightM)).toFixed(1);
        let bmiLabel = 'Ideal / Atletis';
        if (bmi < 18.5) bmiLabel = 'Underweight';
        else if (bmi >= 25) bmiLabel = 'Overweight (Fokus Fat Loss)';

        if (bmiBadge) {
            bmiBadge.innerHTML = `<i class="fas fa-heart-pulse me-1"></i> Berat: <strong>${latest.weight} kg</strong> • BMI: <strong>${bmi}</strong> (${bmiLabel})`;
        }

        const weights = logs.map(l => l.weight);
        const minW = Math.min(...weights) - 1.5;
        const maxW = Math.max(...weights) + 1.5;
        const width = 460;
        const height = 135;

        const points = logs.map((item, idx) => {
            const x = logs.length === 1 ? width / 2 : 35 + (idx / (logs.length - 1)) * (width - 70);
            const y = height - 28 - ((item.weight - minW) / Math.max(1, maxW - minW)) * (height - 55);
            return { x, y, ...item };
        });

        const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 135px;">
                <line x1="25" y1="${height - 24}" x2="${width - 25}" y2="${height - 24}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                <polyline fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}"/>
                ${points.map(p => `
                    <circle cx="${p.x}" cy="${p.y}" r="5" fill="#10b981" stroke="#090a0f" stroke-width="2"/>
                    <text x="${p.x}" y="${p.y - 10}" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">${p.weight}kg</text>
                    <text x="${p.x}" y="${height - 8}" fill="#94a3b8" font-size="10" text-anchor="middle">${p.date}</text>
                `).join('')}
            </svg>
        `;
    }

    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;

        const completedDays = this.profile?.completedDays?.length || 0;
        const historyCount = this.profile?.workoutHistory?.length || 0;
        const waterData = JSON.parse(localStorage.getItem('workout_water_intake') || '{}');
        const waterCount = waterData.count || 0;

        const badges = [
            { title: 'Langkah Pertama', desc: 'Menyelesaikan sesi latihan perdana', icon: 'fa-Shoe-prints', unlocked: completedDays >= 1 || historyCount >= 1 },
            { title: '3-Day Fire Streak', desc: 'Konsisten berlatih 3 hari program', icon: 'fa-fire', unlocked: completedDays >= 3 },
            { title: 'Master Hidrasi', desc: 'Minum minimal 4 gelas air hari ini', icon: 'fa-glass-water', unlocked: waterCount >= 4 },
            { title: 'Spartan 7 Hari', desc: 'Menuntaskan 7 hari jadwal latihan', icon: 'fa-shield-halved', unlocked: completedDays >= 7 }
        ];

        grid.innerHTML = badges.map(b => `
            <div class="col-sm-6">
                <div class="achievement-card ${b.unlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon-box">
                        <i class="fas ${b.icon}"></i>
                    </div>
                    <div>
                        <div class="text-white fw-bold small">${b.title} ${b.unlocked ? '<i class="fas fa-check-circle text-success ms-1"></i>' : ''}</div>
                        <div class="text-secondary" style="font-size: 0.74rem;">${b.desc}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderWorkoutHistoryList() {
        const container = document.getElementById('workoutHistoryList');
        if (!container) return;

        const history = (this.profile?.workoutHistory || []).slice(-5).reverse();
        if (history.length === 0) {
            container.innerHTML = `
                <div class="text-center py-3 text-secondary small">
                    Belum ada riwayat sesi yang tercatat hari ini. Klik tombol <strong>Mulai</strong> pada gerakan apa pun untuk mencatat rekor pertama Anda!
                </div>
            `;
            return;
        }

        container.innerHTML = history.map(item => {
            const mins = Math.max(1, Math.round((item.totalSeconds || 60) / 60));
            return `
                <div class="d-flex align-items-center justify-content-between p-2 px-3 mb-2 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-20">
                    <div>
                        <div class="text-white fw-bold small">${item.title || 'Sesi Latihan'}</div>
                        <div class="text-muted" style="font-size: 0.72rem;">${item.exercisesCount || 1} Gerakan • Durasi ~${mins} menit</div>
                    </div>
                    <span class="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-25 font-monospace">
                        🔥 ${item.calories || 28} kkal
                    </span>
                </div>
            `;
        }).join('');
    }
}

// Inisialisasi Aplikasi Saat Halaman Selesai Dimuat
window.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new WorkoutApp();
});
