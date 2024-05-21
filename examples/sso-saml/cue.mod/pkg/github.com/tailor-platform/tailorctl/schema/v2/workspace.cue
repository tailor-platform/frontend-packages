package v2

import (
	"github.com/tailor-platform/tailorctl/schema/v2/common"
	"github.com/tailor-platform/tailorctl/schema/v2/application"
	"github.com/tailor-platform/tailorctl/schema/v2/auth"
	"github.com/tailor-platform/tailorctl/schema/v2/pipeline"
	"github.com/tailor-platform/tailorctl/schema/v2/executor"
	"github.com/tailor-platform/tailorctl/schema/v2/stateflow"
	"github.com/tailor-platform/tailorctl/schema/v2/tailordb"
)

#Workspace: {
	common.#WithKind
	Kind: common.#KindWorkspace

	Apps: [...application.#Spec]
	Services: [...(auth.#Spec | pipeline.#Spec | executor.#Spec | stateflow.#Spec | tailordb.#Spec)]

	Auths: [for x in Services if x.Kind == common.#Auth {x}]
	Pipelines: [for x in Services if x.Kind == common.#Pipeline {x}]
	Executors: [for x in Services if x.Kind == common.#Executor {x}]
	Stateflows: [for x in Services if x.Kind == common.#Stateflow {x}]
	Tailordbs: [for x in Services if x.Kind == common.#TailorDB {x}]
}
