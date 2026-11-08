/**
 * js/exercises.js
 * Database Gerakan Latihan (Exercise Library) Terlengkap
 * Dilengkapi visual animasi SVG interaktif, target otot, panduan napas, kesalahan umum, dan audio voice cues.
 */

const EXERCISE_DATABASE = {
    // === DADA & TRICEPS (CHEST & TRICEPS) ===
    'pushups': {
        id: 'pushups',
        name: 'Push-up Standar',
        englishName: 'Standard Push-up',
        category: 'chest',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Dada (Pectoralis Major)'],
            secondary: ['Triceps', 'Bahu Depan (Anterior Deltoid)', 'Core']
        },
        caloriesPerMin: 9.5,
        defaultDuration: 40,
        defaultReps: 12,
        tempo: '2s turun, 1s tahan di bawah, 1s dorong naik',
        difficulty: 2,
        steps: [
            'Posisikan tangan sedikit lebih lebar dari bahu, telapak tangan menapak kuat di lantai.',
            'Luruskan kaki ke belakang dengan tumpuan pada ujung jari kaki, tubuh membentuk satu garis lurus sempurna dari kepala hingga tumit.',
            'Tarik napas sambil menurunkan dada ke arah lantai hingga siku membentuk sudut sekitar 45-60 derajat (bukan 90 derajat membentang).',
            'Hembuskan napas kuat saat mendorong lantai ke bawah untuk kembali ke posisi awal.',
            'Kencangkan otot dada dan pertahankan stabilitas core selama seluruh repetisi.'
        ],
        breathing: 'Tarik napas saat menurunkan tubuh, hembuskan napas kuat melalui mulut saat mendorong naik.',
        commonMistakes: [
            'Pinggul melorot ke bawah (menyebabkan tekanan berlebih pada punggung bawah)',
            'Bokong terlalu menungging tinggi ke atas',
            'Siku membuka keluar terlalu lebar 90 derajat sejajar bahu (risiko cedera rotator cuff)',
            'Kepala mendongak atau tertunduk berlebihan'
        ],
        voiceCues: {
            start: 'Mulai push-up! Jaga tubuh lurus seperti papan kayu, rasakan dorongan kuat dari dada!',
            halfway: 'Setengah waktu terlewati! Pertahankan ritme, jangan biarkan pinggulmu melorot!',
            almostDone: '10 detik terakhir! Tahan, dorong dengan seluruh kekuatanmu!',
            tip: 'Kunci otot perut dan remas bokong untuk menjaga tulang belakang tetap netral.'
        },
        svgType: 'pushup'
    },

    'diamond_pushup': {
        id: 'diamond_pushup',
        name: 'Diamond Push-up',
        englishName: 'Diamond / Close-Grip Push-up',
        category: 'chest',
        equipment: 'none',
        level: 'intermediate',
        targetMuscles: {
            primary: ['Triceps', 'Dada Bagian Dalam'],
            secondary: ['Bahu Depan', 'Core']
        },
        caloriesPerMin: 10.2,
        defaultDuration: 35,
        defaultReps: 10,
        tempo: '2s turun, 1s dorong eksplosif',
        difficulty: 4,
        steps: [
            'Letakkan kedua tangan di lantai tepat di bawah dada dengan ibu jari dan jari telunjuk saling bersentuhan membentuk segitiga atau berlian.',
            'Rentangkan kaki ke belakang lurus, aktifkan otot perut dan gluteus.',
            'Turunkan tubuh secara terkontrol hingga dada hampir menyentuh tangan.',
            'Dorong kembali ke atas menggunakan kekuatan triceps dan kontraksikan lengan bagian belakang.'
        ],
        breathing: 'Tarik napas perlahan saat menurunkan dada ke bentuk diamond, buang napas bertenaga saat mendorong naik.',
        commonMistakes: [
            'Membiarkan pergelangan tangan terpelintir tidak nyaman (sesuaikan sedikit jarak jika perlu)',
            'Bahu terangkat mendekati telinga',
            'Pinggul amblas ke lantai'
        ],
        voiceCues: {
            start: 'Diamond push-up! Fokuskan beban di triceps dan dada bagian dalam, lakukan dengan presisi!',
            halfway: 'Luar biasa! Otot lengan belakangmu sedang dibentuk sekarang, jangan menyerah!',
            almostDone: '5 detik lagi! Rasakan panas di tricepsmu, selesaikan dengan kuat!',
            tip: 'Jika terlalu berat, kamu bisa menurunkan kedua lutut ke lantai sebagai variasi regresi.'
        },
        svgType: 'pushup'
    },

    'wide_pushup': {
        id: 'wide_pushup',
        name: 'Wide Grip Push-up',
        englishName: 'Wide Push-up',
        category: 'chest',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Dada Luar (Outer Pectorals)'],
            secondary: ['Bahu Depan', 'Triceps']
        },
        caloriesPerMin: 9.0,
        defaultDuration: 40,
        defaultReps: 12,
        tempo: '2s turun, 1s dorong',
        difficulty: 2,
        steps: [
            'Buka telapak tangan lebih lebar dari bahu (kira-kira 1.5 kali lebar bahu).',
            'Turunkan dada ke lantai secara perlahan, rasakan regangan maksimal pada otot dada.',
            'Dorong kembali ke posisi atas sambil mengkontraksikan otot dada bagian luar.'
        ],
        breathing: 'Tarik napas saat dada meregang ke bawah, buang napas saat memeras dada ke atas.',
        commonMistakes: ['Rentang gerak terlalu pendek (half reps)', 'Punggung bungkuk'],
        voiceCues: {
            start: 'Wide push-up! Lebarkan rentang tangan, rasakan dada meregang penuh!',
            halfway: 'Mantap! Pertahankan rentang gerak penuh, turun sampai dada mendekati lantai!',
            almostDone: '10 detik lagi! Sedikit lagi, kamu lebih kuat dari rasa lelahmu!',
            tip: 'Fokus pada mind-muscle connection ke otot dada saat mendorong.'
        },
        svgType: 'pushup'
    },

    'incline_pushup': {
        id: 'incline_pushup',
        name: 'Incline Push-up (Tangan di Kursi/Meja)',
        englishName: 'Incline Push-up',
        category: 'chest',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Dada Bawah', 'Dada Tengah'],
            secondary: ['Triceps', 'Bahu Depan']
        },
        caloriesPerMin: 7.5,
        defaultDuration: 45,
        defaultReps: 15,
        tempo: '2s turun, 1s dorong',
        difficulty: 1,
        steps: [
            'Letakkan kedua tangan di atas permukaan yang lebih tinggi (sofa, kursi kokoh, atau bangku).',
            'Posisikan kaki lurus ke belakang, tubuh dalam posisi miring yang stabil.',
            'Turunkan dada mendekati tepi bangku, lalu dorong kembali ke posisi awal.'
        ],
        breathing: 'Inhale saat menurunkan dada, exhale saat mendorong tubuh menjauh dari bangku.',
        commonMistakes: ['Menggunakan permukaan yang licin atau tidak kokoh', 'Leher tegang'],
        voiceCues: {
            start: 'Incline push-up! Gerakan sempurna untuk mengasah teknik dan ketahanan otot dada!',
            halfway: 'Bagus sekali! Ritme kamu sangat stabil, teruskan!',
            almostDone: 'Tinggal beberapa repetisi lagi, selesaikan dengan postur terbaik!',
            tip: 'Cocok sekali untuk pemula sebelum melangkah ke push-up lantai standar.'
        },
        svgType: 'pushup'
    },

    // === PERUT & SIXPACK (ABS & CORE) ===
    'crunches': {
        id: 'crunches',
        name: 'Abdominal Crunches',
        englishName: 'Classic Abdominal Crunches',
        category: 'abs',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Perut Bagian Atas (Rectus Abdominis)'],
            secondary: ['Obliques (Perut Samping)']
        },
        caloriesPerMin: 8.0,
        defaultDuration: 40,
        defaultReps: 15,
        tempo: '1s angkat dan peras perut, 2s turun perlahan',
        difficulty: 2,
        steps: [
            'Berbaring telentang di matras dengan lutut ditekuk dan telapak kaki menapak rata di lantai.',
            'Letakkan ujung jari di belakang kepala atau silangkan kedua tangan di depan dada (jangan menarik leher).',
            'Kontraksikan otot perut untuk mengangkat bahu dan punggung atas sekitar 8-10 cm dari lantai.',
            'Tahan kontraksi di puncak selama 1 detik sambil meremas otot sixpack.',
            'Turunkan tubuh kembali secara perlahan ke lantai.'
        ],
        breathing: 'Buang napas saat mengangkat tubuh ke atas dan meremas perut, tarik napas saat menurunkan punggung.',
        commonMistakes: [
            'Menarik leher atau kepala dengan tangan (berisiko cedera leher)',
            'Menggunakan momentum ayunan tubuh alih-alih kekuatan otot perut',
            'Punggung bawah terangkat dari lantai'
        ],
        voiceCues: {
            start: 'Mulai crunches! Angkat tulang belikat dari lantai, jangan tarik lehermu!',
            halfway: 'Remas otot perut di puncak gerakan! Tahan 1 detik dan rasakan terbakar!',
            almostDone: '10 detik lagi! Otot sixpack sedang dibangun dengan setiap repetisimu!',
            tip: 'Arahkan pandangan ke atas langit-langit untuk menjaga leher tetap santai.'
        },
        svgType: 'crunch'
    },

    'plank': {
        id: 'plank',
        name: 'Isometric Forearm Plank',
        englishName: 'Forearm Plank',
        category: 'abs',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Core Menyeluruh', 'Transverse Abdominis'],
            secondary: ['Bahu', 'Gluteus', 'Punggung Bawah']
        },
        caloriesPerMin: 8.5,
        defaultDuration: 45,
        defaultReps: 1,
        tempo: 'Tahan posisi statis tanpa goyah',
        difficulty: 2,
        steps: [
            'Posisikan lengan bawah di lantai dengan siku tepat di bawah garis bahu.',
            'Luruskan kedua kaki ke belakang, bertumpu pada ujung jari kaki selebar pinggul.',
            'Tarik pusar ke arah tulang belakang (kencangkan core), kencangkan bokong dan paha.',
            'Jaga agar tubuh membentuk garis horizontal sempurna dari kepala hingga tumit.',
            'Bernapaslah secara teratur dan tenang tanpa menahan napas.'
        ],
        breathing: 'Tarik napas dan hembuskan secara teratur, tenang, dan dalam. Jangan menahan napas!',
        commonMistakes: [
            'Pinggul melorot ke bawah sehingga membebani pinggang',
            'Bokong terlalu terangkat ke atas seperti huruf V terbalik',
            'Menahan napas hingga wajah memerah',
            'Bahu tegang mendekati telinga'
        ],
        voiceCues: {
            start: 'Posisi plank! Kunci core, kunci bokong, jadikan tubuhmu sekeras baja!',
            halfway: 'Setengah perjalanan! Napas teratur, tubuh jangan goyah, kamu bisa mengendalikannya!',
            almostDone: '10 detik terakhir! Jangan turunkan lututmu sekarang, tahan sampai detik nol!',
            tip: 'Bayangkan ada yang menarik pusarmu masuk mendekati tulang belakang.'
        },
        svgType: 'plank'
    },

    'leg_raises': {
        id: 'leg_raises',
        name: 'Lying Leg Raises (Perut Bawah)',
        englishName: 'Lying Leg Raises',
        category: 'abs',
        equipment: 'none',
        level: 'intermediate',
        targetMuscles: {
            primary: ['Perut Bagian Bawah (Lower Abs)'],
            secondary: ['Hip Flexors', 'Core']
        },
        caloriesPerMin: 8.8,
        defaultDuration: 40,
        defaultReps: 12,
        tempo: '2s angkat, 2s turun terkontrol',
        difficulty: 3,
        steps: [
            'Berbaring telentang di lantai, letakkan kedua tangan di bawah pinggul atau di samping tubuh untuk stabilitas.',
            'Rapatkan kedua kaki dan angkat perlahan hingga tegak lurus membentuk sudut 90 derajat dengan lantai.',
            'Turunkan kaki perlahan-lahan ke arah lantai tanpa membiarkan tumit menyentuh lantai.',
            'Pastikan punggung bawah selalu menempel kuat di matras sepanjang gerakan.'
        ],
        breathing: 'Hembuskan napas saat mengangkat kaki ke atas, tarik napas saat menurunkan kaki ke bawah.',
        commonMistakes: [
            'Punggung bawah melengkung terangkat dari lantai saat kaki turun',
            'Mengayunkan kaki secara terburu-buru',
            'Menjatuhkan kaki dengan hentakan'
        ],
        voiceCues: {
            start: 'Mulai leg raises! Rapatkan kaki, fokuskan energi pada otot perut bagian bawah!',
            halfway: 'Turunkan kaki perlahan, jangan sampai tumit menyentuh matras!',
            almostDone: '10 detik lagi! Jaga punggung bawah tetap menempel rata di lantai!',
            tip: 'Jika punggung bawah terasa sakit, tekuk sedikit lututmu untuk mengurangi beban.'
        },
        svgType: 'leg_raise'
    },

    'bicycle_crunches': {
        id: 'bicycle_crunches',
        name: 'Bicycle Crunches (Sixpack & Pinggang)',
        englishName: 'Bicycle Crunches',
        category: 'abs',
        equipment: 'none',
        level: 'intermediate',
        targetMuscles: {
            primary: ['Otot Obliques (Pinggang)', 'Rectus Abdominis'],
            secondary: ['Hip Flexors']
        },
        caloriesPerMin: 10.5,
        defaultDuration: 40,
        defaultReps: 20,
        tempo: '1s per putaran, kendalikan rotasi',
        difficulty: 3,
        steps: [
            'Berbaring telentang, letakkan ujung jari tangan di samping pelipis, angkat kedua kaki sehingga lutut ditekuk 90 derajat.',
            'Angkat kepala dan tulang belikat dari matras.',
            'Putar tubuh bagian atas ke kanan sambil membawa siku kiri ke arah lutut kanan yang ditekuk, sementara kaki kiri diluruskan ke depan.',
            'Lakukan sebaliknya secara bergantian seperti mengayuh sepeda dengan kontrol penuh.'
        ],
        breathing: 'Hembuskan napas setiap kali siku mendekati lutut berlawanan, tarik napas saat transisi di tengah.',
        commonMistakes: [
            'Mengayuh terlalu cepat tanpa memutar torso secara maksimal',
            'Menarik kepala atau leher dengan siku tertutup ke depan',
            'Kaki terlalu tinggi di udara'
        ],
        voiceCues: {
            start: 'Bicycle crunches! Putar bahumu menyilang, bukan hanya sikunya!',
            halfway: 'Gerakan luar biasa! Rasakan otot pinggang dan sixpack-mu terbakar!',
            almostDone: 'Tinggal beberapa kayuhan lagi! Kayuh sampai tuntas!',
            tip: 'Fokus pada rotasi bahu, bukan hanya menggerakkan siku tangan.'
        },
        svgType: 'bicycle'
    },

    'russian_twist': {
        id: 'russian_twist',
        name: 'Russian Twist (Kikis Perut Samping)',
        englishName: 'Russian Twist',
        category: 'abs',
        equipment: 'none',
        level: 'intermediate',
        targetMuscles: {
            primary: ['Obliques (Perut Samping)', 'Transverse Abdominis'],
            secondary: ['Hip Flexors', 'Erector Spinae']
        },
        caloriesPerMin: 9.8,
        defaultDuration: 40,
        defaultReps: 24,
        tempo: '1s putar kanan, 1s putar kiri',
        difficulty: 3,
        steps: [
            'Duduk di lantai dengan lutut ditekuk dan tumit menapak (atau angkat sedikit tumit untuk tantangan lebih).',
            'Condongkan punggung ke belakang sekitar 45 derajat hingga core terasa aktif.',
            'Rapatkan kedua tangan di depan dada, lalu putar tubuh bagian atas ke sisi kanan hingga tangan mendekati lantai.',
            'Putar kembali ke sisi kiri dengan gerakan memutar dari torso, bukan sekadar lengan.'
        ],
        breathing: 'Hembuskan napas setiap kali berputar ke sisi samping, tarik napas saat kembali ke tengah.',
        commonMistakes: [
            'Punggung membungkuk bulat',
            'Hanya mengayunkan tangan tanpa memutar rongga dada dan tulang belakang',
            'Kaki bergoyang tidak stabil'
        ],
        voiceCues: {
            start: 'Russian twist! Putar seluruh tubuh atas dari pinggang, kikis lemak perut samping!',
            halfway: 'Setengah jalan! Jaga postur punggung tetap tegak dan dada terbuka!',
            almostDone: '10 detik lagi! Putar kanan, putar kiri, jangan kasih kendor!',
            tip: 'Ingin tantangan ekstra? Angkat tumit kaki beberapa sentimeter dari lantai.'
        },
        svgType: 'russian_twist'
    },

    'mountain_climber': {
        id: 'mountain_climber',
        name: 'Mountain Climbers (Bakar Kalori & Core)',
        englishName: 'Mountain Climbers',
        category: 'cardio',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Core', 'Kardiovaskular (Jantung)'],
            secondary: ['Bahu', 'Paha Depan (Quadriceps)', 'Betis']
        },
        caloriesPerMin: 12.0,
        defaultDuration: 35,
        defaultReps: 30,
        tempo: 'Cepat dan dinamis dengan kontrol core',
        difficulty: 3,
        steps: [
            'Mulai dari posisi push-up atau high plank dengan tangan tepat di bawah bahu.',
            'Tarik satu lutut ke arah dada secepat mungkin tanpa menyentuh lantai.',
            'Segera kembalikan kaki ke belakang sambil menarik lutut kaki satunya ke depan secara bergantian.',
            'Jaga pinggul tetap rendah dan sejajar dengan lantai sepanjang latihan.'
        ],
        breathing: 'Bernapas ritmis mengikuti ayunan lutut, jangan menahan napas saat intensitas meningkat.',
        commonMistakes: [
            'Pinggul memantul naik turun terlalu tinggi',
            'Bahu bergeser ke belakang menjauhi garis pergelangan tangan',
            'Lutut tidak ditarik cukup dalam'
        ],
        voiceCues: {
            start: 'Mountain climbers! Pacu detak jantungmu, tarik lutut ke dada seperti mendaki gunung!',
            halfway: 'Cepat dan terkontrol! Bakar kalori dan peras otot perutmu!',
            almostDone: '10 detik terakhir! Sprint habis-habisan sampai peluit berbunyi!',
            tip: 'Pertahankan bahu tepat di atas pergelangan tangan agar tumpuan stabil.'
        },
        svgType: 'climber'
    },

    // === KAKI & BOKONG (LEGS & GLUTES) ===
    'squats': {
        id: 'squats',
        name: 'Bodyweight Squat',
        englishName: 'Bodyweight Squat',
        category: 'legs',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Paha Depan (Quadriceps)', 'Gluteus (Bokong)'],
            secondary: ['Hamstrings', 'Betis', 'Core']
        },
        caloriesPerMin: 9.0,
        defaultDuration: 45,
        defaultReps: 15,
        tempo: '2s turun ke bawah, 1s pause, 1s berdiri kuat',
        difficulty: 2,
        steps: [
            'Berdiri tegak dengan kaki dibuka selebar bahu, ujung jari kaki sedikit mengarah keluar (sekitar 15-30 derajat).',
            'Buka dada dan pandangan lurus ke depan, tangan disilangkan di dada atau diluruskan ke depan.',
            'Tarik pinggul ke belakang lalu tekuk lutut seolah-olah hendak duduk di kursi yang rendah.',
            'Turunkan tubuh hingga paha minimal sejajar dengan lantai (sudut 90 derajat atau lebih dalam).',
            'Dorong lantai melalui tumit untuk kembali berdiri tegak dan remas otot gluteus di posisi atas.'
        ],
        breathing: 'Tarik napas saat menurunkan pinggul ke bawah, buang napas kuat saat mendorong berdiri.',
        commonMistakes: [
            'Lutut jatuh menekuk ke dalam (knee valgus) saat turun atau naik',
            'Tumit terangkat dari lantai (beban berpindah ke jari kaki)',
            'Punggung membungkuk ke depan secara berlebihan',
            'Kedalaman jongkok terlalu dangkal (half squat)'
        ],
        voiceCues: {
            start: 'Mulai squat! Dorong pinggul ke belakang, turun sampai paha sejajar lantai!',
            halfway: 'Bagus sekali! Tumpukan beban di tumit, jangan biarkan lutut tertekuk ke dalam!',
            almostDone: '10 detik lagi! Setiap repetisi membuat kakimu semakin kokoh dan bertenaga!',
            tip: 'Remas bokong di posisi puncak untuk mengunci kontraksi maksimal.'
        },
        svgType: 'squat'
    },

    'lunges': {
        id: 'lunges',
        name: 'Walking / Alternating Lunges',
        englishName: 'Alternating Forward Lunges',
        category: 'legs',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Paha Depan (Quads)', 'Gluteus (Bokong)'],
            secondary: ['Hamstrings', 'Keseimbangan / Stabilizer']
        },
        caloriesPerMin: 9.2,
        defaultDuration: 40,
        defaultReps: 16,
        tempo: '2s turun, 1s kembali ke posisi awal',
        difficulty: 2,
        steps: [
            'Berdiri tegak dengan kedua kaki rapat dan tangan di pinggang.',
            'Langkahkan satu kaki ke depan cukup jauh, lalu turunkan pinggul ke bawah.',
            'Turunkan tubuh hingga kedua lutut membentuk sudut 90 derajat, lutut belakang hampir menyentuh lantai.',
            'Dorong tumit kaki depan untuk kembali ke posisi berdiri tegak.',
            'Ulangi pada kaki yang berlawanan secara bergantian.'
        ],
        breathing: 'Tarik napas saat melangkah maju dan turun, hembuskan napas saat mendorong kembali berdiri.',
        commonMistakes: [
            'Lutut depan meluncur terlalu jauh melewati ujung jari kaki',
            'Lutut belakang terbentur keras ke lantai',
            'Tubuh condong berlebihan ke samping karena kehilangan keseimbangan'
        ],
        voiceCues: {
            start: 'Langkah lunges dimulai! Jaga dada tetap tegak dan melangkah dengan mantap!',
            halfway: 'Keseimbanganmu semakin bagus! Tekuk kedua lutut hingga sudut 90 derajat!',
            almostDone: 'Selesaikan sisa repetisi! Kaki yang kuat menopang tubuh yang sehat!',
            tip: 'Kunci pandangan pada satu titik di depan agar keseimbangan tetap terjaga.'
        },
        svgType: 'lunge'
    },

    'glute_bridge': {
        id: 'glute_bridge',
        name: 'Glute Bridge (Bokong & Pinggang Sehat)',
        englishName: 'Glute Bridge',
        category: 'legs',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Gluteus Maximus (Bokong)', 'Hamstrings'],
            secondary: ['Punggung Bawah', 'Core']
        },
        caloriesPerMin: 7.0,
        defaultDuration: 40,
        defaultReps: 15,
        tempo: '2s angkat, 2s peras di atas, 2s turun',
        difficulty: 1,
        steps: [
            'Berbaring telentang dengan lutut ditekuk dan telapak kaki menapak rata selebar pinggul di lantai.',
            'Letakkan kedua tangan di samping tubuh dengan telapak menghadap ke bawah.',
            'Dorong tumit ke lantai dan angkat pinggul ke atas hingga paha, pinggul, dan dada membentuk garis lurus.',
            'Remas otot gluteus sekuat mungkin di posisi puncak selama 2 detik.',
            'Turunkan pinggul kembali secara perlahan tanpa menjatuhkannya ke lantai.'
        ],
        breathing: 'Hembuskan napas saat mendorong pinggul ke atas, tarik napas saat menurunkan pinggul.',
        commonMistakes: [
            'Mengangkat pinggul terlalu tinggi hingga punggung bawah melengkung tajam (overextending spine)',
            'Tumit bergeser terlalu jauh dari bokong',
            'Tidak meremas otot gluteus di posisi puncak'
        ],
        voiceCues: {
            start: 'Glute bridge! Dorong lewat tumit dan angkat pinggulmu tinggi ke atas!',
            halfway: 'Remas bokong di puncak gerakan! Tahan 2 detik sebelum turun perlahan!',
            almostDone: '10 detik lagi! Gerakan ini sangat ampuh menguatkan panggul dan postur tubuhmu!',
            tip: 'Pastikan dorongan berasal dari otot bokong, bukan tarikan punggung bawah.'
        },
        svgType: 'glute_bridge'
    },

    'jumping_squats': {
        id: 'jumping_squats',
        name: 'Jump Squat (Eksplosif & Bakar Lemak)',
        englishName: 'Explosive Jump Squats',
        category: 'legs',
        equipment: 'none',
        level: 'intermediate',
        targetMuscles: {
            primary: ['Quads', 'Gluteus', 'Power Eksplosif'],
            secondary: ['Betis', 'Kardiovaskular']
        },
        caloriesPerMin: 13.5,
        defaultDuration: 30,
        defaultReps: 12,
        tempo: 'Turun halus, lompat eksplosif, mendarat lembut',
        difficulty: 4,
        steps: [
            'Mulai dengan posisi squat standar dengan paha sejajar lantai.',
            'Kumpulkan tenaga lalu dorong seluruh tubuh ke atas melompat setinggi mungkin secara eksplosif.',
            'Mendarat kembali dengan lembut pada bola kaki menuju tumit sambil langsung meredamnya ke posisi squat berikutnya.'
        ],
        breathing: 'Inhale saat bersiap di posisi jongkok, exhale eksplosif saat meluncur melompat.',
        commonMistakes: [
            'Mendarat dengan lutut kaku lurus (berbahaya bagi sendi)',
            'Mendarat dengan suara keras berdentum',
            'Membungkukkan punggung saat mendarat'
        ],
        voiceCues: {
            start: 'Jump squat! Lompat eksplosif ke langit dan mendarat sehalus kucing!',
            halfway: 'Dahsyat! Ledakan energimu membakar kalori secara maksimal!',
            almostDone: '5 detik lagi! Berikan 3 lompatan terbaikmu!',
            tip: 'Redam pendaratan dengan menekuk lutut segera setelah jari kaki menyentuh lantai.'
        },
        svgType: 'squat'
    },

    // === KARDIO & FAT BURNING (CARDIO & HIIT) ===
    'jumping_jacks': {
        id: 'jumping_jacks',
        name: 'Jumping Jacks (Pemanasan & Kalori)',
        englishName: 'Jumping Jacks',
        category: 'cardio',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Sistem Kardiovaskular Menyeluruh'],
            secondary: ['Bahu', 'Betis', 'Paha Bagian Dalam & Luar']
        },
        caloriesPerMin: 11.0,
        defaultDuration: 45,
        defaultReps: 40,
        tempo: 'Irama ritmis dan bersemangat',
        difficulty: 1,
        steps: [
            'Berdiri tegak dengan kaki rapat dan lengan berada di samping tubuh.',
            'Lompat dan buka kaki selebar bahu sambil mengayunkan kedua lengan ke atas kepala hingga telapak tangan hampir bertepuk.',
            'Lompat kembali ke posisi awal dengan merapatkan kaki dan menurunkan lengan.',
            'Lakukan dengan irama yang konsisten dan lentur.'
        ],
        breathing: 'Bernapas ritmis melalui hidung dan mulut, jaga agar tidak terengah-engah.',
        commonMistakes: [
            'Mendarat dengan tumit secara keras',
            'Gerakan lengan setengah-setengah tidak sampai ke atas kepala',
            'Menahan napas'
        ],
        voiceCues: {
            start: 'Mulai jumping jacks! Ayunkan tangan ke atas, hidupkan detak jantungmu!',
            halfway: 'Ritme yang hebat! Aliran oksigen sedang menyebar ke seluruh sel tubuhmu!',
            almostDone: '10 detik lagi! Pertahankan tempo sampai detik terakhir!',
            tip: 'Mendaratlah dengan ujung telapak kaki depan agar sendi tetap nyaman.'
        },
        svgType: 'jumping_jack'
    },

    'burpees': {
        id: 'burpees',
        name: 'Full Body Burpees',
        englishName: 'Full Body Burpees',
        category: 'cardio',
        equipment: 'none',
        level: 'advanced',
        targetMuscles: {
            primary: ['Full Body Conditioning', 'Kardiovaskular'],
            secondary: ['Dada', 'Core', 'Quads', 'Bahu']
        },
        caloriesPerMin: 14.5,
        defaultDuration: 30,
        defaultReps: 10,
        tempo: 'Transisi mengalir tanpa jeda lama',
        difficulty: 5,
        steps: [
            'Berdiri tegak, lalu tekuk lutut dan letakkan kedua telapak tangan di lantai di depan kaki.',
            'Tendang kedua kaki ke belakang sekaligus ke posisi push-up.',
            'Turunkan dada ke lantai (full push-up) atau tahan dalam high plank.',
            'Dorong dada naik, lompatkan kedua kaki kembali mendekati tangan.',
            'Melompatlah tegak ke atas secara eksplosif sambil mengangkat kedua tangan di atas kepala.'
        ],
        breathing: 'Inhale saat turun, exhale saat melompat tegak ke atas.',
        commonMistakes: [
            'Pinggul melorot saat menendang kaki ke belakang',
            'Berhenti terlalu lama di bawah lantai',
            'Mendarat kaku tanpa meredam lutut'
        ],
        voiceCues: {
            start: 'Burpees! Raja pembakar lemak seluruh tubuh! Lakukan dengan mental juara!',
            halfway: 'Separuh waktu berlalu! Rasakan jantungmu memompa tenaga luar biasa!',
            almostDone: '10 detik terakhir! Jangan berhenti sekarang, lompat lebih tinggi!',
            tip: 'Kuasai ritmenya: jongkok, tendang, push-up, lompat kaki, dan loncat ke udara!'
        },
        svgType: 'burpee'
    },

    'high_knees': {
        id: 'high_knees',
        name: 'High Knees Run',
        englishName: 'High Knees',
        category: 'cardio',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Kardiovaskular', 'Hip Flexors'],
            secondary: ['Perut Bawah', 'Betis', 'Paha Depan']
        },
        caloriesPerMin: 11.5,
        defaultDuration: 35,
        defaultReps: 40,
        tempo: 'Lari di tempat berkecepatan tinggi',
        difficulty: 2,
        steps: [
            'Berdiri tegak dengan kaki dibuka selebar pinggul.',
            'Lari di tempat sambil mengangkat lutut setinggi mungkin (usahakan sejajar pinggul).',
            'Ayunkan lengan berlawanan secara aktif untuk membantu momentum.',
            'Mendaratlah dengan ringan pada bola kaki.'
        ],
        breathing: 'Atur napas ritmis, tarik napas dalam 2 langkah, buang napas dalam 2 langkah.',
        commonMistakes: ['Tubuh condong terlalu jauh ke belakang', 'Lutut hanya diangkat rendah'],
        voiceCues: {
            start: 'High knees! Angkat lutut setinggi pinggul, ayunkan tanganmu penuh tenaga!',
            halfway: 'Semangat! Jangan biarkan lututmu turun, pertahankan tingginya!',
            almostDone: 'Sprint 10 detik terakhir! Percepat langkahmu sekarang!',
            tip: 'Aktifkan otot perut bawah setiap kali lutut terangkat ke atas.'
        },
        svgType: 'climber'
    },

    // === PUNGGUNG & POSTUR (BACK & POSTURE) ===
    'superman': {
        id: 'superman',
        name: 'Superman Hold & Pulse',
        englishName: 'Superman Pose',
        category: 'back',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Punggung Bawah (Lower Back / Erector Spinae)'],
            secondary: ['Gluteus', 'Bahu Belakang', 'Hamstrings']
        },
        caloriesPerMin: 6.5,
        defaultDuration: 40,
        defaultReps: 12,
        tempo: '2s angkat, 2s tahan di atas, 2s turun',
        difficulty: 2,
        steps: [
            'Tengkurap di lantai dengan kedua lengan lurus di atas kepala dan kaki lurus ke belakang.',
            'Secara bersamaan, angkat kedua tangan, dada, dan kedua kaki beberapa inci dari lantai.',
            'Rasakan otot punggung dan bokong berkontraksi penuh menahan tubuh.',
            'Tahan posisi di atas selama 2 detik sebelum menurunkannya kembali secara perlahan.'
        ],
        breathing: 'Hembuskan napas saat mengangkat dada dan kaki, tarik napas saat menurunkan tubuh.',
        commonMistakes: [
            'Mendongakkan leher secara tajam (jaga pandangan tetap melihat ke lantai)',
            'Menggunakan hentakan tiba-tiba alih-alih otot punggung',
            'Menahan napas'
        ],
        voiceCues: {
            start: 'Superman pose! Angkat dada dan kakimu, perbaiki postur bungkukmu!',
            halfway: 'Tahan di puncak! Rasakan otot rantai belakang tubuhmu semakin kokoh!',
            almostDone: '10 detik lagi! Gerakan ini investasi terbaik untuk kesehatan tulang belakangmu!',
            tip: 'Jaga leher tetap netral sejajar dengan tulang belakang.'
        },
        svgType: 'superman'
    },

    'reverse_snow_angels': {
        id: 'reverse_snow_angels',
        name: 'Prone Cobra / Reverse Snow Angels',
        englishName: 'Prone Y-T-W / Cobra',
        category: 'back',
        equipment: 'none',
        level: 'beginner',
        targetMuscles: {
            primary: ['Otot Belikat (Rhomboids)', 'Trapezius Tengah'],
            secondary: ['Bahu Belakang (Rear Delts)', 'Erector Spinae']
        },
        caloriesPerMin: 6.0,
        defaultDuration: 40,
        defaultReps: 12,
        tempo: '2s sapuan ke atas, 2s sapuan kembali',
        difficulty: 2,
        steps: [
            'Tengkurap di matras, angkat dada sedikit dari lantai.',
            'Rentangkan tangan ke samping lalu ayunkan perlahan ke depan membentuk huruf Y, lalu kembali ke samping membentuk huruf T.',
            'Jepit kedua tulang belikat bersamaan di setiap sapuan.'
        ],
        breathing: 'Tarik napas saat tangan menyapu ke depan, buang napas saat menarik belikat ke belakang.',
        commonMistakes: ['Bahu terangkat ke telinga', 'Tangan menyentuh lantai'],
        voiceCues: {
            start: 'Mulai reverse snow angels! Jepit tulang belikatmu, tegakkan postur tubuhmu!',
            halfway: 'Hebat sekali! Rasakan otot punggung atasmu bekerja mengikis kebiasaan bungkuk!',
            almostDone: 'Selesaikan beberapa putaran lagi dengan jepitan belikat yang mantap!',
            tip: 'Tarik bahu menjauh dari telinga agar leher tidak kaku.'
        },
        svgType: 'superman'
    },

    // === LATIHAN DUMBBELL (HOME DUMBBELL & GYM) ===
    'dumbbell_goblet_squat': {
        id: 'dumbbell_goblet_squat',
        name: 'Dumbbell Goblet Squat',
        englishName: 'Goblet Squat',
        category: 'legs',
        equipment: 'dumbbell',
        level: 'intermediate',
        targetMuscles: {
            primary: ['Quadriceps', 'Gluteus'],
            secondary: ['Core', 'Upper Back']
        },
        caloriesPerMin: 10.5,
        defaultDuration: 40,
        defaultReps: 12,
        tempo: '2s turun dalam, 1s tahan, 1s dorong naik',
        difficulty: 3,
        steps: [
            'Pegang satu dumbbell secara vertikal di depan dada dengan kedua tangan menopang kepala dumbbell.',
            'Buka kaki selebar bahu, busungkan dada dan kunci otot core.',
            'Turunkan pinggul ke bawah dalam squat hingga siku menyentuh atau berada di antara bagian dalam lutut.',
            'Dorong melalui tumit untuk kembali berdiri tegak.'
        ],
        breathing: 'Inhale saat menurunkan beban ke bawah, exhale bertenaga saat mendorong naik.',
        commonMistakes: ['Beban menarik dada condong ke depan', 'Siku membuka terlalu lebar ke samping'],
        voiceCues: {
            start: 'Goblet squat! Dekapkan dumbbell dekat ke dadamu, turun sedalam mungkin dengan punggung tegak!',
            halfway: 'Mantap! Rasakan paha dan bokongmu bekerja menahan beban!',
            almostDone: '3 repetisi terakhir! Dorong lantai kuat-kuat lewat tumitmu!',
            tip: 'Dekatkan beban ke dada agar pusat gravitasi tetap seimbang.'
        },
        svgType: 'squat'
    },

    'dumbbell_shoulder_press': {
        id: 'dumbbell_shoulder_press',
        name: 'Dumbbell Overhead Shoulder Press',
        englishName: 'Overhead Shoulder Press',
        category: 'shoulders',
        equipment: 'dumbbell',
        level: 'intermediate',
        targetMuscles: {
            primary: ['Bahu Depan & Samping (Deltoids)'],
            secondary: ['Triceps', 'Upper Traps', 'Core']
        },
        caloriesPerMin: 8.5,
        defaultDuration: 40,
        defaultReps: 10,
        tempo: '1s dorong ke atas, 2s turun terkontrol',
        difficulty: 3,
        steps: [
            'Berdiri atau duduk tegak dengan memegang sepasang dumbbell setinggi telinga, siku ditekuk 90 derajat.',
            'Kencangkan otot perut dan dorong kedua dumbbell lurus ke atas hingga lengan hampir lurus di atas kepala.',
            'Turunkan kembali dumbbell secara terkontrol ke posisi setinggi telinga.'
        ],
        breathing: 'Exhale saat mendorong dumbbell ke atas kepala, inhale saat menurunkannya perlahan.',
        commonMistakes: ['Punggung bawah melengkung melenting ke belakang', 'Membanting beban saat turun'],
        voiceCues: {
            start: 'Overhead shoulder press! Dorong beban ke atas, bentuk bahu tegap dan bidang!',
            halfway: 'Kunci core tubuhmu! Jangan biarkan pinggangmu melengkung ke belakang!',
            almostDone: 'Repetisi terakhir! Dorong sampai puncak dan kunci sejenak!',
            tip: 'Jaga siku sedikit di depan garis tubuh (sudut 30 derajat pada scapular plane).'
        },
        svgType: 'shoulder_press'
    },

    'dumbbell_bent_over_row': {
        id: 'dumbbell_bent_over_row',
        name: 'Dumbbell Bent-Over Row (Punggung Tebal)',
        englishName: 'Dumbbell Bent-Over Row',
        category: 'back',
        equipment: 'dumbbell',
        level: 'intermediate',
        targetMuscles: {
            primary: ['Sayap Punggung (Latissimus Dorsi)', 'Rhomboids'],
            secondary: ['Biceps', 'Bahu Belakang', 'Erector Spinae']
        },
        caloriesPerMin: 9.0,
        defaultDuration: 40,
        defaultReps: 12,
        tempo: '1s tarik ke pinggang, 1s remas belikat, 2s turun',
        difficulty: 3,
        steps: [
            'Pegang sepasang dumbbell, tekuk sedikit lutut dan condongkan pinggul ke belakang dengan punggung lurus mendatar.',
            'Biarkan dumbbell menggantung di bawah bahu dengan telapak tangan saling berhadapan.',
            'Tarik siku ke belakang mengarah ke pinggang sambil meremas otot belikat bersamaan.',
            'Turunkan dumbbell kembali ke posisi awal secara perlahan dan rasakan peregangan sayap punggung.'
        ],
        breathing: 'Hembuskan napas saat menarik siku ke pinggang, tarik napas saat menurunkan dumbbell.',
        commonMistakes: ['Punggung melengkung membungkuk', 'Menarik beban menggunakan momentum ayunan tubuh'],
        voiceCues: {
            start: 'Bent-over row! Tarik siku ke arah pinggang, bentuk punggung V-taper yang atletis!',
            halfway: 'Remas belikat di posisi puncak! Rasakan otot sayap punggungmu terisi darah!',
            almostDone: '10 detik lagi! Tarik dengan siku, bukan hanya dengan telapak tangan!',
            tip: 'Bayangkan kamu sedang menjepit pensil di antara kedua tulang belikatmu.'
        },
        svgType: 'bent_row'
    },

    'dumbbell_bicep_curl': {
        id: 'dumbbell_bicep_curl',
        name: 'Dumbbell Bicep Curls',
        englishName: 'Standing Bicep Curls',
        category: 'arms',
        equipment: 'dumbbell',
        level: 'beginner',
        targetMuscles: {
            primary: ['Biceps Brachii'],
            secondary: ['Brachialis', 'Lengan Bawah (Forearms)']
        },
        caloriesPerMin: 7.5,
        defaultDuration: 40,
        defaultReps: 12,
        tempo: '1s angkat, 1s remas di puncak, 2s turun negatif',
        difficulty: 2,
        steps: [
            'Berdiri tegak dengan memegang dumbbell di masing-masing tangan di samping paha.',
            'Jaga siku tetap menempel di samping tubuh tanpa bergerak maju-mundur.',
            'Tekuk siku dan angkat beban ke arah bahu sambil memutar telapak tangan menghadap ke atas.',
            'Remas otot bicep di puncak gerakan lalu turunkan beban secara perlahan menahan gravitasi.'
        ],
        breathing: 'Exhale saat mengangkat dumbbell ke atas, inhale saat menurunkan beban.',
        commonMistakes: ['Mengayunkan tubuh ke depan-belakang (cheating)', 'Siku meluncur ke depan'],
        voiceCues: {
            start: 'Bicep curls! Kunci siku di sisi tubuh, jangan ayunkan pinggangmu!',
            halfway: 'Remas bicep di puncak! Fase penurunan yang lambat adalah kunci hipertrofi otot!',
            almostDone: '3 repetisi lagi! Rasakan sensasi pump maksimal di lengan depanmu!',
            tip: 'Turunkan beban selama 2-3 detik penuh untuk merangsang serat otot maksimal.'
        },
        svgType: 'bicep_curl'
    }
};

