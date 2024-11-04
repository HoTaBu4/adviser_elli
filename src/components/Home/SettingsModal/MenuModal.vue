<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from "vue";
import InputField from "../../CommonComponents/InputField/InputField.vue";
import { useLanguage } from "../../../assets/hooks/useLanguage";
import { Languages } from "../../../store/types/LanguageType";
import { logout } from "../../../services/authService";
import { deleteAllSavedMessages } from "../../../api/messages/messages";
import { deleteAllChats } from "../../../store/modules/chats";
import debounce from "../../../assets/debouce/debounce";
import { useStore } from "vuex";
import { UserState } from "../../../store/types/UserType";
import { client } from "../../../api/fetchClient";

const info = reactive({
  code: {
    text: "",
    error: "",
  },
  password: {
    text: "",
    error: "",
  },
  repeatedPassword: {
    text: "",
    error: "",
  },
});

defineProps({
  type: {
    type: String,
  },
});

// const modalRef = ref<VNodeRef | null>(null);
const emit = defineEmits(["close-modal"]);
const { language, handleSetLanguage } = useLanguage();
const store = useStore();
const user: UserState = store.state.user;

const handleChangeLanguage = (targetLanguage: Languages) => {
  if (language.value !== targetLanguage) {
    handleSetLanguage(targetLanguage);
  }
};

const handleSubmit = () => {
  info.code.error = "";
  info.password.error = "";
  info.repeatedPassword.error = "";

  if (!info.code.text) {
    info.code.error =
      language.value === Languages.us
        ? "Code is required"
        : "Код є обов'язковим";
    return;
  }

  if (!info.password.text) {
    info.password.error =
      language.value === Languages.us
        ? "Password is required"
        : "Пароль є обов'язковим";
    return;
  }

  if (info.password.text.length < 8 || info.password.text.length > 15) {
    info.password.error =
      language.value === Languages.us
        ? "Password must be from 8 to 15 characters"
        : "Пароль має містити від 8 до 15 символів";
    return;
  }

  if (!/^[A-Z]/.test(info.password.text)) {
    info.password.error =
      language.value === Languages.us
        ? "The first letter must be uppercase"
        : "Перша літера має бути великою";
    return;
  }

  if (info.password.text !== info.repeatedPassword.text) {
    info.repeatedPassword.error =
      language.value === Languages.us
        ? "Passwords do not match"
        : "Паролі не збігаються";
    return;
  }
};

const handleClose = () => {
  emit("close-modal");
};

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target && target.classList && target.classList.contains("menu-modal")) {
    handleClose(); // Close the modal
  }
};

// Register the click event listener to detect clicks outside the modal
onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const settingsTitle = computed(() =>
  language.value === Languages.us ? "SETTINGS :" : "НАЛАШТУВАННЯ :",
);

const handleSendCode = debounce(() => {
  client.post("/forgot_password/", { email: user.user.email });
}, 1500);

const accountTitle =
  language.value === Languages.us ? "YOUR ACCOUNT :" : "ТВІЙ АККАУНТ :";
</script>

<template>
  <div class="menu-modal" @click="handleOutsideClick">
    <form class="menu-modal__content" @click.stop>
      <div class="menu-modal__close">
        <img
          src="/pictures/icons/mobile_close.svg"
          alt=""
          class="menu-modal__close-img"
          @click="handleClose"
        />
      </div>
      <div class="menu-modal__title">
        {{ type === "settings" ? settingsTitle : accountTitle }}
      </div>
      <div class="menu-modal__settigns" v-if="type === 'settings'">
        <div class="menu-modal__language">
          <div class="menu-modal__language-title">
            {{ language === Languages.us ? "language :" : "мова :" }}
          </div>
          <div class="menu-modal__language-change">
            <div
              class="menu-modal__en"
              :class="{ 'menu-modal__en--selected': language === Languages.us }"
              @click="handleChangeLanguage(Languages.us)"
            >
              EN
            </div>
            <div
              class="menu-modal__uk"
              :class="{ 'menu-modal__uk--selected': language === Languages.uk }"
              @click="handleChangeLanguage(Languages.uk)"
            >
              UK
            </div>
          </div>
        </div>
        <div class="menu-modal__buttons">
          <button
            class="menu-modal__delete-chats"
            @click="deleteAllSavedMessages()"
          >
            {{
              language === Languages.us
                ? "DELETE ALL SAVED MESSAGES"
                : "ВИДАЛИТИ ВСІ ЗБЕРЕЖЕНІ"
            }}
          </button>
          <button class="menu-modal__delete-chats" @click="deleteAllChats()">
            {{
              language === Languages.us
                ? "DELETE ALL CHATS"
                : "ВИДАЛИТИ ВСІ ЧАТИ"
            }}
          </button>
        </div>
      </div>
      <form class="menu-modal__account" @submit.prevent="handleSubmit" v-else>
        <div class="menu-modal__password">
          <InputField
            v-model="info.code.text"
            :error="info.code.error"
            :placeholder="language === Languages.us ? 'code' : `код`"
            name="password"
            :isStatic="true"
            :labelText="language === language.us ? 'code' : `код`"
            :labelColor="true"
          />
          <InputField
            v-model="info.password.text"
            :error="info.password.error"
            :placeholder="language === Languages.us ? 'password' : `пароль`"
            name="password"
            :isStatic="true"
            :labelText="language === language.us ? 'password' : `пароль`"
            :labelColor="true"
            :isPassword="true"
          />
          <InputField
            v-model="info.repeatedPassword.text"
            :error="info.repeatedPassword.error"
            :placeholder="
              language === Languages.us ? 'password' : ` повторити пароль`
            "
            name="repeat password"
            :isStatic="true"
            :labelText="
              language === language.us ? 'password' : `  повторити пароль`
            "
            :labelColor="true"
            :isPassword="true"
          />
        </div>
        <div class="menu-modal__buttons">
          <button
            class="menu-modal__send-code"
            @click="handleSendCode"
            type="button"
          >
            {{ language === Languages.us ? "SEND CODE" : "НАДІСЛАТИ КОД" }}
          </button>
          <button class="menu-modal__save" type="submit">
            {{ language === Languages.us ? "SAVE" : "ЗБЕРЕГТИ" }}
          </button>
          <button class="menu-modal__log-out" @click="logout()">
            {{ language === Languages.us ? "log out" : "ВИЙТИ" }}
          </button>
        </div>
      </form>
    </form>
  </div>
</template>

<style>
@import "./menuModal.scss";
</style>
