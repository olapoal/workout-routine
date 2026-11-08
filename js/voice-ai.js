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
        this.abortController = null;
        this.speakRequestId = 0;
        this.isSpeaking = false;
        this.lastSpokenText = '';

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
     */
    async speak(text, onEndCallback = null) {
        if (!text) {
            if (onEndCallback) onEndCallback();
            return;
        }

        // Hentikan audio/ucapan sebelumnya
        this.stop();

        const currentReqId = ++this.speakRequestId;
        const persona = this.personas[this.selectedPersona] || this.personas.bima;

        // Langsung tampilkan teks di Teleprompter & nyalakan equalizer
        this.syncVisualSpeakingState(true, text);

        if (!this.enabled) {
            setTimeout(() => {
                if (this.speakRequestId === currentReqId) {
                    this.syncVisualSpeakingState(false);
                    if (onEndCallback) onEndCallback();
                }
            }, 1500);
            return;
        }

        // 1. Cek apakah pengguna sudah memiliki Local Neural Voice yang cocok di browser (mis. Microsoft Edge)
        const localMatch = this.getVoiceForPersona(persona);
        const hasLocalTrueNeural = localMatch.voice && localMatch.isGenderMatched && (
            localMatch.voice.name.includes('Natural') ||
            localMatch.voice.name.includes('Neural')
        ) && localMatch.voice.name.toLowerCase().includes(persona.neuralVoice.split('-')[2].replace('Neural', '').toLowerCase());

        if (hasLocalTrueNeural) {
            this.speakWithBrowserSynthesis(text, persona, localMatch, currentReqId, onEndCallback);
            return;
        }

        // 2. Gunakan Cloud Neural Human Voice (Microsoft Ardi, Dimas, Jajang, Osman, Gadis, Siti, Tuti, Yasmin)
        try {
            this.abortController = new AbortController();
            const timeoutId = setTimeout(() => {
                if (this.abortController) this.abortController.abort();
            }, 6500);

            const audioUrl = await this.fetchCloudNeuralAudioUrl(text, persona, this.abortController.signal);
            clearTimeout(timeoutId);

            // Pastikan belum dibatalkan atau diganti kalimat baru
            if (this.speakRequestId !== currentReqId) return;

            const audio = new Audio(audioUrl);
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
                    this.syncVisualSpeakingState(false);
                    if (onEndCallback) onEndCallback();
                }
            };

            audio.onerror = () => {
                if (this.speakRequestId === currentReqId) {
                    this.activeAudio = null;
                    this.speakWithBrowserSynthesis(text, persona, localMatch, currentReqId, onEndCallback);
                }
            };

            await audio.play();
        } catch (err) {
            if (this.speakRequestId !== currentReqId) return;
            console.info("Cloud Neural TTS fallback to local synthesis:", err.message);
            this.speakWithBrowserSynthesis(text, persona, localMatch, currentReqId, onEndCallback);
        }
    }

    /**
     * Fallback ke Web Speech API Browser jika sedang Offline atau gagal koneksi
     */
    speakWithBrowserSynthesis(text, persona, localMatch, reqId, onEndCallback) {
        if (!this.synth) {
            this.syncVisualSpeakingState(false);
            if (onEndCallback) onEndCallback();
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
                    this.syncVisualSpeakingState(false);
                    if (onEndCallback) onEndCallback();
                }
            };

            utterance.onerror = () => {
                if (this.speakRequestId === reqId) {
                    this.activeUtterance = null;
                    this.syncVisualSpeakingState(false);
                    if (onEndCallback) onEndCallback();
                }
            };

            this.activeUtterance = utterance;
            this.synth.speak(utterance);
        } catch (e) {
            this.syncVisualSpeakingState(false);
            if (onEndCallback) onEndCallback();
        }
    }

    stop() {
        this.speakRequestId++;
        if (this.abortController) {
            try { this.abortController.abort(); } catch (e) {}
            this.abortController = null;
        }
        if (this.activeAudio) {
            try {
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
        this.isMutedMic = false;
        this.restartTimer = null;
        this.silenceDebounceTimer = null;
        this.accumulatedTranscript = '';
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
            return;
        }
        this.geminiApiKey = cleaned;
        localStorage.setItem('workout_gemini_api_key', cleaned);
    }

    resetToDefaultEmbeddedKey() {
        this.geminiApiKey = this.defaultEmbeddedKey;
        localStorage.removeItem('workout_gemini_api_key');
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API tidak didukung pada browser ini.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'id-ID';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.accumulatedTranscript = '';
            this.triggerStateChange('listening');
        };

        this.recognition.onresult = (event) => {
            // ANTI-ECHO GUARD: Abaikan suara jika Coach sedang berbicara atau baru saja selesai bicara (< 650ms)
            // agar suara speaker Coach tidak masuk kembali ke mikrofon!
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
            }

            const livePreview = (this.accumulatedTranscript + ' ' + interimTranscript).trim();
            const statusLabel = document.getElementById('voiceAIStatusLabel');
            if (statusLabel && livePreview) {
                statusLabel.innerHTML = `<span class="text-info fw-bold"><i class="fas fa-wave-square me-1"></i> Anda: "${livePreview}"</span>`;
            }

            // Gunakan debounce 600ms setelah kalimat final agar jika user jeda napas sejenak kalimatnya tetap utuh & nyambung!
            if (this.accumulatedTranscript) {
                clearTimeout(this.silenceDebounceTimer);
                this.silenceDebounceTimer = setTimeout(() => {
                    const readyText = this.accumulatedTranscript.trim();
                    this.accumulatedTranscript = '';
                    if (readyText.length >= 2 && !this.isProcessing) {
                        this.handleUserInput(readyText);
                    }
                }, 550);
            }
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            if (this.isLiveSessionActive && !this.isProcessing && !this.isMutedMic && !this.voiceCoach.isSpeaking) {
                if (event.error === 'no-speech' || event.error === 'network' || event.error === 'aborted') {
                    this.scheduleAutoListen(400);
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
            // Jika ada transkrip yang sudah terkumpul saat rekaman berhenti, langsung proses!
            if (this.accumulatedTranscript && this.accumulatedTranscript.trim().length >= 2 && !this.isProcessing) {
                clearTimeout(this.silenceDebounceTimer);
                const readyText = this.accumulatedTranscript.trim();
                this.accumulatedTranscript = '';
                this.handleUserInput(readyText);
                return;
            }

            // Jika sesi Gemini Live masih aktif dan Coach tidak sedang berpikir/berbicara, otomatis lanjutkan mendengarkan!
            if (this.isLiveSessionActive && !this.isProcessing && !this.voiceCoach.isSpeaking && !this.isMutedMic) {
                this.scheduleAutoListen(350);
            } else if (!this.isLiveSessionActive && !this.isProcessing) {
                this.triggerStateChange('idle');
            }
        };
    }

    scheduleAutoListen(delayMs = 450) {
        clearTimeout(this.restartTimer);
        this.restartTimer = setTimeout(() => {
            if (this.isLiveSessionActive && !this.isProcessing && !this.voiceCoach.isSpeaking && !this.isMutedMic && !this.isListening) {
                try {
                    this.recognition.start();
                } catch (e) {
                    // Sudah berjalan
                }
            }
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
            // Jika sesi Live sudah aktif dan Coach sedang berbicara, klik pada Orb berfungsi sebagai Interupsi (Potong pembicaraan Coach & langsung bicara)
            if (this.voiceCoach.isSpeaking) {
                this.voiceCoach.stop();
                this.isProcessing = false;
                this.soundEngine.playBeep(680, 0.06);
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
        this.voiceCoach.stop();
        this.soundEngine.playChime();

        this.updateLiveSessionControlsUI(true);

        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;

        // Sapaan singkat pertama saat mode Live dinyalakan, lalu otomatis membuka mikrofon!
        if (this.conversationHistory.length === 0) {
            this.triggerStateChange('speaking');
            const greeting = `Mode percakapan langsung aktif! Bersama ${persona.name} di sini. Silakan bicara langsung, apa yang ingin kita bahas hari ini?`;
            this.voiceCoach.speak(greeting, () => {
                if (this.isLiveSessionActive) {
                    this.soundEngine.playBeep(660, 0.07);
                    this.scheduleAutoListen(200);
                }
            });
        } else {
            this.scheduleAutoListen(150);
        }
    }

    stopLiveSession(farewellSpeech = null) {
        this.isLiveSessionActive = false;
        this.isListening = false;
        this.isProcessing = false;
        clearTimeout(this.restartTimer);

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
                liveBadge.innerHTML = '<i class="fas fa-circle text-danger fa-beat me-1" style="font-size: 0.55rem;"></i> GEMINI LIVE AKTIF (HANDS-FREE)';
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
                ? 'Percakapan 2 arah otomatis aktif • Anda tidak perlu klik lagi setiap selesai bicara (Ketuk Orb jika ingin memotong pembicaraan Coach)'
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
        if (this.recognition && this.isListening) {
            try { this.recognition.stop(); } catch (e) {}
        }

        this.isProcessing = true;
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

        try {
            let coachReply = '';

            // 1. Jika customer memasang Custom Google Gemini API Key pribadi (AIzaSy...), panggil Gemini API dulu
            if (!this.isUsingDefaultEmbeddedKey() && this.geminiApiKey.startsWith('AIza')) {
                try {
                    coachReply = await this.queryGeminiAI(userText);
                } catch (geminiErr) {
                    console.warn("Custom Gemini Key gagal, beralih otomatis ke Embedded Cloud AI Engine:", geminiErr);
                    coachReply = await this.queryEmbeddedCloudAI(userText);
                }
            } else {
                // 2. Gunakan Built-in Embedded Cloud AI Engine bawaan aplikasi (Otomatis nyambung untuk obrolan apa saja!)
                coachReply = await this.queryEmbeddedCloudAI(userText);
            }

            this.conversationHistory.push({ role: 'assistant', content: coachReply });

            if (this.callbacks && this.callbacks.onCoachReply) {
                this.callbacks.onCoachReply(coachReply);
            }

            this.triggerStateChange('speaking');
            this.voiceCoach.speak(coachReply, () => {
                this.isProcessing = false;
                // Pasang Anti-Echo Guard selama 750ms setelah Coach selesai berbicara agar sisa gema speaker tidak masuk ke mic!
                this.ignoreMicUntil = Date.now() + 750;

                // KUNCI GEMINI LIVE: Begitu Coach selesai berbicara, OTOMATIS kembali mendengarkan user setelah gema hilang!
                if (this.isLiveSessionActive && !this.isMutedMic) {
                    this.soundEngine.playBeep(640, 0.05);
                    this.triggerStateChange('listening');
                    this.scheduleAutoListen(700);
                } else {
                    this.triggerStateChange('idle');
                }
            });

        } catch (err) {
            console.error("AI PT Response Error:", err);
            const fallbackReply = this.queryLocalPTBrain(userText);
            if (this.callbacks && this.callbacks.onCoachReply) {
                this.callbacks.onCoachReply(fallbackReply);
            }
            this.triggerStateChange('speaking');
            this.voiceCoach.speak(fallbackReply, () => {
                this.isProcessing = false;
                this.ignoreMicUntil = Date.now() + 750;
                if (this.isLiveSessionActive && !this.isMutedMic) {
                    this.soundEngine.playBeep(640, 0.05);
                    this.triggerStateChange('listening');
                    this.scheduleAutoListen(700);
                } else {
                    this.triggerStateChange('idle');
                }
            });
        }
    }

    /**
     * Built-in Embedded Cloud AI Engine (Tanpa Perlu API Key Eksternal!)
     * Memahami konteks obrolan multi-turn, profil trainee, dan jadwal latihan hari ini sehingga jawaban selalu 100% nyambung!
     */
    async queryEmbeddedCloudAI(userText) {
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;
        const profile = window.appInstance?.profile;
        const activeDay = window.appInstance?.activeDay || 1;
        const dayData = profile?.programSchedule?.find(d => d.dayNumber === activeDay);

        const profileContext = profile
            ? `Profil Trainee: Level=${profile.level}, Target=${profile.goal}, Alat=${profile.equipment}, Durasi Program=${profile.duration} hari, Hari yang sedang dibuka=Hari ke-${activeDay} (${dayData?.title || 'Latihan Rutin'}).`
            : 'Trainee sedang menggunakan aplikasi Pulse Fit Personal Trainer.';

        const systemInstruction =
            `Kamu adalah ${persona.name}, seorang Personal Trainer & Ahli Nutrisi Fitness profesional di Indonesia (${persona.role}). ` +
            `${profileContext} ` +
            `ATURAN PENTING: ` +
            `1. Kamu sedang mengobrol suara langsung dua arah (Live Voice Call) dengan trainee. ` +
            `2. Jawablah PERSIS apa yang ditanyakan atau diceritakan oleh trainee secara nyambung, akrab, solutif, dan natural menggunakan Bahasa Indonesia yang baik dan enak didengar (bukan terjemahan kaku). ` +
            `3. Buat jawabanmu ringkas dan padat (maksimal 2 sampai 3 kalimat saja) agar nyaman didengarkan lewat suara, tanpa simbol bintang markdown atau penomoran. ` +
            `4. Akhiri dengan pertanyaan pendek yang relevan agar obrolan terus mengalir dua arah!`;

        const messages = [
            { role: 'system', content: systemInstruction },
            ...this.conversationHistory.slice(-8)
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7500);

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

        if (!res.ok) {
            throw new Error(`Embedded Cloud AI HTTP ${res.status}`);
        }

        const data = await res.json();
        const replyText = data.choices?.[0]?.message?.content || '';
        const cleaned = replyText.replace(/[*#_`~]/g, '').trim();
        if (!cleaned) throw new Error('Empty reply from Embedded Cloud AI');
        return cleaned;
    }

    queryLocalPTBrain(query) {
        const q = query.toLowerCase();
        const profile = window.appInstance?.profile || null;
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;

        if (q.includes('semangat') || q.includes('malas') || q.includes('mager') || q.includes('motivasi') || q.includes('menyerah')) {
            return `Hei, dengarkan ${persona.name}! Rasa malas atau mager itu musuh terbesar setiap calon juara. Kamu tidak perlu menunggu mood bagus untuk mulai latihan, karena justru perasaan bangga dan hormon endorfin baru akan muncul setelah kamu bergerak lima menit pertama! Ayo ambil posisi sekarang, lakukan satu set saja dulu bersama saya!`;
        }

        if (q.includes('jadwal hari ini') || q.includes('latihan apa hari ini') || q.includes('menu latihan')) {
            const activeDay = window.appInstance?.activeDay || 1;
            const dayData = profile?.programSchedule?.find(d => d.dayNumber === activeDay);
            if (dayData) {
                if (dayData.isRest) {
                    return `Hari ke-${activeDay} adalah jadwal Rest and Active Recovery! Tubuhmu sedang memulihkan jaringan otot. Fokus minum air putih 2 liter dan peregangan santai ya!`;
                }
                const list = dayData.exercises.map(e => e.name).join(', ');
                return `Jadwal latihanmu pada Hari ke-${activeDay} adalah ${dayData.title}. Kita akan melatih ${dayData.exercises.length} gerakan yaitu: ${list}. Siap kita mulai sekarang?`;
            }
        }

        if (q.includes('sixpack') || q.includes('perut buncit') || q.includes('lemak perut') || q.includes('abs') || q.includes('buncit')) {
            return "Untuk memunculkan otot sixpack dan memangkas perut buncit, rahasia utamanya ada dua: pertama, defisit kalori harian sekitar 300 hingga 500 kalori agar lapisan lemak di atas perut menipis. Kedua, latih otot core dengan gerakan di aplikasi ini seperti Plank, Bicycle Crunch, dan Leg Raises untuk menebalkan blok otot perutmu. Kurangi minuman manis dan gorengan, hasilnya akan terlihat jelas dalam 3 sampai 4 minggu!";
        }

        if (q.includes('protein') || q.includes('ayam') || q.includes('telur') || q.includes('whey') || q.includes('nutrisi') || q.includes('makan apa') || q.includes('menu')) {
            return "Target protein harian yang ideal untuk membentuk otot dan membakar lemak adalah 1,6 hingga 2 gram per kilogram berat badanmu. Sumber terbaik yang mudah didapat di Indonesia adalah dada ayam, putih dan kuning telur, ikan tuna atau kembung, tempe, tahu, serta susu tinggi protein. Bagi asupan proteinmu merata di sarapan, makan siang, dan makan malam ya!";
        }

        if (q.includes('creatine') || q.includes('kreatin') || q.includes('suplemen')) {
            return "Creatine monohydrate adalah suplemen paling aman dan paling terbukti secara sains! Cukup minum 5 gram setiap hari dengan air putih untuk meningkatkan tenaga eksplosif, mempercepat pemulihan antar set, dan membuat sel otot tampak lebih penuh dan padat.";
        }

        if (q.includes('kardio') || q.includes('lari') || q.includes('jalan kaki')) {
            return "Strategi terbaik dari Coach: dahulukan latihan beban atau kalistenik utama saat cadangan glikogen dan tenagamu masih 100 persen penuh! Setelah sesi beban selesai, baru tutup dengan kardio seperti jalan cepat atau lari ringan 15 sampai 20 menit untuk memaksimalkan pembakaran cadangan lemak.";
        }

        if (q.includes('pegal') || q.includes('doms') || q.includes('sakit badan') || q.includes('linu') || q.includes('nyeri otot')) {
            return "Rasa pegal 1 sampai 2 hari setelah latihan itu disebut DOMS, tanda bahwa serat ototmu sedang merespons stimulus latihan dan tumbuh lebih kuat! Jangan khawatir, tetaplah bergerak ringan, minum air putih lebih banyak, makan cukup protein, dan tidur minimal 7 jam malam ini.";
        }

        if (q.includes('push up') || q.includes('pushup') || q.includes('tangan gemetar') || q.includes('belum kuat')) {
            return "Sangat wajar untuk pemula! Jika push-up penuh di lantai masih berat, modifikasi dengan menaruh kedua tangan di tepi meja kokoh atau sofa (Incline Push-up), atau gunakan tumpuan lutut di matras (Knee Push-up). Jaga punggung tetap lurus, lakukan rutin, dalam dua minggu kekuatan dorong dadamu pasti meningkat drastis!";
        }

        if (q.includes('lutut') || q.includes('sendi') || q.includes('sakit pas squat') || q.includes('cedera')) {
            return "Keamanan sendi adalah prioritas utama! Jika lutut terasa kurang nyaman saat squat, pastikan kamu mendorong bokong ke belakang terlebih dahulu seperti hendak duduk di kursi, tumpukan berat di tumit, dan buka lutut searah ujung jari kaki. Hindari gerakan melompat sementara waktu dan ganti dengan Glute Bridge yang sangat aman bagi lutut!";
        }

        if (q.includes('pagi') || q.includes('malam') || q.includes('sore') || q.includes('waktu terbaik') || q.includes('jam berapa')) {
            return "Secara fisiologis, kekuatan otot dan suhu tubuh berada di puncaknya pada sore hari sekitar pukul 4 hingga 6 sore. Namun, latihan pagi hari juga luar biasa untuk mendongkrak metabolisme dan mood seharian. Jika berlatih malam hari, selesaikan minimal 1,5 jam sebelum jam tidur agar detak jantungmu sempat turun dan tidurmu tetap nyenyak!";
        }

        if (q.includes('napas') || q.includes('nafas') || q.includes('ngos')) {
            return "Aturan emas pernapasan biomekanik: tarik napas lewat hidung pada fase menurunkan beban atau saat otot memanjang (fase eksentrik), dan hembuskan napas kuat lewat mulut saat kamu mendorong atau mengangkat beban (fase konsentrik). Jangan pernah menahan napas terlalu lama agar tekanan darah tetap stabil!";
        }

        if (q.includes('turun berat') || q.includes('diet') || q.includes('defisit') || q.includes('kurus') || q.includes('langsing')) {
            return "Kunci sukses menurunkan berat badan tanpa lemas adalah defisit kalori moderat sekitar 400 kalori di bawah TDEE harianmu. Gunakan tab Kalkulator Nutrisi di aplikasi ini untuk menghitung angka pastinya, perbanyak makan protein dan serat sayur agar kenyang lebih lama, serta tuntaskan jadwal latihan harianmu!";
        }

        if (q.includes('bulking') || q.includes('naik berat') || q.includes('gemuk') || q.includes('otot besar') || q.includes('kurus banget')) {
            return "Untuk menambah massa otot yang bersih (Lean Bulking), kamu butuh surplus sekitar 300 kalori di atas kebutuhan harianmu dan tidur yang berkualitas. Fokus pada latihan progresif: tambah jumlah repetisi atau perlambat tempo turun gerakanmu agar tegangan otot makin maksimal!";
        }

        return `Pertanyaan yang bagus! Sebagai Personal Trainer-mu, ${persona.name} menyarankan tiga pilar utama untuk menjawab hal tersebut: pertama, jaga kualitas teknik dan tempo di setiap repetisi; kedua, pastikan kebutuhan protein harian serta hidrasi 2 liter air terpenuhi; dan ketiga, konsisten ikuti kurikulum latihan yang sudah kita susun. Mau kita bahas lebih spesifik soal latihan hari ini atau menu makanmu?`;
    }

    async queryGeminiAI(userText) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;
        const profile = window.appInstance?.profile;
        const profileContext = profile
            ? `Profil Trainee saat ini: Level=${profile.level}, Target=${profile.goal}, Alat=${profile.equipment}, Durasi=${profile.duration} hari, Hari selesai=${profile.completedDays?.length || 0}.`
            : '';

        const systemPrompt = `Kamu adalah Personal Trainer & Ahli Gizi Fitness profesional bernama "${persona.name}" (${persona.role}).
${profileContext}
Gaya bicaramu sangat natural seperti manusia sungguhan dalam percakapan telepon dua arah (Gemini Live), berenergi, suportif, ramah, dan memotivasi.
PENTING: Jawabanmu langsung diucapkan dengan suara kepada pengguna. Jawablah secara ringkas, interaktif, mengalir alami (maksimal 2-4 kalimat), tanpa format markdown/bintang, dan akhiri dengan kalimat tanya pendek yang relevan agar percakapan terus mengalir dua arah!`;

        // Sertakan 6 pesan terakhir agar percakapan nyambung terus seperti ngobrol dengan manusia!
        const recentHistory = this.conversationHistory.slice(-6).map((item, idx) => ({
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
                maxOutputTokens: 220
            }
        };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Gemini API HTTP status ${res.status}`);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return text.replace(/[*#_`]/g, '').trim();
    }
}

// Global Export
window.SoundEffectsEngine = SoundEffectsEngine;
window.VoiceCoachEngine = VoiceCoachEngine;
window.VoiceAIPersonalTrainer = VoiceAIPersonalTrainer;
