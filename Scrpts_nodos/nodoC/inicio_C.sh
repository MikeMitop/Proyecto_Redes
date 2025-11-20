#!/bin/bash
# ============================
MY_IP="CAMBIAR_IP_DE_C"
PEER_IP_A="CAMBIAR_IP_DE_A"
PEER_IP_B="CAMBIAR_IP_DE_B"
PEER_IP_D="CAMBIAR_IP_DE_D"
PEER_IP_G="CAMBIAR_IP_DEL_GATEWAY"

IFACE="CAMBIAR_A_TU_INTERFAZ"
# ============================

sudo modprobe batman_adv
sudo ip link add bat0 type batadv
sudo ip link set bat0 up

# CA
sudo ip link add vxlanCA type vxlan id 20 dstport 4789 remote $PEER_IP_A local $MY_IP dev $IFACE
sudo ip link set vxlanCA up
sudo batctl if add vxlanCA

# CB
sudo ip link add vxlanCB type vxlan id 40 dstport 4789 remote $PEER_IP_B local $MY_IP dev $IFACE
sudo ip link set vxlanCB up
sudo batctl if add vxlanCB

# CD
sudo ip link add vxlanCD type vxlan id 60 dstport 4789 remote $PEER_IP_D local $MY_IP dev $IFACE
sudo ip link set vxlanCD up
sudo batctl if add vxlanCD

# CG
sudo ip link add vxlanCG type vxlan id 90 dstport 4789 remote $PEER_IP_G local $MY_IP dev $IFACE
sudo ip link set vxlanCG up
sudo batctl if add vxlanCG

echo "[✓] Nodo C listo."
