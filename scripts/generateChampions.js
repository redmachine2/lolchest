import fetch from 'node-fetch';
import fs from 'fs';
const version = "12.17.1";
const url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
const resp = await fetch(url);
const json = (await resp.json()).data;
let obj = {}
for (let champion in json) {
    console.log(champion);
    const {key, id} = json[champion];
    obj[key] = {name: champion, image: json[champion].image?.full || null}
}
fs.writeFileSync('champions.json', JSON.stringify(obj));