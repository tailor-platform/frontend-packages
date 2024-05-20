package application

import (
	"github.com/tailor-platform/tailorctl/schema/v2/common"
)

#Spec: {
	common.#WithKind
	common.#WithVersion

	Kind: common.#Application
	Name: string & !=""
	Cors: [...string]
	// AllowedIPAddresses is a list of IP addresses that are allowed to access the application.
	// Each entry is a string in the format "CIDR".
	// Example: ["1.1.1.1/32", "2.2.2.0/24"]
	AllowedIPAddresses: [...string]
	Auth?: #Auth
	Subgraphs: [...#Subgraph]
}

#Auth: {
	Namespace:            string & !=""
	IdProviderConfigName: string & !=""
}

#Subgraph: {
	Type: common.#SubgraphType & !=""
	Name: string & !=""
}
