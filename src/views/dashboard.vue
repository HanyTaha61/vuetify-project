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
      <v-card flat :class="`grey lighten-3 mb-1 border project ${project.status}`" v-for="project in projectsArray" :key="project.title" :id="project.id">
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
          <v-flex xs2 sm4 md2 class="primary--text">
              <div>
                <v-chip small :class="`${project.status} dark--text caption mt-4 px-3 mr-5`">
                    {{project.status}}
                </v-chip>
              </div>
          </v-flex>
          <v-flex xs6 sm4 md2 class="primary--text">
            <div class="caption primary--text pa-1 font-weight-bold">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" left @click="deleteProject(project.id)">mdi-delete</v-icon>
                </template>
                <span>delete project</span>
              </v-tooltip>
              
              <!-- dialog -->
                  <v-dialog width="500" v-model="dialog" >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn text outlined class="grey" dark v-bind="attrs" v-on="on" >create new project</v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5 text-uppercase grey lighten-2">
                        <div class="w-fit mx-auto">create a new project</div>
                      </v-card-title>

                      <v-card-text>
                          <v-form ref="form">
                            <v-text-field label="project title" v-model="title" prepend-icon="mdi-folder"></v-text-field>
                            <v-textarea label="project content" v-model="content" prepend-icon="mdi-pencil"></v-textarea>
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
                        <v-btn :loading='loading' class="grey lighten-2 text--darken-4" color="grey" outlined @click="submit()" >Add Project</v-btn>
                      </v-card-actions>
                      
                    </v-card>
                  </v-dialog>
              <!-- dialog -->
              
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on" left @click="modifyProject(project.id)">mdi-pencil</v-icon>
                </template>
                <span>edit project</span>
              </v-tooltip>
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
      loading: false
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


// next issues ===> 1- duplication of modify
             


      // const Query = query(collection(db, "Projects"));
      // const querySnapshot = await getDocs(Query);
      // querySnapshot.forEach((doc) => {
      //   this.projectsArray.push({
      //     ...doc.data()
      //   })
      // })
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
    transition: 0.4s;
  }
  .v-icon.mdi-pencil:hover{
    color: #12be6e;
  }
  .v-icon.mdi-delete:hover{
    color: #e32;
  }

</style>