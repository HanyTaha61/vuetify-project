<template>
  <div id="popup">
      <div class="text-center my-5">
    <v-dialog width="500" v-model="dialog" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text outlined class="grey" dark v-bind="attrs" v-on="on" >create new project</v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 text-uppercase grey lighten-2">
          <div class="w-fit mx-auto">create a new project</div>
        </v-card-title>

        <v-card-text>
            <v-form ref="form">
              <v-text-field :rules="rules" label="project title" v-model="title" prepend-icon="mdi-folder"></v-text-field>
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
          <v-btn :loading='loading' class="grey lighten-2 text--darken-4" color="grey" outlined @click="dialog=false" >Cancel</v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>
  </div>
  </div>
</template>

<script>
import db from '../firebase';
import { collection, addDoc } from "firebase/firestore";

export default {
    data(){
        return{
            title: '',
            content: '',
            due: null,
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            menu: false,
            allowedSpace: false,
            min: 5,
            max: 10,
            loading: false,
            dialog: false
        }
    },
    methods:{
        submit(){
            if(this.$refs.form.validate()){ 
              this.loading = true  
                addDoc(collection(db, "Projects"), {
                    title: this.title,
                    content: this.content,
                    status: 'ongoing',
                    person: 'Hany Taha',
                    due: this.due
                }).then(()=>{
                  this.loading = false
                  this.dialog = false
                  console.log("Project added successfully!! :)")
                  this.title = '',
                    this.content = '',
                    this.status = '',
                    this.person = '',
                    this.due = ''
                });
            }
                  this.$emit('projectAdded')
        }
    },
    computed:{
        rules () {
            const rulesArray = []

            // max chars rule
            // --------------

            // var maxChars =
            //     v => (v || '').length <= this.max || `A maximum of ${this.max} characters is allowed`
            // rulesArray.push(maxChars)

            // no spaces allowed rule
            // ----------------------
            
            
            // var noSpaces = 
            // v => v.indexOf(' ') < 0 || ' No spaces allowed!!'
            // rulesArray.push(noSpaces)


            // min chars rule
            // --------------
            var minChars = 
            v => v.length > this.min || `a minimum of ${this.min} chars allowed`
            rulesArray.push(minChars)

            return rulesArray
        }
    }
}
</script>

<style>

</style>