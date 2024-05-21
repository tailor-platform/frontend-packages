package executor

import (
	"github.com/tailor-platform/tailorctl/schema/v2/auth"
	"github.com/tailor-platform/tailorctl/schema/v2/common"
	"github.com/tailor-platform/tailorctl/schema/v2/secretmanager"
)

#Spec: {
	common.#WithKind
	common.#WithVersion

	Kind: common.#Executor
	Executors: [...#Executor]
}

#Executor: {
	Name:        string & !=""
	Description: string | *""
	Trigger:     [
			if (Trigger).Kind == #TriggerTypeSchedule {#TriggerSchedule},
			if (Trigger).Kind == #TriggerTypeEvent {#TriggerEvent},
			if (Trigger).Kind == #TriggerTypeIncomingWebhook {#TriggerIncomingWebhook},
	][0]
	if (Trigger).Kind == #TriggerTypeSchedule {
		TriggerSchedule: (Trigger)
	}
	if (Trigger).Kind == #TriggerTypeEvent {
		TriggerEvent: (Trigger)
	}
	if (Trigger).Kind == #TriggerTypeIncomingWebhook {
		TriggerIncomingWebhook: (Trigger)
	}
	Target: [
		if (Target).Kind == #TargetTypeWebhook {#TargetWebhook},
		if (Target).Kind == #TargetTypeTailorGraphql {#TargetTailorGraphql},
	][0]
	if (Target).Kind == #TargetTypeWebhook {
		TargetWebhook: (Target)
	}
	if (Target).Kind == #TargetTypeTailorGraphql {
		TargetTailorGraphql: (Target)
	}
}

#TriggerTypeSchedule: "Schedule"
#TriggerSchedule: {
	Kind:      #TriggerTypeSchedule
	Timezone:  string & !=""
	Frequency: string & !=""
}

#TriggerTypeEvent: "Event"
#TriggerEvent: {
	Kind:      #TriggerTypeEvent
	EventType: string & !=""
	Condition: string | *"true"
}

#TriggerTypeIncomingWebhook: "IncomingWebhook"
#TriggerIncomingWebhook: {
	Kind: #TriggerTypeIncomingWebhook
}

#TargetTypeWebhook: "Webhook"
#TargetWebhook: {
	Kind: #TargetTypeWebhook
	URL:  string & !=""
	Headers?: [...#TargetWebhookHeader]
	Body?:   string & !=""
	Secret?: secretmanager.#SecretValue
}

#TargetWebhookHeader: {
	Key:   string & !=""
	Value: string & !="" | secretmanager.#SecretValue
	if (Value & string) != _|_ {
		RawValue: Value
	}
	if (Value & secretmanager.#SecretValue) != _|_ {
		SecretValue: Value
	}
}

#TargetTypeTailorGraphql: "TailorGraphql"
#TargetTailorGraphql: {
	Kind:      #TargetTypeTailorGraphql
	AppName:   string & !=""
	Query:     string & !=""
	Variables: string | *"{}"
	Invoker?:  auth.#Invoker
}
