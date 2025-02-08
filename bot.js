import { BOT_TOKEN, ADMIN_ID, webhookUrl } from "./config.js";

export async function handleUpdate(update, env) {
    if (!update.message) return new Response("No message", { status: 200 });

    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text || "";
    const isGroupAdmin = ADMIN_ID.startsWith("-100");

    if (text === "/start") {
        const keyboard = {
            inline_keyboard: [[{ text: "SOURCE CODE", url: "https://ouo.io/Sjev3s" }]]
        };
        await sendMessage(chatId, "Bot aktif\nKirimkan pesan apa saja dan admin akan segera membalas🥱", keyboard);
        return new Response("Sent start message", { status: 200 });
    }

    if (!isGroupAdmin && chatId == ADMIN_ID && !message.reply_to_message) {
        await sendMessage(chatId, "Reply pesan yang di-forward");
        return new Response("Admin did not reply to forwarded message", { status: 200 });
    }

    if (chatId == ADMIN_ID || isGroupAdmin) {
        if (message.reply_to_message) {
            const originalMsgId = await env.nfd.get(`reply_${message.reply_to_message.message_id}`);
            if (originalMsgId) {
                await forwardResponse(originalMsgId, message);
                return new Response("Admin/group reply sent", { status: 200 });
            }
        }
    }

    const existingForward = await env.nfd.get(`forwarded_${message.message_id}`);
    if (existingForward) {
        return new Response("Message already forwarded", { status: 200 });
    }

    const forward = await forwardMessage(ADMIN_ID, chatId, message.message_id);
    if (forward && forward.result && forward.result.message_id) {
        await env.nfd.put(`reply_${forward.result.message_id}`, chatId);
        await env.nfd.put(`forwarded_${message.message_id}`, "true");
    }

    return new Response("Message handled", { status: 200 });
}

export async function sendMessage(chatId, text, keyboard = null) {
    return await fetchPost(`sendMessage`, {
        chat_id: chatId,
        text: text,
        reply_markup: keyboard ? JSON.stringify(keyboard) : undefined
    });
}

export async function sendMedia(chatId, mediaType, fileId) {
    return await fetchPost(`send${capitalizeFirstLetter(mediaType)}`, {
        chat_id: chatId,
        [mediaType]: fileId
    });
}

export async function forwardMessage(to, from, message_id) {
    return await fetchPost(`forwardMessage`, {
        chat_id: to,
        from_chat_id: from,
        message_id
    });
}

async function forwardResponse(chatId, message) {
    if (message.text) {
        await sendMessage(chatId, message.text);
    } else if (message.photo) {
        await sendMedia(chatId, "photo", message.photo[message.photo.length - 1].file_id);
    } else if (message.video) {
        await sendMedia(chatId, "video", message.video.file_id);
    } else if (message.document) {
        await sendMedia(chatId, "document", message.document.file_id);
    } else if (message.sticker) {
        await sendMedia(chatId, "sticker", message.sticker.file_id);
    }
}

async function fetchPost(endpoint, body) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) {
        console.error(`Failed request: ${endpoint}`, data);
        return new Response(`Failed request: ${endpoint}`, { status: 500 });
    }

    return data;
}

export async function setWebhook() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`;
    await fetch(url, { method: "GET" });
    return new Response("Webhook set successfully", { status: 200 });
}

export async function unsetWebhook() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`;
    await fetch(url, { method: "GET" });
    return new Response("Webhook unset successfully", { status: 200 });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}