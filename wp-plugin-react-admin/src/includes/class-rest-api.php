<?php
namespace MyPlugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Rest_API {

	const NAMESPACE = 'my-plugin/v1';

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		// GET /wp-json/my-plugin/v1/settings
		register_rest_route( self::NAMESPACE, '/settings', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_settings' ),
			'permission_callback' => array( $this, 'admin_permission_check' ),
		) );

		// POST /wp-json/my-plugin/v1/settings
		register_rest_route( self::NAMESPACE, '/settings', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'update_settings' ),
			'permission_callback' => array( $this, 'admin_permission_check' ),
			'args'                => $this->get_settings_args(),
		) );

		// GET /wp-json/my-plugin/v1/items
		register_rest_route( self::NAMESPACE, '/items', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_items' ),
			'permission_callback' => array( $this, 'admin_permission_check' ),
			'args'                => array(
				'page'     => array(
					'type'              => 'integer',
					'default'           => 1,
					'sanitize_callback' => 'absint',
				),
				'per_page' => array(
					'type'              => 'integer',
					'default'           => 10,
					'sanitize_callback' => 'absint',
				),
			),
		) );

		// POST /wp-json/my-plugin/v1/items
		register_rest_route( self::NAMESPACE, '/items', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'create_item' ),
			'permission_callback' => array( $this, 'admin_permission_check' ),
			'args'                => array(
				'title'   => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'content' => array(
					'type'              => 'string',
					'sanitize_callback' => 'wp_kses_post',
				),
			),
		) );

		// DELETE /wp-json/my-plugin/v1/items/{id}
		register_rest_route( self::NAMESPACE, '/items/(?P<id>\d+)', array(
			'methods'             => 'DELETE',
			'callback'            => array( $this, 'delete_item' ),
			'permission_callback' => array( $this, 'admin_permission_check' ),
			'args'                => array(
				'id' => array(
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
			),
		) );
	}

	public function admin_permission_check() {
		return current_user_can( 'manage_options' );
	}

	public function get_settings() {
		return rest_ensure_response( Settings::get_all() );
	}

	public function update_settings( $request ) {
		$params = $request->get_json_params();

		if ( empty( $params ) ) {
			return new \WP_Error( 'no_data', __( 'No settings data provided.', 'my-plugin' ), array( 'status' => 400 ) );
		}

		$updated = Settings::update( $params );

		if ( ! $updated ) {
			return new \WP_Error( 'update_failed', __( 'Failed to update settings.', 'my-plugin' ), array( 'status' => 500 ) );
		}

		return rest_ensure_response( Settings::get_all() );
	}

	public function get_items( $request ) {
		$page     = $request->get_param( 'page' );
		$per_page = $request->get_param( 'per_page' );

		$args = array(
			'post_type'      => CPT::POST_TYPE,
			'posts_per_page' => $per_page,
			'paged'          => $page,
			'orderby'        => 'date',
			'order'          => 'DESC',
		);

		$query = new \WP_Query( $args );
		$items = array();

		foreach ( $query->posts as $post ) {
			$items[] = array(
				'id'      => $post->ID,
				'title'   => $post->post_title,
				'content' => $post->post_content,
				'status'  => $post->post_status,
				'date'    => $post->post_date,
			);
		}

		$response = rest_ensure_response( $items );
		$response->header( 'X-WP-Total', $query->found_posts );
		$response->header( 'X-WP-TotalPages', $query->max_num_pages );

		return $response;
	}

	public function create_item( $request ) {
		$post_id = wp_insert_post( array(
			'post_type'    => CPT::POST_TYPE,
			'post_title'   => $request->get_param( 'title' ),
			'post_content' => $request->get_param( 'content' ) ?? '',
			'post_status'  => 'publish',
		), true );

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$post = get_post( $post_id );

		return rest_ensure_response( array(
			'id'      => $post->ID,
			'title'   => $post->post_title,
			'content' => $post->post_content,
			'status'  => $post->post_status,
			'date'    => $post->post_date,
		) );
	}

	public function delete_item( $request ) {
		$id   = $request->get_param( 'id' );
		$post = get_post( $id );

		if ( ! $post || $post->post_type !== CPT::POST_TYPE ) {
			return new \WP_Error( 'not_found', __( 'Item not found.', 'my-plugin' ), array( 'status' => 404 ) );
		}

		wp_delete_post( $id, true );

		return rest_ensure_response( array( 'deleted' => true, 'id' => $id ) );
	}

	private function get_settings_args() {
		return array(
			'api_key'            => array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'enable_feature_x'   => array(
				'type' => 'boolean',
			),
			'items_per_page'     => array(
				'type'              => 'integer',
				'sanitize_callback' => 'absint',
			),
			'notification_email' => array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_email',
			),
			'theme'              => array(
				'type' => 'string',
				'enum' => array( 'light', 'dark', 'system' ),
			),
		);
	}
}
