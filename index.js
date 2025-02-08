import { handleUpdate, setWebhook, unsetWebhook } from "./bot.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/setWebhook") {
            return await setWebhook();
        }

        if (url.pathname === "/unsetWebhook") {
            return await unsetWebhook();
        }

        if (request.method === "POST") {
            const data = await request.json();
            return await handleUpdate(data, env);
        }

        return new Response("Cloudflare Telegram Bot", { status: 200 });
    }
};