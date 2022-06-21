#!/bin/bash
DOMAIN=tfm.jediupc.com
DATA_DIR=/var/lib/postgresql/data
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $DATA_DIR/server.crt
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $DATA_DIR/server.key
chmod 600 $DATA_DIR/server.crt
chmod 600 $DATA_DIR/server.key
chown 70 $DATA_DIR/server.crt
chown 70 $DATA_DIR/server.key