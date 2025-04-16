<template>
  <validation-provider #default="{ errors }" :name="name" :rules="rules">
    <b-form-group :label-for="label" class="labelStyle" :class="customClass">
      <template #label>
        {{ name }}
        <span class="text-danger" v-if="rules && rules.required === true">*</span>
      </template>
      <v-select
        :id="label"
        v-model="selected"
        :label="label"
        :multiple="multiple"
        :disabled="disabled"
        :options="getFilter"
        :getOptionLabel="optionLabel"
        class="vSelectStyle"
        :placeholder="`${name}`"
        @search="searchOptions"
        @input="(item) => $emit('setMethod', item)"
        append-to-body
        :calculate-position="withPopper"
      >
        <template #list-footer>
          <li
            v-show="hasNextPage"
            class="loader"
            v-observe-visibility="handleInfinityScroll"
          >
            Loading more options...
          </li>
        </template>
        <div></div>
      </v-select>
      <b-form-invalid-feedback :state="errors.length > 0 ? false : null">
        {{ errors[0] }}
      </b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import util from "@/util.js";
import { createPopper } from "@popperjs/core";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    name: String,
    label: String,
    rules: Object,
    customClass: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    parameters: Object,
    prevSelected: [Object, Array],
    getListMethod: Function,
    optionLabel: Function,
    filter: Object,
    searchBy: {
      type: String,
      default: "",
    },
  },
  mixins: [util],
  data: () => ({
    selected: null,
    results: [],
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    search: "",
    placement: "bottom",
  }),
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    async fetchPaginatedData() {
      try {
        let data = {
          pageNumber: this.currentPage,
        };

        if (this.searchBy) {
          data[this.searchBy] = this.search;
        }

        if (this.parameters) {
          data = {
            ...data,
            ...this.parameters,
          };
        }
        const res = await this.getListMethod(data);
        for (let i = 0; i < res.data.results.length; i++) {
          const element = res.data.results[i];
          if (!this.results.find((e) => e.id === element.id)) {
            this.results.push(element);
          }
        }
        res.data.next ? (this.hasNextPage = true) : (this.hasNextPage = false);
        this.totalPages = res.data.total_pages;
      } catch (error) {
        this.displayError(error);
      }
    },
    async handleInfinityScroll(isVisible) {
      if (!isVisible) {
        return;
      }
      if (this.currentPage >= this.totalPages) {
        return;
      }
      this.hasNextPage = false;
      this.currentPage++;
      await this.fetchPaginatedData();
    },
    async searchOptions(query) {
      this.search = query;
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    withPopper(dropdownList, component, { width }) {
      dropdownList.style.width = width;
      dropdownList.style.zIndex = (500000).toString();

      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: this.placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -1],
            },
          },
          {
            name: "toggleClass",
            enabled: true,
            phase: "write",
            fn({ state }) {
              component.$el.classList.toggle(
                "drop-up",
                state.placement === "top"
              );
            },
          },
        ],
      });

      return () => popper.destroy();
    },
    clearSelected() {
      this.selected = null;
    },
  },
  computed: {
    getFilter() {
      if (this.filter) {
        return this.results.filter((res) => {
          return res.id !== this.filter.id;
        });
      }
      return this.results;
    },
  },
  watch: {
    prevSelected: {
      async handler(newValue, oldValue) {
        if (newValue) {
          if (!this.results.find((e) => e.id === newValue.id)) {
            this.results.push(newValue);
          }
          this.selected = newValue;
          this.$emit("setMethod", this.selected);
        }
      },
      immediate: true,
    },
    parameters: {
      async handler(newValue, oldValue) {
        this.results = [];
        if (newValue) {
          const res = Object.values(newValue).every(
            (x) => x !== null && x !== ""
          );
          if (res) {
            await this.fetchPaginatedData();
          } else {
            this.selected = null;
            this.$emit("setMethod", this.selected);
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
.loader {
  text-align: center;
  color: #bbbbbb;
}
.vSelectStyle .vs__deselect {
  fill: #fff !important;
}
</style>
