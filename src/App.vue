<template>
  <v-app>
    <v-main>
      <HelloWorld/>
    </v-main>
    <footer class="footer">Lolchest isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</footer>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
}
</script>

<style scoped>
.footer {
  font-style: italic;
  font-size: 12px;
  padding: 0 25%;
}
</style>
