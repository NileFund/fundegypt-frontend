import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

interface Props {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default PageWrapper;