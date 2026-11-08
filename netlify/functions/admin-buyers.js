// netlify/functions/admin-buyers.js
// Endpoint internal khusus Admin untuk memanajemen data pembeli Workout Routine

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
            if (!store) {
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({ buyers: [], count: 0, note: "Blobs tidak aktif di environment local" })
                };
            }

            const { blobs } = await store.list();
            const buyers = [];

            for (const item of blobs) {
                try {
                    const data = await store.get(item.key, { type: "json" });
                    if (data) buyers.push(data);
                } catch (readErr) {
                    buyers.push({ email: item.key, error: "Gagal membaca detail" });
                }
            }

            buyers.sort((a, b) => new Date(b.purchased_at || 0) - new Date(a.purchased_at || 0));

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
                purchased_at: new Date().toISOString(),
                status: "active",
                source: "manual-admin"
            };

            if (store) {
                await store.setJSON(email, newBuyer);
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
                    body: JSON.stringify({ error: "Parameter email wajib diisi" })
                };
            }

            if (store) {
                await store.delete(email);
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
