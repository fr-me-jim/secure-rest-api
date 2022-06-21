#!/bin/bash
DOMAIN=tfm.jediupc.com
DATA_DIR=/home/tfm-server/tfm-backend/.certs
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $DATA_DIR/server.crt
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $DATA_DIR/server.key
chmod 600 $DATA_DIR/server.crt
chmod 600 $DATA_DIR/server.key
chown tfm-server:tfm-server $DATA_DIR/server.crt
chown tfm-server:tfm-server $DATA_DIR/server.key