import React, { Component } from 'react';
import styled from 'styled-components';
import axios from './config/axios.config';
import { CODESCOLORS } from './config/color.config';
import './App.css';
import PokeCard from './assets/components/PokeCard';
import imgSearch from './assets/images/search.png';
import Modal from 'react-modal';
Modal.setAppElement('#root');

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      myPokeDex: [],
      isLoad: false,
      modalIsOpen: false,
      searchName: '',
      searchType: '',
      searchLimit: 20,
      resultSearch: [],
      resultIsLoad: false
    };
  }

  APILoadPokeCard = async (params = null) => {
    let param = '';
    if (params !== null) {
      param += `?${params}`;
    }
    const result = await axios.get(`/cards${param}`);
    return result;
  }

  openPokeDex = () => {
    this.setState({
      modalIsOpen: true,
      searchName: '',
      searchType: '',
      resultSearch: [],
      resultIsLoad: false
    });
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      resultSearch: [],
      resultIsLoad: false
    });
  }

  handleSearchName = event => {
    this.setState({
      searchName: event.target.value
    })
  }
  handleSearchType = event => {
    this.setState({
      searchType: event.target.value
    })
  }

  findPokemon = async () => {
    let con = [];
    const {searchName, searchType, searchLimit} = this.state;
    if (searchLimit !== 0) {
      con.push(`limit=${searchLimit}`);
    }
    if (searchName !== '') {
      con.push(`name=${searchName}`);
    }
    if (searchType !== '') {
      con.push(`type=${searchType}`);
    }
    const params = con.join('&');
    const pokeList = await this.APILoadPokeCard(params);
    this.setState({
      resultSearch: pokeList?.data?.cards,
      resultIsLoad: true
    })
  }

  addToMyPokeDex = data => {
    this.setState({
      myPokeDex: [...this.state.myPokeDex, data],
      resultSearch: this.state.resultSearch.filter(result => result.id !== data.id)
    });
  };

  removeFromMyPokeDex = data => {
    this.setState(state => ({
      myPokeDex: state.myPokeDex.filter(selected => selected.id !== data.id)
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    const {searchName, searchType} = this.state;
    if ( (prevState.searchName !== searchName ) || (prevState.searchType !== searchType) ) {
      this.findPokemon();
    }
  }

  componentDidMount() {
    
  }
  render() {
    const { myPokeDex, modalIsOpen, searchName, searchType, resultSearch, resultIsLoad } = this.state;
    const Title = styled.div`
      text-align: center;
      font-size: 3rem;
    `;
    
    const Wrapper = styled.div`
      height: calc(768px - 176px);
      overflow-y: auto;
      display: flex;
      flex-flow: wrap;
      justify-content: space-around;
      padding: 10px;
      &:after {
        content: "";
        flex: 0 0 480px;
      }
    `;
    
    const BottomBar = styled.div`
      display: flex;
      height: 78px;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: ${CODESCOLORS.bottomBarBackground};
      box-shadow: 0 -1px 5px ${CODESCOLORS.bottomBarBoxShadow};
    `;
    const ButtonPokeDex = styled.button`
      border-radius: 50%;
      width: 100px;
      height: 100px;
      font-size: 4rem;
      position: absolute;
      top: -45%;
      left: 45%;
      background-color: ${CODESCOLORS.bottomBarBackground};
      box-shadow: 0 -1px 5px ${CODESCOLORS.bottomBarBackground};
      border: none;
      color: ${CODESCOLORS.bottomBarTextColor};
      cursor: pointer;
      outline: none;
      :hover{
        color: #000;
        background-color: #ffff;
        box-shadow: 0 -1px 5px ${CODESCOLORS.bottomBarBoxShadow};
      }
    `;
    const styleModal = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: CODESCOLORS.modalOutside
      },
      content: {
        position: 'absolute',
        top: '100px',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-51%, 0%)',
        background: CODESCOLORS.modalContentBackground,
        boxShadow: `0 -1px 5px ${CODESCOLORS.modalContentBoxShadow}`,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        width: '920px',
        height: '682px'
      }
    };
    const InputForm = styled.div`
      width: 100%;
    `;
    const Input = styled.input`
      width: 100%;
      padding-right: 40px;
      margin: 8px 0;
      box-sizing: border-box;
      font-family: Gaegu;
      border-color: ${CODESCOLORS.searchBoxBorder};
      background-image: url(${imgSearch});
      background-repeat: no-repeat;
      background-position: center right;
      background-size: 38px 38px;
      font-size: 2rem;
    `;
    const ModalBody = styled.div`
      height: 100%;
    `;
    const ResultWrapper = styled.div`
      height: calc(100% - 148px);
      overflow-y: auto;
    `;
    const NoResultMsg = styled.div`
      text-align: center;
      font-size: 2rem;
    `;
    return (
      <div className="App">
        <Title>My Pokedex</Title>
        <Wrapper>
          {myPokeDex.length !== 0 && myPokeDex.map( poke => {
            return <PokeCard key={poke.id} data={poke} remove={this.removeFromMyPokeDex} />;
          })}
        </Wrapper>
        <BottomBar>
          <ButtonPokeDex onClick={this.openPokeDex}>+</ButtonPokeDex>
        </BottomBar>
        
        <Modal 
          isOpen={modalIsOpen} 
          onRequestClose={this.closeModal} 
          style={styleModal}
        >
          <ModalBody>
            <InputForm>
              <Input type="text" name="searchName" placeholder="Find pokemon by name" value={searchName} onChange={(evt) => this.setState({searchName: evt.target.value})} />
            </InputForm>
            <InputForm>
              <Input type="text" name="searchType" placeholder="Find pokemon by type" value={searchType} onChange={(evt) => this.setState({searchType: evt.target.value})} />
            </InputForm>
            <ResultWrapper>
            {resultIsLoad && resultSearch.length !== 0 && resultSearch.map(res => {
              return <PokeCard key={res.id} data={res} add={this.addToMyPokeDex} />;
            })}
            {resultIsLoad && resultSearch.length === 0 && searchName !== '' && searchType !== '' && <NoResultMsg>- Not Found Pokemon -</NoResultMsg>}
            </ResultWrapper>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default App
