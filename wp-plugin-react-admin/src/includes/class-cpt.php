<?php
namespace MyPlugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class CPT {

	const POST_TYPE = 'myplugin_item';

	public function __construct() {
		add_action( 'init', array( __CLASS__, 'register_post_types' ) );
	}

	public static function register_post_types() {
		$labels = array(
			'name'               => __( 'Items', 'my-plugin' ),
			'singular_name'      => __( 'Item', 'my-plugin' ),
			'add_new'            => __( 'Add New', 'my-plugin' ),
			'add_new_item'       => __( 'Add New Item', 'my-plugin' ),
			'edit_item'          => __( 'Edit Item', 'my-plugin' ),
			'new_item'           => __( 'New Item', 'my-plugin' ),
			'view_item'          => __( 'View Item', 'my-plugin' ),
			'search_items'       => __( 'Search Items', 'my-plugin' ),
			'not_found'          => __( 'No items found', 'my-plugin' ),
			'not_found_in_trash' => __( 'No items found in trash', 'my-plugin' ),
		);

		register_post_type( self::POST_TYPE, array(
			'labels'              => $labels,
			'public'              => false,
			'show_ui'             => false, // Managed via React admin
			'show_in_rest'        => true,
			'rest_base'           => 'myplugin-items',
			'capability_type'     => 'post',
			'supports'            => array( 'title', 'editor', 'custom-fields' ),
			'has_archive'         => false,
			'rewrite'             => false,
		) );
	}
}
