@if(local)
package manifest

#app: {
	namespace: "sso-saml-local"
}

#subgraph: {
	tailordb:  "http://mini.tailor.tech:18002/graphql/" + #app.namespace
	pipeline:  "http://mini.tailor.tech:18004/graphql/" + #app.namespace
	stateflow: "http://mini.tailor.tech:18008/graphql/" + #app.namespace
}