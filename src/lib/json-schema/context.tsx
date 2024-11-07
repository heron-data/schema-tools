import {
	createJSONSchemaBuilder,
	findPropertyByKeys,
} from '@/lib/json-schema/builder';
import {
	PropertyBuilderState,
	propertyBuilderStateToSchema,
} from '@/lib/json-schema/state';
import {
	createContext,
	useContext,
	useState,
	useSyncExternalStore,
} from 'react';

const SchemaBuilderContext = createContext<
	ReturnType<typeof createJSONSchemaBuilder>
>(null!);

export function SchemaBuilderProvider(props: {
	children: React.ReactNode;
	initalState?: PropertyBuilderState;
}) {
	const [builder, _] = useState(() =>
		createJSONSchemaBuilder(props.initalState ?? undefined)
	);

	return (
		<SchemaBuilderContext.Provider value={builder}>
			{props.children}
		</SchemaBuilderContext.Provider>
	);
}

export const useSchemaBuilderContext = () => {
	const builder = useContext(SchemaBuilderContext);

	if (!builder) {
		throw new Error(
			'useSchemaBuilderContext must be used within a SchemaBuilderProvider'
		);
	}

	return builder;
};

export const useSchemaBuilderState = () => {
	const builder = useSchemaBuilderContext();
	return useSyncExternalStore(builder.subscribe, builder.getSnapshot);
};

export const useSchemaBuilderCurrentSchema = () => {
	const builder = useSchemaBuilderContext();
	const state = useSyncExternalStore(builder.subscribe, builder.getSnapshot);

	return propertyBuilderStateToSchema(state);
};

export const useSchemaBuilderProperty = (keys: string[]) => {
	const builder = useSchemaBuilderContext();
	const state = useSyncExternalStore(builder.subscribe, builder.getSnapshot);

	return findPropertyByKeys(state, keys);
};
