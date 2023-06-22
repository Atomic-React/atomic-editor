import { Reducer } from 'react';

import type { EditorState, EditorReducerAction } from './Editor.types';

const editorReducer: Reducer<EditorState, EditorReducerAction> = (state, action) => {
	switch (action.type) {
		case 'editor/setState':
			return { ...action.payload };
		case 'editor/addBlock':
			const { newBlock, currentBlock } = action.payload;
			const currentBlockIndex = state.blocks.map((b) => b.id).indexOf(currentBlock.id);
			const blocksCopyToAddNewBlock = [ ...state.blocks ];
			blocksCopyToAddNewBlock.splice(currentBlockIndex + 1, 0, newBlock);
			return {
				...state,
				blocks: blocksCopyToAddNewBlock,
			};
		case 'editor/updateBlock':
			const { blockToUpdate } = action.payload;
			return {
				...state,
				blocks: state.blocks.map((block) => {
					if (block.id === blockToUpdate.id) {
						return {
							...block,
							...blockToUpdate, 
						};
					}
					return block;
				}),
			};
		case 'editor/deleteBlock':
			const { blockToDelete } = action.payload;
			const blockToDeleteIndex = state.blocks.map((b) => b.id).indexOf(blockToDelete.id);
			return {
				...state,
				blocks: [ ...state.blocks ].splice(blockToDeleteIndex, 0),
			};
		default:
			return state;
	}
};

export default editorReducer;