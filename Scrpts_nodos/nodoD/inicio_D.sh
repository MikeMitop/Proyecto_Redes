#!/bin/bash
# ============================
MY_IP="CAMBIAR_IP_DE_D"
PEER_IP_A="CAMBIAR_IP_DE_A"
PEER_IP_B="CAMBIAR_IP_DE_B"
PEER_IP_C="CAMBIAR_IP_DE_C"
PEER_IP_G="CAMBIAR_IP_DEL_GATEWAY"

IFACE="CAMBIAR_A_TU_INTERFAZ"
# ============================

sudo modprobe batman_adv
sudo ip link add bat0 type batadv
sudo ip link set bat0 up

# DA
sudo ip link add vxlanDA type vxlan id 30 dstport 4789 remote $PEER_IP_A local $MY_IP dev $IFACE
sudo ip link set vxlanDA up
sudo batctl if add vxlanDA

# DB
sudo ip link add vxlanDB type vxlan id 50 dstport 4789 remote $PEER_IP_B local $MY_IP dev $IFACE
sudo ip link set vxlanDB up
sudo batctl if add vxlanDB

# DC
sudo ip link add vxlanDC type vxlan id 60 dstport 4789 remote $PEER_IP_C local $MY_IP dev $IFACE
sudo ip link set vxlanDC up
sudo batctl if add vxlanDC

# DG
sudo ip link add vxlanDG type vxlan id 100 dstport 4789 remote $PEER_IP_G local $MY_IP dev $IFACE
sudo ip link set vxlanDG up
sudo batctl if add vxlanDG

echo "[✓] Nodo D listo."
