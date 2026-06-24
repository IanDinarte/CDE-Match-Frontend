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
  Alert,
  Platform,
} from "react-native";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  const [imageUri, setImageUri] = useState(null);

  const isMyProfile = member?._id === currentUserId;

  const initialLetter = member?.name
    ? member.name.charAt(0).toUpperCase()
    : "U";

  const insets = useSafeAreaInsets();

  const resetFormFields = () => {
    setBusinessName("");
    setBusinessRole("");
    setBusinessDescription("");
    setBusinessArea("");
    setImageUri("");
  };

  const pickImageFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisas de dar acesso à galeria para escolher uma foto.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: (ImagePicker.MediaType = "images"),
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const addBusiness = () => {
    setAddBusinessActive(false);

    const formData = new FormData();

    formData.append("name", businessName);
    formData.append("role", businessRole);
    formData.append("description", businessDescription);
    formData.append("area", businessArea);

    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("logo", {
        uri: imageUri,
        name: filename,
        type: type,
      });
    }

    api
      .post(`api/member/${member?._id}/business`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        fetchMember();
        Alert.alert("Sucesso", res.data || "Empresa Adicionada.");
        resetFormFields();
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

  const handleOpenLink = async (url) => {
    let formattedUrl = url.trim();

    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      await WebBrowser.openBrowserAsync(formattedUrl);
    } catch (error) {
      const errorMsg =
        error.response?.data || "Ocorreu um erro ao tentar abrir o link";
      if (Platform.OS === "web") {
        window.alert("Error: " + errorMsg);
      } else {
        Alert.alert("Error", errorMsg);
      }
      console.log(error.message + " " + errorMsg);
    }
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
      <SafeAreaView>
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
              Atualizar Perfil
            </Text>
          </TouchableOpacity>
        )}

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

          {member?.websites && member.websites.length > 0 && (
            <View style={{ marginTop: 5 }}>
              {member.websites.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ marginBottom: 5 }}
                  onPress={() => handleOpenLink(item.link)}
                >
                  <Text style={memberStyle.website}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
                  style={{
                    color: "#8A94A6",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  Esse Membro não possui Empresas
                </Text>
              )}
              {isMyProfile && (
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
              )}
            </View>
          ) : (
            <View style={dealStyle.listContent}>
              {member?.deals && member.deals.length > 0 ? (
                member.deals.map((item) => (
                  <DealCard key={item._id} deal={item} />
                ))
              ) : (
                <Text
                  style={{
                    color: "#8A94A6",
                    textAlign: "center",
                    marginTop: 10,
                  }}
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
              resetFormFields();
            }}
            backdropOpacity={0.6}
            backdropTransitionOutTiming={10}
            style={{ margin: 0, justifyContent: "flex-end" }}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            useNativeDriver={true}
          >
            <ScrollView
              style={[
                modalStyle.filterModalCard,
                { paddingBottom: Math.max(insets.bottom, 20) },
              ]}
            >
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
                <Text style={modalStyle.filterLabel}>
                  Seu Cargo na Empresa:
                </Text>
                <TextInput
                  style={formStyle.textInput}
                  placeholder="Cargo"
                  value={businessRole}
                  onChangeText={(text) => setBusinessRole(text)}
                ></TextInput>
              </View>

              <View style={formStyle.inputItem}>
                <Text style={modalStyle.filterLabel}>
                  Descrição da Empresa:
                </Text>
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

              <View style={formStyle.inputItem}>
                <Text style={modalStyle.filterLabel}>Logo da Empresa</Text>
                <View style={formStyle.inputBox}>
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={formStyle.businessLogo}
                    />
                  ) : (
                    <View>
                      <Ionicons name={"business"} size={80} color="#A88A44" />
                    </View>
                  )}
                  <View style={{ flexDirection: "column" }}>
                    <TouchableOpacity
                      style={formStyle.imageOption}
                      onPress={pickImageFromLibrary}
                    >
                      <Ionicons
                        style={formStyle.iconButton}
                        name="images-outline"
                        size={30}
                      />
                      <Text style={formStyle.imageOptionLabel}>
                        Escolher da galeria
                      </Text>
                    </TouchableOpacity>

                    {imageUri && (
                      <TouchableOpacity
                        style={formStyle.imageOption}
                        onPress={handleRemoveImage}
                      >
                        <Ionicons
                          style={formStyle.iconDanger}
                          name="trash-outline"
                          size={30}
                        />
                        <Text style={formStyle.imageRemoveLabel}>
                          Remover foto atual
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  formStyle.actionButton,
                  { alignSelf: "center", marginTop: 20 },
                ]}
                onPress={() => addBusiness()}
              >
                <Text style={formStyle.actionButtonText}>
                  Adicionar Empresa
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Modal>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
