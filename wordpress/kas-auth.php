<?php
/**
 * Plugin Name: KAS App – nhận mật khẩu ứng dụng
 * Description: Hosting bỏ mất header Authorization nên WordPress không thấy mật khẩu ứng dụng. App KAS gửi kèm header X-KAS-Auth; file này chuyển lại cho WordPress tự kiểm tra như bình thường (sai mật khẩu vẫn bị từ chối).
 * Cài: tải file lên wp-content/mu-plugins/ (chưa có thư mục mu-plugins thì tạo). Không cần bật, WordPress tự chạy.
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
