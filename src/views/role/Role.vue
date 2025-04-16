<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        variant="primary"
        pill
        @click="createRole"
        v-if="hasPermission('create_role')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="7">
          <div v-if="searchType">
            <b-form-group
              label="Name"
              label-for="name"
              class="w-50"
              v-if="searchType.value === 1"
            >
              <b-input-group>
                <template #prepend> </template>
              </b-input-group>
              <b-form-input id="name" v-model="name" placeholder="Name" />
            </b-form-group>
            <b-form-group
              label="Code Name"
              label-for="codeName"
              class="w-50"
              v-if="searchType.value === 2"
            >
              <b-form-input
                id="codeName"
                v-model="codeName"
                placeholder="Code Name"
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
        :items="roles"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_role')"
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
            @click="editRole(row.item)"
            v-if="hasPermission('update_role')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeRole(row.item)"
            v-if="hasPermission('delete_role')"
          >
            Delete
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
    <CreateRoleModal
      @modalClosed="onModalClosed"
      :key="`create-${createRoleModalCount}`"
    />
    <EditRoleModal
      :role="role"
      @modalClosed="onModalClosed"
      :key="`edit-${editRoleModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CreateRoleModal from "@/components/role/CreateRoleModal.vue";
import EditRoleModal from "@/components/role/EditRoleModal.vue";
import util from "@/util.js";

export default {
  components: {
    CreateRoleModal,
    EditRoleModal,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name" },
        { key: "created_at", label: "Created At" },
        { key: "created_by_data", label: "Created By" },
        { key: "updated_at", label: "Updated At" },
        { key: "updated_by_data", label: "Updated By" },
        { key: "manage", label: "Manage" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      roles: [],
      role: null,
      createRoleModalCount: 0,
      editRoleModalCount: 0,
      searchTypes: [
        { value: 1, name: "Name" },
        { value: 2, name: "Code Name" },
      ],
      searchType: null,
      name: "",
      codeName: "",
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
      getRoles: "appData/getRoles",
      deleteRole: "appData/deleteRole",
    }),

    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.codeName = "";
            break;
          case 2:
            this.name = "";
            break;
        }
      } else {
        this.name = "";
        this.codeName = "";
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getRoles({
          pageNumber: this.currentPage,
          name: this.name,
          codeName: this.codeName,
        });
        this.roles = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createRole() {
      this.createRoleModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-role-modal");
      });
    },
    editRole(role) {
      this.role = role;
      this.editRoleModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-role-modal");
      });
    },
    async removeRole(role) {
      this.role = role;
      try {
        const res = await this.deleteRole({
          pk: this.role.id,
        });
        if (res.status === 204) {
          this.$swal({
            title: "Role deleted successfully",
            icon: "success",
          });
          if (
            (this.totalItems - 1) % this.perPage === 0 &&
            this.currentPage !== 1
          ) {
            this.currentPage -= 1;
          } else {
            await this.fetchPaginatedData();
          }
        }
      } catch (error) {
        this.displayError(error);
      }
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
