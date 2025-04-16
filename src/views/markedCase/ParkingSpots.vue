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
        </b-col>
        <b-col md="2">
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
          
          <b-button variant="primary" pill v-if="
              hasPermission('create_parking_spot')
            "
             @click="createparkingSpot">
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
        <template #cell(created_by_data)="row">
          {{
            row.item.created_by_data ? row.item.created_by_data.username : ""
          }}
        </template>
        <template #cell(manage)="row">
          <!-- <b-button
            variant="success"
            pill
            class="mr-50"
            size="sm"
            @click="detailCase(row.item)"
            v-if="
              hasPermission('update_parking_spot')
            "
          >
            Detail
          </b-button> -->
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeCase(row.item)"
            v-if="
              hasPermission('delete_parking_spot')
            "
          >
            Delete
          </b-button>
        </template>
      </b-table>
    </b-card>
    <ParkingSpotCreateModal @modalClosed="onModalClosed"
    :showModal="visible" :key="`create-${parkingspotCreateModalCount}`" />
  </div>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import ParkingSpotCreateModal from "@/components/parkingspots/ParkingSpotCreateModal.vue";
import util from "@/util.js";

export default {
  components: {
    VueSelectPaginated,
    ParkingSpotCreateModal
  },
  mixins: [util],
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "spot_id", label: "Parking Spot No" },
        { key: "is_occupied", label: "Occupied Status" },
        { key: "has_charger", label: "Charger Status" },
        { key: "created_at", label: "Creation date" },
        { key: "created_by_data", label: "Created by" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      cases: [],
      item: null,
      allowEdit: true,
      parkingspotCreateModalCount: 0,
      visible : false,
      spot_id: "",
    };
  },
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getCases: "appData/getCases",
      getPrefixes: "appData/getPrefixes",
      deleteCase: "appData/deleteCase",
      getParkingSpots: "appData/getParkingSpots",
      createParkingSpots: "appData/createParkingSpots",
      deleteParkingSpot: "appData/deleteParkingSpot"
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
      // this.currentPage = 1;
      console.log('hi');
      
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getParkingSpots();
        console.log('hi',res.data);
        
        this.cases = res.data;
        console.log(this.cases);
        
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    createparkingSpot() {
      this.parkingspotCreateModalCount += 1;
      this.visible = true;
      this.$nextTick(() => {
        this.$bvModal.show("parking-create-modal");
      });
  },
  
  async removeCase(value) {
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
                            res = await this.deleteParkingSpot({
                                pk: value.id,
                            });
                            
                            if (res.status === 204) {
                                this.$swal({
                                    title: 'Parking Spot delete successfully',
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
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>