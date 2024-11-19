# forward.py
from telebot.types import Message

pending_messages = {}  # Menyimpan pesan yang tertunda

def forward_to_admin(bot, message: Message, admin_id: int):
    if message.chat.id != admin_id:
        # Kirim pesan otomatis ke pengguna dan simpan pesan ID
        sent_message = bot.send_message(message.chat.id, "Pesan diterima server, tunggu admin membalas.")
        pending_messages[message.chat.id] = sent_message.message_id

        # Kirimkan pesan ke admin
        bot.forward_message(admin_id, message.chat.id, message.message_id)
    else:
        # Jika admin mengirimkan balasan
        if message.reply_to_message and message.reply_to_message.forward_from:
            # Ambil ID pengguna dari pesan yang di-forward
            user_id = message.reply_to_message.forward_from.id
            # Teruskan pesan admin ke pengguna
            if message.text:
                bot.send_message(user_id, f"<pre>Pesan dari Admin:</pre>\n{message.text}")
            elif message.photo:
                bot.send_photo(user_id, message.photo[-1].file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.video:
                bot.send_video(user_id, message.video.file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.document:
                bot.send_document(user_id, message.document.file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.voice:
                bot.send_voice(user_id, message.voice.file_id)
            elif message.sticker:
                bot.send_sticker(user_id, message.sticker.file_id)

            # Hapus pesan "Pesan diterima server, tunggu admin membalas."
            if user_id in pending_messages:
                try:
                    bot.delete_message(user_id, pending_messages[user_id])
                    del pending_messages[user_id]
                except Exception as e:
                    print(f"Gagal menghapus pesan: {e}")
        else:
            bot.send_message(admin_id, "Balas pesan yang diteruskan untuk membalas pengguna.")