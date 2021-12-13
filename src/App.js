import "./App.css";
import { Login } from "./components/form/index";
import { NativeBaseProvider } from "native-base";

function App() {
  return (
    <div className="App">
      <NativeBaseProvider>
        <Login />
      </NativeBaseProvider>
    </div>
  );
}

export default App;
