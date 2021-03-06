<?php
	function portal($conexion){
		//Contenido principal
		echo "
			<div class='contenedor mid column'>
		";
		portal_contenidoPrincipal($conexion);
		echo "
			</div>
		";
		
		//Contenido izquierda superior
		echo "
			<div class='contenedor left top box'>
		";
		portal_contenidoSI($conexion);
		echo "
			</div>
		";
		
		//Contenido izquierda inferior
		echo "
			<div class='contenedor left bot box'>
		";
		portal_contenidoII($conexion);
		echo "
			</div>
		";
		
		//Contenido derecha superior
		echo "
			<div class='contenedor right column'>
		";
		portal_contenidoD($conexion);
		echo "
			</div>
		";
	}
	
	
	/**
	 * FUNCION DE CONTENIDO
	 * funcion que nos genera el contenido principal del portal
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function portal_contenidoPrincipal($conexion){
		echo "<p class='enfasis'>Partidas Activas</p>";
		partidas_listado($conexion,true);
	}
	
	
	/**
	 * FUNCION DE CONTENIDO
	 * funcion que nos genera el contenido superior izquierdo del portal
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function portal_contenidoSI($conexion){
		echo "
			<p class='enfasis alignCenter'>
				<img class='avatarUser' src='".avatar($conexion)."'/><br/>
				Bienvenido ".$_SESSION['nickname']."
			</p>
		";
	}
	
	
	/**
	 * FUNCION DE CONTENIDO
	 * funcion que nos genera el contenido inferior izquierdo del portal
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function portal_contenidoD($conexion){
		amigos($conexion,true);
	}
	
	
	/**
	 * FUNCION DE CONTENIDO
	 * funcion que nos genera el contenido superior derecho del portal
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function portal_contenidoII($conexion){
		echo "<p class='enfasis'>Buzón</p>";
		$uv = ultimaVisita($conexion);
		buzon_portalInbox($conexion,$uv);
	}
?>