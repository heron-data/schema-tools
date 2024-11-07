import {
	PropertyBuilderState,
	schemaToPropertyState,
} from '@/lib/json-schema/state';
import { StructuredOutputSchema } from '@/lib/json-schema/types';

const INITIAL_STATE = schemaToPropertyState({
	type: 'object',
	properties: {
		hello: { type: ['string', 'null'] },
		nested: {
			type: 'object',
			properties: {
				foo: { type: ['number', 'null'] },
				bar: { type: ['boolean', 'null'] },
			},
		},
	},
});

const getInitialState = () => {
	const storedState = localStorage.getItem('json-schema-builder');

	if (!storedState) {
		return INITIAL_STATE;
	}

	return JSON.parse(storedState);
};

const saveState = (state: PropertyBuilderState) => {
	localStorage.setItem('json-schema-builder', JSON.stringify(state));
};

export function createJSONSchemaBuilder() {
	const listeners = new Set<() => void>();
	let state: PropertyBuilderState = getInitialState();

	const onChange = () => {
		listeners.forEach(listener => listener());

		saveState(state);
	};

	return {
		subscribe: (listener: () => void) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		updateSchema: (schema: StructuredOutputSchema) => {
			state = schemaToPropertyState(schema);

			onChange();
		},
		getSnapshot: () => state,
		addProperty: (parent: string[], property: PropertyBuilderState) => {
			const parentState = findPropertyByKeys(state, parent);

			if (parentState.type === 'array') {
				parentState.children = [property];
			} else if (parentState.type === 'object') {
				const parentHasChildWithSameKey = parentState.children.some(
					child => child.key === property.key
				);
				if (parentHasChildWithSameKey) {
					throw new Error(`Parent already has child with key ${property.key}`);
				}

				parentState.children.push(property);
			}

			state = { ...state };
			onChange();
		},
		removeProperty: (keys: string[]) => {
			const parentKeys = keys.slice(0, -1);
			const parentState = findPropertyByKeys(state, parentKeys);
			const key = keys[keys.length - 1];

			parentState.children = parentState.children.filter(
				child => child.key !== key
			);

			state = { ...state };
			onChange();
		},
		updateProperty: (keys: string[], property: PropertyBuilderState) => {
			const parentKeys = keys.slice(0, -1);
			const parentState = findPropertyByKeys(state, parentKeys);

			const key = keys[keys.length - 1];

			const index = parentState.children.findIndex(child => child.key === key);

			if (index === -1) {
				throw new Error(`Could not find property with key ${key}`);
			}

			const oldProperty = parentState.children[index];
			const typeChanged = oldProperty.type !== property.type;
			if (typeChanged) {
				property.children = [];
			}

			const requiresChildren =
				typeChanged &&
				(property.type === 'array' || property.type === 'object');
			if (requiresChildren) {
				property.children = [
					{
						key: property.type == 'array' ? 'items' : '',
						type: 'string',
						children: [],
						isNullable: false,
					},
				];
			}

			const requiresCheckForDuplicateKey = property.key !== oldProperty.key;
			if (requiresCheckForDuplicateKey) {
				const parentHasChildWithSameKey = parentState.children.some(
					child => child.key === property.key
				);
				if (parentHasChildWithSameKey) {
					throw new Error(`Parent already has child with key ${property.key}`);
				}
			}

			parentState.children[index] = property;

			state = { ...state };
			onChange();
		},
	};
}

export function findPropertyByKeys(
	state: PropertyBuilderState,
	keys: string[]
): PropertyBuilderState {
	if (keys.length === 0) {
		return state;
	}

	const [key, ...rest] = keys;
	const child = state.children.find(child => child.key === key);

	if (!child) {
		throw new Error(`Could not find property with key ${key}`);
	}

	return findPropertyByKeys(child, rest);
}
