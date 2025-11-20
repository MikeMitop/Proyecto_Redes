#!/bin/bash
# ============================
#      CONFIGURACIÓN A EDITAR
# ============================
MY_IP="CAMBIAR_IP_DE_A"
PEER_IP_B="CAMBIAR_IP_DE_B"
PEER_IP_C="CAMBIAR_IP_DE_C"
PEER_IP_D="CAMBIAR_IP_DE_D"
PEER_IP_G="CAMBIAR_IP_DEL_GATEWAY"

IFACE="CAMBIAR_A_TU_INTERFAZ"
# ============================

sudo modprobe batman_adv
sudo ip link add bat0 type batadv
sudo ip link set bat0 up

# AB
sudo ip link add vxlanAB type vxlan id 10 dstport 4789 remote $PEER_IP_B local $MY_IP dev $IFACE
sudo ip link set vxlanAB up
sudo batctl if add vxlanAB

# AC
sudo ip link add vxlanAC type vxlan id 20 dstport 4789 remote $PEER_IP_C local $MY_IP dev $IFACE
sudo ip link set vxlanAC up
sudo batctl if add vxlanAC

# AD
sudo ip link add vxlanAD type vxlan id 30 dstport 4789 remote $PEER_IP_D local $MY_IP dev $IFACE
sudo ip link set vxlanAD up
sudo batctl if add vxlanAD

# AG
sudo ip link add vxlanAG type vxlan id 70 dstport 4789 remote $PEER_IP_G local $MY_IP dev $IFACE
sudo ip link set vxlanAG up
sudo batctl if add vxlanAG

echo "[✓] Nodo A listo."
