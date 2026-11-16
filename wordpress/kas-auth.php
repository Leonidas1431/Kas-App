<?php
/**
 * Plugin Name: KAS App – nhận mật khẩu ứng dụng
 * Description: Hosting bỏ mất header Authorization nên WordPress không thấy mật khẩu ứng dụng. App KAS gửi kèm header X-KAS-Auth; file này chuyển lại cho WordPress tự kiểm tra như bình thường (sai mật khẩu vẫn bị từ chối).
 * Cài: tải file lên wp-content/mu-plugins/ (chưa có thư mục mu-plugins thì tạo). Không cần bật, WordPress tự chạy.
 * Phiên bản: 2 (16/11/2026)
 */
if ( empty( $_SERVER['PHP_AUTH_USER'] ) && empty( $_SERVER['HTTP_AUTHORIZATION'] ) && ! empty( $_SERVER['HTTP_X_KAS_AUTH'] ) ) {
	$kas_v = (string) $_SERVER['HTTP_X_KAS_AUTH'];
	if ( 0 === stripos( $kas_v, 'basic ' ) ) {
		$kas_d = base64_decode( substr( $kas_v, 6 ), true );
		if ( false !== $kas_d && false !== strpos( $kas_d, ':' ) ) {
			list( $kas_u, $kas_p )    = explode( ':', $kas_d, 2 );
			$_SERVER['PHP_AUTH_USER'] = $kas_u;
			$_SERVER['PHP_AUTH_PW']   = $kas_p;
		}
	}
	unset( $kas_v, $kas_d, $kas_u, $kas_p );
}

// Có plugin (giao diện, SEO…) hỏi "ai đang đăng nhập" quá sớm, trước khi WordPress biết đây là lệnh REST,
// thì WordPress bỏ qua mật khẩu ứng dụng. Báo trước: đường dẫn /wp-json/ hoặc ?rest_route= là lệnh REST.
add_filter( 'application_password_is_api_request', function ( $la_api ) {
	$uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
	return $la_api || false !== strpos( $uri, '/wp-json/' ) || isset( $_GET['rest_route'] );
} );

// Dấu hiệu để app kiểm tra file đã được cài.
add_action( 'rest_api_init', function () {
	if ( ! headers_sent() ) {
		header( 'X-KAS-Auth-Plugin: 2' );
	}
} );
