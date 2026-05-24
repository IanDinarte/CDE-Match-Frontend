import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { memberStyle } from "../styles/memberStyle";
import { BusinessCard } from "./businessCard";
import { DealCard } from "./dealCard";
import { dealStyle } from "../styles/dealStyle";

export default function ProfileTemplate({ member, isOwnProfile, onEditPress }) {
  const [activeTab, setActiveTab] = useState("empresas");

  const initialLetter = member?.name
    ? member.name.charAt(0).toUpperCase()
    : "U";

  return (
    <ScrollView style={memberStyle.container}>
      <View style={memberStyle.headerRow}>
        <View style={memberStyle.avatarCircle}>
          <Text style={memberStyle.avatarText}>{initialLetter}</Text>
        </View>
        <View style={memberStyle.headerInfo}>
          <Text style={memberStyle.nameText}>
            {member?.name || "Nome do Membro"}
          </Text>
          <Text style={memberStyle.locationText}>
            {member?.city || "Cidade do Membro"}
          </Text>
        </View>
      </View>

      <View style={memberStyle.descContainer}>
        {isOwnProfile ? (
          <Text style={memberStyle.membershipText}>
            Seu Plano: {member?.membership}
          </Text>
        ) : null}
        <Text style={memberStyle.descText}>{member?.description || ""}</Text>

        {/* <Text style={memberStyle.contactsTitle}>Contatos:</Text> */}
        {member?.email?.confidential === false ? (
          <Text style={memberStyle.contactItem}>
            Email: {member?.email?.value}
          </Text>
        ) : null}

        {member?.phone?.confidential === false ? (
          <Text style={memberStyle.contactItem}>
            Telemóvel: {member?.phone?.value}
          </Text>
        ) : null}

        <View>
          {member?.websites && member.websites.length > 0
            ? member.websites.map((item, index) => (
                <Text key={index} style={memberStyle.website}>
                  {item.name}
                </Text>
              ))
            : null}
        </View>
      </View>

      {isOwnProfile ? (
        <TouchableOpacity
          style={memberStyle.actionButton}
          onPress={
            isOwnProfile ? onEditPress : () => console.log("Ação externa")
          }
        >
          <Text style={memberStyle.actionButtonText}>Editar Perfil </Text>
          <Ionicons name="pencil" size={16} color="#EEEEEE" />
        </TouchableOpacity>
      ) : null}

      <View style={memberStyle.tabBar}>
        <TouchableOpacity
          style={[
            memberStyle.tabButton,
            activeTab === "empresas" && memberStyle.tabButtonActive,
          ]}
          onPress={() => setActiveTab("empresas")}
        >
          <Text
            style={[
              memberStyle.tabButtonText,
              activeTab === "empresas" && memberStyle.tabActiveText,
            ]}
          >
            Ver Empresas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            memberStyle.tabButton,
            activeTab === "negocios" && memberStyle.tabButtonActive,
          ]}
          onPress={() => setActiveTab("negocios")}
        >
          <Text
            style={[
              memberStyle.tabButtonText,
              activeTab === "negocios" && memberStyle.tabActiveText,
            ]}
          >
            Ver Negócios
          </Text>
        </TouchableOpacity>
      </View>

      <View style={memberStyle.dynamicContent}>
        {activeTab === "empresas" ? (
          <View>
            {member?.business && member.business.length > 0 ? (
              member.business.map((item) => (
                <BusinessCard key={item._id} item={item} />
              ))
            ) : (
              <Text
                style={{ color: "#8A94A6", textAlign: "center", marginTop: 10 }}
              >
                Esse Membro não possui Empresas
              </Text>
            )}
          </View>
        ) : (
          <View style={dealStyle.listContent}>
            {member?.deals && member.deals.length > 0 ? (
              member.deals.map((item) => (
                <DealCard key={item._id} item={item} />
              ))
            ) : (
              <Text
                style={{ color: "#8A94A6", textAlign: "center", marginTop: 10 }}
              >
                Esse Membro não possui Negócios ativos
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
