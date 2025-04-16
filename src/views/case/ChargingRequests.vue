
<template>
  <div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <!-- <b-col md="5">
              <b-form-input
                id="spot_id"
                v-model="spot_id"
                placeholder="Parking Spot No"
                @keydown="enterPressHandler"
                @input="inputHandler"
                  />
          </b-col> -->
        <!-- <b-col md="2">
          <b-button variant="primary" pill @click="search">
            <feather-icon icon="SearchIcon" class="mr-50" />
            <span class="align-middle">Search</span>
          </b-button>
        </b-col> -->
          <b-col md="2"></b-col>
          <b-col md="2"></b-col>
          <b-col md="2"></b-col>
          <b-col md="2"></b-col>
          <b-col md="2"></b-col>
        <b-col md="2">
          <b-button variant="primary" pill @click="createchargingRequest" v-if="
              hasPermission('create_charging_request')
            " >
            <feather-icon icon="PlusIcon" class="mr-50" />
            <span class="align-middle">Create</span>
          </b-button>
          </b-col>
        </b-row>
      <b-table
        :fields="fields"
        :items="cases"
        details-td-class="m-0 p-0"
        small
        :per-page="0"
        responsive
        table-class="w-100"
      >
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
          <!-- <b-button
            variant="success"
            pill
            class="mr-50"
            size="sm"
            @click="detailCase(row.item)"
            v-if="
              hasPermission('update_charging_request')
            "
          >
            Detail
              </b-button> -->
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeChargingReq(row.item)"
            v-if="
              hasPermission('delete_charging_request')
            "
          >
            Delete
          </b-button>
        </template>
      </b-table>
    </b-card>
    <ChargingRequestCreateModal @modalClosed="onModalClosed"
    :showModal="visible" :key="`create-${ChargingRequestCreateModalCount}`" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import ChargingRequestCreateModal from "@/components/ChargingRequest/ChargingRequestCreateModal.vue";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import util from "@/util.js";

export default {
  components: {
    VueSelectPaginated,
    ChargingRequestCreateModal
  },
  mixins: [util],
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "car_model", label: "Car Model" },
        { key: "battery_capacity", label: "Battery Capacity" },
        { key: "duration", label: "Duration" },
        { key: "status", label: "Status" },
        { key: "request_time", label: "Request Time" },
        { key: "created_at", label: "Created At" },
        { key: "created_by_data", label: "Created By" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      cases: [],
      item: null,
      prefix: null,
      armyNo: "",
      isOldInquiry: false,
      visible: false,
      ChargingRequestCreateModalCount: 0,
      userid: null,
    };
  },
  async mounted() {
      console.log(this.getLoggedInUser);
      try {
      await this.fetchPaginatedData();
      } catch (error) {
        this.displayError(error);
    }
  },
  methods: {
    ...mapActions({
      getChargingrequests: "appData/getChargingrequests",
      getPrefixes: "appData/getPrefixes",
      deleteCase: "appData/deleteCase",
      deleteChargingRequest: "appData/deleteChargingRequest"
    }),
    async search() {
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getChargingrequests({
          user: this.getLoggedInUser.name == "Superuser" ? null : this.getLoggedInUser.id,
        });
        this.cases = res.data;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    async removeChargingReq(value) {
                await this.$swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-outline-danger ml-1',
                    },
                    buttonsStyling: false,
                }).then(async result => {
                    if (result.value) {
                        try {
                            var res;
                            res = await this.deleteChargingRequest({
                                pk: value.id,
                            });
                            
                            if (res.status === 204) {
                                this.$swal({
                                    title: 'Charging Request delete successfully',
                                    icon: "success",
                                    timer: 1500
                                });
                                this.show = false;
                                this.user = null;
                                await this.fetchPaginatedData();
                            }
                        } catch (error) {
                            this.show = false;
                            this.displayError(error);
                        }
                    }
                    else {
                        this.show = false;
                    }
                })
            },

    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    createchargingRequest(){
      this.ChargingRequestCreateModalCount += 1;
      this.visible = true;
      this.$nextTick(() => {
        this.$bvModal.show("charging-request-create-modal");
      });
    }
  },
  
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
    rows() {
      return this.petitions.length;
    },
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },  
};
</script>

<style lang="scss" scoped>
.scroll-area-size {
  height: 45vh;
}

.scroll-area-size ul {
  height: 100%;
}
</style>

