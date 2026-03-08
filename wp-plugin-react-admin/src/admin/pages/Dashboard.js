import { useState, useEffect } from '@wordpress/element';
import { Card, CardBody, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { api } from '../api';

export function Dashboard() {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadStats() {
			try {
				const { total } = await api.getItems(1, 1);
				const settings = await api.getSettings();
				setStats({ totalItems: total, settings });
			} catch (err) {
				setStats({ error: err.message });
			} finally {
				setLoading(false);
			}
		}
		loadStats();
	}, []);

	if (loading) {
		return (
			<div style={{ padding: '40px', textAlign: 'center' }}>
				<Spinner />
			</div>
		);
	}

	if (stats?.error) {
		return (
			<Card className="myplugin-card">
				<CardBody>
					<p style={{ color: '#d63638' }}>
						{__('Error loading dashboard:', 'my-plugin')} {stats.error}
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div style={{ marginTop: '16px' }}>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
				<Card className="myplugin-card">
					<CardBody>
						<h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#757575' }}>
							{__('Total Items', 'my-plugin')}
						</h3>
						<p style={{ margin: 0, fontSize: '32px', fontWeight: 600 }}>
							{stats.totalItems}
						</p>
					</CardBody>
				</Card>

				<Card className="myplugin-card">
					<CardBody>
						<h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#757575' }}>
							{__('API Status', 'my-plugin')}
						</h3>
						<p style={{ margin: 0, fontSize: '16px' }}>
							{stats.settings.api_key
								? '✓ ' + __('Connected', 'my-plugin')
								: '○ ' + __('Not configured', 'my-plugin')}
						</p>
					</CardBody>
				</Card>

				<Card className="myplugin-card">
					<CardBody>
						<h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#757575' }}>
							{__('Version', 'my-plugin')}
						</h3>
						<p style={{ margin: 0, fontSize: '16px' }}>
							{window.myPluginData?.version}
						</p>
					</CardBody>
				</Card>
			</div>

			<Card className="myplugin-card" style={{ marginTop: '16px' }}>
				<CardBody>
					<h2>{__('Getting Started', 'my-plugin')}</h2>
					<ol>
						<li>{__('Configure your API key in Settings.', 'my-plugin')}</li>
						<li>{__('Create your first item in the Items tab.', 'my-plugin')}</li>
						<li>{__('Customize the plugin to fit your needs.', 'my-plugin')}</li>
					</ol>
				</CardBody>
			</Card>
		</div>
	);
}
