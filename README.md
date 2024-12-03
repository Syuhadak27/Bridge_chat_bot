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