/**
 * ============================================================================
 * BIOMECHANICAL KINEMATIC ENGINE 2.0 (60 FPS ARTICULATED ANATOMICAL RENDERER)
 * ============================================================================
 * Merender atlet anatomis multi-sendi (kepala, leher, dada, core sixpack,
 * pelvis, paha quadriceps, betis, sepatu atletik, lengan bicep/tricep, dumbbell)
 * lengkap dengan Thermal Muscle Heatmap, Busur Derajat Sendi, & Panduan Napas.
 */

const BIOMECH_EXERCISE_META = {
    pushup: {
        title: 'PUSH-UP BIOMECHANICS',
        primaryLabel: 'Pectorals • Anterior Deltoid • Triceps',
        jointLabel: 'SIKU',
        tempoSec: 3.0,
        eccentricText: 'TURUN — TARIK NAPAS',
        concentricText: 'DORONG KUAT — BUANG NAPAS'
    },
    squat: {
        title: 'SQUAT 90° PARALLEL DEPTH',
        primaryLabel: 'Quadriceps • Gluteus Maximus • Core',
        jointLabel: 'LUTUT',
        tempoSec: 3.2,
        eccentricText: 'DUDUK TURUN — TARIK NAPAS',
        concentricText: 'DORONG TUMIT — BUANG NAPAS'
    },
    plank: {
        title: 'ISOMETRIC CORE LOCK 180°',
        primaryLabel: 'Transverse Abdominis • Rectus Abdominis • Delts',
        jointLabel: 'SPINE',
        tempoSec: 2.8,
        eccentricText: 'KUNCI PERUT — TARIK NAPAS TENANG',
        concentricText: 'TAHAN STABIL — HEMBUSKAN TERATUR'
    },
    crunch: {
        title: 'SPINAL FLEXION AB CRUNCH',
        primaryLabel: 'Upper Rectus Abdominis (Sixpack)',
        jointLabel: 'FLEKSI',
        tempoSec: 2.6,
        eccentricText: 'TURUN KONTROL — TARIK NAPAS',
        concentricText: 'ANGKAT BAHU — BUANG NAPAS'
    },
    bicycle: {
        title: 'BICYCLE CRUNCH ROTATION',
        primaryLabel: 'Obliques • Rectus Abdominis • Hip Flexors',
        jointLabel: 'ROTASI',
        tempoSec: 1.8,
        eccentricText: 'KAYUH BERGANTIAN — RITME STABIL',
        concentricText: 'SENTUH SIKU KE LUTUT — BUANG NAPAS'
    },
    leg_raise: {
        title: 'SUPINE STRAIGHT LEG RAISE',
        primaryLabel: 'Lower Abs • Iliopsoas (Core Bawah)',
        jointLabel: 'PINGGUL',
        tempoSec: 3.2,
        eccentricText: 'TURUN TAHAN — TARIK NAPAS',
        concentricText: 'ANGKAT KAKI 85° — BUANG NAPAS'
    },
    russian_twist: {
        title: 'V-SIT RUSSIAN TWIST',
        primaryLabel: 'Internal & External Obliques • Core',
        jointLabel: 'TORSO',
        tempoSec: 2.0,
        eccentricText: 'TENGAH — TARIK NAPAS',
        concentricText: 'PUTAR RUSUK — BUANG NAPAS'
    },
    climber: {
        title: 'HIGH-TEMPO MOUNTAIN CLIMBER',
        primaryLabel: 'Core Stabilizer • Hip Flexors • Cardio',
        jointLabel: 'DRIVE',
        tempoSec: 1.3,
        eccentricText: 'GANTI KAKI CEPAT — NAPAS TERATUR',
        concentricText: 'TARIK LUTUT KE DADA — AKTIFKAN CORE'
    },
    lunge: {
        title: 'SPLIT STANCE 90/90 LUNGE',
        primaryLabel: 'Quadriceps • Glutes • Hamstrings',
        jointLabel: 'LUTUT DEPAN',
        tempoSec: 3.0,
        eccentricText: 'TURUN TEGAK — TARIK NAPAS',
        concentricText: 'DORONG NAIK — BUANG NAPAS'
    },
    glute_bridge: {
        title: 'HIP EXTENSION GLUTE BRIDGE',
        primaryLabel: 'Gluteus Maximus • Hamstrings • Core',
        jointLabel: 'HIP',
        tempoSec: 2.8,
        eccentricText: 'TURUN PELAN — TARIK NAPAS',
        concentricText: 'ANGKAT PINGGUL & REMAS GLUTES'
    },
    jumping_jack: {
        title: 'FULL-BODY CARDIO JACKS',
        primaryLabel: 'Calves • Deltoids • Cardiovascular System',
        jointLabel: 'BUKAAN',
        tempoSec: 1.4,
        eccentricText: 'KEMBALI RAPAT — TARIK NAPAS',
        concentricText: 'LOMPAT BUKA — BUANG NAPAS'
    },
    burpee: {
        title: 'EXPLOSIVE METABOLIC BURPEE',
        primaryLabel: 'Full Body • Chest • Quads • Core',
        jointLabel: 'POWER',
        tempoSec: 2.8,
        eccentricText: 'SQUAT & PLANK — TARIK NAPAS',
        concentricText: 'LOMPAT EKSPLOSIF — BUANG NAPAS'
    },
    superman: {
        title: 'POSTERIOR CHAIN SUPERMAN',
        primaryLabel: 'Erector Spinae • Glutes • Rear Delts',
        jointLabel: 'EKSTENSI',
        tempoSec: 3.0,
        eccentricText: 'TURUN RILEKS — TARIK NAPAS',
        concentricText: 'ANGKAT DADA & PAHA — TAHAN PUNCAK'
    },
    shoulder_press: {
        title: 'OVERHEAD DUMBBELL PRESS',
        primaryLabel: 'Anterior & Lateral Deltoids • Triceps',
        jointLabel: 'BAHU',
        tempoSec: 2.6,
        eccentricText: 'TURUN SEJAJAR TELINGA — TARIK NAPAS',
        concentricText: 'DORONG VERTIKAL — BUANG NAPAS'
    },
    bent_row: {
        title: 'HINGED DUMBBELL ROW',
        primaryLabel: 'Latissimus Dorsi • Rhomboids • Biceps',
        jointLabel: 'PUNGGUNG',
        tempoSec: 2.6,
        eccentricText: 'ULUR BEBAN — TARIK NAPAS',
        concentricText: 'TARIK SIKU KE BELAKANG — BUANG NAPAS'
    },
    bicep_curl: {
        title: 'ISOLATION DUMBBELL CURL',
        primaryLabel: 'Biceps Brachii • Brachialis',
        jointLabel: 'SIKU',
        tempoSec: 2.6,
        eccentricText: 'TURUN 3 DETIK — TARIK NAPAS',
        concentricText: 'ANGKAT & REMAS BICEP — BUANG NAPAS'
    }
};

