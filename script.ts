//Requires
const fs = require('fs');

//Variables
const folder = `${__dirname}/xmls/`;

//Add the .xml files to the 'files' array
function getFileNames(){
    return new Promise<string[]>(async resolve => {

        let xmls:string[] = [];

        fs.readdir(folder, (err, files) => {
            if (err){
                console.log(err);
            }

            files.forEach(file => {
                xmls.push(file);
            });

            resolve(xmls);
        });
    });
}

//Reads an XML file, and returns an object that contains all the relevant data about it
function readFile(filename){
    return new Promise(resolve => {
        let path = `${folder}${filename}`;
    
        fs.readFile(path, async (err, data) => {
    
            if (err){
                console.log(err);
            }
    
            let object:Object = {};
            let d:string = data.toString();
    
            function extract(string, end, field){

                return new Promise(resolve => {
                    let i = d.indexOf(string);

                    //Make sure the field exists
                    let value = d.substring(i + string.length, d.indexOf(end, i + string.length));
    
                    if (i == -1){
                        value = 'null';
                    }
    
                    object[field] = value;
                    resolve();
                })
                
            }
            
            await extract('<City Code="', '"', 'City Code');
            await extract('<Item Code="', '"', 'Item Code');
            await extract(`<Item Code="${object['Item Code']}"><![CDATA[`, ']', 'Hotel Name');
            await extract('<AddressLine1><![CDATA[', ']', 'Address Line 1');
            await extract('<AddressLine2><![CDATA[', ']', 'Address Line 2');
            await extract('<AddressLine3><![CDATA[', ']', 'Address Line 3');
            await extract('<AddressLine4><![CDATA[', ']', 'Address Line 4');
            await extract('Telephone><![CDATA[', ']', 'Telephone');
            await extract('Fax><![CDATA[', ']', 'Fax');
            await extract('EmailAddress>', '</Emai', 'Email');
            await extract('<WebSite>', '</WebSite>', 'Website');
            await extract('<StarRating>', '</StarRa', 'Star Rating');
            await extract('<Latitude>', '</Latitude>', 'Latitude');
            await extract('<Longitude>', '</Longitude>', 'Longitude');
            await extract('<AddressLine3><![CDATA[', ']', 'City Name');
            await extract('<AddressLine4><![CDATA[', ']', 'Country Name');
    
            //Print to data.txt
            for (let key of Object.keys(object)){
                fs.appendFileSync('data.txt', `${object[key]}|`);
            }

            //Print a new line at the end of every xml file
            fs.appendFileSync('data.txt', `\n`);
            resolve();
        });
    });
}

async function start(){
    let xmls = await getFileNames();
    let percentage = 0;

    for(let f of xmls){
        await readFile(f);
        let currPercentage = Math.floor((xmls.indexOf(f) + 1) / xmls.length * 100);
        
        if (currPercentage > percentage){
            percentage = currPercentage;
            console.clear();
            console.log(percentage + '%');
        }
    }
}

start();