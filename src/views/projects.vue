<template>
  <div class="projects">
    <v-container>
      <h1 class="subheading mb-5">My Projects</h1>
      <v-expansion-panels focusable>
        <v-expansion-panel v-for="project in myProjects" :key="project.title" >
          <v-expansion-panel-header>
            {{project.title}}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="font-weight-bold">due by: {{project.due}}</div>
            <div class="grey--text">{{project.status}}</div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>

<script>

  export default {
      data:()=>{
        return{
          projects:[
          {title: 'Design a new website', person: 'The net ninja', due: '01-12-2021', status: 'completed'},
          {title: 'code up the home page', person: 'Chun Li', due: '01-11-2021', status: 'completed'},
          {title: 'Design video thumbnails', person: 'Ryu', due: '01-01-2022', status: 'overdue'},
          {title: 'final destination', person: 'The net ninja', due: '01-01-2022', status: 'overdue'},
          {title: 'Create a community forum', person: 'Naruto', due: '13-11-2021', status: 'ongoing'},
          {title: 'Create a dashboard', person: 'The net ninja', due: '13-11-2021', status: 'ongoing'},
        ]
        }
      },
      computed:{
        myProjects(){
          return this.projects.filter(item=>{
            return item.person === 'The net ninja'
          })
        }
      }
    }
</script>
