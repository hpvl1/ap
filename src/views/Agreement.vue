<template>
  <div class="container">
    <div class="row">
      <div class="col-12" v-html="serverData"></div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/v1/site'

  export default {
    name: 'agreement',
    data() {
      return {
        serverData: ''
      }
    },
    async created() {
      const response = await api.site('agreement');
      this.serverData = response.data;
    },
  }
</script>
