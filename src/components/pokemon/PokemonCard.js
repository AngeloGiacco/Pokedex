import React, { Component } from "react";
import styled from "styled-components";
import spinner from "../layout/spinner.gif";

const Sprite = styled.img`
  width: 5em;
  height: 5em;
  display: none;
`;

export default class PokemonCard extends Component {
  state = {
    name: "",
    imageUrl: "",
    pokemonIndex: "",
    imageLoading: true,
    tooManyRequests: false,
  };

  componentDidMount() {
    const { name, url } = this.props;
    const pokemonIndex = url.split("/")[url.split("/").length - 2];
    const imageUrl =
      "https://github.com/PokeApi/sprites/blob/master/sprites/pokemon/" +
      pokemonIndex +
      ".png?raw=true";
    this.setState({ name, imageUrl, pokemonIndex });
  }
  render() {
    return (
      <div className="col-md-6 col-sm-6 mb-5">
        <div className="card">
          <h5 className="card-header">{this.state.pokemonIndex}</h5>
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
            style={
              this.state.tooManyRequests
                ? { display: "none" }
                : this.state.imageLoading
                ? null
                : { display: "block" }
            }
          ></Sprite>
          {this.state.tooManyRequests ? (
            <h6 className="mx-auto">
              <span className="badge badge-danger mt-2">Too many requests</span>
            </h6>
          ) : null}
          <div className="card-body mx-auto">
            <h6 className="card-title text-capitalize">{this.state.name}</h6>
          </div>
        </div>
      </div>
    );
  }
}
