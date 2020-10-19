# CiboChain

This is a Proof of Concept of Product Supply Chain & Tracking based on Hyperledger Fabric for the HackOlympics MTX Blockchain Hackathon 2020 by Team CiboChain

# Problem Scenario

Because of the perishable nature of products and limited shelf life, Perishable food supply chains (PFSCs) are characterized with rising food quality and safety concerns, alarming food wastages and losses, and poor economic sustainability. Examples of perishable goods include fast food, meat, vegetable, fruit, medicine etc. 

Inspiration & References:
- The need of Transparency in Perishable Goods : https://brandequity.economictimes.indiatimes.com/news/business-of-brands/retailers-get-cautious-about-expiry-date-of-food-products/47783042
- Perishable Inventory Challenge: https://link.springer.com/chapter/10.1007/978-3-642-40361-3_85

# Our Approach

Our approach tries to eliminate the hiccups in the supply chain of perishable goods that exist in the trade industry by using new blockchain technology, Immutable tracking of the origin and ownership of products. A permissioned blockchain network contribute in increasing trust among people who are involved in the common lane of business and trade with the product stature and expiry lane. 

## Features:
 - Listing of Product 
 - Trading of Product
 - Reliability
 - Expiry Date Timestamp

# Technical Stack

1) Hyperledger Fabric
2) NodeJS
3) MongoDB
4) AngularJS

  
# How to Run? 

## Running it from Cloud

### Run:
   To Be Updated
   
## Running it Locally  

### Run:  
  Navigate to crypto-cibochain folder using `cd` command:
  ```
  cd crypto-cibochain
  ```
  Start the blockchain network:
  ```
  ./startcibochain.sh
  ```
  Start the web server:
  ```
  ./startServer.sh
  ```
  From the new terminal we will register admin user by Navigating again to the crypto-cibochain folder.
  ```
  ./registerAdmin.sh
  ```
  Open the browser. Go to the page:
  ```
  localhost:8000
  ```
  
  Login with username: adminuser and password: adminuser to be able to add new users into the network.

# Team
- Abdhul Ahadh - IIT Madras (CH17B032)
- Gaurangi Singh - IIT Madras (AE17B026)
- Nikhil P - IIT Madras (AE17B034)
- Tapish Garg - IIT Madras (MM17B034)

# References
- Hyperledger Fabric Samples: https://github.com/hyperledger/fabric
- Fabric Supply Chain Project: https://github.com/theDweeb/Fabric-Supply-Chain
- Understanding Hyperledger Fabric: https://blog.clairvoyantsoft.com/hyperledger-fabric-components-and-architecture-b874b36c4af5
