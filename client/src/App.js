import './App.css';
import { Route } from 'react-router';
import LandingPage from './components/landingPage';
import Home from './components/home';
import RecipeDetail from './components/recipeDetail';
import RecipeCreate from './components/recipeCreate';


function App() {
  return (
      <div className="App">
        <Route exact path="/" component={LandingPage}/>
        <Route exact path="/home" component={Home}/>
        <Route path="/recipe/:id" component={RecipeDetail}/>
        <Route path="/create-recipe" component={RecipeCreate}/>
      </div>
  );
}

export default App;
