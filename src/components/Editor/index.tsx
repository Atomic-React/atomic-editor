import { useEffect, useState } from 'react';


import { useEditorContext } from '../../context/Editor/Editor.context';
import { EditorBlock } from '../../context/Editor/Editor.types';
import { setCaretToEnd } from '../../utils/editor.util';

import EditableBlock from './EditableBlock';

export type EditorProperties = {
	className?: string;
}

const Editor = ({ className }: EditorProperties) => {

	const { blocks, updateEditorBlock, addEditorBlock, deleteEditorBlock } = useEditorContext();

	const [ elementToFocus, setElementToFocus ] = useState<{ currentElement: HTMLElement, sibling: 'previous' | 'next' } | null>();

	useEffect(() => {
		console.log('BLOCKS UPDATED', blocks);
	}, [ blocks ]);


	useEffect(() => {
		if (elementToFocus?.currentElement) {
			const { sibling, currentElement } = elementToFocus;
			if (sibling === 'previous' && currentElement.previousElementSibling) {
				(currentElement.previousElementSibling as HTMLElement).focus();
			}
			if (sibling === 'next' && currentElement.nextElementSibling) {
				(currentElement.nextElementSibling as HTMLElement).focus();
			}
		}
	}, [ elementToFocus ]);

	const handleUpdatePage = (blockToUpdate: EditorBlock) => updateEditorBlock(blockToUpdate);

	const handleAddBlock = (currentBlock: EditorBlock) => {
		addEditorBlock(currentBlock);
		if (currentBlock.ref) {
			setElementToFocus({
				currentElement: currentBlock.ref,
				sibling: 'next', 
			});
		}
	};

	const handleDeleteBlock = (currentBlock: EditorBlock) => {
		const previousBlock = currentBlock.ref?.previousElementSibling;
		if (previousBlock) {
			deleteEditorBlock(currentBlock);
			setCaretToEnd(previousBlock);
			(previousBlock as HTMLElement).focus();
		}
	};


	return (
		<div className={ `bg-white shadow-md flex-grow outline-none p-4 rounded-md ${ className }` }>
			{ 
				blocks.map((block) => {
					return (
						<EditableBlock
							key={ block.id }
							as={ block.tag }
							className={ block.className }
							html={ block.html }
							id={ block.id }
							onAddBlock={ handleAddBlock }
							onDeleteBlock={ handleDeleteBlock }
							onUpdateBlock={ handleUpdatePage }
						/>
					);
				})
			}
		</div>
	);
};

export default Editor;