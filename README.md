# Provisioning
The main objective is to provision computational resources specifically virtual machines from cloud providers using their API. I have used two cloud providers: Microsoft Azure and DigitalOcean.  

The links to the API:
Microsoft Azure: https://docs.microsoft.com/en-us/rest/api/azure/   
DigitalOcean: https://developers.digitalocean.com/documentation/v2/

The code contains the basic functions to perform the following operations automatically:  
- Create a Virtual Machine (droplet in case of Digital Ocean)
- Delete the Virtual Machine
- Display details of the Virtaul Machine
- Automatically add SSH key to the Virtual Machine for easier access
- List all the available images
- List all the regions

## Setup instructions
First you need to execute the command: ```npm install``` to install all the required packages.  
You have to set the public part of your SSH key to the environment variable SSH_KEY:  
```export SSH_KEY="yoursshkey"```  

The cloud providers that I have used are Digital Ocean and Microsoft Azure.
- ### Digital Ocean  
  You need to first get the API token and set it to environment variable named DOTOKEN:  
  ```export DOTOKEN="yourtoken"```  
  Now you can execute the ```digital_ocean.js``` file to provision a virtual machine in digital ocean:   
  ```node digital_ocean.js```  
    
- ### Microsoft Azure  
  You need to set the authorization token to environment variable named AZURE_TOKEN:  
  ```export AZURE_TOKEN="yourtoken"```  
  You also have to set your Azure subscription Id to the environment variable named AZURE_SUBSCRIPTION_ID:  
  ```export AZURE_SUBSCRIPTION_ID="yourSubscriptionId"```  
  Now you can execute the ```azure.js``` file to provision a virtual machine in azure:  
  ```node azure.js```  
