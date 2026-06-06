import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { memberStyle } from "../styles/memberStyle";
import { formStyle } from "../styles/formStyle";
import Modal from "react-native-modal";
import { modalStyle } from "../styles/modalStyle";
import api from "../services/api";

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
  const [businessLogo, setBusinessLogo] = useState("");

  const editBusiness = () => {
    setEditBusinessActive(false);

    const businessData = {
      name: businessName,
      role: businessRole,
      description: businessDescription,
      area: businessArea,
    };

    api
      .patch(`api/member/${ownerId}/business/${item._id}`, businessData)
      .then(() => {
        if (onActionComplete) onActionComplete();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const deleteBusiness = () => {
    api
      .delete(`api/member/${ownerId}/business/${item._id}`)
      .then(() => {
        if (onActionComplete) onActionComplete();
      })
      .catch((error) => {
        console.log(error.message);
      });
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
          <Ionicons name={"business"} size={40} color="#A88A44" />
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
        backdropOpacity={0.6}
        style={{ margin: 0, justifyContent: "flex-end" }}
        animationIn="slideInUp"
        animationOu="slideInDown"
        useNativeDriver={true}
      >
        <ScrollView style={modalStyle.filterModalCard}>
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
