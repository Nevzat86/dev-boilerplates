<?php
namespace MyPlugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Settings {

	const OPTION_KEY = 'myplugin_settings';

	public static function get_defaults() {
		return array(
			'api_key'              => '',
			'enable_feature_x'     => false,
			'items_per_page'       => 10,
			'notification_email'   => '',
			'theme'                => 'light',
		);
	}

	public static function get_all() {
		$defaults = self::get_defaults();
		$saved    = get_option( self::OPTION_KEY, array() );

		return wp_parse_args( $saved, $defaults );
	}

	public static function get( $key, $default = null ) {
		$settings = self::get_all();

		return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
	}

	public static function update( $new_settings ) {
		$defaults = self::get_defaults();
		$current  = self::get_all();

		// Only allow known keys.
		$sanitized = array();
		foreach ( $defaults as $key => $default_value ) {
			if ( isset( $new_settings[ $key ] ) ) {
				$sanitized[ $key ] = self::sanitize_value( $key, $new_settings[ $key ], $default_value );
			} else {
				$sanitized[ $key ] = $current[ $key ];
			}
		}

		return update_option( self::OPTION_KEY, $sanitized );
	}

	private static function sanitize_value( $key, $value, $default ) {
		if ( is_bool( $default ) ) {
			return (bool) $value;
		}

		if ( is_int( $default ) ) {
			return absint( $value );
		}

		if ( $key === 'notification_email' ) {
			return sanitize_email( $value );
		}

		if ( $key === 'api_key' ) {
			return sanitize_text_field( $value );
		}

		if ( $key === 'theme' && in_array( $value, array( 'light', 'dark', 'system' ), true ) ) {
			return $value;
		}

		return sanitize_text_field( $value );
	}
}
