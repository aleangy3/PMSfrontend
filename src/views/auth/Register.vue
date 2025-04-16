<template>
    <div class="register-container">
      <!-- Logo at top left -->
      <div class="logo-container">
        <b-link :to="{ name: 'login' }" class="brand-logo">
          <img :src="appLogoImage" width="50" height="50" />
          <span class="app-name">{{ appFullName }}</span>
        </b-link>
      </div>
  
      <!-- Registration Form -->
      <div class="register-form">
        <h2 class="form-title">Create Your Account</h2>
        <p class="form-subtitle">Join us to get started</p>
  
        <validation-observer ref="registerFormValidation">
            <b-form class="auth-register-form mt-1" @submit.prevent>
              <b-form-group>
                <label for="name" style="width: 100%">
                    <div class="d-flex justify-content-between">
                        <div class="d-inline-block">
                            <span>Name </span><span class="text-danger" style="display: inline">*</span>
                        </div>
                    </div>
                </label>

                <validation-provider
                  #default="{ errors }"
                  name="name"
                  :rules="{ required, regex: /^[A-Za-z\s]{1,50}$/ }"
                >
                  <b-form-input
                    id="name"
                    v-model="name"
                    :state="errors.length > 0 ? false : null"
                    name="name"
                    maxlength="50"
                    placeholder="Name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
                <label for="username" style="width: 100%">
                    <div class="d-flex justify-content-between">
                        <div class="d-inline-block">
                            <span>Username </span><span class="text-danger" style="display: inline">*</span>
                        </div>
                    </div>
                </label>

                <validation-provider
                  #default="{ errors }"
                  name="username"
                  :rules="{ required, regex: /^[A-Za-z0-9_\s]{1,50}$/ }"
                >
                  <b-form-input
                    id="username"
                    v-model="username"
                    :state="errors.length > 0 ? false : null"
                    name="username"
                    maxlength="50"
                    placeholder="User Name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
                <label for="email" style="width: 100%">
                    <div class="d-flex justify-content-between">
                        <div class="d-inline-block">
                            <span>Email </span><span class="text-danger" style="display: inline">*</span>
                        </div>
                    </div>
                </label>

                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  :rules="{ required, regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ }"
                >
                  <b-form-input
                    id="email"
                    v-model="email"
                    :state="errors.length > 0 ? false : null"
                    name="email"
                    placeholder="john12@gmail.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
  <label for="mobile" style="width: 100%">
    <div class="d-flex justify-content-between">
      <div class="d-inline-block">
        <span>Mobile </span><span class="text-danger" style="display: inline">*</span>
      </div>
    </div>
  </label>

  <validation-provider
    #default="{ errors }"
    name="Mobile"
    rules="required|integer|length:10"
  >
    <b-form-input
      id="mobile"
      v-model="mobile"
      :state="errors.length > 0 ? false : null"
      name="mobile"
      placeholder="3401234567"
    />
    <small class="text-danger">{{ errors[0] }}</small>
  </validation-provider>
</b-form-group>

              <b-form-group>
                <label for="password" style="width: 100%">
                    <div class="d-flex justify-content-between">
                        <div class="d-inline-block">
                            <span>Password </span><span class="text-danger" style="display: inline">*</span>
                        </div>
                    </div>
                </label>

                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required|password"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="password"
                      v-model="password"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="password"
                      placeholder="Password"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
                <label for="confirm-password" style="width: 100%">
                    <div class="d-flex justify-content-between">
                        <div class="d-inline-block">
                            <span>Confirm Password </span><span class="text-danger" style="display: inline">*</span>
                        </div>
                    </div>
                </label>

                <validation-provider
                  #default="{ errors }"
                  name="Confirm Password"
                  rules="required|confirmed:Password"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="c-password"
                      v-model="confirmPassword"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordConFieldType"
                      name="password"
                      placeholder="Re-type Password"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordConToggleIcon"
                        @click="togglePasswordConVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                block
                @click="validateForm"
              >
                Sign Up
              </b-button>
            </b-form>
          </validation-observer>
  
        <div class="login-link">
          Already have an account? 
          <b-link :to="{ name: 'Login' }">Sign in</b-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import { $themeConfig } from "@themeConfig";
import { mapActions } from "vuex";
import util from "@/util.js";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  mixins: [util],
    data() {
      return {
        name: '',
        username: '',
        mobile: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        passwordFieldType: 'password',
        confirmPasswordFieldType: 'password',
        passwordConFieldType: "password",
        appLogoImage: require('@/assets/images/logo/faiz.png'),
        appFullName: "",
        required,
        
      }
    },
    created() {
        this.appName = $themeConfig.app.appName;
        this.appFullName = $themeConfig.app.appFullName;
        this.appLogoImage = $themeConfig.app.appLogoImage;
    },
    computed: {
        passwordToggleIcon() {
            return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
        },
        passwordConToggleIcon() {
            return this.passwordConFieldType === "password"
                ? "EyeIcon"
                : "EyeOffIcon";
        },
    },
    methods: {
      ...mapActions({
        registerUser: "appData/registerUser",
    }),
      togglePasswordConVisibility() {
        this.passwordConFieldType =
        this.passwordConFieldType === "password" ? "text" : "password";
      },
      toggleConfirmPasswordVisibility() {
        this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password'
      },
      togglePasswordVisibility() {
        this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
      validateForm() {
        this.$refs.registerFormValidation.validate().then(success => {
          if (success) {
            this.register()
          }
        })
      },
      async register() {
        this.show = true;
        try {
            const data = {
            email: this.email,
            name: this.name,
            username: this.username,
            contact: this.mobile,
            password: this.password,
            };
            const res = await this.registerUser(data);
            console.log('res register',res);
            
            this.show = false;

            if (res.status === 201) {
            this.$swal({
                title:
                "Your Account has been created Successfully. You can now login into Parking Management System",
                icon: "success",
            });
            this.$router.push({ name: "Login" });
            }
        } catch (error) {
            this.show = false;
            this.displayError(error);
        }
     }
    }
  }
  </script>
  
  <style scoped>
 .register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, #f3f4f6, #e0e7ff);
  position: relative;
  padding: 2rem;
  overflow: hidden;
}

.register-container::before,
.register-container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  z-index: 0;
}

.register-container::before {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle at top left, #a5b4fc, transparent 70%);
  top: -150px;
  left: -150px;
}

.register-container::after {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at bottom right, #c7d2fe, transparent 70%);
  bottom: -100px;
  right: -100px;
}

.logo-container {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 1;
}

.brand-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.brand-logo img {
  margin-right: 12px;
}

.app-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.register-form {
  background: #fff;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  width: 100%;
  z-index: 1;
  position: relative;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #111827;
  text-align: center;
}

.form-subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
  text-align: center;
}

.b-form-group {
  margin-bottom: 1.5rem;
}

.text-danger {
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

.register-btn {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 1.5rem;
  background-color: #4f46e5;
  border: none;
  transition: all 0.2s ease;
}

.register-btn:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
}

.login-link a {
  /* color: #4f46e5; */
  font-weight: 600;
  text-decoration: none;
}

  </style>