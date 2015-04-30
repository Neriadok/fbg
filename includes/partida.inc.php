<?php


	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que muestra un contenido u otro en función de la partida, el usuario logueado y el ejercito.
	 * Para ello testea la URL en que nos encontramos llegando incluso a añadir faltas a un usuario
	 * que intente acceder a una partida para la que no tiene permisos.
	 *
	 *  @param $conexion Mysqli - Conexion a base de datos.
	 */
	function partida($conexion){
		partida_content($conexion);
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra la interfaz de juego de FBG.
	 * 
	 *  @param $conexion Mysqli - Conexion a base de datos.
	 */
	function partida_content($conexion){
		echo "
			<div id='interfaz'>
				<div id='columnaInfo' class='alignCenter'>
					<a href='partidas.php'>
						<img id='matchAvatar' src='".avatar($conexion)."'/>
					</a>
								
					<div id='datos'>
		";
		partida_datosPartida($conexion,null);
		echo "
					</div>
								
					<table>
						<tr>
							<td colspan='2' class='subtitle'>CAMARA:</td>
						</tr>
						<tr>
							<td colspan='2' id='zoom' class='white'></td>
						</tr>
						<tr>
							<td colspan='2' class='subtitle'>CURSOR</td>
						</tr>
						<tr>
							<td id='cursorX' class='white'>X: --</td>
							<td id='cursorY' class='white'>Y: --</td>
						</tr>
					</table>
					<div id='textofase'></div>
					<div id='panelout' class='white'></div>
				</div>
				<div id='columnaPrincipal'>
					<div id='contenidoPrincipal'>
						<div id='game'>
							<canvas id='batalla'>
								No se pudo cargar el canvas de juego. Esto puede deberse a que tu navegador esté obsoleto o no lo tolere. Recomendamos el uso de Google Chrome o Mozilla Firefox.
							</canvas>
							<img id='terreno' src='src/mapas/mapa.jpg' />
						</div>
					</div>
					<div id='desplegable'>
						<div id='cabecera' class='alignCenter enfasis'>Detalles</div>
						<div id='panel'>
							<div id='panelin'></div>
							<div id='datosSeleccion'></div>
							<div id='panelfase'></div>
						</div>
					</div>
				</div>
			</div>
		";
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra filas de tabla con los datos básicos de una partida. 
	 * Cabe decir que la vista obtenida depende del ejercito con que se juegue
	 * (Acorde al universo de discurso yo no vería lo mismo que mi adversario).
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $ejercito integer - Id que identifica el ejercito del jugador en una partida. 
	 */
	function partida_datosPartida($conexion,$ejercito){
		echo "<table class='alignCenter'>";
		if($ejercito != null){
			
			$sentencia = $conexion -> prepare("CALL proceso_datosPartida(?)");
			$sentencia -> bind_param('i', $ejercito);
			$sentencia -> execute();
			$sentencia -> store_result();
			if($sentencia -> num_rows == 1){
				/** Si no existieran entradas con ese nickname devolvería false.*/
				/** Establecemos las columnas del resultado en variables */
				$sentencia -> bind_result(
					$ejercitoId
					,$usuario
					,$partidaId
					,$orden
					,$nickEnemigo
					,$ejercitoNombre
					,$listaId
					,$pts
					,$turnos
					,$fase
					,$ordenFase
					,$fechaInicio
					,$faseFinalizada
				);
				$sentencia -> fetch();
			}
			else{
				//En caso de error regresamos al listado de partidas
				header("Location: partidas.php");
			}
			
			/** Comprobamos que el usuario tiene permiso para acceder a estos datos**/
			if($usuario == $_SESSION['userId']){
				echo "
					<tr>
						<td colspan='2' class='enfasis' id='ejercitoNombre'>$ejercitoNombre</td>
					</tr>
					<tr>
						<td colspan='2' class='enfasis subtitle'>Partida a $pts puntos</td>
					</tr>
					<tr>
						<td colspan='2' class='enfasis subtitle'>contra $nickEnemigo</td>
					</tr>
					<tr>
						<td class='alignRight subtitle'>Orden</td>
						<td id='userorder' class='alignLeft white'>$orden</td>
					</tr>
					<tr>
						<td class='alignRight subtitle'>Turno</td>
						<td id='turno' class='alignLeft white'>$turnos</td>
					</tr>
					<tr>
						<td class='alignRight subtitle'>Fase</td>
						<td id='fase' class='alignLeft white'>
				";
				/**Si la ultima fase del usuario está terminada indicamos que es el turno del enemigo.*/
				if($faseFinalizada){
					echo "Fase del Enemigo.";
				}
				else{
					echo $fase;
				}
				
				echo "
						</td>
					</tr>
						
					<tr class='oculto'>
						<td>
							<input type='hidden' id='partidaId' value='$partidaId'/>
							<input type='hidden' id='ejercitoId' value='$ejercitoId'/>
							<input type='hidden' id='ordenFase' value='$ordenFase'/>
							<input type='hidden' id='pts' value='$pts'/>
						</td>
					</tr>
				";
				$sentencia -> close();
			}
			
			/**En caso de no tener permisos le añadimos 2 faltas**/
			else{
				$sentencia -> close();
				addFaltaUser($conexion, $_SESSION['userId']);
				addFaltaUser($conexion, $_SESSION['userId']);
			}
		}
		
		else{
			echo "
					<tr class='oculto'>
						<td colspan='2' class='enfasis' id='ejercitoNombre'></td>
					</tr>
					<tr class='oculto'>
						<td colspan='2' class='enfasis subtitle'></td>
					</tr>
					<tr class='oculto'>
						<td colspan='2' class='enfasis subtitle'></td>
					</tr>
					<tr class='oculto'>
						<td>Orden</td>
						<td id='userorder'></td>
					</tr>
					<tr class='oculto'>
						<td>Turno</td>
						<td id='turno'></td>
					</tr>
					<tr class='oculto'>
						<td>Fase</td>
						<td id='fase'>
						</td>
					</tr>
						
					<tr class='oculto'>
						<td>
							<input type='hidden' id='partidaId' value=''/>
							<input type='hidden' id='ejercitoId' value=''/>
							<input type='hidden' id='pts' value=''/>
						</td>
					</tr>
			";
		}
		echo "</table>";
	}
	
	
	/**
	 * FUNCION DE CONTENIDO
	 * Función que muestra un listado de todas las listas de ejercito de que dispone un jugador cuya puntuación sea
	 * inferior o igual a unos puntos indicados.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $pts integer - Puntos máximos que puede tener ele ejercito
	 */
	function partida_listadoListas($conexion,$pts){
		echo "
			<p class='subtitle alignLeft'>
				Elige una Lista para jugar la partida o crea una nueva:<br/>
			</p>
			<form method='POST' id='listas' class='scrollingBox'>
				<table id='listasContent' class='scrollingBoxContent'>
		";
		
		$sentencia = $conexion -> prepare("CALL proceso_listasUsuarioPts(?,?)");
		$sentencia -> bind_param('ii', $_SESSION['userId'], $pts);
		$sentencia -> execute();
		$sentencia -> store_result();
		if ($sentencia -> num_rows > 0) {
			$sentencia -> bind_result($lId,$lNombre,$lPts,$lNumTropas);
			$i=0;
			while($sentencia -> fetch()){
				echo "<tr class='lista";
				if($i%2==0){
					echo " pairRow";
				}
				else{
					echo " inpairRow";
				}
			
				echo "
					'>
						<td id='$lId' class='alignCenter'>
							$lNombre<br/>
							$lPts puntos - $lNumTropas tropas
							<input id='nombreLista$lId' type='hidden' value='$lNombre'/>
							<input id='ptsLista$lId' type='hidden' value='$lPts'/>
							<input id='tropasLista$lId' type='hidden' value='$lNumTropas'/>
						</td>
					</tr>
				";
				$i++;
			}
		}
		else{
			echo "
				<tr>
					<td class='Enfasis'>
						No tienes ninguna lista para la puntuación requerida.
					</td>
				</tr>
			";
		}
		echo "
				<tr>
					<td><a href='listas.php'>Ir a la sección de listas.</a></td>
				</tr>
				</table>
			</form>
			<div id='listasMoving' class='scrollingBoxMoving'>
				<div id='listasMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='listasMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='listasMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que registra cuando se ha elegido una lista de ejercito para un ejercito concreto.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $ejercito integer - Id que identifica el ejercito del jugador en una partida. 
	 * @param $lista integer - Id de la lista que ha seleccionado el jugador. 
	 */
	function partida_registrarLista($conexion,$partida,$ejercito,$lista){
		//Elegimos la lista
		$sentencia = $conexion -> prepare("CALL proceso_seleccionarLista(?,?)");
		$sentencia -> bind_param('ii', $ejercito, $lista);
		$sentencia -> execute();
		$sentencia -> close();
		
		//Comprobamos si nuestro adversario ha elegido ya o no
		$sentencia = $conexion -> prepare("CALL proceso_checkEjercitosPartida(?)");
		$sentencia -> bind_param('i', $partida);
		$sentencia -> execute();
		$sentencia -> store_result();
		
		if ($sentencia -> num_rows == 2) {
			//Cerramos la sentencia anterior
			$sentencia -> close();
			
			//Si ambos han elegido lista, procedemos a empezar una partida.
			$sentencia = $conexion -> prepare("CALL proceso_empezarPartida(?)");
			$sentencia -> bind_param('i', $partida);
			$sentencia -> execute();
		}
		
		$sentencia -> close();
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que comprueba la situación de una partida para un ejercito concreto.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $faseDespliegue boolean - Será true si nos encontramos en la fase de despliegue.
	 * @param $ejercito integer - Id que identifica el ejercito del jugador en una partida.
	 * @param $partida integer - Id de la partida en la que se usa dicho ejercito.
	 */
	function partida_situacion($conexion,$fase,$ejercito,$partida){
		//Comprobamos si ambos eligieron lista
		$sentencia = $conexion -> prepare("CALL proceso_checkEjercitosPartida(?)");
		$sentencia -> bind_param('i', $partida);
		$sentencia -> execute();
		$sentencia -> store_result();
		if ($sentencia -> num_rows == 2) {
			$sentencia -> close();
			if($fase == null){
				echo "
					<p class='enfasis'>Tu adversario no ha finalizado su despliegue todavía.</p>
					<p>
						Cuando la partida empieze esta aparecerá en <span class='white'>\"Turno 1\"</span>,
						en vez de <span class='white'>\"Pendiente de Empezar\".</span>
						<br/>
						Compruebalo en la seccion de partidas.<br/>
						<br/>
						<a href='partidas.php'>Ir a la seccion de partidas</a>
					</p>
				";
			}
			else{
				
				/**Es necesario comprobar si se trata de la fase de despliegue ya que aun no existiría ninguna situación.*/
				$faseDespliegue = false;
				if($fase == 0){
					$faseDespliegue = true;
				}
				partida_tropasEjercito($conexion,$faseDespliegue,$ejercito,$partida);
			}
		}
		else{
			$sentencia -> close();
			echo "
				<p class='enfasis'>Tu adversario no ha elegido lista todavía.</p>
				<p>
					Cuando la partida empieze esta aparecerá en <span class='white'>\"Turno 1\"</span>,
					en vez de <span class='white'>\"Pendiente de Empezar\".</span>
					<br/>
					Compruebalo en la seccion de partidas.<br/>
					<br/>
					<a href='partidas.php'>Ir a la seccion de partidas</a>
				</p>
			";
		}
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que lista todas las tropas de un ejercito y, de forma oculta, también las del enemigo.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $faseDespliegue boolean - Será true si nos encontramos en la fase de despliegue.
	 * @param $ejercito integer - Id que identifica el ejercito del jugador en una partida.
	 * @param $partida integer - Id de la partida en la que se usa dicho ejercito.
	 */
	function partida_tropasEjercito($conexion,$faseDespliegue,$ejercito,$partida){
		
		echo "
			<p class='enfasis alignCenter'>TROPAS</p>
			<div id='listadoTropas' class='scrollingBox'>
				<table id='listadoTropasContent' class='scrollingBoxContent'>
		";
		
		/**Debemos verificar si se trata de la fase de despliegue, ya que en la fase de despliegue aun no existen tropas desplegadas.*/
		$query = "CALL proceso_tropasEjercito(false,?,?)";
		if($faseDespliegue){
			$query = "CALL proceso_tropasEjercito(true,?,?)";
		}
		$sentencia = $conexion -> prepare($query);
		$sentencia -> bind_param('ii', $ejercito, $partida);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result(
			$tId
			, $tNombre
			, $tPts
			, $tGen
			, $tBEst
			, $tChamp
			, $tMusico
			, $tEst
			, $tTipo
			, $tRango
			, $tUnidades
			, $tHeridas
			, $tEjercito
			, $tEnCampo
			, $tEstado //Cargando, bajoCarga, enCombate, desorganizada
			, $tLatitud
			, $tAltitud
			, $tOrientacion
			, $tUnidadesFila
			, $tTropaAdoptivaId
			, $tTropaBajoAtaqueId
			, $tTropaBajoAtaqueFlanco
		);
			
		$tropaNombre = null;
		$tropaPts = null;
		$tropaGen = null;
		$tropaBEst = null;
		$tropaChamp = null;
		$tropaMusico = null;
		$tropaEst = null;
		$tropaTipo = null;
		$tropaRango = null;
		$tropaUnidades = null;
		$tropaHeridas = null;
		$tropaEjercito = null;
		$tropaEnCampo = null;
		$tropaEstado = null; //Cargando, bajoCarga, enCombate, desorganizada
		$tropaLatitud = null;
		$tropaAltitud = null;
		$tropaOrientacion = null;
		$tropaUnidadesFila = null;
		$tropaTropaAdoptivaId = null;
		$tropaTropaBajoAtaqueId = null;
		$tropaTropaBajoAtaqueFlanco = null;
			
		while($sentencia -> fetch()){
			$tropaNombre[$tId] = $tNombre;
			$tropaPts[$tId] = $tPts;
			$tropaGen[$tId] = $tGen;
			$tropaBEst[$tId] = $tBEst;
			$tropaChamp[$tId] = $tChamp;
			$tropaMusico[$tId] = $tMusico;
			$tropaEst[$tId] = $tEst;
			$tropaTipo[$tId] = $tTipo;
			$tropaRango[$tId] = $tRango;
			$tropaUnidades[$tId] = $tUnidades;
			$tropaHeridas[$tId] = $tHeridas;
			$tropaEjercito[$tId] = $tEjercito;
			$tropaEnCampo[$tId] = $tEnCampo;
			$tropaEstado[$tId] = $tEstado; //Cargando, bajoCarga, enCombate, desorganizada
			$tropaLatitud[$tId] = $tLatitud;
			$tropaAltitud[$tId] = $tAltitud;
			$tropaOrientacion[$tId] = $tOrientacion;
			$tropaUnidadesFila[$tId] = $tUnidadesFila;
			$tropaTropaAdoptivaId[$tId] = $tTropaAdoptivaId;
			$tropaTropaBajoAtaqueId[$tId] = $tTropaBajoAtaqueId;
			$tropaTropaBajoAtaqueFlanco[$tId] = $tTropaBajoAtaqueFlanco;
		}
		$sentencia -> close();
			
	
		if($tropaNombre != null){
			$row = 0;
			foreach($tropaNombre as $tropaId => $tropa){
				$row++;
				echo "<tr class='";
				
				if($row%2==0){
					echo " pairRow";
				}
				else{
					echo " inpairRow";
				}
			
				echo "
					'>
						<td class='subtitle columnaUnidades alignRight'>$tropaUnidades[$tropaId] x</td>
						<td id='selectortropa$tropaId' class='alignCenter white selectorTropa'>$tropa</td>
						<td class='oculto'>
							<div id='tropa$tropaId' class='oculto tropa
				";
				if($tropaEjercito[$tropaId]){
					echo " tropapropia";
				}
				else{
					echo " tropaenemiga";
				}
				echo "
					'>
						<table>
							<tr><td><h1 id='nombretropa$tropaId'>$tropa</h1></td></tr>
							<tr>
								<td id='ptstropa$tropaId'>$tropaPts[$tropaId]</td>
								<td id='eliminadatropa$tropaId'>no</td>
								<td id='gentropa$tropaId'>$tropaGen[$tropaId]</td>
								<td id='besttropa$tropaId'>$tropaBEst[$tropaId]</td>
								<td id='champtropa$tropaId'>$tropaChamp[$tropaId]</td>
								<td id='musicotropa$tropaId'>$tropaMusico[$tropaId]</td>
								<td id='esttropa$tropaId'>$tropaEst[$tropaId]</td>
								<td id='tipotropa$tropaId'>$tropaTipo[$tropaId]</td>
								<td id='rangotropa$tropaId'>$tropaRango[$tropaId]</td>
								<td id='miembrostropa$tropaId'>$tropaUnidades[$tropaId]</td>
								<td id='heridastropa$tropaId'>$tropaHeridas[$tropaId]</td>
								<td id='estadotropa$tropaId'>$tropaEstado[$tropaId]</td>
								<td id='latitudtropa$tropaId'>$tropaLatitud[$tropaId]</td>
								<td id='altitudtropa$tropaId'>$tropaAltitud[$tropaId]</td>
								<td id='orientaciontropa$tropaId'>$tropaOrientacion[$tropaId]</td>
								<td id='unidadesfilatropa$tropaId'>$tropaUnidadesFila[$tropaId]</td>
								<td id='tropaadoptivaidtropa$tropaId'>$tropaTropaAdoptivaId[$tropaId]</td>
								<td id='tropabajoataqueidtropa$tropaId'>$tropaTropaBajoAtaqueId[$tropaId]</td>
								<td id='tropabajoataqueflancotropa$tropaId'>$tropaTropaBajoAtaqueFlanco[$tropaId]</td>
								<td class='oculto'>
				";
				//Comprobamos si la tropa pertenece al usuario
				if($tropaEjercito[$tropaId]){
					echo "<input type='hidden' id='usertropa$tropaId' value='si'/>";
				}
				else{
					echo "<input type='hidden' id='usertropa$tropaId' value='no'/>";
				}
				
				//Comprobamos si la tropa esta en el campo de batalla
				if($tropaEnCampo[$tropaId]){
					echo "<input type='hidden' id='encampotropa$tropaId' value='si'/>";
				}
				else{
					echo "<input type='hidden' id='encampotropa$tropaId' value='no'/>";
				}
				echo "
								</td>
							</tr>
				";
				
				$sentencia = $conexion -> prepare("CALL proceso_unidadesTropaEjercito(?)");
				$sentencia -> bind_param('i', $tropaId);
				$sentencia -> execute();
				$sentencia -> store_result();
				$sentencia -> bind_result(
					$tipoRango
					,$rango
					,$representada
					,$montura
					,$dotacion
					,$maquinaria
					,$movimiento
					,$ha
					,$hp
					,$f
					,$r
					,$ps
					,$i
					,$a
					,$l
				);
						
				$j=0;
				while($sentencia -> fetch()){
					echo "<tr id='unidad".$tipoRango."tropa$tropaId' class='unidad";
					if($j%2==0){
						echo " pairRow";
					}
					else{
						echo " inpairRow";
					}
		
					echo "
						'>
							<td id='tipounidad".$tipoRango."tropa$tropaId' class='enfasis'>$tipoRango</td>
							<td id='movimientounidad".$tipoRango."tropa$tropaId' class='enfasis'>$movimiento</td>
							<td id='haunidad".$tipoRango."tropa$tropaId' class='enfasis'>$ha</td>
							<td id='hpunidad".$tipoRango."tropa$tropaId' class='enfasis'>$hp</td>
							<td id='funidad".$tipoRango."tropa$tropaId' class='enfasis'>$f</td>
							<td id='runidad".$tipoRango."tropa$tropaId' class='enfasis'>$r</td>
							<td id='psunidad".$tipoRango."tropa$tropaId' class='enfasis'>$ps</td>
							<td id='iunidad".$tipoRango."tropa$tropaId' class='enfasis'>$i</td>
							<td id='aunidad".$tipoRango."tropa$tropaId' class='enfasis'>$a</td>
							<td id='lunidad".$tipoRango."tropa$tropaId' class='enfasis'>$l</td>
							<td class='oculto'>
								<input type='hidden' id='rangounidad".$tipoRango."tropa$tropaId' value='rango'/>
								<input type='hidden' id='representadaunidad".$tipoRango."tropa$tropaId' value='representada'/>
								<input type='hidden' id='monturaunidad".$tipoRango."tropa$tropaId' value='montura'/>
								<input type='hidden' id='dotacionunidad".$tipoRango."tropa$tropaId' value='dotacion'/>
								<input type='hidden' id='maquinariaunidad".$tipoRango."tropa$tropaId' value='maquinaria'/>
							</td>
						</tr>
					";
	
					$j++;
				}
				$sentencia -> close();
				
				echo "
								</table>
							</div>
						</td>
					</tr>
				";
			}
		}
		echo "
				</table>
			</div>
			<div id='listadoTropasMoving' class='scrollingBoxMoving'>
				<div id='listadoTropasMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='listadoTropasMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='listadoTropasMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}
?>