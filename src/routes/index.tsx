import JSONSchemaEditor from '@/components/json-schema-editor/JSONSchemaEditor';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: HomeComponent,
});

function HomeComponent() {
	return <JSONSchemaEditor />;
}
