<template>
    <b-modal
      id="create-user-modal"
      centered
      size="lg"
      :no-close-on-esc="true"
      :no-close-on-backdrop="true"
    >
      <template #modal-title>
        <h2 class="m-0 text-primary">Create Non OAS User</h2>
      </template>
      <validation-observer ref="createAwardFormValidation">
        <b-form @submit.prevent>
          <b-form-row>
            <b-col md="3" >
                <b-form-group label-for="Srv-no">
                  <VueSelectPaginated
                      name="Prefix"
                      label="name"
                      :rules="{ required: true }"
                      :prevSelected="selectedType"
                      :getListMethod="getPrefixes"
                      @setMethod="
                        (value) => {
                          selectedType = value;
                        }
                      "
                      searchBy="name"
                    />
                </b-form-group>
            </b-col>
            <b-col md="3">

             <b-form-group label-for="number">
                <template #label>
                  Service Number
                    <span class="text-danger">*</span>
                    </template>
                <validation-provider #default="{ errors }" name="Service Number"
                                    :rules="{ required, regex: /^[0-9\s]*$/i }">
                                    <b-form-input id="srv-number" v-model="enteredNumber" :state="errors.length > 0 ? false : null"
                                        placeholder="Number"/>
                                    <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>  
            </b-form-group>
            </b-col>
            
            <b-col md="6">
              <b-form-group label="Ranks" label-for="rank">
                    <v-select
                      id="rank"
                      v-model="rank"
                      :options="ranksList"
                      placeholder="Ranks"
                      label="name"
                    />
              </b-form-group>
            </b-col>
          </b-form-row>


          <b-form-row>
            <b-col md="6">
              <b-form-group label-for="name">
                <template #label>
                  Name <span class="text-danger">*</span>
                </template>
                <validation-provider
                  #default="{ errors }"
                  name="Name"
                  :rules="{ required, regex: /^[A-Z\s]*$/i }"
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
              <b-form-group label="Appointment" label-for="appointment">
                    <v-select
                      id="appointment"
                      v-model="appointment"
                      :options="appointmentsList"
                      placeholder="Appointment"
                      label="name"
                    />
              </b-form-group>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="6">
                <VueSelectPaginated
                name="Formation"
                label="name"
                :rules="{ required: true }"
                :prevSelected="unit"
                :getListMethod="getOrganizations"
                @setMethod="
                  (value) => {
                    unit = value;
                  }
                "
                searchBy="name"
              />
            </b-col>
  
          </b-form-row>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-form-group class="text-right">
          <b-button type="submit" variant="primary" pill @click="validationForm">
            Submit
          </b-button>
        </b-form-group>
      </template>
      <b-overlay :show="show" variant="white" spinner-variant="primary" no-wrap />
    </b-modal>
  </template>
    
    <script>
  import { mapActions, mapGetters } from "vuex";
  import { ValidationProvider, ValidationObserver } from "vee-validate";
  import { required } from "@validations";
  import util from "@/util.js";
  import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
  
  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
      VueSelectPaginated,
    },
    mixins: [util],
    data() {
      return {
        name: "",
        username: "",
        availablePermissionSearch: "",
        allowedPermissionSearch: "",
        required,
        availablePermissionList: [],
        allowedPermissionList: [],
        selectedType: { name: "None", id: 999 }, // Add selectedType
        enteredNumber: "", // Add enteredNumber
        // rank: "",
        appointment: "",
        unit: null,
        appointment: null,
        show: false,
        isTypeSelected: false, // Add a new data property
        rank: null,
        rankValue: null,
        appointmentValue: null,
        serviceName: null,
        typeName: null,
        appointmentId: null,
        rankId: null,
        appointmentsList: [],
        ranksList: [],
      };
    },
    async mounted() {
      try {
        this.fetchUnpaginatedAppointments()
        this.fetchUnpaginatedRanks()
        const res = await this.getPermissions();
        this.availablePermissionList = res.data;
      } catch (error) {
        this.displayError(error);
      }
    },
    methods: {
      ...mapActions({
        createNonOASUser: "appData/createNonOASUser",
        getOrganizations: "appData/getOrganizations",
        getPrefixes: "appData/getDropDownPrefixes",
        getRankTypes: "appData/getRanksList",
        getAppointments: "appData/getlistAppointments"
      }),
      async validationForm() {
        const success = await this.$refs.createAwardFormValidation.validate();
        if (success) {
          await this.submit();
        }
      },
      async submit() {
        this.show = true;
        try {
          if (this.selectedType) {
            this.typeName = typeof this.selectedType === 'object' ? this.selectedType.name : this.selectedType;
            if (this.typeName === 'None'){
              this.serviceName = this.enteredNumber;
            }
            else  {
              this.serviceName = `${this.typeName}-${this.enteredNumber}`;
            }
          }

          if (!this.selectedType) {
            this.serviceName = this.enteredNumber;
          }

          if(this.rank){
            this.rankValue = this.rank.name
            this.rankId = this.rank.id
          }

          if(this.appointment){
            this.appointmentValue = this.appointment.name
            this.appointmentId = this.appointment.id
          }
          const res = await this.createNonOASUser({
                name: this.name,
                service_name: this.serviceName,
                password: '1234',
                organization: this.unit,
                appointment_name: this.appointmentValue,
                appointment_id: this.appointmentId,
                rank_name: this.rankValue,
                rank_id: this.rankId,
                is_non_oas: true,
                created_by: this.getLoggedInUser.id,
                updated_by: this.getLoggedInUser.id,
            });
            if (res.status === 200) {
              this.$swal({
                title: "Non OAS User created successfully",
                icon: "success",
              });
              this.show = false;
              this.$nextTick(() => {
                this.$bvModal.hide("create-user-modal");
              });
              this.$emit("modalClosed");
            }
        } catch (error) {
          this.show = false;
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
      async fetchUnpaginatedAppointments(){
        try {
          const res2 = await this.getAppointments();
          this.appointmentsList = res2.data;
      }
        catch (error) {
          this.displayError(error);
      }
    },
    async fetchUnpaginatedRanks(){
        try {
          const res3 = await this.getRankTypes();
          this.ranksList = res3.data;
      }
        catch (error) {
          this.displayError(error);
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
      enteredNumberDisabled() {
      return !this.isTypeSelected;;
    }
    },
    watch: {
      selectedType(newValue, oldValue) {
      // Update isTypeSelected based on selectedType
      this.isTypeSelected = !!newValue; // Convert to boolean
    }
    }
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
    