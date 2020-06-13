import {createConnection} from "typeorm"
import GeoData from "../../entity/GeoData"
import InfectionData from "../entities/Infection"
//import Settings from "../entities/Settings"

createConnection()

getGeoData('').then(geoData => {
    res(geoData)
})

static function getGeoData(blid){
    return new Promise((resolve, reject) => {
        createConnection().then(async connection => {
            let geoDataRepository = connection.getRepository(GeoData)
            let allGeoData
                if(blid === ""){
                    allGeoData = await geoDataRepository.find()
                } else {
                    allGeoData = await geoDataRepository.find({bl_id: `${blid}`})
                }
            console.log(allGeoData)
            resolve(allGeoData)
            // return allGeoData
        }).catch(error => {
            console.log("Error while executing database-query for geo-data: "+ error)
            reject("Error while executing database-query for geo-data: " + error)
        })
    })
}

static function getInfectionData(){
    createConnection().then(async connection => {
        let infectionRepository = connection.getRepository(InfectionData)

        let allInfectionData = await infectionRepository.find()
        console.log(allInfectionData)
        return allInfectionData
    }).catch(error => console.log("Error while executing database-query for infection-data: " + error))
}

static function getSettings({guid = null, hash = null} = {}){
    createConnection().then(async connection => {
        let settingsRepository = connection.getRepository(/* Settings*/)
        let selectedSettings
        if (guid !== null){
            selectedSettings = await settingsRepository.find({guid: `${guid}`})
        } else {
            selectedSettings = await settingsRepository.find({hash: `${hash}`})
        }
        console.log(selectedSettings)
        return selectedSettings
    }).catch(error => console.log("Error while executing database-query for settings-data: " + error))
}
