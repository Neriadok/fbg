/**
 * Clase que nos genera objetos del tipo ataque.
 */
function Ataque(cantidadDeGolpes, iniciativa, habilidadDeArmas, fuerza){
	var objetivo = "";
	var tropa = "";
	
	this.setTropa = function(nuevaTropa){
		tropa = nuevaTropa;
	};
	
	this.setObjetivo = function(nuevoObjetivo){
		objetivo = nuevoObjetivo;
	};
	
	
	this.a = function(){
		return cantidadDeGolpes;
	};
	
	this.i = function(){
		return iniciativa;
	};
	
	this.ha = function(){
		return habilidadDeArmas;
	};
	
	this.f = function(){
		return fuerza;
	};
	
	this.getObjetivo = function(){
		return objetivo;
	};
	
	this.getTropa = function(){
		return tropa
	};
};