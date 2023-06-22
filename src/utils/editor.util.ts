export const setCaretToEnd = (element: Element) => {
	const range = document.createRange();
	const selection = window.getSelection();
	if (selection) {
		range.selectNodeContents(element);
		range.collapse(false);
		selection.removeAllRanges();
		selection.addRange(range);
		// element.focus();
	}
};

export const getCaretCoordinates = () => {
	let x; let 
		y;
	const selection = window.getSelection();
	if (selection && selection.rangeCount !== 0) {
		const range = selection.getRangeAt(0).cloneRange();
		range.collapse(false);
		const [ rect ] = range.getClientRects();
		if (rect) {
			x = rect.left;
			y = rect.top;
		}
	}
	return {
		x,
		y, 
	};
};