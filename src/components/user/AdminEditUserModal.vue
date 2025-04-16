<template>
    <b-modal
      id="admin-edit-user-modal"
      centered
      size="lg"
      :no-close-on-esc="true"
      :no-close-on-backdrop="true"
    >
      <template #modal-title> <h2 class="m-0">Edit User</h2> </template>
      <validation-observer ref="editUserFormValidation">
        <b-form @submit.prevent>
          <b-form-row>
            <b-col md="6">
              <b-form-group label-for="Srv-no">
                    <VueSelectPaginated
                        name="Prefix"
                        label="name"
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
            
            <b-col md="6">
              <b-form-group label-for="number">
                  <template #label>
                    Service Number
                      </template>
                  <validation-provider #default="{ errors }" name="Service Number"
                                      :rules="{ regex: /^[0-9\s]*$/i }">
                                      <b-form-input id="srv-number" v-model="enteredNumber" :state="errors.length > 0 ? false : null"
                                          placeholder="Number"/>
                                      <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>  
              </b-form-group>
  
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="6">
              <b-form-group label-for="name">
                  <template #label>
                    Name 
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="Name"
                    :rules="{ regex: /^[A-Z0-9\s]*$/i }"
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
              <b-form-group label-for="oasId">
                  <template #label>
                    OAS ID 
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="OAS ID"
                    :rules="{ regex: /^[A-Z0-9\s]*$/i }"
                  >
                    <b-form-input
                      id="oasId"
                      v-model="oasId"
                      :state="errors.length > 0 ? false : null"
                      placeholder="OAS ID"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
            </b-col>

          </b-form-row>

          <b-form-row>

            <b-col md="6">
              <VueSelectPaginated
                  name="Formation"
                  label="name"
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

            <b-col md="6">
              <VueSelectPaginated
                name="Role"
                label="name"
                :prevSelected="selectedRole"
                :getMethod="getRole"
                :getListMethod="getRoles"
                @setMethod="
                  (value) => {
                    selectedRole = value;
                  }
                "
              />
            </b-col>

          </b-form-row>
  
          <b-form-row>
            
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

            <b-col md="6">
              <v-select
                      id="appointment"
                      v-model="appointment"
                      :options="appointmentsList"
                      placeholder="Appointment"
                      label="name"
                    />
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
  import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
  import { required } from "@validations";
  import util from "@/util.js";
  
  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
      VueSelectPaginated,
    },
    props: {
      user: Object,
    },
    mixins: [util],
    data() {
      return {
        required,
        selectedRole: null,
        selectedType: { name: "None", id: 999 }, // Add selectedType
        enteredNumber: "", // Add enteredNumber
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
        name: "",
        oasId: "",
        service_number: "",
        prefix: null,
        split_svc_number: null,
        appointmentsList: [],
        ranksList: [],
      };
    },
    async mounted() {
      this.fetchUnpaginatedAppointments()
      this.fetchUnpaginatedRanks()
      if (this.user) {
        console.log('edit user', this.user);
        this.selectedRole = this.user.role_data;
        this.name = this.user.name;
        this.rank = this.user.rank_data;
        this.oasId = this.user.username;
        this.appointment = this.user.appointment_data;
        this.unit = this.user.organization_data;
        if(this.user.svc_number) {
          this.selectedType = this.user.prefix_data;
          if (this.user.svc_number.includes('-')) {
            this.split_svc_number = this.user.svc_number.split('-');
            this.prefix = this.split_svc_number[0];
            this.enteredNumber = this.split_svc_number[1];
          }
          else{
            this.enteredNumber = this.user.svc_number;
          }  
        }
        
    }
  },
    methods: {
      ...mapActions({
        updateUser: "appData/updateUser",
        getRoles: "appData/getRoles",
        getRole: "appData/getRole",
        getOrganizations: "appData/getOrganizations",
        getPrefixes: "appData/getDropDownPrefixes",
        getRankTypes: "appData/getRanksList",
        getAppointments: "appData/getlistAppointments"
      }),
      async validationForm() {
        const success = await this.$refs.editUserFormValidation.validate();
        if (success) {
          await this.submit();
        }
      },
      async submit() {
        try {
          if (this.user.svc_number.includes('-')) {
            this.service_number = this.selectedType.name + '-' + this.enteredNumber;
          }
          else if(this.selectedType && this.enteredNumber){
            this.service_number = this.selectedType.name + '-' + this.enteredNumber;
          }
          else{
            this.service_number = this.enteredNumber;
          }
          const res = await this.updateUser({
            payload: {
              role: this.selectedRole ? this.selectedRole.id : null,
              name: this.name ? this.name : null,
              username: this.oasId ? this.oasId : null,
              rank_name: this.rank.name ? this.rank.name : null,
              appointment_name: this.appointment ? this.appointment.name : null,
              organization: this.unit ? this.unit.id : null,
              svc_number: this.service_number ? this.service_number : null,
            },
            pk: this.user.id,
          });
          if (res.status === 200) {
            this.$swal({
              title: "User updated successfully",
              icon: "success",
            });
            this.$nextTick(() => {
              this.$bvModal.hide("admin-edit-user-modal");
            });
            this.$emit("modalClosed");
          }
        } catch (error) {
          this.displayError(error);
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
    },
  };
  </script>
  
  <style></style>
  