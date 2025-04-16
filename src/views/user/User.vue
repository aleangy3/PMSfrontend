<template>
  <div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="7">
          <div v-if="searchType">
            <b-form-group
              label="Username"
              label-for="username"
              class="w-50"
              v-if="searchType.value === 1"
            >
              <b-input-group>
                <template #prepend> </template>
              </b-input-group>
              <b-form-input
                id="username"
                v-model="username"
                @keydown="enterPressHandler"
                @input="inputHandler"
                placeholder="Username"
              />
            </b-form-group>
            <b-form-group
              label="Name"
              label-for="name"
              class="w-50"
              v-if="searchType.value === 2"
            >
              <b-form-input
                id="name"
                v-model="name"
                @keydown="enterPressHandler"
                @input="inputHandler"
                placeholder="Name"
              />
            </b-form-group>
            <VueSelectPaginated
              name="Organization"
              label="name"
              searchBy="name"
              :prevSelected="organization"
              :getListMethod="getOrganizations"
              customClass="w-50"
              @setMethod="
                (value) => {
                  organization = value;
                }
              "
              @input="inputHandlerValSelected"
              v-if="searchType.value === 3"
            />
            <b-form-group
              label="Service Number: (without prefix)"
              label-for="service_number"
              class="w-50"
              v-if="searchType.value === 4"
            >
              <b-form-input
                id="service_number"
                v-model="svc_number"
                placeholder="Example: 2124"
                type="number"
                @keydown="enterPressHandler"
                @input="inputHandler"
              />
            </b-form-group>
          </div>
        </b-col>
        <b-col md="3">
          <b-form-group label="Search Type" label-for="searchType">
            <v-select
              id="searchType"
              v-model="searchType"
              :options="searchTypes"
              placeholder="Search Type"
              label="name"
            />
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-button variant="primary" pill @click="search">
            <feather-icon icon="SearchIcon" class="mr-50" />
            <span class="align-middle">Search</span>
          </b-button>
        </b-col>
      </b-row>
      <b-table
        responsive="sm"
        :fields="fields"
        :items="users"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_user')"
        :per-page="0"
      >
        <template #cell(created_by_data)="row">
          {{
            row.item.created_by_data ? row.item.created_by_data.username : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data ? row.item.updated_by_data.username : ""
          }}
        </template>
        <template #cell(role_data)="row">
          {{ row.item.role_data ? row.item.role_data.name : "" }}
        </template>
        <template #cell(organization_data)="row">
          {{
            row.item.organization_data ? row.item.organization_data.name : ""
          }}
        </template>
        <template #custom-foot>
          <b-tr variant="light">
            <b-td :colspan="fields.length">
              <span class="font-weight-bolder"
                >Total Rows: {{ totalItems }}</span
              >
            </b-td>
          </b-tr>
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editUser(row.item)"
            v-if="hasPermission('update_user')"
          >
            Edit
          </b-button>
        </template>
      </b-table>
      <b-pagination
        size="md"
        :total-rows="totalItems"
        v-model="currentPage"
        :per-page="perPage"
      ></b-pagination>
    </b-card>
    <EditUserModal
      :user="user"
      @modalClosed="onModalClosed"
      :key="`edit-${editUserModalCount}`"
    />
    <user-edit-parent-organization-modal
      :user="user"
      @modalClosed="onModalClosed"
      :key="`edit-parent-${userEditParentOrganiztionModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import EditUserModal from "@/components/user/EditUserModal.vue";
import UserEditParentOrganizationModal from "@/components/user/UserEditParentOrganizationModal.vue";
import util from "@/util.js";

export default {
  components: {
    EditUserModal,
    VueSelectPaginated,
    UserEditParentOrganizationModal,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name" },
        { key: "username", label: "Username" },
        { key: "role_data", label: "Role" },
        { key: "manage", label: "Manage" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      users: [],
      user: null,
      editUserModalCount: 0,
      userEditParentOrganiztionModalCount: 0,
      searchTypes: [
        { value: 1, name: "Username" },
        { value: 2, name: "Name" },
      ],
      searchType: null,
      name: "",
      username: "",
      organization: null,
      svc_number: null,
    };
  },
  mixins: [util],
  created() {
    this.searchType = this.searchTypes[0];
  },
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getUsers: "appData/getUsers",
      getOrganizations: "appData/getOrganizations",
    }),
    enterPressHandler(e) {
      if (e.code === "Enter" || e.code === "NumpadEnter") this.search();
    },
    inputHandler(val) {
      if (val === "" || !val) this.search();
    },
    inputHandlerValSelected(val) {
      if (val) this.search();
    },
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.name = "";
            this.organization = null;
            this.svc_number = "";
            break;
          case 2:
            this.username = "";
            this.organization = null;
            this.svc_number = "";
            break;
          case 3:
            this.name = "";
            this.username = "";
            this.svc_number = "";
          case 4:
            this.name = "";
            this.username = "";
            this.organization = null;
            break;
        }
      } else {
        this.name = "";
        this.username = "";
        this.organization = "";
        this.svc_number = "";
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getUsers({
          pageNumber: this.currentPage,
          name: this.name,
          username: this.username,
          svc_number: this.svc_number,
          organization: this.organization ? this.organization.id : null,
        });
        this.users = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    editUser(user) {
      this.user = user;
      this.editUserModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-user-modal");
      });
    },

    async onModalClosed() {
      await this.fetchPaginatedData();
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>

<style></style>
