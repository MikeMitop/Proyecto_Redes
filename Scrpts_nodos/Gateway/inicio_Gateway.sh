#!/bin/bash
# ============================
MY_IP="CAMBIAR_IP_GATEWAY"
PEER_IP_A="CAMBIAR_IP_DE_A"
PEER_IP_B="CAMBIAR_IP_DE_B"
PEER_IP_C="CAMBIAR_IP_DE_C"
PEER_IP_D="CAMBIAR_IP_DE_D"

IFACE="CAMBIAR_A_TU_INTERFAZ"
# ============================

sudo modprobe batman_adv
sudo ip link add bat0 type batadv
sudo ip link set bat0 up

# GA
sudo ip link add vxlanGA type vxlan id 70 dstport 4789 remote $PEER_IP_A local $MY_IP dev $IFACE
sudo ip link set vxlanGA up
sudo batctl if add vxlanGA

# GB
sudo ip link add vxlanGB type vxlan id 80 dstport 4789 remote $PEER_IP_B local $MY_IP dev $IFACE
sudo ip link set vxlanGB up
sudo batctl if add vxlanGB

# GC
sudo ip link add vxlanGC type vxlan id 90 dstport 4789 remote $PEER_IP_C local $MY_IP dev $IFACE
sudo ip link set vxlanGC up
sudo batctl if add vxlanGC

# GD
sudo ip link add vxlanGD type vxlan id 100 dstport 4789 remote $PEER_IP_D local $MY_IP dev $IFACE
sudo ip link set vxlanGD up
sudo batctl if add vxlanGD

echo "[+] Asignando IP al gateway"
sudo ip addr add $MY_IP/24 dev bat0

echo "[✓] Gateway listo."
