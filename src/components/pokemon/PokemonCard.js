import React, { Component } from "react";
import styled from "styled-components";
import spinner from "../layout/spinner.gif";
import axios from "axios";
import { Link } from "react-router-dom";

const Sprite = styled.img`
  width: 5em;
  height: 5em;
  display: none;
`;

const Card = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 1.2), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  -moz-user-select: none;
  -website-user-select: none;
  user-slect: none;
  -o-user-select: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

export default class PokemonCard extends Component {
  state = {
    name: "",
    imageUrl: "",
    pokemonIndex: "",
    notGif: false,
    imageLoading: true,
    tooManyRequests: false,
  };

  async componentDidMount() {
    const { name, url } = this.props;
    const pokemonIndex = url.split("/")[url.split("/").length - 2];
    let imageUrl;
    let notGif = false;
    if (name === "nidoran-m" || name === "nidoran-f") {
      imageUrl = `https://projectpokemon.org/images/normal-sprite/${name.replace(
        "-",
        "_"
      )}.gif`;
    } else if (name === "deoxys-normal") {
      imageUrl = `https://projectpokemon.org/images/normal-sprite/deoxys.gif`;
    } else if (name === "ho-oh") {
      imageUrl = `https://projectpokemon.org/images/normal-sprite/ho-oh.gif`;
    } else if (pokemonIndex > 10000) {
      imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;
    } else if (name.includes("-")) {
      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
      const pokemonRes = await axios.get(pokemonUrl);
      imageUrl = pokemonRes.data.sprites.front_default;
      notGif = true;
    } else {
      imageUrl = `https://projectpokemon.org/images/normal-sprite/${name}.gif`;
    }

    this.setState({ name, imageUrl, pokemonIndex, notGif });
  }
  render() {
    return (
      <div className="col-md-6 col-sm-6 mb-5">
        <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
          <Card className="card">
            <h5 className="card-header">Pokemon #{this.state.pokemonIndex}</h5>
            {this.state.imageLoading ? (
              <img
                src={spinner}
                style={{ width: "5em", height: "5em" }}
                className="card-image-top rounded mx-auto d-block mt-2"
              />
            ) : null}
            <Sprite
              className="card-image-top rounded mx-auto d-block mt-2"
              onLoad={() => this.setState({ imageLoading: false })}
              onError={() => this.setState({ tooManyRequests: true })}
              src={this.state.imageUrl}
              alt={this.state.name}
              style={
                this.state.tooManyRequests
                  ? { display: "none" }
                  : this.state.imageLoading
                  ? null
                  : { display: "block" }
              }
            ></Sprite>
            {this.state.tooManyRequests && !this.state.notGif ? (
              <h6 className="mx-auto">
                <span className="badge badge-danger mt-2">
                  Too many requests
                </span>
              </h6>
            ) : null}
            <div className="card-body mx-auto">
              <h6 className="card-title text-capitalize">{this.state.name}</h6>
            </div>
          </Card>
        </StyledLink>
      </div>
    );
  }
}
