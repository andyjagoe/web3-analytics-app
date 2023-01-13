const fs = require('fs')
const path = require('path')
const decompress = require('decompress');
const { loadEnvConfig } = require('@next/env')
const env = loadEnvConfig(process.cwd())
const axios = require('axios')

function downloadFile(reqUrl, fileName){
    axios({
        method: "GET",
        url: reqUrl,
        responseType: "stream",
        decompress: true
    }).then(res => {
        if (res.status == 200) {            
            const SUB_FOLDER = '../lib/geo';
            const dir = path.resolve(__dirname, SUB_FOLDER)
            const filePath = path.resolve(__dirname, SUB_FOLDER, fileName)

            res.data.pipe(fs.createWriteStream(filePath));
            res.data.on("end", () => {
                console.log("download completed");
                decompress(filePath, dir).then(files => {
                    console.log('decompress done!');
                    
                    // delete the tar.gz file
                    fs.rmSync(filePath, { recursive: true })

                    // find path to mmdb file
                    const result = files.find(obj => {
                        return obj.path.slice(-5) === '.mmdb'
                    })

                    // move the mmdb file
                    const oldPath = path.resolve(dir, result.path)
                    fs.rename(oldPath, filePath, (err => {
                        if (err) console.log(err);
                    }));

                    // delete decompressed directory
                    fs.rmSync(path.resolve(dir, files[0].path), { recursive: true })
                });
            });
        } else {
            console.log(`ERROR >> ${res.status}`);
        }
    }).catch(err => {
        console.log("Error ",err);
    });
}

console.log("Downloading maxmind DB files")
    
downloadFile(
    `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN&license_key=${env.combinedEnv.MAXMIND_KEY}&suffix=tar.gz`, 
    "GeoLite2-ASN.mmdb"    
)

downloadFile(
    `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${env.combinedEnv.MAXMIND_KEY}&suffix=tar.gz`, 
    "GeoLite2-City.mmdb"    
)
