
<template>
    <b-modal id="parking-create-modal" title="Parking Spot Create Modal" hide-footer scrollable size="lg"
      @hidden="resetModal" :no-close-on-esc="true" :no-close-on-backdrop="true" centered>
      <template #modal-title>
        <h2 class="m-0">Create Parking Spot</h2>
      </template>
      <validation-observer ref="parkingspotCreateFormValidation">
        <b-form @submit.prevent>
          <b-row>
            <b-col>
              <b-form-group label="id" label-for="id">
                <template #label>
                  Spot No <span class="text-danger">*</span>
                </template>
                  <validation-provider #default="{ errors }" name="id"
                      :rules="{ required, regex: /^[0-9-()#&''\s]*$/i }">
                      <b-form-input id="id" v-model="spotNo" :state="errors.length > 0 ? false : null"
                      placeholder="Spot No" />
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
        spotNo: "",
        required,
      };
    },
    async mounted() {
      if (this.showModal) {
        try {
        } catch (error) {
          this.displayError(error);
        }
      }
    },
    methods: {
      ...mapActions({
        createParkingSpots: "appData/createParkingSpots",
      }),
      async validationForm() {
        const success = await this.$refs.parkingspotCreateFormValidation.validate();
        if (success) {
          await this.submit();
        }
      },
      async submit() {
        try {
          let payload = {
            spot_id: this.spotNo,
            created_by: this.getLoggedInUser.id,
            updated_by: this.getLoggedInUser.id,
          }
  
          const res = await this.createParkingSpots(payload);
          if (res.status === 201) {
            this.$swal({
              title: "Parking Spot created successfully",
              icon: "success",
            });
            this.$nextTick(() => {
              this.$bvModal.hide("parking-create-modal");
            });
            this.$emit("modalClosed");
          }
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
  
  