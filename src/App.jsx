import Menus from "./components/Menus";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="w-screen h-screen bg-primary_gray_bg relative flex">
      <div className="w-[250px] h-screen border-primary_white border-r-2 flex-shrink-0" />
      <div className="w-full">
        <Navbar />
      </div>
      <Menus />
    </div>
  );
}

export default App;