function getExerciseAnimationSvg(type = 'pushup', isPlaying = true) {
    const safeType = BIOMECH_EXERCISE_META[type] ? type : 'pushup';
    const meta = BIOMECH_EXERCISE_META[safeType];
    const playAttr = isPlaying ? 'true' : 'card';

    return `
    <div class="biomech-stage" data-anim-type="${safeType}">
        <canvas class="biomech-canvas" width="560" height="310" data-anim-type="${safeType}" data-play-mode="${playAttr}"></canvas>
        <div class="biomech-overlay-controls">
            <button type="button" class="biomech-ctrl-btn" onclick="event.stopPropagation(); window.BiomechEngine.cycleSpeed(this)" title="Kecepatan Gerakan (Slow-Mo)">
                <i class="fas fa-gauge-high me-1"></i><span>1.0x</span>
            </button>
            <button type="button" class="biomech-ctrl-btn active" onclick="event.stopPropagation(); window.BiomechEngine.toggleHeatmap(this)" title="Tampilkan Heatmap Otot Aktif">
                <i class="fas fa-fire-flame-curved me-1"></i><span>Otot</span>
            </button>
            <button type="button" class="biomech-ctrl-btn" onclick="event.stopPropagation(); window.BiomechEngine.toggleVectors(this)" title="Tampilkan Garis Sudut Biomekanik">
                <i class="fas fa-compass-drafting me-1"></i><span>Sudut</span>
            </button>
        </div>
        <div class="biomech-muscle-caption">
            <span class="muscle-dot-active"></span> Target Aktif: <strong>${meta.primaryLabel}</strong>
        </div>
    </div>
    `;
}

