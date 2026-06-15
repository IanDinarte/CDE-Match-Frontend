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

export default function EditDealScreen({ route }) {
  const [title, setTitle] = useState(route.params.deal.title);
  const [description, setDescription] = useState(route.params.deal.description);
  const [type, setType] = useState(route.params.deal.type);
  const [area, setArea] = useState(route.params.deal.area);
  const [price, setPrice] = useState(route.params.deal.price.toString());
  const [confidential, setConfidential] = useState(
    route.params.deal.confidential,
  );
  const [state, setState] = useState(route.params.deal.state);

  const [selectTypeActive, setSelectTypeActive] = useState(false);
  const [selectAreaActive, setSelectAreaActive] = useState(false);
  const [selectStateActive, setSelectStateActive] = useState(false);

  const navigation = useNavigation();

  const deleteDeal = () => {
    Alert.alert("Deletar Deal", "Esta ação não pode ser desfeita.", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancelado"),
        style: "cancel",
      },
      {
        text: "Deletar",
        onPress: () => {
          api
            .delete(`api/deal/${route.params.deal._id}`)
            .then((res) => {
              Alert.alert("Sucesso", res.data);
              navigation.goBack();
            })
            .catch((error) => {
              Alert.alert("Error", error.response.data);
              console.log(error.message + " " + error.response.data);
            });
        },
        style: "destructive",
      },
    ]);
  };

  const editDeal = () => {
    const dealData = {
      title: title,
      description: description,
      type: type,
      area: area,
      price: price,
      confidential: confidential,
      state: state,
    };

    api
      .patch(`api/deal/${route.params.deal._id}`, dealData)
      .then((res) => {
        navigation.goBack();
        Alert.alert("Sucesso", res.data || "Negócio Editado com Sucesso");
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data);
        console.log(error.message + " " + error.response.data);
      });
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
          <Text style={dealStyle.detailTitle}>Editar Negócio</Text>
        </View>

        <View style={{ padding: 16 }}>
          <View style={dealStyle.card}>
            <View style={dealStyle.inputItem}>
              <Text style={dealStyle.inputLabel}>Titulo do Negócio*</Text>
              <TextInput
                style={dealStyle.textInput}
                placeholder="Titulo..."
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>

            <View style={dealStyle.inputItem}>
              <Text style={dealStyle.inputLabel}>Descrição do Negócio*</Text>
              <TextInput
                style={dealStyle.multilineInput}
                placeholder="Descrição..."
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
                value={price}
                onChangeText={(value) => setPrice(value)}
                inputMode="numeric"
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
              <View style={modalStyle.filterModalCard}>
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
              <View style={modalStyle.filterModalCard}>
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

            <View style={dealStyle.inputItem}>
              <Text style={dealStyle.inputLabel}>
                Alterar Estado do Negócio*
              </Text>
              <TouchableOpacity
                style={dealStyle.actionButton}
                onPress={() => setSelectStateActive(!selectStateActive)}
              >
                <Text style={dealStyle.actionButtonText}>{state}</Text>
              </TouchableOpacity>
            </View>

            <Modal
              isVisible={selectStateActive}
              onBackdropPress={() => setSelectStateActive(false)}
              onBackButtonPress={() => setSelectStateActive(false)}
              backdropOpacity={0.6}
              backdropTransitionOutTiming={10}
              style={{ margin: 0, justifyContent: "flex-end" }}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              useNativeDriver={true}
            >
              <View style={modalStyle.filterModalCard}>
                <Text style={modalStyle.filterLabel}>
                  Selecione o Estado do Negócio
                </Text>
                <View style={modalStyle.chipContainer}>
                  {["Disponivel", "Fechado", "Cancelado"].map((dealState) => {
                    const isSelected = state === dealState;
                    return (
                      <TouchableOpacity
                        key={dealState}
                        style={[
                          modalStyle.chip,
                          isSelected && modalStyle.chipSelected,
                        ]}
                        onPress={() => setState(dealState)}
                      >
                        <Text
                          style={[
                            modalStyle.chipText,
                            isSelected && modalStyle.chipTextSelected,
                          ]}
                        >
                          {dealState}
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

            {state === "Cancelado" && (
              <View style={[dealStyle.inputBox, { marginTop: 10 }]}>
                <TouchableOpacity
                  style={dealStyle.dangerButton}
                  onPress={() => deleteDeal()}
                >
                  <Text style={dealStyle.actionButtonText}>
                    Deletar Negócio
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
          onPress={() => editDeal()}
        >
          <Text style={dealStyle.actionButtonText}>Aplicar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dealStyle.dangerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={dealStyle.actionButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
