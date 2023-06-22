import { ElementType, ReactNode, createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import { uid } from '../../utils/uid.util';

import editorReducer from './Editor.reducer';
import { EditorBlock } from './Editor.types';

type EditorContextValue = {
	blocks: EditorBlock[];
	addEditorBlock: (currentBlock: EditorBlock, elementTag?: ElementType) => void;
	updateEditorBlock: (blockToUpdate: EditorBlock) => void;
	deleteEditorBlock: (blockToDelete: EditorBlock) => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export const useEditorContext = () => {
	const context = useContext(EditorContext);
	if (context === null) {
		throw new Error('useEditorContext is null');
	}
	if (context === undefined) {
		throw new Error('useEditorContext is used outside of its Provider');
	}
	return context;
};

const INITIAL_BLOCKS: EditorBlock[] = [
	{
		id: uid(),
		html: '',
		tag: 'p',
	},
];

type EditorContextProviderProperties = {
	initialBlocks?: EditorBlock[];
	children: ReactNode;
};

const EditorContextProvider = ({ initialBlocks, children }: EditorContextProviderProperties) => {
	
	const [ { blocks }, dispatch ] = useReducer(editorReducer, { blocks: initialBlocks && initialBlocks.length > 0 ? initialBlocks : INITIAL_BLOCKS });

	const addEditorBlock = useCallback((currentBlock: EditorBlock, elementTag?: ElementType) => {
		const newBlock: EditorBlock = {
			id: uid(),
			html: '',
			tag: elementTag || 'p', 
		};
		dispatch({
			type: 'editor/addBlock',
			payload: {
				newBlock,
				currentBlock,
			},
		});
	}, []);

	const updateEditorBlock = useCallback((blockToUpdate: EditorBlock) => {
		dispatch({
			type: 'editor/updateBlock',
			payload: { blockToUpdate },
		});
	}, []);

	const deleteEditorBlock = useCallback((blockToDelete: EditorBlock) => {
		dispatch({
			type: 'editor/deleteBlock',
			payload: { blockToDelete },
		});
	}, []);

	const contextValue: EditorContextValue = useMemo(() => ({
		blocks,
		addEditorBlock,
		updateEditorBlock,
		deleteEditorBlock,
	}), [
		blocks,
		addEditorBlock,
		updateEditorBlock,
		deleteEditorBlock,
	]);

	return (
		<EditorContext.Provider value={ contextValue }>
			{ children }
		</EditorContext.Provider>
	);

};

export default EditorContextProvider;