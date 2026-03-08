<?php
/**
 * Plugin Name:       My Plugin
 * Plugin URI:        https://example.com/my-plugin
 * Description:       A WordPress plugin with a React-powered admin panel.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Your Name
 * Author URI:        https://example.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       my-plugin
 * Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MYPLUGIN_VERSION', '1.0.0' );
define( 'MYPLUGIN_FILE', __FILE__ );
define( 'MYPLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MYPLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Autoload classes.
require_once MYPLUGIN_DIR . 'src/includes/class-plugin.php';
require_once MYPLUGIN_DIR . 'src/includes/class-admin.php';
require_once MYPLUGIN_DIR . 'src/includes/class-settings.php';
require_once MYPLUGIN_DIR . 'src/includes/class-rest-api.php';
require_once MYPLUGIN_DIR . 'src/includes/class-cpt.php';

// Initialize plugin.
add_action( 'plugins_loaded', array( 'MyPlugin\\Plugin', 'init' ) );

// Activation / Deactivation hooks.
register_activation_hook( __FILE__, array( 'MyPlugin\\Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'MyPlugin\\Plugin', 'deactivate' ) );
