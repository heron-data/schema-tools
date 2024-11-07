import PropertiesTreeView from '@/components/json-schema-editor/PropertiesTree';
import SchemaTextViewer from '@/components/json-schema-editor/SchemaTextViewer';
import { SchemaBuilderProvider } from '@/lib/json-schema/context';
import { schemaToPropertyState } from '@/lib/json-schema/state';
import { StructuredOutputSchema } from '@/lib/json-schema/types';

type Props = {
	initialSchema: StructuredOutputSchema;
};

export default function JSONSchemaEditor(props: Props) {
	return (
		<SchemaBuilderProvider
			initalState={schemaToPropertyState(props.initialSchema)}
		>
			<div className="grid grid-cols-2">
				<div className="m-2">
					<PropertiesTreeView />
				</div>
				<SchemaTextViewer />
			</div>
		</SchemaBuilderProvider>
	);
}
