import { Route, Switch } from "react-router-dom";
import  FeaturedProducts  from "../components/FeaturedProducts"
import  RegistrationForm  from "../components/RegistrationForm";
//import Store from '../pages/Home'; // Importe o componente Store corretamente

const AppRoutes: React.FC = () => {
    return (
        <Switch>
            <Route exact path='/' component={FeaturedProducts} />
            <Route exact path='/registrationForm' component={RegistrationForm} />
        </Switch>
    );
}

export default AppRoutes;
