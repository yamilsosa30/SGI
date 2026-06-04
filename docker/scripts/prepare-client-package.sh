#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
PACKAGE_DIR="$ROOT_DIR/dist/sgik-cliente-windows"

echo "Preparando paquete cliente en: $PACKAGE_DIR"

rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR/images"
mkdir -p "$PACKAGE_DIR/mysql/init"
mkdir -p "$PACKAGE_DIR/scripts"

cp "$ROOT_DIR/paquete-cliente/LEEME.txt" "$PACKAGE_DIR/"
cp "$ROOT_DIR/paquete-cliente/.env.example" "$PACKAGE_DIR/"
cp "$ROOT_DIR/paquete-cliente/docker-compose.yml" "$PACKAGE_DIR/"

cp "$ROOT_DIR/paquete-cliente/"*.bat "$PACKAGE_DIR/"
cp "$ROOT_DIR/paquete-cliente/scripts/"*.bat "$PACKAGE_DIR/scripts/"
cp "$ROOT_DIR/docker/mysql/init/"*.sql "$PACKAGE_DIR/mysql/init/"
cp "$ROOT_DIR/docker/images/"*.tar "$PACKAGE_DIR/images/"

echo
echo "Paquete listo."
echo "Carpeta generada: $PACKAGE_DIR"
