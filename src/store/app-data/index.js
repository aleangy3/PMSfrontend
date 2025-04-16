import axiosIns from "@/libs/axios";

export default {
  namespaced: true,
  state: {
    isLoggedIn: false,
    user: null,
    navMenuItems: [],
    loginAttempts: 0
  },
  getters: {
    getLoggedInUser: (state) => {
      return state.user;
    },
    hasPermission: (state) => (name) => {
      if (state.user) {
        return state.user.permissions.hasOwnProperty(name);
      }
      return false;
    },
    hasRole: (state) => (name) => {
      if (state.user.role_data.code_name === name) {
        return true;
      }
      return false;
    },
    isLoggedIn: (state) => state.isLoggedIn,
    getNavMenuItems: (state) => state.navMenuItems,
  },
  mutations: {
    login(state, data) {
      state.isLoggedIn = true;
      state.user = data.user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    setNavMenuItems(state) {
      state.navMenuItems = [];


      if (state.user.permissions.hasOwnProperty("show_user")) {
        state.navMenuItems.push({
          title: "User",
          icon: "UserIcon",
          route: "User",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_role")) {
        state.navMenuItems.push({
          title: "Role",
          icon: "UsersIcon",
          route: "Role",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_organization")) {
        state.navMenuItems.push({
          title: "Organization",
          icon: "BoxIcon",
          route: "Organization",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_officer_data")) {
        state.navMenuItems.push({
          title: "Officer Basic Data",
          icon: "FolderIcon",
          route: "OfficerData",
          // tag: 'new',
          // tagVariant: 'light-success',
        });
      }
      if (state.user.permissions.hasOwnProperty("show_parking_spots")) {
        state.navMenuItems.push({
          title: "Parking Spots",
          icon: "FileIcon",
          route: "ParkingSpots",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_charging_requests")) {
        state.navMenuItems.push({
          title: "Charging Requests",
          icon: "FileIcon",
          route: "ChargingRequests",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_reservations")) {
        state.navMenuItems.push({
          title: "Reservations",
          icon: "FileIcon",
          route: "Reservation",
        });
      }

      

      if (state.user.permissions.hasOwnProperty("organization_show")) {
        state.navMenuItems.push({
          title: "Organization",
          icon: "BoxIcon",
          route: "Organization",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_ps_1a")) {
        state.navMenuItems.push({
          title: "PS 1-A",
          icon: "FileIcon",
          route: "PS-1A",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_ps_1b")) {
        state.navMenuItems.push({
          title: "PS 1-B",
          icon: "FileIcon",
          route: "PS-1B",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_ps_1c")) {
        state.navMenuItems.push({
          title: "PS 1-C",
          icon: "FileIcon",
          route: "PS-1C",
        });
      }

    // if (state.user.permissions.hasOwnProperty("show_organization")) {
      //   state.navMenuItems.push({
      //     title: "Feedback",
      //     icon: "FileIcon",
      //     route: "Feedback",
      //   });
      // }

      const lookUpMenuItem = {
        title: "Administration",
        icon: "ToolIcon",
        tag: '7',
        tagVariant: 'light-success',
        children: [],
      };
      if (state.user.permissions.hasOwnProperty("show_noc") ||
          state.user.permissions.hasOwnProperty("show_prefix") ||
          state.user.permissions.hasOwnProperty('show_rank_type') ||
          state.user.permissions.hasOwnProperty('show_awards') ||
          state.user.permissions.hasOwnProperty("organization_child_show") ||
          state.user.permissions.hasOwnProperty("show_oas_users") ||
          state.user.permissions.hasOwnProperty("show_appointment")
      ) {
        state.navMenuItems.push(lookUpMenuItem);
      }

      if (state.user.permissions.hasOwnProperty("organization_child_show")) {
        lookUpMenuItem.children.push({
          title: "Organization Child",
          route: "OrganizationChild",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_noc")) {
        lookUpMenuItem.children.push({
        title: "Nature Of Case",
        route: "NOC",})
      }
      if (state.user.permissions.hasOwnProperty("show_prefix")) {
        lookUpMenuItem.children.push({
          title: "Prefix",
          route: "Prefix",
        });
      }
      if (state.user.permissions.hasOwnProperty("show_rank_type")) {
        lookUpMenuItem.children.push({
          title: "Rank",
          route: "RankType",
        })
      }
      if (state.user.permissions.hasOwnProperty("show_awards")) {
        lookUpMenuItem.children.push({
          title: "Award",
          route: "Award",
        })
      }
      if (state.user.permissions.hasOwnProperty("show_oas_users")) {
        lookUpMenuItem.children.push({
          title: "OAS/NON OAS Users",
          route: 'OASUser',
        })
      }
      if (state.user.permissions.hasOwnProperty("show_appointment")) {
        lookUpMenuItem.children.push({
          title: "User Appointment",
          route: 'Appointment',
        })
      }
    },
    
    incrementLoginAttempts(state) {
      state.loginAttempts += 1;
    },

    resetLoginAttempts(state) {
      state.loginAttempts = 0;
    },
  },
  actions: {
    async login({ commit, state }, payload) {
      try {
        const loginAtempt = parseInt(localStorage.getItem('loginAttempts'))
        if (!loginAtempt) localStorage.setItem('loginAttempts', 0) && (loginAtempt = 0)
        // if (state.loginAttempts<3)
        if (loginAtempt < 3)
        {
          const res = await axiosIns.post("login", payload);
         if (res.status === 200) {
          commit("login", res.data);
          commit("setNavMenuItems");
        }
        return res;}
        throw new Error()
      } catch (error) {
         const loginAtempt = parseInt(localStorage.getItem('loginAttempts'))
         localStorage.setItem('loginAttempts', loginAtempt+1)

        
        if (localStorage.getItem("loginAttempts") >= 3)
        {
          setTimeout(() => {
          localStorage.setItem('loginAttempts', 0)
        }, 10000);
      }
        throw error;
      }
    },
    async logout({ commit }) {
      const res = await axiosIns.post("logout");
      if (res.status === 204) {
        commit("logout");
      }
      return res;
    },
    async getCurrentUser({ commit }) {
      const res = await axiosIns.get("current");
      if (res.status === 200) {
        commit("login", res.data);
        commit("setNavMenuItems");
      }
    },
    async registerUser({ commit }, payload) {
      const res = await axiosIns.post("user-register/", payload);
      return res;
    },
    async getPermissions({ commit }) {
      const res = await axiosIns.get("permissions");
      return res;
    },
    async getRoles({ commit }, { pageNumber, name, codeName }) {
      let url = `roles/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (codeName) {
        url += `&code_name=${codeName}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getRole({ commit }, { pk }) {
      const res = await axiosIns.get(`roles/${pk}/`);
      return res;
    },
    async createRole({ commit }, payload) {
      const res = await axiosIns.post("roles/", payload);
      return res;
    },
    async updateRole({ commit }, { payload, pk }) {
      const res = await axiosIns.put(`roles/${pk}/`, payload);
      return res;
    },
    async deleteRole({ commit }, { pk }) {
      const res = await axiosIns.delete(`roles/${pk}/`);
      return res;
    },
    async getUsers({ commit }, { pageNumber, name, username, organization, svc_number, role_name, oas_non_oas}) {
      let url = `users/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (username) {
        url += `&username=${username}`;
      }
      if (organization) {
        url += `&organization=${organization}`;
      }
      if (svc_number) {
        url += `&svc_number=${svc_number}`;
      }
      if (role_name) {
        url += `&role_name=${role_name}`;
      }
      
      if (oas_non_oas || !oas_non_oas ) {
        url += `&oas_non_oas=${oas_non_oas}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getUsersUnPaginated({ commit }, { organization, role }) {
      let url = `users-unpaginated/`;
      if (organization) {
        url += `?organization=${organization}`;
      }
      if (role) {
        url += `?role=${role}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async createUser({ commit }, payload) {
      const res = await axiosIns.post("users-create-update", payload);
      return res;
    },

    async updateUser({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`users/${pk}/`, payload);
      return res;
    },

    async deleteUser({ commit }, { pk }) {
      const res = await axiosIns.delete(`users/${pk}/`);
      return res;
    },

    async createNonOASUser({ commit },  payload) {
      const res = await axiosIns.post("non-oas-users/", payload);
      return res;
    },
    // async getOrganizations({ commit }, { pageNumber, name, parent }) {
    //   let url = `organizations/?page=${pageNumber}`;
    //   if (name) {
    //     url += `&name=${name}`;
    //   }
    //   if (parent) {
    //     url += `&parent=${parent}`;
    //   }
    //   const res = await axiosIns.get(url);
    //   return res;
    // },
    // async getOrganization({ commit }, { pk }) {
    //   const res = await axiosIns.get(`organizations/${pk}/`);
    //   return res;
    // },
    
    // Natue of case
    async getNocs({ commit }, { pageNumber, name }) {
      let url = `nocs/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getnoc({ commit }, { pk }) {
      const res = await axiosIns.get(`nocs/${pk}/`);
      return res;
    },
    
    async createNoc({ commit }, payload) {
      const res = await axiosIns.post("nocs/", payload);
      return res;
    },
    async updateNoc({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`nocs/${pk}/`, payload);
      return res;
    },
    async deleteNoc({ commit }, { pk }) {
      const res = await axiosIns.delete(`nocs/${pk}/`);
      return res;
    },

    //  Prefix
    async createPrefix({ commit }, payload) {
      const res = await axiosIns.post("prefixes/", payload);
      return res;
    },
    async getPrefixes({ commit }, { pageNumber }) {
      const res = await axiosIns.get(`prefixes/?page=${pageNumber}`);
      return res;
    },
    async getDropDownPrefixes({ commit }, { pageNumber }) {
      const res = await axiosIns.get(`prefixes/?page=${pageNumber}`);
      // Create the "None" option
      const noneOption = { name: "None", id: 999 };
      // Add the "None" option to the beginning of the results array
      res.data.results.unshift(noneOption);
      
  return res;
    },
    async getPrefix({ commit }, { pk }) {
      const res = await axiosIns.get(`prefixes/${pk}/`);
      return res;
    },
    async deletePrefix({ commit }, { pk }) {
      const res = await axiosIns.delete(`prefixes/${pk}/`);
      return res;
    },
    async updatePrefix({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`prefixes/${pk}/`, payload);
      return res;
    },
    
    // Rank type
    async createRankType({ commit }, payload) {
      const res = await axiosIns.post("rank-types/", payload);
      return res;
    },
    async getRankTypes({ commit }, { pageNumber }) {
      const res = await axiosIns.get(`rank-types/?page=${pageNumber}`);
      return res;
    },
    async getRankType({ commit }, { pk }) {
      const res = await axiosIns.get(`rank-types/${pk}/`);
      return res;
    },
    async deleteRankType({ commit }, { pk }) {
      const res = await axiosIns.delete(`rank-types/${pk}/`);
      return res;
    },
    async updateRankType({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`rank-types/${pk}/`, payload);
      return res;
    },

    async getRankFromUserAPI({ commit }) {
      const res = await axiosIns.get(`add-ranks/`);
      return res;
    },
    
    async getRanksList({ commit }) {
      const res = await axiosIns.get(`get_ranks`);
      return res;
    },


    // Case
    async getCases({ commit }, {
      pageNumber,
      draft,
      created_by,
      token_no,
      status,
      start_date,
      completion_date,
      president_prefix,
      president_army_no,
      ordered_by_army_prefix,
      ordered_by_army_no,
      remarks,
      recom,
      currently_marked,
      brief,
      overdue,
      is_verified,
      formation,
      noc_formation,
      noc_name,
      civilian,
      officer, 
      jco, 
      soldier,
      ServiceNum,
      in_process_status,
      formation_name,
      sort_with,
      empty_filter,
      ps_1a,
      ps_1b,
      ps_1c,
      organization_self,
    }) {
      let url = `cases/?page=${pageNumber}`;
      if (draft !== null && draft !== undefined) {
        url += `&draft=${draft}`;
      }
      if (created_by) {
        url += `&created_by=${created_by}`;
      }
      if (token_no) {
        url += `&token_no=${token_no}`;
      }
      if (status) {
        if (status === 5) {
          status = true
          url += `&overdue=${status}`;
        } else {
        url += `&status=${status}`;
        }
      }
      if (start_date) {
        url += `&start_date=${start_date}`;
      }
      if (completion_date) {
        url += `&completion_date=${completion_date}`;
      }
      if (president_prefix) {
        url += `&president_prefix=${president_prefix}`;
      }
      if (president_army_no) {
        url += `&president_army_no=${president_army_no}`;
      }
      if (ordered_by_army_prefix) {
        url += `&ordered_by_army_prefix=${ordered_by_army_prefix}`;
      }
      if (ordered_by_army_no) {
        url += `&ordered_by_army_no=${ordered_by_army_no}`;
      }
      if (remarks) {
        url += `&remarks=${remarks}`;
      }
      if (recom) {
        url += `&recom=${recom}`;
      }
      if (currently_marked) {
        url += `&currently_marked=${currently_marked}`;
      }
      if (brief) {
        url += `&brief=${brief}`;
      }
      if (overdue) {
        url += `&overdue=${overdue}`;
      }
      if (is_verified) {
        url += `&is_verified=${is_verified}`;
      }
      if (formation){
        url += `&formation=${formation}`;
      }
      if (noc_formation){
        url += `&noc_formation=${noc_formation}`;
      }
      if (noc_name){
        url += `&noc_name=${noc_name}`;
      }
      if (civilian){
        url += `&civilian=${civilian}`;
      }
      
      if (officer){
        url += `&officer=${officer}`;
      }
      if (jco){
        url += `&jco=${jco}`;
      }
      if (soldier){
        url += `&soldier=${soldier}`;
      }
      if (ServiceNum){
        url += `&ServiceNum=${ServiceNum}`;
      }
      if (in_process_status){
        url += `&in_process_status=${in_process_status}`;
      }
      if (formation_name){
        url += `&formation_name=${formation_name}`;
      }
      if (sort_with){
        url += `&sort_with=${sort_with}`;
      }
      if (empty_filter){
        url += `&empty_filter=${empty_filter}`;
      }
      if (ps_1a){
        url += `&ps_1a=${ps_1a}`;
      }
      if (ps_1b){
        url += `&ps_1b=${ps_1b}`;
      }
      if (ps_1c){
        url += `&ps_1c=${ps_1c}`;
      }
      if (organization_self){
        url += `&organization_self=${organization_self}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getCase({ commit }, { pk }) {
      const res = await axiosIns.get(`cases/${pk}/`);
      return res;
    },
    async createCase({ commit }, payload) {
      const res = await axiosIns.post("cases/", payload);
      return res;
    },
    async updateCase({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`cases/${pk}/`, payload);
      return res;
    },
    async deleteCase({ commit }, { pk }) {
      const res = await axiosIns.delete(`cases/${pk}/`);
      return res;
    },

    async verifyCase({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(
        `case-verify/${pk}/`,
        payload
      );
      
      return res;
    },

    // Documents
    async createDocument({ commit }, payload) {
      const res = await axiosIns.post("upload-document", payload);
      return res;
    },
    async getDocuments({ commit }, { pageNumber, name, created_by }) {
      let url = `documents/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (created_by) {
        url += `&created_by=${created_by}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },

    // Member
    async getMembers({ commit }, { pageNumber }) {
      let url = `members/?page=${pageNumber}`;
      const res = await axiosIns.get(url);
      return res;
    },
    async getMember({ commit }, { pk }) {
      const res = await axiosIns.get(`members/${pk}/`);
      return res;
    },
    async createMember({ commit }, payload) {
      const res = await axiosIns.post("members/", payload);
      return res;
    },
    async updateMember({ commit }, { payload, pk }) {
      const res = await axiosIns.put(`members/${pk}/`, payload);
      return res;
    },
    async deleteMember({ commit }, { pk }) {
      const res = await axiosIns.delete(`members/${pk}/`);
      return res;
    },

    // Awards
    async getAwards({ commit }, { pageNumber, name }) {
      let url = `awards/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getAward({ commit }, { pk }) {
      const res = await axiosIns.get(`awards/${pk}/`);
      return res;
    },
    
    async createAward({ commit }, payload) {
      const res = await axiosIns.post("awards/", payload);
      return res;
    },
    async updateAward({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`awards/${pk}/`, payload);
      return res;
    },
    async deleteAward({ commit }, { pk }) {
      const res = await axiosIns.delete(`awards/${pk}/`);
      return res;
    },

    // Organization Child
    async createOrganizationChild({ commit }, payload) {
      const res = await axiosIns.post("organization-children/", payload);
      return res;
    },
    async getOrganizationChildren(
      { commit },
      { pageNumber, parent_name, child_name, level, parent }
    ) {
      let url = `organization-children/?page=${pageNumber}`;
      if (parent_name) {
        url += `&parent_name=${parent_name}`;
      }
      if (child_name) {
        url += `&child_name=${child_name}`;
      }
      if (level) {
        url += `&level=${level}`;
      }
      if (parent) {
        url += `&parent=${parent}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getOrganizationChild({ commit }, { pk }) {
      const res = await axiosIns.get(`organization-children/${pk}/`);
      return res;
    },
    async deleteOrganizationChild({ commit }, { pk }) {
      const res = await axiosIns.delete(`organization-children/${pk}/`);
      return res;
    },
    async updateOrganizationChild({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`organization-children/${pk}/`, payload);
      return res;
    },

    // Organization
    async getOrganizations({ commit }, { pageNumber, name, id, self_children, organization_relation }) {
      let url = `organizations/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (id) {
        url += `&id=${id}`;
      }
      if (self_children) {
        url += `&self_children=${self_children}`;
      }
      if (organization_relation) {
        url += `&organization_relation=${organization_relation}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getOrganization({ commit }, { pk }) {
      const res = await axiosIns.get(`organizations/${pk}/`);
      return res;
    },
    async updateOrganization({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`organizations/${pk}/`, payload);
      return res;
    },


  // Civilian
  async getCivilians({ commit }, { pageNumber, name, cnic }) {
    let url = `civilian/?page=${pageNumber}`;
    if (name) {
      url += `&name=${name}`;
    }
    if (cnic) {
      url += `&cnic=${cnic}`;
    }
    const res = await axiosIns.get(url);
    return res;
  },
  async getCivilian({ commit }, { pk }) {
    const res = await axiosIns.get(`civilian/${pk}/`);
    return res;
  },
  async createCivilian({ commit }, payload) {
    const res = await axiosIns.post("civilian/", payload);
    return res;
  },
  async updateCivilian({ commit }, { payload, pk }) {
    const res = await axiosIns.patch(`civilian/${pk}/`, payload);
    return res;
  },
  async deleteCivilian({ commit }, { pk }) {
    const res = await axiosIns.delete(`civilian/${pk}/`);
    return res;
  },

  // Finalize Case
  async finalizeCase({ commit }, { payload, pk }) {
    const res = await axiosIns.patch(
      `case-finalize/${pk}/`,
      payload
    );
    return res;
  },
    
    // closed Case
  async closeCase({ commit }, { payload, pk }) {
    const res = await axiosIns.patch(
      `case-close/${pk}/`,
      payload
    );
    return res;
  },

  // Upload Document Award
  async createDocumentAward({ commit }, payload) {
    const res = await axiosIns.post("upload-document-award", payload);
    return res;
  },

  // Statistics Data
  async getStatisticsData({ commit }, {
    organization_id,
    ps,
  }) {
    try {
      const response = await axiosIns.get(`statistics-data/?organization_id=${organization_id}&ps=${ps}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch Organization');
    }
  },

  // get-formation-cases
  async formationCases({ commit }, {
    organization_id,
    ps,
  }) {
    try {
      const response = await axiosIns.get(`get-formation-cases/?organization_id=${organization_id}&ps=${ps}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch Organization');
    }
  },
  
  // get-noc-statistics-data
  async nocStatisticsData({ commit }, {
    organization_id,
    ps,
  }) {
    try {
      const response = await axiosIns.get(`noc-statistics-data/?organization_id=${organization_id}&ps=${ps}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch Organization');
    }
  },
  // off-civ-statistics-data
  async offCivStatisticsData({ commit }, {
  }) {
    try {
      const response = await axiosIns.get(`off-civ-statistics-data/`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch marked case count');
    }
  },

  // civilian-indiviual-statistics-data
  async CivilianIndividualStatisticsData({ commit }, {
    organization_id,
    ps,
  }) {
    try {
      const response = await axiosIns.get(`civilian-individual-statistics-data/?organization_id=${organization_id}&ps=${ps}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch Organization');
    }
  },

  // Individual Involved
  async deleteIndividual({ commit }, { pk }) {
    const res = await axiosIns.delete(`individual/${pk}/`);
    return res;
  },

  async removeCivilian({ commit }, payload) {
    const res = await axiosIns.post("delete-civilian-from-case/", payload)
    return res;
  },

  //  Appointment
  async createAppointment({ commit }, payload) {
    const res = await axiosIns.post("appointments/", payload);
    return res;
  },
  async getAppointments({ commit }, { pageNumber }) {
    const res = await axiosIns.get(`appointments/?page=${pageNumber}`);
    return res;
  },
  async getAppointment({ commit }, { pk }) {
    const res = await axiosIns.get(`appointments/${pk}/`);
    return res;
  },
  async deleteAppointment({ commit }, { pk }) {
    const res = await axiosIns.delete(`appointments/${pk}/`);
    return res;
  },
  async updateAppointment({ commit }, { payload, pk }) {
    const res = await axiosIns.patch(`appointments/${pk}/`, payload);
    return res;
  },
  async addAppointmentFromUserAPI({ commit }) {
    const res = await axiosIns.get(`add-appointments/`);
    return res;
  },
  async getlistAppointments({ commit }) {
    const res = await axiosIns.get(`get_appointments`);
    return res;
  },



  // OFFICERS BASIC DATA
  async createOfficersData({ commit }, payload) {
    const res = await axiosIns.post("officers-data/", payload);
    return res;
  },
  async getOfficersData({ commit }, { pageNumber, svc_number }) {
    let url = `officers-data/?page=${pageNumber}`;
    if (svc_number) {
      url += `&svc_number=${svc_number}`;
    }
    const res = await axiosIns.get(url);
    return res;
  },
  async getOfficerData({ commit }, { pk }) {
    const res = await axiosIns.get(`officers-data/${pk}/`);
    return res;
  },
  async deleteOfficersData({ commit }, { pk }) {
    const res = await axiosIns.delete(`officers-data/${pk}/`);
    return res;
  },
  async updateOfficersData({ commit }, { payload, pk }) {
    const res = await axiosIns.patch(`officers-data/${pk}/`, payload);
    return res;
  },
  async getParkingSpots({ commit }) {
    const res = await axiosIns.get(`parking-spots/`);
    return res;
  },
  async createParkingSpots({ commit }, payload) {
    const res = await axiosIns.post("parking-spots/", payload);
    return res;
  },
  async createReservations({ commit }, payload) {
    const res = await axiosIns.post("reservations/", payload);
    return res;
  },
  async getChargingrequests({ commit }, { user } ) {
    let url = `charging-requests/?`;
    if (user) {
      url += `&user=${user}`;
    }
    const res = await axiosIns.get(url);
    return res;
  },
  async getReservations({ commit }) {
    const res = await axiosIns.get(`reservations/`);
    return res;
  },
  async createChargingRequest({ commit }, payload) {
    const res = await axiosIns.post("charging-requests/", payload);
    return res;
  },
  async getParkingSpot({ commit }, { is_occupied }) {
    let url = `parking-spots/?`;
    url += `&is_occupied=${is_occupied}`;
    const res = await axiosIns.get(url);
    return res;
  },

  async deleteParkingSpot({ commit }, payload) {
    const pk = payload.pk;
    const res = await axiosIns.delete(`parking-spots/${pk}/`);
    return res;
  },
  async deleteChargingRequest({ commit }, payload) {
    const pk = payload.pk;
    const res = await axiosIns.delete(`charging-requests/${pk}/`);
    return res;
  },
  async deleteReservation({ commit }, payload) {
    const pk = payload.pk;
    const res = await axiosIns.delete(`reservations/${pk}/`);
    return res;
  },

  },
};
