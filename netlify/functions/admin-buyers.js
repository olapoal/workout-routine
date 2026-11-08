// netlify/functions/admin-buyers.js
// Endpoint internal khusus Admin untuk memanajemen data pembeli Workout Routine
// Mendukung dual storage: Netlify Blobs & Supabase Database

exports.handler = async function(event, context) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    const adminSecret = process.env.ADMIN_KEY || "workout-admin-secret-2026";
    const requestKey = event.headers["x-admin-key"] || event.queryStringParameters?.key;

    if (requestKey !== adminSecret) {
        return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Akses Ditolak: Kunci Admin Tidak Valid" })
        };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

    let store;
    try {
        const { getStore } = require("@netlify/blobs");
        store = getStore("workout_buyers");
    } catch (e) {
        console.warn("Blobs store init notice:", e.message);
    }

    // 1. GET: Ambil daftar seluruh pembeli
    if (event.httpMethod === "GET") {
        try {
            const buyersMap = new Map();

            // Ambil dari Supabase jika ada
            if (supabaseUrl && supabaseKey) {
                try {
                    const cleanUrl = supabaseUrl.replace(/\/$/, "");
                    const endpoint = `${cleanUrl}/rest/v1/workout_buyers?select=*&order=created_at.desc`;
                    const res = await fetch(endpoint, {
                        headers: {
                            "apikey": supabaseKey,
                            "Authorization": `Bearer ${supabaseKey}`
                        }
                    });
                    if (res.ok) {
                        const supaRows = await res.json();
                        (supaRows || []).forEach(r => {
                            if (r.email) buyersMap.set(r.email.toLowerCase(), r);
                        });
                    }
                } catch (supaErr) {
                    console.warn("Supabase admin list error:", supaErr.message);
                }
            }

            // Ambil dari Blobs jika ada
            if (store) {
                try {
                    const { blobs } = await store.list();
                    for (const item of blobs) {
                        try {
                            const data = await store.get(item.key, { type: "json" });
                            if (data && data.email) {
                                buyersMap.set(data.email.toLowerCase(), { ...data, source: "blobs" });
                            }
                        } catch (e) {}
                    }
                } catch (blobsErr) {
                    console.warn("Blobs admin list error:", blobsErr.message);
                }
            }

            const buyers = Array.from(buyersMap.values());
            buyers.sort((a, b) => new Date(b.purchased_at || b.created_at || 0) - new Date(a.purchased_at || a.created_at || 0));

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ buyers, count: buyers.length })
            };
        } catch (err) {
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: err.message })
            };
        }
    }

    // 2. POST: Tambah email pembeli secara manual oleh admin
    if (event.httpMethod === "POST") {
        try {
            const body = JSON.parse(event.body || "{}");
            const email = (body.email || "").trim().toLowerCase();
            const name = (body.name || "Trainee Manual").trim();

            if (!email || !email.includes("@")) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Email tidak valid" })
                };
            }

            const newBuyer = {
                email: email,
                name: name,
                order_id: body.order_id || `MANUAL-${Date.now()}`,
                product_name: "[WORKOUT] Aplikasi Workout Routine Pro",
                plan: "VIP Lifetime Access",
                purchased_at: new Date().toISOString(),
                status: "active",
                source: "manual-admin"
            };

            // Simpan ke Supabase jika aktif
            if (supabaseUrl && supabaseKey) {
                try {
                    const cleanUrl = supabaseUrl.replace(/\/$/, "");
                    await fetch(`${cleanUrl}/rest/v1/workout_buyers`, {
                        method: "POST",
                        headers: {
                            "apikey": supabaseKey,
                            "Authorization": `Bearer ${supabaseKey}`,
                            "Content-Type": "application/json",
                            "Prefer": "resolution=merge-duplicates"
                        },
                        body: JSON.stringify(newBuyer)
                    });
                } catch (supaErr) {
                    console.error("Gagal simpan ke Supabase:", supaErr.message);
                }
            }

            // Simpan ke Blobs jika aktif
            if (store) {
                try {
                    await store.setJSON(email, newBuyer);
                } catch (blobsErr) {
                    console.error("Gagal simpan ke Blobs:", blobsErr.message);
                }
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ success: true, message: `Email ${email} berhasil didaftarkan`, buyer: newBuyer })
            };
        } catch (err) {
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: err.message })
            };
        }
    }

    // 3. DELETE: Hapus akses email pembeli
    if (event.httpMethod === "DELETE") {
        try {
            const email = (event.queryStringParameters?.email || "").trim().toLowerCase();

            if (!email) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Email target diperlukan" })
                };
            }

            // Hapus dari Supabase jika aktif
            if (supabaseUrl && supabaseKey) {
                try {
                    const cleanUrl = supabaseUrl.replace(/\/$/, "");
                    await fetch(`${cleanUrl}/rest/v1/workout_buyers?email=eq.${encodeURIComponent(email)}`, {
                        method: "DELETE",
                        headers: {
                            "apikey": supabaseKey,
                            "Authorization": `Bearer ${supabaseKey}`
                        }
                    });
                } catch (supaErr) {
                    console.error("Gagal hapus dari Supabase:", supaErr.message);
                }
            }

            // Hapus dari Blobs jika aktif
            if (store) {
                try {
                    await store.delete(email);
                } catch (blobsErr) {
                    console.error("Gagal hapus dari Blobs:", blobsErr.message);
                }
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ success: true, message: `Akses email ${email} berhasil dicabut` })
            };
        } catch (err) {
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: err.message })
            };
        }
    }

    return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Method Not Allowed" })
    };
};
