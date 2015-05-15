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
					<table id='tablaDatos'>
						<tr>
							<td>
								<div id='datos'>
		";
		partida_datosPartida($conexion,null);
		echo "
								</div>
							</td>
							<td>
								<table>
									<tr>
										<td colspan='2' class='subtitle'>CAMARA:</td>
									</tr>
									<tr>
										<td colspan='2' class='white'><span id='zoom'></span>%</td>
									</tr>
									<tr>
										<td colspan='2' class='subtitle'>CURSOR</td>
									</tr>
									<tr>
										<td class='subtitle'>X:</td>
										<td class='subtitle'>Y:</td>
									</tr>
									<tr>
										<td id='cursorX' class='white'>--</td>
										<td id='cursorY' class='white'>--</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
					<div id='panelout' class='white'><div class='enfasis'>FANTASY BATTLE GAMES</div></div>
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
					,$faseId
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
				";
				/**Si la fase está activa mostramos el boton para finalizarla*/
				if(!$faseFinalizada){
					echo "
						<tr>
							<td colspan='2'>
								<div id='finalizarFase'>
									FINALIZAR
									<br/>FASE
									<br/><img src='src/botones/desafiar.png'/>
								</div>
							</td>
						</tr>
					";
				}
				
				echo "
					<tr class='oculto'>
						<td>
							<input type='hidden' id='partidaId' value='$partidaId'/>
							<input type='hidden' id='ejercitoId' value='$ejercitoId'/>
							<input type='hidden' id='faseId' value='$faseId'/>
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
				<tr>
					<td colspan='2' class='enfasis' id='ejercitoNombre'></td>
				</tr>
				<tr>
					<td colspan='2' class='enfasis subtitle'></td>
				</tr>
				<tr>
					<td colspan='2' class='enfasis subtitle'></td>
				</tr>
				<tr>
					<td class='alignRight subtitle'>Orden</td>
					<td id='userorder' class='alignLeft white'></td>
				</tr>
				<tr>
					<td class='alignRight subtitle'>Turno</td>
					<td id='turno' class='alignLeft white'></td>
				</tr>
				<tr>
					<td class='alignRight subtitle'>Fase</td>
					<td id='fase' class='alignLeft white'></td>
				</tr>
					
				<tr class='oculto'>
					<td>
						<input type='hidden' id='partidaId' value=''/>
						<input type='hidden' id='ejercitoId' value=''/>
						<input type='hidden' id='faseId' value=''/>
						<input type='hidden' id='ordenFase' value=''/>
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
			, $tRango
			, $tUnidades
			, $tHeridas
			, $tEjercito
			, $tEstado
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
		$tropaRango = null;
		$tropaUnidades = null;
		$tropaHeridas = null;
		$tropaEjercito = null;
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
			$tropaRango[$tId] = $tRango;
			$tropaUnidades[$tId] = $tUnidades;
			$tropaHeridas[$tId] = $tHeridas;
			$tropaEjercito[$tId] = $tEjercito;
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
						<div id='tropaDatos$tropaId' class='scrollingBox'>
							<div id='tropaDatos".$tropaId."Content' class='scrollingBoxContent'>
								<h3 id='nombretropa$tropaId' class='enfasis tropaContent'>$tropa</h3>
				";
				partida_unidadesTropa($conexion, $tropaId);
				echo "
								<table>
									<tr>
										<td class='subtitle alignRight'>Latitud: </td>
										<td class='white alignLeft' id='latitudtropa$tropaId'>$tropaLatitud[$tropaId]</td>
										<td class='subtitle alignRight'>Altitud: </td>
										<td class='white alignLeft' id='altitudtropa$tropaId'>$tropaAltitud[$tropaId]</td>
										<td class='subtitle alignRight'>Orientacion: </td>
										<td class='white alignLeft' id='orientaciontropa$tropaId'>$tropaOrientacion[$tropaId]</td>
									</tr>
								</table>
								<table class='tropaContent'>
									<tr>
				";
				
				partida_datosGeneralesTropa(
						$tropaId
						, $tropaUnidades[$tropaId]
						, $tropaPts[$tropaId]
						, $tropaRango[$tropaId]
						, $tropaGen[$tropaId]
						, $tropaBEst[$tropaId]
						, $tropaChamp[$tropaId]
						, $tropaEst[$tropaId]
						, $tropaMusico[$tropaId]
						, $tropaEjercito[$tropaId]
				);
				
				partida_datosConcretosTropa(
						$tropaId
						, $tropaHeridas[$tropaId]
						, $tropaEstado[$tropaId]
						, $tropaUnidadesFila[$tropaId]
						, $tropaTropaAdoptivaId[$tropaId]
						, $tropaTropaBajoAtaqueId[$tropaId]
						, $tropaTropaBajoAtaqueFlanco[$tropaId]
				);
				echo "
											</tr>
										</table>
									</div>
								</div>
								<div id='tropaDatos".$tropaId."Moving' class='scrollingBoxMoving'>
									<div id='tropaDatos".$tropaId."MovingUp' class='scrollingBoxMovingUp'></div>
									<div id='tropaDatos".$tropaId."MovingBar' class='scrollingBoxMovingBar'></div>
									<div id='tropaDatos".$tropaId."MovingDown' class='scrollingBoxMovingDown'></div>
								</div>
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
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra los diferentes tipos de unidad de una tropa así como sus atributos 
	 * y en un td oculto otros datos de interes.
	 * 
	 * @param $tropaId integer - Tropa a la que pertenecen las unidades.
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function partida_unidadesTropa($conexion,$tropaId){
		echo "
			<div class='tropaContent'>
				<table>
					<tr>
						<td class='atributoComponente'></td>
						<td class='atributoComponente'>M</td>
						<td class='atributoComponente'>HA</td>
						<td class='atributoComponente'>HP</td>
						<td class='atributoComponente'>F</td>
						<td class='atributoComponente'>R</td>
						<td class='atributoComponente'>PS</td>
						<td class='atributoComponente'>I</td>
						<td class='atributoComponente'>A</td>
						<td class='atributoComponente'>L</td>
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
			echo "<tr id='componente".$tipoRango."tropa$tropaId' class='componente";
			if($j%2==0){
				echo " pairRow";
			}
			else{
				echo " inpairRow";
			}
		
			echo "
				'>
					<td id='tipocomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$tipoRango</td>
					<td id='movimientocomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$movimiento</td>
					<td id='hacomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$ha</td>
					<td id='hpcomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$hp</td>
					<td id='fcomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$f</td>
					<td id='rcomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$r</td>
					<td id='pscomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$ps</td>
					<td id='icomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$i</td>
					<td id='acomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$a</td>
					<td id='lcomponente".$tipoRango."tropa$tropaId' class='atributoComponente'>$l</td>
					<td class='oculto'>
						<p class='fichatropa$tropaId'>$tipoRango</p>
						<p id='rangocomponente".$tipoRango."tropa$tropaId'>$rango</p>
			";
			
			//Solo las componentes representadas se muestran.
			if($representada){
				echo "
					<p id='representadacomponente".$tipoRango."tropa$tropaId'>si</p>
				";
			}
			else{
				echo "
					<p id='representadacomponente".$tipoRango."tropa$tropaId'>no</p>
				";
			}
			echo "
					</td>
				</tr>
			";
		
			$j++;
		}
		$sentencia -> close();
		
		echo "
				</table>
			</div>
		";
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra los datos generales de una tropa.
	 * 
	 * 
	 * @param tropaId integer - id de la tropa en cuestion.
	 * @param $tropaTipo String - tipo de tropa de que se trata 
	 * @param $tropaUnidades integer - número de unidades que conforman la tropa.
	 * @param $tropaPts integer - puntos que cuesta la tropa.
	 * @param $tropaRango integer - mayor rango existente en la tropa (sin contar miembros del grupo de mando)
	 * @param $tropaGen boolean - Será true si la tropa es el general del ejercito.
	 * @param $tropaBEs boolean - Será true si la tropa es el portaestandarte de batalla.
	 * @param $tropaChamp boolean - Será true si la tropa incluye un campeón.
	 * @param $tropaEst boolean - Será true si la tropa incluye un portaestandarte.
	 * @param $tropaMusico boolean - Será true si la tropa incluye un músico.
	 * @param $tropaEjercito boolean - Será true si la tropa pertenece al ejercito del usuario.
	 * @param $tropaEnCampo boolean - Será true si la tropa está desplegada.
	 */
	function partida_datosGeneralesTropa(
			$tropaId
			, $tropaUnidades
			, $tropaPts
			, $tropaRango
			, $tropaGen
			, $tropaBEst
			, $tropaChamp
			, $tropaEst
			, $tropaMusico
			, $tropaEjercito
		){
		echo "
			<td class='halfWidth'>
		";
		
		//Comprobamos si se trata del general del ejercito
		if($tropaRango == 9){
			echo "
				<p>
					<span class='subtitle white'> esta tropa es el General del ejercito.</span>
					<span class='oculto' id='gentropa$tropaId'>si</span>
				</p>
			";
		}
		else{
			echo "<p class='oculto' id='gentropa$tropaId'>no</p>";
		}
		
		//Comprobamos si se trata del portaestandarte de batalla
		if($tropaRango == 8){
			echo "
				<p>
					<span class='subtitle white'>Esta tropa es el portaestandarte de batalla.</span>
					<span class='oculto' id='besttropa$tropaId'>si</span>
				</p>
			";
		}
		else{
			echo "<p class='oculto' id='besttropa$tropaId'>no</p>";
		}
		
		//Comprobamos si se trata del portaestandarte de batalla
		if($tropaRango >= 6){
			echo "
				<p>
					<span class='subtitle white'>Esta tropa es un oficial.</span>
				</p>
			";
		}
		
		//Comprobamos si la tropa incluye campeon
		if($tropaChamp){
			echo "
				<p>
					<span class='subtitle white'>Esta tropa incluye un campeón.</span>
					<span class='oculto' id='champtropa$tropaId'>si</span>
				</p>
			";
		}
		else{
			echo "<p class='oculto' id='champtropa$tropaId'>no</p>";
		}
		
		//Comprobamos si la tropa incluye un portaestandarte
		if($tropaEst){
			echo "
				<p>
					<span class='subtitle white'>Esta tropa incluye un portaestandarte.</span>
					<span class='oculto' id='esttropa$tropaId'>si</span>
				</p>
			";
		}
		else{
			echo "<p class='oculto' id='esttropa$tropaId'>no</p>";
		}
		
		//Comprobamos si la tropa incluye un músico
		if($tropaMusico){
			echo "
				<p>
					<span class='subtitle white'>Esta tropa incluye un músico.</span>
					<span class='oculto' id='musicotropa$tropaId'>si</span>
				</p>
			";
		}
		else{
			echo "<p class='oculto' id='musicotropa$tropaId'>no</p>";
		}
		
		echo "
				<span class='subtitle'>Unidades: </span>
				<span class='white' id='miembrostropa$tropaId'>$tropaUnidades</span>
				<br/>
				<span class='subtitle'>Puntos: </span>
				<span class='white' id='ptstropa$tropaId'>$tropaPts</span>
				<br/>
				<span class='subtitle'>Rango: </span>
				<span class='white' id='rangotropa$tropaId'>$tropaRango</span>
		";
		
		
		echo"
				<form class='oculto'>
		";
		
		//Comprobamos si la tropa pertenece al usuario
		if($tropaEjercito){
			echo "<input type='hidden' id='usertropa$tropaId' value='si'/>";
		}
		else{
			echo "<input type='hidden' id='usertropa$tropaId' value='no'/>";
		}
		
		echo "
				</form>
			</td>
		";
	}
	
	
	/**
	 * 
	 */
	function partida_datosConcretosTropa(
			$tropaId
			, $tropaHeridas
			, $tropaEstado
			, $tropaUnidadesFila
			, $tropaTropaAdoptivaId
			, $tropaTropaBajoAtaqueId
			, $tropaTropaBajoAtaqueFlanco
		){
		echo "
			<td class='halfWidth'>
				
				<span class='subtitle'>Estado: </span>
				<span class='white' id='estadotropa$tropaId'>$tropaEstado</span>
				<br/>
				
				<span class='subtitle'>Heridas: </span>
				<span class='white' id='heridastropa$tropaId'>$tropaHeridas</span>
				<br/>
				
				<span class='subtitle'>Unidades por fila: </span>
				<span class='white' id='unidadesfilatropa$tropaId'>$tropaUnidadesFila</span>
				<br/>
				
				<span class='subtitle'>Tropa Adoptiva: </span>
				<span class='white' id='tropaadoptivatropa$tropaId'>--</span>
				<br/>
				
				<span class='subtitle'>Tropa Bajo ataque: (pendiente)</span>
				<br/>
				<span class='subtitle'>Flanco Atacado: (pendiente)</span>
					
				
				<p class='oculto'>
					<span id='tropaadoptivaidtropa$tropaId'>$tropaTropaAdoptivaId</span>
					<span class='white' id='tropabajoataqueidtropa$tropaId'>$tropaTropaBajoAtaqueId</span>
					<span class='white' id='tropabajoataqueflancotropa$tropaId'>$tropaTropaBajoAtaqueFlanco</span>
				</p>
			</td>
		";
	}
	
	
	/**
	 * Función que registra una nueva situacion en la base de datos.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $datos Array - Array con los datos de la situacion.
	 */
	function partida_registrarSituacion($conexion, $datos){
		//Los datos recibidos aun no han sido filtrado, de modo que procedemos a hacerlo.
		$partida = preg_replace("/[^0-9]+/", "", $datos['partida']);
		$ejercito = preg_replace("/[^0-9]+/", "", $datos['ejercito']);
		$fase = preg_replace("/[^0-9]+/", "", $datos['fase']);
		$ordenFase = preg_replace("/[^0-9]+/", "", $datos['ordenFase']);
		$ordenJugador = preg_replace("/[^A-Za-z0-9]+/", "", $datos['ordenJugador']);
		
		//Si el orden de jugador es "Desafiador" se trata del primer jugador en efectuar sus fases.
		if($ordenJugador == "Desafiador"){
			$ordenJugador = 1;
		}
		else{
			$ordenJugador = 2;
		}
		
		//Para cada tropa prepararemos un registro de la misma en persistencia de datos.
		foreach($datos['tropas'] as $tropa){
			partida_registrarSituacionTropa($conexion, $fase, $tropa);
		}
		
		//Tras ello lanzamos el proceso de pasar fase.
		echo "=D";
	}
	
	
	/**
	 * Función que registra una la situacion de una tropa en una fase en la base de datos.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $fase integer - id de la fase a que pertenece la tropa.
	 * @param $tropa Array - Array con los datos de la tropa.
	 */
	function partida_registrarSituacionTropa($conexion, $fase, $tropa){
		/**
		 * Diseñamos la consulta en funcion de una serie de valores que podrían ser null
		 * Para ello concatenamos el valor o null en funcion de si el valor es un string vacío.
		 */
		
		//Suponemos que la tropa enemiga
		$query = "CALL proceso_addSituacion(false,?,?,?,?,?,?,?,";
		//Si la tropa fuera aliada 
		if($tropa['aliada']){
			$query = "CALL proceso_addSituacion(true,?,?,?,?,?,?,?,";
		}
		
		
		//Tropa Adoptiva
		$tropaAdoptiva = preg_replace("/[^0-9]+/", "", $tropa['tropa']);
		if($tropaAdoptiva == ""){
			$query .= "null,";
		}
		else{
			$query .= $tropaAdoptiva.",";
		}
		
		//Tropa Bajo Ataque
		$tropaBajoAtaque = preg_replace("/[^0-9]+/", "", $tropa['tropaBajoAtaque']);
		if($tropaBajoAtaque == ""){
			$query .= "null,";
		}
		else{
			$query .= $tropaBajoAtaque.",";
		}
		
		//Tropa Bajo Ataque Flanco
		$tropaBajoAtaqueFlanco = preg_replace("/[^0-9]+/", "", $tropa['tropaBajoAtaqueFlanco']);
		if($tropaBajoAtaqueFlanco == ""){
			$query .= "null,";
		}
		else{
			$query .= "'".$tropaBajoAtaqueFlanco."',";
		}
		
		$query .= "?)";
		
		$sentencia = $conexion -> prepare($query);
		
		$sentencia -> bind_param(
			'iiiiiiis'
			, preg_replace("/[^0-9]+/", "", $tropa['tropa'])
			, $fase
			, preg_replace("/[^0-9]+/", "", $tropa['unidadesFila'])
			, preg_replace("/[^0-9]+/", "", $tropa['altitud'])
			, preg_replace("/[^0-9]+/", "", $tropa['latitud'])
			, preg_replace("/[^0-9]+/", "", $tropa['orientacion'])
			, preg_replace("/[^0-9]+/", "", $tropa['heridas'])
			, preg_replace("/[^0-9]+/", "", $tropa['estado'])
		);
		
		if(!$sentencia -> execute()){
			echo $sentencia -> error;
		}
		
		$sentencia -> close();
	}
?>