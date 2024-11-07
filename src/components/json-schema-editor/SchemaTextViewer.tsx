import {
	useSchemaBuilderContext,
	useSchemaBuilderCurrentSchema,
} from '@/lib/json-schema/context';

import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import { useEffect, useRef } from 'react';

export default function SchemaTextViewer() {
	const schema = useSchemaBuilderCurrentSchema();
	const { updateSchema } = useSchemaBuilderContext();

	const containerRef = useRef<HTMLDivElement | null>(null);
	const editorRef = useRef<JSONEditor | null>(null);

	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.focus();
		}
		return () => {
			if (editorRef.current) {
				editorRef.current.destroy();
				editorRef.current = null;
			}
		};
	}, []);

	return (
		<div
			ref={ref => {
				containerRef.current = ref;

				if (!ref) return;

				if (editorRef.current) {
					return;
				}

				editorRef.current = new JSONEditor(ref, {
					mode: 'code',
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

				editorRef.current.set(schema);
			}}
			style={{ height: '100vh' }}
		/>
	);
}
