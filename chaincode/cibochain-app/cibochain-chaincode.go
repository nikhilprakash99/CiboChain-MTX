// SPDX-License-Identifier: Apache-2.0

/*
 This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go
 */

package main

/* Imports  
* 4 utility libraries for handling bytes, reading and writing JSON, 
formatting, and string manipulation  
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts  
*/ 
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

//cibochain struct definition
type cibochain struct {
	//id se ne upisuje
	Name string `json:"name"`
	Owner string `json:"owner"`
	Animal string `json:"animal"`
	Location  string `json:"location"`
	Quantity string `json:"quantity"`
	ProductionDate string `json:"production_date"`
	ExpirationDate string `json:"expiration_date"`
	
}

//Init method definition
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

//Invoke method definition
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()
	if function == "initLedgerFirst" {
		return s.initLedgerFirst(APIstub)
	} else if function == "initLedgerSecond" {
		return s.initLedgerSecond(APIstub)
	} else if function == "recordcibochain" {
		return s.recordcibochain(APIstub, args)
	} else if function == "queryAllcibochain" {
		return s.queryAllcibochain(APIstub)
	} else if function == "changecibochainOwner" {
		return s.changecibochainOwner(APIstub, args)
	} else if function == "deletecibochain" {
		return s.deletecibochain(APIstub, args)
	} else if function == "changecibochainQuantity" {
		return s.changecibochainQuantity(APIstub, args)
	}
	return shim.Error("Invalid Smart Contract function name.")
}

//initLedgerFirst method deifinition
func (s *SmartContract) initLedgerFirst(APIstub shim.ChaincodeStubInterface) sc.Response {
	var cibochain = cibochain{Name: "cibochain1", Owner: "majra", Animal: "Sheep", Location: "Vlasic", Quantity: "340", ProductionDate: "05.10.2018. 10:55 am", ExpirationDate: "15.10.2019. 10:55 am"}

	cibochainAsBytes, _ := json.Marshal(cibochain)
	APIstub.PutState(strconv.Itoa(1), cibochainAsBytes)
	fmt.Println("Added", cibochain)

	return shim.Success(nil)
}


//initLedgerSecond method deifinition
func (s *SmartContract) initLedgerSecond(APIstub shim.ChaincodeStubInterface) sc.Response {
	var cibochain = cibochain{Name: "cibochain2", Owner: "daca", Animal: "Cow", Location: "Trebinje", Quantity: "540", ProductionDate: "06.10.2018. 10:56 pm", ExpirationDate: "16.10.2019. 10:56 pm" }

	cibochainAsBytes, _ := json.Marshal(cibochain)
	APIstub.PutState(strconv.Itoa(2), cibochainAsBytes)
	fmt.Println("Added", cibochain)
	
	return shim.Success(nil)
}


//queryAllcibochain method definition
func (s *SmartContract) queryAllcibochain(APIstub shim.ChaincodeStubInterface) sc.Response {
	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllcibochain:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

//recordcibochain method definition
func (s *SmartContract) recordcibochain(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 8")
	}

	var cibochain = cibochain{ Name: args[1], Owner: args[2], Animal: args[3], Location: args[4], Quantity: args[5], ProductionDate: args[6], ExpirationDate: args[7] }
	cibochainAsBytes, _ := json.Marshal(cibochain)
	err := APIstub.PutState(args[0], cibochainAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record tuna catch: %s", args[0]))
	}
	fmt.Printf("- recordcibochain:\n%s\n", cibochain)
	return shim.Success(nil)
}

//changecibochainOwner method definition
func (s *SmartContract) changecibochainOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	cibochainAsBytes, _ := APIstub.GetState(args[0])
	if cibochainAsBytes == nil {
		return shim.Error("Could not locate cibochain")
	}
	cibochain := cibochain{}

	json.Unmarshal(cibochainAsBytes, &cibochain)
	cibochain.Owner = args[1]

	cibochainAsBytes, _ = json.Marshal(cibochain)
	err := APIstub.PutState(args[0], cibochainAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change cibochain owner: %s", args[0]))
	}
	fmt.Printf("-changecibochainOwner:\n")
	return shim.Success(nil)
}

//changecibochainQuantity method definition
func (s *SmartContract) changecibochainQuantity(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	cibochainAsBytes, _ := APIstub.GetState(args[0])
	if cibochainAsBytes == nil {
		return shim.Error("Could not locate cibochain")
	}
	cibochain := cibochain{}

	json.Unmarshal(cibochainAsBytes, &cibochain)
	cibochain.Quantity = args[1]

	cibochainAsBytes, _ = json.Marshal(cibochain)
	err := APIstub.PutState(args[0], cibochainAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change cibochain quantity: %s", args[0]))
	}
	fmt.Printf("- changecibochainQuantity:\n")
	return shim.Success(nil)
}

//deletecibochain method definition
func (s *SmartContract) deletecibochain(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 8")
	}

	err := APIstub.DelState(args[0])
	if (err != nil) {
		return shim.Error(fmt.Sprintf("Failed to delete cibochain: %s", args[0]))
	}
	
	eventPayload := "cibochain with ID " + args[0] + " whose owner is " + args[2] + " was deleted because it has expired on date " + args[7]
	payloadAsBytes := []byte(eventPayload)
	eventErr := APIstub.SetEvent("deleteEvent",payloadAsBytes)
	if (eventErr != nil) {
		return shim.Error(fmt.Sprintf("Failed to emit event"))
	}
	fmt.Printf("- deletecibochain:\n%s\n", args[0])
	return shim.Success(nil);
}

/*
/*
 * main function *
calls the Start function 
The main function starts the chaincode in the container during instantiation.
 */
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
