import telebot
import os
from dotenv import load_dotenv
from start import handle_start  # Import fungsi dari file start.py
from forward import forward_to_admin  # Import fungsi dari file forward.py
from telebot.types import Message
from ping import ping  # Import fungsi ping dari ping.py
from id import send_user_id  # Import fungsi dari file id.py
from database import close_connection  # Import fungsi untuk menutup koneksi database

# Load variabel dari file .env
load_dotenv("config.env")

# Token bot dan ID Admin dari .env
BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = os.getenv("ADMIN_ID")

# Pastikan variabel BOT_TOKEN dan ADMIN_ID ada di .env
if not BOT_TOKEN or not ADMIN_ID:
    raise ValueError("BOT_TOKEN atau ADMIN_ID belum di set di file .env")

# Konversi ADMIN_ID ke integer jika berisi angka
if ADMIN_ID.isdigit() or (ADMIN_ID.startswith('-') and ADMIN_ID[1:].isdigit()):
    ADMIN_ID = int(ADMIN_ID)

bot = telebot.TeleBot(BOT_TOKEN, parse_mode='HTML')  # Aktifkan parse mode HTML

# Handler untuk perintah /ping atau /p
@bot.message_handler(commands=['ping', 'p'])
def handle_ping(message: Message):
    ping(bot, message)

# Handler untuk command /id
@bot.message_handler(commands=['id'])
def handle_id_command(message):
    send_user_id(bot, message)

# Panggil handler /start dari start.py
handle_start(bot)

# Fungsi untuk meneruskan pesan dari pengguna ke admin (bisa grup)
@bot.message_handler(func=lambda message: True, content_types=['text', 'photo', 'video', 'document', 'voice', 'sticker', 'audio', 'animation', 'video_note', 'contact', 'location', 'venue'])
def forward_to_admin_handler(message: Message):
    forward_to_admin(bot, message, ADMIN_ID)

# Menjalankan bot
if __name__ == "__main__":
    print("Bot berjalan...")
    try:
        bot.infinity_polling()
    except KeyboardInterrupt:
        print("Bot dihentikan.")
    finally:
        close_connection()  # Menutup koneksi database saat bot berhenti