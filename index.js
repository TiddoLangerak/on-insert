import memoize from '@tiddo/memoize';
import insertCss from '@tiddo/insert-css';

//We detect inserts of nodes by letting them trigger a css animation, which we
//can detect from JS. The animation is an animation from opacity: 0.9999 -> 1,
//which effectively does nothing.

const cssPrefixes = ['', '-webkit-', '-moz-', '-o-']; //IE never had a prefix
const animationEvents = ['animationstart', 'MSAnimationStart', 'webkitAnimationStart', 'mozAnimationStart', 'oAnimationStart'];

const animationName = 'tl-node-inserted'
const callbacks = new Map();


const init = memoize(async() => {
	await Promise.all(cssPrefixes.map(
		prefix => insertCss(`
			@${prefix}keyframes ${animationName} {
				from {
					opacity : 0.9999
				}
				to {
					opacity : 1
				}
			}
		`)
	));

	function onInsert(event) {
		if (event.animationName === animationName) {
			const elementName = event.target.nodeName.toLowerCase();
			const cbs = callbacks.get(elementName) || [];
			cbs.forEach(cb => cb(event.target));
		}
	}

	animationEvents.forEach(eventName => document.addEventListener(eventName, onInsert, false));
});

const addAnimationTrigger = memoize(selector => {
	return Promise.all(cssPrefixes.map(
		prefix => insertCss(`
			${selector} {
				${prefix}animation-duration: 0.001s;
				${prefix}animation-name: ${animationName}
			}
		`)
	));
});

export default async function onInsert(name, cb) {
	await init();
	await addAnimationTrigger(name);
	if (!callbacks.has(name)) {
		callbacks.set(name, []);
	}
	callbacks.get(name).push(cb);
}
