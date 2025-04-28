import telebot

BOT_TOKEN = '7244920772:AAEu2KlNZcvPFH1RUoAdYKDQEsRWWOsPBi8'
GAME_SHORT_NAME = 'squarefallgame'
GAME_URL = 'https://squarefall-game.vercel.app/'  # o'yin url

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start', 'game'])
def send_game(message):
    bot.send_game(message.chat.id, GAME_SHORT_NAME)

@bot.callback_query_handler(func=lambda call: True)
def callback_inline(call):
    if call.game_short_name == GAME_SHORT_NAME:
        bot.answer_callback_query(call.id, url=GAME_URL)
    else:
        bot.answer_callback_query(call.id, text="Xatolik!")

bot.infinity_polling()


# ---

# ## 📜 License

# This project is open-source and free to use.  
# Feel free to fork, improve, and share! 🚀

# ---

# ## 🤝 Credits

# Developed with ❤️ by Baxtjon Chapayev.

