import JSONSchemaEditor from '@/components/json-schema-editor/JSONSchemaEditor';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<JSONSchemaEditor
			initialSchema={{
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
			}}
		/>
	);
}
