package auth

import (
	"github.com/tailor-platform/tailorctl/schema/v2/common"
	"github.com/tailor-platform/tailorctl/schema/v2/secretmanager"
)

#Spec: {
	common.#WithKind
	common.#WithVersion
	common.#WithNamespace

	Kind: common.#Auth
	IdProviderConfigs: [...#IDProviderConfig]
	UserProfileProvider:       string & !=""
	UserProfileProviderConfig: [
					if (UserProfileProviderConfig).Kind == #UserProfileProviderType.TailorDB {#UserProfileTailorDBProviderConfig | #TailorDBProviderConfig},
	][0]
	if (UserProfileProviderConfig).Kind == #UserProfileProviderType.TailorDB {
		TailorDBProviderConfig: (UserProfileProviderConfig)
	}

	SCIMConfig: #SCIMConfig | *null

	TenantProvider:       string | *"" // allow empty string if tenant is not used
	TenantProviderConfig: [
				if (TenantProviderConfig).Kind == #TenantProviderType.TailorDB {#TenantTailorDBProviderConfig},
	][0] | *null          // allow empty string if tenant is not used
	MachineUsers: [...#MachineUser]
}

#SCIMConfig: {
	MachineUserName: string & !=""
	Authorization:   #SCIMAuthorization
	Resources: [...#SCIMResource]
}

_#SCIMAuthorizationType: #SCIMAuthorizationType.OAuth2 | #SCIMAuthorizationType.HeaderBererToken

#SCIMAuthorizationType: {
	OAuth2:           "oauth2"
	HeaderBererToken: "bearer"
}

#SCIMAuthorization: {
	Type: _#SCIMAuthorizationType & !=""
	if (Type) == #SCIMAuthorizationType.HeaderBererToken {
		BearerSecret: secretmanager.#SecretValue & !=null
	}
}

#SCIMResource: {
	Name:              string & !=""
	TailorDBNamespace: string & !=""
	TailorDBType:      string & !=""
	CoreSchema:        #SCIMSchema
	AttributeMapping: [...#SCIMAttributeMapping]
}

#SCIMSchema: {
	Name: string & !=""
	Attributes: [...#SCIMAttribute]
}

#SCIMAttributeMapping: {
	TailorDBField: string & !=""
	SCIMPath:      string & !=""
}

#SCIMAttribute: {
	Type:        _#SCIMAttributeType & !=""
	Name:        string & !=""
	Description: string | *""
	Mutability:  _#SCIMAttributeMutability | *#SCIMAttributeMutability.ReadWrite
	Required:    bool | *false
	MultiValued: bool | *false
	Uniqueness:  _#SCIMAttributeUniqueness | *#SCIMAttributeUniqueness.None
	CanonicalValues: [...string] | *null
	SubAttributes: [...#SCIMAttribute] | *null
}

_#SCIMAttributeUniqueness: #SCIMAttributeUniqueness.None | #SCIMAttributeUniqueness.Server | #SCIMAttributeUniqueness.Global

#SCIMAttributeUniqueness: {
	None:   "none"
	Server: "server"
	Global: "global"
}

_#SCIMAttributeMutability: #SCIMAttributeMutability.ReadOnly | #SCIMAttributeMutability.ReadWrite | #SCIMAttributeMutability.WriteOnly
#SCIMAttributeMutability: {
	ReadOnly:  "readOnly"
	ReadWrite: "readWrite"
	WriteOnly: "writeOnly"
}

_#SCIMAttributeType: #SCIMAttributeType.String | #SCIMAttributeType.Number | #SCIMAttributeType.Boolean | #SCIMAttributeType.DateTime | #SCIMAttributeType.Complex
#SCIMAttributeType: {
	String:   "string"
	Number:   "number"
	Boolean:  "boolean"
	DateTime: "datetime"
	Complex:  "complex"
}

#MachineUser: {
	Name: string & !=""
	Attributes: [...common.#UUID]
}

// NOTE: Invoker == MachineUser
#Invoker: {
	AuthNamespace:   string & !=""
	MachineUserName: string & !=""
}

#IDProviderConfig: {
	Name:   string & !=""
	Config: [// see. https://cuetorials.com/patterns/switch/
		if (Config).Kind == #AuthType.OIDC {#OIDC},
		if (Config).Kind == #AuthType.SAML {#SAML},
		if (Config).Kind == #AuthType.IDToken {#IDToken},
	][0]
	if (Config).Kind == #AuthType.OIDC {
		OidcConfig: (Config)
	}
	if (Config).Kind == #AuthType.SAML {
		SamlConfig: (Config)
	}
	if (Config).Kind == #AuthType.IDToken {
		IdTokenConfig: (Config)
	}
}

#AuthType: {
	OIDC:    "OIDC"
	SAML:    "SAML"
	IDToken: "IDToken"
}

#OIDC: {
	Kind:         #AuthType.OIDC
	ClientID:     string
	ClientSecret: secretmanager.#SecretValue
	ProviderURL:  string
}

#SAML: {
	Kind:         #AuthType.SAML
	MetadataURL:  string
	SpCertBase64: secretmanager.#SecretValue
	SpKeyBase64:  secretmanager.#SecretValue
}

#IDToken: {
	Kind:        #AuthType.IDToken
	ProviderURL: string
	ClientID:    string
}

#UserProfileProviderType: {
	TailorDB: "TAILORDB"
}

#UserProfileTailorDBProviderConfig: {
	Kind:          #UserProfileProviderType.TailorDB
	Namespace:     string & !=""
	Type:          string & !=""
	UsernameField: string & !=""
	TenantIdField: string | *"" // allow empty string if tenant is not used
	AttributesFields: [...string] & !=null
}

#TailorDBProviderConfig: {
	Kind:          #UserProfileProviderType.TailorDB
	Namespace:     string & !=""
	Type:          string & !=""
	UsernameField: string & !=""
	AttributesFields: [...string] & !=null
}

#TenantProviderType: {
	TailorDB: "TAILORDB"
}

#TenantTailorDBProviderConfig: {
	Kind:           #TenantProviderType.TailorDB
	Namespace:      string & !=""
	Type:           string & !=""
	SignatureField: string & !=""
}
