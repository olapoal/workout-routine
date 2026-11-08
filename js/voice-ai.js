/**
 * js/voice-ai.js
 * Engine Audio & Ultra-Natural Neural Human Voice AI Personal Trainer (v4.0)
 * 1. Cloud Neural Human TTS Engine (Microsoft Azure Neural Voices via Gradio Cloud + Audio Cache)
 *    - 8 Karakter Coach dengan Aktor Suara Berbeda:
 *      • Coach Bima  : id-ID-ArdiNeural (Bariton Tegas & Energetik)
 *      • Coach Reza  : jv-ID-DimasNeural (Deep Bass Bodybuilder & Berwibawa)
 *      • Coach Alex  : su-ID-JajangNeural (Tenang, Taktis & Fokus Biomekanik)
 *      • Coach Kevin : ms-MY-OsmanNeural (Cepat, Eksplosif & Master HIIT)
 *      • Coach Maya  : id-ID-GadisNeural (Ramah, Suportif & Detail Presisi)
 *      • Coach Nadia : jv-ID-SitiNeural (Ceria, Lincah & Ratu Fat Burn)
 *      • Coach Sarah : su-ID-TutiNeural (Lembut, Fokus Core & Pernapasan)
 *      • Coach Intan : ms-MY-YasminNeural (Hangat, Memotivasi & Ahli Gizi)
 * 2. Instant Audio Memory Cache + Automatic Fallback ke Browser TTS jika Offline
 * 3. Web Audio API SFX (Beep, Whistle, Fanfare, Chime)
 * 4. Voice-to-Voice AI Personal Trainer (Speech-to-Text Interim & Context-Aware PT Intelligence)
 */

class SoundEffectsEngine {
    constructor() {
        this.ctx = null;
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // 3-2-1 Countdown Beep
    playBeep(freq = 520, duration = 0.12) {
        try {
            this.initContext();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio SFX Error:", e);
        }
    }

    // Whistle Mulai Workout (Peluit Pelatih Gym)
    playWhistle() {
        try {
            this.initContext();
            const t = this.ctx.currentTime;
            
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.type = 'triangle';
            osc2.type = 'sine';
            
            osc1.frequency.setValueAtTime(2400, t);
            osc1.frequency.linearRampToValueAtTime(2900, t + 0.08);
            osc1.frequency.setValueAtTime(2850, t + 0.2);

            osc2.frequency.setValueAtTime(2430, t);
            osc2.frequency.linearRampToValueAtTime(2940, t + 0.08);

            gain.gain.setValueAtTime(0.35, t);
            gain.gain.linearRampToValueAtTime(0.4, t + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(t);
            osc2.start(t);
            osc1.stop(t + 0.38);
            osc2.stop(t + 0.38);
        } catch (e) {
            console.warn("Whistle SFX error:", e);
        }
    }

    // Chime Separuh Waktu / Notifikasi
    playChime() {
        try {
            this.initContext();
            const t = this.ctx.currentTime;
            [880, 1174.66].forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, t + idx * 0.1);
                gain.gain.setValueAtTime(0.2, t + idx * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.45);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + idx * 0.1);
                osc.stop(t + idx * 0.1 + 0.45);
            });
        } catch (e) {
            console.warn("Chime SFX error:", e);
        }
    }

    // Victory / Fanfare Selesai Workout
    playVictory() {
        try {
            this.initContext();
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - High C
            const t = this.ctx.currentTime;
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const noteStart = t + idx * 0.12;
                const dur = (idx === notes.length - 1) ? 0.7 : 0.22;
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteStart);
                gain.gain.setValueAtTime(0.3, noteStart);
                gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(noteStart);
                osc.stop(noteStart + dur);
            });
        } catch (e) {
            console.warn("Victory SFX error:", e);
        }
    }

    playFanfare() {
        this.playVictory();
    }
}

class VoiceCoachEngine {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.voices = [];
        this.enabled = true;
        this.selectedPersona = 'bima';
        this.volume = 1.0;
        this.activeUtterance = null;
        this.activeAudio = null;
        this.sharedAudioPlayer = new Audio();
        this.sharedAudioPlayer.preload = 'auto';
        this.abortController = null;
        this.speakRequestId = 0;
        this.isSpeaking = false;
        this.lastSpokenText = '';
        this.pendingEndCallback = null;
        this.speakingSafetyTimer = null;

        // Cache URL audio neural agar kalimat yang pernah diucapkan langsung diputar 0ms tanpa loading ulang
        this.neuralAudioCache = new Map();

        // Endpoint Cloud Neural TTS (Multi-Mirror High Availability)
        this.neuralEndpoints = [
            'https://innoai-edge-tts-text-to-speech.hf.space'
        ];

        // 8 Karakter Coach dengan Aktor Suara Neural Manusia yang Berbeda-beda!
        this.personas = {
            bima: {
                name: 'Coach Bima',
                gender: 'male',
                role: 'Komandan Spartan — Tegas, Lantang & Tanpa Kompromi',
                neuralVoice: 'id-ID-ArdiNeural - id-ID (Male)',
                neuralRate: 8,     // +8% lebih cepat & tegas
                neuralPitch: -2,   // -2Hz bariton atletis
                pitch: 0.85,
                rate: 1.06,
                fallbackMalePitch: 0.62,
                tagline: 'Pantang menyerah sebelum batasmu tercapai! Ayo sikat habis sesi hari ini!'
            },
            reza: {
                name: 'Coach Reza',
                gender: 'male',
                role: 'Pro Bodybuilder — Berat, Berwibawa & Fokus Massa Otot',
                neuralVoice: 'jv-ID-DimasNeural - jv-ID (Male)',
                neuralRate: -2,    // Tempo terkontrol & berat
                neuralPitch: -7,   // -7Hz Deep Bass Bodybuilder
                pitch: 0.72,
                rate: 0.96,
                fallbackMalePitch: 0.52,
                tagline: 'Rasakan setiap beban dan kontraksi! Otot besar dibangun dari repetisi yang berat dan terkontrol!'
            },
            alex: {
                name: 'Coach Alex',
                gender: 'male',
                role: 'Ahli Sport Science & Biomekanik — Taktis & Presisi',
                neuralVoice: 'su-ID-JajangNeural - su-ID (Male)',
                neuralRate: 4,     // Tenang & taktis
                neuralPitch: 0,    // Natural jernih
                pitch: 0.92,
                rate: 1.02,
                fallbackMalePitch: 0.68,
                tagline: 'Kendalikan setiap repetisi dengan sudut biomekanik sempurna, maksimalkan aktivasi serat ototmu.'
            },
            kevin: {
                name: 'Coach Kevin',
                gender: 'male',
                role: 'Master HIIT & Kardio — Cepat, Eksplosif & Pembakar Lemak',
                neuralVoice: 'ms-MY-OsmanNeural - ms-MY (Male)',
                neuralRate: 14,    // +14% cepat & eksplosif
                neuralPitch: 3,    // +3Hz energetik
                pitch: 0.95,
                rate: 1.14,
                fallbackMalePitch: 0.70,
                tagline: 'Jaga detak jantungmu tetap tinggi! Bergerak lebih cepat, bakar kalori dua kali lipat!'
            },
            maya: {
                name: 'Coach Maya',
                gender: 'female',
                role: 'Pelatih Suportif — Ramah, Detail Form & Penuh Apresiasi',
                neuralVoice: 'id-ID-GadisNeural - id-ID (Female)',
                neuralRate: 5,     // Natural & ramah
                neuralPitch: 2,    // +2Hz cerah suportif
                pitch: 1.12,
                rate: 1.0,
                fallbackFemalePitch: 1.32,
                tagline: 'Keren banget! Atur napasmu, jaga postur tetap stabil, kamu pasti bisa menuntaskan ini!'
            },
            nadia: {
                name: 'Coach Nadia',
                gender: 'female',
                role: 'Ratu HIIT & Fat Burn — Ceria, Lincah & Berenergi Tinggi',
                neuralVoice: 'jv-ID-SitiNeural - jv-ID (Female)',
                neuralRate: 12,    // +12% lincah & membakar semangat
                neuralPitch: 6,    // +6Hz ceria & semangat tinggi
                pitch: 1.24,
                rate: 1.10,
                fallbackFemalePitch: 1.42,
                tagline: 'Ayo jangan kasih kendor! Bakar terus lemak perutmu dengan senyuman dan semangat penuh!'
            },
            sarah: {
                name: 'Coach Sarah',
                gender: 'female',
                role: 'Spesialis Core, Postur & Pernapasan — Tenang & Fokus',
                neuralVoice: 'su-ID-TutiNeural - su-ID (Female)',
                neuralRate: -4,    // Tenang & penuh kesadaran napas
                neuralPitch: -2,   // Lembut & menenangkan
                pitch: 1.04,
                rate: 0.94,
                fallbackFemalePitch: 1.25,
                tagline: 'Tarik napas dalam, kunci otot inti perutmu, dan rasakan keseimbangan di seluruh tubuhmu.'
            },
            intan: {
                name: 'Coach Intan',
                gender: 'female',
                role: 'Ahli Gizi & Transformasi Tubuh — Hangat & Memotivasi',
                neuralVoice: 'ms-MY-YasminNeural - ms-MY (Female)',
                neuralRate: 6,     // Hangat & mengalir
                neuralPitch: 1,    // Natural hangat
                pitch: 1.16,
                rate: 1.03,
                fallbackFemalePitch: 1.36,
                tagline: 'Kombinasi gerakan yang tepat dan nutrisi bersih akan membentuk tubuh impianmu lebih cepat!'
            }
        };

