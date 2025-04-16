<template>
  <b-modal
    id="user-edit-parent-organization-modal"
    title="Edit Parent Organization"
    centered
    hide-footer
    size="lg"
    @hidden="reset"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Edit Parent Organization</h2>
    </template>
    <validation-observer ref="userEditParentOrganizationFormValidation">
      <b-form @submit.prevent>
        <b-row>
          <b-col>
            <VueSelectPaginated
              name="Parent Organizaion"
              label="name"
              :prevSelected="selectedParentOrganization"
              :parameters="{
                  organization_relation: true,
                }"
              :getListMethod="getOrganizations"
              @setMethod="(value) => (selectedParentOrganization = value)"
              searchBy="name"
            />
          </b-col>
        </b-row>
        <b-form-group class="text-right">
          <b-button
            type="submit"
            variant="primary"
            pill
            class="mr-1"
            @click="validationForm"
          >
            Update
          </b-button>
        </b-form-group>
      </b-form>
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "@validations";
import util from "@/util.js";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";

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
      email,
      username: "",
      emailValue: "",
      firstName: "",
      lastName: "",
      selectedParentOrganization: null,
    };
  },
  async mounted() {
    if (this.user) {
      this.selectedParentOrganization = this.user.parent_organization_data;
    }
  },
  methods: {
    ...mapActions({
      updateUser: "appData/updateUser",
      getOrganizations: "appData/getOrganizations",
    }),
    async validationForm() {
      const success =
        await this.$refs.userEditParentOrganizationFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.updateUser({
          payload: {
            parent_organization: this.selectedParentOrganization
              ? this.selectedParentOrganization.id
              : null,
          },
          pk: this.user.id,
        });
        if (res.status === 200) {
          this.$swal({
            title: "User updated Parent Organization successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("user-edit-parent-organization-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },
    reset() {
      this.name = "";
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
  },
};
</script>

<style lang="scss">
.vSelectStyle .vs__deselect {
  fill: #fff !important;
}
</style>
