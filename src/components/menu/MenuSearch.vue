<template>
  <b-form>
    <b-form-row>
      <b-col md="1">
        <b-form-group>
          <b-form-input
            type="search"
            v-model="search.id"
            :placeholder="$t('menu.search.id')"
          >
          </b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-input-group>
          <b-form-input
            type="search"
            v-model="search.title"
            :placeholder="$t('menu.search.title')"
          >
          </b-form-input>
        </b-input-group>
      </b-col>

      <b-col>
        <multiselect
          v-model="searchAlias"
          track-by="id"
          label="title"
          :placeholder="$t('menu.search.alias')"
          :options="aliases"
          :searchable="true"
          :allow-empty="true"
          v-bind="selectOptions"
        >
          <template slot="clear">
            <div
              class="multiselect__clear"
              v-if="search.alias !== ''"
              @mousedown.prevent.stop="clearField('alias', 'searchAlias')"
            >
              <font-awesome-icon icon="times"></font-awesome-icon>
            </div>
          </template>
        </multiselect>
      </b-col>

      <b-col md="3">
        <multiselect
          v-model="searchStatus"
          track-by="id"
          label="title"
          :placeholder="$t('menu.search.status')"
          :options="statuses"
          :searchable="true"
          :allow-empty="true"
          v-bind="selectOptions"
        >
          <template slot="clear">
            <div
              class="multiselect__clear"
              v-if="search.status !== ''"
              @mousedown.prevent.stop="clearField('status', 'searchStatus')"
            >
              <font-awesome-icon icon="times"></font-awesome-icon>
            </div>
          </template>
        </multiselect>
      </b-col>
    </b-form-row>
  </b-form>
</template>

<script>
import Multiselect from "vue-multiselect";
import Api from "@/api/v1/menu";

export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      loaded: false,

      statuses: [],
      searchStatus: null,
      status: "",
      aliases: [],
      searchAlias: null,
      alias: "",
      search: {
        status: "",
        title: "",
        id: "",
        alias: "",
      },
      selectOptions: {
        multiple: false,
        showNoOptions: false,
        showNoResults: false,
        selectLabel: "",
        selectedLabel: "",
        deselectLabel: "",
        openDirection: "bottom",
      },
    };
  },
  computed: {},
  methods: {
    async fetchFilters() {
      this.loaded = true;
      const response = await Api.getFilters();
      this.statuses = response.data.statuses;
      this.aliases = response.data.aliases;
    },
    clearField(field, searhField) {
      this.search[field] = "";
      this[searhField] = null;
    },
  },
  watch: {
    searchStatus(newValue) {
      if (newValue !== null && newValue !== undefined) {
        this.search.status = newValue.id;
      }
    },
    searchAlias(newValue) {
      if (newValue !== null && newValue !== undefined) {
        this.search.alias = newValue.id;
      }
    },
    search: {
      handler(value) {
        this.$emit("search", value);
      },
      deep: true,
    },
  },
  created() {
    this.fetchFilters();
  },
};
</script>
