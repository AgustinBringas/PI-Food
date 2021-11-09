import "@testing-library/jest-dom/extend-expect";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import React from "react";
import ReactDOM from 'react-dom';
import { mount, configure} from 'enzyme';
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Recipe from "./components/recipe.jsx";
import LandingPage from "./components/landingPage.jsx";
import App from './App';
import Home from "./components/home.jsx";
import RecipeDetail from "./components/recipeDetail.jsx";
import RecipeCreate from "./components/recipeCreate.jsx";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import reducer from "./store/reducer/index.js";
import thunk from 'redux-thunk'

configure({ adapter: new Adapter() })
const store = createStore(reducer, applyMiddleware(thunk))

const recipe = {
  name: "Test Recipe",
  healthScore: 92, 
  id: 1
}
describe('Paths', () => {
  it('Un path equivocado no deberia mostrar ningun componente', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/random' ]}>
        <App/>
      </MemoryRouter>
    );
    expect(wrapper.find(LandingPage)).toHaveLength(0)
    expect(wrapper.find(Home)).toHaveLength(0);
    expect(wrapper.find(RecipeDetail)).toHaveLength(0)
    expect(wrapper.find(RecipeCreate)).toHaveLength(0)
  })
  it('La ruta /home deberia renderizar el home', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/home' ]}>
          <App/>
        </MemoryRouter>

      </Provider>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
  })
  it('La ruta / deberia renderizar la landing page', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/' ]}>
          <App/>
        </MemoryRouter>

      </Provider>
    );
    expect(wrapper.find(LandingPage)).toHaveLength(1);
  })
  it('La ruta /create-recipe deberia renderizar el form', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/create-recipe' ]}>
          <App/>
        </MemoryRouter>

      </Provider>
    );
    expect(wrapper.find(RecipeCreate)).toHaveLength(1);
  })

});

describe("<Recipe/>", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Recipe recipe={recipe} />
      </MemoryRouter>
    );
  });

  it("Muestra el nombre", () => {
    screen.getByText("TEST RECIPE");
  });
  it("Debe renderizar un <img>", () => {
    screen.getByAltText("Image not found");

  });
  it('Muestra el puntaje correctamente', () => {
    screen.queryByText('92')
  })
});
describe("<LandingPage/>", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <LandingPage/>
      </MemoryRouter>
    );
  });

  it("Tiene un boton con el texto correspondiente", () => {
    screen.getByText("find your recipe");
  });
});
