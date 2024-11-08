import HeronLogo from '@/components/HeronLogo';
import PropertiesTreeView from '@/components/json-schema-editor/PropertiesTree';
import ResetSchemaButton from '@/components/json-schema-editor/ResetButton';
import SchemaTextViewer from '@/components/json-schema-editor/SchemaTextViewer';
import { SchemaBuilderProvider } from '@/lib/json-schema/context';

export default function JSONSchemaEditor() {
	return (
		<SchemaBuilderProvider>
			<div className="grid grid-cols-2 max-h-screen  h-[calc(100vh-48px)]">
				<div>
					<Header />
					<div className="h-[calc(100vh-48px)] overflow-y-auto pb-5">
						<PropertiesTreeView />
					</div>
				</div>
				<SchemaTextViewer />
			</div>
		</SchemaBuilderProvider>
	);
}

function Header() {
	return (
		<div className="mx-4 flex justify-between items-center">
			<div className="flex items-center gap-2">
				<h2 className="text-xl font-semibold text-primary">schematools</h2> by
				<HeronLogo />
			</div>
			<ResetSchemaButton />
		</div>
	);
}
