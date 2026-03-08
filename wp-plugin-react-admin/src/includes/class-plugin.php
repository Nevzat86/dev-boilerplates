<?php
namespace MyPlugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Plugin {

	private static $instance = null;

	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		// Admin.
		if ( is_admin() ) {
			new Admin();
		}

		// REST API.
		new Rest_API();

		// Custom Post Types.
		new CPT();

		// Public-facing hooks.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_public_assets' ) );
	}

	public function enqueue_public_assets() {
		// Uncomment to load public-facing assets:
		// wp_enqueue_style(
		//     'myplugin-public',
		//     MYPLUGIN_URL . 'src/assets/public.css',
		//     array(),
		//     MYPLUGIN_VERSION
		// );
	}

	public static function activate() {
		// Create database tables, set default options, etc.
		$defaults = array(
			'myplugin_version'     => MYPLUGIN_VERSION,
			'myplugin_installed'   => time(),
			'myplugin_settings'    => Settings::get_defaults(),
		);

		foreach ( $defaults as $key => $value ) {
			if ( false === get_option( $key ) ) {
				add_option( $key, $value );
			}
		}

		// Flush rewrite rules for CPTs.
		CPT::register_post_types();
		flush_rewrite_rules();
	}

	public static function deactivate() {
		flush_rewrite_rules();
	}
}
