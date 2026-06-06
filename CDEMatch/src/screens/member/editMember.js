import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import { formStyle } from "../../styles/formStyle";
import { modalStyle } from "../../styles/modalStyle";

export default function EditMemberScreen({ route }) {
  const { member } = route.params;

  const [name, setName] = useState(member.name);

  const [phone, setPhone] = useState(member.phone.value);
  const [phoneConf, setPhoneConf] = useState(member.phone.confidential);

  const [email, setEmail] = useState(member.email.value);
  const [emailConf, setEmailConf] = useState(member.email.confidential);

  /**
   * A mudança de senha consiste em: inserir senha antiga e a nova, em seguida
   * a senha antiga inserida é comparada com a atual, se forem iguais, a nova
   * inserida vira a senha atual.
   *
   * Isso é feito em separado do resto das edições e é mudado na hora,
   * independente do botão de aplicar alterações.
   */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  /**
   * membership em vez de ser pra mudar deve redirecionar para algum outro site
   * onde ele pode fazer o upgrade da conta ou algo do genero.
   */
  const [membership, setMembership] = useState(member.membership);
  const [city, setCity] = useState(member.city);
  const [description, setDescription] = useState(member.description);
  const [profilePicture, setProfilePicture] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [websites, setWebsites] = useState([]);

  const [changePasswordActive, setChangePasswordActive] = useState(false);

  const navigation = useNavigation();

  const changePassword = () => {};

  const editMember = () => {
    const memberData = {
      name: name,
      phone: phone,
      phoneConfidential: phoneConf === true ? "on" : "off",
      email: email,
      emailConfidential: emailConf === true ? "on" : "off",
      city: city,
      description: description,
      //profilepicture?
      websites: websites,
    };

    api
      .patch(`api/member/${member._id}`, memberData)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: colors.background }}>
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
            {member.profilePicture ? (
              <Image
                source={{ uri: member.profilePicture }}
                style={formStyle.profilePictureInput}
              />
            ) : (
              <View style={formStyle.profilePictureInput}>
                <Text style={formStyle.avatarText}>
                  {member?.name ? member.name.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={formStyle.formContainer}>
          <View style={formStyle.inputItem}>
            <Text style={formStyle.inputLabel}>Nome</Text>
            <TextInput
              style={formStyle.textInput}
              placeholder="Nome"
              value={name}
              onChangeText={(text) => setName(text)}
            ></TextInput>
          </View>

          <View style={formStyle.inputItem}>
            <Text style={formStyle.inputLabel}>Telemóvel</Text>
            <TextInput
              style={formStyle.textInput}
              placeholder="+351"
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
              value={city}
              onChangeText={(text) => setCity(text)}
            ></TextInput>
          </View>

          <View style={formStyle.inputItem}>
            <Text style={formStyle.inputLabel}>Descrição</Text>
            <TextInput
              style={formStyle.multilineInput}
              placeholder="Descrição"
              multiline
              numberOfLines={5}
              maxLength={300}
              value={description}
              onChangeText={(text) => setDescription(text)}
            ></TextInput>
          </View>

          <View style={formStyle.inputItem}>
            <Text style={formStyle.inputLabel}>Seu Plano: {membership}</Text>
            {/* <View style={{ alignSelf: "center" }}> */}
            <TouchableOpacity style={formStyle.actionButton}>
              <Text style={formStyle.actionButtonText}>Alterar Plano</Text>
            </TouchableOpacity>
            {/* </View> */}
          </View>

          <View style={formStyle.importantArea}>
            <TouchableOpacity
              style={formStyle.actionButton}
              onPress={() => setChangePasswordActive(!changePasswordActive)}
            >
              <Text style={formStyle.actionButtonText}>Alterar Senha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={formStyle.dangerButton} onPress={() => {}}>
              <Text style={formStyle.actionButtonText}>Desativar Conta</Text>
            </TouchableOpacity>
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
        isVisible={changePasswordActive}
        onBackdropPress={() => setChangePasswordActive(false)}
        onBackButtonPress={() => setChangePasswordActive(false)}
        onModalHide={() => {
          setOldPassword("");
          setNewPassword("");
          setRepeatPassword("");
        }}
        backdropOpacity={0.6}
        style={{ margin: 0, justifyContent: "flex-end" }}
        animationIn="slideInUp"
        animationOu="slideInDown"
        useNativeDriver={true}
      >
        <View style={modalStyle.filterModalCard}>
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
    </View>
  );
}