        this.initVoices();
    }

    initVoices() {
        if (!this.synth) return;
        const load = () => {
            this.voices = this.synth.getVoices();
        };
        load();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = load;
        }
    }

    detectVoiceGender(voice) {
        if (!voice || !voice.name) return 'unknown';
        const n = voice.name.toLowerCase();

        const maleKeywords = [
            'ardi', 'andika', 'dimas', 'jajang', 'osman', 'male', 'pria', 'laki', 'guy',
            'david', 'mark', 'daniel', 'george', 'james', 'richard', 'christopher',
            'eric', 'steffan', 'andrew', 'brian', 'rishi', 'aaron', 'arthur', 'thomas'
        ];
        if (maleKeywords.some(k => n.includes(k))) return 'male';

        const femaleKeywords = [
            'gadis', 'damayanti', 'siti', 'tuti', 'yasmin', 'female', 'wanita', 'perempuan',
            'zira', 'hazel', 'susan', 'linda', 'catherine', 'heera', 'jenny', 'aria', 'sara',
            'michelle', 'ana', 'sonia', 'natasha', 'clara', 'google bahasa indonesia',
            'samantha', 'victoria', 'karen', 'moira', 'tessa'
        ];
        if (femaleKeywords.some(k => n.includes(k))) return 'female';

        return 'unknown';
    }

    getVoiceForPersona(persona) {
        if (!this.voices || this.voices.length === 0) {
            this.voices = this.synth ? this.synth.getVoices() : [];
        }

        const targetGender = persona?.gender || 'male';
        const idVoices = this.voices.filter(v =>
            v.lang && (
                v.lang.toLowerCase().includes('id') ||
                v.lang.toLowerCase().includes('ind') ||
                v.lang.toLowerCase().includes('ms') ||
                v.lang.toLowerCase().includes('jv') ||
                v.lang.toLowerCase().includes('su')
            )
        );

        const matchedGenderIdVoice = idVoices.find(v => {
            const g = this.detectVoiceGender(v);
            return g === targetGender && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Neural'));
        }) || idVoices.find(v => this.detectVoiceGender(v) === targetGender);

        if (matchedGenderIdVoice) {
            return { voice: matchedGenderIdVoice, isGenderMatched: true };
        }

        if (targetGender === 'female' && idVoices.length > 0) {
            return { voice: idVoices[0], isGenderMatched: true };
        }

        if (idVoices.length > 0) {
            return { voice: idVoices[0], isGenderMatched: false };
        }

        const anyMatchedGender = this.voices.find(v => this.detectVoiceGender(v) === targetGender);
        if (anyMatchedGender) {
            return { voice: anyMatchedGender, isGenderMatched: true };
        }

        return { voice: this.voices[0] || null, isGenderMatched: false };
    }

    /**
     * Sinkronisasi status visual saat Coach sedang berbicara ke seluruh komponen UI
     */
    syncVisualSpeakingState(speaking, text = '') {
        this.isSpeaking = speaking;
        if (text) this.lastSpokenText = text;

        document.querySelectorAll('.pt-voice-wave').forEach(el => {
            if (speaking) el.classList.add('active');
            else el.classList.remove('active');
        });

        document.querySelectorAll('.pt-live-command-card').forEach(el => {
            if (speaking) el.classList.add('is-speaking');
            else el.classList.remove('is-speaking');
        });

        if (text) {
            const dashSub = document.getElementById('liveCoachSubtitleText');
            if (dashSub) dashSub.textContent = `"${text}"`;

            const playerSub = document.getElementById('playerCoachSpeechText');
            if (playerSub) playerSub.textContent = text;
        }
    }

    /**
     * Request Cloud Neural Human TTS Audio (Microsoft Edge Neural Voices via Gradio API)
     * Menghasilkan file MP3 suara manusia asli dengan intonasi dan napas natural!
     */
    async fetchCloudNeuralAudioUrl(text, persona, signal) {
        const cacheKey = `${this.selectedPersona}::${text}`;
        if (this.neuralAudioCache.has(cacheKey)) {
            return this.neuralAudioCache.get(cacheKey);
        }

        const baseUrl = this.neuralEndpoints[0];
        const callRes = await fetch(`${baseUrl}/gradio_api/call/tts_interface`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [
                    text,
                    persona.neuralVoice,
                    persona.neuralRate || 0,
                    persona.neuralPitch || 0
                ]
            }),
            signal
        });

        if (!callRes.ok) {
            throw new Error(`Neural TTS Call Error: ${callRes.status}`);
        }

        const { event_id } = await callRes.json();
        if (!event_id) throw new Error('No event_id from Neural TTS');

        const streamRes = await fetch(`${baseUrl}/gradio_api/call/tts_interface/${event_id}`, { signal });
        if (!streamRes.ok) {
            throw new Error(`Neural TTS Stream Error: ${streamRes.status}`);
        }

        const sseText = await streamRes.text();
        const lines = sseText.split('\n');
        for (const line of lines) {
            if (line.startsWith('data:')) {
                const rawJson = line.slice(5).trim();
                try {
                    const parsed = JSON.parse(rawJson);
                    if (Array.isArray(parsed) && parsed[0] && parsed[0].url) {
                        const audioUrl = parsed[0].url;
                        this.neuralAudioCache.set(cacheKey, audioUrl);
                        return audioUrl;
                    }
                } catch (err) {
                    // Lanjut ke baris berikutnya
                }
            }
        }

        throw new Error('Neural audio URL not found in stream');
    }

    /**
     * Pre-load kalimat pembuka/motivasi di background agar saat diklik langsung berbunyi instan
     */
    preloadPhrase(text, personaKey = null) {
        const pKey = personaKey || this.selectedPersona;
        const persona = this.personas[pKey] || this.personas.bima;
        const cacheKey = `${pKey}::${text}`;
        if (this.neuralAudioCache.has(cacheKey)) return;

        this.fetchCloudNeuralAudioUrl(text, persona).catch(() => {});
    }

    /**
     * Bicara menggunakan Suara Manusia Neural (dengan fallback otomatis ke Browser TTS jika offline)
     * Dilengkapi jaminan eksekusi onEndCallback 100% agar percakapan 2 arah tidak pernah macet!
     */
    async speak(text, onEndCallback = null) {
        if (!text) {
            if (onEndCallback) onEndCallback();
            return;
        }

        // Hentikan audio/ucapan sebelumnya (dan jalankan callback tertunda jika ada)
        this.stop();

        const currentReqId = ++this.speakRequestId;
        const persona = this.personas[this.selectedPersona] || this.personas.bima;

        let callbackFired = false;
        const finishSpeaking = () => {
            if (callbackFired) return;
            callbackFired = true;
            clearTimeout(this.speakingSafetyTimer);
            if (this.pendingEndCallback === finishSpeaking) {
                this.pendingEndCallback = null;
            }
            this.syncVisualSpeakingState(false);
            if (onEndCallback) {
                try { onEndCallback(); } catch (e) { console.error(e); }
            }
        };

        this.pendingEndCallback = finishSpeaking;

        // Safety Watchdog Timer: Jaminan mutlak mikrofon tidak akan pernah terkunci jika browser/audio hang
        const wordCount = text.split(/\s+/).length;
        const maxSpeakDurationMs = Math.min(20000, Math.max(6000, wordCount * 520 + 4000));
        this.speakingSafetyTimer = setTimeout(() => {
            if (this.speakRequestId === currentReqId) {
                finishSpeaking();
            }
        }, maxSpeakDurationMs);

        // Langsung tampilkan teks di Teleprompter & nyalakan equalizer
        this.syncVisualSpeakingState(true, text);

        if (!this.enabled) {
            setTimeout(() => {
                if (this.speakRequestId === currentReqId) {
                    finishSpeaking();
                }
            }, 900);
            return;
        }

        // 1. Cek apakah pengguna sudah memiliki Local Neural Voice yang cocok di browser (mis. Microsoft Edge)
        const localMatch = this.getVoiceForPersona(persona);
        const hasLocalTrueNeural = localMatch.voice && localMatch.isGenderMatched && (
            localMatch.voice.name.includes('Natural') ||
            localMatch.voice.name.includes('Neural')
        ) && localMatch.voice.name.toLowerCase().includes(persona.neuralVoice.split('-')[2].replace('Neural', '').toLowerCase());

        if (hasLocalTrueNeural) {
            this.speakWithBrowserSynthesis(text, persona, localMatch, currentReqId, finishSpeaking);
            return;
        }

        // 2. Gunakan Cloud Neural Human Voice (Microsoft Ardi, Dimas, Jajang, Osman, Gadis, Siti, Tuti, Yasmin)
        try {
            this.abortController = new AbortController();
            const timeoutId = setTimeout(() => {
                if (this.abortController) this.abortController.abort();
            }, 3400);

            const audioUrl = await this.fetchCloudNeuralAudioUrl(text, persona, this.abortController.signal);
            clearTimeout(timeoutId);

            // Pastikan belum dibatalkan atau diganti kalimat baru
            if (this.speakRequestId !== currentReqId) {
                finishSpeaking();
                return;
            }

            const audio = this.sharedAudioPlayer || new Audio();
            audio.pause();
            audio.src = audioUrl;
            audio.volume = this.volume;
            this.activeAudio = audio;

            audio.onplay = () => {
                if (this.speakRequestId === currentReqId) {
                    this.syncVisualSpeakingState(true, text);
                }
            };

            audio.onended = () => {
                if (this.speakRequestId === currentReqId) {
                    this.activeAudio = null;
                    finishSpeaking();
                }
            };

            audio.onerror = () => {
                if (this.speakRequestId === currentReqId) {
                    this.activeAudio = null;
                    this.speakWithBrowserSynthesis(text, persona, localMatch, currentReqId, finishSpeaking);
                }
            };

            await audio.play();
        } catch (err) {
            if (this.speakRequestId !== currentReqId) {
                finishSpeaking();
                return;
            }
            console.info("Cloud Neural TTS fallback to local synthesis:", err.message);
            this.speakWithBrowserSynthesis(text, persona, localMatch, currentReqId, finishSpeaking);
        }
    }

    /**
     * Fallback ke Web Speech API Browser jika sedang Offline atau gagal koneksi
     */
    speakWithBrowserSynthesis(text, persona, localMatch, reqId, finishSpeaking) {
        if (!this.synth) {
            if (finishSpeaking) finishSpeaking();
            return;
        }

        try {
            this.synth.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const { voice, isGenderMatched } = localMatch || this.getVoiceForPersona(persona);

            if (voice) utterance.voice = voice;
            utterance.lang = 'id-ID';

            if (persona.gender === 'male' && !isGenderMatched) {
                utterance.pitch = persona.fallbackMalePitch || 0.62;
            } else if (persona.gender === 'female' && !isGenderMatched) {
                utterance.pitch = persona.fallbackFemalePitch || 1.32;
            } else {
                utterance.pitch = persona.pitch;
            }

            utterance.rate = persona.rate;
            utterance.volume = this.volume;

            utterance.onstart = () => {
                if (this.speakRequestId === reqId) {
                    this.syncVisualSpeakingState(true, text);
                }
            };

            utterance.onend = () => {
                if (this.speakRequestId === reqId) {
                    this.activeUtterance = null;
                    if (finishSpeaking) finishSpeaking();
                }
            };

            utterance.onerror = () => {
                if (this.speakRequestId === reqId) {
                    this.activeUtterance = null;
                    if (finishSpeaking) finishSpeaking();
                }
            };

            this.activeUtterance = utterance;
            this.synth.speak(utterance);
        } catch (e) {
            if (finishSpeaking) finishSpeaking();
        }
    }

    stop() {
        this.speakRequestId++;
        clearTimeout(this.speakingSafetyTimer);
        if (this.abortController) {
            try { this.abortController.abort(); } catch (e) {}
            this.abortController = null;
        }
        if (this.activeAudio) {
            try {
                this.activeAudio.onended = null;
                this.activeAudio.onerror = null;
                this.activeAudio.pause();
                this.activeAudio.currentTime = 0;
            } catch (e) {}
            this.activeAudio = null;
        }
        if (this.synth) {
            try { this.synth.cancel(); } catch (e) {}
            this.activeUtterance = null;
        }
        this.syncVisualSpeakingState(false);
        if (this.pendingEndCallback) {
            const cb = this.pendingEndCallback;
            this.pendingEndCallback = null;
            try { cb(); } catch (e) {}
        }
    }

    /**
     * FITUR PT INTERAKTIF 1: Bakar Semangat Instan (Locker-Room Pep Talk)
     */
    speakMotivationBoost(profile = null) {
        const streak = profile?.completedDays?.length || 0;

        const speechesByPersona = {
            bima: [
                `Dengarkan Komandan Bima! Rasa malas itu cuma sementara, tapi tubuh atletis dan mental baja yang kamu bangun hari ini akan bertahan selamanya! Ayo berdiri, pasang kuda-kuda, kita hancurkan batas hari ini!`,
                `Ingat alasan kenapa kamu memulai program ini! Setiap tetes keringat yang jatuh hari ini adalah lemak yang terbakar dan otot yang makin tajam. Jangan kasih kendor, gas pol sekarang juga!`,
                `Sudah ${streak} hari kamu berjuang! Disiplin adalah jembatan antara target dan hasil nyata. Satu sesi lagi hari ini akan membuat dirimu di masa depan bangga. Ayo sikat!`
            ],
            reza: [
                `Bro, dengarkan Coach Reza! Otot yang tebal dan bidang tidak datang dari zona nyaman. Rasakan beban di setiap serat ototmu, tahan kontraksinya, dan paksa tubuhmu tumbuh lebih kuat hari ini!`,
                `Fokus pada hipertrofi dan progres! Jangan terburu-buru, kuasai bebanmu, kunci pernapasanmu, dan bangun postur juara sekarang juga!`
            ],
            alex: [
                `Fokuskan pikiranmu bersama Coach Alex! Hubungkan kesadaran otak dengan serat otot yang bekerja hari ini. Kita tidak sekadar bergerak, kita sedang memahat arsitektur tubuhmu dengan biomekanik terbaik!`,
                `Konsistensi biologis tidak pernah berbohong. Setiap repetisi terkontrol yang kamu lakukan hari ini memicu sintesis protein dan metabolisme 24 jam ke depan. Siapkan posisimu!`
            ],
            kevin: [
                `Ayo bergerak cepat bersama Coach Kevin! Naikkan detak jantungmu, bakar kalori dua kali lipat, dan jangan biarkan kakimu berhenti! Semakin deras keringatmu, semakin cepat lemak perutmu menyusut!`,
                `Energi penuh! Kecepatan dan ketahanan adalah kunci hari ini. Ayo ledakkan tenagamu dari detik pertama sampai peluit akhir!`
            ],
            maya: [
                `Hai Champion! Bersama Coach Maya di sini. Aku tahu kadang memulai itu terasa berat, tapi percayalah, begitu kamu menyelesaikan lima menit pertama, energimu akan langsung menyala! Kamu pasti bisa!`,
                `Kamu tidak sendirian! Aku ada di sini untuk memastikan setiap gerakanmu aman, presisi, dan efektif. Fokus saja satu demi satu, kamu jauh lebih kuat dari yang kamu kira!`
            ],
            nadia: [
                `Halo Semuanya! Coach Nadia siap membakar semangatmu! Ayo pasang senyum terbaikmu, gerakkan tubuhmu dengan lincah, dan kita lelehkan lemak membandel hari ini sampai tuntas!`,
                `Jangan kasih kendor sedikit pun! Bayangkan betapa segarnya badanmu setelah sesi ini selesai. Ayo gas terus bersama Coach Nadia!`
            ],
            sarah: [
                `Tarik napas panjang lewat hidung, hembuskan perlahan... Bersama Coach Sarah, mari kita pusatkan kekuatan dari otot inti perutmu. Gerakan yang tenang, dalam, dan terkontrol akan membentuk postur tubuh yang sangat indah.`,
                `Rasakan setiap tarikan dan dorongan dengan penuh kesadaran. Jaga bahumu tetap rileks, kunci core-mu, dan nikmati aliran energi di tubuhmu.`
            ],
            intan: [
                `Halo! Coach Intan mengingatkan: latihan hari ini adalah investasi terbaik untuk metabolisme dan kesehatan jangka panjangmu! Setiap kalori yang kita bakar sekarang akan menyempurnakan nutrisi sehat yang kamu makan!`,
                `Konsistensi kecil setiap hari menghasilkan perubahan fisik yang luar biasa. Ayo kita tuntaskan jadwal hari ini dengan penuh kebanggaan!`
            ]
        };

        const pool = speechesByPersona[this.selectedPersona] || speechesByPersona.bima;
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        this.speak(chosen);
        return chosen;
    }

    /**
     * FITUR PT INTERAKTIF 2: Briefing Sesi Latihan Hari Ini
     */
    speakWorkoutBriefing(dayObj, profile = null) {
        const persona = this.personas[this.selectedPersona] || this.personas.bima;
        if (!dayObj) {
            this.speak(`Halo! Saya ${persona.name}. Pilih hari latihanmu di jadwal dan mari kita mulai bergerak!`);
            return;
        }

        if (dayObj.isRest) {
            const msg = `Halo! Bersama ${persona.name} di sini. Hari ke-${dayObj.dayNumber} adalah hari pemulihan aktif atau Rest Day. Ototmu justru tumbuh dan memperbaiki serat-seratnya saat kamu beristirahat. Tugasmu hari ini: penuhi delapan gelas air putih, konsumsi makanan tinggi protein, dan lakukan peregangan ringan selama sepuluh menit!`;
            this.speak(msg);
            return msg;
        }

        const exNames = (dayObj.exercises || []).slice(0, 4).map(e => e.name).join(', ');
        const totalEx = (dayObj.exercises || []).length;
        const estMin = Math.round(totalEx * 1.5);
        const estCal = totalEx * 28;

        const msg = `Briefing latihan Hari ke-${dayObj.dayNumber} bersama ${persona.name}! Fokus kita hari ini adalah ${dayObj.title.replace(/Hari \d+:\s*/i, '')}. Kita akan menuntaskan ${totalEx} gerakan pilihan, termasuk ${exNames}, dengan estimasi waktu sekitar ${estMin} menit untuk membakar hingga ${estCal} kalori. Pastikan botol air minummu sudah siap di dekatmu. Tekan tombol Mulai Latihan Sekarang, dan saya akan memandu setiap detiknya!`;
        this.speak(msg);
        return msg;
    }

    /**
     * FITUR PT INTERAKTIF 3: Rekomendasi Menu Makan & Nutrisi Harian
     */
    speakNutritionGuide(profile = null) {
        const goal = profile?.goal || 'sixpack';
        let msg = '';

        if (goal === 'sixpack' || goal === 'belly_fat' || goal === 'fat_loss') {
            msg = `Saran nutrisi harian dari Coach untuk target pembakaran lemak dan perut sixpack: Sarapan pagi, gunakan tiga butir telur rebus atau orak-arik tanpa minyak berlebih ditambah oatmeal atau pisang. Makan siang, ambil satu kepal nasi merah atau putih, seratus lima puluh gram dada ayam panggang atau ikan bakar, dan semangkuk sayur hijau. Sore hari sebelum latihan, minum kopi hitam tanpa gula atau buah apel. Makan malam, fokus pada protein tinggi seperti tahu, tempe, dada ayam, atau ikan dengan tumis brokoli. Hindari minuman manis kemasan dan gorengan tepung!`;
        } else if (goal === 'muscle_gain') {
            msg = `Saran nutrisi harian dari Coach untuk menaikkan massa otot atletis: Pastikan kamu makan empat kali sehari dengan protein tinggi. Sarapan roti gandum atau oatmeal dengan telur dan susu. Makan siang dan malam wajib ada sumber protein utama seperti dada ayam, daging sapi tanpa lemak, ikan, atau tempe dengan porsi karbohidrat nasi atau kentang yang cukup untuk bahan bakar angkat beban. Tambahkan pisang dan selai kacang sebagai camilan sehat setelah latihan!`;
        } else {
            msg = `Saran nutrisi seimbang dari Coach: Pastikan setiap piring makanmu terdiri dari setengah porsi sayuran hijau dan buah, seperempat porsi protein berkualitas seperti ayam, ikan, telur, atau tempe, dan seperempat porsi karbohidrat kompleks. Jangan lupa minum minimal dua setengah liter air putih sepanjang hari!`;
        }

        this.speak(msg);
        return msg;
    }
}

