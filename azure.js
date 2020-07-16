const got    = require("got");
const chalk  = require('chalk');
const os     = require('os');

var config = {};
// Retrieve our api token from the environment variables.
config.token = process.env.AZURE_TOKEN;
// Subscription Id
config.subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
// Public part of SSH Key
config.sshKey = process.env.SSH_KEY;

if( !config.token )
{
	console.log(chalk`{red.bold AZURE_TOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

// Configure our headers to use our token when making REST api requests.
const headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

class AzureProvider{
    async listRegions()
	{
		let response = await got(`https://management.azure.com/subscriptions/${config.subscriptionId}/locations?api-version=2019-06-01`, { headers: headers, json:true })
							 .catch(err => console.error(`listRegions ${err}`));
							 
        if( !response ) return;
        
		if( response.body.value )
		{   
            console.log("------------------------------Regions----------------------------------")
			for( let region of response.body.value)
			{
				console.log('Name: ' + region.name)
			}
		}
    }

    async listSku(location)
	{
		let response = await got(`https://management.azure.com/subscriptions/${config.subscriptionId}/providers/Microsoft.Compute/locations/${location}/publishers/Canonical/artifacttypes/vmimage/offers/UbuntuServer/skus?api-version=2019-03-01
        `, { headers: headers, json:true })
							 .catch(err => console.error(`listSku ${err}`));
							 
        if( !response ) return;
        //console.log(response.body);
		if( response.body)
		{
            console.log("\n------------------------------Images----------------------------------\n")
			for( let sku of response.body)
			{
				console.log('Name: ' + sku.name)
			}
		}
    }

    async createVM(location, sku, publisher, offer, username)
	{
		if( location == "" || sku == "" )
		{
			console.log( chalk.red("You must provide non-empty parameters for location and sku!") );
			return;
		}

		var data = 
		{
            "location": location,
            "name": "ubuntu",
            "properties": {
              "hardwareProfile": {
                "vmSize": "Standard_DS1_v2"
              },
              "storageProfile": {
                "imageReference": {
                  "sku": sku,
                  "publisher": publisher,
                  "version": "latest",
                  "offer": offer
                },
                "osDisk": {
                  "caching": "ReadWrite",
                  "managedDisk": {
                    "storageAccountType": "Premium_LRS"
                  },
                  "name": "myVMosdisk",
                  "createOption": "FromImage"
                }
              },
              "osProfile": {
                "adminUsername": username,
                "computerName": "ubuntu",
                "linuxConfiguration": {
                  "ssh": {
                    "publicKeys": [
                      {
                        "path": "/home/" + username + "/.ssh/authorized_keys",
                        "keyData": config.sshKey
                      }
                    ]
                  },
                  "disablePasswordAuthentication": true
                }
              },
              "networkProfile": {
                "networkInterfaces": [
                  {
                    "id": `/subscriptions/${config.subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/ubuntu880`,
                    "properties": {
                      "primary": true
                    }
                  }
                ]
              }
            }
          };

		console.log("Attempting to create: "+ JSON.stringify(data) + "\n");

		let response = await got.put(`https://management.azure.com/subscriptions/${config.subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/ubuntu?api-version=2019-03-01`, 
		{
			headers:headers,
			json:true,
			body: data
		}).catch( err => 
			console.error(chalk.red(`createVM: ${err}`)) 
		);

		if( !response ) return;

		console.log(response.statusCode);
		console.log(response.body);
    }
    
    async getIp()
    {
        let response = await got(`https://management.azure.com/subscriptions/${config.subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses?api-version=2019-09-01`, { headers: headers, json:true })
							 .catch(err => console.error(`printIp ${err}`));
							 
		if( !response ) return;

        return response.body.value[0].properties.ipAddress;
    }
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  

async function provision()
{
    let client = new AzureProvider();

    // List all the available regions
    await client.listRegions();

    // List the sku of all the available images in a particular location
    var location = "eastus";
    await client.listSku(location);

    // Create the Virtual Machine
    var sku = "18.04-LTS"
    var publisher = "Canonical"
    var offer = "UbuntuServer"
    var username = "ubuntuuser"
    await client.createVM(location, sku, publisher, offer, username);

    // Get the IP address of the created Virtual Machine
    while(true)
    {
        var ip = await client.getIp();
        if(ip){
            console.log('IP Address : ' + ip);
            break;
        }
        await sleep(5000);
    }
}


(async () => {
    await provision();
})();
