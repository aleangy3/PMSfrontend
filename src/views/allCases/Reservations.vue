<template>
  <div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <!-- <b-col md="5">
              <b-form-input
                id="spot_id"
                v-model="spot_id"
                placeholder="Parking Spot No"
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
          <b-button variant="primary" pill @click="createReservation" v-if="
              hasPermission('create_reservation')
            ">
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
              hasPermission('update_reservation')
            "
          >
            Detail
          </b-button> -->
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeReservation(row.item)"
            v-if="
              hasPermission('delete_reservation')
            "
          >
            Delete
          </b-button>
        </template>
      </b-table>
    </b-card>
    <ReservationCreateModal @modalClosed="onModalClosed"
    :showModal="visible" :key="`create-${reservationCreateModalCount}`" />
  </div>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";
import ReservationCreateModal from "@/components/Reservations/ReservationCreateModal.vue";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import util from "@/util.js";

export default {
  components: {
    VueSelectPaginated,
    ReservationCreateModal
  },
  mixins: [util],
  data() {
    return {
      fields: [
      { key: "manage", label: "Manage" },
        { key: "spot", label: "Parking Spot no" },
        // { key: "user_data", label: "User" },
        { key: "is_active", label: "Status" },
        { key: "start_time", label: "Start" },
        { key: "end_time", label: "End" },
        { key: "created_at", label: "Created at" },
        { key: "created_by_data", label: "Created by" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      cases: [],
      item: null,
      prefix: null,
      armyNo: "",
      isOldInquiry: false,
      reservationCreateModalCount: 0,
    };
  },
  async mounted() {
    try {
      await this.fetchPaginatedData();
    } catch (error) {
      this.displayError(error);
    }
  },
  methods: {
    ...mapActions({
      getReservations: "appData/getReservations",
      getPrefixes: "appData/getPrefixes",
      deleteCase: "appData/deleteCase",
      deleteReservation: "appData/deleteReservation"
    }),
    async search() {
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getReservations();
        this.cases = res.data;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },

    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    createReservation(){
      this.reservationCreateModalCount += 1;
      this.visible = true;
      this.$nextTick(() => {
        this.$bvModal.show("reservation-create-modal");
      });
    },
    async removeReservation(value) {
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
                            res = await this.deleteReservation({
                                pk: value.id,
                            });
                            
                            if (res.status === 204) {
                                this.$swal({
                                    title: 'Reservation delete successfully',
                                    icon: "success",
                                    timer: 1500
                                });
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
  
<style></style>
  
  