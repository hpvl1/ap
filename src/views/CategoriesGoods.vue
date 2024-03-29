<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container-fluid">
    <div class="row-ap">
      <div class="col-12">
        <h1>{{ $t("categoriesGoods.page_title") }}</h1>
        <div class="search-form">
          <b-row>
            <b-col order-lg="2" lg="auto">
              <b-button
                @click="openCreateModal"
                v-text="$t('categoriesGoods.create')"
                block
              >
              </b-button>
            </b-col>
            <b-col order-md="1" col>
              <settings-search ref="searchForm" @search="search">
              </settings-search>
            </b-col>
          </b-row>
        </div>

        <v-server-table
          ref="categoriesGoodsTable"
          :url="apiUrl"
          :columns="tableColumns"
          :options="tableOptions"
          @row-click="handleView"
        >
          <template v-slot:prev_img="{ row }">
            <img :src="baseUrl + row.prev_img.src + img_size"/>
          </template>
          <template v-slot:parent_id="{ row }">
            {{ row.parentTitle }}
          </template>
          <template v-slot:type="{ row }">
            {{ row.typeTitle }}
          </template>
          <template v-slot:status="{ row }">
            {{ row.statusTitle }}
          </template>
          <template v-slot:actions="{ row }">
            <table-action-buttons
              :update-visible="true"
              :delete-visible="true"
              @update="openUpdateModal(row)"
              @delete="handleDelete(row.id, row.title)"
            >
            </table-action-buttons>
          </template>
        </v-server-table>

        <b-modal
          lazy
          v-model="formModal.show"
          modal-class="modal-right"
          size="lg"
          :title="formModal.title"
          :okTitle="$t('main.save')"
          :cancelTitle="$t('main.cancel')"
          @ok="handleSave"
          @hidden="resetForm"
        >
          <settings-form
            ref="settingsSiteForm"
            :internalId="formModal.id"
            @updated="updated"
            @created="created"
          >
          </settings-form>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import tableRefreshMixin from "@/mixins/table";
import notificationMixin from "@/mixins/notification";
import filtersMixin from "@/mixins/filters";
import Api from "@/api/v1/categories-goods";
// import SettingsSearch from "@/components/settings/SettingsSearch";
// import SettingsForm from "@/components/settings/SettingsForm";
import TableActionButtons from "@/components/TableActionButtons";

export default {
  name: "categories-goods",
  components: {
    // SettingsForm,
    // SettingsSearch,
    TableActionButtons,
  },
  mixins: [notificationMixin, tableRefreshMixin, filtersMixin],
  data() {
    return {
      statuses: [],
      baseUrl: process.env.VUE_APP_API,
      apiUrl: Api.baseUrl,
      img_size: "?w=80&h=80",
      tableOptions: {
        perPage: 10,
        headings: {
          id: this.$t("settingsSite.table.id"),
          title: this.$t("settingsSite.table.title"),
          parent_id: this.$t("categoriesGoods.table.parent_title"),
          img: this.$t("categoriesGoods.table.img"),
          status: this.$t("categoriesGoods.table.status"),
          actions: "",
        },
        sortable: ["id", "title"],
        columnsClasses: {
          id: "id",
          actions: "actions",
          img: "img",
          status: "status",
        },
        params: {},
      },
      formModal: {
        id: null,
        show: false,
        title: "",
      },
    };
  },
  computed: {
    tableColumns() {
      const actions = ["actions"];
      return ["id", "title", "img", "status", ...actions];
    },
  },
  methods: {
    searchRefresh() {
      this.$refs.searchForm.fetchFilters();
    },
    search(searchForm) {
      this.$set(this.tableOptions, "params", searchForm);
      this.$_table_debouncedRefresh();
    },
    refreshTable() {
      this.$refs.settingsSiteTable.getData();
    },
    openCreateModal() {
      this.formModal.show = true;
      this.formModal.title = this.$t("settingsSite.create");
    },
    openUpdateModal(row) {
      this.formModal.id = row.id;
      this.formModal.show = true;
      this.formModal.title = this.$t("settingsSite.update");
    },
    handleSave(event) {
      event.preventDefault();
      this.$refs.settingsSiteForm.submit();
    },
    resetForm() {
      this.formModal.id = null;
    },
    async handleDelete(id, name) {
      const result = await this.$_notification_confirmDelete(
        this.$t("main.confirm.delete"),
        this.$t("settingsSite.to_delete"),
        name
      );
      if (result.value) {
        await Api.deleteModel(id);
        this.$_notification_notify(this.$t("main.notifications.deleted"));
        this.searchRefresh();
        this.refreshTable();
      }
    },
    created() {
      this.$_notification_notify(this.$t("main.notifications.created"));
      this.saved();
    },
    updated() {
      this.$_notification_notify(this.$t("main.notifications.updated"));
      this.saved();
    },
    async saved() {
      this.formModal.show = false;
      this.searchRefresh();
      this.refreshTable();
    },
    handleView({ row }) {
      this.openUpdateModal(row);
    },
  },
};
</script>
