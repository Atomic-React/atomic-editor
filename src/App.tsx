import Editor from './components/Editor';
import EditorContextProvider from './context/Editor/Editor.context';

const App = () => {

	return (
		<div className="bg-slate-50 h-full p-4 flex flex-col">
			<h1 className="text-indigo-500 text-2xl mb-4 font-medium">Atomic Editor</h1>
			<EditorContextProvider>
				<Editor />
			</EditorContextProvider>
		</div>		
	);
};

export default App;
