package common

// Types
#TypeString:   "string"
#TypeUUID:     "uuid"
#TypeInt:      "integer"
#TypeFloat:    "float"
#TypeEnum:     "enum"
#TypeBool:     "boolean"
#TypeDate:     "date"
#TypeTime:     "time"
#TypeDateTime: "datetime"

#Type:
	#TypeString | #TypeUUID | #TypeInt | #TypeFloat |
	#TypeEnum | #TypeBool | #TypeDate | #TypeTime | #TypeDateTime

#Application: "application"
#Auth:        "auth"
#TailorDB:    "tailordb"
#Pipeline:    "pipeline"
#Executor:    "executor"
#Stateflow:   "stateflow"

#SubgraphType:
	#Application | #Auth | #TailorDB | #Pipeline | #Stateflow

// Validations
#UUID:           =~"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
#IdentifierName: =~"^[0-9a-zA-Z-_]{2,}$"
#URL:            =~"^https?:\/\/\\w+(\\.\\w+)*(:[0-9]+)?.*?$"

// Constraints
#WithKind: {
	Kind: #SubgraphType | #Executor | #KindWorkspace
}

#KindWorkspace: "workspace"

#WithVersion: {
	Version: "v2"
}

#WithNamespace: {
	Namespace: string & !=""
}
