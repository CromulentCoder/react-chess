import css from './App.module.css';
import ConnectBoard from './components/Board';
import ConnectedMovesHistory from './components/MovesHistory';
import ConnectedSettings from './components/Settings';

function App() {
    return ( 
        <div className = {css.container}>
            <ConnectedSettings />
            <ConnectBoard />
            <ConnectedMovesHistory />
        </div>
    );
}

export default App;