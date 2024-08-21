import { Route, Routes } from "react-router-dom";
import Store from '../pages/Home'; // Importe o componente Store corretamente

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Store />} />
        </Routes>
    );
}

export default AppRoutes;
