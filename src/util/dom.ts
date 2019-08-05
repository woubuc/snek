export function getDomElement(id : string) : HTMLElement {
	const element = document.getElementById(id);
	if (!element) throw new Error('Element #' + id + ' does not exist');
	return element;
}
