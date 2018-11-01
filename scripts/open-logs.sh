
docker logs -f dev-peer0.org1.example.com-visy-0.7.2 2>&1 | grep -a CustomLog

gnome-terminal -x sh -c "docker logs -f dev-peer0.org1.example.com-visy-0.7.2 2>&1 | grep -a CustomLog; bash"