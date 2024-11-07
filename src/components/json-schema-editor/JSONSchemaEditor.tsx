import PropertiesTreeView from '@/components/json-schema-editor/PropertiesTree';
import SchemaTextViewer from '@/components/json-schema-editor/SchemaTextViewer';
import { SchemaBuilderProvider } from '@/lib/json-schema/context';

export default function JSONSchemaEditor() {
	return (
		<SchemaBuilderProvider>
			<div className="grid grid-cols-2 max-h-screen overflow-hidden">
				<div className="h-screen overflow-y-auto pb-5">
					<PropertiesTreeView />
				</div>
				<SchemaTextViewer />
			</div>
		</SchemaBuilderProvider>
	);
}
