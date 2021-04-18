import React, { Component } from 'react';
import styled from 'styled-components';
import imgHappiness from '../images/cute.png';
import { COLORS, CODESCOLORS } from '../../config/color.config';

export default class PokeCard extends Component {
  constructor(props){
    super(props);

  }

  calculateHP = (data) => {
    let heal = data.hp;
    if (data.hp >= 100) {
      heal = 100;
    } else {
      if (isNaN(heal)) {
        heal = 0;
      }
    }
    return heal;
  }

  calculateStrength = (data) => {
    if (data?.attacks === undefined) {
      return 0;
    } else {
      const len = data.attacks.length;
      const strength = len * 50;
      return (strength <= 100) ? strength : 0;
    }
  }

  calculateWeaknesses = (data) => {
    if (data?.weaknesses === undefined) {
      return 0;
    } else {
      const len = data.weaknesses.length;
      const weaknesses = len * 100;
      return (weaknesses <= 100) ? weaknesses : 0;
    }
  }

  calculateDamage = (data) => {
    let total = 0;
    if (data?.attacks) {
      data.attacks.map( (d) => {
        const damage = (d.damage !== "") ? parseInt(d.damage) : 0;
        total += damage;
      });
    }
    return total;
  }

  calculateHappiness = (heal, damage, weak) => {
    const calculate = (heal / 10 + damage / 10 + 10 - weak / 100) / 5;
    const happy = Math.round(calculate);
    let happiness = []
    for(let i = 0 ; i < happy; i++){
      happiness.push(i);
    }
    return happiness;
  }

  calculatePower = (data) => {
    const heal = this.calculateHP(data);
    const strength = this.calculateStrength(data);
    const weakness = this.calculateWeaknesses(data);
    const damage = this.calculateDamage(data);
    const happiness = this.calculateHappiness(heal, damage, weakness);
    return {heal, strength, weakness, happiness};
  }

  render() {
    const { data , add, remove } = this.props;
    const { heal, strength, weakness, happiness } = this.calculatePower(data);
    const Pokecard = styled.div`
    display: flex;
    height: 251px;
    flex: 0 0 450px;
    margin-bottom: 15px;
    background-color: ${CODESCOLORS.cardBackground};
    box-shadow: 1px 1px 1px 1px ${CODESCOLORS.cardBoxShadow};
    padding: .5rem 1rem;
    position: relative;
    :hover{
      box-shadow: 1px 1px 1px 1px ${CODESCOLORS.cardBoxShadowHover};
      button {
        display: block;
      }
    }
  `;
  const PokeRemove = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    > button {
        background: transparent;
        font-family: 'Atma';
        border: none;
        font-size: 2rem;
        color: ${COLORS.Fire};
        cursor: pointer;
        display: none;
        outline: none;
      }
  `;
  const PokeAdd = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  > button {
      background: transparent;
      font-family: 'Atma';
      border: none;
      font-size: 2rem;
      color: ${COLORS.Fire};
      cursor: pointer;
      display: none;
      outline: none;
    }
`;
  const PokeImage = styled.div`
    img {
      width: 180px;
    }
  `;
  const PokeInfo = styled.div`
    margin-left: 1rem;
    width: 100%;
  `;
  const PokeName = styled.div`
    font-size: 2rem;
    font-family: Gaegu;
  `
  const PokeStatInfo = styled.div`
    display:flex;
    width: 100%;
  `;
  const PokeStatTitle = styled.div`
    width: 30%;  
  `;
  const PokeStatPower = styled.div`
    width: 70%;
  `;
  const Progress = styled.progress`
    background-color: ${CODESCOLORS.levelTubeBackground};
    border-radius: 1rem;
    box-shadow: 1px 1px 4px ${CODESCOLORS.levelTubeBoxShadow};
    height: 1.5rem;
    ::-webkit-progress-bar {
      background-color: ${CODESCOLORS.levelTubeBackground};
      border-radius: 1rem;
    } 
    ::-webkit-progress-value {
      background-color: ${CODESCOLORS.levelTubeValueBackground};
      border-radius: 1rem;
    }
  `;
  const Happiness = styled.div`
    display: flex;
    flex-flow: row wrap;
    margin-top: 5px;
    img{
      width: 40px;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  `;
  const PokeType = styled.div`
    color: ${props => props.type || '#000'};
    font-family: Gaegu;
    font-size: 1.3rem;
    font-weight: bold;
  `;

    return (
      <>
        <Pokecard key={data.id}>
          <PokeImage>
            <img src={data.imageUrl} alt="My Pokemon profile" />
          </PokeImage>
          <PokeInfo>
            <PokeName>{data.name}</PokeName>
            <PokeStatInfo>
              <PokeStatTitle>HP</PokeStatTitle>
              <PokeStatPower>
                <Progress value={heal} max="100" min="0"></Progress>
              </PokeStatPower>
            </PokeStatInfo>
            <PokeStatInfo>
              <PokeStatTitle>STR</PokeStatTitle>
              <PokeStatPower>
                <Progress value={strength} max="100" min="0"></Progress>
              </PokeStatPower>
            </PokeStatInfo>
            <PokeStatInfo>
              <PokeStatTitle>WEAK</PokeStatTitle>
              <PokeStatPower>
                <Progress value={weakness} max="100" min="0"></Progress>
              </PokeStatPower>
            </PokeStatInfo>
            <PokeStatInfo>
              <PokeStatTitle>TYPE</PokeStatTitle>
              <PokeType type={COLORS[data.type]}>{data.type}</PokeType>
            </PokeStatInfo>
            <Happiness>
              {happiness.map(h => {
                return <img src={imgHappiness} alt="My Pokemon happiness level" />
              })}
            </Happiness>
          </PokeInfo>
          {remove && 
            <PokeRemove>
              <button type="button" onClick={() => remove(data)}>X</button>
            </PokeRemove>
          }
          {add && 
            <PokeAdd>
              <button type="button" onClick={() => add(data)}>add</button>
            </PokeAdd>
          }
        </Pokecard>
      </>
    )
  }
}