class BiomechanicalAnimatorEngine {
    constructor() {
        this.speedMultiplier = 1.0;
        this.showHeatmap = true;
        this.showVectors = false;
        this.lastTime = performance.now();
        this.accumTime = 0;
        this.startLoop();
    }

    cycleSpeed(btn) {
        if (this.speedMultiplier === 1.0) {
            this.speedMultiplier = 0.5;
        } else if (this.speedMultiplier === 0.5) {
            this.speedMultiplier = 1.5;
        } else {
            this.speedMultiplier = 1.0;
        }
        document.querySelectorAll('.biomech-ctrl-btn').forEach(b => {
            if (b.innerHTML.includes('fa-gauge-high')) {
                b.querySelector('span').innerText = `${this.speedMultiplier.toFixed(1)}x`;
                b.classList.toggle('active', this.speedMultiplier !== 1.0);
            }
        });
    }

    toggleHeatmap(btn) {
        this.showHeatmap = !this.showHeatmap;
        document.querySelectorAll('.biomech-ctrl-btn').forEach(b => {
            if (b.innerHTML.includes('fa-fire-flame-curved')) {
                b.classList.toggle('active', this.showHeatmap);
            }
        });
    }

    toggleVectors(btn) {
        this.showVectors = !this.showVectors;
        document.querySelectorAll('.biomech-ctrl-btn').forEach(b => {
            if (b.innerHTML.includes('fa-compass-drafting')) {
                b.classList.toggle('active', this.showVectors);
            }
        });
    }

    startLoop() {
        const tick = (now) => {
            const dt = Math.min(0.05, (now - this.lastTime) / 1000);
            this.lastTime = now;
            this.accumTime += dt * this.speedMultiplier;

            const canvases = document.querySelectorAll('canvas.biomech-canvas');
            canvases.forEach(canvas => {
                // Hanya gambar canvas yang terlihat di layar untuk performa 60fps
                const rect = canvas.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && rect.bottom >= -50 && rect.top <= window.innerHeight + 50) {
                    this.renderCanvas(canvas, this.accumTime);
                }
            });

            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // Kurva gerakan otot manusia yang natural & organik (menggunakan Quintic Smoothstep + napas mikro)
    computeCycle(t, period) {
        const raw = (t % period) / period; // 0..1
        const smooth = (x) => x * x * x * (x * (x * 6 - 15) + 10); // C2-continuous organic human acceleration
        let val = 0;
        let phase = 'eccentric';
        if (raw < 0.44) {
            const p = Math.min(1, raw / 0.44);
            val = smooth(p);
            phase = 'concentric';
        } else if (raw < 0.54) {
            // Peak isometric squeeze with subtle natural micro-tension
            const holdP = (raw - 0.44) / 0.10;
            val = 1.0 - 0.015 * Math.sin(holdP * Math.PI);
            phase = 'peak';
        } else {
            const p = Math.min(1, (raw - 0.54) / 0.46);
            val = 1.0 - smooth(p);
            phase = 'eccentric';
        }
        return { val, phase, raw };
    }

    renderCanvas(canvas, time) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        const type = canvas.getAttribute('data-anim-type') || 'pushup';
        const meta = BIOMECH_EXERCISE_META[type] || BIOMECH_EXERCISE_META.pushup;

        const cycle = this.computeCycle(time, meta.tempoSec);
        const s = cycle.val; // 0..1 interpolated phase
        const heat = this.showHeatmap ? (0.25 + 0.75 * s) : 0;

        ctx.clearRect(0, 0, W, H);

        // 1. Background Studio Gym & Perspective Floor Grid
        this.drawGymEnvironment(ctx, W, H, s);

        // 2. Render Articulated Athlete based on exercise kinematics
        let telemetry = { angle: 90, jointX: W / 2, jointY: H / 2 };
        switch (type) {
            case 'pushup':
                telemetry = this.renderPushup(ctx, W, H, s, heat);
                break;
            case 'squat':
                telemetry = this.renderSquat(ctx, W, H, s, heat);
                break;
            case 'plank':
                telemetry = this.renderPlank(ctx, W, H, time, heat);
                break;
            case 'crunch':
                telemetry = this.renderCrunch(ctx, W, H, s, heat);
                break;
            case 'bicycle':
                telemetry = this.renderBicycle(ctx, W, H, time, heat);
                break;
            case 'leg_raise':
                telemetry = this.renderLegRaise(ctx, W, H, s, heat);
                break;
            case 'russian_twist':
                telemetry = this.renderRussianTwist(ctx, W, H, time, heat);
                break;
            case 'climber':
                telemetry = this.renderClimber(ctx, W, H, time, heat);
                break;
            case 'lunge':
                telemetry = this.renderLunge(ctx, W, H, s, heat);
                break;
            case 'glute_bridge':
                telemetry = this.renderGluteBridge(ctx, W, H, s, heat);
                break;
            case 'jumping_jack':
                telemetry = this.renderJumpingJack(ctx, W, H, s, heat);
                break;
            case 'burpee':
                telemetry = this.renderBurpee(ctx, W, H, cycle.raw, heat);
                break;
            case 'superman':
                telemetry = this.renderSuperman(ctx, W, H, s, heat);
                break;
            case 'shoulder_press':
                telemetry = this.renderShoulderPress(ctx, W, H, s, heat);
                break;
            case 'bent_row':
                telemetry = this.renderBentRow(ctx, W, H, s, heat);
                break;
            case 'bicep_curl':
                telemetry = this.renderBicepCurl(ctx, W, H, s, heat);
                break;
            default:
                telemetry = this.renderPushup(ctx, W, H, s, heat);
        }

        // 3. Render Biomechanical HUD, Joint Angle Badge & Breathing Bar
        this.drawTelemetryHUD(ctx, W, H, meta, cycle, s, telemetry);
    }

