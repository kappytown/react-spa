/**
 * Adds the elements to the references object
 * 
 * @param {object} refs - the refs object that holds all the references
 * @param {string} key - the identifier
 * @param {DOMElement} element - the referenced element
 */
export const assignRef = (refs, key, element) => {
	// When the component mounts, the ref callback will be called
	if (element) {
		refs.current[key] = element;

	// When the component unmouts, the ref callback will be called with null as the element
	} else {
		delete refs.current[key];
	}
}

/**
 * Returns the selected option from the select element
 * 
 * @param {DOMElement} element 
 * @returns {DOMElement} - the selected option
 */
export const getSelectedOption = (element) => {
	if (element && element.type.includes('select')) {
		return element.options[element.selectedIndex] || '';	
	}
	return element;
}

/**
 * 
 * @param {DOMElement} el - the element to trigger the event on
 * @param {string} type - the type of event such as change, click, etc.
 */
export const triggerEvent = (el, type) => {
	if (!el) return;
	const event = new Event(type, { bubbles: true });
	el.dispatchEvent(event);
}

/**
 * Scrolls the provided element into view
 * 
 * @param {DOMElement} el
 */
export const scrollIntoView = (el) => {
	const rect = el.getBoundingClientRect();
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	window.scrollTo({
		top: rect.top + scrollTop - 50,
		behavior: 'smooth' // Optional for smooth scrolling
	});
}

/**
 * Scroll the window back to top (0)
 */
export const backToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}