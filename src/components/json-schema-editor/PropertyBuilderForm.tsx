import PropertyBuilderDialog from '@/components/json-schema-editor/PropertyBuilderDialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSchemaBuilderContext } from '@/lib/json-schema/context';
import { PropertyBuilderState } from '@/lib/json-schema/state';
import { PropertyType } from '@/lib/json-schema/types';
import { useCallback, useRef } from 'react';

export type PropertyBuilderFormProps = {
	state: PropertyBuilderState;
	parentKey: string[];
	parentType: PropertyType;
};

export default function PropertyBuilderForm({
	parentKey,
	parentType,
	state,
}: PropertyBuilderFormProps) {
	const { updateProperty } = useSchemaBuilderContext();
	const { toast } = useToast();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleUpdateProperty = useCallback(
		(key: string, property: PropertyBuilderState) => {
			try {
				updateProperty([...parentKey, state.key], property);
			} catch (e) {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: (e as Error).message ?? 'Could not update property',
				});

				if (!inputRef.current) return;
				inputRef.current.value = key;
			}
		},
		[parentKey, state.key]
	);

	return (
		<div className="grid grid-cols-12 place-items-center my-1 mr-2 gap-2">
			<Select
				value={state.type}
				onValueChange={v =>
					handleUpdateProperty(state.key, {
						...state,
						type: v as unknown as PropertyType,
					})
				}
			>
				<SelectTrigger className="col-span-4">
					<SelectValue placeholder="Type" />
				</SelectTrigger>
				<SelectContent>
					{['string', 'number', 'integer', 'boolean', 'array', 'object'].map(
						type => (
							<SelectItem key={type} value={type}>
								{type}
							</SelectItem>
						)
					)}
				</SelectContent>
			</Select>
			{parentType === 'object' && (
				<Input
					placeholder="Key"
					defaultValue={state.key}
					ref={inputRef}
					className="col-span-7"
					onBlur={e => {
						handleUpdateProperty(state.key, {
							...state,
							key: e.target.value,
						});
					}}
				/>
			)}
			<div className="col-span-1">
				<PropertyBuilderDialog
					parentKey={parentKey}
					state={state}
					parentType={parentType}
				/>
			</div>
		</div>
	);
}
