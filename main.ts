///<reference path='./PlugshareTypes.ts'/>

const axios = require('axios');
const fs = require('fs');

const plugshareAuthHeader = `Basic ${process.env['authorization']}`;  // Fix this 
const originalRequest = `https://www.plugshare.com/api/locations/region?access=1&cost=true&count=500&exclude_networks=&latitude=38.24440738983248&longitude=-85.65517287177391&minimal=0&outlets=[{"connector":2,"power":0}]&spanLat=0.4918189885100688&spanLng=0.4909515380859375`;

const fileToLoadOrSave = 'datacache/lousville-chargers.json';
const chargerPrefix = 'datacache/charger'  // assume .json

axios.defaults.headers.common['Authorization'] = plugshareAuthHeader; 

async function plugshareRegionSearch(): Promise<Array<PlugShare.Location>> { 
    var result = await axios.get(originalRequest);
    var data : Array<PlugShare.Location> = result.data; 
    return data; 
}

async function saveChargerDataToFile(data: Array<PlugShare.Location>) { 
    fs.writeFileSync(fileToLoadOrSave, JSON.stringify(data,undefined,1),'utf8');
}

async function readChargerDataFromFile():Promise<Array<PlugShare.Location>> 
{ 
    var data:Array<PlugShare.Location> = JSON.parse(fs.readFileSync(fileToLoadOrSave,'utf8'));
    return data; 
}

async function plugShareGetLocation(id:number) :Promise<PlugShare.Location> { 
    var requestUrl = "https://api.plugshare.com/locations/"+id;
    var result = await axios.get(requestUrl);
    var data:PlugShare.Location = result.data; 
    return data; 
}

async function saveChargerDetail(chargerDetail: PlugShare.Location) { 
    var fileName = chargerPrefix + chargerDetail.id + ".json";
    fs.writeFileSync(fileName, JSON.stringify(chargerDetail,undefined,1),
        'utf8');
    return; 
}

async function readChargerDetail(id:number):Promise<PlugShare.Location> { 
    var fileName = chargerPrefix + id + ".json";
    var data = fs.readFileSync(fileName, 'utf8');
    var result:PlugShare.Location = JSON.parse(data); 
    return result; 
}

function delay(ms: number)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncmain() { 
    // don't want to overstay my welcome with plugshare. 
    // var data = await getListOfChargersFromWeb();
    // await saveChargerDataToFile(data);

    var chargers = await readChargerDataFromFile();
    console.log(chargers.length);

    for(let index in chargers) { 
        let charger = chargers[index];
        // console.log("getting more details about "+charger.name);
        // let chargerDetail = await plugShareGetLocation(charger.id);
        // await saveChargerDetail(chargerDetail);
        // await delay(1000);  // be nice. 
        var chargerDetail = await readChargerDetail(charger.id);
        chargers[index] = chargerDetail; 
    }

    chargers = chargers.sort((a,b)=>(a.id - b.id));  // sort by id

    for(let charger of chargers) { 
        if (charger.description.search(/evolveky/i) >= 0) { 
            console.log("EVOLVEKY - "+charger.name + " " + charger.description);
        }
    }
    // for(let charger of chargers) { 
    //     if (charger.cost) { 
    //         console.log("PAID - "+charger.name+" "+charger.cost_description);
    //     }
    // }
}

asyncmain()
.then(x=>console.log("Done"));
