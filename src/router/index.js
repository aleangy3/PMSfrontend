import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/Login.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "/signup",
      name: "Register",
      component: () => import("@/views/auth/Register.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "/user",
      name: "User",
      component: () => import("@/views/user/User.vue"),
      meta: {
        pageTitle: "User",
        breadcrumb: [
          {
            text: "User",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_user",
      },
    },
    {
      path: "/role",
      name: "Role",
      component: () => import("@/views/role/Role.vue"),
      meta: {
        pageTitle: "Role",
        breadcrumb: [
          {
            text: "Role",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_role",
      },
    },  
    {
      path: "/charging-requests",
      name: "ChargingRequests",
      component: () => import("@/views/case/ChargingRequests.vue"),
      meta: {
        pageTitle: "Charging Request",
        breadcrumb: [
          {
            text: "Charging Request",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_charging_requests",
      },
    },
    {
      path: "/reservation",
      name: "Reservation",
      component: () => import("@/views/allCases/Reservations.vue"),
      meta: {
        pageTitle: "Reservations",
        breadcrumb: [
          {
            text: "Reservations",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_reservations",
      },
    },
    {
      path: "/parking-spots",
      name: "ParkingSpots",
      component: () => import("@/views/markedCase/ParkingSpots.vue"),
      meta: {
        pageTitle: "Parking Spots",
        breadcrumb: [
          {
            text: "Parking Spots",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_parking_spots",
      },
    },
    {
      path: "*",
      redirect: "/login",
    }, 
  ],
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
