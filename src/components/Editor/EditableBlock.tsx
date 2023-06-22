import { ElementType, FormEventHandler, KeyboardEventHandler, useEffect, useRef, useState } from 'react';

import { EditorBlock, getElementType } from '../../context/Editor/Editor.types';
import useDidUpdateEffect from '../../hooks/useDidUpdateEffect';
import { getCaretCoordinates, setCaretToEnd } from '../../utils/editor.util';
import Polymorphic, { PolymorphicComponentProp } from '../Polymorphic';

import EditorMenu, { MenuItem, MenuPosition } from './EditorMenu';

type EditableBlockProperties<C extends ElementType> = PolymorphicComponentProp<
C,
{
	id: string;
	html: string;
	className?: string;
	onUpdateBlock: (block: EditorBlock) => void;
	onAddBlock: (currentBlock: EditorBlock) => void;
	onDeleteBlock: (block: EditorBlock) => void;
}
>;

const EditableBlock = <C extends ElementType>({ html, as, id, className = '', onUpdateBlock, onAddBlock, onDeleteBlock }: EditableBlockProperties<C>) => {

	const [ innerHtml, setInnerHtml ] = useState<string>(html);
	const [ htmlBackup, setHtmlBackup ] = useState<string | null>(null);
	const [ previousKey, setPreviousKey ] = useState<string>('');

	const [ isEditorMenuOpen, setIsEditorMenuOpen ] = useState(false);
	const [ editorMenuPosition, setEditorMenuPosition ] = useState<MenuPosition>({
		x: 0,
		y: 0, 
	});

	const asElement = getElementType(as as keyof HTMLElementTagNameMap);
	const editableBlockRef = useRef<typeof asElement>(null);

	useEffect(() => {
		if (editableBlockRef.current) {
			const lastChar = innerHtml.charAt(innerHtml.length - 1);
			editableBlockRef.current.innerHTML = lastChar === '/' ? innerHtml.substring(0, innerHtml.length - 1) : innerHtml;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ as ]);

	useDidUpdateEffect(() => {
		onUpdateBlock({
			id,
			html: innerHtml,
			tag: as || 'p',
		});
	}, [ innerHtml ]);

	const handleCloseEditorMenu = () => {
		setHtmlBackup(null);
		setIsEditorMenuOpen(false);
		setEditorMenuPosition({
			x: 0,
			y: 0, 
		});
	};

	const handleOpenEditorMenu = () => {
		const { x, y } = getCaretCoordinates();
		if (x && y) {
			setIsEditorMenuOpen(true);
			setEditorMenuPosition({
				x,
				y,
			});
		}
	};

	const handleSelectMenuOption = (menuItem: MenuItem) => {
		if (htmlBackup && editableBlockRef?.current) {
			editableBlockRef.current.innerHTML = htmlBackup;
		}
		onUpdateBlock({
			id,
			html: (htmlBackup || innerHtml),
			tag: menuItem.tag || 'p',
			className: menuItem.className || '',
		});
		handleCloseEditorMenu();
		if (editableBlockRef?.current) {
			setCaretToEnd(editableBlockRef.current);
		}
	};

	const handleKeyUp: KeyboardEventHandler<typeof asElement> = (event) => {
		if (event.key === '/') {
			handleOpenEditorMenu();
		}
	};

	const handleChange: FormEventHandler<typeof asElement> = (event) => {
		setInnerHtml(event?.currentTarget.innerHTML || '');
	};

	const handleKeyDown: KeyboardEventHandler<typeof asElement> = (event) => {
		const currentBlock: EditorBlock = {
			id,
			tag: as || 'p',
			html: innerHtml,
			ref: editableBlockRef.current,
		};

		if (event.key === '/') {
			console.log('SET HTML BACKUP', innerHtml);
			setHtmlBackup(innerHtml);
		}
		if (event.key === 'Enter') {
			if (previousKey !== 'Shift') {
				event.preventDefault();
				onAddBlock(currentBlock);
			}
		}
		if (event.key === 'Backspace' && !innerHtml) {
			event.preventDefault();
			onDeleteBlock(currentBlock);
		}
		setPreviousKey(event.key);
	};

	return (
		<>
			{
				isEditorMenuOpen ?
					<EditorMenu
						position={ editorMenuPosition }
						onClose={ handleCloseEditorMenu }
						onSelect={ handleSelectMenuOption }
					/>
					: null
			}
			<Polymorphic
				as={ as as keyof HTMLElementTagNameMap }
				className={ `focus:outline-none ${ className }` }
				ref={ editableBlockRef }
				contentEditable
				onInput={ handleChange }
				onKeyDown={ handleKeyDown }
				onKeyUp={ handleKeyUp }
			/>
		</>
		
	);
};

export default EditableBlock;