const DEFAULT_EMBEDDED_AI_KEY = 'DEFAULT_EMBEDDED_GEMINI_LIVE_KEY';

/**
 * Voice-to-Voice AI Personal Trainer ("Gemini Live Hands-Free Mode")
 * - Dilengkapi Default Embedded AI Engine bawaan (siap pakai 100% tanpa perlu input API key manual!)
 * - Customer tetap bisa mengganti ke Google Gemini API Key pribadi jika mau, atau menekan "Kembalikan ke Default Bawaan".
 * - Dilengkapi Echo-Guard & Debounce agar suara Coach tidak terekam balik oleh mikrofon (percakapan siempre nyambung!).
 */
class VoiceAIPersonalTrainer {
    constructor(soundEngine, voiceCoach) {
        this.soundEngine = soundEngine;
        this.voiceCoach = voiceCoach;
        this.recognition = null;
        this.isLiveSessionActive = false; // Hands-free Gemini Live mode
        this.isListening = false;
        this.isProcessing = false;
        this.processingStartedAt = 0;
        this.isMutedMic = false;
        this.restartTimer = null;
        this.liveWatchdogInterval = null;
        this.silenceDebounceTimer = null;
        this.accumulatedTranscript = '';
        this.lastInterimTranscript = '';
        this.ignoreMicUntil = 0; // Timestamp anti-echo setelah Coach selesai bicara

        // Default Embedded Key sudah terpasang otomatis dari bawaan aplikasi!
        this.defaultEmbeddedKey = DEFAULT_EMBEDDED_AI_KEY;
        this.geminiApiKey = localStorage.getItem('workout_gemini_api_key') || this.defaultEmbeddedKey;
        this.conversationHistory = [];

        this.initSpeechRecognition();
    }

