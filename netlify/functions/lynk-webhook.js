// netlify/functions/lynk-webhook.js
// Endpoint ini menerima notifikasi saat customer selesai membayar di Lynk.id

exports.handler = async function(event, context) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    try {
        const payload = JSON.parse(event.body || "{}");
        console.log("Lynk.id Workout Webhook incoming payload:", JSON.stringify(payload));

        // Ekstraksi data customer dari berbagai format payload Lynk.id
        const email = (
            payload.customer_email ||
            payload.email ||
            payload.data?.customer_email ||
            payload.data?.email ||
            payload.buyer_email ||
            payload.customer?.email ||
            ""
        ).trim().toLowerCase();

        const name = (
            payload.customer_name ||
            payload.name ||
            payload.data?.customer_name ||
            payload.data?.name ||
            payload.customer?.name ||
            "Trainee Lynk.id"
        );

        const orderId = (
            payload.order_id ||
            payload.transaction_id ||
            payload.id ||
            payload.data?.order_id ||
            payload.data?.id ||
            `LYNK-WO-${Date.now()}`
        );

        const phone = (
            payload.customer_phone ||
            payload.phone ||
            payload.data?.customer_phone ||
            payload.data?.phone ||
            ""
        );

        const productName = (
            payload.product_name ||
            payload.product ||
            payload.title ||
            payload.item_name ||
            payload.data?.product_name ||
            payload.data?.title ||
            ""
        );

        // Filter Proteksi Multi-Produk: Jika ada nama produk tapi bukan produk [WORKOUT], lewati transaksi ini
        if (productName) {
            const lowerProduct = productName.toLowerCase();
            const isWorkoutProduct = lowerProduct.includes("[workout]") || 
                                     lowerProduct.includes("workout") || 
                                     lowerProduct.includes("gym") || 
                                     lowerProduct.includes("fitness") ||
                                     lowerProduct.includes("exercise") ||
                                     lowerProduct.includes("latihan");
            if (!isWorkoutProduct) {
                console.log(`Transaksi diabaikan karena bukan produk Workout: ${productName}`);
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        success: false,
                        ignored: true,
                        message: `Transaksi diabaikan: produk '${productName}' bukan produk Workout Routine.`
                    })
                };
            }
        }

        if (!email || !email.includes("@")) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Email customer tidak valid dalam payload Lynk.id" })
            };
        }

        const buyerRecord = {
            email: email,
            name: name,
            phone: phone,
            order_id: orderId,
            product_name: productName || "[WORKOUT] Aplikasi Workout Routine Pro",
            purchased_at: new Date().toISOString(),
            status: "active",
            source: "lynk.id"
        };

        // 1. Simpan ke Netlify Blobs (Database Cloud Permanen bawaan Netlify)
        let savedToBlobs = false;
        try {
            const { getStore } = require("@netlify/blobs");
            const store = getStore("workout_buyers");
            await store.setJSON(email, buyerRecord);
            savedToBlobs = true;
            console.log(`Berhasil menyimpan ${email} ke Netlify Blobs (workout_buyers)`);
        } catch (blobsErr) {
            console.error("Gagal menyimpan ke Netlify Blobs:", blobsErr.message);
        }

        // 2. Simpan ke Supabase Database jika ada env variables (Opsional / Backup)
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
        let savedToSupabase = false;

        if (supabaseUrl && supabaseKey) {
            try {
                const cleanUrl = supabaseUrl.replace(/\/$/, "");
                const endpoint = `${cleanUrl}/rest/v1/workout_buyers`;

                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "apikey": supabaseKey,
                        "Authorization": `Bearer ${supabaseKey}`,
                        "Content-Type": "application/json",
                        "Prefer": "resolution=merge-duplicates"
                    },
                    body: JSON.stringify(buyerRecord)
                });

                if (res.ok) {
                    savedToSupabase = true;
                }
            } catch (supaErr) {
                console.error("Gagal simpan ke Supabase:", supaErr.message);
            }
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: `Akses berhasil diaktifkan untuk email ${email}`,
                email: email,
                name: name,
                order_id: orderId,
                storage: {
                    blobs: savedToBlobs,
                    supabase: savedToSupabase
                }
            })
        };

    } catch (err) {
        console.error("Webhook processing error:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: err.message })
        };
    }
};
