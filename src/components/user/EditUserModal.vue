<template>
  <b-modal
    id="edit-user-modal"
    centered
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title> <h2 class="m-0">Edit User</h2> </template>
    <validation-observer ref="editUserFormValidation">
      <b-form @submit.prevent>
        <b-form-row>
          <b-col>
            <VueSelectPaginated
              name="Role"
              label="name"
              :prevSelected="selectedRole"
              :getMethod="getRole"
              :getListMethod="getRoles"
              @setMethod="
                (value) => {
                  selectedRole = value;
                }
              "
            />
          </b-col>
        </b-form-row>
      </b-form>
    </validation-observer>
    <template #modal-footer>
      <b-form-group class="text-right">
        <b-button type="submit" variant="info" pill @click="validationForm">
          Update
        </b-button>
      </b-form-group>
    </template>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
  },
  props: {
    user: Object,
  },
  mixins: [util],
  data() {
    return {
      required,
      selectedRole: null,
    };
  },
  async mounted() {
    if (this.user) {
      this.role = this.user.role_data;
    }
  },
  methods: {
    ...mapActions({
      updateUser: "appData/updateUser",
      getRoles: "appData/getRoles",
      getRole: "appData/getRole",
    }),
    async validationForm() {
      const success = await this.$refs.editUserFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.updateUser({
          payload: {
            role: this.selectedRole ? this.selectedRole.id : null,
          },
          pk: this.user.id,
        });
        if (res.status === 200) {
          this.$swal({
            title: "User updated successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("edit-user-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
  },
};
</script>

<style></style>
