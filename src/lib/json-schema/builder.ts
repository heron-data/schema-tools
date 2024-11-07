import {
	PropertyBuilderState,
	schemaToPropertyState,
} from '@/lib/json-schema/state';
import { StructuredOutputSchema } from '@/lib/json-schema/types';

const INITIAL_STATE = schemaToPropertyState({
	type: 'object',
	properties: {},
});

export function createJSONSchemaBuilder(
	initialState: PropertyBuilderState = INITIAL_STATE
) {
	const listeners = new Set<() => void>();
	let state: PropertyBuilderState = initialState;

	const notify = () => listeners.forEach(listener => listener());

	return {
		subscribe: (listener: () => void) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		updateSchema: (schema: StructuredOutputSchema) => {
			state = schemaToPropertyState(schema);

			notify();
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
			notify();
		},
		removeProperty: (keys: string[]) => {
			const parentKeys = keys.slice(0, -1);
			const parentState = findPropertyByKeys(state, parentKeys);
			const key = keys[keys.length - 1];

			parentState.children = parentState.children.filter(
				child => child.key !== key
			);

			state = { ...state };
			notify();
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
						key: 'items',
						type: 'string',
						children: [],
						description: '',
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
			notify();
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
