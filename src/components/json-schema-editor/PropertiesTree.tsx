import PropertyBuilderForm from '@/components/json-schema-editor/PropertyBuilderForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
	useSchemaBuilderContext,
	useSchemaBuilderState,
} from '@/lib/json-schema/context';
import { PropertyBuilderState } from '@/lib/json-schema/state';
import { PropertyType } from '@/lib/json-schema/types';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export default function PropertiesTreeView() {
	const state = useSchemaBuilderState();

	return (
		<div className="relative">
			{state.children.map(child => (
				<PropertyTreeNode
					key={child.key}
					state={child}
					parentKey={[]}
					parentType="object"
				/>
			))}
			<NewPropertyButton parentKey={[]} className="ml-3 my-1" />
		</div>
	);
}

function PropertyTreeNode(props: {
	state: PropertyBuilderState;
	parentKey: string[];
	parentType: PropertyType;
}) {
	const { state } = props;
	const depth = props.parentKey.length + 1;

	return (
		<div style={{ marginLeft: 12 * depth }} className="relative">
			<PropertyBuilderForm
				parentKey={props.parentKey}
				state={state}
				parentType={props.parentType}
			/>
			<div className="relative flex  flex-col">
				{state.children.map(child => (
					<PropertyTreeNode
						key={child.key}
						state={child}
						parentType={state.type}
						parentKey={[...props.parentKey, state.key]}
					/>
				))}
				{state.type === 'object' && (
					<>
						<NewPropertyButton
							parentKey={[...props.parentKey, state.key]}
							className="ml-6"
						/>
						<div className="absolute top-0 left-3 w-0.5 h-full bg-primary" />
					</>
				)}
			</div>
		</div>
	);
}

function NewPropertyButton(props: { parentKey: string[]; className?: string }) {
	const { addProperty } = useSchemaBuilderContext();
	const { toast } = useToast();
	const isRoot = props.parentKey.length === 0;

	const handleAddProperty = () => {
		try {
			const propertyName = 'property_name';
			addProperty(props.parentKey, {
				key: propertyName,
				type: 'string',
				isNullable: true,
				children: [],
			});

			// Focus on the new property input
			setTimeout(() => {
				const elementId = `${props.parentKey.join('.')}.${propertyName}-key-input`;
				const el = document.getElementById(elementId);
				el?.focus();
			}, 0);
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: (e as Error).message ?? 'Could not add property',
			});
		}
	};

	return (
		<Button
			size={isRoot ? 'sm' : 'icon'}
			className={cn(!isRoot && 'w-6 h-6', props.className)}
			onClick={() => {
				handleAddProperty();
			}}
		>
			<Plus /> {isRoot ? 'New Property' : ''}
		</Button>
	);
}
