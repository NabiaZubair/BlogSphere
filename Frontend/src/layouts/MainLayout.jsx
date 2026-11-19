
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";



const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-7xl mx-auto bg-white">
      <Navbar />
      <main className=" flex-1">
        {children}
      </main>
      <Footer />


    </div>
  )
}

export default MainLayout
