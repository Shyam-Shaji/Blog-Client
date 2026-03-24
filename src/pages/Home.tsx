import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
        <Header/>
        <Hero/>
        <Footer/>
    </main>
  )
};

export default Home;
