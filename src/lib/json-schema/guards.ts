import {
	ArrayType,
	BooleanType,
	NumberType,
	ObjectType,
	PropertySchema,
	StringType,
} from '@/lib/json-schema/types';

export function isStringType(schema: PropertySchema): schema is StringType {
	return (
		schema.type === 'string' ||
		(Array.isArray(schema.type) && schema.type.includes('string' as any))
	);
}

export function isNumberType(schema: PropertySchema): schema is NumberType {
	return (
		schema.type === 'number' ||
		schema.type === 'integer' ||
		(Array.isArray(schema.type) &&
			(schema.type.includes('number' as any) ||
				schema.type.includes('integer' as any)))
	);
}

export function isBooleanType(schema: PropertySchema): schema is BooleanType {
	return (
		schema.type === 'boolean' ||
		(Array.isArray(schema.type) && schema.type.includes('boolean' as any))
	);
}

export function isArrayType(schema: PropertySchema): schema is ArrayType {
	return (
		schema.type === 'array' ||
		(Array.isArray(schema.type) && schema.type.includes('array' as any))
	);
}

export function isObjectType(schema: PropertySchema): schema is ObjectType {
	return (
		schema.type === 'object' ||
		(Array.isArray(schema.type) && schema.type.includes('object' as any))
	);
}
