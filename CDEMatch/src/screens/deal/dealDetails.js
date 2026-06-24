import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  Alert,
  DeviceEventEmitter,
  Platform,
} from "react-native";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/globalStyles";
import { dealStyle } from "../../styles/dealStyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { jwtDecode } from "jwt-decode";
import { colors } from "../../styles/colors";
import { formStyle } from "../../styles/formStyle";
import { modalStyle } from "../../styles/modalStyle";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function DealDetailsScreen({ route }) {
  const { id } = route.params;
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigation = useNavigation();
  const [deal, setDeal] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const [members, setMembers] = useState([]);
  const [suggestedMemberIds, setSuggestedMemberIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [matched, setMatched] = useState(false);

  const isMyDeal = deal?.owner?._id === currentUserId;

  const insets = useSafeAreaInsets();

  const loadMembers = () => {
    setModalActive(true);
    setLoading(true);

    api
      .get(
        `api/member/suggest?dealId=${deal._id}&excludeId=${deal?.owner?._id}`,
      )
      .then((res) => {
        const membersList =
          res.data.members !== undefined ? res.data.members : res.data;
        const suggestedIds = res.data.alreadySuggestedIds || [];

        setMembers(membersList || []);
        setSuggestedMemberIds(suggestedIds);

        setLoading(false);
      })
      .catch((error) => {
        const errorMsg = error.response?.data || "Ocorreu um erro";
        if (Platform.OS === "web") {
          window.alert("Error: " + errorMsg);
        } else {
          Alert.alert("Error", errorMsg);
        }
        console.log(error.message + " " + errorMsg);
        setLoading(false);
      });
  };

  const sendSuggestion = (memberId) => {
    const suggestionData = {
      dealId: deal._id,
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
        const errorMsg = error.response?.data || "Ocorreu um erro";
        if (Platform.OS === "web") {
          window.alert("Error: " + errorMsg);
        } else {
          Alert.alert("Error", errorMsg);
        }
        console.log(error.message + " " + errorMsg);
      });
  };

  const fetchDeal = () => {
    setLoading(true);

    api
      .get(`api/deal/${id}`)
      .then((res) => {
        setDeal(res.data);
        setMatched(res.data.isMatched || false);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        const errorMsg = error.response?.data || "Ocorreu um erro";
        if (Platform.OS === "web") {
          window.alert("Error: " + errorMsg);
        } else {
          Alert.alert("Error", errorMsg);
        }
        console.log(error.message + " " + errorMsg);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const onMatchButtonPress = () => {
    const previousState = matched;

    setMatched(!previousState);

    DeviceEventEmitter.emit("updateMatchStatus", {
      dealId: deal._id,
      isMatched: !previousState,
    });

    api.post(`api/deal/match/${deal._id}`).catch((error) => {
      setMatched(previousState);
      DeviceEventEmitter.emit("updateMatchStatus", {
        dealId: deal._id,
        isMatched: previousState,
      });
      const errorMsg = error.response?.data || "Ocorreu um erro";
      if (Platform.OS === "web") {
        window.alert("Error: " + errorMsg);
      } else {
        Alert.alert("Error", errorMsg);
      }
      console.log(error.message + " " + errorMsg);
    });
  };

  useEffect(() => {
    if (!deal?._id) return;

    const subscription = DeviceEventEmitter.addListener(
      "updateMatchStatus",
      (data) => {
        if (data.dealId === deal._id) {
          setMatched(data.isMatched);
        }
      },
    );

    return () => subscription.remove();
  }, [deal?._id]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("userToken").then((token) => {
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUserId(decoded.id);
        }
      });

      fetchDeal();
    }, [id]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDeal();
  }, [id]);

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!deal) {
    return (
      <View style={globalStyles.center}>
        <Text>Negócio não encontrado.</Text>
      </View>
    );
  }

  const ownerName = deal.owner?.name || "Membro";
  const initialLetter = ownerName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={dealStyle.detailsContainer}>
      <View style={dealStyle.detailsHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            style={formStyle.backButton}
            name="chevron-back-outline"
            size={30}
          />
        </TouchableOpacity>
        <Text style={dealStyle.detailTitle}>{deal.title}</Text>
      </View>

      {Platform.OS === "web" && (
        <TouchableOpacity
          style={globalStyles.refreshButton}
          onPress={onRefresh}
        >
          <Ionicons name="reload" size={20} color={colors.primary} />
          <Text
            style={{
              color: colors.primary,
              marginLeft: 10,
              fontWeight: "bold",
            }}
          >
            Atualizar Negócio
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={dealStyle.detailCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E6C687"
            colors={["#E6C687"]}
            progressBackgroundColor={colors.searchBackground || "#223142"}
          />
        }
      >
        <View style={dealStyle.card}>
          <View style={dealStyle.cardHeader}>
            <TouchableOpacity
              style={dealStyle.headerLeft}
              onPress={() =>
                navigation.navigate("MemberProfile", { id: deal.owner?._id })
              }
            >
              {deal.owner?.profilePicture ? (
                <Image
                  source={{ uri: deal.owner?.profilePicture }}
                  style={dealStyle.avatar}
                ></Image>
              ) : (
                <View style={dealStyle.detailAvatar}>
                  <Text style={dealStyle.detailAvatarText}>
                    {initialLetter}
                  </Text>
                </View>
              )}
              <View>
                <Text style={dealStyle.detailName}>{ownerName}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={dealStyle.detailInfo}>
            {deal.type}, {deal.area}
          </Text>
          <Text style={dealStyle.detailInfo}>{deal.price} €</Text>
          <Text style={dealStyle.detailDescription}>{deal.description}</Text>

          <View style={formStyle.cardActions}>
            <TouchableOpacity onPress={() => onMatchButtonPress()}>
              {matched ? (
                <Ionicons
                  style={formStyle.iconButton}
                  name="briefcase"
                  size={30}
                />
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
                color="#EEEEEE"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity style={dealStyle.actionButton}>
              <Ionicons name="star-outline" size={22} color="#EEEEEE" />
            </TouchableOpacity> */}
            {isMyDeal ? (
              <TouchableOpacity
                onPress={() => navigation.navigate("EditDeal", { deal: deal })}
              >
                <Ionicons
                  style={formStyle.iconButton}
                  name="pencil"
                  size={30}
                  color="#EEEEEE"
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
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
        <View
          style={[
            modalStyle.suggestionListModalCard,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={modalStyle.modalHeader}>
            <Text style={modalStyle.modalTitle}>
              Sugerir Negócio a outro Membro
            </Text>
            <TouchableOpacity onPress={() => setModalActive(false)}>
              <Ionicons name="close" size={24} color="#EEE" />
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
    </SafeAreaView>
  );
}
