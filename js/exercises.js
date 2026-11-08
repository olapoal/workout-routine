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
 * Animated SVG Generator Helper
 * Menghasilkan visualisasi animasi biomekanik bergerak halus untuk setiap tipe gerakan latihan
 */
function getExerciseAnimationSvg(type, isPlaying = true) {
    const playState = isPlaying ? 'running' : 'paused';
    
    switch (type) {
        case 'pushup':
            return `
            <svg viewBox="0 0 400 240" class="exercise-anim-svg" style="--play-state: ${playState}">
                <defs>
                    <linearGradient id="gymMatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#1e293b"/>
                        <stop offset="100%" stop-color="#0f172a"/>
                    </linearGradient>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#22c55e"/>
                        <stop offset="100%" stop-color="#10b981"/>
                    </linearGradient>
                    <linearGradient id="muscleHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#eab308"/>
                        <stop offset="100%" stop-color="#ef4444"/>
                    </linearGradient>
                    <filter id="glowEffect">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <style>
                    @keyframes pushupMotion {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(58px) rotate(-3deg); }
                    }
                    @keyframes pushupArmL {
                        0%, 100% { d: path("M 125 105 L 122 175 L 120 185"); }
                        50% { d: path("M 125 163 L 95 165 L 120 185"); }
                    }
                    @keyframes chestPulse {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 8px #ef4444); }
                    }
                    .anim-pushup-torso {
                        animation: pushupMotion 3s ease-in-out infinite var(--play-state);
                        transform-origin: 320px 185px;
                    }
                    .anim-chest-glow {
                        animation: chestPulse 3s ease-in-out infinite var(--play-state);
                        transform-origin: 155px 105px;
                    }
                </style>

                <!-- Lantai & Gym Matras -->
                <rect x="20" y="195" width="360" height="8" rx="4" fill="url(#gymMatGrad)" stroke="#334155" stroke-width="1.5"/>
                <line x1="40" y1="195" x2="360" y2="195" stroke="#22c55e" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>

                <!-- Push-up Body Group -->
                <g class="anim-pushup-torso">
                    <!-- Head -->
                    <circle cx="85" cy="85" r="16" fill="url(#bodyGrad)" stroke="#0f172a" stroke-width="2"/>
                    <!-- Neck -->
                    <path d="M 98 90 L 115 98" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>
                    
                    <!-- Torso & Pelvis -->
                    <path d="M 115 98 L 240 135" stroke="url(#bodyGrad)" stroke-width="22" stroke-linecap="round"/>
                    
                    <!-- Chest Muscle Heatmap Indicator -->
                    <circle cx="140" cy="106" r="11" fill="url(#muscleHighlight)" class="anim-chest-glow" opacity="0.9"/>
                    
                    <!-- Legs -->
                    <path d="M 240 135 L 320 178" stroke="#059669" stroke-width="16" stroke-linecap="round"/>
                    <!-- Feet Pivot on Floor -->
                    <circle cx="320" cy="183" r="7" fill="#64748b"/>

                    <!-- Arm & Elbow Joint -->
                    <path class="anim-pushup-arm" d="M 125 105 L 122 175 L 120 185" stroke="#38bdf8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <!-- Hand on Floor -->
                    <rect x="110" y="185" width="22" height="8" rx="4" fill="#94a3b8"/>
                </g>

                <!-- Indicator Labels -->
                <text x="140" y="40" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1">PUSH-UP CYCLE: CONCENTRIC & ECCENTRIC</text>
                <text x="320" y="222" fill="#64748b" font-size="10" text-anchor="middle">Titik Pivot Kaki</text>
                <text x="120" y="222" fill="#38bdf8" font-size="10" text-anchor="middle">Tumpuan Dada & Tangan</text>
            </svg>
            `;

        case 'squat':
            return `
            <svg viewBox="0 0 400 240" class="exercise-anim-svg" style="--play-state: ${playState}">
                <defs>
                    <linearGradient id="squatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#22c55e"/>
                        <stop offset="100%" stop-color="#06b6d4"/>
                    </linearGradient>
                </defs>
                <style>
                    @keyframes squatFull {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(48px); }
                    }
                    @keyframes quadGlow {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 0.95; filter: drop-shadow(0 0 6px #f59e0b); }
                    }
                    .anim-squat-torso {
                        animation: squatFull 3.2s ease-in-out infinite var(--play-state);
                    }
                    .anim-quads-glow {
                        animation: quadGlow 3.2s ease-in-out infinite var(--play-state);
                    }
                </style>

                <!-- Lantai -->
                <line x1="60" y1="210" x2="340" y2="210" stroke="#334155" stroke-width="3"/>
                <circle cx="165" cy="209" r="6" fill="#64748b"/>
                <circle cx="235" cy="209" r="6" fill="#64748b"/>

                <!-- Body Squat Group -->
                <g class="anim-squat-torso">
                    <!-- Head -->
                    <circle cx="200" cy="50" r="16" fill="url(#squatGrad)" stroke="#0f172a" stroke-width="2"/>
                    <!-- Spine / Torso -->
                    <line x1="200" y1="66" x2="200" y2="120" stroke="#10b981" stroke-width="18" stroke-linecap="round"/>
                    
                    <!-- Arms Forward for Counterbalance -->
                    <path d="M 200 78 L 245 92 L 270 92" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/>
                    
                    <!-- Pelvis -->
                    <circle cx="200" cy="120" r="9" fill="#047857"/>

                    <!-- Thighs / Quadriceps Activation Heatmap -->
                    <line x1="200" y1="120" x2="165" y2="165" stroke="#f59e0b" stroke-width="14" stroke-linecap="round" class="anim-quads-glow"/>
                    <line x1="200" y1="120" x2="235" y2="165" stroke="#f59e0b" stroke-width="14" stroke-linecap="round" class="anim-quads-glow"/>

                    <!-- Shin & Calf to Feet -->
                    <line x1="165" y1="165" x2="165" y2="209" stroke="#059669" stroke-width="11" stroke-linecap="round"/>
                    <line x1="235" y1="165" x2="235" y2="209" stroke="#059669" stroke-width="11" stroke-linecap="round"/>
                </g>

                <text x="200" y="26" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">SQUAT: 90° PARALLEL DEPTH</text>
                <text x="200" y="232" fill="#94a3b8" font-size="10" text-anchor="middle">Tumpuan Kokoh di Tumit, Dada Tetap Terbuka</text>
            </svg>
            `;

        case 'plank':
            return `
            <svg viewBox="0 0 400 240" class="exercise-anim-svg" style="--play-state: ${playState}">
                <style>
                    @keyframes corePulse {
                        0%, 100% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 10px #22c55e); }
                    }
                    .anim-core-pulse {
                        animation: corePulse 2s ease-in-out infinite var(--play-state);
                        transform-origin: 200px 135px;
                    }
                </style>
                <!-- Lantai & Matras -->
                <rect x="30" y="180" width="340" height="8" rx="4" fill="#1e293b" stroke="#334155"/>
                
                <!-- Head -->
                <circle cx="100" cy="115" r="14" fill="#22c55e"/>
                <!-- Torso Line -->
                <line x1="110" y1="124" x2="260" y2="148" stroke="#10b981" stroke-width="18" stroke-linecap="round"/>
                
                <!-- Core Tension Heatmap Bubble -->
                <circle cx="195" cy="136" r="16" fill="#eab308" class="anim-core-pulse"/>
                
                <!-- Legs -->
                <line x1="260" y1="148" x2="330" y2="175" stroke="#059669" stroke-width="13" stroke-linecap="round"/>
                <!-- Toes on Ground -->
                <circle cx="330" cy="178" r="6" fill="#64748b"/>

                <!-- Forearms & Elbows Form 90 deg -->
                <path d="M 125 125 L 125 178 L 155 178" stroke="#38bdf8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>

                <text x="200" y="45" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">ISOMETRIC CORE TENSION</text>
                <text x="195" y="105" fill="#eab308" font-size="10" font-weight="600" text-anchor="middle">Core Terkunci Rapat</text>
            </svg>
            `;

        case 'crunch':
            return `
            <svg viewBox="0 0 400 240" class="exercise-anim-svg" style="--play-state: ${playState}">
                <style>
                    @keyframes crunchMotion {
                        0%, 100% { transform: rotate(0deg); }
                        50% { transform: rotate(-22deg); }
                    }
                    @keyframes absCompress {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 0.95; filter: drop-shadow(0 0 8px #ef4444); }
                    }
                    .anim-crunch-upper {
                        animation: crunchMotion 2.6s ease-in-out infinite var(--play-state);
                        transform-origin: 190px 175px;
                    }
                    .anim-abs-compress {
                        animation: absCompress 2.6s ease-in-out infinite var(--play-state);
                    }
                </style>
                <line x1="30" y1="185" x2="370" y2="185" stroke="#334155" stroke-width="4"/>

                <!-- Lower Body (Pelvis & Bent Knees) -->
                <path d="M 190 175 L 260 120 L 290 185" stroke="#059669" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <!-- Feet on Mat -->
                <circle cx="290" cy="185" r="7" fill="#64748b"/>

                <!-- Sixpack Heatmap Area -->
                <circle cx="170" cy="165" r="13" fill="#ef4444" class="anim-abs-compress"/>

                <!-- Upper Body Crunching -->
                <g class="anim-crunch-upper">
                    <line x1="190" y1="175" x2="110" y2="170" stroke="#10b981" stroke-width="16" stroke-linecap="round"/>
                    <circle cx="95" cy="165" r="14" fill="#22c55e"/>
                    <!-- Hands behind head -->
                    <path d="M 125 170 L 100 150 L 90 162" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
                </g>

                <text x="200" y="40" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">ABDOMINAL CONTRACTION</text>
                <text x="200" y="215" fill="#94a3b8" font-size="10" text-anchor="middle">Punggung Bawah Tetap Menempel di Matras</text>
            </svg>
            `;

        case 'climber':
            return `
            <svg viewBox="0 0 400 240" class="exercise-anim-svg" style="--play-state: ${playState}">
                <style>
                    @keyframes climberLegA {
                        0%, 100% { d: path("M 250 125 L 180 155 L 200 185"); }
                        50% { d: path("M 250 125 L 290 160 L 330 185"); }
                    }
                    @keyframes climberLegB {
                        0%, 100% { d: path("M 250 125 L 290 160 L 330 185"); }
                        50% { d: path("M 250 125 L 180 155 L 200 185"); }
                    }
                    .anim-leg-a { animation: climberLegA 1.4s ease-in-out infinite var(--play-state); }
                    .anim-leg-b { animation: climberLegB 1.4s ease-in-out infinite var(--play-state); }
                </style>
                <line x1="40" y1="190" x2="360" y2="190" stroke="#334155" stroke-width="3"/>
                
                <!-- Arms Fixed in High Plank -->
                <line x1="120" y1="100" x2="120" y2="190" stroke="#38bdf8" stroke-width="9" stroke-linecap="round"/>
                <!-- Head & Torso -->
                <circle cx="95" cy="88" r="14" fill="#22c55e"/>
                <line x1="105" y1="95" x2="250" y2="125" stroke="#10b981" stroke-width="16" stroke-linecap="round"/>

                <!-- Dynamic Pumping Legs -->
                <path class="anim-leg-a" d="M 250 125 L 180 155 L 200 185" stroke="#f59e0b" stroke-width="11" stroke-linecap="round" fill="none"/>
                <path class="anim-leg-b" d="M 250 125 L 290 160 L 330 185" stroke="#059669" stroke-width="11" stroke-linecap="round" fill="none"/>

                <text x="200" y="38" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">MOUNTAIN CLIMBERS: HIGH TEMPO</text>
                <text x="200" y="215" fill="#94a3b8" font-size="10" text-anchor="middle">Bahu Stabil di Atas Pergelangan Tangan</text>
            </svg>
            `;

        case 'jumping_jack':
            return `
            <svg viewBox="0 0 400 240" class="exercise-anim-svg" style="--play-state: ${playState}">
                <style>
                    @keyframes jackLegL {
                        0%, 100% { x2: 175; y2: 200; }
                        50% { x2: 130; y2: 195; }
                    }
                    @keyframes jackLegR {
                        0%, 100% { x2: 225; y2: 200; }
                        50% { x2: 270; y2: 195; }
                    }
                    @keyframes jackArmL {
                        0%, 100% { d: path("M 190 85 L 165 140"); }
                        50% { d: path("M 190 85 L 140 40"); }
                    }
                    @keyframes jackArmR {
                        0%, 100% { d: path("M 210 85 L 235 140"); }
                        50% { d: path("M 210 85 L 260 40"); }
                    }
                    .anim-jack-leg-l { animation: jackLegL 1.2s ease-in-out infinite var(--play-state); }
                    .anim-jack-leg-r { animation: jackLegR 1.2s ease-in-out infinite var(--play-state); }
                    .anim-jack-arm-l { animation: jackArmL 1.2s ease-in-out infinite var(--play-state); }
                    .anim-jack-arm-r { animation: jackArmR 1.2s ease-in-out infinite var(--play-state); }
                </style>
                <line x1="60" y1="205" x2="340" y2="205" stroke="#334155" stroke-width="3"/>
                <!-- Head -->
                <circle cx="200" cy="50" r="14" fill="#22c55e"/>
                <!-- Torso -->
                <line x1="200" y1="64" x2="200" y2="135" stroke="#10b981" stroke-width="16" stroke-linecap="round"/>
                
                <!-- Arms Dynamic -->
                <path class="anim-jack-arm-l" d="M 190 85 L 165 140" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" fill="none"/>
                <path class="anim-jack-arm-r" d="M 210 85 L 235 140" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" fill="none"/>

                <!-- Legs Dynamic -->
                <line class="anim-jack-leg-l" x1="200" y1="135" x2="175" y2="200" stroke="#059669" stroke-width="11" stroke-linecap="round"/>
                <line class="anim-jack-leg-r" x1="200" y1="135" x2="225" y2="200" stroke="#059669" stroke-width="11" stroke-linecap="round"/>

                <text x="200" y="24" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">CARDIO FULL BODY CYCLE</text>
            </svg>
            `;

        default:
            // Fallback Generic Fitness Athlete Animation
            return `
            <svg viewBox="0 0 400 240" class="exercise-anim-svg" style="--play-state: ${playState}">
                <defs>
                    <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#22c55e"/>
                        <stop offset="100%" stop-color="#38bdf8"/>
                    </linearGradient>
                </defs>
                <style>
                    @keyframes pulsePulse {
                        0%, 100% { transform: scale(1); opacity: 0.8; }
                        50% { transform: scale(1.05); opacity: 1; }
                    }
                    .anim-gen { animation: pulsePulse 2s ease-in-out infinite var(--play-state); transform-origin: 200px 120px; }
                </style>
                <rect x="50" y="195" width="300" height="6" rx="3" fill="#334155"/>
                <g class="anim-gen">
                    <circle cx="200" cy="70" r="18" fill="url(#genGrad)"/>
                    <line x1="200" y1="90" x2="200" y2="150" stroke="#10b981" stroke-width="16" stroke-linecap="round"/>
                    <path d="M 175 105 L 200 95 L 225 105" stroke="#38bdf8" stroke-width="10" stroke-linecap="round" fill="none"/>
                    <line x1="200" y1="150" x2="180" y2="195" stroke="#059669" stroke-width="12" stroke-linecap="round"/>
                    <line x1="200" y1="150" x2="220" y2="195" stroke="#059669" stroke-width="12" stroke-linecap="round"/>
                    <circle cx="200" cy="120" r="14" fill="#eab308" opacity="0.6"/>
                </g>
                <text x="200" y="35" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">ACTIVE BIOMECHANIC FORM</text>
            </svg>
            `;
    }
}

// Export global database
window.EXERCISE_DATABASE = EXERCISE_DATABASE;
window.getExerciseAnimationSvg = getExerciseAnimationSvg;
