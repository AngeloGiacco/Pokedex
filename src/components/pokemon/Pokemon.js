import React, { Component } from "react";
import axios from "axios";
export default class Pokemon extends Component {
    state={
        name: '',
        pokemonIndex: '',
        imageUrl:'',
        types : [],
        description : '',
        stats : {
            hp : '',
            attack : '',
            defense:'',
            speed:'',
            specialAttack:'',
            specialDefence:''
        },
        height: '',
        weight:'',
        abilities:'',
        eggGroup:'',
        genderRatioMale:'',
        genderRatioFemale:'',
        evs: '',
        hatchSteps:'',
    }
    async componentDidMount(){
        const {pokemonIndex} = this.props.match.params;
        //urls for pokemon information
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;
        const pokemonRes = await axios.get(pokemonUrl);
        const name = pokemonRes.data.name; 
        var imageUrl;
        if (name === "nidoran-m" || name === "nidoran-f") {
          imageUrl = `https://projectpokemon.org/images/normal-sprite/${name.replace(
          "-",
          "_"
          )}.gif`;
        } else {
          imageUrl = `https://projectpokemon.org/images/normal-sprite/${name}.gif`;
        }
        let {hp, attack, defense, speed, specialAttack, specialDefence} = "";

        this.setState({name,imageUrl});
    }
  render() {
    return <div><h1 className = "text-capitalize">{this.state.name}</h1></div>;
  }
}
