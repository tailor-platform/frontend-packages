package pipeline

// ScalarType
#ScalarType: #Type & {
	Kind: "ScalarType"
}
#CustomScalarType: #Type & {
	Kind: "CustomScalarType"
}

// EnumType
#EnumValue: #Value & {
	Value: string & =~"^[A-Za-z_][A-Za-z0-9_]*$" & !=""
}
#EnumType: #Type & {
	Kind: "EnumType"
	AllowedValues: [...#EnumValue]
}

#Required: #Type & {
	Required: true
}

// Scalar
String: #ScalarType & {
	Name: "String"
}
Int: #ScalarType & {
	Name: "Int"
}
Float: #ScalarType & {
	Name: "Float"
}
Boolean: #ScalarType & {
	Name: "Boolean"
}
ID: #ScalarType & {
	Name: "ID"
}

// Custom Scalar
Date: #CustomScalarType & {
	Name: "Date"
}
DateTime: #CustomScalarType & {
	Name: "DateTime"
}
Time: #CustomScalarType & {
	Name: "Time"
}

// Filter
StringFilter: {
	Kind: "FilterType"
	Name: "StringFilter"
	Fields: [
		{Name: "eq", Type:       String},
		{Name: "ne", Type:       String},
		{Name: "in", Type:       String, Array: true},
		{Name: "nin", Type:      String, Array: true},
		{Name: "contains", Type: String},
		{Name: "regex", Type:    String},
	]
}

DateFilter: {
	Kind: "FilterType"
	Name: "DateFilter"
	Fields: [
		{Name: "lt", Type:      Date},
		{Name: "in", Type:      Date, Array: true},
		{Name: "eq", Type:      Date},
		{Name: "gt", Type:      Date},
		{Name: "ne", Type:      Date},
		{Name: "nin", Type:     Date, Array: true},
		{Name: "between", Type: DateBetweenFilter},
		{Name: "gte", Type:     Date},
		{Name: "lte", Type:     Date},
	]
}

DateBetweenFilter: {
	Kind: "FilterType"
	Name: "DateBetweenFilter"
	Fields: [
		{Name: "max", Type: Date},
		{Name: "min", Type: Date},
	]
}
