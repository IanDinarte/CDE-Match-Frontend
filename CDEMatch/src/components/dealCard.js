import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { dealListStyle } from "../styles/dealListStyle";

export function DealCard({ item }) {
  const initial = item.userName ? item.userName.charAt(0).toUpperCase() : "U";

  return (
    <View style={dealListStyle.card}>
      <View style={dealListStyle.cardHeader}>
        <View style={dealListStyle.headerLeft}>
          <View style={dealListStyle.avatar}>
            <Text style={dealListStyle.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={dealListStyle.userName}>
              {item.userName || "Utilizador"}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={dealListStyle.optionsIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo - Ajusta os nomes das propriedades conforme o teu Schema de Deals */}
      <Text style={dealListStyle.offerTitle}>
        {item.title || item.offerTitle}
      </Text>
      <Text style={dealListStyle.offerDescription}>
        {item.description || item.offerDescription}
      </Text>

      {/* Botões de Ação */}
      <View style={dealListStyle.cardActions}>
        <TouchableOpacity style={dealListStyle.actionButton}>
          <Text style={dealListStyle.actionButtonText}>Match</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dealListStyle.actionButton}>
          <Text style={dealListStyle.actionButtonText}>Sugerir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dealListStyle.actionButton}>
          <Text style={dealListStyle.actionButtonText}>Favoritar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

{
  /* <View style={memberStyle.cardDeal}>
              <View style={memberStyle.dealHeader}>
                <View style={memberStyle.miniAvatar}>
                  <Text style={memberStyle.miniAvatarText}>
                    {initialLetter}
                  </Text>
                </View>
                <View>
                  <Text style={memberStyle.dealAuthor}>
                    {member?.name?.split(" ")[0]}
                  </Text>
                </View>
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color="#FFF"
                  style={{ marginLeft: "auto" }}
                />
              </View>

              <Text style={memberStyle.dealTitle}>Titulo da oferta</Text>
              <Text style={memberStyle.dealBody}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </Text>

              <View style={memberStyle.dealActions}>
                <TouchableOpacity style={memberStyle.btnDeal}>
                  <Text style={memberStyle.btnDealText}>Match</Text>
                </TouchableOpacity>
                <TouchableOpacity style={memberStyle.btnDeal}>
                  <Text style={memberStyle.btnDealText}>Sugerir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={memberStyle.btnDeal}>
                  <Text style={memberStyle.btnDealText}>Favoritar</Text>
                </TouchableOpacity>
              </View>
            </View> */
}
