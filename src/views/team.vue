<template>
  <div class="team">
    <v-container>
      <h1 class="subheading mb-5">Team</h1>
      <v-layout row wrap>
        <v-flex flat xs12 sm6 md4 lg3 v-for="person in team" :key="person.name">
          <v-card outlined class="ma-2">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">
                  {{person.role}}
                </div>
                <v-list-item-title class="text-h5 mb-1">
                  {{person.name}}
                </v-list-item-title>
                <v-list-item-subtitle>{{person.info}}</v-list-item-subtitle>
                <v-list-item-subtitle><span class="font-weight-bold">Age: </span>{{person.age}} years</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar size="80" class="grey" >
                <v-responsive>
                  <v-img class="" :src="require(`../assets/img/${person.name}.png`)"></v-img>
                </v-responsive>
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
              <v-btn outlined rounded text>
                <v-icon left>mdi-message</v-icon>
                <span>message</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

export default {
    data:()=>{
      return{
        team:[
          {name: 'Ryu', role: 'web developer', info: '12 lorem ipsom telie', age: 34},
          {name: 'Yoshi', role: 'web developer', info: '22 lorem ipsom telie', age: 25},
          {name: 'Naruto', role: 'web developer', info: '32 lorem ipsom telie', age: 19},
          {name: 'Chung Li', role: 'project manager', info: '42 lorem ipsom telie', age: 41}
        ]
      }
    }
  }
</script>

<style scoped>
  .border{
    border: 1px solid #000 !important;
  }
</style>