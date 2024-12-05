from threading import Thread
from time import sleep

def send_user_id(bot, message):
    """
    Mengirimkan ID pengguna yang memanggil command /id,
    dan menghapus pesan /id yang dikirimkan pengguna.
    """
    user_id = message.from_user.id
    username = message.from_user.username or "Tidak ada username"
    first_name = message.from_user.first_name or "Tidak ada nama"

    # Kirim balasan dengan ID pengguna
    bot.reply_to(
        message,
        f"<b>ID Anda     :</b> <code>{user_id}</code>\n"
        f"<b>Username :</b> @{username}\n"
        f"<b>Nama         :</b> {first_name}",
        parse_mode="HTML"
    )

    # Jalankan penghapusan pesan pengguna setelah 2 detik
    Thread(target=delayed_delete, args=(bot, message.chat.id, message.message_id, 2)).start()

def delayed_delete(bot, chat_id, message_id, delay):
    """
    Menghapus pesan setelah jeda waktu tertentu.
    """
    sleep(delay)
    bot.delete_message(chat_id, message_id)
    
    
