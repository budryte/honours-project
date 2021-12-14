import "./App.css";
import { SignInContainer } from "./containers";
import { NativeBaseProvider } from "native-base";

function App() {
  return (
    <div className="App">
      <NativeBaseProvider>
        <SignInContainer />
      </NativeBaseProvider>
    </div>
  );
}

export default App;
