## Clone repo ini
```shell
git clone https://github.com/Syuhadak27/bridge_chat_bot.git && mv bridge_chat_bot bridge && cd bridge
```

## Cara menjalankan di vps dg docker
```shell
sudo docker build -t bridge .
```

```shell
sudo docker run -d --restart unless-stopped bridge
```


## Cara menjalankan di lokal TANPA docker
```shell
pip install -r requirements.txt
```

```shell
python main.py
```

## Bot Command
```shell
start - memulau bot
ping - /p test ping bot
id - mengecek id mu
```
