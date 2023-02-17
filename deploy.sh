FILE=/etc/kyouko/docker-compose.yml
docker pull ghcr.io/slaxnetwork/kyouko:main
if test -f "$FILE"; then
    docker compose -f $FILE stop
fi
sudo curl -s  "https://raw.githubusercontent.com/SlaxNetwork/kyouko/main/docker-compose.yml" --create-dirs -o $FILE
docker compose -f $FILE up -d
