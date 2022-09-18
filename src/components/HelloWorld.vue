<template>
  <v-container>
    <v-row cols="auto" justify="center">
      <div class="searchGroup">
        <v-text-field label="Summoner Name" v-model="summonerName"></v-text-field>
        <v-btn-group divided rounded>
          <v-btn @click="search">Search</v-btn>
          <v-btn @click="hideGranted = !hideGranted">Toggle Granted</v-btn>
          <v-btn @click="hideNotGranted = !hideNotGranted">Toggle Not Granted</v-btn>
        </v-btn-group>
        <v-text-field v-if="hasResults" label="Champ Search" v-model="champSearch"></v-text-field>
      </div>
    </v-row>
    <v-row v-if="hasResults || hide">
      <v-col
      v-for="champion in displayedChamps"
      :key="champion.championId"
      cols="auto">
      <v-menu
        v-model="champion.menu"
        :close-on-content-click="false"
        location="end">
        <template v-slot:activator="{props}">
          <img :title="champion.championName" v-bind="props" class="champion-holder" :class="{'chest': champion.chestGranted}"  :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.championImage}`"/>
        </template>

        <v-card min-width="300">
          <div>{{champion.championName}}</div>
          <div>Champion Level: {{champion.championLevel}}</div>
          <div>Champion Points: {{champion.championPoints}}</div>
          <a target="_blank" :href="`https://u.gg/lol/champions/aram/${champion.championName?.toLowerCase().replace('/\s/g', '')}-aram`">Aram Build</a>
          <v-card-actions>
            <v-btn text @click="champion.menu = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      </v-col>
      
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {champions as staticChamps} from '../champions';

interface Champion {
  championId: number,
  championLevel: number,
  championPoints: number,
  championPointsSinceLastLevel: number,
  championPointsUntilNextLevel: number,
  chestGranted: boolean,
  lastPlayTime: number,
  summonerId: string,
  tokensEarned: number
  championName?: string;
  championImage?: string;
  menu: boolean;
}

const version = ref("12.17.1");
const champSearch = ref("");
const hide = ref(false);
let champions = ref<Champion[]>([]);
const displayedChamps = computed(() => {
  let res: Champion[] = [];
  res.push(...champions.value)
  res = champions.value
  if(champSearch && champSearch.value) {
    res = res.filter((champion) => champion.championName?.toLowerCase().includes(champSearch.value.toLowerCase()))
  }
  if (hideGranted && hideGranted.value) {
    res = res.filter((champion) => !champion.chestGranted)
  }
  if (hideNotGranted && hideNotGranted.value) {
    res = res.filter((champion)=> champion.chestGranted)
  }
  return res;
})
const summonerName = ref("");
const hasResults = ref("");
const referrer = "https://lolchestfinder.redninja.org"

let hideNotGranted = ref(false);
let hideGranted = ref(false);

onMounted(() => {
  const sn = localStorage.getItem("summonerName")
  console.log(sn);
  if (sn) {
    summonerName.value = sn;
  }
})

const search = async () => {
  localStorage.setItem("summonerName", summonerName.value);
  const summonerId = await getSummonerId();
  const masteries = await getMasteries(summonerId);
  hasResults.value = "true";
  champions.value = masteries;
}

const getSummonerId = async () => {
  const resp = await fetch(`/api/summoner/v4/summoners/by-name/${summonerName.value}`, {
    method: "GET",
    referrer
  })
  return (await resp.json()).id;
}

const getMasteries = async (summonerId: string) => {
  const resp = await fetch(`/api/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`, {
    method: "GET",
    referrer
  })
  const jsonResponse = await resp.json();
  jsonResponse.filter((champion: Champion) => champion.championName !== undefined)
  // champions.value = jsonResponse;
  
  jsonResponse.forEach((champion: Champion) => {
    champion.championName = staticChamps[champion.championId].name
    champion.championImage = staticChamps[champion.championId].image
    champion.menu = false;
  })
  
  return jsonResponse;
}
</script>

<style>

.searchGroup {
  padding-top: 20px;
  padding-bottom: 20px;
}

.champion-holder {
  width: 80px;
  height: 80px;
  /* margin-left: 6px;
  margin-right: 6px; */
  border: 2px solid;
  border-color: gold;
}

.champion-holder.chest {
  border: 2px solid;
  border-color: grey;
}
</style>
