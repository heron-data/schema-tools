import { Button } from '@/components/ui/button';
import { useSchemaBuilderContext } from '@/lib/json-schema/context';

export default function ResetSchemaButton() {
	const { updateSchema } = useSchemaBuilderContext();

	return (
		<Button
			variant={'outline'}
			size={'sm'}
			onClick={() =>
				updateSchema({
					type: 'object',
					properties: {},
				})
			}
		>
			Reset Schema
		</Button>
	);
}
