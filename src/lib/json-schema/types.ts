export const STRING_FORMATS = [
	'date-time',
	'date',
	'email',
	'hostname',
	'ipv4',
	'ipv6',
	'uri',
] as const;

type StringType = {
	type: ['string', 'null'] | 'string';
	enum?: string[];
	format?: (typeof STRING_FORMATS)[number];
	minLength?: number;
	maxLength?: number;
};

type NumberType = {
	type: ['number' | 'integer', 'null'] | 'number' | 'integer';
	minimum?: number;
	maximum?: number;
};

type BooleanType = {
	type: ['boolean', 'null'] | 'boolean';
};
type ArrayType = {
	type: ['array', 'null'] | 'array';
	minItems?: number;
	maxItems?: number;
	items: PropertySchema;
};

type ObjectType = {
	type: ['object', 'null'] | 'object';
	properties: Record<string, PropertySchema>;
	additionalProperties?: boolean;
};

export { ArrayType, BooleanType, NumberType, ObjectType, StringType };
export type PropertySchema = { description?: string } & (
	| StringType
	| NumberType
	| BooleanType
	| ArrayType
	| ObjectType
);

export type StructuredOutputSchema = {
	type: 'object';
	properties: Record<string, PropertySchema>;
};

export type PropertyType = Extract<PropertySchema['type'], string>;
