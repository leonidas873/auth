import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, setUserName } from "../../redux/slices/userSlice";

export default function Layout() {

  const {userName, isLoggedIn} = useAppSelector(state=> state.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setUserName(""));
  }

  return (
    <>
      <header className="bg-red-400 flex justify-between">
        <Navigation/>
        {isLoggedIn && <div className="flex items-center gap-3">
        <h5 className="italic">{userName}</h5>
        <button onClick={handleLogout} className="bg-red-700 text-white px-2 hover:opacity-60 mx-2">log out</button>
        </div>}
      </header>
      <main><Outlet/></main>
      <footer className="bg-gray-300">i am footer</footer>
    </>
  );
}
