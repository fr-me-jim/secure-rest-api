#!/bin/bash
umask 0177
# DOMAIN=tfm.jediupc.com
# DATA_DIR=/var/lib/postgresql/data
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $DATA_DIR/server.crt
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $DATA_DIR/server.key
chown postgres:postgres $DATA_DIR/server.crt $DATA_DIR/server.key