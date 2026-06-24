import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import * as ImagePicker from "expo-image-picker";
import { memberStyle } from "../styles/memberStyle";
import { formStyle } from "../styles/formStyle";
import { modalStyle } from "../styles/modalStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function BusinessCard({
  item,
  isMyBusiness,
  ownerId,
  onActionComplete,
}) {
  const [editBusinessActive, setEditBusinessActive] = useState(false);

  const [businessName, setBusinessName] = useState(item.name);
  const [businessRole, setBusinessRole] = useState(item.role);
  const [businessDescription, setBusinessDescription] = useState(
    item.description,
  );
  const [businessArea, setBusinessArea] = useState(item.area);
  const [imageUri, setImageUri] = useState(item.logo);
  const [removeImageSignal, setRemoveImageSignal] = useState(false);

  const insets = useSafeAreaInsets();

  const resetFormFields = () => {
    setBusinessName(item.name);
    setBusinessRole(item.role);
    setBusinessDescription(item.description);
    setBusinessArea(item.area);
    setImageUri(item.logo);
    setRemoveImageSignal(false);
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
      setRemoveImageSignal(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
    setRemoveImageSignal(true);
  };

  const editBusiness = () => {
    setEditBusinessActive(false);

    const formData = new FormData();

    formData.append("name", businessName);
    formData.append("role", businessRole);
    formData.append("description", businessDescription);
    formData.append("area", businessArea);
    formData.append("removeLogo", removeImageSignal ? "true" : "false");

    if (imageUri && imageUri !== item.logo) {
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
      .patch(`api/member/${ownerId}/business/${item._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Alert.alert(
          "Sucesso",
          res.data || "Informações da Empresa alteradas com Sucesso.",
        );
        if (onActionComplete) onActionComplete();
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

  const deleteBusiness = () => {
    const execDelete = () => {
      api
        .delete(`api/member/${ownerId}/business/${item._id}`)
        .then(() => {
          if (onActionComplete) onActionComplete();
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

    if (Platform.OS === "web") {
      const confirmDelete = window.confirm(
        "Tens a certeza que queres eliminar esta empresa? Esta ação não pode ser desfeita.",
      );
      if (confirmDelete) {
        execDelete();
      } else {
        console.log("Cancelado");
      }
    } else {
      Alert.alert(
        "Eliminar Empresa",
        "Tens a certeza que queres eliminar esta empresa? Esta ação não pode ser desfeita.",
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Cancelado"),
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: () => execDelete,
            style: "destructive",
          },
        ],
      );
    }
  };

  return (
    <View style={memberStyle.cardBusiness}>
      {item.logo ? (
        <Image
          source={{ uri: item.logo }}
          style={memberStyle.businessLogo}
        ></Image>
      ) : (
        <View>
          <Ionicons name={"business"} size={60} color="#A88A44" />
        </View>
      )}
      <View style={memberStyle.cardInfo}>
        <Text style={memberStyle.cardTitle}>
          {item.name}, <Text style={memberStyle.roleText}>{item.role}</Text>
        </Text>
        <Text style={memberStyle.cardSub}>{item.area}</Text>
        <Text style={memberStyle.cardSub}>{item.description}</Text>
      </View>
      {isMyBusiness ? (
        <View style={{ gap: 20 }}>
          <TouchableOpacity
            style={{ alignSelf: "flex-start" }}
            onPress={() => setEditBusinessActive(!editBusinessActive)}
          >
            <Ionicons name="pencil" style={formStyle.iconButton} size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: "flex-start" }}
            onPress={() => deleteBusiness()}
          >
            <Ionicons
              name="trash-outline"
              style={formStyle.iconDanger}
              size={25}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <Modal
        isVisible={editBusinessActive}
        onBackdropPress={() => setEditBusinessActive(false)}
        onBackButtonPress={() => setEditBusinessActive(false)}
        onModalHide={resetFormFields}
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
            <Text style={modalStyle.modalTitle}>Editar Empresa</Text>
            <TouchableOpacity onPress={() => setEditBusinessActive(false)}>
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
            onPress={() => editBusiness()}
          >
            <Text style={formStyle.actionButtonText}>Aplicar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}
