import {
	ArrayType,
	BooleanType,
	NumberType,
	ObjectType,
	PropertySchema,
	StringType,
} from '@/lib/json-schema/types';

function isType(schema: PropertySchema, type: string): boolean {
	return (
		schema.type === type ||
		(Array.isArray(schema.type) &&
			[type, 'null'].every(t => schema.type.includes(t as any)))
	);
}

export function isStringType(schema: PropertySchema): schema is StringType {
	return isType(schema, 'string');
}

export function isNumberType(schema: PropertySchema): schema is NumberType {
	return isType(schema, 'number') || isType(schema, 'integer');
}

export function isBooleanType(schema: PropertySchema): schema is BooleanType {
	return isType(schema, 'boolean');
}

export function isArrayType(schema: PropertySchema): schema is ArrayType {
	return isType(schema, 'array');
}

export function isObjectType(schema: PropertySchema): schema is ObjectType {
	return isType(schema, 'object');
}
