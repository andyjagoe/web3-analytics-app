import { Reader } from '@maxmind/geoip2-node'
import path from 'path'

const cityFilePath = path.join(process.cwd(), "lib", "geo", "GeoLite2-City.mmdb")
const asnFilePath = path.join(process.cwd(), "lib", "geo", "GeoLite2-ASN.mmdb")
const cityDB = await Reader.open(cityFilePath)
const asnDB = await Reader.open(asnFilePath)

export default async function handler(req, res) {
    const { ipAddress } = req.query
    if (ipAddress === undefined || ipAddress === '') return res.status(400).end()

    if (req.method === 'GET') {
        try {
            const cityRes = cityDB.city(ipAddress)
            const asnRes = asnDB.asn(ipAddress)

            let geoRes = {}
            
            if (cityRes?.continent) geoRes.continent = {}
            if (cityRes?.continent?.code) geoRes.continent.code = cityRes.continent.code
            if (cityRes?.continent?.geonameId) geoRes.continent.geonameId = cityRes.continent.geonameId
            if (cityRes?.continent?.names?.en) geoRes.continent.name = cityRes.continent.names.en

            if (cityRes?.country) geoRes.country = {}
            if (cityRes?.country?.isoCode) geoRes.country.isoCode = cityRes.country.isoCode
            if (cityRes?.country?.geonameId) geoRes.country.geonameId = cityRes.country.geonameId
            if (cityRes?.country?.names?.en) geoRes.country.name = cityRes.country.names.en

            if (cityRes?.registeredCountry) geoRes.registeredCountry = {}
            if (cityRes?.registeredCountry?.isoCode) geoRes.registeredCountry.isoCode = cityRes.registeredCountry.isoCode
            if (cityRes?.registeredCountry?.geonameId) geoRes.registeredCountry.geonameId = cityRes.registeredCountry.geonameId
            if (cityRes?.registeredCountry?.names?.en) geoRes.registeredCountry.name = cityRes.registeredCountry.names.en

            if (cityRes?.traits) geoRes.traits = {}
            if (cityRes?.traits?.hasOwnProperty('isAnonymous')) geoRes.traits.isAnonymous 
                = cityRes.traits.isAnonymous
            if (cityRes?.traits?.hasOwnProperty('isAnonymousProxy')) geoRes.traits.isAnonymousProxy 
                = cityRes.traits.isAnonymousProxy
            if (cityRes?.traits?.hasOwnProperty('isAnonymousVpn')) geoRes.traits.isAnonymousVpn 
                = cityRes.traits.isAnonymousVpn
            if (cityRes?.traits?.hasOwnProperty('isHostingProvider')) geoRes.traits.isHostingProvider 
                = cityRes.traits.isHostingProvider
            if (cityRes?.traits?.hasOwnProperty('isLegitimateProxy')) geoRes.traits.isLegitimateProxy 
                = cityRes.traits.isLegitimateProxy
            if (cityRes?.traits?.hasOwnProperty('isPublicProxy')) geoRes.traits.isPublicProxy 
                = cityRes.traits.isPublicProxy
            if (cityRes?.traits?.hasOwnProperty('isResidentialProxy')) geoRes.traits.isResidentialProxy 
                = cityRes.traits.isResidentialProxy
            if (cityRes?.traits?.hasOwnProperty('isSatelliteProvider')) geoRes.traits.isSatelliteProvider 
                = cityRes.traits.isSatelliteProvider
            if (cityRes?.traits?.hasOwnProperty('isTorExitNode')) geoRes.traits.isTorExitNode 
                = cityRes.traits.isTorExitNode

            if (cityRes?.city) geoRes.city = {}
            if (cityRes?.city?.geonameId) geoRes.city.geonameId = cityRes.city.geonameId
            if (cityRes?.city?.names?.en) geoRes.city.name = cityRes.city.names.en

            if (cityRes?.location) geoRes.location = {}
            if (cityRes?.location?.accuracyRadius) geoRes.location.accuracyRadius 
                = cityRes.location.accuracyRadius
            if (cityRes?.location?.latitude) geoRes.location.latitude 
                = cityRes.location.latitude
            if (cityRes?.location?.longitude) geoRes.location.longitude 
                = cityRes.location.longitude
            if (cityRes?.location?.metroCode) geoRes.location.metroCode 
                = cityRes.location.metroCode
            if (cityRes?.location?.timeZone) geoRes.location.timeZone 
                = cityRes.location.timeZone

            if (cityRes?.postal) geoRes.postal = {}
            if (cityRes?.postal?.code) geoRes.postal = cityRes.postal.code

            if (cityRes?.subdivisions?.length > 0) {
                geoRes.subdivision = {}
                if (cityRes?.subdivisions[0].geonameId) geoRes.subdivision.geonameId 
                    = cityRes.subdivisions[0].geonameId
                if (cityRes?.subdivisions[0].isoCode) geoRes.subdivision.isoCode 
                    = cityRes.subdivisions[0].isoCode
                if (cityRes?.subdivisions[0].names?.en) geoRes.subdivision.name 
                    = cityRes.subdivisions[0].names.en    
            }

            if (asnRes?.autonomousSystemNumber) geoRes.autonomousSystemNumber 
                = asnRes.autonomousSystemNumber
            if (asnRes?.autonomousSystemOrganization) geoRes.autonomousSystemOrganization 
                = asnRes.autonomousSystemOrganization


            res.status(200).json(geoRes)    
        } catch (error) {
            console.log(error)
            if (error.name === 'ValueError' || error.name === 'AddressNotFoundError') {
                return res.status(400).send(error.message)
            }
            return res.status(500).end()
        }
        
        return res.end()
    }        

    
    res.end()
}