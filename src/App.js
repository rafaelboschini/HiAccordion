import logo from './logo.svg';
import Nestedlist from './components/Nestedlist/Nestedlist';
import './App.css';

import data from './data/data.json';

function App() {
  return (
    <div className="App">
        {Object.values(data).map((value, index) => (
          <Nestedlist key={index} nodeItem={value} parentItem={data}></Nestedlist>
        ))}
    </div>
  );
}

export default App;
