const BOT_TOKEN = "8199922853:AAFKj9W4Sqow7LIBJ2CaSxrvs6te32_rrTs";  // Ganti dengan token bot Anda
const ADMIN_ID = "1980888203";    // Ganti dengan ID admin
const webhookUrl = `https://bot-forward.henot20561.workers.dev`;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/setWebhook") {
            return await setWebhook(env);
        }

        if (url.pathname === "/unsetWebhook") {
            return await unsetWebhook(env);
        }

        if (request.method === "POST") {
            const data = await request.json();
            return await handleUpdate(data, env);
        }

        return new Response("Cloudflare Telegram Bot", { status: 200 });
    }
};

async function handleUpdate(update, env) {
    if (!update.message) return new Response("No message", { status: 200 });

    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text || "";

    // Jika user mengirim /start
    if (text === "/start") {
        const keyboard = {
            inline_keyboard: [
                [{ text: "SOURCE CODE", url: "https://ouo.io/Sjev3s" }]
            ]
        };

        await sendMessage(chatId, "Bot aktif\nKirimkan pesan apa saja dan admin akan segera membalas🥱", keyboard);
        return new Response("Sent start message", { status: 200 });
    }

    // Jika admin mengirim pesan tanpa mereply pesan terusan
    if (chatId == ADMIN_ID && !message.reply_to_message) {
        await sendMessage(chatId, "Reply pesan yang di-forward");
        return new Response("Admin did not reply to forwarded message", { status: 200 });
    }

    // Jika admin membalas pesan yang diforward
    if (chatId == ADMIN_ID && message.reply_to_message) {
        const originalMsgId = await env.nfd.get(`reply_${message.reply_to_message.message_id}`);
        if (originalMsgId) {
            if (message.text) {
                // Balasan berupa teks
                await sendMessage(originalMsgId, message.text);
            } else if (message.photo) {
                // Balasan berupa foto
                await sendMedia(originalMsgId, "photo", message.photo[message.photo.length - 1].file_id);
            } else if (message.video) {
                // Balasan berupa video
                await sendMedia(originalMsgId, "video", message.video.file_id);
            } else if (message.document) {
                // Balasan berupa dokumen
                await sendMedia(originalMsgId, "document", message.document.file_id);
            } else if (message.sticker) {
                // Balasan berupa stiker
                await sendMedia(originalMsgId, "sticker", message.sticker.file_id);
            }
            return new Response("Admin reply sent", { status: 200 });
        }
    }

    // Cek apakah pesan user sudah pernah diforward sebelumnya
    const existingForward = await env.nfd.get(`forwarded_${message.message_id}`);
    if (existingForward) {
        return new Response("Message already forwarded", { status: 200 });
    }

    // Forward pesan user ke admin
    const forward = await forwardMessage(ADMIN_ID, chatId, message.message_id);
    if (forward && forward.result && forward.result.message_id) {
        await env.nfd.put(`reply_${forward.result.message_id}`, chatId);
        await env.nfd.put(`forwarded_${message.message_id}`, "true"); // Tandai pesan sudah diforward
    }

    return new Response("Message handled", { status: 200 });
}

// Fungsi untuk mengirim media (foto, video, dokumen, stiker, dll.)
async function sendMedia(chatId, mediaType, fileId) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/send${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`;
    const body = JSON.stringify({
        chat_id: chatId,
        [mediaType === "photo" ? "photo" : mediaType === "sticker" ? "sticker" : mediaType === "video" ? "video" : mediaType]: fileId
    });

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    const data = await res.json();

    if (!res.ok) {
        console.error(`Failed to send ${mediaType}:`, data);
        return new Response(`Failed to send ${mediaType}`, { status: 500 });
    }

    return data;
}


// Fungsi utama menangani pesan masuk
async function handleUpdateWORK(update, env) {
    if (!update.message) return new Response("No message", { status: 200 });

    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text || "";
    
    // Jika user mengirim /start
    if (text === "/start") {
        const keyboard = {
            inline_keyboard: [
                [{ text: "SOURCE CODE", url: "https://ouo.io/Sjev3s" }]
            ]
        };

        await sendMessage(chatId, "Bot aktif\n\nKirimkan pesan apa saja dan admin akan membalas secepatnya", keyboard);
        return new Response("Sent start message", { status: 200 });
    }

    // Jika admin mengirim pesan tanpa mereply pesan terusan
    if (chatId == ADMIN_ID && !message.reply_to_message) {
        await sendMessage(chatId, "Reply pesan yang di-forward");
        return new Response("Admin did not reply to forwarded message", { status: 200 });
    }

    // Jika admin membalas pesan yang diforward
    if (chatId == ADMIN_ID && message.reply_to_message) {
        const originalMsgId = await env.nfd.get(`reply_${message.reply_to_message.message_id}`);
        if (originalMsgId) {
            if (message.text) {
                // Balasan berupa teks
                await sendMessage(originalMsgId, message.text);
            } else if (message.photo) {
                // Balasan berupa foto
                await sendMedia(originalMsgId, "photo", message.photo[message.photo.length - 1].file_id);
            } else if (message.video) {
                // Balasan berupa video
                await sendMedia(originalMsgId, "video", message.video.file_id);
            } else if (message.document) {
                // Balasan berupa dokumen
                await sendMedia(originalMsgId, "document", message.document.file_id);
            }
            return new Response("Admin reply sent", { status: 200 });
        }
    }

    // Cek apakah pesan user sudah pernah diforward sebelumnya
    const existingForward = await env.nfd.get(`forwarded_${message.message_id}`);
    if (existingForward) {
        return new Response("Message already forwarded", { status: 200 });
    }

    // Forward pesan user ke admin
    const forward = await forwardMessage(ADMIN_ID, chatId, message.message_id);
    if (forward && forward.result && forward.result.message_id) {
        await env.nfd.put(`reply_${forward.result.message_id}`, chatId);
        await env.nfd.put(`forwarded_${message.message_id}`, "true"); // Tandai pesan sudah diforward
    }

    return new Response("Message handled", { status: 200 });
}

// Fungsi untuk mengirim pesan
async function sendMessageWORK(chatId, text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const body = JSON.stringify({ chat_id: chatId, text });

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    const data = await res.json();

    if (!res.ok) {
        console.error("Failed to send message:", data);
        return new Response("Failed to send message", { status: 500 });
    }

    return data;
}



// Fungsi untuk mengirim pesan dengan tombol
async function sendMessage(chatId, text, keyboard = null) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const body = JSON.stringify({
        chat_id: chatId,
        text: text,
        reply_markup: keyboard ? JSON.stringify(keyboard) : undefined
    });

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    const data = await res.json();

    if (!res.ok) {
        console.error("Failed to send message:", data);
        return new Response("Failed to send message", { status: 500 });
    }

    return data;
}


// Fungsi untuk meneruskan pesan
async function forwardMessage(to, from, message_id) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/forwardMessage`;
    const body = JSON.stringify({ chat_id: to, from_chat_id: from, message_id });

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    const data = await res.json();

    if (!res.ok || !data.result) {
        console.error("Failed to forward message:", data);
        return null;
    }

    return data;
}

// Fungsi untuk mengatur webhook
async function setWebhook(env) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`;
    await fetch(url, { method: "GET" });
    return new Response("Webhook set successfully", { status: 200 });
}

// Fungsi untuk menghapus webhook
async function unsetWebhook() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`;
    await fetch(url, { method: "GET" });
    return new Response("Webhook unset successfully", { status: 200 });
}
