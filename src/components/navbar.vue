<template>
  <div>
      <v-app-bar dense app class="navbar">
          <!-- <v-snackbar timeout="3000" v-model="snackbar" bottom right absolute>
              <span>Awesome, Project Added!!</span>
          </v-snackbar> -->

            <v-snackbar outlined color="white" timeout="3000" width="200" class="text-center" dark v-model="snackbar" top right>Awesome, Project Added!!</v-snackbar>

          <v-app-bar-nav-icon class="grey--text text--lighten-1" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-app-bar-title route to='/' class="grey--text text--lighten-1">
              <span class="text-uppercase font-weight-light">todo</span>
              <span class="text-uppercase font-weight-bold">ninja</span>
          </v-app-bar-title>
          <v-spacer></v-spacer>

          <!-- dropdown menu -->
          <div class="text-center">
            <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                text
                v-bind="attrs"
                v-on="on"
                class="grey--text"
                >
                Menu
                </v-btn>
            </template>
            <v-list>
                <v-list-item router :to="item.route"
                v-for="(item, index) in links"
                :key="index"
                >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
            </v-menu>
        </div>
          <!-- dropdown menu -->
          
          <v-btn text class="grey--text text-lighten-1">
              <span>signout</span>
              <v-icon right>mdi-exit-to-app</v-icon>
          </v-btn>
      </v-app-bar>
      <v-navigation-drawer app v-model="drawer" color="#444" dark>
          <v-layout column align-center class="mt-5">
              <v-flex>
                <v-avatar size="80">
                    <img src="../assets/img/Ryu.png" alt="">
                </v-avatar>
                <p class="subheading mt-2 white--text text-center">Ryu</p>
              </v-flex>
              <v-flex>
                  <popup @projectAdded='snackbar = true'/>
              </v-flex>
          </v-layout>
          <v-list>
              <v-icon left>mdi-build</v-icon>
            <v-list-item-group>
                <v-list-item v-for="link in links" :key="link.text" route :to="link.route">
                    <v-list-item-icon>
                        <v-icon v-text="link.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{link.text}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
          </v-list>
      </v-navigation-drawer>
  </div>
</template>

<script>
import popup from './popup.vue'
export default {
    components: {popup},
    data(){
        return{
            drawer: false,
            links:[
                { text: 'home', icon: 'mdi-home', route: '/' },
                { text: 'dashboard', icon: 'mdi-clock', route: '/dashboard' },
                { text: 'My projects', icon: 'mdi-account', route: '/projects' },
                { text: 'team', icon: 'mdi-flag', route: '/team' },
            ],
            snackbar: false
        }
    }
}
</script>

<style scoped>
    .v-list-item--active{
        background-color: #666 !important;
        color: #eee !important;
    }
</style>