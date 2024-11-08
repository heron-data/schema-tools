import {
	useSchemaBuilderContext,
	useSchemaBuilderCurrentSchema,
} from '@/lib/json-schema/context';
import { schemaToPropertyState } from '@/lib/json-schema/state';

import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import { useRef } from 'react';

export default function SchemaTextViewer() {
	const schema = useSchemaBuilderCurrentSchema();
	const { updateSchema } = useSchemaBuilderContext();

	const containerRef = useRef<HTMLDivElement | null>(null);
	const editorRef = useRef<JSONEditor | null>(null);

	return (
		<div
			ref={ref => {
				containerRef.current = ref;

				if (!ref) return;

				if (editorRef.current) {
					editorRef.current.update(schema);
					return;
				}

				editorRef.current = new JSONEditor(ref, {
					mode: 'code',
					onValidate(json) {
						try {
							schemaToPropertyState(json);
						} catch (e) {
							return [{ message: (e as Error).message, path: [] }];
						}

						return [];
					},
					onChange: () => {
						const text = editorRef.current?.getText();
						if (!text) return;

						try {
							const newSchema = JSON.parse(text);
							updateSchema(newSchema);
						} catch (e) {
							console.error(e);
						}
					},
				});

				editorRef.current.update(schema);
			}}
		/>
	);
}
