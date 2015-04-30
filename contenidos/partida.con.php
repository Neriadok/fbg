<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/partida.inc.php';
	
	sesion_segura();
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Registramos que el usuario esta activo
		actividad($conexion);
		
		$datos = json_decode(file_get_contents('php://input'),true);
		
		
		//Si recibimos Partida como parámetro significa que queremos obtener los datos de la misma.
		if(isset($datos['ejercito'])){
			//Filtramos datos
			$ejercito = preg_replace("/[^0-9]+/", "", $datos['ejercito']);
			
			//Si se ha enviado peticion de elegir una lista lo registramos.
			if(isset($datos['elegirLista'])){
				//Filtramos datos
				$lista = preg_replace("/[^0-9]+/", "", $datos['elegirLista']);
				$partida = preg_replace("/[^0-9]+/", "", $datos['partida']);
				
				partida_registrarLista($conexion, $partida, $ejercito, $lista);
			}
			
			//Devolvemos los datos de la partida
			partida_datosPartida($conexion,$ejercito);
		}
		
		//Si recibimos datos para elegir lista procedemos.
		else if(isset($datos['elegirListaPts'])){
			//Filtramos datos
			$elegirListaPts = preg_replace("/[^0-9]+/", "", $datos['elegirListaPts']);
			
			//Devolvemos un listado de las listas con menor puntuacion de la requerida.
			partida_listadoListas($conexion,$elegirListaPts);
		}
		
		else if(isset($datos['situacionPartida'])){
			//Filtramos datos
			$partida = preg_replace("/[^0-9]+/", "", $datos['situacionPartida']);
			$ejercito = preg_replace("/[^0-9]+/", "", $datos['situacionEjercito']);
			$fase = preg_replace("/[^0-9]+/", "", $datos['fase']);
			
			//Devolvemos la situacion de la partida.
			partida_situacion($conexion, $fase, $ejercito, $partida);
		}
	}
	
	//Si no se esta logueado mostramos el contenido por defecto.
	else {
		defaultContent($msgR);
	}
?>