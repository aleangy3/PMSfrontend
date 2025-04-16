<template>
  <b-modal id="Login-options-show" title="Login Options Shows" centered hide-footer size="lg" :no-close-on-esc="true"
    :no-close-on-backdrop="true">
    <template #modal-title>
      <h2 class="m-0">Choose Login ID</h2>
    </template>
    <b-table :items="userList" :fields="fields" responsive>
      <template #cell(login)="row">
        <b-button variant="info" pill size="sm" class="mr-1" @click="loginOption(row.item)">
          Login
        </b-button>
      </template>
      <template #cell(organization_data)="row">
        {{ row.item.organization_data.name }}
      </template>
    </b-table>
  </b-modal>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";
import store from "@/store";

export default {
  components: {
  },
  props: {
    userList: Array,
    username: String,
    password: String,
  },
  mixins: [util],
  data() {
    return {
      listUser: [],
      currUser: {
        username: '',
        password: '',
      },
      fields: [
        // { key: "name", label: "Name" },
        { key: "username", label: "Username" },
        { key: "organization_data", label: "Organization" },
        { key: "rank_name", label: "Rank" },
        { key: "appointment_name", label: "Appointment" },
        // { key: "profile_status", label: "Profile Status" },
        { key: "login", label: "Auth" },
      ],
    };
  },
  async mounted() {
  },
  methods: {
    ...mapActions({
      login: "appData/login",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
    async loginOption(user) {
      try {
        const res = await this.login({
          username: this.username,
          password: this.password,
          pk: user.id,
        });
        if (res.status === 200) {

          if (store.getters["appData/hasPermission"]("dashboard_show")) 
            {
              this.$router.push({ name: "Dashboard" });
            } else {
              this.$router.push({ name: "Case" });
            }
            this.$swal({
              title: "Logged in successfully",
              icon: "success",
            });
        }
      } catch (error) {
    if (error.response && error.response.status === 401) {
      this.$swal({
        title: "Invalid Credentials",
        text: "Please check your username and password.",
        icon: "error",
      });
    } else {
      this.displayError(error);
    }
  }
    },
  },
  computed: {
    ...mapGetters({ hasRole: "appData/hasRole" }),
  },
};
</script>
  
<style></style>
  