package manifest

#app: {
	namespace: string
}

#subgraph: {
	tailordb:  string | *("https://tailordb/graphql/" + #app.namespace)
	pipeline:  string | *("https://pipeline/graphql/" + #app.namespace)
	stateflow: string | *("https://stateflow/graphql/" + #app.namespace)
}
