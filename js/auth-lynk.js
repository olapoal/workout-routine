/**
 * js/auth-lynk.js
 * Manajemen Lisensi Pembelian Lynk.id & Lock Screen Paywall
 */

const AUTH_CONFIG = {
    PRODUCT_NAME: "[WORKOUT] Aplikasi Workout Routine Pro",
    LYNK_PRODUCT_URL: "https://lynk.id/olapoal", // Ganti dengan tautan produk Lynk.id Anda
    VERIFY_ENDPOINT: "/.netlify/functions/verify-email",
    STORAGE_KEY_EMAIL: "workout_user_email",
    STORAGE_KEY_NAME: "workout_user_name",
    STORAGE_KEY_PLAN: "workout_user_plan",
    STORAGE_KEY_TOKEN: "workout_license_token",
    STORAGE_KEY_DEMO: "workout_demo_mode"
};

class LynkAuthManager {
    constructor() {
        this.isUnlocked = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        // 1. Periksa parameter URL (misalnya redirect dari Lynk.id: ?email=buyer@domain.com)
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email') || urlParams.get('customer_email');

        if (emailFromUrl) {
            console.log("Mendeteksi parameter email dari URL Lynk.id:", emailFromUrl);
            this.verifyAndUnlock(emailFromUrl, true);
            return;
        }

        // 2. Periksa penyimpanan lokal browser (localStorage)
        const savedEmail = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_EMAIL);
        const isDemo = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_DEMO) === 'true';

        if (isDemo) {
            this.unlockApp({
                email: 'demo@workout.app',
                name: 'Pengguna Demo (Uji Coba)',
                plan: 'Demo Mode'
            });
            return;
        }

        if (savedEmail) {
            this.unlockApp({
                email: savedEmail,
                name: localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_NAME) || savedEmail,
                plan: localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_PLAN) || 'VIP Lifetime Access'
            });
        } else {
            this.lockApp();
        }
    }

    async verifyAndUnlock(email, isFromUrl = false) {
        email = (email || '').trim().toLowerCase();
        if (!email || !email.includes('@')) {
            alert('Silakan masukkan format alamat email yang valid.');
            return false;
        }

        const btnVerify = document.getElementById('btnSubmitEmail');
        const feedbackEl = document.getElementById('authFeedbackMessage');

        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memverifikasi di Lynk.id...';
        }
        if (feedbackEl) {
            feedbackEl.className = 'auth-feedback text-info';
            feedbackEl.innerText = 'Menghubungkan ke database Lynk.id...';
        }

        try {
            // Coba verifikasi ke endpoint Netlify Function
            const res = await fetch(AUTH_CONFIG.VERIFY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                // Berhasil terverifikasi
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_EMAIL, data.email || email);
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_NAME, data.name || email);
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_PLAN, data.plan || 'VIP Lifetime Access');
                localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_DEMO);

                this.unlockApp(data);

                if (feedbackEl) {
                    feedbackEl.className = 'auth-feedback text-success';
                    feedbackEl.innerText = 'Verifikasi Berhasil! Selamat datang di Aplikasi Workout Routine Pro.';
                }

                // Bersihkan URL dari parameter tanpa reload
                if (isFromUrl) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                return true;
            } else {
                // Jika gagal di API (atau serverless belum dideploy / running lokal di file://)
                // Berikan fallback cerdas jika berjalan lokal (file:// atau localhost tanpa netlify)
                const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
                
                if (isLocalHost) {
                    console.warn("Local environment terdeteksi. Mengizinkan email untuk pengetesan lokal.");
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_EMAIL, email);
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_NAME, 'Trainee VIP (Local)');
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_PLAN, 'VIP Lifetime Access');
                    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_DEMO);

                    this.unlockApp({ email, name: 'Trainee VIP', plan: 'VIP Lifetime Access' });
                    return true;
                }

                if (feedbackEl) {
                    feedbackEl.className = 'auth-feedback text-danger';
                    feedbackEl.innerText = data.message || 'Email belum terdaftar sebagai pembeli di Lynk.id. Pastikan Anda sudah checkout.';
                }
                return false;
            }
        } catch (netErr) {
            console.warn("Netlify function verify-email uncontactable:", netErr);
            
            // Jika berjalan di file:// atau server lokal tanpa function aktif
            const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost';
            if (isLocal) {
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_EMAIL, email);
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_NAME, 'Trainee VIP');
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_PLAN, 'VIP Lifetime Access');
                this.unlockApp({ email, name: 'Trainee VIP', plan: 'VIP Lifetime Access' });
                return true;
            }

            if (feedbackEl) {
                feedbackEl.className = 'auth-feedback text-danger';
                feedbackEl.innerText = 'Koneksi ke server verifikasi terputus. Pastikan koneksi internet Anda aktif.';
            }
            return false;
        } finally {
            if (btnVerify) {
                btnVerify.disabled = false;
                btnVerify.innerHTML = 'Buka Akses Aplikasi Sekarang <i class="fas fa-arrow-right ms-2"></i>';
            }
        }
    }

    startDemoMode() {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_DEMO, 'true');
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_EMAIL, 'demo@workout.app');
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_NAME, 'Pengguna Demo');
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_PLAN, 'Demo Trial Mode');

        this.unlockApp({
            email: 'demo@workout.app',
            name: 'Pengguna Demo',
            plan: 'Demo Trial Mode'
        });
    }

    unlockApp(userData) {
        this.isUnlocked = true;
        this.currentUser = userData;

        const lockOverlay = document.getElementById('lynkPaywallModal');
        if (lockOverlay) {
            lockOverlay.classList.remove('active');
            lockOverlay.style.display = 'none';
        }

        // Tampilkan license pill di header navbar
        const userBadge = document.getElementById('navbarUserLicense');
        if (userBadge) {
            userBadge.innerHTML = `
                <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill d-inline-flex align-items-center">
                    <span class="status-dot-active me-2"></span>
                    <i class="fas fa-shield-alt me-1"></i> ${userData.email} (${userData.plan || 'VIP'})
                </span>
            `;
            userBadge.classList.remove('d-none');
        }

        // Tampilkan tombol logout lisensi
        const logoutBtn = document.getElementById('btnRevokeLicense');
        if (logoutBtn) {
            logoutBtn.classList.remove('d-none');
        }
    }

    lockApp() {
        this.isUnlocked = false;
        this.currentUser = null;

        const lockOverlay = document.getElementById('lynkPaywallModal');
        if (lockOverlay) {
            lockOverlay.classList.add('active');
            lockOverlay.style.display = 'flex';
        }

        const userBadge = document.getElementById('navbarUserLicense');
        if (userBadge) {
            userBadge.classList.add('d-none');
        }
    }

    logout() {
        if (confirm("Apakah Anda yakin ingin mengeluarkan lisensi email ini dari perangkat?")) {
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_EMAIL);
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_NAME);
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_PLAN);
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_DEMO);
            window.location.reload();
        }
    }
}

// Global Export
window.LynkAuthManager = LynkAuthManager;
window.AUTH_CONFIG = AUTH_CONFIG;
