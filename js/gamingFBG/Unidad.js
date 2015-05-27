/**
 * Clase que nos genera unidades en el juego.
 *
 * Una unidad es un individuo, un soldado, animal, maquina o monstruo
 * que forma parte de la batalla.
 * 
 * @author Daniel Mart�n D�az
 * @version 1.1 (23/07/2014)
 */
function Unidad(tropaId, classNameFichas, selected, indice, subirRango){
	/*VARIABLES*/
	//Car�cter�sticas
	var fichasComponentes = document.getElementsByClassName(classNameFichas);
	var componente = [];
	var larga = false;
	
	iniciarComponentes();
	
	/*GETTERS*/
	/**
	 * 
	 */
	this.getPeana = function(){
		var peana = 0;
		for(var i=0; i<componente.length; i++){
			if(componente[i].getRepresentada()){
				peana += componente[i].getPeana();
				if(componente[i].getTipo() == "Montura-Tiro"){
					larga = true;
				}
			}
		}
		return {peana: parseInt(peana), larga: larga};
	};
	
	/**
	 * 
	 */
	this.getTipo = function(){
		var tipo = "Infantería";
		var maquinaria = false;
		var tiro = false;
		
		for(var i=0; i<componente.length; i++){
			if(componente[i].getTipo() == "Montura-Tiro"){
				tiro = true;
			}
			else if(componente[i].getTipo() == "Maquinaria-Carro"){
				maquinaria = true;
			}
		}
		
		if(tiro && maquinaria){
			tipo = "Carro";
		}
		else if(tiro){
			tipo = "Caballería";
		}
		else if(maquinaria){
			tipo = "Artillería";
		}
		
		return tipo;
	};
	
	/**
	 * 
	 */
	this.getRango = function(){
		var rango = 0;
		for(var i=0; i<componente.length; i++){
			if(componente[i].getRango() > rango){
				rango = componente[i].getRango();
			}
		}
		return parseInt(rango)+subirRango;
	};
	
	/**
	 * Método que retorna el movimiento de una unidad.
	 */
	this.getMovimiento = function(){
		/**
		 * En caso de haber montura o bestia de tiro, siempre se toma el movimiento de esta.
		 * En caso contrario se toma el menor de todos.
		 */
		var hayMontura = false;
		var movimiento = 40;
		
		for(var i=0; i<componente.length && !hayMontura; i++){
			if(componente[i].getTipo() == "Montura-Tiro"){
				hayMontura = true;
				movimiento = componente[i].getMovimiento();
			}
			else{
				if(componente[i].getMovimiento() < movimiento){
					movimiento = componente[i].getMovimiento();
				}
			}
		}

		return movimiento;
	};
	
	/**
	 * Método que retorna un array
	 * con los atributos de sus componentes.
	 */
	this.getAtributo = function(atributo){
		var atributos = [];
		
		for(var i=0; i<componente.length; i++){
			switch(atributo){
				case "HA":  atributos[i] = componente[i].getHA(); break;
				
				case "HP":  atributos[i] = componente[i].getHP(); break;
				
				case "F":  atributos[i] = componente[i].getF(); break;
				
				case "R":  atributos[i] = componente[i].getR(); break;
				
				case "PS":  atributos[i] = componente[i].getPS(); break;
				
				case "I":  atributos[i] = componente[i].getI(); break;
				
				case "A":  atributos[i] = componente[i].getA(); break;
				
				case "L":  atributos[i] = componente[i].getL(); break;
			}
		}
		
		return atributos;
	};
	
	
	/**
	 * Método que retorna los ataques realizados por una unidad.
	 */
	this.getAtaques = function(){
		var ataquesUnidad = [];
		
		for(var i=0; i<componente.length; i++){
			ataquesUnidad.push(componente[i].getAtaques());
		}
		
		return ataquesUnidad;
	};
	
	/*M�TODOS INTERNOS*/
	function iniciarComponentes(){
		for(var i=0 ; i<fichasComponentes.length ; i++){
			componente[i] = new Componente("componente"+fichasComponentes[i].innerHTML+tropaId, fichasComponentes[i].innerHTML);
		}
	};
		
	
	/*METODOS DE INTERACTUACION*/
	/**
	 * 
	 */
	this.posicionar = function(x,y,situacion,zoom,user){
		
		if(user){
			situacion.fillStyle = "#C1D0E3";
		}
		else{
			situacion.fillStyle = "#E8E65F";
		}
		
		if(larga){
			situacion.fillRect(x, y, this.getPeana().peana*zoom, this.getPeana().peana*zoom*2);
			situacion.strokeRect(x, y, this.getPeana().peana*zoom, this.getPeana().peana*zoom*2);
		}
		
		else{
			situacion.fillRect(x, y, this.getPeana().peana*zoom, this.getPeana().peana*zoom);
			situacion.strokeRect(x, y, this.getPeana().peana*zoom, this.getPeana().peana*zoom);
		}
	};
};