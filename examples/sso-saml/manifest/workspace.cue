package config

import (
	"github.com/tailor-platform/tailorctl/schema/v2"
	"github.com/tailor-platform/tailorctl/schema/v2/application"
	"github.com/tailor-platform/tailorctl/schema/v2/common"
	"github.com/tailor-platform/tailorctl/schema/v2/tailordb"
	"github.com/tailor-platform/tailorctl/schema/v2/auth"
	"github.com/tailor-platform/tailorctl/schema/v2/secretmanager"
	"github.com/tailor-platform/frontend-package/sso-saml/manifest"
)

#app: {
	namespace: "sso-saml"
}

#subgraph: {
	tailordb:  "http://mini.tailor.tech:18002/graphql/" + #app.namespace
	pipeline:  "http://mini.tailor.tech:18004/graphql/" + #app.namespace
	stateflow: "http://mini.tailor.tech:18008/graphql/" + #app.namespace
}


User: tailordb.#Type & {
	Name:           "User"
	Description:    "user"
	TypePermission: {
		Create: [
			{Id: tailordb.#Everyone, Permit: tailordb.#Permit.Allow},
		]
		Read: [
			{Id: tailordb.#Everyone, Permit: tailordb.#Permit.Allow},
		]
		Update: [
			{Id: tailordb.#Everyone, Permit: tailordb.#Permit.Allow},
		]
		Delete: [
			{Id: tailordb.#Everyone, Permit: tailordb.#Permit.Allow},
		]
		Admin: [
			{Id: tailordb.#Everyone, Permit: tailordb.#Permit.Allow},
		]
	}
	Settings: {
		Aggregation: true
	}
	Fields: {
		name: {
			Description: "Name"
			Type:        tailordb.#TypeString
			Required:    true
		}
		emailAddress: {
			Description: "Email"
			Type:        tailordb.#TypeString
			Unique:      true
			Index:       true
			Required:    true
		}
		roles: {
			Description: "Roles"
			Type:        tailordb.#TypeUUID
			Array:       true
		}
	}
	Directives: [
		tailordb.#Directive & {
			Name: "key"
			Args: [{
				name:  "fields"
				value: "id"
			}]
		},
	]
}

db: tailordb.#Spec & {
	Namespace: "sso-saml-tailordb"
	Types: [
		User,
	]
}

a: auth.#Spec & {
	Namespace: "saml-sso"
	IdProviderConfigs:   [
	  auth.#IDProviderConfig & {
			Name: "saml"
			Config: auth.#SAML & {
				MetadataURL: "<Metadata url>"
				SpCertBase64: secretmanager.#SecretValue & {
					VaultName: "default"
					SecretKey: "saml-cert"
				}
				SpKeyBase64: secretmanager.#SecretValue & {
					VaultName: "default"
					SecretKey: "saml-key"
				}
			}
		}
	]
	UserProfileProvider: auth.#UserProfileProviderType.TailorDB
	UserProfileProviderConfig: auth.#TailorDBProviderConfig & {
		Namespace:     db.Namespace
		Type:          User.Name
		UsernameField: "emailAddress"
		AttributesFields: ["roles"]
	}
}

v2.#Workspace & {
	Apps: [
		application.#Spec & {
			Name: manifest.#app.namespace
			Cors: [
				"http://localhost:3000",
				"http://localhost:3030",
			]
			Auth: application.#Auth & {
				Namespace:            "saml-sso"
				IdProviderConfigName: "saml"
			}
			Subgraphs: [
				{Type: common.#TailorDB, Name: db.Namespace},
			]
		},
	]
	Services: [db, a]
}
