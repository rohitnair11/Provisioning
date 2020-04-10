# Provisioning
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
