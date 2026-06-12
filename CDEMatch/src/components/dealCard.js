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
  DeviceEventEmitter,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { dealStyle } from "../styles/dealStyle";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import api from "../services/api";
import { modalStyle } from "../styles/modalStyle";
import { formStyle } from "../styles/formStyle";

export function DealCard({ item }) {
  const [modalActive, setModalActive] = useState(false);
  const [members, setMembers] = useState([]);
  const [suggestedMemberIds, setSuggestedMemberIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [matched, setMatched] = useState(item.isMatched || false);

  const navigation = useNavigation();
  const initial = item.owner ? item.owner.name.charAt(0).toUpperCase() : "M";
  const ownerId = item.owner?._id || item.owner;

  const loadMembers = () => {
    setModalActive(true);
    setLoading(true);

    api
      .get(`api/member/suggest?dealId=${item._id}&excludeId=${ownerId}`)
      .then((res) => {
        const membersList =
          res.data.members !== undefined ? res.data.members : res.data;
        const suggestedIds = res.data.alreadySuggestedIds || [];

        setMembers(membersList || []);
        setSuggestedMemberIds(suggestedIds);

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
      dealId: item._id,
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

  const onMatchButtonPress = () => {
    const previousState = matched;

    setMatched(!previousState);

    DeviceEventEmitter.emit("updateMatchStatus", {
      dealId: item._id,
      isMatched: !previousState,
    });

    api
      .post(`api/deal/match/${item._id}`)
      .then(() => {

      })
      .catch((error) => {
        setMatched(previousState);
        DeviceEventEmitter.emit("updateMatchStatus", {
          dealId: item._id,
          isMatched: previousState,
        });
        Alert.alert("Error", error.response?.data || "Erro de ligação ao servidor.");
        console.log(error.message + " " + error.response.data);
      });
  };

  useEffect(() => {
    setMatched(item.isMatched || false);

    const subscription = DeviceEventEmitter.addListener(
      "updateMatchStatus",
      (data) => {
        if (data.dealId === item._id) {
          setMatched(data.isMatched);
        }
      },
    );
    return () => subscription.remove();
  }, [item.isMatched, item._id]);

  return (
    <View style={dealStyle.card}>
      <View style={dealStyle.cardHeader}>
        <TouchableOpacity
          style={dealStyle.headerLeft}
          onPress={() =>
            navigation.navigate("MemberProfile", { id: item.owner?._id })
          }
        >
          {item.owner?.profilePicture ? (
            <Image
              source={{ uri: item.owner?.profilePicture }}
              style={dealStyle.avatar}
            ></Image>
          ) : (
            <View style={dealStyle.avatar}>
              <Text style={dealStyle.avatarText}>{initial}</Text>
            </View>
          )}

          <View>
            <Text style={dealStyle.userName}>
              {item.owner.name || "Utilizador"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("DealDetails", { id: item._id })}
      >
        <Text style={dealStyle.dealTitle}>{item.title}</Text>
        <Text style={dealStyle.dealInfo}>
          {item.type}, {item.area}
        </Text>
        <Text style={dealStyle.dealInfo}>{item.price} €</Text>
        <Text style={dealStyle.dealDescription}>{item.description}</Text>
      </TouchableOpacity>

      <View style={formStyle.cardActions}>
        <TouchableOpacity onPress={() => onMatchButtonPress()}>
          {matched ? (
            <Ionicons style={formStyle.iconButton} name="briefcase" size={30} />
          ) : (
            <Ionicons
              style={formStyle.iconButton}
              name="briefcase-outline"
              size={30}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => loadMembers()}>
          <Ionicons
            style={formStyle.iconButton}
            name="send-outline"
            size={30}
            // color="#EEEEEE"
          />
        </TouchableOpacity>
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
        <View style={modalStyle.suggestionListModalCard}>
          <View style={modalStyle.modalHeader}>
            <Text style={modalStyle.modalTitle}>
              Sugerir Negócio a outro Membro
            </Text>
            <TouchableOpacity onPress={() => setModalActive(false)}>
              <Ionicons name="close" size={25} color="#EEE" />
            </TouchableOpacity>
          </View>
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
                const isSuggested = suggestedMemberIds.includes(member.id);

                return (
                  <View key={member._id} style={modalStyle.memberCard}>
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
                          style={modalStyle.memberAvatar}
                        />
                      ) : (
                        <View style={modalStyle.memberAvatar}>
                          <Text style={dealStyle.avatarText}>
                            {member.name.charAt(0).toUpperCase() || "M"}
                          </Text>
                        </View>
                      )}

                      <Text style={modalStyle.memberName}>{member.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={modalStyle.sendButton}
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
