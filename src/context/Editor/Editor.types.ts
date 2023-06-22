import { ElementType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getElementType = <T extends keyof HTMLElementTagNameMap>(_tagName: T): HTMLElementTagNameMap[T] => {
	return {} as HTMLElementTagNameMap[T] & HTMLElement;
};

export type EditorBlock = {
	id: string;
	html: string;
	tag: ElementType;
	ref?: HTMLElementTagNameMap[keyof HTMLElementTagNameMap] | null;
	className?: string;
};

export type EditorState = {
	blocks: EditorBlock[];
}

type SetEditorStateAction = {
	type: 'editor/setState';
	payload: EditorState;
}

type AddEditorBlockAction = {
	type: 'editor/addBlock';
	payload: {
		newBlock: EditorBlock;
		currentBlock: EditorBlock;
	};
}

type UpdateEditorBlockAction = {
	type: 'editor/updateBlock';
	payload: {
		blockToUpdate: EditorBlock;
	};
}

type DeleteEditorBlockAction = {
	type: 'editor/deleteBlock';
	payload: {
		blockToDelete: EditorBlock;
	};
}

export type EditorReducerAction = SetEditorStateAction | AddEditorBlockAction | UpdateEditorBlockAction | DeleteEditorBlockAction;