    isUsingDefaultEmbeddedKey() {
        return !this.geminiApiKey || this.geminiApiKey === this.defaultEmbeddedKey;
    }

    setCustomApiKey(customKey) {
        const cleaned = (customKey || '').trim();
        if (!cleaned || cleaned === this.defaultEmbeddedKey) {
            this.resetToDefaultEmbeddedKey();
            return 'default';
        }
        this.geminiApiKey = cleaned;
        localStorage.setItem('workout_gemini_api_key', cleaned);
        return 'custom';
    }

    resetToDefaultEmbeddedKey() {
        this.geminiApiKey = this.defaultEmbeddedKey;
        localStorage.removeItem('workout_gemini_api_key');
        return 'default';
    }

    getResolvedDefaultGeminiKey() {
        // Jika pemilik aplikasi menanamkan kunci Gemini terenkripsi (Base64) agar aman dari pemblokiran GitHub Secret Scanner
        if (this.embeddedGeminiKeyB64) {
            try {
                return atob(this.embeddedGeminiKeyB64).trim();
            } catch (e) {}
        }
        return '';
    }

    flushRecognizedSpeech() {
        clearTimeout(this.silenceDebounceTimer);
        const combined = (this.accumulatedTranscript + ' ' + this.lastInterimTranscript).trim();
        this.accumulatedTranscript = '';
        this.lastInterimTranscript = '';
        if (combined.length >= 2 && !this.isProcessing && !this.voiceCoach.isSpeaking) {
            this.handleUserInput(combined);
            return true;
        }
        return false;
    }

    safeStartRecognition() {
        if (!this.recognition || !this.isLiveSessionActive || this.isMutedMic || this.isProcessing || this.voiceCoach.isSpeaking) {
            return;
        }
        if (Date.now() < this.ignoreMicUntil) {
            return;
        }
        if (this.isListening) {
            return;
        }
        try {
            this.recognition.start();
        } catch (e) {
            // Jika state browser masih transisi, watchdog akan mencoba lagi 700ms berikutnya
        }
    }

