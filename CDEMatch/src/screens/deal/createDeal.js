import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import { dealStyle } from "../../styles/dealStyle";
import { modalStyle } from "../../styles/modalStyle";
import { formStyle } from "../../styles/formStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateDealScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Procura");
  const [area, setArea] = useState("Investimento");
  const [price, setPrice] = useState("");
  const [confidential, setConfidential] = useState(false);

  const [selectTypeActive, setSelectTypeActive] = useState(false);
  const [selectAreaActive, setSelectAreaActive] = useState(false);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const createDeal = () => {
    const dealData = {
      title: title,
      description: description,
      type: type,
      area: area,
      price: price,
      confidential: confidential,
    };

    api
      .post(`api/deal`, dealData)
      .then((res) => {
        discard();
        Alert.alert("Sucesso", res.data || "Negócio Criado com Sucesso");
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data);
        console.log(error.message + " " + error.response.data);
      });
  };

  const discard = () => {
    navigation.goBack();
    setTitle("");
    setDescription("");
    setType("Procura");
    setArea("Investimento");
    setPrice("");
    setConfidential(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={dealStyle.detailsContainer}>
        <View style={dealStyle.detailsHeaderContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={formStyle.backButton}
              name="chevron-back-outline"
              size={30}
            />
          </TouchableOpacity>
          <Text style={dealStyle.detailTitle}>Criar Novo Negócio</Text>
        </View>

        <View style={{ padding: 16 }}>
          <View style={dealStyle.card}>
            <View style={dealStyle.inputItem}>
              <Text style={dealStyle.inputLabel}>Titulo do Negócio*</Text>
              <TextInput
                style={dealStyle.textInput}
                placeholder="Titulo..."
                placeholderTextColor={colors.placeholder}
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>

            <View style={dealStyle.inputItem}>
              <Text style={dealStyle.inputLabel}>Descrição do Negócio*</Text>
              <TextInput
                style={dealStyle.multilineInput}
                placeholder="Descrição..."
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={5}
                maxLength={300}
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
            </View>

            <View style={dealStyle.inputItem}>
              <Text style={dealStyle.inputLabel}>Preço*</Text>
              <TextInput
                style={dealStyle.textInput}
                placeholder="€"
                placeholderTextColor={colors.placeholder}
                value={price}
                onChangeText={(value) => setPrice(value)}
                inputMode="decimal"
                clear
              />
            </View>

            <View style={dealStyle.inputItem}>
              <Text style={dealStyle.inputLabel}>Tipo de Negócio*</Text>
              <TouchableOpacity
                style={dealStyle.actionButton}
                onPress={() => setSelectTypeActive(!selectTypeActive)}
              >
                <Text style={dealStyle.actionButtonText}>{type}</Text>
              </TouchableOpacity>
            </View>

            <Modal
              isVisible={selectTypeActive}
              onBackdropPress={() => setSelectTypeActive(false)}
              onBackButtonPress={() => setSelectTypeActive(false)}
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
                <Text style={modalStyle.filterLabel}>
                  Selecione o Tipo de Negócio
                </Text>
                <View style={modalStyle.chipContainer}>
                  {["Oferta", "Procura"].map((dealType) => {
                    const isSelected = type === dealType;
                    return (
                      <TouchableOpacity
                        key={dealType}
                        style={[
                          modalStyle.chip,
                          isSelected && modalStyle.chipSelected,
                        ]}
                        onPress={() => setType(dealType)}
                      >
                        <Text
                          style={[
                            modalStyle.chipText,
                            isSelected && modalStyle.chipTextSelected,
                          ]}
                        >
                          {dealType}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Modal>

            <View style={dealStyle.inputItem}>
              <Text style={dealStyle.inputLabel}>Area do Negócio*</Text>
              <TouchableOpacity
                style={dealStyle.actionButton}
                onPress={() => setSelectAreaActive(!selectAreaActive)}
              >
                <Text style={dealStyle.actionButtonText}>{area}</Text>
              </TouchableOpacity>
            </View>

            <Modal
              isVisible={selectAreaActive}
              onBackdropPress={() => setSelectAreaActive(false)}
              onBackButtonPress={() => setSelectAreaActive(false)}
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
                <Text style={modalStyle.filterLabel}>
                  Selecione a Area do Negócio
                </Text>
                <View style={modalStyle.chipContainer}>
                  {[
                    "Investimento",
                    "Venda de Ativo",
                    "Parceria Estratégica",
                    "Compra de Negócio",
                    "Financiamento",
                    "Ajuda Rápida",
                    "Procura de Perfis Chave",
                    "Oportunidades",
                    "Imobiliário",
                  ].map((dealArea) => {
                    const isSelected = area === dealArea;
                    return (
                      <TouchableOpacity
                        key={dealArea}
                        style={[
                          modalStyle.chip,
                          isSelected && modalStyle.chipSelected,
                        ]}
                        onPress={() => setArea(dealArea)}
                      >
                        <Text
                          style={[
                            modalStyle.chipText,
                            isSelected && modalStyle.chipTextSelected,
                          ]}
                        >
                          {dealArea}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Modal>

            <View style={dealStyle.inputBox}>
              <Text style={dealStyle.inputLabel}>Negócio Confidencial</Text>
              <TouchableOpacity onPress={() => setConfidential(!confidential)}>
                {confidential ? (
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
          </View>
        </View>
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
          style={dealStyle.actionButton}
          onPress={() => createDeal()}
        >
          <Text style={dealStyle.actionButtonText}>Criar</Text>
          <Ionicons name="add-circle-outline" size={22} color="#EEEEEE" />
        </TouchableOpacity>

        <TouchableOpacity
          style={dealStyle.dangerButton}
          onPress={() => discard()}
        >
          <Text style={dealStyle.actionButtonText}>Descartar</Text>
          <Ionicons name="trash-outline" size={22} color="#EEEEEE" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
