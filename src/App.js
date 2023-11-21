import logo from './logo.svg';
import './App.css';
import MyForm from './Form';

function App() {
  return (
    <div className="App">
      <div className='d-flex' style={{ justifyContent:"space-around"}}>
      <button className='btn btn-primary' type='button'>
        Form
      </button>
      <button className='btn btn-primary' type='button'>
      View
      </button>
      </div>
      <MyForm/>
    </div>
  );
}

export default App;