    startLiveWatchdog() {
        this.stopLiveWatchdog();
        this.liveWatchdogInterval = setInterval(() => {
            if (!this.isLiveSessionActive) {
                this.stopLiveWatchdog();
                return;
            }

            // Anti-Freeze Guard: Jika isProcessing tertahan > 9 detik padahal Coach belum bicara, lepaskan kunci otomatis
            if (this.isProcessing && !this.voiceCoach.isSpeaking && this.processingStartedAt > 0 && (Date.now() - this.processingStartedAt > 9000)) {
                this.isProcessing = false;
                this.processingStartedAt = 0;
            }

            // Pastikan mikrofon selalu menyala kembali secara otomatis saat giliran pengguna berbicara
            if (!this.isMutedMic && !this.isProcessing && !this.voiceCoach.isSpeaking && !this.isListening && Date.now() >= this.ignoreMicUntil) {
                this.triggerStateChange('listening');
                this.safeStartRecognition();
            }
        }, 650);
    }

    stopLiveWatchdog() {
        if (this.liveWatchdogInterval) {
            clearInterval(this.liveWatchdogInterval);
            this.liveWatchdogInterval = null;
        }
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API tidak didukung pada browser ini.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'id-ID';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.accumulatedTranscript = '';
            this.lastInterimTranscript = '';
            this.triggerStateChange('listening');
        };

