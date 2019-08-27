///<reference path='./PlugshareTypes.ts'/>

const axios = require('axios');
const fs = require('fs');

const plugshareAuthHeader = `Basic ${process.env['authorization']}`;  // Fix this 
const originalRequest = `https://www.plugshare.com/api/locations/region?access=1&cost=true&count=500&exclude_networks=&latitude=38.24440738983248&longitude=-85.65517287177391&minimal=0&outlets=[{"connector":2,"power":0}]&spanLat=0.7518189885100688&spanLng=0.7509515380859375`;

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
    var requestUrl = "https://api.plugshare.com/locations/"+id+"?start=2017-01-01T00:00:00Z";
    var result = await axios.get(requestUrl);
    var data:PlugShare.Location = result.data; 
    return data; 
}

async function plugShareGetReviews(id:number) { 
    var requestUrl = "https://api.plugshare.com/locations/"+id+"/reviews"
    var result = await axios.get(requestUrl);
    return result.data; 
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

// https://stackoverflow.com/questions/11257062/converting-json-object-to-csv-format-in-javascript
function arrayToCSV(objArray:any) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    return array.reduce((str:string, next:any) => {
        str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
        return str;
       }, str);
}

async function asyncmain() { 
    // don't want to overstay my welcome with plugshare. 
    var chargers = await plugshareRegionSearch();
    await saveChargerDataToFile(chargers);

    var chargers = await readChargerDataFromFile();
    console.log("Found this many chargers: "+chargers.length);

    for(let index in chargers) { 
        let charger = chargers[index];
        console.log("getting more details about "+charger.name);
        let chargerDetail = await plugShareGetLocation(charger.id);        
        console.log("  initially "+chargerDetail.reviews.length+"/"+chargerDetail.total_reviews+" reviews");
        await delay(1000);  // be nice.     

        if (chargerDetail.reviews.length < chargerDetail.total_reviews) { 
            let reviews = await plugShareGetReviews(charger.id);
            if (reviews && reviews.length > chargerDetail.reviews.length) { 
                chargerDetail.reviews = reviews; 
                console.log("  upgraded to "+chargerDetail.reviews.length+" reviews");
            }
            await delay(1000);  // be nice. 
        }
        await saveChargerDetail(chargerDetail);
        //let chargerDetail = await readChargerDetail(charger.id);
        chargers[index] = chargerDetail; 
    }

    chargers = chargers.sort((a,b)=>(a.id - b.id));  // sort by id

    var results = [];
    var reviewsMap = []; 
    for(let charger of chargers) { 
        let openingDate = new Date(); 
        // As of recently -- does NOT return all the reviews!   Have to make another call for that. 
        if (charger.reviews.length>0) openingDate = charger.reviews[charger.reviews.length-1].created_at; 
        var isEvolve = (charger.description.search(/evolveky/i) >= 0) || 
                       (charger.description.search(/evolve ky/i) >= 0); 
        results.push({
            latitude: charger.latitude, 
            longitude: charger.longitude, 
            isEvolve: isEvolve?1:0,
            radius: isEvolve?20:10,
            openingDate: openingDate, 
            name: charger.name, 
            // description: charger.description
        });

        for(let review of charger.reviews) { 
            reviewsMap.push ({ 
                latitude: charger.latitude, 
                longitude: charger.longitude,
                chargerName: charger.name, 
                date: review.created_at,
                vehicle: review.vehicle_name,
                rating: review.rating
            });
        }
    }

    console.log("writing "+results.length+" chargers");
    var csv = arrayToCSV(results);
    fs.writeFileSync("chargers.csv", csv, 'utf8');
    // console.log(csv); 

    console.log("writing "+reviewsMap.length+" reviews");
    fs.writeFileSync("reviews.csv", arrayToCSV(reviewsMap),'utf8');
}

asyncmain()
.then(x=>console.log("Done"));
