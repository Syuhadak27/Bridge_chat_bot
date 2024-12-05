from time import monotonic, sleep
import threading

def ping(bot, message):
    # Catat waktu mulai
    start_time = monotonic()

    # Kirim pesan awal "Pinging..."
    reply = bot.reply_to(message, "<i>Pinging...</i>", parse_mode="HTML")

    # Catat waktu akhir dan hitung waktu ping
    end_time = monotonic()
    ping_time = int((end_time - start_time) * 1000)

    # Edit pesan untuk menunjukkan hasil ping
    bot.edit_message_text(chat_id=message.chat.id, message_id=reply.message_id, 
                          text=f'<i>Pong😜😜 \n{ping_time} ms</i>', parse_mode="HTML")

    # Hapus pesan pengguna setelah 3 detik
    threading.Thread(target=delayed_delete, args=(bot, message.chat.id, message.message_id, 3)).start()

def delayed_delete(bot, chat_id, message_id, delay):
    sleep(delay)  # Tunggu selama 'delay' detik
    bot.delete_message(chat_id, message_id)  # Hapus pesan