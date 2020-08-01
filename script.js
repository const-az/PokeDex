$(document).ready(function(){
  typeSelect();
  pokemonAll();

  $('#type-list').change(function(){
    $('#carta').fadeOut();
    var value =(this).value;
    if (value==="all") {
      pokemonAll();
    } else {
      putType(value)
    }
  })
})

// VARIABLES COLORES

var colors={
  normal: "#deba77",
  fighting: "#c9a080",
  flying: "#ffe68b",
  poison: "#e7c8ec",
  ground: "#e5d4c5",
  rock: "#c1c1ba",
  bug: "#b4e653",
  ghost: "#d4abcc",
  steel: "#a7cbb5",
  fire: "#ffba7a",
  water: "#aee1e9",
  grass: "#99c745",
  electric: "#f6dd49",
  psychic: "#f76a70",
  ice: "#c1dfff",
  dragon: "#ffedbc",
  dark: "#d5d5de",
  fairy: "#ffd4be",
  unknown: "#ffdfde",
  shadow: "#cac9c9",
}

var iconos={
  normal: "fas fa-circle",
  fighting: "fas fa-mitten",
  flying: "fas fa-feather-alt",
  poison: "fas fa-skull",
  ground: "fas fa-dot-circle",
  rock: "fas fa-gem",
  bug: "fas fa-bug",
  ghost: "fas fa-ghost",
  steel: "fas fa-wrench",
  fire: "fas fa-burn",
  water: "fas fa-tint",
  grass: "fas fa-leaf",
  electric: "fas fa-bolt",
  psychic: "fas fa-brain",
  ice: "fas fa-icicles",
  dragon: "fas fa-dragon",
  dark: "fas fa-moon",
  fairy: "fas fa-star-and-crescent",
  unknown: "fas fa-question",
  shadow: "fas fa-adjust",
}

// PARA CREAR SELECT CON TIPOS
function typeSelect(){
  $.get("https://pokeapi.co/api/v2/type/", function(data){
    console.log(data)
    let option = "";
    let type = data.results;

    type.forEach(t =>{
      var newOption = document.createElement('option');
      newOption.value = t.name;
      newOption.innerHTML = t.name.charAt(0).toUpperCase() + t.name.substring(1).toLowerCase();
      if (newOption.value != "dark" && newOption.value != "unknown" && newOption.value != "shadow" ) {
        $('#type-list')[0].options.add(newOption);
      }

    })

    $('#type-list').formSelect();
  })
}

function putType(type){
  $.get("https://pokeapi.co/api/v2/type/"+type, function(data){

  var pokemonTypes =[];

  data.pokemon.forEach(p => {
    $.get("https://pokeapi.co/api/v2/pokemon/"+p.pokemon.name, function(data){

      if (data.id<=151) {
        pokemonTypes.push({
          entry_number: data.id,
          pokemon_species: {
            name: data.name
          }
        })
      }

      imprimirTodos(pokemonTypes);

    });
  });
  })
}

function pokemonAll(){
  $.get("https://pokeapi.co/api/v2/pokedex/2", function(data){
  let pokemon = data.pokemon_entries;
  let card = "";
  imprimirTodos(pokemon);
  })
}

// IMPRIMIR POKEMONES EN PANTALLA
function imprimirTodos(pokemon) {
  $("#poner-cartas")[0].innerHTML ="";
  pokemon.forEach(p => {
    card =
          "<div class='col s1 min-carta-pokemon' id='min-carta-"+p.entry_number+"'>"+
            "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+p.entry_number+".png' onclick='clickPokemon("+p.entry_number+")'>"+
            "<p id='min-carta-name'>"+p.pokemon_species.name.charAt(0).toUpperCase() + p.pokemon_species.name.substring(1).toLowerCase()+"</p>"+
          "</div>";

  $("#poner-cartas")[0].innerHTML += card;
    });
}

// FUNCIÓN PARA EL SEARCH
function searchPokemon() {
  var id = $("#searchPokemon")[0].value;
  if (id !== undefined && id!=="") {
    imprimirPorId(id);
  } else {
    $("#searchPokemon")[0].value= ""
    pokemonAll();
    $('#carta').fadeOut();
  }
}
// FUNCIÓN PARA CERRAR LA CARD GRANDE
function cerrarCard() {
  $('#carta').fadeOut();
}

// FUNCIÓN PARA IMPRIMIR EL SEARCH
function imprimirPorId(id) {
  let card = "";
  $.get("https://pokeapi.co/api/v2/pokemon/" + id, data => {
    $("#unPokemon")[0].innerHTML ="";

    card =
          "<div class='row' id='carta'>"+
            "<button id='button-cerrar' onclick='cerrarCard()'><i class='fas fa-times'></i></button>"+
            "<div class='col s3' id='carta-img'>"+
              "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png'>"+
            "</div>"+

            "<div class='col s4' id='carta-datos'>"+
              "<h3 id='carta-nombre'>"+data.name.charAt(0).toUpperCase() + data.name.substring(1).toLowerCase()+"</h3>"+
              "<h5 id='carta-tipo'><i class='"+iconos[data.types[0].type.name]+"' style='color:"+colors[data.types[0].type.name]+"; margin-right: 10px;'></i>"+data.types[0].type.name+"</h5>"+
              "<div class='row' id='carta-datos'>"+
                "<div class='col s4' id='carta-order'>"+
                  "<p>ORDER</p>"+
                  "<h6>"+data.id+"</h6>"+
                "</div>"+
                "<div class='col s4' id='carta-weight'>"+
                  "<p>HEIGHT</p>"+
                  "<h6>"+data.height+"</h6>"+
                "</div>"+
                "<div class='col s4' id='carta-height'>"+
                  "<p>WEIGHT</p>"+
                  "<h6>"+data.weight+"</h6>"+
                "</div>"+
              "</div>"+
            "</div>"+

            "<div class='col s5' id='carta-graph'>"+
              "<div id='chartContainer' style='height: 230px; width: 100%;'></div>"+
            "</div>"+
          "</div>";

    var datosGraph=[];
    let objeto={};
    var color=colors[data.types[0].type.name]

    for(let i=0; i<data.stats.length; i++){
      objeto.y=data.stats[i].base_stat;
      objeto.label=data.stats[i].stat.name.toUpperCase();
      datosGraph.push(objeto);
      objeto={};
    }

    $("#unPokemon")[0].innerHTML = card;
    graphPokemon(datosGraph,color)
    $('#carta').hide();
    $('#carta').fadeIn();
  });
  $("#searchPokemon")[0].value= ""
}

// CLICKEAR POKEMON
function clickPokemon(id){
  imprimirPorId(id);
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// GRAFICO
function graphPokemon(datosGraph,color) {

var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	data: [{
		type: "bar",
		showInLegend: false,
		name: "Gold",
		color: color,
		dataPoints: datosGraph
	}
]
});

chart.render();

function toolTipFormatter(e) {
	var str = "";
	var total = 0 ;
	var str3;
	var str2 ;
	for (var i = 0; i < e.entries.length; i++){
		var str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ;
		total = e.entries[i].dataPoint.y + total;
		str = str.concat(str1);
	}
	str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
	str3 = "<span style = \"color:Tomato\">Total: </span><strong>" + total + "</strong><br/>";
	return (str2.concat(str)).concat(str3);
}

function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	chart.render();
}

}
