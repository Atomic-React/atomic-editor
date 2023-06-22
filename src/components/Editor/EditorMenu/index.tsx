import { ElementType, useEffect, useState } from 'react';

export type MenuItem = {
	id: string;
	tag: ElementType;
	label: string;
	className?: string;
}

export type MenuPosition = {
	x: number;
	y: number
}

const allowedTags: MenuItem[] = [
	{
		id: 'page-title',
		tag: 'h1',
		label: 'Page Title',
		className: 'text-3xl font-bold my-6',
	},
	{
		id: 'heading',
		tag: 'h2',
		label: 'Heading',
		className: 'text-2xl font-bold my-4',
	},
	{
		id: 'subheading',
		tag: 'h3',
		label: 'Subheading',
		className: 'text-xl font-bold my-4',
	},
	{
		id: 'paragraph',
		tag: 'p',
		label: 'Paragraph',
	},
];

type EditorMenuProperties = {
	onClose: () => void,
	onSelect: (item: MenuItem) => void;
	position: MenuPosition;
}

const EditorMenu = ({ onClose, onSelect, position }: EditorMenuProperties) => {

	const { x, y } = position;

	const [ command, setCommand ] = useState('');
	const [ items, setItems ] = useState(allowedTags);
	const [ selectedItem, setSelectedItem ] = useState(0);

	const handleKeyDown = (event: KeyboardEvent) => {

		const prevSelected = selectedItem === 0 ? items.length - 1 : selectedItem - 1;
		const nextSelected = selectedItem === items.length - 1 ? 0 : selectedItem + 1;

		switch (event.key) {
			case 'Enter':
				event.preventDefault();
				onSelect(items[ selectedItem ]);
				break;
			case 'Backspace':
				if (!command) onClose();
				setCommand(command.substring(0, command.length - 1));
				break;
			case 'ArrowUp':
				event.preventDefault();
				
				setSelectedItem(prevSelected);
				break;
			case 'ArrowDown':
			case 'Tab':
				event.preventDefault();
				setSelectedItem(nextSelected);
				break;
			default:
				setCommand(command + event.key);
				break;
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
	}, []);

	const handleSelectItem = (tag: MenuItem) => () => {
		console.log('SELECTED :', tag);
		onSelect(tag);
	};

	const positionAttributes = {
		top: y,
		left: x, 
	};

	return (
		<div
			className="bg-white drop-shadow-md rounded-md overflow-hidden absolute min-w-[180px]"
			style={ positionAttributes }
		>
			<div className="Items">
				{ items.map((item) => {
					const isSelected = items.indexOf(item) === selectedItem;
					return (
						<div
							key={ item.id }
							className={ `px-4 py-2 hover:bg-slate-100 ${ isSelected ? 'bg-slate-100' : '' }` }
							role="button"
							tabIndex={ 0 }
							onClick={ handleSelectItem(item) }
						>
							{ item.label }
						</div>
					);
				}) }
			</div>
		</div>
	);

};

export default EditorMenu;