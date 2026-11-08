/**
 * js/voice-ai.js
 * Engine Audio & Voice AI Personal Trainer Terlengkap
 * 1. Web Audio API SFX (Beep, Whistle, Fanfare, Rest chime)
 * 2. Voice Coach Real-time Guidance (3 Persona Pelatih Suara Indonesia)
 * 3. Voice-to-Voice AI Chatbot (Speech-to-Text & Instant PT Intelligence Response)
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

    // Victory Fanfare Selesai Workout
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
}

class VoiceCoachEngine {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.voices = [];
        this.enabled = true;
        this.selectedPersona = 'bima'; // 'bima' | 'maya' | 'alex'
        this.volume = 1.0;
        this.activeUtterance = null;

        this.personas = {
            bima: {
                name: 'Coach Bima',
                role: 'Energetik & Disiplin Ala Spartan',
                pitch: 0.95,
                rate: 1.06,
                tagline: 'Pantang menyerah sebelum batasmu tercapai!'
            },
            maya: {
                name: 'Coach Maya',
                role: 'Suportif & Detail Form Presisi',
                pitch: 1.15,
                rate: 0.98,
                tagline: 'Keren banget! Atur napas, kamu pasti bisa!'
            },
            alex: {
                name: 'Coach Alex',
                role: 'Fokus Mind-Muscle & Biomekanik',
                pitch: 1.0,
                rate: 1.0,
                tagline: 'Kendalikan setiap repetisi, rasakan setiap serat otot.'
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
        // Prioritas Bahasa Indonesia
        const idVoice = this.voices.find(v => v.lang && (v.lang.toLowerCase().includes('id') || v.lang.toLowerCase().includes('ind')));
        if (idVoice) return idVoice;

        // Fallback ke voice Google / Microsoft alami
        const naturalVoice = this.voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'));
        if (naturalVoice) return naturalVoice;

        return this.voices[0] || null;
    }

    speak(text, onEndCallback = null) {
        if (!this.synth || !this.enabled || !text) {
            if (onEndCallback) onEndCallback();
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

            utterance.onend = () => {
                this.activeUtterance = null;
                if (onEndCallback) onEndCallback();
            };

            utterance.onerror = (err) => {
                console.warn("TTS Speech error:", err);
                this.activeUtterance = null;
                if (onEndCallback) onEndCallback();
            };

            this.activeUtterance = utterance;
            this.synth.speak(utterance);
        } catch (e) {
            console.warn("VoiceCoach speak error:", e);
            if (onEndCallback) onEndCallback();
        }
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.activeUtterance = null;
        }
    }
}

/**
 * Voice-to-Voice AI Personal Trainer ("Tanya Coach AI")
 * Mendengarkan trainee lewat microphone & menjawab suara secara instan.
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
        this.recognition.interimResults = false;
        this.recognition.lang = 'id-ID';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.triggerStateChange('listening');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Speech input received:", transcript);
            this.handleUserInput(transcript);
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

    toggleListening(callbacks = {}) {
        this.callbacks = callbacks;
        if (!this.recognition) {
            alert("Browser Anda belum mendukung input suara Web Speech API. Silakan gunakan Google Chrome / Edge terbaru atau ketik pertanyaan langsung di kolom chat!");
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.triggerStateChange('idle');
        } else {
            try {
                this.voiceCoach.stop(); // Berhenti bicara jika sedang berbicara
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

        // Catat di history
        this.conversationHistory.push({ role: 'user', content: userText });

        try {
            let coachReply = '';

            // 1. Jika ada Gemini API Key terpasang, gunakan Gemini AI Live Ultra-Fast
            if (this.geminiApiKey) {
                coachReply = await this.queryGeminiAI(userText);
            } else {
                // 2. Gunakan Built-in High-Speed Local Expert PT Brain (< 150ms respon)
                coachReply = this.queryLocalPTBrain(userText);
            }

            this.conversationHistory.push({ role: 'assistant', content: coachReply });

            if (this.callbacks && this.callbacks.onCoachReply) {
                this.callbacks.onCoachReply(coachReply);
            }

            // Coach menjawab dengan suara secara instan!
            this.triggerStateChange('speaking');
            this.voiceCoach.speak(coachReply, () => {
                this.isProcessing = false;
                this.triggerStateChange('idle');
            });

        } catch (err) {
            console.error("AI PT Response Error:", err);
            const fallbackReply = "Maaf, Coach sempat kehilangan fokus sejenak. Tapi intinya: jaga konsistensi latihan dan pola makan bergizi setiap hari!";
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
     * Built-in Instant Fitness & Nutrition Knowledge Engine
     * Jawaban dirancang ringkas, berenergi, akurat secara sains, dan pas untuk dibacakan langsung oleh suara pelatih!
     */
    queryLocalPTBrain(query) {
        const q = query.toLowerCase();

        // 1. Sixpack / Perut Buncit / Lemak Perut
        if (q.includes('sixpack') || q.includes('perut buncit') || q.includes('lemak perut') || q.includes('abs') || q.includes('koreksi perut')) {
            return "Untuk membentuk sixpack dan hilangkan perut buncit, kuncinya ada pada kombinasi defisit kalori harian dan penguatan otot core! Kita tidak bisa membakar lemak hanya di satu titik perut (spot reduction). Tetap konsumsi cukup protein, kurangi gula cair, dan konsisten latih plank serta leg raises!";
        }

        // 2. Kebutuhan Protein & Makanan
        if (q.includes('protein') || q.includes('ayam') || q.includes('telur') || q.includes('whey') || q.includes('nutrisi') || q.includes('makan apa')) {
            return "Target ideal protein harian untuk trainee adalah sekitar 1.6 hingga 2.0 gram per kilogram berat badan. Misalnya beratmu 60 kg, targetkan 100 sampai 120 gram protein per hari dari dada ayam, telur, tempe tahu, ikan, atau whey protein agar pemulihan otot maksimal!";
        }

        // 3. Suplemen: Creatine & Kapan Minum
        if (q.includes('creatine') || q.includes('kreatin')) {
            return "Creatine monohydrate adalah suplemen nomor satu paling terbukti secara ilmiah! Minum 3 sampai 5 gram setiap hari secara konsisten, bisa dicampur air putih hangat atau jus. Waktu konsumsinya bebas, yang terpenting rutin setiap hari untuk meningkatkan tenaga dan volume otot!";
        }

        // 4. Kardio Sebelum atau Sesudah Beban?
        if (q.includes('kardio') && (q.includes('sebelum') || q.includes('sesudah') || q.includes('kapan'))) {
            return "Saran terbaik Coach: lakukan latihan beban atau kalistenik intensif terlebih dahulu saat energimu masih penuh! Baru setelah itu tutup dengan kardio ringan selama 15 hingga 20 menit untuk pembakaran lemak optimal tanpa menguras tenaga utama.";
        }

        // 5. Pegal-pegal / Sakit Setelah Latihan (DOMS)
        if (q.includes('pegal') || q.includes('doms') || q.includes('sakit badan') || q.includes('linu') || q.includes('capek')) {
            return "Rasa pegal itu namanya DOMS (Delayed Onset Muscle Soreness), tanda serat ototmu beradaptasi dengan beban baru. Sangat normal! Atasi dengan tidur 7-8 jam, minum air putih 2-3 liter, konsumsi protein, dan lakukan stretching ringan atau jalan santai untuk melancarkan sirkulasi darah.";
        }

        // 6. Push-up Belum Kuat / Pemula
        if (q.includes('push up') || q.includes('pushup') || q.includes('tangan gemetar') || q.includes('belum kuat')) {
            return "Tenang, jangan dipaksakan dulu di lantai! Mulailah dengan Incline Push-up di atas meja atau sofa yang kokoh, atau Knee Push-up dengan tumpuan lutut. Kuatkan bahu dan core-mu dulu selama 1-2 minggu, nanti otomatis push-up di lantai akan terasa jauh lebih enteng!";
        }

        // 7. Lutut Sakit / Masalah Sendi saat Squat
        if (q.includes('lutut') || q.includes('nyeri') || q.includes('sendi') || q.includes('sakit pas squat')) {
            return "Jika lutut terasa nyeri saat squat, cek apakah lututmu jatuh menekuk ke dalam atau tumitmu terangkat. Pastikan beban berada di tumit dan dorong pinggul ke belakang seperti hendak duduk di kursi. Kamu juga bisa beralih sementara ke Glute Bridge dan Wall Sit yang sangat ramah sendi!";
        }

        // 8. Turun Berat Badan / Defisit Kalori
        if (q.includes('turun berat badan') || q.includes('diet') || q.includes('defisit kalori') || q.includes('kurus')) {
            return "Hukum utama menurunkan berat badan adalah defisit kalori sekitar 300 sampai 500 kalori di bawah kebutuhan harianmu (TDEE). Perbanyak sayuran tinggi serat, penuhi protein agar massa otot tidak susut, dan kombinasikan dengan workout rutin yang ada di aplikasi ini!";
        }

        // 9. Bulking vs Naik Berat Badan / Otot
        if (q.includes('bulking') || q.includes('naikin berat badan') || q.includes('otot lebih besar') || q.includes('tambah berat')) {
            return "Untuk menaikkan massa otot yang padat (lean bulk), makanlah dalam surplus kalori ringan sekitar 300 kalori di atas TDEE dengan protein tinggi. Fokus pada progressive overload yaitu menambah repetisi atau kesulitan gerakan setiap minggu!";
        }

        // 10. Pertanyaan Default / Motivasi Umum
        const generalMotivations = [
            "Konsistensi adalah kuncinya! Jangan menunggu mood datang, mulailah bergerak hari ini dan rasakan progres fisikmu meningkat pesat!",
            "Kualitas repetisi jauh lebih penting daripada kuantitas yang terburu-buru. Rasakan kontraksi otot di setiap gerakan!",
            "Tubuh impianmu tidak dibangun dalam semalam, tapi dibangun dari keputusan kecil yang kamu ambil setiap hari di aplikasi ini. Ayo tuntaskan sesi latihanmu!"
        ];
        return generalMotivations[Math.floor(Math.random() * generalMotivations.length)];
    }

    /**
     * Integrasi Google Gemini API (Real-time Live Intelligence)
     */
    async queryGeminiAI(userText) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
        
        const systemPrompt = `Kamu adalah Personal Trainer & Ahli Gizi Gym profesional kelas dunia bernama "Coach AI". 
Gaya bicaramu sangat berenergi, tegas, suportif, ramah, dan memotivasi (bahasa Indonesia kasual tapi sopan).
PENTING: Jawabanmu akan langsung dibacakan dengan suara Text-to-Speech kepada pengguna, jadi jawab secara padat, jelas, tepat sasaran (maksimal 2-3 paragraf pendek), tanpa format markdown yang rumit seperti simbol bintang atau bullet list berlebih. Langsung sampaikan solusi praktis terbaik.`;

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
