<?php
namespace MyPlugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Admin {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu_pages' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	public function add_menu_pages() {
		add_menu_page(
			__( 'My Plugin', 'my-plugin' ),
			__( 'My Plugin', 'my-plugin' ),
			'manage_options',
			'my-plugin',
			array( $this, 'render_admin_page' ),
			'dashicons-admin-generic',
			30
		);

		add_submenu_page(
			'my-plugin',
			__( 'Dashboard', 'my-plugin' ),
			__( 'Dashboard', 'my-plugin' ),
			'manage_options',
			'my-plugin',
			array( $this, 'render_admin_page' )
		);

		add_submenu_page(
			'my-plugin',
			__( 'Settings', 'my-plugin' ),
			__( 'Settings', 'my-plugin' ),
			'manage_options',
			'my-plugin-settings',
			array( $this, 'render_admin_page' )
		);
	}

	public function render_admin_page() {
		// Capability check.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'my-plugin' ) );
		}

		echo '<div id="myplugin-admin-root"></div>';
	}

	public function enqueue_admin_assets( $hook ) {
		// Only load on our plugin pages.
		if ( strpos( $hook, 'my-plugin' ) === false ) {
			return;
		}

		$asset_file = MYPLUGIN_DIR . 'build/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		wp_enqueue_script(
			'myplugin-admin',
			MYPLUGIN_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			'myplugin-admin',
			MYPLUGIN_URL . 'build/index.css',
			array( 'wp-components' ),
			$asset['version']
		);

		wp_localize_script( 'myplugin-admin', 'myPluginData', array(
			'restUrl'  => esc_url_raw( rest_url( 'my-plugin/v1/' ) ),
			'nonce'    => wp_create_nonce( 'wp_rest' ),
			'adminUrl' => admin_url(),
			'version'  => MYPLUGIN_VERSION,
		) );
	}
}
