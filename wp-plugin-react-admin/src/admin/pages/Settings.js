import { useState, useEffect } from '@wordpress/element';
import {
	Card,
	CardBody,
	TextControl,
	ToggleControl,
	SelectControl,
	Button,
	Spinner,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { api } from '../api';

export function Settings() {
	const [settings, setSettings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState(null);

	useEffect(() => {
		api.getSettings()
			.then(setSettings)
			.catch(() => setNotice({ type: 'error', message: __('Failed to load settings.', 'my-plugin') }))
			.finally(() => setLoading(false));
	}, []);

	const handleSave = async () => {
		setSaving(true);
		setNotice(null);

		try {
			const updated = await api.updateSettings(settings);
			setSettings(updated);
			setNotice({ type: 'success', message: __('Settings saved.', 'my-plugin') });
		} catch {
			setNotice({ type: 'error', message: __('Failed to save settings.', 'my-plugin') });
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div style={{ padding: '40px', textAlign: 'center' }}>
				<Spinner />
			</div>
		);
	}

	return (
		<div style={{ marginTop: '16px' }}>
			{notice && (
				<Notice
					status={notice.type}
					isDismissible
					onDismiss={() => setNotice(null)}
					style={{ marginBottom: '16px' }}
				>
					{notice.message}
				</Notice>
			)}

			<Card className="myplugin-card">
				<CardBody>
					<h2>{__('API Configuration', 'my-plugin')}</h2>
					<div className="myplugin-form-row">
						<TextControl
							label={__('API Key', 'my-plugin')}
							value={settings.api_key}
							onChange={(val) => setSettings({ ...settings, api_key: val })}
							type="password"
							help={__('Your API key is stored securely in the database.', 'my-plugin')}
						/>
					</div>
					<div className="myplugin-form-row">
						<TextControl
							label={__('Notification Email', 'my-plugin')}
							value={settings.notification_email}
							onChange={(val) => setSettings({ ...settings, notification_email: val })}
							type="email"
						/>
					</div>
				</CardBody>
			</Card>

			<Card className="myplugin-card">
				<CardBody>
					<h2>{__('Preferences', 'my-plugin')}</h2>
					<div className="myplugin-form-row">
						<ToggleControl
							label={__('Enable Feature X', 'my-plugin')}
							checked={settings.enable_feature_x}
							onChange={(val) => setSettings({ ...settings, enable_feature_x: val })}
						/>
					</div>
					<div className="myplugin-form-row">
						<TextControl
							label={__('Items Per Page', 'my-plugin')}
							value={String(settings.items_per_page)}
							onChange={(val) => setSettings({ ...settings, items_per_page: parseInt(val, 10) || 10 })}
							type="number"
							min={1}
							max={100}
						/>
					</div>
					<div className="myplugin-form-row">
						<SelectControl
							label={__('Theme', 'my-plugin')}
							value={settings.theme}
							options={[
								{ label: __('System', 'my-plugin'), value: 'system' },
								{ label: __('Light', 'my-plugin'), value: 'light' },
								{ label: __('Dark', 'my-plugin'), value: 'dark' },
							]}
							onChange={(val) => setSettings({ ...settings, theme: val })}
						/>
					</div>
				</CardBody>
			</Card>

			<Button
				variant="primary"
				onClick={handleSave}
				isBusy={saving}
				disabled={saving}
				style={{ marginTop: '8px' }}
			>
				{saving ? __('Saving...', 'my-plugin') : __('Save Settings', 'my-plugin')}
			</Button>
		</div>
	);
}
