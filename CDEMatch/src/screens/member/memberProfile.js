import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/globalStyles";
import { memberStyle } from "../../styles/memberStyle";
import { dealStyle } from "../../styles/dealStyle";
import { BusinessCard } from "../../components/businessCard";
import { DealCard } from "../../components/dealCard";
import { jwtDecode } from "jwt-decode";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { formStyle } from "../../styles/formStyle";
import { modalStyle } from "../../styles/modalStyle";
import { colors } from "../../styles/colors";

/**
 *
 * @param {*} param0
 * @returns
 */
export default function MemberProfileScreen({ route }) {
  const id = route.params ? route.params.id : null;
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigation = useNavigation();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState("empresas");

  const [addBusinessActive, setAddBusinessActive] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [businessRole, setBusinessRole] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessArea, setBusinessArea] = useState("");
  const [businessLogo, setBusinessLogo] = useState("");

  const isMyProfile = member?._id === currentUserId;

  const initialLetter = member?.name
    ? member.name.charAt(0).toUpperCase()
    : "U";

  const addBusiness = () => {
    setAddBusinessActive(false);

    const businessData = {
      name: businessName,
      role: businessRole,
      description: businessDescription,
      area: businessArea,
    };

    api
      .post(`api/member/${member?._id}/business`, businessData)
      .then(() => {
        fetchMember();
      })
      .catch((error) => {});
  };

  const fetchMember = () => {
    setLoading(true);

    api
      .get(`api/member/${id}`)
      .then((res) => {
        setMember(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("userToken").then((token) => {
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUserId(decoded.id);
        }
      });

      fetchMember();
    }, [id]),
  );

  // useEffect(() => {
  //   AsyncStorage.getItem("userToken").then((token) => {
  //     if (token) {
  //       const decoded = jwtDecode(token);
  //       setCurrentUserId(decoded.id);
  //     }
  //   });

  //   fetchMember();
  // }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={globalStyles.center}>
        <Text>Membro não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={memberStyle.container}
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
      <View style={memberStyle.headerRow}>
        {member.profilePicture ? (
          <Image
            source={{ uri: member.profilePicture }}
            style={memberStyle.avatarImage}
          ></Image>
        ) : (
          <View style={memberStyle.avatarCircle}>
            <Text style={memberStyle.avatarText}>{initialLetter}</Text>
          </View>
        )}

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
        {isMyProfile ? (
          <Text style={memberStyle.membershipText}>
            Seu Plano: {member?.membership}
          </Text>
        ) : null}
        <Text style={memberStyle.descText}>{member?.description || ""}</Text>

        {/* <Text style={memberStyle.contactsTitle}>Contatos:</Text> */}
        {member?.email?.confidential === false || isMyProfile === true ? (
          <Text style={memberStyle.contactItem}>
            Email: {member?.email?.value}
          </Text>
        ) : null}

        {member?.phone?.confidential === false || isMyProfile === true ? (
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

      {isMyProfile ? (
        <TouchableOpacity
          style={memberStyle.actionButton}
          onPress={
            isMyProfile
              ? () => navigation.navigate("EditMember", { member: member })
              : () => console.log("Ação Proibida.")
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
          onPress={() => {
            setActiveTab("empresas");
          }}
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
                <BusinessCard
                  key={item._id}
                  item={item}
                  isMyBusiness={isMyProfile}
                  ownerId={member?._id}
                  onActionComplete={fetchMember}
                />
              ))
            ) : (
              <Text
                style={{ color: "#8A94A6", textAlign: "center", marginTop: 10 }}
              >
                Esse Membro não possui Empresas
              </Text>
            )}
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => setAddBusinessActive(!addBusinessActive)}
            >
              <Ionicons
                style={formStyle.iconButton}
                name="add-circle-outline"
                size={40}
              />
            </TouchableOpacity>
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
        <Modal
          isVisible={addBusinessActive}
          onBackdropPress={() => setAddBusinessActive(false)}
          onBackButtonPress={() => setAddBusinessActive(false)}
          onModalHide={() => {
            setBusinessName("");
            setBusinessRole("");
            setBusinessDescription("");
            setBusinessArea("");
            setBusinessLogo("");
          }}
          backdropOpacity={0.6}
          style={{ margin: 0, justifyContent: "flex-end" }}
          animationIn="slideInUp"
          animationOu="slideInDown"
          useNativeDriver={true}
        >
          <ScrollView style={modalStyle.filterModalCard}>
            <View style={modalStyle.modalHeader}>
              <Text style={modalStyle.modalTitle}>Adicionar Empresa</Text>
              <TouchableOpacity onPress={() => setAddBusinessActive(false)}>
                <Ionicons name="close" size={24} color="#EEE" />
              </TouchableOpacity>
            </View>

            <View style={formStyle.inputItem}>
              <Text style={modalStyle.filterLabel}>Nome da Empresa:</Text>
              <TextInput
                style={formStyle.textInput}
                placeholder="Nome da Empresa"
                value={businessName}
                onChangeText={(text) => setBusinessName(text)}
              ></TextInput>
            </View>

            <View style={formStyle.inputItem}>
              <Text style={modalStyle.filterLabel}>Seu Cargo na Empresa:</Text>
              <TextInput
                style={formStyle.textInput}
                placeholder="Cargo"
                value={businessRole}
                onChangeText={(text) => setBusinessRole(text)}
              ></TextInput>
            </View>

            <View style={formStyle.inputItem}>
              <Text style={modalStyle.filterLabel}>Descrição da Empresa:</Text>
              <TextInput
                style={formStyle.multilineInput}
                placeholder="Descrição"
                multiline
                numberOfLines={5}
                maxLength={300}
                value={businessDescription}
                onChangeText={(text) => setBusinessDescription(text)}
              ></TextInput>
            </View>

            <View style={formStyle.inputItem}>
              <Text style={modalStyle.filterLabel}>
                Area de Atuação da Empresa:
              </Text>
              <TextInput
                style={formStyle.textInput}
                placeholder="Area"
                value={businessArea}
                onChangeText={(text) => setBusinessArea(text)}
              ></TextInput>
            </View>

            <TouchableOpacity
              style={[
                formStyle.actionButton,
                { alignSelf: "center", marginTop: 20 },
              ]}
              onPress={() => addBusiness()}
            >
              <Text style={formStyle.actionButtonText}>Adicionar Empresa</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      </View>
    </ScrollView>
  );
}
