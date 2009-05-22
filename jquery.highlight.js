/*
 * jQuery Highligh plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - highlights whole words only, case sensitive
 *  - element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of word 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // wrap every occurrance of word 'ipsun' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').removeHighlight();
 *
 *   // remove custom highlight
 *   $('#content').removeHighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed MIT license.
 *
 */

jQuery.extend({
	highlight: function(node, word, nodeName, className) {
		if (node.nodeType == 3) {
			var re = new RegExp("\\b" + word + "\\b", "g");
			var pos = node.data.search(re);
			if (pos >= 0) {
				var highlight = document.createElement(nodeName || 'span');
				highlight.className = className || 'highlight';
				var wordNode = node.splitText(pos);
				wordNode.splitText(word.length);
				var wordClone = wordNode.cloneNode(true);
				highlight.appendChild(wordClone);
				wordNode.parentNode.replaceChild(highlight, wordNode);
				return 1; //skip added node in parent
			}
		} else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
			for (var i = 0; i < node.childNodes.length; ++i) {
				i += jQuery.highlight(node.childNodes[i], word, nodeName, className);
			}
			return 0;
		}
	}
});

jQuery.fn.removeHighlight = function(options) {
	var settings = { className: 'highlight', element: 'span' };
	$.extend(settings, options);

	return this.find(settings.element + "." + settings.className).each(function() {
		// TODO: what is this for? :)
		this.parentNode.firstChild.nodeName;
		with (this.parentNode) {
			replaceChild(this.firstChild, this);
			normalize();
		}
	}).end();
};

jQuery.fn.highlight = function(word, options) {
	var settings = { className: 'highlight', element: 'span' };
	$.extend(settings, options);
	return this.each(function(){ jQuery.highlight(this, word, settings.element, settings.className );});
}