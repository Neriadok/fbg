<?php
	/**
	 * Funciones PHP que usaremos para defender la web de:
	 * SQL Injections
	 * Session Hijacking
	 * Network Eavesdropping
	 * Cross Site Scripting
	 * Brute Force Attacks
	 *
	 * También se incluyen funciones usadas a lo largo de toda la web.
	 *
	 * @author Daniel Martín Díaz
	 * Este código es una personalización con ligeras variaciones del código desarrollado por Oscaravila2, Oscar Avila, DXTER.
	 * Mis felicitaciones.
	 */
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función para establecer una sesión PHP segura.
	 */
	function sesion_segura() {
		/** Establecemos un nombre para la sesión.*/
		$session_name = "FBG";
		$secure = SECURE;
	
		/** Con esta variable evitaremos que Java Script acceda a los detalles de la sessión.*/
		$httponly = true;
	
		/** Obligamos a las sesiones a utilizar exclusivamente cookies.*/
		if (ini_set('session.use_only_cookies', 1) === FALSE) {
			header('Location: portal.php?error=3');
			exit();
		}
	
		/** Recogemos los parámetros de las cookies y añadimo las variables que hemos definido.*/
		/** Linea suprimida de forma indefinida debido a un error inesperado.*/
		//$cookieParams = session_get_cookie_params();
		//session_set_cookie_params($cookieParams["lifetime"],$cookieParams["path"],$cookieParams["domain"],$secure,$httponly);
	
		/** Establecemos el nombre de sesion que habiamos definido.*/
		session_name($session_name);
		/** Iniciamos sesión PHP.*/
		session_start();
		/** Regeneramos sesión, de modo que borramos la sesión previa.*/
		session_regenerate_id();
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que registra en la base de datos que el usuario está activo.
	 * Esta información es util para indicar a otros usuarios si el usuario en cuestion está activo o no.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function actividad($conexion){
		/** Indicamos en la base de datos que estamos teniendo actividad en la página */
		if(isset($_SESSION['userId'])){
			$sentencia = $conexion -> prepare("CALL proceso_actividad(?)");
			$sentencia -> bind_param('i',$_SESSION['userId']);
			$sentencia -> execute();
			$sentencia -> close();
		}
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que hace un login seguro. Para ello decodifica la contraseña a partir de su salt.
	 * La salt es la hueya del String que surge al concatenar password y la hueya de un valor único,
	 * de modo que será única para cada usuario. Eso evita que, en caso de que se vulnere la seguridad de un usuario,
	 * la totalidad de la base de datos no se vea vulnerable (Una cadena suele ser tan debil como su eslabón mas debil)
	 * 
	 * @param $nickname String - Nickname del usuario.
	 * @param $password String - Contraseña codificada recibida.
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @return boolean si el login es correcto devolverá true.
	 */
	function login($nickname, $password, $conexion) {
		/**
		 * Debido a mi paranoia, No solo recurro al uso de sentencias preparadas,
		 * si no que en añadido, la conexión de usuarios solo tiene premitido lanzar
		 * procedures, previamente diseñados en la base MySQL.
		 *
		 * Esto evitará que el usuario pueda lanzar una query que no hayamos previsto.
		 *
		 * Lo primero que hacemos es preparar la llamada al procedure.
		 */
		$sentencia = $conexion -> prepare("CALL proceso_getUserLogData(?)");
	
		/** Sustituimos en la llamada por el String Nickname.*/
		$sentencia -> bind_param('s', $nickname);
		 
		/** Ejecutamos y guaramos el resultado.*/
		if ($sentencia -> execute()){
			$sentencia -> store_result();
		 
			if($sentencia -> num_rows == 1){
				/** Si no existieran entradas con ese nickname devolvería false.*/
				/** Establecemos las columnas del resultado en variables */
				$sentencia -> bind_result($userId, $nickname, $db_password, $salt, $tipoUser);
				$sentencia -> fetch();
	
				/**
				 * Hacemos un cifrado de la contraseña en base al String "sha512"
				 * con la concatenación de la salt única del usuario.
				 *
				 * De esta manera ponemos una traba adicional a la hora de
				 * desencriptar su contraseña.
				 */
				$password = hash('sha512', $password . $salt);
				if ($sentencia -> num_rows == 1) {
					$sentencia -> close();
					 
					/** Comprobamos si el usuario está bloqueado debido a un exceso de intentos de inicio de sesión.*/
					if (!checkbrute($userId, $conexion)){
						/** Evaluamos la password del usuario y la enviada en el formulario. */
						if ($db_password == $password) {
		      
							/** Si el inicio de sesion es exitoso, introducimos un log correcto en la base de datos.*/
							$sentencia = $conexion -> prepare("CALL proceso_newLog(?,now(),true)");
							$sentencia -> bind_param('i', $userId);
							$sentencia -> execute();
							$sentencia -> close();
								
							/** Obtenemos el agente del usuario. */
							$user_browser = $_SERVER['HTTP_USER_AGENT'];
		      
							/** Aplicamos proteccion XSS tanto al id del usuario como a su nickname. */
							$userId = preg_replace("/[^0-9]+/", "", $userId);
							$tipoUser = preg_replace("/[^0-9]+/", "", $tipoUser);
							$nickname = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $nickname);
		      
							/** Establecemos un login de sessión encriptado. */
							$esl = hash('sha512', $password . $user_browser);
		      
							$_SESSION['userId'] = $userId;
							$_SESSION['tipoUser'] = $tipoUser;
							$_SESSION['nickname'] = $nickname;
							$_SESSION['login_string'] = $esl;
	      
							if($tipoUser > 0){
								return true;
							}
						}
						else {
							/** Si la contraseña fuera incorrecta, introducimos un log fallido en la base de datos.*/
							$sentencia = $conexion -> prepare("CALL proceso_newLog(?,now(),false)");
							$sentencia->bind_param('i', $userId);
							$sentencia->execute();
							$sentencia->close();
						}
					}
				}
			}
		}
		return false;
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCION GETTER
	 * Función que comprueba si se está realizando un Brute Force Attack.
	 * Evaluamos que se produzcan más de 5 intentos en un plazo inferior a
	 * 2 horas.
	 * 
	 * @param $userId integer unsigned - Id de el usuario que se intenta conectar.
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @return boolean devuelve true si se está produciendo el ataque de fuerza bruta.
	 */
	function checkbrute($userId, $conexion) {

		/** 
		 * Comprobamos la conexión y preparamos la ejecución del proceso intentosLog
		 * Este nos devolverá la cantidad de intentos del usuario realizados tras $hace2horas
		 */
		$sentencia = $conexion -> prepare("CALL proceso_intentosLog(?,(now()-(2*60*60)))");
	
		$sentencia->bind_param('i', $userId);
	
		/** Ejecutamos el procedure*/
		if ($sentencia -> execute()){
			$sentencia -> store_result();
			$sentencia -> bind_result($numeroIntentos);
			$sentencia -> fetch();
	
			/** Si nos devuelve más de cinco intentos, indicamos que hubo brute force attack.*/
			if ($numeroIntentos >= 5) {

				$sentencia -> close();
				return true;
			}
		}
		$sentencia -> close();
		return false;
	}


	/**
	 * FUNCIÓN DE EJECUCIÓN GETTER
	 * Función  que comprueba si el usuario está logueado a través de su sesión.
	 * Un usuario puede conectarse a través de diferentes navegadores y serían sesiones diferentes.
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @return boolean
	 */
	function login_check($conexion) {
		/** Comprobamos que toda las variables de sesión estén declaradas.*/
		if (isset($_SESSION['userId'], $_SESSION['login_string'], $_SESSION['tipoUser'])) {
			$userId = $_SESSION['userId'];
			$login_string = $_SESSION['login_string'];
			$tipoUser = $_SESSION['tipoUser'];
				
			/** Obtenemos el agente del usuario. */
			$user_browser = $_SERVER['HTTP_USER_AGENT'];
				
			$sentencia = $conexion -> prepare("CALL proceso_checkPwd(?)");
			/** Pasamos el usuario como parámetro y ejecutamos*/
			$sentencia -> bind_param('i', $userId);
			if($sentencia -> execute()){
				$sentencia -> store_result();
	
				if ($sentencia -> num_rows == 1) {
					/** Si el usuario existe obtenemos las variables del resultado.*/
					$sentencia -> bind_result($password);
					$sentencia -> fetch();
						
					$login_check = hash('sha512', $password . $user_browser);
	
					if ($login_check == $login_string && $tipoUser>0) {
						$sentencia -> close();
						return true;
					}
	
					$sentencia -> close();
				}
			}
		}
		/** Si no se dieran todas las condiciones anteriores, devolvemos false.*/
		return false;
	}

	
	/**
	 * FUNCIÓN DE EJECUCIÓN GETTER
	 * Función que evita las inyecciones de sql en la url.
	 * 
	 * @param $url String - url que será escapada.
	 * @return String retorna el valor escapado de la url.
	 */
	function esc_url($url) {
	
		if ('' == $url) {
			return $url;
		}
	
		$url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);
	
		$strip = array('%0d', '%0a', '%0D', '%0A');
		$url = (string) $url;
	
		$count = 1;
		while ($count) {
			$url = str_replace($strip, '', $url, $count);
		}
	
		$url = str_replace(';//', '://', $url);
	
		$url = htmlentities($url);
	
		$url = str_replace('&amp;', '&#038;', $url);
		$url = str_replace("'", '&#039;', $url);
	
		if ($url[0] !== '/') {
			/** Solo nos interesan los enlaces relativos de  $_SERVER['PHP_SELF']*/
			return '';
		} else {
			return $url;
		}
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN GETTER
	 * Función sencilla que sustitulle las etiquetas br por lineas en blanco nuevas.
	 * Tiene utilidad para elementos como los textarea que tienen contenidos generados
	 * desde el sitio.
	 * 
	 * @param $string String al que se aplica la sustitución.
	 * @return String Retorna el String ya reemplazado.
	 */
	function br2nl( $string ){
		$string = preg_replace('/\r\n/i', "", $string);
		$string = preg_replace('/\<br(\s*)?\/?\>/i', "\r\n", $string);
		return $string;
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN GETTER
	 * funcion que extrae la extension de un archivo.
	 * Tiene utilidad para la subida de ficheros
	 * a fin de renombrar los archivos tmp.
	 * 
	 * @param $fileName String - nombre completo del fichero.
	 * @return retorna la extensión del fichero en cuestion.
	 */
	function fileExtension($fileName){
		return end(explode(".", $fileName));
	}


	/**
	 * FUNCIÓN DE EJECUCIÓN GETTER
	 * Función que comprueba si una fecha es más reciente que otra.
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 * @param $fecha1 Datetime - Fecha que se quiere evaluar
	 * @param $fecha2 Datetime - Fecha de referencia
	 * @return bolean retorna true si la primera fecha es igual o mayor que la primera.
	 */
	function masNuevo($conexion,$fecha1,$fecha2){
		if($fecha1>=$fecha2){
			return true;
		}
		else{
			return false;
		}
	}
?>