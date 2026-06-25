import React, { useState, useEffect, useRef, createElement } from "react";
import api from "../../services/api";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../styles/colors";
import { formStyle } from "../../styles/formStyle";
import { modalStyle } from "../../styles/modalStyle";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditMemberScreen({ route }) {
  const { member } = route.params;

  const [name, setName] = useState(member.name);

  const [phone, setPhone] = useState(member.phone.value);
  const [phoneConf, setPhoneConf] = useState(member.phone.confidential);

  const [email, setEmail] = useState(member.email.value);
  const [emailConf, setEmailConf] = useState(member.email.confidential);
  const [membership, setMembership] = useState(member.membership);
  const [city, setCity] = useState(member.city);
  const [description, setDescription] = useState(member.description);
  const [businesses, setBusinesses] = useState([]);
  const [websites, setWebsites] = useState(member.websites || []);
  const [websiteName, setWebsiteName] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  const [imageUri, setImageUri] = useState(member.profilePicture);
  const [removeImageSignal, setRemoveImageSignal] = useState(false);
  const [imageMenuVisible, setImageMenuVisible] = useState(false);

  /**
   * A mudança de senha consiste em: inserir senha antiga e a nova, em seguida
   * a senha antiga inserida é comparada com a atual, se forem iguais, a nova
   * inserida vira a senha atual.
   *
   * Isso é feito em separado do resto das edições e é mudado na hora,
   * independente do botão de aplicar alterações.
   */
  const [changePasswordActive, setChangePasswordActive] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const checkPendingResult = async () => {
      const pendingResult = await ImagePicker.getPendingResultAsync();

      if (
        pendingResult &&
        pendingResult.length > 0 &&
        !pendingResult[0].canceled
      ) {
        setImageUri(pendingResult[0].assets[0].uri);
        setRemoveImageSignal(false);
      }
    };

    checkPendingResult();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
      if (Platform.OS === "web") {
        window.alert("Error: " + "Não foi possivel terminar a sessão.");
      } else {
        Alert.alert("Erro", "Não foi possível terminar a sessão.");
      }
    }
  };

  const handleAddWebsite = () => {
    if (!websiteName.trim() || !websiteLink.trim()) {
      Alert.alert("Campos vazios", "Insere o nome e o link do website.");
      return;
    }

    if (websites.length >= 5) {
      Alert.alert("Limite atingido", "Podes adicionar no máximo 5 websites.");
      return;
    }

    const newWebsite = {
      name: websiteName.trim(),
      link: websiteLink.trim(),
    };

    setWebsites([...websites, newWebsite]);
    setWebsiteName("");
    setWebsiteLink("");
  };

  const handleRemoveWebsite = (indexToRemove) => {
    const filteredWebsites = websites.filter(
      (_, index) => index !== indexToRemove,
    );
    setWebsites(filteredWebsites);
  };

  const changePassword = () => {
    if (!oldPassword || !newPassword || !repeatPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos da senha.");
      return;
    }

    if (newPassword !== repeatPassword) {
      Alert.alert("Erro", "A nova senha e a repetição não coincidem.");
      return;
    }

    const passwordData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      repeatPassword: repeatPassword,
    };

    api
      .patch(`api/member/${member._id}/password`, passwordData)
      .then((res) => {
        Alert.alert("Sucesso", res.data || "Senha alterada com sucesso.");
        setChangePasswordActive(false);
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

  const takePhoto = async () => {
    setImageMenuVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisas de dar acesso à câmara para tirar uma foto.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setRemoveImageSignal(false);
    }
  };

  const takePhotoWeb = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      window.alert(
        "Permissão necessária. Precisas de dar acesso à câmara para tirar uma foto.",
      );
      return;
    }
    
  };

  const pickImageFromLibrary = async () => {
    setImageMenuVisible(false);
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
      setRemoveImageSignal(false);
    }
  };

  const handleRemoveImage = () => {
    setImageMenuVisible(false);
    setImageUri(null);
    setRemoveImageSignal(true);
  };

  const editMember = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("phoneConfidential", phoneConf === true ? "on" : "off");
    formData.append("email", email);
    formData.append("emailConfidential", emailConf === true ? "on" : "off");
    formData.append("city", city);
    formData.append("description", description);
    websites.forEach((site) => {
      formData.append("websiteNames", site.name);
      formData.append("websiteLinks", site.link);
    });
    formData.append(
      "removeProfilePicture",
      removeImageSignal ? "true" : "false",
    );

    if (imageUri && imageUri !== member.profilePicture) {
      if (Platform.OS === "web") {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        formData.append("profilePicture", blob, "upload.jpg");
      } else {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("profilePicture", {
          uri: imageUri,
          name: filename,
          type: type,
        });
      }
    }

    api
      .patch(`api/member/${member._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Alert.alert("Sucesso", res.data || "Membro editado com sucesso.");
        navigation.goBack();
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

  const deactivateAccount = () => {
    const execDeactivate = () => {
      api
        .patch(`api/member/${member._id}/deactivate`)
        .then(() => {})
        .catch((error) => {
          if (Platform.OS === "web") {
            window.alert("Error: " + errorMsg);
          } else {
            Alert.alert("Error", error.response.data);
          }
          console.log(error.message + " " + error.response.data);
        });
    };

    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("Deseja desativar sua conta?");
      if (confirmDelete) {
        execDeactivate();
      } else {
        console.log("Cancelado");
      }
    } else {
      Alert.alert("Deseja desativar sua conta?", "", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => execDeactivate,
          style: "destructive",
        },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView>
          <View style={formStyle.formHeader}>
            <View style={formStyle.titleRow}>
              <TouchableOpacity
                style={formStyle.backButtonContainer}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  style={formStyle.backButton}
                  name="chevron-back-outline"
                  size={30}
                />
              </TouchableOpacity>

              <Text style={formStyle.formTitle}>
                Editar Perfil de {member.name}
              </Text>
            </View>

            <View style={formStyle.avatarContainer}>
              <TouchableOpacity onPress={() => setImageMenuVisible(true)}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={formStyle.profilePictureInput}
                  />
                ) : (
                  <View style={formStyle.profilePictureInput}>
                    <Text style={formStyle.avatarText}>
                      {name ? name.charAt(0).toUpperCase() : "U"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {Platform.OS === "web" ? (
                <View>
                  {/* <TouchableOpacity
                    onPress={() => takePhotoWeb(true)}
                    style={formStyle.cameraButton}
                  >
                    <Ionicons name="camera" size={30} color="#EEEEEE" />
                  </TouchableOpacity> */}

                  <TouchableOpacity
                    onPress={() => setImageMenuVisible(true)}
                    style={formStyle.imageButton}
                  >
                    <Ionicons name="images" size={30} color="#EEEEEE" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setImageMenuVisible(true)}
                  style={formStyle.imageButton}
                >
                  <Ionicons name="camera" size={30} color="#EEEEEE" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={formStyle.formContainer}>
            <View style={formStyle.inputItem}>
              <Text style={formStyle.inputLabel}>Nome</Text>
              <TextInput
                style={formStyle.textInput}
                placeholder="Nome"
                placeholderTextColor={colors.placeholder}
                value={name}
                onChangeText={(text) => setName(text)}
              ></TextInput>
            </View>

            <View style={formStyle.inputItem}>
              <Text style={formStyle.inputLabel}>Telemóvel</Text>
              <TextInput
                style={formStyle.textInput}
                placeholder="+351"
                placeholderTextColor={colors.placeholder}
                value={phone}
                onChangeText={(text) => setPhone(text)}
                inputMode="tel"
              ></TextInput>
            </View>

            <View style={formStyle.inputBox}>
              <Text style={formStyle.inputLabel}>Telemóvel Confidencial</Text>
              <TouchableOpacity onPress={() => setPhoneConf(!phoneConf)}>
                {phoneConf ? (
                  <Ionicons name="checkbox" size={30} color={colors.primary} />
                ) : (
                  <Ionicons
                    name="square-outline"
                    size={30}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={formStyle.inputItem}>
              <Text style={formStyle.inputLabel}>Email</Text>
              <TextInput
                style={formStyle.textInput}
                placeholder="exemplo@email.com"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={(text) => setEmail(text)}
              ></TextInput>
            </View>

            <View style={formStyle.inputBox}>
              <Text style={formStyle.inputLabel}>Email Confidencial</Text>
              <TouchableOpacity onPress={() => setEmailConf(!emailConf)}>
                {emailConf ? (
                  <Ionicons name="checkbox" size={30} color={colors.primary} />
                ) : (
                  <Ionicons
                    name="square-outline"
                    size={30}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={formStyle.inputItem}>
              <Text style={formStyle.inputLabel}>Cidade</Text>
              <TextInput
                style={formStyle.textInput}
                placeholder="Cidade"
                placeholderTextColor={colors.placeholder}
                value={city}
                onChangeText={(text) => setCity(text)}
              ></TextInput>
            </View>

            <View style={formStyle.inputItem}>
              <Text style={formStyle.inputLabel}>Descrição</Text>
              <TextInput
                style={formStyle.multilineInput}
                placeholder="Descrição"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={5}
                maxLength={300}
                value={description}
                onChangeText={(text) => setDescription(text)}
              ></TextInput>
            </View>

            <View style={[formStyle.inputItem, { marginTop: 15 }]}>
              <Text style={formStyle.inputLabel}>
                Websites ({websites.length}/5)
              </Text>

              <View
                style={{
                  backgroundColor: colors.cardBackground,
                  padding: 12,
                  borderRadius: 8,
                  gap: 10,
                }}
              >
                <TextInput
                  style={formStyle.textInput}
                  placeholder="Nome do Website"
                  placeholderTextColor={colors.placeholder}
                  value={websiteName}
                  onChangeText={setWebsiteName}
                />
                <TextInput
                  style={formStyle.textInput}
                  placeholder="exemplo.com"
                  placeholderTextColor={colors.placeholder}
                  value={websiteLink}
                  onChangeText={setWebsiteLink}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                <TouchableOpacity
                  style={[
                    formStyle.actionButton,
                    { marginTop: 5, width: "100%", justifyContent: "center" },
                  ]}
                  onPress={handleAddWebsite}
                >
                  <Text style={formStyle.actionButtonText}>
                    + Adicionar Website
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 10, gap: 8 }}>
                {websites.map((site, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: colors.background,
                      padding: 12,
                      borderRadius: 6,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text
                        style={{
                          color: "#FFF",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        {site.name}
                      </Text>
                      <Text
                        style={{
                          color: colors.primary || "#A88A44",
                          fontSize: 12,
                        }}
                        numberOfLines={1}
                      >
                        {site.link}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveWebsite(index)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color="#FF6B6B"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={formStyle.importantArea}>
              <TouchableOpacity
                style={formStyle.actionButton}
                onPress={() => setChangePasswordActive(!changePasswordActive)}
              >
                <Text style={formStyle.actionButtonText}>Alterar Senha</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={formStyle.dangerButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color="#FFF" />
                <Text style={formStyle.actionButtonText}>Terminar Sessão</Text>
              </TouchableOpacity>
            </View>

            <View style={formStyle.inputItem}>
              <TouchableOpacity
                style={formStyle.dangerButton}
                onPress={() => {
                  deactivateAccount();
                }}
              >
                <Text style={formStyle.actionButtonText}>Desativar Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 10,
          paddingHorizontal: 10,
          paddingTop: 15,
          backgroundColor: colors.cardBackground,
        }}
      >
        <TouchableOpacity
          style={formStyle.actionButton}
          onPress={() => editMember()}
        >
          <Text style={formStyle.actionButtonText}>Aplicar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={formStyle.dangerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={formStyle.actionButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={imageMenuVisible}
        onBackdropPress={() => setImageMenuVisible(false)}
        onBackButtonPress={() => setImageMenuVisible(false)}
        backdropOpacity={0.5}
        backdropTransitionOutTiming={10}
        style={{ margin: 0, justifyContent: "flex-end" }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver={true}
      >
        <View
          style={[
            modalStyle.filterModalCard,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <Text
            style={[
              modalStyle.modalTitle,
              { textAlign: "center", marginBottom: 20 },
            ]}
          >
            Foto de Perfil
          </Text>

          {Platform.OS !== "web" && (
            <TouchableOpacity style={formStyle.imageOption} onPress={takePhoto}>
              <Ionicons
                style={formStyle.iconButton}
                name="camera-outline"
                size={30}
              />
              <Text style={formStyle.imageOptionLabel}>Tirar nova foto</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={formStyle.imageOption}
            onPress={pickImageFromLibrary}
          >
            <Ionicons
              style={formStyle.iconButton}
              name="images-outline"
              size={30}
            />
            <Text style={formStyle.imageOptionLabel}>Escolher da galeria</Text>
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
              <Text style={formStyle.imageRemoveLabel}>Remover foto atual</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={formStyle.dangerButton}
            onPress={() => setImageMenuVisible(false)}
          >
            <Text style={formStyle.actionButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={changePasswordActive}
        onBackdropPress={() => setChangePasswordActive(false)}
        onBackButtonPress={() => setChangePasswordActive(false)}
        onModalHide={() => {
          setOldPassword("");
          setNewPassword("");
          setRepeatPassword("");
        }}
        backdropOpacity={0.6}
        backdropTransitionOutTiming={10}
        style={{ margin: 0, justifyContent: "flex-end" }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver={true}
      >
        <View
          style={[
            modalStyle.filterModalCard,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={modalStyle.modalHeader}>
            <Text style={modalStyle.modalTitle}>Alterar Senha</Text>
            <TouchableOpacity onPress={() => setChangePasswordActive(false)}>
              <Ionicons name="close" size={24} color="#EEE" />
            </TouchableOpacity>
          </View>

          <View style={formStyle.inputItem}>
            <Text style={modalStyle.filterLabel}>Insira sua Senha Atual:</Text>
            <TextInput
              style={formStyle.textInput}
              placeholder="Senha Atual"
              value={oldPassword}
              secureTextEntry
              onChangeText={(text) => setOldPassword(text)}
            ></TextInput>
          </View>

          <View style={formStyle.inputItem}>
            <Text style={modalStyle.filterLabel}>Insira sua Nova Senha:</Text>
            <TextInput
              style={formStyle.textInput}
              placeholder="Nova Senha"
              value={newPassword}
              secureTextEntry
              onChangeText={(text) => setNewPassword(text)}
            ></TextInput>
          </View>

          <View style={formStyle.inputItem}>
            <Text style={modalStyle.filterLabel}>
              Insira sua Nova Senha novamente:
            </Text>
            <TextInput
              style={formStyle.textInput}
              placeholder="Repetir Senha"
              value={repeatPassword}
              secureTextEntry
              onChangeText={(text) => setRepeatPassword(text)}
            ></TextInput>
          </View>

          <TouchableOpacity
            style={[
              formStyle.actionButton,
              { alignSelf: "center", marginTop: 20 },
            ]}
            onPress={() => changePassword()}
          >
            <Text style={formStyle.actionButtonText}>Alterar Senha</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
