import Header from '@/components/header';
import Hero from '@/components/hero';
import ActionCards from '@/components/action-cards';
import MapComponent from '@/components/map';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <MapComponent />
      <ActionCards />
      <Footer />
    </>
  );
}
