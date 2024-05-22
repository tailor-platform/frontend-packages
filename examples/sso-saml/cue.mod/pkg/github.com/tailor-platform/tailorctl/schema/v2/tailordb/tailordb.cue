package tailordb

import (
	"github.com/tailor-platform/tailorctl/schema/v2/common"
)

#TypeString:   common.#TypeString
#TypeUUID:     common.#TypeUUID
#TypeInt:      common.#TypeInt
#TypeFloat:    common.#TypeFloat
#TypeEnum:     common.#TypeEnum
#TypeBool:     common.#TypeBool
#TypeDate:     common.#TypeDate
#TypeTime:     common.#TypeTime
#TypeDateTime: common.#TypeDateTime
#TypeNested:   "nested"
#FieldType:
	#TypeString | #TypeUUID |
	#TypeInt | #TypeFloat | #TypeEnum | #TypeBool |
	#TypeDate | #TypeTime | #TypeDateTime | #TypeNested

#Expr: "expr"

#Spec: {
	common.#WithVersion
	common.#WithNamespace
	common.#WithKind

	Kind: common.#TailorDB
	Types: [...#Type]
}

#Type: {
	Name:        string & =~"^[A-Z][0-9a-zA-Z]{0,63}$"
	Description: string | *""
	Fields: {[string]: #Field}
	Settings: #TypeSetting
	Extends:  bool | *false
	Directives: [...#Directive]
	Indexes: {[string]: #Index}
	TypePermission:    #TypePermissions
	RecordPermission?: #RecordPermissions
}

#Field: {
	Type: string
	AllowedValues: [...#Value]
	Description: string | *""
	Validate: [...#Validate]
	Required:   bool | *false
	Array:      bool | *false
	Index:      bool | *false
	Unique:     bool | *false
	ForeignKey: bool | *false
	if ForeignKey {
		ForeignKeyType?:  string
		ForeignKeyField?: string
	}

	#Value: {
		Value:       string
		Description: string
	}

	Fields?: {[string]: #Field} // nested field
	SourceId?: string
	Hooks?:    #FieldHook
}

#FieldHook: {
	CreateExpr: string | *null
	UpdateExpr: string | *null
}

#TypeSetting: {
	Aggregation:           bool | *false
	BulkUpsert:            bool | *false
	DefaultQueryLimitSize: int | *100
	MaxBulkUpsertSize:     int | *1000
	PluralForm:            string & =~"^[A-Z][0-9a-zA-Z]{0,63}$" | *""
	PublishRecordEvents:   bool | *false
}

#Directive: {
	Name: string & !=""
	Args: [...{name: string, value: string}]
}

#Index: {
	FieldNames: [...string]
	Unique: bool | *false
}

#TypePermissions: {
	Create: [...#Permission] | *null
	Read: [...#Permission] | *null
	Update: [...#Permission] | *null
	Delete: [...#Permission] | *null
	Admin: [...#Permission] | *null
}

#RecordPermissions: {
	Create: [...#Permission]
	Read: [...#Permission]
	Update: [...#Permission]
	Delete: [...#Permission]
	Admin: [...#Permission]
}

#Permission: {
	Id:     string | #Everyone | #LoggedInUser | #CreatorUser
	Permit: #Permit.Unspecified | #Permit.Allow | #Permit.Skip | #Permit.Deny
}

#Everyone:     "everyone"
#LoggedInUser: "loggedinUser"
#CreatorUser:  "creatoruser"

#Permit: {
	Unspecified: "unspecified"
	Allow:       "allow"
	Skip:        "skip"
	Deny:        "deny"
}

#Validate: {
	Expr:          string
	Action:        #Permit.Unspecified | #Permit.Allow | #Permit.Skip | #Permit.Deny
	ErrorMessage?: string
}

CreatedAtField: #Field & {
	Type:        #TypeDateTime
	Description: "createdAt"
	Index:       true
	Hooks: {
		CreateExpr: "now()"
	}
}

UpdatedAtField: #Field & {
	Type:        #TypeDateTime
	Description: "updatedAt"
	Index:       true
	Hooks: {
		UpdateExpr: "now()"
	}
}
