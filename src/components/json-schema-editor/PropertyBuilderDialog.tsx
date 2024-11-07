import { PropertyBuilderFormProps } from '@/components/json-schema-editor/PropertyBuilderForm';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useSchemaBuilderContext } from '@/lib/json-schema/context';
import { propertyBuilderStateToSchema } from '@/lib/json-schema/state';
import { STRING_FORMATS } from '@/lib/json-schema/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function PropertyBuilderDialog(props: PropertyBuilderFormProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={'outline'}>
					<MoreHorizontal />
				</Button>
			</DialogTrigger>
			<DialogContent className="min-w-[80vw]">
				<DialogHeader>
					<DialogTitle>
						<h1 className="text-xl font-semibold font-mono">
							{[...props.parentKey, props.state.key].join('.')}
						</h1>
					</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-2">
					<div className="space-y-4">
						<PropertyBaseOptions {...props} />
						{props.state.type === 'string' ? (
							<StringBuilderOptions {...props} />
						) : props.state.type === 'number' ||
						  props.state.type === 'integer' ? (
							<NumberBuilderOptions {...props} />
						) : props.state.type === 'array' ? (
							<ArrayBuilderOptions {...props} />
						) : null}
					</div>
					<pre className="bg-gray-100 p-2 rounded block overflow-auto min-h-[200px]">
						{JSON.stringify(propertyBuilderStateToSchema(props.state), null, 2)}
					</pre>
				</div>
				<DialogFooter>
					<DeletePropertyButton keys={[...props.parentKey, props.state.key]} />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function DeletePropertyButton(props: { keys: string[] }) {
	const { removeProperty } = useSchemaBuilderContext();

	return (
		<Button
			variant={'destructive'}
			onClick={() => {
				const confirmed = confirm(
					'Are you sure you want to delete this property?'
				);

				if (confirmed) {
					removeProperty(props.keys);
				}
			}}
		>
			Delete
		</Button>
	);
}

function PropertyBaseOptions(props: PropertyBuilderFormProps) {
	const { updateProperty } = useSchemaBuilderContext();

	return (
		<>
			<div>
				<Label htmlFor="description">Description</Label>
				<p className="text-muted-foreground text-sm">
					Provide a description for the property.
				</p>
				<Textarea
					id="description"
					defaultValue={props.state.description ?? ''}
					onChange={e => {
						updateProperty([...props.parentKey, props.state.key], {
							...props.state,
							description: !!e.target.value ? e.target.value : undefined,
						});
					}}
				/>
			</div>
			<div className="flex items-center justify-between cursor-pointer">
				<div>
					<Label htmlFor="isNullable" className="flex-1 block">
						Is Nullable
						<p className="text-muted-foreground text-sm font-normal">
							Allow the property to be null.
						</p>
					</Label>
				</div>
				<Switch
					id="isNullable"
					checked={props.state.isNullable}
					onCheckedChange={checked => {
						updateProperty([...props.parentKey, props.state.key], {
							...props.state,
							isNullable: Boolean(checked),
						});
					}}
				/>
			</div>
		</>
	);
}

function NumberBuilderOptions(props: PropertyBuilderFormProps) {
	const { updateProperty } = useSchemaBuilderContext();
	return (
		<div className="grid grid-cols-2 gap-2">
			<div>
				<Label htmlFor="minimum">Minimum</Label>
				<p className="text-muted-foreground text-sm">
					Provide a minimum value for the number.
				</p>
				<Input
					type="number"
					id="minimum"
					placeholder="N/A"
					defaultValue={props.state.minimum ?? 'N/A'}
					onChange={e => {
						updateProperty([...props.parentKey, props.state.key], {
							...props.state,
							minimum: !!e.target.value ? parseInt(e.target.value) : undefined,
						});
					}}
				/>
			</div>
			<div>
				<Label htmlFor="maximum">Maximum</Label>
				<p className="text-muted-foreground text-sm">
					Provide a maximum value for the number.
				</p>
				<Input
					type="number"
					id="maximum"
					placeholder="N/A"
					defaultValue={props.state.maximum ?? 'N/A'}
					onChange={e => {
						updateProperty([...props.parentKey, props.state.key], {
							...props.state,
							maximum: !!e.target.value ? parseInt(e.target.value) : undefined,
						});
					}}
				/>
			</div>
		</div>
	);
}

