<template>
  <v-app>
    <v-main class="mx-1">
      <Navbar/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/navbar.vue'
export default {
  components:{Navbar},
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
<style>
.border{
  border: 1px solid #000 !important;
}
.w-fit{
  width: fit-content !important;
}
</style>