import React, { Component } from "react";
import axios from "axios";

const TYPE_COLORS = {
  bug: "B1C12E",
  dark: "4F3A2D",
  dragon: "755EDF",
  electric: "FCBC17",
  fairy: "F4B1F4",
  fighting: "C03028",
  fire: "E73B0C",
  flying: "A3B3F7",
  ghost: "6060B2",
  grass: "74C236",
  ground: "D3B357",
  ice: "A3E7FD",
  normal: "C8C4BC",
  poison: "934594",
  psychic: "ED4882",
  rock: "B9A156",
  steel: "B5B5C3",
  water: "3295F6",
};

export default class Pokemon extends Component {
  state = {
    name: "",
    pokemonIndex: "",
    imageUrl: "",
    types: [],
    description: "",
    stats: {
      hp: "",
      attack: "",
      defense: "",
      speed: "",
      specialAttack: "",
      specialDefence: "",
    },
    height: "",
    weight: "",
    abilities: "",
    eggGroup: "",
    genderRatioMale: "",
    genderRatioFemale: "",
    evs: "",
    hatchSteps: "",
    firstEvolutionImageUrl: "",
    firstEvolutionIndex: "",
    firstEvolutionName: "",
    secondEvolutionImageUrl: "",
    secondEvolutionIndex: "",
    secondEvolutionName: "",
    thirdEvolutionImageUrl: "",
    thirdEvolutionIndex: "",
    thirdEvolutionName: "",
  };
  async componentDidMount() {
    const { pokemonIndex } = this.props.match.params;
    //urls for pokemon information
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;
    const pokemonRes = await axios.get(pokemonUrl);
    const name = pokemonRes.data.name;
    const imageUrl = pokemonRes.data.sprites.front_default;
    /* for the gif
        var imageUrl;
        if (name === "nidoran-m" || name === "nidoran-f") {
            imageUrl = `https://projectpokemon.org/images/normal-sprite/${name.replace(
            "-",
            "_"
            )}.gif`;
        } else {
          imageUrl = `https://projectpokemon.org/images/normal-sprite/${name}.gif`;
        }
        */
    let { hp, attack, defense, speed, specialAttack, specialDefence } = "";
    pokemonRes.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case "hp":
          hp = stat["base_stat"];
          break;
        case "attack":
          attack = stat["base_stat"];
          break;
        case "defense":
          defense = stat["base_stat"];
          break;
        case "speed":
          speed = stat["base_stat"];
          break;
        case "special-attack":
          specialAttack = stat["base_stat"];
          break;
        case "special-defense":
          specialDefence = stat["base_stat"];
          break;
        default:
          break;
      }
    });
    const height = pokemonRes.data.height / 10;
    const weight = pokemonRes.data.weight / 10;
    const types = pokemonRes.data.types.map((t) => t.type.name);
    const abilities = pokemonRes.data.abilities
      .map((a) => a.ability.name)
      .join(", ");

    const evs = pokemonRes.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        }
        return false;
      })
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name}`;
      })
      .join(", ");

    await axios
      .get(pokemonSpeciesUrl)
      .then((res) => {
        let description = "";
        res.data.flavor_text_entries.some((flavor) => {
          if (flavor.language.name === "en") {
            description = flavor.flavor_text;
            return;
          }
        });
        const femaleRate = res.data["gender_rate"];
        const genderRatioFemale = 12.5 * femaleRate;
        const genderRatioMale = 100 - genderRatioFemale;

        const catchRate = Math.round((100 / 255) * res.data["capture_rate"]);

        const eggGroups = res.data["egg_groups"]
          .map((group) => {
            return group.name;
          })
          .join(", ");

        const hatchSteps = 255 * (res.data["hatch_counter"] + 1);

        this.setState({
          description,
          genderRatioFemale,
          genderRatioMale,
          catchRate,
          eggGroups,
          hatchSteps,
        });

        const evolutionChainUrl = res.data.evolution_chain.url;

        axios.get(evolutionChainUrl).then((response) => {
          try {
            const secondEvolutionUrl = response.data.chain.evolves_to[0].species
              ? response.data.chain.evolves_to[0].species.url
              : null;
            if (secondEvolutionUrl) {
              const secondEvolutionName =
                response.data.chain.evolves_to[0].species.name;
              const secondEvolutionIndex = secondEvolutionUrl.split("/")[
                secondEvolutionUrl.split("/").length - 2
              ];
              let secondEvolutionPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${secondEvolutionIndex}/`;
              axios.get(secondEvolutionPokemonUrl).then((response) => {
                let secondEvolutionImageUrl =
                  response.data.sprites.front_default;
                this.setState({
                  secondEvolutionImageUrl,
                  secondEvolutionIndex,
                  secondEvolutionName,
                });
              });
            }
          } catch {
            let secondEvolutionImageUrl = "";
            this.setState({ secondEvolutionImageUrl });
          }
        });

        axios.get(evolutionChainUrl).then((response) => {
          try {
            const thirdEvolutionUrl = response.data.chain.evolves_to[0]
              .evolves_to[0].species
              ? response.data.chain.evolves_to[0].evolves_to[0].species.url
              : null;
            if (thirdEvolutionUrl) {
              const thirdEvolutionName =
                response.data.chain.evolves_to[0].evolves_to[0].species.name;
              const thirdEvolutionIndex = thirdEvolutionUrl.split("/")[
                thirdEvolutionUrl.split("/").length - 2
              ];
              let thirdEvolutionPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${thirdEvolutionIndex}/`;
              axios.get(thirdEvolutionPokemonUrl).then((response) => {
                let thirdEvolutionImageUrl =
                  response.data.sprites.front_default;
                this.setState({
                  thirdEvolutionImageUrl,
                  thirdEvolutionName,
                  thirdEvolutionIndex,
                });
              });
            }
          } catch {
            let secondEvolutionImageUrl = "";
            this.setState({ secondEvolutionImageUrl });
          }
        });

        return axios.get(evolutionChainUrl);
      })
      .then((response) => {
        const speciesUrl = response.data.chain.species.url;
        const firstEvolutionName = response.data.chain.species.name;
        const firstEvolutionIndex = speciesUrl.split("/")[
          speciesUrl.split("/").length - 2
        ];
        this.setState({ firstEvolutionIndex, firstEvolutionName });
        let firstEvolutionUrl = `https://pokeapi.co/api/v2/pokemon/${firstEvolutionIndex}/`;
        return axios.get(firstEvolutionUrl);
      })
      .then((response) => {
        const firstEvolutionImageUrl = response.data.sprites.front_default;
        this.setState({ firstEvolutionImageUrl });
      });

    this.setState({
      imageUrl,
      pokemonIndex,
      name,
      types,
      stats: {
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefence,
      },
      height,
      weight,
      abilities,
      evs,
    });
  }

  render() {
    return (
      <div className="col">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-5">
                <h4
                  className="text-capitalize"
                  style={{
                    color: `#${TYPE_COLORS[this.state.types[0]]}`,
                  }}
                >
                  {this.state.name}
                </h4>
              </div>
              <div className="col-7">
                <div className="float-right">
                  {this.state.types.map((type) => (
                    <span
                      key={type}
                      className="text-capitalize badge badge-primary badge-pill mr-1"
                      style={{
                        backgroundColor: `#${TYPE_COLORS[type]}`,
                        color: "white",
                      }}
                    >
                      {" "}
                      {type}{" "}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3">
                <img
                  className="card-img-top rounded mx-auto mt-2"
                  src={this.state.imageUrl}
                  alt={this.state.name}
                />
              </div>
              <div className="col-md-9">
                <h4 className="mx-auto text-capitalize"> {this.state.name}</h4>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">HP</div>
                  <div className="col-12 col-md-9">
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressBar"
                        style={{
                          width: `${this.state.stats.hp}%`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{this.state.stats.hp}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Speed</div>
                  <div className="col-12 col-md-9">
                    <div className="progress">
                      <div
                        className="progress-bar bg-warning"
                        role="progressBar"
                        style={{
                          width: `${this.state.stats.speed}%`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{this.state.stats.speed}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Attack</div>
                  <div className="col-12 col-md-9">
                    <div className="progress">
                      <div
                        className="progress-bar bg-info"
                        role="progressBar"
                        style={{
                          width: `${this.state.stats.attack}%`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{this.state.stats.attack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Defense</div>
                  <div className="col-12 col-md-9">
                    <div className="progress">
                      <div
                        className="progress-bar bg-danger"
                        role="progressBar"
                        style={{
                          width: `${this.state.stats.defense}%`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{this.state.stats.defense}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Special Attack</div>
                  <div className="col-12 col-md-9">
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped bg-info"
                        role="progressBar"
                        style={{
                          width: `${this.state.stats.specialAttack}%`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{this.state.stats.specialAttack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Special Defence</div>
                  <div className="col-12 col-md-9">
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped bg-danger"
                        role="progressBar"
                        style={{
                          width: `${this.state.stats.specialDefence}%`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{this.state.stats.specialDefence}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col">
                  <p className="p-2">{this.state.description}</p>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="card-body">
            <div className="card-title text-center">
              <h4>Profile</h4>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="float-right">Height:</h6>
                  </div>
                  <div className="col-md-6">
                    <h6 className="float-left">{this.state.height} m</h6>
                  </div>
                  <div className="col-md-6">
                    <h6 className="float-right">Weight:</h6>
                  </div>
                  <div className="col-md-6">
                    <h6 className="float-left">{this.state.weight} kg</h6>
                  </div>
                  <div className="col-md-6">
                    <h6 className="float-right">Catch Rate:</h6>
                  </div>
                  <div className="col-md-6">
                    <h6 className="float-left">{this.state.catchRate}%</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Gender Ratio:</h6>
                  </div>
                  <div className="col-md-6">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${this.state.genderRatioFemale}%`,
                          backgroundColor: "#c2185b",
                        }}
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{this.state.genderRatioFemale}</small>
                      </div>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${this.state.genderRatioMale}%`,
                          backgroundColor: "#1976d2",
                        }}
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{this.state.genderRatioMale}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-right">Egg Groups:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{this.state.eggGroups} </h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Hatch Steps:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{this.state.hatchSteps}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Abilities:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{this.state.abilities}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">EVs:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{this.state.evs}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="card-body">
            <div className="card-title text-center">
              <h4>Evolution Chain</h4>
            </div>
            <div className="row">
              <div className="col-md-4">
                <figure>
                  <img
                    className="card-img-top rounded mx-auto mt-2"
                    src={this.state.firstEvolutionImageUrl}
                  />
                  <figcaption className="text-align-center">
                    {this.state.firstEvolutionName}
                  </figcaption>
                </figure>
              </div>
              <div className="col-md-4">
                <figure>
                  <img
                    className="card-img-top rounded mx-auto mt-2"
                    src={this.state.secondEvolutionImageUrl}
                  />
                  <figcaption className="text-align-center">
                    {this.state.secondEvolutionName}
                  </figcaption>
                </figure>
              </div>
              <div className="col-md-4">
                <figure>
                  <img
                    className="card-img-top rounded mx-auto mt-2"
                    src={this.state.thirdEvolutionImageUrl}
                  />
                  <figcaption className="text-align-center">
                    {this.state.thirdEvolutionName}
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          <div className="card-footer text-muted mb-2">
            Data From{" "}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
            >
              PokeAPI.co
            </a>
          </div>
        </div>
      </div>
    );
  }
}