function ArrayBuilderOptions(props: PropertyBuilderFormProps) {
	const { updateProperty } = useSchemaBuilderContext();

	return (
		<div className="grid grid-cols-2 gap-2">
			<div>
				<Label htmlFor="minItems">Min Items</Label>
				<p className="text-muted-foreground text-sm">
					Provide a minimum number of items for the array.
				</p>
				<Input
					type="number"
					id="minItems"
					placeholder="N/A"
					defaultValue={props.state.minItems ?? 'N/A'}
					onChange={e => {
						updateProperty([...props.parentKey, props.state.key], {
							...props.state,
							minItems: !!e.target.value ? parseInt(e.target.value) : undefined,
						});
					}}
				/>
			</div>
			<div>
				<Label htmlFor="maxItems">Max Items</Label>
				<p className="text-muted-foreground text-sm">
					Provide a maximum number of items for the array.
				</p>
				<Input
					type="number"
					id="maxItems"
					placeholder="N/A"
					defaultValue={props.state.maxItems ?? 'N/A'}
					onChange={e => {
						updateProperty([...props.parentKey, props.state.key], {
							...props.state,
							maxItems: !!e.target.value ? parseInt(e.target.value) : undefined,
						});
					}}
				/>
			</div>
		</div>
	);
}

function StringBuilderOptions(props: PropertyBuilderFormProps) {
	const { updateProperty } = useSchemaBuilderContext();

	return (
		<>
			<div>
				<Label htmlFor="format">Format</Label>
				<p className="text-muted-foreground text-sm">
					Provide a format for the string. e.g. date, email, etc.
				</p>
				<Select
					value={props.state.format ?? 'None'}
					onValueChange={v => {
						updateProperty([...props.parentKey, props.state.key], {
							...props.state,
							format:
								v === 'None'
									? undefined
									: (v as (typeof STRING_FORMATS)[number]),
						});
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Format" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem key="None" value="None">
							None
						</SelectItem>
						{STRING_FORMATS.map(format => (
							<SelectItem key={format} value={format}>
								{format}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<EnumValuesPicker {...props} />
			<div className="grid grid-cols-2 gap-2">
				<div>
					<Label htmlFor="minLength">Min Length</Label>
					<p className="text-muted-foreground text-sm">
						Provide a minimum length for the string.
					</p>
					<Input
						type="number"
						id="minLength"
						placeholder="N/A"
						defaultValue={props.state.minLength ?? 'N/A'}
						onChange={e => {
							updateProperty([...props.parentKey, props.state.key], {
								...props.state,
								minLength: !!e.target.value
									? parseInt(e.target.value)
									: undefined,
							});
						}}
					/>
				</div>
				<div>
					<Label htmlFor="maxLength">Max Length</Label>
					<p className="text-muted-foreground text-sm">
						Provide a maximum length for the string.
					</p>
					<Input
						type="number"
						id="maxLength"
						placeholder="N/A"
						defaultValue={props.state.maxLength ?? 'N/A'}
						onChange={e => {
							updateProperty([...props.parentKey, props.state.key], {
								...props.state,
								maxLength: !!e.target.value
									? parseInt(e.target.value)
									: undefined,
							});
						}}
					/>
				</div>
			</div>
		</>
	);
}

function EnumValuesPicker(props: PropertyBuilderFormProps) {
	const { updateProperty } = useSchemaBuilderContext();
	const [open, setOpen] = useState<boolean>(false);
	const [next, setNext] = useState<string>('');

	return (
		<div>
			<Label htmlFor="enumValues">Enum Values</Label>
			<p className="text-muted-foreground text-sm">
				Provide a list of possible values for the string.
			</p>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						{props.state.enumValues && props.state.enumValues?.length > 0
							? props.state.enumValues?.join(', ')
							: 'No Enum Values'}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput
							placeholder="Add Enum Value"
							value={next}
							onValueChange={setNext}
						/>
						<CommandList>
							<CommandGroup>
								{props.state.enumValues?.map(value => (
									<CommandItem
										key={value}
										onSelect={(value: string) => {
											const newEnumValues = props.state.enumValues?.filter(
												v => v !== value
											);

											updateProperty([...props.parentKey, props.state.key], {
												...props.state,
												enumValues:
													newEnumValues && newEnumValues.length > 0
														? newEnumValues
														: undefined,
											});
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												props.state.enumValues?.includes(value)
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{value}
									</CommandItem>
								))}
								{next !== '' && (
									<CommandItem
										value={next}
										onSelect={(value: string) => {
											updateProperty([...props.parentKey, props.state.key], {
												...props.state,
												enumValues: [...(props.state.enumValues ?? []), value],
											});
											setNext('');
										}}
									>
										{next}
									</CommandItem>
								)}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
