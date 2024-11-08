import {
	isArrayType,
	isBooleanType,
	isNumberType,
	isObjectType,
	isStringType,
} from '@/lib/json-schema/guards';
import {
	ArrayType,
	NumberType,
	PropertySchema,
	PropertyType,
	StringType,
} from '@/lib/json-schema/types';

export type PropertyBuilderState = {
	key: string;
	type: PropertyType;
	description?: string;
	isNullable: boolean;
	children: PropertyBuilderState[];

	// String
	enumValues?: StringType['enum'];
	format?: StringType['format'];
	minLength?: StringType['minLength'];
	maxLength?: StringType['maxLength'];

	// Number
	minimum?: NumberType['minimum'];
	maximum?: NumberType['maximum'];

	// Array
	minItems?: ArrayType['minItems'];
	maxItems?: ArrayType['maxItems'];
};

export function propertyBuilderStateToSchema(
	state: PropertyBuilderState
): PropertySchema {
	switch (state.type) {
		case 'string':
			return {
				type: state.isNullable ? ['string', 'null'] : 'string',
				enum: state.enumValues,
				format: state.format,
				minLength: state.minLength,
				maxLength: state.maxLength,
				description: state.description,
			};
		case 'number':
			return {
				type: state.isNullable ? ['number', 'null'] : 'number',
				minimum: state.minimum,
				maximum: state.maximum,
				description: state.description,
			};
		case 'integer':
			return {
				type: state.isNullable ? ['integer', 'null'] : 'integer',
				minimum: state.minimum,
				maximum: state.maximum,
				description: state.description,
			};
		case 'boolean':
			return {
				type: state.isNullable ? ['boolean', 'null'] : 'boolean',
				description: state.description,
			};
		case 'array':
			return {
				type: state.isNullable ? ['array', 'null'] : 'array',
				minItems: state.minItems,
				maxItems: state.maxItems,
				description: state.description,
				items: propertyBuilderStateToSchema(state.children[0]),
			};
		case 'object':
			return {
				type: state.isNullable ? ['object', 'null'] : 'object',
				description: state.description,
				properties: Object.fromEntries(
					state.children.map(child => [
						child.key,
						propertyBuilderStateToSchema(child),
					])
				),
			};
	}
}

export function schemaToPropertyState(
	schema: PropertySchema,
	key: string = '',
	root: boolean = true
): PropertyBuilderState {
	const type = schema.type;
	if (root && type !== 'object') {
		throw new Error('Only object schemas are supported');
	}

	const isNullable = Array.isArray(type) && type.includes('null');

	if (isObjectType(schema)) {
		if (!schema?.properties) {
			throw new Error(`Object schema ${key} has no properties`);
		}

		return {
			key,
			type: 'object',
			description: schema.description,
			isNullable,
			children: Object.entries(schema.properties).map(([key, value]) => {
				return schemaToPropertyState(value, key, false);
			}),
		};
	} else if (isArrayType(schema)) {
		return {
			key,
			type: 'array',
			description: schema.description,
			isNullable,
			children: [schemaToPropertyState(schema.items, '', false)],
		};
	} else if (isStringType(schema)) {
		return {
			key,
			type: 'string',
			description: schema.description,
			isNullable,
			enumValues: schema.enum,
			format: schema.format,
			minLength: schema.minLength,
			maxLength: schema.maxLength,
			children: [],
		};
	} else if (isNumberType(schema)) {
		return {
			key,
			type:
				schema.type === 'integer' || schema.type.includes('integer')
					? 'integer'
					: 'number',
			description: schema.description,
			isNullable,
			minimum: schema.minimum,
			maximum: schema.maximum,
			children: [],
		};
	} else if (isBooleanType(schema)) {
		return {
			key,
			type: 'boolean',
			description: schema.description,
			isNullable,
			children: [],
		};
	} else {
		throw new Error('Unsupported schema type ' + JSON.stringify(schema), {
			cause: schema,
		});
	}
}
