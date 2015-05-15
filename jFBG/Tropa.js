/**
 * Clase que nos genera tropas en el juego.
 *
 * Una tropa consta de varias unidades, tengan o no distintos atributos,
 * orgnizadas en una formacion.
 * 
 * @author Daniel Mart�n D�az
 * @version 1.1 (23/07/2014)
 */
function Tropa(tropaId,panelOut){
	/*VARIABLES*/
	//Car�cter�sticas
	var id = tropaId;
	var nombre = document.getElementById("nombre"+tropaId).innerHTML;
	var miembros = parseInt(document.getElementById("miembros"+tropaId).innerHTML);
	var user = document.getElementById("user"+tropaId).value;
	var larga = false;
	
	//Situacion
	var selected = false;
	var estado = document.getElementById("estado"+tropaId).innerHTML;
	var heridas = document.getElementById("heridas"+tropaId).innerHTML;
	var latitud = parseInt(document.getElementById("latitud"+tropaId).innerHTML);
	var altitud = parseInt(document.getElementById("altitud"+tropaId).innerHTML);
	var orientacion = parseInt(document.getElementById("orientacion"+tropaId).innerHTML)*Math.PI/180;
	var unidadesFila = document.getElementById("unidadesfila"+tropaId).innerHTML;
	var tropaAdoptivaId = document.getElementById("tropaadoptivaid"+tropaId).innerHTML;
	var tropaBajoAtaqueId = document.getElementById("tropabajoataqueid"+tropaId).innerHTML;
	var tropaBajoAtaqueFlanco = document.getElementById("tropabajoataqueflanco"+tropaId).innerHTML;
	
	//Miembros
	var unidad = [];
	var fichasUnidades = [];
	var tropaAdoptadaId = [];
	iniciarUnidades();
	
	
	
	/*GETTERS*/
	/**
	 * Método get del atributo id
	 */
	this.getId = function(){
		return id;
	};
	
	/**
	 * Método get del atributo nombre.
	 * 
	 * @return nombre de la tropa.
	 */
	this.getNombre = function(){
		return nombre;
	};
	
	/**
	 * Método get del atributo user.
	 * 
	 * @return true si user == "si".
	 */
	this.getUser = function(){
		if(user == "si") return true;
		else return false;
	};
	
	/**
	 * Método que comprueba si una tropa está en el campo.
	 * 
	 * @return true si la tropa se encuentra en el terreno
	 */
	this.getEnCampo = function(){
		if(estado != "Eliminada" && estado != "Sin desplegar") return true;
		else return false;
	};
	
	/**
	 * Método que comprueba si una tropa está realizando alguna acción o no esta en juego, de modo que no pueda realizar acciones.
	 * 
	 * @return true si la tropa no puede realizar acciones.
	 */
	this.getOcupada = function(){
		if(estado != "En juego") return true;
		else return false;
	};
	
	/**
	 * Método get que retorna el rango mas bajo de las unidades
	 * 
	 * @return rango mas bajo.
	 */
	this.getRangoBajo = function(){
		var min=10;
		for(var i=0;i<unidad.length;i++){
			if(unidad[i].getRango()<min){
				min=unidad[i].getRango();
			}
		}
		return min;
	};
	
	/**
	 * Método get que retorna el rango mas alto de las unidades
	 * 
	 * @return rango mas alto.
	 */
	this.getRangoAlto = function(){
		var max=0;
		for(var i=0;i<unidad.length;i++){
			if(unidad[i].getRango()>max){
				max=unidad[i].getRango();
			}
		}
		return max;
	};
	
	/**
	 * Método get que retorna las coordenadas del punto vanguardiaSiniestra.
	 * 
	 * @return coordenadas X e Y de la esquina.
	 */
	this.getVanguardiaSiniestra = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			coor = { x: latitud, y: altitud }; 
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	/**
	 * Método get que retorna las coordenadas del punto vanguardiaDiestra.
	 * 
	 * @return coordenadas X e Y de la esquina.
	 */
	this.getVanguardiaDiestra = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//X+cos(angulo)*ancho
			//Y+sen(angulo)*ancho
			var valorX = parseInt(latitud+dimTropa().ancho*Math.cos(orientacion));
			var valorY = parseInt(altitud+dimTropa().ancho*Math.sin(orientacion));
			coor = { x: valorX, y: valorY };
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	/**
	 * Método get que retorna las coordenadas del punto vanguardiaDiestra.
	 * 
	 * @return coordenadas X e Y de la esquina.
	 */
	this.getRetaguardiaSiniestra = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//X-sen(angulo)*alto
			//Y+cos(angulo)*alto
			var valorX = parseInt(latitud-dimTropa().alto*Math.sin(orientacion));
			var valorY = parseInt(altitud+dimTropa().alto*Math.cos(orientacion));
			coor = { x: valorX, y: valorY };
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	/**
	 * Método get que retorna las coordenadas del punto retaguardiaDiestra.
	 * 
	 * @return coordenadas X e Y de la esquina.
	 */
	this.getRetaguardiaDiestra = function(){
		var coor;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//X+cos(angulo)*ancho-sen(angulo)*alto
			//Y+sen(angulo)*ancho+cos(angulo)*alto
			var valorX = parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)-dimTropa().alto*Math.sin(orientacion));
			var valorY = parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)+dimTropa().alto*Math.cos(orientacion));
			coor = { x: valorX , y: valorY };
		}
		else{
			coor = { x: null, y: null };
		}
		return coor;
	};
	
	
	/**
	 * Método get que retorna la orientacion en grados de la unidad.
	 * 
	 * @return devuelve un integer
	 */
	this.getOrientacion = function(){
		return orientacion*180/Math.PI;
	};
	
	
	/**
	 * Método get que retorna la cantidad de unidades de la tropa.
	 * 
	 * @return devuelve un integer
	 */
	this.getUnidades = function(){
		return parseInt(miembros);
	};
	
	
	/**
	 * Método get que retorna el numero de unidades por fila.
	 * 
	 * @return devuelve un integer
	 */
	this.getAnchoFila = function(){
		return unidadesFila;
	};
	
	
	/**
	 * Método get que retorna el numero de heridas.
	 * 
	 * @return devuelve un integer
	 */
	this.getHeridas = function(){
		return heridas;
	};
	
	
	/**
	 * Método get que retorna el estado.
	 * 
	 * @return devuelve un integer
	 */
	this.getEstado = function(){
		return estado;
	};
	
	
	/**
	 * Método get que retorna el numero de heridas.
	 * 
	 * @return devuelve un integer
	 */
	this.getTropaAdoptiva = function(){
		return tropaAdoptivaId;
	};
	
	
	/**
	 * Método get que retorna el id de la unidad bajo ataque y el flanco que se encuentra bajo ataque.
	 */
	this.getTropaBajoAtaque = function(){
		return {id: tropaBajoAtaqueId, flanco: tropaBajoAtaqueFlanco};
	};
	
	
	/**
	 * Método get que retorna el numero de filas no completas de la tropa.
	 * 
	 * @return numero de filas incompletas.
	 */
	this.getFilasIncompletas = function(){
		var nFilasIncompletas = 0;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			for(var i=0;i<unidad.length;i++){
				if(i%unidadesFila==0){
					nFilasIncompletas++;
				}
			}
		}
		return nFilasIncompletas;
	};
	
		
	
	/*M�TODOS INTERNOS*/
	/**
	 * Método que tras modificar los valores del panel de entrada (panelIn)
	 * actualiza los atributos de la tropa.
	 */
	function actualizar(){
		estado = document.getElementById("estado"+tropaId).innerHTML;
		latitud = parseInt(document.getElementById("latitud"+tropaId).innerHTML);
		altitud = parseInt(document.getElementById("altitud"+tropaId).innerHTML);
		orientacion = parseInt(document.getElementById("orientacion"+tropaId).innerHTML)*Math.PI/180;
		unidadesFila = document.getElementById("unidadesfila"+tropaId).innerHTML;
		tropaAdoptivaId = document.getElementById("tropaadoptivaid"+tropaId).innerHTML;
		tropaBajoAtaqueId = document.getElementById("tropabajoataqueid"+tropaId).innerHTML;
		tropaBajoAtaqueFlanco = document.getElementById("tropabajoataqueflanco"+tropaId).innerHTML;
		iniciarUnidades();
	};
	
	/**
	 * Método que nos inicia las unidades de juego.
	 */
	function iniciarUnidades(){
		//Vaciamos el array
		unidad = [];
		var nUnidad = 0;
		
		//Iniciamos las unidades propias
		for(;nUnidad<miembros;nUnidad++){
			unidad[nUnidad] = new  Unidad(tropaId, "ficha"+tropaId, selected, i, 0);
		}
		//Iniciamos las unidades adoptadas
		for(var i=0;i<tropaAdoptadaId.length;i++){
			for(var j=0; j<document.getElementById("miembros"+tropaAdoptadaId[i]).innerHTML; j++,nUnidad++){
				unidad[nUnidad] = new  Unidad(tropaAdoptadaId[i], "ficha"+tropaAdoptadaId[i], selected, j, 0);
			}
		}
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			if(unidad.length<5){
				unidadesFila=unidad.length;
			}
			if(unidad.length>unidad.length){
				unidadesFila=unidad.length;
			}
		}
		
		ordenarUnidades();
	};
	
	/**
	 * Método que ordena las unidades de la tropa en funcion de su rango.
	 * Usamos el metodo de la burbuja con switch.
	 */
	function ordenarUnidades(){
		//Bucle para numero de vueltas de comparacion.
		for(var i=0;i<unidad.length-1;i++){
			//Bucle para numero de comparaciones.
			for(var j=1; j < unidad.length-i ;j++){
				//Si la unidad anterior tenia mayor rango:
				if(unidad[j].getRango() > unidad[j-1].getRango()){
					
					//se cambian de lugar
					var aux=unidad[j];
					unidad[j]=unidad[j-1];
					unidad[j-1]=aux;
					
				}
			}
		}
		
		/**
		 * Tras haber organizado las unidades 
		 * vamos retirando en orden las de menor rango
		 * en función de las heridas de la tropa.
		 */
		//retirarUnidades();
	};
	
	/**
	 * Método para comprobar el tama�o de peana mas grande
	 * dentro de las unidades de la tropa.
	 * 
	 * @return tama�o mas grande de peana.
	 */
	function maximoPeana(){
		var max=0;
		for(var i=0;i<unidad.length;i++){
			
			if(unidad[i].getPeana().peana >max){
				max=unidad[i].getPeana().peana;
			}
			
			if(unidad[i].getPeana().larga){
				larga = true;
			}
		}
		return max;
	};
	
	/**
	 * Método para devolver el alto de las filas.
	 * 
	 * @return alto de la fila.
	 */
	function altoFila(){
		var altoFila;
		
		if(larga){
			altoFila = maximoPeana()*2;
		}
		else{
			altoFila = maximoPeana();
		}
		return altoFila;
	};
	
	/**
	 * Método para devolver el ancho y el alto de la tropa.
	 * 
	 * @return dimension del alto y dimension del ancho.
	 */
	function dimTropa(){
		var dim;
		if(estado != "Eliminada" && estado != "Sin desplegar"){
			//Comprobamos cuantas filas tiene la unidad
			var filas = 0;
			for(var i=0;i<unidad.length;i++){
					if(i%unidadesFila==0){
						filas++;
					}
			}
			
			var an = Math.round(maximoPeana()*unidadesFila);
			var al = Math.round(altoFila()*filas);
			
			dim = { ancho: an , alto: al };
		}
		else {
			dim = { ancho: null , alto: null };
		}
		
		return dim;
	};
	
	/**
	 * Método que establece el movimiento de una tropa.
	 * Una tropa se mueve tanto como el más lento de sus integrantes.
	 * 
	 * @return devolver� 0 si no existen unidades que muevan. 
	 * En caso contrario devolver� el menor movimiento de las unidades de la tropa.
	 */
	function movimiento(){
		//Declaramos el minimo como el valor m�ximo permitido
		var min = Number.MAX_VALUE;
		for(var i=0;i<unidad.length;i++){
			//Comparamos cada una de las unidades y establecemos los menores.
			if(unidad[i].getMovimiento() < min){
				min = unidad[i].getMovimiento();
			}
		}
		//Si las unidades devolv�an MAX_VALUE, por no poder mover, establecemos el movimiento m�ximo como 0.
		if(min==Number.MAX_VALUE) return 0;
		else return min;
		
	};
	
	/**
	 * Método que comprueba que un punto est� contenido en una recta,
	 * por encima, o por debajo.
	 * 
	 * @param xP coordenada x del punto.
	 * @param yP coordenada y del punto.
	 * @param xR coordenada x de un punto de la recta.
	 * @param yR coordenada y de un punto de la recta.
	 * @param angle angulo que forma la recta con la horizontal.
	 * @return si el punto esta por encima de la recta
	 * el metodo devolver� 1 en caso de estar encima o a la derecha de la recta, 0 si el punto esta contenido por ella
	 * y en caso de estar debajo o a la izquierda devolvera -1.
	 */
	function posicionPuntoRecta(xP,yP,xR,yR,angle){
		//Si la recta es paralela a uno de los ejes tratamos las variables de la siguiente manera.
		if(angle==90 || angle==270){
			if(xP > xR){
				return -1;
			}else if(xP == xR){
				return 0;
			}else{
				return 1;
			}
		}
		
		
		//En caso contrario nos basamos en la ecuacion de la recta.
		else{
			var m = Math.tan(angle*Math.PI/180);
			var n = yR - xR*m;
			
			if(yP < xP*m+n){
				return -1;
			}
			else{
				if(yP == xP*m+n){
					return 0;
				}
				else{
					return 1;
				}
			}
		}
	};
	
	/**
	 * Método que calcula la distancia entre dos puntos.
	 * 
	 * @param x1 coordenada x del punto 1.
	 * @param y1 coordenada y del punto 1.
	 * @param x2 coordenada x del punto 2.
	 * @param y2 coordenada y del punto 2.
	 * @return devuelve la distancia en forma de entero.
	 */
	function distanciaPuntoPunto(x1,y1,x2,y2){
		var distanciaX = Math.abs(x1-x2);
		var distanciaY = Math.abs(y1-y2);
		var distancia = Math.sqrt(Math.pow(distanciaX,2)+Math.pow(distanciaY,2));
		return parseInt(distancia);
	};
	
	/**
	 * Método que comprueba que un punto est� contenido en una recta,
	 * por encima, o por debajo.
	 * 
	 * @param xP coordenada x del punto.
	 * @param yP coordenada y del punto.
	 * @param xR coordenada x de un punto de la recta.
	 * @param yR coordenada y de un punto de la recta.
	 * @param angle angulo que forma la recta con la horizontal.
	 * @return si el punto esta por encima de la recta
	 * el metodo devolver� 1 en caso de estar encima o a la derecha de la recta, 0 si el punto esta contenido por ella
	 * y en caso de estar debajo o a la izquierda devolvera -1.
	 */
	function distanciaPuntoRecta(xP,yP,xR,yR,angle){
		//y = mx+n
		var m = Math.tan(angle*Math.PI/180);
		var n = yR - xR*m;
		
		//(mx-y+n)/raiz cuadrada de m^2 +1 = distancia
		return parseInt((m*xP-yP+n)/Math.sqrt(Math.pow(m,2)+1));
	};
	
	/**
	 * Método que comprieba si un punto est� en visi�n directa.
	 * Es aconsejable establecer primero que est� en linea de visi�n.
	 * @param x,y Coordenadas del punto a comprobar.
	 */
	function visionDirecta(x,y){
		var xVI = latitud;
		var yVI = altitud;
		var xVD = parseInt(latitud+dimTropa().ancho*Math.cos(orientacion));
		var yVD = parseInt(altitud+dimTropa().ancho*Math.sin(orientacion));
		var angle = orientacion*180/Math.PI+90;
		if(posicionPuntoRecta(x,y,xVI,yVI,angle)<=0 && posicionPuntoRecta(x,y,xVD,yVD,angle)>=0) return true;
		if(posicionPuntoRecta(x,y,xVI,yVI,angle)>=0 && posicionPuntoRecta(x,y,xVD,yVD,angle)<=0) return true;
		return false;
	};
	


	/*METODOS DE INTERACTUACION*/
	/**
	 * Método que ejecuta los procesos cuando esta tropa es seleccionada.
	 */
	this.seleccionar = function(){
		console.log("Seleccionada tropa "+tropaId);
		selected=true;
		document.getElementById(panelOut).innerHTML="Tropa <b>"+nombre+"</b> seleccionada. ";
	};
	/**
	 * Método que ejecuta los procesos cuando esta tropa es deseleccionada.
	 */
	this.deseleccionar = function(){
		selected=false;
	};
	
	/**
	 * Método que despliega la unidad en el campo de batalla.
	 * 
	 * @param x latitud del despliegue.
	 * @param y altitud del despliegue.
	 * @param angle orientacion en que se despliega la tropa.
	 */
	this.desplegar = function(x,y,angle,ancho,campoAncho,campoAlto,userOrder){
		if(estado != "Eliminada"){
			if(x<10){
				x=10;
			}
			if(x>campoAncho-40){
				x=campoAncho-40;
			}
			if(y<10){
				y=10;
			}
			if(userOrder=="Desafiador"){
				if(y>campoAlto/4){
					y=campoAlto/4;
				}
			}
			else{
				if(y>campoAlto-40){
					y=campoAlto-40;
				}
				if(y<campoAlto-campoAlto/4){
					y=campoAlto-campoAlto/4;
				}
			}
			
			if(ancho>unidad.length){
				ancho=unidad.length;
			}
			if(unidad.length<5){
				ancho=unidad.length;
			}
			
			document.getElementById("latitud"+tropaId).innerHTML = x;
			document.getElementById("altitud"+tropaId).innerHTML = y;
			document.getElementById("orientacion"+tropaId).innerHTML = angle;
			document.getElementById("estado"+tropaId).innerHTML = "En juego";
			document.getElementById("unidadesfila"+tropaId).innerHTML = ancho;
			document.getElementById("tropaadoptivaid"+tropaId).innerHTML = "";
			actualizar();
			document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" desplegada en "+latitud+"x "+altitud+"y.<br/>Orientacion: "+parseInt(orientacion*180/Math.PI);
			console.log("Tropa "+nombre+" desplegada en "+latitud+"x "+altitud+"y.<br/>Orientacion: "+parseInt(orientacion*180/Math.PI));
		}
	};
	
	/**
	 * Método que arrastra una tropa sin alterar su orientacion
	 */
	this.arrastrar = function(x,y,campoAncho,campoAlto,userOrder){
		if(estado != "Eliminada"){
			if(x<10){
				x=10;
			}
			if(x>campoAncho-40){
				x=campoAncho-40;
			}
			if(y<10){
				y=10;
			}
			if(userOrder=="Desafiador"){
				if(y>campoAlto/4){
					y=campoAlto/4;
				}
			}
			else{
				if(y>campoAlto-40){
					y=campoAlto-40;
				}
				if(y<campoAlto-campoAlto/4){
					y=campoAlto-campoAlto/4;
				}
			}

			document.getElementById("latitud"+tropaId).innerHTML = x;
			document.getElementById("altitud"+tropaId).innerHTML = y;
			document.getElementById("estado"+tropaId).innerHTML = "En juego";
			document.getElementById("tropaadoptivaid"+tropaId).innerHTML = "";
			actualizar();
			document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" movida a "+latitud+"x "+altitud+"y. ";
		}
	};
	
	/**
	 * Metodo para establecer una tropa en su posicion actual.
	 * 
	 * @param situacion contexto canvas en que representamos.
	 * @param zoom proporcion de las medidas del dibujo.
	 */
	this.posicionar = function(situacion,zoom){
		if(estado != "Eliminada" && estado != "Sin desplegar" && tropaAdoptivaId == ""){
						
			//Modificamos el contexto
			situacion.translate(latitud*zoom,altitud*zoom);
			situacion.rotate(orientacion);
			
			//Definimos filas y columnas iniciales
			var fila = 0;
			var columna = 0;
			
			
			//Establecemos el ancho de la columna y el alto de la fila
			var anchoColumna=maximoPeana();
			
			if(selected){
				situacion.strokeStyle="white";
			}
			else{
				situacion.strokeStyle="grey";
			}
			situacion.fillStyle = "grey";

			console.log("Ancho Columna "+anchoColumna);
			console.log("Alto Fila "+altoFila());
			console.log("Filas Incompletas "+this.getFilasIncompletas());
			console.log("Tropa de "+anchoColumna*unidadesFila*zoom+"x"+altoFila()*this.getFilasIncompletas()*zoom);
			
			situacion.fillRect(0,0,anchoColumna*unidadesFila*zoom,altoFila()*this.getFilasIncompletas()*zoom);
			
			//Disponemos las tropas una a una.
			for(var i=0;i<unidad.length;i++,columna++){
				if(i != 0){
					if(i%unidadesFila==0){
						fila++;
						columna=0;
					}
				}
				unidad[i].posicionar(columna*anchoColumna*zoom, altoFila()*fila*zoom, situacion, zoom, this.getUser());
			}
			
			//Reestablecemos el contexto
			situacion.rotate(orientacion*(-1));
			situacion.translate(latitud*zoom*(-1),altitud*zoom*(-1));

			console.log(nombre+" posicionada.");
		}
	};
	
	/**
	 * Método para incorporarse a una tropa.
	 * 
	 * @param id de la tropa a que se incorpora.
	 */
	this.incorporar = function(tropaPadre){
		document.getElementById("latitud"+tropaId).innerHTML = "--";
		document.getElementById("altitud"+tropaId).innerHTML = "--";
		document.getElementById("orientacion"+tropaId).innerHTML = "--";
		document.getElementById("estado"+tropaId).innerHTML = "En juego";
		document.getElementById("unidadesfila"+tropaId).innerHTML = "--";
		document.getElementById("tropaadoptivaid"+tropaId).innerHTML = tropaPadre;
		actualizar();
		document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" incorporada exitosamente. ";
	};
	
	/**
	 * Método para incorporar unidades a la tropa.
	 * 
	 * @param id de la tropa a incorporar.
	 */
	this.adoptar = function(tropaAdoptandoId){
		var noExiste=true;
		for(var i=0;i<tropaAdoptadaId.length;i++){
			if(tropaAdoptadaId[i]==tropaAdoptandoId){
				noExiste=false;
			};
		}
		if(noExiste){
			tropaAdoptadaId.push(tropaAdoptandoId);
			actualizar();
		}
	};
	
	/**
	 * Método para sacar unidades de la tropa.
	 * 
	 * @param id de la tropa a separar.
	 */
	this.sacar = function(tropaSacandoId){
		var aux = [];
		for(var i=0;i<tropaAdoptadaId.length;i++){
			if(tropaAdoptadaId[i]!=tropaSacandoId){
				aux.push(tropaAdoptadaId[i]);
			};
		}
		tropaAdoptadaId = aux;
		actualizar();
	};
	
	/**
	 * Método para comprobar si dos unidades entran en colision.
	 * 
	 * @param x coordenada X del punto en supuesta colision.
	 * @param y coordenada y del punto en supuesta colision.
	 */
	this.colision = function(x,y){
		//Se deben dar ambas para que el punto este contenido en la unidad.
		var colisionVertical = false;
		var colisionHorizontal = false;
		
		//Angulo de la vanguardia y la retaguardia.
		var anguloHorizontal = parseInt(orientacion*180/Math.PI);
		//Angulo de los flancos.
		var anguloVertical = parseInt(orientacion*180/Math.PI)+90;
		
		//Posicion de un punto de las rectas 1 y 3.
		var xR=parseInt(latitud);
		var yR=parseInt(altitud);
		//Posicion de un punto de las rectas 2 y 4.
		var xS=Math.round(parseInt(latitud)+dimTropa().ancho*Math.cos(orientacion)-dimTropa().alto*Math.sin(orientacion));
		var yS=Math.round(parseInt(altitud)+dimTropa().ancho*Math.sin(orientacion)+dimTropa().alto*Math.cos(orientacion));
		
		
		//comprobamos que este por encima de la recta 1, dada por el punto R y el angulo horizontal, y por debajo de la recta 2, dada por el punto S y el angulo horizontal.
		if(posicionPuntoRecta(x,y,xR,yR,anguloHorizontal)>=0 && posicionPuntoRecta(x,y,xS,yS,anguloHorizontal)<=0){
			colisionVertical=true;
		}
		//comprobamos que este por debajo de la recta 1 y por encima de la recta 2.
		if(posicionPuntoRecta(x,y,xR,yR,anguloHorizontal)<=0 && posicionPuntoRecta(x,y,xS,yS,anguloHorizontal)>=0){
			colisionVertical=true;
		}
		
		//comprobamos que este por encima de la recta 3, dada por el punto R y el angulo vertical, y por debajo de la recta 4, dada por el punto S y el angulo vertical.
		if(posicionPuntoRecta(x,y,xR,yR,anguloVertical)>=0 && posicionPuntoRecta(x,y,xS,yS,anguloVertical)<=0){
			colisionHorizontal=true;
		}
		//comprobamos que este por encima de la recta 3 y por debajo de la recta 4.
		if(posicionPuntoRecta(x,y,xR,yR,anguloVertical)<=0 && posicionPuntoRecta(x,y,xS,yS,anguloVertical)>=0){
			colisionHorizontal=true;
		}
		
		//Comprobamos que se dan ambas colisiones
		if(colisionVertical && colisionHorizontal) return true;
		else return false;
	};
	
	/**
	 * Método para retirar una tropa del campo de batalla.
	 */
	this.retirar = function(){
		document.getElementById("latitud"+tropaId).innerHTML = "";
		document.getElementById("altitud"+tropaId).innerHTML = "";
		document.getElementById("orientacion"+tropaId).innerHTML = "";
		document.getElementById("estado"+tropaId).innerHTML = "Sin desplegar";
		document.getElementById("unidadesfila"+tropaId).innerHTML = "";
		document.getElementById("tropaadoptivaid"+tropaId).innerHTML = "";
		actualizar();
		console.log("Tropa "+nombre+" retirada del campo.")
		document.getElementById(panelOut).innerHTML = "Tropa "+nombre+" retirada del campo. ";
	};
	
	/**
	 * Método para comprobar si un punto est� dentro del cono de vision de la tropa.
	 * 
	 * @param x coordenada X del punto.
	 * @param y coordenada Y del punto.
	 * @see Funcioenes sacadas de los metodos getVanguardia...
	 */
	this.lineaVision = function(x,y){
		//Linea izquierda
		var angleIzq = parseInt(((orientacion*180/Math.PI)+225)%360);
		var xIzq=latitud;
		var yIzq=altitud;
		
		//Linea derecha
		var angleDer = parseInt(((orientacion*180/Math.PI)+315)%360);
		var xDer = parseInt(latitud+dimTropa().ancho*Math.cos(orientacion));
		var yDer = parseInt(altitud+dimTropa().ancho*Math.sin(orientacion));
		
		//Linea central
		var angleCen = parseInt(orientacion*180/Math.PI);

		//Comprobaciones
		if((angleCen>=0 && angleCen<=45) || (angleCen>315 && angleCen<360)){
			if(posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)<=0 && posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)<=0 && posicionPuntoRecta(x,y,xDer,yDer,angleDer)<=0){
				return true;
			}
		}
		if(angleCen>45 && angleCen<=90){
			if(posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)>=0 && posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)<=0 && posicionPuntoRecta(x,y,xDer,yDer,angleDer)<=0){
				return true;
			}
		}
		if(angleCen>90 && angleCen<=135){
			if(posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)>=0 && posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)>=0 && posicionPuntoRecta(x,y,xDer,yDer,angleDer)<=0){
				return true;
			}
		}
		if(angleCen>135 && angleCen<=225){
			if(posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)>=0 && posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)>=0 && posicionPuntoRecta(x,y,xDer,yDer,angleDer)>=0){
				return true;
			}
		}
		if(angleCen>225 && angleCen<=270){
			if(posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)<=0 && posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)>=0 && posicionPuntoRecta(x,y,xDer,yDer,angleDer)>=0){
				return true;
			}
		}
		if(angleCen>270 && angleCen<=315){
			if(posicionPuntoRecta(x,y,xIzq,yIzq,angleIzq)<=0 && posicionPuntoRecta(x,y,xIzq,yIzq,angleCen)<=0 && posicionPuntoRecta(x,y,xDer,yDer,angleDer)>=0){
				return true;
			}
		}
		return false;
	};
	
	/**
	 * Método que comprueba si la tropa bloquea una linea entre dos puntos.
	 * 
	 * @param x1,y1 Coordenadas del punto de origen de visi�n.
	 * @param x2,y2 Coordenadas del punto objetivo de visi�n.
	 * @return Devolver� true en caso de que la tropa interccepte la linea de visi�n en alg�n punto y false en caso contrario.
	 */
	this.bloqueaLinea = function(x1,y1,x2,y2){
		//Evaluamos la orientacion de la linea de vision y comparamos con cada uno de los frentes en cada caso
		//Las funciones se corresponden con los get de vanguardia y retaguardia.
		if(x1==x2){
			if(x1<=latitud && x1>=parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)) || x1>=latitud && x1<=parseInt(latitud+dimTropa().ancho*Math.cos(orientacion))){
				return true;//Frente
			}else if(x1<=latitud && x1>=parseInt(latitud-dimTropa().alto*Math.sin(orientacion)) || x1>=latitud && x1<=parseInt(latitud-dimTropa().alto*Math.sin(orientacion))){
				return true;//Izquierda
			}else if(x1<=parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)) && x1>=parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)-dimTropa().alto*Math.sin(orientacion)) || x1>=parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)) && x1<=parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)-dimTropa().alto*Math.sin(orientacion))){
				return true;//Derecha
			}else if(x1<=parseInt(latitud-dimTropa().alto*Math.sin(orientacion)) && x1>=parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)-dimTropa().alto*Math.sin(orientacion)) || x1>=parseInt(latitud-dimTropa().alto*Math.sin(orientacion)) && x1<=parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)-dimTropa().alto*Math.sin(orientacion))){
				return true;//Atr�s
			}
		}else if(y1==y2){
			if(y1<=altitud && y1>=parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)) || y1>=altitud && y1<=parseInt(altitud+dimTropa().ancho*Math.sin(orientacion))){
				return true;//Frente
			}else if(y1<=altitud && y1>=parseInt(altitud+dimTropa().alto*Math.cos(orientacion)) || y1>=altitud && y1<=parseInt(altitud+dimTropa().alto*Math.cos(orientacion))){
				return true;//Izquierda
			}else if(y1<=parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)) && y1>=parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)+dimTropa().alto*Math.cos(orientacion)) || y1>=parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)) && y1<=parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)+dimTropa().alto*Math.cos(orientacion))){
				return true;//Derecha
			}else if(y1<=parseInt(altitud+dimTropa().alto*Math.cos(orientacion)) && y1>=parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)+dimTropa().alto*Math.cos(orientacion)) || y1>=parseInt(altitud+dimTropa().alto*Math.cos(orientacion)) && y1<=parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)+dimTropa().alto*Math.cos(orientacion))){
				return true;//Atr�s
			}
		}else{
			//Establecemos la ecuacion de la linea de visi�n.
			var mL = (y1-y2)/(x2-x1);//Cateto puesto partido de cateto contiguo
			var nL = y1 - x1*mL;//Y=mX+n
			//Establecemos las pendientes de los cuatro frentes.
			var mHorizontal = Math.tan(orientacion);
			var mVertical = Math.tan(orientacion+Math.PI/2);
			//Definimos las esquinas
			var xVS = latitud;
			var yVS = altitud;
			var xVD = parseInt(latitud+dimTropa().ancho*Math.cos(orientacion));
			var xRS = parseInt(latitud-dimTropa().alto*Math.sin(orientacion));
			var xRD = parseInt(latitud+dimTropa().ancho*Math.cos(orientacion)-dimTropa().alto*Math.sin(orientacion));
			var yRD = parseInt(altitud+dimTropa().ancho*Math.sin(orientacion)+dimTropa().alto*Math.cos(orientacion));
			
			//Frente
			var nF = yVS-xVS*mHorizontal;
			var xF = (nL-nF)/(mHorizontal-mL);
			if(xF<=xVS && xF>=xVD || xF>=xVS && xF<=xVD){
				return true;
			}
			
			//Izquierda
			var nI = yVS-xVS*mVertical;
			var xI = (nL-nI)/(mVertical-mL);
			if(xF<=xVS && xF>=xRS || xF>=xVS && xF<=xRS){
				return true;
			}
			
			//Derecha
			var nD = yRD-xRD*mVertical;
			var xD = (nL-nD)/(mVertical-mL);
			if(xF<=xVD && xF>=xRD || xF>=xVD && xF<=xRD){
				return true;
			}
			
			//Atr�s
			var nA = yRD-xRD*mVertical;
			var xA = (nL-nA)/(mHorizontal-mL);
			if(xF<=xRS && xF>=xRD || xF>=xRS && xF<=xRD){
				return true;
			}
		}
		return false;
	};
	
	/**
	 * Método que comprueba si una tropa est� a alcance de carga.
	 * El alcance de carga es el doble del movimiento de la unidad mas lenta o el de la montura.
	 * 
	 * @param objetivo Tropa objetivo de la carga.
	 * @param frente Frente de combate m�s pr�ximo.
	 * @return Devuelve verdadero si la carga es viable.
	 */
	this.alcanceCarga = function(objetivo,frente){
		var xVI = latitud;
		var yVI = altitud;
		var xVD = parseInt(latitud+dimTropa().ancho*Math.cos(orientacion));
		var yVD = parseInt(altitud+dimTropa().ancho*Math.sin(orientacion));
		switch(frente){
			case 1://Cargar por el frente
				if(visionDirecta(objetivo.getVanguardiaSiniestra().x,objetivo.getVanguardiaSiniestra().y)){
					if(distanciaPuntoRecta(objetivo.getVanguardiaSiniestra().x,objetivo.getVanguardiaSiniestra().y,xVI,yVI,orientacion*180/Math.PI) <= movimiento()*2) return true;
				}
				else{
					if(distanciaPuntoPunto(objetivo.getVanguardiaSiniestra().x,objetivo.getVanguardiaSiniestra().y,xVI,yVI)<=movimiento()*2) return true;
					if(distanciaPuntoPunto(objetivo.getVanguardiaSiniestra().x,objetivo.getVanguardiaSiniestra().y,xVD,yVD)<=movimiento()*2) return true;
				}
				if(visionDirecta(objetivo.getVanguardiaDiestra().x,objetivo.getVanguardiaDiniestra().y)){
					if(distanciaPuntoRecta(objetivo.getVanguardiaDiestra().x,objetivo.getVanguardiaDiestra().y,xVI,yVI,orientacion*180/Math.PI) <= movimiento()*2) return true;
				}
				else{
					if(distanciaPuntoPunto(objetivo.getVanguardiaDiestra().x,objetivo.getVanguardiaDiestra().y,xVI,yVI)<=movimiento()*2) return true;
					if(distanciaPuntoPunto(objetivo.getVanguardiaDiestra().x,objetivo.getVanguardiaDiestra().y,xVD,yVD)<=movimiento()*2) return true;
				}
			break;
			case 2://Cargar por el flanco izquierdo
				if(visionDirecta(objetivo.getVanguardiaSiniestra().x,objetivo.getVanguardiaSiniestra().y)){
					if(distanciaPuntoRecta(objetivo.getVanguardiaSiniestra().x,objetivo.getVanguardiaSiniestra().y,xVI,yVI,orientacion*180/Math.PI) <= movimiento()*2) return true;
				}
				else{
					if(distanciaPuntoPunto(objetivo.getVanguardiaSiniestra().x,objetivo.getVanguardiaSiniestra().y,xVI,yVI)<=movimiento()*2) return true;
					if(distanciaPuntoPunto(objetivo.getVanguardiaSiniestra().x,objetivo.getVanguardiaSiniestra().y,xVD,yVD)<=movimiento()*2) return true;
				}
				if(visionDirecta(objetivo.getRetaguardiaSiniestra().x,objetivo.getRetaguardiaSiniestra().y)){
					if(distanciaPuntoRecta(objetivo.getRetaguardiaSiniestra().x,objetivo.getRetaguardiaSiniestra().y,xVI,yVI,orientacion*180/Math.PI) <= movimiento()*2) return true;
				}
				else{
					if(distanciaPuntoPunto(objetivo.getRetaguardiaSiniestra().x,objetivo.getRetaguardiaSiniestra().y,xVI,yVI)<=movimiento()*2) return true;
					if(distanciaPuntoPunto(objetivo.getRetaguardiaSiniestra().x,objetivo.getRetaguardiaSiniestra().y,xVD,yVD)<=movimiento()*2) return true;
				}
			break;
			case 3://Cargar por el flanco derecho
				if(visionDirecta(objetivo.getVanguardiaDiestra().x,objetivo.getVanguardiaDiestra().y)){
					if(distanciaPuntoRecta(objetivo.getVanguardiaDiestra().x,objetivo.getVanguardiaDiestra().y,xVI,yVI,orientacion*180/Math.PI) <= movimiento()*2) return true;
				}
				else{
					if(distanciaPuntoPunto(objetivo.getVanguardiaDiestra().x,objetivo.getVanguardiaDiestra().y,xVI,yVI)<=movimiento()*2) return true;
					if(distanciaPuntoPunto(objetivo.getVanguardiaDiestra().x,objetivo.getVanguardiaDiestra().y,xVD,yVD)<=movimiento()*2) return true;
				}
				if(visionDirecta(objetivo.getRetaguardiaDiestra().x,objetivo.getRetaguardiaDiestra().y)){
					if(distanciaPuntoRecta(objetivo.getRetaguardiaDiestra().x,objetivo.getRetaguardiaDiestra().y,xVI,yVI,orientacion*180/Math.PI) <= movimiento()*2) return true;
				}
				else{
					if(distanciaPuntoPunto(objetivo.getRetaguardiaDiestra().x,objetivo.getRetaguardiaDiestra().y,xVI,yVI)<=movimiento()*2) return true;
					if(distanciaPuntoPunto(objetivo.getRetaguardiaDiestra().x,objetivo.getRetaguardiaDiestra().y,xVD,yVD)<=movimiento()*2) return true;
				}
			break;
			case 4://Cargar por retaguardia
				if(visionDirecta(objetivo.getRetaguardiaSiniestra().x,objetivo.getRetaguardiaSiniestra().y)){
					if(distanciaPuntoRecta(objetivo.getRetaguardiaSiniestra().x,objetivo.getRetaguardiaSiniestra().y,xVI,yVI,orientacion*180/Math.PI) <= movimiento()*2) return true;
				}
				else{
					if(distanciaPuntoPunto(objetivo.getRetaguardiaSiniestra().x,objetivo.getRetaguardiaSiniestra().y,xVI,yVI)<=movimiento()*2) return true;
					if(distanciaPuntoPunto(objetivo.getRetaguardiaSiniestra().x,objetivo.getRetaguardiaSiniestra().y,xVD,yVD)<=movimiento()*2) return true;
				}
				if(visionDirecta(objetivo.getRetaguardiaDiestra().x,objetivo.getRetaguardiaDiniestra().y)){
					if(distanciaPuntoRecta(objetivo.getRetaguardiaDiestra().x,objetivo.getRetaguardiaDiestra().y,xVI,yVI,orientacion*180/Math.PI) <= movimiento()*2) return true;
				}
				else{
					if(distanciaPuntoPunto(objetivo.getRetaguardiaDiestra().x,objetivo.getRetaguardiaDiestra().y,xVI,yVI)<=movimiento()*2) return true;
					if(distanciaPuntoPunto(objetivo.getRetaguardiaDiestra().x,objetivo.getRetaguardiaDiestra().y,xVD,yVD)<=movimiento()*2) return true;
				}
			break;
		}
		return false;
	};	
	/**
	 * Método que devuelve la distancia entre la tropa y un punto.
	 * 
	 * @param punto objeto con atributos "x" e "y".
	 * @return Devuelve la menor distancia entre el frente de la tropa y el punto.
	 */
	this.distanciaFrentePunto = function(punto){
		var xVI = latitud;
		var yVI = altitud;
		var xVD = parseInt(latitud+dimTropa().ancho*Math.cos(orientacion));
		var yVD = parseInt(altitud+dimTropa().ancho*Math.sin(orientacion));
		if(visionDirecta(punto.x,punto.y)){
			distanciaPuntoRecta(punto.x,punto.y,xVI,yVI,orientacion*180/Math.PI);
		}
		else{
			if(distanciaPuntoPunto(punto.x,punto.y,xVI,yVI) < distanciaPuntoPunto(punto.x,punto.y,xVD,yVD)) return distanciaPuntoPunto(punto.x,punto.y,xVI,yVI);
			else return distanciaPuntoPunto(punto.x,punto.y,xVD,yVD);
		}
	};
	
	/**
	 * Método que establece los eventos cuando esta tropa carga a otra.
	 * 
	 * @param objetivo tropa que recibe la carga
	 * @param frente frente por el enemigo que recibe la carga.
	 */
	this.cargar = function(objetivo,frente){
		document.getElementById("combatevanguardia"+tropaId).innerHTML = "si";
		document.getElementById("tropabajoataqueid"+tropaId).innerHTML = objetivo.getId;
		
		document.getElementById(panelOut).innerHTML = nombre+" carga contra "+objetivo.getNombre();
		switch(frente){
			case 1: 
				document.getElementById(panelOut).innerHTML += " de frente. ";
				document.getElementById("latitud"+tropaId).innerHTML = objetivo.getVanguardiaDiestra().x;
				document.getElementById("altitud"+tropaId).innerHTML = objetivo.getVanguardiaDiestra().y;
				document.getElementById("orientacion"+tropaId).innerHTML = ""+(parseInt(180)+objetivo.getOrientacion());
			break;
			case 2: 
				document.getElementById(panelOut).innerHTML += " por el flanco izquierdo. ";
				document.getElementById("latitud"+tropaId).innerHTML = objetivo.getVanguardiaSiniestra().x;
				document.getElementById("altitud"+tropaId).innerHTML = objetivo.getVanguardiaSiniestra().y;
				document.getElementById("orientacion"+tropaId).innerHTML = ""+(parseInt(90)+objetivo.getOrientacion());
			break;
			case 3: 
				document.getElementById(panelOut).innerHTML += " por el flanco derecho. ";
				document.getElementById("latitud"+tropaId).innerHTML = objetivo.getRetaguardiaDiestra().x;
				document.getElementById("altitud"+tropaId).innerHTML = objetivo.getRetaguardiaDiestra().y;
				document.getElementById("orientacion"+tropaId).innerHTML = ""+(parseInt(270)+objetivo.getOrientacion());
			break;
			case 4: 
				document.getElementById(panelOut).innerHTML += " por la retaguardia. ";
				document.getElementById("latitud"+tropaId).innerHTML = objetivo.getRetaguardiaSiniestra().x;
				document.getElementById("altitud"+tropaId).innerHTML = objetivo.getRetaguardiaSiniestra().y;
				document.getElementById("orientacion"+tropaId).innerHTML = ""+objetivo.getOrientacion();
			break;
		}
		actualizar();
	};
	
	this.cargaFallida = function(){
		document.getElementById(panelOut).innerHTML = "Carga fallida. ";
	};
	
	this.cargada = function(frente){
		alert(2);
		switch(frente){
		case 1:
			document.getElementById("combatevanguardia"+tropaId).innerHTML="si";
		break;
		case 2:
			document.getElementById("combatesiniestra"+tropaId).innerHTML="si";
		break;
		case 3:
			document.getElementById("combatediestra"+tropaId).innerHTML="si";
		break;
		case 4:
			document.getElementById("combateretaguardia"+tropaId).innerHTML="si";
		break;
		}
		actualizar();
	};
	
};