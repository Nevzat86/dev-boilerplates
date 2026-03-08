import { createRoot } from '@wordpress/element';
import { App } from './App';
import './style.css';

const root = document.getElementById('myplugin-admin-root');
if (root) {
	createRoot(root).render(<App />);
}
