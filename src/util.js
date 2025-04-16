import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import moment from "moment";
import store from "./store";

const util = {
  data() {
    return {
      modes: {

        CREATE: 1,
        EDIT: 2,
        VIEW: 3,
        faiz : 4
      },
      RootOrg: {
        org_id: process.env.VUE_APP_ORG_ID,
        org_name: process.env.VUE_APP_ORG_NAME
      },
      rankCategories: [
        { value: 1, text: "General Officer" },
        { value: 2, text: "Senior Officer" },
        { value: 3, text: "Officer" },
        { value: 4, text: "Soldier" },
      ],
      rankCategory(category) {
        const cat = this.rankCategories.find((cat) => cat.value === category);
        return cat.text;
      },
      getDateString(date) {
        return moment(date).format("Do MMMM YYYY");
      },
      levelName(level) {
        const l = this.organizationLevels.find((l) => l.value === level);
        return l.name;
      },
      caseStatus: {
        PENDING: 1,
        PROCESSING: 2,
        FINALIZED: 3,
        CLOSED: 4,
      },
      addType: {
        PRESIDENT: 1,
        ORDERED_BY: 2,
        OFFICER: 3,
      },

      statusOptions: [
        { value: 1, name: "Pending" },
        { value: 2, name: "Processing" },
        { value: 3, name: "Finalized" },
        { value: 4, name: "Closed" },
        { value: 5, name: "Overdue" },

      ],
      wardsOptions: [
        { value: 1, name: "Arm Forces" },
        { value: 2, name: "JCO/NCO/OR" },
        { value: 3, name: "Civ" },

      ],
      wardsName: {
        1: { value: 1, name: "Arm Forces" },
        2: { value: 2, name: "JCO/NCO/OR" },
        3: { value: 3, name: "Civ" },
      },

      statusName: {
        1: { value: 1, name: "Pending" },
        2: { value: 2, name: "Processing" },
        3: { value: 3, name: "Finalized" },
        4: { value: 4, name: "Closed" },
        5: { value: 5, name: "Overdue" },

      },
      searchTypes: [
        { value: 1, name: "Token No" },
        { value: 2, name: "Status" },
        { value: 3, name: "Start Date" },
        { value: 4, name: "Completion Date" },
        { value: 5, name: "President" },
        { value: 6, name: "Ordered By" },
        { value: 7, name: "Nature Of Case" },
        { value: 8, name: "Formation" },
        { value: 9, name: "Brief"},
        { value: 10, name: "Army no"}
      ],
      categoryColors: {
        1: "table-info",
        2: "table-success",
        3: "table-danger",
        4: "table-primary",
        5: "table-warning",
      },
      memberTypes: [

        { value: 1, name: "CNIC" },
        { value: 2, name: "Name" },
      ],
      membersDetailTypes: {
        ARMY: 1,
        CIVILIAN: 2,
        ANONYMOUS: 3,
      },
      organizationLevelsObj: {
        FIRST: 1,
        OTHER: 2,
      },
      organizationLevels: [
        { value: 1, name: "First" },
        { value: 2, name: "Other" },
      ],
      showModalPlace: {
        STATISTICS: 1,
        RECEIVED: 2,
        CAT_TABLE: 3,
        NOC_TABLE: 4,
        USER: 5,
      },

      sortTypes: [
        { value: 'token_no', name: "Token No asc" },
        { value: '-token_no', name: "Token No desc" },
        { value: 'formation', name: "Formation asc" },
        { value: '-formation', name: "Formation desc" },
        { value: 'noc', name: "Nature Of Case asc" },
        { value: '-noc', name: "Nature Of Case desc" },
        { value: 'status', name: "Status asc" },
        { value: '-status', name: "Status desc" },
      ],
      PS: {
        ps_a: 1,
        ps_b: 2,
        ps_c: 3,
      },
      srvOptions: [
        { value: 1, name: "PA" },
        { value: 2, name: "PS" },
      ],
    };
  },
  methods: {
    displayError(error) {
      if (typeof error === "string") {
        this.$toast(
          {
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "BellIcon",
              text: error,
              variant: "danger",
            },
          },
          {
            timeout: 4000,
            position: "top-center",
          }
        );
        return;
      }
      let msgs = [];
      if(!('response' in error)) {
        return;
      }
      if (!error.response || error.response.status === 500) {
        msgs.push("Error: Network Error");
      } else if (error.response.status === 500) {
        msgs.push("Error: Server Error");
      } else if (error.response.status === 401) {
        return;
      } else if (typeof error.response.data === "string") {
        msgs.push("Error: Server Error");
      } else if (Array.isArray(error.response.data.msg)) {
        msgs.push(error.response.data.msg[0]);
      } else if (error.response.data.msg) {
        msgs.push(error.response.data.msg);
      } else {
        for (const key in error.response.data) {
          const element = error.response.data[key];
          if (Array.isArray(element)) {
            if (typeof element[0] === "string") {
              msgs.push(element[0]);
            } else if (typeof element[0] === "object") {
              for (const key in element[0]) {
                if (key !== "msg") {
                  msgs.push(`${key}: ${element[0][key][0]}`);
                } else {
                  msgs.push(`${element[0][key][0]}`);
                }
              }
            }
          } else if (typeof element === "object") {
            for (const key in element) {
              msgs.push(`${element[key][0]}`);
            }
          } else {
            if (element !== "Invalid page.") {
              msgs.push(element);
            }
          }
        }
      }
      for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i];
        this.$toast(
          {
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "BellIcon",
              text: msg,
              variant: "danger",
            },
          },
          {
            timeout: 4000,
            position: "top-center",
          }
        );
      }
    },
    getMember(obj) {
      if (!obj) {
      return "";
      }
      return obj.name ? obj.name : "";
    },

    getMembersData(obj) {
      if (!obj){
        return "";
      }
      return obj.rank_name
    },
    statusNames(status) {
      let name = "";
      switch (status) {
        case 1:
          name = "Pending";
          break;
        case 2:
          name = "Processing";
          break;
        case 3:
          name = "Finalized";
          break;
        case 4:
          name = "Closed";
          break;
      }
      return name;
    },
     wardsNames(wards) {
      let name = "";
      switch (wards) {
        case 1:
          name = "Arm Forces";
          break;
        case 2:
          name = "JCO/NCO/OR";
          break;
        case 3:
          name = "Civ";
          break;
      }
      return name;
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      } else {
        return text;
      }
    },
  },
};

export default util;
