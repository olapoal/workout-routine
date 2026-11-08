/**
 * js/voice-ai.js
 * Engine Audio & Live Voice AI Personal Trainer Terlengkap (v3.0)
 * 1. Web Audio API SFX (Beep, Whistle, Fanfare, Chime, Hype Drum)
 * 2. Real-Time Voice Coach Engine (3 Persona Pelatih + Live Equalizer & Teleprompter Sync)
 * 3. Instant PT Actions: Bakar Semangat, Briefing Latihan, Saran Gizi Harian
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

    // Alias untuk kompatibilitas onboarding
    playFanfare() {
        this.playVictory();
    }
}

class VoiceCoachEngine {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.voices = [];
        this.enabled = true;
        this.selectedPersona = 'bima'; // 'bima' | 'maya' | 'alex'
        this.volume = 1.0;
        this.activeUtterance = null;
        this.isSpeaking = false;
        this.lastSpokenText = '';

        this.personas = {
            bima: {
                name: 'Coach Bima',
                role: 'Energetik & Disiplin Ala Spartan',
                pitch: 0.94,
                rate: 1.05,
                tagline: 'Pantang menyerah sebelum batasmu tercapai! Ayo sikat habis sesi hari ini!'
            },
            maya: {
                name: 'Coach Maya',
                role: 'Suportif & Detail Form Presisi',
                pitch: 1.15,
                rate: 1.0,
                tagline: 'Keren banget! Atur napasmu, jaga postur tetap stabil, kamu pasti bisa!'
            },
            alex: {
                name: 'Coach Alex',
                role: 'Fokus Mind-Muscle & Biomekanik',
                pitch: 1.0,
                rate: 1.0,
                tagline: 'Kendalikan setiap repetisi dengan presisi, rasakan kontraksi maksimal di setiap serat otot.'
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

    getBestIndonesianVoice() {
        if (!this.voices || this.voices.length === 0) {
            this.voices = this.synth ? this.synth.getVoices() : [];
        }
        // Prioritaskan Google Bahasa Indonesia / Microsoft Gadis / Ardi Natural
        const idNatural = this.voices.find(v =>
            v.lang && (v.lang.toLowerCase().includes('id') || v.lang.toLowerCase().includes('ind')) &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))
        );
        if (idNatural) return idNatural;

        const idVoice = this.voices.find(v => v.lang && (v.lang.toLowerCase().includes('id') || v.lang.toLowerCase().includes('ind')));
        if (idVoice) return idVoice;

        const naturalVoice = this.voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'));
        if (naturalVoice) return naturalVoice;

        return this.voices[0] || null;
    }

    /**
     * Sinkronisasi status visual saat Coach sedang berbicara ke seluruh komponen UI
     */
    syncVisualSpeakingState(speaking, text = '') {
        this.isSpeaking = speaking;
        if (text) this.lastSpokenText = text;

        // 1. Animasi Soundwave Equalizer di Dashboard & Player
        document.querySelectorAll('.pt-voice-wave').forEach(el => {
            if (speaking) el.classList.add('active');
            else el.classList.remove('active');
        });

        // 2. Highlight Card Live Command PT
        document.querySelectorAll('.pt-live-command-card').forEach(el => {
            if (speaking) el.classList.add('is-speaking');
            else el.classList.remove('is-speaking');
        });

        // 3. Update Subtitle Teleprompter di Dashboard & Workout Player
        if (text) {
            const dashSub = document.getElementById('liveCoachSubtitleText');
            if (dashSub) dashSub.textContent = `"${text}"`;

            const playerSub = document.getElementById('playerCoachSpeechText');
            if (playerSub) playerSub.textContent = text;
        }
    }

    speak(text, onEndCallback = null) {
        if (!text) {
            if (onEndCallback) onEndCallback();
            return;
        }

        // Tetap update teleprompter meskipun suara sedang di-mute
        this.syncVisualSpeakingState(true, text);

        if (!this.synth || !this.enabled) {
            setTimeout(() => {
                this.syncVisualSpeakingState(false);
                if (onEndCallback) onEndCallback();
            }, 1500);
            return;
        }

        try {
            this.synth.cancel(); // Hentikan ucapan sebelumnya jika ada tumpang tindih
            
            const utterance = new SpeechSynthesisUtterance(text);
            const persona = this.personas[this.selectedPersona] || this.personas.bima;
            const voice = this.getBestIndonesianVoice();

            if (voice) {
                utterance.voice = voice;
            }
            utterance.lang = 'id-ID';
            utterance.pitch = persona.pitch;
            utterance.rate = persona.rate;
            utterance.volume = this.volume;

            utterance.onstart = () => {
                this.syncVisualSpeakingState(true, text);
            };

            utterance.onend = () => {
                this.activeUtterance = null;
                this.syncVisualSpeakingState(false);
                if (onEndCallback) onEndCallback();
            };

            utterance.onerror = () => {
                this.activeUtterance = null;
                this.syncVisualSpeakingState(false);
                if (onEndCallback) onEndCallback();
            };

            this.activeUtterance = utterance;
            this.synth.speak(utterance);
        } catch (e) {
            console.warn("VoiceCoach speak error:", e);
            this.syncVisualSpeakingState(false);
            if (onEndCallback) onEndCallback();
        }
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.activeUtterance = null;
        }
        this.syncVisualSpeakingState(false);
    }

    /**
     * FITUR PT INTERAKTIF 1: Bakar Semangat Instan (Locker-Room Pep Talk)
     */
    speakMotivationBoost(profile = null) {
        const persona = this.personas[this.selectedPersona] || this.personas.bima;
        const streak = profile?.completedDays?.length || 0;

        const speechesBima = [
            `Dengarkan saya! Rasa malas itu cuma sementara, tapi tubuh atletis dan kesehatan yang kamu bangun hari ini akan bertahan selamanya! Ayo berdiri, pasang fokusmu, kita hancurkan batas hari ini!`,
            `Ingat alasan kenapa kamu memulai program ini! Setiap tetes keringat yang jatuh hari ini adalah lemak yang terbakar dan otot yang makin tajam. Jangan kasih kendor, gas pol sekarang juga!`,
            `Sudah ${streak} hari kamu berjuang! Disiplin adalah jembatan antara target dan hasil nyata. Satu sesi lagi hari ini akan membuat dirimu di masa depan berterima kasih. Ayo mulai!`,
            `Tidak ada kata menyerah di kamus kita! Saat ototmu mulai terasa panas dan bergetar, di situlah perubahan sedang terjadi. Tarik napas dalam, kunci core-mu, dan tunjukkan mental juaramu!`
        ];

        const speechesMaya = [
            `Hai Champion! Aku tahu kadang memulai itu terasa berat, tapi percayalah, begitu kamu menyelesaikan pemanasan lima menit pertama, energimu akan langsung menyala! Aku siap memandu setiap repetisimu hari ini!`,
            `Kamu tidak sendirian! Aku ada di sini untuk memastikan setiap gerakanmu aman, presisi, dan efektif. Fokus saja pada satu gerakan ke gerakan berikutnya. Kamu jauh lebih kuat dari yang kamu kira!`,
            `Luar biasa progresmu sejauh ini! Ingat, konsistensi jauh lebih penting daripada kesempurnaan. Mari nikmati sesi hari ini dengan senyuman dan napas yang teratur!`
        ];

        const speechesAlex = [
            `Fokuskan pikiranmu! Hubungkan kesadaran otak dengan serat otot yang bekerja hari ini. Kita tidak sekadar bergerak, kita sedang memahat arsitektur tubuhmu dengan biomekanik terbaik. Mari eksekusi dengan presisi!`,
            `Konsistensi biologis tidak pernah berbohong. Setiap repetisi terkontrol yang kamu lakukan hari ini memicu sintesis protein dan metabolisme 24 jam ke depan. Siapkan posisimu!`
        ];

        let pool = speechesBima;
        if (this.selectedPersona === 'maya') pool = speechesMaya;
        if (this.selectedPersona === 'alex') pool = speechesAlex;

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

/**
 * Voice-to-Voice AI Personal Trainer ("Tanya Coach AI")
 * Mendengarkan trainee lewat microphone & menjawab suara secara instan dengan konteks profil.
 */
class VoiceAIPersonalTrainer {
    constructor(soundEngine, voiceCoach) {
        this.soundEngine = soundEngine;
        this.voiceCoach = voiceCoach;
        this.recognition = null;
        this.isListening = false;
        this.isProcessing = false;
        this.geminiApiKey = localStorage.getItem('workout_gemini_api_key') || '';
        this.conversationHistory = [];

        this.initSpeechRecognition();
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
            this.triggerStateChange('listening');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Tampilkan teks live saat trainee sedang berbicara
            const statusLabel = document.getElementById('voiceAIStatusLabel');
            if (statusLabel && interimTranscript) {
                statusLabel.innerHTML = `<span class="text-info"><i class="fas fa-wave-square me-1"></i> Mendengar: "${interimTranscript}..."</span>`;
            }

            if (finalTranscript) {
                this.handleUserInput(finalTranscript);
            }
        };

        this.recognition.onerror = (event) => {
            console.warn("Speech recognition error:", event.error);
            this.isListening = false;
            this.triggerStateChange('idle');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (!this.isProcessing) {
                this.triggerStateChange('idle');
            }
        };
    }

    toggleListening(callbacks = null) {
        if (callbacks) this.callbacks = callbacks;
        if (!this.recognition) {
            alert("Browser Anda belum mendukung input mikrofon langsung. Silakan gunakan Google Chrome / Microsoft Edge, atau ketik langsung pertanyaan Anda di kolom chat di bawah!");
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.triggerStateChange('idle');
        } else {
            try {
                this.voiceCoach.stop();
                this.soundEngine.playBeep(650, 0.08);
                this.recognition.start();
            } catch (e) {
                console.warn("Error starting mic:", e);
            }
        }
    }

    triggerStateChange(state) {
        if (this.callbacks && this.callbacks.onStateChange) {
            this.callbacks.onStateChange(state);
        }
    }

    async handleUserInput(userText) {
        if (!userText || !userText.trim()) return;
        userText = userText.trim();
        this.isProcessing = true;
        this.triggerStateChange('thinking');

        if (this.callbacks && this.callbacks.onUserMessage) {
            this.callbacks.onUserMessage(userText);
        }

        this.conversationHistory.push({ role: 'user', content: userText });

        try {
            let coachReply = '';

            if (this.geminiApiKey) {
                coachReply = await this.queryGeminiAI(userText);
            } else {
                coachReply = this.queryLocalPTBrain(userText);
            }

            this.conversationHistory.push({ role: 'assistant', content: coachReply });

            if (this.callbacks && this.callbacks.onCoachReply) {
                this.callbacks.onCoachReply(coachReply);
            }

            this.triggerStateChange('speaking');
            this.voiceCoach.speak(coachReply, () => {
                this.isProcessing = false;
                this.triggerStateChange('idle');
            });

        } catch (err) {
            console.error("AI PT Response Error:", err);
            const fallbackReply = this.queryLocalPTBrain(userText);
            if (this.callbacks && this.callbacks.onCoachReply) {
                this.callbacks.onCoachReply(fallbackReply);
            }
            this.voiceCoach.speak(fallbackReply, () => {
                this.isProcessing = false;
                this.triggerStateChange('idle');
            });
        }
    }

    /**
     * Built-in Context-Aware Expert Personal Trainer Brain
     */
    queryLocalPTBrain(query) {
        const q = query.toLowerCase();
        const profile = window.appInstance?.profile || null;
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;

        // 0. Minta Semangat / Motivasi / Malas / Capek Mental
        if (q.includes('semangat') || q.includes('malas') || q.includes('mager') || q.includes('motivasi') || q.includes('menyerah')) {
            return `Hei, dengarkan ${persona.name}! Rasa malas atau mager itu musuh terbesar setiap calon juara. Kamu tidak perlu menunggu mood bagus untuk mulai latihan, karena justru perasaan bangga dan hormon endorfin baru akan muncul setelah kamu bergerak lima menit pertama! Ayo ambil posisi sekarang, lakukan satu set saja dulu bersama saya!`;
        }

        // 1. Jadwal / Latihan Hari Ini Apa?
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

        // 2. Sixpack / Perut Buncit / Lemak Perut
        if (q.includes('sixpack') || q.includes('perut buncit') || q.includes('lemak perut') || q.includes('abs') || q.includes('buncit')) {
            return "Untuk memunculkan otot sixpack dan memangkas perut buncit, rahasia utamanya ada dua: pertama, defisit kalori harian sekitar 300 hingga 500 kalori agar lapisan lemak di atas perut menipis. Kedua, latih otot core dengan gerakan di aplikasi ini seperti Plank, Bicycle Crunch, dan Leg Raises untuk menebalkan blok otot perutmu. Kurangi minuman manis dan gorengan, hasilnya akan terlihat jelas dalam 3 sampai 4 minggu!";
        }

        // 3. Kebutuhan Protein & Menu Makan
        if (q.includes('protein') || q.includes('ayam') || q.includes('telur') || q.includes('whey') || q.includes('nutrisi') || q.includes('makan apa') || q.includes('menu')) {
            return "Target protein harian yang ideal untuk membentuk otot dan membakar lemak adalah 1,6 hingga 2 gram per kilogram berat badanmu. Sumber terbaik yang mudah didapat di Indonesia adalah dada ayam, putih dan kuning telur, ikan tuna atau kembung, tempe, tahu, serta susu tinggi protein. Bagi asupan proteinmu merata di sarapan, makan siang, dan makan malam ya!";
        }

        // 4. Suplemen: Creatine, Whey, Pre-workout
        if (q.includes('creatine') || q.includes('kreatin') || q.includes('suplemen')) {
            return "Creatine monohydrate adalah suplemen paling aman dan paling terbukti secara sains! Cukup minum 5 gram setiap hari dengan air putih untuk meningkatkan tenaga eksplosif, mempercepat pemulihan antar set, dan membuat sel otot tampak lebih penuh dan padat.";
        }

        // 5. Kardio Sebelum atau Sesudah Beban?
        if (q.includes('kardio') || q.includes('lari') || q.includes('jalan kaki')) {
            return "Strategi terbaik dari Coach: dahulukan latihan beban atau kalistenik utama saat cadangan glikogen dan tenagamu masih 100 persen penuh! Setelah sesi beban selesai, baru tutup dengan kardio seperti jalan cepat atau lari ringan 15 sampai 20 menit untuk memaksimalkan pembakaran cadangan lemak.";
        }

        // 6. Pegal-pegal / Sakit Setelah Latihan (DOMS)
        if (q.includes('pegal') || q.includes('doms') || q.includes('sakit badan') || q.includes('linu') || q.includes('nyeri otot')) {
            return "Rasa pegal 1 sampai 2 hari setelah latihan itu disebut DOMS, tanda bahwa serat ototmu sedang merespons stimulus latihan dan tumbuh lebih kuat! Jangan khawatir, tetaplah bergerak ringan, minum air putih lebih banyak, makan cukup protein, dan tidur minimal 7 jam malam ini.";
        }

        // 7. Push-up Belum Kuat / Pemula
        if (q.includes('push up') || q.includes('pushup') || q.includes('tangan gemetar') || q.includes('belum kuat')) {
            return "Sangat wajar untuk pemula! Jika push-up penuh di lantai masih berat, modifikasi dengan menaruh kedua tangan di tepi meja kokoh atau sofa (Incline Push-up), atau gunakan tumpuan lutut di matras (Knee Push-up). Jaga punggung tetap lurus, lakukan rutin, dalam dua minggu kekuatan dorong dadamu pasti meningkat drastis!";
        }

        // 8. Lutut Sakit / Masalah Sendi saat Squat atau Lunge
        if (q.includes('lutut') || q.includes('sendi') || q.includes('sakit pas squat') || q.includes('cedera')) {
            return "Keamanan sendi adalah prioritas utama! Jika lutut terasa kurang nyaman saat squat, pastikan kamu mendorong bokong ke belakang terlebih dahulu seperti hendak duduk di kursi, tumpukan berat di tumit, dan buka lutut searah ujung jari kaki. Hindari gerakan melompat sementara waktu dan ganti dengan Glute Bridge yang sangat aman bagi lutut!";
        }

        // 9. Waktu Terbaik Olahraga (Pagi / Sore / Malam)
        if (q.includes('pagi') || q.includes('malam') || q.includes('sore') || q.includes('waktu terbaik') || q.includes('jam berapa')) {
            return "Secara fisiologis, kekuatan otot dan suhu tubuh berada di puncaknya pada sore hari sekitar pukul 4 hingga 6 sore. Namun, latihan pagi hari juga luar biasa untuk mendongkrak metabolisme dan mood seharian. Jika berlatih malam hari, selesaikan minimal 1,5 jam sebelum jam tidur agar detak jantungmu sempat turun dan tidurmu tetap nyenyak!";
        }

        // 10. Pernapasan Saat Latihan
        if (q.includes('napas') || q.includes('nafas') || q.includes('ngos')) {
            return "Aturan emas pernapasan biomekanik: tarik napas lewat hidung pada fase menurunkan beban atau saat otot memanjang (fase eksentrik), dan hembuskan napas kuat lewat mulut saat kamu mendorong atau mengangkat beban (fase konsentrik). Jangan pernah menahan napas terlalu lama agar tekanan darah tetap stabil!";
        }

        // 11. Turun Berat Badan / Defisit Kalori
        if (q.includes('turun berat') || q.includes('diet') || q.includes('defisit') || q.includes('kurus') || q.includes('langsing')) {
            return "Kunci sukses menurunkan berat badan tanpa lemas adalah defisit kalori moderat sekitar 400 kalori di bawah TDEE harianmu. Gunakan tab Kalkulator Nutrisi di aplikasi ini untuk menghitung angka pastinya, perbanyak makan protein dan serat sayur agar kenyang lebih lama, serta tuntaskan jadwal latihan harianmu!";
        }

        // 12. Bulking / Menaikkan Berat Badan & Massa Otot
        if (q.includes('bulking') || q.includes('naik berat') || q.includes('gemuk') || q.includes('otot besar') || q.includes('kurus banget')) {
            return "Untuk menambah massa otot yang bersih (Lean Bulking), kamu butuh surplus sekitar 300 kalori di atas kebutuhan harianmu dan tidur yang berkualitas. Fokus pada latihan progresif: tambah jumlah repetisi atau perlambat tempo turun gerakanmu agar tegangan otot makin maksimal!";
        }

        // 13. Jawaban Kontekstual Pintar Default
        return `Pertanyaan yang bagus! Sebagai Personal Trainer-mu, ${persona.name} menyarankan tiga pilar utama untuk menjawab hal tersebut: pertama, jaga kualitas teknik dan tempo di setiap repetisi; kedua, pastikan kebutuhan protein harian serta hidrasi 2 liter air terpenuhi; dan ketiga, konsisten ikuti kurikulum latihan yang sudah kita susun. Mau kita bahas lebih spesifik soal latihan hari ini atau menu makanmu?`;
    }

    /**
     * Integrasi Google Gemini API (Real-time Live Intelligence dengan Konteks Profil)
     */
    async queryGeminiAI(userText) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
        const persona = this.voiceCoach.personas[this.voiceCoach.selectedPersona] || this.voiceCoach.personas.bima;
        const profile = window.appInstance?.profile;
        const profileContext = profile
            ? `Profil Trainee saat ini: Level=${profile.level}, Target=${profile.goal}, Alat=${profile.equipment}, Durasi=${profile.duration} hari, Hari selesai=${profile.completedDays?.length || 0}.`
            : '';

        const systemPrompt = `Kamu adalah Personal Trainer & Ahli Gizi Fitness profesional bernama "${persona.name}" (${persona.role}).
${profileContext}
Gaya bicaramu sangat berenergi, tegas, suportif, ramah, dan memotivasi seperti PT sungguhan di samping pengguna.
PENTING: Jawabanmu akan langsung dibacakan dengan suara Text-to-Speech kepada pengguna, jadi jawab secara padat, jelas, tepat sasaran (maksimal 3-5 kalimat penuh semangat), tanpa simbol bintang markdown atau bullet list. Langsung berikan jawaban dan solusi praktis terbaik.`;

        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: `${systemPrompt}\n\nPertanyaan Trainee: ${userText}` }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 250
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
