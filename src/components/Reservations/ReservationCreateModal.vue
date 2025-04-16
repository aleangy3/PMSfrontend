
<template>
    <b-modal id="reservation-create-modal" title="Parking Spot Create Modal" hide-footer scrollable size="lg"
      @hidden="resetModal" :no-close-on-esc="true" :no-close-on-backdrop="true" centered>
      <template #modal-title>
        <h2 class="m-0">Create Parking Spot</h2>
      </template>
      <validation-observer ref="reservationCreateFormValidation">
        <b-form @submit.prevent>
          <b-row>
            <b-col md="6">
              <b-form-group label="Parking Spot" label-for="parkingspot">
                    <v-select
                      id="parkingspot"
                      v-model="selectedParkingspot"
                      :options="ParkingSpotList"
                      placeholder="Parking Spot"
                      label="spot_id"
                    />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label-for="starttime">
                <template #label>
                  <div style="text-align: left !important; font-size: 1.2em !important;"><strong>Start Time</strong></div>
                </template>
                <validation-provider
                  #default="{ errors }"
                  name="startime"
                  :rules="{ required }"
                >
                  <b-input-group>
                    <b-form-input
                      id="startime"
                      v-model="startime"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      autocomplete="on"
                      readonly
                    ></b-form-input>
                    <b-input-group-append>
                      <b-form-datepicker
                        id="startime"
                        v-model="startime"
                        button-variant="primary"
                        right
                        variant="primary"
                      />
                    </b-input-group-append>
                  </b-input-group>

                  <small
                    class="text-yellow bg-dark"
                    style="position: absolute"
                    >{{ errors[0] }}</small
                  >
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label-for="endtime">
                <template #label>
                  <div style="text-align: left !important; font-size: 1.2em !important;"><strong>End Time</strong></div>
                </template>
                <validation-provider
                  #default="{ errors }"
                  name="endtime"
                  :rules="{ required }"
                >
                  <b-input-group>
                    <b-form-input
                      id="endtime"
                      v-model="endtime"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      autocomplete="on"
                      readonly
                    ></b-form-input>
                    <b-input-group-append>
                      <b-form-datepicker
                        id="endtime"
                        v-model="endtime"
                        button-variant="primary"
                        right
                        variant="primary"
                      />
                    </b-input-group-append>
                  </b-input-group>

                  <small
                    class="text-yellow bg-dark"
                    style="position: absolute"
                    >{{ errors[0] }}</small
                  >
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
            <b-form-group class="text-right">
                <b-button type="submit" variant="primary" pill class="mr-1 mt-2" @click="validationForm">
                    Create
                </b-button>
            </b-form-group>
        </b-form>
      </validation-observer>
    </b-modal>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex";
  import { ValidationProvider, ValidationObserver } from "vee-validate";
  import { required } from "@validations";
  import VuePerfectScrollbar from "vue-perfect-scrollbar";
  import draggable from "vuedraggable";
  import util from "@/util.js";
  
  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
      VuePerfectScrollbar,
      draggable,
    },
    mixins: [util],
    props: ["showModal"],
    data() {
      return {
        perfectScrollbarSettings: {
          maxScrollbarLength: 150,
          wheelPropagation: false,
          useBothWheelAxes: false,
          suppressScrollX: true,
        },
        carmodel: "",
        required,
        ParkingSpotList: [],
        battery: "",
        duration: "",
        selectedParkingspot: null,
        ParkingSpotList: [],
        endtime: "",
        startime: "",
      };
    },
    async mounted() {
      try {
          await this.fetchParkingSpots();
        } catch (error) {
          this.displayError(error);
        }
      if (this.showModal) {
        try {
        } catch (error) {
          this.displayError(error);
        }
      }
    },
    methods: {
      ...mapActions({
        createReservations: "appData/createReservations",
        getParkingSpot: "appData/getParkingSpot",
      }),
      async validationForm() {
        const success = await this.$refs.reservationCreateFormValidation.validate();
        if (success) {
          await this.submit();
        }
      },
      async submit() {
        try {
          let payload = {
            user: this.getLoggedInUser.id,
            start_time: this.endtime,
            end_time: this.startime,
            parking_spot: this.selectedParkingspot.id,
            created_by: this.getLoggedInUser.id,
          }
  
          const res = await this.createReservations(payload);
          if (res.status === 201) {
            this.$swal({
              title: "Reservation created successfully",
              icon: "success",
            });
            this.$nextTick(() => {
              this.$bvModal.hide("reservation-create-modal");
            });
            this.$emit("modalClosed");
          }
        } catch (error) {
          this.displayError(error);
        }
      },
      async fetchParkingSpots() {
        try{
          const res =  await this.getParkingSpot({
            is_occupied : false,
          });
          this.ParkingSpotList = res.data
          console.log('res.data', res.data);
         } catch (error) {
           this.displayError(error);
        }
      },
    
      reset() { },
      resetModal() {
      },
    },
    computed: {
      ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
    },
    watch: {
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
  
  