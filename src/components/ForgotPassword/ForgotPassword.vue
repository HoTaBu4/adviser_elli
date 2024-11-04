<script setup lang="tsx">
import { reactive, ref } from "vue";
import Header from "../CommonComponents/Header/Header.vue";
import FirstStageResetPassword from "./FirstStageResetPassword/FirstStageResetPassword.vue";
import ConfirmResetPassword from "./ConfirmResetPassword/ConfirmResetPassword.vue";
import { useLanguage } from "../../assets/hooks/useLanguage";
import { Languages } from "../../store/types/LanguageType";
import { client } from "../../api/fetchClient";

const email = reactive({
  text: "",
  error: "",
});

const secondStage = ref<boolean>(false);
const { language } = useLanguage();

const validateEmail = () => {
  const emailRegex =
    /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  email.error = "";

  if (!emailRegex.test(email.text)) {
    email.error =
      language.value === Languages.us
        ? "Invalid email format"
        : "Недійсний формат пошти";
  }
};

const handleSubmit = () => {
  if (!secondStage.value) {
    validateEmail();
    if (!email.error) {
      client.post("/forgot_password/", { email: email.text }).then((data) => {
        secondStage.value = true;
      });
    }
  }
};
</script>

<template>
  <Header />
  <main class="main">
    <FirstStageResetPassword
      v-if="!secondStage"
      :email
      @SubmitEmail="handleSubmit"
    />
    <ConfirmResetPassword :email="email.text" v-else-if="secondStage" />
  </main>
</template>

<style>
@import "ForgotPassword.scss";
</style>
