from telebot.types import Message
from database import save_message, get_message, delete_message

def forward_to_admin(bot, message: Message, admin_id: int):
    if message.chat.id != admin_id:
        # Kirim pesan otomatis ke pengguna dan simpan pesan ID
        username = message.from_user.username if message.from_user.username else "N/A"
        sent_message = bot.send_message(message.chat.id, "Pesan diterima server, tunggu admin membalas.")
        save_message(message.chat.id, sent_message.message_id)

        # Kirimkan pesan ke admin (grup) dengan forward asli
        forwarded_message = bot.forward_message(admin_id, message.chat.id, message.message_id)
        
        # Tambahkan informasi tambahan setelah pesan di-forward
        #bot.send_message(
            #admin_id,
            #f"Forwarded from {message.from_user.first_name} (ID: {message.from_user.id})\n"
            #f"Username: @{username if username != 'N/A' else 'Tidak ada'}"
        #)
    else:
        # Jika pesan berasal dari admin (grup) dan merupakan balasan ke pesan yang diteruskan
        if message.reply_to_message and message.reply_to_message.forward_from:
            user_id = message.reply_to_message.forward_from.id

            # Kirimkan pesan ke pengguna berdasarkan tipe konten
            if message.text:
                bot.send_message(user_id, f"<pre>Pesan dari Admin:</pre>\n{message.text}", parse_mode='HTML')
            elif message.photo:
                bot.send_photo(user_id, message.photo[-1].file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.video:
                bot.send_video(user_id, message.video.file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.document:
                bot.send_document(user_id, message.document.file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.voice:
                bot.send_voice(user_id, message.voice.file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.audio:
                bot.send_audio(user_id, message.audio.file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.animation:
                bot.send_animation(user_id, message.animation.file_id, caption=f"<pre>Pesan dari Admin:</pre>\n{message.caption or ''}", parse_mode='HTML')
            elif message.sticker:
                bot.send_sticker(user_id, message.sticker.file_id)
            elif message.video_note:
                bot.send_video_note(user_id, message.video_note.file_id)
            elif message.contact:
                bot.send_contact(user_id, message.contact.phone_number, message.contact.first_name, message.contact.last_name or "")
            elif message.location:
                bot.send_location(user_id, message.location.latitude, message.location.longitude)
            elif message.venue:
                bot.send_venue(user_id, message.venue.location.latitude, message.venue.location.longitude, message.venue.title, message.venue.address)

            # Hapus pesan "Pesan diterima server, tunggu admin membalas."
            pending_message_id = get_message(user_id)
            if pending_message_id:
                try:
                    bot.delete_message(user_id, pending_message_id)
                    delete_message(user_id)
                except Exception as e:
                    print(f"Gagal menghapus pesan: {e}")
        else:
            # Jangan kirim pesan ini jika admin adalah grup
            if not str(admin_id).startswith('-100'):
                bot.send_message(admin_id, "Balas pesan yang diteruskan untuk membalas pengguna.")