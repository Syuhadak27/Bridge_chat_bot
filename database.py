import sqlite3

# Koneksi global ke database SQLite
conn = sqlite3.connect('bot_data.db', check_same_thread=False)
cursor = conn.cursor()

# Membuat tabel jika belum ada
cursor.execute('''
CREATE TABLE IF NOT EXISTS pending_messages (
    user_id INTEGER PRIMARY KEY,
    message_id INTEGER NOT NULL
)
''')
conn.commit()

def save_message(user_id, message_id):
    """Menyimpan hubungan antara user_id dan message_id ke database."""
    cursor.execute('INSERT OR REPLACE INTO pending_messages (user_id, message_id) VALUES (?, ?)', (user_id, message_id))
    conn.commit()

def get_message(user_id):
    """Mengambil message_id yang terkait dengan user_id."""
    cursor.execute('SELECT message_id FROM pending_messages WHERE user_id = ?', (user_id,))
    result = cursor.fetchone()
    return result[0] if result else None

def delete_message(user_id):
    """Menghapus hubungan antara user_id dan message_id dari database."""
    cursor.execute('DELETE FROM pending_messages WHERE user_id = ?', (user_id,))
    conn.commit()

def close_connection():
    """Menutup koneksi ke database."""
    conn.close()