
<template>
    <b-modal id="charging-request-create-modal" title="Parking Spot Create Modal" hide-footer scrollable size="lg"
      @hidden="resetModal" :no-close-on-esc="true" :no-close-on-backdrop="true" centered>
      <template #modal-title>
        <h2 class="m-0">Create Parking Spot</h2>
      </template>
      <validation-observer ref="reservationCreateFormValidation">
        <b-form @submit.prevent>
          <b-row>
            <b-col>
              <b-form-group label="name" label-for="name">
                <template #label>
                  Car Model <span class="text-danger">*</span>
                </template>
                  <validation-provider #default="{ errors }" name="name"
                      :rules="{ required, regex: /^[A-Z0-9-\s]*$/i }">
                      <b-form-input id="name" v-model="carmodel" :state="errors.length > 0 ? false : null"
                      placeholder="Car Model" />
                      <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="name" label-for="name">
                <template #label>
                  Battery Capacity <span class="text-danger">*</span>
                </template>
                  <validation-provider #default="{ errors }" name="name"
                      :rules="{ required, regex: /^[0-9-()#&''\s]*$/i }">
                      <b-form-input id="name" v-model="battery" :state="errors.length > 0 ? false : null"
                      placeholder="Battery Capacity" />
                      <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
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
              <b-form-group label="name" label-for="name">
                <template #label>
                  Duration <span class="text-danger">*</span>
                </template>
                  <validation-provider #default="{ errors }" name="name"
                      :rules="{ required, regex: /^[0-9-()#&''\s]*$/i }">
                      <b-form-input id="name" v-model="duration" :state="errors.length > 0 ? false : null"
                      placeholder="Duration" />
                      <small class="text-danger">{{ errors[0] }}</small>
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
        createChargingRequest: "appData/createChargingRequest",
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
            parking_spot: this.selectedParkingspot.id,
            car_model: this.carmodel,
            battery_capacity: this.battery,
            duration: this.duration,
            created_by: this.getLoggedInUser.id,
          }
  
          const res = await this.createChargingRequest(payload);
          if (res.status === 201) {
            this.$swal({
              title: "Charging Request created successfully",
              icon: "success",
            });
            this.$nextTick(() => {
              this.$bvModal.hide("charging-request-create-modal");
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
  
  