import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { memberStyle } from "../styles/memberStyle";

export function MemberCard({ member }) {
  const navigation = useNavigation();
  const initial = member.name ? member.name.charAt(0).toUpperCase() : "M";

  return (
    <View>
      <TouchableOpacity
        style={memberStyle.memberCard}
        onPress={() =>
          navigation.navigate("ProfileStack", { id: member.id })
        }
      >
        {member.profilePicture ? (
          <Image
            source={{ uri: member.profilePicture }}
            style={memberStyle.cardImage}
          />
        ) : (
          <View style={memberStyle.cardAvatar}>
            <Text style={memberStyle.cardAvatarText}>{initial}</Text>
          </View>
        )}
        <Text style={memberStyle.cardName}>{member.name}</Text>
      </TouchableOpacity>
    </View>
  );
}
