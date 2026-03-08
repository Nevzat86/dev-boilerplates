import { useState, useEffect, useCallback } from '@wordpress/element';
import {
	Card,
	CardBody,
	TextControl,
	TextareaControl,
	Button,
	Spinner,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { api } from '../api';

export function Items() {
	const [items, setItems] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [notice, setNotice] = useState(null);

	// New item form.
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [creating, setCreating] = useState(false);

	const loadItems = useCallback(async () => {
		setLoading(true);
		try {
			const result = await api.getItems(page, 10);
			setItems(result.items);
			setTotal(result.total);
			setTotalPages(result.totalPages);
		} catch {
			setNotice({ type: 'error', message: __('Failed to load items.', 'my-plugin') });
		} finally {
			setLoading(false);
		}
	}, [page]);

	useEffect(() => {
		loadItems();
	}, [loadItems]);

	const handleCreate = async () => {
		if (!title.trim()) return;

		setCreating(true);
		setNotice(null);

		try {
			await api.createItem({ title: title.trim(), content });
			setTitle('');
			setContent('');
			setNotice({ type: 'success', message: __('Item created.', 'my-plugin') });
			loadItems();
		} catch {
			setNotice({ type: 'error', message: __('Failed to create item.', 'my-plugin') });
		} finally {
			setCreating(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm(__('Delete this item?', 'my-plugin'))) return;

		try {
			await api.deleteItem(id);
			setNotice({ type: 'success', message: __('Item deleted.', 'my-plugin') });
			loadItems();
		} catch {
			setNotice({ type: 'error', message: __('Failed to delete item.', 'my-plugin') });
		}
	};

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
					<h2>{__('Add New Item', 'my-plugin')}</h2>
					<div className="myplugin-form-row">
						<TextControl
							label={__('Title', 'my-plugin')}
							value={title}
							onChange={setTitle}
							placeholder={__('Enter item title...', 'my-plugin')}
						/>
					</div>
					<div className="myplugin-form-row">
						<TextareaControl
							label={__('Content', 'my-plugin')}
							value={content}
							onChange={setContent}
							placeholder={__('Optional description...', 'my-plugin')}
							rows={3}
						/>
					</div>
					<Button
						variant="primary"
						onClick={handleCreate}
						isBusy={creating}
						disabled={creating || !title.trim()}
					>
						{creating ? __('Creating...', 'my-plugin') : __('Add Item', 'my-plugin')}
					</Button>
				</CardBody>
			</Card>

			<Card className="myplugin-card">
				<CardBody>
					<h2>
						{__('Items', 'my-plugin')}
						<span style={{ fontWeight: 'normal', color: '#757575', marginLeft: '8px' }}>
							({total})
						</span>
					</h2>

					{loading ? (
						<div style={{ padding: '20px', textAlign: 'center' }}>
							<Spinner />
						</div>
					) : items.length === 0 ? (
						<div className="myplugin-empty">
							<p>{__('No items yet. Create your first one above.', 'my-plugin')}</p>
						</div>
					) : (
						<>
							<table className="myplugin-items-table">
								<thead>
									<tr>
										<th>{__('ID', 'my-plugin')}</th>
										<th>{__('Title', 'my-plugin')}</th>
										<th>{__('Date', 'my-plugin')}</th>
										<th>{__('Actions', 'my-plugin')}</th>
									</tr>
								</thead>
								<tbody>
									{items.map((item) => (
										<tr key={item.id}>
											<td>{item.id}</td>
											<td>{item.title}</td>
											<td>{new Date(item.date).toLocaleDateString()}</td>
											<td>
												<Button
													variant="link"
													isDestructive
													onClick={() => handleDelete(item.id)}
												>
													{__('Delete', 'my-plugin')}
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{totalPages > 1 && (
								<div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
									<Button
										variant="secondary"
										disabled={page <= 1}
										onClick={() => setPage((p) => p - 1)}
									>
										{__('Previous', 'my-plugin')}
									</Button>
									<span style={{ padding: '6px 12px', color: '#757575' }}>
										{page} / {totalPages}
									</span>
									<Button
										variant="secondary"
										disabled={page >= totalPages}
										onClick={() => setPage((p) => p + 1)}
									>
										{__('Next', 'my-plugin')}
									</Button>
								</div>
							)}
						</>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
