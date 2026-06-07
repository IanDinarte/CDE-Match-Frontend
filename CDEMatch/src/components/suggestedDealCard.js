import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { dealStyle } from "../styles/dealStyle";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import api from "../services/api";
import { formStyle } from "../styles/formStyle";

export function SuggestedDealCard({ item, onActionComplete }) {
  const [modalActive, setModalActive] = useState(false);
  const [members, setMembers] = useState([]);
  const [suggestedMemberIds, setSuggestedMemberIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const initial = item.deal.owner
    ? item.deal.owner.name.charAt(0).toUpperCase()
    : "U";

  const loadMembers = () => {
    setModalActive(true);

    api
      .get("api/member/")
      .then((res) => {
        setMembers(res.data);
        setLoading(false);
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data);
        console.log(error.message + " " + error.response.data);
        setLoading(false);
      });
  };

  const sendSuggestion = (memberId) => {
    const suggestionData = {
      dealId: item.deal._id,
      suggestedTo: memberId,
    };

    api
      .post("api/deal/suggestion", suggestionData)
      .then(() => {
        if (!suggestedMemberIds.includes(memberId)) {
          setSuggestedMemberIds((prevIds) => [...prevIds, memberId]);
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data);
        console.log(error.message + " " + error.response.data);
      });
  };

  const rejectSuggestion = () => {
    Alert.alert(
      "Rejeitar Sugestão",
      "Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Rejeitar",
          onPress: () => {
            api
              .delete(`api/deal/suggestion/${item._id}`)
              .then(() => {
                if (onActionComplete) onActionComplete();
              })
              .catch((error) => {
                Alert.alert("Error", error.response.data);
                console.log(error.message + " " + error.response.data);
              });
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <View style={dealStyle.card}>
      <View style={dealStyle.cardHeader}>
        <TouchableOpacity
          style={dealStyle.headerLeft}
          onPress={() =>
            navigation.navigate("MemberProfile", { id: item.deal.owner?._id })
          }
        >
          {item.deal.owner?.profilePicture ? (
            <Image
              source={{ uri: item.deal.owner?.profilePicture }}
              style={dealStyle.avatar}
            ></Image>
          ) : (
            <View style={dealStyle.avatar}>
              <Text style={dealStyle.avatarText}>{initial}</Text>
            </View>
          )}

          <View>
            <Text style={dealStyle.userName}>
              {item.deal.owner.name || "Utilizador"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DealDetails", { id: item.deal._id })
        }
      >
        <Text style={dealStyle.suggestedBy}>
          Sugerido por: {item.suggestedBy.name}
        </Text>
        <Text style={dealStyle.dealTitle}>{item.deal.title}</Text>
        <Text style={dealStyle.dealInfo}>
          {item.deal.type}, {item.deal.area}
        </Text>
        <Text style={dealStyle.dealInfo}>{item.deal.price} €</Text>
        <Text style={dealStyle.dealDescription}>{item.deal.description}</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={formStyle.cardActions}>
          <TouchableOpacity>
            <Ionicons
              style={formStyle.iconButton}
              name="heart-outline"
              size={30}
              color="#EEEEEE"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => loadMembers()}>
            <Ionicons
              style={formStyle.iconButton}
              name="send-outline"
              size={30}
              color="#EEEEEE"
            />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Ionicons
              style={formStyle.iconButton}
              name="star-outline"
              size={30}
              color="#EEEEEE"
            />
          </TouchableOpacity> */}
        </View>
        <View style={dealStyle.dangerActions}>
          <TouchableOpacity onPress={() => rejectSuggestion()}>
            <Ionicons
              style={formStyle.iconDanger}
              name="trash-outline"
              size={30}
              color="#EEEEEE"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={modalActive}
        onBackdropPress={() => setModalActive(false)}
        onBackButtonPress={() => setModalActive(false)}
        backdropOpacity={0.6}
        backdropTransitionOutTiming={10}
        style={{ margin: 0, justifyContent: "flex-end" }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver={true}
      >
        <View style={dealStyle.suggestionListModalCard}>
          {loading && members.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#E6C687" />
            </View>
          ) : (
            <FlatList
              data={members}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item: member }) => {
                const isSuggested = suggestedMemberIds.includes(
                  member.id || member._id,
                );

                return (
                  <View key={member._id} style={dealStyle.memberCard}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        flexShrink: 1,
                      }}
                    >
                      {member.profilePicture ? (
                        <Image
                          source={{ uri: member.profilePicture }}
                          style={dealStyle.memberAvatar}
                        />
                      ) : (
                        <View style={dealStyle.memberAvatar}>
                          <Text style={dealStyle.avatarText}>
                            {member.name.charAt(0).toUpperCase() || "M"}
                          </Text>
                        </View>
                      )}

                      <Text style={dealStyle.memberName}>{member.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={dealStyle.sendButton}
                      onPress={() => sendSuggestion(member.id)}
                      disabled={isSuggested}
                    >
                      {isSuggested ? (
                        <Ionicons
                          name="checkmark-outline"
                          size={25}
                          color="#967841"
                        />
                      ) : (
                        <Ionicons
                          name="send-outline"
                          size={25}
                          color="#967841"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
