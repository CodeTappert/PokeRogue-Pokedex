async function getBiomes(locations){
    footerP("Fetching biomes")
    const rawBiomes = await fetch(`https://raw.githubusercontent.com/${repo}/src/data/biomes.ts`)
    const textBiomes = await rawBiomes.text()

    const rawBiomesForms = await fetch(`https://raw.githubusercontent.com/${repo}/src/field/arena.ts`)
    const textBiomesForms = await rawBiomesForms.text()

    const conversionTable = await getBiomesFormsConverionTable(textBiomesForms)

    return regexBiomes(textBiomes, locations, conversionTable)
}

async function buildLocationsObj(){
    let locations = {}

    locations = await getBiomes(locations)

    await localStorage.setItem("locations", LZString.compressToUTF16(JSON.stringify(locations)))
    return locations
}


async function fetchLocationsObj(){
    if(!localStorage.getItem("locations")){
        window.locations = await buildLocationsObj()
    }
    else{
        window.locations = await JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("locations")))   
    }

    let counter = 0
    window.locationsTracker = []
    Object.keys(locations).forEach(zone => {
        Object.keys(locations[zone]).forEach(method => {
            Object.keys(locations[zone][method]).forEach(speciesName => {
                locationsTracker[counter] = {}
                locationsTracker[counter]["key"] = `${zone}\\${method}\\${speciesName}`
                locationsTracker[counter]["filter"] = []
                counter++
            })
        })
    })
}