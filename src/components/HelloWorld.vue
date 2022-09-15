<template>
  <v-container>
    <div class="searchGroup">
      <v-text-field label="Summoner Name" v-model="summonerName"></v-text-field>
      <v-btn-group>
        <v-btn @click="search">Search</v-btn>
        <v-btn @click="hideGranted = !hideGranted">Hide Granted</v-btn>
        <v-btn @click="hideNotGranted = !hideNotGranted">Hide Not Granted</v-btn>
    </v-btn-group>
    </div>
    <v-row v-if="hasResults">
      <v-col
      v-for="champion in displayedChamps"
      :key="champion.championId"
      cols="auto">
      <v-img class="champion-holder" :class="{'chest': champion.chestGranted}" :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.championImage}`"></v-img>
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
}

const version = ref("12.17.1");
let champions = ref<Champion[]>([]);
const displayedChamps = computed(() => {
  let res: Champion[] = [];
  res.push(...champions.value)
  console.log(res);
  if (hideGranted.value) {
    res = res.filter((champion) => !champion.chestGranted)
  }
  if (hideNotGranted.value) {
    res = res.filter((champion)=> champion.chestGranted)
  }
  return res;
})
const summonerName = ref("");
const hasResults = ref("");
const referrer = "https://lolchestfinder.redninja.org"

let hideNotGranted = ref(false);
let hideGranted = ref(false);

const search = async () => {
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
  jsonResponse.filter((champion) => champion.championName !== undefined)
  // champions.value = jsonResponse;
  
  jsonResponse.forEach((champion) => {
    champion.championName = staticChamps[champion.championId].name
    champion.championImage = staticChamps[champion.championId].image
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
