<template>
  <b-modal
    id="edit-role-modal"
    centered
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0 text-primary">Edit Role</h2>
    </template>
    <validation-observer ref="editRoleFormValidation">
      <b-form @submit.prevent>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="name">
              <template #label>
                Name <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Name"
                :rules="{ required, regex: /^[-/A-Z0-9\s]*$/i }"
              >
                <b-form-input
                  id="name"
                  v-model="name"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Name"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="codeName">
              <template #label>
                Code Name <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Code Name"
                :rules="{ required, regex: /^[-/A-Z0-9\s]*$/i }"
              >
                <b-form-input
                  id="codeName"
                  v-model="codeName"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Code Name"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <h6 class="text-primary font-weight-bold text-center">
              Available Permissions
            </h6>
            <b-form-group>
              <b-form-input
                v-model="availablePermissionSearch"
                placeholder="Search"
              />
            </b-form-group>
            <div class="overflow-auto scroll-area-size border border-primary">
              <b-list-group-item
                v-for="(permission, index) in filterAvailablePermissionByName"
                :key="index"
                tag="li"
              >
                <div class="d-flex align-items-center justify-content-between">
                  <div class="ml-25">
                    <b-card-text class="mb-0 font-weight-bold">
                      {{ permission.name }}
                    </b-card-text>
                    <b-card-text class="mb-0">
                      {{ permission.module_name }}
                    </b-card-text>
                    <small>{{ permission.description }}</small>
                  </div>
                  <div>
                    <b-button
                      size="sm"
                      variant="success"
                      pill
                      @click="changePermission(permission, true)"
                    >
                      <feather-icon icon="PlusIcon" class="mr-50" />
                      <span class="align-middle">Add</span>
                    </b-button>
                  </div>
                </div>
              </b-list-group-item>
            </div>
          </b-col>
          <b-col md="6">
            <h6 class="text-primary font-weight-bold text-center">
              Allowed Permissions
            </h6>
            <b-form-group>
              <b-form-input
                v-model="allowedPermissionSearch"
                placeholder="Search"
              />
            </b-form-group>
            <div class="overflow-auto scroll-area-size border border-primary">
              <b-list-group-item
                v-for="(permission, index) in filterAllowedPermissionByName"
                :key="index"
                tag="li"
              >
                <div class="d-flex align-items-center justify-content-between">
                  <div class="ml-25">
                    <b-card-text class="mb-0 font-weight-bold">
                      {{ permission.name }}
                    </b-card-text>
                    <b-card-text class="mb-0">
                      {{ permission.module_name }}
                    </b-card-text>
                    <small>{{ permission.description }}</small>
                  </div>
                  <div>
                    <b-button
                      size="sm"
                      variant="danger"
                      pill
                      @click="changePermission(permission, false)"
                    >
                      <feather-icon icon="XIcon" class="mr-50" />
                      <span class="align-middle">Delete</span>
                    </b-button>
                  </div>
                </div>
              </b-list-group-item>
            </div>
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
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    role: Object,
  },
  mixins: [util],
  data() {
    return {
      name: "",
      codeName: "",
      availablePermissionSearch: "",
      allowedPermissionSearch: "",
      required,
      availablePermissionList: [],
      allowedPermissionList: [],
    };
  },
  async mounted() {
    if (this.role) {
      this.name = this.role.name;
      this.codeName = this.role.code_name;

      this.allowedPermissionList = [...this.role.permissions];

      try {
        const res = await this.getPermissions();
        let allPermissions = res.data;

        const myArrayFiltered = allPermissions.filter((el) => {
          return this.allowedPermissionList.every((f) => {
            return f.id !== el.id;
          });
        });
        this.availablePermissionList = myArrayFiltered;
      } catch (error) {
        this.displayError(error);
      }
    }
  },
  methods: {
    ...mapActions({
      updateRole: "appData/updateRole",
      getPermissions: "appData/getPermissions",
    }),
    async validationForm() {
      const success = await this.$refs.editRoleFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const permissions_id = this.allowedPermissionList.map((permission) => {
          return permission.id;
        });

        const res = await this.updateRole({
          payload: {
            name: this.name,
            code_name: this.codeName,
            permissions: this.allowedPermissionList,
            permissions_id,
            updated_by: this.getLoggedInUser.id,
          },
          pk: this.role.id,
        });
        if (res.status === 200) {
          this.$swal({
            title: "Role updated successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("edit-role-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },
    changePermission(permission, isAdd) {
      if (isAdd) {
        this.availablePermissionList = this.availablePermissionList.filter(
          (perm) => perm.id !== permission.id
        );
        this.allowedPermissionList.push(permission);
        this.allowedPermissionList.sort((a, b) => {
          return a.id - b.id;
        });
      } else {
        this.allowedPermissionList = this.allowedPermissionList.filter(
          (perm) => perm.id !== permission.id
        );
        this.availablePermissionList.push(permission);
        this.availablePermissionList.sort((a, b) => {
          return a.id - b.id;
        });
      }
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
    filterAvailablePermissionByName: function () {
      return this.availablePermissionList.filter(
        (permission) =>
          !permission.name
            .toLowerCase()
            .indexOf(this.availablePermissionSearch.toLowerCase())
      );
    },
    filterAllowedPermissionByName: function () {
      return this.allowedPermissionList.filter(
        (permission) =>
          !permission.name
            .toLowerCase()
            .indexOf(this.allowedPermissionSearch.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.scroll-area-size {
  height: 45vh;
}

.scroll-area-size ul {
  height: 100%;
}
</style>
