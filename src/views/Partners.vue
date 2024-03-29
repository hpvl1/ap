<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container-fluid">
    <div class="row-ap">
      <div class="col-12">
        <h1>{{ $t("partners.page_title") }}</h1>
        <div class="search-form">
          <b-row>
            <b-col order-lg="2" lg="auto">
              <b-button
                @click="openCreateModal"
                v-text="$t('partners.create')"
                block
              >
              </b-button>
            </b-col>
            <b-col order-md="1" col>
              <partners-search ref="searchForm" @search="search">
              </partners-search>
            </b-col>
          </b-row>
        </div>

        <v-server-table
          ref="partnersTable"
          :url="apiUrl"
          :columns="tableColumns"
          :options="tableOptions"
          @row-click="handleView"
        >
          <template v-slot:img="{ row }">
            <img
              v-if="row.img !== null"
              :src="baseUrl + row.img.src + img_size"
            />
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
          <partners-form
            ref="partnersForm"
            :internalId="formModal.id"
            @updated="updated"
            @created="created"
          >
          </partners-form>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import tableRefreshMixin from "@/mixins/table";
import notificationMixin from "@/mixins/notification";
import filtersMixin from "@/mixins/filters";
import Api from "@/api/v1/partners";
import PartnersSearch from "@/components/partners/PartnersSearch";
import PartnersForm from "@/components/partners/PartnersForm";
import TableActionButtons from "@/components/TableActionButtons";

export default {
  name: "Partners",
  components: {
    PartnersForm,
    PartnersSearch,
    TableActionButtons,
  },
  mixins: [notificationMixin, tableRefreshMixin, filtersMixin],
  data() {
    return {
      baseUrl: process.env.VUE_APP_API,
      apiUrl: Api.baseUrl,
      img_size: "?w=80&h=80",
      tableOptions: {
        perPage: 10,
        headings: {
          id: this.$t("partners.id"),
          title: this.$t("partners.title"),
          img: this.$t("partners.img"),
          type: this.$t("partners.type"),
          status: this.$t("partners.status"),
          actions: "",
        },
        sortable: ["id", "title", "type", "status"],
        columnsClasses: {
          id: "id",
          actions: "actions",
          img: "img",
          header_img: "header_img",
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
      return ["id", "title", "img", "type", "status", ...actions];
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
      this.$refs.partnersTable.getData();
    },
    openCreateModal() {
      this.formModal.show = true;
      this.formModal.title = this.$t("partners.create");
    },
    openUpdateModal(row) {
      this.formModal.id = row.id;
      this.formModal.show = true;
      this.formModal.title = this.$t("partners.update");
    },
    handleSave(event) {
      event.preventDefault();
      this.$refs.partnersForm.submit();
    },
    resetForm() {
      this.formModal.id = null;
    },
    async handleDelete(id, name) {
      const result = await this.$_notification_confirmDelete(
        this.$t("main.confirm.delete"),
        this.$t("partners.to_delete"),
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
