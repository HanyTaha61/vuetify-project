<template>
  <div class="dashboard">
    <h1 class="subheading grey--text">Dashboard</h1>
    <v-container class="">
      <v-layout row>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
        <v-btn small text class="mb-5 ml-5" v-bind="attrs" v-on="on" @click="sortBy('title')">
          <v-icon left>mdi-sort</v-icon>
          <span>sort by project name</span>
        </v-btn>
          </template>
          <span>sort by project name</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small text class="mb-5 ml-5" v-bind="attrs" v-on="on" @click="sortBy('person')">
              <v-icon left>mdi-sort</v-icon>
              <span>sort by person</span>
            </v-btn>
          </template>
          <span>sort by person</span>
        </v-tooltip>
      </v-layout>
      <v-card flat :class="`grey lighten-3 mb-1 border project ${project.status}`" v-for="(project, i) in projectsArray" :key="i" :id="project.id">
        <v-layout class="no-gutters pa-1" wrap row>
          <v-flex xs10 md4 class="primary--text">
            <div class="caption primary--text pa-1 font-weight-bold">Project Title</div>
            <div class="black--text">{{ project.title }}</div>
            <article>{{ project.content }}</article>
          </v-flex>
          <v-flex xs6 sm4 md2 class="primary--text">
            <div class="caption primary--text pa-1 font-weight-bold">Person</div>
            <div class="black--text">{{ project.person }}</div>
          </v-flex>
          <v-flex xs6 sm4 md2 class="primary--text">
            <div class="caption primary--text pa-1 font-weight-bold">Due date</div>
            <div class="black--text">{{ project.due }}</div>
          </v-flex>
          <v-flex xs2 sm4 md1 class="primary--text">
              <div>
                <v-chip small :class="`${project.status} dark--text caption mt-4 px-3 mr-5`">
                    {{project.status}}
                </v-chip>
              </div>
          </v-flex>
          <v-flex xs6 sm4 md3 class="primary--text">
            <div class="caption primary--text pa-1 font-weight-bold">

              <!-- ******************* -->
              <!-- START DELETE BUTTON -->
              <!-- ******************* -->

                <button @click="deleteProject(project.id)" class="deleteProject small mx-1 grey v-btn v-btn--outlined v-btn--text theme--dark v-size--default">
                  <v-icon left>mdi-delete</v-icon>
                  delete
                </button>
              
              <!-- ***************** -->
              <!-- END DELETE BUTTON -->
              <!-- ***************** -->

<!-- ------------------------------------------------------------ -->

              <!-- ***************** -->
              <!-- START EDIT BUTTON -->
              <!-- ***************** -->

                  <v-dialog persistent :retain-focus="false" width="500" v-model="dialog" >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" text outlined class="grey modifyProject" dark @click="modifyProject(project.id)">
                              <v-icon left>mdi-pencil</v-icon>
                        edit
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5 text-uppercase grey lighten-2">
                        <div class="w-fit mx-auto">edit project</div>
                      </v-card-title>
                      <v-card-text>
                          <v-form ref="form">
                            <v-text-field label="project title" :value="project.title" prepend-icon="mdi-folder"></v-text-field>
                            <v-textarea label="project content" :value="project.content" prepend-icon="mdi-pencil"></v-textarea>
                              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date" transition="scale-transition" offset-y  min-width="auto" >
                              <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="date" label="project due date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" ></v-text-field>
                              </template>
                              <v-date-picker v-model="due" no-title scrollable >
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="menu = false" >Cancel</v-btn>
                              <v-btn text color="primary" @click="$refs.menu.save(date)" >OK</v-btn>
                              </v-date-picker>
                          </v-menu>   
                          </v-form>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions class="justify-start">
                        <v-btn :loading='loading' class="grey lighten-2 text--darken-4" color="grey" outlined @click="submit()" >Apply</v-btn>
                        <v-btn class="grey lighten-2 text--darken-4" color="grey" outlined @click="cancel()" >Cancel</v-btn>
                      </v-card-actions>
                      
                    </v-card>
                  </v-dialog>

              <!-- *************** -->
              <!-- END EDIT BUTTON -->
              <!-- *************** -->
              
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import db from '../firebase'
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";

export default {
  data: ()=>{
    return{
      projectsArray: [],
      dialog: false,
      title: '',
      content: '',
      due: null,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      loading: false,
      
    }
  },
  methods:{
    sortBy(prop){
      this.projectsArray.sort((a,b) =>
        a[prop] < b[prop] ? -1: 1)
    },
   async deleteProject(id){
     await deleteDoc(doc(db, "Projects", id))
      console.log(id + ' ---- was deleted -----');
    },
    modifyProject(id){
      console.log(id);
    },
    cancel(){
      this.title = '',
      this.content = '',
      this.due = null,
      this.dialog = false
    }
  },
  async created(){

    const q = query(collection(db, "Projects"));
    onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
            this.projectsArray.push({
              ...change.doc.data(),
              id: change.doc.id
            })
            // console.log("New project with id:", change.doc.data());
        }
        if (change.type === "modified") {
            this.projectsArray.push({
              ...change.doc.data()
            })
            console.log("modified project: ", typeof(change.doc.data()));
        }
        if (change.type === "removed") {
          let target = document.getElementById(change.doc.id);
          target.parentElement.removeChild(target);
        }
      });
    });
    }
  }
</script>
<style scoped>
  .border{
    border: 1px solid #000 !important;
  }
  .project.completed{
    border-left: 5px solid #12be6e !important;
  }
  .project.ongoing{
    border-left: 5px solid #ebee22 !important;
  }
  .project.overdue{
    border-left: 5px solid #e32 !important;
  }
  
  .w-fit{
    width: fit-content !important;
  }
  .v-chip.completed{
    background-color: #12be6e !important;
    color: #fff;
  }
  .v-chip.ongoing{
    background-color: #ebee22 !important;

  }
  .v-chip.overdue{
    background-color: #e32 !important;
    color: #fff;

  }
  .v-icon.mdi-pencil, .v-icon.mdi-delete{
    transition: 0.1s;
    color: white;
  }
  .v-icon.mdi-pencil:hover{
    color: #12be6e;
  }
  .v-icon.mdi-delete:hover{
    color: #e32;
  }

.deleteProject{
  transition: 0.1s;
}
.deleteProject:hover, .deleteProject:hover .v-icon.mdi-delete{
  color: #e32;
  background-color: transparent !important;
}
.modifyProject{
  transition: 0.1s;
}
.modifyProject:hover, .modifyProject:hover .v-icon.mdi-pencil{
  color: #12be6e;
  background-color: transparent !important;
}
</style>