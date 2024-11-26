import os
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

def handle_start(bot):
    @bot.message_handler(commands=['start'])
    def send_welcome(message):
        # Buat tombol inline
        keyboard = InlineKeyboardMarkup()
        keyboard.add(
            InlineKeyboardButton("Owner", url=f"https://t.me/{os.getenv('OWNER_USERNAME', 'owner_username')}"),
            InlineKeyboardButton("Source Code", url="https://github.com/username/repository")
        )
        
        # Kirim pesan dengan tombol
        bot.send_message(
            message.chat.id, 
            "<b>Selamat datang!</b>\n\nGunakan tombol di bawah ini untuk informasi lebih lanjut.",
            reply_markup=keyboard
        )