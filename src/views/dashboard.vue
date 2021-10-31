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
<v-card flat :class="'grey lighten-3 mb-1 border project ' + project.status" v-for="(project, i) in projectsArray" :key="i" :id="project.id">
  <div class="edit-list">

    
    <button @click="deleteProject(project.id)" class="deleteProject small mx-1 grey v-btn v-btn--outlined v-btn--text theme--dark v-size--default">
      <v-icon left>mdi-delete</v-icon>
      delete
    </button>

    
    <v-dialog v-model="dialog" persistent max-width="600" >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" dark
              class="modifyProject small mx-1 grey v-btn v-btn--outlined v-btn--text theme--dark v-size--default" >
              <v-icon left>mdi-pencil</v-icon>
                edit
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5">
              edit project #: {{project.id}}
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newTitle" placeholder="project title">{{project.title}}</v-text-field>
              <v-text-field v-model="newContent" placeholder="project content">{{project.content}}</v-text-field>
              <v-text-field v-model="newDue" placeholder="project due date">{{project.due}}</v-text-field>
              new title: {{newTitle}}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey lighten-3" class="green--text" @click="modifyProject(project.id)" > Apply </v-btn>
              <v-btn color="grey lighten-3" class="red--text" @click="dialog = false" > Cancel </v-btn>
            </v-card-actions>
          </v-card>
    </v-dialog>
  </div>
  <v-layout class="no-gutters pa-1" wrap row>
    <v-flex xs12 sm4 md3 class="px-2  primary--text">
      <div class="caption primary--text pa-1 font-weight-bold">Project Title</div>
      <div class="black--text">{{ project.title }}</div>
      <div class="red--text caption">ID: {{ project.id }}</div>
    </v-flex>
    <v-flex xs12 sm8 md3 class="px-2  primary--text">
      <div class="caption primary--text pa-1 font-weight-bold">Project content</div>
      <div class="black--text">{{ project.content }}</div>
    </v-flex>
    <v-flex xs12 sm4 md2 class="px-2  primary--text">
      <div class="caption primary--text pa-1 font-weight-bold">Person</div>
      <div class="black--text">{{ project.person }}</div>
    </v-flex>
    <v-flex xs12 sm4 md2 class="px-2  primary--text">
      <div class="caption primary--text pa-1 font-weight-bold">Due date</div>
      <div class="black--text">{{ project.due }}</div>
    </v-flex>
    <v-flex xs12 sm4 md2 class="px-md-2 primary--text">
        <div class="caption primary--text pa-1 font-weight-bold">Project status
          <v-chip small :class="project.status+ ' dark--text caption mt-4 px-3 mr-5'">
              {{project.status}}
          </v-chip>
        </div>
    </v-flex>
  </v-layout>
</v-card>      
    </v-container>
  </div>
</template>

<script>
import db from '../firebase'
import { collection, query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default {
  data: ()=>{
    return{
      absolute: false,
      overlay: false,
      projectsArray: [],
      dialog: false,
      title: '',
      content: '',
      due: '',
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      loading: false,
      updatedTitle: '',
      updatedContent: '',
      updatedDue: '',
      newTitle: '',
      newDue: '',
      newContent: ''

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
   async modifyProject(id){
      const selectedProject = doc(db, "Projects", id);

      await updateDoc(selectedProject, {
          title : this.newTitle,
          content : this.newContent,
          due : this.newDue


      });
      this.dialog = false
        console.log('project with ID: ' + id + ' was modified successfully!!');
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
        let target = document.getElementById(change.doc.id);
        if (change.type === "added") {
            this.projectsArray.push({
              ...change.doc.data(),
              id: change.doc.id
            })
            console.log("New project with id:", change.doc.data());
        }
        if (change.type === "modified") {
            change.doc.data().title = this.newTitle
            change.doc.data().content = this.newContent
            change.doc.data().due = this.newDue
            console.log(change.doc.data().title);

          const updated = query(collection(db, "Projects"))
          console.log("modified project: ", updated);
        }
        if (change.type === "removed") {
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
  .project{position: relative;}
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
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.85;
  position: absolute;
  width: 100%;
}
.project .edit-list{
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  content: '';
  z-index: 2;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
  transition: 0.25s;
}
.project:hover .edit-list{
  opacity: 1;
}
</style>