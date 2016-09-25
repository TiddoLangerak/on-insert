Module to detect insertion of DOM elements.

## Usage
```javscript
import onInsert from 'on-insert';

onInsert(`my-component`, (el) => {
	console.log("Insert new my-component:", el);
});
```

## Browser support:
Any browser that supports keyframes:

- Chrome >= 4.0
- IE >= 10
- Firefox >= 5.0
- Safari >= 4.0
- Opera >= 12.1
