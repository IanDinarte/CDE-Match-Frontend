import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { memberStyle } from "../styles/memberStyle";

export function BusinessCard({ item }) {
  return (
    <View style={memberStyle.cardBusiness}>
      <View>
        <Ionicons
          name={"business"}
          size={40}
          color="#A88A44"
        />
      </View>
      <View style={memberStyle.cardInfo}>
        <Text style={memberStyle.cardTitle}>
          {item.name}, <Text style={memberStyle.roleText}>{item.role}</Text>
        </Text>
        <Text style={memberStyle.cardSub}>{item.description}</Text>
      </View>
    </View>
  );
}
