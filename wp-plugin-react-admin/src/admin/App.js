import { useState } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Items } from './pages/Items';

export function App() {
	const page = new URLSearchParams(window.location.search).get('page');
	const initialTab = page === 'my-plugin-settings' ? 'settings' : 'dashboard';
	const [activeTab, setActiveTab] = useState(initialTab);

	const tabs = [
		{ name: 'dashboard', title: __('Dashboard', 'my-plugin') },
		{ name: 'items', title: __('Items', 'my-plugin') },
		{ name: 'settings', title: __('Settings', 'my-plugin') },
	];

	return (
		<div>
			<div className="myplugin-header">
				<h1>{__('My Plugin', 'my-plugin')}</h1>
				<span style={{ color: '#757575', fontSize: '13px' }}>
					v{window.myPluginData?.version}
				</span>
			</div>

			<TabPanel
				tabs={tabs}
				initialTabName={activeTab}
				onSelect={(tabName) => setActiveTab(tabName)}
			>
				{(tab) => {
					switch (tab.name) {
						case 'dashboard':
							return <Dashboard />;
						case 'items':
							return <Items />;
						case 'settings':
							return <Settings />;
						default:
							return null;
					}
				}}
			</TabPanel>
		</div>
	);
}