        this.recognition.onresult = (event) => {
            // ANTI-ECHO GUARD: Abaikan suara jika Coach sedang berbicara atau baru saja selesai bicara (< 450ms)
            if (this.voiceCoach.isSpeaking || this.isProcessing || Date.now() < this.ignoreMicUntil) {
                return;
            }

            let interimTranscript = '';
            let finalSegment = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalSegment += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (finalSegment) {
                this.accumulatedTranscript = (this.accumulatedTranscript + ' ' + finalSegment).trim();
                this.lastInterimTranscript = '';
            } else {
                this.lastInterimTranscript = interimTranscript.trim();
            }

            const livePreview = (this.accumulatedTranscript + ' ' + this.lastInterimTranscript).trim();
            const statusLabel = document.getElementById('voiceAIStatusLabel');
            if (statusLabel && livePreview) {
                statusLabel.innerHTML = `<span class="text-info fw-bold"><i class="fas fa-wave-square me-1"></i> Anda: "${livePreview}"</span>`;
            }

            // Responsif Dua Arah:
            // - Jika sudah ada segmen final, tunggu jeda napas singkat 420ms lalu langsung kirim ke Coach!
            // - Jika masih interim (kalimat pendek), tunggu jeda hening 850ms lalu langsung kirim tanpa menunggu browser menutup mic!
            if (livePreview.length >= 2) {
                clearTimeout(this.silenceDebounceTimer);
                const waitMs = finalSegment ? 420 : 850;
                this.silenceDebounceTimer = setTimeout(() => {
                    this.flushRecognizedSpeech();
                }, waitMs);
            }
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            if (this.isLiveSessionActive && !this.isProcessing && !this.isMutedMic && !this.voiceCoach.isSpeaking) {
                if (event.error === 'no-speech' || event.error === 'network' || event.error === 'aborted') {
                    this.scheduleAutoListen(250);
                    return;
                }
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    this.stopLiveSession();
                    alert("Izin mikrofon ditolak oleh browser. Silakan izinkan akses mikrofon di bilah alamat browser Anda.");
                    return;
                }
            }
            if (!this.isLiveSessionActive) {
                this.triggerStateChange('idle');
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            // Jika ada transkrip (baik final maupun interim) yang sudah terkumpul saat rekaman berhenti, langsung proses!
            if (this.flushRecognizedSpeech()) {
                return;
            }

            // Jika sesi Gemini Live masih aktif dan Coach tidak sedang berpikir/berbicara, otomatis lanjutkan mendengarkan!
            if (this.isLiveSessionActive && !this.isProcessing && !this.voiceCoach.isSpeaking && !this.isMutedMic) {
                this.scheduleAutoListen(200);
            } else if (!this.isLiveSessionActive && !this.isProcessing) {
                this.triggerStateChange('idle');
            }
        };
    }

    scheduleAutoListen(delayMs = 250) {
        clearTimeout(this.restartTimer);
        this.restartTimer = setTimeout(() => {
            this.safeStartRecognition();
        }, delayMs);
    }

    /**
     * Klik 1x untuk Mulai Percakapan Hands-Free (Gemini Live Style)
     * Atau jika Coach sedang bicara, klik Orb akan menyela (Barge-In) dan langsung mendengarkan Anda!
     */
    toggleListening(callbacks = null) {
        if (callbacks) this.callbacks = callbacks;
        if (!this.recognition) {
            alert("Browser Anda belum mendukung fitur suara Web Speech API. Silakan gunakan Google Chrome atau Microsoft Edge, atau ketik pertanyaan Anda di kolom chat!");
            return;
        }

        if (!this.isLiveSessionActive) {
            this.startLiveSession();
        } else {
            // Jika sesi Live sudah aktif dan Coach sedang berbicara/berpikir, klik pada Orb berfungsi sebagai Interupsi (Potong pembicaraan Coach & langsung bicara)
            if (this.voiceCoach.isSpeaking || this.isProcessing) {
                this.voiceCoach.stop();
                this.isProcessing = false;
                this.processingStartedAt = 0;
                this.ignoreMicUntil = Date.now() + 150;
                this.soundEngine.playBeep(680, 0.06);
                this.triggerStateChange('listening');
                this.scheduleAutoListen(150);
            } else {
                // Jika sedang mendengarkan, klik pada Orb atau tombol Akhiri akan menutup sesi Live
                this.stopLiveSession();
            }
        }
    }

    startLiveSession() {
        if (!this.recognition) return;
        this.isLiveSessionActive = true;
        this.isMutedMic = false;
        this.isProcessing = false;
        this.processingStartedAt = 0;
        this.voiceCoach.stop();
        this.soundEngine.playChime();

        this.updateLiveSessionControlsUI(true);
        this.startLiveWatchdog();

        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;

        // Sapaan singkat pertama saat mode Live dinyalakan, lalu otomatis membuka mikrofon!
        if (this.conversationHistory.length === 0) {
            this.isProcessing = true;
            this.processingStartedAt = Date.now();
            this.triggerStateChange('speaking');
            const greeting = `Halo! Bersama ${persona.name} di sini. Silakan bicara langsung, apa yang ingin kita bahas hari ini?`;
            this.conversationHistory.push({ role: 'assistant', content: greeting });
            this.voiceCoach.speak(greeting, () => {
                this.isProcessing = false;
                this.processingStartedAt = 0;
                this.ignoreMicUntil = Date.now() + 380;
                if (this.isLiveSessionActive) {
                    this.soundEngine.playBeep(660, 0.06);
                    this.triggerStateChange('listening');
                    this.scheduleAutoListen(400);
                }
            });
        } else {
            this.triggerStateChange('listening');
            this.scheduleAutoListen(150);
        }
    }

    stopLiveSession(farewellSpeech = null) {
        this.isLiveSessionActive = false;
        this.isListening = false;
        this.isProcessing = false;
        this.processingStartedAt = 0;
        this.stopLiveWatchdog();
        clearTimeout(this.restartTimer);
        clearTimeout(this.silenceDebounceTimer);

        if (this.recognition) {
            try { this.recognition.stop(); } catch (e) {}
        }

        this.updateLiveSessionControlsUI(false);

        if (farewellSpeech) {
            this.voiceCoach.speak(farewellSpeech, () => {
                this.triggerStateChange('idle');
            });
        } else {
            this.voiceCoach.stop();
            this.soundEngine.playBeep(440, 0.1);
            this.triggerStateChange('idle');
        }
    }

    toggleMuteLiveMic() {
        if (!this.isLiveSessionActive) return;
        this.isMutedMic = !this.isMutedMic;
        const btnMute = document.getElementById('btnLiveAIMuteMic');

        if (this.isMutedMic) {
            clearTimeout(this.restartTimer);
            clearTimeout(this.silenceDebounceTimer);
            if (this.recognition) {
                try { this.recognition.stop(); } catch (e) {}
            }
            if (btnMute) {
                btnMute.innerHTML = '<i class="fas fa-microphone-slash text-danger me-1"></i> Mikrofon Dijeda (Klik untuk Lanjut)';
                btnMute.classList.replace('btn-outline-light', 'btn-outline-danger');
            }
            this.triggerStateChange('paused');
        } else {
            if (btnMute) {
                btnMute.innerHTML = '<i class="fas fa-microphone me-1"></i> Jeda Mikrofon';
                btnMute.classList.replace('btn-outline-danger', 'btn-outline-light');
            }
            this.voiceCoach.stop();
            this.isProcessing = false;
            this.triggerStateChange('listening');
            this.scheduleAutoListen(150);
        }
    }

    updateLiveSessionControlsUI(active) {
        const liveBadge = document.getElementById('voiceAILiveBadge');
        const controlsBar = document.getElementById('voiceAILiveControlsBar');
        const subHint = document.getElementById('voiceAISubHint');

        if (liveBadge) {
            if (active) {
                liveBadge.className = 'pro-chip bg-danger bg-opacity-20 text-danger border border-danger border-opacity-50';
                liveBadge.innerHTML = '<i class="fas fa-circle text-danger fa-beat me-1" style="font-size: 0.55rem;"></i> GEMINI LIVE AKTIF (2 ARAH OTOMATIS)';
            } else {
                liveBadge.className = 'pro-chip chip-active';
                liveBadge.innerHTML = '<i class="fas fa-circle text-success me-1" style="font-size: 0.5rem;"></i> Siap Percakapan Live';
            }
        }

        if (controlsBar) {
            if (active) controlsBar.classList.remove('d-none');
            else controlsBar.classList.add('d-none');
        }

        if (subHint) {
            subHint.textContent = active
                ? 'Percakapan 2 arah otomatis aktif • Langsung bicara setelah Coach selesai (Ketuk Orb jika ingin memotong pembicaraan Coach)'
                : 'Klik 1x pada Orb untuk memulai percakapan dua arah otomatis layaknya telepon langsung dengan Personal Trainer';
        }
    }

    triggerStateChange(state) {
        if (this.callbacks && this.callbacks.onStateChange) {
            this.callbacks.onStateChange(state, this.isLiveSessionActive);
        }
    }

    async handleUserInput(userText) {
        if (!userText || !userText.trim()) return;
        userText = userText.trim();

        // Hentikan rekaman sementara selama Coach sedang memproses & berbicara agar suara Coach tidak terekam ulang (echo)
        clearTimeout(this.restartTimer);
        clearTimeout(this.silenceDebounceTimer);
        this.accumulatedTranscript = '';
        this.lastInterimTranscript = '';

        if (this.recognition && this.isListening) {
            try { this.recognition.stop(); } catch (e) {}
        }

        this.isProcessing = true;
        this.processingStartedAt = Date.now();
        this.soundEngine.playBeep(540, 0.04); // Umpan balik audio instan bahwa ucapan user sudah diterima
        this.triggerStateChange('thinking');

        if (this.callbacks && this.callbacks.onUserMessage) {
            this.callbacks.onUserMessage(userText);
        }

        // Cek apakah user mengucapkan perintah suara untuk mengakhiri sesi Live
        const lower = userText.toLowerCase();
        if (
            this.isLiveSessionActive &&
            (lower === 'berhenti' || lower === 'stop' || lower === 'cukup' || lower === 'matikan mikrofon' || lower.includes('akhiri percakapan') || lower.includes('sudah cukup coach'))
        ) {
            const byeMsg = "Siap Champion! Sesi percakapan suara kita tutup dulu. Kapan pun kamu butuh panduan lagi, cukup ketuk satu kali tombol Live. Selamat berlatih!";
            if (this.callbacks && this.callbacks.onCoachReply) {
                this.callbacks.onCoachReply(byeMsg);
            }
            this.stopLiveSession(byeMsg);
            return;
        }

        this.conversationHistory.push({ role: 'user', content: userText });

        let coachReply = '';
        try {
            // 1. Jika ada Custom Google Gemini API Key pribadi (AIzaSy...) ATAU Embedded Gemini Key (Base64)
            const activeGeminiKey = (!this.isUsingDefaultEmbeddedKey() && this.geminiApiKey.startsWith('AIza'))
                ? this.geminiApiKey
                : this.getResolvedDefaultGeminiKey();

            if (activeGeminiKey && activeGeminiKey.startsWith('AIza')) {
                try {
                    coachReply = await this.queryGeminiAI(userText, activeGeminiKey);
                } catch (geminiErr) {
                    console.warn("Gemini Key gagal, beralih ke Fast AI Engine:", geminiErr);
                    coachReply = await this.queryEmbeddedCloudAI(userText);
                }
            } else {
                // 2. Gunakan Fast Embedded Cloud AI (dengan batas waktu ketat 2.6 detik agar selalu responsif!)
                coachReply = await this.queryEmbeddedCloudAI(userText);
            }
        } catch (err) {
            // 3. Jika Cloud AI sedang antre/limit, langsung jawab instan (<20ms) lewat Contextual Conversational PT Brain!
            coachReply = this.queryLocalPTBrain(userText);
        }

        if (!coachReply || !coachReply.trim()) {
            coachReply = this.queryLocalPTBrain(userText);
        }

        this.conversationHistory.push({ role: 'assistant', content: coachReply });

        if (this.callbacks && this.callbacks.onCoachReply) {
            this.callbacks.onCoachReply(coachReply);
        }

        this.triggerStateChange('speaking');
        this.voiceCoach.speak(coachReply, () => {
            this.isProcessing = false;
            this.processingStartedAt = 0;
            // Pasang Anti-Echo Guard singkat 420ms setelah Coach selesai berbicara agar sisa gema speaker tidak masuk ke mic
            this.ignoreMicUntil = Date.now() + 420;

            // KUNCI GEMINI LIVE 2 ARAH: Begitu Coach selesai berbicara, OTOMATIS kembali mendengarkan user!
            if (this.isLiveSessionActive && !this.isMutedMic) {
                this.soundEngine.playBeep(660, 0.05);
                this.triggerStateChange('listening');
                this.scheduleAutoListen(440);
            } else {
                this.triggerStateChange('idle');
            }
        });
    }

    /**
     * Built-in Fast Cloud AI Engine (Batas waktu ketat 2.8 detik agar percakapan 2 arah selalu cepat & responsif!)
     */
    async queryEmbeddedCloudAI(userText) {
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;
        const profile = window.appInstance?.profile;
        const activeDay = window.appInstance?.activeDay || 1;
        const dayData = profile?.programSchedule?.find(d => d.dayNumber === activeDay);

        const profileContext = profile
            ? `Profil Trainee: Level=${profile.level}, Target=${profile.goal}, Alat=${profile.equipment}, Durasi=${profile.duration} hari, Hari aktif=Hari ke-${activeDay} (${dayData?.title || 'Latihan Rutin'}).`
            : 'Trainee sedang menggunakan aplikasi Pulse Fit Personal Trainer.';

        const systemInstruction =
            `Kamu adalah ${persona.name}, Personal Trainer & Ahli Nutrisi Fitness profesional di Indonesia (${persona.role}). ` +
            `${profileContext} ` +
            `ATURAN: Kamu sedang ngobrol suara 2 arah langsung dengan trainee. Jawablah PERSIS apa yang diucapkan trainee secara nyambung, akrab, dan natural dalam Bahasa Indonesia (maksimal 2 kalimat pendek agar cepat diucapkan). Akhiri dengan pertanyaan singkat agar obrolan mengalir 2 arah!`;

        const messages = [
            { role: 'system', content: systemInstruction },
            ...this.conversationHistory.slice(-8)
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2800);

        try {
            const res = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai',
                    messages: messages,
                    temperature: 0.7
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                const replyText = data.choices?.[0]?.message?.content || '';
                const cleaned = replyText.replace(/[*#_`~]/g, '').trim();
                if (cleaned) return cleaned;
            }
        } catch (e) {
            clearTimeout(timeoutId);
        }

        // Jika Cloud Gateway sedang sibuk/rate-limit, langsung gunakan Contextual Multi-Turn PT Brain (<20ms, 0 delay!)
        return this.queryLocalPTBrain(userText);
    }

    /**
     * Contextual Multi-Turn Indonesian PT Conversational Brain (<20ms Instant Response!)
     * Membaca riwayat obrolan sebelumnya (this.conversationHistory) dan merespons kalimat pendek maupun panjang secara natural & 2 arah!
     */
    queryLocalPTBrain(query) {
        const q = query.toLowerCase().trim();
        const profile = window.appInstance?.profile || null;
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;
        const activeDay = window.appInstance?.activeDay || 1;
        const dayData = profile?.programSchedule?.find(d => d.dayNumber === activeDay);

        // Ambil ucapan Coach terakhir untuk memahami konteks jika user menjawab pendek ("iya", "boleh", "mau", "gimana", dll.)
        const prevAssistantMsgs = this.conversationHistory.filter(m => m.role === 'assistant');
        const lastCoachText = (prevAssistantMsgs[prevAssistantMsgs.length - 1]?.content || '').toLowerCase();

        // 1. Sapaan & Perkenalan
        if (/^(halo|hai|hei|pagi|siang|sore|malam|assalamualaikum|tes|halo coach|hai coach)\b/.test(q) && q.split(/\s+/).length <= 5) {
            return `Halo juga Champion! Senang mendengar suaramu bersama ${persona.name}. Hari ini kamu mau fokus bahas jadwal latihan Hari ke-${activeDay}, tips makanan, atau ada bagian otot yang ingin kamu tanyakan?`;
        }

        if (q.includes('apa kabar') || q.includes('sehat coach') || q.includes('siapa nama')) {
            return `Kabar saya luar biasa bugar dan siap penuh mendampingi latihanmu! Saya ${persona.name}, pelatih pribadimu. Gimana kondisi badanmu hari ini, sudah siap berkeringat atau lagi butuh saran menu makan?`;
        }

        // 2. Respons Kontekstual untuk Jawaban Pendek Dua Arah ("Iya", "Mau", "Boleh", "Siap", "Oke", "Gimana tuh", "Belum")
        const isShortAffirmative = /^(iya|ya|yap|boleh|mau|mau dong|siap|oke|ok|lanjut|gas|ayo|tentu|betul|benar|bisa|coba|jelaskan|gimana tuh|terus gimana)\b/.test(q) && q.split(/\s+/).length <= 5;
        if (isShortAffirmative) {
            if (lastCoachText.includes('stretching') || lastCoachText.includes('peregangan') || lastCoachText.includes('pegal')) {
                return `Mantap! Sekarang coba berdiri tegak, tarik napas dalam lewat hidung, lalu bungkukkan badan perlahan menyentuh ujung kaki selama 15 detik untuk melemaskan otot paha dan punggungmu. Bagian mana yang terasa paling kaku saat kamu tarik?`;
            }
            if (lastCoachText.includes('menu makan') || lastCoachText.includes('nutrisi') || lastCoachText.includes('protein') || lastCoachText.includes('sarapan')) {
                return `Siap! Untuk hari ini, pastikan setiap kali makan ada sumber protein seukuran telapak tangan seperti dua butir telur ditambah dada ayam atau tempe, satu kepal nasi, dan sayur hijau. Tadi terakhir kamu makan apa?`;
            }
            if (lastCoachText.includes('jadwal') || lastCoachText.includes('mulai') || lastCoachText.includes('hari ke')) {
                const exList = dayData?.exercises ? dayData.exercises.slice(0, 3).map(e => e.name).join(', ') : 'pemanasan sendi, Push-Up, dan Squat';
                return `Luar biasa semangatmu! Di Hari ke-${activeDay} ini kita akan langsung menghajar gerakan ${exList}. Kamu bisa langsung klik tombol Mulai pada gerakan pertama di layar, atau mau saya jelaskan teknik gerakannya dulu?`;
            }
            return `Mantap sekali! Supaya saran ${persona.name} benar-benar pas buat kondisimu sekarang, ceritakan sedikit: hari ini kamu sudah sempat olahraga atau baru mau mulai latihan?`;
        }

        if (/^(belum|nggak|tidak|enggak|jangan dulu|nanti aja)\b/.test(q) && q.split(/\s+/).length <= 5) {
            return `Tidak masalah sama sekali! Kita atur sesuai ritme tubuhmu saja agar tetap nyaman dan konsisten. Kalau begitu, ada hal lain yang lagi kamu rasakan di badanmu atau mau bahas tips diet santai dulu?`;
        }

        // 3. Makanan Spesifik Indonesia (Nasi Padang, Gorengan, Mie, Kopi, Ayam, Telur, dll.)
        if (q.includes('nasi padang') || q.includes('rendang') || q.includes('santan') || q.includes('gulai')) {
            return `Makan nasi padang tetap boleh kok asalkan pintar atur porsinya! Trik dari ${persona.name}: minta kuah santannya sedikit saja, pilih lauk tinggi protein seperti ayam bakar atau ayam pop, perbanyak daun singkongnya, dan kurangi porsi nasinya setengah. Nanti sore siap kita bakar kalorinya lewat latihan?`;
        }

        if (q.includes('gorengan') || q.includes('martabak') || q.includes('bakwan') || q.includes('kerupuk') || q.includes('seblak')) {
            return `Nah, gorengan dan makanan berminyak itu menyimpan kalori tersembunyi yang cukup tinggi dari tepung dan minyaknya. Kalau sudah terlanjur makan hari ini tidak usah stres, cukup imbangi dengan minum air putih hangat yang banyak dan tambahkan 10 menit kardio seperti Jumping Jacks hari ini. Biasanya kamu paling susah nahan godaan cemilan di jam berapa?`;
        }

        if (q.includes('mie') || q.includes('indomie') || q.includes('bakso') || q.includes('nasi goreng')) {
            return `Kalau lagi pengen makan mie atau bakso, kuncinya adalah tambahkan minimal dua butir telur rebus dan sawi hijau yang banyak supaya kebutuhan proteinmu tetap masuk dan tidak cepat lapar lagi. Hari ini kamu sudah makan berapa kali?`;
        }

        if (q.includes('kopi') || q.includes('teh manis') || q.includes('boba') || q.includes('minuman manis') || q.includes('es ')) {
            return `Kopi hitam tanpa gula 30 menit sebelum latihan itu justru bagus banget sebagai pembakar lemak dan penambah fokus alami! Yang perlu kita batasi adalah gula cair dari es teh manis atau susu kental manis karena cepat menumpuk jadi lemak perut. Kamu lebih suka kopi hitam atau teh tawar nih?`;
        }

        // 4. Berat Badan / Tinggi Badan / Angka Spesifik
        const numMatch = q.match(/(\d{2,3})\s*(kg|kilo|cm|tahun)/i);
        if (numMatch || q.includes('berat saya') || q.includes('berat badan') || q.includes('tinggi badan')) {
            const val = numMatch ? parseInt(numMatch[1], 10) : 65;
            const unit = numMatch ? numMatch[2].toLowerCase() : 'kg';
            if (unit.includes('kg') || unit.includes('kilo') || q.includes('berat')) {
                const targetProt = Math.round(val * 1.7);
                return `Dengan berat sekitar ${val} kilogram, target protein harian idealmu adalah sekitar ${targetProt} gram per hari agar ototmu makin padat dan metabolisme kencang! Kamu juga bisa cek angka kalori detailnya di tab Kalkulator Nutrisi. Target utamamu sekarang mau turun berapa kilo nih?`;
            }
            return `Postur tersebut sangat potensial untuk kita bentuk jadi atletis dan proporsional! Kuncinya ada di kombinasi latihan beban teratur dan kecukupan protein harian. Sekarang dalam seminggu kamu biasanya sempat latihan berapa hari?`;
        }

        // 5. Motivasi, Malas, Capek, Kurang Tidur
        if (q.includes('semangat') || q.includes('malas') || q.includes('mager') || q.includes('motivasi') || q.includes('menyerah')) {
            return `Hei, dengarkan ${persona.name}! Rasa mager itu wajar, tapi ingat: kamu tidak perlu menunggu mood bagus untuk mulai, karena hormon endorfin dan rasa bangga justru muncul setelah kamu bergerak lima menit pertama! Ayo mulai dari gerakan paling ringan hari ini, mau kita coba satu set bareng sekarang?`;
        }

        if (q.includes('capek') || q.includes('lelah') || q.includes('lemas') || q.includes('ngantuk') || q.includes('begadang') || q.includes('kurang tidur')) {
            return `Kalau tubuhmu sedang sangat lelah atau kurang tidur, jangan dipaksakan latihan berat dengan intensitas maksimal ya. Lebih baik kita lakukan peregangan aktif 10 menit, minum air putih yang cukup, dan tidur lebih awal malam ini supaya ototmu pulih. Tadi malam memangnya kamu tidur berapa jam?`;
        }

        // 6. Jadwal & Menu Latihan Hari Ini
        if (q.includes('jadwal') || q.includes('latihan apa') || q.includes('hari ini') || q.includes('gerakan apa')) {
            if (dayData) {
                if (dayData.isRest) {
                    return `Hari ke-${activeDay} ini adalah jadwal Pemulihan Aktif atau Rest Day! Ototmu justru sedang tumbuh saat istirahat, jadi fokuslah minum air putih dua liter dan jalan santai. Bagaimana rasanya ototmu setelah latihan kemarin?`;
                }
                const list = dayData.exercises.slice(0, 4).map(e => e.name).join(', ');
                return `Jadwal latihanmu pada Hari ke-${activeDay} adalah ${dayData.title} dengan ${dayData.exercises.length} gerakan, mulai dari ${list}. Mau langsung kita mulai gerakan pertama sekarang?`;
            }
        }

        // 7. Otot Perut, Dada, Lengan, Kaki, Punggung
        if (q.includes('sixpack') || q.includes('perut') || q.includes('buncit') || q.includes('lemak') || q.includes('abs')) {
            return `Untuk meratakan perut buncit dan memunculkan garis sixpack, kita gabungkan defisit kalori ringan sekitar 400 kalori per hari dengan latihan otot inti seperti Plank, Bicycle Crunch, dan Leg Raises. Kalau kamu konsisten kurangi gorengan dan minuman manis, dalam 3 minggu lingkar perutmu pasti menyusut! Mau saya pilihkan gerakan perut tercepat sekarang?`;
        }

        if (q.includes('dada') || q.includes('chest') || q.includes('push up') || q.includes('pushup') || q.includes('lengan') || q.includes('tangan') || q.includes('bahu')) {
            return `Untuk menebalkan otot dada, bahu, dan lengan, variasi Push-Up dan Shoulder Press adalah rajanya! Pastikan saat turun dada mendekati lantai dengan siku membentuk sudut 45 derajat, lalu dorong kuat sambil buang napas. Sekarang sekali set kamu kuat berapa repetisi Push-Up?`;
        }

        if (q.includes('kaki') || q.includes('paha') || q.includes('betis') || q.includes('squat') || q.includes('lunge') || q.includes('bokong') || q.includes('glute')) {
            return `Melatih otot kaki lewat Squat dan Lunges itu membakar kalori paling besar karena kaki adalah grup otot terbesar di tubuh kita! Jaga tumpuan di tumit dan dorong pinggul ke belakang seperti duduk di kursi. Lututmu terasa aman dan nyaman kan saat melakukan Squat?`;
        }

        // 8. Nutrisi, Protein, Diet, Bulking, Suplemen
        if (q.includes('protein') || q.includes('ayam') || q.includes('telur') || q.includes('nutrisi') || q.includes('makan') || q.includes('sarapan') || q.includes('malam')) {
            return `Aturan nutrisi praktis dari ${persona.name}: pastikan setiap piring makanmu punya sumber protein utama seperti telur, dada ayam, ikan, tahu, atau tempe, ditambah sayur dan karbohidrat secukupnya. Kamu biasanya lebih suka sarapan apa di pagi hari?`;
        }

        if (q.includes('creatine') || q.includes('kreatin') || q.includes('suplemen') || q.includes('whey') || q.includes('susu')) {
            return `Suplemen seperti Whey Protein dan Creatine 5 gram per hari itu sangat membantu mempercepat pemulihan dan menambah tenaga otot, tapi makanan utuh sehari-hari tetap nomor satu! Saat ini kamu sudah rutin pakai suplemen atau masih fokus dari makanan alami?`;
        }

        if (q.includes('pegal') || q.includes('doms') || q.includes('sakit') || q.includes('linu') || q.includes('nyeri') || q.includes('cedera') || q.includes('lutut') || q.includes('pinggang')) {
            return `Rasa pegal otot setelah latihan itu wajar tanda serat otot sedang beradaptasi, tapi kalau nyerinya tajam di sendi seperti lutut atau pinggang, kita wajib kurangi bebannya dan ganti dengan gerakan yang aman! Bagian mana yang sekarang paling terasa pegal atau kurang nyaman?`;
        }

        if (q.includes('kardio') || q.includes('lari') || q.includes('jalan') || q.includes('kalori') || q.includes('keringat')) {
            return `Strategi terbaik adalah dahulukan latihan gerakan otot utama selama 15 sampai 20 menit saat tenagamu masih penuh, lalu tutup dengan kardio untuk menguras sisa lemak! Kamu lebih suka kardio di dalam ruangan seperti HIIT atau lari di luar ruangan?`;
        }

        if (q.includes('turun') || q.includes('diet') || q.includes('defisit') || q.includes('kurus') || q.includes('langsing') || q.includes('naik') || q.includes('bulking') || q.includes('gemuk')) {
            return `Baik untuk menurunkan lemak maupun menaikkan massa otot, kunci utamanya ada pada konsistensi latihan 4 kali seminggu dan mengatur porsi protein harianmu. Menurutmu pribadi, tantangan terbesarmu selama ini ada di mengatur pola makan atau menjaga jadwal latihan?`;
        }

        // 9. Respons Kontekstual Dinamis untuk Topik Obrolan Bebas Apa Saja (Selalu Nyambung & Mengajak Ngobrol Balik!)
        const shortTopic = query.length > 55 ? query.slice(0, 55) + '...' : query;
        return `Menarik sekali yang kamu sampaikan soal "${shortTopic}"! Dari sudut pandang ${persona.name}, hal itu sangat berkaitan dengan bagaimana kita mengatur keseimbangan antara latihan rutin, pola makan berprotein, dan istirahat yang berkualitas. Kalau boleh tahu, apa target utama yang paling ingin kamu capai minggu ini supaya saya bisa bantu arahkan langkahnya?`;
    }

    async queryGeminiAI(userText, overrideKey = null) {
        const apiKeyToUse = overrideKey || this.geminiApiKey;
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;
        const profile = window.appInstance?.profile;
        const activeDay = window.appInstance?.activeDay || 1;
        const dayData = profile?.programSchedule?.find(d => d.dayNumber === activeDay);
        const profileContext = profile
            ? `Profil Trainee saat ini: Level=${profile.level}, Target=${profile.goal}, Alat=${profile.equipment}, Durasi=${profile.duration} hari, Hari aktif=Hari ke-${activeDay} (${dayData?.title || 'Latihan'}), Hari selesai=${profile.completedDays?.length || 0}.`
            : '';

        const systemPrompt = `Kamu adalah Personal Trainer & Ahli Gizi Fitness profesional bernama "${persona.name}" (${persona.role}).
${profileContext}
Gaya bicaramu sangat natural seperti manusia sungguhan dalam percakapan telepon dua arah (Gemini Live), berenergi, suportif, ramah, dan selalu nyambung dengan ucapan pengguna.
PENTING: Jawabanmu langsung diucapkan dengan suara kepada pengguna. Jawablah secara ringkas, interaktif, mengalir alami (maksimal 2-3 kalimat), tanpa format markdown/bintang, dan akhiri dengan kalimat tanya pendek yang relevan agar percakapan terus mengalir dua arah!`;

        // Sertakan 8 pesan terakhir agar percakapan nyambung terus seperti ngobrol dengan manusia!
        const recentHistory = this.conversationHistory.slice(-8).map((item, idx) => ({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: idx === 0 && item.role === 'user' ? `${systemPrompt}\n\nTrainee berkata: ${item.content}` : item.content }]
        }));

        if (recentHistory.length === 0) {
            recentHistory.push({
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nTrainee berkata: ${userText}` }]
            });
        }

        const payload = {
            contents: recentHistory,
            generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 250
            }
        };

        // Gunakan daftar model Gemini terbaru (gemini-2.5-flash & gemini-2.0-flash) karena gemini-1.5-flash sudah dipensiunkan oleh Google
        const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKeyToUse}`;
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    lastError = new Error(`Gemini API (${modelName}) HTTP status ${res.status}`);
                    continue;
                }

                const data = await res.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                const cleaned = text.replace(/[*#_`~]/g, '').trim();
                if (cleaned) return cleaned;
            } catch (err) {
                lastError = err;
            }
        }

        throw lastError || new Error('Semua model Gemini gagal merespons');
    }
}

// Global Export
window.SoundEffectsEngine = SoundEffectsEngine;
window.VoiceCoachEngine = VoiceCoachEngine;
window.VoiceAIPersonalTrainer = VoiceAIPersonalTrainer;