    drawGymEnvironment(ctx, W, H, s) {
        // Studio dark vignette gradient
        const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.45, 20, W * 0.5, H * 0.5, W * 0.7);
        bgGrad.addColorStop(0, '#131b2e');
        bgGrad.addColorStop(1, '#07090e');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Subtle biomechanical coordinate grid
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 40; x < W; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 35; y < H; y += 35) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // Floor plane & Luxury Gym Mat
        const floorY = 246;
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, floorY, W, H - floorY);

        // Floor horizon line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(W, floorY);
        ctx.stroke();

        // Pro Exercise Mat
        const matGrad = ctx.createLinearGradient(80, floorY - 6, 480, floorY + 6);
        matGrad.addColorStop(0, '#1e293b');
        matGrad.addColorStop(0.5, '#334155');
        matGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = matGrad;
        ctx.beginPath();
        ctx.roundRect(75, floorY - 5, W - 150, 10, 5);
        ctx.fill();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Ambient floor reflection under athlete
        const glowGrad = ctx.createRadialGradient(W * 0.5, floorY, 5, W * 0.5, floorY, 150);
        glowGrad.addColorStop(0, `rgba(16, 185, 129, ${0.12 + 0.12 * s})`);
        glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(80, floorY - 25, W - 160, 45);
    }

    /**
     * Menggambar anggota tubuh manusia (Lengan / Kaki) dengan kulit manusia realistis,
     * celana olahraga (shorts) pada pangkal paha, kaus kaki atletik, dan TANPA baut/lingkaran sendi robot!
     */
    drawSculptedLimb(ctx, x1, y1, x2, y2, r1, rBelly, r2, opts = {}) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const nx = -uy;
        const ny = ux;

        const isShadow = opts.isShadow || false;
        const heat = opts.heat || 0;
        const swell = 1 + 0.14 * heat;
        const rbTop = rBelly * swell;
        const rbBot = rBelly * 0.88 * swell;

        // Titik puncak lekukan otot (bicep / quadriceps / gastrocnemius)
        const peakT = opts.skinTone ? 0.44 : 0.40;
        const midX = x1 + dx * peakT;
        const midY = y1 + dy * peakT;

        ctx.save();

        // Bentuk siluet organik dengan kurva Bezier ganda (mulus menyatu di pangkal & ujung)
        ctx.beginPath();
        ctx.moveTo(x1 + nx * r1, y1 + ny * r1);
        ctx.bezierCurveTo(
            x1 + dx * 0.22 + nx * (rbTop * 1.05),
            y1 + dy * 0.22 + ny * (rbTop * 1.05),
            x1 + dx * 0.68 + nx * (rbTop * 0.92),
            y1 + dy * 0.68 + ny * (rbTop * 0.92),
            x2 + nx * r2,
            y2 + ny * r2
        );
        ctx.arc(x2, y2, r2, Math.atan2(ny, nx), Math.atan2(-ny, -nx));
        ctx.bezierCurveTo(
            x1 + dx * 0.68 - nx * (rbBot * 0.88),
            y1 + dy * 0.68 - ny * (rbBot * 0.88),
            x1 + dx * 0.22 - nx * (rbBot * 0.98),
            y1 + dy * 0.22 - ny * (rbBot * 0.98),
            x1 - nx * r1,
            y1 - ny * r1
        );
        ctx.arc(x1, y1, r1, Math.atan2(-ny, -nx), Math.atan2(ny, nx));
        ctx.closePath();

        if (isShadow) {
            // Sisi belakang anggota tubuh (dalam bayangan studio)
            const shGrad = ctx.createLinearGradient(midX + nx * rbTop, midY + ny * rbTop, midX - nx * rbBot, midY - ny * rbBot);
            shGrad.addColorStop(0, '#9a6544');
            shGrad.addColorStop(1, '#5c3822');
            ctx.fillStyle = shGrad;
            ctx.fill();
        } else {
            // Kulit Manusia Atletis Realistis dengan Pencahayaan Studio 3D (Warm Golden Tan Skin)
            const skinGrad = ctx.createLinearGradient(midX + nx * rbTop, midY + ny * rbTop, midX - nx * rbBot, midY - ny * rbBot);
            skinGrad.addColorStop(0, '#f5c6a5');   // Rim highlight kulit
            skinGrad.addColorStop(0.45, '#e0a378'); // Midtone kulit hangat
            skinGrad.addColorStop(0.85, '#b8764b'); // Kontur otot dalam
            skinGrad.addColorStop(1, '#8c5330');    // Core shadow
            ctx.fillStyle = skinGrad;
            ctx.fill();

            // Jika ini segmen Paha (r1 >= 11.5 dan bukan lengan), gambar Celana Pendek Olahraga (Athletic Shorts) di separuh atas paha!
            if (!opts.skinTone && r1 >= 11.5) {
                ctx.save();
                ctx.clip();
                const shortLen = 0.56;
                const sxEnd = x1 + dx * shortLen;
                const syEnd = y1 + dy * shortLen;
                const shortGrad = ctx.createLinearGradient(x1 + nx * r1, y1 + ny * r1, x1 - nx * r1, y1 - ny * r1);
                shortGrad.addColorStop(0, '#1e293b');
                shortGrad.addColorStop(0.5, '#0f172a');
                shortGrad.addColorStop(1, '#090d16');
                ctx.fillStyle = shortGrad;
                ctx.beginPath();
                ctx.moveTo(x1 - ux * 15 + nx * (r1 * 1.6), y1 - uy * 15 + ny * (r1 * 1.6));
                ctx.lineTo(sxEnd + nx * (rbTop * 1.5), syEnd + ny * (rbTop * 1.5));
                ctx.lineTo(sxEnd - nx * (rbBot * 1.5), syEnd - ny * (rbBot * 1.5));
                ctx.lineTo(x1 - ux * 15 - nx * (r1 * 1.6), y1 - uy * 15 - ny * (r1 * 1.6));
                ctx.closePath();
                ctx.fill();

                // Garis aksen emerald di ujung celana pendek olahraga
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(sxEnd + nx * (rbTop * 1.15), syEnd + ny * (rbTop * 1.15));
                ctx.lineTo(sxEnd - nx * (rbBot * 1.15), syEnd - ny * (rbBot * 1.15));
                ctx.stroke();
                ctx.restore();
            }

            // Jika ini segmen Betis (r1 < 11.5 dan bukan lengan), gambar Kaus Kaki Olahraga Putih/Gelap di bagian pergelangan kaki
            if (!opts.skinTone && r1 < 11.5) {
                ctx.save();
                ctx.clip();
                const sockStart = 0.74;
                const kxStart = x1 + dx * sockStart;
                const kyStart = y1 + dy * sockStart;
                ctx.fillStyle = '#e2e8f0';
                ctx.beginPath();
                ctx.moveTo(kxStart + nx * 16, kyStart + ny * 16);
                ctx.lineTo(x2 + ux * 10 + nx * 16, y2 + uy * 10 + ny * 16);
                ctx.lineTo(x2 + ux * 10 - nx * 16, y2 + uy * 10 - ny * 16);
                ctx.lineTo(kxStart - nx * 16, kyStart - ny * 16);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            // Jika ini lengan bawah (r1 <= 8.8 dan skinTone), gambar Kepalan Tangan Manusia (Anatomical Hand/Fist) + Wristband di ujung x2,y2
            if (opts.skinTone && r1 <= 8.8) {
                // Athletic Sweat Wristband
                const wbX = x1 + dx * 0.86;
                const wbY = y1 + dy * 0.86;
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = r2 * 1.85;
                ctx.lineCap = 'butt';
                ctx.beginPath();
                ctx.moveTo(wbX, wbY);
                ctx.lineTo(x1 + dx * 0.94, y1 + dy * 0.94);
                ctx.stroke();

                // Kepalan Tangan Manusia
                ctx.fillStyle = '#e0a378';
                ctx.beginPath();
                ctx.arc(x2 + ux * 2, y2 + uy * 2, r2 * 1.15, 0, Math.PI * 2);
                ctx.fill();
            }

            // Garis anatomi definisi otot halus (bukan garis robot)
            ctx.strokeStyle = 'rgba(255, 237, 213, 0.25)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(x1 + dx * 0.25 + nx * (rbTop * 0.55), y1 + dy * 0.25 + ny * (rbTop * 0.55));
            ctx.quadraticCurveTo(midX + nx * (rbTop * 0.72), midY + ny * (rbTop * 0.72), x1 + dx * 0.75 + nx * (r2 * 0.5), y1 + dy * 0.75 + ny * (r2 * 0.5));
            ctx.stroke();

            // Thermal Muscle Fiber Glow (Hanya pada serat otot aktif saat berkontraksi)
            if (heat > 0.08) {
                ctx.save();
                ctx.clip();
                const heatGrad = ctx.createRadialGradient(midX, midY, 2, midX, midY, Math.max(len * 0.48, rbTop * 1.8));
                heatGrad.addColorStop(0, `rgba(249, 115, 22, ${Math.min(0.62, heat * 0.65)})`);
                heatGrad.addColorStop(0.55, `rgba(239, 68, 68, ${Math.min(0.38, heat * 0.42)})`);
                heatGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
                ctx.fillStyle = heatGrad;
                ctx.fillRect(Math.min(x1, x2) - 40, Math.min(y1, y2) - 40, Math.abs(dx) + 80, Math.abs(dy) + 80);
                ctx.restore();
            }
        }

        ctx.restore();
    }

    /**
     * Menggambar Torso Manusia Atletis dengan Baju Compression Tank-Top Sporty & Celana Pendek
     */
    drawSculptedTorso(ctx, hx, hy, sx, sy, opts = {}) {
        const dx = sx - hx;
        const dy = sy - hy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const nx = -uy;
        const ny = ux;

        const wHip = opts.wHip || 14.5;
        const wWaist = opts.wWaist || 13.5;
        const wChest = opts.wChest || 19.5;

        ctx.save();

        const waistX = hx + dx * 0.42;
        const waistY = hy + dy * 0.42;
        const chestX = hx + dx * 0.76;
        const chestY = hy + dy * 0.76;

        // Siluet Torso Atletis (V-Taper)
        ctx.beginPath();
        ctx.moveTo(hx + nx * wHip, hy + ny * wHip);
        ctx.bezierCurveTo(
            waistX + nx * wWaist,
            waistY + ny * wWaist,
            chestX + nx * (wChest * 1.04),
            chestY + ny * (wChest * 1.04),
            sx + nx * (wChest * 0.92),
            sy + ny * (wChest * 0.92)
        );
        ctx.arc(sx, sy, wChest * 0.92, Math.atan2(ny, nx), Math.atan2(-ny, -nx));
        ctx.bezierCurveTo(
            chestX - nx * (wChest * 0.92),
            chestY - ny * (wChest * 0.92),
            waistX - nx * wWaist,
            waistY - ny * wWaist,
            hx - nx * wHip,
            hy - ny * wHip
        );
        ctx.arc(hx, hy, wHip, Math.atan2(-ny, -nx), Math.atan2(ny, nx));
        ctx.closePath();

        // Athletic Compression Shirt Gradient (Charcoal Midnight dengan 3D Studio Shading)
        const torsoGrad = ctx.createLinearGradient(chestX + nx * wChest, chestY + ny * wChest, chestX - nx * wChest, chestY - ny * wChest);
        torsoGrad.addColorStop(0, '#334155');
        torsoGrad.addColorStop(0.35, '#1e293b');
        torsoGrad.addColorStop(0.75, '#0f172a');
        torsoGrad.addColorStop(1, '#090d16');
        ctx.fillStyle = torsoGrad;
        ctx.fill();

        // Garis Jahitan Ergonomis Baju Olahraga (Sportswear Seam Lines)
        ctx.save();
        ctx.clip();

        // Celana Olahraga bagian Pinggul / Pelvis
        const shortsTopX = hx + dx * 0.22;
        const shortsTopY = hy + dy * 0.22;
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(hx, hy, wHip * 1.25, 0, Math.PI * 2);
        ctx.fill();

        // Karet Pinggang Celana Olahraga (Waistband)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(shortsTopX + nx * wHip, shortsTopY + ny * wHip);
        ctx.lineTo(shortsTopX - nx * wHip, shortsTopY - ny * wHip);
        ctx.stroke();

        // Garis Kontur Dada Pectoral & Seam Baju
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(chestX + nx * (wChest * 0.85), chestY + ny * (wChest * 0.85));
        ctx.quadraticCurveTo(chestX + nx * (wChest * 0.2), chestY + ny * (wChest * 0.2), sx + nx * (wChest * 0.1), sy + ny * (wChest * 0.1));
        ctx.stroke();

        // Chest / Pectoral Muscle Activation Glow
        if (opts.chestHeat > 0.05) {
            const pX = chestX + nx * (wChest * 0.45);
            const pY = chestY + ny * (wChest * 0.45);
            const g = ctx.createRadialGradient(pX, pY, 2, pX, pY, 24);
            g.addColorStop(0, `rgba(249, 115, 22, ${opts.chestHeat * 0.72})`);
            g.addColorStop(0.6, `rgba(239, 68, 68, ${opts.chestHeat * 0.45})`);
            g.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(pX, pY, 24, 0, Math.PI * 2);
            ctx.fill();
        }

        // Core / Sixpack Abs Activation Glow
        if (opts.absHeat > 0.05) {
            const aX = waistX + nx * (wWaist * 0.38);
            const aY = waistY + ny * (wWaist * 0.38);
            const g = ctx.createRadialGradient(aX, aY, 3, aX, aY, 28);
            g.addColorStop(0, `rgba(249, 115, 22, ${opts.absHeat * 0.72})`);
            g.addColorStop(0.55, `rgba(239, 68, 68, ${opts.absHeat * 0.45})`);
            g.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(aX, aY, 28, 0, Math.PI * 2);
            ctx.fill();
        }

        // Back / Latissimus Activation Glow
        if (opts.backHeat > 0.05) {
            const bX = waistX - nx * (wWaist * 0.42);
            const bY = waistY - ny * (wWaist * 0.42);
            const g = ctx.createRadialGradient(bX, bY, 3, bX, bY, 28);
            g.addColorStop(0, `rgba(249, 115, 22, ${opts.backHeat * 0.7})`);
            g.addColorStop(0.6, `rgba(239, 68, 68, ${opts.backHeat * 0.42})`);
            g.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(bX, bY, 28, 0, Math.PI * 2);
            ctx.fill();
        }

        // Glutes Activation Glow
        if (opts.gluteHeat > 0.05) {
            const gX = hx - nx * (wHip * 0.4);
            const gY = hy - ny * (wHip * 0.4);
            const g = ctx.createRadialGradient(gX, gY, 2, gX, gY, 22);
            g.addColorStop(0, `rgba(249, 115, 22, ${opts.gluteHeat * 0.72})`);
            g.addColorStop(0.6, `rgba(239, 68, 68, ${opts.gluteHeat * 0.45})`);
            g.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(gX, gY, 22, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // Bahu (Deltoid Cap) Manusia Alami agar Lengan Menyatu Mulus dengan Torso
        const deltGrad = ctx.createRadialGradient(sx - 2, sy - 2, 2, sx, sy, 12);
        deltGrad.addColorStop(0, '#f5c6a5');
        deltGrad.addColorStop(0.65, '#e0a378');
        deltGrad.addColorStop(1, '#b8764b');
        ctx.fillStyle = deltGrad;
        ctx.beginPath();
        ctx.arc(sx, sy, 10.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Menggambar Kepala Manusia Atletis (Kulit Manusia, Rahang, Hidung, Telinga, & Potongan Rambut Sporty)
     */
    drawAthleteHead(ctx, sx, sy, hx, hy, lookAngle = 0) {
        ctx.save();

        // Leher Manusia Berotot (Sternocleidomastoid Shading)
        const neckGrad = ctx.createLinearGradient(sx - 6, sy, hx + 6, hy);
        neckGrad.addColorStop(0, '#c8875b');
        neckGrad.addColorStop(0.5, '#e0a378');
        neckGrad.addColorStop(1, '#a6683f');
        ctx.strokeStyle = neckGrad;
        ctx.lineWidth = 10.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.translate(hx, hy);
        ctx.rotate(lookAngle);

        // Bentuk Kepala & Rahang Manusia (Bukan Bulatan Robot)
        const skinGrad = ctx.createRadialGradient(3, -3, 2, 0, 0, 17);
        skinGrad.addColorStop(0, '#f7ccb0');
        skinGrad.addColorStop(0.6, '#e0a378');
        skinGrad.addColorStop(1, '#a86b43');

        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        // Cranium & sculpted jawline
        ctx.moveTo(-13, -4);
        ctx.bezierCurveTo(-14, -16, 11, -17, 13, -5);
        ctx.bezierCurveTo(15, 0, 14, 7, 10, 12); // Hidung & dagu depan
        ctx.quadraticCurveTo(2, 15, -6, 11);     // Rahang bawah
        ctx.quadraticCurveTo(-13, 6, -13, -4);
        ctx.closePath();
        ctx.fill();

        // Telinga Manusia
        ctx.fillStyle = '#cf8e64';
        ctx.beginPath();
        ctx.ellipse(-3, 2, 2.6, 4.5, -0.15, 0, Math.PI * 2);
        ctx.fill();

        // Potongan Rambut Atletik Modern (Short Textured Crop / Fade)
        const hairGrad = ctx.createLinearGradient(-14, -18, 12, -2);
        hairGrad.addColorStop(0, '#1e293b');
        hairGrad.addColorStop(0.5, '#0f172a');
        hairGrad.addColorStop(1, '#020617');
        ctx.fillStyle = hairGrad;
        ctx.beginPath();
        ctx.moveTo(-13.5, -2);
        ctx.bezierCurveTo(-15, -16, -2, -19, 12, -13);
        ctx.quadraticCurveTo(15, -10, 12, -6);
        ctx.quadraticCurveTo(3, -9, -5, -6);
        ctx.quadraticCurveTo(-9, -1, -13.5, -2);
        ctx.closePath();
        ctx.fill();

        // Alis & Mata Manusia Natural
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(6.5, -3.2);
        ctx.lineTo(11.5, -2.5);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(8.8, -0.5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Menggambar Sepatu Olahraga Pro (Sneaker Training Manusia dengan Sol Cushion & Aksen Sporty)
     */
    drawAthleticShoe(ctx, ax, ay, tx, ty, isShadow = false) {
        ctx.save();
        const dx = tx - ax;
        const dy = ty - ay;
        const angle = Math.atan2(dy, dx);
        const len = Math.max(23, Math.hypot(dx, dy));

        ctx.translate(ax, ay);
        ctx.rotate(angle);

        // Knit Shoe Upper (Obsidian / Slate)
        ctx.fillStyle = isShadow ? '#0f172a' : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(-7, -6.5);
        ctx.lineTo(len * 0.58, -4.5);
        ctx.quadraticCurveTo(len + 1, -2.5, len + 1, 4.5);
        ctx.lineTo(-8, 4.5);
        ctx.closePath();
        ctx.fill();

        if (!isShadow) {
            // Emerald Athletic Stripe
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(-2, 0.5);
            ctx.lineTo(len * 0.52, -1.5);
            ctx.stroke();
        }

        // White Sculpted EVA Cushion Midsole
        ctx.fillStyle = isShadow ? '#334155' : '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(-8.5, 3.8, len + 10.5, 4.5, 2.2);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Menggambar 3D Hexagonal Gym Dumbbell di Tangan Atlet
     */
    drawHexDumbbell(ctx, x, y, angle = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Chrome Handle
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-14, -2.5, 28, 5);

        // Left & Right Hex Rubber Plates
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;

        [-16, 10].forEach(px => {
            ctx.beginPath();
            ctx.roundRect(px, -11, 7, 22, 2);
            ctx.fill();
            ctx.stroke();
        });

        ctx.restore();
    }

    /**
     * Menggambar Busur Derajat Sendi (Protractor) & Garis Laser Postur
     */
    drawAngleProtractor(ctx, jx, jy, p1x, p1y, p2x, p2y, label = '') {
        if (!this.showVectors) return;
        const a1 = Math.atan2(p1y - jy, p1x - jx);
        const a2 = Math.atan2(p2y - jy, p2x - jx);
        let diff = Math.abs(a1 - a2) * (180 / Math.PI);
        if (diff > 180) diff = 360 - diff;
        const deg = Math.round(diff);

        ctx.save();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(jx, jy, 22, Math.min(a1, a2), Math.max(a1, a2));
        ctx.stroke();
        ctx.setLineDash([]);

        // Degree pill tag
        const midA = (a1 + a2) / 2;
        const tx = jx + Math.cos(midA) * 34;
        const ty = jy + Math.sin(midA) * 34;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tx - 22, ty - 10, 44, 19, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${deg}°`, tx, ty);
        ctx.restore();

        return deg;
    }

    drawMotionArrow(ctx, x1, y1, x2, y2, color = '#10b981') {
        if (!this.showVectors) return;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        const ang = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 8 * Math.cos(ang - 0.4), y2 - 8 * Math.sin(ang - 0.4));
        ctx.lineTo(x2 - 8 * Math.cos(ang + 0.4), y2 - 8 * Math.sin(ang + 0.4));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // ========================================================================
    // 16 SPESIFIK KINEMATIKA GERAKAN LATIHAN
    // ========================================================================

    // 1. PUSH-UP (Standard, Wide, Diamond, Knee, Incline, Decline)
    renderPushup(ctx, W, H, s, heat) {
        // s=0: High Plank, s=1: Bottom of Push-up (Chest near floor)
        const toeX = 415, toeY = 238;
        const handX = 165, handY = 238;

        const shX = this.lerp(172, 162, s);
        const shY = this.lerp(132, 198, s);
        const hipX = this.lerp(295, 290, s);
        const hipY = this.lerp(178, 214, s);
        const kneeX = this.lerp(358, 355, s);
        const kneeY = this.lerp(205, 224, s);

        const elbX = this.lerp(168, 198, s);
        const elbY = this.lerp(185, 196, s);
        const headX = this.lerp(132, 122, s);
        const headY = this.lerp(116, 188, s);

        // Back arm & leg (shadow)
        this.drawSculptedLimb(ctx, shX, shY - 4, elbX + 6, elbY - 4, 9, 10, 7, { isShadow: true });
        this.drawSculptedLimb(ctx, elbX + 6, elbY - 4, handX + 6, handY, 7, 7, 5, { isShadow: true });
        this.drawSculptedLimb(ctx, hipX, hipY - 4, kneeX, kneeY - 4, 12, 13, 9, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX, kneeY - 4, toeX, toeY - 8, 9, 9, 6, { isShadow: true });

        // Alignment Laser
        if (this.showVectors) {
            ctx.save();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(shX, shY);
            ctx.lineTo(toeX, toeY - 8);
            ctx.stroke();
            ctx.restore();
        }

        // Torso & Head
        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { chestHeat: heat, absHeat: heat * 0.65 });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, Math.PI * 0.78);

        // Front Leg
        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 12, 14, 9, { heat: heat * 0.35 });
        this.drawSculptedLimb(ctx, kneeX, kneeY, toeX, toeY - 8, 9, 10, 6, {});
        this.drawAthleticShoe(ctx, toeX, toeY - 10, toeX - 18, toeY);

        // Front Arm (Bicep/Tricep & Forearm)
        this.drawSculptedLimb(ctx, shX, shY, elbX, elbY, 10, 12, 7.5, { skinTone: true, heat: heat });
        this.drawSculptedLimb(ctx, elbX, elbY, handX, handY, 7.5, 8, 5.5, { skinTone: true, heat: heat * 0.6 });

        // Telapak Tangan Manusia menapak di matras
        ctx.fillStyle = '#e0a378';
        ctx.beginPath();
        ctx.roundRect(handX - 14, handY - 5, 21, 5.5, 3);
        ctx.fill();

        const deg = this.drawAngleProtractor(ctx, elbX, elbY, shX, shY, handX, handY);
        this.drawMotionArrow(ctx, shX, 95, shX, 165, s > 0.5 ? '#f59e0b' : '#10b981');

        return { angle: deg || Math.round(this.lerp(172, 86, s)) };
    }

    // 2. SQUAT (Bodyweight, Sumo, Jump Squat, Wall Sit)
    renderSquat(ctx, W, H, s, heat) {
        const ankleX = 275, ankleY = 232;
        const kneeX = this.lerp(272, 305, s);
        const kneeY = this.lerp(168, 174, s);
        const hipX = this.lerp(265, 212, s);
        const hipY = this.lerp(112, 168, s);
        const shX = this.lerp(268, 245, s);
        const shY = this.lerp(52, 98, s);
        const headX = shX + 6;
        const headY = shY - 26;

        // Arms swing forward during squat descent for counterbalance
        const elbX = this.lerp(265, 282, s);
        const elbY = this.lerp(86, 112, s);
        const handX = this.lerp(275, 328, s);
        const handY = this.lerp(114, 104, s);

        // Back leg & arm
        this.drawSculptedLimb(ctx, hipX + 6, hipY, kneeX + 8, kneeY, 13, 15, 9.5, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX + 8, kneeY, ankleX + 8, ankleY, 9.5, 10, 6.5, { isShadow: true });
        this.drawAthleticShoe(ctx, ankleX + 8, ankleY, ankleX + 34, ankleY + 5, true);

        // Parallel Depth Guide Line
        if (this.showVectors) {
            ctx.save();
            ctx.strokeStyle = s > 0.7 ? '#10b981' : 'rgba(250, 204, 21, 0.35)';
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(150, kneeY);
            ctx.lineTo(390, kneeY);
            ctx.stroke();
            ctx.fillStyle = s > 0.7 ? '#10b981' : '#94a3b8';
            ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('GARIS PARALEL 90°', 155, kneeY - 6);
            ctx.restore();
        }

        // Torso & Head
        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { gluteHeat: heat, absHeat: heat * 0.5, backHeat: heat * 0.4 });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, 0);

        // Front Thigh (Quadriceps & Hamstrings) & Shin
        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 14, 17, 10, { heat: heat });
        this.drawSculptedLimb(ctx, kneeX, kneeY, ankleX, ankleY, 10, 11, 7, { heat: heat * 0.45 });
        this.drawAthleticShoe(ctx, ankleX, ankleY, ankleX + 28, ankleY + 5, false);

        // Front Arm
        this.drawSculptedLimb(ctx, shX, shY, elbX, elbY, 9, 10, 7, { skinTone: true });
        this.drawSculptedLimb(ctx, elbX, elbY, handX, handY, 7, 7, 5, { skinTone: true });

        const deg = this.drawAngleProtractor(ctx, kneeX, kneeY, hipX, hipY, ankleX, ankleY);
        this.drawMotionArrow(ctx, hipX - 28, 105, hipX - 28, 168);

        return { angle: deg || Math.round(this.lerp(175, 88, s)) };
    }

    // 3. PLANK (Forearm Plank)
    renderPlank(ctx, W, H, time, heat) {
        const microBreath = Math.sin(time * 3.2) * 2.5;
        const toeX = 410, toeY = 236;
        const elbX = 175, elbY = 236;
        const handX = 132, handY = 236;

        const shX = 175, shY = 166 + microBreath;
        const hipX = 292, hipY = 194 + microBreath * 0.8;
        const kneeX = 355, kneeY = 214 + microBreath * 0.4;
        const headX = 135, headY = 156 + microBreath;

        // Back limbs
        this.drawSculptedLimb(ctx, hipX, hipY - 3, kneeX, kneeY - 3, 12, 13, 9, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX, kneeY - 3, toeX, toeY - 8, 9, 9, 6, { isShadow: true });

        // 180 deg Isometric Laser Line
        if (this.showVectors) {
            ctx.save();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(shX - 15, shY - 14);
            ctx.lineTo(toeX + 10, toeY - 18);
            ctx.stroke();
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.fillText('180° NEUTRAL SPINE LOCK', 225, 142);
            ctx.restore();
        }

        const pulseHeat = this.showHeatmap ? (0.65 + 0.35 * Math.sin(time * 4)) : 0;

        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { absHeat: pulseHeat, gluteHeat: pulseHeat * 0.7, chestHeat: pulseHeat * 0.5 });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, Math.PI * 0.75);

        // Front Leg
        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 12, 14, 9, { heat: pulseHeat * 0.5 });
        this.drawSculptedLimb(ctx, kneeX, kneeY, toeX, toeY - 8, 9, 10, 6, {});
        this.drawAthleticShoe(ctx, toeX, toeY - 8, toeX - 16, toeY);

        // Forearm 90 deg support
        this.drawSculptedLimb(ctx, shX, shY, elbX, elbY, 9.5, 11, 7.5, { skinTone: true, heat: pulseHeat * 0.6 });
        this.drawSculptedLimb(ctx, elbX, elbY, handX, handY, 7.5, 8, 5.5, { skinTone: true });

        this.drawAngleProtractor(ctx, elbX, elbY, shX, shY, handX, handY);
        return { angle: 180 };
    }

    // 4. CRUNCH (Abdominal Crunch)
    renderCrunch(ctx, W, H, s, heat) {
        const hipX = 275, hipY = 230;
        const kneeX = 345, kneeY = 162;
        const ankleX = 392, ankleY = 232;

        // Upper torso curls up by 34 degrees
        const curlAngle = this.lerp(-0.08, -0.62, s);
        const shX = hipX - Math.cos(curlAngle) * 92;
        const shY = hipY + Math.sin(curlAngle) * 92;
        const headX = shX - Math.cos(curlAngle - 0.25) * 30;
        const headY = shY + Math.sin(curlAngle - 0.25) * 30;

        const elbX = shX + 14;
        const elbY = shY - 22;

        // Back leg
        this.drawSculptedLimb(ctx, hipX + 4, hipY, kneeX + 6, kneeY, 13, 14, 9, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX + 6, kneeY, ankleX + 6, ankleY, 9, 9, 6, { isShadow: true });

        // Torso & Head
        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { absHeat: heat });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, -0.4);

        // Front bent leg
        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 13, 15, 9.5, {});
        this.drawSculptedLimb(ctx, kneeX, kneeY, ankleX, ankleY, 9.5, 10, 6.5, {});
        this.drawAthleticShoe(ctx, ankleX, ankleY, ankleX + 24, ankleY + 4);

        // Arm touching temple
        this.drawSculptedLimb(ctx, shX, shY, elbX, elbY, 8.5, 9.5, 6.5, { skinTone: true });
        this.drawSculptedLimb(ctx, elbX, elbY, headX + 4, headY, 6.5, 6.5, 5, { skinTone: true });

        const deg = this.drawAngleProtractor(ctx, hipX, hipY, shX, shY, 160, hipY);
        this.drawMotionArrow(ctx, 175, 200, 195, 145);
        return { angle: deg || Math.round(this.lerp(5, 38, s)) };
    }

    // 5. BICYCLE CRUNCH
    renderBicycle(ctx, W, H, time, heat) {
        const cyc = Math.sin(time * 3.6); // -1 .. 1
        const hipX = 255, hipY = 228;
        const shX = 172, shY = 188 - Math.abs(cyc) * 12;
        const headX = 146, headY = 166 - Math.abs(cyc) * 12;

        // Left & Right Legs alternating pedaling
        const k1X = this.lerp(235, 345, (cyc + 1) * 0.5);
        const k1Y = this.lerp(148, 188, (cyc + 1) * 0.5);
        const a1X = this.lerp(285, 415, (cyc + 1) * 0.5);
        const a1Y = this.lerp(155, 195, (cyc + 1) * 0.5);

        const k2X = this.lerp(345, 235, (cyc + 1) * 0.5);
        const k2Y = this.lerp(188, 148, (cyc + 1) * 0.5);
        const a2X = this.lerp(415, 285, (cyc + 1) * 0.5);
        const a2Y = this.lerp(195, 155, (cyc + 1) * 0.5);

        // Back Leg
        this.drawSculptedLimb(ctx, hipX, hipY, k2X, k2Y, 12, 14, 9, { isShadow: true });
        this.drawSculptedLimb(ctx, k2X, k2Y, a2X, a2Y, 9, 9, 6, { isShadow: true });
        this.drawAthleticShoe(ctx, a2X, a2Y, a2X + 18, a2Y - 12, true);

        const activeHeat = this.showHeatmap ? 0.88 : 0;
        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { absHeat: activeHeat });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, -0.3);

        // Front Leg
        this.drawSculptedLimb(ctx, hipX, hipY, k1X, k1Y, 13, 15, 9.5, { heat: activeHeat * 0.5 });
        this.drawSculptedLimb(ctx, k1X, k1Y, a1X, a1Y, 9.5, 10, 6.5, {});
        this.drawAthleticShoe(ctx, a1X, a1Y, a1X + 18, a1Y - 12, false);

        // Elbow reaching toward knee
        const elbX = this.lerp(215, 165, (cyc + 1) * 0.5);
        const elbY = this.lerp(152, 182, (cyc + 1) * 0.5);
        this.drawSculptedLimb(ctx, shX, shY, elbX, elbY, 8.5, 9.5, 6.5, { skinTone: true });
        this.drawSculptedLimb(ctx, elbX, elbY, headX + 4, headY, 6.5, 6.5, 5, { skinTone: true });

        return { angle: Math.round(45 + Math.abs(cyc) * 40) };
    }

    // 6. LEG RAISE
    renderLegRaise(ctx, W, H, s, heat) {
        const hipX = 235, hipY = 230;
        const shX = 142, shY = 228;
        const headX = 112, headY = 222;

        // Straight legs lift from 10 deg to 82 deg
        const legAng = this.lerp(-0.14, -1.42, s);
        const kneeX = hipX + Math.cos(legAng) * 72;
        const kneeY = hipY + Math.sin(legAng) * 72;
        const ankleX = hipX + Math.cos(legAng) * 138;
        const ankleY = hipY + Math.sin(legAng) * 138;

        // Back leg
        this.drawSculptedLimb(ctx, hipX, hipY - 4, kneeX - 4, kneeY - 4, 12, 14, 9, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX - 4, kneeY - 4, ankleX - 4, ankleY - 4, 9, 9, 6, { isShadow: true });

        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { absHeat: heat });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, -1.2);

        // Arms flat alongside mat
        this.drawSculptedLimb(ctx, shX, shY, 225, 236, 8.5, 9, 6, { skinTone: true });

        // Front straight leg lifting
        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 13, 15, 9.5, { heat: heat * 0.65 });
        this.drawSculptedLimb(ctx, kneeX, kneeY, ankleX, ankleY, 9.5, 10, 6.5, {});
        this.drawAthleticShoe(ctx, ankleX, ankleY, ankleX + Math.cos(legAng - 1.3) * 22, ankleY + Math.sin(legAng - 1.3) * 22);

        const deg = this.drawAngleProtractor(ctx, hipX, hipY, ankleX, ankleY, 370, hipY);
        this.drawMotionArrow(ctx, 360, 210, 285, 110);
        return { angle: deg || Math.round(this.lerp(10, 82, s)) };
    }

    // 7. RUSSIAN TWIST
    renderRussianTwist(ctx, W, H, time, heat) {
        const twist = Math.sin(time * 3.4); // -1..1
        const hipX = 265, hipY = 230;
        const shX = 212, shY = 152;
        const headX = 195, headY = 122;
        const kneeX = 332, kneeY = 175;
        const ankleX = 382, ankleY = 205; // V-sit feet elevated off floor

        this.drawSculptedLimb(ctx, hipX, hipY, kneeX + 5, kneeY - 4, 12, 13, 8.5, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX + 5, kneeY - 4, ankleX + 5, ankleY - 4, 8.5, 8.5, 6, { isShadow: true });

        const obliquesHeat = this.showHeatmap ? (0.4 + 0.6 * Math.abs(twist)) : 0;
        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { absHeat: obliquesHeat });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, 0.2);

        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 13, 15, 9, { heat: obliquesHeat * 0.4 });
        this.drawSculptedLimb(ctx, kneeX, kneeY, ankleX, ankleY, 9, 9.5, 6.5, {});
        this.drawAthleticShoe(ctx, ankleX, ankleY, ankleX + 20, ankleY - 8);

        // Arms twisting side to side
        const handX = 245 + twist * 38;
        const handY = 175 + twist * 18;
        this.drawSculptedLimb(ctx, shX, shY, handX, handY, 8.5, 9.5, 6.5, { skinTone: true, heat: obliquesHeat * 0.5 });

        this.drawAngleProtractor(ctx, hipX, hipY, shX, shY, kneeX, kneeY);
        return { angle: Math.round(90 + twist * 35) };
    }

    // 8. MOUNTAIN CLIMBER
    renderClimber(ctx, W, H, time, heat) {
        const stride = Math.sin(time * 5.2); // Fast pumping legs
        const shX = 175, shY = 135;
        const handX = 168, handY = 238;
        const hipX = 292, hipY = 168;
        const headX = 138, headY = 122;

        // Leg A & Leg B alternating knee drive
        const tA = (stride + 1) * 0.5;
        const tB = 1 - tA;

        const kAX = this.lerp(222, 355, tA);
        const kAY = this.lerp(178, 204, tA);
        const fAX = this.lerp(255, 415, tA);
        const fAY = this.lerp(218, 236, tA);

        const kBX = this.lerp(222, 355, tB);
        const kBY = this.lerp(178, 204, tB);
        const fBX = this.lerp(255, 415, tB);
        const fBY = this.lerp(218, 236, tB);

        const activeHeat = this.showHeatmap ? 0.85 : 0;

        // Back Leg B
        this.drawSculptedLimb(ctx, hipX, hipY, kBX, kBY, 12, 14, 9, { isShadow: true });
        this.drawSculptedLimb(ctx, kBX, kBY, fBX, fBY, 9, 9, 6, { isShadow: true });
        this.drawAthleticShoe(ctx, fBX, fBY, fBX - 16, fBY + 4, true);

        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { absHeat: activeHeat, chestHeat: activeHeat * 0.5 });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, Math.PI * 0.72);

        // Front Leg A
        this.drawSculptedLimb(ctx, hipX, hipY, kAX, kAY, 13, 15, 9.5, { heat: activeHeat * 0.7 });
        this.drawSculptedLimb(ctx, kAX, kAY, fAX, fAY, 9.5, 10, 6.5, {});
        this.drawAthleticShoe(ctx, fAX, fAY, fAX - 16, fAY + 4, false);

        // Locked straight arms supporting plank
        this.drawSculptedLimb(ctx, shX, shY, 171, 186, 9.5, 10.5, 7.5, { skinTone: true, heat: activeHeat * 0.6 });
        this.drawSculptedLimb(ctx, 171, 186, handX, handY, 7.5, 8, 5.5, { skinTone: true });

        return { angle: Math.round(65 + tA * 95) };
    }

    // 9. LUNGE (Split Squat / Forward & Reverse Lunge)
    renderLunge(ctx, W, H, s, heat) {
        const frontAnkleX = 215, frontAnkleY = 232;
        const backToeX = 375, backToeY = 232;

        const hipX = 275;
        const hipY = this.lerp(115, 168, s);
        const shX = 275;
        const shY = this.lerp(48, 98, s);
        const headX = 275, headY = shY - 26;

        const frontKneeX = this.lerp(235, 215, s);
        const frontKneeY = this.lerp(172, 168, s);

        const backKneeX = this.lerp(325, 315, s);
        const backKneeY = this.lerp(175, 224, s);

        // Back Leg (trailing knee dropping to 90 deg near floor)
        this.drawSculptedLimb(ctx, hipX, hipY, backKneeX, backKneeY, 12.5, 14.5, 9, { isShadow: true });
        this.drawSculptedLimb(ctx, backKneeX, backKneeY, backToeX, backToeY, 9, 9.5, 6.5, { isShadow: true });
        this.drawAthleticShoe(ctx, backToeX, backToeY, backToeX - 18, backToeY + 4, true);

        // Tall vertical torso
        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { gluteHeat: heat, absHeat: heat * 0.4 });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, 0);

        // Front Leg (90 deg knee angle)
        this.drawSculptedLimb(ctx, hipX, hipY, frontKneeX, frontKneeY, 14, 17, 10, { heat: heat });
        this.drawSculptedLimb(ctx, frontKneeX, frontKneeY, frontAnkleX, frontAnkleY, 10, 11, 7, { heat: heat * 0.5 });
        this.drawAthleticShoe(ctx, frontAnkleX, frontAnkleY, frontAnkleX - 26, frontAnkleY + 4, false);

        // Hands on hips / athletic guard
        this.drawSculptedLimb(ctx, shX, shY, shX + 18, shY + 32, 8.5, 9.5, 6.5, { skinTone: true });
        this.drawSculptedLimb(ctx, shX + 18, shY + 32, hipX + 4, hipY - 6, 6.5, 6.5, 5, { skinTone: true });

        const deg = this.drawAngleProtractor(ctx, frontKneeX, frontKneeY, hipX, hipY, frontAnkleX, frontAnkleY);
        this.drawMotionArrow(ctx, hipX + 35, 105, hipX + 35, 168);
        return { angle: deg || Math.round(this.lerp(155, 90, s)) };
    }

    // 10. GLUTE BRIDGE
    renderGluteBridge(ctx, W, H, s, heat) {
        const shX = 168, shY = 228;
        const headX = 132, headY = 228;
        const kneeX = 335, kneeY = 158;
        const ankleX = 365, ankleY = 232;

        // Hips thrust upward to form straight line from shoulder to knee
        const hipX = 255;
        const hipY = this.lerp(228, 176, s);

        this.drawSculptedLimb(ctx, hipX, hipY - 3, kneeX + 5, kneeY - 3, 13, 15, 9, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX + 5, kneeY - 3, ankleX + 5, ankleY, 9, 9, 6, { isShadow: true });

        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { gluteHeat: heat, backHeat: heat * 0.7, absHeat: heat * 0.5 });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, -Math.PI * 0.5);

        // Arms flat on mat
        this.drawSculptedLimb(ctx, shX, shY, 245, 236, 8.5, 9, 6, { skinTone: true });

        // Front Thigh & Shin
        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 14, 16.5, 9.5, { heat: heat * 0.85 });
        this.drawSculptedLimb(ctx, kneeX, kneeY, ankleX, ankleY, 9.5, 10, 6.5, {});
        this.drawAthleticShoe(ctx, ankleX, ankleY, ankleX + 24, ankleY + 4);

        const deg = this.drawAngleProtractor(ctx, hipX, hipY, shX, shY, kneeX, kneeY);
        this.drawMotionArrow(ctx, hipX, 225, hipX, 145);
        return { angle: deg || Math.round(this.lerp(115, 178, s)) };
    }

    // 11. JUMPING JACK (Frontal Full-Body View)
    renderJumpingJack(ctx, W, H, s, heat) {
        const cx = W * 0.5;
        const jumpY = this.lerp(0, -14, s);
        const hipY = 142 + jumpY;
        const shY = 78 + jumpY;
        const headY = 46 + jumpY;

        // Legs spread angle
        const spreadX = this.lerp(16, 62, s);
        const kneeSpread = this.lerp(12, 36, s);

        // Arms sweep from sides to overhead clap
        const armAng = this.lerp(1.25, -1.25, s); // +down, -up overhead

        // Left & Right Legs
        [-1, 1].forEach(dir => {
            const hx = cx + dir * 10;
            const kx = cx + dir * kneeSpread;
            const ky = 188 + jumpY * 0.5;
            const ax = cx + dir * spreadX;
            const ay = 234 + jumpY * 0.2;

            this.drawSculptedLimb(ctx, hx, hipY, kx, ky, 12, 14, 9, { heat: heat * 0.65 });
            this.drawSculptedLimb(ctx, kx, ky, ax, ay, 9, 10, 6.5, { heat: heat * 0.8 });
            this.drawAthleticShoe(ctx, ax, ay, ax + dir * 18, ay + 4);
        });

        // Frontal Torso
        this.drawSculptedTorso(ctx, cx, hipY, cx, shY, { wHip: 15, wWaist: 14, wChest: 20, chestHeat: heat * 0.7, absHeat: heat * 0.6 });
        this.drawAthleteHead(ctx, cx, shY, cx, headY, 0);

        // Left & Right Sweeping Arms
        [-1, 1].forEach(dir => {
            const sx = cx + dir * 18;
            const ex = sx + dir * Math.cos(armAng) * 34;
            const ey = shY + Math.sin(armAng) * 34;
            const wx = ex + dir * Math.cos(armAng - 0.2) * 32;
            const wy = ey + Math.sin(armAng - 0.2) * 32;

            this.drawSculptedLimb(ctx, sx, shY, ex, ey, 8.5, 10, 7, { skinTone: true, heat: heat * 0.9 });
            this.drawSculptedLimb(ctx, ex, ey, wx, wy, 7, 7.5, 5, { skinTone: true });
        });

        return { angle: Math.round(this.lerp(20, 165, s)) };
    }

    // 12. BURPEE (Multi-Phase Full Body Explosive)
    renderBurpee(ctx, W, H, raw, heat) {
        // raw 0..0.5: Plank/Pushup phase, raw 0.5..1.0: Squat to Vertical Jump phase
        if (raw < 0.5) {
            const subS = Math.sin((raw / 0.5) * Math.PI);
            return this.renderPushup(ctx, W, H, subS, heat);
        } else {
            const subS = Math.sin(((raw - 0.5) / 0.5) * Math.PI);
            return this.renderJumpingJack(ctx, W, H, subS, heat);
        }
    }

    // 13. SUPERMAN (Posterior Chain Back Extension)
    renderSuperman(ctx, W, H, s, heat) {
        const hipX = 275, hipY = 232;
        const shX = 188, shY = this.lerp(228, 196, s);
        const headX = 158, headY = this.lerp(220, 176, s);

        // Arms extended forward & lifting
        const handX = 102, handY = this.lerp(232, 165, s);
        // Legs extended back & lifting
        const kneeX = 345, kneeY = this.lerp(232, 206, s);
        const ankleX = 415, ankleY = this.lerp(234, 182, s);

        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { backHeat: heat, gluteHeat: heat });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, 0.5);

        // Extended Legs
        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 13, 15, 9, { heat: heat * 0.8 });
        this.drawSculptedLimb(ctx, kneeX, kneeY, ankleX, ankleY, 9, 9.5, 6, {});
        this.drawAthleticShoe(ctx, ankleX, ankleY, ankleX + 18, ankleY + 10);

        // Extended Superhero Arms
        this.drawSculptedLimb(ctx, shX, shY, (shX + handX) * 0.5, (shY + handY) * 0.5, 8.5, 9.5, 7, { skinTone: true, heat: heat * 0.7 });
        this.drawSculptedLimb(ctx, (shX + handX) * 0.5, (shY + handY) * 0.5, handX, handY, 7, 7, 5, { skinTone: true });

        this.drawMotionArrow(ctx, 135, 225, 135, 160);
        this.drawMotionArrow(ctx, 395, 225, 395, 170);
        return { angle: Math.round(this.lerp(0, 32, s)) };
    }

    // 14. DUMBBELL SHOULDER PRESS
    renderShoulderPress(ctx, W, H, s, heat) {
        const cx = W * 0.5;
        const hipY = 152, shY = 86, headY = 52;

        // Standing legs
        [-1, 1].forEach(dir => {
            const hx = cx + dir * 12;
            const ax = cx + dir * 18;
            this.drawSculptedLimb(ctx, hx, hipY, ax, 194, 12.5, 14.5, 9.5, {});
            this.drawSculptedLimb(ctx, ax, 194, ax, 234, 9.5, 10, 7, {});
            this.drawAthleticShoe(ctx, ax, 234, ax + dir * 20, 238);
        });

        this.drawSculptedTorso(ctx, cx, hipY, cx, shY, { wHip: 15, wWaist: 14, wChest: 21, chestHeat: heat * 0.7, absHeat: heat * 0.4 });
        this.drawAthleteHead(ctx, cx, shY, cx, headY, 0);

        // Arms pressing Dumbbells from ear level to overhead lockout
        [-1, 1].forEach(dir => {
            const sx = cx + dir * 20;
            const ex = sx + dir * this.lerp(28, 14, s);
            const ey = this.lerp(98, 52, s);
            const wx = ex + dir * this.lerp(4, 2, s);
            const wy = this.lerp(66, 18, s);

            this.drawSculptedLimb(ctx, sx, shY, ex, ey, 9.5, 11.5, 8, { skinTone: true, heat: heat });
            this.drawSculptedLimb(ctx, ex, ey, wx, wy, 8, 8.5, 6, { skinTone: true, heat: heat * 0.7 });
            this.drawHexDumbbell(ctx, wx, wy, 0);
        });

        this.drawMotionArrow(ctx, cx - 68, 90, cx - 68, 22);
        this.drawMotionArrow(ctx, cx + 68, 90, cx + 68, 22);
        return { angle: Math.round(this.lerp(75, 176, s)) };
    }

    // 15. BENT-OVER DUMBBELL ROW
    renderBentRow(ctx, W, H, s, heat) {
        const ankleX = 285, ankleY = 232;
        const kneeX = 262, kneeY = 182;
        const hipX = 305, hipY = 132;
        const shX = 218, shY = 92; // 45 deg hinged flat back
        const headX = 192, headY = 76;

        // Elbows pull from hanging straight down to high past ribs
        const elbX = this.lerp(222, 268, s);
        const elbY = this.lerp(142, 78, s);
        const handX = this.lerp(220, 252, s);
        const handY = this.lerp(186, 122, s);

        this.drawSculptedLimb(ctx, hipX + 5, hipY, kneeX + 5, kneeY, 13, 15, 9.5, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX + 5, kneeY, ankleX + 5, ankleY, 9.5, 10, 6.5, { isShadow: true });

        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { backHeat: heat, absHeat: heat * 0.5 });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, Math.PI * 0.8);

        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 14, 16, 10, { heat: heat * 0.4 });
        this.drawSculptedLimb(ctx, kneeX, kneeY, ankleX, ankleY, 10, 10.5, 7, {});
        this.drawAthleticShoe(ctx, ankleX, ankleY, ankleX - 26, ankleY + 4);

        // Rowing Arm + Hex Dumbbell
        this.drawSculptedLimb(ctx, shX, shY, elbX, elbY, 9.5, 11.5, 8, { skinTone: true, heat: heat });
        this.drawSculptedLimb(ctx, elbX, elbY, handX, handY, 8, 8.5, 6, { skinTone: true, heat: heat * 0.8 });
        this.drawHexDumbbell(ctx, handX, handY, 0.2);

        const deg = this.drawAngleProtractor(ctx, elbX, elbY, shX, shY, handX, handY);
        this.drawMotionArrow(ctx, 195, 185, 225, 115);
        return { angle: deg || Math.round(this.lerp(170, 72, s)) };
    }

    // 16. DUMBBELL BICEP CURL
    renderBicepCurl(ctx, W, H, s, heat) {
        const ankleX = 265, ankleY = 232;
        const kneeX = 262, kneeY = 178;
        const hipX = 265, hipY = 128;
        const shX = 265, shY = 58;
        const headX = 268, headY = 30;

        // Upper arm locked at side, forearm curls 135 deg arc
        const elbX = 262, elbY = 104;
        const curlAng = this.lerp(1.38, -0.95, s);
        const handX = elbX + Math.cos(curlAng) * 44;
        const handY = elbY + Math.sin(curlAng) * 44;

        this.drawSculptedLimb(ctx, hipX - 5, hipY, kneeX - 5, kneeY, 13, 15, 9.5, { isShadow: true });
        this.drawSculptedLimb(ctx, kneeX - 5, kneeY, ankleX - 5, ankleY, 9.5, 10, 6.5, { isShadow: true });

        this.drawSculptedTorso(ctx, hipX, hipY, shX, shY, { chestHeat: heat * 0.3, absHeat: heat * 0.3 });
        this.drawAthleteHead(ctx, shX, shY, headX, headY, 0);

        this.drawSculptedLimb(ctx, hipX, hipY, kneeX, kneeY, 13.5, 16, 9.5, {});
        this.drawSculptedLimb(ctx, kneeX, kneeY, ankleX, ankleY, 9.5, 10.5, 7, {});
        this.drawAthleticShoe(ctx, ankleX, ankleY, ankleX + 26, ankleY + 4);

        // Upper Arm with swelling Bicep peak!
        this.drawSculptedLimb(ctx, shX, shY, elbX, elbY, 10, 13.5, 8.5, { skinTone: true, heat: heat });
        this.drawSculptedLimb(ctx, elbX, elbY, handX, handY, 8.5, 9.5, 6.5, { skinTone: true, heat: heat * 0.75 });
        this.drawHexDumbbell(ctx, handX, handY, curlAng + 1.57);

        const deg = this.drawAngleProtractor(ctx, elbX, elbY, shX, shY, handX, handY);
        return { angle: deg || Math.round(this.lerp(165, 38, s)) };
    }

    /**
     * Menggambar Panel HUD Telemetri di Atas & Bawah Canvas
     */
    drawTelemetryHUD(ctx, W, H, meta, cycle, s, telemetry) {
        // Top-Left Title & Biomech Status
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(14, 12, 235, 42, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(meta.title, 24, 28);

        const breathStr = (cycle.phase === 'concentric' || cycle.phase === 'peak') ? meta.concentricText : meta.eccentricText;
        ctx.fillStyle = (cycle.phase === 'concentric' || cycle.phase === 'peak') ? '#fbbf24' : '#38bdf8';
        ctx.font = '700 10px "JetBrains Mono", monospace';
        ctx.fillText(breathStr, 24, 44);

        // Bottom Telemetry Bar (Muscle Activation & Angle Readout)
        const barY = H - 38;
        ctx.fillStyle = 'rgba(9, 11, 18, 0.88)';
        ctx.fillRect(0, barY, W, 38);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(0, barY);
        ctx.lineTo(W, barY);
        ctx.stroke();

        // Activation Progress Meter
        const actPct = Math.round(32 + s * 66);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText(`AKTIVASI OTOT: ${actPct}%`, 16, barY + 23);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(138, barY + 14, 95, 8, 4);
        ctx.fill();

        const meterGrad = ctx.createLinearGradient(138, 0, 233, 0);
        meterGrad.addColorStop(0, '#10b981');
        meterGrad.addColorStop(0.5, '#f59e0b');
        meterGrad.addColorStop(1, '#ef4444');
        ctx.fillStyle = meterGrad;
        ctx.beginPath();
        ctx.roundRect(138, barY + 14, 95 * (actPct / 100), 8, 4);
        ctx.fill();

        // Joint Angle Readout on Right
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'right';
        ctx.fillText(`SUDUT ${meta.jointLabel}: ${telemetry.angle || 90}°`, W - 16, barY + 23);

        ctx.restore();
    }
}

// Export global database & start 60fps Biomech Engine
window.EXERCISE_DATABASE = EXERCISE_DATABASE;
window.getExerciseAnimationSvg = getExerciseAnimationSvg;
window.BiomechEngine = new BiomechanicalAnimatorEngine();

