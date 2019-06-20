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
    
        fs.readFile(path, (err, data) => {
    
            if (err){
                console.log(err);
            }
    
            let object:Object = {};
            let d:string = data.toString();
    
            function extract(string, end, field){
                let i = d.indexOf(string);

                //Make sure the field exists
                let value = d.substring(i + string.length, d.indexOf(end, i + string.length));

                if (i == -1){
                    value = 'null';
                }

                object[field] = value;
            }
            
            extract('<City Code="', '"', 'City Code');
            extract('<Item Code="', '"', 'Item Code');
            extract('<![CDATA[', ']', 'Hotel Name');
            extract('<AddressLine1><![CDATA[', ']', 'Address Line 1');
            extract('<AddressLine2><![CDATA[', ']', 'Address Line 2');
            extract('<AddressLine3><![CDATA[', ']', 'Address Line 3');
            extract('<AddressLine4><![CDATA[', ']', 'Address Line 4');
            extract('Telephone><![CDATA[', ']', 'Telephone');
            extract('Fax><![CDATA[', ']', 'Fax');
            extract('EmailAddress>', '</Emai', 'Email');
            extract('<WebSite>', '</WebSite>', 'Website');
            extract('<StarRating>', '</StarRa', 'Star Rating');
            extract('<Latitude>', '</Latitude>', 'Latitude');
            extract('<Longitude>', '</Longitude>', 'Longitude');
            extract('<AddressLine3><![CDATA[', ']', 'City Name');
            extract('<AddressLine4><![CDATA[', ']', 'Country Name');
    
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

    for(let f of xmls){
        await readFile(f);
        console.log(`${xmls.indexOf(f) + 1}/${xmls.length}`);
    }
}

start();