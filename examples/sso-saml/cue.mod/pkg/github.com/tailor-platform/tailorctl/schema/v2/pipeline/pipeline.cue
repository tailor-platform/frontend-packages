package pipeline

import (
	"github.com/tailor-platform/tailorctl/schema/v2/common"
	"github.com/tailor-platform/tailorctl/schema/v2/auth"
)

#Spec: {
	common.#WithKind
	common.#WithVersion
	common.#WithNamespace

	Kind:        common.#Pipeline
	Description: string | *""
	Resolvers: [...#Resolver]
}

#Resolver: {
	Name:        string & !=""
	Description: string | *""
	Inputs: [...#Field]
	Response:       #ResponseField
	OperationType?: "query" | "mutation"
	Authorization:  string & !="" & !="true" | *#AuthLoggedInUser
	PreScript?:     string
	PostScript?:    string
	Pipelines: [...#Pipeline]
	OnError?: string
}

#AuthInsecure:     "true==true"
#AuthLoggedInUser: "user != null && size(user.id) > 0"

#OperationTypeGraphql: "graphql"

#GraphqlOperation: {
	Kind:  #OperationTypeGraphql
	Url:   string | *null
	Query: string & !=""
}

#Operation: #GraphqlOperation

#Pipeline: {
	Name:        string & !=""
	Description: string | *""
	Operation?:  [
			if (Operation).Kind == #OperationTypeGraphql {#GraphqlOperation},
	][0]
	OperationType: 0 | 1 | 2 | *0

	if Operation != _|_ {
		if (Operation).Kind == #OperationTypeGraphql {
			OperationType:   1
			OperationUrl:    Operation.Url
			OperationSource: Operation.Query
		}
	}
	SkipOperationOnError: bool | *false
	Invoker:              auth.#Invoker | *null

	Test?:           string
	PreValidation?:  string
	PreScript?:      string
	PostScript?:     string
	PostValidation?: string
	ContextData?:    string
	ForEach?:        string
}

#Field: {
	Name:        string & !=""
	Description: string | *""
	Type:        #Type
	Array:       bool | *false
	Required:    bool | *false
}

#ResponseField: {
	Type:        #Type
	Description: string | *""
	Array:       bool | *false
	Required:    bool | *false
}

#Type: {
	Kind:        string | *"UserDefined"
	Name:        string & !=""
	Description: string | *""
	Required:    bool | *false
	AllowedValues?: [...#Value]
	Fields?: [...#Field]
}

#Value: {
	Value:       string & !=""
	Description: string | *""
}
